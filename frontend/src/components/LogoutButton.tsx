import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button onClick={handleLogout}>
      Log out
    </button>
  );
}