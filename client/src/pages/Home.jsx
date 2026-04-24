import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import ConfessionForm from "../components/ConfessionForm";
import ConfessionCard from "../components/ConfessionCard";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

const CATEGORIES = ["All", "Secret", "Love", "Funny", "Study", "Vent"];

function Home({ token, view, user }) {
  const [confessions, setConfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConfessions = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      let url = new URL(`${config.API_BASE_URL}/confessions`);

      if (view === "my") {
        url = new URL(`${config.API_BASE_URL}/confessions/my`);
      } else {
        if (activeCategory !== "All") url.searchParams.append("category", activeCategory);
        if (searchQuery.trim() !== "") url.searchParams.append("search", searchQuery.trim());
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setConfessions(data);
      } else {
        setConfessions([]);
      }
    } catch (err) {
      toast.error("Failed to load confessions");
    } finally {
      setIsLoading(false);
    }
  }, [token, view, activeCategory, searchQuery]);

  useEffect(() => {
    if (token) {
      fetchConfessions();
    }
  }, [fetchConfessions, token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchConfessions(false);
  };

  const totalReactions = confessions.reduce((total, c) => {
    return (
      total +
      (Array.isArray(c.reactions?.like) ? c.reactions.like.length : (c.reactions?.like || 0)) +
      (Array.isArray(c.reactions?.love) ? c.reactions.love.length : (c.reactions?.love || 0)) +
      (Array.isArray(c.reactions?.laugh) ? c.reactions.laugh.length : (c.reactions?.laugh || 0))
    );
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="top-bar">
        <h2>
          {view === "dashboard" ? `Welcome, ${user?.name || "User"} 👋` : "My Confessions"}
        </h2>
        
        {view === "dashboard" && (
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search confessions..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        )}
      </div>

      {view === "dashboard" && (
        <>
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <div 
                key={cat} 
                className={`pill ${cat === activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          
          <ConfessionForm token={token} refresh={() => fetchConfessions(true)} />
        </>
      )}

      {isLoading ? (
        <div className="confessions-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card glass-panel" style={{ height: "180px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: "80px", height: "24px", background: "rgba(139, 92, 246, 0.2)", borderRadius: "12px" }} />
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ width: "60px", height: "16px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }} />
              </div>
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} style={{ width: "100%", height: "16px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", marginBottom: "8px" }} />
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} style={{ width: "80%", height: "16px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }} />
              <div style={{ marginTop: "auto", paddingTop: "20px", display: "flex", gap: "10px" }}>
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: "60px", height: "30px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }} />
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ width: "60px", height: "30px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : confessions.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <h3>No Confessions Found</h3>
          <p>Be the first to share something in this category!</p>
        </div>
      ) : (
        <div className="confessions-grid">
          <AnimatePresence>
            {confessions.map((confession) => (
              <ConfessionCard
                key={confession._id}
                confession={confession}
                refresh={() => fetchConfessions(true)}
                token={token}
                isMine={view === "my"}
                user={user}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default Home;