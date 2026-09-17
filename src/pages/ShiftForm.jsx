import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCurrentUserWithSession } from '../utils/session';
import './ShiftForm.css';

const DEFAULT_WORKPLACES = ['Main Branch', 'Downtown Store', 'Warehouse', 'Remote / Home Office'];

const ShiftForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const isEditMode = Boolean(slug);

    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        hourlyWage: '',
        workplace: DEFAULT_WORKPLACES[0],
        slug: '',
        comments: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = getCurrentUserWithSession();
        if (!user) {
            alert('Session expired or not logged in.');
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        if (isEditMode) {
            const storedShifts = JSON.parse(localStorage.getItem(`shifts_${user.username}`)) || [];
            const targetShift = storedShifts.find((s) => s.slug === slug);
            if (targetShift) {
                setFormData(targetShift);
            } else {
                alert('Shift not found.');
                navigate('/');
            }
        }
    }, [navigate, slug, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const calculateTotalMinutes = (start, end) => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        let startTotal = startH * 60 + startM;
        let endTotal = endH * 60 + endM;

        if (endTotal < startTotal) {
            endTotal += 24 * 60;
        }
        return endTotal - startTotal;
    };

    const validate = () => {
        const newErrors = {};
        const shiftsKey = `shifts_${currentUser.username}`;
        const existingShifts = JSON.parse(localStorage.getItem(shiftsKey)) || [];

        if (!formData.date) newErrors.date = 'Date is required.';
        if (!formData.startTime) newErrors.startTime = 'Start time is required.';
        if (!formData.endTime) newErrors.endTime = 'End time is required.';
        if (!formData.hourlyWage || Number(formData.hourlyWage) <= 0) {
            newErrors.hourlyWage = 'Please enter a valid hourly wage.';
        }

        const trimmedSlug = formData.slug.trim();
        if (!trimmedSlug) {
            newErrors.slug = 'Shift slug is required.';
        } else {
            const isDuplicate = existingShifts.some((s) => {
                if (isEditMode && s.slug === slug) return false;
                return s.slug.toLowerCase() === trimmedSlug.toLowerCase();
            });

            if (isDuplicate) {
                newErrors.slug = 'This shift slug already exists. Please choose a new name.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        const totalMinutes = calculateTotalMinutes(formData.startTime, formData.endTime);
        const hours = totalMinutes / 60;
        const totalProfit = hours * Number(formData.hourlyWage);

        const shiftData = {
            ...formData,
            slug: formData.slug.trim(),
            hourlyWage: Number(formData.hourlyWage),
            totalProfit: Number(totalProfit.toFixed(2)),
        };

        setTimeout(() => {
            const shiftsKey = `shifts_${currentUser.username}`;
            const existingShifts = JSON.parse(localStorage.getItem(shiftsKey)) || [];

            let updatedShifts = [];
            if (isEditMode) {
                updatedShifts = existingShifts.map((s) => (s.slug === slug ? shiftData : s));
            } else {
                updatedShifts = [...existingShifts, shiftData];
            }

            localStorage.setItem(shiftsKey, JSON.stringify(updatedShifts));
            setIsLoading(false);
            navigate('/');
        }, 800);
    };

    return (
        <div className="shift-container">
            <div className="shift-card">
                <div className="shift-header">
                    <h2>{isEditMode ? 'Edit Shift' : 'Add Shift'}</h2>
                    <Link to="/" className="back-link">Cancel</Link>
                </div>

                <form onSubmit={handleSave} noValidate>
                    <div className="form-group">
                        <label htmlFor="slug">Shift Slug (Unique Name) *</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="e.g., morning-cafe-mon"
                            disabled={isLoading}
                        />
                        {errors.slug && <span className="error-message">{errors.slug}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time *</label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.startTime && <span className="error-message">{errors.startTime}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="endTime">End Time *</label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.endTime && <span className="error-message">{errors.endTime}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="hourlyWage">Hourly Wage ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                id="hourlyWage"
                                name="hourlyWage"
                                value={formData.hourlyWage}
                                onChange={handleChange}
                                placeholder="e.g., 18.50"
                                disabled={isLoading}
                            />
                            {errors.hourlyWage && <span className="error-message">{errors.hourlyWage}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="workplace">Workplace *</label>
                            <select
                                id="workplace"
                                name="workplace"
                                value={formData.workplace}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {DEFAULT_WORKPLACES.map((place) => (
                                    <option key={place} value={place}>{place}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comments">Comments</label>
                        <textarea
                            id="comments"
                            name="comments"
                            rows={3}
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Notes or details about this shift..."
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="btn-save" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner-wrapper">
                <span className="spinner"></span>
                Saving...
              </span>
                        ) : (
                            'Save Shift'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShiftForm;