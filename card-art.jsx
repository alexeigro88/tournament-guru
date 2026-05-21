// card-art.jsx — tournament card hero images.
// Primary: real photography (per-scene Unsplash photo).
// Fallback: themed SVG illustration if the photo fails to load.

const SCENE_PHOTOS = {
  // All photos are soccer / football themed
  field:    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80&auto=format&fit=crop",   // turf goal + ball
  beach:    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80&auto=format&fit=crop", // kids running with ball
  mountain: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80&auto=format&fit=crop", // outdoor match action
  city:     "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80&auto=format&fit=crop", // soccer ball on pitch
  trophy:   "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80&auto=format&fit=crop", // trophy / celebration
  indoor:   "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&q=80&auto=format&fit=crop", // indoor sport hall
  desert:   "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200&q=80&auto=format&fit=crop",   // player with ball
  forest:   "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80&auto=format&fit=crop", // boots on grass
  prairie:  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=80&auto=format&fit=crop",   // youth kick
  lake:     "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1200&q=80&auto=format&fit=crop", // pitch lights at night
  capitol:  "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1200&q=80&auto=format&fit=crop", // pitch from above
};

function CardArt({ scene, palette, label, className, style }) {
  const Scene = SCENES[scene] || SCENES.field;
  const p = palette || DEFAULT_PALETTES[scene] || DEFAULT_PALETTES.field;
  const photo = SCENE_PHOTOS[scene];
  const [imgFailed, setImgFailed] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: p.bg,
      overflow: 'hidden',
      ...style,
    }} className={className}>
      {/* SVG illustration sits underneath — visible briefly while photo loads
          and as graceful fallback if the photo fails. */}
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Scene p={p} />
      </svg>
      {photo && !imgFailed && (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity .35s ease',
          }}
        />
      )}
      {label && (
        <div style={{
          position: 'absolute', left: 12, bottom: 10,
          color: '#fff', fontSize: 10.5, fontWeight: 700,
          letterSpacing: '.1em', textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,.45)',
          fontFamily: 'ui-monospace, monospace',
          zIndex: 3,
        }}>{label}</div>
      )}
    </div>
  );
}

// ── Scenes ──────────────────────────────────────────────────

const DEFAULT_PALETTES = {
  field:    { bg: 'linear-gradient(180deg, #166534 0%, #14532d 100%)', line: '#86efac', accent: '#fbbf24' },
  beach:    { bg: 'linear-gradient(180deg, #fde68a 0%, #fb923c 60%, #f97316 100%)', line: '#fff7ed', accent: '#0c4a6e' },
  mountain: { bg: 'linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)', line: '#0c4a6e', accent: '#fff' },
  city:     { bg: 'linear-gradient(180deg, #1e293b 0%, #312e81 100%)', line: '#94a3b8', accent: '#fbbf24' },
  trophy:   { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)', line: '#78350f', accent: '#fff' },
  indoor:   { bg: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)', line: '#a5b4fc', accent: '#fbbf24' },
  desert:   { bg: 'linear-gradient(180deg, #fed7aa 0%, #fb923c 60%, #c2410c 100%)', line: '#7c2d12', accent: '#fff' },
  forest:   { bg: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)', line: '#6ee7b7', accent: '#fbbf24' },
  prairie:  { bg: 'linear-gradient(180deg, #fde68a 0%, #d97706 100%)', line: '#78350f', accent: '#fff' },
  lake:     { bg: 'linear-gradient(180deg, #67e8f9 0%, #0891b2 60%, #164e63 100%)', line: '#cffafe', accent: '#fbbf24' },
  capitol:  { bg: 'linear-gradient(180deg, #be123c 0%, #831843 100%)', line: '#fbcfe8', accent: '#fff' },
};

