import React from 'react';
import { setToken } from '../helpers';

const logout = () => {
  setToken(null);
  window && (window.location = '/');
  return <div />
};

export default logout;
