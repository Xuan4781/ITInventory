import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice} from "../store/slices/borrowSlice"

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

return <></>;
};
export default BookManagement;
