import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../services/signup'; // Import signup service
import './clientSignup.css'; // Add your styles

const ClientSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Call the signupUser function from services
            await signupUser(email, password);
            console.log('Signup successful');
            navigate('/login'); // Redirect to login page after signup
        } catch (err) {
            setError('Signup failed');
            console.error('Signup failed:', err);
        }
    };

    return (
        <div className="client-signup-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSignup} className="signup-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-signup">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default ClientSignup;
