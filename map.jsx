// map.jsx — Real Leaflet/OpenStreetMap rendering with custom markers + click-only previews.
//
// Uses Leaflet (loaded via <script> in index.html) with OpenStreetMap tiles so we don't need
// any API key. Markers are HTML elements (Leaflet DivIcon) so we can style them in CSS.

// Each tournament's geographic location — keyed by id.
const TOURNAMENT_LATLNG = {
  t1:  [32.7157, -117.1611], // San Diego, CA
  t2:  [39.7392, -104.9903], // Denver, CO
  t3:  [30.2672,  -97.7431], // Austin, TX
  t4:  [42.3601,  -71.0589], // Boston, MA
  t5:  [28.5383,  -81.3792], // Orlando, FL
  t6:  [41.8781,  -87.6298], // Chicago, IL
  t7:  [45.5152, -122.6784], // Portland, OR
  t8:  [38.8816,  -77.0910], // Arlington, VA
  t9:  [33.4484, -112.0740], // Phoenix, AZ
  t10: [39.0997,  -94.5786], // Kansas City, MO
  t11: [33.7490,  -84.3880], // Atlanta, GA
  t12: [44.9778,  -93.2650], // Minneapolis, MN
};

function fmtDateRange(start, end) {
  const s = new Date(start), e = new Date(end);
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (s.getMonth() === e.getMonth()) {
    return `${m[s.getMonth()]} ${s.getDate()}–${e.getDate()}`;
  }
  return `${m[s.getMonth()]} ${s.getDate()} – ${m[e.getMonth()]} ${e.getDate()}`;
}

function Star() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"
      strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
    </svg>
  );
}

function Chip({ children }) {
  return <span style={{
    fontSize: 10.5, fontWeight: 600, padding: '2px 7px',
    background: '#f1f5f9', color: '#334155',
    borderRadius: 999, letterSpacing: '.01em',
  }}>{children}</span>;
}

