import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    dailyCollection: 0,
    pending: 0,
    completedAccounts: 0,
    totalBalance: 0,
  });

  const COLORS = ["#22c55e", "#ef4444"]; // green, red

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/customers");
        const customers = res.data?.data || res.data || [];

        let totalCollectedToday = 0;
        let totalPending = 0;
        let completedAccounts = 0;
        let totalBalance = 0;

        const today = new Date();
        const todayDate = today.toISOString().split("T")[0]; // yyyy-mm-dd

        await Promise.all(
          customers.map(async (cust) => {
            totalBalance += cust.totalAmountGiven || 0;

            const recRes = await api.get(`/records/${cust._id}`);
            const records = recRes.data?.records || [];

            // ✅ Total received till today
            const totalReceived = records.reduce(
              (sum, r) => sum + (r.todayReceivedAmount || 0),
              0
            );

            // ✅ Today's collection only (based on createdAt)
            const todayRecords = records.filter((r) => {
              if (!r.createdAt) return false;
              const recordDate = new Date(r.createdAt)
                .toISOString()
                .split("T")[0];
              return recordDate === todayDate;
            });

            const todayCollected = todayRecords.reduce(
              (sum, r) => sum + (r.todayReceivedAmount || 0),
              0
            );
            totalCollectedToday += todayCollected;

            // ✅ Calculate pending till today
            const start = new Date(cust.startDate);
            const daysTillToday = Math.max(
              0,
              Math.ceil((today - start) / (1000 * 60 * 60 * 24)) + 1
            );

            const expectedTillToday =
              daysTillToday *
              (cust.dailyCollection || cust.todayCollection || 0);
            const pending = Math.max(0, expectedTillToday - totalReceived);
            totalPending += pending;

            if (cust.isCompleted) completedAccounts++;
          })
        );

        setStats({
          dailyCollection: totalCollectedToday,
          pending: totalPending,
          completedAccounts,
          totalBalance,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        toast.error("Failed to fetch dashboard stats");
      }
    };

    fetchStats();
  }, []);

  if (!user) return <div>Loading user...</div>;

  const data = [
    { name: "Collected Today", value: stats.dailyCollection },
    { name: "Pending Till Today", value: stats.pending },
  ];

  return (
    <div className="p-6 w-full flex flex-col h-full">
      <Toaster position="top-right" />
      {/* Stats Grid */}
      <div className="grid grid-cols-auto gap-4 font-suse-mono">
        {/* Collected Today */}
        <div className=" p-4 rounded-lg bg-green-100 dark:bg-green-900 xl:leading-20 text-lg xl:text-2xl text-green-800 dark:text-green-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
          <h3 className="font-bold text-md">Today Collection</h3>
          <p className=" font-semibold">{stats.dailyCollection}</p>
        </div>

        {/* Pending Till Today */}
        <div className=" p-4 rounded-lg bg-red-100 dark:bg-red-900 xl:leading-20 text-lg xl:text-2xl text-red-800 dark:text-red-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
          <h3 className="font-bold text-md">Pending Till Today</h3>
          <p className=" font-semibold">{stats.pending}</p>
        </div>

        {/* Total Balance (for admin only) */}
        {user.role === "admin" && (
          <div className=" p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 xl:leading-20 text-lg xl:text-2xl text-yellow-800 dark:text-yellow-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
            <h3 className="font-bold text-md">Total Balance</h3>
            <p className=" font-semibold">{stats.totalBalance}</p>
          </div>
        )}

        {/* Completed Accounts (for admin only) */}
        {user.role === "admin" && (
          <div className=" p-4 rounded-lg bg-blue-100 dark:bg-blue-900 xl:leading-20 text-lg xl:text-2xl text-blue-800 dark:text-blue-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
            <h3 className="font-bold text-md">Completed Accounts</h3>
            <p className=" font-semibold">{stats.completedAccounts}</p>
          </div>
        )}

        {/* Pie Chart included inside grid */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow hover:shadow-lg flex flex-col items-center justify-center h-[250px]">
          <p className="text-md md:text-base text-gray-500 dark:text-gray-400 mb-2">
            Collection Status
          </p>
          <div className="w-full max-w-md h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={60}
                  paddingAngle={0}
                  dataKey="value"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal" // Makes legend items in a row
                  iconType="circle" // Legend icon style
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
