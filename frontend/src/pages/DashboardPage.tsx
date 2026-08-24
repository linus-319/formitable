import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/useAuth"

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>

      <LogoutButton />
    </main>
  );
}