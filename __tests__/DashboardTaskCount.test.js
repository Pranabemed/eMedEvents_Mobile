import React from 'react';
import {act, create} from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';
import TaskCardItem from '../src/Components/Taskcarditem';
const mockSetStatepush = jest.fn();
jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({
  AppContext: require('react').createContext({setStatepush: (...args) => mockSetStatepush(...args)}),
}));
jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
let tree;
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null;});
test.each(['due_in_30_days', 'due_in_60_days', 'due_in_90_days'])('%s counts courses and retains the renewal action', async tasksKey => {
  const tasks = [{id: 1, button_display_text: 'Start'}, {title: 'License', button_display_text: 'Update'}];
  const navigation = {dispatch: jest.fn()};
  await act(async () => {tree = create(<TaskCardItem tasksKey={tasksKey} item={{[tasksKey]: tasks}} navigation={navigation} />);});
  expect(tree.root.findAll(node => node.props.children === '1 Task(s)').length).toBeGreaterThan(0);
  await act(async () => tree.root.findByType(TouchableOpacity).props.onPress());
  expect(navigation.dispatch).toHaveBeenCalledWith(expect.objectContaining({payload: expect.objectContaining({params: expect.objectContaining({taskData: expect.objectContaining({taskData: tasks})})})}));
});
test.each([
  [[{button_display_text: 'Update'}], '0 Task(s)', false],
  [[], '0 Task(s)', true],
  [[{button_display_text: 'Start'}, {button_display_text: 'Resume'}, {button_display_text: 'Update'}], '2 Task(s)', false],
])('counts %j without removing available actions', async (tasks, label, disabled) => {
  await act(async () => {tree = create(<TaskCardItem tasksKey="due_in_30_days" item={{due_in_30_days: tasks}} />);});
  expect(tree.root.findAll(node => node.props.children === label).length).toBeGreaterThan(0);
  expect(tree.root.findByType(TouchableOpacity).props.disabled).toBe(disabled);
});
