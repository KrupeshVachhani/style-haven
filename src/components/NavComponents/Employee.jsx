/* eslint-disable react/prop-types */

const EmployeeDisplay = ({ data }) => {
  // console.log(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
      {data.map((employee) => (
        <div
          key={employee.id}
          className="bg-[#e0dbe2] rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex items-center bg-[#362021] p-4">
            <img
              src={employee.imageUrl}
              alt={employee.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {employee.name}
              </h3>
              <p className="text-sm text-white opacity-90">Branch: {employee.branch}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Email</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Phone</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Age</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">{employee.age}</p>
              </div>
              <div>
                <p className="text-sm text-[rgba(97,1,1,1)]">Experience</p>
                <p className="font-medium text-[rgba(97,1,1,1)]">
                  {employee.experience} years
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeDisplay;
