import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FormSection from '../components/FormSection';
import { SAMPLE_PATIENTS, predictCardiovascularRisk } from '../services/predictionService';
import './AssessmentPage.css';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    restingBP: '',
    maxHeartRate: '',
    cholesterol: '',
    fastingBS: '',
    chestPainType: '',
    exerciseAngina: '',
    restingECG: '',
    oldpeak: '',
    stSlope: '',
    majorVessels: '',
    thalassemia: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const loadSample = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && SAMPLE_PATIENTS[idx]) {
      const sample = SAMPLE_PATIENTS[idx].data;
      setFormData({
        age: sample.age,
        sex: sample.sex,
        restingBP: sample.restingBP,
        maxHeartRate: sample.maxHeartRate,
        cholesterol: sample.cholesterol,
        fastingBS: sample.fastingBS,
        chestPainType: sample.chestPainType,
        exerciseAngina: sample.exerciseAngina,
        restingECG: sample.restingECG,
        oldpeak: sample.oldpeak,
        stSlope: sample.stSlope,
        majorVessels: sample.majorVessels,
        thalassemia: sample.thalassemia,
      });
      setErrors({});
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.age || formData.age < 20 || formData.age > 100) e.age = 'Age must be between 20 and 100';
    if (!formData.sex) e.sex = 'Please select sex';
    if (!formData.restingBP || formData.restingBP < 80 || formData.restingBP > 220) e.restingBP = 'Must be 80–220 mmHg';
    if (!formData.maxHeartRate || formData.maxHeartRate < 60 || formData.maxHeartRate > 220) e.maxHeartRate = 'Must be 60–220 bpm';
    if (!formData.cholesterol || formData.cholesterol < 100 || formData.cholesterol > 600) e.cholesterol = 'Must be 100–600 mg/dL';
    if (!formData.fastingBS || formData.fastingBS < 60 || formData.fastingBS > 400) e.fastingBS = 'Must be 60–400 mg/dL';
    if (!formData.chestPainType) e.chestPainType = 'Please select chest pain type';
    if (!formData.exerciseAngina) e.exerciseAngina = 'Please specify';
    if (!formData.restingECG) e.restingECG = 'Please select ECG results';
    if (formData.oldpeak === '' || formData.oldpeak < 0 || formData.oldpeak > 6) e.oldpeak = 'Must be 0–6.0 mm';
    if (!formData.stSlope) e.stSlope = 'Please select ST slope';
    if (formData.majorVessels === '') e.majorVessels = 'Please select';
    if (!formData.thalassemia) e.thalassemia = 'Please select';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Convert numeric strings to numbers for the prediction service
      const parsed = {
        ...formData,
        age: Number(formData.age),
        restingBP: Number(formData.restingBP),
        maxHeartRate: Number(formData.maxHeartRate),
        cholesterol: Number(formData.cholesterol),
        fastingBS: Number(formData.fastingBS),
        oldpeak: Number(formData.oldpeak),
        majorVessels: Number(formData.majorVessels),
      };
      setTimeout(() => {
        const result = predictCardiovascularRisk(parsed);
        navigate('/results', { state: { result } });
      }, 1500);
    }
  };

  // Progress calculation
  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter((v) => v !== '' && v !== undefined && v !== null).length;
  const progressPercent = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="assessment-container">
      <Navbar />

      <div className="assessment-content">
        <div className="assessment-header">
          <h1>Cardiovascular Risk Assessment</h1>
          <p>Provide your clinical data for a comprehensive cardiovascular risk profile.</p>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="progress-text">{progressPercent}% Complete</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="assessment-form">
          {/* Patient Demographics */}
          <FormSection title="Patient Demographics" icon="👤">
            <div className="form-grid">
              <div className="form-group">
                <label>Age <span className="unit">(years)</span></label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="20" max="100" step="1"
                  placeholder="e.g. 55"
                />
                <span className="reference-text">Cleveland dataset range: 29–77 years</span>
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.sex && <span className="error-text">{errors.sex}</span>}
              </div>
            </div>
          </FormSection>

          {/* Vital Signs */}
          <FormSection title="Vital Signs" icon="🩺">
            <div className="form-grid">
              <div className="form-group">
                <label>Resting Blood Pressure <span className="unit">(mmHg)</span></label>
                <input
                  type="number"
                  name="restingBP"
                  value={formData.restingBP}
                  onChange={handleChange}
                  min="80" max="220"
                  placeholder="e.g. 120"
                />
                <span className="reference-text">Normal: &lt;120 | Elevated: 120–129 | Stage 1: 130–139 | Stage 2: ≥140</span>
                {errors.restingBP && <span className="error-text">{errors.restingBP}</span>}
              </div>
              <div className="form-group">
                <label>Max Heart Rate Achieved <span className="unit">(bpm)</span></label>
                <input
                  type="number"
                  name="maxHeartRate"
                  value={formData.maxHeartRate}
                  onChange={handleChange}
                  min="60" max="220"
                  placeholder="e.g. 150"
                />
                <span className="reference-text">Age-predicted max: 220 − age. Target: ≥85% of max.</span>
                {errors.maxHeartRate && <span className="error-text">{errors.maxHeartRate}</span>}
              </div>
            </div>
          </FormSection>

          {/* Blood Tests */}
          <FormSection title="Blood Tests" icon="🩸">
            <div className="form-grid">
              <div className="form-group">
                <label>Serum Cholesterol <span className="unit">(mg/dL)</span></label>
                <input
                  type="number"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  min="100" max="600"
                  placeholder="e.g. 190"
                />
                <span className="reference-text">Desirable: &lt;200 | Borderline: 200–239 | High: ≥240</span>
                {errors.cholesterol && <span className="error-text">{errors.cholesterol}</span>}
              </div>
              <div className="form-group">
                <label>Fasting Blood Sugar <span className="unit">(mg/dL)</span></label>
                <input
                  type="number"
                  name="fastingBS"
                  value={formData.fastingBS}
                  onChange={handleChange}
                  min="60" max="400"
                  placeholder="e.g. 95"
                />
                <span className="reference-text">Normal: &lt;100 | Pre-diabetic: 100–125 | Diabetic: ≥126</span>
                {errors.fastingBS && <span className="error-text">{errors.fastingBS}</span>}
              </div>
            </div>
          </FormSection>

          {/* Cardiac Symptoms */}
          <FormSection title="Cardiac Symptoms" icon="🫀">
            <div className="form-grid">
              <div className="form-group">
                <label>Chest Pain Type</label>
                <select name="chestPainType" value={formData.chestPainType} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="typical">Typical Angina — substernal discomfort with exertion</option>
                  <option value="atypical">Atypical Angina — meets 2 of 3 classic criteria</option>
                  <option value="nonAnginal">Non-Anginal Pain — musculoskeletal / GI origin</option>
                  <option value="asymptomatic">Asymptomatic — no chest pain symptoms</option>
                </select>
                {errors.chestPainType && <span className="error-text">{errors.chestPainType}</span>}
              </div>
              <div className="form-group">
                <label>Exercise-Induced Angina</label>
                <div className="radio-group">
                  <label className={`radio-card ${formData.exerciseAngina === 'yes' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="exerciseAngina"
                      value="yes"
                      checked={formData.exerciseAngina === 'yes'}
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label className={`radio-card ${formData.exerciseAngina === 'no' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="exerciseAngina"
                      value="no"
                      checked={formData.exerciseAngina === 'no'}
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
                {errors.exerciseAngina && <span className="error-text">{errors.exerciseAngina}</span>}
              </div>
            </div>
          </FormSection>

          {/* ECG & Exercise Results */}
          <FormSection title="ECG & Exercise Results" icon="📈">
            <div className="form-grid">
              <div className="form-group">
                <label>Resting ECG Results</label>
                <select name="restingECG" value={formData.restingECG} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="normal">Normal</option>
                  <option value="stAbnormality">ST-T Wave Abnormality</option>
                  <option value="lvh">Left Ventricular Hypertrophy (LVH)</option>
                </select>
                {errors.restingECG && <span className="error-text">{errors.restingECG}</span>}
              </div>
              <div className="form-group">
                <label>ST Depression / Oldpeak <span className="unit">(mm)</span></label>
                <input
                  type="number"
                  name="oldpeak"
                  value={formData.oldpeak}
                  onChange={handleChange}
                  min="0" max="6.0" step="0.1"
                  placeholder="e.g. 1.2"
                />
                <span className="reference-text">Normal: 0 | Mild: &lt;1.0 | Moderate: 1.0–2.0 | Severe: &gt;2.0</span>
                {errors.oldpeak && <span className="error-text">{errors.oldpeak}</span>}
              </div>
              <div className="form-group">
                <label>ST Slope</label>
                <select name="stSlope" value={formData.stSlope} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="upsloping">Upsloping — usually normal variant</option>
                  <option value="flat">Flat — classic ischemia sign</option>
                  <option value="downsloping">Downsloping — severe ischemia</option>
                </select>
                {errors.stSlope && <span className="error-text">{errors.stSlope}</span>}
              </div>
            </div>
          </FormSection>

          {/* Advanced Diagnostics */}
          <FormSection title="Advanced Diagnostics" icon="🔬">
            <div className="form-grid">
              <div className="form-group">
                <label>Major Vessels by Fluoroscopy</label>
                <select name="majorVessels" value={formData.majorVessels} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="0">0 — No significant stenosis</option>
                  <option value="1">1 — Single-vessel disease</option>
                  <option value="2">2 — Two-vessel disease</option>
                  <option value="3">3 — Three-vessel disease</option>
                </select>
                <span className="reference-text">LAD, LCx, RCA. More vessels = higher risk.</span>
                {errors.majorVessels && <span className="error-text">{errors.majorVessels}</span>}
              </div>
              <div className="form-group">
                <label>Nuclear Stress Test (Thallium-201)</label>
                <select name="thalassemia" value={formData.thalassemia} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="normal">Normal — homogeneous uptake</option>
                  <option value="fixedDefect">Fixed Defect — scarred myocardium</option>
                  <option value="reversibleDefect">Reversible Defect — inducible ischemia</option>
                </select>
                <span className="reference-text">Thallium-201 myocardial perfusion scintigraphy results.</span>
                {errors.thalassemia && <span className="error-text">{errors.thalassemia}</span>}
              </div>
            </div>
          </FormSection>

          {/* Actions */}
          <div className="form-actions">
            <div className="sample-loader">
              <select onChange={loadSample} defaultValue="">
                <option value="" disabled>Load Sample Patient...</option>
                {SAMPLE_PATIENTS.map((patient, idx) => (
                  <option key={idx} value={idx}>
                    {patient.name} — {patient.description}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>Analyze Risk →</>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentPage;
