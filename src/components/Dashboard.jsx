import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./Nav";
import AdminDisplay from "./NavComponents/Admin";
import BookingDisplay from "./NavComponents/Booking";
import CustomerDisplay from "./NavComponents/Customer";
import EmployeeDisplay from "./NavComponents/Employee";
import ProductsDisplay from "./NavComponents/Products";
import ServicesDisplay from "./NavComponents/Services";
import ShopBranchesDisplay from "./NavComponents/ShopBranches";
import SoldProductDisplay from "./NavComponents/SoldProduct";
import SuperAdminDisplay from "./NavComponents/SuperAdmin";

const FirebaseDataFetch = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState({});
  const [currentSection, setCurrentSection] = useState("Booking"); // Default to Booking instead of Admin
  const [availableSections, setAvailableSections] = useState([]);

  // Get auth state from Redux
  const { isAuthenticated, isSuperAdmin, isAdmin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check both Redux state and localStorage
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    const isUserAuthenticated = isAuthenticated || storedAuth?.isAuthenticated;
    const isUserSuperAdmin = isSuperAdmin || storedAuth?.isSuperAdmin;
    const isUserAdmin = isAdmin || storedAuth?.isAdmin;

    if (!isUserAuthenticated || (!isUserSuperAdmin && !isUserAdmin)) {
      navigate("/login");
      return;
    }

    // Set available sections based on role
    const baseNavItems = [
      "Booking",
      "Customer",
      "Employee",
      "Products",
      "Services",
      "Shop Branches",
      "Sold_Product",
    ];

    if (isUserSuperAdmin) {
      // Super Admin sees everything including Admin section
      setAvailableSections(["Admin", ...baseNavItems]);
    } else {
      // Regular Admin sees everything except Admin section
      setAvailableSections(baseNavItems);
    }

    const fetchAllData = async () => {
      try {
        const fetchedData = {};
        // Only fetch collections that the user has access to
        const collectionsToFetch = isUserSuperAdmin
          ? [...baseNavItems, "Admin"]
          : baseNavItems;

        for (const collectionName of collectionsToFetch) {
          try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            fetchedData[collectionName] = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          } catch (collectionError) {
            console.warn(
              `Error fetching collection ${collectionName}:`,
              collectionError
            );
            fetchedData[collectionName] = [];
          }
        }

        setAllData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [navigate, isAuthenticated, isSuperAdmin, isAdmin]);

  const handleSectionChange = (section) => {
    if (availableSections.includes(section)) {
      setCurrentSection(section);
    }
  };

  const renderSectionContent = () => {
    const sectionData = allData[currentSection] || [];

    switch (currentSection) {
      case "Admin":
        return isSuperAdmin ? <AdminDisplay data={sectionData} /> : null;
      case "Booking":
        return <BookingDisplay data={sectionData} />;
      case "Customer":
        return <CustomerDisplay data={sectionData} />;
      case "Employee":
        return <EmployeeDisplay data={sectionData} />;
      case "Products":
        return <ProductsDisplay data={sectionData} />;
      case "Services":
        return <ServicesDisplay data={sectionData} />;
      case "Shop Branches":
        return <ShopBranchesDisplay data={sectionData} />;
      case "Sold_Product":
        return <SoldProductDisplay data={sectionData} />;
      case "Super Admin":
        return isSuperAdmin ? <SuperAdminDisplay data={sectionData} /> : null;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {sectionData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden p-4"
              >
                <pre className="whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        );
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">Error loading data: {error}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading data...</div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #e28161, #7cc6ce)`,
          // filter: `brightness(50%)`,
          // zIndex: "-1", // Ensure it's behind the content
        }}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10">
        <DashboardNavbar
          onSectionChange={handleSectionChange}
          availableSections={availableSections}
        />
        <main
          className="container mx-auto py-6"
          style={{
            paddingTop: "6rem",
          }}
        >
          <h2 className="text-2xl font-bold mb-4 px-6 z-20">
            {currentSection} Dashboard
          </h2>
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default FirebaseDataFetch;
