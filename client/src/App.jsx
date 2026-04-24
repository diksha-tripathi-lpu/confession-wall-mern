import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import { Toaster, toast } from "react-hot-toast";
import { MessageSquare, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import "./index.css";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        sessionStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  if (!token) {
    return (
      <div className="auth-wrapper">
        <Toaster position="top-right" toastOptions={{ className: "glass", style: { background: "var(--glass-bg)", color: "#fff", backdropFilter: "blur(12px)", border: "1px solid var(--glass-border)" } }} />
        <Auth setToken={setToken} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "rgba(15, 23, 42, 0.8)", color: "#fff", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" } }} />
      <div className="dashboard-layout">
        
        {/* Mobile Top Nav */}
        <div className="top-mobile-nav">
          <div className="brand">
            <MessageSquare color="#c4b5fd" /> Wall
          </div>
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Overlay */}
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div>
            <div className="brand">
              <MessageSquare color="#c4b5fd" /> Campus Wall
            </div>

            <div className="nav-links">
              <div
                className={`nav-item ${view === "dashboard" ? "active" : ""}`}
                onClick={() => { setView("dashboard"); setIsMobileMenuOpen(false); }}
              >
                <LayoutDashboard size={20} /> Feed
              </div>

              <div
                className={`nav-item ${view === "my" ? "active" : ""}`}
                onClick={() => { setView("my"); setIsMobileMenuOpen(false); }}
              >
                <User size={20} /> My Confessions
              </div>
            </div>
          </div>

          <button className="primary-btn logout-btn" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="main-content">
          <Home token={token} view={view} user={user} />
        </div>
      </div>
    </>
  );
}

export default App;