import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { fetchAllBorrowedBooks, recordBorrowBook, updateBorrowBook } from "../store/slices/borrowSlice";
import axios from "axios";

const AddBorrowForm = ({ onClose, bookId, borrowToEdit}) => {
  const dispatch = useDispatch();

  // Set initial form state - add fields you need
  const initalFormState = {
    office: "",
    division: "",
    costCenter: "",
    userName: "",
    shippedLocation: "",
    procurementVendor: "",
    manufacturer: "",
    modelNumber: "",
    serviceTag: "",
    computerName: "",
    unitCost: "",
    preparedBy: "",
    dateIssued: "",
    datePurchased: "",
    warrantyExpire: "",
    email: "",
    currentAge: "",
    monitor: "",
    monitorDatePurchased: "",
    monitorAge: "",
    monitorSize: "",
    monitorQuantity: "",
    dockingStation: "",
    laptopServiceTag: "",
    dockingStationWarrantyExpire: "",

  }
  const [formData, setFormData] = useState(initalFormState);
    
   useEffect(() => {
    if (borrowToEdit) {
      // copy all needed fields from borrowToEdit into formData
      console.log("borrowToEdit:", borrowToEdit);
      setFormData({
        office: borrowToEdit.office || "",
        division: borrowToEdit.division || "",
        costCenter: borrowToEdit.costCenter || "",
        userName: borrowToEdit.userName || "",
        shippedLocation: borrowToEdit.shippedLocation || "",
        procurementVendor: borrowToEdit.procurementVendor || "",
        manufacturer: borrowToEdit.manufacturer || "",
        modelNumber: borrowToEdit.modelNumber || "",
        serviceTag: borrowToEdit.serviceTag || "",
        computerName: borrowToEdit.computerName || "",
        unitCost: borrowToEdit.unitCost || "",
        preparedBy: borrowToEdit.preparedBy || "",
        dateIssued: borrowToEdit.dateIssued || "",
        datePurchased: borrowToEdit.datePurchased || "",
        warrantyExpire: borrowToEdit.warrantyExpire || "",
        email: borrowToEdit.email || borrowToEdit.user?.email || "",
        // add all other fields similarly...
      });
    }
  }, [borrowToEdit]);



  // Handle inputs update
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (borrowToEdit) {
      // Update mode
      await dispatch(updateBorrowBook({ id: borrowToEdit._id, data: formData }));
      await dispatch(fetchAllBorrowedBooks())
    } else {
      // Add mode
      await dispatch(recordBorrowBook(formData));
      await dispatch(fetchAllBorrowedBooks());
    }

    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Borrowed Device</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Book/Device ID
          <div>
            <label className="block mb-1 font-medium">Device ID</label>
            <input
              type="text"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div> */}

          {/* User Email */}
          <div>
            <label className="block mb-1 font-medium">User Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Example other fields */}
          <div>
            <label className="block mb-1 font-medium">Office</label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Division</label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">CostCenter</label>
            <input
              type="text"
              name="costCenter"
              value={formData.costCenter}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">UserName</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Shipped Location</label>
            <input
              type="text"
              name="shippedLocation"
              value={formData.shippedLocation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Procurement Vendor</label>
            <input
              type="text"
              name="procurementVendor"
              value={formData.procurementVendor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Model Number</label>
            <input
              type="text"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Serial Tag</label>
            <input
              type="text"
              name="serviceTag"
              value={formData.serviceTag}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Computer Name</label>
            <input
              type="text"
              name="computerName"
              value={formData.computerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Unit Cost</label>
            <input
              type="text"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Prepared/Shipped By</label>
            <input
              type="text"
              name="preparedBy"
              value={formData.preparedBy}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date Issued</label>
            <input
              type="text"
              name="dateIssued"
              value={formData.dateIssued}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date Purchased</label>
            <input
              type="text"
              name="datePurchased"
              value={formData.datePurchased}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Warranty Expire</label>
            <input
              type="text"
              name="warrantyExpire"
              value={formData.warrantyExpire}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Current Age</label>
            <input
              type="text"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Monitor</label>
            <input
              type="text"
              name="monitor"
              value={formData.monitor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Monitor Date Purchased</label>
            <input
              type="text"
              name="monitorDatePurchased"
              value={formData.monitorDatePurchased}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Monitor Age</label>
            <input
              type="text"
              name="monitorAge"
              value={formData.monitorAge}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Monitor Size</label>
            <input
              type="text"
              name="monitorSize"
              value={formData.monitorSize}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Monitor Quantity</label>
            <input
              type="text"
              name="monitorQuantity"
              value={formData.monitorQuantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Docking Station</label>
            <input
              type="text"
              name="dockingStation"
              value={formData.dockingStation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Laptop Service Tag</label>
            <input
              type="text"
              name="laptopServiceTag"
              value={formData.laptopServiceTag}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Docking Station Expire</label>
            <input
              type="text"
              name="dockingStationWarrantyExpire"
              value={formData.dockingStationWarrantyExpire}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          


          {/* Add more inputs similarly */}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
            >
              {borrowToEdit ? "Update Borrowed Device" : "Add Borrowed Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBorrowForm;
