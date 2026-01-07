import { StyleSheet, View, Dimensions, Platform, ScrollView } from "react-native";
import React from "react";
import normalize from "../Utils/Helpers/Dimen";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Carousel from 'react-native-snap-carousel';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const HomeShimmer = () => {
    const carouselItems = Array.from({ length: 5 }).map((_, index) => ({
        id: index,
    }));
    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                    <View style={styles.horizontalItem} />
                </SkeletonPlaceholder>
                <View style={styles.circle}>
                    <View style={{ width: normalize(120),bottom:normalize(13) }}>
                        <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                            <View style={{gap:normalize(5),zIndex:1,position:"absolute"}}>
                                <View style={{
                                    width: normalize(120),
                                    height: normalize(15),
                                    borderRadius: 4,
                                }} />
                                <View style={{
                                    width: normalize(120),
                                    height: normalize(15),
                                    borderRadius: 4,
                                }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={styles.circlePlaceholder} />
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainer}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={styles.line}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainertwo}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={styles.linetwo}>
                            <View style={styles.textLine} />
                            <View style={styles.textLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={styles.linesContainersix}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: normalize(60), width: normalize(230), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
            </View>
        );
    };

    return (
        <>
            <ScrollView contentContainerStyle={{ paddingBottom: normalize(10) }}>
                <View style={styles.container}>
                    <Carousel
                        layout={'default'}
                        data={carouselItems}
                        sliderWidth={windowWidth}
                        itemWidth={
                            Platform.OS === 'ios' ? windowWidth - normalize(30) : windowWidth - normalize(30)
                        }
                        itemHeight={windowHeight * 0.9}
                        sliderHeight={windowHeight * 0.9}
                        renderItem={renderItem}
                        firstItem={0}
                        onSnapToItem={(val) => { console.log(val) }}
                    />
                </View>
                <View>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: normalize(60), width: normalize(290), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                            <View style={{ height: normalize(60), width: normalize(140), borderRadius: normalize(5) }} />
                            <View style={{ height: normalize(60), width: normalize(140), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: normalize(60), width: normalize(290), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: normalize(60), width: normalize(290), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                    <SkeletonPlaceholder backgroundColor="#F1F9FF" highlightColor="#CCECFF">
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: normalize(60), width: normalize(290), borderRadius: normalize(5) }} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
            </ScrollView>
        </>
    );
};

export default HomeShimmer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: normalize(15),
    },
    itemContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    horizontalItem: {
        height: normalize(180),
        width: normalize(300),
        backgroundColor: "#FFFFFF",
        borderRadius: normalize(9),
        alignSelf: 'center',
        shadowColor: "#fff",
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 10,
        elevation: 10,
    },
    circle: {
        position: "absolute",
        zIndex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: normalize(40),
        top: normalize(10),
        // backgroundColor:"yellow",
        width: normalize(260),
    },
    circlePlaceholder: {
        width: normalize(65),
        height: normalize(65),
        borderRadius: normalize(60),
    },
    linesContainer: {
        position: "absolute",
        top: normalize(100),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainertwo: {
        position: "absolute",
        top: normalize(140),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainerthree: {
        position: "absolute",
        top: normalize(250),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainerfour: {
        position: "absolute",
        top: normalize(270),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainerfive: {
        position: "absolute",
        top: normalize(305),
        left: '50%',
        marginLeft: -normalize(130),
        zIndex: 1,
        width: normalize(260),
    },
    linesContainersix: {
        position: "absolute",
        top: normalize(340),
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
