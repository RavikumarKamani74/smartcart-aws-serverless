import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isNaN(totalAmount) || totalAmount <= 0) {
      alert('Invalid cart or total amount.');
      return;
    }

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const user = await Auth.currentAuthenticatedUser();
      const email = user.attributes?.email || 'unknown@example.com';

      const orderId = uuidv4();
      const createdAt = new Date().toISOString();

      const orderPayload = {
        orderId,
        items: cartItems,
        total: totalAmount,
        userEmail: email,
        createdAt,
        username: email
      };

      console.log('📦 Sending order payload:', orderPayload);

      const response = await axios.post(
        'https://1te556tb7i.execute-api.ap-south-2.amazonaws.com/prod/orders',
        orderPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token  // ✅ include Cognito ID token
          }
        }
      );

      console.log('✅ Order placed successfully:', response.data);
      clearCart();

      navigate('/confirmation', { state: { order: orderPayload } });

    } catch (error) {
      console.error('❌ Order placement failed:', error.response?.data || error.message);
      alert('Something went wrong while placing the order.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="mb-2">
              {item.name} x {item.quantity} = ₹{item.price * (item.quantity || 1)}
            </div>
          ))}

          <div className="font-semibold mt-4 text-lg">
            Total: ₹{totalAmount.toFixed(2)}
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
