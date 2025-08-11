import mongoose from "mongoose";

const peripheralLoanSchema = new mongoose.Schema({
  equipment: {
    type: String,
    required: true,
  },
  borrowerName: {
    type: String,
    required: true,
  },
  dateLoaned: {
    type: Date,
    default: Date.now,
  },
  returned: {
    type: Boolean,
    default: false,
  },
});

export const PeripheralLoan = mongoose.model("PeripheralLoan", peripheralLoanSchema);
