import React from 'react';
import LoginForm from '../components/loginForm';
import { setToken } from '../helpers';
import LoginFormWithPassword from '../components/loginFormWithPassword';
import SectionPanel from '../components/UI/sectionPanel';

const onLoginComplete = (token) => {
  try {
    fbq('track', 'CompleteRegistration');
  } catch(e) {}

  setToken(token);
  window && (window.location = '/account');
};

const login = () => (
  <div className="container mt-60">
    <div className="row">
      <SectionPanel
        title="LOGIN_WITH_PASSWORD"
        className="col-xl-6 col-lg-6 col-md-6"
      >
        <LoginFormWithPassword onComplete={onLoginComplete} />
      </SectionPanel>
      <SectionPanel
        title="LOGIN_WITH_PHONE_NUMBER"
        className="col-xl-6 col-lg-6 col-md-6"
      >
        <LoginForm onComplete={onLoginComplete} />
      </SectionPanel>
      </div>
    </div>
);

export default login;
