import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header/Header';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { ArchivePage } from '@/pages/ArchivePage/ArchivePage';
import { Loader } from './components/Loader/Loader';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Ошибка проверки сессии:', error.message);
      }

      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Ошибка выхода:', error.message);
    }
  }

  const isAuthenticated = Boolean(session);

  const username =
    session?.user.user_metadata?.name ??
    session?.user.email?.split('@')[0] ??
    '';

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
      />

      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/archive"
            element={
              isAuthenticated ? (
                <ArchivePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? '/dashboard' : '/login'}
                replace
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
