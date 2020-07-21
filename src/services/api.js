const API_ROOT = `http://localhost:3000/api/v1`;

const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
};

const signup = (userInfo) => {
    return fetch(`${API_ROOT}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo)
    })
};

const login = (userInfo) => {
    return fetch(`${API_ROOT}/login/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(userInfo),
    }).then((response) => response.json());
};

const getCurrentUser = () => {
    return fetch(`${API_ROOT}/current_user/`, {
      headers: headers,
    }).then((response) => response.json());
};

export default {
    auth: {
      signup: signup,
      login: login,
      getCurrentUser: getCurrentUser
    }
};