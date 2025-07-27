import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports'; // or './awsConfig' if you renamed

// 👇 CRITICAL: configure Amplify here
Amplify.configure(awsConfig);

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function RootWrapper() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RootWrapper />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
