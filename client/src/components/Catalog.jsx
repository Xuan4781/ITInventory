import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux"
import {toggleReturnBookPopup} from "../store/slices/popUpSlice"
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";

const Catalog = () => {
  const dispatch = useDispatch()

  const {returnBookPopup} = useSelector(state => state.popup)
  const {loading, error, allBorrowedBooks, message} = useSelector(state => state.borrow)
  const [filter, setFilter] = useState("borrowed")

  const formatDateAndTime = (timeStamp)=>{
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result
  }

  const formatDate = (timeStamp)=>{
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
  }
  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter(book=>{
    const dueDate = new Date(book.dueDate)
    return dueDate > currentDate
  })
  const overdueBooks = allBorrowedBooks?.filter(book=>{
    const dueDate = new Date(book.dueDate)
    return dueDate <= currentDate
  })

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks

  const [email, setEmail] = useState("")
  const [borrowedBookId, setBorrowedBookId] = useState("")
  const openReturnBookPopup = (bookId, email)=>{
    setBorrowedBookId(bookId)
    setEmail(email)
    dispatch(toggleReturnBookPopup())
  }

  useEffect(()=>{
    if(message){
      toast.success(message)
      dispatch(fetchAllBooks())
      dispatch(fetchAllBorrowedBooks())
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice())
    }
    if(error){
      toast.error(error)
      dispatch(resetBorrowSlice())
    }
  }, [dispatch, error, loading])
  
  return <></>;
};

export default Catalog;
