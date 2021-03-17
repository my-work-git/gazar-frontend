import React, { Component } from 'react';
import Translate from '../../translate';
import Autosuggest from 'react-autosuggest';

class AutoComplete extends Component {
  state = {
    suggestions: [],
    isFinalSelected: false,
  };

  themeOptions = {
    suggestionsContainerOpen: {
      position: 'absolute',
      zIndex: 1,
      background: 'white',
      width: 'calc(100% - 30px)',
      border: '1px solid #eeeeee',
      borderBottom: 0,
    },
    suggestion: {
      borderBottom: '1px solid #eeeeee',
      width: '100%',
      padding: '5px 15px',
      cursor: 'pointer',
    },
    suggestionHighlighted: {
      backgroundColor: '#90d3a6',
      color: '#fff',
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    ymaps.suggest(value, {
      boundedBy: [[40.177628, 44.512546], [40.177628, 44.512546]],
    }).then((suggestions) => this.setState({
      suggestions,
    }));
  };

  renderSuggestion = suggestion => (
    <div>
      {suggestion.value}
    </div>
  );

  getSuggestionValue = suggestion => this.props.onChange(suggestion.value);

  /**
   * Autosuggest will call this function every time you need to clear suggestions.
   */
  onSuggestionsClearRequested = _ => this.setState({
    suggestions: [],
  });

  addressFieldChangeHandler = event => {
    /**
     * As onChange works after clicking on item,
     * and event target in AutoSuggest is <div>suggestion<div>,
     * so we check target type not to get undefined case
     */
    if (event.target.type) {
      this.props.onChange(event.target.value);
      this.setState({
        isFinalSelected: false,
      });
    } else {
      this.setState({
        isFinalSelected: true,
      });
    }
  };

  /**
   * Here we check, whether state is selected or only typed,
   * if it is typed than we remove address.
   */
  onBlur = _ => !this.state.isFinalSelected && this.props.onChange('');

  render() {
    const { value, label } = this.props;
    const { suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.addressFieldChangeHandler,
      onBlur: this.onBlur,
    };

    return (
      <div className="input-box">
        <label>
          <Translate W={label} />
        </label>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          theme={this.themeOptions}
        />
      </div>
    );
  }
}

export default AutoComplete;
