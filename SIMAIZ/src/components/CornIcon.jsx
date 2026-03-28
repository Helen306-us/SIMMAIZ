/**
 * CornIcon — SVG estilizado de planta de maíz para las celdas.
 * Cambia de apariencia según el estado de salud.
 */
export default function CornIcon({ health, state, size = 28 }) {
  if (state === 'dead') return <DeadCorn size={size} />;
  if (state === 'pest') return <PestCorn size={size} />;
  if (health >= 80) return <HealthyCorn size={size} />;
  if (health >= 60) return <MildStressCorn size={size} />;
  if (health >= 40) return <ModStressCorn size={size} />;
  return <CriticalCorn size={size} />;
}

function HealthyCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Tallo */}
      <rect x="15" y="8" width="2.5" height="20" rx="1" fill="#2d8a2d" />
      {/* Hojas */}
      <path d="M16 14 C10 10, 6 12, 5 14 C6 15, 10 16, 16 14Z" fill="#3aaf3a" />
      <path d="M17 18 C23 14, 27 16, 28 18 C27 19, 23 20, 17 18Z" fill="#3aaf3a" />
      <path d="M16 22 C10 18, 7 20, 6 22 C7 23, 10 24, 16 22Z" fill="#45bf45" />
      {/* Mazorca */}
      <ellipse cx="20" cy="16" rx="3" ry="5" fill="#e8c840" stroke="#c8a030" strokeWidth="0.5" />
      <path d="M20 11 L19 9 M20 11 L21 9 M20 11 L20 8" stroke="#8a7030" strokeWidth="0.8" />
      {/* Pelo del elote */}
      <path d="M22 13 C24 11, 25 12, 24 14" stroke="#c89040" strokeWidth="0.5" fill="none" />
      {/* Borla */}
      <path d="M16 8 L14 4 M16 8 L16 3 M16 8 L18 4" stroke="#a08040" strokeWidth="0.8" />
    </svg>
  );
}

function MildStressCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="15" y="10" width="2.5" height="18" rx="1" fill="#5a8a2a" />
      <path d="M16 15 C10 12, 7 14, 6 16 C7 17, 10 17, 16 15Z" fill="#8aaa30" />
      <path d="M17 19 C23 16, 26 18, 27 19 C26 20, 23 20, 17 19Z" fill="#8aaa30" />
      <path d="M16 23 C11 20, 8 22, 7 23 C8 24, 11 24, 16 23Z" fill="#a0aa40" opacity="0.7" />
      <ellipse cx="20" cy="17" rx="2.5" ry="4" fill="#d0b040" stroke="#b09030" strokeWidth="0.5" />
      <path d="M16 10 L15 6 M16 10 L17 7" stroke="#a08040" strokeWidth="0.7" />
    </svg>
  );
}

function ModStressCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="15" y="12" width="2" height="16" rx="1" fill="#7a7a2a" />
      <path d="M16 17 C11 15, 9 17, 8 19 C9 19, 12 18, 16 17Z" fill="#aa8a30" opacity="0.8" />
      <path d="M17 21 C22 19, 24 21, 25 22 C24 22, 22 22, 17 21Z" fill="#aa8a30" opacity="0.7" />
      <path d="M15 25 C12 24, 10 26, 10 27" stroke="#8a6a20" strokeWidth="0.8" fill="none" />
      <ellipse cx="19" cy="18" rx="2" ry="3" fill="#b0a040" opacity="0.7" />
    </svg>
  );
}

function CriticalCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="15" y="14" width="2" height="14" rx="1" fill="#6a4a1a" />
      <path d="M15 18 C12 18, 10 20, 9 22" stroke="#7a5a20" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M17 20 C20 20, 22 22, 23 24" stroke="#7a5a20" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="16" cy="13" r="1" fill="#8a5a2a" opacity="0.5" />
    </svg>
  );
}

function DeadCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity="0.5">
      <rect x="15" y="16" width="1.5" height="12" rx="0.5" fill="#5a5a5a" transform="rotate(-5 16 22)" />
      <path d="M15 20 C12 21, 11 23, 10 25" stroke="#4a4a4a" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function PestCorn({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="15" y="10" width="2" height="18" rx="1" fill="#5a4a2a" />
      <path d="M16 15 C11 13, 8 15, 7 17 C8 17, 11 16, 16 15Z" fill="#6a5a22" opacity="0.6" />
      <path d="M17 19 C22 17, 24 19, 25 20 C24 20, 22 20, 17 19Z" fill="#6a5a22" opacity="0.6" />
      {/* Bug / Worm Emoji overlay for maximum visibility */}
      <text x="16" y="22" fontSize="16" textAnchor="middle" dominantBaseline="middle">🐛</text>
    </svg>
  );
}
