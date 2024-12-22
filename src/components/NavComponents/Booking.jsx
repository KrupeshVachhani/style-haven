/* eslint-disable react/prop-types */
// BookingDisplay.jsx
const BookingDisplay = ({ data }) => {
    console.log(data);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {data.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-blue-500 p-4">
              <h3 className="text-xl font-semibold text-white">Booking Details</h3>
              <p className="text-white opacity-90">ID: {booking.id}</p>
            </div>
  
            <div className="p-6 space-y-4">
              {/* Customer Information */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-700">{booking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-700">{booking.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-700">{booking.CustomerEmail}</p>
                  </div>
                </div>
              </div>
  
              {/* Employee Information */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Employee Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-700">{booking.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-700">{booking.employeePhone}</p>
                  </div>
                </div>
              </div>
  
              {/* Appointment Details */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Appointment Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="font-medium text-gray-700">{booking.branchName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-700">{booking.selectedDay}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-medium text-gray-700">{booking.selectedTimeSlot}</p>
                  </div>
                </div>
              </div>
  
              {/* Services and Pricing */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  Services & Pricing
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Selected Services</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {booking.selectedServices.map((service, index) => (
                        <li key={index} className="font-medium">
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Time</p>
                      <p className="font-medium text-gray-700">{booking.totalTime} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-semibold text-lg text-blue-600">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default BookingDisplay;
  