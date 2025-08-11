import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
  },
  category: {
    type: String,
    enum: ['Headset', 'Mouse', 'Keyboard', 'Charger'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending',
  },
  notes: String, // optional user notes
}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);
