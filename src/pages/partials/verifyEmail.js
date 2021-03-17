import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { VERIFY_EMAIL } from '../../graph-ql';
import Spinner from '../../components/UI/spinner';
import { setToken } from '../../helpers';
import Translate from '../../translate';

@graphql(VERIFY_EMAIL, { name: 'verifyEmail' })
class VerifyEmail extends Component {

  state = {
    requesting: false,
    error: false,
  };

  setToken = token => {
    setToken(token);
    window && (window.location = '/account');
  };

  async componentDidMount() {
    this.setState({
      requesting: true,
      error: false,
    });
    const { verifyEmail } = this.props;
    const res = await verifyEmail({ variables: { verifyCode: this.props.match.params.verifyCode }});
    const {
      error,
      message,
      token,
    } = res.data.emailVerifyCode;
    if (error) {
      this.setState({
        error: message,
        requesting: false,
      });
    } else {
      this.setState({ requesting: false });
      this.setToken(token)
    }
  }

  render() {
    const {
      requesting,
      error,
    } = this.state;
    return (
      <div>
        {requesting && <Spinner />}
        {error && (
          <div className="alert alert-danger">
            {<Translate W={error} />}
          </div>
        )}
      </div>
    );
  }
}

export default VerifyEmail;
