import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Input from '../../common/input';
import SelectControl from '../../common/selectControl';
import Button from '../../common/button';
import Translate from '../../../translate';
import queryString from '../../../helpers/query-string';

class SearchElement extends PureComponent {
  state = {
    activeCategory: '',
    inputValue: '',
  };

  componentDidMount() {
    if (this.props.location.search) {
      const { q } = queryString.parse(this.props.location.search);
      this.setState({
        inputValue: q,
      });
    }
  }

  inputChangeHandler = event => {
    this.setState({ inputValue: event.target.value });
  };

  categoryChangeHandler = category => {
    this.setState({ activeCategory: category.value });
  };

  submitHandler = e => {
    const { activeCategory, inputValue } = this.state;
    e.preventDefault();
    this.props.history.replace(`/shop?cat=${activeCategory}&q=${this.state.inputValue}`);
  };

  render() {
    const { categories } = this.props;
    const searchCategories = [{ value: '', text: 'ALL' }, ...categories.map(category => ({
      value: category.slug,
      text: <Translate object={category} keyPrefix='name' />
    }))];

    return (
      <div className="col-xl-6 col-lg-6 bottom-part col-lgmd-60per">
        <div className="header-right-part">
          <div className="category-dropdown select-dropdown">
            <fieldset>
              <SelectControl
                className={'option-drop'}
                selected={searchCategories.find(({ value }) => value === this.state.activeCategory)}
                onChange={this.categoryChangeHandler}
                list={searchCategories}
              />
            </fieldset>
          </div>
          <div className="main-search">
            <div className="header_search_toggle desktop-view">
              <form onSubmit={this.submitHandler}>
                <div className="search-box">
                  <Input
                    value={this.state.inputValue}
                    changed={this.inputChangeHandler}
                    className={'input-text'}
                  />
                  <Button className={'search-btn'} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SearchElement.propTypes = {
  history: PropTypes.any,
  submitHandler: PropTypes.func,
};
export default withRouter(SearchElement);
