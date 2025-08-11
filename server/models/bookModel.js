import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    name: String,
    modelNumber: String,
    procurementVendor: String,
    manufacturer: String,
    category: {
      type: String,
      enum: ['Laptop', 'Headset', 'Mouse', 'Keyboard', 'Charger'],
      required: true,
      default: 'Laptop', // default can be Laptop or empty string if preferred
    },
}, {
  timestamps: true,
});

//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     author: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description:{
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     availability: {
//         type: Boolean,
//         default: true,
//     },
// },
// {
//     timestamps: true,
export const Book = mongoose.model("Book", bookSchema);