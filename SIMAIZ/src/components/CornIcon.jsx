
export default function CornIcon({ health, state, size = 28, day = 180 }) {
  // Lógica de crecimiento fenológico
  // progress va de 0.2 (brote) a 1.0 (adulto) a los 90 días
  const progress = Math.min(1, Math.max(0.2, day / 90));
  const showTassel = day >= 60; // Borla
  const showEar = day >= 75; // Mazorca visible

  const p = { size, progress, showTassel, showEar };

  if (state === 'dead') return <DeadCorn {...p} />;
  if (state === 'pest') return <PestCorn {...p} />;
  if (health >= 80) return <HealthyCorn {...p} />;
  if (health >= 60) return <MildStressCorn {...p} />;
  if (health >= 40) return <ModStressCorn {...p} />;
  return <CriticalCorn {...p} />;
}

// Estilo común para la animación de crecimiento
const getGrowthStyle = (progress) => ({
  transform: `scale(${progress})`,
  transformOrigin: '16px 28px',
  transition: 'transform 0.4s ease-out'
});

function HealthyCorn({ size, progress, showTassel, showEar }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g style={getGrowthStyle(progress)}>
        {/* Tallo */}
        <rect x="15" y="8" width="2.5" height="20" rx="1" fill="#2d8a2d" />
        {/* Hojas */}
        <path d="M16 14 C10 10, 6 12, 5 14 C6 15, 10 16, 16 14Z" fill="#3aaf3a" />
        <path d="M17 18 C23 14, 27 16, 28 18 C27 19, 23 20, 17 18Z" fill="#3aaf3a" />
        <path d="M16 22 C10 18, 7 20, 6 22 C7 23, 10 24, 16 22Z" fill="#45bf45" />
        {/* Mazorca */}
        {showEar && (
          <g style={{ animation: 'svgFadeIn 0.8s ease-in-out' }}>
            <ellipse cx="20" cy="16" rx="3" ry="5" fill="#e8c840" stroke="#c8a030" strokeWidth="0.5" />
            <path d="M20 11 L19 9 M20 11 L21 9 M20 11 L20 8" stroke="#8a7030" strokeWidth="0.8" />
            <path d="M22 13 C24 11, 25 12, 24 14" stroke="#c89040" strokeWidth="0.5" fill="none" />
          </g>
        )}
        {/* Borla */}
        {showTassel && (
          <path d="M16 8 L14 4 M16 8 L16 3 M16 8 L18 4" stroke="#a08040" strokeWidth="0.8" style={{ animation: 'svgFadeIn 0.8s' }} />
        )}
      </g>
    </svg>
  );
}

function MildStressCorn({ size, progress, showTassel, showEar }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g style={getGrowthStyle(progress)}>
        <rect x="15" y="10" width="2.5" height="18" rx="1" fill="#5a8a2a" />
        <path d="M16 15 C10 12, 7 14, 6 16 C7 17, 10 17, 16 15Z" fill="#8aaa30" />
        <path d="M17 19 C23 16, 26 18, 27 19 C26 20, 23 20, 17 19Z" fill="#8aaa30" />
        <path d="M16 23 C11 20, 8 22, 7 23 C8 24, 11 24, 16 23Z" fill="#a0aa40" opacity="0.7" />
        {showEar && (
          <ellipse cx="20" cy="17" rx="2.5" ry="4" fill="#d0b040" stroke="#b09030" strokeWidth="0.5" style={{ animation: 'svgFadeIn 0.8s' }} />
        )}
        {showTassel && (
          <path d="M16 10 L15 6 M16 10 L17 7" stroke="#a08040" strokeWidth="0.7" style={{ animation: 'svgFadeIn 0.8s' }} />
        )}
      </g>
    </svg>
  );
}

function ModStressCorn({ size, progress, showEar }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g style={getGrowthStyle(progress)}>
        <rect x="15" y="12" width="2" height="16" rx="1" fill="#7a7a2a" />
        <path d="M16 17 C11 15, 9 17, 8 19 C9 19, 12 18, 16 17Z" fill="#aa8a30" opacity="0.8" />
        <path d="M17 21 C22 19, 24 21, 25 22 C24 22, 22 22, 17 21Z" fill="#aa8a30" opacity="0.7" />
        <path d="M15 25 C12 24, 10 26, 10 27" stroke="#8a6a20" strokeWidth="0.8" fill="none" />
        {showEar && (
          <ellipse cx="19" cy="18" rx="2" ry="3" fill="#b0a040" opacity="0.7" style={{ animation: 'svgFadeIn 0.8s' }} />
        )}
      </g>
    </svg>
  );
}

function CriticalCorn({ size, progress }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g style={getGrowthStyle(progress)}>
        <rect x="15" y="14" width="2" height="14" rx="1" fill="#6a4a1a" />
        <path d="M15 18 C12 18, 10 20, 9 22" stroke="#7a5a20" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M17 20 C20 20, 22 22, 23 24" stroke="#7a5a20" strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="16" cy="13" r="1" fill="#8a5a2a" opacity="0.5" />
      </g>
    </svg>
  );
}

function DeadCorn({ size, progress }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity="0.5">
      <g style={getGrowthStyle(progress)}>
        <rect x="15" y="16" width="1.5" height="12" rx="0.5" fill="#5a5a5a" transform="rotate(-5 16 22)" />
        <path d="M15 20 C12 21, 11 23, 10 25" stroke="#4a4a4a" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}

function PestCorn({ size, progress }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <g style={getGrowthStyle(progress)}>
        <rect x="15" y="10" width="2" height="18" rx="1" fill="#5a4a2a" />
        <path d="M16 15 C11 13, 8 15, 7 17 C8 17, 11 16, 16 15Z" fill="#6a5a22" opacity="0.6" />
        <path d="M17 19 C22 17, 24 19, 25 20 C24 20, 22 20, 17 19Z" fill="#6a5a22" opacity="0.6" />
        {/* Bug / Worm Emoji overlay for maximum visibility */}
        <text x="16" y="24" fontSize="16" textAnchor="middle" dominantBaseline="middle">🐛</text>
      </g>
    </svg>
  );
}
