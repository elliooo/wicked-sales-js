import React from 'react';

const Header = props => {
  return (
    <div className="container-fluid mb-3">
      <div className="row">
        <div className="col bg-dark text-light pl-5 p-2">
          <h2><span className="fas fa-dollar-sign" /> Wicked Sales</h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
