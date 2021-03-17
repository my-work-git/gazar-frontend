import React from 'react';
import HeaderTop from './headerTop';
import MainNavbar from './mainNavbar';
import HeaderBottom from './headerBottom';

const Header = ({ fixCategories , categories, basket_products }) => {
  const items = [
    { name: 'HOME', linkTo: '/' },
    { name: 'SHOP', linkTo: '/shop' },
    { name: 'CONTACT_US', linkTo: '/contact' },
  ];

  return (
    <header className="navbar navbar-custom container-full-sm" id="header">
      <HeaderTop />
      <MainNavbar items={items} />
      <HeaderBottom fixCategories={fixCategories=false} categories={categories} basket_products={basket_products} />
    </header>
  );
};

export default Header;
