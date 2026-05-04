'use client'
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'elevated';
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  variant = 'default'
}: CardProps): React.ReactElement {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white/5',
    gradient: 'bg-white/5',
    elevated: 'bg-white/5 shadow-2xl shadow-black/40',
  };

  return (
    <div className={`${variantClasses[variant]} transition-all duration-300 hover:border-primary/30 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
} 


