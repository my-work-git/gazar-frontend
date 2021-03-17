import React from 'react';

const Sidebar = ({ fixCategories, marginTop, children }) => (
  <div className="col-xl-2 col-lg-3 col-lgmd-20per mt-30 left-side float-none-sm ">
    <div className="sidebar-block sideBar" style={{ marginTop: fixCategories && marginTop }}>
      {children}
    </div>
  </div>
);

export default Sidebar;
