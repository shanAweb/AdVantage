'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart3,
  Megaphone,
  Rss,
  Search,
  Settings,
  User,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react'

/**
 * Dashboard layout component
 * Provides horizontal navigation tabs and topbar for dashboard pages
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  /**
   * Navigation items for sidebar
   */
  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: BarChart3,
      current: pathname === '/dashboard',
    },
    {
      name: 'Campaigns',
      href: '/dashboard/campaigns',
      icon: Megaphone,
      current: pathname.startsWith('/dashboard/campaigns'),
    },
    {
      name: 'Feeds',
      href: '/dashboard/feeds',
      icon: Rss,
      current: pathname.startsWith('/dashboard/feeds'),
    },
    {
      name: 'SEO Tools',
      href: '/dashboard/seo',
      icon: Search,
      current: pathname.startsWith('/dashboard/seo'),
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings'),
    },
  ]

  /**
   * Grouped navigation for dropdown
   */
  const groupedNavigation = {
    'Marketing': [
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
      { name: 'New Campaigns', href: '/dashboard/new-campaigns', icon: Megaphone },
      { name: 'Feeds', href: '/dashboard/feeds', icon: Rss },
      { name: 'Ads', href: '/dashboard/ads', icon: Megaphone },
    ],
    'Analytics': [
      { name: 'SEO Tools', href: '/dashboard/seo', icon: Search },
    ],
    'Account': [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8 lg:px-10">
            {/* Top row with logo and user info */}
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                  Global Ads
                </span>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="flex items-center space-x-2 border-t border-gray-200 dark:border-gray-700 py-2">
              {/* Overview - Always visible */}
              <Link
                href="/dashboard"
                className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <BarChart3
                  className={`mr-2 h-4 w-4 ${
                    pathname === '/dashboard'
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400'
                  }`}
                />
                Overview
              </Link>

              {/* Grouped Navigation with Dropdowns */}
              {Object.entries(groupedNavigation).map(([groupName, items]) => (
                <DropdownMenu key={groupName}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-all duration-200">
                      <span className="flex items-center">
                        {groupName === 'Marketing' && <Megaphone className="mr-2 h-4 w-4 text-gray-400" />}
                        {groupName === 'Analytics' && <Search className="mr-2 h-4 w-4 text-gray-400" />}
                        {groupName === 'Account' && <Settings className="mr-2 h-4 w-4 text-gray-400" />}
                        {groupName}
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname.startsWith(item.href)
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center w-full ${
                              isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : ''
                            }`}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>
        </div>

        {/* Main content - Full width */}
        <main className="p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}