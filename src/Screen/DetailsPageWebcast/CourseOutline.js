/**
 * Course outline screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CourseOutline, toggleExpand, courseOutlineItem.
 */

import { View, Text, TouchableOpacity, useWindowDimensions, FlatList } from 'react-native';
import React, { useState } from 'react';
import Fonts from '../../Themes/Fonts';
import DropIcon from 'react-native-vector-icons/AntDesign';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import moment from 'moment';
import HtmlTableRenderer from './HtmlTableRenderer';

/**
 * Reusable CourseOutline component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CourseOutline = ({ wholedata }) => {
    const { width } = useWindowDimensions();
    const [expandedStates, setExpandedStates] = useState(Array(wholedata?.length).fill(false)); // Track expand/collapse state for each day

        /**
 * Toggle expand utility.
 * @param {number} index - Input value.
 * @returns {void}
 */
const toggleExpand = (index) => {
        const newStates = [...expandedStates];
        newStates[index] = !newStates[index];
        setExpandedStates(newStates);
    };

        /**
 * Course outline item utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const courseOutlineItem = ({ item, index }) => (
        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(0) }}>
            <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                    onPress={() => toggleExpand(index)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: normalize(5),
                    }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: Colorpath.ButtonColr }}>
                        {`Day ${index + 1} - ${moment(item?.sessionDate).format('LL')} | ${`${item?.sessionsCount} Session`}`}
                    </Text>
                    <DropIcon name={expandedStates[index] ? "up" : "down"} color="#000000" size={20} />
                </TouchableOpacity>
                <View style={{ height: 1, width: "100%", backgroundColor: "#DADADA" }} />
                {expandedStates[index] && (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                // marginTop: normalize(5),
                            }}>
                            <View
                                style={{
                                    height: 6,
                                    width: 6,
                                    borderRadius: 5,
                                    backgroundColor: "#000000",
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 16,
                                    color: "#666666",
                                    marginLeft: normalize(5),
                                }}>
                                {`${item?.startingTime} - ${item?.endingTime}`}
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 16,
                                    color: "#000000",
                                    marginLeft: normalize(11),
                                }}>
                                {item?.title}
                            </Text>
                        <HtmlTableRenderer
                            width={width}
                            source={{ html: item?.description }}
                            tagsStyles={{
                                p: {
                                    marginLeft: normalize(11),
                                    fontFamily: Fonts.InterSemiBold,
                                    bottom:normalize(7),
                                    fontSize: 16,
                                    color: "#666666",
                                },
                            }}
                        />
                        </View>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <View>
            <FlatList
                data={wholedata}
                renderItem={courseOutlineItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                    <Text
                        style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            color: Colorpath.grey,
                            fontWeight: 'bold',
                            fontFamily: Fonts.InterMedium,
                            fontSize: 20,
                            paddingTop: normalize(30),
                            // textTransform: 'uppercase',
                        }}>
                        {"No data found"}
                    </Text>
                }
            />
        </View>
    );
};

/**
 * Course outline default export.
 *
 * @returns {*}
 */
export default CourseOutline;
