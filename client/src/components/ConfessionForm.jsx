import { useState } from "react";
import { toast } from "react-hot-toast";
import { PenTool, Send } from "lucide-react";
import { motion } from "framer-motion";
import config from "../config";

function ConfessionForm({ token, refresh }) {
  const [text, setText] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [category, setCategory] = useState("Secret");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (secretCode.length < 4) {
      toast.error("Secret code must be at least 4 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/confessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, secretCode, category }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post");
      }

      toast.success("Confession shared anonymously!");
      setText("");
      setSecretCode("");
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="form-card glass-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-header">
        <PenTool size={20} color="var(--accent)" /> Share Your Thoughts...
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind? Don't worry, it's totally anonymous."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <div className="form-controls">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Secret">🔒 Secret</option>
            <option value="Love">❤️ Love</option>
            <option value="Funny">😂 Funny</option>
            <option value="Study">📚 Study</option>
            <option value="Vent">💥 Vent</option>
          </select>

          <input
            type="password"
            placeholder="Secret Code (min 4 char)"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            required
            title="Used to edit or delete your confession later"
          />

          <button 
            className="primary-btn" 
            style={{ flex: 1, maxWidth: "160px" }} 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Post"} <Send size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ConfessionForm;