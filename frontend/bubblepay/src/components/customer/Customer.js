import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { 
  API_URL,
  API_KEY,
  SERVICE_ID
} from '../../Constants';
import { isValidEmail } from '../../Utils';

const Customer = () => {
  const [action, setAction] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleActionChange = (event) => {
    setAction(event.target.value);
    setMessage('');
    setInputValue('');
    setOtpInput('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (action === 'dropoff') {
      try {
        if(!isValidEmail(inputValue)) {
          throw new Error('Enter a valid email')
        } 
        const response = await fetch(`${API_URL}/drop_off.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: inputValue }),
        });
        const data = await response.json();
        if (response.status === 200) {
          const templateParams = {
            to_email: inputValue,
            message: `Your OTP is: ${data.otp}`
          };

          emailjs.send(SERVICE_ID, 'template_nijfmtl', templateParams, API_KEY)
            .then((response) => {
              console.log('Email sent:', response.status);
            }, (error) => {
              console.error('Email sending failed:', error);
            });
          setMessage("OTP sent sucessfully");
          showMessageAndClearForm();
        }
        else if (response.status === 500) {
          setIsError(true);
          setMessage("Internal Server Error");
          showMessageAndClearForm();
        }
      } catch (error) {
        setIsError(true);
        setMessage(error.message);
        showMessageAndClearForm();
      }
    } else if (action === 'pickup') {
      try {
        const response = await fetch(`${API_URL}/pickup.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: otpInput }),
        });
        if (response.status === 200) {
          setMessage('Order picked up successfully!');
          showMessageAndClearForm();
        }
        else if (response.status === 202) {
          const data = await response.json();
          setIsError(true);
          setMessage(data.error);
          showMessageAndClearForm();
        } else if (response.status === 400) {
          const data = await response.json();
          setIsError(true);
          setMessage(data.error);
          showMessageAndClearForm();
        } else {
          const data = await response.json();
          setIsError(true);
          setMessage(data.error);
          showMessageAndClearForm();
        }
      } catch (error) {
        console.error('Error picking up:', error);
        setMessage('Error picking up. Please try again.');
        showMessageAndClearForm();
      }
    }
  };

  const showMessageAndClearForm = () => {
    setTimeout(() => {
      setMessage('');
      setIsError(false);
      setInputValue('');
      setOtpInput('');
    }, 30000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to BubblePay!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Action:
              <select
                value={action}
                onChange={handleActionChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">Select</option>
                <option value="dropoff">Drop Off</option>
                <option value="pickup">Pick Up</option>
              </select>
            </label>
          </div>
          {action === 'dropoff' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter Phone Number or Email:
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </label>
            </div>
          )}
          {action === 'pickup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter OTP:
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
        <div className="flex items-center pt-5">
          <div className={`${isError ? 'text-red-500' : 'text-green-500'}  text-xl animate-fade-in-and-out flex items-center`}>
            {message && (isError ? '✕' : '✓')}
          </div>
          {message && <div className="ml-2 text-lg">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Customer;