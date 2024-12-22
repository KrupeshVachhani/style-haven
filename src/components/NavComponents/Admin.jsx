/* eslint-disable react/prop-types */
// AdminDisplay.jsx
const AdminDisplay = ({ data }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {data.map((admin) => (
          <div
            key={admin.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={admin.image_url || "/api/placeholder/96/96"}
                  alt={admin.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/96/96";
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {admin.name}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Branch:</span> {admin.branch}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span> {admin.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Mobile:</span>{" "}
                  {admin.mobile_number}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Role:</span>{" "}
                  <span className="capitalize">{admin.role}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default AdminDisplay;