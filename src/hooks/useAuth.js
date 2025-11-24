import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  const { auth, login, logout } = useContext(AuthContext);
  return { user: auth?.user, accessToken: auth?.accessToken, refreshToken: auth?.refreshToken, login, logout };
}
