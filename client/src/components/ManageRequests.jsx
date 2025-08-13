import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../layout/SideBar";
import Header from "../layout/Header";
import {
  fetchAllRequests,
  updateRequestStatus,
  deleteRequest, // new
} from "../store/slices/requestSlice";

const ManageRequests = () => {
  const dispatch = useDispatch();
  const { requests = [], loading, error } = useSelector((state) => state.requests);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateRequestStatus({ id, status })).unwrap();
      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error(err || "Failed to update request status");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await dispatch(deleteRequest(id)).unwrap();
      toast.success("Request deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete request");
    }
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.user?.name?.toLowerCase().includes(searchedKeyword) ||
      (req.device?.name || req.device)?.toLowerCase().includes(searchedKeyword) ||
      req.notes?.toLowerCase().includes(searchedKeyword)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <aside className="w-full md:w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-20 bg-white shadow-sm w-full">
          <Header />
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <section className="mt-[72px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              Manage Peripheral Requests
            </h2>
            <input
              type="text"
              placeholder="Search by user, device, or notes..."
              className="flex-grow max-w-xs border p-2 border-gray-300 rounded-md"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </section>


          {loading ? (
            <p className="mt-6">Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <h3 className="text-3xl mt-6 font-medium">No requests found.</h3>
          ) : (
            <div className="mt-6 overflow-x-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left whitespace-nowrap">User</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Device</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Notes</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Loan Info</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => (
                    <tr key={req._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{req.user?.name || "—"}</td>
                      <td className="px-4 py-2">{req.device?.name || req.device}</td>
                      <td className="px-4 py-2 truncate max-w-xs">{req.notes || "—"}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2">
                        {req.peripheralLoanId ? (
                          <>
                            <div>Borrower: {req.peripheralLoanId.borrowerName}</div>
                            <div>Date Loaned: {new Date(req.peripheralLoanId.dateLoaned).toLocaleDateString()}</div>
                            <div>Returned: {req.peripheralLoanId.returned ? "Yes" : "No"}</div>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                        <td className="px-4 py-2 flex flex-wrap gap-2 justify-start">
                        {req.status !== "Approved" && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, "Approved")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#005baa] text-white font-medium rounded-lg shadow-sm hover:bg-[#004a8f] transition-colors duration-200"
                          >
                            Approve
                          </button>
                        )}
                        {req.status !== "Denied" && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, "Denied")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200"
                          >
                            Deny
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageRequests;
