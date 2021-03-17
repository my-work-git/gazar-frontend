import React from 'react';
import PropTypes from 'prop-types';
import SideBarCard from './sidebarCard';

const SideBarCards = ({ items }) => (
  <div className="ser-feature-block">
    <div>
      <div>
        <ul>
          {items &&
            items.map(item => (
              <SideBarCard
                key={item.title}
                description={item.description}
                title={item.title}
                iconImage={item.iconImage}
              />
            ))}
        </ul>
      </div>
    </div>
  </div>
);

SideBarCards.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SideBarCards;
