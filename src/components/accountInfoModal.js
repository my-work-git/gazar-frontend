import React, { Component } from 'react';
import Input from './common/input';
import Button from './common/button';
import Translate from '../translate';
import Modal from './modal';
import { graphql } from 'react-apollo';
import { UPDATE_ME } from '../graph-ql';
import Spinner from './UI/spinner';

@graphql(UPDATE_ME, { name: 'userUpdate' })
class accountInfoModal extends Component {
  state = {
    userInfoModalOpen: true,
    error: false,
    requesting: false,
    formData: {
      first_name: '',
      last_name: '',
      email: '',
    },
  };

  fieldChange = ({ target: { name, value } }) => this.setState({ formData: { ...this.state.formData, [name]: value } });

  onSubmit = async e => {
    e.preventDefault();
    const { formData } = this.state;
    if (formData.first_name.length === 0 || formData.last_name.length === 0) {
      this.setState({ error: 'ACCOUNT_INFO_FIELDS_REQUIRED' });
      return;
    }

    this.setState({ error: false, requesting: true });
    const { userUpdate, refetchUser } = this.props;
    const res = await userUpdate({ variables: { ...this.state.formData } });
    const { error, message } = res.data.updateMe;
    if (error) {
      this.setState({ error: message, requesting: false });
    } else {
      this.setState({ requesting: false, editing: false, userInfoModalOpen: false });
      refetchUser(true);
    }
  };

  render() {
    const { userInfoModalOpen, error, requesting, formData: { first_name, last_name, email } } = this.state;
    const { user } = this.props;

    return (
      <Modal open={(userInfoModalOpen && user && user._id && !user.first_name) || false} title="ACCOUNT_INFORMATION" onClose={() => {}}>
        <p><Translate W="ACCOUNT_INFO_MODAL_TEXT" /></p>
        {error && <div className="alert alert-danger">{<Translate W={error} />}</div>}
        <form className="main-form full" onSubmit={this.onSubmit}>
          <div className="input-box">
            <Input label="FIRST_NAME" name='first_name' value={first_name} changed={this.fieldChange} required />
          </div>
          <div className="input-box">
            <Input label="LAST_NAME" name='last_name' value={last_name} changed={this.fieldChange} required />
          </div>
          <div className="input-box">
            <Input label="EMAIL" name='email' value={email} changed={this.fieldChange} />
          </div>
          <div>&nbsp;</div>
          <p className='text-center'>
            <Button className="btn-color">
              <i className="fa fa-save" /> <Translate W='SAVE' />
            </Button>
            <Button type='button' className="btn-link btn-sm" onClick={() => this.setState({ userInfoModalOpen: false })}>
              <i className="fa fa-close" /> <Translate W='WILL_DO_LATER' />
            </Button>
          </p>
        </form>
        {requesting && <Spinner />}
      </Modal>
    );
  }
}

export default accountInfoModal;
