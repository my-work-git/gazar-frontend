import React from 'react';
import Translate from '../translate';
import RegistrationForm from '../components/registrationForm';

const Registration = ({ history }) => (
  <div className="container mt-60">
    <div className="heading-part heading-bg">
      <h2 className="heading">
        <Translate W={'CUSTOMER_REGISTRATION'} />
      </h2>
    </div>
    <div className="row justify-content-center">
      <div className="col-xl-6 col-lg-6 col-md-6">
        <p>&nbsp;</p>
        <RegistrationForm history={history} />
      </div>
    </div>
  </div>
);

export default Registration;

