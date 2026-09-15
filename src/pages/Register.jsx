import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import { useUserForm } from '../hooks/useUserForm';
import {validateUserForm} from "../utils/validation.js";
import './Auth.css';

const initialForm = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
};

const Register = () => {
    const navigate = useNavigate();
    const { formData, errors, handleChange, validate } = useUserForm(initialForm);

    const handleSubmit = (e) => {
        e.preventDefault();
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        if (!validate(existingUsers)) return;

        const newUser = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthDate: formData.birthDate,
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const sessionUser = {
            ...newUser,
            loginTimestamp: Date.now(),
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit} noValidate>
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

                    <button type="submit" className="btn-primary">Register</button>
                </form>

                <p className="auth-switch">
                    Already registered? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;