/**
 * Taskcarditem reusable component module. Provides a React Native UI building block used across screens. Exported members: TaskCardItem, styles.
 */

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from "../Utils/Helpers/Dimen";
import Fonts from '../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../Themes/Colorpath';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../Screen/GlobalSupport/AppContext';

/**
 * Reusable TaskCardItem component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const STATUS_COLORS = ['#FF5E62', '#F1AC4B', '#009E38'];

const TaskCardItem = ({setAddit,addit, item, taskType, tasksKey, navigation, index,setTakestate,takestate }) => {
    const {
            setStatepush
        } = useContext(AppContext);
    const tasks = Array.isArray(item?.[tasksKey]) ? item[tasksKey] : [];
    const statusColor = STATUS_COLORS[index] || Colorpath.ButtonColr;
    const isActionable = tasks.length > 0;

    const handlePress = () => {
        if (!isActionable) return;
        setStatepush(addit);
        navigation.dispatch(
            CommonActions.navigate({
              name: 'Mytasks',
              index: 0,
              params: {
                taskData: { taskData: tasks, statid: takestate, creditID: addit, tasksKey },
              },
            })
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={isActionable ? 0.78 : 1}
            disabled={!isActionable}
            onPress={handlePress}
            style={[styles.container, !isActionable && styles.containerMuted]}
        >
            <View style={[styles.accentBar, { backgroundColor: statusColor }]} />
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.taskCountText}>
                    {`${tasks.length} Task(s)`}
                </Text>
                <Text numberOfLines={1} style={[styles.taskTypeText, { color: statusColor }]}>
                    {taskType}
                </Text>
            </View>
            {isActionable && (
                <View style={styles.iconContainer}>
                    <ArrowIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Colorpath.ButtonColr}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        minHeight: normalize(68),
        width: normalize(152),
        borderRadius: normalize(12),
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5ECF6",
        paddingLeft: normalize(10),
        paddingRight: normalize(10),
        paddingVertical: normalize(11),
        alignItems: "center",
        marginHorizontal: normalize(4),
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    containerMuted: {
        opacity: 0.85,
    },
    accentBar: {
        width: normalize(3.5),
        height: normalize(36),
        borderRadius: normalize(3),
        marginRight: normalize(9),
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    taskCountText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15.5,
        color: "#0F172A",
        fontWeight: "bold",
    },
    taskTypeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        marginTop: normalize(4),
    },
    iconContainer: {
        width: normalize(26),
        height: normalize(26),
        borderRadius: normalize(13),
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: normalize(6),
    },
});

/**
 * Taskcarditem default export.
 *
 * @returns {*}
 */
export default TaskCardItem;
