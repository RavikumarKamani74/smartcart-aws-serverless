import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.attributes?.email) {
        console.log("User not authenticated yet.");
        setLoading(false);
        return;
      }

      const userEmail = user.attributes.email;
      const API_URL = "https://1te556tb7i.execute-api.ap-south-2.amazonaws.com/prod/orders";

      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        console.log("📦 Fetching orders for:", userEmail);

        const res = await fetch(`${API_URL}?userEmail=${encodeURIComponent(userEmail)}`, {
          headers: {
            Authorization: token
          }
        });

        const data = await res.json();
        console.log("✅ Fetched order response:", data);

        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧾 My Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No orders found.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 underline">
            Start shopping →
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="border rounded-xl p-4 mb-6 shadow-md bg-white"
          >
            <div className="mb-2">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
              <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc ml-6">
                {Array.isArray(order.items) &&
                  order.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 mt-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>
                        {item.name} × {item.quantity} — ₹{item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
