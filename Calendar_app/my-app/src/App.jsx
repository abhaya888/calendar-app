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
  "8-15": "Independence Day",
  "10-2": "Gandhi Jayanti",
  "10-20": "Dussehra",
  "11-09": "Diwali",
  "11-05": "Guru Nanak Jayanti",
  "12-25": "Christmas Day",
};

const MONTH_IMAGES = [
  "https://images.pexels.com/photos/1933316/pexels-photo-1933316.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/5741305/pexels-photo-5741305.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80", 
  "https://images.pexels.com/photos/360912/pexels-photo-360912.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/2873669/pexels-photo-2873669.jpeg?auto=compress&cs=tinysrgb&w=800", 
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
  // Force exactly 42 cells (6 rows of 7) to keep grid completely stable
  while (cells.length < 42) {
    cells.push({ day: fill++, month: nextMonth, year: nextYear, other: true });
  }
  return cells;
}

function SpiralBar() {
  return (
    <div style={{ background: "#1f2937", flex: "0 0 32px", display: "flex", alignItems: "center", justifyContent: "space-evenly", padding: "0 20px", borderBottom: "2px solid #0b0f19", zIndex: 10 }}>
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

function HeroPanel({ month, year, isMobile }) {
  const imgSrc = MONTH_IMAGES[(month - 1) % 12];
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => { setImgFailed(false); }, [month]);

  return (
    // FIX: Using relative flex scaling instead of fixed pixels (25% of height on desktop, fixed on mobile)
    <div style={{ position: "relative", overflow: "hidden", background: "#0b0f19", flex: isMobile ? "none" : "0 0 25%", height: isMobile ? "200px" : "auto", width: "100%", zIndex: 1 }}>
      {!imgFailed ? (
        <img src={imgSrc} alt={`${MONTH_NAMES[month - 1]} ${year}`} onError={() => setImgFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }} />
      )}
      
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to top, #111827, transparent)" }} />
      
      <div style={{ position: "absolute", bottom: "clamp(10px, 2vh, 20px)", right: 24, textAlign: "right", textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}>
        <div style={{ fontSize: "clamp(12px, 1.5vh, 16px)", fontWeight: 400, letterSpacing: 6, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>{year}</div>
        <div style={{ fontSize: "clamp(24px, 4vh, 36px)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1, color: "#f3f4f6", fontFamily: "'Playfair Display', Georgia, serif" }}>
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
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: bg, color, borderRadius, 
        fontWeight: isSelected ? 700 : isToday ? 600 : 400,
        position: "relative", userSelect: "none", transition: "all 0.1s ease", cursor: "pointer",
        height: "100%", width: "100%", minHeight: 0, // Flex/Grid scaling magic
        border: isToday && !isSelected && !isInRange ? "1px solid #3b82f6" : "1px solid transparent"
      }}
      onMouseEnter={(e) => { if (!isSelected && !isInRange) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!isSelected && !isInRange) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ fontSize: "clamp(11px, 1.5vh, 14px)", zIndex: 2 }}>{cell.day}</span>
      
      <div style={{ position: "absolute", bottom: "clamp(2px, 0.5vh, 6px)", display: "flex", gap: "3px", zIndex: 2 }}>
        {holidayName && !isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f472b6" }} />}
        {hasNote && !isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#60a5fa" }} />}
      </div>
    </div>
  );
}

function NotesSection({ text, onChange, rangeLabel, contextNotes }) {
  return (
    // FIX: Using flex: 1 and minHeight: 0 to force containment within parent
    <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, minHeight: 0, background: "#1f2937", borderLeft: "1px solid #374151" }}>
      <div style={{ padding: "clamp(12px, 2vh, 20px) 24px 0", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, flex: "0 0 auto", marginBottom: "clamp(8px, 1.5vh, 16px)" }}>
          {rangeLabel}
        </div>
        <textarea
          value={text}
          onChange={onChange}
          placeholder="Jot down notes here..."
          style={{
            width: "100%", flex: 1, minHeight: 0, border: "none", resize: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 1.8vh, 15px)", color: "#e5e7eb", outline: "none", lineHeight: "2.4em",
            backgroundImage: "repeating-linear-gradient(transparent, transparent calc(2.4em - 1px), #374151 calc(2.4em - 1px), #374151 2.4em)",
            backgroundAttachment: "local", backgroundColor: "transparent"
          }}
        />
      </div>

      {contextNotes && contextNotes.length > 0 && (
        <div style={{ flex: "0 0 auto", padding: "0 24px clamp(12px, 2vh, 20px)", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", maxHeight: "35%", overflowY: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#6b7280", fontWeight: 600, margin: "10px 0 6px" }}>
            Overlapping Notes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {contextNotes.map((cn, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "#60a5fa", marginBottom: "2px", fontWeight: 600 }}>{cn.label}</div>
                <div style={{ fontSize: 12, color: "#d1d5db", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>{cn.text}</div>
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
    } catch (e) { console.error(e); }
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
          const rStart = parseInt(parts[1]);
          const rEnd = parseInt(parts[2]);
          if (lo >= rStart && lo <= rEnd) {
            const s = parseDateNum(rStart);
            const e = parseDateNum(rEnd);
            contextNotes.push({ label: `Range note (${formatDate(s.y, s.m, s.d)} — ${formatDate(e.y, e.m, e.d)})`, text });
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
            const { y, m, d } = parseDateNum(dNum);
            contextNotes.push({ label: `Note for ${formatDate(y, m, d)}`, text });
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
    if (cell.other) {
      setViewMonth(cell.month); setViewYear(cell.year); setAnimKey(prev => prev + 1);
      return;
    }

    const num = toDateNum(cell.year, cell.month, cell.day);

    if (!startDate || (startDate && endDate && sNum !== eNum)) {
      setStartDate({ y: cell.year, m: cell.month, d: cell.day });
      setEndDate({ y: cell.year, m: cell.month, d: cell.day }); 
    } else if (startDate && endDate && sNum === eNum) {
      if (num === sNum) { setStartDate(null); setEndDate(null); } 
      else {
        if (num < sNum) { setEndDate(startDate); setStartDate({ y: cell.year, m: cell.month, d: cell.day }); } 
        else { setEndDate({ y: cell.year, m: cell.month, d: cell.day }); }
      }
    }
  }

  function changeMonth(dir) {
    if (dir === -1) { if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); } 
    else { if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }
    setAnimKey(prev => prev + 1);
  }

  let rangeInfo = "Select a date, or tap another to highlight a range.";
  if (startDate && endDate && sNum === eNum) { rangeInfo = `${formatDate(startDate.y, startDate.m, startDate.d)} selected.`; } 
  else if (startDate && endDate) { rangeInfo = `${formatDate(startDate.y, startDate.m, startDate.d)} → ${formatDate(endDate.y, endDate.m, endDate.d)}`; }

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    // FIX: Core App Wrapper - height: 100vh restricts it to exactly the window bounds
    <div style={{ background: "#030712", height: "100vh", padding: isMobile ? "1rem" : "2.5vh 2.5vw", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center", overflow: isMobile ? "auto" : "hidden" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap');
        @keyframes subtleFadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* FIX: Main Card Container - strictly flex column, height 100% of padded area */}
      <div style={{ 
        fontFamily: "'DM Sans', sans-serif", background: "#111827", borderRadius: 12, overflow: "hidden", 
        width: "100%", maxWidth: 1000, height: isMobile ? "auto" : "100%", maxHeight: "900px", border: "1px solid #1f2937", 
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.05)",
        display: "flex", flexDirection: "column", minHeight: 0
      }}>
        <SpiralBar />
        <HeroPanel month={viewMonth} year={viewYear} isMobile={isMobile} />

        {/* FIX: Content Split - flex: 1 combined with minHeight: 0 guarantees it stays inside parents */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", flex: 1, minHeight: 0 }}>
          
          <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, borderBottom: isMobile ? "1px solid #1f2937" : "none" }}>
            
            <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(12px, 2vh, 20px) 24px clamp(6px, 1vh, 10px)" }}>
              <button onClick={() => changeMonth(-1)} style={{ background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
                <LeftArrow />
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                 <span style={{ fontSize: "clamp(14px, 2vh, 16px)", fontWeight: 600, color: "#f3f4f6" }}>{MONTH_NAMES[viewMonth - 1]}</span>
                 <span style={{ fontSize: "clamp(12px, 1.8vh, 14px)", color: "#6b7280" }}>{viewYear}</span>
              </div>
              <button onClick={() => changeMonth(1)} style={{ background: "transparent", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
                <RightArrow />
              </button>
            </div>
            
            <div style={{ flex: "0 0 auto", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 20px clamp(4px, 1vh, 8px)" }}>
              {DAY_HEADERS.map((h, i) => (<div key={h} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: i >= 5 ? "#60a5fa" : "#6b7280" }}>{h}</div>))}
            </div>
            
            {/* FIX: Calendar Grid uses gridTemplateRows to force days to scale up/down with viewport height */}
            <div key={animKey} style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(6, 1fr)", padding: "0 20px clamp(8px, 1.5vh, 16px)", gap: "2px", animation: "subtleFadeIn 0.3s ease-out" }}>
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
            
            <div style={{ flex: "0 0 auto", padding: "clamp(8px, 1.5vh, 12px) 24px", fontSize: 11, color: "#6b7280", borderTop: "1px solid #1f2937", background: "#111827", display: "flex", justifyContent: "space-between" }}>
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
