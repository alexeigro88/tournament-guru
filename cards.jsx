// cards.jsx — TournamentCard with density + featured highlight variants

function TournamentCard({ t, density, featuredStyle, isActive, onHover, onLeave, onClick, accent, rank }) {
  const isFeatured = t.featured;

  if (density === 'compact') {
    return <CompactCard t={t} featuredStyle={featuredStyle} isActive={isActive}
    onHover={onHover} onLeave={onLeave} onClick={onClick} accent={accent} rank={rank} />;
  }
  if (density === 'image-led') {
    return <ImageLedCard t={t} featuredStyle={featuredStyle} isActive={isActive}
    onHover={onHover} onLeave={onLeave} onClick={onClick} accent={accent} rank={rank} />;
  }
  return <HybridCard t={t} featuredStyle={featuredStyle} isActive={isActive}
  onHover={onHover} onLeave={onLeave} onClick={onClick} accent={accent} rank={rank} />;
}

function RankRibbon({ rank }) {
  return null;
}

function FeaturedFrame({ children, t, featuredStyle, accent }) {
  if (!t.featured) return children;
  if (featuredStyle === 'subtle') {
    return (
      <div className="tg-card-feature-wrap" style={{
        background: '#fff',
        border: `1px solid ${accent}33`,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {children}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 5,
          background: '#fff', color: '#0f172a',
          fontSize: 11, fontWeight: 800, letterSpacing: '.1em',
          textTransform: 'uppercase',
          padding: '6px 13px 6px 9px', borderRadius: 999,
          boxShadow: '0 2px 8px rgba(15,23,42,.14)',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={accent} stroke={accent}
            strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
          </svg>
          Featured
        </div>
      </div>);

  }
  // bold
  return (
    <div className="tg-card-feature-wrap" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: 2,
      borderRadius: 18,
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: -10, left: 16, zIndex: 5,
        background: accent, color: '#fff',
        fontSize: 10, fontWeight: 800, letterSpacing: '.1em',
        textTransform: 'uppercase',
        padding: '5px 10px', borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 5
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>
        Featured Tournament
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>);

}

// ── Hybrid (default) ────────────────────────────────────────
function HybridCard({ t, featuredStyle, isActive, onHover, onLeave, onClick, accent, rank }) {
  return (
    <FeaturedFrame t={t} featuredStyle={featuredStyle} accent={accent}>
    <div
        className={`tg-card${isActive ? ' is-active' : ''}`}
        onMouseEnter={() => onHover(t.id)}
        onMouseLeave={onLeave}
        onClick={() => onClick(t.id)}
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: 0,
          background: t.featured ? 'transparent' : '#fff',
          border: t.featured ? 'none' : '1px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(15,23,42,.04)'
        }}>
      <div style={{
          position: 'relative',
          minHeight: 200
        }}>
        <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
        <RankRibbon rank={rank} />
        {t.status === 'Closed' &&
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(15,23,42,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase', textAlign: 'center', padding: 8
          }}>Registration closed</div>
          }
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Eyebrow: date + spots-left */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{
              fontSize: 11, fontWeight: 700, color: accent,
              letterSpacing: '.08em', textTransform: 'uppercase',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
            }}>
            {fmtDateRange(t.dateStart, t.dateEnd)}
          </div>
          {t.spotsLeft > 0 && t.spotsLeft <= 10 &&
            <div style={{
              background: '#fef2f2', color: '#b91c1c',
              fontSize: 10, fontWeight: 700, padding: '3px 7px',
              borderRadius: 999, whiteSpace: 'nowrap',
              border: '1px solid #fecaca',
              letterSpacing: '.02em'
            }}>
              Only {t.spotsLeft} spots left
            </div>
            }
        </div>

        {/* Title */}
        <div style={{
            fontSize: 18, fontWeight: 700, color: '#0f172a',
            letterSpacing: '-0.02em', lineHeight: 1.15,
            marginTop: 8,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            textWrap: 'balance'
          }}>{t.name}</div>

        {/* Location + organizer line */}
        <div style={{
            fontSize: 13, color: '#334155', marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 0
          }}>
          <OrgAvatar name={t.host} size={22} />
          <span style={{ color: '#475569', fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            {t.host}
          </span>
          <span style={{ color: '#cbd5e1' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
              color: '#0f172a',
              whiteSpace: 'nowrap', fontWeight: "600" }}>
            <span style={{ color: '#0f172a', display: 'inline-flex' }}><IconPin2 /></span>
            {t.city}, {t.state}
          </span>
        </div>

        {/* Spec pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
          <Pill>{t.age[0]}–{t.age[t.age.length - 1]} {t.gender !== 'Both' ? t.gender : ''}</Pill>
          <Pill>{t.format}</Pill>
          <Pill>{t.level}</Pill>
          <Pill>{t.surface}</Pill>
          <Pill>{t.teams} teams</Pill>
        </div>

        {/* Footer: rating + price (mirrors Grid view) */}
        <div style={{
            marginTop: 16, paddingTop: 14,
            borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
          }}>
          <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 4,
              lineHeight: 1
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"
              style={{ marginRight: 3, position: 'relative', top: 2 }} stroke="#f59e0b"
              strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
            </svg>
            <span style={{
                fontSize: 19, fontWeight: 800, color: '#0f172a',
                letterSpacing: '-0.02em',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif"
              }}>{t.rating}</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginLeft: 4 }}>
              ({t.reviews})
            </span>
          </div>
          <div style={{
              display: 'flex', alignItems: 'baseline', gap: 4,
              whiteSpace: 'nowrap', flexShrink: 0
            }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a',
                letterSpacing: '-0.03em',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
              ${t.fee}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>/ team</span>
          </div>
        </div>
      </div>
    </div>
    </FeaturedFrame>);

}

