import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserRequests } from "../store/slices/requestSlice";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";

export default function PeripheralRequestPage() {
  const dispatch = useDispatch();
  const { requests = [], loading } = useSelector((state) => state.requests);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    dispatch(fetchUserRequests());
  }, [dispatch]);

  // Filter requests based on status
  const filteredRequests = requests.filter((r) => {
    if (filter === "pending") return r.status === "Pending";
    if (filter === "approved") return r.status === "Approved";
    if (filter === "denied") return r.status === "Denied";
    return true;
  });

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
              My Peripheral Requests
            </h2>
          </header>

          {/* Filter buttons */}
          <header className="flex flex-col gap-3 sm:flex-row md:items-center mt-4">
            {["pending", "approved", "denied"].map((status) => (
              <button
                key={status}
                className={`relative rounded text-center border-2 font-semibold py-2 w-full sm:w-40 ${
                  filter === status
                    ? "bg-black text-white border-black"
                    : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </header>

          {/* Requests table */}
          <div className="mt-6 overflow-auto rounded-md shadow-lg bg-white p-6">
            {loading ? (
              <p>Loading requests...</p>
            ) : filteredRequests.length > 0 ? (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Peripheral</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Requested At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => (
                    <tr key={req._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{req.device?.name || "Unknown"}</td>
                      <td className="px-4 py-2">{req.notes || "-"}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2">{new Date(req.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg font-medium mt-5">
                No requests found for "{filter}" status.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
