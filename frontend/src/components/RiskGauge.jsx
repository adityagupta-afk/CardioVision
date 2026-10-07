import React, { useEffect, useState } from 'react';
import './RiskGauge.css';

const RiskGauge = ({ percentage = 0, label = "Risk Level", color = "#5aa9df", size = 200 }) => {
  const [animatedPct, setAnimatedPct] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPct(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (animatedPct / 100) * arcLength;

  return (
    <div className="risk-gauge-container" style={{ width: size, height: size * 0.6 }}>
      <svg 
        width={size} 
        height={size / 2 + strokeWidth} 
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        className="risk-gauge-svg"
      >
        <path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke="#f0f8ff"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          className="risk-gauge-path"
        />
      </svg>
      <div className="risk-gauge-content">
        <div className="risk-gauge-value" style={{ color: '#16324f' }}>
          {animatedPct}<span className="risk-gauge-unit">%</span>
        </div>
        <div className="risk-gauge-label">{label}</div>
      </div>
    </div>
  );
};

export default RiskGauge;
