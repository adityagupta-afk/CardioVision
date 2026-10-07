import React from 'react';
import './FormSection.css';

const FormSection = ({ title, description, icon, children }) => {
  return (
    <div className="form-section-card">
      <div className="form-section-header">
        {icon && <span className="form-section-icon">{icon}</span>}
        <div className="form-section-title-wrapper">
          <h3 className="form-section-title">{title}</h3>
          {description && <p className="form-section-description">{description}</p>}
        </div>
      </div>
      <div className="form-section-body">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
