import { useState, useEffect } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const HOLIDAYS = {
  "1-1": "New Year's Day",
  "1-14": "Makar Sankranti",
  "1-26": "Republic Day",
  "3-25": "Holi",
  "4-14": "Dr. Ambedkar Jayanti",
  "4-18": "Good Friday",
  "5-12": "Buddha Purnima",
  "8-15": "Independence Day",
  "8-27": "Janmashtami",
  "10-2": "Gandhi Jayanti",
  "10-1": "Dussehra",
  "10-20": "Diwali",
  "11-5": "Guru Nanak Jayanti",
  "12-25": "Christmas Day",
};

const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-77cf5e08ce27?w=800&q=80", 
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", 
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80", 
  "https://images.unsplash.com/photo-1504333638930-c8787321fa0f?w=800&q=80", 
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80", 
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80", 
  "https://images.unsplash.com/photo-1579033461387-aad470f14652?w=800&q=80", 
  "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&q=80", 
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80", 
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80", 
  "https://images.unsplash.com/photo-1514317135010-82a932d433f6?w=800&q=80", 
  "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?w=800&q=80", 
];

const LeftArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const RightArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function toDateNum(y, m, d) { return y * 10000 + m * 100 + d; }
function formatDate(y, m, d) { return `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}, ${y}`; }
function getDayOfWeek(y, m, d) { return new Date(y, m - 1, d).getDay(); }

// Parses an 8-digit date number back into { y, m, d } for readable labels
function parseDateNum(num) {
  const y = Math.floor(num / 10000);
  const m = Math.floor((num % 10000) / 100);
  const d = num % 100;
  return { y, m, d };
}

function buildCalendarCells(year, month) {
  const firstDow = getDayOfWeek(year, month, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const cells = [];

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, other: false });
  }
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let fill = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: fill++, month: nextMonth, year: nextYear, other: true });
  }
  return cells;
}

function SpiralBar() {
  return (
    <div style={{ background: "#1f2937", height: 32, display: "flex", alignItems: "center", justifyContent: "space-evenly", padding: "0 20px", borderBottom: "2px solid #0b0f19" }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{ 
          width: 8, height: 20, borderRadius: 4, 
          background: "linear-gradient(90deg, #6b7280 0%, #d1d5db 50%, #4b5563 100%)", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.8)" 
        }} />
      ))}
    </div>
  );
}

function HeroPanel({ month, year }) {
  const imgSrc = MONTH_IMAGES[(month - 1) % 12];
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#0b0f19", height: "280px", width: "100%" }}>
      <img src={imgSrc} alt={`${MONTH_NAMES[month - 1]} ${year}`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to top, #111827, transparent)" }} />
      
      <div style={{ position: "absolute", bottom: 20, right: 24, textAlign: "right", textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}>
        <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: 6, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>{year}</div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1, color: "#f3f4f6", fontFamily: "'Playfair Display', Georgia, serif" }}>
          {MONTH_NAMES[month - 1]}
        </div>
      </div>
    </div>
  );
}

