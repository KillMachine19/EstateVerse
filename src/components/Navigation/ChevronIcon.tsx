import React from 'react';

interface ChevronIconProps {
  expanded?: boolean;
  size?: number;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ 
  expanded = false, 
  size = 20 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

export default ChevronIcon;
