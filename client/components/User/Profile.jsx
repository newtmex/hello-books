import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserProfile, returnBook } from '../../actions/profile';
import Preloader from '../Common/Preloader.jsx';
import BorrowedBooks from './BorrowedBooks.jsx';
import BorrowRequests from './BorrowRequests.jsx';
import ReturnRequests from './ReturnRequests.jsx';
import Bio from './Bio.jsx';

/** @description container class for a user's profile
 * renders BorrowedBooks, BorrowRequests, ReturnRequests,
 * and Bio presentational components
 *
 * @class Profile
 *
 * @extends {React.Component}
 */
export class Profile extends Component {
  constructor(props) {
    super(props);
    this.renderProfile = this.renderProfile.bind(this);
  }

  /**
   * @method componentDidMount
   *
   * @description gets a user's profile
   *
   * @returns {void}
   */
  componentDidMount() {
    const { user } = this.props;
    this.props.getUserProfile(user.id);
  }

  /**
   * @method renderProfile
   * @description render's a user's profile
   *
   * @returns {Node} react node containing user's profile
   */
  renderProfile() {
    const { isFetchingProfile, profileError, profile } = this.props;

    if (isFetchingProfile) {
      return (
        <div className="row center wrapper">
          <Preloader />
        </div>);
    }
    if (profileError) {
      return (
        <div className="row center wrapper">
          <div className="row">
            <h6 className="red-text flow-text">
              {`Oops couldn't fetch your profile. ${
                this.props.profileError}`}
            </h6>
          </div>
        </div>
      );
    }
    if (profile) {
      const returnRequests = profile.userReturnRequests.filter(request =>
        request.status.toLowerCase() !== 'accepted');
      const borrowRequests = profile.userBorrowRequests.filter(request =>
        request.status.toLowerCase() !== 'accepted');

      return (
        <div className="row" >
          <div className="row card-panel" id="bio">
            <Bio bio={profile} />
          </div>

          <div className="row card-panel profile-div" id="borrowed">
            <h6 className="white-text">Borrowed Books</h6>
            <BorrowedBooks books={profile.userBooks}
              returnRequests={returnRequests} {...this.props} />
          </div>

          <div className="row card-panel profile-div" id="borrow-requests">
            <h6 className="white-text">Borrow Requests</h6>
            <BorrowRequests requests={borrowRequests} />
          </div>

          <div className="row card-panel profile-div" id="return-requests">
            <h6 className="white-text">Return Requests</h6>
            <ReturnRequests requests={returnRequests}
              {...this.props} />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row center" id="profile">
          <h4 className="book-header">Your Profile</h4>
        </div>
        <div className="row" id="profile-container">
          {this.renderProfile()}
        </div>
      </div>
    );
  }
}

// Prop type validation
Profile.propTypes = {
  getUserProfile: propTypes.func.isRequired,
  isFetchingProfile: propTypes.bool,
  profileError: propTypes.string,
  profile: propTypes.object,
};

/**
 * @description maps state to props
 * @param {object} state - redux state
 *
 * @returns {object} props - props mapped to state
 */
const mapStateToProps = state => ({
  ...state.login,
  ...state.profile,
});

// action creators
const actionCreators = {
  getUserProfile,
  returnBook,
};

export default connect(mapStateToProps, actionCreators)(Profile);

