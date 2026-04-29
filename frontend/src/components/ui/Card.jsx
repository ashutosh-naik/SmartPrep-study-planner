import React from 'react';

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
