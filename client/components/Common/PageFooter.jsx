import React from 'react';

/**
 * @description stateless component for footer
 * that is displayed while data is loading
 *
 * @returns {Node} - react node containing the Footer component
 */
const PageFooter = () => (
  <footer className="page-footer foot lighten-5">
    <div className="footer-copyright">
      <div className="container center-align grey-text">
        © 2017 Copyright Hello-books
      </div>
    </div>
  </footer>
);

export default PageFooter;
