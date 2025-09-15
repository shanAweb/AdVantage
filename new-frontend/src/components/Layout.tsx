import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  BarChart3,
  Megaphone,
  Rss,
  Package,
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
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const location = useLocation()
  /**
   * Grouped navigation for dropdown
   */
  const groupedNavigation = {
    'Marketing': [
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
      { name: 'New Campaigns', href: '/dashboard/new-campaigns', icon: Megaphone },
      { name: 'Feeds', href: '/dashboard/feeds', icon: Rss },
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Ads', href: '/dashboard/ads', icon: Megaphone },
    ],
    'Analytics': [
      { name: 'SEO Tools', href: '/dashboard/seo', icon: Search },
    ],
    'Account': [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Top row with logo and user info */}
            <div className="flex items-center justify-between h-12 sm:h-14">
              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">G</span>
                </div>
                <span className="ml-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Global Ads
                </span>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* User menu */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-10">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-medium">
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
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50"
                      align="end"
                      sideOffset={5}
                    >
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                      <DropdownMenu.Item 
                        className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md cursor-pointer"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>

            {/* Navigation tabs - Responsive */}
            <div className="flex items-center space-x-1 sm:space-x-2 border-t border-gray-200 dark:border-gray-700 py-2 overflow-x-auto">
              {/* Overview - Always visible */}
              <Link
                to="/dashboard"
                className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <BarChart3
                  className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${
                    location.pathname === '/dashboard'
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400'
                  }`}
                />
                <span className="hidden xs:inline">Overview</span>
              </Link>

              {/* Grouped Navigation with Dropdowns */}
              {Object.entries(groupedNavigation).map(([groupName, items]) => (
                <DropdownMenu.Root key={groupName}>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-all duration-200 whitespace-nowrap"
                    >
                      <span className="flex items-center">
                        {groupName === 'Marketing' && <Megaphone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />}
                        {groupName === 'Analytics' && <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />}
                        {groupName === 'Account' && <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />}
                        <span className="hidden xs:inline">{groupName}</span>
                      </span>
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50"
                      align="start"
                      sideOffset={5}
                    >
                      {items.map((item) => {
                        const Icon = item.icon
                        return (
                          <DropdownMenu.Item key={item.href} asChild>
                            <Link
                              to={item.href}
                              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                            >
                              <Icon className="mr-2 h-4 w-4 text-gray-400" />
                              {item.name}
                            </Link>
                          </DropdownMenu.Item>
                        )
                      })}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ))}
            </div>
          </div>
        </div>

        {/* Main content - Responsive padding */}
        <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}

