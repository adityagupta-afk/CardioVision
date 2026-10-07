/* ============================================================
   CardioVision — Prediction Service
   ============================================================
   This module contains the risk prediction logic.
   Currently uses a clinically-informed scoring algorithm based on:
   - Framingham Risk Score methodology
   - ACC/AHA ASCVD Risk Calculator principles
   - Cleveland Heart Disease dataset feature weights

   IMPORTANT: This is for educational/demonstration purposes only.
   It is NOT a validated medical diagnostic tool.
   ============================================================ */

/**
 * Reference ranges based on clinical literature
 * Sources: AHA, ACC, WHO, Framingham Heart Study
 */
const REFERENCE_RANGES = {
  age: { low: 29, high: 77, unit: 'years' },
  restingBP: { optimal: 120, elevated: 130, high: 140, crisis: 180, unit: 'mmHg' },
  cholesterol: { desirable: 200, borderline: 240, high: 280, unit: 'mg/dL' },
  maxHeartRate: { unit: 'bpm' },
  fastingBS: { normal: 100, prediabetes: 126, unit: 'mg/dL' },
  oldpeak: { normal: 0, mild: 1.0, moderate: 2.0, severe: 4.0, unit: 'mm' },
};

/**
 * Calculate age-predicted maximum heart rate
 * Formula: 220 - age (Fox formula, widely used clinically)
 */
function getExpectedMaxHR(age) {
  return 220 - age;
}

/**
 * Normalize a value to 0-1 range given min and max bounds
 */
