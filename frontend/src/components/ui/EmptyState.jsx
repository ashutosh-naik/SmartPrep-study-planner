import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px' }}>
      <div className="flex justify-center mb-4">
        {React.cloneElement(icon, { 
          size: 40, 
          color: '#ddd6fe', 
          strokeWidth: 1.5 
        })}
      </div>
      <h3 style={{ marginTop: 16, fontSize: 15, fontWeight: 700, color: '#0f0a1e' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: '#7c6fae', marginTop: 6 }}>
        {description}
      </p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          style={{ 
            marginTop: 18, 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            padding: '8px 16px', 
            borderRadius: 8, 
            background: '#6d28d9', 
            color: '#fff',
            fontSize: 12, 
            fontWeight: 600, 
            border: 'none',
            cursor: 'pointer'
          }}
          className="hover:bg-[#5b21b6] transition-colors"
        >
          <Plus size={14} /> {actionText}
        </button>
      )}
    </div>
  );
};
