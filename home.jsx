// home.jsx — Tournament Guru home / login page
// Two-column layout: brand + login on the left, value-prop content on the right.

const ACCENT = '#dc2626';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'minmax(360px, 480px) 1fr',
    }}>
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

// ── Left: brand + login form ────────────────────────────────
function LeftPanel() {
  const [email, setEmail] = React.useState('coach@example.com');
  const [password, setPassword] = React.useState('••••••••');
  const [remember, setRemember] = React.useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  }

  return (
    <div style={{
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      padding: '36px 48px 32px',
      minHeight: '100vh',
    }}>
      {/* Brand */}
      <a href="home.html" style={{ display: 'inline-flex', textDecoration: 'none' }}>
        <img src="assets/tg-logo.svg" alt="Tournament Guru"
          style={{ height: 44, width: 'auto' }} />
      </a>

      {/* Login card */}
      <div style={{
        marginTop: 56, marginBottom: 'auto',
        maxWidth: 380,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: ACCENT,
          letterSpacing: '.12em', textTransform: 'uppercase',
          fontFamily: 'ui-monospace, monospace',
        }}>
          Coaches · Parents · Organizers
        </div>
        <h1 style={{
          fontSize: 34, fontWeight: 800, color: '#0f172a',
          letterSpacing: '-0.03em', lineHeight: 1.05,
          marginTop: 10,
          textWrap: 'balance',
        }}>
          Welcome back to Tournament&nbsp;Guru
        </h1>
        <p style={{
          marginTop: 12, marginBottom: 0,
          fontSize: 14.5, color: '#64748b', lineHeight: 1.55,
        }}>
          Sign in to find your team's next tournament, read verified reviews,
          and manage registrations.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="tg-label" htmlFor="email">Email</label>
              <input className="tg-input" id="email" type="email" autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"/>
            </div>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 6,
              }}>
                <label className="tg-label" htmlFor="password" style={{ marginBottom: 0 }}>
                  Password
                </label>
                <a href="#" style={{
                  fontSize: 12, color: ACCENT, fontWeight: 600,
                  textDecoration: 'none',
                }}>Forgot?</a>
              </div>
              <input className="tg-input" id="password" type="password" autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"/>
            </div>

            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#475569', cursor: 'pointer',
              userSelect: 'none', marginTop: 2,
            }}>
              <input type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{
                  width: 16, height: 16, accentColor: '#0f172a', cursor: 'pointer',
                }}/>
              Keep me signed in
            </label>

            <button type="submit" className="tg-btn-primary"
              style={{ marginTop: 6 }}>
              Sign in
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 11.5, color: '#94a3b8', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '.1em',
              margin: '6px 0 2px',
            }}>
              <span style={{ flex: 1, height: 1, background: '#e2e8f0' }}/>
              or
              <span style={{ flex: 1, height: 1, background: '#e2e8f0' }}/>
            </div>

            <button type="button" className="tg-btn-ghost"
              onClick={() => window.location.href = 'index.html'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" fill="#34A853"/>
                <path d="M5.84 14.11A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </form>

        <div style={{
          marginTop: 22, fontSize: 13.5, color: '#64748b', textAlign: 'center',
        }}>
          New to Tournament Guru?{' '}
          <a href="#" style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none' }}>
            Create account
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 24, paddingTop: 18,
        borderTop: '1px solid #f1f5f9',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11.5, color: '#94a3b8',
      }}>
        <div>© 2026 Tournament Guru</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <a href="#" style={{ textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ textDecoration: 'none' }}>Help</a>
        </div>
      </div>
    </div>
  );
}

// ── Right: value-prop, testimonial, featured tournament ────
function RightPanel() {
  return (
    <div style={{
      background: '#fafbfc',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <div style={{
        padding: '40px 56px',
        maxWidth: 640,
        margin: '0 auto',
        width: '100%',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <Hero />
        <StatsRow />
        <SectionLabel dotColor={ACCENT}>From a real coach</SectionLabel>
        <Testimonial />
        <SectionLabel dotColor="#16a34a">Featured this week</SectionLabel>
        <FeaturedEvent />
      </div>
    </div>
  );
}

function SectionLabel({ children, dotColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: -14, marginTop: 4,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999, background: dotColor || '#94a3b8',
        flexShrink: 0,
      }}/>
      <span style={{
        fontSize: 10.5, fontWeight: 800, color: '#475569',
        letterSpacing: '.14em', textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        whiteSpace: 'nowrap',
      }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: '#e2e8f0' }}/>
    </div>
  );
}

function Hero() {
  return (
    <div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: '#fef2f2', color: ACCENT,
        border: '1px solid #fecaca',
        padding: '5px 11px 5px 9px', borderRadius: 999,
        fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em',
        textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={ACCENT} stroke={ACCENT}
          strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
        </svg>
        One-stop shop for youth sporting events
      </div>
      <h2 style={{
        fontSize: 32, fontWeight: 800, color: '#0f172a',
        letterSpacing: '-0.03em', lineHeight: 1.05,
        marginTop: 10,
        textWrap: 'balance',
      }}>
        Find the right tournament for your team — <span style={{ color: ACCENT }}>before</span> you sign up.
      </h2>
      <p style={{
        marginTop: 16, fontSize: 15, color: '#475569', lineHeight: 1.55,
        maxWidth: 600, marginBottom: 0,
      }}>
        We help coaches, parents, and managers compare youth sporting events using verified
        reviews from people who actually attended — so you never get burned again.
      </p>
    </div>
  );
}

function PainPoint() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '14px 16px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 6,
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 8,
          background: '#fff7ed', color: '#c2410c',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #fed7aa', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#0f172a',
          letterSpacing: '-0.01em',
        }}>Has your team been burned before?</h3>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
        We pick our plumbers and even our next meal based on reviews. Picking a youth tournament
        shouldn't be any different. <b style={{ color: '#0f172a' }}>Get the facts from the Gurus.</b>
      </p>
    </div>
  );
}

