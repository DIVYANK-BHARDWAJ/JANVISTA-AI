import React, { useMemo, useState, useEffect } from "react";
import { Landmark, MapPin, KeyRound, ShieldCheck, ArrowLeft, Lock, RotateCcw, Eye, EyeOff } from "lucide-react";
import { INDIA_STATES } from "@/lib/data/india-states";
import { OfficerJurisdiction, UserRole } from "@/types";
import { GoogleFirestoreDatabaseService } from "@/lib/db/firestore";

interface OfficerLoginProps {
  /** Which official role is being authenticated. */
  role: Extract<UserRole, "STATE_PLANNER" | "DISTRICT_COLLECTOR">;
  onSuccess: (jurisdiction: OfficerJurisdiction) => void;
  onCancel: () => void;
}

/** Firestore key an officer's self-set password is stored under. */
function storageKey(role: string, stateCode: string, district?: string) {
  return `janvista_officer_pw::${role}::${stateCode}${district ? `::${district}` : ""}`;
}

/**
 * OfficerLogin
 * Login gate shown whenever the role switcher is set to "State Planner" or "District Collector".
 * Stores officer credentials in Google Cloud Firestore database ('user_credentials' collection).
 */
export const OfficerLogin: React.FC<OfficerLoginProps> = ({ role, onSuccess, onCancel }) => {
  const isCollector = role === "DISTRICT_COLLECTOR";
  const roleLabel = isCollector ? "District Collector" : "State Planner";

  const [step, setStep] = useState<"select" | "password">("select");
  const [stateName, setStateName] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const [hasExistingPassword, setHasExistingPassword] = useState<boolean>(false);
  const [storedPasswordHash, setStoredPasswordHash] = useState<string | null>(null);

  const selectedState = useMemo(() => INDIA_STATES.find((s) => s.name === stateName), [stateName]);

  const canProceedToPassword = isCollector ? Boolean(stateName && district) : Boolean(stateName);

  const handleContinue = async () => {
    setError("");
    if (!canProceedToPassword) {
      setError(isCollector ? "Please select both State and District to continue." : "Please select a State to continue.");
      return;
    }
    if (selectedState) {
      const key = storageKey(role, selectedState.code, isCollector ? district : undefined);
      const cred = await GoogleFirestoreDatabaseService.getUserCredential(key);
      if (cred && cred.passwordHash) {
        setHasExistingPassword(true);
        setStoredPasswordHash(cred.passwordHash);
      } else {
        setHasExistingPassword(false);
        setStoredPasswordHash(null);
      }
    }
    setStep("password");
  };

  const handleSubmitPassword = async () => {
    if (!selectedState) return;
    const key = storageKey(role, selectedState.code, isCollector ? district : undefined);

    if (hasExistingPassword) {
      if (password.length === 0) {
        setError("Please enter your password.");
        return;
      }
      if (storedPasswordHash && storedPasswordHash !== btoa(password)) {
        setError("Incorrect password. Please try again, or reset access below.");
        return;
      }
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const hash = btoa(password);
      await GoogleFirestoreDatabaseService.saveUserCredential({
        id: key,
        role,
        jurisdictionKey: key,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(key, hash);
    }

    const displayName = isCollector
      ? `District Collector – ${district}, ${selectedState.name}`
      : `State Planner – ${selectedState.name}`;

    onSuccess({
      state: selectedState.name,
      stateCode: selectedState.code,
      district: isCollector ? district : undefined,
      displayName,
    });
  };

  const handleResetPassword = async () => {
    if (!selectedState) return;
    const key = storageKey(role, selectedState.code, isCollector ? district : undefined);
    localStorage.removeItem(key);
    await GoogleFirestoreDatabaseService.saveUserCredential({
      id: key,
      role,
      jurisdictionKey: key,
      passwordHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setHasExistingPassword(false);
    setStoredPasswordHash(null);
    setPassword("");
    setConfirmPassword("");
    setError("Access reset in Google Firestore. Please set a new password to continue.");
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Official Top Bar - matches Portal Gateway styling */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-3.5 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white">JANVISTA AI</h1>
              <p className="text-[11px] text-slate-300 font-medium">Official Jurisdiction Login</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government of India</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white border-2 border-slate-300 rounded-xl shadow-sm w-full max-w-md p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 text-center">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider inline-block">
              {roleLabel} Access
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {step === "select" ? "Select Your Jurisdiction" : hasExistingPassword ? "Enter Your Password" : "Set Your Password"}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {step === "select"
                ? isCollector
                  ? "Choose the State and District you administer."
                  : "Choose the State / UT you plan for."
                : hasExistingPassword
                ? `Welcome back. Sign in to continue as ${roleLabel} for ${isCollector ? `${district}, ` : ""}${stateName}.`
                : `This is your first login for ${isCollector ? `${district}, ` : ""}${stateName}. Set a password to secure this jurisdiction.`}
            </p>
          </div>

          {step === "select" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">State / UT</label>
                <select
                  value={stateName}
                  onChange={(e) => {
                    setStateName(e.target.value);
                    setDistrict("");
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-sm font-semibold text-slate-800 p-2.5 focus:ring-1 focus:ring-slate-800"
                >
                  <option value="">— Select State / UT —</option>
                  {INDIA_STATES.filter((s) => !s.isUT).map((s) => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                  <optgroup label="Union Territories">
                    {INDIA_STATES.filter((s) => s.isUT).map((s) => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {isCollector && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!selectedState}
                    className="w-full bg-slate-50 border border-slate-300 rounded text-sm font-semibold text-slate-800 p-2.5 focus:ring-1 focus:ring-slate-800 disabled:opacity-50"
                  >
                    <option value="">{selectedState ? "— Select District —" : "Select a State first"}</option>
                    {selectedState?.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

              <button
                onClick={handleContinue}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <MapPin className="w-4 h-4" />
              </button>

              <button
                onClick={onCancel}
                className="w-full text-slate-600 hover:text-slate-900 font-semibold text-xs py-2 flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to role selection</span>
              </button>
            </div>
          )}

          {step === "password" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{isCollector ? `${district}, ${stateName}` : stateName}</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {hasExistingPassword ? "Password" : "New Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={hasExistingPassword ? "Enter your password" : "Create a password (min. 6 characters)"}
                    className="w-full bg-slate-50 border border-slate-300 rounded text-sm font-medium text-slate-800 pl-9 pr-10 py-2.5 focus:ring-1 focus:ring-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!hasExistingPassword && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-50 border border-slate-300 rounded text-sm font-medium text-slate-800 pl-9 pr-10 py-2.5 focus:ring-1 focus:ring-slate-800"
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

              <button
                onClick={handleSubmitPassword}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{hasExistingPassword ? "Login" : "Set Password & Continue"}</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => { setStep("select"); setError(""); setPassword(""); setConfirmPassword(""); }}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change jurisdiction</span>
                </button>

                {hasExistingPassword && (
                  <button
                    onClick={handleResetPassword}
                    className="text-slate-500 hover:text-red-600 font-semibold text-xs flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset password</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-3 text-xs text-slate-600 font-medium">
        JANVISTA AI • Demo jurisdiction login — passwords are stored locally in this browser for reference purposes only.
      </footer>
    </div>
  );
};
