import { createContext } from "react";

export interface Item {
  id: string;
  date: string;
  time: string;
  clientName: string;
}

export interface Ctx {
  items: Item[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  add: (i: Item) => void;
  remove: (id: string) => void;
}

export const AppointmentContext = createContext<Ctx | null>(null);
