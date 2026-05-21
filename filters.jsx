// filters.jsx — compact filter bar + slide-out FilterPanel

function FilterBar({ values, onOpen, onClear, activeFilterCount, searchStyle, onChangeQuick }) {
  const chips = [
    { key: 'dates', label: 'Dates', icon: <IconCal/>, summary: dateSummary(values.dateStart, values.dateEnd) },
    { key: 'age', label: 'Age', icon: <IconAge/>, summary: listSummary(values.ages) },
    { key: 'gender', label: 'Gender', icon: <IconGender/>, summary: listSummary(values.genders) },
    { key: 'level', label: 'Level', icon: <IconStar/>, summary: listSummary(values.levels) },
    { key: 'format', label: 'Format', icon: <IconBall/>, summary: listSummary(values.formats) },
    { key: 'region', label: 'Region', icon: <IconPin/>, summary: listSummary(values.regions) },
  ];

  if (searchStyle === 'command') {
    return <CommandBar values={values} activeFilterCount={activeFilterCount}
                       onOpen={onOpen} onClear={onClear} onChangeQuick={onChangeQuick} />;
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 0',
      flexWrap: 'wrap',
    }}>
      <div style={{
        flex: '1 1 280px', minWidth: 240,
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '0 14px',
        height: 40,
      }}>
        <span style={{ color: '#94a3b8', display: 'flex', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" strokeLinecap="round"/>
          </svg>
        </span>
        <input type="text" placeholder="Search tournaments, cities, hosts…"
          value={values.query || ''}
          onChange={e => onChangeQuick({ query: e.target.value })}
          style={{
            border: 0, outline: 'none', background: 'transparent',
            fontSize: 14, color: '#0f172a', width: '100%',
            fontFamily: 'inherit',
            padding: 0,
            lineHeight: 1,
          }}/>
      </div>

      {chips.map(chip => (
        <FilterChip key={chip.key}
                    label={chip.label}
                    icon={chip.icon}
                    summary={chip.summary}
                    active={!!chip.summary}
                    onClick={() => onOpen(chip.key)} />
      ))}

      <button onClick={() => onOpen('all')}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 14px',
          background: activeFilterCount ? '#0f172a' : '#fff',
          color: activeFilterCount ? '#fff' : '#0f172a',
          border: `1px solid ${activeFilterCount ? '#0f172a' : '#cbd5e1'}`,
          borderRadius: 12,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round"/>
        </svg>
        All filters
        {activeFilterCount > 0 && (
          <span style={{
            background: activeFilterCount && '#fff', color: '#0f172a',
            fontSize: 11, padding: '1px 6px', borderRadius: 999, fontWeight: 700,
          }}>{activeFilterCount}</span>
        )}
      </button>

      {activeFilterCount > 0 && (
        <button onClick={onClear} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontSize: 13, color: '#64748b', textDecoration: 'underline',
          fontWeight: 500, fontFamily: 'inherit',
        }}>Clear</button>
      )}
    </div>
  );
}

function FilterChip({ label, icon, summary, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '9px 14px',
      background: active ? '#0f172a' : '#fff',
      color: active ? '#fff' : '#0f172a',
      border: `1px solid ${active ? '#0f172a' : '#e2e8f0'}`,
      borderRadius: 999,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'all .15s ease',
    }}>
      <span style={{ display: 'flex', opacity: active ? 1 : 0.7 }}>{icon}</span>
      {summary ? <span>{label}: <b style={{ fontWeight: 700 }}>{summary}</b></span> : label}
    </button>
  );
}

