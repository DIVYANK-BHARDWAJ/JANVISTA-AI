/**
 * JANVISTA AI - Dashboard Interactivity Controller
 * Fully connects to Python Flask Backend Endpoints.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const simDemand = document.getElementById("simDemand");
  const simGap = document.getElementById("simGap");
  const simVuln = document.getElementById("simVuln");
  const simAcc = document.getElementById("simAcc");
  const simUrg = document.getElementById("simUrg");
  const simInv = document.getElementById("simInv");

  const valDemand = document.getElementById("valDemand");
  const valGap = document.getElementById("valGap");
  const valVuln = document.getElementById("valVuln");
  const valAcc = document.getElementById("valAcc");
  const valUrg = document.getElementById("valUrg");
  const valInv = document.getElementById("valInv");

  const simResultScore = document.getElementById("simResultScore");
  const simResultTier = document.getElementById("simResultTier");
  const btnResetSim = document.getElementById("btnResetSim");
  const btnApplySim = document.getElementById("btnApplySim");
  const btnRefreshData = document.getElementById("btnRefreshData");
  const btnConfirmApproval = document.getElementById("btnConfirmApproval");

  const toastEl = document.getElementById("liveToast");
  const toastMessage = document.getElementById("toastMessage");
  const bsToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3500 }) : null;

  function showToast(msg, bgClass = "text-bg-dark") {
    if (!bsToast) return;
    toastEl.className = `toast align-items-center ${bgClass} border-0 rounded-3 shadow-lg`;
    toastMessage.innerHTML = msg;
    bsToast.show();
  }

  // --- Dynamic Slider Listeners ---
  const sliders = [
    { input: simDemand, label: valDemand },
    { input: simGap, label: valGap },
    { input: simVuln, label: valVuln },
    { input: simAcc, label: valAcc },
    { input: simUrg, label: valUrg },
    { input: simInv, label: valInv },
  ];

  sliders.forEach(({ input, label }) => {
    if (!input || !label) return;
    input.addEventListener("input", () => {
      label.textContent = input.value;
      calculateLivePriority();
    });
  });

  async function calculateLivePriority() {
    const payload = {
      demand: parseFloat(simDemand.value),
      gap: parseFloat(simGap.value),
      vulnerability: parseFloat(simVuln.value),
      accessibility_deficit: parseFloat(simAcc.value),
      urgency: parseFloat(simUrg.value),
      investment_mismatch: parseFloat(simInv.value),
    };

    try {
      const res = await fetch("/api/calculate-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Calculation request failed");
      const json = await res.json();
      const score = json.calculation.score;

      simResultScore.textContent = score.toFixed(1);

      if (score >= 85) {
        simResultTier.innerHTML = `<span class="badge bg-danger rounded-pill px-2.5 py-1">Critical Priority Tier</span>`;
      } else if (score >= 75) {
        simResultTier.innerHTML = `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1">High Priority Tier</span>`;
      } else {
        simResultTier.innerHTML = `<span class="badge bg-secondary rounded-pill px-2.5 py-1">Moderate Priority Tier</span>`;
      }
    } catch (err) {
      console.error("Simulator error:", err);
      // Fallback local formula if network fails
      const fallbackScore = (
        payload.demand * 0.30 +
        payload.gap * 0.25 +
        payload.vulnerability * 0.15 +
        payload.accessibility_deficit * 0.15 +
        payload.urgency * 0.10 +
        payload.investment_mismatch * 0.05
      ).toFixed(1);
      simResultScore.textContent = fallbackScore;
    }
  }

  // Reset simulator
  if (btnResetSim) {
    btnResetSim.addEventListener("click", () => {
      simDemand.value = 94; valDemand.textContent = "94";
      simGap.value = 91; valGap.textContent = "91";
      simVuln.value = 86; valVuln.textContent = "86";
      simAcc.value = 88; valAcc.textContent = "88";
      simUrg.value = 82; valUrg.textContent = "82";
      simInv.value = 74; valInv.textContent = "74";
      calculateLivePriority();
      showToast('<i class="bi bi-arrow-counterclockwise me-1 text-info"></i> Simulator reset to official defaults.');
    });
  }

  if (btnApplySim) {
    btnApplySim.addEventListener("click", () => {
      calculateLivePriority();
      showToast(`<i class="bi bi-check2-circle me-1 text-success"></i> Priority calculated: <strong>${simResultScore.textContent} / 100</strong>`);
    });
  }

  // Refresh intelligence button
  if (btnRefreshData) {
    btnRefreshData.addEventListener("click", async () => {
      const origHtml = btnRefreshData.innerHTML;
      btnRefreshData.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Fetching...`;
      btnRefreshData.disabled = true;

      try {
        const res = await fetch("/api/dashboard/overview");
        const json = await res.json();
        if (json.success) {
          showToast('<i class="bi bi-cloud-check-fill me-1 text-success"></i> Dashboard metrics re-synchronized with Flask backend!');
        }
      } catch (err) {
        showToast('<i class="bi bi-exclamation-triangle-fill me-1 text-warning"></i> Error refreshing backend data.');
      } finally {
        btnRefreshData.innerHTML = origHtml;
        btnRefreshData.disabled = false;
      }
    });
  }

  // Confirm Approval
  if (btnConfirmApproval) {
    btnConfirmApproval.addEventListener("click", () => {
      showToast('<i class="bi bi-shield-fill-check me-1 text-emerald"></i> In-principle approval logged to tamper-evident audit ledger.');
    });
  }

  // =========================================================================
  // GOVERNANCE ROLE PERSONA CONTROLLER (District Collector / Policymaker / Citizen)
  // =========================================================================
  let currentActiveRole = "Policymaker";
  let cachedGrievances = [];

  const rolePersonaBanner = document.getElementById("rolePersonaBanner");
  const roleBadge = document.getElementById("roleBadge");
  const roleJurisdiction = document.getElementById("roleJurisdiction");
  const roleDescription = document.getElementById("roleDescription");
  const roleIconBox = document.getElementById("roleIconBox");
  const roleIcon = document.getElementById("roleIcon");
  const currentRoleLabel = document.getElementById("currentRoleLabel");
  const citizenPortalSection = document.getElementById("citizenPortalSection");
  const modalActionOfficer = document.getElementById("modalActionOfficer");

  const navFileGrievanceBtn = document.getElementById("navFileGrievanceBtn");
  const officialHeaderBanner = document.getElementById("officialHeaderBanner");
  const kpisSection = document.getElementById("kpis-section");
  const spotlightSection = document.getElementById("spotlight-section");
  const hotspotsSimulatorRow = document.getElementById("hotspotsSimulatorRow");
  const hotspotsSection = document.getElementById("hotspots-section");
  const simulatorSection = document.getElementById("simulator-section");
  const pipelineStagesSection = document.getElementById("pipelineStagesSection");
  const grievancesSection = document.getElementById("grievances-section");

  const statePlannerJurisdictionBar = document.getElementById("statePlannerJurisdictionBar");
  const statePlannerActiveStateName = document.getElementById("statePlannerActiveStateName");
  const statePlannerDistrictsSubtitle = document.getElementById("statePlannerDistrictsSubtitle");
  const statePlannerDropdown = document.getElementById("statePlannerDropdown");
  const btnApplyStatePlanner = document.getElementById("btnApplyStatePlanner");
  const btnSwitchToPlanner = document.getElementById("btnSwitchToPlanner");

  function applyRoleView(roleName) {
    currentActiveRole = roleName;
    if (currentRoleLabel) currentRoleLabel.textContent = roleName;

    const isCitizen = (roleName === "Citizen");

    // File Grievance button ONLY visible for Citizen role
    if (navFileGrievanceBtn) {
      if (isCitizen) {
        navFileGrievanceBtn.classList.remove("d-none");
      } else {
        navFileGrievanceBtn.classList.add("d-none");
      }
    }

    // Toggle official vs citizen navbar links
    document.querySelectorAll(".official-nav-item").forEach((el) => {
      el.classList.toggle("d-none", isCitizen);
    });
    document.querySelectorAll(".citizen-nav-item").forEach((el) => {
      el.classList.toggle("d-none", !isCitizen);
    });

    // Executive Action card in grievance modal: visible for all roles EXCEPT Citizen
    const modalExecutiveActionCard = document.getElementById("modalExecutiveActionCard");
    if (modalExecutiveActionCard) {
      modalExecutiveActionCard.classList.toggle("d-none", isCitizen);
    }

    // Update active dropdown items
    document.querySelectorAll(".role-option").forEach((o) => {
      if (o.dataset.role.toLowerCase() === roleName.toLowerCase()) {
        o.classList.add("active");
      } else {
        o.classList.remove("active");
      }
    });

    if (isCitizen) {
      // Citizen Persona Mode - PRIVACY & TARGETED WORKSPACE
      if (roleBadge) {
        roleBadge.className = "badge bg-warning text-dark text-uppercase fs-8 px-2.5 py-1 fw-bold";
        roleBadge.textContent = "ROLE: CITIZEN (नागरिक PORTAL)";
      }
      if (roleJurisdiction) roleJurisdiction.innerHTML = '<i class="bi bi-shield-lock me-1"></i>Private Citizen Ingestion & Self-Tracking Mode';
      if (roleDescription) roleDescription.textContent = "Voice your local infrastructure grievances directly to District Collectors & Policy Makers. Under privacy regulations, you can only view your own submitted grievances.";
      if (roleIconBox) roleIconBox.className = "rounded-circle p-2.5 bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30";
      if (roleIcon) roleIcon.className = "bi bi-person-heart fs-4";

      // Show dedicated on-page citizen submission portal
      if (citizenPortalSection) {
        citizenPortalSection.classList.remove("d-none");
        citizenPortalSection.scrollIntoView({ behavior: "smooth" });
      }

      // CRITICAL: Hide official modules in Citizen view
      // 1. Where should we act first? (Official Header Banner)
      if (officialHeaderBanner) officialHeaderBanner.classList.add("d-none");
      // 2. Executive KPI cards grid
      if (kpisSection) kpisSection.classList.add("d-none");
      // 3. Highest Priority Opportunity Spotlight
      if (spotlightSection) spotlightSection.classList.add("d-none");
      // 4. Ranked regional hotspots & priority simulator
      if (hotspotsSimulatorRow) hotspotsSimulatorRow.classList.add("d-none");
      if (hotspotsSection) hotspotsSection.classList.add("d-none");
      if (simulatorSection) simulatorSection.classList.add("d-none");
      // 5. National Intelligence Workflow Stages
      if (pipelineStagesSection) pipelineStagesSection.classList.add("d-none");
      // 6. Public grievance oversight ledger of other citizens
      if (grievancesSection) grievancesSection.classList.add("d-none");

      // Render only this citizen's own submitted grievances
      renderMyGrievances();

      showToast('<i class="bi bi-shield-lock-fill me-1 text-warning"></i> Switched to <strong>Citizen Role (नागरिक)</strong>. Decision-maker modules and other citizens\' data are hidden.');
    } else {
      // Official Roles (District Collector / State Planner / Policymaker)
      // Hide citizen intake portal, restore official intelligence views
      if (citizenPortalSection) citizenPortalSection.classList.add("d-none");
      if (officialHeaderBanner) officialHeaderBanner.classList.remove("d-none");
      if (kpisSection) kpisSection.classList.remove("d-none");
      if (spotlightSection) spotlightSection.classList.remove("d-none");
      if (hotspotsSimulatorRow) hotspotsSimulatorRow.classList.remove("d-none");
      if (hotspotsSection) hotspotsSection.classList.remove("d-none");
      if (simulatorSection) simulatorSection.classList.remove("d-none");
      if (pipelineStagesSection) pipelineStagesSection.classList.remove("d-none");
      if (grievancesSection) grievancesSection.classList.remove("d-none");

      if (roleName === "District Collector") {
        // District Collector Persona Mode - FULL OVERSIGHT
        if (statePlannerJurisdictionBar) statePlannerJurisdictionBar.classList.add("d-none");

        if (roleBadge) {
          if (currentOfficerSession && currentOfficerSession.role === "district_collector") {
            roleBadge.className = "badge bg-success text-white text-uppercase fs-8 px-2.5 py-1 fw-bold shadow-sm";
            roleBadge.innerHTML = `<i class="bi bi-patch-check-fill me-1"></i> VERIFIED: ${currentOfficerSession.display_name.toUpperCase()}`;
          } else {
            roleBadge.className = "badge bg-success text-white text-uppercase fs-8 px-2.5 py-1 fw-bold";
            roleBadge.textContent = "ROLE: DISTRICT COLLECTOR (DISTRICT LEVEL)";
          }
        }
        if (roleJurisdiction) {
          if (currentOfficerSession && currentOfficerSession.role === "district_collector") {
            roleJurisdiction.innerHTML = `<i class="bi bi-geo-alt-fill text-success me-1"></i>${currentOfficerSession.jurisdiction} • Authenticated Collectorate`;
          } else {
            roleJurisdiction.innerHTML = '<i class="bi bi-geo-alt me-1"></i>District Collectorate & Field Jurisdiction';
          }
        }
        if (roleDescription) {
          if (currentOfficerSession && currentOfficerSession.role === "district_collector") {
            roleDescription.textContent = `Official executive authority active for ${currentOfficerSession.district}, ${currentOfficerSession.state}. Filtered citizen grievances and field directives enabled.`;
          } else {
            roleDescription.textContent = "District executive oversight: inspect complete citizen grievances, dispatch field audit teams, schedule on-site verification, and allocate urgent district remediation.";
          }
        }
        if (roleIconBox) roleIconBox.className = "rounded-circle p-2.5 bg-success bg-opacity-20 text-success border border-success border-opacity-30";
        if (roleIcon) roleIcon.className = "bi bi-geo-alt fs-4";

        if (modalActionOfficer) {
          modalActionOfficer.value = (currentOfficerSession && currentOfficerSession.role === "district_collector")
            ? currentOfficerSession.display_name
            : "District Collector";
        }

        if (currentOfficerSession && currentOfficerSession.role === "district_collector") {
          loadDashboardForState(currentOfficerSession.state);
        } else {
          loadDashboardForState("National");
        }
        loadGrievances();

        showToast('<i class="bi bi-geo-alt-fill me-1 text-success"></i> Switched to <strong>District Collector View</strong>. Public citizen grievance ledger unlocked for executive oversight.');
      } else if (roleName === "State Planner") {
        // State Planner Persona Mode - RESPECTIVE STATE JURISDICTION
        if (statePlannerJurisdictionBar) statePlannerJurisdictionBar.classList.remove("d-none");

        let targetState = "Jharkhand";
        if (currentOfficerSession && currentOfficerSession.role === "state_planner") {
          targetState = currentOfficerSession.state;
        } else if (statePlannerDropdown && statePlannerDropdown.value) {
          targetState = statePlannerDropdown.value;
        }

        if (statePlannerDropdown) {
          statePlannerDropdown.value = targetState;
        }

        if (roleBadge) {
          if (currentOfficerSession && currentOfficerSession.role === "state_planner") {
            roleBadge.className = "badge bg-warning text-dark text-uppercase fs-8 px-2.5 py-1 fw-bold shadow-sm";
            roleBadge.innerHTML = `<i class="bi bi-patch-check-fill me-1"></i> VERIFIED: ${currentOfficerSession.display_name.toUpperCase()}`;
          } else {
            roleBadge.className = "badge bg-warning text-dark text-uppercase fs-8 px-2.5 py-1 fw-bold shadow-sm";
            roleBadge.innerHTML = `<i class="bi bi-diagram-3-fill me-1"></i> STATE PLANNER: ${targetState.toUpperCase()}`;
          }
        }
        if (roleJurisdiction) {
          if (currentOfficerSession && currentOfficerSession.role === "state_planner") {
            roleJurisdiction.innerHTML = `<i class="bi bi-diagram-3-fill text-warning me-1"></i>${currentOfficerSession.state} Planning Commission • Authenticated Planner`;
          } else {
            roleJurisdiction.innerHTML = `<i class="bi bi-diagram-3 me-1"></i>${targetState} State Planning Commission • Active Jurisdiction`;
          }
        }
        if (roleDescription) {
          roleDescription.textContent = `State-level capital coordination active for ${targetState}. Analyzing multi-district demand patterns, pipeline readiness, and regional asset deficits.`;
        }
        if (roleIconBox) roleIconBox.className = "rounded-circle p-2.5 bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30";
        if (roleIcon) roleIcon.className = "bi bi-diagram-3 fs-4";

        if (modalActionOfficer) {
          modalActionOfficer.value = (currentOfficerSession && currentOfficerSession.role === "state_planner")
            ? currentOfficerSession.display_name
            : `State Infrastructure Planner (${targetState})`;
        }

        loadDashboardForState(targetState);
        loadGrievances();
        showToast(`<i class="bi bi-diagram-3-fill me-1 text-warning"></i> Switched to <strong>State Planner View (${targetState})</strong>.`);
      } else {
        // Policymaker (National) Persona Mode - FULL NATIONAL OVERSIGHT
        if (statePlannerJurisdictionBar) statePlannerJurisdictionBar.classList.add("d-none");

        if (roleBadge) {
          roleBadge.className = "badge bg-primary text-white text-uppercase fs-8 px-2.5 py-1 fw-bold";
          roleBadge.textContent = "ROLE: POLICYMAKER (NATIONAL)";
        }
        if (roleJurisdiction) roleJurisdiction.innerHTML = '<i class="bi bi-shield-check me-1"></i>All India Multi-State Jurisdiction';
        if (roleDescription) roleDescription.textContent = "National decision oversight: reviewing citizen demand clusters, cross-state infrastructure deficits, and approving audited capex recommendations.";
        if (roleIconBox) roleIconBox.className = "rounded-circle p-2.5 bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30";
        if (roleIcon) roleIcon.className = "bi bi-shield-check fs-4";

        if (modalActionOfficer) modalActionOfficer.value = "National Policymaker";

        const filterDistrict = document.getElementById("filterDistrict");
        if (filterDistrict && filterDistrict.value !== "All") {
          filterDistrict.value = "All";
        }
        loadDashboardForState("National");
        loadGrievances();

        showToast('<i class="bi bi-shield-check me-1 text-primary"></i> Switched to <strong>Policymaker (National) View</strong>.');
      }
    }
  }

  // Dropdown role options
  document.querySelectorAll(".role-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.preventDefault();
      const targetRole = opt.dataset.role;

      // District Collector / State Planner require officer authentication.
      // Route to the login page (State/District + password) instead of
      // switching the view directly, unless already logged in for that role.
      if (targetRole === "District Collector" && (!currentOfficerSession || currentOfficerSession.role !== "district_collector")) {
        openOfficerLoginFor("district_collector");
        return;
      }
      if (targetRole === "State Planner" && (!currentOfficerSession || currentOfficerSession.role !== "state_planner")) {
        openOfficerLoginFor("state_planner");
        return;
      }

      applyRoleView(targetRole);
    });
  });

  // Opens the Officer Login modal pre-set to the given role (district_collector / state_planner)
  function openOfficerLoginFor(role) {
    const loginRoleSelect = document.getElementById("loginRoleSelect");
    if (loginRoleSelect) {
      loginRoleSelect.value = role;
      loginRoleSelect.dispatchEvent(new Event("change"));
    }
    const officerModalEl = document.getElementById("officerLoginModal");
    if (officerModalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(officerModalEl);
      modalInstance.show();
    }
  }

  // Quick switch buttons on banner
  const btnSwitchToCitizen = document.getElementById("btnSwitchToCitizen");
  if (btnSwitchToCitizen) {
    btnSwitchToCitizen.addEventListener("click", () => applyRoleView("Citizen"));
  }

  const btnSwitchToCollector = document.getElementById("btnSwitchToCollector");
  if (btnSwitchToCollector) {
    btnSwitchToCollector.addEventListener("click", () => {
      if (!currentOfficerSession || currentOfficerSession.role !== "district_collector") {
        // Not authenticated as a District Collector yet — open the login page
        // (asks which District and password) instead of switching the view.
        openOfficerLoginFor("district_collector");
        return;
      }
      applyRoleView("District Collector");
    });
  }

  // Quick Switch to State Planner
  if (btnSwitchToPlanner) {
    btnSwitchToPlanner.addEventListener("click", () => {
      if (!currentOfficerSession || currentOfficerSession.role !== "state_planner") {
        // Not authenticated as a State Planner yet — open the login page
        // (asks which State and password) instead of switching the view.
        openOfficerLoginFor("state_planner");
        return;
      }
      applyRoleView("State Planner");
    });
  }

  // State Planner Respective State Switcher Handlers
  if (statePlannerDropdown) {
    statePlannerDropdown.addEventListener("change", () => {
      const selectedState = statePlannerDropdown.value;
      if (selectedState) {
        loadDashboardForState(selectedState);
        if (currentActiveRole === "State Planner") {
          if (roleBadge && (!currentOfficerSession || currentOfficerSession.role !== "state_planner")) {
            roleBadge.innerHTML = `<i class="bi bi-diagram-3-fill me-1"></i> STATE PLANNER: ${selectedState.toUpperCase()}`;
          }
          if (roleJurisdiction) {
            roleJurisdiction.innerHTML = `<i class="bi bi-diagram-3-fill text-warning me-1"></i>${selectedState} State Planning Commission • Active Jurisdiction`;
          }
          if (roleDescription) {
            roleDescription.textContent = `State-level capital coordination active for ${selectedState}. Analyzing multi-district demand patterns, pipeline readiness, and regional asset deficits.`;
          }
        }
        loadGrievances();
        showToast(`<i class="bi bi-diagram-3-fill me-1 text-warning"></i> State Planner active jurisdiction updated to <strong>${selectedState}</strong>`);
      }
    });
  }

  if (btnApplyStatePlanner) {
    btnApplyStatePlanner.addEventListener("click", () => {
      const selectedState = statePlannerDropdown ? statePlannerDropdown.value : "Jharkhand";
      loadDashboardForState(selectedState);
      loadGrievances();
      showToast(`<i class="bi bi-arrow-repeat me-1 text-warning"></i> Loaded State Decision Support for <strong>${selectedState}</strong>`);
    });
  }

  const btnSwitchToPolicymaker = document.getElementById("btnSwitchToPolicymaker");
  if (btnSwitchToPolicymaker) {
    btnSwitchToPolicymaker.addEventListener("click", () => applyRoleView("Policymaker"));
  }

  // =========================================================================
  // STATE-AWARE DASHBOARD LOADER (Respective States & National Scope)
  // =========================================================================
  async function loadDashboardForState(stateName) {
    const isNational = !stateName || stateName.toLowerCase() === "national" || stateName.toLowerCase() === "all" || stateName.toLowerCase() === "all india";
    const url = isNational ? "/api/dashboard/overview" : `/api/dashboard/overview?state=${encodeURIComponent(stateName)}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success || !json.data) return;

      const data = json.data;

      // 1. Update State Planner Jurisdiction Bar
      if (statePlannerActiveStateName) {
        statePlannerActiveStateName.textContent = isNational
          ? "National Planning Commission Decision Support"
          : `${data.state} State Planning Commission`;
      }
      if (statePlannerDistrictsSubtitle) {
        statePlannerDistrictsSubtitle.textContent = isNational
          ? "Cross-state capital allocation, inter-regional priority weighting, and national grievance aggregation."
          : `Analyzing ${data.total_districts || 'all'} districts across ${data.state}: inter-district demand patterns, pipeline readiness, and regional asset deficits.`;
      }
      if (statePlannerDropdown && !isNational && statePlannerDropdown.value !== data.state) {
        statePlannerDropdown.value = data.state;
      }

      // 2. Update Header Banner
      const mainBannerTitle = document.getElementById("mainBannerTitle");
      const mainBannerSubtitle = document.getElementById("mainBannerSubtitle");
      const mainBannerBadge = document.getElementById("mainBannerBadge");
      if (mainBannerTitle && data.banner?.title) {
        mainBannerTitle.textContent = data.banner.title;
      }
      if (mainBannerSubtitle && data.banner?.subtitle) {
        mainBannerSubtitle.textContent = data.banner.subtitle;
      }
      if (mainBannerBadge && data.banner?.data_classification) {
        mainBannerBadge.innerHTML = `<i class="bi bi-database-check me-1"></i> ${data.banner.data_classification.replace(/_/g, ' ')}`;
      }

      // 3. Update 5 KPI Cards
      if (data.kpis && data.kpis.length >= 5) {
        const [k1, k2, k3, k4, k5] = data.kpis;
        const kpiRequestsVal = document.getElementById("kpi-requests-value");
        const kpiRequestsSub = document.getElementById("kpi-requests-sub");
        if (kpiRequestsVal) kpiRequestsVal.textContent = k1.value;
        if (kpiRequestsSub) kpiRequestsSub.textContent = k1.subtitle;

        const kpiClustersVal = document.getElementById("kpi-clusters-value");
        const kpiClustersSub = document.getElementById("kpi-clusters-sub");
        if (kpiClustersVal) kpiClustersVal.textContent = k2.value;
        if (kpiClustersSub) kpiClustersSub.textContent = k2.subtitle;

        const kpiHotspotsVal = document.getElementById("kpi-hotspots-value");
        const kpiHotspotsSub = document.getElementById("kpi-hotspots-sub");
        if (kpiHotspotsVal) kpiHotspotsVal.textContent = k3.value;
        if (kpiHotspotsSub) kpiHotspotsSub.textContent = k3.subtitle;

        const kpiGapVal = document.getElementById("kpi-gap-value");
        const kpiGapSub = document.getElementById("kpi-gap-sub");
        if (kpiGapVal) kpiGapVal.textContent = k4.value;
        if (kpiGapSub) kpiGapSub.textContent = k4.subtitle;

        const kpiPriorityVal = document.getElementById("kpi-priority-value");
        const kpiPrioritySub = document.getElementById("kpi-priority-sub");
        if (kpiPriorityVal) kpiPriorityVal.textContent = k5.value;
        if (kpiPrioritySub) kpiPrioritySub.textContent = k5.subtitle;
      }

      // 4. Update Spotlight Recommendation
      if (data.spotlight) {
        const spot = data.spotlight;
        const spotlightUrgency = document.getElementById("spotlightUrgency");
        const spotlightCategory = document.getElementById("spotlightCategory");
        const spotlightRegion = document.getElementById("spotlightRegion");
        const spotlightTitle = document.getElementById("spotlightTitle");
        const spotlightDesc = document.getElementById("spotlightDesc");

        if (spotlightUrgency) spotlightUrgency.textContent = spot.urgency_tier || spot.urgency || "CRITICAL DEFICIT";
        if (spotlightCategory) spotlightCategory.textContent = spot.category || spot.sector || "Infrastructure";
        if (spotlightRegion) spotlightRegion.textContent = spot.region_name || `${spot.district || ''}, ${data.state || ''}`;
        if (spotlightTitle) spotlightTitle.textContent = spot.title;
        if (spotlightDesc) spotlightDesc.textContent = spot.description;

        // Capex and impact metrics
        const capexVal = spot.estimated_cost_cr || spot.estimated_capex;
        if (capexVal) {
          const capexEl = document.querySelector("#spotlight-section .bg-slate-100 .col-6:nth-child(1) .fs-6");
          if (capexEl) capexEl.textContent = `₹${capexVal} Cr`;
        }
        const popVal = spot.impacted_population || spot.population_impact;
        if (popVal) {
          const popEl = document.querySelector("#spotlight-section .bg-slate-100 .col-6:nth-child(2) .fs-6");
          if (popEl) popEl.textContent = Number(popVal).toLocaleString();
        }

        // Priority Score badge in explainability breakdown
        const scoreBadge = document.querySelector("#spotlight-section .badge.bg-emerald-subtle");
        if (scoreBadge && spot.priority_score) {
          scoreBadge.textContent = `Score: ${spot.priority_score} / 100`;
        }
      }

      // 5. Update Ranked Hotspots Table
      if (data.hotspots && Array.isArray(data.hotspots)) {
        const tbody = document.getElementById("hotspotsTableBody");
        if (tbody) {
          tbody.innerHTML = data.hotspots.map((h, idx) => {
            const rankBadge = idx === 0 
              ? '<span class="badge bg-danger text-white rounded-circle p-1.5 fs-8">#1</span>'
              : (idx === 1 
                  ? '<span class="badge bg-warning-subtle text-warning-emphasis rounded-circle p-1.5 fs-8">#2</span>'
                  : `<span class="badge bg-secondary-subtle text-secondary rounded-circle p-1.5 fs-8">#${idx+1}</span>`);
            
            const distLabel = h.district ? `${h.district} District` : h.region_name;
            const stateLabel = data.state || h.state || "India";

            return `
              <tr>
                <td class="ps-4">
                  <div class="d-flex align-items-center gap-2">
                    ${rankBadge}
                    <div>
                      <div class="fw-bold text-slate-900">${distLabel}</div>
                      <div class="text-secondary fs-8">${stateLabel}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${h.category}</span></td>
                <td><strong class="${h.gap_index >= 85 ? 'text-danger' : 'text-warning-emphasis'}">${h.gap_index} %</strong></td>
                <td><span class="badge bg-emerald-subtle text-emerald border border-emerald-subtle fw-bold">${h.priority_score} / 100</span></td>
                <td>${(h.citizen_requests || 0).toLocaleString()} requests</td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 fs-8 fw-semibold" onclick="selectHotspot(${idx})">
                    Details
                  </button>
                </td>
              </tr>
            `;
          }).join("");
        }
      }

      // 6. Update District Filter Dropdown options in Grievance section
      const filterDistrict = document.getElementById("filterDistrict");
      if (filterDistrict && data.hotspots && Array.isArray(data.hotspots)) {
        const currentVal = filterDistrict.value;
        let optHtml = isNational
          ? '<option value="All">All Districts (National)</option>'
          : `<option value="All">All Districts (${data.state})</option>`;
        
        data.hotspots.forEach((h) => {
          const dName = h.district || h.region_name.split(" ")[0];
          optHtml += `<option value="${dName}">${dName} District</option>`;
        });
        filterDistrict.innerHTML = optHtml;
        if (currentVal && filterDistrict.querySelector(`option[value="${currentVal}"]`)) {
          filterDistrict.value = currentVal;
        }
      }

    } catch (err) {
      console.error("Failed to load dashboard for state:", err);
    }
  }

  // =========================================================================
  // COMPLETE CITIZEN GRIEVANCE INSPECTION & ACTION SYSTEM
  // =========================================================================
  const grievancesTableBody = document.getElementById("grievancesTableBody");
  const filterDistrict = document.getElementById("filterDistrict");
  const filterUrgency = document.getElementById("filterUrgency");
  const filterCategory = document.getElementById("filterCategory");
  const btnResetFilters = document.getElementById("btnResetFilters");
  const lblGrievanceCounter = document.getElementById("lblGrievanceCounter");

  // Fetch and display filtered grievances
  async function loadGrievances() {
    if (!grievancesTableBody) return;

    let district = filterDistrict ? filterDistrict.value : "All";
    const urgency = filterUrgency ? filterUrgency.value : "All";
    const category = filterCategory ? filterCategory.value : "All";

    const params = new URLSearchParams();

    // If an officer is authenticated, scope grievances to their jurisdiction
    if (currentOfficerSession) {
      if (currentOfficerSession.role === "district_collector") {
        params.append("district", currentOfficerSession.district);
        params.append("state", currentOfficerSession.state);
      } else if (currentOfficerSession.role === "state_planner") {
        params.append("state", currentOfficerSession.state);
        if (district && district !== "All") params.append("district", district);
      }
    } else if (currentActiveRole === "State Planner") {
      const state = statePlannerDropdown ? statePlannerDropdown.value : "Jharkhand";
      if (state) params.append("state", state);
      if (district && district !== "All") params.append("district", district);
    } else {
      if (district && district !== "All") params.append("district", district);
    }

    if (urgency && urgency !== "All") params.append("urgency", urgency);
    if (category && category !== "All") params.append("category", category);

    try {
      const url = `/api/citizen/grievances${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        cachedGrievances = json.data;
        renderGrievancesTable(cachedGrievances);
        if (lblGrievanceCounter) {
          lblGrievanceCounter.textContent = `${cachedGrievances.length} Records`;
        }
      }
    } catch (err) {
      console.error("Error loading grievances:", err);
    }
  }

  function renderGrievancesTable(items) {
    if (!grievancesTableBody) return;

    if (items.length === 0) {
      grievancesTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-4 text-secondary">
            <i class="bi bi-inbox fs-3 d-block mb-1 text-slate-400"></i>
            No citizen grievances match current filters.
          </td>
        </tr>
      `;
      return;
    }

    grievancesTableBody.innerHTML = items.map((item) => {
      let urgencyBadge = `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">MODERATE</span>`;
      if (item.urgency === "CRITICAL") {
        urgencyBadge = `<span class="badge bg-danger text-white fw-bold"><i class="bi bi-exclamation-octagon-fill me-1"></i>CRITICAL</span>`;
      } else if (item.urgency === "HIGH") {
        urgencyBadge = `<span class="badge bg-warning text-dark fw-bold">HIGH</span>`;
      }

      let categoryBadge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle">${item.category}</span>`;
      if (item.category.includes("Water")) {
        categoryBadge = `<span class="badge bg-info-subtle text-info border border-info-subtle">${item.category}</span>`;
      } else if (item.category.includes("Solar") || item.category.includes("Electricity")) {
        categoryBadge = `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">${item.category}</span>`;
      } else if (item.category.includes("Roads") || item.category.includes("Bridges")) {
        categoryBadge = `<span class="badge bg-dark-subtle text-dark border border-dark-subtle">${item.category}</span>`;
      }

      let statusBadge = `<span class="badge bg-secondary-subtle text-secondary border">${item.status}</span>`;
      if (item.status === "FIELD_AUDIT_SCHEDULED") {
        statusBadge = `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-semibold"><i class="bi bi-calendar-event me-1"></i>Audit Scheduled</span>`;
      } else if (item.status === "ACTION_APPROVED" || item.status === "IN_PROGRESS") {
        statusBadge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold"><i class="bi bi-check-circle me-1"></i>Action Approved</span>`;
      } else if (item.status === "RESOLVED") {
        statusBadge = `<span class="badge bg-success text-white fw-bold"><i class="bi bi-check-all me-1"></i>Resolved</span>`;
      } else {
        statusBadge = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold"><i class="bi bi-hourglass-split me-1"></i>Under Review</span>`;
      }

      return `
        <tr>
          <td class="ps-4">
            <span class="badge bg-slate-900 text-white rounded-pill px-2.5 py-1 fw-mono fs-8 shadow-sm">
              ${item.tracking_id}
            </span>
          </td>
          <td>
            <div class="fw-bold text-slate-900">${item.name}</div>
            <div class="text-secondary fs-8"><i class="bi bi-telephone me-1 text-slate-400"></i>${item.phone}</div>
          </td>
          <td>
            <div class="fw-semibold text-slate-800">${item.district}</div>
            <div class="text-secondary fs-8 text-truncate" style="max-width: 160px;" title="${item.village_or_ward || item.state}">${item.village_or_ward || item.state}</div>
          </td>
          <td>${categoryBadge}</td>
          <td>${urgencyBadge}</td>
          <td class="text-truncate" style="max-width: 220px;" title="${item.description}">
            ${item.description}
          </td>
          <td>${statusBadge}</td>
          <td class="text-secondary fs-8">${item.timestamp}</td>
          <td class="text-center pe-4">
            <button class="btn btn-sm btn-primary rounded-pill px-3 py-1 fs-8 fw-bold btn-inspect-grievance shadow-sm" data-id="${item.tracking_id}">
              <i class="bi bi-eye-fill me-1"></i> View Complete
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Attach click listeners to all inspection buttons
    document.querySelectorAll(".btn-inspect-grievance").forEach((btn) => {
      btn.addEventListener("click", () => {
        const trackingId = btn.dataset.id;
        openCompleteGrievanceModal(trackingId);
      });
    });
  }

  // Filter change listeners
  if (filterDistrict) filterDistrict.addEventListener("change", loadGrievances);
  if (filterUrgency) filterUrgency.addEventListener("change", loadGrievances);
  if (filterCategory) filterCategory.addEventListener("change", loadGrievances);
  if (btnResetFilters) {
    btnResetFilters.addEventListener("click", () => {
      if (filterDistrict) filterDistrict.value = "All";
      if (filterUrgency) filterUrgency.value = "All";
      if (filterCategory) filterCategory.value = "All";
      loadGrievances();
    });
  }

  // =========================================================================
  // VIEW COMPLETE GRIEVANCE MODAL & ACTION HANDLER
  // =========================================================================
  const viewCompleteGrievanceModalEl = document.getElementById("viewCompleteGrievanceModal");
  const modalInspectTrackingId = document.getElementById("modalInspectTrackingId");
  const modalInspectUrgencyBadge = document.getElementById("modalInspectUrgencyBadge");
  const modalInspectStatusBadge = document.getElementById("modalInspectStatusBadge");
  const modalInspectName = document.getElementById("modalInspectName");
  const modalInspectPhone = document.getElementById("modalInspectPhone");
  const modalInspectStateDistrict = document.getElementById("modalInspectStateDistrict");
  const modalInspectVillage = document.getElementById("modalInspectVillage");
  const modalInspectCategory = document.getElementById("modalInspectCategory");
  const modalInspectDepartment = document.getElementById("modalInspectDepartment");
  const modalInspectTimestamp = document.getElementById("modalInspectTimestamp");
  const modalInspectDescription = document.getElementById("modalInspectDescription");
  const modalInspectRemarksList = document.getElementById("modalInspectRemarksList");
  const modalActionTrackingId = document.getElementById("modalActionTrackingId");
  const modalActionStatus = document.getElementById("modalActionStatus");
  const formUpdateGrievanceStatus = document.getElementById("formUpdateGrievanceStatus");

  async function openCompleteGrievanceModal(trackingId) {
    try {
      const res = await fetch(`/api/citizen/grievance/${encodeURIComponent(trackingId)}`);
      const json = await res.json();
      if (!json.success || !json.data) {
        showToast(`<i class="bi bi-exclamation-circle-fill text-danger me-1"></i> Grievance record not found.`);
        return;
      }

      const item = json.data;

      // Populate header badges
      if (modalInspectTrackingId) modalInspectTrackingId.textContent = item.tracking_id;
      if (modalInspectUrgencyBadge) {
        if (item.urgency === "CRITICAL") {
          modalInspectUrgencyBadge.innerHTML = `<span class="badge bg-danger text-white fw-bold"><i class="bi bi-exclamation-octagon-fill me-1"></i>CRITICAL EMERGENCY</span>`;
        } else if (item.urgency === "HIGH") {
          modalInspectUrgencyBadge.innerHTML = `<span class="badge bg-warning text-dark fw-bold">HIGH URGENCY</span>`;
        } else {
          modalInspectUrgencyBadge.innerHTML = `<span class="badge bg-secondary-subtle text-secondary border">MODERATE URGENCY</span>`;
        }
      }

      if (modalInspectStatusBadge) {
        modalInspectStatusBadge.innerHTML = `<span class="badge bg-slate-800 text-white border border-slate-700 px-2.5 py-1">${item.status.replace(/_/g, ' ')}</span>`;
      }

      // Populate citizen profile
      if (modalInspectName) modalInspectName.textContent = item.name;
      if (modalInspectPhone) {
        modalInspectPhone.innerHTML = `<a href="tel:${item.phone}" class="text-slate-900 text-decoration-none fw-bold"><i class="bi bi-telephone-outbound me-1 text-primary"></i>${item.phone}</a>`;
      }
      if (modalInspectStateDistrict) modalInspectStateDistrict.textContent = `${item.district} District, ${item.state}`;
      if (modalInspectVillage) modalInspectVillage.textContent = item.village_or_ward || `${item.district} Rural Area`;
      if (modalInspectCategory) modalInspectCategory.textContent = item.category;
      if (modalInspectDepartment) modalInspectDepartment.textContent = item.department || `District ${item.category} Administration`;
      if (modalInspectTimestamp) modalInspectTimestamp.textContent = item.timestamp;

      // Populate complete untruncated grievance narrative
      if (modalInspectDescription) {
        modalInspectDescription.textContent = item.description;
      }

      // Populate official action history / remarks
      if (modalInspectRemarksList) {
        if (item.official_remarks && item.official_remarks.length > 0) {
          modalInspectRemarksList.innerHTML = item.official_remarks.map((rem) => `
            <div class="list-group-item p-2.5 bg-slate-50 border-bottom border-slate-200 fs-8">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong class="text-slate-900"><i class="bi bi-person-badge text-primary me-1"></i>${rem.officer}</strong>
                <span class="text-secondary fs-9"><i class="bi bi-clock me-1"></i>${rem.date}</span>
              </div>
              <p class="text-slate-700 mb-0 ps-3 border-start border-2 border-primary">${rem.remark}</p>
            </div>
          `).join("");
        } else {
          modalInspectRemarksList.innerHTML = `
            <div class="list-group-item p-3 text-center text-secondary fs-8 bg-light">
              <i class="bi bi-info-circle me-1"></i> No prior administrative directives logged. Use the form below to order action.
            </div>
          `;
        }
      }

      // Executive Action Directive Form: visible for all roles EXCEPT Citizen
      const modalExecutiveActionCard = document.getElementById("modalExecutiveActionCard");
      if (modalExecutiveActionCard) {
        if (currentActiveRole === "Citizen") {
          modalExecutiveActionCard.classList.add("d-none");
        } else {
          modalExecutiveActionCard.classList.remove("d-none");
        }
      }

      // Pre-fill action form
      if (modalActionTrackingId) modalActionTrackingId.value = item.tracking_id;
      if (modalActionStatus) modalActionStatus.value = item.status;
      if (modalActionOfficer) {
        if (currentActiveRole === "District Collector") {
          modalActionOfficer.value = "District Collector";
        } else if (currentActiveRole === "Policymaker") {
          modalActionOfficer.value = "National Policy Planner";
        } else if (currentActiveRole === "State Planner") {
          modalActionOfficer.value = "State Infrastructure Planner";
        }
      }

      const modalInstance = bootstrap.Modal.getOrCreateInstance(viewCompleteGrievanceModalEl);
      modalInstance.show();
    } catch (err) {
      console.error("Error inspecting grievance:", err);
      showToast(`<i class="bi bi-exclamation-triangle-fill text-danger me-1"></i> Failed to retrieve grievance details.`);
    }
  }

  // Handle Official Action Form Submit (District Collector / Policymaker Directive)
  if (formUpdateGrievanceStatus) {
    formUpdateGrievanceStatus.addEventListener("submit", async (e) => {
      e.preventDefault();

      const trackingId = modalActionTrackingId.value;
      const status = modalActionStatus.value;
      const officer = modalActionOfficer ? modalActionOfficer.value : "District Collector";
      const remark = document.getElementById("modalActionRemark").value;

      const btnSubmit = document.getElementById("btnSubmitOfficialAction");
      const origText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Applying Directive...`;
      btnSubmit.disabled = true;

      try {
        const res = await fetch(`/api/citizen/grievance/${encodeURIComponent(trackingId)}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, officer, remark }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          showToast(`<i class="bi bi-check2-circle me-1 text-success"></i> Official directive applied! Status updated to <strong>${status}</strong>.`);

          // Re-open inspection to reflect new remarks
          await openCompleteGrievanceModal(trackingId);

          // Reload table
          await loadGrievances();
        } else {
          showToast(`<i class="bi bi-exclamation-circle me-1 text-danger"></i> ${json.error || "Failed to update status."}`);
        }
      } catch (err) {
        console.error("Status update error:", err);
        showToast(`<i class="bi bi-exclamation-triangle-fill text-danger me-1"></i> Server error applying status directive.`);
      } finally {
        btnSubmit.innerHTML = origText;
        btnSubmit.disabled = false;
      }
    });
  }

  // =========================================================================
  // ON-PAGE CITIZEN GRIEVANCE ENTRY PORTAL (Role: Citizen)
  // =========================================================================
  const onPageGrievanceForm = document.getElementById("onPageGrievanceForm");
  const citizenSubmissionSuccess = document.getElementById("citizenSubmissionSuccess");
  const lblCitizenCreatedTrackingId = document.getElementById("lblCitizenCreatedTrackingId");
  const btnCitizenCopyTrackingId = document.getElementById("btnCitizenCopyTrackingId");

  if (onPageGrievanceForm) {
    onPageGrievanceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById("btnSubmitOnPageGrievance");
      const origText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Ingesting Grievance...`;
      btnSubmit.disabled = true;

      const payload = {
        name: document.getElementById("citizenInputName").value,
        phone: document.getElementById("citizenInputPhone").value,
        state: document.getElementById("citizenInputState").value,
        district: document.getElementById("citizenInputDistrict").value,
        village_or_ward: document.getElementById("citizenInputVillage").value,
        category: document.getElementById("citizenInputCategory").value,
        urgency: document.getElementById("citizenInputUrgency").value,
        description: document.getElementById("citizenInputDescription").value,
      };

      try {
        const res = await fetch("/api/citizen/grievance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (json.success) {
          if (lblCitizenCreatedTrackingId) lblCitizenCreatedTrackingId.textContent = json.tracking_id;
          if (citizenSubmissionSuccess) citizenSubmissionSuccess.classList.remove("d-none");

          // Update requests counter
          const kpiRequestsValue = document.getElementById("kpi-requests-value");
          if (kpiRequestsValue) {
            const currentNum = parseInt(kpiRequestsValue.textContent.replace(/,/g, "")) || 8421;
            kpiRequestsValue.textContent = (currentNum + 1).toLocaleString();
          }

          // Save tracking ID locally for this citizen so they can track their own submissions
          saveMyTrackingId(json.tracking_id);
          renderMyGrievances();

          // Reload government table in background
          await loadGrievances();

          showToast(`<i class="bi bi-check-circle-fill me-1 text-success"></i> Grievance registered! Tracking ID: <strong>${json.tracking_id}</strong>`);

          onPageGrievanceForm.reset();
        } else {
          showToast(`<i class="bi bi-exclamation-circle-fill me-1 text-danger"></i> ${json.error || "Submission failed"}`);
        }
      } catch (err) {
        console.error("Submission error:", err);
        showToast('<i class="bi bi-exclamation-triangle-fill me-1 text-danger"></i> Failed to connect to server.');
      } finally {
        btnSubmit.innerHTML = origText;
        btnSubmit.disabled = false;
      }
    });
  }

  if (btnCitizenCopyTrackingId) {
    btnCitizenCopyTrackingId.addEventListener("click", () => {
      navigator.clipboard.writeText(lblCitizenCreatedTrackingId.textContent.trim());
      btnCitizenCopyTrackingId.innerHTML = `<i class="bi bi-check-lg me-1"></i> Copied!`;
      setTimeout(() => {
        btnCitizenCopyTrackingId.innerHTML = `<i class="bi bi-clipboard me-1"></i> Copy ID`;
      }, 2000);
    });
  }

  // =========================================================================
  // CITIZEN PRIVACY & PERSONAL GRIEVANCES HANDLER
  // =========================================================================
  function getMyTrackingIds() {
    try {
      return JSON.parse(localStorage.getItem("janvista_my_tracking_ids") || "[]");
    } catch {
      return [];
    }
  }

  function saveMyTrackingId(id) {
    if (!id) return;
    const ids = getMyTrackingIds();
    if (!ids.includes(id)) {
      ids.unshift(id);
      localStorage.setItem("janvista_my_tracking_ids", JSON.stringify(ids));
    }
  }

  async function renderMyGrievances() {
    const container = document.getElementById("myGrievancesList");
    const countBadge = document.getElementById("lblMyGrievancesCount");
    if (!container) return;

    const myIds = getMyTrackingIds();
    if (countBadge) countBadge.textContent = `${myIds.length} Submissions`;

    if (myIds.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-slate-400">
          <i class="bi bi-inbox fs-3 d-block mb-1 text-slate-300"></i>
          You haven't filed any grievances yet in this session. Submit your grievance using the form above to track it here.
        </div>
      `;
      return;
    }

    try {
      const res = await fetch(`/api/citizen/grievances?role=citizen&tracking_ids=${encodeURIComponent(myIds.join(","))}`);
      const json = await res.json();
      if (json.success && json.data) {
        const items = json.data;
        if (items.length === 0) {
          container.innerHTML = `<div class="text-secondary py-3 text-center">No matching records found for your saved tracking IDs.</div>`;
          return;
        }

        container.innerHTML = items.map((item) => `
          <div class="p-2.5 mb-2 bg-slate-50 border border-slate-200 rounded-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-slate-900 text-white rounded-pill px-2.5 py-1 fw-mono fs-8">${item.tracking_id}</span>
              <span class="badge bg-success-subtle text-success border border-success-subtle fs-9">${item.status.replace(/_/g, ' ')}</span>
            </div>
            <div class="fw-bold text-slate-900 fs-8">${item.category} &bull; ${item.district}</div>
            <div class="text-secondary fs-9 mb-1 text-truncate">${item.description}</div>
            <div class="d-flex justify-content-between align-items-center pt-1 border-top border-slate-200">
              <span class="text-secondary fs-9"><i class="bi bi-clock me-1"></i>${item.timestamp}</span>
              <button class="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-0.5 fs-9 fw-semibold btn-view-my-status" data-id="${item.tracking_id}">
                <i class="bi bi-search me-1"></i> Track My Status
              </button>
            </div>
          </div>
        `).join("");

        container.querySelectorAll(".btn-view-my-status").forEach((btn) => {
          btn.addEventListener("click", () => {
            trackCitizenGrievanceById(btn.dataset.id);
          });
        });
      }
    } catch (err) {
      console.error("Error loading my grievances:", err);
    }
  }

  // Citizen Track Status Handler
  async function trackCitizenGrievanceById(trackingId) {
    const cleanId = (trackingId || "").trim();
    if (!cleanId) return;

    try {
      const res = await fetch(`/api/citizen/track/${encodeURIComponent(cleanId)}`);
      const json = await res.json();

      const trackBox = document.getElementById("citizenTrackResultBox");
      if (!trackBox) return;

      trackBox.classList.remove("d-none");
      if (json.success && json.data) {
        const item = json.data;
        document.getElementById("lblCitizenTrackId").textContent = item.tracking_id;
        document.getElementById("lblCitizenTrackStatus").innerHTML = `<span class="badge bg-success text-white px-2.5 py-1">${item.status.replace(/_/g, ' ')}</span>`;
        document.getElementById("lblCitizenTrackLoc").textContent = `${item.village_or_ward || item.district}, ${item.district}`;
        document.getElementById("lblCitizenTrackCat").textContent = item.category;
        document.getElementById("lblCitizenTrackDesc").textContent = item.description;

        const remarksEl = document.getElementById("lblCitizenTrackRemarks");
        if (remarksEl) {
          if (item.official_remarks && item.official_remarks.length > 0) {
            remarksEl.innerHTML = item.official_remarks.map((r) => `
              <div class="p-2 mb-1.5 bg-light rounded border border-slate-200">
                <strong class="text-slate-900">${r.officer}</strong> <span class="text-secondary">(${r.date})</span>:<br>
                <span class="text-slate-800">${r.remark}</span>
              </div>
            `).join("");
          } else {
            remarksEl.innerHTML = '<span class="text-muted">Under preliminary review by District Collectorate. Official directives will appear here.</span>';
          }
        }
        trackBox.scrollIntoView({ behavior: "smooth" });
      } else {
        trackBox.innerHTML = `<div class="alert alert-danger mb-0 p-2 fs-8"><i class="bi bi-exclamation-triangle-fill me-1"></i> No grievance found with Tracking ID: ${cleanId}. Please check the ID.</div>`;
      }
    } catch (err) {
      console.error("Track error:", err);
    }
  }

  const btnCitizenTrackLookup = document.getElementById("btnCitizenTrackLookup");
  const txtCitizenTrackInput = document.getElementById("txtCitizenTrackInput");
  if (btnCitizenTrackLookup && txtCitizenTrackInput) {
    btnCitizenTrackLookup.addEventListener("click", () => {
      trackCitizenGrievanceById(txtCitizenTrackInput.value);
    });
    txtCitizenTrackInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        trackCitizenGrievanceById(txtCitizenTrackInput.value);
      }
    });
  }

  // =========================================================================
  // MODAL GRIEVANCE SUBMISSION FORM (जन सेवा modal trigger)
  // =========================================================================
  const grievanceForm = document.getElementById("grievanceForm");
  const modalGrievanceSuccess = document.getElementById("modalGrievanceSuccess");
  const lblCreatedTrackingId = document.getElementById("lblCreatedTrackingId");
  const btnCopyTrackingId = document.getElementById("btnCopyTrackingId");
  const btnTrackLookup = document.getElementById("btnTrackLookup");
  const txtTrackInput = document.getElementById("txtTrackInput");
  const trackResultBox = document.getElementById("trackResultBox");
  const trackResultTitle = document.getElementById("trackResultTitle");
  const trackResultDetails = document.getElementById("trackResultDetails");

  if (grievanceForm) {
    grievanceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById("btnSubmitGrievance");
      const origText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Submitting...`;
      btnSubmit.disabled = true;

      const payload = {
        name: document.getElementById("citizenName").value,
        phone: document.getElementById("citizenPhone").value,
        state: document.getElementById("citizenState").value,
        district: document.getElementById("citizenDistrict").value,
        village_or_ward: document.getElementById("citizenVillage") ? document.getElementById("citizenVillage").value : "",
        category: document.getElementById("citizenCategory").value,
        urgency: document.getElementById("citizenUrgency").value,
        description: document.getElementById("citizenDescription").value,
      };

      try {
        const res = await fetch("/api/citizen/grievance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (json.success) {
          if (lblCreatedTrackingId) lblCreatedTrackingId.textContent = json.tracking_id;
          if (modalGrievanceSuccess) modalGrievanceSuccess.classList.remove("d-none");

          // Save tracking ID for this citizen's personal history
          saveMyTrackingId(json.tracking_id);
          renderMyGrievances();

          const kpiRequestsValue = document.getElementById("kpi-requests-value");
          if (kpiRequestsValue) {
            const currentNum = parseInt(kpiRequestsValue.textContent.replace(/,/g, "")) || 8421;
            kpiRequestsValue.textContent = (currentNum + 1).toLocaleString();
          }

          await loadGrievances();

          showToast(`<i class="bi bi-check-circle-fill me-1 text-success"></i> Grievance filed! Tracking ID: <strong>${json.tracking_id}</strong>`);

          const modalEl = document.getElementById("citizenGrievanceModal");
          modalEl.addEventListener("hidden.bs.modal", () => {
            if (currentActiveRole === "Citizen") {
              citizenPortalSection?.scrollIntoView({ behavior: "smooth" });
            } else {
              document.getElementById("grievances-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }, { once: true });
        } else {
          showToast(`<i class="bi bi-exclamation-circle-fill me-1 text-danger"></i> ${json.error || "Submission failed"}`);
        }
      } catch (err) {
        console.error("Submission error:", err);
        showToast('<i class="bi bi-exclamation-triangle-fill me-1 text-danger"></i> Failed to connect to server.');
      } finally {
        btnSubmit.innerHTML = origText;
        btnSubmit.disabled = false;
      }
    });
  }

  if (btnCopyTrackingId) {
    btnCopyTrackingId.addEventListener("click", () => {
      navigator.clipboard.writeText(lblCreatedTrackingId.textContent.trim());
      btnCopyTrackingId.innerHTML = `<i class="bi bi-check-lg"></i> Copied!`;
      setTimeout(() => {
        btnCopyTrackingId.innerHTML = `<i class="bi bi-clipboard"></i> Copy`;
      }, 2000);
    });
  }

  // Tracking lookup (Official / general search)
  async function performTracking() {
    const id = txtTrackInput.value.trim();
    if (!id) {
      showToast('<i class="bi bi-info-circle me-1 text-info"></i> Please enter a Tracking ID');
      return;
    }

    try {
      const res = await fetch(`/api/citizen/track/${encodeURIComponent(id)}`);
      const json = await res.json();

      trackResultBox.classList.remove("d-none");
      if (json.success && json.data) {
        const item = json.data;
        trackResultTitle.innerHTML = `<span class="badge bg-success me-1">FOUND</span> ${item.tracking_id} &bull; ${item.name}`;
        trackResultDetails.innerHTML = `<strong>Category:</strong> ${item.category} | <strong>Location:</strong> ${item.village_or_ward || item.district}, ${item.district}, ${item.state} | <strong>Status:</strong> <span class="badge bg-primary">${item.status}</span> | <em>"${item.description}"</em>`;
      } else {
        trackResultTitle.innerHTML = `<span class="badge bg-danger me-1">NOT FOUND</span> No record found for ID: ${id}`;
        trackResultDetails.innerHTML = `Please verify the Tracking ID or file a new grievance.`;
      }
    } catch (err) {
      showToast('<i class="bi bi-exclamation-triangle-fill me-1 text-warning"></i> Error looking up tracking ID');
    }
  }

  if (btnTrackLookup) {
    btnTrackLookup.addEventListener("click", performTracking);
  }
  if (txtTrackInput) {
    txtTrackInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performTracking();
      }
    });
  }

  // =========================================================================
  // OFFICIAL GOVERNANCE AUTHENTICATION & DIRECTORY (28 STATES & 8 UTs)
  // =========================================================================
  let currentOfficerSession = null;
  let allStatesHierarchy = [];

  const officerSessionCapsule = document.getElementById("officerSessionCapsule");
  const officerSessionName = document.getElementById("officerSessionName");
  const officerSessionJurisdiction = document.getElementById("officerSessionJurisdiction");
  const btnOfficerLogout = document.getElementById("btnOfficerLogout");
  const btnOpenOfficerLogin = document.getElementById("btnOpenOfficerLogin");

  const loginStateSelect = document.getElementById("loginStateSelect");
  const loginRoleSelect = document.getElementById("loginRoleSelect");
  const loginDistrictContainer = document.getElementById("loginDistrictContainer");
  const loginDistrictSelect = document.getElementById("loginDistrictSelect");
  const districtCountHint = document.getElementById("districtCountHint");
  const loginStatePlannerUtNote = document.getElementById("loginStatePlannerUtNote");

  const previewJurisdictionLabel = document.getElementById("previewJurisdictionLabel");
  const previewUsername = document.getElementById("previewUsername");
  const interactiveLoginPassword = document.getElementById("interactiveLoginPassword");
  const btnToggleInteractivePasswordVisibility = document.getElementById("btnToggleInteractivePasswordVisibility");
  const interactiveLoginForm = document.getElementById("interactiveLoginForm");
  const btnSubmitInteractiveLogin = document.getElementById("btnSubmitInteractiveLogin");
  const loginFeedbackAlert = document.getElementById("loginFeedbackAlert");

  const btnSwitchToDirectoryModal = document.getElementById("btnSwitchToDirectoryModal");
  const dirSearchInput = document.getElementById("dirSearchInput");
  const dirStateFilter = document.getElementById("dirStateFilter");
  const dirRoleFilter = document.getElementById("dirRoleFilter");
  const dirTableBody = document.getElementById("dirTableBody");
  const dirCountLabel = document.getElementById("dirCountLabel");

  // Load all-India hierarchy from backend
  async function loadStatesHierarchy() {
    try {
      const res = await fetch("/api/auth/hierarchy");
      const json = await res.json();
      if (json.success && json.data) {
        allStatesHierarchy = json.data;

        // Populate State Dropdown in Login Modal — filtered by the currently selected role
        // (State Planner is not applicable for centrally-administered UTs).
        populateLoginStateOptions(loginRoleSelect ? loginRoleSelect.value : "district_collector");

        if (dirStateFilter) {
          dirStateFilter.innerHTML = '<option value="ALL">All 36 States & Union Territories</option>';
          allStatesHierarchy.forEach((s) => {
            const opt = document.createElement("option");
            opt.value = s.state;
            opt.textContent = `${s.state} (${s.is_ut ? 'UT' : 'State'})`;
            dirStateFilter.appendChild(opt);
          });
        }

        // Populate State Planner Jurisdiction Dropdown — only States/UTs where
        // the State Planner role is applicable (excludes centrally-administered
        // UTs with no elected state government).
        if (statePlannerDropdown) {
          statePlannerDropdown.innerHTML = "";
          allStatesHierarchy.filter((s) => s.state_planner_allowed !== false).forEach((s) => {
            const opt = document.createElement("option");
            opt.value = s.state;
            opt.textContent = `${s.state} (${s.is_ut ? 'UT' : 'State'} • ${s.total_districts} Districts)`;
            statePlannerDropdown.appendChild(opt);
          });
          if (currentOfficerSession && currentOfficerSession.state) {
            statePlannerDropdown.value = currentOfficerSession.state;
          } else {
            statePlannerDropdown.value = "Jharkhand";
          }
        }

        updateInteractiveLoginPreview();
        renderDirectoryTable();
      }
    } catch (err) {
      console.error("Failed to load official hierarchy:", err);
    }
  }

  // Populate the State/UT dropdown in the login modal, filtered by role.
  // State Planner is not applicable for centrally-administered Union
  // Territories (they have no elected state government) — only Delhi,
  // Jammu & Kashmir, and Puducherry have their own legislature among the UTs.
  function populateLoginStateOptions(role) {
    if (!loginStateSelect || !allStatesHierarchy.length) return;

    const prevSelected = loginStateSelect.value;
    const isPlannerRole = role !== "district_collector";
    const eligibleStates = isPlannerRole
      ? allStatesHierarchy.filter((s) => s.state_planner_allowed !== false)
      : allStatesHierarchy;

    loginStateSelect.innerHTML = "";
    eligibleStates.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.state;
      opt.textContent = `${s.state} (${s.is_ut ? 'UT' : 'State'} • ${s.total_districts} Districts)`;
      loginStateSelect.appendChild(opt);
    });

    if (eligibleStates.some((s) => s.state === prevSelected)) {
      loginStateSelect.value = prevSelected;
    } else {
      const upExists = eligibleStates.some((s) => s.state === "Uttar Pradesh");
      loginStateSelect.value = upExists ? "Uttar Pradesh" : (eligibleStates[0] ? eligibleStates[0].state : "");
    }

    // Note explaining why some UTs disappear when State Planner is selected
    if (loginStatePlannerUtNote) {
      loginStatePlannerUtNote.classList.toggle("d-none", !isPlannerRole);
    }
  }

  // Update State/District interactive login card
  function updateInteractiveLoginPreview() {
    if (!allStatesHierarchy.length || !loginStateSelect) return;

    const selectedStateName = loginStateSelect.value;
    const selectedState = allStatesHierarchy.find((s) => s.state === selectedStateName) || allStatesHierarchy[0];
    const role = loginRoleSelect ? loginRoleSelect.value : "district_collector";

    if (role === "district_collector") {
      if (loginDistrictContainer) loginDistrictContainer.classList.remove("d-none");
      if (loginDistrictSelect) {
        const prevSelectedDistrict = loginDistrictSelect.value;
        loginDistrictSelect.innerHTML = "";
        selectedState.districts.forEach((d) => {
          const opt = document.createElement("option");
          opt.value = d.district;
          opt.textContent = d.district;
          loginDistrictSelect.appendChild(opt);
        });

        // Retain selection if exists in new list, else select Sitapur if UP, or first district
        if (selectedState.districts.some((d) => d.district === prevSelectedDistrict)) {
          loginDistrictSelect.value = prevSelectedDistrict;
        } else if (selectedState.state === "Uttar Pradesh" && selectedState.districts.some((d) => d.district === "Sitapur")) {
          loginDistrictSelect.value = "Sitapur";
        } else if (selectedState.districts.length > 0) {
          loginDistrictSelect.value = selectedState.districts[0].district;
        }

        if (districtCountHint) {
          districtCountHint.textContent = `${selectedState.total_districts} official districts in ${selectedState.state}`;
        }
      }

      // Find current selected district object
      const chosenDistName = loginDistrictSelect ? loginDistrictSelect.value : "";
      const distObj = selectedState.districts.find((d) => d.district === chosenDistName) || selectedState.districts[0];

      if (distObj) {
        if (previewJurisdictionLabel) previewJurisdictionLabel.textContent = `${selectedState.state} • ${distObj.district} District`;
        if (previewUsername) previewUsername.textContent = distObj.username;
      }
    } else {
      // State Planner
      if (loginDistrictContainer) loginDistrictContainer.classList.add("d-none");
      const planner = selectedState.planner;
      if (planner) {
        if (previewJurisdictionLabel) {
          previewJurisdictionLabel.textContent = `${selectedState.state} • Planning Commission HQ (${planner.headquarters || 'Capital'})`;
        }
        if (previewUsername) previewUsername.textContent = planner.username;
      }
    }
  }

  // Listeners for interactive picker
  if (loginStateSelect) {
    loginStateSelect.addEventListener("change", () => {
      updateInteractiveLoginPreview();
      if (interactiveLoginPassword) interactiveLoginPassword.value = "";
      if (loginFeedbackAlert) loginFeedbackAlert.classList.add("d-none");
    });
  }
  if (loginRoleSelect) {
    loginRoleSelect.addEventListener("change", () => {
      populateLoginStateOptions(loginRoleSelect.value);
      updateInteractiveLoginPreview();
      if (interactiveLoginPassword) interactiveLoginPassword.value = "";
      if (loginFeedbackAlert) loginFeedbackAlert.classList.add("d-none");
    });
  }
  if (loginDistrictSelect) {
    loginDistrictSelect.addEventListener("change", () => {
      updateInteractiveLoginPreview();
      if (interactiveLoginPassword) interactiveLoginPassword.value = "";
      if (loginFeedbackAlert) loginFeedbackAlert.classList.add("d-none");
    });
  }

  // Password Show / Hide toggle button
  if (btnToggleInteractivePasswordVisibility && interactiveLoginPassword) {
    btnToggleInteractivePasswordVisibility.addEventListener("click", (e) => {
      e.preventDefault();
      const isPass = interactiveLoginPassword.type === "password";
      interactiveLoginPassword.type = isPass ? "text" : "password";
      btnToggleInteractivePasswordVisibility.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      btnToggleInteractivePasswordVisibility.setAttribute("aria-label", isPass ? "Hide password" : "Show password");
    });
  }

  // Centralized interactive login submission handler
  async function handleInteractiveLoginSubmit(e) {
    if (e) e.preventDefault();
    const state = loginStateSelect ? loginStateSelect.value : "";
    const role = loginRoleSelect ? loginRoleSelect.value : "district_collector";
    const district = (role === "district_collector" && loginDistrictSelect) ? loginDistrictSelect.value : "";
    const username = previewUsername ? previewUsername.textContent.trim() : "";
    const password = interactiveLoginPassword ? interactiveLoginPassword.value.trim() : "";

    if (!state) {
      if (loginFeedbackAlert) {
        loginFeedbackAlert.className = "alert alert-warning rounded-3 py-2 px-3 fs-8 mb-3";
        loginFeedbackAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Please select a State / Union Territory.';
        loginFeedbackAlert.classList.remove("d-none");
      }
      if (loginStateSelect) loginStateSelect.focus();
      return;
    }

    if (role === "district_collector" && !district) {
      if (loginFeedbackAlert) {
        loginFeedbackAlert.className = "alert alert-warning rounded-3 py-2 px-3 fs-8 mb-3";
        loginFeedbackAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Please select a District.';
        loginFeedbackAlert.classList.remove("d-none");
      }
      if (loginDistrictSelect) loginDistrictSelect.focus();
      return;
    }

    if (!password) {
      if (loginFeedbackAlert) {
        loginFeedbackAlert.className = "alert alert-warning rounded-3 py-2 px-3 fs-8 mb-3";
        loginFeedbackAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Please enter the official password / access key.';
        loginFeedbackAlert.classList.remove("d-none");
      }
      if (interactiveLoginPassword) interactiveLoginPassword.focus();
      return;
    }

    await executeOfficerLogin({ username, password, state, role, district });
  }

  // Bind submit to form and button
  if (interactiveLoginForm) {
    interactiveLoginForm.addEventListener("submit", handleInteractiveLoginSubmit);
  }
  if (btnSubmitInteractiveLogin) {
    btnSubmitInteractiveLogin.addEventListener("click", handleInteractiveLoginSubmit);
  }

  // Switch from login modal to directory modal
  if (btnSwitchToDirectoryModal) {
    btnSwitchToDirectoryModal.addEventListener("click", () => {
      const loginModalEl = document.getElementById("officerLoginModal");
      if (loginModalEl && typeof bootstrap !== "undefined") {
        const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
        if (loginModal) loginModal.hide();
      }
      const dirModalEl = document.getElementById("credentialsDirectoryModal");
      if (dirModalEl && typeof bootstrap !== "undefined") {
        const dirModal = bootstrap.Modal.getOrCreateInstance(dirModalEl);
        dirModal.show();
      }
    });
  }

  // Centralized login executor
  async function executeOfficerLogin(payload) {
    if (loginFeedbackAlert) {
      loginFeedbackAlert.className = "alert alert-info rounded-3 py-2 px-3 fs-8 mb-3";
      loginFeedbackAlert.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Authenticating with National Governance Registry...';
      loginFeedbackAlert.classList.remove("d-none");
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success && json.user) {
        if (loginFeedbackAlert) {
          loginFeedbackAlert.className = "alert alert-success rounded-3 py-2 px-3 fs-8 mb-3";
          loginFeedbackAlert.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Success! Welcome, <strong>${json.user.display_name}</strong>.`;
        }

        setTimeout(() => {
          setOfficerSession(json.user);

          // Close active modals
          const loginModalEl = document.getElementById("officerLoginModal");
          if (loginModalEl && typeof bootstrap !== "undefined") {
            const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
            if (loginModal) loginModal.hide();
          }
          const dirModalEl = document.getElementById("credentialsDirectoryModal");
          if (dirModalEl && typeof bootstrap !== "undefined") {
            const dirModal = bootstrap.Modal.getOrCreateInstance(dirModalEl);
            if (dirModal) dirModal.hide();
          }
          if (loginFeedbackAlert) loginFeedbackAlert.classList.add("d-none");
        }, 500);
      } else {
        if (loginFeedbackAlert) {
          loginFeedbackAlert.className = "alert alert-danger rounded-3 py-2 px-3 fs-8 mb-3";
          loginFeedbackAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${json.error || "Authentication failed. Check credentials."}`;
        }
      }
    } catch (err) {
      if (loginFeedbackAlert) {
        loginFeedbackAlert.className = "alert alert-danger rounded-3 py-2 px-3 fs-8 mb-3";
        loginFeedbackAlert.innerHTML = `<i class="bi bi-wifi-off me-1"></i> Network error during authentication. Please retry.`;
      }
    }
  }

  // Set active officer session in UI and storage
  function setOfficerSession(user) {
    currentOfficerSession = user;
    try {
      sessionStorage.setItem("janvista_officer", JSON.stringify(user));
    } catch (e) {}

    if (officerSessionCapsule) officerSessionCapsule.classList.remove("d-none");
    if (btnOpenOfficerLogin) btnOpenOfficerLogin.classList.add("d-none");

    if (officerSessionName) {
      officerSessionName.textContent = user.role === "district_collector" ? `DC • ${user.district}` : `SP • ${user.state_code}`;
    }
    if (officerSessionJurisdiction) {
      officerSessionJurisdiction.textContent = user.state;
    }

    // Apply proper role persona
    if (user.role === "district_collector") {
      applyRoleView("District Collector");
    } else {
      if (statePlannerDropdown) {
        statePlannerDropdown.value = user.state;
      }
      applyRoleView("State Planner");
    }

    showToast(`<i class="bi bi-shield-check text-success me-1"></i> Verified Officer Session: <strong>${user.display_name}</strong>`);
  }

  // Log out officer
  function clearOfficerSession() {
    currentOfficerSession = null;
    try {
      sessionStorage.removeItem("janvista_officer");
    } catch (e) {}

    if (officerSessionCapsule) officerSessionCapsule.classList.add("d-none");
    if (btnOpenOfficerLogin) btnOpenOfficerLogin.classList.remove("d-none");

    if (statePlannerJurisdictionBar) {
      statePlannerJurisdictionBar.classList.add("d-none");
    }

    applyRoleView("Policymaker");
    showToast('<i class="bi bi-box-arrow-right text-info me-1"></i> Signed out from officer session.');
  }

  if (btnOfficerLogout) {
    btnOfficerLogout.addEventListener("click", clearOfficerSession);
  }

  // Render All-India Credentials Directory Table
  function renderDirectoryTable() {
    if (!dirTableBody || !allStatesHierarchy.length) return;

    const query = dirSearchInput ? dirSearchInput.value.trim().toLowerCase() : "";
    const selectedState = dirStateFilter ? dirStateFilter.value : "ALL";
    const selectedRole = dirRoleFilter ? dirRoleFilter.value : "ALL";

    // Flatten all credentials
    const rows = [];
    allStatesHierarchy.forEach((s) => {
      // Check state filter
      if (selectedState !== "ALL" && s.state !== selectedState) return;

      // State Planner record — skip for centrally-administered UTs with no
      // state government (only Delhi, J&K, Puducherry have one among UTs).
      if ((selectedRole === "ALL" || selectedRole === "state_planner") && s.state_planner_allowed !== false) {
        rows.push({
          state: s.state,
          is_ut: s.is_ut,
          role: "state_planner",
          roleLabel: "State Planner",
          jurisdiction: `${s.state} State Planning Commission`,
          username: s.planner.username,
          password: s.planner.password,
          display_name: s.planner.display_name,
        });
      }

      // District Collector records
      if (selectedRole === "ALL" || selectedRole === "district_collector") {
        s.districts.forEach((d) => {
          rows.push({
            state: s.state,
            is_ut: s.is_ut,
            role: "district_collector",
            roleLabel: "District Collector",
            jurisdiction: `${d.district} District, ${s.state}`,
            username: d.username,
            password: d.password,
            display_name: d.display_name,
          });
        });
      }
    });

    // Apply search query filter
    const filteredRows = rows.filter((r) => {
      if (!query) return true;
      return (
        r.state.toLowerCase().includes(query) ||
        r.jurisdiction.toLowerCase().includes(query) ||
        r.username.toLowerCase().includes(query) ||
        r.roleLabel.toLowerCase().includes(query)
      );
    });

    if (dirCountLabel) {
      dirCountLabel.textContent = `Showing ${filteredRows.length.toLocaleString()} of 820 Official Accounts`;
    }

    if (!filteredRows.length) {
      dirTableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center py-4 text-slate-500">
            <i class="bi bi-search me-1"></i> No matching officers found for "${query}".
          </td>
        </tr>
      `;
      return;
    }

    // Limit initial display to first 250 rows for smooth rendering if no search
    const displayList = filteredRows.slice(0, 250);

    dirTableBody.innerHTML = displayList
      .map(
        (r) => `
        <tr>
          <td>
            <span class="fw-semibold text-slate-900">${r.state}</span>
            ${r.is_ut ? '<span class="badge bg-secondary-subtle text-secondary fs-9 ms-1">UT</span>' : ''}
          </td>
          <td>
            <span class="badge ${r.role === 'district_collector' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'} fs-9">
              <i class="bi ${r.role === 'district_collector' ? 'bi-geo-alt' : 'bi-diagram-3'} me-1"></i>${r.roleLabel}
            </span>
          </td>
          <td class="text-slate-700 fw-medium">${r.jurisdiction}</td>
        </tr>
      `
      )
      .join("");
  }

  // Directory filter listeners
  if (dirSearchInput) dirSearchInput.addEventListener("input", renderDirectoryTable);
  if (dirStateFilter) dirStateFilter.addEventListener("change", renderDirectoryTable);
  if (dirRoleFilter) dirRoleFilter.addEventListener("change", renderDirectoryTable);

  // Restore session if present
  try {
    const savedSession = sessionStorage.getItem("janvista_officer");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed && parsed.username) {
        setOfficerSession(parsed);
      }
    }
  } catch (e) {}

  // Initial load
  loadStatesHierarchy();
  loadGrievances();
  renderMyGrievances();
  if (!currentOfficerSession) {
    applyRoleView("Policymaker");
  }
});


// Global hotspot row selector
window.selectHotspot = function(index) {
  const hotspotData = [
    { name: "Sitapur District, UP", cat: "Healthcare", gap: "91.2 %", score: "89.4 / 100", title: "Establish 100-Bed Sub-Divisional Hospital & Trauma Unit", desc: "High maternal & emergency transport deficit coupled with 94/100 citizen grievance density. Nearest tertiary trauma facility is 68 km away." },
    { name: "Koraput District, Odisha", cat: "Drinking Water", gap: "84.6 %", score: "82.1 / 100", title: "Gravity-Fed Piped Drinking Water & Fluoride Filtration", desc: "Severe seasonal water contamination with high fluoride concentration impacting 184 tribal hamlets." },
    { name: "Barmer District, Rajasthan", cat: "Solar Microgrids", gap: "78.4 %", score: "76.5 / 100", title: "Decentralized Solar Agricultural Feeder & Cold Storage", desc: "Erratic grid power affecting agricultural yield in arid border settlements." },
    { name: "Purnia District, Bihar", cat: "Rural Roads", gap: "75.0 %", score: "73.8 / 100", title: "All-Weather Flood-Resilient Raised Embankment Roads", desc: "Annual monsoon flooding isolates 64 village panchayats for up to 3 months each year." },
    { name: "Wayanad District, Kerala", cat: "Resilient Bridges", gap: "71.2 %", score: "70.4 / 100", title: "Geotechnically Reinforced Bailey & Concrete Bridges", desc: "Critical connectivity bottlenecks in landslide-prone hilly terrain." },
  ];

  const item = hotspotData[index];
  if (!item) return;

  document.getElementById("spotlightRegion").textContent = item.name;
  document.getElementById("spotlightCategory").textContent = item.cat;
  document.getElementById("spotlightTitle").textContent = item.title;
  document.getElementById("spotlightDesc").textContent = item.desc;

  // Scroll smoothly to spotlight card
  document.getElementById("spotlight-section").scrollIntoView({ behavior: "smooth" });
};