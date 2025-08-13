import React, { useEffect, useState, useMemo } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAllPeripheralLoans,
  deletePeripheralLoan,
  resetPeripheralSlice,
} from "../store/slices/peripheralSlice";
import { toggleAddPeripheralPopup } from "../store/slices/popUpSlice";
import Sidebar from "../layout/SideBar";
import Header from "../layout/Header";
import AddPeripheralPopup from "../popups/AddPeripheralPopup";

// small debounce helper so we don't filter on every keystroke instantly
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const BorrowedPeripherals = () => {
  const dispatch = useDispatch();
  const { peripherals, loading, error, message } = useSelector(
    (state) => state.peripheral
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addPeripheralPopup } = useSelector((state) => state.popup);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [peripheralToEdit, setPeripheralToEdit] = useState(null);

  // debounce search term by 200ms
  const debouncedSearch = useDebounce(searchedKeyword.toLowerCase(), 200);

  useEffect(() => {
    dispatch(fetchAllPeripheralLoans());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllPeripheralLoans());
      dispatch(resetPeripheralSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetPeripheralSlice());
    }
  }, [dispatch, message, error]);

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value);
  };

  const handleDeletePeripheral = (id) => {
    if (window.confirm("Are you sure you want to delete this peripheral?")) {
      dispatch(deletePeripheralLoan(id));
    }
  };

  const handleEditPeripheral = (item) => {
    setPeripheralToEdit(item);
    dispatch(toggleAddPeripheralPopup());
  };

  const handleClosePopup = () => {
    setPeripheralToEdit(null);
    dispatch(toggleAddPeripheralPopup());
  };

  // memoized filter so it only recalculates when peripherals or search change
  const filteredPeripherals = useMemo(() => {
    if (!peripherals) return [];
    return peripherals.filter(
      (item) =>
        item.equipment?.toLowerCase().includes(debouncedSearch) ||
        item.borrowerName?.toLowerCase().includes(debouncedSearch)
    );
  }, [peripherals, debouncedSearch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 h-screen flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="sticky top-0 z-20 bg-white shadow-sm w-full">
          <Header />
        </div>

        <main className="flex-1 p-6 pt-20 overflow-y-auto will-change-transform">
          <section className="sticky top-[-20px] z-10 bg-white pb-4 pl-5 pr-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              Borrowed Peripherals
            </h2>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {isAuthenticated && user?.role === "Admin" && (
                <button
                  onClick={() => {
                    setPeripheralToEdit(null);
                    dispatch(toggleAddPeripheralPopup());
                  }}
                  className="relative pl-14 min-w-[140px] flex-shrink-0 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                    +
                  </span>
                  Add Peripheral
                </button>
              )}

              <input
                type="text"
                placeholder="Search Equipment or Borrower..."
                className="flex-grow max-w-xs border p-2 border-gray-300 rounded-md"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>
          </section>

          {loading ? (
            <p className="mt-6">Loading...</p>
          ) : error ? (
            <p className="text-red-500 mt-6">{error}</p>
          ) : filteredPeripherals.length === 0 ? (
            <h3 className="text-3xl mt-6 font-medium">No peripherals found.</h3>
          ) : (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Equipment</th>
                    <th className="px-4 py-2 text-left">Borrower</th>
                    <th className="px-4 py-2 text-left">Date Loaned</th>
                    <th className="px-4 py-2 text-left">Returned</th>
                    <th className="px-4 py-2 text-left">Returned Date</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredPeripherals.map((item, index) => (
                    <tr
                      key={item._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{item.equipment}</td>
                      <td className="px-4 py-2">{item.borrowerName}</td>
                      <td className="px-4 py-2">
                        {new Date(item.dateLoaned).toLocaleDateString("en-US", {
                          timeZone: "America/New_York",
                        })}
                      </td>
                      <td className="px-4 py-2">
                        {item.returned ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2">
                        {item.returnedDate
                          ? new Date(item.returnedDate).toLocaleDateString(
                              "en-US",
                              {}
                            )
                          : "—"}
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 flex space-x-2 justify-center">
                          <Pencil
                            onClick={() => handleEditPeripheral(item)}
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                          />
                          <Trash2
                            onClick={() => handleDeletePeripheral(item._id)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {addPeripheralPopup && (
        <AddPeripheralPopup
          peripheralToEdit={peripheralToEdit}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default BorrowedPeripherals;
