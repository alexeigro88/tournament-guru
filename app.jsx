// app.jsx — main App composition + filtering logic

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "searchStyle": "bar",
  "pinStyle": "price",
  "density": "hybrid",
  "featuredStyle": "subtle",
  "accent": "#dc2626"
} /*EDITMODE-END*/;

const ACCENT_OPTIONS = ['#dc2626', '#0f766e', '#1d4ed8', '#7c2d12'];

function fmtDateRange(start, end) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${fmt(s).split(' ')[0]} ${s.getDate()}–${e.getDate()}`;
  }
  return `${fmt(s)} – ${fmt(e)}`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filters, setFilters] = React.useState({
    query: '',
    dateStart: '', dateEnd: '',
    ages: [], genders: [], levels: [], formats: [], regions: [], surfaces: [],
    openOnly: false
  });
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelFocus, setPanelFocus] = React.useState('all');
  const [activeId, setActiveId] = React.useState(null);
  const [hoverId, setHoverId] = React.useState(null);
  const [mapFullscreen, setMapFullscreen] = React.useState(false);
  const [mapCollapsed, setMapCollapsed] = React.useState(false);
  const [sort, setSort] = React.useState('recommended');
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'grid'
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 10;

  const results = applyFilters(window.TOURNAMENTS, filters, sort);

  // Reset page when filters/sort/view change
  React.useEffect(() => {setPage(1);}, [filters, sort, viewMode]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pagedResults = viewMode === 'list' || viewMode === 'grid' ?
  results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) :
  results;

  const activeFilterCount =
  (filters.dateStart || filters.dateEnd ? 1 : 0) +
  filters.ages.length + filters.genders.length + filters.levels.length +
  filters.formats.length + filters.regions.length + (filters.surfaces?.length || 0) + (
  filters.openOnly ? 1 : 0);

  function openPanel(focus) {setPanelFocus(focus);setPanelOpen(true);}
  function clearFilters() {
    setFilters({ query: '', dateStart: '', dateEnd: '',
      ages: [], genders: [], levels: [], formats: [], regions: [], surfaces: [], openOnly: false });
  }
  function updateFilter(patch) {
    setFilters((f) => ({ ...f, ...patch }));
  }

  // Sync to URL hash for fun
  React.useEffect(() => {
    if (activeId) {
      const el = document.querySelector(`[data-card-id="${activeId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
      color: '#0f172a'
    }}>
      <TopBar accent={t.accent} />

      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', padding: '0 24px' }}>
          <FilterBar
            values={filters}
            onOpen={openPanel}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
            searchStyle={t.searchStyle}
            onChangeQuick={updateFilter} />
          
        </div>
      </div>

      <main style={{ maxWidth: 1480, margin: '0 auto', padding: '20px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mapFullscreen ?
          '1fr' :
          mapCollapsed ?
          '1fr' :
          'minmax(0, 1fr) 400px',
          gap: 24,
          alignItems: 'flex-start'
        }}>
          {!mapFullscreen &&
          <div>
              <ResultsHeader
              count={results.length}
              sort={sort}
              onSort={setSort}
              accent={t.accent}
              mapCollapsed={mapCollapsed}
              onToggleMap={() => setMapCollapsed((v) => !v)}
              viewMode={viewMode}
              onViewMode={setViewMode} />

              {/* Recommended for you strip */}
              {!filters.query && activeFilterCount === 0 &&
            <RecommendedStrip tournaments={window.TOURNAMENTS} accent={t.accent}
            onClick={(id) => {window.location.href = `event.html?id=${id}`;}} />
            }

              {viewMode === 'list' ?
            <>
                  <div style={{
                display: 'flex', flexDirection: 'column',
                gap: t.density === 'compact' ? 8 : 14,
                marginTop: 18
              }}>
                    {pagedResults.map((tn, i) =>
                <React.Fragment key={tn.id}>
                        <div data-card-id={tn.id}>
                          <TournamentCard t={tn}
                    density={t.density}
                    featuredStyle={t.featuredStyle}
                    isActive={activeId === tn.id}
                    onHover={setHoverId}
                    onLeave={() => setHoverId(null)}
                    onClick={(id) => {window.location.href = `event.html?id=${id}`;}}
                    accent={t.accent}
                    rank={page === 1 && i < 3 ? i + 1 : null} />
                        </div>
                        {page === 1 && i === 2 && <SponsoredBanner accent={t.accent} />}
                      </React.Fragment>
                )}
                    {results.length === 0 &&
                <EmptyState onReset={clearFilters} />
                }
                  </div>
                  {results.length > 0 &&
              <Pagination page={page} pageCount={pageCount}
              total={results.length} pageSize={PAGE_SIZE}
              onPage={setPage} accent={t.accent} />
              }
                </> :

            <GridBoard results={pagedResults} accent={t.accent}
            activeId={activeId} setActiveId={setActiveId}
            setHoverId={setHoverId}
            page={page} />
            }
              {viewMode === 'grid' && results.length > 0 &&
            <Pagination page={page} pageCount={pageCount}
            total={results.length} pageSize={PAGE_SIZE}
            onPage={setPage} accent={t.accent} />
            }
            </div>
          }

          {!mapCollapsed &&
          <div style={{
            position: mapFullscreen ? 'fixed' : 'sticky',
            top: mapFullscreen ? 0 : 100,
            right: mapFullscreen ? 0 : 'auto',
            left: mapFullscreen ? 0 : 'auto',
            bottom: mapFullscreen ? 0 : 'auto',
            height: mapFullscreen ? '100vh' : 'calc(100vh - 120px)',
            width: mapFullscreen ? '100vw' : 'auto',
            zIndex: mapFullscreen ? 200 : 1,
            background: '#fff',
            borderRadius: mapFullscreen ? 0 : 16,
            overflow: 'hidden',
            border: mapFullscreen ? 'none' : '1px solid #e2e8f0'
          }}>
              <SearchMap
              tournaments={results}
              activeId={activeId}
              hoverId={hoverId}
              onActiveChange={setActiveId}
              accent={t.accent}
              fullscreen={mapFullscreen}
              onToggleFullscreen={() => setMapFullscreen((v) => !v)}
              onCollapse={() => setMapCollapsed(true)}
              viewportNonce={mapFullscreen ? 'fs' : 'split'} />
            
            </div>
          }

          {/* Floating Show-map pill when collapsed — anchored bottom-right, out of the way */}
          {mapCollapsed && !mapFullscreen &&
          <button onClick={() => setMapCollapsed(false)} style={{
            position: 'fixed', bottom: 22, right: 22,
            zIndex: 80,
            background: '#0f172a', color: '#fff', border: 0,
            borderRadius: 12, padding: '10px 14px',
            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(15,23,42,.28)',
            display: 'flex', alignItems: 'center', gap: 7,
            fontFamily: 'inherit'
          }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5L3 7v12l6-2 6 2 6-2V5l-6 2-6-2z" strokeLinejoin="round" />
                <path d="M9 5v12M15 7v12" />
              </svg>
              Show map
            </button>
          }
        </div>
      </main>

      <FilterPanel
        open={panelOpen}
        focus={panelFocus}
        values={filters}
        onChange={updateFilter}
        onClose={() => setPanelOpen(false)}
        onReset={clearFilters}
        resultCount={results.length} />
      

      <TweaksPanel>
        <TweakSection label="Search bar" />
        <TweakRadio label="Style" value={t.searchStyle}
        options={[{ value: 'bar', label: 'Chip bar' }, { value: 'command', label: 'Command' }]}
        onChange={(v) => setTweak('searchStyle', v)} />

        <TweakSection label="Map pins" />
        <TweakRadio label="Pin style" value={t.pinStyle}
        options={[{ value: 'price', label: 'Price tag' }, { value: 'icon', label: 'Icon' }]}
        onChange={(v) => setTweak('pinStyle', v)} />

        <TweakSection label="Result cards" />
        <TweakRadio label="Density" value={t.density}
        options={[{ value: 'compact', label: 'Compact' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'image-led', label: 'Image-led' }]}
        onChange={(v) => setTweak('density', v)} />
        <TweakRadio label="Featured" value={t.featuredStyle}
        options={[{ value: 'subtle', label: 'Subtle' }, { value: 'bold', label: 'Bold' }]}
        onChange={(v) => setTweak('featuredStyle', v)} />

        <TweakSection label="Theme" />
        <TweakColor label="Accent" value={t.accent}
        options={ACCENT_OPTIONS}
        onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>);

}

