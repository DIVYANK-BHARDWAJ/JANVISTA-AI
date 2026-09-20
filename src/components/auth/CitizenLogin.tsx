import React, { useState, useEffect } from "react";
import { Landmark, User, KeyRound, ShieldCheck, ArrowLeft, Lock, RotateCcw, Eye, EyeOff } from "lucide-react";
import { GoogleFirestoreDatabaseService } from "@/lib/db/firestore";

interface CitizenLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CITIZEN_STORAGE_KEY = "janvista_citizen_access_pw";

/**
 * CitizenLogin Component
 * Password protection gate for Citizen Portal access.
 * Stores citizen credentials in Google Cloud Firestore database ('user_credentials' collection).
 */
export const CitizenLogin: React.FC<CitizenLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasExistingPassword, setHasExistingPassword] = useState<boolean>(false);
  const [storedPasswordHash, setStoredPasswordHash] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    GoogleFirestoreDatabaseService.getUserCredential("citizen").then((cred) => {
      if (mounted && cred && cred.passwordHash) {
        setHasExistingPassword(true);
        setStoredPasswordHash(cred.passwordHash);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (hasExistingPassword) {
      if (!password) {
        setError("Please enter your Citizen Access Password.");
        return;
      }
      if (storedPasswordHash && storedPasswordHash !== btoa(password)) {
        setError("Incorrect Citizen Password. Please try again or reset access below.");
        return;
      }
    } else {
      if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const hash = btoa(password);
      await GoogleFirestoreDatabaseService.saveUserCredential({
        id: "citizen",
        role: "CITIZEN",
        jurisdictionKey: "citizen",
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(CITIZEN_STORAGE_KEY, hash);
    }

    onSuccess();
  };

  const handleReset = async () => {
    localStorage.removeItem(CITIZEN_STORAGE_KEY);
    await GoogleFirestoreDatabaseService.saveUserCredential({
      id: "citizen",
      role: "CITIZEN",
      jurisdictionKey: "citizen",
      passwordHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setHasExistingPassword(false);
    setStoredPasswordHash(null);
    setPassword("");
    setConfirmPassword("");
    setError("Access reset in Google Firestore. Please set a new Citizen Access Password to continue.");
  };

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <header className="bg-slate-900 text-white border-b border-slate-800 py-3.5 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white">JANVISTA AI</h1>
              <p className="text-[11px] text-slate-300 font-medium">Citizen Portal Access Security</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government Digital Public Infrastructure</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white border-2 border-slate-300 rounded-xl shadow-sm w-full max-w-md p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-amber-700" />
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider inline-block">
              Citizen Access Gate
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {hasExistingPassword ? "Enter Citizen Password" : "Set Citizen Access Password"}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {hasExistingPassword
                ? "Enter your Citizen Access Password to log into the Public Grievance Portal."
                : "Create a password to secure your citizen grievance submissions and track resolution status."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {hasExistingPassword ? "Citizen Password" : "Create Password (Min. 4 chars)"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={hasExistingPassword ? "Enter your password" : "e.g. 123456 or citizen2026"}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-sm font-medium text-slate-800 pl-9 pr-10 py-2.5 focus:ring-1 focus:ring-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
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
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{hasExistingPassword ? "Authenticate & Enter Portal" : "Set Password & Enter Portal"}</span>
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Gateway</span>
            </button>

            {hasExistingPassword && (
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-red-600 font-semibold text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Password</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-3 text-xs text-slate-600 font-medium">
        JANVISTA AI • Citizen Portal Protected Access
      </footer>
    </div>
  );
};
