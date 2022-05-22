import {put, call, takeEvery} from 'redux-saga/effects';
import {types} from '../actions/types';
import {
  getAllStations,
} from '../apis/stationsApi';

function* getStations() {
  try {
    const stations = yield call(getAllStations);
    yield put({type: types.SEND_REQUEST_GET_ALL_STATIONS_SUCCESS, payload: stations});
  } catch (err) {
    yield put({type: types.SEND_REQUEST_GET_ALL_STATIONS_FAILURE, payload: error});
    console.log(err);
  }
}

export default function* stationsSaga() {
  yield takeEvery(types.SEND_REQUEST_GET_ALL_STATIONS, getStations);
}