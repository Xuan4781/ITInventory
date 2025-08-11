import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPeripheralLoan,
  updatePeripheralLoan,
  fetchAllPeripheralLoans,
} from "../store/slices/peripheralSlice";
import { toast } from "react-toastify";

const AddPeripheralPopup = ({ peripheralToEdit, onClose }) => {
  const dispatch = useDispatch();
  const { message, loading } = useSelector((state) => state.peripheral);

  const isEditMode = Boolean(peripheralToEdit);

  const [equipment, setEquipment] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [dateLoaned, setDateLoaned] = useState("");
  const [returned, setReturned] = useState(false);
  const [returnedDate, setReturnedDate] = useState("");

  useEffect(() => {
  if (isEditMode && peripheralToEdit) {
    console.log("🧩 Editing peripheral:", peripheralToEdit);

    setEquipment(peripheralToEdit.equipment || "");
    setBorrowerName(peripheralToEdit.borrowerName || "");
    setDateLoaned(peripheralToEdit.dateLoaned?.slice(0, 10) || "");

    const returnedFlag = peripheralToEdit.returned || false;
    setReturned(returnedFlag);
    console.log("✅ returned flag:", returnedFlag);

    if (peripheralToEdit.returnedDate) {
      console.log("📦 Raw returnedDate from backend:", peripheralToEdit.returnedDate);

      const isoDate = new Date(peripheralToEdit.returnedDate).toISOString().slice(0, 10);
      console.log("📅 Formatted returnedDate for input:", isoDate);

      setReturnedDate(isoDate);
    } else {
      console.log("🚫 No returnedDate found — setting empty");
      setReturnedDate("");
    }
  } else {
    console.log("🆕 Creating new peripheral — clearing form");
    setEquipment("");
    setBorrowerName("");
    setDateLoaned("");
    setReturned(false);
    setReturnedDate("");
  }
}, [isEditMode, peripheralToEdit]);

useEffect(() => {
  console.log("🟡 returnedDate changed:", returnedDate);
}, [returnedDate]);


const handleSubmit = (e) => {
  e.preventDefault();

  const now = new Date();

  const [loanYear, loanMonth, loanDay] = dateLoaned.split("-").map(Number);
  const rawLoanedDate = new Date(loanYear, loanMonth - 1, loanDay, now.getHours(), now.getMinutes(), now.getSeconds());

  const formData = {
    equipment,
    borrowerName,
    returned,
    dateLoaned: rawLoanedDate.toISOString(),
  };

  if (returned && returnedDate.trim() !== "") {
    const [returnYear, returnMonth, returnDay] = returnedDate.split("-").map(Number);
    const rawReturnedDate = new Date(returnYear, returnMonth - 1, returnDay, now.getHours(), now.getMinutes(), now.getSeconds());
    formData.returnedDate = rawReturnedDate.toISOString();
  } else {
    console.log("⚠️ returnedDate not included in formData");
  }

  console.log("📤 Submitting formData:", formData);

  if (isEditMode && peripheralToEdit?._id) {
    dispatch(updatePeripheralLoan({ id: peripheralToEdit._id, data: formData }));
  } else {
    dispatch(addPeripheralLoan(formData));
  }
};


  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllPeripheralLoans());
      onClose();
    }
  }, [dispatch, message, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {isEditMode ? "Edit Peripheral Loan" : "Record Peripheral Loan"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Equipment</label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g., Logitech Mouse"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Borrower Name</label>
              <input
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="e.g., Angela"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Date Loaned</label>
              <input
                type="date"
                value={dateLoaned}
                onChange={(e) => setDateLoaned(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={returned}
                onChange={(e) => {
                    const checked = e.target.checked;
                    console.log("🟢 Checkbox toggled:", checked);
                    setReturned(checked);
                    if (!checked) {
                    console.log("🔴 Checkbox unchecked — clearing returnedDate");
                    setReturnedDate("");
                    }
                }}
                id="returned"
                />
              <label htmlFor="returned" className="text-sm font-medium text-gray-900">
                Returned
              </label>
            </div>
            {returned && (
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Date Returned</label>
                <input
                  type="date"
                  value={returnedDate}
                  onChange={(e) => setReturnedDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPeripheralPopup;