function TopBar({ accent }) {
  return (
    <header style={{
      borderBottom: '1px solid #e2e8f0',
      background: '#fff'
    }}>
      <div style={{
        maxWidth: 1480, margin: '0 auto',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Logo accent={accent} />
          <nav style={{ display: 'flex', gap: 22 }}>
            {['Find Events', 'Host an Event', 'Coaches', 'Reviews', 'Resources'].map((n, i) =>
            <a key={n} href="#" style={{
              fontSize: 13.5, color: i === 0 ? '#0f172a' : '#475569',
              fontWeight: i === 0 ? 700 : 500,
              textDecoration: 'none',
              position: 'relative',
              paddingBottom: 6,
              borderBottom: i === 0 ? `2px solid ${accent}` : '2px solid transparent'
            }}>{n}</a>
            )}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '6px 12px 6px 6px',
            border: '1px solid #e2e8f0', borderRadius: 999
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #fb923c, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700
            }}>FL</div>
            <div style={{ fontSize: 12 }}>
              <div style={{ color: '#0f172a', fontWeight: 600, lineHeight: 1.1 }}>Franco</div>
              <div style={{ color: '#94a3b8', fontSize: 10.5 }}>Coach</div>
            </div>
          </div>
        </div>
      </div>
    </header>);

}