// ── Compact rows ────────────────────────────────────────────
function CompactCard({ t, featuredStyle, isActive, onHover, onLeave, onClick, accent, rank }) {
  return (
    <div
      className={`tg-card${isActive ? ' is-active' : ''}`}
      onMouseEnter={() => onHover(t.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(t.id)}
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gap: 14, alignItems: 'center',
        background: t.featured && featuredStyle === 'bold' ? '#fffbeb' : '#fff',
        border: '1px solid #e2e8f0',
        borderLeft: t.featured ? `3px solid ${accent}` : '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(15,23,42,.03)'
      }}>
      <div style={{
        width: 64, height: 64,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0
      }}>
        <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 12,
          textShadow: '0 1px 3px rgba(0,0,0,.6)',
          letterSpacing: '-0.02em'
        }}>
          {t.format}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {t.featured && <span style={{
            background: accent, color: '#fff', fontSize: 9, fontWeight: 800,
            padding: '2px 5px', borderRadius: 3, letterSpacing: '.08em'
          }}>★</span>}
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.name}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2,
          display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span>{fmtDateRange(t.dateStart, t.dateEnd)}</span>
          <span>·</span>
          <span>{t.city}, {t.state}</span>
          <span>·</span>
          <span>{t.age[0]}–{t.age[t.age.length - 1]} {t.gender}</span>
          <span>·</span>
          <span>{t.level}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>${t.fee}</div>
        <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginTop: 2 }}>
          <Star /> {t.rating} <span style={{ color: '#cbd5e1' }}>({t.reviews})</span>
        </div>
      </div>
    </div>);

}

// ── Image-led big cards ─────────────────────────────────────
function ImageLedCard({ t, featuredStyle, isActive, onHover, onLeave, onClick, accent, rank }) {
  return (
    <FeaturedFrame t={t} featuredStyle={featuredStyle} accent={accent}>
      <div
        className={`tg-card${isActive ? ' is-active' : ''}`}
        onMouseEnter={() => onHover(t.id)}
        onMouseLeave={onLeave}
        onClick={() => onClick(t.id)}
        style={{
          background: t.featured ? 'transparent' : '#fff',
          border: t.featured ? 'none' : '1px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(15,23,42,.04)'
        }}>
        <div style={{
          height: 220, position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 14
        }}>
          <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
          <RankRibbon rank={rank} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, position: 'relative', zIndex: 2 }}>
            <div style={{
              background: 'rgba(15,23,42,.6)',
              backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '5px 10px', borderRadius: 999,
              letterSpacing: '.04em', textTransform: 'uppercase'
            }}>
              {t.format} · {t.surface}
            </div>
            <button style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,.95)', border: 0,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ color: '#fff', fontSize: 19, fontWeight: 800,
                letterSpacing: '-0.02em', textShadow: '0 1px 6px rgba(0,0,0,.45)' }}>
                {t.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 12.5, marginTop: 2,
                textShadow: '0 1px 4px rgba(0,0,0,.3)' }}>
                {t.tagline}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12,
              fontSize: 12.5, color: '#334155' }}>
              <Meta icon={<IconCal2 />}>{fmtDateRange(t.dateStart, t.dateEnd)}</Meta>
              <Meta icon={<IconPin2 />}>{t.city}, {t.state}</Meta>
              <Meta icon={<IconAge2 />}>{t.age[0]}–{t.age[t.age.length - 1]} {t.gender}</Meta>
              <Meta icon={<IconLvl />}>{t.level}</Meta>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>${t.fee}</div>
              <div style={{ fontSize: 10.5, color: '#94a3b8' }}>per team</div>
            </div>
          </div>
        </div>
      </div>
    </FeaturedFrame>);

}

// Atoms
function Pill({ children, bold }) {
  return <span style={{
    fontSize: 11, padding: '3px 8px', borderRadius: 999,
    background: bold ? '#0f172a' : '#f1f5f9',
    color: bold ? '#fff' : '#475569',
    fontWeight: 600
  }}>{children}</span>;
}

function Meta({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#475569' }}>
      <span style={{ color: '#94a3b8', display: 'flex' }}>{icon}</span>
      {children}
    </span>);

}

