import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setApiError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Login failed."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      {apiError && <p>{apiError}</p>}

      <button type="submit">Log in</button>
    </form>
  );
}