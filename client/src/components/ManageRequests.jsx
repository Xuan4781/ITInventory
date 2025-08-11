import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../layout/SideBar";
import Header from "../layout/Header";

const ManageRequests = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get("/api/requests", config);
      setRequests(data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/requests/${id}`, { status: newStatus }, config);
      toast.success(`Request ${newStatus}`);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.user?.name?.toLowerCase().includes(searchedKeyword) ||
      req.category?.toLowerCase().includes(searchedKeyword) ||
      req.notes?.toLowerCase().includes(searchedKeyword)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-20 bg-white shadow-sm w-full">
          <Header />
        </header>

        <main className="flex-1 p-4 md:p-6 pt-20 overflow-y-auto">
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              Manage Device Requests
            </h2>

            <input
              type="text"
              placeholder="Search by user, category, or notes..."
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
                    <th className="px-4 py-2 text-left whitespace-nowrap">Category</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Notes</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => (
                    <tr key={req._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{req.user?.name || "—"}</td>
                      <td className="px-4 py-2">{req.category}</td>
                      <td className="px-4 py-2 truncate max-w-xs">{req.notes || "—"}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2 flex flex-wrap gap-2 justify-start">
                        {req.status !== "Approved" && (
                          <button
                            onClick={() => updateStatus(req._id, "Approved")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#dceeff] text-[#005baa] border border-[#b6dcff] rounded-md hover:bg-[#cce4ff] transition-all duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                        )}
                        {req.status !== "Denied" && (
                          <button
                            onClick={() => updateStatus(req._id, "Denied")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-300 transition-all duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Deny
                          </button>
                        )}
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
