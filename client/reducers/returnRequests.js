import {
  FETCHING_RETURN_REQUESTS,
  RETURN_REQUESTS_SUCCESS,
  RETURN_REQUESTS_FAILURE,
  HANDLING_RETURN_REQUEST,
  HANDLE_RETURN_REQUEST_SUCCESS,
  HANDLE_RETURN_REQUEST_FAILURE,
}
  from '../actions/types';

const initialState = {};

const returnRequests = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_RETURN_REQUESTS: {
      return {
        ...state,
        isFetchingReturnRequests: true,
        returnRequests: null,
        returnRequestsError: null,
      };
    }
    case RETURN_REQUESTS_SUCCESS: {
      return {
        ...state,
        isFetchingReturnRequests: false,
        returnRequests: action.requests,
        pagination: action.pagination,
        returnRequestsError: null,
      };
    }
    case RETURN_REQUESTS_FAILURE: {
      return {
        ...state,
        isFetchingReturnRequests: false,
        returnRequestsError: action.error,
      };
    }
    case HANDLING_RETURN_REQUEST: {
      return {
        ...state,
        isHandlingReturnRequest: true,
      };
    }
    case HANDLE_RETURN_REQUEST_SUCCESS: {
      const requestIndex = state.returnRequests
        .findIndex(request => request.id === action.requestId);
      return {
        ...state,
        returnRequests: [...state.returnRequests.slice(0, requestIndex),
          {
            ...state.returnRequests[requestIndex],
            status: action.status,
          },
          ...state.returnRequests.slice(requestIndex + 1)],
        isHandlingReturnRequest: false,
      };
    }
    case HANDLE_RETURN_REQUEST_FAILURE: {
      return {
        ...state,
        isHandlingReturnRequest: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default returnRequests;

