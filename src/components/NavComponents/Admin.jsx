import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase.config";
import { useSelector } from "react-redux";
import { MdPerson, MdDelete, MdVisibility, MdVisibilityOff } from "react-icons/md";

const AdminDisplay = () => {
  const [admins, setAdmins] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Admin"), (snapshot) => {
      const adminsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#362021] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
        >
          Add New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}
      </div>

      <AddAdminModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

const AdminCard = ({ admin }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { isSuperAdmin: isSuperAdminFromState } = useSelector(
    (state) => state.auth
  );
  const [isSuperAdmin, setIsSuperAdmin] = useState(isSuperAdminFromState);

  useEffect(() => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const superAdminStatus = authData?.isSuperAdmin === true;
      setIsSuperAdmin(superAdminStatus || isSuperAdminFromState);
    } catch (error) {
      console.error("Failed to parse auth from localStorage:", error);
      setIsSuperAdmin(isSuperAdminFromState);
    }
  }, [isSuperAdminFromState]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-[#e0dbe2] p-6 rounded-lg shadow-lg relative">
      {isSuperAdmin && (
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors"
          title="Remove Admin"
        >
          <MdDelete size={24} />
        </button>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          {admin.image_url && admin.image_url !== "/default-person.png" ? (
            <img
              src={admin.image_url}
              alt={admin.name}
              className="w-24 h-24 rounded-full object-cover"
              onLoad={() => setLoading(false)}
              onError={(e) => {
                e.target.src = "";
                setLoading(false);
              }}
            />
          ) : (
            <MdPerson className="w-24 h-24 text-gray-500 rounded-full" />
          )}
        </div>

        <h3
          className="text-xl font-semibold text-black truncate w-full text-center"
          title={admin.name}
        >
          {admin.name}
        </h3>

        <div className="w-full space-y-2 text-black">
          <p className="flex justify-between">
            <span className="font-medium">Branch:</span>
            <span className="truncate ml-2" title={admin.branch}>
              {admin.branch}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span className="truncate ml-2" title={admin.email}>
              {admin.email}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Mobile:</span>
            <span className="truncate ml-2" title={admin.phone}>
              {admin.phone}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span className="truncate ml-2" title={admin.role}>
              {admin.role}
            </span>
          </p>
          {isSuperAdmin && admin.password && (
            <p className="flex justify-between items-center">
              <span className="font-medium">Password:</span>
              <span className="flex items-center gap-2">
                <span className="truncate ml-2">
                  {showPassword ? admin.password : '••••••'}
                </span>
                <button
                  onClick={togglePasswordVisibility}
                  className="text-gray-600 hover:text-gray-800"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </span>
            </p>
          )}
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2 px-4 rounded-md hover:opacity-90 transition-opacity bg-[#362021] text-white"
          >
            Edit Details
          </button>
        )}
      </div>

      {isEditModalOpen && (
        <EditAdminModal
          admin={admin}
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteAdminModal
          admin={admin}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

const EditAdminModal = ({ admin, isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: admin.name || "",
    branch: admin.branch || "",
    email: admin.email || "",
    phone: admin.phone || "",
    role: admin.role || "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Mobile number must be 10 digits";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
        return;
      }
      setImageFile(file);
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = admin.image_url;

      if (imageFile) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, `admin_images/${fileName}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const adminRef = doc(db, "Admin", admin.id);
      const updateData = {
        ...formData,
        image_url: imageUrl,
      };

      // Only include password in update if it was changed
      if (!formData.password) {
        delete updateData.password;
      }

      await updateDoc(adminRef, updateData);
      closeModal();
    } catch (error) {
      console.error("Error updating admin:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update admin. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Admin Details
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.branch ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.branch && (
              <p className="mt-1 text-sm text-red-500">{errors.branch}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="New Password (leave empty to keep current)"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded text-gray-700"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 p-3 bg-[#362021] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteAdminModal = ({ admin, onClose }) => {
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (adminName.trim().toLowerCase() !== admin.name.trim().toLowerCase()) {
      setError("The entered name doesn't match. Please try again.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "Admin", admin.id));
      onClose();
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800"></h2>

        <div className="mb-4 text-gray-600">
          <p className="mb-2">
            To remove this admin, please type their full name:
          </p>
          <p className="font-medium">{admin.name}</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={adminName}
            onChange={(e) => {
              setAdminName(e.target.value);
              setError("");
            }}
            placeholder="Enter admin name"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 border-gray-300"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !adminName.trim()}
            className="flex-1 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Removing..." : "Remove Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddAdminModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Mobile number must be 10 digits";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
        return;
      }
      setImageFile(file);
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "/default-person.png";

      if (imageFile) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, `admin_images/${fileName}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "Admin"), {
        ...formData,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      });

      setFormData({
        name: "",
        branch: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });
      setImageFile(null);
      closeModal();
    } catch (error) {
      console.error("Error adding admin:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add admin. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Admin
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.branch ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.branch && (
              <p className="mt-1 text-sm text-red-500">{errors.branch}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded text-gray-700"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 p-3 bg-[#362021] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDisplay;
