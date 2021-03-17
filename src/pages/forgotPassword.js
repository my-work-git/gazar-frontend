import React, { Component } from 'react';
import Input from '../components/common/input';
import { connect } from 'react-redux';
import Translate, { tr } from '../translate';
import Spinner from '../components/UI/spinner';
import { RESET_EMAIL } from '../graph-ql';
import { graphql } from 'react-apollo';
import Button from '../components/common/button';
import Modal from '../components/modal';

@graphql(RESET_EMAIL, { name: 'emailReset' })
class ForgotPassword extends Component {
  state = {
    email: '',
    error: false,
    requesting: false,
    success: false,
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
    const { emailReset, activeLanguage: lang } = this.props;
    const { email } = this.state;
    const res = await emailReset({ variables: {
        login: email,
        lang,
      }});
    const { error, message } = res.data.emailResetPassword;

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
      requesting,
      error,
      success
    } = this.state;
    const { activeLanguage } = this.props;
    return (
        <div className="container mt-60">
          <div className="heading-part heading-bg">
            <h2 className="heading">
              <Translate W={'FORGOT_PASSWORD'} />
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
                    name='email'
                    value={email}
                    changed={this.formFieldChange}
                    label='EMAIL'
                    placeholder={tr('EMAIL', activeLanguage)}
                  />
                </div>
                <div className="remember_padding text-center">
                  <Button className="btn-color">
                    <Translate W="GET_RESET_LINK" />
                  </Button>
                </div>
              </form>
            </div>
            {requesting && <Spinner />}
            <Modal
              open={success}
              onClose={this.closeModal}
            >
              <div className="alert alert-success">
                <Translate W="RESET_LINK_SENT" />
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
        </div>
    );
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

export default connect(mapStateToProps)(ForgotPassword);
