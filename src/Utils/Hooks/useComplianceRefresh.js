import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { stateCourseRequest } from '../../Redux/Reducers/DashboardReducer';
import connectionrequest from '../Helpers/NetInfo';
import showErrorAlert from '../Helpers/Toast';

export default function useComplianceRefresh(navigation, params, topicScreen) {
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.DashboardReducer);
    const latestParams = useRef(params);
    latestParams.current = params;
    const requestId = useRef(null);
    const focused = useRef(false);
    const stateId = params?.complianceStateId ?? (topicScreen
        ? params?.fullData?.addCreds?.state_id ?? params?.fullData?.addCreds?.id
        : params?.mainData?.state_data?.state_id ?? params?.mainData?.state_data?.id);

    useFocusEffect(useCallback(() => {
        focused.current = true;
        let active = true;
        if (stateId != null && stateId !== '') {
            const id = nanoid();
            requestId.current = id;
            connectionrequest().then(() => {
                if (active) dispatch({ ...stateCourseRequest({ state_id: stateId }), meta: { complianceRequestId: id } });
            }).catch(() => {
                if (active) showErrorAlert('Please connect to Internet to refresh credits');
            });
        }
        return () => { active = false; focused.current = false; };
    }, [dispatch, stateId]));

    useEffect(() => {
        if (!focused.current || !requestId.current || reducer.stateCourseRequestId !== requestId.current || reducer.stateCourseLoading) return;
        const data = reducer.stateCourseResponse?.data;
        if (!data?.state_data) return;
        if (topicScreen) {
            const previous = latestParams.current?.fullData;
            const topic = previous?.fullData;
            const updated = data.state_data.topics?.find(item => topic?.id != null
                ? String(item.id) === String(topic.id) : item.name === topic?.name);
            if (!updated) return;
            navigation.setParams({ fullData: { ...previous, fullData: updated, addCreds: data.state_data } });
        } else {
            navigation.setParams({ mainData: data });
        }
        requestId.current = null;
    }, [navigation, reducer.stateCourseRequestId, reducer.stateCourseLoading, reducer.stateCourseResponse, topicScreen]);
}