function IconCal2() {return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" /></svg>;}
function IconPin2() {return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></svg>;}
function IconAge2() {return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" /></svg>;}
function IconLvl() {return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>;}

function OrgAvatar({ name, size = 22 }) {
  const initials = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).
  map((w) => w[0]).join('').toUpperCase();
  const palette = ['#0f766e', '#1d4ed8', '#7c2d12', '#9333ea', '#0891b2', '#be123c', '#15803d', '#a16207'];
  const hash = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = palette[hash % palette.length];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.42), fontWeight: 700, flexShrink: 0,
      letterSpacing: '-0.02em', lineHeight: 1,
      fontFamily: 'inherit'
    }} title={name}>{initials || '?'}</span>);

}

// ── Sponsored banner (slotted between result cards) ───────────────
function SponsoredBanner({ accent = '#dc2626' }) {
  const [dismissed, setDismissed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  if (dismissed) return null;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      isolation: 'isolate',
      background: '#0b1226',
      boxShadow: '0 18px 40px -18px rgba(8, 12, 32, .55), 0 1px 0 rgba(255,255,255,.04) inset',
      animation: 'tgSbIn .55s cubic-bezier(.2,.7,.2,1) both',
    }}>
      <style>{`
        @keyframes tgSbIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tgSbAurora {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(2%, -3%, 0) scale(1.08); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        .tg-sb-cta { transition: transform .18s cubic-bezier(.2,.7,.2,1), box-shadow .18s; }
        .tg-sb-cta:hover .tg-sb-arrow { transform: translateX(3px); }
        .tg-sb-arrow { transition: transform .18s cubic-bezier(.2,.7,.2,1); }
        .tg-sb-close { transition: background .15s, transform .15s; }
        .tg-sb-close:hover { background: rgba(255,255,255,.16); transform: scale(1.05); }
        .tg-sb-why:hover { color: rgba(255,255,255,.85) !important; }
      `}</style>

      {/* Aurora */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: -40, zIndex: 0,
        background:
          'radial-gradient(60% 80% at 18% 10%, rgba(99,102,241,.55), transparent 60%),' +
          'radial-gradient(50% 90% at 78% 110%, rgba(244,63,94,.45), transparent 65%),' +
          'radial-gradient(45% 60% at 95% 20%, rgba(56,189,248,.28), transparent 70%)',
        animation: 'tgSbAurora 14s ease-in-out infinite',
        filter: 'saturate(1.05)',
      }}/>

      {/* Sheen + vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background:
          'linear-gradient(180deg, rgba(255,255,255,.05), transparent 30%),' +
          'radial-gradient(120% 80% at 50% 120%, rgba(0,0,0,.45), transparent 60%)',
        pointerEvents: 'none',
      }}/>

      {/* Grain */}
      <svg aria-hidden="true" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 2, opacity: .12, mixBlendMode: 'overlay', pointerEvents: 'none',
      }}>
        <filter id="tg-sb-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .65 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#tg-sb-grain)"/>
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 18,
        padding: '16px 16px 16px 20px',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 10px 4px 8px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.14)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            color: 'rgba(255,255,255,.92)',
            fontSize: 10.5, fontWeight: 800,
            letterSpacing: '.16em', textTransform: 'uppercase',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: '#a5b4fc',
              boxShadow: '0 0 10px rgba(165,180,252,.85)',
            }}/>
            Sponsored
            <span style={{ color: 'rgba(255,255,255,.35)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,.7)' }}>Apex 11 Athletic</span>
          </div>

          <h3 style={{
            marginTop: 9, marginBottom: 0,
            fontSize: 20, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.025em', lineHeight: 1.15,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            textWrap: 'balance',
          }}>
            Win a full Apex&nbsp;11 team kit for your squad
          </h3>
          <p style={{
            marginTop: 5, marginBottom: 0,
            fontSize: 13, color: 'rgba(226,232,240,.78)',
            lineHeight: 1.5, maxWidth: 520,
          }}>
            Register a U10–U14 roster for any eligible tournament by July&nbsp;1 to enter.
          </p>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-end', gap: 9,
        }}>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss ad"
            className="tg-sb-close"
            style={{
              alignSelf: 'flex-end',
              width: 26, height: 26, borderRadius: 999,
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.14)',
              color: '#fff', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, fontFamily: 'inherit',
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6l-12 12"/>
            </svg>
          </button>

          <a href="#"
            className="tg-sb-cta"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 14px 9px 16px',
              background: '#fff',
              color: '#0b1226',
              borderRadius: 999,
              fontSize: 13, fontWeight: 700,
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.005em',
              textDecoration: 'none',
              boxShadow: hover
                ? '0 8px 22px rgba(255,255,255,.18), 0 0 0 4px rgba(255,255,255,.10)'
                : '0 4px 14px rgba(0,0,0,.18)',
              whiteSpace: 'nowrap',
            }}>
            See eligible events
            <svg className="tg-sb-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>

          <a href="#"
            className="tg-sb-why"
            style={{
              fontSize: 11, color: 'rgba(226,232,240,.55)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              textDecorationColor: 'rgba(226,232,240,.3)',
            }}>
            Why this ad?
          </a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TournamentCard, OrgAvatar, SponsoredBanner });