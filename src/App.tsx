import ClientList from "./components/ClientList/ClientList";
import SideBar from "./components/SideBar/SideBar";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import "./index.css";

function App() {
  return (
    <AppointmentProvider>
      <div className="app-container">
        <SideBar />
        <ClientList />
      </div>
    </AppointmentProvider>
  );
}

export default App;
