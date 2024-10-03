// src/utils/auth.js
export const logout = () => {
  // Clear authentication tokens (localStorage, cookies, etc.)
  localStorage.removeItem('authToken');

  // Redirect to login page
  window.location.href = '/login-student';
};
