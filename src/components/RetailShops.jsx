import { useEffect, useState } from 'react';
import { BASE_URL } from '../config/api'; // Import BASE_URL from api.js

const RetailShops = () => {
    const [shops, setShops] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        mobile_no: '',
        debt_amount: '',
        owner_name: ''
    });
    const [editShopId, setEditShopId] = useState(null);

    // Fetch retail shops from API
    useEffect(() => {
        fetch(`${BASE_URL}/retail_shop/get_shops.php`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Convert to JSON
            })
            .then((data) => {
                if (data && data.shops) {
                    console.log("hellow worlds");
                    console.log(data)
                    setShops(data.shops); // Set the shops state if data is valid
                } else {
                    console.error('Invalid data structure:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching retail shops:', error);
            });
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submit (Create/Update)
    const handleSubmit = (e) => {
        e.preventDefault();

        const method = editShopId ? 'PUT' : 'POST';
        const url = editShopId ? `${BASE_URL}/retail_shop/update_shop.php` : `${BASE_URL}/retail_shop/create_shop.php`;

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setShops((prev) => {
                        if (editShopId) {
                            return prev.map((shop) =>
                                shop.id === editShopId ? data.shop : shop
                            );
                        }
                        return [...prev, data.shop];
                    });
                    resetForm();
                }
            })
            .catch((error) => console.error('Error submitting form:', error));
    };

    // Handle edit
    const handleEdit = (shop) => {
        setFormData({
            name: shop.name,
            address: shop.address,
            mobile_no: shop.mobile_no,
            debt_amount: shop.debt_amount,
            owner_name: shop.owner_name
        });
        setEditShopId(shop.id);
    };

    // Handle delete
    const handleDelete = (id) => {
        fetch(`${BASE_URL}/retail_shop/delete_shop.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log("hellow rodl")
                    setShops((prev) => prev.filter((shop) => shop.id !== id));
                }
            })
            .catch((error) => console.error('Error deleting shop:', error));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            mobile_no: '',
            debt_amount: '',
            owner_name: ''
        });
        setEditShopId(null);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Retail Shops</h2>

            <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-lg font-semibold">Shop Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold">Mobile No</label>
                            <input
                                type="text"
                                name="mobile_no"
                                value={formData.mobile_no}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold">Debt Amount</label>
                            <input
                                type="number"
                                name="debt_amount"
                                value={formData.debt_amount}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold">Owner Name</label>
                            <input
                                type="text"
                                name="owner_name"
                                value={formData.owner_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex justify-between gap-4">
                            <button
                                type="submit"
                                className="w-full md:w-1/2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                {editShopId ? 'Update Shop' : 'Add Shop'}
                            </button>
                            {editShopId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full md:w-1/2 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition duration-300"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <h3 className="text-2xl font-semibold text-center mt-8 mb-4">Retail Shops List</h3>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">Mobile No</th>
                            <th className="px-4 py-2">Debt Amount</th>
                            <th className="px-4 py-2">Owner Name</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.map((shop) => (
                            <tr key={shop.id} className="border-t">
                                <td className="px-4 py-2">{shop.name}</td>
                                <td className="px-4 py-2">{shop.address}</td>
                                <td className="px-4 py-2">{shop.mobile_no}</td>
                                <td className="px-4 py-2">{shop.debt_amount}</td>
                                <td className="px-4 py-2">{shop.owner_name}</td>
                                <td className="px-4 py-2 flex justify-start space-x-2">
                                    <button
                                        onClick={() => handleEdit(shop)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shop.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RetailShops;
