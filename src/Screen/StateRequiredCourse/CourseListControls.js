import React, {useEffect, useRef, useState} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DropdownPanel} from '../../Components/DropDownHeader';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';

export function useCoursePagination(data, filterId) {
    const [visibleCount, setVisibleCount] = useState(10);
    const requestedCount = useRef(null);
    const list = Array.isArray(data) ? data : [];
    useEffect(() => {
        setVisibleCount(10);
        requestedCount.current = null;
    }, [data, filterId]);
    const hasMore = visibleCount < list.length;
    const onScroll = ({nativeEvent}) => {
        const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
        if (!hasMore || requestedCount.current === visibleCount) return;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 160) {
            requestedCount.current = visibleCount;
            setVisibleCount(count => Math.min(count + 10, list.length));
        }
    };
    return {items: list.slice(0, visibleCount), hasMore, onScroll};
}

export function CourseFilterField({label, value, onPress, disabled}) {
    return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${label}: ${value || 'Select'}`}
        accessibilityState={{disabled: Boolean(disabled)}} disabled={disabled} onPress={onPress}
        style={{flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12}}>
        <Text numberOfLines={1} style={{fontSize:16, color:Colorpath.black, flex:1}}>{value || `Select ${label}`}</Text>
        <ArrowIcon name="keyboard-arrow-down" size={24} color={Colorpath.black} style={{marginLeft:6}}/>
    </TouchableOpacity>;
}

export function CourseFilterPicker({label, visible, onClose, options, selectedId, onSelect}) {
    const [search, setSearch] = useState('');
    const list = Array.isArray(options) ? options : [];
    useEffect(() => { if (visible) setSearch(''); }, [visible]);
    // Preserve the original filter's default-selection behavior.
    useEffect(() => {
        if (list.length && !list.some(item => String(item.id) === String(selectedId))) onSelect(list[0], false);
    }, [options, selectedId]);
    return <Modal visible={visible} onRequestClose={onClose} animationType="slide">
        <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF'}}>
            <DropdownPanel title={label} required={false} onClose={onClose} value={search} onChangeText={setSearch}
                placeholder={`Search ${label}`} data={list.filter(item => String(item.name || '').toLowerCase().includes(search.trim().toLowerCase()))}
                getLabel={item => item.name} onSelect={item => onSelect(item, true)}
                ListEmptyComponent={<Text style={{padding:20, textAlign:'center'}}>No results found</Text>}/>
        </SafeAreaView>
    </Modal>;
}
