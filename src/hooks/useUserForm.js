import { useState } from 'react';
import { validateUserForm } from '../utils/validation';

export const useUserForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (existingUsers = []) => {
        const { isValid, errors: validationErrors } = validateUserForm(formData, existingUsers);
        setErrors(validationErrors);
        return isValid;
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        validate,
    };
};