// ── Preview card (rendered React-side, positioned absolutely over the map) ─
function PreviewCard({ tournament, accent, onClose, position }) {
  if (!tournament || !position) return null;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: position.x, top: position.y,
        transform: 'translate(-50%, calc(-100% - 28px))',
        width: 260, zIndex: 600,
        background: '#fff', borderRadius: 14,
        boxShadow: '0 12px 36px rgba(15,23,42,.22), 0 2px 8px rgba(15,23,42,.12)',
        overflow: 'hidden',
        animation: 'tgFadeUp .14s ease-out',
        pointerEvents: 'auto',
      }}>
      <button
        onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
        aria-label="Close preview"
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 5,
          width: 26, height: 26, borderRadius: '50%',
          border: 0, background: 'rgba(255,255,255,.95)',
          color: '#0f172a', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(15,23,42,.16)',
          padding: 0, fontFamily: 'inherit',
        }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
      <a href={`event.html?id=${tournament.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
          <CardArt scene={tournament.scene} style={{ position: 'absolute', inset: 0 }} />
          {tournament.featured && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: '#fff', color: '#0f172a',
              fontSize: 10, fontWeight: 800, letterSpacing: '.08em',
              textTransform: 'uppercase',
              padding: '4px 10px 4px 7px', borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              boxShadow: '0 2px 6px rgba(15,23,42,.14)',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill={accent} stroke={accent}
                strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/>
              </svg>
              Featured
            </div>
          )}
        </div>
        <div style={{ padding: '11px 13px 13px' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.25,
            letterSpacing: '-0.01em' }}>
            {tournament.name}
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>
            {tournament.city}, {tournament.state} · {fmtDateRange(tournament.dateStart, tournament.dateEnd)}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
            <Chip>{tournament.format}</Chip>
            <Chip>{tournament.age[0]}–{tournament.age[tournament.age.length-1]}</Chip>
            <Chip>{tournament.gender}</Chip>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 11, paddingTop: 10, borderTop: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star /> <b style={{ color: '#0f172a' }}>{tournament.rating}</b>
              <span style={{ color: '#94a3b8' }}>· {tournament.teams} teams</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.02em' }}>
              ${tournament.fee}
            </div>
          </div>
        </div>
      </a>
      <div style={{
        position: 'absolute', left: '50%', bottom: -7,
        width: 14, height: 14, marginLeft: -7,
        background: '#fff', transform: 'rotate(45deg)',
        boxShadow: '4px 4px 6px rgba(15,23,42,.08)',
      }} />
    </div>
  );
}

// ── Main map component ────────────────────────────────────────────────
function SearchMap({ tournaments, activeId, hoverId, onActiveChange, accent, fullscreen,
                    onToggleFullscreen, onCollapse, viewportNonce }) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef({});           // { [id]: L.Marker }
  const [previewPos, setPreviewPos] = React.useState(null);

  const focusedTournament = tournaments.find(t => t.id === activeId);

  // Mount Leaflet map once
  React.useEffect(() => {
    if (!window.L || !containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [39.5, -98.35],
      zoom: 4,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
    });
    // Light, Google-Maps-ish tile set
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
    }).addTo(map);

    mapRef.current = map;

    // Reposition preview whenever map moves
    const updatePreview = () => {
      const id = window.__tgActiveIdRef;
      if (!id || !markersRef.current[id]) {
        setPreviewPos(null);
        return;
      }
      const marker = markersRef.current[id];
      const pt = map.latLngToContainerPoint(marker.getLatLng());
      setPreviewPos({ x: pt.x, y: pt.y });
    };
    map.on('move zoom', updatePreview);
    window.__tgUpdatePreview = updatePreview;

    return () => {
      map.off('move zoom', updatePreview);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // (Re)render markers when tournament list changes
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Remove all existing
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    tournaments.forEach(t => {
      const coords = TOURNAMENT_LATLNG[t.id];
      if (!coords) return;
      const isActive = activeId === t.id;
      const html = `<div class="tg-pin ${isActive ? 'tg-pin--active' : ''}">
        <span class="tg-pin-dot"></span>
      </div>`;
      const icon = L.divIcon({
        html, className: 'tg-pin-icon',
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      const marker = L.marker(coords, { icon, riseOnHover: true }).addTo(map);
      marker.on('click', () => {
        onActiveChange(activeId === t.id ? null : t.id);
      });
      markersRef.current[t.id] = marker;
    });
  }, [tournaments, accent]);

  // Toggle active/hover class + update preview when activeId/hoverId changes
  React.useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const pinEl = el.querySelector('.tg-pin');
      if (!pinEl) return;
      pinEl.classList.toggle('tg-pin--active', id === activeId);
      pinEl.classList.toggle('tg-pin--hover',  id === hoverId && id !== activeId);
      if (id === activeId) marker.setZIndexOffset(1000);
      else if (id === hoverId) marker.setZIndexOffset(500);
      else marker.setZIndexOffset(0);
    });

    window.__tgActiveIdRef = activeId;
    if (!mapRef.current) { setPreviewPos(null); return; }
    if (activeId && markersRef.current[activeId]) {
      const marker = markersRef.current[activeId];
      // Pan so marker is comfortably visible (avoid card cropping at top)
      mapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.35 });
      // After pan, compute position
      requestAnimationFrame(() => {
        const pt = mapRef.current.latLngToContainerPoint(marker.getLatLng());
        setPreviewPos({ x: pt.x, y: pt.y });
      });
    } else {
      setPreviewPos(null);
    }
  }, [activeId, hoverId]);

  // When hovering a card from the list, pan map to its pin if it's currently
  // outside the visible area. Doesn't open the preview — just brings the
  // matching pin into view.
  React.useEffect(() => {
    if (!hoverId || hoverId === activeId) return;
    const map = mapRef.current;
    const marker = markersRef.current[hoverId];
    if (!map || !marker) return;
    const bounds = map.getBounds();
    if (!bounds.contains(marker.getLatLng())) {
      map.panTo(marker.getLatLng(), { animate: true, duration: 0.35 });
    }
  }, [hoverId, activeId]);

  // Invalidate size when container reflows (fullscreen toggle / show-hide)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [viewportNonce, fullscreen]);

  function zoom(delta) {
    if (!mapRef.current) return;
    mapRef.current.setZoom(mapRef.current.getZoom() + delta);
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#e8eef3',
      overflow: 'hidden',
    }}>
      <div ref={containerRef} style={{
        position: 'absolute', inset: 0,
      }}/>

      <PreviewCard tournament={focusedTournament} accent={accent}
        position={previewPos} onClose={() => onActiveChange(null)} />

      {/* Map controls */}
      <div style={{
        position: 'absolute', top: 14, right: 14, display: 'flex',
        flexDirection: 'column', gap: 6, zIndex: 500,
      }}>
        <MapBtn title={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={onToggleFullscreen}>
          {fullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round"/>
            </svg>
          )}
        </MapBtn>
        {onCollapse && !fullscreen && (
          <MapBtn title="Hide map" onClick={onCollapse}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/>
            </svg>
          </MapBtn>
        )}
        <div style={{
          background: '#fff', borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(15,23,42,.12), 0 0 0 1px rgba(15,23,42,.06)',
        }}>
          <MapBtn title="Zoom in" onClick={() => zoom(1)} flat>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
          </MapBtn>
          <div style={{ height: 1, background: '#e2e8f0' }} />
          <MapBtn title="Zoom out" onClick={() => zoom(-1)} flat>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14" strokeLinecap="round"/>
            </svg>
          </MapBtn>
        </div>
      </div>

      {/* Search-as-I-move toggle */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: '#fff', borderRadius: 999, padding: '8px 14px',
        boxShadow: '0 4px 16px rgba(15,23,42,.16), 0 0 0 1px rgba(15,23,42,.06)',
        fontSize: 12.5, fontWeight: 600, color: '#0f172a',
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 500,
      }}>
        <span style={{
          width: 22, height: 12, background: '#0f172a', borderRadius: 999,
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute', right: 2, top: 2, width: 8, height: 8,
            background: '#fff', borderRadius: '50%',
          }} />
        </span>
        Search as I move the map
      </div>
    </div>
  );
}

function MapBtn({ children, onClick, title, flat }) {
  return (
    <button onClick={onClick} title={title}
      style={{
        width: 34, height: 34, border: 0,
        background: '#fff',
        color: '#0f172a',
        borderRadius: flat ? 0 : 10,
        boxShadow: flat ? 'none' : '0 2px 10px rgba(15,23,42,.12), 0 0 0 1px rgba(15,23,42,.06)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      {children}
    </button>
  );
}

Object.assign(window, { SearchMap, fmtDateRange, Star });
