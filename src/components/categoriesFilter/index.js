import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Translate from '../../translate/index';
import CategoryCheckbox from './categoryCheckbox';
import { getUrlCategories, strigifyCategories } from '../../helpers';

class CategoriesFilter extends PureComponent {
  onFilterChange = slug => e => {
    const { location, categories } = this.props;
    let preselectedCategories = getUrlCategories(location.search);
    if (e.target.checked) {
      preselectedCategories.push(slug);
    } else {
      if (preselectedCategories.length === 0) {
        preselectedCategories = categories.map(c => c.slug);
      }
      preselectedCategories.splice(preselectedCategories.indexOf(slug), 1);
    }

    const categoriesQuery = strigifyCategories(preselectedCategories);
    this.props.history.replace(`${location.pathname}?${categoriesQuery}`);
  };

  render() {
    const { categories, location } = this.props;
    const preselectedCategories = getUrlCategories(location.search);
    return (
      <div className="sidebar-box listing-box mb-40">
        <div className="sidebar-title">
          <h4>
            <span>
              <Translate W="CATEGORIES" />
            </span>
          </h4>
        </div>
        <ul>
          {categories &&
            categories.map(category => (
              <CategoryCheckbox
                key={category._id}
                id={category._id}
                name={<Translate object={category} keyPrefix='name' />}
                slug={category.slug}
                productCount={category.productCount}
                onChange={this.onFilterChange(category.slug)}
                checked={preselectedCategories.length > 0 ? preselectedCategories.indexOf(category.slug) !== -1 : true}
              />
            ))}
        </ul>
      </div>
    );
  }
}

export { CategoryCheckbox };
export default withRouter(CategoriesFilter);