function Logo({ accent }) {
  return (
    <a href="home.html" style={{
      display: 'flex', alignItems: 'center', gap: 0,
      textDecoration: 'none'
    }}>
      <img src="assets/tg-logo.svg" alt="Tournament Guru"
      style={{ height: 42, width: 'auto', display: 'block' }} />
    </a>);

}

function ResultsHeader({ count, sort, onSort, accent, mapCollapsed, onToggleMap, viewMode, onViewMode }) {
  return (
    <div>
      <h1 style={{
        fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em',
        color: '#0f172a', margin: 0, lineHeight: 1.05,
        fontFamily: "'Space Grotesk', 'Inter', sans-serif"
      }}>
        Find your next tournament
      </h1>

      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 14, flexWrap: 'wrap',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '10px 14px'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 8,
          fontSize: 13.5, color: '#64748b'
        }}>
          <span style={{
            fontSize: 16, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.02em',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif"
          }}>{count}</span>
          <span>tournaments</span>
          <span style={{ color: '#cbd5e1' }}>·</span>
          <span style={{ whiteSpace: 'nowrap' }}>prices per team</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <ViewToggle value={viewMode} onChange={onViewMode} accent={accent} />

          <button onClick={onToggleMap} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: mapCollapsed ? '#0f172a' : '#fff',
            color: mapCollapsed ? '#fff' : '#0f172a',
            border: `1px solid ${mapCollapsed ? '#0f172a' : '#e2e8f0'}`,
            borderRadius: 10, padding: '7px 12px',
            fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            whiteSpace: 'nowrap'
          }} title={mapCollapsed ? 'Show map' : 'Hide map'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5L3 7v12l6-2 6 2 6-2V5l-6 2-6-2z" strokeLinejoin="round" />
              <path d="M9 5v12M15 7v12" />
            </svg>
            {mapCollapsed ? 'Show map' : 'Hide map'}
          </button>

          <span style={{ width: 1, height: 22, background: '#e2e8f0' }} />

          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#94a3b8', fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            Sort by
            <select value={sort} onChange={(e) => onSort(e.target.value)}
            style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 10, padding: '7px 30px 7px 12px', fontSize: 13,
              fontFamily: 'inherit', color: '#0f172a', fontWeight: 600,
              cursor: 'pointer',
              appearance: 'none', WebkitAppearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center'
            }}>
              <option value="recommended">Recommended</option>
              <option value="date">Date · soonest</option>
              <option value="rating">Highest rated</option>
              <option value="price-low">Price · low to high</option>
              <option value="price-high">Price · high to low</option>
              <option value="teams">Most teams</option>
            </select>
          </label>
        </div>
      </div>
    </div>);

}

