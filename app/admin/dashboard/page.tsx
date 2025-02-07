'use client'
import ProtectedRouter from "@/app/components/protected/page";
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  cartItems: { title: string; image: string };
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
      .catch((error) => console.log("Error fetching products", error));
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
      setOrders((prevOrder) => prevOrder.filter((order) => order._id !== orderId));
      await Swal.fire("Deleted!", "The order has been deleted successfully.", "success");
    } catch (error) {
      await Swal.fire("Error!", "Something went wrong while deleting the order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();

      setOrders((prevOrder) =>
        prevOrder.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
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
          <h2 className="text-2xl font-bold text-white">
            Admin Dashboard
            </h2>
          <div className="flex space-x-4 mt-2">
            {["All", "pending", "success", "dispatch"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-red-600 font-bold" : "text-white"
                }`}
              >
                {status.charAt(0).toUpperCase()+status.slice(1)}
              </button>
            ))}
          </div>
        </nav>
        
        <div></div>
      </div>
    </ProtectedRouter>
  );
}
