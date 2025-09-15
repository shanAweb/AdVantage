import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, User, Bell, Shield, CreditCard, Globe, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * Settings page component
 * User account and application settings
 */
export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  /**
   * Handle settings actions
   */
  const handleEditProfile = () => {
    toast.success('Opening profile editor...')
    // TODO: Implement profile editing modal
  }

  const handleManageNotifications = () => {
    toast.success('Opening notification settings...')
    // TODO: Implement notification management modal
  }

  const handleSecuritySettings = () => {
    toast.success('Opening security settings...')
    // TODO: Implement security settings modal
  }

  const handleManageBilling = () => {
    toast.success('Opening billing management...')
    // TODO: Implement billing management modal
  }

  const handleManageIntegrations = () => {
    toast.success('Opening integrations management...')
    // TODO: Implement integrations management modal
  }

  const handleManageApiKeys = () => {
    toast.success('Opening API keys management...')
    // TODO: Implement API keys management modal
  }

  const handleChangePassword = () => {
    toast.success('Opening password change form...')
    // TODO: Implement password change modal
  }

  const handleUpdateProfile = () => {
    toast.success('Opening profile update form...')
    // TODO: Implement profile update modal
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Account Settings */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-blue-600" />
              <CardTitle>Account Settings</CardTitle>
            </div>
            <CardDescription>
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Email:</span> {user?.email || 'Not available'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Name:</span> {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Not set'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Plan:</span> {user?.subscription?.plan || 'Free'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-green-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email notifications</span>
                <Badge variant={user?.emailNotifications !== false ? 'default' : 'secondary'}>
                  {user?.emailNotifications !== false ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Campaign alerts</span>
                <Badge variant={user?.campaignAlerts !== false ? 'default' : 'secondary'}>
                  {user?.campaignAlerts !== false ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekly reports</span>
                <Badge variant={user?.weeklyReports === true ? 'default' : 'secondary'}>
                  {user?.weeklyReports === true ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={handleManageNotifications}>
              Manage Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-factor auth</span>
                <Badge variant={user?.twoFactorEnabled === true ? 'default' : 'secondary'}>
                  {user?.twoFactorEnabled === true ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Password</span>
                <Badge variant="default">Strong</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last login</span>
                <span className="text-xs text-gray-500">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Unknown'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button className="flex-1" variant="outline" onClick={handleSecuritySettings}>
                Security Settings
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-purple-600" />
              <CardTitle>Billing & Plans</CardTitle>
            </div>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Current plan:</span> {user?.subscription?.plan || 'Free'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Next billing:</span> {user?.subscription?.nextBillingDate ? new Date(user.subscription.nextBillingDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Amount:</span> ${user?.subscription?.amount || '0'}/month
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={handleManageBilling}>
              Manage Billing
            </Button>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-orange-600" />
              <CardTitle>Integrations</CardTitle>
            </div>
            <CardDescription>
              Connect with external services and platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Ads</span>
                <Badge variant={user?.integrations?.googleAds === true ? 'default' : 'secondary'}>
                  {user?.integrations?.googleAds === true ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Microsoft Ads</span>
                <Badge variant={user?.integrations?.microsoftAds === true ? 'default' : 'secondary'}>
                  {user?.integrations?.microsoftAds === true ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analytics</span>
                <Badge variant={user?.integrations?.analytics === true ? 'default' : 'secondary'}>
                  {user?.integrations?.analytics === true ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={handleManageIntegrations}>
              Manage Integrations
            </Button>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Key className="h-6 w-6 text-gray-600" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <CardDescription>
              Manage your API keys and access tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Active keys:</span> {user?.apiKeys?.activeCount || 0}
              </div>
              <div className="text-sm">
                <span className="font-medium">Last used:</span> {user?.apiKeys?.lastUsed ? new Date(user.apiKeys.lastUsed).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Rate limit:</span> {user?.apiKeys?.rateLimit || '1000'}/hour
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={handleManageApiKeys}>
              Manage API Keys
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common settings and account management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={handleUpdateProfile}>
              <User className="h-6 w-6 mb-2" />
              Update Profile
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={handleChangePassword}>
              <Shield className="h-6 w-6 mb-2" />
              Change Password
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={handleManageNotifications}>
              <Bell className="h-6 w-6 mb-2" />
              Notification Settings
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={handleManageBilling}>
              <CreditCard className="h-6 w-6 mb-2" />
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