function RecommendedStrip({ tournaments, accent, onClick }) {
  const recs = tournaments.filter((t) => t.rating >= 4.6).slice(0, 8);
  const PER_PAGE = 4;
  const pageCount = Math.max(1, Math.ceil(recs.length / PER_PAGE));
  const [page, setPage] = React.useState(0);
  const safePage = Math.min(page, pageCount - 1);
  const slice = recs.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  const arrowBtn = (dir) => {
    const disabled = dir === -1 ? safePage === 0 : safePage >= pageCount - 1;
    return (
      <button onClick={() => !disabled && setPage(safePage + dir)}
      disabled={disabled}
      aria-label={dir < 0 ? 'Previous' : 'Next'}
      style={{
        width: 24, height: 24, borderRadius: 999,
        border: '1px solid #e2e8f0',
        background: '#fff', color: disabled ? '#cbd5e1' : '#0f172a',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'inherit', padding: 0
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {dir < 0 ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </button>);

  };

  return (
    <div style={{
      marginTop: 22,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '16px 18px 18px',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 6,
            background: accent + '15', color: accent, flexShrink: 0
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M13 2L3 14h7v8l10-12h-7V2z" strokeLinejoin="round" />
            </svg>
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>Recommended for you

          </div>
          <span style={{ fontSize: 11.5, color: '#94a3b8', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis' }}>
            · based on past registrations
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {pageCount > 1 &&
          <>
              {arrowBtn(-1)}
              {arrowBtn(1)}
            </>
          }
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${PER_PAGE}, minmax(0, 1fr))`,
        gap: 10, marginTop: 14
      }}>
        {slice.map((t) =>
        <button key={t.id} onClick={() => onClick(t.id)}
        className="tg-card"
        style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          padding: 0, cursor: 'pointer', textAlign: 'left', overflow: 'hidden',
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(15,23,42,.04)'
        }}>
            <div style={{ height: 130, position: 'relative', overflow: 'hidden' }}>
              <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
            </div>
            <div style={{ padding: '9px 11px 11px' }}>
              <div style={{
              fontSize: 10, fontWeight: 700, color: accent,
              letterSpacing: '.08em', textTransform: 'uppercase',
              fontFamily: 'ui-monospace, monospace'
            }}>
                {fmtDateRange(t.dateStart, t.dateEnd)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.01em'
            }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.city}, {t.state}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  ${t.fee}
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {pageCount > 1 &&
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, marginTop: 14
      }}>
          {Array.from({ length: pageCount }).map((_, i) =>
        <button key={i} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`}
        style={{
          width: i === safePage ? 18 : 6, height: 6,
          borderRadius: 999, border: 0,
          background: i === safePage ? '#0f172a' : '#cbd5e1',
          cursor: 'pointer', padding: 0,
          transition: 'width .18s ease, background .18s ease'
        }} />
        )}
        </div>
      }
    </div>);

}

function EmptyState({ onReset }) {
  return (
    <div style={{
      background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 16,
      padding: 40, textAlign: 'center'
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🥅</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
        No tournaments match those filters
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
        Try widening your age range, level, or region.
      </div>
      <button onClick={onReset} style={{
        marginTop: 14, background: '#0f172a', color: '#fff',
        border: 0, borderRadius: 10, padding: '9px 18px',
        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
      }}>Clear filters</button>
    </div>);

}

// ── View toggle (List / Kanban) ────────────────────────────
function ViewToggle({ value, onChange, accent }) {
  const opts = [
  { v: 'list', label: 'List', icon:
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
      </svg>
  },
  { v: 'grid', label: 'Grid', icon:
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
  }];

  return (
    <div style={{
      display: 'inline-flex', background: '#fff',
      border: '1px solid #e2e8f0', borderRadius: 10, padding: 3, gap: 2
    }}>
      {opts.map((o) => {
        const active = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)}
          title={`${o.label} view`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: active ? '#0f172a' : 'transparent',
            color: active ? '#fff' : '#475569',
            border: 0, borderRadius: 7, padding: '5px 9px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background .15s, color .15s'
          }}>
            {o.icon}
            <span>{o.label}</span>
          </button>);

      })}
    </div>);

}

