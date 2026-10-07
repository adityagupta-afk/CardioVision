# CardioVision 🫀

**Interactive 3D Cardiovascular Risk Visualization & Prediction System**

> Built for Track A: Cardiovascular Risk Visualization & Prediction Hackathon Challenge

CardioVision is an interactive web application that predicts coronary artery disease and overall cardiac risk from patient physiological and clinical data, mapping predictions onto an interactive 3D human anatomical heart model.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=threedotjs)

## ✨ Features

- **13+ Clinical Risk Factors** — Comprehensive cardiovascular assessment using validated parameters from the Cleveland Heart Disease dataset
- **Clinically-Informed Prediction** — Weighted scoring algorithm based on Framingham Risk Score, ACC/AHA ASCVD guidelines
- **Interactive 3D Heart Model** — Real-time 3D visualization with risk-based color coding using Three.js / React Three Fiber
- **Professional Results Dashboard** — Detailed risk factor breakdown with visual indicators
- **Sample Patient Profiles** — Pre-loaded Low, Moderate, and High risk demo profiles
- **Responsive Design** — Works on desktop, tablet, and mobile

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Frontend UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router** | Client-side routing |
| **Three.js** | 3D rendering engine |
| **React Three Fiber** | React renderer for Three.js |
| **@react-three/drei** | Three.js helpers & controls |

## 📋 Clinical Factors Analyzed

| Category | Parameters |
|----------|-----------|
| Demographics | Age, Sex |
| Vital Signs | Resting Blood Pressure, Max Heart Rate |
| Blood Tests | Serum Cholesterol, Fasting Blood Sugar |
| Cardiac Symptoms | Chest Pain Type, Exercise-Induced Angina |
| ECG & Exercise | Resting ECG, ST Depression (Oldpeak), ST Slope |
| Advanced Diagnostics | Major Vessels (Fluoroscopy), Nuclear Stress Test (Thallium-201) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CardioVision.git
cd CardioVision/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx          # Sticky navigation with mobile menu
│   ├── RiskGauge.jsx       # Animated SVG risk gauge
│   ├── FormSection.jsx     # Reusable form section wrapper
│   └── Footer.jsx          # Branded footer
├── pages/
│   ├── LandingPage.jsx     # Hero, features, how-it-works
│   ├── AssessmentPage.jsx  # 13-field clinical data form
│   ├── ResultsPage.jsx     # Risk dashboard & factor breakdown
│   └── VisualizationPage.jsx # Interactive 3D heart model
├── services/
│   └── predictionService.js # Clinically-informed risk scoring
├── App.jsx                  # Route definitions
├── main.jsx                 # Entry point
└── index.css                # Global design tokens
```

## 🔬 How It Works

1. **Enter Clinical Data** — Input physiological and clinical measurements
2. **AI-Powered Analysis** — Weighted scoring algorithm processes your data
3. **Risk Assessment** — Comprehensive breakdown of cardiovascular risk factors
4. **3D Visualization** — Interactive heart model with risk-based coloring

## ⚠️ Disclaimer

> **This application is for educational and demonstration purposes only.** It is not a validated medical diagnostic tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical evaluation.

## 📚 Data Sources & References

- Cleveland Heart Disease Dataset (UCI Machine Learning Repository)
- Framingham Heart Study Risk Score Methodology
- ACC/AHA Pooled Cohort Equations (ASCVD Risk Calculator)
- AHA/ACC Blood Pressure Guidelines (2017)
- ATP III Cholesterol Guidelines

## 👨‍💻 Author

**Aditya Gupta**

---

*Built with ❤️ for the Cardiovascular Risk Visualization & Prediction Hackathon*
