import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { 
  API_URL,
  API_KEY,
  SERVICE_ID
} from '../../Constants';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [message, setMessage] = useState('');

  // Method to get orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/get_orders.php`);
      const data = await response.json();
      setOrders(data);
      const initialStatusMap = {};
      data.forEach((order) => {
        initialStatusMap[order.id] = order.order_status;
      });
      setStatusMap(initialStatusMap);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    const newStatus = statusMap[orderId];
    try {
      const response = await fetch(`${API_URL}/status_update.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (response.status === 200) {
        let email;
        orders.forEach((order) => {
          if (order.id === orderId) {
            email = order.email;
          }
        });
        const templateParams = {
          to_email: email,
          message: `Your order is ${newStatus}`
        };

        //send email on status change
        emailjs.send(SERVICE_ID, 'template_5t0qsoj', templateParams, API_KEY)
          .then((response) => {
            console.log('Email sent:', response.status);
          }, (error) => {
            console.error('Email sending failed:', error);
          });

        setMessage(`Order ${orderId} status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Error updating status. Please try again.');
    }
  };

  // Render options based on order status
  const renderActionDropdown = (order) => {
    let content;
    let options;

    if (order.order_status === 'picked') {
      content = (
        <div className="flex items-center space-x-2">
          <span className="text-green-500">Picked</span>
        </div>
      );
    } else {
      switch (order.order_status) {
        case 'received':
          options = (
            <>
              <option value="received">Received</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
            </>
          );
          break;
        case 'processing':
          options = (
            <>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
            </>
          );
          break;
        case 'ready':
          options = (
            <>
              <option value="ready">Ready</option>
            </>
          );
          break;
        default:
          options = null;
      }

      content = (
        <div className="flex items-center space-x-2">
          <select
            value={statusMap[order.id] || order.order_status} // Use statusMap value if exists, otherwise default to order status
            onChange={(e) => {
              const newStatusMap = { ...statusMap, [order.id]: e.target.value };
              setStatusMap(newStatusMap);
            }}
            className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            {options}
          </select>
          <button
            onClick={() => handleStatusChange(order.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      );
    }
    return (
      <td className="px-6 py-4 whitespace-nowrap">
        {content}
      </td>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OTP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.otp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.order_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {renderActionDropdown(order)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Admin;