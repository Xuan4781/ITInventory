import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import Sidebar from "../layout/SideBar"

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup } = useSelector((state) => state.popup);

  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(
    (state) => state.borrow
  );

  const handleDeleteDevice = (bookId) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      dispatch(deleteBook(bookId));
    }
  };
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage]);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const searchedBooks = books.filter(
    (book) =>
      book.name?.toLowerCase().includes(searchedKeyword) ||
      book.modelNumber?.toLowerCase().includes(searchedKeyword) ||
      book.procurementVendor?.toLowerCase().includes(searchedKeyword) ||
      book.manufacturer?.toLowerCase().includes(searchedKeyword)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with fixed width */}
      <div className="w-64 h-screen flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Fixed header */}
        <div className="sticky top-0 z-20 bg-white shadow-sm w-full">
          <Header />
        </div>
        
        {/* Page content - scrollable area */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto">
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              {user && user.role === "Admin" ? "Device Management" : "Device"}
            </h2>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {isAuthenticated && user?.role === "Admin" && (
                <button
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="relative pl-14 min-w-[140px] flex-shrink-0 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                    +
                  </span>
                  Add Device
                </button>
              )}

              <input
                type="text"
                placeholder="Search Devices..."
                className="flex-grow max-w-xs border p-2 border-gray-300 rounded-md"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>
          </section>



          {/* Table */}
          {books && books.length > 0 ? (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Model Number</th>
                    <th className="px-4 py-2 text-left">Procurement Vendor</th>
                    <th className="px-4 py-2 text-left">Manufacturer</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {searchedBooks.map((book, index) => (
                    <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{book.name}</td>
                      <td className="px-4 py-2">{book.modelNumber}</td>
                      <td className="px-4 py-2">{book.procurementVendor}</td>
                      <td className="px-4 py-2">{book.manufacturer}</td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                          <Trash2
                            onClick={() => handleDeleteDevice(book._id)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="text-3xl mt-5 font-medium">No Devices found in inventory!</h3>
          )}
        </main>
      </div>
      
      {/* Popup with high z-index to ensure it's not covered */}
      {addBookPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AddBookPopup />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
