'use client'
import ProtectedRouter from "@/app/components/protected/page";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  address: string;
  city: string;
  province: string;
  zipCode: number;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { title: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type=="order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          province,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]->{
          title,
          image}
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("Error fetching orders", error));
  }, []);

  const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      await Swal.fire("Deleted!", "The order has been deleted successfully.", "success");
    } catch (error) {
      await Swal.fire("Error!", "Something went wrong while deleting the order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );

      if (newStatus === "dispatch") {
        await Swal.fire("Order Dispatched", "Your order has been dispatched", "success");
      }
    } catch (error) {
      await Swal.fire("Error", "Failed to change status", "error");
    }
  };

  return (
    <ProtectedRouter>
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4 mt-2">
            {["All", "pending", "success", "dispatch"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-red-600 font-bold" : "text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="bg-white rounded-lg shadow-sm p-4 text-lg font-semibold">Orders</h2>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md overflow-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Id</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-red-100 transition-all"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="border p-2">{order._id}</td>
                      <td className="border p-2">{order.firstName} {order.lastName}</td>
                      <td className="border p-2">{order.address}</td>
                      <td className="border p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="border p-2">${order.total}</td>
                      <td className="border p-2">
                        <select
                          value={order.status || ""}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="dispatch">Dispatched</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {selectedOrderId === order._id && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 p-4 transition-all">
                          <h3 className="font-bold">Order Details</h3>
                          <p>Phone: <strong>{order.phone}</strong></p>
                          <p>Email: <strong>{order.email}</strong></p>
                          <p>City: <strong>{order.city}</strong></p>
                          <h4 className="font-semibold mt-2">Items:</h4>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={index} className="flex items-center  gap-2 space-x-4 mt-2">
                                <Image
                                  src={urlFor(item.image).url()}
                                  alt={item.title}
                                  width={100}
                                  height={100}
                                  className="rounded-lg"
                                />
                                <span>{item.title}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRouter>
  );
}
