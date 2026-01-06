import { useState, type ReactNode, useEffect } from "react";
import { AppointmentContext, type Item } from "./appointmentContextTypes";

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(() => {
    const stored = localStorage.getItem("@appointments");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    localStorage.setItem("@appointments", JSON.stringify(items));
  }, [items]);

  function add(i: Item) {
    setItems((prev) => [...prev, i]);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <AppointmentContext.Provider
      value={{
        items,
        selectedDate,
        setSelectedDate,
        add,
        remove,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}
