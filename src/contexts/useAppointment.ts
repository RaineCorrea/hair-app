import { useContext } from "react";
import { AppointmentContext } from "./appointmentContextTypes";

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === null) {
    throw new Error(
      "useAppointment deve ser usado dentro de um AppointmentProvider"
    );
  }
  return context;
}
