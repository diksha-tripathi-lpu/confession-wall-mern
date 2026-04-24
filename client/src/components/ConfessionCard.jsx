import { useState } from "react";
import { toast } from "react-hot-toast";
import { PenSquare, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

function ConfessionCard({ confession, refresh, token, isMine, user }) {
  const [modalType, setModalType] = useState(null); // 'edit' | 'delete' | null
  const [secretCode, setSecretCode] = useState("");
  const [newText, setNewText] = useState(confession.text);
  const [isLoading, setIsLoading] = useState(false);

  const react = async (type) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/confessions/${confession._id}/react`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ type }),
      });
      if (res.ok) refresh();
    } catch (err) {
      toast.error("Failed to react");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (secretCode.length < 4) {
      toast.error("Secret code must be at least 4 chars");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/confessions/${confession._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ secretCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      toast.success(data.message);
      setModalType(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (secretCode.length < 4) {
      toast.error("Secret code must be at least 4 chars");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/confessions/${confession._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText, secretCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to edit");

      toast.success(data.message || "Updated successfully");
      setModalType(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSecretCode("");
    setNewText(confession.text);
  };

  return (
    <>
      <motion.div 
        className="card glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-header">
          <span className="category-badge">{confession.category || "Secret"}</span>
          <span className="card-date">
            {new Date(confession.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        </div>

        <p className="card-text">{confession.text}</p>

        <div className="reactions-bar">
          <div className="reaction-buttons">
            <button 
              className={`reaction-btn ${Array.isArray(confession.reactions?.like) && confession.reactions.like.includes(user?.id || user?._id) ? 'active-reaction' : ''}`} 
              onClick={() => react("like")}
            >
              👍 <span>{Array.isArray(confession.reactions?.like) ? confession.reactions.like.length : (confession.reactions?.like || 0)}</span>
            </button>
            <button 
              className={`reaction-btn ${Array.isArray(confession.reactions?.love) && confession.reactions.love.includes(user?.id || user?._id) ? 'active-reaction' : ''}`} 
              onClick={() => react("love")}
            >
              ❤️ <span>{Array.isArray(confession.reactions?.love) ? confession.reactions.love.length : (confession.reactions?.love || 0)}</span>
            </button>
            <button 
              className={`reaction-btn ${Array.isArray(confession.reactions?.laugh) && confession.reactions.laugh.includes(user?.id || user?._id) ? 'active-reaction' : ''}`} 
              onClick={() => react("laugh")}
            >
              😂 <span>{Array.isArray(confession.reactions?.laugh) ? confession.reactions.laugh.length : (confession.reactions?.laugh || 0)}</span>
            </button>
          </div>

          <div className="card-actions">
            <button className="icon-btn" onClick={() => setModalType('edit')} title="Edit">
              <PenSquare size={18} />
            </button>
            <button className="icon-btn danger" onClick={() => setModalType('delete')} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalType && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content glass"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{modalType === 'edit' ? "Edit Confession" : "Delete Confession"}</h3>
                <button className="icon-btn" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <p>
                {modalType === 'edit' 
                  ? "Enter the secret code used when posting to edit." 
                  : "Are you sure? Enter the secret code to confirm deletion."}
              </p>

              <form onSubmit={modalType === 'edit' ? handleEdit : handleDelete}>
                {modalType === 'edit' && (
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    style={{ minHeight: '100px', marginBottom: '15px' }}
                  />
                )}

                <input
                  type="password"
                  placeholder="Secret Code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                />

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal} disabled={isLoading}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={modalType === 'delete' ? 'btn-danger' : 'primary-btn'} 
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? "Processing..." : modalType === 'edit' ? "Save Changes" : "Confirm Delete"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ConfessionCard;