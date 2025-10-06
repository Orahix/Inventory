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
      <div className="lg:hidden bg-white border-b border-[rgba(46,46,46,0.12)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/cropped-azimut-logo-A-300x300-removebg-preview copy copy.png"
            alt="Azimut Logo"
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-[#2E2E2E]">Azimut Inventar</span>
        </div>
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-[10px] text-[#2E2E2E] hover:bg-[#F3F4F6] transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} lg:flex lg:flex-col
        w-full lg:w-64 bg-white border-r border-[rgba(46,46,46,0.12)] lg:h-screen
        ${isMobileMenuOpen ? 'absolute inset-x-0 top-16 z-50 border-b' : ''}
      `}>
        <div className="hidden lg:block p-6 border-b border-[rgba(46,46,46,0.12)]">
          <div className="flex items-center space-x-3">
            <img
              src="/cropped-azimut-logo-A-300x300-removebg-preview copy copy.png"
              alt="Azimut Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[#2E2E2E]">Azimut Inventar</span>
          </div>
        </div>

        <nav className="mt-0 lg:mt-6 lg:flex-1 lg:overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-4 lg:px-6 py-3 text-left transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-[#FF6F00] bg-opacity-10 border-r-4 border-[#FF6F00] text-[#FF6F00] font-medium'
                    : 'text-[#5A5A5A] hover:bg-[#F3F4F6] hover:text-[#2E2E2E]'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[rgba(46,46,46,0.12)] mt-4 lg:mt-0 pt-4 px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#82B0C5] flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm min-w-0">
                <p className="font-medium text-[#2E2E2E] truncate">{userProfile.email}</p>
                <p className="text-[#5A5A5A] text-xs">{userProfile.role}</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 text-[#5A5A5A] hover:bg-[#F3F4F6] rounded-[10px] transition-colors flex-shrink-0"
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
