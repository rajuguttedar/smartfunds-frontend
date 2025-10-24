import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ chartData }) => {
  // Memoize chart data to avoid unnecessary re-renders
  const memoizedData = useMemo(() => chartData, [chartData]);
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="lg:col-span-2 bg-white shadow-2xl p-2 rounded-lg flex flex-col items-center justify-center h-[250px]">
      <p className="text-gray-950 font-semibold mb-2">Collection Status</p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={memoizedData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={36}
            outerRadius={60}
            label
          >
            {memoizedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
