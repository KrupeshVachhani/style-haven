/* eslint-disable react/prop-types */
// import { useState } from "react";

const BookingDisplay = ({ data }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => {
  // const [loading, setLoading] = useState(true);

  return (
    <div className="bg-[#e0dbe2] rounded-lg shadow-lg">
      <div className="space-y-4 ">
        <div className="relative rounded-t-lg w-full p-4 text-white bg-black">
          <h3 className="text-lg font-bold">Booking Details</h3>
          <p className="opacity-90">ID: {booking.id}</p>
        </div>

        <div className="w-full space-y-2 text-black px-6">
          <Section title="Customer Information">
            <InfoRow label="Name" value={booking.customerName} />
            <InfoRow label="Phone" value={booking.customerPhone} />
            <InfoRow label="Email" value={booking.customerEmail} />
          </Section>

          <Section title="Employee Details">
            <InfoRow label="Name" value={booking.employeeName} />
            <InfoRow label="Phone" value={booking.employeePhone} />
          </Section>

          <Section title="Appointment Details">
            <InfoRow label="Branch" value={booking.branchName} />
            <InfoRow label="Date" value={booking.selectedDay} />
            <InfoRow label="Time Slot" value={booking.selectedTimeSlot} />
          </Section>

          <Section title="Services & Pricing">
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
                  <p className="font-medium text-gray-700">
                    {booking.totalTime} minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-semibold text-lg text-[#7cc6ce]">
                    ₹{booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="border-b pb-4">
    <h4 className="text-lg font-semibold mb-2 text-gray-800">{title}</h4>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <p className="flex justify-between">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="truncate ml-2 text-gray-700" title={value}>
      {value}
    </span>
  </p>
);

export default BookingDisplay;
