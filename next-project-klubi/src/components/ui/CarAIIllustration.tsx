export function CarAIIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      
      {/* Abstract background shapes */}
      <circle cx="50" cy="50" r="30" fill="url(#bgGradient)" opacity="0.6" />
      <circle cx="350" cy="80" r="25" fill="url(#bgGradient)" opacity="0.4" />
      <circle cx="80" cy="250" r="20" fill="url(#bgGradient)" opacity="0.5" />
      <circle cx="320" cy="220" r="35" fill="url(#bgGradient)" opacity="0.3" />
      
      {/* Car silhouette */}
      <g transform="translate(80, 120)">
        <path
          d="M0 40 L20 20 L60 15 L100 15 L140 15 L180 20 L200 40 L200 60 L180 70 L160 70 L160 60 L40 60 L40 70 L20 70 L0 60 Z"
          fill="url(#carGradient)"
          opacity="0.8"
        />
        {/* Car windows */}
        <path
          d="M30 25 L50 20 L120 20 L150 20 L170 25 L170 45 L30 45 Z"
          fill="rgba(255,255,255,0.3)"
        />
        {/* Car wheels */}
        <circle cx="45" cy="70" r="12" fill="url(#carGradient)" />
        <circle cx="155" cy="70" r="12" fill="url(#carGradient)" />
        <circle cx="45" cy="70" r="6" fill="rgba(255,255,255,0.8)" />
        <circle cx="155" cy="70" r="6" fill="rgba(255,255,255,0.8)" />
      </g>
      
      {/* AI Brain/Network */}
      <g transform="translate(250, 50)">
        {/* Neural network nodes */}
        <circle cx="20" cy="20" r="8" fill="url(#aiGradient)" opacity="0.8" />
        <circle cx="60" cy="15" r="6" fill="url(#aiGradient)" opacity="0.6" />
        <circle cx="80" cy="40" r="7" fill="url(#aiGradient)" opacity="0.7" />
        <circle cx="40" cy="50" r="5" fill="url(#aiGradient)" opacity="0.5" />
        <circle cx="70" cy="70" r="6" fill="url(#aiGradient)" opacity="0.6" />
        
        {/* Neural network connections */}
        <line x1="20" y1="20" x2="60" y2="15" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.4" />
        <line x1="60" y1="15" x2="80" y2="40" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.4" />
        <line x1="20" y1="20" x2="40" y2="50" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.4" />
        <line x1="40" y1="50" x2="70" y2="70" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.4" />
        <line x1="80" y1="40" x2="70" y2="70" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.4" />
      </g>
      
      {/* Search/Chat bubbles */}
      <g transform="translate(50, 180)">
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="rgba(245, 158, 11, 0.2)" />
        <text x="30" y="25" textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold">
          SUV?
        </text>
      </g>
      
      <g transform="translate(280, 160)">
        <ellipse cx="30" cy="20" rx="35" ry="18" fill="rgba(236, 72, 153, 0.2)" />
        <text x="30" y="25" textAnchor="middle" fontSize="9" fill="#ec4899" fontWeight="bold">
          3 found!
        </text>
      </g>
      
      {/* Floating particles */}
      <circle cx="120" cy="80" r="2" fill="#f59e0b" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="120" r="2" fill="#ec4899" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="200" r="2" fill="#f59e0b" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}







