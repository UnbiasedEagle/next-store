export const Logo = () => (
  <svg width="260" height="80" viewBox="20 0 340 100" xmlns="http://www.w3.org/2000/svg">
    {/* Gradient Definitions */}
    <defs>
      {/* Main bag gradient - purple theme */}
      <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6D28D9', stopOpacity: 1 }} />
      </linearGradient>
      
      {/* Handle gradient - lighter purple/violet */}
      <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
      </linearGradient>
      
      {/* Shadow filter */}
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Shopping Bag Icon with shadow */}
    <g filter="url(#shadow)">
      {/* Main bag body */}
      <rect x="20" y="28" width="50" height="52" rx="6" fill="url(#bagGradient)"/>
      
      {/* Bag highlight for depth */}
      <rect x="23" y="31" width="20" height="46" rx="3" fill="white" opacity="0.15"/>
      
      {/* Handle / Strap */}
      <path d="M30 28 C30 18 60 18 60 28" 
            stroke="url(#handleGradient)" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"/>
      
      {/* Inner handle detail */}
      <path d="M32 28 C32 21 58 21 58 28" 
            stroke="white" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round"
            opacity="0.4"/>
      
      {/* Shopping bag fold line */}
      <line x1="20" y1="38" x2="70" y2="38" stroke="white" strokeWidth="1" opacity="0.2"/>
      
      {/* Decorative dots on bag */}
      <circle cx="45" cy="55" r="2" fill="white" opacity="0.25"/>
      <circle cx="45" cy="65" r="2" fill="white" opacity="0.25"/>
    </g>

    {/* Text NextStore - using CSS variables for theme */}
    <text x="90" y="65" 
          fontFamily="Poppins, Inter, -apple-system, sans-serif"
          fontSize="44" 
          fontWeight="700" 
          fill="currentColor"
          letterSpacing="-1"
          className="text-foreground">
      NextStore
    </text>
    
    {/* Subtle underline accent */}
    <rect x="90" y="72" width="60" height="3" rx="1.5" fill="url(#handleGradient)" opacity="0.6"/>
  </svg>
);
