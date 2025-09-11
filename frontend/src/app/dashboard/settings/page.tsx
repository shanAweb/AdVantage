'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Key,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
  Settings as SettingsIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Settings page component
 * Manages user account and application settings
 */
export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [showIntegrationModal, setShowIntegrationModal] = useState<number | null>(null)
  const [show2FAModal, setShow2FAModal] = useState(false)

  /**
   * Handle button clicks with dummy functionality
   */
  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!')
  }

  const handleManageBilling = () => {
    setShowBillingModal(true)
    toast.success('Opening billing management...')
  }

  const handleToggleNotification = (type: string, category: string) => {
    toast.success(`${type} ${category} notification ${Math.random() > 0.5 ? 'enabled' : 'disabled'}!`)
  }

  const handleConnectIntegration = (integrationId: number) => {
    setShowIntegrationModal(integrationId)
    toast.success('Opening integration setup...')
  }

  const handleManageIntegration = (integrationId: number) => {
    toast.success('Opening integration management...')
  }

  const handleUpdatePassword = () => {
    toast.success('Password updated successfully!')
  }

  const handleEnable2FA = (type: string) => {
    setShow2FAModal(true)
    toast.success(`Setting up ${type}...`)
  }

  /**
   * Mock user data
   * In a real app, this would come from the auth context
   */
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Inc.',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    plan: 'Pro',
    planStatus: 'active',
    planExpiry: '2024-12-31',
  }

  /**
   * Mock notification settings
   */
  const notificationSettings = {
    email: {
      campaignUpdates: true,
      performanceAlerts: true,
      billingNotifications: true,
      securityAlerts: true,
      weeklyReports: false,
    },
    push: {
      campaignUpdates: false,
      performanceAlerts: true,
      billingNotifications: true,
      securityAlerts: true,
    },
    sms: {
      securityAlerts: true,
      billingNotifications: false,
    }
  }

  /**
   * Mock integrations
   */
  const integrations = [
    {
      id: 1,
      name: 'Google Ads',
      status: 'connected',
      lastSync: '2024-09-06T10:30:00Z',
      description: 'Manage your Google Ads campaigns',
    },
    {
      id: 2,
      name: 'Google Analytics',
      status: 'connected',
      lastSync: '2024-09-06T10:30:00Z',
      description: 'Track website performance',
    },
    {
      id: 3,
      name: 'Microsoft Ads',
      status: 'disconnected',
      lastSync: null,
      description: 'Manage your Microsoft Ads campaigns',
    },
    {
      id: 4,
      name: 'Facebook Ads',
      status: 'connected',
      lastSync: '2024-09-05T15:20:00Z',
      description: 'Manage your Facebook Ads campaigns',
    },
  ]

  /**
   * Get integration status badge
   */
  const getIntegrationStatus = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>
      case 'disconnected':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Disconnected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  /**
   * Format date
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user.lastName} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue={user.company} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={user.phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue={user.timezone} />
              </div>

              <Button className="flex items-center space-x-2" onClick={handleSaveProfile}>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Current Plan</div>
                  <div className="text-sm text-gray-500">{user.plan} Plan</div>
                </div>
                <Badge variant={user.planStatus === 'active' ? 'default' : 'secondary'}>
                  {user.planStatus}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Next Billing Date</div>
                  <div className="text-sm text-gray-500">{user.planExpiry}</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageBilling}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'campaignUpdates' && 'Get notified about campaign changes'}
                      {key === 'performanceAlerts' && 'Receive alerts when performance drops'}
                      {key === 'billingNotifications' && 'Get billing and payment notifications'}
                      {key === 'securityAlerts' && 'Receive security-related notifications'}
                      {key === 'weeklyReports' && 'Get weekly performance reports'}
                    </div>
                  </div>
                  <Button 
                    variant={value ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleToggleNotification('Notification', key)}
                  >
                    {value ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Manage browser push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'campaignUpdates' && 'Get notified about campaign changes'}
                      {key === 'performanceAlerts' && 'Receive alerts when performance drops'}
                      {key === 'billingNotifications' && 'Get billing and payment notifications'}
                      {key === 'securityAlerts' && 'Receive security-related notifications'}
                    </div>
                  </div>
                  <Button 
                    variant={value ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleToggleNotification('Notification', key)}
                  >
                    {value ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>
                Manage your third-party integrations and API connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      {getIntegrationStatus(integration.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {integration.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last synced: {formatDate(integration.lastSync)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration.status === 'connected' ? (
                      <Button variant="outline" size="sm" onClick={() => handleManageIntegration(integration.id)}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleConnectIntegration(integration.id)}>
                        <Key className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button className="flex items-center space-x-2" onClick={handleUpdatePassword}>
                <Shield className="h-4 w-4" />
                <span>Update Password</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Authenticator App</div>
                  <div className="text-sm text-gray-500">
                    Use an authenticator app to generate verification codes
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEnable2FA('Authenticator App')}>
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Verification</div>
                  <div className="text-sm text-gray-500">
                    Receive verification codes via SMS
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEnable2FA('SMS Verification')}>
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interactive Modals */}
      
      {/* Billing Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Billing Management</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowBillingModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.plan} Plan</div>
                    <div className="text-sm text-gray-500">${user.plan === 'Pro' ? '99' : '49'}/month</div>
                    <Badge variant={user.planStatus === 'active' ? 'default' : 'secondary'} className="mt-2">
                      {user.planStatus}
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Next Billing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.planExpiry}</div>
                    <div className="text-sm text-gray-500">Auto-renewal enabled</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Billing Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Billing Settings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Billing History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Modal */}
      {showIntegrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Connect Integration</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowIntegrationModal(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const integration = integrations.find(i => i.id === showIntegrationModal)
              if (!integration) return null
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-medium">{integration.name}</h4>
                    <p className="text-gray-500">{integration.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <Input placeholder="Enter your API key" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account ID</label>
                      <Input placeholder="Enter your account ID" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="rounded" />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1" onClick={() => {
                      toast.success(`${integration.name} connected successfully!`)
                      setShowIntegrationModal(null)
                    }}>
                      Connect Integration
                    </Button>
                    <Button variant="outline" onClick={() => setShowIntegrationModal(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Setup Two-Factor Authentication</h3>
              <Button variant="ghost" size="sm" onClick={() => setShow2FAModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium">Secure Your Account</h4>
                <p className="text-gray-500 text-sm">
                  Add an extra layer of security to protect your account
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-medium text-sm">Step 1: Install Authenticator App</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Download Google Authenticator or similar app
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-medium text-sm">Step 2: Scan QR Code</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Scan the QR code with your authenticator app
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-medium text-sm">Step 3: Enter Verification Code</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code from your app
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => {
                  toast.success('2FA setup completed successfully!')
                  setShow2FAModal(false)
                }}>
                  Complete Setup
                </Button>
                <Button variant="outline" onClick={() => setShow2FAModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