const SCENES = {
  // 1) Open soccer field with goal + ball
  field: ({ p }) => (
    <g>
      {/* turf stripes */}
      <rect width="400" height="220" fill="url(#turfStripes)" />
      <defs>
        <pattern id="turfStripes" width="40" height="220" patternUnits="userSpaceOnUse">
          <rect width="20" height="220" fill="rgba(255,255,255,.04)" />
        </pattern>
      </defs>
      {/* center circle */}
      <ellipse cx="200" cy="160" rx="120" ry="30" fill="none" stroke={p.line} strokeWidth="1.5" opacity=".5" />
      <line x1="0" y1="160" x2="400" y2="160" stroke={p.line} strokeWidth="1.5" opacity=".4" />
      {/* goal */}
      <g transform="translate(290,90)">
        <rect width="70" height="50" fill="none" stroke={p.line} strokeWidth="2" />
        <path d="M0 50 L-10 70 L80 70 L70 50" fill={p.line} opacity=".15" stroke={p.line} strokeWidth="1.2" />
        {/* net */}
        <g stroke={p.line} strokeWidth=".4" opacity=".4">
          {[10,20,30,40,50,60].map(x => <line key={x} x1={x} y1="0" x2={x} y2="50" />)}
          {[10,20,30,40].map(y => <line key={y} x1="0" y1={y} x2="70" y2={y} />)}
        </g>
      </g>
      {/* ball */}
      <g transform="translate(120,165)">
        <circle r="14" fill="#fff"/>
        <path d="M0 -14 L4 -4 L0 4 L-4 -4 Z M0 4 L8 8 L4 14 M0 4 L-8 8 L-4 14 M4 -4 L11 -8 M-4 -4 L-11 -8" fill="none" stroke="#0f172a" strokeWidth="1.2" strokeLinejoin="round"/>
        <ellipse cx="0" cy="22" rx="14" ry="3" fill="rgba(0,0,0,.3)" />
      </g>
      {/* corner flag */}
      <g transform="translate(15,30)">
        <line x1="0" y1="0" x2="0" y2="80" stroke={p.line} strokeWidth="1.5" />
        <path d="M0 0 L20 8 L0 16 Z" fill={p.accent} />
      </g>
    </g>
  ),

  // 2) Beach / coastal — palm + sun
  beach: ({ p }) => (
    <g>
      <circle cx="320" cy="60" r="40" fill="#fff" opacity=".85" />
      <circle cx="320" cy="60" r="60" fill="#fff" opacity=".15" />
      {/* sea horizon */}
      <path d="M0 150 Q200 145 400 150 L400 220 L0 220 Z" fill="rgba(12,74,110,.4)" />
      <path d="M0 165 Q200 160 400 165 L400 220 L0 220 Z" fill="rgba(12,74,110,.5)" />
      {/* palm */}
      <g transform="translate(70,210)">
        <path d="M0 0 Q-3 -50 5 -110" fill="none" stroke="#3f3f1f" strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(5,-110)">
          <path d="M0 0 Q-20 -10 -50 -5 Q-30 0 0 0" fill="#065f46" />
          <path d="M0 0 Q-25 5 -55 25 Q-30 8 0 0" fill="#047857" />
          <path d="M0 0 Q20 -15 55 -10 Q30 0 0 0" fill="#065f46" />
          <path d="M0 0 Q20 8 50 28 Q30 10 0 0" fill="#047857" />
          <path d="M0 0 Q0 -30 -8 -55 Q-2 -25 0 0" fill="#065f46" />
        </g>
      </g>
      {/* ball */}
      <g transform="translate(200,175)">
        <circle r="14" fill="#fff" />
        <path d="M0 -14 L4 -4 L0 4 L-4 -4 Z" fill="none" stroke={p.accent} strokeWidth="1.2"/>
      </g>
      {/* sand line */}
      <path d="M0 200 Q200 195 400 200 L400 220 L0 220 Z" fill={p.bg.split('60%')[0] ? '#fed7aa' : '#fde68a'} opacity=".4"/>
    </g>
  ),

  // 3) Mountain — Denver/Portland
  mountain: ({ p }) => (
    <g>
      {/* sun */}
      <circle cx="320" cy="60" r="22" fill="#fff" opacity=".8" />
      {/* back peaks */}
      <path d="M0 160 L60 90 L100 130 L180 60 L240 130 L300 80 L400 140 L400 220 L0 220 Z"
            fill="rgba(15,23,42,.3)" />
      {/* front peaks */}
      <path d="M0 180 L80 110 L130 150 L200 90 L260 150 L320 110 L400 170 L400 220 L0 220 Z"
            fill="#1e293b" />
      {/* snow caps */}
      <path d="M180 60 L200 80 L220 65 L210 92 L195 85 L185 90 Z" fill="#fff" opacity=".7" />
      <path d="M200 90 L218 105 L210 115 L195 108 Z" fill="#fff" opacity=".85" />
      {/* foreground field */}
      <rect x="0" y="170" width="400" height="50" fill="#064e3b" />
      <path d="M0 175 Q200 168 400 175" stroke="#86efac" strokeWidth="1" fill="none" opacity=".5" />
      {/* goal */}
      <g transform="translate(60,160)">
        <rect width="55" height="22" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".8"/>
      </g>
    </g>
  ),

  // 4) City skyline — Chicago/Boston/Austin
  city: ({ p }) => (
    <g>
      {/* sky stars */}
      {[[80,40],[140,25],[200,55],[260,30],[320,50],[360,20]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r=".8" fill="#fff" opacity=".7"/>
      ))}
      <circle cx="60" cy="50" r="14" fill="#fbbf24" opacity=".9"/>
      {/* skyline */}
      <g>
        <rect x="0" y="120" width="40" height="80" fill="#0f172a"/>
        <rect x="40" y="100" width="55" height="100" fill="#1e293b"/>
        <rect x="95" y="80" width="45" height="120" fill="#0f172a"/>
        <path d="M115 80 L115 60 L120 60 L120 80" fill="#0f172a"/>
        <rect x="140" y="110" width="60" height="90" fill="#1e293b"/>
        <rect x="200" y="70" width="40" height="130" fill="#0f172a"/>
        <rect x="240" y="95" width="55" height="105" fill="#1e293b"/>
        <rect x="295" y="115" width="40" height="85" fill="#0f172a"/>
        <rect x="335" y="90" width="65" height="110" fill="#1e293b"/>
        <path d="M355 90 L355 70 L362 70 L362 90" fill="#1e293b"/>
        {/* windows */}
        <g fill={p.accent} opacity=".75">
          {[[10,140],[10,160],[10,180],[25,140],[25,180],[55,120],[55,160],[78,120],[78,140],[105,100],[105,140],[125,100],[125,140],[160,130],[180,150],[210,90],[225,110],[255,110],[275,140],[305,135],[305,170],[345,110],[365,130],[385,150]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="4" height="6"/>
          ))}
        </g>
      </g>
      {/* field strip */}
      <rect x="0" y="200" width="400" height="20" fill="#166534"/>
      <line x1="0" y1="208" x2="400" y2="208" stroke="#86efac" strokeWidth=".8" opacity=".5"/>
    </g>
  ),

  // 5) Trophy / featured marquee
  trophy: ({ p }) => (
    <g>
      {/* confetti */}
      {[[40,30,'#fff'],[80,60,'#0f172a'],[330,40,'#fff'],[360,80,'#0f172a'],[60,150,'#fff'],[340,170,'#fff'],[100,90,'#dc2626'],[300,30,'#dc2626']].map(([x,y,c],i) => (
        <rect key={i} x={x} y={y} width="6" height="3" fill={c} transform={`rotate(${i*30} ${x} ${y})`}/>
      ))}
      {/* trophy */}
      <g transform="translate(200,110)">
        {/* handles */}
        <path d="M-50 -20 Q-80 -20 -80 10 Q-80 35 -55 35" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 -20 Q80 -20 80 10 Q80 35 55 35" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
        {/* cup */}
        <path d="M-50 -45 L50 -45 L45 40 Q45 65 0 65 Q-45 65 -45 40 Z" fill="#fff" stroke="#78350f" strokeWidth="2"/>
        {/* shine */}
        <path d="M-35 -38 L-35 30 Q-35 50 -10 55" fill="none" stroke={p.bg.split('0%')[0] || '#fbbf24'} strokeWidth="3" opacity=".5" strokeLinecap="round"/>
        {/* star */}
        <path d="M0 -25 L5 -10 L20 -8 L9 2 L12 17 L0 9 L-12 17 L-9 2 L-20 -8 L-5 -10 Z" fill="#dc2626"/>
        {/* base */}
        <rect x="-25" y="65" width="50" height="10" fill="#fff" stroke="#78350f" strokeWidth="2"/>
        <rect x="-35" y="75" width="70" height="14" fill="#fff" stroke="#78350f" strokeWidth="2"/>
      </g>
    </g>
  ),

  // 6) Indoor futsal court
  indoor: ({ p }) => (
    <g>
      {/* spotlights */}
      <ellipse cx="100" cy="40" rx="60" ry="20" fill="#fef3c7" opacity=".2"/>
      <ellipse cx="300" cy="40" rx="60" ry="20" fill="#fef3c7" opacity=".2"/>
      {/* court */}
      <path d="M40 100 L360 100 L400 220 L0 220 Z" fill="#3730a3"/>
      {/* court lines */}
      <path d="M40 100 L360 100 L400 220 L0 220 Z" fill="none" stroke={p.line} strokeWidth="1.5" opacity=".7"/>
      <line x1="200" y1="100" x2="200" y2="220" stroke={p.line} strokeWidth="1.5" opacity=".7"/>
      <ellipse cx="200" cy="160" rx="50" ry="18" fill="none" stroke={p.line} strokeWidth="1.5" opacity=".7"/>
      {/* ball */}
      <g transform="translate(200,160)">
        <circle r="10" fill="#fef3c7" />
        <path d="M0 -10 L3 -3 L0 3 L-3 -3 Z" fill="none" stroke="#3730a3" strokeWidth=".8"/>
      </g>
      {/* lights overhead */}
      <g fill="#fef3c7">
        <rect x="60" y="20" width="30" height="6" rx="1"/>
        <rect x="180" y="15" width="40" height="6" rx="1"/>
        <rect x="310" y="20" width="30" height="6" rx="1"/>
      </g>
    </g>
  ),

  // 7) Desert / Phoenix
  desert: ({ p }) => (
    <g>
      {/* sun */}
      <circle cx="330" cy="70" r="35" fill="#fff" opacity=".7"/>
      <circle cx="330" cy="70" r="20" fill="#fef3c7"/>
      {/* dunes */}
      <path d="M0 170 Q100 140 200 165 Q300 185 400 155 L400 220 L0 220 Z" fill="#c2410c"/>
      <path d="M0 195 Q150 175 300 195 Q380 205 400 200 L400 220 L0 220 Z" fill="#9a3412"/>
      {/* saguaro cactus */}
      <g transform="translate(80,200)" fill="#15803d">
        <rect x="-6" y="-70" width="12" height="70" rx="3"/>
        <rect x="-22" y="-50" width="10" height="30" rx="3"/>
        <rect x="-22" y="-58" width="6" height="12"/>
        <rect x="12" y="-55" width="10" height="35" rx="3"/>
        <rect x="16" y="-63" width="6" height="12"/>
      </g>
      <g transform="translate(330,210)" fill="#15803d">
        <rect x="-5" y="-40" width="10" height="40" rx="3"/>
      </g>
    </g>
  ),

  // 8) Forest / PNW
  forest: ({ p }) => (
    <g>
      {/* mist */}
      <rect width="400" height="120" fill="#022c22" opacity=".5"/>
      {/* trees */}
      {[
        [40,200,55],[100,210,75],[170,205,65],[240,215,80],[310,205,70],[370,210,60],
        [70,205,40],[140,210,45],[200,200,50],[280,210,55],[345,205,45]
      ].map(([x,y,h],i) => (
        <g key={i}>
          <path d={`M${x-h/3} ${y} L${x} ${y-h} L${x+h/3} ${y} Z`}
                fill={i%2 ? '#064e3b' : '#022c22'}/>
          <path d={`M${x-h/4} ${y-h*.35} L${x} ${y-h*1.05} L${x+h/4} ${y-h*.35} Z`}
                fill={i%2 ? '#065f46' : '#064e3b'}/>
        </g>
      ))}
      {/* ground line */}
      <rect x="0" y="210" width="400" height="10" fill="#064e3b"/>
      {/* moon */}
      <circle cx="80" cy="50" r="16" fill="#fef3c7" opacity=".8"/>
    </g>
  ),

  // 9) Prairie / Midwest
  prairie: ({ p }) => (
    <g>
      {/* sky */}
      <circle cx="340" cy="60" r="26" fill="#fff" opacity=".7"/>
      {/* fields stripes */}
      <path d="M0 130 Q200 120 400 130 L400 160 L0 160 Z" fill="#fbbf24"/>
      <path d="M0 155 Q200 150 400 155 L400 180 L0 180 Z" fill="#f59e0b"/>
      <path d="M0 175 Q200 173 400 175 L400 200 L0 200 Z" fill="#d97706"/>
      <path d="M0 195 Q200 195 400 195 L400 220 L0 220 Z" fill="#92400e"/>
      {/* silo */}
      <g transform="translate(310,135)">
        <rect x="-12" y="-55" width="24" height="55" fill="#7c2d12"/>
        <ellipse cx="0" cy="-55" rx="12" ry="6" fill="#451a03"/>
        <rect x="-2" y="-60" width="4" height="10" fill="#451a03"/>
      </g>
      {/* fence */}
      <g stroke="#78350f" strokeWidth="2" fill="none">
        <line x1="0" y1="160" x2="100" y2="160"/>
        <line x1="0" y1="165" x2="100" y2="165"/>
        {[20,40,60,80].map(x => <line key={x} x1={x} y1="155" x2={x} y2="175"/>)}
      </g>
    </g>
  ),

  // 10) Lake / Minnesota
  lake: ({ p }) => (
    <g>
      <circle cx="320" cy="50" r="20" fill="#fff" opacity=".7"/>
      {/* far shore */}
      <path d="M0 130 Q200 120 400 130 L400 145 L0 145 Z" fill="#0c4a6e" opacity=".6"/>
      {/* water */}
      <rect x="0" y="140" width="400" height="80" fill="url(#waterGrad)"/>
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0891b2"/>
          <stop offset="1" stopColor="#164e63"/>
        </linearGradient>
      </defs>
      {/* ripples */}
      {[150,165,180,195,210].map((y,i) => (
        <path key={i} d={`M0 ${y} Q100 ${y-2} 200 ${y} Q300 ${y+2} 400 ${y}`}
              stroke="#67e8f9" strokeWidth=".6" fill="none" opacity={.5 - i*.07}/>
      ))}
      {/* trees on shore */}
      {[[30,135,18],[60,138,14],[90,135,16],[350,138,15],[380,135,17]].map(([x,y,h],i) => (
        <path key={i} d={`M${x-h/3} ${y} L${x} ${y-h} L${x+h/3} ${y} Z`} fill="#064e3b"/>
      ))}
      {/* boat */}
      <g transform="translate(150,180)">
        <path d="M-25 0 L25 0 L20 8 L-20 8 Z" fill="#fff"/>
        <path d="M0 0 L0 -22 L18 -3 Z" fill="#fbbf24"/>
        <line x1="0" y1="-22" x2="0" y2="0" stroke="#0f172a" strokeWidth="1.2"/>
      </g>
    </g>
  ),

  // 11) Capitol / DC - Mid-Atlantic
  capitol: ({ p }) => (
    <g>
      {/* monument */}
      <path d="M188 80 L200 30 L212 80 Z" fill="#fff" opacity=".15"/>
      <rect x="188" y="80" width="24" height="100" fill="#fff" opacity=".2"/>
      {/* dome capitol */}
      <g transform="translate(200,180)">
        <rect x="-90" y="-20" width="180" height="20" fill="#fff"/>
        <rect x="-70" y="-50" width="140" height="30" fill="#fff"/>
        <path d="M-30 -50 Q-30 -100 0 -100 Q30 -100 30 -50 Z" fill="#fff"/>
        <rect x="-3" y="-110" width="6" height="10" fill={p.accent}/>
        <circle cx="0" cy="-110" r="3" fill={p.accent}/>
        {/* columns */}
        <g stroke="#fbcfe8" strokeWidth="1.2">
          {[-55,-35,-15,5,25,45].map(x => <line key={x} x1={x} y1="-20" x2={x} y2="-50"/>)}
        </g>
        <g stroke="#fbcfe8" strokeWidth="1.2">
          {[-80,-65,65,80].map(x => <line key={x} x1={x} y1="-5" x2={x} y2="-20"/>)}
        </g>
      </g>
      {/* lawn */}
      <rect x="0" y="180" width="400" height="40" fill="#166534"/>
      <line x1="0" y1="195" x2="400" y2="195" stroke="#86efac" strokeWidth=".5" opacity=".5"/>
    </g>
  ),
};

Object.assign(window, { CardArt });
