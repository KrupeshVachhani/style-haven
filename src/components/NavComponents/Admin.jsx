/* eslint-disable react/prop-types */

import { useState } from "react";

const AdminDisplay = ({ data }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {data.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}
      </div>
    </div>
  );
};

const AdminCard = ({ admin }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-[#e0dbe2] p-6 rounded-lg shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div>
          )}
          <img
            src={admin.image_url}
            alt={admin.name}
            className={`w-24 h-24 rounded-full object-cover ${loading ? "hidden" : "block"}`}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              e.target.src = "/api/placeholder/96/96";
              setLoading(false);
            }}
          />
        </div>

        <h3 className="text-xl font-semibold text-black truncate w-full text-center" title={admin.name}>{admin.name}</h3>

        <div className="w-full space-y-2 text-black">
          <p className="flex justify-between">
            <span className="font-medium">Branch:</span>
            <span className="truncate ml-2" title={admin.branch}>{admin.branch}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span className="truncate ml-2" title={admin.email}>{admin.email}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Mobile:</span>
            <span className="truncate ml-2" title={admin.mobile_number}>{admin.mobile_number}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span className="truncate ml-2" title={admin.role}>{admin.role}</span>
          </p>
        </div>

        <button className="w-full py-2 px-4 bg-black text-white rounded-md hover:opacity-90 transition-opacity">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AdminDisplay;
