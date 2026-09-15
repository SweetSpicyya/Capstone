import React from 'react';

const InputField = ({ label, id, name, type = 'text', value, onChange, error, placeholder }) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputField;