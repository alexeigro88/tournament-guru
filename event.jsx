// event.jsx — Event detail page

const ACCENT = '#dc2626';

function getEventId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 't1';
}

function fmtDateRange(start, end) {
  const s = new Date(start), e = new Date(end);
  const opts = { month: 'short', day: 'numeric' };
  const startStr = s.toLocaleDateString('en-US', opts);
  const endStr = e.toLocaleDateString('en-US', s.getMonth() === e.getMonth() ? { day: 'numeric' } : opts);
  const yr = e.getFullYear();
  return `${startStr} – ${endStr}, ${yr}`;
}

function fmtFullDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function OrgAvatar({ name, size = 22 }) {
  const initials = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0]).join('').toUpperCase();
  const palette = ['#0f766e','#1d4ed8','#7c2d12','#9333ea','#0891b2','#be123c','#15803d','#a16207'];
  const hash = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = palette[hash % palette.length];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.4), fontWeight: 700, flexShrink: 0,
      letterSpacing: '-0.02em', lineHeight: 1,
    }}>{initials || '?'}</span>
  );
}

function Star({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>
  );
}

// Rounded-corner star — used for Featured/award badges where a softer
// shape reads better than the sharp default rating star.
function RoundedStar({ size = 14, color = '#f59e0b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color}
      strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
    </svg>
  );
}

// ── App ─────────────────────────────────────────────────────
function App() {
  const id = getEventId();
  const t = window.TOURNAMENTS.find(x => x.id === id) || window.TOURNAMENTS[0];

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', color: '#0f172a',
    }}>
      <TopBar />
      <Hero t={t} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: 36, alignItems: 'flex-start',
        }}>
          {/* LEFT — content */}
          <div>
            <KeyFacts t={t} />
            <About t={t} />
            <Schedule t={t} />
            <Amenities t={t} />
            <LocationBlock t={t} />
            <HostBlock t={t} />
            <Reviews t={t} />
          </div>

          {/* RIGHT — registration sidebar */}
          <aside style={{ position: 'sticky', top: 24 }}>
            <RegisterCard t={t} />
            <SimilarEvents t={t} />
          </aside>
        </div>
      </main>
    </div>
  );
}

