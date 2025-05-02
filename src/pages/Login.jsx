import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Login = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.from) {
            console.log('Navigated from:', location.state.from);
        }
    }, [location]);

    return (
        <div>
            <h1>Login Page</h1>
            {/* Add your login form here */}
        </div>
    );
};

export default Login;