import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../redux/loading";
import DashboardNavbar from "./Nav";
import AdminDisplay from "./NavComponents/Admin";
import BookingDisplay from "./NavComponents/Booking";
import CustomerDisplay from "./NavComponents/Customer";
import EmployeeDisplay from "./NavComponents/Employee";
import ProductsDisplay from "./NavComponents/Products";
import ServicesDisplay from "./NavComponents/Services";
import ShopBranchesDisplay from "./NavComponents/ShopBranches";
import SoldProductDisplay from "./NavComponents/SoldProduct";
import ShimmerLoader from "./Loader/ShimmerLoader";

const FirebaseDataFetch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState({});
  const [currentSection, setCurrentSection] = useState("Booking");
  const [availableSections, setAvailableSections] = useState([]);

  const { isAuthenticated, isSuperAdmin } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
        const isUserAuthenticated = isAuthenticated || storedAuth?.isAuthenticated;
        const isUserSuperAdmin = isSuperAdmin || storedAuth?.isSuperAdmin;

        if (!isUserAuthenticated) {
          navigate("/login");
          return;
        }

        const baseItems = [
          "Booking",
          "Customer",
          "Employee",
          "Products",
          "Services",
          "Shop Branches",
          "Sold_Product",
        ];

        const collectionsToFetch = isUserSuperAdmin
          ? ["Admin", ...baseItems]
          : baseItems;

        setAvailableSections(collectionsToFetch);

        // Set loading to true before starting Firebase fetch
        dispatch(setLoading(true));

        const fetchedData = {};
        for (const collectionName of collectionsToFetch) {
          try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            fetchedData[collectionName] = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          } catch (collectionError) {
            console.error(`Error fetching ${collectionName}:`, collectionError);
            fetchedData[collectionName] = [];
          }
        }

        setAllData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        dispatch(setLoading(false));
      }
    };

    fetchAllData();
  }, [navigate, isAuthenticated, isSuperAdmin, dispatch]);

  const handleSectionChange = (section) => {
    if (availableSections.includes(section)) {
      setCurrentSection(section);
    }
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
    return <ShimmerLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #e28161, #7cc6ce)`,
        }}
      />
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