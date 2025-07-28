import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice} from "../store/slices/borrowSlice"
import Header from "../layout/Header";

const BookManagement = () => {
  const dispatch = useDispatch();
  const {loading, error, message, books} = useSelector((state) => state.book);
  const {isAuthenticated, user} = useSelector((state) => state.auth);
  const {addBookPopup, recordBookPopup, returnBookPopup} = useSelector((state)=> state.popup);


const {loading: borrowSliceLoading, error: borrowSliceError,message: borrowSliceMessage} = useSelector((state)=> state.borrow)

const [readBook, setReadBook] = useState({})
const openReadPopup = (id) =>{
  const book = books.find((book) => book._id === id);
  setReadBook(book);
  dispatch(toggleReadBookPopup())
}

const [borrowBookId, setBorrowBookId] = useState("")
const openRecordBookPopup = (bookId)=>{
  setBorrowBookId(bookId)
  dispatch(toggleRecordBookPopup())
}

useEffect(()=>{
  if(message|| borrowSliceMessage){
    toast.success(message || borrowSliceMessage);
    dispatch(fetchAllBooks())
    dispatch(fetchAllBorrowedBooks())
    dispatch(resetBookSlice())
    dispatch(resetBorrowSlice())
  }
  if(error || borrowSliceError){
    toast.error(error || borrowSliceError);
    dispatch(resetBookSlice());
    dispatch(resetBorrowSlice())
  }
}, [dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage]);


const [searchedKeyword, setSearchedKeyword] = useState("")
const handleSearch = (e)=>{
  setSearchedKeyword(e.target.value.toLowerCase())
}
const searchedBooks = books.filter(book => 
  book.title.toLowerCase().includes(searchedKeyword)
);

return (
  <>
    <main className="relative flex-1 p-6 pt-28">
      <Header/>
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          {user && user.role === "Admin" ? "Device Management" : "Device"}
        </h2>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {
            isAuthenticated && user?.role === "Admin" && (
              <button onClick={()=> dispatch(toggleAddBookPopup())} className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
              Add Book
              </button>
            )}
            <input type="text" placeholder="Search Devices..." className="w-full sm:w-52 border p-2 border-gray-300 rounded-md" value={searchedKeyword} onChange={handleSearch}></input>
        </div>
      </header>
      

      {/* Table */}
      {
        books && book.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-center">Record Book</th>
                  )}
                </tr>
              </thead>
            </table>
          </div>
        ) : (
          ""
        )}
    </main>
  </>
);


};
export default BookManagement;
