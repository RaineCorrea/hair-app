import { ClientIcon } from "../../assets/icons/ClientIcon";
import "./styles.css";
import { useState } from "react";
import { format } from "date-fns";
import { useAppointment } from "../../contexts/useAppointment";
import { DatePicker } from "../DatePicker/DatePicker";

function SideBar() {
  const [clientName, setClientName] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const { add, setSelectedDate, selectedDate, items } = useAppointment();

  const timeSlots = {
    manha: ["09:00", "10:00", "11:00", "12:00"],
    tarde: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    noite: ["19:00", "20:00", "21:00"],
  };

  const formattedSelectedDate = selectedDate
    ? format(selectedDate, "dd/MM/yyyy")
    : "";

  const isTimeBooked = (time: string) =>
    items.some(
      (item) => item.date === formattedSelectedDate && item.time === time
    );

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
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

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
