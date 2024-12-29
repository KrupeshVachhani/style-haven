/* eslint-disable react/prop-types */
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
  return (
    <div className="bg-[#e0dbe2] rounded-lg shadow-lg z-20">
      <div className="space-y-4">
        <div
          className="relative rounded-t-lg w-full p-4 text-white bg-[#362021]"
        >
          <h3
            className="text-lg font-extrabold text-white"
          >
            Booking Details
          </h3>
          <p className="opacity-90">ID: {booking.id}</p>
        </div>

        <div className="w-full space-y-2 text-[rgba(97,1,1,1)] px-6">
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
                <p className="text-sm">Selected Services</p>
                <ul className="list-disc list-inside">
                  {booking.selectedServices.map((service, index) => (
                    <li key={index} className="font-medium">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <div>
                  <p className="text-sm">Total Time</p>
                  <p className="font-medium">{booking.totalTime} minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Total Price</p>
                  <p className="font-semibold text-lg">₹{booking.totalPrice}</p>
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
    <h4 className="text-lg font-semibold mb-2 text-[rgba(97,1,1,1)]">
      {title}
    </h4>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <p className="flex justify-between">
    <span className="font-medium text-[rgba(97,1,1,1)]">{label}:</span>
    <span className="truncate ml-2 text-[rgba(97,1,1,1)]" title={value}>
      {value}
    </span>
  </p>
);

export default BookingDisplay;
