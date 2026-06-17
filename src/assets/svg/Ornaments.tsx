// Ornamentos SVG decorativos

export const RomanicFrame = () => (
  <svg 
    viewBox="0 0 200 200" 
    className="w-full h-full"
    preserveAspectRatio="none"
    style={{ position: 'absolute', pointerEvents: 'none' }}
  >
    {/* Marco exterior */}
    <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    
    {/* Esquinas decoradas */}
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    <circle cx="190" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    <circle cx="10" cy="190" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    <circle cx="190" cy="190" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    
    {/* Elementos decorativos en esquinas - hojas de laurel */}
    <path d="M 15 15 Q 20 10 25 15" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    <path d="M 185 15 Q 180 10 175 15" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
  </svg>
);

export const OrnamentalDivider = () => (
  <svg 
    viewBox="0 0 300 40" 
    className="w-full"
    preserveAspectRatio="none"
    style={{ maxWidth: '300px', margin: '0 auto' }}
  >
    {/* Línea central */}
    <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    
    {/* Ornamentos centrales */}
    <circle cx="150" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M 140 20 Q 150 10 160 20" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    <path d="M 140 20 Q 150 30 160 20" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    
    {/* Detalles laterales */}
    <circle cx="50" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    <circle cx="250" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
  </svg>
);

export const ScrollIndicator = () => (
  <svg 
    viewBox="0 0 24 40" 
    className="w-6 h-10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="3" width="18" height="30" rx="9" opacity="0.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
  </svg>
);

export const LaurelWreath = () => (
  <svg 
    viewBox="0 0 200 60" 
    className="w-full h-auto"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Rama izquierda */}
    <path 
      d="M 30 30 Q 40 20 50 30 Q 45 35 40 33 Q 35 32 30 30" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      opacity="0.6" 
    />
    {/* Rama derecha */}
    <path 
      d="M 170 30 Q 160 20 150 30 Q 155 35 160 33 Q 165 32 170 30" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      opacity="0.6" 
    />
    {/* Línea central */}
    <line x1="60" y1="30" x2="140" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
    {/* Centro decorativo */}
    <circle cx="100" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
  </svg>
);

export const BlackworkIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <path d="M 50 15 L 70 35 L 50 55 L 30 35 Z" fill="currentColor" opacity="0.7" />
    <path d="M 50 50 L 65 50 L 65 65" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

export const JapanesIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    {/* Onda estilo Hokusai */}
    <path d="M 20 50 Q 35 40 50 50 T 80 50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <path d="M 15 60 Q 30 50 45 60 T 75 60" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    {/* Flor de cerezo */}
    <circle cx="70" cy="30" r="6" fill="currentColor" opacity="0.6" />
    <circle cx="62" cy="25" r="4" fill="currentColor" opacity="0.5" />
    <circle cx="78" cy="25" r="4" fill="currentColor" opacity="0.5" />
  </svg>
);

export const RealismIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    {/* Ojo realista */}
    <ellipse cx="50" cy="50" rx="25" ry="35" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.7" />
    <circle cx="53" cy="47" r="3" fill="currentColor" opacity="0.9" />
  </svg>
);

export const GeometricIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <polygon points="50,15 75,40 75,75 25,75 25,40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <line x1="50" y1="15" x2="50" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

export const Quotation = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24" fill="currentColor" opacity="0.15">
    <path d="M 20 20 Q 15 30 20 50 Q 25 60 35 50 Q 30 40 28 30 Q 25 25 20 20" />
    <path d="M 65 20 Q 60 30 65 50 Q 70 60 80 50 Q 75 40 73 30 Q 70 25 65 20" />
  </svg>
);

export const Star = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" className={`w-${size/4} h-${size/4}`} fill="currentColor">
    <polygon points="12,2 15,10 23,10 17,16 20,24 12,18 4,24 7,16 1,10 9,10" />
  </svg>
);

export const DecorativeLine = () => (
  <svg viewBox="0 0 100 4" className="w-full h-auto" preserveAspectRatio="none">
    <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <circle cx="50" cy="2" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);
