import React, { Component } from 'react';

export default class QuantityInput extends Component {
  fieldChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    let v = Math.floor(parseFloat(value));
    if (v < 0) return;

    if (isNaN(v)) {
      v = '';
    }

    if (onChange) {
      onChange(v);
    }
  };

  qtButtonClick = direction => () => {
    const { onChange, value, quantityStep } = this.props;
    const v = Math.round((value + (quantityStep * direction)) * 10) / 10;
    if (v < 0) return;

    if (onChange && !isNaN(v)) {
      onChange(v);
    }
  };

  render() {
    const { value } = this.props;
    return (
      <div className="product-qty">
        <div className="custom-qty">
          <button className="reduced items" type="button" onClick={this.qtButtonClick(-1)}>
            <i className="fa fa-minus" />
          </button>
          <input type="number" className="input-text qty" maxLength={6} value={value && value.toString()} onChange={this.fieldChange} />
          <button className="increase items" type="button" onClick={this.qtButtonClick(1)}>
            <i className="fa fa-plus" />
          </button>
        </div>
      </div>
    );
  }
}
