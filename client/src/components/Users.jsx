import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const filteredUsers = users?.filter((u) => u.role === "User") || [];

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
          {/* Page Header */}
          <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
              Registered Users ({filteredUsers.length})
            </h2>
          </section>

          {/* Table */}
          {filteredUsers.length > 0 ? (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-center">No. of Devices Loaned</th>
                    <th className="px-4 py-2 text-center">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2 text-center">
                        {user?.borrowedBooks?.length ?? 0}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="text-3xl mt-5 font-medium">
              No registered users found.
            </h3>
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;
