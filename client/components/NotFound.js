import React from 'react';
import Navbar from './Navbar';
import PageFooter from './PageFooter';

const NotFound = () => {

  return (
      <div>
        <Navbar />
        <div className="row " style = {{ minHeight: "500px" }}>
            <h4 className = "flowtext center text-lighten-4"> <strong>404 Error.</strong>Page was not found</h4>
        </div>
        <PageFooter />
    </div>
  );
};

export default NotFound;
