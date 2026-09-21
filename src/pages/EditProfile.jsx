import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import { useUserForm } from '../hooks/useUserForm';
import { getCurrentUserWithSession } from '../utils/session';
import './Auth.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const { formData, setFormData, errors, handleChange, validate } = useUserForm({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthDate: '',
    });

    useEffect(() => {
        const user = getCurrentUserWithSession();
        if (!user) {
            alert('Session expired or not logged in.');
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        setFormData({
            email: user.email || '',
            username: user.username || '',
            password: user.password || '',
            confirmPassword: user.password || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            birthDate: user.birthDate || '',
        });
    }, [navigate, setFormData]);

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        const otherUsers = existingUsers.filter((u) => u.username !== currentUser.username);

        if (!validate(otherUsers)) return;

        const updatedUser = {
            ...currentUser,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthDate: formData.birthDate,
        };

        const updatedUsers = existingUsers.map((u) =>
            u.username === currentUser.username ? updatedUser : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        if (currentUser.username !== updatedUser.username) {
            const oldShiftsKey = `shifts_${currentUser.username}`;
            const newShiftsKey = `shifts_${updatedUser.username}`;
            const existingShifts = localStorage.getItem(oldShiftsKey);

            if (existingShifts) {
                localStorage.setItem(newShiftsKey, existingShifts);
                localStorage.removeItem(oldShiftsKey);
            }
        }

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        alert('Profile updated successfully!');
        navigate('/');
    };

    if (!currentUser) return null;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Edit Profile</h2>
                    <Link to="/" style={{ color: '#718096', fontSize: '0.85rem', textDecoration: 'none' }}>
                        ← Back to Home
                    </Link>
                </div>

                <form onSubmit={handleUpdate} noValidate>
                    <InputField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="example@mail.com"
                    />

                    <InputField
                        label="Username"
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Min 6 chars (letters, numbers, symbols)"
                    />

                    <InputField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="At least 6 characters"
                    />

                    <InputField
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        placeholder="Confirm password"
                    />

                    <div className="form-row">
                        <InputField
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            placeholder="Min 2 letters"
                        />
                        <InputField
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            placeholder="Min 2 letters"
                        />
                    </div>

                    <InputField
                        label="Birth Date"
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        error={errors.birthDate}
                    />

                    <button type="submit" className="btn-primary">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;