import React from 'react';

export function ZhiYunLogo({ className = "", strokeWidth = 2, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M4 15 A 3.5 3.5 0 0 1 7 9.5 A 5.5 5.5 0 0 1 17 9.5 A 3.5 3.5 0 0 1 20 15" />
      <path d="M2 16 Q 7 13.5 12 16 Q 17 13.5 22 16" />
      <path d="M2 20 Q 7 17.5 12 20 Q 17 17.5 22 20" />
      <path d="M12 16 L 12 20" />
      <path d="M2 16 L 2 20" />
      <path d="M22 16 L 22 20" />
    </svg>
  );
}
