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
  const [currentSection, setCurrentSection] = useState("Admin");

  useEffect(() => {
    // Retrieve authentication from localStorage
    const storedAuth = JSON.parse(localStorage.getItem("auth"));

    if (
      !storedAuth ||
      !storedAuth.isAuthenticated ||
      (!storedAuth.isSuperAdmin && !storedAuth.isAdmin) // Check for both roles
    ) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        const knownCollections = [
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

        const fetchedData = {};
        for (const collectionName of knownCollections) {
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
  }, [navigate]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const renderSectionContent = () => {
    const sectionData = allData[currentSection] || [];

    switch (currentSection) {
      case "Admin":
        return <AdminDisplay data={sectionData} />;
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
        return <SuperAdminDisplay data={sectionData} />;
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
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, #e28161, #7cc6ce)`,
      }}
    >
      <DashboardNavbar onSectionChange={handleSectionChange} />
      <main
        className="container mx-auto py-6"
        style={{
          paddingTop: "6rem", // Adjust this value to match the navbar height
        }}
      >
        <h2 className="text-2xl font-bold mb-4 px-6">
          {currentSection} Dashboard
        </h2>
        {renderSectionContent()}
      </main>
    </div>
  );
};

export default FirebaseDataFetch;