function DayCell({ cell, isStart, isEnd, isInRange, isToday, holidayName, hasNote, onClick }) {
  const isSelected = isStart || isEnd;
  const isSingleDaySelect = isStart && isEnd;

  let bg = "transparent";
  let color = cell.other ? "#4b5563" : "#e5e7eb";
  let borderRadius = "8px"; 

  if (isSingleDaySelect) { bg = "#3b82f6"; color = "#fff"; borderRadius = "50%"; }
  else if (isStart) { bg = "#3b82f6"; color = "#fff"; borderRadius = "50% 0 0 50%"; }
  else if (isEnd) { bg = "#3b82f6"; color = "#fff"; borderRadius = "0 50% 50% 0"; }
  else if (isInRange) { bg = "rgba(59, 130, 246, 0.2)"; borderRadius = "0"; color = "#60a5fa"; }

  return (
    <div
      onClick={onClick}
      title={holidayName || ""}
      style={{
        textAlign: "center", padding: "8px 0", fontSize: 13, cursor: "pointer",
        background: bg, color, borderRadius, 
        fontWeight: isSelected ? 700 : isToday ? 600 : 400,
        position: "relative", userSelect: "none", transition: "all 0.15s ease", minHeight: 36,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        border: isToday && !isSelected && !isInRange ? "1px solid #3b82f6" : "1px solid transparent"
      }}
      onMouseEnter={(e) => { if (!isSelected && !isInRange) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!isSelected && !isInRange) e.currentTarget.style.background = "transparent"; }}
    >
      {cell.day}
      
      <div style={{ position: "absolute", bottom: 4, display: "flex", gap: "3px" }}>
        {holidayName && !isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f472b6" }} />}
        {hasNote && !isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#60a5fa" }} />}
      </div>
    </div>
  );
}

function NotesSection({ text, onChange, rangeLabel, contextNotes }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1f2937", borderLeft: "1px solid #374151", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, marginBottom: 16 }}>
          {rangeLabel}
        </div>
        <textarea
          value={text}
          onChange={onChange}
          placeholder="Jot down notes here..."
          style={{
            width: "100%", minHeight: "140px", border: "none", resize: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#e5e7eb", outline: "none", lineHeight: "2.4em",
            backgroundImage: "repeating-linear-gradient(transparent, transparent calc(2.4em - 1px), #374151 calc(2.4em - 1px), #374151 2.4em)",
            backgroundAttachment: "local", backgroundColor: "transparent"
          }}
        />
      </div>

      {contextNotes && contextNotes.length > 0 && (
        <div style={{ padding: "0 24px 20px", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#6b7280", fontWeight: 600, margin: "12px 0 8px" }}>
            Overlapping Notes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {contextNotes.map((cn, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#60a5fa", marginBottom: "4px", fontWeight: 600 }}>{cn.label}</div>
                <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>{cn.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WallCalendar() {
  const today = new Date();
  const todayNum = toDateNum(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [animKey, setAnimKey] = useState(0); 

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [allNotes, setAllNotes] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wall-cal-db");
      if (stored) setAllNotes(JSON.parse(stored));
    } catch (e) { console.error("Could not load notes", e); }
  }, []);

  const cells = buildCalendarCells(viewYear, viewMonth);

  const sNum = startDate ? toDateNum(startDate.y, startDate.m, startDate.d) : null;
  const eNum = endDate ? toDateNum(endDate.y, endDate.m, endDate.d) : null;

  const lo = sNum !== null && eNum !== null ? Math.min(sNum, eNum) : null;
  const hi = sNum !== null && eNum !== null ? Math.max(sNum, eNum) : null;

  let currentKey = `month-${viewYear}-${viewMonth}`;
  let notesLabel = "Monthly Memos";
  let contextNotes = [];

  if (startDate && endDate) {
    if (sNum === eNum) {
      currentKey = `day-${lo}`;
      notesLabel = `Notes for ${formatDate(startDate.y, startDate.m, startDate.d)}`;
      
      Object.entries(allNotes).forEach(([key, text]) => {
        if (key.startsWith("range-") && text.trim() !== "") {
          const parts = key.split("-");
          // FIX: key format is "range-YYYYMMDD-YYYYMMDD", so parts are ["range", rStart, rEnd]
          const rStart = parseInt(parts[1]);
          const rEnd = parseInt(parts[2]);
          if (lo >= rStart && lo <= rEnd) {
            // FIX: use parseDateNum for correct, year-aware labels
            const s = parseDateNum(rStart);
            const e = parseDateNum(rEnd);
            contextNotes.push({ 
              label: `Range note (${formatDate(s.y, s.m, s.d)} — ${formatDate(e.y, e.m, e.d)})`,
              text 
            });
          }
        }
      });
    } else {
      currentKey = `range-${lo}-${hi}`;
      notesLabel = `Range Notes: ${formatDate(startDate.y, startDate.m, startDate.d)} — ${formatDate(endDate.y, endDate.m, endDate.d)}`;
      
      Object.entries(allNotes).forEach(([key, text]) => {
        if (key.startsWith("day-") && text.trim() !== "") {
          const dNum = parseInt(key.split("-")[1]);
          if (dNum >= lo && dNum <= hi) {
            // FIX: use parseDateNum for correct, year-aware labels
            const { y, m, d } = parseDateNum(dNum);
            contextNotes.push({ 
              label: `Note for ${formatDate(y, m, d)}`,
              text 
            });
          }
        }
      });
    }
  }

  const currentText = allNotes[currentKey] || "";

  function handleNoteChange(e) {
    const newNotes = { ...allNotes, [currentKey]: e.target.value };
    setAllNotes(newNotes);
    localStorage.setItem("wall-cal-db", JSON.stringify(newNotes));
  }

  function cellHasNote(num) {
    if (allNotes[`day-${num}`]?.trim()) return true;
    for (const key of Object.keys(allNotes)) {
      if (key.startsWith("range-") && allNotes[key]?.trim()) {
        const parts = key.split("-");
        const rStart = parseInt(parts[1]);
        const rEnd = parseInt(parts[2]);
        if (num >= rStart && num <= rEnd) return true;
      }
    }
    return false;
  }

  function handleDayClick(cell) {
    // FIX: return early after navigating to prevent unintended date selection
    if (cell.other) {
      setViewMonth(cell.month);
      setViewYear(cell.year);
      setAnimKey(prev => prev + 1);
      return;
    }

    const num = toDateNum(cell.year, cell.month, cell.day);

    if (!startDate || (startDate && endDate && sNum !== eNum)) {
      setStartDate({ y: cell.year, m: cell.month, d: cell.day });
      setEndDate({ y: cell.year, m: cell.month, d: cell.day }); 
    } else if (startDate && endDate && sNum === eNum) {
      if (num === sNum) {
        setStartDate(null); setEndDate(null);
      } else {
        if (num < sNum) {
          setEndDate(startDate); setStartDate({ y: cell.year, m: cell.month, d: cell.day });
        } else {
          setEndDate({ y: cell.year, m: cell.month, d: cell.day });
        }
      }
    }
  }

  function changeMonth(dir) {
    if (dir === -1) {
        if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else setViewMonth(m => m - 1);
    } else {
        if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); } else setViewMonth(m => m + 1);
    }
    setAnimKey(prev => prev + 1);
  }

  let rangeInfo = "Select a date, or tap another to highlight a range.";
  if (startDate && endDate && sNum === eNum) {
    rangeInfo = `${formatDate(startDate.y, startDate.m, startDate.d)} selected.`;
  } else if (startDate && endDate) {
    rangeInfo = `${formatDate(startDate.y, startDate.m, startDate.d)} → ${formatDate(endDate.y, endDate.m, endDate.d)}`;
  }

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ background: "#030712", minHeight: "100vh", padding: "2rem 1rem", boxSizing: "border-box", display: "flex", justifyContent: "center" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap');
        @keyframes subtleFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ 
        fontFamily: "'DM Sans', sans-serif", background: "#111827", borderRadius: 12, overflow: "hidden", 
        width: "100%", maxWidth: 950, border: "1px solid #1f2937", 
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.05)",
        display: "flex", flexDirection: "column"
      }}>
        <SpiralBar />
        <HeroPanel month={viewMonth} year={viewYear} />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", flex: 1 }}>
          
          <div style={{ display: "flex", flexDirection: "column", borderBottom: isMobile ? "1px solid #1f2937" : "none" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 10px" }}>
              <button onClick={() => changeMonth(-1)} style={{ background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
                <LeftArrow />
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                 <span style={{ fontSize: 16, fontWeight: 600, color: "#f3f4f6" }}>{MONTH_NAMES[viewMonth - 1]}</span>
                 <span style={{ fontSize: 14, color: "#6b7280" }}>{viewYear}</span>
              </div>
              <button onClick={() => changeMonth(1)} style={{ background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
                <RightArrow />
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 20px 4px" }}>
              {DAY_HEADERS.map((h, i) => (<div key={h} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: i >= 5 ? "#60a5fa" : "#6b7280", padding: "4px 0" }}>{h}</div>))}
            </div>
            
            <div key={animKey} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 20px 20px", gap: "4px 0", animation: "subtleFadeIn 0.3s ease-out" }}>
              {cells.map((cell, i) => {
                const num = toDateNum(cell.year, cell.month, cell.day);
                const isStart = !cell.other && lo !== null && num === lo;
                const isEnd = !cell.other && hi !== null && num === hi;
                const inRange = !cell.other && lo !== null && hi !== null && num > lo && num < hi;
                const isToday = !cell.other && num === todayNum;
                
                const holidayKey = `${cell.month}-${cell.day}`;
                const holidayName = !cell.other ? HOLIDAYS[holidayKey] : null;
                const notePresent = cellHasNote(num);

                return (
                  <DayCell key={i} cell={cell} isStart={isStart} isEnd={isEnd} isInRange={inRange} isToday={isToday} holidayName={holidayName} hasNote={notePresent} onClick={() => handleDayClick(cell)} />
                );
              })}
            </div>
            
            <div style={{ padding: "12px 24px", fontSize: 12, color: "#6b7280", borderTop: "1px solid #1f2937", background: "#111827", display: "flex", justifyContent: "space-between" }}>
              <span>{rangeInfo}</span>
              {startDate && <span style={{cursor: "pointer", color: "#3b82f6", fontWeight: 600}} onClick={() => {setStartDate(null); setEndDate(null);}}>Clear</span>}
            </div>
          </div>

          <NotesSection text={currentText} onChange={handleNoteChange} rangeLabel={notesLabel} contextNotes={contextNotes} />
        </div>
      </div>
    </div>
  );
}