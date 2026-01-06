import SideBar from "./components/SideBar/SideBar";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import "./index.css";

function App() {
  return (
    <AppointmentProvider>
      <SideBar />
    </AppointmentProvider>
  );
}

export default App;
