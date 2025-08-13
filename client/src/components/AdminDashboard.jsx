import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";
import { fetchAllPeripheralLoans } from "../store/slices/peripheralSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { peripherals, loading, error } = useSelector(
    (state) => state.peripheral
  );

  useEffect(() => {
    dispatch(fetchAllPeripheralLoans());
  }, [dispatch]);

  const returnedCount =
    peripherals?.filter((item) => item.returned === true).length || 0;
  const notReturnedCount =
    peripherals?.filter((item) => item.returned === false).length || 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with fixed width */}
      <div className="w-64 fixed h-full bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main content shifted right by sidebar width */}
      <div className="flex flex-col flex-1 ml-64">
        <Header />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <section className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Peripheral Return Status
            </h2>

            {loading && <p>Loading data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && peripherals?.length > 0 ? (
              <div>
                <p>Returned — {returnedCount}</p>
                <p>Not Returned — {notReturnedCount}</p>
              </div>
            ) : (
              !loading &&
              !error && <p>No peripheral return data available.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
