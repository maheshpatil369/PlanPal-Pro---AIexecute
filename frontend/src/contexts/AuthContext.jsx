// import React, { createContext, useContext, useState, useEffect } from 'react';
// const AuthContext = createContext(undefined);
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; 
// const AUTH_API_URL = `${API_BASE_URL}/auth`; 

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Failed to parse stored user:", e);
//         localStorage.removeItem('user'); 
//         localStorage.removeItem('token');
//         setToken(null);
//         setUser(null);
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${AUTH_API_URL}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || 'Login failed');
//       }

//       setUser(data.user);
//       setToken(data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       localStorage.setItem('token', data.token);
//       return { success: true };
//     } catch (err) {
//       setError(err.message);
//       return { success: false, message: err.message };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (name, email, password) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${AUTH_API_URL}/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password }),
//       });
//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       setUser(data.user);
//       setToken(data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       localStorage.setItem('token', data.token);
//       return { success: true };
//     } catch (err) {
//       setError(err.message);
//       return { success: false, message: err.message };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     isLoading,
//     error,
//     setError 
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const AUTH_API_URL = `${API_BASE_URL}/auth`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }), // ✅ Fixed key name
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
