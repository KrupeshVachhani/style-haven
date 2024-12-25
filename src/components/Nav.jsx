/* eslint-disable react/prop-types */
import { useState } from "react";
import { Menu, X } from "lucide-react";

const DashboardNavbar = ({ onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Admin");

  const navItems = [
    "Admin",
    "Booking",
    "Customer",
    "Employee",
    "Products",
    "Services",
    "Shop Branches",
    "Sold_Product",
    "Super Admin",
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section);
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <nav className="shadow-md bg-black bg-opacity-90 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Style Haven</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 overflow-x-hidden">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleSectionClick(item)}
                className={`px-3 py-2 rounded-md text-base whitespace-nowrap font-medium transition-colors duration-200 ${
                  activeSection === item
                    ? "bg-black text-white border border-white"
                    : "text-white hover:bg-black hover:bg-opacity-60 hover:border hover:border-white"
                }`}
              >
                {item.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleSectionClick(item)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === item
                    ? "bg-black text-white border border-white"
                    : "text-white hover:bg-black hover:bg-opacity-50"
                }`}
              >
                {item.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
