import React, { useState } from "react";

function Find100ThDay() {
  const [days, setDays] = useState(36);
  const [date, setDate] = useState("");
  const [resultDate, setResultDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date first!");
      return;
    }

    // Convert string date → Date object
    const startDate = new Date(date);

    // Add days
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + Number(days));

    // Format the result
    const formattedDate = newDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setResultDate(formattedDate);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 font-suse-mono text-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-red-400 rounded-xl px-6 py-10">
        <form
          className="space-y-4 w-full max-w-md mx-auto p-6 border border-gray-400 rounded-xl"
          onSubmit={handleSubmit}
        >
          {/* Days */}
          <div className="flex flex-col">
            <label
              htmlFor="ic_days"
              className="font-semibold mb-1 flex items-center gap-2"
            >
              Days
              <span className="w-5 h-5 text-center rounded-full text-sm text-white bg-gray-400">
                i
              </span>
            </label>
            <input
              type="number"
              id="ic_days"
              name="ic_days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              max={99999999}
              step="any"
              className="border border-gray-300 rounded-2xl p-3 w-full focus:outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label
              htmlFor="ic_date"
              className="font-semibold mb-1 flex items-center gap-2"
            >
              Today Date
              <span className="w-5 h-5 text-center rounded-full text-sm text-white bg-gray-400">
                i
              </span>
            </label>
            <input
              type="date"
              id="ic_date"
              name="ic_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-2xl p-3 w-full focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div>
            <input
              type="submit"
              value="Calculate"
              className="bg-red-600/85 text-white px-5 py-3 rounded-2xl hover:bg-red-900 cursor-pointer transition-all duration-500"
            />
          </div>
        </form>

        <div className="day flex flex-col mt-8 p-4 border border-gray-300 rounded-lg">
          <p className="text-center font-semibold py-2 font-suse-mono text-xl">
            Date:
          </p>
          <p className="text-center font-semibold py-2 font-suse-mono text-xl">
            {resultDate
              ? resultDate
              : "Select a date and click Calculate"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Find100ThDay;
