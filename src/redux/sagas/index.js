import {spawn} from 'redux-saga/effects';

// Sagas
import stationsSaga from './stations-saga';

// Export the root saga
export default function* rootSaga() {
  yield spawn(stationsSaga);
}