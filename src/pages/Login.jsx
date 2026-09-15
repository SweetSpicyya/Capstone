import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (formError) setFormError('');
    };

    const validateLogin = () => {
        const newErrors = {};
        const { username, password } = credentials;

        const hasLetter = /[a-zA-Z]/.test(username);
        const hasNumber = /[0-9]/.test(username);
        const hasSpecial = /[^a-zA-Z0-9]/.test(username);

        if (username.length < 6 || !hasLetter || !hasNumber || !hasSpecial) {
            newErrors.username = 'Min 6 chars with letters, numbers & symbols.';
        }

        if (password.length < 6) {
            newErrors.password = 'Min 6 characters required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(
            (u) => u.username === credentials.username && u.password === credentials.password
        );

        if (!matchedUser) {
            setFormError('Invalid username or password.');
            return;
        }

        const sessionUser = {
            ...matchedUser,
            loginTimestamp: Date.now(),
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign In</h2>

                {formError && (
                    <div style={{ color: '#e53e3e', marginBottom: '14px', fontSize: '0.85rem' }}>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                    <InputField
                        label="Username"
                        id="username"
                        name="username"
                        type="text"
                        value={credentials.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Username"
                    />

                    <InputField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Password"
                    />

                    <div style={{ textAlign: 'right', marginBottom: '14px' }}>
                        <Link
                            to="/reset-password"
                            style={{
                                color: '#718096',
                                fontSize: '0.78rem',
                                textDecoration: 'underline',
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="btn-primary">
                        Login
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;