import React from 'react';
import { Package, Users, History, BarChart3, Plus, Minus, Menu, X, User, LogOut } from 'lucide-react';
import type { UserProfile } from '../hooks/useAuth';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  userProfile: UserProfile;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isMobileMenuOpen, 
  onToggleMobileMenu,
  userProfile,
  onSignOut
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Kontrolna tabla', icon: BarChart3 },
    { id: 'inventory', label: 'Inventar', icon: Package, adminOnly: true },
    { id: 'input', label: 'Ulaz robe', icon: Plus },
    { id: 'output', label: 'Izlaz robe', icon: Minus },
    { id: 'staff', label: 'Osoblje', icon: Users, adminOnly: true },
    { id: 'history', label: 'Istorija', icon: History },
    { id: 'clients', label: 'Klijenti', icon: Users },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || userProfile.role === 'Admin'
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/cropped-azimut-logo-A-300x300-removebg-preview.png" 
            alt="Azimut Logo" 
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-gray-800">Azimut Inventar</span>
        </div>
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} lg:flex lg:flex-col
        w-full lg:w-64 bg-white shadow-lg lg:h-screen
        ${isMobileMenuOpen ? 'absolute inset-x-0 top-16 z-50 border-b' : ''}
      `}>
        <div className="hidden lg:block p-6 border-b">
          <div className="flex items-center space-x-2">
            <img 
              src="/cropped-azimut-logo-A-300x300-removebg-preview.png" 
              alt="Azimut Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-gray-800">Azimut Inventar</span>
          </div>
        </div>
        
        <nav className="mt-0 lg:mt-6 lg:flex-1 lg:overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-4 lg:px-6 py-3 text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* User info and logout */}
        <div className="border-t mt-4 lg:mt-0 pt-4 px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 truncate max-w-[150px]">{userProfile.email}</p>
                <p className="text-gray-500">{userProfile.role}</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Odjavite se"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};