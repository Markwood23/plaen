interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 28, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 3H12V12H3V3Z" fill="#14462a"/>
        <path d="M14 3H21L17.5 12H14V3Z" fill="#14462a"/>
        <path d="M12 14H21V21H12V14Z" fill="#14462a"/>
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-gray-900">Plaen</span>
      )}
    </div>
  );
}

export function LogoIcon({ size = 28, className = "" }: Omit<LogoProps, 'showText'>) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 3H12V12H3V3Z" fill="#14462a"/>
      <path d="M14 3H21L17.5 12H14V3Z" fill="#14462a"/>
      <path d="M12 14H21V21H12V14Z" fill="#14462a"/>
    </svg>
  );
}
