import { format, parse } from "date-fns";
import { useAppointment } from "../../contexts/useAppointment";
import { useState, useMemo } from "react";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { SunIcon } from "../../assets/icons/SunIcon";
import { SunsetIcon } from "../../assets/icons/SunsetIcon";
import { MoonIcon } from "../../assets/icons/MoonIcon";
import "./styles.css";
import { DatePicker } from "../DatePicker/DatePicker";
import { SearchInput } from "../SearchInput/SearchInput";
import type { Item } from "../../contexts/appointmentContextTypes";

type Period = "morning" | "afternoon" | "evening";

interface PeriodGroup {
  period: Period;
  label: string;
  timeRange: string;
  icon: React.ReactNode;
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAppointments = useMemo(() => {
    const today = format(new Date(), "dd/MM/yyyy");

    if (searchQuery.trim()) {
      const normalizeString = (str: string) =>
        str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const query = normalizeString(searchQuery).trim();
      return items.filter((item) => {
        const itemDate = parse(item.date, "dd/MM/yyyy", new Date());
        const itemDateFormatted = format(itemDate, "dd/MM/yyyy");
        return (
          normalizeString(item.clientName).includes(query) &&
          itemDateFormatted >= today
        );
      });
    }

    if (!selectedDate) return [];
    const formattedSelectedDate = format(selectedDate, "dd/MM/yyyy");
    return items.filter((item) => item.date === formattedSelectedDate);
  }, [items, searchQuery, selectedDate]);

  const appointmentsByPeriod = useMemo(() => {
    const periods: PeriodGroup[] = [
      {
        period: "morning",
        label: "Manhã",
        timeRange: "09h-12h",
        icon: <SunIcon className="period-icon" />,
        appointments: [],
      },
      {
        period: "afternoon",
        label: "Tarde",
        timeRange: "13h-18h",
        icon: <SunsetIcon className="period-icon" />,
        appointments: [],
      },
      {
        period: "evening",
        label: "Noite",
        timeRange: "19h-21h",
        icon: <MoonIcon className="period-icon" />,
        appointments: [],
      },
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

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {selectedDate && (
          <div className="appointments-section">
            <h2 className="appointments-title">
              {searchQuery
                ? `Resultados da busca: "${searchQuery}"`
                : `Agendamentos para ${format(selectedDate, "dd/MM/yyyy")}`}
            </h2>

            {filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">
                  {searchQuery
                    ? `Nenhum cliente encontrado para "${searchQuery}"`
                    : "Nenhum agendamento para esta data"}
                </p>
              </div>
            ) : (
              <div className="periods-container">
                {appointmentsByPeriod.map((periodGroup) => (
                  <div key={periodGroup.period} className="period-section">
                    <div className="period-header">
                      <div className="period-title-wrapper">
                        {periodGroup.icon}
                        <h3 className="period-title">{periodGroup.label}</h3>
                      </div>
                      <span className="period-time-range">
                        {periodGroup.timeRange}
                      </span>
                    </div>
                    <div className="appointments-list">
                      {periodGroup.appointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                          <div className="appointment-info">
                            <div className="appointment-time">
                              {appointment.time}
                            </div>
                            <div className="appointment-client-info">
                              <h3 className="appointment-name">
                                {appointment.clientName}
                              </h3>
                              {searchQuery && (
                                <span className="appointment-date">
                                  {appointment.date}
                                </span>
                              )}
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
