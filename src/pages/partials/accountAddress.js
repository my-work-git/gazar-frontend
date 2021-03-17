import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import SectionPanel from '../../components/UI/sectionPanel';
import Translate, { tr } from '../../translate';
import SegmentBlock from '../../components/segmentBlock';
import Button from '../../components/common/button';
import { refetchUser } from '../../store/action';
import Spinner from '../../components/UI/spinner';
import Input from '../../components/common/input';
import { ADD_USER_ADDRESS, REMOVE_USER_ADDRESS } from '../../graph-ql';

@graphql(ADD_USER_ADDRESS, { name: 'addAddress' })
@graphql(REMOVE_USER_ADDRESS, { name: 'removeAddress' })
class accountAddress extends Component {
  state = {
    formData: {
      notes: '',
      address: '',
    },
    suggestions: [],
    error: false,
    requesting: false,
  };

  fieldChange = ({ target: { name, value } }) => this.setState({ formData: { ...this.state.formData, [name]: value } });

  addressChangeHandler = value => this.setState({
    formData: { ...this.state.formData, address: value },
  });

  addNewAddress = async (e) => {
    e.preventDefault();
    const { formData } = this.state;
    if (formData.address.length === 0) {
      this.setState({ error: 'ADDRESS_IS_REQUIRED' });
      return;
    }

    this.setState({ error: false, requesting: true });
    const { addAddress } = this.props;
    const res = await addAddress({ variables: { ...formData }});
    const { error, message } = res.data.addAddressForMe;
    if (error) {
      this.setState({ error: message, requesting: false });
    } else {
      this.props.refetchUser(true);
      this.setState({ formData: {address: '', notes: ''} , requesting: false });
    }
  };

  removeAddress = address => async () => {
    const { removeAddress, activeLanguage } = this.props;
    if (!confirm(tr('ARE_YOU_SURE_REMOVE_ADDRESS', activeLanguage))) {
      return;
    }

    this.setState({ error: false, requesting: true });
    const res = await removeAddress({ variables: { address: address.address }});
    const { error, message } = res.data.removeAddressForMe;
    if (error) {
      this.setState({ error: message, requesting: false });
    } else {
      this.props.refetchUser(true);
      this.setState({ requesting: false });
    }
  };

  render() {
    const { user: { addresses } } = this.props;
    const { formData: { notes, address }, requesting } = this.state;
    return (
      <SectionPanel title="MY_ADDRESSES">
        <div className="row m-0">
          <div className="col-md-6 col-sm-12 col-xs-12">
            {addresses && addresses.length === 0 && (
              <h5><i><Translate W="DONT_HAVE_ADDRESSES" /></i></h5>
            )}
            {addresses && addresses.map((address, i) => (
              <SegmentBlock key={i} title=" ">
                <Button className="btn-link btn-sm pull-right" onClick={this.removeAddress(address)}>
                  <i className="fa fa-trash" /> <Translate W='REMOVE' />
                </Button>
                <h5><Translate W="SHIPPING_ADDRESS" /></h5>
                <p>{address.address}</p>
                <div style={{ marginTop: 10 }} />
                <h5><Translate W="ORDER_NOTES" /></h5>
                <p>{address.notes}</p>
                <div style={{ marginTop: 10 }} />
                <h5><Translate W="ORDER_COUNT" /></h5>
                <p>{address.orderCount}</p>
              </SegmentBlock>
            ))}
          </div>
          <div className="col-md-6 col-sm-12 col-xs-12">
            <form className="main-form full" onSubmit={this.addNewAddress}>
              <div className="input-box">
                <Input label="SHIPPING_ADDRESS" value={address} name='address' changed={this.fieldChange} />
              </div>
              <div className="input-box">
                <label>
                  <Translate W="ORDER_NOTES" />
                </label>
                <textarea name='notes' onChange={this.fieldChange} rows={3} value={notes} />
              </div>
              <div>&nbsp;</div>
              <p>
                <Button className="btn-color">
                  <i className="fa fa-save" /> <Translate W='SAVE' />
                </Button>
              </p>
            </form>
          </div>
        </div>
        {requesting && <Spinner />}
      </SectionPanel>
    );
  }
}

const mapProps = state => ({
  user: state.initial.user,
  activeLanguage: state.initial.activeLanguage,
});

const mapDispatch = dispatch => ({
  refetchUser: (user) => dispatch(refetchUser(user)),
});

export default connect(mapProps, mapDispatch)(accountAddress);
