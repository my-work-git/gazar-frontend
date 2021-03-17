import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Input from './common/input';
import Translate, { tr } from '../translate';
import Button from './common/button';
import Modal from './modal';
import { LOGIN_OR_REGISTER, VERIFY_CODE } from '../graph-ql';
import Spinner from './UI/spinner';
import CountdownS from '../components/CountdownS';
import PhoneNumberInput from '../components/phoneNumberInput';

@graphql(VERIFY_CODE, { name: 'verifyMutation' })
@graphql(LOGIN_OR_REGISTER, { name: 'loginMutation' })
class loginForm extends Component {
  state = {
    phoneNumber: '',
    verifyCode: '',
    verifyOpen: false,
    phoneNumberError: false,
    error: false,
    requesting: false,
    countDownKey: Math.random(),
    countDownCompleted: false,
  };

  closeModal = () => this.setState({ verifyOpen: false, verifyCode: '' });

  formFieldChange = ({ target: { name, value } }) => this.setState({ [name]: value });
  onCodeVerifySubmit = async (e) => {
    e.preventDefault();
    this.setState({ requesting: true, phoneNumberError: false, error: false });
    const { verifyMutation, activeLanguage: lang } = this.props;
    const { verifyCode, phoneNumber } = this.state;
    const res = await verifyMutation({ variables: { verifyCode, phoneNumber }});
    const { error, message, token } = res.data.verifyCode;
    if (error) {
      this.setState({ error: message, requesting: false });
    } else {
      this.setState({ verifyOpen: false, requesting: false });
      this.props.onComplete(token, String(phoneNumber));
    }
  };

  onPhoneNumberSubmit = async (e) => {
    e.preventDefault();
    this.setState({ requesting: true, phoneNumberError: false, error: false, countDownCompleted: false, countDownKey: Math.random() });
    const { loginMutation, activeLanguage: lang } = this.props;
    const { phoneNumber } = this.state;
    const res = await loginMutation({ variables: { phoneNumber, lang }});
    const { error, message } = res.data.loginOrRegister;
    if (error) {
      this.setState({ phoneNumberError: message, requesting: false });
    } else {
      this.setState({ verifyOpen: true, requesting: false });
    }
  };

  render() {
    const { error, phoneNumber, verifyCode, verifyOpen, requesting, phoneNumberError } = this.state;
    const { activeLanguage } = this.props;
    return (
      <div>
        <form className="main-form full" onSubmit={this.onPhoneNumberSubmit}>
          <div className="input-box">
            <PhoneNumberInput
              value={phoneNumber}
              onChange={value => this.formFieldChange({ target: { name: 'phoneNumber', value } })}
              placeholder={tr('PHONE_NUMBER', activeLanguage)}
            />
          </div>
          {phoneNumberError && (
            <div className="alert alert-danger">{<Translate W={phoneNumberError} />}</div>
          )}
          <div className="remember_padding text-center">
            <Button onClick={this.submitHandler} className={'btn-color'}>
              <Translate W={'LOGIN'} />
            </Button>
          </div>
          <hr />
          <div className="new-account align-center mt-20 mb-20">
            <span>{<Translate W={'LOGIN_DESCRIPTION'} />}</span>{' '}
          </div>
        </form>
        <Modal open={verifyOpen} title='VERIFICATION_CODE' onClose={() => {}}>
          <form className="main-form full" onSubmit={this.onCodeVerifySubmit}>
            <p>
              <small><Translate W='TRY_AGAIN_IF_NO_SMS'/></small>
            </p>
            <p>
              {this.state.countDownCompleted ? (
                <Button type='button' className="btn-link btn-sm" onClick={() => this.onPhoneNumberSubmit({ preventDefault: () => {}})}>
                  <Translate W='RESEND_CODE' />
                </Button>
                ) : (
                <h4><CountdownS key={this.state.countDownKey} startFrom={120} onDone={() => this.setState({ countDownCompleted: true })} /></h4>
              )}
            </p>
            <div className="input-box">
              <Input
                name='verifyCode'
                value={verifyCode}
                changed={this.formFieldChange}
                placeholder={tr('VERIFICATION_CODE', activeLanguage)}
              />
            </div>
            {error && (
              <div className="alert alert-danger">{<Translate W={error} />}</div>
            )}
            <div className="remember_padding text-center">
              <Button onClick={this.submitHandler} className={'btn-color'}>
                <Translate W={'VERIFY'} />
              </Button>
              {this.state.countDownCompleted && (
                <Button type='button' className="btn-link btn-sm" onClick={this.closeModal}>
                  <i className="fa fa-close" /> <Translate W='CANCEL' />
                </Button>
              )}
            </div>
          </form>
        </Modal>

        {requesting && <Spinner />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

export default connect(mapStateToProps)(loginForm);
