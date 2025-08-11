import React, { useMemo, useEffect } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";
import Sidebar from "../layout/SideBar";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/socotec_img.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { users = [] } = useSelector((state) => state.user || {}, shallowEqual);
  const { books = [] } = useSelector((state) => state.Device || {}, shallowEqual);
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow || {}, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const stats = useMemo(() => {
    const borrowed = allBorrowedBooks.filter((b) => b.returnDate === null);
    const overdue = borrowed.filter((b) => new Date(b.dueDate) < new Date());
    const uniqueBorrowers = new Set(borrowed.map((b) => b.userEmail)).size;

    const locationStats = borrowed.reduce((acc, b) => {
      const loc = typeof b.office === "string" ? b.office.trim() : "Unknown";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    console.log("📦 Borrowed Books:", borrowed);
    console.log("📍 Location Stats:", locationStats);

    return {
      totalUsers: users.filter((u) => u.role === "User").length,
      totalAdmin: users.filter((u) => u.role === "Admin").length,
      totalBooks: books.length,
      totalBorrowedBooks: borrowed.length,
      availableDevices: books.length - borrowed.length,
      borrowRate: books.length > 0 ? Math.round((borrowed.length / books.length) * 100) : 0,
      overdueCount: overdue.length,
      uniqueBorrowers,
      locationStats,
    };
  }, [users, books, allBorrowedBooks]);

  const locationData = useMemo(() => {
    const labels = Object.keys(stats.locationStats);
    const data = Object.values(stats.locationStats);
    const backgroundColor = ["#3D3E3E", "#151619", "#5A5A5A", "#999", "#CCC", "#007BFF", "#28A745"];

    console.log("📊 Pie Chart Labels:", labels);
    console.log("📊 Pie Chart Data:", data);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          hoverOffset: 4,
        },
      ],
    };
  }, [stats.locationStats]);

  const hasChartData = locationData.datasets[0].data.some((val) => val > 0);

  return (
    <>
      <Sidebar />
      <main className="ml-64 relative flex-1 p-6 pt-28">
        <Header />
        <div className="flex flex-col-reverse xl:flex-row">
          {/* Left */}
          <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
            {/* Location Pie Chart */}
            <div className="xl:flex-[4] flex items-end w-full content-center border border-dashed border-blue-400 p-4">
              {hasChartData ? (
                <Pie data={locationData} options={{ cutout: 0 }} className="mx-auto lg:mx-0 w-full h-auto" />
              ) : (
                <div className="text-center text-gray-500 w-full">
                  <p>No location data available yet.</p>
                  <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                    {JSON.stringify(locationData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Location Legend */}
            <div className="flex items-center p-8 w-full sm:w-[400px] xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-[150px] bg-white xl:flex-1 rounded-lg">
              <img src={logo} alt="logo" className="w-auto xl:flex-1 rounded-lg" />
              <span className="w-[2px] bg-black h-full"></span>
              <div className="flex flex-col gap-3">
                {Object.entries(stats.locationStats).map(([loc, count], idx) => (
                  <p key={loc} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          locationData.datasets[0].backgroundColor[idx % locationData.datasets[0].backgroundColor.length],
                      }}
                    ></span>
                    <span>{loc} — {count} devices</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-[4] flex-col gap-7 lg:gap-7 xl:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
            <div className="flex flex-col-reverse lg:flex-row gap-7 flex-[4]">
              <div className="flex flex-col gap-7 flex-1">
                <StatCard icon={usersIcon} value={stats.totalUsers} label="Total Users Count" />
                <StatCard icon={bookIcon} value={stats.totalBooks} label="Total Device Count" />
                <StatCard icon={adminIcon} value={stats.totalAdmin} label="Total Admin Count" />
                <StatCard icon={bookIcon} value={stats.availableDevices} label="Available Devices" />
                <StatCard icon={bookIcon} value={`${stats.borrowRate}%`} label="Borrow Rate" />
                <StatCard icon={bookIcon} value={stats.overdueCount} label="Overdue Devices" />
                <StatCard icon={usersIcon} value={stats.uniqueBorrowers} label="Unique Borrowers" />
              </div>

              <div className="flex flex-col lg:flex-row flex-1">
                <div className="flex flex-col lg:flex-row flex-1 items-center justify-center">
                  <div className="bg-white p-5 rounded-lg shadow-lg h-full flex flex-col justify-center items-center gap-4">
                    <img
                      src={user && user.avatar?.url}
                      alt="avatar"
                      className="rounded-full w-32 h-32 object-cover"
                    />
                    <h2 className="text-xl 2xl:text-2xl font-semibold text-center">
                      {user && user.name}
                    </h2>
                    <p className="text-gray-600 text-sm 2xl:text-base text-center">
                      Welcome to Admin Portal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3] justify-center rounded-2xl">
              <h4 className="overflow-y-hidden">Welcome to IT Inventory.</h4>
              <p className="text-gray-700 text-sm sm:text-lg absolute right-[35px] sm:right-[78px] bottom-[10px]">
                ,, IT Team
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
    <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
      <img src={icon} alt="icon" className="w-8 h-8" />
    </span>
    <span className="w-[2px] bg-black h-20 lg:h-full"></span>
    <div className="flex flex-col items-start gap-2">
      <h4 className="font-black text-3xl">{value}</h4>
      <p className="font-light text-gray-700 text-sm">{label}</p>
    </div>
  </div>
);
export default AdminDashboard;
