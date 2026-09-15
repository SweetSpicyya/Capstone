export const calculateAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const validateUserForm = (formData, existingUsers = []) => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!formData.email){
        errors.email = 'Email is required.';
    }else if (!emailRegex.test(formData.email)){
        errors.email = 'Invalid email address.';
    }else if (existingUsers.some((u) => u.email === formData.email)) {
        errors.email = 'Email already in use.';
    }

    const hasLetter = /[a-zA-Z]/.test(formData.username);
    const hasNumber = /[0-9]/.test(formData.username);
    const hasSpecial = /[^a-zA-Z0-9]/.test(formData.username);

    if(formData.username.length < 6 || !hasLetter || !hasNumber || !hasSpecial){
        errors.username = 'Min 6 chars with letters, numbers & symbols.';
    }else if (existingUsers.some((u) => u.username === formData.username)) {
        errors.username = 'Username already exists.';
    }

    if (formData.password.length < 6) {
        errors.password = 'Min 6 characters required.';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    const nameRegex = /^[A-Za-z]{2,}$/;
    if (!nameRegex.test(formData.firstName.trim())) {
        errors.firstName = 'Min 2 letters required.';
    }
    if (!nameRegex.test(formData.lastName.trim())) {
        errors.lastName = 'Min 2 letters required.';
    }

    if (!formData.birthDate) {
        errors.birthDate = 'Birth date is required.';
    } else {
        const age = calculateAge(formData.birthDate);
        if (age < 18 || age > 65) {
            errors.birthDate = `Age must be between 18 and 65.`;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}