import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from "../Utils/Helpers/Dimen";
import Fonts from '../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../Themes/Colorpath';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../Screen/GlobalSupport/AppContext';

const TaskCardItem = ({setAddit,addit, item, taskType, tasksKey, navigation, index,setTakestate,takestate }) => {
    const {
            setStatepush
        } = useContext(AppContext);
    const tasks = item[tasksKey] || [];
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.taskCountText}>
                    {`${tasks.length} Task(s)`}
                </Text>
                <Text style={{
                    fontFamily: Fonts.InterMedium,
                    fontSize: 14,
                    color: index === 0 ? "#FF5E62" : index === 1 ? "#F1AC4B" : index === 2 ? "#009E38" : null,
                    fontWeight: "bold",
                    marginTop: normalize(5)
                }}>
                    {taskType}
                </Text>
            </View>
            {tasks.length > 0 && (
                <TouchableOpacity
                onPress={() => {
                    setStatepush(addit);
                    navigation.dispatch(
                        CommonActions.navigate({
                          name: 'Mytasks',
                          index: 0,
                          params: {
                            taskData: {taskData:tasks,statid:takestate,creditID:addit} ,
                          },
                        })
                      );
                }}
                    style={styles.iconContainer}
                >
                    <ArrowIcons
                        name="keyboard-arrow-right"
                        size={30}
                        color={Colorpath.ButtonColr}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: normalize(60),
        width: normalize(140),
        borderRadius: normalize(10),
        backgroundColor: "#FFFFFF",
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        alignItems: "center",
        marginHorizontal: normalize(3),
        // bottom:normalize(20)
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    taskCountText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: "#000000",
        fontWeight: "bold",
    },
    taskTypeText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: "#FF5E62",
        fontWeight: "bold",
        marginTop: normalize(5),
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default TaskCardItem;
