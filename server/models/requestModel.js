import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", 
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending',
  },
  notes: String, // optional user notes
  peripheralLoanId: {              // ✅ link to peripheral loan
    type: mongoose.Schema.Types.ObjectId,
    ref: "PeripheralLoan",
    default: null,
  },
}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);
