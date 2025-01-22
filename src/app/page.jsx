"use client";
import React, { useState, useEffect, useRef } from "react";
import RetailShops from '../components/RetailShops';

function MainComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  useEffect(() => {
    const driverId = localStorage.getItem('driver_id');
    
    if (driverId) {
      // User is already logged in
      setIsAuthenticated(true); // You can set this flag to true, or fetch user info from API
    }
  }, []);
  

  const handleLogout = () => {
    // Clear the driver_id from localStorage
    localStorage.removeItem('driver_id');
  
    // Set authentication state to false
    setIsAuthenticated(false);
  
    // Reset form data
    setFormData({
      phone: "",
      password: "",
      name: "",
    });
  };
  

  if (isAuthenticated) {
    return (
      <Dashboard
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
        showChangePhone={showChangePhone}
        setShowChangePhone={setShowChangePhone}
      />
    );
  }

  return <Login setIsAuthenticated={setIsAuthenticated} />;
}

function Login({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = {
      mobileNumber: formData.phone,
      password: formData.password
    };

    if (isLogin) {
      try{

        const response = await fetch('https://nayanfood.in/bakery/appApi/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        // Parsing the JSON response
        const result = await response.json();
        
        // Check the response from the API
        if (result.success) {
          setIsAuthenticated(true); // If login is successful
          console.log(result.driver_id);
          localStorage.setItem('driver_id', result.driver_id);
        } else {
          setError(result.message); // If there's an error, show the message
        }
      }catch (error) {
        setError("An error occurred while connecting to the server.");
        console.error(error);
      }
    } else {
      if (formData.phone && formData.password && formData.name) {
        setIsAuthenticated(true);
      } else {
        setError("Please fill in all fields");
      }
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="bg-blue-50 h-24 relative overflow-hidden flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600 font-roboto z-10">
          DeliWheels
        </h1>
        <div className="delivery-truck absolute flex items-center gap-2">
          <i className="fas fa-truck text-3xl text-blue-600"></i>
          <div className="w-16 h-8 bg-blue-200"></div>
        </div>
      </div>
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-center mb-6 font-roboto text-gray-800">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
            )}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          {/* <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 text-sm hover:text-blue-700"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div> */}
        </div>
      </div>
      <style jsx global>{`
        @keyframes drive {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .delivery-truck {
          animation: drive 8s linear infinite;
          top: 50%;
          left: -20%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
        }

        .delivery-truck i {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}

function Dashboard({
  handleLogout,
  isDarkMode,
  setIsDarkMode,
  showChangePassword,
  setShowChangePassword,
  showChangePhone,
  setShowChangePhone,
}) {
  const [deliveries, setDeliveries] = useState([]);
  const [newDelivery, setNewDelivery] = useState({
    productName: "",
    retailStore: "",
    status: "pending",
  });
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  // Fetch deliveries data from API (dashboard.php)
  const driverId = localStorage.getItem('driver_id');
  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await fetch(`https://nayanfood.in/bakery/appApi/dashboard.php?driver_id=${driverId}`);
        const data = await response.json();
        // Check the type of 'data'
        
        // Transform data if necessary (assuming you need to map the API response structure)
        const transformedData = data.deliveries.map((delivery) => ({
          delivery_id: delivery.delivery_id,
          products: delivery.products.map((product) => ({
            product_id: product.product_id,
            product_name: product.product_name,
            product_hsn: product.product_hsn,
            product_price: product.product_price,
            product_quantity: product.updated_quantity,
            total_price: product.total_price,
          })),
          individual_total: delivery.individual_total,
        }));
        
        setDeliveries(transformedData); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    }

    fetchDeliveries();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleAddDelivery = () => {
    if (newDelivery.productName && newDelivery.retailStore) {
      setDeliveries([...deliveries, { ...newDelivery, id: Date.now() }]);
      setNewDelivery({ productName: "", retailStore: "", status: "pending" });
    }
  };

  const handleFinishDelivery = (id) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "completed" } : delivery
      )
    );
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-white"}`}
    >
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-truck text-blue-600 text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold text-blue-600 font-roboto">DeliWheels</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={settingsRef}>
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-gray-100 rounded-full focus:outline-none">
                <i className="fas fa-cog text-gray-600 text-xl"></i>
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                      <i className={`fas fa-${isDarkMode ? "sun" : "moon"} mr-2`}></i>
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button onClick={() => setShowChangePhone(true)} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                      <i className="fas fa-phone mr-2"></i>
                      Change Phone
                    </button>
                    <button onClick={() => setShowChangePassword(true)} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                      <i className="fas fa-key mr-2"></i>
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Logout</button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <i className="fas fa-box text-3xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Total Deliveries</h3>
            <p className="text-3xl font-bold text-blue-600">{deliveries.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <i className="fas fa-check-circle text-3xl text-green-600 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">
              {deliveries.filter((d) => d.status === "completed").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <i className="fas fa-clock text-3xl text-yellow-600 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {deliveries.filter((d) => d.status === "pending").length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-roboto mb-4 flex items-center">
            <i className="fas fa-plus-circle text-blue-600 mr-2"></i>
            Add New Delivery
          </h2>
          {/* <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Product Name"
              className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
              value={newDelivery.productName}
              onChange={(e) => setNewDelivery({ ...newDelivery, productName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Retail Store"
              className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
              value={newDelivery.retailStore}
              onChange={(e) => setNewDelivery({ ...newDelivery, retailStore: e.target.value })}
            />
            <button
              onClick={handleAddDelivery}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Delivery
            </button>
          </div> */}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-in">
          <h2 className="text-xl font-roboto mb-4 flex items-center">
            <i className="fas fa-list text-blue-600 mr-2"></i>
            Delivery List
          </h2>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.delivery_id} className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">
                  Delivery ID: {delivery.delivery_id} - Status:{" "}
                  <span className={`text-${delivery.status === "completed" ? "green" : "yellow"}-600`}>
                    {delivery.status}
                  </span>
                </h3>
                <div className="mt-4">
                  <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border">Product</th>
                        <th className="px-4 py-2 border">Price</th>
                        <th className="px-4 py-2 border">Quantity</th>
                        <th className="px-4 py-2 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delivery.products.map((product) => (
                        <tr key={product.product_id}>
                          <td className="px-4 py-2 border">{product.product_name}</td>
                          <td className="px-4 py-2 border">{product.product_price}</td>
                          <td className="px-4 py-2 border">{product.product_quantity}</td>
                          <td className="px-4 py-2 border">{product.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4">
                    <strong>Total: {delivery.individual_total}</strong>
                  </div>
                </div>
                {delivery.status === "pending" && (
                  <button
                    onClick={() => handleFinishDelivery(delivery.delivery_id)}
                    className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="main-content p-6">
                {/* Add RetailShops component here */}
                <RetailShops />
          </div>  
      </div>
    </div>
  );
}
export default MainComponent;