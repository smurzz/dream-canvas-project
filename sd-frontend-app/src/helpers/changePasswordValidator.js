export function oldPassValidator(password) {
    if (password) {
        if (password.length < 3) return 'Password must be at least 3 characters long.'
        return '';
    }
};

export function newPassValidator(password, newPassword) {
    if (password) {
        if (!newPassword) return "New password can't be empty.";
        if (newPassword.length < 3) return 'New password must be at least 3 characters long.';
        return '';
    }
};

export function confirmPassValidator(password, newPassword, confirmedPassword) {
    if (password && newPassword) {
        if (!confirmedPassword) return "Please confirm the new password.";
        if (confirmedPassword.length < 3) return 'Password must be at least 3 characters long.'
        if (newPassword !== confirmedPassword) return 'Confirmed password must match the new password.';
        return '';
    }
};