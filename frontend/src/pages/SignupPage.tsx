import { useState } from 'react';
import { signup } from "../api/auth";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [apiError, setApiError] = useState("");
    const passwordsMatch = confirmPassword === "" || password === confirmPassword;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setApiError("");

        if (!passwordsMatch) {
            return;
        }

        try {
            const data = await signup({
                email: email,
                password: password,
            });

            console.log("Signup successful:", data);
        } catch (error) {
            setApiError((error as Error).message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email" >Email</label>
            <input 
                id="email" 
                type="email" 
                name="email" 
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input 
                id="password" 
                type="password" 
                name="password" 
                value={password}
                required
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
            />

            <label htmlFor="confirm-password">Confirm password</label>
            <input 
                id="confirm-password" 
                type="password" 
                name="confirm-password"
                value={confirmPassword}
                required
                onChange={(e) => {
                    setConfirmPassword(e.target.value)
                }}
            />

            {apiError && <p>{apiError}</p>}

            {!passwordsMatch && <p>Your passwords must match!</p>}

            <button type="submit">Sign up</button>
        </form>
    )
}