import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {addBook, fetchAllBooks} from "../store/slices/bookSlice"
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import {toast} from "react-toastify"
const AddBookPopup = () => {
  const dispatch = useDispatch();
  const {message, loading} = useSelector(state=> state.book)


  // const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState("");
  // const [price, setPrice] = useState("");
  // const [quantity, setQuantity] = useState("");
  // const [description, setDescription] = useState("");

  // const handleAddBook = (e)=>{
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("title", title)
  //   formData.append("author", author)
  //   formData.append("price", price)
  //   formData.append("quantity", quantity)
  //   formData.append("description", description)
  //   dispatch(addBook(formData))
  // }
  const [name, setName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [procurementVendor, setProcurementVendor] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
      formData.append("name", name)
      formData.append("modelNumber", modelNumber)
      formData.append("procurementVendor", procurementVendor)
      formData.append("manufacturer", manufacturer)
      dispatch(addBook(formData));
    };
  

  useEffect(()=>{
    if(message){
      toast.success(message)
      dispatch(fetchAllBooks())
      dispatch(toggleAddBookPopup())
    }
  },[dispatch, loading, message])
  return <>
  <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
        <div className='w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg md:w-1/3'>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-4'>Record Device</h3>
          <form onSubmit={handleAddBook}>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Device Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e)=> setName(e.target.value)}
                placeholder="e.g., Dell Laititude 7440"
                className='w-full px-4 py-2 border-2 border-black rounded-md'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Model Number</label>
              <input 
                type="text" 
                value={modelNumber}
                onChange={(e)=> setModelNumber(e.target.value)}
                placeholder="e.g., Latitude 7440"
                className='w-full px-4 py-2 border-2 border-black rounded-md'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Procurement Vendor</label>
              <input 
                type="text" 
                value={procurementVendor}
                onChange={(e)=> setProcurementVendor(e.target.value)}
                placeholder="e.g., Dell Premier"
                className='w-full px-4 py-2 border-2 border-black rounded-md'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Manufacturer</label>
              <input 
                type="text" 
                value={manufacturer}
                onChange={(e)=> setManufacturer(e.target.value)}
                placeholder="e.g., Dell"
                className='w-full px-4 py-2 border-2 border-black rounded-md'
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300' type="button" onClick={()=>{
                dispatch(toggleAddBookPopup())
              }}>Close</button>
              <button type="submit" className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800'>
                Add
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
  
  
  
  
  </>;
};

export default AddBookPopup;
