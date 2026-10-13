import {cmeCourseSaga} from '../src/Redux/Saga/CMESaga';
import {HomelistSaga} from '../src/Redux/Saga/GuestSaga';
import {cmeCourseRequest, cmeCourseSuccess, cmeCourseFailure} from '../src/Redux/Reducers/CMEReducer';
import {HomelistRequest, HomelistSuccess, HomelistFailure} from '../src/Redux/Reducers/GuestReducer';

jest.mock('../src/Utils/Helpers/ApiRequest', () => ({postApi: jest.fn(), getApi: jest.fn(), deleteApi: jest.fn()}));
jest.mock('../src/Utils/Helpers/IPServer', () => ({getPublicIP: () => ''}));
jest.mock('../src/Utils/Helpers/UserAgent', () => jest.fn());

const workers = [[cmeCourseSaga, cmeCourseRequest, cmeCourseSuccess, cmeCourseFailure, true], [HomelistSaga, HomelistRequest, HomelistSuccess, HomelistFailure, false]];
describe.each(workers)('result request metadata', (worker, request, success, failure, selectsAuth) => {
  test.each([true, false])('success keeps payload and optional request tag (tagged=%s)', tagged => {
    const payload = {pageno: 0, search_speciality: ''};
    const meta = {globalResultRequestId: 'current-query'};
    const action = {...request(payload), ...(tagged ? {meta} : {})};
    const iterator = worker(action);
    let apiCall = iterator.next().value;
    if (selectsAuth) apiCall = iterator.next({token: 'token'}).value;
    expect(apiCall.payload.args[1]).toEqual(payload);
    expect(apiCall.payload.args[1].globalResultRequestId).toBeUndefined();
    const data = {conferences: [{id: 1}]};
    const dispatched = iterator.next({status: 200, data}).value.payload.action;
    expect(dispatched).toEqual({...success(data), ...(tagged ? {meta} : {})});
  });
  test.each(['http', 'exception'])('failure retains ownership for %s errors', kind => {
    const meta = {globalResultRequestId: 'current-query'};
    const iterator = worker({...request({}), meta});
    iterator.next();
    if (selectsAuth) iterator.next({token: 'token'});
    const error = {message: 'Failed'};
    const result = kind === 'http' ? iterator.next({status: 500, data: error}) : iterator.throw(error);
    expect(result.value.payload.action).toEqual({...failure(error), meta});
  });
});
