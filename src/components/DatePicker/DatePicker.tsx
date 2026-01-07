import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale/pt-BR";
import { format, startOfDay } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "../../assets/icons/CalendarIcon";
import { ChevronIcon } from "../../assets/icons/ChevronIcon";
import "./styles.css";

interface DatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  label?: string;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  label = "Data",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayStart = startOfDay(today);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="day-picker-container" ref={containerRef}>
      <label className="day-picker-label">{label}</label>

      <div
        className="day-picker-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="calendar-icon" />

        <span className="day-picker-date-text">
          {selectedDate
            ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
            : format(today, "dd/MM/yyyy", { locale: ptBR })}
        </span>

        <ChevronIcon
          className={`chevron-icon ${isOpen ? "chevron-open" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="day-picker-popover">
          <DayPicker
            locale={ptBR}
            mode="single"
            selected={selectedDate}
            fromMonth={today}
            onSelect={handleSelect}
            navLayout="around"
            fromDate={todayStart}
            disabled={(date) => date < todayStart}
          />
        </div>
      )}
    </div>
  );
}
