import React from 'react';
import {act, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import useComplianceRefresh from '../src/Utils/Hooks/useComplianceRefresh';
import reducer, {stateCourseRequest, stateCourseSuccess} from '../src/Redux/Reducers/DashboardReducer';
let mockFocused = true;
jest.mock('@react-navigation/native', () => ({useFocusEffect: callback => require('react').useEffect(() => mockFocused ? callback() : undefined, [callback, mockFocused])}));
jest.mock('../src/Utils/Helpers/NetInfo', () => jest.fn(() => Promise.resolve()));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
function Harness({navigation, params, topic}) { useComplianceRefresh(navigation, params, topic); return null; }

it.each([true, false])('refreshes after returning from Add Credits (topic=%s)', async topic => {
    mockFocused = true;
    const actions = [];
    const store = configureStore({reducer:{DashboardReducer:reducer},middleware:getDefault=>getDefault().concat(()=>next=>action=>{actions.push(action);return next(action);})});
    const navigation = {setParams:jest.fn()};
    const params = {complianceStateId:'1',fullData:{fullData:{id:'topic',earned_credits:0},addCreds:{id:'1'}},mainData:{state_data:{id:'1'}}};
    const tree = () => <Provider store={store}><Harness navigation={navigation} params={params} topic={topic}/></Provider>;
    const screen = render(tree());
    await act(async()=>{await Promise.resolve();});
    const first = actions.filter(a=>a.type===stateCourseRequest.type).at(-1);
    mockFocused = false;screen.rerender(tree());
    mockFocused = true;screen.rerender(tree());
    await act(async()=>{await Promise.resolve();});
    const second = actions.filter(a=>a.type===stateCourseRequest.type).at(-1);
    expect(second.meta.complianceRequestId).not.toBe(first.meta.complianceRequestId);
    expect(second.payload).toEqual({state_id:'1'});
    const data = {state_data:{id:'1',topics:[{id:'other',earned_credits:99},{id:'topic',earned_credits:5}],credits_data:{total_general_earned_credits:5}},speciality_cources:{registered_cources:[]}};
    act(()=>store.dispatch({...stateCourseSuccess({data}),meta:first.meta}));
    expect(navigation.setParams).not.toHaveBeenCalled();
    act(()=>store.dispatch({...stateCourseSuccess({data}),meta:second.meta}));
    if(topic) expect(navigation.setParams).toHaveBeenCalledWith({fullData:{fullData:data.state_data.topics[1],addCreds:data.state_data}});
    else expect(navigation.setParams).toHaveBeenCalledWith({mainData:data});
});
