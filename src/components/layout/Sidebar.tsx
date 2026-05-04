'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import signOut from '@/firebase/auth/signOut';
import {
  BarChart3,
  Settings,
  Search,
  TrendingUp,
  Users,
  Quote,
  Plus,
  Menu,
  LogOut,
  User,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useBrandContext } from '@/context/BrandContext';
import { useAuthContext } from '@/context/AuthContext';
import WebLogo from '@/components/shared/WebLogo';

const navigationItems = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
  { name: 'Queries', href: '/dashboard/queries', icon: Search },
  { name: 'Citations', href: '/dashboard/citations', icon: Quote },
  { name: 'Add Product', href: '/dashboard/add-brand/step-1', icon: Plus },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, actualTheme } = useTheme();
  const { user, userProfile } = useAuthContext();
  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    selectedBrandId,
    setSelectedBrandId
  } = useBrandContext();
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Ensure single brand is selected when only one brand exists
  React.useEffect(() => {
    if (brands.length === 1 && !selectedBrandId) {
      console.log('🎯 Sidebar: Auto-selecting single brand:', brands[0].id, brands[0].companyName);
      setSelectedBrandId(brands[0].id);
    }
  }, [brands, selectedBrandId, setSelectedBrandId]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBrandsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Note: We intentionally don't add periodic refresh here as it can interfere with query processing

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Monitor;
    }
  };

  const cycleTheme = () => {
    const themes = ['system', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return `System (${actualTheme})`;
      default:
        return 'System';
    }
  };

  const handleSignOut = async () => {
    const { result, error } = await signOut();

    if (error) {
      console.error('Sign out error:', error);
      return;
    }

    // Redirect to sign in page after successful sign out
    router.push('/signin');
  };

  const ThemeIcon = getThemeIcon();

  // Filter out nav items to hide
  const hiddenNavNames = ['Analytics', 'Billing', 'Settings'];
  const visibleNavigationItems = navigationItems.filter(item => !hiddenNavNames.includes(item.name));

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-6 z-50 p-2  bg-card border border-border text-foreground hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <div className="flex items-center justify-center w-full">
              <span className="text-3xl font-serif font-bold tracking-tighter text-white">AERO</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
            {/* User Brands - Always show, handle loading and empty states */}
            {!brandsLoading && (
              <>
                <div className="w-full bg-white/5 mb-6 p-4">
                  <h3 className="text-xs uppercase tracking-widest font-serif text-white/50 mb-4">Your Products</h3>

                  {/* Always show dropdown - regardless of brand count */}
                  <div className="relative" ref={dropdownRef}>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                      className="w-full flex items-center space-x-3 p-3 bg-black border border-white/20 hover:border-primary transition-colors"
                    >
                      {selectedBrandId && brands.length > 0 && (() => {
                        const selected = brands.find(b => b.id === selectedBrandId);
                        return selected ? (
                          <>
                            <WebLogo domain={selected.domain} size={20} />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-medium text-white truncate">{selected.companyName}</p>
                              {selected.domain && (
                                <p className="text-xs text-white/40 truncate">{selected.domain}</p>
                              )}
                            </div>
                          </>
                        ) : null;
                      })()}
                      {(!selectedBrandId || brands.length === 0) && (
                        <div className="flex-1 text-left">
                          <p className="text-xs font-medium text-gray-300">
                            {brands.length === 0 ? 'No products available' : 'Select a product'}
                          </p>
                        </div>
                      )}
                      <div className="flex-shrink-0">
                        {isBrandsDropdownOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-300" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-300" />
                        )}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isBrandsDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20  z-50 max-h-48 overflow-y-auto">
                        {/* Show brands if available */}
                        {brands.length > 0 ? (
                          <>
                            {/* All Brands */}
                            {brands.map((brand) => (
                              <button
                                key={brand.id}
                                onClick={() => {
                                  setSelectedBrandId(brand.id);
                                  setIsBrandsDropdownOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors text-left ${selectedBrandId === brand.id ? 'bg-white/10' : ''
                                  }`}
                              >
                                <WebLogo domain={brand.domain} size={20} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-white truncate">{brand.companyName}</p>
                                  {brand.domain && (
                                    <p className="text-xs text-white/40 truncate">{brand.domain}</p>
                                  )}
                                </div>
                              </button>
                            ))}

                            {/* Separator */}
                            <div className="border-t border-[rgba(255,255,255,0.1)] my-1"></div>
                          </>
                        ) : (
                          <>
                            {/* No brands message */}
                            <div className="p-3 text-center">
                              <p className="text-xs text-gray-300">No products available</p>
                              <p className="text-xs text-gray-300 mt-1">Create your first product below</p>
                            </div>

                            {/* Separator */}
                            <div className="border-t border-[rgba(255,255,255,0.1)] my-1"></div>
                          </>
                        )}

                        {/* Add Brand Option - Always show */}
                        <Link
                          href="/dashboard/add-brand/step-1"
                          onClick={() => setIsBrandsDropdownOpen(false)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors text-left border-t border-white/10"
                        >
                          <div className="w-5 h-5 bg-primary flex items-center justify-center flex-shrink-0">
                            <Plus className="h-3 w-3 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white">Add Product</p>
                            <p className="text-xs text-white/40">Create a new product</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizontal line - Always show */}
                <div className="border-t border-[rgba(255,255,255,0.1)] mb-8"></div>
              </>
            )}

            {/* Loading state */}
            {brandsLoading && (
              <>
                <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]  mb-6 p-4">
                  <h3 className="text-sm font-medium text-black mb-3">Your Products</h3>
                  <div className="flex items-center space-x-3 p-2 bg-[rgba(255,255,255,0.05)]  border border-[rgba(255,255,255,0.1)]">
                    <div className="w-5 h-5 bg-[rgba(255,255,255,0.1)]  animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 bg-[rgba(255,255,255,0.1)]  w-24 mb-1 animate-pulse"></div>
                      <div className="h-2 bg-[rgba(255,255,255,0.1)]  w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Horizontal line */}
                <div className="border-t border-[rgba(255,255,255,0.1)] mb-8"></div>
              </>
            )}

            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === 'Add Product'
                ? pathname.startsWith('/dashboard/add-brand')
                : pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white'} transition-colors`} />
                  <span className="text-sm tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Section - TODO: Restore when implementing theme switching */}
          {/* 
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={cycleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3  bg-muted/50 hover:bg-accent transition-all duration-200 group"
              title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
            >
              <div className="p-2 bg-background  border border-border group-hover:border-accent transition-colors">
                <ThemeIcon className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-foreground text-sm font-medium">Theme</p>
                <p className="text-muted-foreground text-xs">{getThemeLabel()}</p>
              </div>
              <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
          */}

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 px-4 py-4 bg-white/5 border border-white/10">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-8 h-8 object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-black" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">
                  {userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-white/40 text-[10px] uppercase tracking-tighter truncate">
                  {userProfile?.email || user?.email || 'No email'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-white/40 hover:text-white transition-colors p-1"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 


