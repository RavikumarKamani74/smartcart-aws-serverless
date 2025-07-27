// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleRequestReset = async () => {
    try {
      await Auth.forgotPassword(email);
      alert('Verification code sent to your email.');
      setStep(2);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      alert(err.message || 'Error sending code');
    }
  };

  const handleConfirmReset = async () => {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      alert('Password reset successful! Please login again.');
      navigate('/login');
    } catch (err) {
      console.error('Error confirming password reset:', err);
      alert(err.message || 'Error resetting password');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleRequestReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Verification Code
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full mb-4 p-2 border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full mb-4 p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleConfirmReset}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
