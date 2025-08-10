import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const classes = `
    inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium
    ${sizeClasses[size]}
    ${className}
  `;

  if (src) {
    return (
      <img
        className={`${classes} object-cover`}
        src={src}
        alt={alt || name}
        {...props}
      />
    );
  }

  return (
    <div className={classes} {...props}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
