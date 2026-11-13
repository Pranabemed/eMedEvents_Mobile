import reducer, {stateDashboardRequest, stateDashboardSuccess, stateDashboardFailure} from '../src/Redux/Reducers/DashboardReducer';

test('switching states marks old data pending until the selected response arrives', () => {
 let state = reducer(undefined, {...stateDashboardSuccess({data:{tasks_data:{}}}),meta:{stateId:'1'}});
 expect(state.stateDashboardResponseStateId).toBe('1');
 state = reducer(state, stateDashboardRequest({state_id:'2'}));
 expect(state.stateDashboardPending).toBe(true);
 expect(state.stateDashboardResponseStateId).toBe('1');
 state = reducer(state, {...stateDashboardSuccess({data:{tasks_data:{}}}),meta:{stateId:'2'}});
 expect(state.stateDashboardPending).toBe(false);
 expect(state.stateDashboardResponseStateId).toBe('2');
});
test('failure ends loading without relabelling the previous response', () => {
 let state = reducer(undefined, {...stateDashboardSuccess({data:{}}),meta:{stateId:'1'}});
 state = reducer(state, stateDashboardRequest({state_id:'2'}));
 state = reducer(state, {...stateDashboardFailure({}),meta:{stateId:'2'}});
 expect(state.stateDashboardPending).toBe(false);
 expect(state.stateDashboardFailedStateId).toBe('2');
 expect(state.stateDashboardResponseStateId).toBe('1');
});
