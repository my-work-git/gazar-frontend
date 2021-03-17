import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Input from './common/input';
import Translate, { tr } from '../translate';
import Button from './common/button';
import { EMAIL_LOGIN } from '../graph-ql';
import Spinner from './UI/spinner';
import Link from '../components/Link';

@graphql(EMAIL_LOGIN, { name: 'emailLoginMutation' })
class LoginFormWithPassword extends Component {
  state = {
    email: '',
    password: '',
    error: false,
    requesting: false,
    countDownKey: Math.random(),
    countDownCompleted: false,
  };

  formFieldChange = ({ target: { name, value } }) => this.setState({
    [name]: value,
  });

  onSubmit = async e => {
    e.preventDefault();
    const { emailLoginMutation } = this.props;
    const {
      email,
      password,
    } = this.state;
    this.setState({
      requesting: true,
      error: false,
      countDownCompleted: false,
      countDownKey: Math.random(),
    });

    const res = await emailLoginMutation({ variables: {
        email,
        password,
      }});
    const { error, message, token } = res.data.emailLogin;

    if (error) {
      this.setState({
        error: message,
        requesting: false,
      });
    } else {
      this.setState({ requesting: false });
      this.props.onComplete(token);
    }
  };

  render() {
    const {
      email,
      password,
      requesting,
      error,
      address
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
              type='email'
              name='email'
              value={email}
              changed={this.formFieldChange}
              label='EMAIL'
              placeholder={tr('EMAIL', activeLanguage)}
            />
          </div>
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
          {error && (
            <div className="alert alert-danger">
              {<Translate W={error} />}
            </div>
          )}
          <div className="remember_padding text-center">
            <Button className={'btn-color'}>
              <Translate W={'LOGIN'} />
            </Button>
          </div>
          <div className="remember_padding text-center">
            <Link to="/forgotPassword">
              <i className='fa fa-key' />&nbsp;<Translate W={'FORGOT_PASSWORD'} />
            </Link>
          </div>
        </form>
        {requesting && <Spinner />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

export default connect(mapStateToProps)(LoginFormWithPassword);
