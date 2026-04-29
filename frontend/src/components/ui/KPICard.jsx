import React from 'react';

export const KPICard = ({ 
  title, 
  value, 
  icon, 
  accentColor, 
  iconBgColor, 
  valueColor = 'var(--sp-text-primary)' 
}) => {
  return (
    <div 
      className="kpi-card" 
      style={{ '--accent': accentColor }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[#7c6fae] tracking-[0.3px] uppercase">
          {title}
        </span>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
      <div 
        className="text-[22px] font-extrabold"
        style={{ color: valueColor }}
      >
        {value}
      </div>
    </div>
  );
};
