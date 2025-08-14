import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import SettingUser from "./pages/SettingUser";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/user" element={<UserManagement />} />
                    <Route path="/setting" element={<Navigate to="/user" replace />} />
                    <Route path="/setting/:id" element={<SettingUser />} />
                    <Route path="*" element={<Navigate to="/user" />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
