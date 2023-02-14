import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./views/Login";
import ClientDashboard from "./views/ClientDashboard";
import AdminDashboard from "./views/AdminDashboard";
import AgentDashboard from "./views/AgentDashboard";
import { useEffect } from "react";
import { useStateContext } from "./context/stateContext";
import { saveToken } from "./axios";
import ResponsiveAppBar from "./components/AppBar";
import AdminContextProvider from "./context/adminContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const {
    loginState: { role },
  } = useStateContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!role) {
      navigate("/");
    } else if (location.pathname.toLowerCase().includes(role)) {
      navigate(`/${role}`);
    }
  }, [location.pathname]);
  return children;
};

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support-agent"
          element={
            <ProtectedRoute>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AdminContextProvider>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AdminContextProvider>
    </div>
  );
}

export default App;
