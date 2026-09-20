# JANVISTA AI - Bootstrap Web Application & Flask Backend

A complete Python Flask web application featuring a modern **Bootstrap 5 UI** with interactive buttons, live priority calculation sliders, and modal workflows for the **JANVISTA AI National Infrastructure Dashboard**.

**100% Offline & Deterministic — Zero External API Keys Required.**

---

## 🎨 UI Features (Bootstrap 5)
* **Bootstrap Framework & Components**: Modern Bootstrap 5.3 cards, pill buttons, badges, tables, and modals.
* **Interactive Priority Simulator**: Live range sliders recalculating the 6-factor deterministic formula in real-time.
* **Explainability Breakdown ("Why This?")**: Color-coded progress bars detailing mathematical contributions.
* **Ranked Regional Hotspots**: Interactive table allowing drill-down into district infrastructure gaps.
* **Executive Actions & Modals**: In-principle approval modal with audit logging simulation and PDF/CSV export dialogs.
* **Dual Functionality**: Works both as an interactive **Web Application** (at `http://127.0.0.1:5000/`) AND as a **REST API** for your friend's frontend.

---

## 🚀 How to Run

From the project root:

```powershell
# 1. Activate virtual environment
.\.venv\Scripts\Activate.ps1

# 2. Run the application
python backend\app.py
```

Then open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser!


---

## 📡 Available REST API Endpoints

All endpoints have CORS enabled so your frontend (`http://localhost:3000`) can access them seamlessly.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & API service index |
| `GET` | `/api/dashboard/overview` | **All-in-one dashboard payload**: Banner, 5 KPI cards, Spotlight opportunity, and Hotspots |
| `GET` | `/api/dashboard/kpis` | The 5 primary metric counters |
| `GET` | `/api/dashboard/spotlight` | Highest priority project + "Why This?" explainability breakdown |
| `GET` | `/api/dashboard/hotspots` | Top 5 regional infrastructure hotspots |
| `GET` | `/api/dashboard/pipeline` | The 7-stage national intelligence pipeline |
| `POST` | `/api/calculate-priority` | Dynamic mathematical priority scoring engine |

---

## 🧮 Deterministic Priority Formula (v1.0.0)

$$\text{Priority Score} = (D \times 0.30) + (G \times 0.25) + (V \times 0.15) + (A \times 0.15) + (U \times 0.10) + (M \times 0.05)$$

* **Citizen Demand (30%)**
* **Infrastructure Gap (25%)**
* **Population Vulnerability (15%)**
* **Accessibility Deficit (15%)**
* **Urgency Signal (10%)**
* **Investment Mismatch (5%)**

---

## 🔌 Connecting to Next.js Frontend

Your friend's frontend can fetch data directly:

```javascript
// Example in frontend (Fetch Dashboard Data)
const response = await fetch("http://127.0.0.1:5000/api/dashboard/overview");
const json = await response.json();
console.log(json.data.kpis);
console.log(json.data.spotlight);
```
