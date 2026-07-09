import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLogin from './AdminLogin';
import Admin from '../Admin';

export default function AdminGate() {
  const { currentAdmin } = useAdminAuth();
  return currentAdmin ? <Admin /> : <AdminLogin />;
}