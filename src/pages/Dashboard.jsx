
import { useEffect, useState } from "react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Chart from "./Chart";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    todayCollection: 0,
    totalBalance: 0,
    totalPending: 0,
    completedAccounts: 0,
  });


  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await api.get("/dashboard/totals");
        const customers = await api.get("/customers");
        setData(
        {  ...res.data,
          completedAccounts:customers.data.data.filter((c) => c.isCompleted)
            .length}
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchTotals();
  }, []);

  const chartData = [
    { name: "Today Collection", value: data.todayCollection },
    { name: "Pending Till Today", value: data.totalPending },
  ];

  return (
    <div className="p-6 w-full flex flex-col h-full">
      <div className="grid grid-cols-auto gap-4 font-suse-mono">
        <div className=" p-4 rounded-lg bg-green-100 dark:bg-green-900 xl:leading-20 text-lg xl:text-2xl text-green-800 dark:text-green-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
          <h3>Today Collection</h3>
          <p>{data.todayCollection}</p>
        </div>
        <div className=" p-4 rounded-lg bg-red-100 dark:bg-red-900 xl:leading-20 text-lg xl:text-2xl text-red-800 dark:text-red-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
          <h3>Pending Till Today</h3>
          <p>{data.totalPending}</p>
        </div>

        {/* Total Balance (for admin only) */}
        {user.role === "admin" && (
          <div className=" p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 xl:leading-20 text-lg xl:text-2xl text-yellow-800 dark:text-yellow-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
            <h3>Total Balance</h3>
            <p>{data.totalBalance}</p>
          </div>
        )}
        {/* Completed Accounts (for admin only) */}
        {user.role === "admin" && (
          <div className=" p-4 rounded-lg bg-blue-100 dark:bg-blue-900 xl:leading-20 text-lg xl:text-2xl text-blue-800 dark:text-blue-200 flex flex-col justify-center items-center h-[100px] lg:h-[250px] ">
            <h3>Completed Accounts</h3>
            <p>{data.completedAccounts}</p>
          </div>
        )}

        {/* Chart */}
        <Chart chartData={chartData} />
      </div>
    </div>
  );
}
