import React from 'react';
import {act, renderHook, render, fireEvent} from '@testing-library/react-native';
import {useCoursePagination, CourseFilterField, CourseFilterPicker} from '../src/Screen/StateRequiredCourse/CourseListControls';
jest.mock('../src/Components/DropDownHeader', () => ({DropdownPanel:'DropdownPanel'}));
jest.mock('../src/Components/IconTextIn', () => 'Field');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView:require('react-native').View}));
const nearBottom = {nativeEvent:{layoutMeasurement:{height:600},contentOffset:{y:500},contentSize:{height:1200}}};
it('appends courses on scroll and resets on filter change', () => {
 const data=Array.from({length:23},(_,id)=>({id}));
 const {result,rerender}=renderHook(({data,filter})=>useCoursePagination(data,filter),{initialProps:{data,filter:'A'}});
 expect(result.current.items).toEqual(data.slice(0,10));
 act(()=>result.current.onScroll({nativeEvent:{layoutMeasurement:{height:600},contentOffset:{y:0},contentSize:{height:1200}}}));
 expect(result.current.items).toHaveLength(10);
 act(()=>{result.current.onScroll(nearBottom);result.current.onScroll(nearBottom);});
 expect(result.current.items).toEqual(data.slice(0,20));
 act(()=>result.current.onScroll(nearBottom));expect(result.current.items).toEqual(data);expect(result.current.hasMore).toBe(false);
 rerender({data,filter:'B'});expect(result.current.items).toEqual(data.slice(0,10));
 rerender({data:[],filter:'B'});expect(result.current.items).toEqual([]);
});
it('shows a plain selected name and opens the picker',()=>{
 const onPress=jest.fn();const view=render(<CourseFilterField label="State" value="Alabama" onPress={onPress}/>);
 fireEvent.press(view.getByText('Alabama'));expect(onPress).toHaveBeenCalled();
 expect(view.queryByText('Previous')).toBeNull();expect(view.queryByText('Next')).toBeNull();
});
it('searches dropdown options and preserves default selection',()=>{
 const onSelect=jest.fn();const options=[{id:1,name:'Alabama'},{id:2,name:'California'}];
 const view=render(<CourseFilterPicker label="State" visible options={options} selectedId="" onSelect={onSelect} onClose={()=>{}}/>);
 expect(onSelect).toHaveBeenCalledWith(options[0],false);
 act(()=>view.UNSAFE_getByType('DropdownPanel').props.onChangeText('cal'));
 expect(view.UNSAFE_getByType('DropdownPanel').props.data).toEqual([options[1]]);
 act(()=>view.UNSAFE_getByType('DropdownPanel').props.onSelect(options[1]));expect(onSelect).toHaveBeenLastCalledWith(options[1],true);
});