function CommandBar({ values, activeFilterCount, onOpen, onClear, onChangeQuick }) {
  // tokenized — when query contains "U12", "boys", "turf" etc., parse to chips
  const tokens = parseQuery(values.query || '');
  return (
    <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1.5px solid #0f172a',
        borderRadius: 14, padding: '10px 14px',
        boxShadow: '0 4px 18px rgba(15,23,42,.08)',
      }}>
        <span style={{ color: '#0f172a', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" strokeLinecap="round"/>
          </svg>
        </span>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 6,
          flexWrap: 'wrap', minWidth: 0,
        }}>
          {tokens.map((tok, i) => (
            <span key={i} style={{
              background: '#0f172a', color: '#fff',
              fontSize: 12.5, fontWeight: 600,
              padding: '3px 9px', borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ opacity: .6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {tok.type}
              </span>
              {tok.value}
            </span>
          ))}
          <input
            value={values.query || ''}
            onChange={e => onChangeQuick({ query: e.target.value })}
            placeholder="Try “U12 boys highest level turf June in Texas”"
            style={{
              flex: 1, minWidth: 200,
              border: 0, outline: 'none', background: 'transparent',
              fontSize: 14.5, color: '#0f172a', fontFamily: 'inherit',
            }}/>
        </div>
        <button onClick={() => onOpen('all')} style={{
          background: '#0f172a', color: '#fff',
          border: 0, borderRadius: 10,
          padding: '8px 14px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Filters
          {activeFilterCount > 0 && (
            <span style={{ background: '#fff', color: '#0f172a',
              fontSize: 10.5, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600,
          letterSpacing: '.04em', textTransform: 'uppercase' }}>Try:</span>
        {['This weekend', 'Boys U13 highest', 'Girls 11v11', '3v3 in Texas'].map(s => (
          <button key={s} onClick={() => onChangeQuick({ query: s })} style={{
            background: '#f1f5f9', border: 0, padding: '4px 10px', borderRadius: 999,
            fontSize: 11.5, color: '#475569', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>{s}</button>
        ))}
        {activeFilterCount > 0 && (
          <button onClick={onClear} style={{
            background: 'transparent', border: 0, marginLeft: 'auto',
            fontSize: 12, color: '#64748b', textDecoration: 'underline',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Clear all</button>
        )}
      </div>
    </div>
  );
}

function parseQuery(q) {
  const toks = [];
  const ageMatch = q.match(/U\d{1,2}/gi);
  if (ageMatch) ageMatch.forEach(a => toks.push({ type: 'age', value: a.toUpperCase() }));
  if (/boys/i.test(q)) toks.push({ type: 'gender', value: 'Boys' });
  if (/girls/i.test(q)) toks.push({ type: 'gender', value: 'Girls' });
  const fmt = q.match(/\d{1,2}v\d{1,2}/i);
  if (fmt) toks.push({ type: 'format', value: fmt[0].toLowerCase() });
  if (/turf/i.test(q)) toks.push({ type: 'surface', value: 'Turf' });
  if (/grass/i.test(q)) toks.push({ type: 'surface', value: 'Grass' });
  if (/highest|elite/i.test(q)) toks.push({ type: 'level', value: 'Highest' });
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
                  'January','February','March','April','May','June','July','August','September','October','November','December'];
  for (const m of months) {
    if (new RegExp(`\\b${m}\\b`, 'i').test(q)) { toks.push({ type: 'month', value: m }); break; }
  }
  return toks;
}

// ───── Slide-out FilterPanel ─────

function FilterPanel({ open, focus, values, onChange, onClose, onReset, resultCount }) {
  if (!open) return null;
  const T = window.TAXONOMIES;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      pointerEvents: 'auto',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,23,42,.4)',
        animation: 'tgFadeIn .18s ease-out',
      }}/>
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: '#fff',
        boxShadow: '-20px 0 60px rgba(15,23,42,.2)',
        display: 'flex', flexDirection: 'column',
        animation: 'tgSlideIn .22s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Filters</div>
            <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
              Narrow down to the right tournament
            </div>
          </div>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 0, width: 32, height: 32, borderRadius: 10,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 22px' }}>
          <FilterGroup label="Dates" hilite={focus === 'dates'}>
            <div style={{ display: 'flex', gap: 8 }}>
              <DateField label="From" value={values.dateStart} onChange={v => onChange({ dateStart: v })} />
              <DateField label="To" value={values.dateEnd} onChange={v => onChange({ dateEnd: v })} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {['This weekend', 'Next 30 days', 'Summer 2026', 'Holiday'].map(p => (
                <PresetChip key={p} label={p} onClick={() => applyDatePreset(p, onChange)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Age group" hilite={focus === 'age'}>
            <ChipGrid options={T.ages} selected={values.ages}
              onToggle={(v) => toggle(values, 'ages', v, onChange)} cols={8} />
          </FilterGroup>

          <FilterGroup label="Gender" hilite={focus === 'gender'}>
            <SegmentedMulti options={T.genders} selected={values.genders}
              onToggle={(v) => toggle(values, 'genders', v, onChange)} />
          </FilterGroup>

          <FilterGroup label="Level of competition" hilite={focus === 'level'} subtitle="Highest = ECNL / MLS Next caliber">
            <div style={{ display: 'grid', gap: 8 }}>
              {T.levels.map(l => (
                <LevelRow key={l} label={l}
                  desc={LEVEL_DESC[l]}
                  selected={values.levels.includes(l)}
                  onClick={() => toggle(values, 'levels', l, onChange)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Format" hilite={focus === 'format'}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {T.formats.map(f => (
                <FormatTile key={f} value={f}
                  selected={values.formats.includes(f)}
                  onClick={() => toggle(values, 'formats', f, onChange)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Region" hilite={focus === 'region'}>
            <ChipGrid options={T.regions} selected={values.regions}
              onToggle={(v) => toggle(values, 'regions', v, onChange)} cols={3} />
          </FilterGroup>

          <FilterGroup label="Field surface">
            <SegmentedMulti options={['Grass','Turf']} selected={values.surfaces || []}
              onToggle={(v) => toggle(values, 'surfaces', v, onChange)} />
          </FilterGroup>

          <FilterGroup label="Open registration only">
            <SwitchRow value={!!values.openOnly}
              onChange={v => onChange({ openOnly: v })}
              label="Hide closed tournaments" />
          </FilterGroup>
        </div>

        <div style={{
          borderTop: '1px solid #e2e8f0', padding: '14px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <button onClick={onReset} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600, color: '#0f172a', textDecoration: 'underline',
            fontFamily: 'inherit',
          }}>Reset</button>
          <button onClick={onClose} style={{
            flex: 1, maxWidth: 240,
            background: '#0f172a', color: '#fff',
            border: 0, borderRadius: 12,
            padding: '13px 18px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Show {resultCount} tournament{resultCount === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
}

const LEVEL_DESC = {
  Highest: 'ECNL, MLS Next, national champions',
  Upper: 'State cup contenders, top regional clubs',
  Middle: 'Competitive club & travel teams',
  Lower: 'Recreational, U-Little, first-timer friendly',
};

function toggle(values, key, v, onChange) {
  const arr = values[key] || [];
  onChange({ [key]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] });
}

function applyDatePreset(p, onChange) {
  const now = new Date('2026-05-18');
  const fmt = d => d.toISOString().slice(0, 10);
  if (p === 'This weekend') {
    const day = now.getDay();
    const sat = new Date(now); sat.setDate(now.getDate() + ((6 - day + 7) % 7));
    const sun = new Date(sat); sun.setDate(sat.getDate() + 1);
    onChange({ dateStart: fmt(sat), dateEnd: fmt(sun) });
  } else if (p === 'Next 30 days') {
    const e = new Date(now); e.setDate(now.getDate() + 30);
    onChange({ dateStart: fmt(now), dateEnd: fmt(e) });
  } else if (p === 'Summer 2026') {
    onChange({ dateStart: '2026-06-01', dateEnd: '2026-08-31' });
  } else if (p === 'Holiday') {
    onChange({ dateStart: '2026-12-20', dateEnd: '2027-01-05' });
  }
}

function FilterGroup({ label, subtitle, children, hilite }) {
  return (
    <div style={{
      padding: '18px 0',
      borderBottom: '1px solid #f1f5f9',
      position: 'relative',
    }}>
      {hilite && <span style={{
        position: 'absolute', left: -10, top: 22, bottom: 22, width: 3,
        background: '#0f172a', borderRadius: 2,
      }}/>}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{label}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label style={{
      flex: 1, position: 'relative',
      border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '8px 12px',
    }}>
      <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase',
        letterSpacing: '.06em', fontWeight: 600 }}>{label}</div>
      <input type="date" value={value || ''} onChange={e => onChange(e.target.value)}
        style={{ border: 0, outline: 'none', background: 'transparent',
          fontSize: 14, color: '#0f172a', width: '100%', padding: '2px 0',
          fontFamily: 'inherit',
        }} />
    </label>
  );
}

function PresetChip({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#f8fafc', border: '1px solid #e2e8f0',
      padding: '5px 11px', borderRadius: 999,
      fontSize: 12, color: '#334155', cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: 500,
    }}>{label}</button>
  );
}

function ChipGrid({ options, selected, onToggle, cols = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)} style={{
            padding: '8px 4px',
            background: on ? '#0f172a' : '#fff',
            color: on ? '#fff' : '#0f172a',
            border: `1px solid ${on ? '#0f172a' : '#e2e8f0'}`,
            borderRadius: 8, cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
            transition: 'all .12s',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function SegmentedMulti({ options, selected, onToggle }) {
  return (
    <div style={{
      display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 10, gap: 2,
    }}>
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)} style={{
            flex: 1,
            padding: '8px 12px',
            background: on ? '#fff' : 'transparent',
            color: on ? '#0f172a' : '#475569',
            border: 0,
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: on ? '0 1px 3px rgba(15,23,42,.1)' : 'none',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function LevelRow({ label, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px',
      background: selected ? '#0f172a' : '#fff',
      color: selected ? '#fff' : '#0f172a',
      border: `1px solid ${selected ? '#0f172a' : '#e2e8f0'}`,
      borderRadius: 10, cursor: 'pointer',
      textAlign: 'left', fontFamily: 'inherit',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 5,
        border: `1.5px solid ${selected ? '#fff' : '#cbd5e1'}`,
        background: selected ? '#fff' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  );
}

function FormatTile({ value, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 4px',
      background: selected ? '#0f172a' : '#fff',
      color: selected ? '#fff' : '#0f172a',
      border: `1px solid ${selected ? '#0f172a' : '#e2e8f0'}`,
      borderRadius: 10, cursor: 'pointer',
      fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, opacity: 0.65 }}>
        {value === '3v3' ? 'Small-sided' : value === '11v11' ? 'Full field' : 'Mid format'}
      </div>
    </button>
  );
}

function SwitchRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13.5, color: '#334155' }}>{label}</div>
      <button onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 999,
        background: value ? '#0f172a' : '#cbd5e1',
        border: 0, position: 'relative', cursor: 'pointer',
        transition: 'background .15s',
      }}>
        <span style={{
          position: 'absolute', top: 2,
          left: value ? 20 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff',
          transition: 'left .15s',
        }}/>
      </button>
    </div>
  );
}

// Icons
function IconCal() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round"/></svg>; }
function IconAge() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>; }
function IconGender() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="14" r="4"/><circle cx="17" cy="8" r="3"/></svg>; }
function IconStar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.78l-5.2 2.72.99-5.78L3.58 9.62l5.82-.85L12 3.5z"/></svg>; }
function IconBall() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v6M12 21v-6M3 12h6M21 12h-6" strokeLinecap="round"/></svg>; }
function IconPin() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>; }

function dateSummary(s, e) {
  if (!s && !e) return null;
  if (s && e) return fmtDateRange(s, e);
  if (s) return `from ${fmtShort(s)}`;
  return `until ${fmtShort(e)}`;
}
function fmtShort(d) {
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dt = new Date(d);
  return `${m[dt.getMonth()]} ${dt.getDate()}`;
}
function listSummary(arr) {
  if (!arr || !arr.length) return null;
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr.join(', ');
  return `${arr[0]} +${arr.length - 1}`;
}

Object.assign(window, { FilterBar, FilterPanel });
