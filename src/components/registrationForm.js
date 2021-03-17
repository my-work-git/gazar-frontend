import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Input from './common/input';
import Translate, { tr } from '../translate';
import Button from './common/button';
import { REGISTER_WITH_EMAIL } from '../graph-ql';
import Spinner from './UI/spinner';
import Modal from './modal';
import PhoneNumberInput from '../components/phoneNumberInput';
import { isValidPhoneNumber } from 'react-phone-number-input'

@graphql(REGISTER_WITH_EMAIL, { name: 'registrationMutation' })
class RegistrationForm extends Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    repeatedPassword: '',
    phoneNumber: '',
    error: false,
    requesting: false,
    success: false,
  };

  formFieldChange = ({ target: { name, value } }) => this.setState({
    [name]: value,
  });

  phoneNumberChange = value => this.setState({
    phoneNumber: value,
  });

  onBlur = event => {
    const { target } = event;
    this.setState({
      error: !target.value
        ? 'INVALID_PHONE_NUMBER'
        : isValidPhoneNumber(target.value)
          ? false
          : 'INVALID_PHONE_NUMBER',
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    const {
      registrationMutation,
      activeLanguage: lang,
    } = this.props;
    const {
      email,
      password,
      first_name,
      last_name,
      repeatedPassword,
      phoneNumber,
    } = this.state;
    if (repeatedPassword !== password) {
      this.setState({
        error: 'PASSWORD_IS_NOT_THE_SAME',
        requesting: false,
      });
      return;
    }
    const res = await registrationMutation({ variables: {
        email,
        first_name,
        last_name,
        password,
        phoneNumber,
        lang,
    }});
    const {
      error,
      message,
    } = res.data.emailRegistration;
    if (error) {
      this.setState({
        error: message,
        requesting: false,
      });
    } else {
      this.setState({
        requesting: false,
        success: true,
      });
    }
  };

  closeModal = () => this.props.history.replace('/login');

  render() {
    const {
      email,
      first_name,
      last_name,
      repeatedPassword,
      password,
      requesting,
      error,
      success,
      phoneNumber,
    } = this.state;
    const { activeLanguage } = this.props;
    return (
      <div>
        <form
          className="main-form full"
          onSubmit={this.onSubmit}
        >
          <div className="input-box">
            <Input
              required
              name="first_name"
              value={first_name}
              changed={this.formFieldChange}
              label="FIRST_NAME"
              placeholder={tr('FIRST_NAME', activeLanguage)}
            />
          </div>
          <div className="input-box">
            <Input
              required
              name="last_name"
              value={last_name}
              changed={this.formFieldChange}
              label='LAST_NAME'
              placeholder={tr('LAST_NAME', activeLanguage)}
            />
          </div>
          <div className="input-box">
            <Input
              required
              name='email'
              value={email}
              changed={this.formFieldChange}
              label='EMAIL'
              placeholder={tr('EMAIL', activeLanguage)}
            />
          </div>
          {error && error === "INVALID_EMAIL" &&(
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          <PhoneNumberInput
            value={phoneNumber}
            onChange={this.phoneNumberChange}
            onBlur={this.onBlur}
            placeholder={tr('PHONE_NUMBER', activeLanguage)}
          />
          {error && error === "INVALID_PHONE_NUMBER" &&(
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          <div className="input-box">
            <Input
              required
              name='password'
              value={password}
              changed={this.formFieldChange}
              label='PASSWORD'
              placeholder={tr('PASSWORD', activeLanguage)}
            />
          </div>
          {error && error === "PASSWORD_NOT_SECURE" &&(
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          <div className="input-box">
            <Input
              required
              type='password'
              name='repeatedPassword'
              value={repeatedPassword}
              changed={this.formFieldChange}
              label='REPEATED_PASSWORD'
              placeholder={tr('REPEATED_PASSWORD', activeLanguage)}
            />
          </div>
          {error && error === "PASSWORD_IS_NOT_THE_SAME" &&(
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          {error && error === "USER_ALREADY_EXISTS" &&(
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          <div className="remember_padding text-center">
            <Button className={'btn-color'}>
              <Translate W={'REGISTRATION'} />
            </Button>
          </div>
        </form>
        {requesting && <Spinner />}
        <Modal
          open={success}
          onClose={this.closeModal}
        >
          <div className="alert alert-success">
            <Translate W="REGISTRATION_EMAIL_SENT" />
          </div>
          <div className="remember_padding text-center">
            <div>&nbsp;</div>
            <Button
              className="btn-link btn-sm return-to-shop-btn"
              onClick={this.closeModal}
            >
              <i className="fa fa-close" /> <Translate W="CLOSE" />
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

export default connect(mapStateToProps)(RegistrationForm);
