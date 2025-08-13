import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { createPeripheralRequest, fetchUserRequests } from "../store/slices/requestSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";

export default function AddPeripheralRequestPage() {
  const dispatch = useDispatch();
  const { books = [] } = useSelector((state) => state.book); // safe default
  const { loading } = useSelector((state) => state.requests);

  const [deviceId, setDeviceId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId) return;

    try {
      await dispatch(createPeripheralRequest({ deviceId, notes })).unwrap();
      toast.success("Peripheral request created!");
      setDeviceId("");
      setNotes("");
      dispatch(fetchUserRequests()); // refresh your requests table if needed
    } catch (err) {
      toast.error(err || "Failed to create request");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <Header />

        <main className="p-6 pt-28">
          <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              Request Peripheral
            </h2>
          </header>

          <div className="mt-6 rounded-md shadow-lg bg-white p-6 max-w-3xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Select Peripheral:</label>
                <select
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  required
                  className="border rounded-md px-3 py-2 w-full text-black"
                >
                  <option value="">-- Select --</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.name} — {book.modelNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full text-black"
                  placeholder="Optional notes..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 w-full sm:w-40 disabled:opacity-50"
              >
                {loading ? "Requesting..." : "Request"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
