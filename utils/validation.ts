export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateName = (name: string): boolean => {
    return name.trim().length > 1;
};

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateEmailWithMessage = (email: string, errorMessage: string): ValidationResult => {
    const isValid = validateEmail(email);
    return {
        isValid,
        error: isValid ? undefined : errorMessage
    };
};

export const validatePasswordWithMessage = (password: string, errorMessage: string): ValidationResult => {
    const isValid = validatePassword(password);
    return {
        isValid,
        error: isValid ? undefined : errorMessage
    };
};

export const validateNameWithMessage = (name: string, errorMessage: string): ValidationResult => {
    const isValid = validateName(name);
    return {
        isValid,
        error: isValid ? undefined : errorMessage
    };
};