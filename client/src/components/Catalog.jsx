import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAllBooks,
  resetBookSlice
} from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
  deleteBorrow
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";
import { Trash2 } from "lucide-react";
import AddBorrowForm from "./AddBorrowForm";
const Catalog = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector((state) => state.borrow);


  const [borrowToEdit, setBorrowToEdit] = useState(null);
  const [showAddBorrowForm, setShowAddBorrowForm] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  const handleDelete = (borrowId) => {
    if (window.confirm("Are you sure you want to delete this borrow record?")) {
      dispatch(deleteBorrow(borrowId));
    }
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  // ✅ Initial fetch on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user]);

  // ✅ Re-fetch after success or error
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, loading, message]);

  const booksToDisplay = (allBorrowedBooks || []).filter((book) =>
    book.user?.email?.toLowerCase().includes(searchedKeyword) ||
    book.user?.name?.toLowerCase().includes(searchedKeyword) ||
    book.modelNumber?.toLowerCase().includes(searchedKeyword)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-screen flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white shadow-sm w-full">
          <Header />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto bg-gray-50">
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              {user && user.role === "Admin" ? "Borrowed Devices" : "Devices"}
            </h2>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {isAuthenticated && user?.role === "Admin" && (
                <button
                  onClick={() => setShowAddBorrowForm(true)}
                  className="relative pl-14 min-w-[180px] flex-shrink-0 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                    +
                  </span>
                  Add Borrowed Device
                </button>
              )}

              <input
                type="text"
                placeholder="Search Borrowed Devices..."
                className="flex-grow max-w-xs border p-2 border-gray-300 rounded-md"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>
          </section>

          {/* Table */}
          {booksToDisplay.length > 0 ? (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Office</th>
                    <th className="px-4 py-2 text-left">Division</th>
                    <th className="px-4 py-2 text-left">CostCenter</th>
                    <th className="px-4 py-2 text-left">ShippedLocation</th>
                    <th className="px-4 py-2 text-left">ProcurementVendor</th>
                    <th className="px-4 py-2 text-left">Manufacturer</th>
                    <th className="px-4 py-2 text-left">Model Number</th>
                    <th className="px-4 py-2 text-left">ServiceTag</th>
                    <th className="px-4 py-2 text-left">ComputerName</th>
                    <th className="px-4 py-2 text-left">UnitCost</th>
                    <th className="px-4 py-2 text-left">PreparedBy</th>
                    <th className="px-4 py-2 text-left">DateIssued</th>
                    <th className="px-4 py-2 text-left">DatePurchased</th>
                    <th className="px-4 py-2 text-left">Warranty Expire</th>
                    <th className="px-4 py-2 text-left">Current Age</th>
                    <th className="px-4 py-2 text-left">Monitor</th>
                    <th className="px-4 py-2 text-left">Monitor Date Purchased</th>
                    <th className="px-4 py-2 text-left">Monitor Age</th>
                    <th className="px-4 py-2 text-left">Monitor Size</th>
                    <th className="px-4 py-2 text-left">Monitor Quantity</th>
                    <th className="px-4 py-2 text-left">Docking Station</th>
                    <th className="px-4 py-2 text-left">LaptopServiceTag</th>
                    <th className="px-4 py-2 text-left">DockingStationWarrantyExpire</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {booksToDisplay.map((book, index) => (
                    <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{book.user?.name || book.userName || "-"}</td>
                      <td className="px-4 py-2">{book.user?.email || book.email || "-"}</td>
                      <td className="px-4 py-2">{book.office || "-"}</td>
                      <td className="px-4 py-2">{book.division || "-"}</td>
                      <td className="px-4 py-2">{book.costCenter || "-"}</td>
                      <td className="px-4 py-2">{book.shippedLocation || "-"}</td>
                      <td className="px-4 py-2">{book.procurementVendor || "-"}</td>
                      <td className="px-4 py-2">{book.manufacturer || "-"}</td>
                      <td className="px-4 py-2">{book.modelNumber || "-"}</td>
                      <td className="px-4 py-2">{book.serviceTag || "-"}</td>
                      <td className="px-4 py-2">{book.computerName || "-"}</td>
                      <td className="px-4 py-2">{book.unitCost !== undefined ? `$${book.unitCost}` : "-"}</td>
                      <td className="px-4 py-2">{book.preparedBy || "-"}</td>
                      <td className="px-4 py-2">{book.dateIssued ? formatDate(book.dateIssued) : "-"}</td>
                      <td className="px-4 py-2">{book.datePurchased ? formatDate(book.datePurchased) : "-"}</td>
                      <td className="px-4 py-2">{book.warrantyExpire ? formatDate(book.warrantyExpire) : "-"}</td>
                      <td className="px-4 py-2">{book.currentAge ?? "-"}</td>
                      <td className="px-4 py-2">{book.monitor || "-"}</td>
                      <td className="px-4 py-2">{book.monitorDatePurchased ? formatDate(book.monitorDatePurchased) : "-"}</td>
                      <td className="px-4 py-2">{book.monitorAge ?? "-"}</td>
                      <td className="px-4 py-2">{book.monitorSize || "-"}</td>
                      <td className="px-4 py-2">{book.monitorQuantity ?? "-"}</td>
                      <td className="px-4 py-2">{book.dockingStation || "-"}</td>
                      <td className="px-4 py-2">{book.laptopServiceTag || "-"}</td>
                      <td className="px-4 py-2">{book.dockingStationWarrantyExpire ? formatDate(book.dockingStationWarrantyExpire) : "-"}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Trash2
                          onClick={() => handleDelete(book._id)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer inline"
                        />
                        <button
                          onClick={() => {
                            setBorrowToEdit(book);
                            setShowAddBorrowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 underline ml-1"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="text-3xl mt-5 font-medium">No borrowed devices found!</h3>
          )}
        </main>
      </div>

      {/* Popups */}
      {showAddBorrowForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <AddBorrowForm
              onClose={() => {
                setShowAddBorrowForm(false);
                setBorrowToEdit(null);
              }}
              borrowToEdit={borrowToEdit}
            />
          </div>
        </div>
      )}

      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </div>
  );
};

export default Catalog;
