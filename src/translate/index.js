import React, { PureComponent, Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../store/action/actionCreator';

export const tr = (W, language) => {
  if (!language) {
    return null;
  }
  const lang = require(`./${language}`);
  return lang.default[W] || W || null;
};

export const trObject = (obj, keyPrefix, language) => {
  if (!obj || !language) return '';
  const lang = `${language[0].toUpperCase()}${language[1]}`;
  const key = `${keyPrefix}${lang}`;
  return obj[key];
};

@withRouter
class Translate extends Component {
  render() {
    const { match, activeLanguage } = this.props;
    let language = activeLanguage;
    if (match && match.params.lang) {
      language = match.params.lang;
    }

    if (this.props.object) {
      return trObject(this.props.object, this.props.keyPrefix, language);
    }

    return tr(this.props.W, language);
  }
}

const mapStateToProps = state => ({
  activeLanguage: state.initial.activeLanguage,
});

Translate.propTypes = {
  W: PropTypes.any,
  activeLanguage: PropTypes.string.isRequired,
  object: PropTypes.object,
  keyPrefix: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onChangeLanguage: lang => dispatch(actions.changeLanguage(lang)),
});

@connect(mapStateToProps, mapDispatchToProps)
export class LanguageProvider extends Component {
  constructor(props) {
    super(props);
    const { activeLanguage } = props;
    if (props.match.params.lang && props.match.params.lang !== activeLanguage) {
      this.props.onChangeLanguage(props.match.params.lang);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { lang: newLang }} } = nextProps;
    const { activeLanguage } = this.props;

    if (newLang && newLang !== activeLanguage) {
      this.props.onChangeLanguage(newLang);
    }
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default connect(mapStateToProps)(Translate);
