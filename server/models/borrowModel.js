// import mongoose from "mongoose";

// const borrowSchema = new mongoose.Schema({
//     user: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },
//         name: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//         },
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     book: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Book",
//         required: true,
//     },
//     borrowDate: {
//         type: Date,
//         default: Date.now,
//     },
//     dueDate: {
//         type: Date, 
//         required: true,
//     },
//     returnDate: {
//         type: Date,
//         default: null,
//     },
//     fine: {
//         type: Number,
//         default: 0
//     },
//     notified: {
//         type: Boolean,
//         default: false,
//     },
// },
// {timestamps: true}
// );

// export const Borrow = mongoose.model("Borrow", borrowSchema);

import mongoose from "mongoose";


const borrowSchema = new mongoose.Schema({
    user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 💡 So we can populate this
    },
    name: String,
    email: String,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  office: { type: String },
  division: { type: String },
  costCenter: { type: String }, // cost center or budget
  userName: { type: String },
  shippedLocation: { type: String },
  procurementVendor: { type: String },
  manufacturer: { type: String },
  modelNumber: { type: String },
  serviceTag: { type: String }, // service tag or serial number
  computerName: { type: String },
  unitCost: { type: String },
  preparedBy: { type: String }, // prepared / shipped by
  dateIssued: { type: Date },
  datePurchased: { type: Date },
  warrantyExpire: { type: Date },
  currentAge: { type: Number }, // in years
  monitor: { type: String },
  monitorDatePurchased: { type: Date },
  monitorAge: { type: Number },
  monitorSize: { type: String },
  monitorQuantity: { type: Number },
  dockingStation: { type: String },
  laptopServiceTag: { type: String },
  dockingStationWarrantyExpire: { type: Date },
  notes: { type: String },
  age2025: { type: Number }, // age at end of 2025
  age2026: { type: Number },
  age2027: { type: Number },
  age2028: { type: Number },
  remainingPurchase2025: { type: Number },
  plannedPurchase2026: { type: Number },
  plannedPurchase2027: { type: Number },
  plannedPurchase2028: { type: Number },

  // Optional: add reference to user and book if you want
}, { timestamps: true });

export const Borrow = mongoose.model("Borrow", borrowSchema);
