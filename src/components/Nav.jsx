/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const DashboardNavbar = ({ onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Admin');

  const navItems = [
    "Admin",
    "Booking",
    "Customer",
    "Employee",
    "Products",
    "Services",
    "Shop Branches",
    "Sold_Product",
    "Super Admin"
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section);
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Style Haven</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleSectionClick(item)}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-colors duration-200 ${
                  activeSection === item
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-blue-100'
                }`}
              >
                {item.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleSectionClick(item)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === item
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-blue-100'
                }`}
              >
                {item.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;