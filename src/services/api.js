const API_ROOT = `http://localhost:3000/api/v1`;

const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
};

const login = (username, password) => {
    return fetch(`${API_ROOT}/auth/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ username, password }),
    }).then((response) => response.json());
};

const getCurrentUser = () => {
    return fetch(`${API_ROOT}/current_user/`, {
      headers: headers,
    }).then((response) => response.json());
};

export default {
    auth: {
      login: login,
      getCurrentUser: getCurrentUser
    }
};