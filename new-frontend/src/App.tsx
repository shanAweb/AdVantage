import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import Layout from '@/components/Layout'
// import AutoLogin from '@/components/AutoLogin' // Disabled for production
import HomePage from '@/pages/HomePage'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import CampaignsPage from '@/pages/CampaignsPage'
import FeedsPage from '@/pages/FeedsPage'
import NewCampaignsPage from '@/pages/NewCampaignsPage'
import AdsPage from '@/pages/AdsPage'
import ProductsPage from '@/pages/ProductsPage'
import SeoPage from '@/pages/SeoPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <AuthProvider>
          {/* <AutoLogin /> Disabled for production */}
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
              <Route path="/dashboard/campaigns" element={<Layout><CampaignsPage /></Layout>} />
              <Route path="/dashboard/feeds" element={<Layout><FeedsPage /></Layout>} />
              <Route path="/dashboard/products" element={<Layout><ProductsPage /></Layout>} />
              <Route path="/dashboard/new-campaigns" element={<Layout><NewCampaignsPage /></Layout>} />
              <Route path="/dashboard/ads" element={<Layout><AdsPage /></Layout>} />
              <Route path="/dashboard/seo" element={<Layout><SeoPage /></Layout>} />
              <Route path="/dashboard/settings" element={<Layout><SettingsPage /></Layout>} />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
