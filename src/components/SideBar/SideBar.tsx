import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "../../assets/icons/CalendarIcon";
import { ChevronIcon } from "../../assets/icons/ChevronIcon";
import { ClientIcon } from "../../assets/icons/ClientIcon";
import "./styles.css";
import { ptBR } from "react-day-picker/locale/pt-BR";
import { useEffect, useRef, useState } from "react";
import { format, startOfDay } from "date-fns";
import { useAppointment } from "../../contexts/useAppointment";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [clientName, setClientName] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const { add, setSelectedDate, selectedDate, items } = useAppointment();

  const timeSlots = {
    manha: ["09:00", "10:00", "11:00", "12:00"],
    tarde: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    noite: ["19:00", "20:00", "21:00"],
  };

  const today = new Date();
  const todayStart = startOfDay(today);

  const formattedSelectedDate = selectedDate
    ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
    : "";

  const isTimeBooked = (time: string) =>
    items.some(
      (item) => item.date === formattedSelectedDate && item.time === time
    );

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
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

  const renderTimeButtons = (times: string[]) => {
    return times.map((hora) => {
      const booked = !!selectedDate && isTimeBooked(hora);
      return (
        <button
          key={hora}
          type="button"
          onClick={() => !booked && setSelectedTime(hora)}
          disabled={booked}
          className={`time-button ${selectedTime === hora ? "selected" : ""}`}
        >
          {hora}
        </button>
      );
    });
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedDate || !selectedTime || clientName.trim() === "") {
      alert(
        "Por favor, selecione uma data, horário e informe o nome do cliente."
      );
      return;
    }

    if (isTimeBooked(selectedTime)) {
      alert("Este horário já está agendado para esta data.");
      return;
    }

    add({
      id: String(Date.now()),
      date: formattedSelectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
    });

    setSelectedTime("");
    setClientName("");
  }

  return (
    <div className="container">
      <div className="subcontainer">
        <h1 className="title">Agende um atendimento</h1>
        <p className="subtitle">
          Selecione data, horário e informe o nome do cliente para criar o
          agendamento
        </p>

        <form onSubmit={handleSubmit}>
          <div className="day-picker-container" ref={containerRef}>
            <label className="day-picker-label">Data</label>

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

          <div className="time-selector-container">
            <h3 className="time-selector-title">Horários</h3>

            <div className="period-section">
              <p className="period-label">Manhã</p>
              <div className="time-buttons">
                {renderTimeButtons(timeSlots.manha)}
              </div>
            </div>

            <div className="period-section">
              <p className="period-label">Tarde</p>
              <div className="time-buttons">
                {renderTimeButtons(timeSlots.tarde)}
              </div>
            </div>

            <div className="period-section">
              <p className="period-label">Noite</p>
              <div className="time-buttons">
                {renderTimeButtons(timeSlots.noite)}
              </div>
            </div>
          </div>

          <div className="client-name-container">
            <label className="client-name-label">Cliente</label>
            <div className="client-name-input-wrapper">
              <ClientIcon className="client-icon" />
              <input
                type="text"
                className="client-name-input"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Digite o nome do cliente"
              />
            </div>
            <button type="submit" className="client-name-button">
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SideBar;