// ── Pagination ─────────────────────────────────────────────
function Pagination({ page, pageCount, total, pageSize, onPage, accent }) {
  if (pageCount <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Build a window of page numbers with ellipses
  const pages = [];
  const push = (p) => pages.push(p);
  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) push(i);
  } else {
    push(1);
    if (page > 3) push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) push(i);
    if (page < pageCount - 2) push('…');
    push(pageCount);
  }

  const pageBtn = (label, p, opts = {}) => {
    const active = opts.active;
    const disabled = opts.disabled;
    return (
      <button key={opts.key ?? label} disabled={disabled}
      onClick={() => !disabled && p && onPage(p)}
      style={{
        minWidth: 36, height: 36, padding: '0 10px',
        background: active ? '#0f172a' : '#fff',
        color: disabled ? '#cbd5e1' : active ? '#fff' : '#0f172a',
        border: `1px solid ${active ? '#0f172a' : '#e2e8f0'}`,
        borderRadius: 10, fontSize: 13, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6
      }}>
        {label}
      </button>);

  };

  return (
    <div style={{
      marginTop: 24, paddingTop: 18, borderTop: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      flexWrap: 'wrap'
    }}>
      <div style={{ fontSize: 12.5, color: '#64748b' }}>
        Showing <b style={{ color: '#0f172a' }}>{start}–{end}</b> of <b style={{ color: '#0f172a' }}>{total}</b> tournaments
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {pageBtn(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Prev
          </span>,
          page - 1, { disabled: page === 1, key: 'prev' }
        )}
        {pages.map((p, i) =>
        p === '…' ?
        <span key={'e' + i} style={{ color: '#94a3b8', padding: '0 4px', fontSize: 13 }}>…</span> :
        pageBtn(p, p, { active: p === page, key: p })
        )}
        {pageBtn(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>,
          page + 1, { disabled: page === pageCount, key: 'next' }
        )}
      </div>
    </div>);

}

// ── Grid view (tiles) ──────────────────────────────
function GridBoard({ results, activeId, setActiveId, setHoverId, accent, page }) {
  if (results.length === 0) return null;
  return (
    <div style={{
      marginTop: 18,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 14
    }}>
      {results.map((tn, i) =>
      <div key={tn.id} data-card-id={tn.id}>
          <GridCard t={tn}
        isActive={activeId === tn.id}
        onHover={setHoverId}
        onLeave={() => setHoverId(null)}
        onClick={(id) => {window.location.href = `event.html?id=${id}`;}}
        accent={accent}
        rank={page === 1 && i < 3 ? i + 1 : null} />
        </div>
      )}
    </div>);

}

