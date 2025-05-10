
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';

type ProfileType = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  id: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  profile: ProfileType | null;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  profileLoading: boolean;
  updateProfile: (updates: Partial<ProfileType>) => Promise<void>;
  isLoading: boolean; // Added property for PremiumLabs.tsx
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setProfile(data as ProfileType);
      setUserRole(data.role);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          toast.success('Successfully signed in');
          
          // Use setTimeout to avoid potential deadlock with Supabase auth
          setTimeout(async () => {
            try {
              // Fetch user profile
              const profileData = await fetchUserProfile(currentSession.user.id);
              
              if (!profileData) {
                throw new Error('Failed to load profile');
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
          setUserRole(null);
          setProfile(null);
          navigate('/');
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName, 
            last_name: lastName
          },
        },
      });
  
      if (error) {
        toast.error(error.message);
        throw error;
      }
  
      const user = data.user;
      if (!user) {
        throw new Error("Signup failed");
      }
  
      toast.success('Signup successful!');
      
      // Email confirmation is now disabled, user should be signed in automatically
      if (data.session) {
        // Role will be fetched by the onAuthStateChange handler
        navigate('/');
      } else {
        toast.success('Signup successful! Please check your email for verification.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Check if email is confirmed
      if (data.user && data.user.email_confirmed_at === null) {
        toast.warning('Please confirm your email address before logging in.');
        navigate('/login');
        throw new Error('Email not confirmed');
      }
      
      // Redirect is handled by the onAuthStateChange listener
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Improved signOut function with better error handling
  const signOut = async () => {
    console.log("Sign out initiated");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      // Force clear session state
      setSession(null);
      setUser(null);
      setUserRole(null);
      setProfile(null);
      
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(`Failed to sign out: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileType>): Promise<void> => {
    try {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update the profile in the state
      if (profile) {
        setProfile({
          ...profile,
          ...updates,
        });
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  };

  const value = {
    session,
    user,
    userRole,
    profile,
    signUp,
    signIn,
    signOut,
    loading,
    profileLoading,
    updateProfile,
    isLoading: loading || profileLoading, // Added property for PremiumLabs.tsx
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
