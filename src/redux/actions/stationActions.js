import {types} from './types';

export function fetchStationData(data) {
  return {
    type: types.SEND_REQUEST_GET_ALL_STATIONS,
    payload: data,
  };
}

export function fetchDataSuccess(stations) {
  return {
    type: types.SEND_REQUEST_GET_ALL_STATIONS_SUCCESS,
    payload: stations,
  };
}

export function fetchDataFailure(error) {
  return {
    type: types.SEND_REQUEST_GET_ALL_STATIONS_FAILURE,
    payload: {},
    error: error,
  };
}
