import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Code, 
  LogIn, 
  LogOut, 
  UserCircle, 
  BookOpen, 
  Trophy, 
  Users, 
  LucideIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: LucideIcon;
}

const NavLink = ({ to, children, icon: Icon }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        isActive 
          ? "bg-card text-foreground" 
          : "text-secondary hover:bg-card hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );
};

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-accent-blue" />
              <span className="text-xl font-bold text-foreground">AlgoXpert</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/problems" icon={Code}>Problems</NavLink>
              <NavLink to="/learn" icon={BookOpen}>Learn</NavLink>
              <NavLink to="/contests" icon={Trophy}>Contests</NavLink>
              <NavLink to="/community" icon={Users}>Community</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NavLink to="/profile" icon={UserCircle}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-secondary hover:bg-card hover:text-foreground transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <NavLink to="/login" icon={LogIn}>Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}