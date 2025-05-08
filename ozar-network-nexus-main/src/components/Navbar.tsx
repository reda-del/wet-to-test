
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Server, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole, loading, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    
    // If we're already on the homepage, scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to the homepage with the section as a hash
      navigate(`/#${id}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Check if user info is still loading
  const isLoading = loading || profileLoading;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-ozar-red" />
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-ozar-red">ozar</span> Network Labs
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Services
          </Link>
          <Link to="/premium-labs" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Premium Labs
          </Link>
          <Link to="/downloads" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Downloads
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Pricing
          </Link>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-sm font-medium hover:text-ozar-red transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-sm font-medium hover:text-ozar-red transition-colors"
          >
            Contact
          </button>
          <Link to="/blog" className="text-sm font-medium hover:text-ozar-red transition-colors">
            Blog
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ozar-red border-t-transparent"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
                  <User className="h-4 w-4 mr-2" /> My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> My Dashboard
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
                    <Settings className="h-4 w-4 mr-2" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" className="bg-ozar-red text-white hover:bg-ozar-red/90">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-4 bg-background border-b">
          <nav className="container flex flex-col space-y-3">
            <Link 
              to="/" 
              className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/premium-labs" 
              className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Premium Labs
            </Link>
            <Link
              to="/downloads"
              className="text-left px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Downloads
            </Link>
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-left px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-left px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
            >
              Contact
            </button>
            <Link 
              to="/blog" 
              className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            {isLoading ? (
              <div className="px-4 py-2 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-ozar-red border-t-transparent"></div>
              </div>
            ) : user ? (
              <>
                <Link 
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" /> My Profile
                </Link>
                <Link 
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" /> My Dashboard
                </Link>
                {userRole === 'admin' && (
                  <Link 
                    to="/admin-dashboard"
                    className="px-4 py-2 text-sm font-medium hover:bg-ozar-lightGray rounded-md flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" /> Admin Dashboard
                  </Link>
                )}
                <div className="px-4 py-2">
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Button variant="outline" size="sm" className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </Button>
                <Button size="sm" className="bg-ozar-red text-white hover:bg-ozar-red/90">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
