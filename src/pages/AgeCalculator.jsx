
import React, { useState } from "react";

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!birthDate) {
      alert("Please select your birth date!");
      return;
    }

    const today = new Date();
    const birth = new Date(birthDate);

    // Calculate difference
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    // Adjust if negative days or months
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const formatted = `${years} Years, ${months > 1 ? months + " Months" : "1 Month"}, ${days > 1 ? days + " Days" : "1 Day"}`;
    setResult(formatted);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 font-suse-mono text-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-red-400 rounded-xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-md mx-auto p-6 border border-gray-400 rounded-xl"
        >
          {/* Birth Date */}
          <div className="flex flex-col">
            <label
              htmlFor="birth_date"
              className="font-semibold mb-1 flex items-center gap-2"
            >
              Birth Date
              <span className="w-5 h-5 text-center rounded-full text-sm text-white bg-gray-400">
                i
              </span>
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border border-gray-300 rounded-2xl p-3 w-full focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div>
            <input
              type="submit"
              value="Calculate Age"
              className="bg-red-600/85 text-white px-5 py-3 rounded-2xl hover:bg-red-900 cursor-pointer w-full"
            />
          </div>
        </form>

        <div className="day flex flex-col mt-8 p-4 border border-gray-300 rounded-lg">
          <p className="text-center font-semibold py-2 font-suse-mono text-xl">
            Your Age:
          </p>
          <p className="text-center font-semibold py-2 font-suse-mono text-xl">
            {result
              ? result
              : "Please enter your birth date and click Calculate"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgeCalculator;
