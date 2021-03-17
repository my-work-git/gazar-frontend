import React, { Component } from 'react';
import Input from '../components/common/input';
import { connect } from 'react-redux';
import Translate, { tr } from '../translate';
import Spinner from '../components/UI/spinner';
import { RESET_PASSWORD } from '../graph-ql';
import { graphql } from 'react-apollo';
import Button from '../components/common/button';

@graphql(RESET_PASSWORD, { name: 'resetPassword' })
class ResetPassword extends Component {
  state = {
    email: '',
    password: '',
    repeatedPassword: '',
    error: false,
    requesting: false,
  };

  formFieldChange = ({ target: { name, value } }) => this.setState({
    [name]: value,
  });

  onSubmit = async e => {
    e.preventDefault();

    this.setState({
      requesting: true,
      error: false,
    });
    const { resetPassword, activeLanguage: lang } = this.props;
    const { password, repeatedPassword } = this.state;
    if (repeatedPassword !== password) {
      this.setState({
        error: 'PASSWORD_IS_NOT_THE_SAME',
        requesting: false,
      });
      return false;
    }
    const res = await resetPassword({ variables: {
        verifyCode: this.props.match.params.verifyCode,
        password: password,
        lang,
      }});
    const { error, message } = res.data.resetPassword;

    if (error) {
      this.setState({
        error: message,
        requesting: false,
      });
    } else {
      window.location = '/account'
    }
  };

  render() {
    const {
      password,
      repeatedPassword,
      requesting,
      error,
    } = this.state;
    const { activeLanguage } = this.props;
    return (
      <div className="container mt-60">
        <div className="heading-part heading-bg">
          <h2 className="heading">
            <Translate W={'RESET_PASSWORD'} />
          </h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-md-6">
            <p>&nbsp;</p>
            <form
              className="main-form full"
              onSubmit={this.onSubmit}
            >
              <div className="input-box">
                <Input
                  required
                  type='password'
                  name='password'
                  value={password}
                  changed={this.formFieldChange}
                  label='PASSWORD'
                  placeholder={tr('PASSWORD', activeLanguage)}
                />
              </div>
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
              {error && (
                <div className="alert alert-danger">
                  {<Translate W={error} />}
                </div>
              )}
              <div className="remember_padding text-center">
                <Button className={'btn-color'}>
                  <Translate W={'RESET_PASSWORD'} />
                </Button>
              </div>
            </form>
          </div>
          {requesting && <Spinner />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

export default connect(mapStateToProps)(ResetPassword);
