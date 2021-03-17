import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Translate from '../../translate/index';

class SelectControl extends React.Component {
  state = {
    active: false,
    selected: this.props.selected || this.props.list[0] || null,
  };

  open = () => {
    const newVal = !this.state.active;
    if (newVal) {
      document.addEventListener('click', this.documentClick);
    }
    this.setState({
      active: newVal,
    });
  };

  close = () => {
    if (this.state.active) {
      this.setState({
        active: false,
      });
      document.removeEventListener('click', this.documentClick);
    }
  };

  documentClick = e => {
    if (!this.wrapper.contains(e.target)) {
      this.close();
    }
  };

  changeHandler = lang => {
    const { selected } = this.state;
    const { onChange } = this.props;
    if (lang.value !== selected.value) {
      this.setState({
        selected: lang,
      });
      this.close();
      onChange(lang);
    } else {
      this.close();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }

  render() {
    const { selected, active } = this.state;
    const { list, title, className, noIcon } = this.props;

    return (
      <div className={`select-component ${className || ''}`}>
        {title ? (
          <div className="ttc-title">
            <Translate W={title} />
          </div>
        ) : null}

        <div className="tt-select" ref={wrapper => (this.wrapper = wrapper)}>
          <div className="tts-label" onClick={this.open}>
            {selected ? <span>{selected.icon} {typeof selected.text === 'string' ? <Translate W={selected.text} /> : selected.text}</span> : ''}

            {!noIcon && <i className="fa fa-angle-down icon_position" />}
          </div>
          {active ? (
            <ul className="tts-list">
              <Scrollbars autoHeight autoHeightMax={156}>
                {list.map(item => (
                  <li
                    className={cx('tts-item', {
                      active_option: item.text === selected.text && item.value === selected.value,
                    })}
                    onClick={() => this.changeHandler && this.changeHandler(item)}
                    key={item.value}
                  >
                    {item.icon} {typeof item.text === 'string' ? <Translate W={item.text} /> : item.text}
                  </li>
                ))}
              </Scrollbars>
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}

SelectControl.propTypes = {
  selected: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
  noIcon: PropTypes.bool,
  onChange: PropTypes.func,
  list: PropTypes.array.isRequired,
};

SelectControl.defaultProps = {
  selected: null,
  title: '',
  className: '',
  noIcon: false,
  onChange: () => {},
};

export default SelectControl;
