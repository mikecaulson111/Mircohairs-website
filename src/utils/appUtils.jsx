export const LogoIcon = ({ size = 28 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <rect width="100" height="100" rx="20" fill="#0a0a0f" />
    <path 
      d="M25 25 L50 75 L85 40" 
      stroke="#00d2ff" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M40 60 A 20 20 0 0 0 62 48" 
      stroke="#a855f7" 
      strokeWidth="6" 
      fill="none"
    />
    <circle cx="50" cy="75" r="6" fill="#00d2ff" />
  </svg>
);