const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ["Love", "Funny", "Study", "Vent", "Secret"], default: "Secret" },
  secretCode: { type: String, required: true, minlength: 4 },
  reactions: {
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    laugh: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Confession", confessionSchema);