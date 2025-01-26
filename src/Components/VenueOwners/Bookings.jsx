import React from "react";

const Bookings = () => {
  return (
    <div className="order bg-white p-6 rounded-lg shadow-md">
      <div className="head flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
        <div className="flex space-x-2">
          <i className="bx bx-search text-gray-600 text-xl"></i>
          <i className="bx bx-filter text-gray-600 text-xl"></i>
        </div>
      </div>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="p-3 text-gray-600">User</th>
            <th className="p-3 text-gray-600">Date Order</th>
            <th className="p-3 text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Repeat this row for each order */}
          <tr>
            <td className="p-3 flex items-center">
              <img src="img/people.png" alt="User" className="w-8 h-8 rounded-full" />
              <p className="ml-3">John Doe</p>
            </td>
            <td className="p-3">01-10-2021</td>
            <td className="p-3">
              <span className="status completed bg-green-100 text-green-500 py-1 px-2 rounded-lg">
                Completed
              </span>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
