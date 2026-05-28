import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const withAuthHOC = (WrappedComponent) => {
  
  return (props) => {

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuthHOC;