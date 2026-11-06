import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getUserProfile, formatFullName } from '@/services/profileService';
import { Header } from '@/components/Header/Header';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { ArchivePage } from '@/pages/ArchivePage/ArchivePage';
import { Loader } from './components/Loader/Loader';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadProfileName(userId: string) {
      try {
        const profile = await getUserProfile(userId);

        if (isCurrent) {
          setFullName(formatFullName(profile));
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);

        if (isCurrent) {
          setFullName('');
        }
      }
    }

    async function initializeSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!isCurrent) return;

        setSession(data.session);

        if (data.session) {
          await loadProfileName(data.session.user.id);
        }
      } catch (error) {
        console.error('Ошибка проверки сессии:', error);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    void initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (!newSession) {
        setFullName('');
        setLoading(false);
        return;
      }

      void loadProfileName(newSession.user.id);
    });

    return () => {
      isCurrent = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Ошибка выхода:', error.message);
    }
  }

  const isAuthenticated = Boolean(session);

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        fullName={fullName}
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
