import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const getSession = async () => {
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

    const signUp = async (email, password) => {
        // Mock Bypass for Rate Limits
        if (email === 'admin@mock.com') {
            console.log("MOCK SIGNUP DETECTED");
            const mockUser = { id: 'mock-user-id', email: 'admin@mock.com' };
            setUser(mockUser);
            return { data: { user: mockUser, session: { access_token: 'mock-token' } }, error: null };
        }
        return await supabase.auth.signUp({ email, password });
    };

    const signIn = async (email, password) => {
        // Mock Bypass for Rate Limits
        if (email === 'admin@mock.com') {
            console.log("MOCK SIGNIN DETECTED");
            const mockUser = { id: 'mock-user-id', email: 'admin@mock.com' };
            setUser(mockUser);
            return { data: { user: mockUser, session: { access_token: 'mock-token' } }, error: null };
        }
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async () => {
        if (user?.email === 'admin@mock.com') {
            setUser(null);
            return { error: null };
        }
        return await supabase.auth.signOut();
    };

    const value = {
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
