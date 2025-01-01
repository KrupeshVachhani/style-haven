import React from "react";

const ShimmerLoader = () => {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #e28161, #7cc6ce)`,
        }}
      />

      <div className="relative z-10 animate-pulse">
        {/* Shimmer Navbar */}
        <div
          className="shadow-md bg-opacity-90 fixed z-50 px-4 md:px-10 h-16"
          style={{
            width: "90%",
            borderRadius: "12px",
            left: "50%",
            top: "1%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.5)",
            WebkitBackdropFilter: "saturate(200%) blur(1.875rem)",
          }}
        >
          <div className="max-w-7xl mx-auto z-50">
            <div className="flex justify-between h-16">
              {/* Logo Placeholder */}
              <div className="flex items-center">
                <div className="h-10 w-24 bg-gray-300 rounded-md"></div>
              </div>

              {/* Nav Buttons Placeholder */}
              <div className="hidden xl:flex items-center space-x-4">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-28 bg-gray-300 rounded-md"
                  ></div>
                ))}
              </div>

              {/* Hamburger Menu Placeholder */}
              <div className="xl:hidden flex items-center">
                <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main
          className="container mx-auto py-6"
          style={{
            paddingTop: "6rem",
          }}
        >
          {/* Section Title Shimmer */}
          <div className="px-6 mb-4">
            <div className="h-8 w-64 bg-gray-300 rounded-md"></div>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-[#e0dbe2] p-6 rounded-lg shadow-lg"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Image Shimmer */}
                  <div className="w-24 h-24 bg-gray-300 rounded-full"></div>

                  {/* Name Shimmer */}
                  <div className="w-3/4 h-6 bg-gray-300 rounded-md"></div>

                  {/* Details Shimmer */}
                  <div className="w-full space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Button Shimmer */}
                  <div className="w-full h-10 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShimmerLoader;
