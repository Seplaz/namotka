import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import {
  getUserProfile,
  formatFullName,
  hasActiveAccess,
  type UserProfile,
} from '@/services/profileService';

import { Header } from '@/components/Header/Header';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { ArchivePage } from '@/pages/ArchivePage/ArchivePage';
import { Loader } from './components/Loader/Loader';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestId = useRef(0);
  const authEventVersion = useRef(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile(userId: string) {
      const currentRequestId = ++requestId.current;

      setProfile(null);
      setProfileError(false);
      setLoading(true);

      try {
        const loadedProfile = await getUserProfile(userId);

        if (!isCurrent || currentRequestId !== requestId.current) {
          return;
        }

        setProfile(loadedProfile);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);

        if (!isCurrent || currentRequestId !== requestId.current) {
          return;
        }

        setProfileError(true);
      } finally {
        if (isCurrent && currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    }

    async function initializeSession() {
      const currentAuthVersion = authEventVersion.current;

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!isCurrent || currentAuthVersion !== authEventVersion.current) {
          return;
        }

        setSession(data.session);

        if (data.session) {
          await loadProfile(data.session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Ошибка проверки сессии:', error);

        if (isCurrent && currentAuthVersion === authEventVersion.current) {
          setLoading(false);
        }
      }
    }

    void initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      authEventVersion.current += 1;
      const currentAuthVersion = authEventVersion.current;

      setSession(newSession);

      requestId.current += 1;

      if (!newSession) {
        setProfile(null);
        setProfileError(false);
        setLoading(false);
        return;
      }

      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'USER_UPDATED'
      ) {
        queueMicrotask(() => {
          if (!isCurrent || currentAuthVersion !== authEventVersion.current) {
            return;
          }

          void loadProfile(newSession.user.id);
        });
      }
    });

    return () => {
      isCurrent = false;
      requestId.current += 1;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Ошибка выхода:', error.message);
    }
  }

  const hasAccess = profile ? hasActiveAccess(profile) : false;
  const isAuthenticated = Boolean(session) && hasAccess;

  let accessMessage = '';

  if (profileError) {
    accessMessage = 'Не удалось загрузить профиль. Попробуйте войти снова.';
  } else if (profile?.status === 'pending') {
    accessMessage = 'Ваша учётная запись ожидает подтверждения администратора.';
  } else if (profile?.status === 'blocked') {
    accessMessage =
      'Ваша учётная запись заблокирована. Обратитесь к администратору.';
  } else if (profile && !hasAccess) {
    accessMessage = 'У вашей учётной записи нет доступа к CRM.';
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        fullName={profile ? formatFullName(profile) : ''}
        onLogout={handleLogout}
      />

      {loading ? (
        <Loader />
      ) : session && !hasAccess ? (
        <main>
          <p role="alert">{accessMessage}</p>

          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </main>
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
