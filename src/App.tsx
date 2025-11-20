import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import AddListing from './pages/AddListing';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
          </Routes>
        </Router>
      </ListingsProvider>
    </AuthProvider>
  );
}

export default App;