function GridCard({ t, isActive, onClick, onHover, onLeave, accent, rank }) {
  const isFeatured = t.featured || rank && rank <= 3;
  return (
    <div
      className={`tg-card${isActive ? ' is-active' : ''}`}
      onMouseEnter={() => onHover && onHover(t.id)}
      onMouseLeave={() => onLeave && onLeave()}
      onClick={() => onClick(t.id)}
      style={{
        background: '#fff',
        border: `1px solid ${isFeatured ? `${accent}33` : '#e2e8f0'}`,
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(15,23,42,.04)',
        display: 'flex', flexDirection: 'column'
      }}>
      <div style={{ height: 150, position: 'relative' }}>
        <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
        <RankRibbon rank={rank} />
        {isFeatured &&
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: '#fff', color: '#0f172a',
          fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
          padding: '5px 12px 5px 8px', borderRadius: 999,
          boxShadow: '0 2px 8px rgba(15,23,42,.14)',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif"
        }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={accent} stroke={accent}
          strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z" />
            </svg>
            Featured
          </div>
        }
        {t.status === 'Closed' &&
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(15,23,42,.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase'
        }}>Registration closed</div>
        }
      </div>
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: accent, letterSpacing: '.08em',
          textTransform: 'uppercase', fontFamily: 'ui-monospace, monospace'
        }}>
          {fmtDateRange(t.dateStart, t.dateEnd)}
        </div>
        <div style={{
          fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 4,
          letterSpacing: '-0.015em', lineHeight: 1.2,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          textWrap: 'balance'
        }}>{t.name}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center',
          gap: 8, minWidth: 0, fontSize: 12, color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
            <OrgAvatar name={t.host} size={20} />
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
              fontWeight: 500
            }}>{t.host}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
            color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {t.city}, {t.state}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
          <Pill>{t.age[0]}–{t.age[t.age.length - 1]}</Pill>
          <Pill>{t.format}</Pill>
          <Pill>{t.level}</Pill>
        </div>
        <div style={{
          marginTop: 'auto', paddingTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 4,
            lineHeight: 1
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"
            style={{ marginRight: 3, position: 'relative', top: 2 }} stroke="#f59e0b" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z" /></svg>
            <span style={{
              fontSize: 15, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.02em',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif"
            }}>{t.rating}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>({t.reviews})</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 3,
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.03em',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
              ${t.fee}
            </span>
            <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 500 }}>/ team</span>
          </div>
        </div>
      </div>
    </div>);

}

// ── Kanban board (grouped by month) ────────────────────────
function KanbanBoard({ results, density, featuredStyle, activeId, setActiveId, accent }) {
  // group by YYYY-MM
  const groups = {};
  results.forEach((t) => {
    const key = t.dateStart.slice(0, 7);
    (groups[key] = groups[key] || []).push(t);
  });
  const keys = Object.keys(groups).sort();
  const fmt = (k) => {
    const [y, m] = k.split('-');
    return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={{
      marginTop: 18,
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(290px, 1fr)',
      gap: 14,
      overflowX: 'auto',
      paddingBottom: 12
    }}>
      {keys.length === 0 &&
      <div style={{ color: '#94a3b8', fontSize: 13, padding: 24 }}>No tournaments to show.</div>
      }
      {keys.map((k) =>
      <div key={k} style={{
        background: '#f1f5f9',
        borderRadius: 14,
        padding: 12,
        display: 'flex', flexDirection: 'column', gap: 10,
        minHeight: 200
      }}>
          <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '2px 4px 8px',
          borderBottom: '1px solid #e2e8f0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
              width: 6, height: 6, borderRadius: 999, background: accent
            }} />
              <div style={{
              fontSize: 12.5, fontWeight: 700, color: '#0f172a',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.01em'
            }}>{fmt(k)}</div>
            </div>
            <div style={{
            fontSize: 11, color: '#64748b', fontWeight: 600,
            background: '#fff', padding: '2px 7px', borderRadius: 999,
            border: '1px solid #e2e8f0'
          }}>{groups[k].length}</div>
          </div>
          {groups[k].map((tn) =>
        <div key={tn.id} data-card-id={tn.id}>
              <KanbanCard t={tn}
          isActive={activeId === tn.id}
          onClick={(id) => {window.location.href = `event.html?id=${id}`;}}
          accent={accent} />
            </div>
        )}
        </div>
      )}
    </div>);

}

function KanbanCard({ t, isActive, onClick, accent }) {
  return (
    <div onClick={() => onClick(t.id)} style={{
      background: '#fff',
      border: `1px solid ${isActive ? '#0f172a' : '#e2e8f0'}`,
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
      boxShadow: isActive ? '0 6px 18px rgba(15,23,42,.14)' : '0 1px 2px rgba(15,23,42,.03)',
      transition: 'all .15s'
    }}>
      <div style={{ height: 110, position: 'relative' }}>
        <CardArt scene={t.scene} style={{ position: 'absolute', inset: 0 }} />
        {t.featured &&
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: accent, color: '#fff',
          fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase',
          padding: '3px 6px', borderRadius: 4
        }}>★ Featured</div>
        }
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: accent, letterSpacing: '.08em',
          textTransform: 'uppercase', fontFamily: 'ui-monospace, monospace'
        }}>
          {fmtDateRange(t.dateStart, t.dateEnd)}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 4,
          letterSpacing: '-0.01em', lineHeight: 1.2,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif"
        }}>{t.name}</div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: '#64748b', minWidth: 0 }}>
          <OrgAvatar name={t.host} size={18} />
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>{t.city}, {t.state}</span>
        </div>
        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11.5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0f172a', fontWeight: 600 }}>
            <Star /> {t.rating}
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>({t.reviews})</span>
          </div>
          <div style={{
            fontSize: 14, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.02em',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif"
          }}>${t.fee}</div>
        </div>
      </div>
    </div>);

}

