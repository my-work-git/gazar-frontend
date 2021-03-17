import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import SectionPanel from '../../components/UI/sectionPanel';
import Button from '../../components/common/button';
import Translate from '../../translate';
import Input from '../../components/common/input';
import { UPDATE_ME } from '../../graph-ql';
import Spinner from '../../components/UI/spinner';
import { refetchUser } from '../../store/action';

@graphql(UPDATE_ME, { name: 'userUpdate' })
class accountInfo extends Component {
  state = {
    editing: false,
    requesting: false,
    error: false,

    formData: {
      first_name: '',
      last_name: '',
      email: '',
    },
  };

  changeEditState = () => {
    const { user } = this.props;
    if (user._id) {
      const formData = { ...this.state.formData };
      Object.keys(formData).map(k => user[k] && (formData[k] = user[k]));
      this.setState({ formData });
    }

    this.setState({ editing: true });
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
      this.setState({ requesting: false, editing: false });
      refetchUser(true);
    }
  };

  renderInfo = ({ first_name, last_name, phoneNumber, email }) => (
    <div>
      <p>
        <Button className="btn-info btn-sm" onClick={this.changeEditState}>
          <i className="fa fa-pencil" /> <Translate W='EDIT' />
        </Button>
      </p>
      <h5><Translate W="NAME" /></h5>
      <p>{first_name} {last_name}</p>
      <h5><Translate W="PHONE_NUMBER" /></h5>
      <p>{phoneNumber}</p>
      <h5><Translate W="EMAIL" /></h5>
      <p>{email}</p>
    </div>
  );

  renderForm = ({ first_name, last_name, email }) => (
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
      <p>
        <Button className="btn-color">
          <i className="fa fa-save" /> <Translate W='SAVE' />
        </Button>
        <Button className="btn-link btn-sm" onClick={() => this.setState({ editing: false })}>
          <i className="fa fa-close" /> <Translate W='CANCEL' />
        </Button>
      </p>
    </form>
  );

  render() {
    const { editing, formData, requesting, error } = this.state;
    const { user } = this.props;

    return (
      <SectionPanel title="ACCOUNT_INFORMATION">
        {error && <div className="alert alert-danger">{<Translate W={error} />}</div>}
        {editing ? this.renderForm(formData) : this.renderInfo(user)}
        {requesting && <Spinner />}
      </SectionPanel>
    );
  }
}

const mapProps = state => ({
  user: state.initial.user,
});

const mapDispatch = dispatch => ({
  refetchUser: (user) => dispatch(refetchUser(user)),
});

export default connect(mapProps, mapDispatch)(accountInfo);
