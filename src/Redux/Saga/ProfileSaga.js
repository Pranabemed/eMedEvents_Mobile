/**
 * Profile saga Redux-Saga module. Coordinates side effects, API calls, and watcher registration for profile. Exported members: getItem, profileContactSaga, profilepersonalSaga, profilePicSaga, professionInfoSaga, stateLicListSaga, deleteStateLicSaga, boardListSaga, deleteBoardSaga, empAddProfSaga, searchHospSaga, watchFunction.
 */

import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { boardListDeleteFailure, boardListDeleteSuccess, boardListProfileFailure, boardListProfileSuccess, contactInfoFailure, contactInfoSuccess, EmpAddProfileFailure, EmpAddProfileSuccess, personalInfoFailure, personalInfoSuccess, professionInfoFailure, professionInfoSuccess, profilepicFailure, profilepicSuccess, SearchHospFailure, SearchHospSuccess, stateLicenseDeleteFailure, stateLicenseDeleteSuccess, stateLicenseListFailure, stateLicenseListRequest, stateLicenseListSuccess } from '../Reducers/ProfileReducer';


/**
 * Redux-Saga worker for get item.
 * @param {*} state - Input value.
 * @returns {*}
 */
let getItem = state => state.AuthReducer;
/**
 * Executes the profileContactSaga saga.
 *
 * @function profileContactSaga
 * @param {Object} action - Saga action payload.
 * @returns {Generator}
 */
export function* profileContactSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/contactInformation', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(contactInfoSuccess(response?.data));
    } else {
      yield put(contactInfoFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(contactInfoFailure(error));
  }
}
/**
 * Executes the profilepersonalSaga saga.
 *
 * @function profilepersonalSaga
 * @param {Object} action - Saga action payload.
 * @returns {Generator}
 */
export function* profilepersonalSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/personalInformation', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(personalInfoSuccess(response?.data));
    } else {
      yield put(personalInfoFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(personalInfoFailure(error));
  }
}
/**
 * Executes the profilePicSaga saga.
 *
 * @function profilePicSaga
 * @param {Object} action - Saga action payload.
 * @returns {Generator}
 */
export function* profilePicSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/updateProfilePicture', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(profilepicSuccess(response?.data));
    } else {
      yield put(profilepicFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(profilepicFailure(error));
  }
}
export function* professionInfoSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    const { specialities_data, ...apiPayload } = action?.payload || {};
    let response = yield call(postApi, 'user/professionalInformation', specialities_data ? apiPayload : action?.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      const cachedProfessionRaw = yield call(AsyncStorage.getItem, constants.PROFESSION);
      const cachedProfession = cachedProfessionRaw ? JSON.parse(cachedProfessionRaw) : {};
      const rawProf = action?.payload?.profession ?? cachedProfession?.profession;
      const rawProfType = action?.payload?.profession_type ?? cachedProfession?.profession_type;
      let cleanProf = String(rawProf || '').trim();
      const cleanType = String(rawProfType || '').trim();
      cleanProf = cleanProf.replace(/(\s*-\s*[\w\d]+)(?:\1)+$/i, '$1').trim();
      if (cleanType) {
        const escaped = cleanType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        cleanProf = cleanProf.replace(new RegExp(`(\\s*-\\s*${escaped})+\\s*$`, 'i'), '').trim();
      }
      const profMatch = cleanProf.match(/^(.*?)\s*-\s*[\w\d]+$/);
      if (profMatch && profMatch[1]) {
        cleanProf = profMatch[1].trim();
      }
      const preservedProf =
        action?.payload?.profession && action?.payload?.profession.includes('-')
          ? action?.payload?.profession
          : cleanProf && cleanType
            ? `${cleanProf} - ${cleanType}`
            : action?.payload?.profession || cleanProf || cachedProfession?.profession;

      const updatedProfession = {
        ...cachedProfession,
        profession: preservedProf,
        profession_type: (cleanType || action?.payload?.profession_type) ?? cachedProfession?.profession_type,
        designation: (cleanType || action?.payload?.designation) ?? cachedProfession?.designation,
        specialities: specialities_data || (typeof action?.payload?.specialities === 'object' && !Array.isArray(action?.payload?.specialities) ? action?.payload?.specialities : cachedProfession?.specialities),
      };
      yield call(
        AsyncStorage.setItem,
        constants.PROFESSION,
        JSON.stringify(updatedProfession)
      );
      yield put(professionInfoSuccess(response?.data));
    } else {
      yield put(professionInfoFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(professionInfoFailure(error));
  }
}
export function* stateLicListSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/licensureInformationList', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(stateLicenseListSuccess(response?.data));
    } else {
      yield put(stateLicenseListFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(stateLicenseListFailure(error));
  }
}
export function* deleteStateLicSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(deleteApi, 'user/licensureInformationDelete', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(stateLicenseDeleteSuccess(response?.data));
    } else {
      yield put(stateLicenseDeleteFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(stateLicenseDeleteFailure(error));
  }
}
export function* boardListSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/certificationInformationList', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(boardListProfileSuccess(response?.data));
    } else {
      yield put(boardListProfileFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(boardListProfileFailure(error));
  }
}
export function* deleteBoardSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(deleteApi, 'user/certificationInformationDelete', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(boardListDeleteSuccess(response?.data));
    } else {
      yield put(boardListDeleteFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(boardListDeleteFailure(error));
  }
}
export function* empAddProfSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/employmentInformation', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(EmpAddProfileSuccess(response?.data));
    } else {
      yield put(EmpAddProfileFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(EmpAddProfileFailure(error));
  }
}
export function* searchHospSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(getApi, `master/SearchHospital?cityid=${action?.payload?.cityid}&stateid=${action?.payload?.stateid}`, header);
    console.log('profession response: ', response);
    if (response?.status == 200) {
      yield put(SearchHospSuccess(response?.data));
    } else {
      yield put(SearchHospFailure(response?.data));
    }
  } catch (error) {
    console.log('profile error:', error);
    yield put(SearchHospFailure(error));
  }
}
/**
 * Watch function array.
 * @returns {Array}
 */
const watchFunction = [
  (function* () {
    yield takeLatest('Profile/contactInfoRequest', profileContactSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/profilepicRequest', profilePicSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/personalInfoRequest', profilepersonalSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/professionInfoRequest', professionInfoSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/stateLicenseListRequest', stateLicListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/stateLicenseDeleteRequest', deleteStateLicSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/boardListProfileRequest', boardListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/boardListDeleteRequest', deleteBoardSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/EmpAddProfileRequest', empAddProfSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/SearchHospRequest', searchHospSaga);
  })()
];

/**
 * Profile saga default export.
 *
 * @returns {*}
 */
export default watchFunction;
