import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabase';
import { User, AuthError, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: AuthError | null }>;
    user: User | null;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;

        const getSession = async () => {
            if (!supabase) {
                if (mounted) setLoading(false);
                return;
            }
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                if (mounted) setLoading(false);
            }
        };

        getSession();

        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    /**
     * Sign up a new user with Supabase authentication.
     * 
     * Note: Includes a mock bypass for 'admin@mock.com' to facilitate testing
     * without hitting Supabase rate limits during development.
     * 
     * @param email - User email address
     * @param password - User password
     * @returns Supabase auth response or mock response
     */
    const signUp = async (email: string, password: string): Promise<AuthResponse> => {
        if (!supabase) return { data: { user: null, session: null }, error: { message: "Supabase client not initialized" } as AuthError };

        // Mock bypass for testing - allows login without Supabase rate limit issues
        if (email === 'admin@mock.com') {
            const mockUser = { id: 'mock-user-id', email: 'admin@mock.com' } as User;
            setUser(mockUser);
            return { data: { user: mockUser, session: { access_token: 'mock-token' } as any }, error: null };
        }

        return await supabase.auth.signUp({ email, password });
    };

    /**
     * Sign in an existing user with Supabase authentication.
     * 
     * Note: Includes a mock bypass for 'admin@mock.com' to facilitate testing
     * without hitting Supabase rate limits during development.
     * 
     * @param email - User email address
     * @param password - User password
     * @returns Supabase auth response or mock response
     */
    const signIn = async (email: string, password: string): Promise<AuthResponse> => {
        if (!supabase) return { data: { user: null, session: null }, error: { message: "Supabase client not initialized" } as AuthError };

        // Mock bypass for testing - allows login without Supabase rate limit issues
        if (email === 'admin@mock.com') {
            const mockUser = { id: 'mock-user-id', email: 'admin@mock.com' } as User;
            setUser(mockUser);
            return { data: { user: mockUser, session: { access_token: 'mock-token' } as any }, error: null };
        }

        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async (): Promise<{ error: AuthError | null }> => {
        if (!supabase) return { error: { message: "Supabase client not initialized" } as AuthError };
        if (user?.email === 'admin@mock.com') {
            setUser(null);
            return { error: null };
        }
        return await supabase.auth.signOut();
    };

    const value: AuthContextType = {
        signUp,
        signIn,
        signOut,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
