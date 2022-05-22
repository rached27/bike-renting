import {types} from '../actions/types';

const initialState = {
  loading: false,
  stations: [],
  error: {},
};

export default stationsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.SEND_REQUEST_GET_ALL_STATIONS:
      return {
        ...state,
        loading: true,
      };
    case types.SEND_REQUEST_GET_ALL_STATIONS_SUCCESS:
      return {
        ...state,
        stations: payload,
        loading: false,
      };
    case types.SEND_REQUEST_GET_ALL_STATIONS_FAILURE:
      return {
        ...state,
        stations: {},
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};