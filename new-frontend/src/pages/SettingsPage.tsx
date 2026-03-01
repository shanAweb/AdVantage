import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Bell, Shield, CreditCard, Globe, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()

  const handleAction = (action: string) => { toast.success(`Opening ${action}...`) }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-stone-500 text-sm">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center"><User className="h-5 w-5 text-teal-700" /></div>
              <CardTitle className="text-base">Account Settings</CardTitle>
            </div>
            <CardDescription>Manage your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-stone-600">Email:</span> <span className="text-stone-500">{user?.email || 'Not available'}</span></div>
              <div><span className="font-medium text-stone-600">Name:</span> <span className="text-stone-500">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Not set'}</span></div>
              <div><span className="font-medium text-stone-600">Plan:</span> <span className="text-stone-500">{user?.subscription?.plan || 'Free'}</span></div>
              <div><span className="font-medium text-stone-600">Member since:</span> <span className="text-stone-500">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span></div>
            </div>
            <Button className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('profile editor')}>Edit Profile</Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><Bell className="h-5 w-5 text-emerald-700" /></div>
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Email notifications', enabled: user?.emailNotifications !== false },
                { label: 'Campaign alerts', enabled: user?.campaignAlerts !== false },
                { label: 'Weekly reports', enabled: user?.weeklyReports === true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">{item.label}</span>
                  <Badge className={item.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('notification settings')}>Manage Notifications</Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center"><Shield className="h-5 w-5 text-red-600" /></div>
              <CardTitle className="text-base">Security</CardTitle>
            </div>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Two-factor auth</span>
                <Badge className={user?.twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'}>
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Password</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Strong</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Last login</span>
                <span className="text-xs text-stone-400">{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Unknown'}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('security settings')}>Security</Button>
              <Button className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('password change form')}>Password</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center"><CreditCard className="h-5 w-5 text-amber-700" /></div>
              <CardTitle className="text-base">Billing & Plans</CardTitle>
            </div>
            <CardDescription>Manage your subscription and billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-stone-600">Current plan:</span> <span className="text-stone-500">{user?.subscription?.plan || 'Free'}</span></div>
              <div><span className="font-medium text-stone-600">Next billing:</span> <span className="text-stone-500">{user?.subscription?.nextBillingDate ? new Date(user.subscription.nextBillingDate).toLocaleDateString() : 'N/A'}</span></div>
              <div><span className="font-medium text-stone-600">Amount:</span> <span className="text-stone-500">${user?.subscription?.amount || '0'}/month</span></div>
            </div>
            <Button className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('billing management')}>Manage Billing</Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center"><Globe className="h-5 w-5 text-orange-600" /></div>
              <CardTitle className="text-base">Integrations</CardTitle>
            </div>
            <CardDescription>Connect with external services and platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Google Ads', connected: user?.integrations?.googleAds === true },
                { label: 'Microsoft Ads', connected: user?.integrations?.microsoftAds === true },
                { label: 'Analytics', connected: user?.integrations?.analytics === true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">{item.label}</span>
                  <Badge className={item.connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'}>
                    {item.connected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('integrations management')}>Manage Integrations</Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-stone-100 flex items-center justify-center"><Key className="h-5 w-5 text-stone-600" /></div>
              <CardTitle className="text-base">API Keys</CardTitle>
            </div>
            <CardDescription>Manage your API keys and access tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-stone-600">Active keys:</span> <span className="text-stone-500">{user?.apiKeys?.activeCount || 0}</span></div>
              <div><span className="font-medium text-stone-600">Last used:</span> <span className="text-stone-500">{user?.apiKeys?.lastUsed ? new Date(user.apiKeys.lastUsed).toLocaleDateString() : 'Never'}</span></div>
              <div><span className="font-medium text-stone-600">Rate limit:</span> <span className="text-stone-500">{user?.apiKeys?.rateLimit || '1000'}/hour</span></div>
            </div>
            <Button className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-100" variant="outline" onClick={() => handleAction('API keys management')}>Manage API Keys</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common settings and account management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: User, label: 'Update Profile', color: 'text-teal-700' },
              { icon: Shield, label: 'Change Password', color: 'text-red-600' },
              { icon: Bell, label: 'Notification Settings', color: 'text-emerald-700' },
              { icon: CreditCard, label: 'View Invoices', color: 'text-amber-700' },
            ].map((item, i) => (
              <Button key={i} variant="outline" className="h-20 flex-col border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200" onClick={() => handleAction(item.label)}>
                <item.icon className={`h-5 w-5 mb-2 ${item.color}`} />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
