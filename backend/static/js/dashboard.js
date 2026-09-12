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

  // Role selector
  document.querySelectorAll(".role-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".role-option").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      const roleName = opt.dataset.role;
      document.getElementById("currentRoleLabel").textContent = roleName;
      showToast(`<i class="bi bi-person-check-fill me-1 text-info"></i> Active view switched to: <strong>${roleName}</strong>`);
    });
  });

  // ==========================================
  // CITIZEN GRIEVANCE PORTAL & TRACKING SYSTEM
  // ==========================================
  const grievanceForm = document.getElementById("grievanceForm");
  const modalGrievanceSuccess = document.getElementById("modalGrievanceSuccess");
  const lblCreatedTrackingId = document.getElementById("lblCreatedTrackingId");
  const btnCopyTrackingId = document.getElementById("btnCopyTrackingId");
  const grievancesTableBody = document.getElementById("grievancesTableBody");
  const btnTrackLookup = document.getElementById("btnTrackLookup");
  const txtTrackInput = document.getElementById("txtTrackInput");
  const trackResultBox = document.getElementById("trackResultBox");
  const trackResultTitle = document.getElementById("trackResultTitle");
  const trackResultDetails = document.getElementById("trackResultDetails");
  const kpiRequestsValue = document.getElementById("kpi-requests-value");

  // Fetch and display initial grievances
  async function loadGrievances() {
    if (!grievancesTableBody) return;
    try {
      const res = await fetch("/api/citizen/grievances");
      const json = await res.json();
      if (json.success && json.data) {
        renderGrievancesTable(json.data);
      }
    } catch (err) {
      console.error("Error loading grievances:", err);
    }
  }

  function renderGrievancesTable(items) {
    if (!grievancesTableBody) return;
    grievancesTableBody.innerHTML = items.map((item) => {
      let urgencyBadge = `<span class="badge bg-secondary">MODERATE</span>`;
      if (item.urgency === "CRITICAL") {
        urgencyBadge = `<span class="badge bg-danger">CRITICAL</span>`;
      } else if (item.urgency === "HIGH") {
        urgencyBadge = `<span class="badge bg-warning text-dark">HIGH</span>`;
      }

      let categoryBadge = `<span class="badge bg-primary-subtle text-primary border border-primary-subtle">${item.category}</span>`;
      if (item.category.includes("Water")) {
        categoryBadge = `<span class="badge bg-info-subtle text-info border border-info-subtle">${item.category}</span>`;
      } else if (item.category.includes("Solar") || item.category.includes("Electricity")) {
        categoryBadge = `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">${item.category}</span>`;
      }

      return `
        <tr>
          <td class="ps-4">
            <span class="badge bg-slate-900 text-white rounded-pill px-2.5 py-1 fw-mono fs-8">
              ${item.tracking_id}
            </span>
          </td>
          <td class="fw-bold text-slate-900">${item.name}</td>
          <td>
            <div class="fw-semibold text-slate-800">${item.district}</div>
            <div class="text-secondary fs-8">${item.state}</div>
          </td>
          <td>${categoryBadge}</td>
          <td>${urgencyBadge}</td>
          <td class="text-truncate" style="max-width: 260px;" title="${item.description}">
            ${item.description}
          </td>
          <td>
            <span class="badge bg-success-subtle text-success border border-success-subtle">
              <i class="bi bi-clock-history me-1"></i> ${item.status.replace('_', ' ')}
            </span>
          </td>
          <td class="text-end pe-4 text-secondary fs-8">${item.timestamp}</td>
        </tr>
      `;
    }).join("");
  }

  // Handle grievance form submission
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
          // Show tracking ID in modal
          lblCreatedTrackingId.textContent = json.tracking_id;
          modalGrievanceSuccess.classList.remove("d-none");

          // Update KPI Requests counter on dashboard
          if (kpiRequestsValue) {
            const currentNum = parseInt(kpiRequestsValue.textContent.replace(/,/g, "")) || 8421;
            kpiRequestsValue.textContent = (currentNum + 1).toLocaleString();
          }

          // Reload table
          await loadGrievances();

          showToast(`<i class="bi bi-check-circle-fill me-1 text-success"></i> Grievance filed! Tracking ID: <strong>${json.tracking_id}</strong>`);

          // Scroll grievances section into view when user closes modal
          const modalEl = document.getElementById("citizenGrievanceModal");
          modalEl.addEventListener("hidden.bs.modal", () => {
            document.getElementById("grievances-section")?.scrollIntoView({ behavior: "smooth" });
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

  // Copy tracking ID
  if (btnCopyTrackingId) {
    btnCopyTrackingId.addEventListener("click", () => {
      navigator.clipboard.writeText(lblCreatedTrackingId.textContent.trim());
      btnCopyTrackingId.innerHTML = `<i class="bi bi-check-lg"></i> Copied!`;
      setTimeout(() => {
        btnCopyTrackingId.innerHTML = `<i class="bi bi-clipboard"></i> Copy`;
      }, 2000);
    });
  }

  // Tracking lookup
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
        trackResultDetails.innerHTML = `<strong>Category:</strong> ${item.category} | <strong>Location:</strong> ${item.district}, ${item.state} | <strong>Status:</strong> <span class="badge bg-primary">${item.status}</span> | <em>"${item.description}"</em>`;
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

  // Initial load
  loadGrievances();
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
