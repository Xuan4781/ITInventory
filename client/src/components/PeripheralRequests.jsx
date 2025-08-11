import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRequests, fetchAllRequests, updateRequestStatus } from '../store/slices/requestSlice';
import Header from '../layout/Header';
import Sidebar from '../layout/SideBar';
import { HiMenu } from 'react-icons/hi';

const RequestsPeripherals = () => {
  const dispatch = useDispatch();
  const { requests = [], loading, error } = useSelector(state => state.requests);
  const { user } = useSelector(state => state.auth);

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    setIsSideBarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (user?.role === 'Admin') {
      dispatch(fetchAllRequests());
    } else {
      dispatch(fetchUserRequests());
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, user]);

  // Prevent background scroll when sidebar open on mobile
  useEffect(() => {
    if (isSideBarOpen && window.innerWidth < 768) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isSideBarOpen]);

  const handleApprove = (id) => {
    dispatch(updateRequestStatus({ id, status: 'Approved' }));
  };

  const handleDeny = (id) => {
    dispatch(updateRequestStatus({ id, status: 'Denied' }));
  };

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:shadow-none`}
      >
        <Sidebar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={() => {}}
        />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSideBarOpen ? 'md:ml-5' : 'md:ml-0'}`}
      >
        {/* Header: hidden on small screens */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Hamburger toggle button - visible only on mobile */}
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HiMenu size={24} />
        </button>

        <main className="relative flex-1 p-4 md:p-6 pt-[calc(60px+1.5rem)] md:pt-6 overflow-auto">
          <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold md:text-2xl">Peripheral Requests</h2>
          </header>

          {loading && <p className="text-gray-600">Loading requests...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {requests.length === 0 ? (
            <p className="text-gray-700">No requests found.</p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-md bg-white">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left p-10 whitespace-nowrap">
                    <th className="px-4 py-3 border-b">Category</th>
                    <th className="px-4 py-3 border-b">Notes</th>
                    <th className="px-4 py-3 border-b">Status</th>
                    <th className="px-4 py-3 border-b">Requested By</th>
                    {user?.role === 'Admin' && <th className="px-4 py-3 border-b">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr
                      key={req._id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-2 max-w-xs truncate">{req.category}</td>
                      <td className="px-4 py-2 max-w-xs truncate">{req.notes || '-'}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2">{req.user?.name || 'Unknown'}</td>
                      {user?.role === 'Admin' && (
                        <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                          {req.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(req._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#dceeff] text-[#005baa] border border-[#b6dcff] rounded-md hover:bg-[#cce4ff] transition-all duration-150"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(req._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-300 transition-all duration-150"
                              >
                                Deny
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">No actions</span>
                          )}
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

      {/* Overlay for mobile */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300
          ${isSideBarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSideBarOpen(false)}
      />
    </div>
  );
};

export default RequestsPeripherals;
