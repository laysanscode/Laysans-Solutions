function userLogin() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        // Token not found, redirect to login
        window.location.href = '/Admin/dashboard/auth/Login.html';
        return;
    }

    // Token exists, allow access (do nothing)
}

userLogin();
