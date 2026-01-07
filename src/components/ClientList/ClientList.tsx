import { format } from "date-fns";
import { useAppointment } from "../../contexts/useAppointment";
import { useState, useMemo } from "react";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import "./styles.css";
import { DatePicker } from "../DatePicker/DatePicker";
import type { Item } from "../../contexts/appointmentContextTypes";

type Period = "morning" | "afternoon" | "evening";

interface PeriodGroup {
  period: Period;
  label: string;
  appointments: Item[];
}

function getTimePeriod(time: string): Period {
  const [hours] = time.split(":").map(Number);

  if (hours >= 6 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "afternoon";
  return "evening";
}

function ClientList() {
  const { items, remove } = useAppointment();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const formattedSelectedDate = selectedDate
    ? format(selectedDate, "dd/MM/yyyy")
    : "";

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return items.filter((item) => item.date === formattedSelectedDate);
  }, [items, formattedSelectedDate, selectedDate]);

  const appointmentsByPeriod = useMemo(() => {
    const periods: PeriodGroup[] = [
      { period: "morning", label: "Manhã", appointments: [] },
      { period: "afternoon", label: "Tarde", appointments: [] },
      { period: "evening", label: "Noite", appointments: [] },
    ];

    filteredAppointments.forEach((appointment) => {
      const period = getTimePeriod(appointment.time);
      const periodGroup = periods.find((p) => p.period === period);
      if (periodGroup) {
        periodGroup.appointments.push(appointment);
      }
    });

    return periods.filter((p) => p.appointments.length > 0);
  }, [filteredAppointments]);

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este agendamento?")) {
      remove(id);
    }
  };

  return (
    <div className="clientlist-container">
      <div className="clientlist-subcontainer">
        <h1 className="clientlist-title">Sua agenda</h1>
        <p className="clientlist-subtitle">
          Consulte os seus agendamentos por dia
        </p>

        <div className="day-picker-container">
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {selectedDate && (
          <div className="appointments-section">
            <h2 className="appointments-title">
              Agendamentos para {formattedSelectedDate}
            </h2>

            {filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">
                  Nenhum agendamento para esta data
                </p>
              </div>
            ) : (
              <div className="periods-container">
                {appointmentsByPeriod.map((periodGroup) => (
                  <div key={periodGroup.period} className="period-section">
                    <h3 className="period-title">{periodGroup.label}</h3>
                    <div className="appointments-list">
                      {periodGroup.appointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                          <div className="appointment-info">
                            <div className="appointment-time">
                              {appointment.time}
                            </div>
                            <div className="appointment-details">
                              <h3 className="appointment-name">
                                {appointment.clientName}
                              </h3>
                              <p className="appointment-date">{appointment.date}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="delete-button"
                            title="Excluir agendamento"
                          >
                            <TrashIcon className="delete-icon" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientList;
