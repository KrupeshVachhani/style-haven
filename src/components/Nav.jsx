import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/SuperAdminAuthSlice";
import { setLoading } from "../redux/loading";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import logo from "./Logo.png";
import ShimmerLoader from "./Loader/ShimmerLoader";

const DashboardNavbar = ({ onSectionChange, availableSections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Booking");
  const [localAuth, setLocalAuth] = useState(false);
  const [localSuperAdmin, setLocalSuperAdmin] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isSuperAdmin } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        const userEmail = userData.email;

        const db = getFirestore();
        const adminsRef = collection(db, "admins");
        const querySnapshot = await getDocs(adminsRef);

        const isAdmin = querySnapshot.docs.some(
          (doc) => doc.data().email === userEmail
        );

        const isUserAuthenticated = isAuthenticated || storedAuth?.isAuthenticated;
        const isUserSuperAdmin = isSuperAdmin || storedAuth?.isSuperAdmin || isAdmin;

        setLocalAuth(isUserAuthenticated);
        setLocalSuperAdmin(isUserSuperAdmin);

        // Only redirect to Admin section on initial load for super admins
        if (isUserSuperAdmin && !initialCheckDone) {
          setActiveSection("Admin");
          onSectionChange("Admin");
          setInitialCheckDone(true);
        }

        if (!isUserAuthenticated) {
          navigate("/login");
        }

        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/login");
      }
    };

    if (!initialCheckDone) {
      checkAdminStatus();
    }
  }, [isAuthenticated, isSuperAdmin, navigate, onSectionChange, dispatch, initialCheckDone]);

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

    return localSuperAdmin ? ["Admin", ...baseItems] : baseItems;
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("userData");
      setLocalAuth(false);
      setLocalSuperAdmin(false);
      await dispatch(logout());
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const renderNavButtons = () => {
    const navItems = availableSections || getNavItems();

    return navItems.map((item) => {
      if (item === "Admin" && !localSuperAdmin) {
        return null;
      }

      return (
        <button
          key={item}
          onClick={() => handleSectionClick(item)}
          disabled={isLoading}
          className={`px-3 py-2 rounded-md text-base whitespace-nowrap font-medium transition-colors duration-200 
            ${
              activeSection === item
                ? "bg-[#362021] text-white border border-white"
                : "text-white hover:bg-black hover:bg-opacity-60 hover:border hover:border-white"
            }
            ${isOpen ? "w-full text-left" : ""}
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {item.replace("_", " ")}
        </button>
      );
    });
  };

  if (isLoading) {
    return <ShimmerLoader />;
  }

  return (
    <nav
      className={`shadow-md bg-opacity-90 fixed z-50 px-4 md:px-10 transition-all duration-300
        ${isOpen ? "h-auto" : "h-16"}`}
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
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
          </div>

          <div className="hidden xl:flex items-center space-x-4">
            {renderNavButtons()}
            {localAuth && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden overflow-hidden transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-2 flex flex-col">
            {renderNavButtons()}
            {localAuth && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
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