import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { EventsProvider } from "./context/EventsContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <EventsProvider>
              <AppLayout />
            </EventsProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