function normalize(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Main prediction function
 * Takes patient data and returns a comprehensive risk assessment
 *
 * @param {Object} data - Patient clinical data
 * @returns {Object} Risk assessment results
 */
export function predictCardiovascularRisk(data) {
  const {
    age,
    sex,
    chestPainType,
    restingBP,
    cholesterol,
    fastingBS,
    restingECG,
    maxHeartRate,
    exerciseAngina,
    oldpeak,
    stSlope,
    majorVessels,
    thalassemia,
  } = data;

  // ── Individual risk factor scores (0 to 1 scale) ──

  // Age risk: increases significantly after 45 (men) / 55 (women)
  const ageThreshold = sex === 'male' ? 45 : 55;
  const ageRisk = age < ageThreshold
    ? normalize(age, 20, ageThreshold) * 0.3
    : 0.3 + normalize(age, ageThreshold, 80) * 0.7;

  // Blood pressure risk (based on AHA categories)
  let bpRisk = 0;
  if (restingBP < 120) bpRisk = 0.05;
  else if (restingBP < 130) bpRisk = 0.2;
  else if (restingBP < 140) bpRisk = 0.45;
  else if (restingBP < 160) bpRisk = 0.65;
  else if (restingBP < 180) bpRisk = 0.85;
  else bpRisk = 1.0;

  // Cholesterol risk (based on ATP III guidelines)
  let cholRisk = 0;
  if (cholesterol < 200) cholRisk = 0.05;
  else if (cholesterol < 240) cholRisk = 0.3;
  else if (cholesterol < 280) cholRisk = 0.6;
  else cholRisk = 0.9;

  // Fasting blood sugar risk
  const bsRisk = fastingBS > 120 ? 0.7 : (fastingBS > 100 ? 0.3 : 0.05);

  // Heart rate risk: lower max HR during exercise = higher risk
  const expectedMaxHR = getExpectedMaxHR(age);
  const hrRatio = maxHeartRate / expectedMaxHR;
  let hrRisk = 0;
  if (hrRatio >= 0.85) hrRisk = 0.1;
  else if (hrRatio >= 0.7) hrRisk = 0.4;
  else if (hrRatio >= 0.55) hrRisk = 0.7;
  else hrRisk = 0.95;

  // Chest pain type risk
  // 0 = Typical Angina (highest risk), 1 = Atypical, 2 = Non-anginal, 3 = Asymptomatic
  const chestPainRiskMap = {
    typical: 0.9,
    atypical: 0.5,
    nonAnginal: 0.25,
    asymptomatic: 0.05,
  };
  const cpRisk = chestPainRiskMap[chestPainType] ?? 0.2;

  // Exercise-induced angina
  const anginaRisk = exerciseAngina === 'yes' ? 0.85 : 0.1;

  // ST depression (oldpeak) risk
  let stRisk = 0;
  if (oldpeak <= 0) stRisk = 0.05;
  else if (oldpeak < 1.0) stRisk = 0.25;
  else if (oldpeak < 2.0) stRisk = 0.55;
  else if (oldpeak < 4.0) stRisk = 0.8;
  else stRisk = 0.95;

  // ST slope risk
  const slopeRiskMap = {
    upsloping: 0.1,
    flat: 0.55,
    downsloping: 0.9,
  };
  const slopeRisk = slopeRiskMap[stSlope] ?? 0.3;

  // Resting ECG risk
  const ecgRiskMap = {
    normal: 0.05,
    stAbnormality: 0.55,
    lvh: 0.7,
  };
  const ecgRisk = ecgRiskMap[restingECG] ?? 0.1;

  // Major vessels (0-3) — fluoroscopy result
  const vesselRisk = majorVessels != null ? (majorVessels / 3) * 0.95 : 0.2;

  // Thalassemia risk
  const thalRiskMap = {
    normal: 0.05,
    fixedDefect: 0.6,
    reversibleDefect: 0.85,
  };
  const thalRisk = thalRiskMap[thalassemia] ?? 0.2;

  // Sex risk factor (males have statistically higher CAD risk)
  const sexRisk = sex === 'male' ? 0.15 : 0.05;

  // ── Weighted combination ──
  // Weights derived from feature importance in clinical studies
  const weights = {
    age: 0.08,
    sex: 0.04,
    chestPain: 0.12,
    restingBP: 0.07,
    cholesterol: 0.06,
    fastingBS: 0.04,
    restingECG: 0.05,
    maxHeartRate: 0.10,
    exerciseAngina: 0.11,
    oldpeak: 0.10,
    stSlope: 0.08,
    majorVessels: 0.09,
    thalassemia: 0.06,
  };

  const weightedScore =
    weights.age * ageRisk +
    weights.sex * sexRisk +
    weights.chestPain * cpRisk +
    weights.restingBP * bpRisk +
    weights.cholesterol * cholRisk +
    weights.fastingBS * bsRisk +
    weights.restingECG * ecgRisk +
    weights.maxHeartRate * hrRisk +
    weights.exerciseAngina * anginaRisk +
    weights.oldpeak * stRisk +
    weights.stSlope * slopeRisk +
    weights.majorVessels * vesselRisk +
    weights.thalassemia * thalRisk;

  // Scale to percentage (0–100)
  const riskPercentage = Math.round(Math.min(100, Math.max(0, weightedScore * 100)));

  // ── Risk category ──
  let riskCategory, riskColor, riskDescription;
  if (riskPercentage < 20) {
    riskCategory = 'Low';
    riskColor = '#22c55e';
    riskDescription = 'Your cardiovascular risk indicators are within normal ranges. Continue maintaining a healthy lifestyle with regular exercise and a balanced diet.';
  } else if (riskPercentage < 40) {
    riskCategory = 'Low-Moderate';
    riskColor = '#84cc16';
    riskDescription = 'Some risk factors are slightly elevated. Consider discussing preventive measures with your healthcare provider during your next visit.';
  } else if (riskPercentage < 60) {
    riskCategory = 'Moderate';
    riskColor = '#eab308';
    riskDescription = 'Several risk indicators suggest moderate cardiovascular risk. A comprehensive evaluation by a cardiologist is recommended.';
  } else if (riskPercentage < 80) {
    riskCategory = 'High';
    riskColor = '#f97316';
    riskDescription = 'Multiple risk factors indicate elevated cardiovascular risk. Prompt medical consultation and lifestyle modifications are strongly recommended.';
  } else {
    riskCategory = 'Very High';
    riskColor = '#ef4444';
    riskDescription = 'Risk indicators suggest significant cardiovascular concern. Immediate consultation with a cardiologist is strongly advised.';
  }

  // ── Contributing factors analysis ──
  const factorScores = [
    { name: 'Age', score: ageRisk, value: `${age} years`, icon: '🎂' },
    { name: 'Blood Pressure', score: bpRisk, value: `${restingBP} mmHg`, icon: '🩺' },
    { name: 'Cholesterol', score: cholRisk, value: `${cholesterol} mg/dL`, icon: '🧪' },
    { name: 'Chest Pain Type', score: cpRisk, value: formatChestPain(chestPainType), icon: '💔' },
    { name: 'Max Heart Rate', score: hrRisk, value: `${maxHeartRate} bpm`, icon: '❤️' },
    { name: 'Exercise Angina', score: anginaRisk, value: exerciseAngina === 'yes' ? 'Present' : 'Absent', icon: '🏃' },
    { name: 'ST Depression', score: stRisk, value: `${oldpeak} mm`, icon: '📈' },
    { name: 'ST Slope', score: slopeRisk, value: formatSlope(stSlope), icon: '📊' },
    { name: 'Fasting Blood Sugar', score: bsRisk, value: `${fastingBS} mg/dL`, icon: '🩸' },
    { name: 'Resting ECG', score: ecgRisk, value: formatECG(restingECG), icon: '📋' },
    { name: 'Major Vessels', score: vesselRisk, value: `${majorVessels ?? 'N/A'}`, icon: '🫀' },
    { name: 'Thalassemia', score: thalRisk, value: formatThal(thalassemia), icon: '🔬' },
  ];

  // Sort by risk contribution (highest first)
  factorScores.sort((a, b) => b.score - a.score);

  // Categorize factors
  const highRiskFactors = factorScores.filter(f => f.score >= 0.6);
  const moderateRiskFactors = factorScores.filter(f => f.score >= 0.3 && f.score < 0.6);
  const lowRiskFactors = factorScores.filter(f => f.score < 0.3);

  // ── CAD-specific risk ──
  // Coronary artery disease risk emphasizes different factors
  const cadScore = (
    cpRisk * 0.18 +
    vesselRisk * 0.16 +
    thalRisk * 0.12 +
    stRisk * 0.12 +
    anginaRisk * 0.12 +
    slopeRisk * 0.10 +
    hrRisk * 0.08 +
    cholRisk * 0.05 +
    bpRisk * 0.04 +
    ageRisk * 0.03
  );
  const cadPercentage = Math.round(Math.min(100, Math.max(0, cadScore * 100)));

  let cadCategory;
  if (cadPercentage < 25) cadCategory = 'Low';
  else if (cadPercentage < 50) cadCategory = 'Moderate';
  else if (cadPercentage < 75) cadCategory = 'High';
  else cadCategory = 'Very High';

  return {
    overallRisk: riskPercentage,
    riskCategory,
    riskColor,
    riskDescription,
    cadRisk: cadPercentage,
    cadCategory,
    factors: factorScores,
    highRiskFactors,
    moderateRiskFactors,
    lowRiskFactors,
    patientData: data,
    timestamp: new Date().toISOString(),
    disclaimer: 'This assessment is for educational and demonstration purposes only. It is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice.',
  };
}

// ── Formatting helpers ──

function formatChestPain(type) {
  const map = {
    typical: 'Typical Angina',
    atypical: 'Atypical Angina',
    nonAnginal: 'Non-Anginal Pain',
    asymptomatic: 'Asymptomatic',
  };
  return map[type] || type;
}

function formatSlope(slope) {
  const map = {
    upsloping: 'Upsloping',
    flat: 'Flat',
    downsloping: 'Downsloping',
  };
  return map[slope] || slope;
}

function formatECG(ecg) {
  const map = {
    normal: 'Normal',
    stAbnormality: 'ST-T Wave Abnormality',
    lvh: 'Left Ventricular Hypertrophy',
  };
  return map[ecg] || ecg;
}

function formatThal(thal) {
  const map = {
    normal: 'Normal',
    fixedDefect: 'Fixed Defect',
    reversibleDefect: 'Reversible Defect',
  };
  return map[thal] || thal;
}

/**
 * Generate sample patient profiles for demo purposes
 * Based on realistic clinical data distributions from the Cleveland dataset
 */
export const SAMPLE_PATIENTS = [
  {
    name: 'Low Risk Profile',
    description: 'Young female with normal vitals',
    data: {
      age: 35,
      sex: 'female',
      chestPainType: 'asymptomatic',
      restingBP: 115,
      cholesterol: 185,
      fastingBS: 88,
      restingECG: 'normal',
      maxHeartRate: 172,
      exerciseAngina: 'no',
      oldpeak: 0,
      stSlope: 'upsloping',
      majorVessels: 0,
      thalassemia: 'normal',
    },
  },
  {
    name: 'Moderate Risk Profile',
    description: '55-year-old male with elevated markers',
    data: {
      age: 55,
      sex: 'male',
      chestPainType: 'atypical',
      restingBP: 138,
      cholesterol: 245,
      fastingBS: 110,
      restingECG: 'stAbnormality',
      maxHeartRate: 142,
      exerciseAngina: 'no',
      oldpeak: 1.2,
      stSlope: 'flat',
      majorVessels: 1,
      thalassemia: 'normal',
    },
  },
  {
    name: 'High Risk Profile',
    description: '63-year-old male with multiple risk factors',
    data: {
      age: 63,
      sex: 'male',
      chestPainType: 'typical',
      restingBP: 155,
      cholesterol: 282,
      fastingBS: 145,
      restingECG: 'lvh',
      maxHeartRate: 118,
      exerciseAngina: 'yes',
      oldpeak: 3.1,
      stSlope: 'downsloping',
      majorVessels: 3,
      thalassemia: 'reversibleDefect',
    },
  },
];
