import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
          <p className="eyebrow">CARDIOVASCULAR HEALTH</p>
          <h1>
            Understand your heart.
            <br />
            <span className="highlight">Visualize your risk.</span>
          </h1>
          <p className="description">
            Explore your cardiovascular health through intelligent risk assessment
            and interactive 3D visualization. Powered by clinically-validated
            risk factors from the Framingham and ASCVD methodologies.
          </p>
          <button className="start-button" onClick={() => navigate('/assess')}>
            Get Started
            <span className="arrow">→</span>
          </button>
        </div>

        <div className="hero-visual">
          <div className="visual-circle">
            <div className="heart-container">
              <div className="heart-icon">♥</div>
              <div className="pulse-ring pulse-ring-1"></div>
              <div className="pulse-ring pulse-ring-2"></div>
              <div className="pulse-ring pulse-ring-3"></div>
            </div>
          </div>
          <div className="floating-badge badge-1">
            <span className="badge-icon">📊</span>
            <span>Risk Analysis</span>
          </div>
          <div className="floating-badge badge-2">
            <span className="badge-icon">🫀</span>
            <span>3D Model</span>
          </div>
          <div className="floating-badge badge-3">
            <span className="badge-icon">⚡</span>
            <span>Instant</span>
          </div>
        </div>
      </main>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat">
            <span className="stat-number">13+</span>
            <span className="stat-label">Risk Factors Analyzed</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">3D</span>
            <span className="stat-label">Heart Visualization</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">&lt;2s</span>
            <span className="stat-label">Instant Analysis</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">5</span>
            <span className="stat-label">Risk Categories</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <p className="section-eyebrow">TRUSTED FEATURES</p>
          <h2 className="section-title">Everything you need to assess cardiac health</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📊</span>
              </div>
              <h3>Clinical-Grade Analysis</h3>
              <p>
                Uses 13+ validated cardiovascular risk factors from the Cleveland
                Heart Disease dataset, Framingham Risk Score, and ACC/AHA ASCVD
                guidelines to provide comprehensive risk assessment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🫀</span>
              </div>
              <h3>3D Heart Visualization</h3>
              <p>
                Interactive 3D anatomical heart model that visually maps your
                risk assessment. Rotate, zoom, and explore cardiovascular regions
                with risk-based color coding.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚡</span>
              </div>
              <h3>Instant Results</h3>
              <p>
                Real-time cardiovascular risk prediction with detailed factor
                breakdown. Understand which clinical indicators contribute most
                to your overall risk profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <p className="section-eyebrow">HOW IT WORKS</p>
          <h2 className="section-title">Four simple steps to understand your heart</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Enter Clinical Data</h3>
                <p>
                  Input your physiological and clinical measurements including
                  blood pressure, cholesterol, heart rate, ECG results, and
                  cardiac symptoms.
                </p>
              </div>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>AI-Powered Analysis</h3>
                <p>
                  Our prediction engine processes your data using weighted
                  clinical scoring algorithms derived from established
                  cardiovascular research and datasets.
                </p>
              </div>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Risk Assessment</h3>
                <p>
                  Receive a comprehensive risk breakdown showing overall
                  cardiovascular risk, coronary artery disease probability,
                  and individual factor contributions.
                </p>
              </div>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>3D Visualization</h3>
                <p>
                  Explore an interactive 3D heart model with risk-based
                  coloring that helps you visually understand your
                  cardiovascular health status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-content">
              <p className="section-eyebrow">ABOUT CARDIOVISION</p>
              <h2 className="section-title">
                Making cardiovascular risk
                <br />
                <span className="highlight">visible and understandable</span>
              </h2>
              <p className="about-text">
                CardioVision is an innovative cardiovascular risk visualization
                system developed to bridge the gap between clinical data and
                patient understanding. By combining validated risk assessment
                methodologies with interactive 3D visualization, we make complex
                cardiac health information accessible and actionable.
              </p>
              <p className="about-text">
                Our system analyzes 13+ clinical risk factors — including blood
                pressure, cholesterol levels, ECG results, exercise stress test
                data, and coronary fluoroscopy findings — to generate a
                comprehensive cardiovascular risk profile.
              </p>

              <div className="about-disclaimer">
                <span className="disclaimer-icon">ℹ️</span>
                <p>
                  CardioVision is designed for educational and demonstration
                  purposes only. It is not a substitute for professional medical
                  advice, diagnosis, or treatment. Always consult a qualified
                  healthcare provider.
                </p>
              </div>
            </div>

            <div className="about-factors">
              <h3>Clinical Factors Analyzed</h3>
              <div className="factors-list">
                {[
                  { name: 'Age & Demographics', icon: '👤' },
                  { name: 'Blood Pressure', icon: '🩺' },
                  { name: 'Serum Cholesterol', icon: '🧪' },
                  { name: 'Fasting Blood Sugar', icon: '🩸' },
                  { name: 'Resting ECG', icon: '📋' },
                  { name: 'Max Heart Rate', icon: '❤️' },
                  { name: 'Exercise Angina', icon: '🏃' },
                  { name: 'ST Depression', icon: '📈' },
                  { name: 'ST Slope', icon: '📊' },
                  { name: 'Chest Pain Type', icon: '💔' },
                  { name: 'Major Vessels', icon: '🫀' },
                  { name: 'Nuclear Stress Test', icon: '🔬' },
                ].map((factor, i) => (
                  <div className="factor-item" key={i}>
                    <span className="factor-icon">{factor.icon}</span>
                    <span>{factor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2>Ready to understand your heart?</h2>
          <p>
            Start your cardiovascular risk assessment in just a few minutes.
            Enter your clinical data and get instant results with 3D visualization.
          </p>
          <button className="cta-button" onClick={() => navigate('/assess')}>
            Start Assessment
            <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
