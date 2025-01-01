/* eslint-disable react/prop-types */

const CustomerDisplay = ({ data }) => {
  // console.log(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
      {data.map((customer) => (
        <div
          key={customer.id}
          className="bg-[#e0dbe2] rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex items-center bg-[#362021] p-4">
            <img
              src={customer.image_url}
              alt={customer.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {customer.name}
              </h3>
              <p className="text-sm text-white opacity-90">{customer.role}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Email</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Mobile Number</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">
                  {customer.mobile_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Customer ID</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">{customer.id}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerDisplay;
