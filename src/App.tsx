import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { BrandCampaignsProvider } from './context/BrandCampaignsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import AddListing from './pages/AddListing';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import EditCampaign from './pages/EditCampaign';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <BrandCampaignsProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/add-listing" element={<AddListing />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<CampaignDetail />} />
                <Route path="/edit-campaign/:id" element={<EditCampaign />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
              </Route>
            </Routes>
          </Router>
        </BrandCampaignsProvider>
      </ListingsProvider>
    </AuthProvider>
  );
}

export default App;
