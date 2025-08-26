import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium';
  subscription_expires_at?: string;
  tokens_used: number;
  tokens_limit: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getDailyQuestionsRemaining: () => Promise<number>;
  incrementDailyQuestions: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // Not used for now
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('🔐 useAuth: Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 useAuth: Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set loading to false immediately without fetching profile
        setLoading(false);
        console.log('🔐 useAuth: Loading set to false');
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome to Babil!",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    // Check for existing session
    console.log('🔐 useAuth: Checking for existing session...');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔐 useAuth: Existing session found:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set loading to false immediately without fetching profile
      setLoading(false);
      console.log('🔐 useAuth: Initial loading set to false');
    });

    return () => subscription.unsubscribe();
  }, []); // Remove toast dependency to prevent infinite re-renders

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const getDailyQuestionsRemaining = async (): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      console.log('🔍 [Frontend] Calling daily-questions function for user:', user.id);
      const { data, error } = await supabase.functions.invoke('daily-questions', {
        body: { userId: user.id, action: 'get' }
      });
      
      console.log('🔍 [Frontend] Function response - data:', data, 'error:', error);
      
      if (error) throw error;
      
      const remaining = data.remaining || 0;
      console.log('🔍 [Frontend] Returning remaining questions:', remaining);
      return remaining;
    } catch (error) {
      console.error('Error getting daily questions remaining:', error);
      return 0;
    }
  };

  const incrementDailyQuestions = async (): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      console.log('🔍 [Frontend] Calling daily-questions increment for user:', user.id);
      const { data, error } = await supabase.functions.invoke('daily-questions', {
        body: { userId: user.id, action: 'increment' }
      });
      
      console.log('🔍 [Frontend] Increment response - data:', data, 'error:', error);
      
      if (error) throw error;
      
      const remaining = data.remaining || 0;
      console.log('🔍 [Frontend] Increment returning remaining questions:', remaining);
      return remaining;
    } catch (error) {
      console.error('Error incrementing daily questions:', error);
      return 0;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    getDailyQuestionsRemaining,
    incrementDailyQuestions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}