import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header";       // Adjust paths as needed
import SideBar from "../layout/SideBar";
import { HiMenu } from "react-icons/hi";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AddPeripheralRequest = ({ onSuccess }) => {
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Sidebar state
  const [isSideBarOpen, setIsSideBarOpen] = useState(window.innerWidth >= 768);
  const [selectedComponent, setSelectedComponent] = useState("PeripheralRequest");

  // Handle window resize to auto-toggle sidebar for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSideBarOpen(true);
      } else {
        setIsSideBarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSideBarOpen && window.innerWidth < 768) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSideBarOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      return toast.error("Please select a device category");
    }
    try {
      setLoading(true);
      const body = { category, notes };
      await api.post("/requests", body);
      toast.success("Peripheral request submitted successfully!");
      setCategory("");
      setNotes("");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsSideBarOpen(!isSideBarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:shadow-none`}
      >
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />
      </div>

      {/* Overlay behind sidebar on mobile */}
      {isSideBarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${isSideBarOpen ? "md:ml-64" : "md:ml-0"}`}
      >
        {/* Header (hide on small screens) */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HiMenu size={24} />
        </button>

        <main className="relative flex-1 p-6 pt-20 overflow-auto">
          <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold md:text-2xl">Peripheral Request</h2>
          </header>

          <div className="max-w-xl bg-white rounded-lg shadow-lg p-6 mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Peripheral Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a device</option>
                  <option value="Headset">Headset</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Charger">Charger</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
                  placeholder="Additional details or reason for request"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white transition ${
                  loading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
                }`}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddPeripheralRequest;
