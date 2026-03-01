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

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const location = useLocation()

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
      <div className="min-h-screen bg-stone-50">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-stone-200">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Top row */}
            <div className="flex items-center justify-between h-12 sm:h-14">
              <div className="flex items-center">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-teal-700 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">Av</span>
                </div>
                <span className="ml-2 text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  AdVantage
                </span>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9 text-stone-500 hover:text-stone-700 hover:bg-stone-100">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-500 rounded-full"></span>
                </Button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-9 hover:bg-stone-100">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-teal-700 flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-medium">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-stone-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {user?.email}
                        </p>
                      </div>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-stone-400" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white rounded-xl shadow-lg border border-stone-200 p-1.5 z-50 animate-scale-in"
                      align="end"
                      sideOffset={5}
                    >
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors duration-150">
                        <User className="mr-2 h-4 w-4 text-stone-400" />
                        Profile
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors duration-150">
                        <Settings className="mr-2 h-4 w-4 text-stone-400" />
                        Settings
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-stone-100 my-1" />
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-150"
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

            {/* Navigation tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 border-t border-stone-100 py-2 overflow-x-auto">
              <Link
                to="/dashboard"
                className={`flex items-center px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  location.pathname === '/dashboard'
                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <BarChart3
                  className={`mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    location.pathname === '/dashboard'
                      ? 'text-teal-600'
                      : 'text-stone-400'
                  }`}
                />
                <span className="hidden xs:inline">Overview</span>
              </Link>

              {Object.entries(groupedNavigation).map(([groupName, items]) => (
                <DropdownMenu.Root key={groupName}>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-all duration-200 whitespace-nowrap"
                    >
                      <span className="flex items-center">
                        {groupName === 'Marketing' && <Megaphone className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-stone-400" />}
                        {groupName === 'Analytics' && <Search className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-stone-400" />}
                        {groupName === 'Account' && <Settings className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-stone-400" />}
                        <span className="hidden xs:inline">{groupName}</span>
                      </span>
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5 text-stone-400" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white rounded-xl shadow-lg border border-stone-200 p-1.5 z-50 animate-scale-in"
                      align="start"
                      sideOffset={5}
                    >
                      {items.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href
                        return (
                          <DropdownMenu.Item key={item.href} asChild>
                            <Link
                              to={item.href}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                isActive
                                  ? 'bg-teal-50 text-teal-700'
                                  : 'text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-teal-600' : 'text-stone-400'}`} />
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

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8 xl:p-10 animate-fade-in-up">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