function Testimonial() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '14px 16px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 12, right: 12,
        fontSize: 9.5, fontWeight: 800, color: '#fff',
        background: ACCENT, padding: '3px 8px', borderRadius: 999,
        letterSpacing: '.08em', textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        Guru Review
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name="Marc Freeman" size={36}/>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Marc Freeman</div>
          <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Coach · U14 Boys</div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{
            fontSize: 14.5, fontWeight: 700, color: '#0f172a',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.01em',
          }}>
            Spectacular performance
          </div>
          <Stars rating={4.5} count={null}/>
        </div>
        <p style={{
          marginTop: 6, marginBottom: 0,
          fontSize: 13, color: '#334155', lineHeight: 1.5,
        }}>
          An unforgettable event that showcased the passion of athletes and fans alike. Would
          recommend for any team looking for a high-energy weekend.
        </p>
      </div>
    </div>
  );
}

function Stars({ rating, count }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.4 && rating - full < 0.9;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      marginTop: 6,
    }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const half = i === full && hasHalf;
          const color = (filled || half) ? '#f59e0b' : '#e2e8f0';
          return (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={color} stroke={color}
              strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
            </svg>
          );
        })}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 800, color: '#0f172a',
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: '-0.01em',
      }}>{rating.toFixed(1)}</span>
      {count != null && (
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
}

function Avatar({ name, size }) {
  const initials = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0]).join('').toUpperCase();
  const palette = ['#0f766e','#1d4ed8','#7c2d12','#9333ea','#0891b2','#be123c','#15803d'];
  const hash = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = palette[hash % palette.length];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.4), fontWeight: 700,
      flexShrink: 0,
    }}>{initials}</span>
  );
}

function FeaturedEvent() {
  return (
    <a href="event.html?id=t6" style={{
      textDecoration: 'none', color: 'inherit',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '130px 1fr',
      transition: 'box-shadow .2s, transform .2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(15,23,42,.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #fbbf24, #dc2626 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg viewBox="0 0 100 120" width="80%" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.25))' }}>
          {/* Shield */}
          <path d="M50 5 L88 18 L88 60 Q88 95 50 115 Q12 95 12 60 L12 18 Z"
            fill="#0f172a" stroke="#fff" strokeWidth="3" strokeLinejoin="round"/>
          {/* Junior text */}
          <text x="50" y="48" textAnchor="middle"
            fill="#fff" fontSize="13" fontWeight="800"
            fontFamily="Space Grotesk, sans-serif" letterSpacing=".05em">JUNIOR</text>
          <text x="50" y="90" textAnchor="middle"
            fill="#fbbf24" fontSize="9" fontWeight="700"
            fontFamily="Space Grotesk, sans-serif" letterSpacing=".18em">U9 · CHAMPS · U15</text>
          {/* Ball */}
          <circle cx="50" cy="65" r="9" fill="#fff" stroke="#0f172a" strokeWidth="1.5"/>
          <path d="M50 56 L53 62 L50 65 L47 62 Z" fill="#0f172a"/>
        </svg>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontWeight: 800, color: '#15803d',
          letterSpacing: '.08em', textTransform: 'uppercase',
          fontFamily: 'ui-monospace, monospace',
          background: '#ecfdf5', border: '1px solid #bbf7d0',
          padding: '2px 7px', borderRadius: 999,
          alignSelf: 'flex-start',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: 999, background: '#16a34a',
          }}/>
          Open
        </div>
        <div style={{
          fontSize: 17, fontWeight: 700, color: '#0f172a',
          letterSpacing: '-0.02em', marginTop: 6,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Midwest Junior Championships
        </div>
        <Stars rating={4.8} count={347}/>
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9',
          fontSize: 12, color: '#64748b',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span>Aug 14–16, 2026</span>
          <span style={{ color: '#cbd5e1' }}>·</span>
          <span>Chicago, IL</span>
          <span style={{ color: '#cbd5e1' }}>·</span>
          <span>U9–U15 · 11v11</span>
        </div>
      </div>
    </a>
  );
}

function StatsRow() {
  const stats = [
    { value: '1,200+', label: 'tournaments listed' },
    { value: '24,000+', label: 'verified reviews' },
    { value: '5,400+', label: 'teams registered' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '11px 14px',
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.025em',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>{s.value}</div>
          <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
