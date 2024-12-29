import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/SuperAdminAuthSlice";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ onSectionChange, availableSections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Booking"); // Default to Booking
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get full auth state from Redux
  const { isAuthenticated, isSuperAdmin, isAdmin } = useSelector(
    (state) => state.auth
  );

  // Check auth on mount and redirect if needed
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    const isUserAuthenticated = isAuthenticated || storedAuth?.isAuthenticated;

    if (!isUserAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Initialize navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      "Booking",
      "Customer",
      "Employee",
      "Products",
      "Services",
      "Shop Branches",
      "Sold_Product",
    ];

    // Show Admin section only to Super Admins
    return isSuperAdmin ? ["Admin", ...baseItems] : baseItems;
  };

  const handleSectionClick = (section) => {
    // Only allow clicking sections the user has access to
    if (!isSuperAdmin && section === "Admin") {
      return;
    }

    setActiveSection(section);
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("userData");

      // Dispatch logout action to clear Redux state
      await dispatch(logout());

      // Force reload to clear any remaining state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to redirect even if there's an error
      navigate("/login");
    }
  };

  const renderNavButtons = () => {
    const navItems = availableSections || getNavItems();

    return navItems.map((item) => (
      <button
        key={item}
        onClick={() => handleSectionClick(item)}
        className={`px-3 py-2 rounded-md text-base whitespace-nowrap font-medium transition-colors duration-200 
          ${
            activeSection === item
              ? "bg-black text-white border border-white"
              : "text-white hover:bg-black hover:bg-opacity-60 hover:border hover:border-white"
          }
          ${!isSuperAdmin && item === "Admin" ? "hidden" : ""}
        `}
      >
        {item.replace("_", " ")}
      </button>
    ));
  };

  const renderUserInfo = () => {
    if (!isAuthenticated) return null;

    return (
      <div className="text-white mr-4 hidden lg:block">
        <span className="text-sm">
          {isSuperAdmin ? "Super Admin" : "Admin"}
        </span>
      </div>
    );
  };

  return (
    <nav
      className="shadow-md bg-opacity-90 fixed z-50"
      style={{
        width: "90%",
        borderRadius: "12px",
        left: "50%",
        top:"1%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0,0.5)",
        WebkitBackdropFilter: "saturate(200%) blur(1.875rem);",
      }}
    >
      <div className="max-w-7xl px-4 mx-auto z-50">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Style Haven</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {renderUserInfo()}
            {renderNavButtons()}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
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
            {renderUserInfo()}
            {renderNavButtons()}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
