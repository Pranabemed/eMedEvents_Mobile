import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { AddExpensesFailure, AddExpensesSuccess, againListFailure, againListSuccess, CMEAllowanceFailure, CMEAllowanceSuccess, CMECEListFailure, CMECEListSuccess, CMEListWiseFailure, CMEListWiseSuccess, deleteExpensesFailure, deleteExpensesSuccess } from '../Reducers/CMECEExpensReducer';


let getItem = state => state.AuthReducer;
export function* AddExpensesSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/allowance', action.payload, header);
    console.log('add expenses response: ', response);
    if (response?.status == 200) {
      yield put(AddExpensesSuccess(response?.data));
    } else {
      yield put(AddExpensesFailure(response?.data));
    }
  } catch (error) {
    console.log('add expenses  error:', error);
    yield put(AddExpensesFailure(error));
  }
}
export function* CMECEListSaga() {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi,'master/user_documents?category=expenses', header);
    console.log('add expenses response: ', response);
    if (response?.status == 200) {
      yield put(CMECEListSuccess(response?.data));
    } else {
      yield put(CMECEListFailure(response?.data));
    }
  } catch (error) {
    console.log('list expenses  error:', error);
    yield put(CMECEListFailure(error));
  }
}
export function* againListSaga(action) {
  const taketype = action?.payload;
  console.log(action?.payload,"action?.payload---rrrr---")
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/user_documents?type=${encodeURIComponent(taketype?.type)}&category=expenses`, header);
    console.log('againListRequest: ', response);
    if (response?.status == 200) {
      yield put(againListSuccess(response?.data));
    } else {
      yield put(againListFailure(response?.data));
    }
  } catch (error) {
    console.log('list expenses  error:', error);
    yield put(againListFailure(error));
  }
}
export function* CMECEListWiseSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/documentList', action.payload, header);
    console.log('add expenses response: ', response);
    if (response?.status == 200) {
      yield put(CMEListWiseSuccess(response?.data));
    } else {
      yield put(CMEListWiseFailure(response?.data));
    }
  } catch (error) {
    console.log('add expenses  error:', error);
    yield put(CMEListWiseFailure(error));
  }
}
export function* CMEAllowanceSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/allowanceList', action.payload, header);
    console.log('add expenses response: ', response);
    if (response?.status == 200) {
      yield put(CMEAllowanceSuccess(response?.data));
    } else {
      yield put(CMEAllowanceFailure(response?.data));
    }
  } catch (error) {
    console.log('add expenses  error:', error);
    yield put(CMEAllowanceFailure(error));
  }
}
export function* deleteExpensSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(deleteApi, 'user/allowanceDelete', action.payload, header);
    console.log('add expenses response: ', response);
    if (response?.status == 200) {
      yield put(deleteExpensesSuccess(response?.data));
    } else {
      yield put(deleteExpensesFailure(response?.data));
    }
  } catch (error) {
    console.log('add expenses  error:', error);
    yield put(deleteExpensesFailure(error));
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Expenses/AddExpensesRequest', AddExpensesSaga);
  })(),
  (function* () {
    yield takeLatest('Expenses/CMECEListRequest', CMECEListSaga);
  })(),
  (function* () {
    yield takeLatest('Expenses/CMEListWiseRequest', CMECEListWiseSaga);
  })(),
  (function* () {
    yield takeLatest('Expenses/CMEAllowanceRequest', CMEAllowanceSaga);
  })(),
  (function* () {
    yield takeLatest('Expenses/againListRequest', againListSaga);
  })(),
  (function* () {
    yield takeLatest('Expenses/deleteExpensesRequest', deleteExpensSaga);
  })(),
];

export default watchFunction;
