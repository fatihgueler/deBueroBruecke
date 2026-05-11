import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { authApi, getAuthToken, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncLanguage = useCallback(
    (lang) => {
      if (lang && i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    },
    [i18n],
  );

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((response) => {
        setUser(response.data);
        syncLanguage(response.data.preferred_language);
      })
      .catch(() => {
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [syncLanguage]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await authApi.login(email, password);
      setAuthToken(data.access_token);
      setUser(data.user);
      syncLanguage(data.user.preferred_language);
      return data.user;
    },
    [syncLanguage],
  );

  const register = useCallback(
    async (email, password, preferredLanguage) => {
      const { data } = await authApi.register(email, password, preferredLanguage);
      setAuthToken(data.access_token);
      setUser(data.user);
      syncLanguage(data.user.preferred_language);
      return data.user;
    },
    [syncLanguage],
  );

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const updateLanguage = useCallback(
    async (lang) => {
      const { data } = await authApi.updateMe({ preferred_language: lang });
      setUser(data);
      syncLanguage(data.preferred_language);
      return data;
    },
    [syncLanguage],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateLanguage,
    }),
    [user, loading, login, register, logout, updateLanguage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
