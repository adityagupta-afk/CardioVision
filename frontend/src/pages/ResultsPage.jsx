import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import RiskGauge from '../components/RiskGauge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!result) {
    return (
      <div className="results-page">
        <Navbar />
        <div className="no-result-container">
          <div className="no-result-card">
            <span className="no-result-icon">📋</span>
            <h2>No Assessment Data Found</h2>
            <p>Please complete a cardiovascular risk assessment to view your results.</p>
            <Link to="/assess" className="btn btn-primary">Start Assessment →</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { overallRisk, riskCategory, riskColor, riskDescription, cadRisk, cadCategory } = result;

  // Get the factors from the prediction service (already sorted by risk)
  const highRiskFactors = result.highRiskFactors || [];
  const moderateRiskFactors = result.moderateRiskFactors || [];
  const lowRiskFactors = result.lowRiskFactors || [];

  const FactorCard = ({ factor }) => {
    let levelClass = 'low';
    let barColor = '#22c55e';
    if (factor.score >= 0.6) {
      levelClass = 'high';
      barColor = '#ef4444';
    } else if (factor.score >= 0.3) {
      levelClass = 'moderate';
      barColor = '#eab308';
    }

    return (
      <div className={`factor-card level-${levelClass}`}>
        <div className="factor-header">
          <span className="factor-icon">{factor.icon}</span>
          <div className="factor-info">
            <span className="factor-name">{factor.name}</span>
            <span className="factor-value">{factor.value}</span>
          </div>
        </div>
        <div className="factor-bar-bg">
          <div
            className="factor-bar-fill"
            style={{
              width: `${Math.round(factor.score * 100)}%`,
              backgroundColor: barColor,
            }}
          ></div>
        </div>
        <span className="factor-score">{Math.round(factor.score * 100)}% contribution</span>
      </div>
    );
  };

  return (
    <div className="results-page">
      <Navbar />
      <main className="results-main">
        <div className="results-header">
          <div className="header-content">
            <h1>Cardiovascular Risk Assessment Report</h1>
            <p className="timestamp">
              Generated: {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="results-container">
          {/* Risk Summary */}
          <section className="summary-section">
            <div className="summary-card main-gauge-card">
              <h3>Overall Cardiovascular Risk</h3>
              <div className="gauge-container">
                <RiskGauge
                  percentage={overallRisk}
                  label="Overall Risk"
                  color={riskColor}
                  size={240}
                />
              </div>
              <div className="risk-badge-container">
                <span className="risk-badge" style={{ backgroundColor: riskColor }}>
                  {riskCategory}
                </span>
                <p className="risk-description">{riskDescription}</p>
              </div>
            </div>

            <div className="summary-card secondary-gauge-card">
              <h3>Coronary Artery Disease Risk</h3>
              <div className="gauge-container small">
                <RiskGauge
                  percentage={cadRisk}
                  label="CAD Risk"
                  color={cadRisk >= 50 ? '#ef4444' : cadRisk >= 25 ? '#eab308' : '#22c55e'}
                  size={160}
                />
              </div>
              <span
                className="cad-badge"
                style={{
                  color: cadRisk >= 50 ? '#ef4444' : cadRisk >= 25 ? '#eab308' : '#22c55e',
                }}
              >
                {cadCategory} Risk
              </span>
              <p className="secondary-risk-text">
                Specific probability indicator for obstructive coronary artery disease
                based on exercise tests, ECG, and fluoroscopy data.
              </p>
            </div>
          </section>

          {/* Risk Factor Breakdown */}
          <section className="factors-section">
            <h2>Risk Factor Breakdown</h2>

            {highRiskFactors.length > 0 && (
              <div className="factor-group">
                <h3 className="group-title title-high">
                  <span className="group-dot dot-high"></span>
                  High Risk Factors ({highRiskFactors.length})
                </h3>
                <div className="factor-grid">
                  {highRiskFactors.map((f, i) => (
                    <FactorCard key={i} factor={f} />
                  ))}
                </div>
              </div>
            )}

            {moderateRiskFactors.length > 0 && (
              <div className="factor-group">
                <h3 className="group-title title-moderate">
                  <span className="group-dot dot-moderate"></span>
                  Moderate Risk Factors ({moderateRiskFactors.length})
                </h3>
                <div className="factor-grid">
                  {moderateRiskFactors.map((f, i) => (
                    <FactorCard key={i} factor={f} />
                  ))}
                </div>
              </div>
            )}

            {lowRiskFactors.length > 0 && (
              <div className="factor-group">
                <h3 className="group-title title-low">
                  <span className="group-dot dot-low"></span>
                  Low Risk Factors ({lowRiskFactors.length})
                </h3>
                <div className="factor-grid">
                  {lowRiskFactors.map((f, i) => (
                    <FactorCard key={i} factor={f} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Actions */}
          <section className="actions-section no-print">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/visualize', { state: { result } })}
            >
              🫀 View 3D Visualization
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/assess')}
            >
              📋 New Assessment
            </button>
            <button className="btn btn-outline" onClick={() => window.print()}>
              🖨️ Print Report
            </button>
          </section>

          {/* Disclaimer */}
          <section className="disclaimer-section">
            <div className="disclaimer-box">
              <span className="disclaimer-icon">⚠️</span>
              <div>
                <strong>Important Disclaimer</strong>
                <p>{result.disclaimer}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsPage;
