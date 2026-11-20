import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
  id,
}) {
  const generatedId = useId();
  const listId = `${generatedId}-options`;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, options.findIndex((option) => option.value === value)),
  );

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex] || options[0];

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function choose(index) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + options.length) % options.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else setOpen(true);
    }
  }

  return (
    <div className={`custom-select ${className}`} ref={rootRef}>
      <button
        id={id}
        type="button"
        className="custom-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setActiveIndex(selectedIndex < 0 ? 0 : selectedIndex);
          setOpen((current) => !current);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selected?.label ?? ""}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="custom-select-menu" role="listbox" id={listId} aria-label={ariaLabel}>
          {options.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              disabled={option.disabled}
              className={`custom-select-option ${option.value === value ? "selected" : ""} ${index === activeIndex ? "active" : ""}`}
              key={`${option.value}-${index}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