// ── TopBar ──────────────────────────────────────────────────
function TopBar() {
  return (
    <header style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
      <div style={{
        maxWidth: 1480, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <a href="home.html" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg style={{ height: 42, width: 'auto', display: 'block' }} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="45" fontFamily="Space Grotesk, sans-serif" fontSize="32" fontWeight="700" fill="#dc2626">🏆</text>
              <text x="50" y="40" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="600" fill="#0f172a">TG</text>
            </svg>
          </a>
          <nav style={{ display: 'flex', gap: 22 }}>
            {['Find Events','Host an Event','Coaches','Reviews','Resources'].map((n, i) => (
              <a key={n} href={n === 'Find Events' ? 'index.html' : '#'} style={{
                fontSize: 13.5, color: i === 0 ? '#0f172a' : '#475569',
                fontWeight: i === 0 ? 700 : 500,
                textDecoration: 'none',
                paddingBottom: 6,
                borderBottom: i === 0 ? `2px solid ${ACCENT}` : '2px solid transparent',
              }}>{n}</a>
            ))}
          </nav>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '6px 12px 6px 6px',
          border: '1px solid #e2e8f0', borderRadius: 999,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fb923c, #dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 11, fontWeight: 700,
          }}>FL</div>
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#0f172a', fontWeight: 600, lineHeight: 1.1 }}>Franco</div>
            <div style={{ color: '#94a3b8', fontSize: 10.5 }}>Coach</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Hero ────────────────────────────────────────────────────
function Hero({ t }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <button onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = 'index.html')}
            aria-label="Back"
            style={{
              width: 36, height: 36, borderRadius: 999,
              border: '1px solid #e2e8f0', background: '#fff',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#0f172a',
              fontFamily: 'inherit',
              transition: 'background .15s, border-color .15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div style={{ fontSize: 12.5, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
            <a href="index.html" style={{ color: '#64748b', textDecoration: 'none' }}>Find Events</a>
            <span>›</span>
            <span style={{ color: '#94a3b8' }}>{t.region}</span>
            <span>›</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{t.name}</span>
          </div>
        </div>

        <div style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '220px 220px',
          gap: 8,
          borderRadius: 18,
          overflow: 'hidden',
          gridTemplateAreas: '"a b c" "a d e"',
        }}>
          <div style={{ gridArea: 'a', position: 'relative', background: '#e2e8f0', minHeight: 0 }}>
            <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
            {t.featured && (
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: '#fff', color: '#0f172a',
                fontSize: 12, fontWeight: 800, letterSpacing: '.1em',
                textTransform: 'uppercase',
                padding: '7px 16px 7px 12px', borderRadius: 999,
                boxShadow: '0 4px 14px rgba(15,23,42,.16)',
                display: 'inline-flex', alignItems: 'center', gap: 9,
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              }}>
                <RoundedStar size={16} color="#f59e0b"/>
                Featured
              </div>
            )}
          </div>
          <div style={{ gridArea: 'b', position: 'relative', background: '#e2e8f0' }}>
            <CardArt scene="field" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div style={{ gridArea: 'c', position: 'relative', background: '#e2e8f0' }}>
            <CardArt scene="trophy" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div style={{ gridArea: 'd', position: 'relative', background: '#e2e8f0' }}>
            <CardArt scene="indoor" style={{ position: 'absolute', inset: 0 }} />
          </div>
          <div style={{ gridArea: 'e', position: 'relative', background: '#e2e8f0' }}>
            <CardArt scene="forest" style={{ position: 'absolute', inset: 0 }} />
            <button style={{
              position: 'absolute', bottom: 14, right: 14,
              background: 'rgba(255,255,255,.95)', border: 0,
              padding: '8px 14px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(0,0,0,.18)',
              fontFamily: 'inherit',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Show all 24 photos
            </button>
          </div>
        </div>

        <div style={{
          padding: '24px 0 22px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ minWidth: 0, maxWidth: 720 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: ACCENT,
              letterSpacing: '.1em', textTransform: 'uppercase',
              fontFamily: 'ui-monospace, monospace',
            }}>
              {fmtDateRange(t.dateStart, t.dateEnd)}
            </div>
            <h1 style={{
              fontSize: 40, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.03em', lineHeight: 1.05,
              marginTop: 8,
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              textWrap: 'balance',
            }}>{t.name}</h1>
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 14,
              fontSize: 14, color: '#475569', flexWrap: 'wrap',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#0f172a', fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {t.city}, {t.state}
              </span>
              <span style={{ color: '#cbd5e1' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Star size={13}/>
                <b style={{ color: '#0f172a' }}>{t.rating}</b> ({t.reviews} reviews)
              </span>
              <span style={{ color: '#cbd5e1' }}>·</span>
              <span>{t.sanctioned}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="ev-btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v14"/>
              </svg>
              Share
            </button>
            <button className="ev-btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Key facts grid ─────────────────────────────────────────
function KeyFacts({ t }) {
  const ageRange = `${t.age[0]}–${t.age[t.age.length-1]}`;
  const facts = [
    { label: 'Age group',  value: ageRange,       icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>) },
    { label: 'Gender',     value: t.gender,       icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>) },
    { label: 'Format',     value: t.format,       icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>) },
    { label: 'Surface',    value: t.surface,      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20h18M5 20V8l7-5 7 5v12"/></svg>) },
    { label: 'Level',      value: t.level,        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>) },
    { label: 'Teams',      value: t.teams,        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>) },
  ];

  return (
    <section style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
      padding: '20px 22px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
      }}>
        {facts.map((f, i) => (
          <div key={f.label} style={{
            padding: '6px 12px',
            borderLeft: i === 0 ? 'none' : '1px solid #f1f5f9',
            minWidth: 0,
          }}>
            <div style={{ color: '#94a3b8', marginBottom: 6 }}>{f.icon}</div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '.06em' }}>
              {f.label}
            </div>
            <div style={{
              fontSize: 17, fontWeight: 700, color: '#0f172a', marginTop: 2,
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.01em',
            }}>{f.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────
function About({ t }) {
  return (
    <Section title="About this tournament">
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#334155' }}>
        <b style={{ color: '#0f172a' }}>{t.tagline || t.name}.</b>{' '}
        Hosted by {t.host} on professionally-maintained {t.surface.toLowerCase()} pitches
        in {t.city}, {t.state}. Expect {t.teams} teams across the {t.age[0]}–{t.age[t.age.length-1]}
        {' '}{t.gender.toLowerCase()} {t.format} brackets, with three guaranteed games
        plus elimination rounds for the top finishers.
      </p>
      <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: '#334155' }}>
        This event is sanctioned by <b style={{ color: '#0f172a' }}>{t.sanctioned}</b>
        {' '}and uses certified referees for every match. The {t.level.toLowerCase()}-bracket
        format means your team will face evenly-matched competition — {t.reviews}+ coaches
        have rated the experience {t.rating} out of 5.
      </p>
      <div style={{
        marginTop: 16, padding: 14,
        background: '#f8fafc', borderRadius: 12,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
      }}>
        {[
          { label: '3-game minimum', icon: '⚽' },
          { label: 'Certified refs', icon: '✓' },
          { label: 'Trophies for finalists', icon: '🏆' },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#fff', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>{f.icon}</div>
            <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{f.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Schedule ───────────────────────────────────────────────
function Schedule({ t }) {
  const days = [];
  const start = new Date(t.dateStart);
  const end = new Date(t.dateEnd);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const plans = [
    [
      { time: '8:00 AM',  text: 'Check-in & coach meeting' },
      { time: '9:00 AM',  text: 'Group stage · Round 1' },
      { time: '1:30 PM',  text: 'Group stage · Round 2' },
      { time: '5:00 PM',  text: 'Welcome cookout (free for players)' },
    ],
    [
      { time: '9:00 AM',  text: 'Group stage · Round 3' },
      { time: '12:30 PM', text: 'Round of 16' },
      { time: '4:00 PM',  text: 'Quarterfinals' },
    ],
    [
      { time: '9:00 AM',  text: 'Semifinals' },
      { time: '1:00 PM',  text: 'Finals — all age groups' },
      { time: '4:30 PM',  text: 'Awards ceremony' },
    ],
    [
      { time: '9:00 AM',  text: 'Consolation matches' },
      { time: '12:00 PM', text: 'Champions tournament' },
    ],
  ];

  return (
    <Section title="Schedule">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {days.map((d, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '170px 1fr', gap: 18,
            padding: '14px 16px',
            background: '#fff',
            border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: ACCENT,
                letterSpacing: '.08em', textTransform: 'uppercase',
                fontFamily: 'ui-monospace, monospace',
              }}>Day {i + 1}</div>
              <div style={{
                fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 2,
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                letterSpacing: '-0.01em',
              }}>
                {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(plans[i] || plans[plans.length-1]).map((p, j) => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12,
                  fontSize: 13.5, color: '#334155', alignItems: 'baseline' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {p.time}
                  </span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Amenities ──────────────────────────────────────────────
function Amenities({ t }) {
  const items = [
    'Free parking on-site',
    'Concessions & food trucks',
    'Athletic trainer at each field',
    'Live bracket updates app',
    'Photographer & video highlights',
    'Restrooms & changing rooms',
    'Player wristbands & lanyards',
    'Tournament shirts available',
  ];
  return (
    <Section title="What's included">
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px',
      }}>
        {items.map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 14, color: '#334155' }}>
            <span style={{ color: '#15803d', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            {i}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Location ───────────────────────────────────────────────
function LocationBlock({ t }) {
  return (
    <Section title="Where you'll play">
      <div style={{ fontSize: 14, color: '#334155', marginBottom: 12 }}>
        <b style={{ color: '#0f172a' }}>Heritage Park Sports Complex</b><br/>
        12345 Park Way, {t.city}, {t.state} 92101
      </div>
      <div style={{
        height: 320,
        borderRadius: 14, overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(135deg, #ecfccb, #d9f99d 40%, #bef264 100%)',
        border: '1px solid #e2e8f0',
      }}>
        <svg viewBox="0 0 600 320" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* roads */}
          <path d="M0 80 Q200 90 600 70" stroke="#fff" strokeWidth="20" fill="none" opacity=".7"/>
          <path d="M0 80 Q200 90 600 70" stroke="#e2e8f0" strokeWidth="2" fill="none"/>
          <path d="M150 0 L160 320" stroke="#fff" strokeWidth="14" opacity=".7"/>
          <path d="M150 0 L160 320" stroke="#e2e8f0" strokeWidth="1.5"/>
          <path d="M420 0 L440 320" stroke="#fff" strokeWidth="14" opacity=".7"/>
          <path d="M420 0 L440 320" stroke="#e2e8f0" strokeWidth="1.5"/>
          {/* park rectangle */}
          <rect x="200" y="120" width="200" height="140" rx="8" fill="#86efac" opacity=".7"/>
          {/* soccer pitches */}
          <g>
            <rect x="220" y="140" width="70" height="45" fill="#22c55e" stroke="#fff" strokeWidth="1"/>
            <line x1="255" y1="140" x2="255" y2="185" stroke="#fff" strokeWidth=".8"/>
            <rect x="300" y="140" width="70" height="45" fill="#22c55e" stroke="#fff" strokeWidth="1"/>
            <line x1="335" y1="140" x2="335" y2="185" stroke="#fff" strokeWidth=".8"/>
            <rect x="220" y="200" width="70" height="45" fill="#22c55e" stroke="#fff" strokeWidth="1"/>
            <rect x="300" y="200" width="70" height="45" fill="#22c55e" stroke="#fff" strokeWidth="1"/>
          </g>
          {/* pin */}
          <g transform="translate(300, 180)">
            <circle r="22" fill="rgba(220,38,38,.18)"/>
            <path d="M0 -18 C-12 -18 -18 -8 -18 -2 C-18 8 0 22 0 22 C0 22 18 8 18 -2 C18 -8 12 -18 0 -18 Z"
              fill={ACCENT}/>
            <circle r="5" cx="0" cy="-4" fill="#fff"/>
          </g>
        </svg>
        <button className="ev-btn-ghost" style={{
          position: 'absolute', top: 14, right: 14,
          fontSize: 12.5, fontWeight: 600, padding: '8px 12px',
        }}>Open in maps</button>
      </div>
      <div style={{
        marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        fontSize: 13, color: '#475569',
      }}>
        <FactItem k="Airport" v="SAN — 8 mi" />
        <FactItem k="Hotels nearby" v="32 within 5 mi" />
        <FactItem k="Parking" v="600+ spaces, free" />
      </div>
    </Section>
  );
}

function FactItem({ k, v }) {
  return (
    <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '.06em' }}>{k}</div>
      <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{v}</div>
    </div>
  );
}

// ── Host ───────────────────────────────────────────────────
function HostBlock({ t }) {
  return (
    <Section title="About the host">
      <div style={{
        display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, alignItems: 'flex-start',
      }}>
        <OrgAvatar name={t.host} size={64} />
        <div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#0f172a',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            letterSpacing: '-0.01em',
          }}>{t.host}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3,
            display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Star size={12}/> <b style={{ color: '#0f172a' }}>4.9</b> · 1,240 reviews
            </span>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <span>Hosting since 2014</span>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <span>43 tournaments</span>
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
            One of the longest-running tournament organizers in the {t.region.toLowerCase()},
            known for tight schedules, fair brackets, and weekend-long player experience.
            Most teams come back year after year.
          </p>
          <button className="ev-btn-ghost" style={{ marginTop: 12 }}>Contact host</button>
        </div>
      </div>
    </Section>
  );
}

// ── Reviews ────────────────────────────────────────────────
function Reviews({ t }) {
  const reviews = [
    { name: 'Marco D.',       role: 'U14 Boys coach',  rating: 5, date: '2 weeks ago',
      text: "Hands-down the best-run tournament we've been to this year. Bracket play started on time, every game. Refs were sharp." },
    { name: 'Sarah K.',       role: 'Director, FC Pulse', rating: 5, date: '1 month ago',
      text: "Brought four teams, all four had great competition. Field quality was excellent. Already signed up for next year." },
    { name: 'James W.',       role: 'U12 Girls coach', rating: 4, date: '2 months ago',
      text: "Solid event with good organization. Concessions could be improved, but the soccer was top-notch." },
    { name: 'Priya N.',       role: 'Parent',          rating: 5, date: '3 months ago',
      text: "Loved how welcoming the volunteers were. Kids had a blast, families had things to do between games." },
  ];

  const breakdown = [
    { label: 'Field quality',  value: 4.9 },
    { label: 'Organization',   value: 4.8 },
    { label: 'Competition',    value: 4.9 },
    { label: 'Communication',  value: 4.6 },
    { label: 'Value',          value: 4.5 },
  ];

  return (
    <Section title={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <Star size={20}/>
        <b style={{ color: '#0f172a' }}>{t.rating}</b>
        <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 16 }}>· {t.reviews} reviews</span>
      </span>
    }>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24,
      }}>
        {breakdown.map(b => (
          <div key={b.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              fontSize: 13.5, color: '#0f172a' }}>
              <span style={{ fontWeight: 600 }}>{b.label}</span>
              <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{b.value.toFixed(1)}</span>
            </div>
            <div style={{ marginTop: 5, height: 4, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${(b.value/5)*100}%`, height: '100%', background: '#0f172a', borderRadius: 999 }}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            padding: 16, border: '1px solid #e2e8f0', borderRadius: 14,
            background: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <OrgAvatar name={r.name} size={36}/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{r.role}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', gap: 1 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill={j < r.rating ? '#f59e0b' : '#e2e8f0'} stroke={j < r.rating ? '#f59e0b' : '#e2e8f0'} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>
                ))}
              </span>
              <span>·</span>
              <span>{r.date}</span>
            </div>
            <p style={{ marginTop: 10, marginBottom: 0, fontSize: 13.5, color: '#334155',
              lineHeight: 1.55 }}>{r.text}</p>
          </div>
        ))}
      </div>
      <button className="ev-btn-ghost" style={{ marginTop: 18 }}>
        Show all {t.reviews} reviews
      </button>
    </Section>
  );
}

// ── Register sidebar ────────────────────────────────────────
function RegisterCard({ t }) {
  const spotsLow = t.spotsLeft > 0 && t.spotsLeft <= 10;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
      padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: 28, fontWeight: 800, color: '#0f172a',
          letterSpacing: '-0.03em',
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        }}>${t.fee}</span>
        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>per team</span>
      </div>

      {spotsLow && (
        <div style={{
          marginTop: 10,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fef2f2', color: '#b91c1c',
          border: '1px solid #fecaca',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 12, fontWeight: 700,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#dc2626' }}/>
          Only {t.spotsLeft} spots left
        </div>
      )}

      <div style={{
        marginTop: 16,
        border: '1px solid #e2e8f0', borderRadius: 12,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        <div style={{ padding: '10px 12px', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em' }}>Starts</div>
          <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>
            {new Date(t.dateStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em' }}>Ends</div>
          <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>
            {new Date(t.dateEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 10, padding: '10px 12px',
        border: '1px solid #e2e8f0', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em' }}>Team</div>
          <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>
            Pick a team to register
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      <button className="ev-btn-primary" style={{
        marginTop: 16, width: '100%', padding: '14px 18px', fontSize: 15,
      }}>
        Register team
      </button>
      <div style={{ marginTop: 10, fontSize: 11.5, color: '#94a3b8', textAlign: 'center' }}>
        You won't be charged yet — registration confirmed by host.
      </div>

      <div style={{
        marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9',
        display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#475569',
      }}>
        <Line label={`Team fee × 1`} value={`$${t.fee}`}/>
        <Line label="Platform service fee" value="$25"/>
        <div style={{
          marginTop: 4, paddingTop: 10, borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 15, color: '#0f172a', fontWeight: 800,
        }}>
          <span>Total</span>
          <span style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>${t.fee + 25}</span>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ── Similar events ─────────────────────────────────────────
function SimilarEvents({ t }) {
  const similar = window.TOURNAMENTS
    .filter(x => x.id !== t.id && (x.region === t.region || x.format === t.format))
    .slice(0, 3);

  return (
    <div style={{
      marginTop: 18,
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
      padding: 18,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12,
        fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
        Similar tournaments
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {similar.map(s => (
          <a key={s.id} href={`event.html?id=${s.id}`} style={{
            display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10,
            alignItems: 'center', textDecoration: 'none',
            padding: 6, borderRadius: 10,
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <CardArt scene={s.scene} style={{ position: 'absolute', inset: 0 }}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.name}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>
                {s.city}, {s.state}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>${s.fee}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────
function Section({ title, children }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{
        fontSize: 22, fontWeight: 700, color: '#0f172a',
        letterSpacing: '-0.02em', marginBottom: 14,
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}>{title}</h2>
      {children}
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
