import React, { useState } from "react";
import "./SwitchToggle.css";

const SwitchToggle = ({ label, onToggle, defaultChecked = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleChange = () => {
    setIsChecked(!isChecked);
    if (onToggle) onToggle(!isChecked);
  };

  return (
    <div className="switch-toggle-container">
      {label && <span className="switch-label">{label}</span>}
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default SwitchToggle;
