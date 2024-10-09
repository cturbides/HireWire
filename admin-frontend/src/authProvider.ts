import { AuthProvider, HttpError } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ email, password }) => {
    const request = new Request(
      `${import.meta.env.VITE_SIMPLE_REST_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new HttpError(response.statusText, 400);
        }
        return response.json();
      })
      .then(({ token }) => {
        localStorage.setItem('authToken', token.accessToken);
      });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem('authToken')
      ? Promise.resolve() 
      : Promise.reject(); 
  },
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('authToken');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { id, fullName, avatar } = JSON.parse(localStorage.getItem('userInfo') as string);
      return Promise.resolve({ id, fullName, avatar });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    const role = localStorage.getItem('role');
    return role ? Promise.resolve(role) : Promise.reject();
  },
};


export default authProvider;
