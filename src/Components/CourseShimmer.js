import { StyleSheet, View, Dimensions, Platform, ScrollView, FlatList } from "react-native";
import React from "react";
import normalize from "../Utils/Helpers/Dimen";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const CourseShimmer = () => {
    const shimmerDataCourse = Array.from({ length: 3 }).map((_, index) => ({
        id: index,
    }));
    const renderItemCourse = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <SkeletonPlaceholder backgroundColor="#D9D9D9" highlightColor="#525252">
                    <View style={styles.horizontalItem} />
                </SkeletonPlaceholder>
                <View style={styles.linesContainer}>
                    <SkeletonPlaceholder backgroundColor="#D9D9D9" highlightColor="#525252">
                        <View style={styles.line}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainertwo}>
                    <SkeletonPlaceholder backgroundColor="#D9D9D9" highlightColor="#525252">
                        <View style={styles.linetwo}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainerthree}>
                    <SkeletonPlaceholder backgroundColor="#D9D9D9" highlightColor="#525252">
                        <View style={styles.line}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainerfour}>
                    <SkeletonPlaceholder backgroundColor="#D9D9D9" highlightColor="#525252">
                        <View style={styles.linetwo}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
            </View>
        );
    };

    return (
        <>
            
                <View>
                    <ScrollView contentContainerStyle={{paddingBottom:normalize(50)}}>
                    <FlatList
                        data={shimmerDataCourse}
                        renderItem={renderItemCourse}
                        keyExtractor={item => item.id} 
                    />
                    </ScrollView>
                </View>
        </>
    );
};

export default CourseShimmer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: normalize(15),
    },
    itemContainer: {
        margin:5,
        alignItems: 'center',
    },
    horizontalItem: {
        height: normalize(150),
        width: normalize(295),
        backgroundColor: "#FFFFFF",
        borderRadius: normalize(9),
        alignSelf: 'center',
        shadowColor: "#fff",
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 10,
        elevation: 10,
    },
    linesContainer: {
        position: "absolute",
        top: normalize(10),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainertwo: {
        position: "absolute",
        top: normalize(50),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainerthree: {
        position: "absolute",
        top: normalize(80),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainerfour: {
        position: "absolute",
        top: normalize(120),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    linetwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    textLine: {
        width: normalize(120),
        height: 20,
        borderRadius: 4,
    },
});



