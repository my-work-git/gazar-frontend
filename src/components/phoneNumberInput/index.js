import React from 'react';
import Translate from '../../translate/index';
import PhoneInput from 'react-phone-number-input'

const PhoneNumberInput = ({value, onChange, placeholder, onBlur}) => (
  <div className="input-box">
    <label>{ <Translate W={'PHONE_NUMBER'} />}</label>
    <PhoneInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      international={false}
      country={'AM'}
    />
  </div>
);

export default PhoneNumberInput;