// ── filter logic ──────────────────────────────────────────────

function applyFilters(all, f, sort) {
  let r = all.filter((t) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      const haystack = `${t.name} ${t.city} ${t.state} ${t.host} ${t.region}`.toLowerCase();
      // strip parsed tokens from raw text-match so "U12 boys" doesn't exclude all
      const stripped = q.replace(/u\d{1,2}/gi, '').replace(/boys|girls/gi, '').
      replace(/\d{1,2}v\d{1,2}/gi, '').replace(/turf|grass/gi, '').trim();
      if (stripped && !haystack.includes(stripped)) {


        // still allow if the tokens-only query (e.g. "U12 boys") matches by token criteria below
        // we'll check tokens separately
      } // token-driven filters
      const tokAge = q.match(/u\d{1,2}/gi);if (tokAge && !tokAge.some((a) => t.age.includes(a.toUpperCase()))) return false;
      if (/boys/i.test(q) && t.gender !== 'Boys' && t.gender !== 'Both') return false;
      if (/girls/i.test(q) && t.gender !== 'Girls' && t.gender !== 'Both') return false;
      const fmt = q.match(/\d{1,2}v\d{1,2}/i);
      if (fmt && t.format.toLowerCase() !== fmt[0].toLowerCase()) return false;
      if (/turf/i.test(q) && t.surface !== 'Turf') return false;
      if (/grass/i.test(q) && t.surface !== 'Grass') return false;
      // free text — match if stripped text is empty (tokens-only) OR haystack matches
      if (stripped && !haystack.includes(stripped)) return false;
    }
    if (f.ages.length && !f.ages.some((a) => t.age.includes(a))) return false;
    if (f.genders.length && !f.genders.includes(t.gender)) return false;
    if (f.levels.length && !f.levels.includes(t.level)) return false;
    if (f.formats.length && !f.formats.includes(t.format)) return false;
    if (f.regions.length && !f.regions.includes(t.region)) return false;
    if (f.surfaces?.length && !f.surfaces.includes(t.surface)) return false;
    if (f.openOnly && t.status !== 'Open') return false;
    if (f.dateStart && t.dateEnd < f.dateStart) return false;
    if (f.dateEnd && t.dateStart > f.dateEnd) return false;
    return true;
  });

  r.sort((a, b) => {
    if (sort === 'date') return a.dateStart.localeCompare(b.dateStart);
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price-low') return a.fee - b.fee;
    if (sort === 'price-high') return b.fee - a.fee;
    if (sort === 'teams') return b.teams - a.teams;
    // recommended: featured first, then rating
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.rating - a.rating;
  });
  return r;
}

// ── Star Icon ─────────────────────────────────────────────────
function Star() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"
      strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
    </svg>
  );
}

// ── Sponsored Banner ──────────────────────────────────────────
function SponsoredBanner({ accent }) {
  return (
    <div style={{
      margin: '24px 0',
      padding: '16px',
      background: '#f0fdf4',
      border: `1px solid #dcfce7`,
      borderRadius: 8,
      fontSize: 12,
      color: '#166534',
      fontWeight: 500
    }}>
      ⭐ <strong>Sponsored:</strong> Partner tournaments are highlighted. <a href="#" style={{color: '#16a34a', textDecoration: 'underline'}}>Learn more</a>
    </div>
  );
}

Object.assign(window, { App });
ReactDOM.createRoot(document.getElementById('root')).render(<App />);