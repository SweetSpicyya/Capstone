import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import './Auth.css';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (formError) setFormError('');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address.';
        }

        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Min 6 characters required.';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(
            (u) => u.username === formData.username.trim() && u.email === formData.email.trim()
        );

        if (userIndex === -1) {
            setFormError('No account found matching this username and email.');
            return;
        }

        users[userIndex].password = formData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        alert('Password updated successfully! Please sign in with your new password.');
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Reset Password</h2>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '20px', textAlign: 'center' }}>
                    Enter your account details to change your password.
                </p>

                {formError && (
                    <div style={{ color: '#e53e3e', marginBottom: '14px', fontSize: '0.85rem' }}>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        label="Username"
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Your username"
                    />

                    <InputField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="Registered email"
                    />

                    <InputField
                        label="New Password"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        placeholder="At least 6 characters"
                    />

                    <InputField
                        label="Confirm New Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        placeholder="Confirm new password"
                    />

                    <button type="submit" className="btn-primary">
                        Change Password
                    </button>
                </form>

                <p className="auth-switch">
                    Remember your password? <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;