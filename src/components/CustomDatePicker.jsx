import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function CustomDatePicker({ id, value, onChange, ariaLabel = "Choose date" }) {
  const wrapperRef = useRef(null);
  const initial = parseDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  useEffect(() => {
    function closeOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }
    function closeEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const previousCount = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < 42; i += 1) {
      const dayNumber = i - firstDay + 1;
      if (dayNumber < 1) {
        cells.push({ date: new Date(year, month - 1, previousCount + dayNumber), outside: true });
      } else if (dayNumber > count) {
        cells.push({ date: new Date(year, month + 1, dayNumber - count), outside: true });
      } else {
        cells.push({ date: new Date(year, month, dayNumber), outside: false });
      }
    }
    return cells;
  }, [visibleMonth]);

  const selectedDate = value ? parseDate(value) : null;
  const displayValue = selectedDate
    ? `${String(selectedDate.getDate()).padStart(2, "0")} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : "Select a date";

  function moveMonth(amount) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }
  function chooseDate(date) {
    onChange(toISO(date));
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpen(false);
  }

  return (
    <div className="custom-date-picker" ref={wrapperRef}>
      <button
        id={id}
        type="button"
        className="custom-date-trigger"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          const current = parseDate(value);
          setVisibleMonth(new Date(current.getFullYear(), current.getMonth(), 1));
          setOpen((state) => !state);
        }}
      >
        <CalendarDays size={15} aria-hidden="true" />
        <span>{displayValue}</span>
        <ChevronRight className="date-trigger-chevron" size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="custom-date-popover" role="dialog" aria-label="Calendar date picker">
          <div className="custom-date-heading">
            <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
              <ChevronLeft size={17} />
            </button>
            <strong>{MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</strong>
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="custom-date-grid">
            {WEEKDAYS.map((day) => <span className="custom-date-weekday" key={day}>{day}</span>)}
            {days.map(({ date, outside }, index) => {
              const key = toISO(date);
              const isSelected = value === key;
              const isToday = toISO(new Date()) === key;
              return (
                <button
                  type="button"
                  key={`${key}-${index}`}
                  className={`custom-date-day ${outside ? "outside" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => chooseDate(date)}
                  aria-pressed={isSelected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="custom-date-footer">
            <button type="button" onClick={() => chooseDate(new Date())}>Today</button>
            <button type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
