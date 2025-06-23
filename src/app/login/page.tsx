"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/calendar');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: "http://localhost:3000/auth/callback",
          scopes: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            カレンダーアプリにログイン
          </h2>
        </div>
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Googleでログイン
          </button>
        </div>
      </div>
    </div>
  );
} 