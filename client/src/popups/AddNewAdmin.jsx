import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter the email of the user to grant admin access.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(addNewAdmin(formData));
  };

  return (
    <h1 className="fixed inset-0 bg-gray-100 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
            <div className="flex items-center gap-3">
              <img
                src={keyIcon}
                alt="key-icon"
                className="bg-gray-100 p-5 rounded-lg"
              />
              <h3 className="text-xl font-bold">Add New Admin</h3>
            </div>
            <img
              src={closeIcon}
              alt="close"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="cursor-pointer"
            />
          </header>
          <form onSubmit={handleAddNewAdmin}>
            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="avatarInput" className="cursor-pointer">
                <img
                  src={avatarPreview ? avatarPreview : placeHolder}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="User's Microsoft Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {loading ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </h1>
  );
};

export default AddNewAdmin;
