import { View, Text, Image, FlatList, TouchableOpacity, Pressable, Platform, Dimensions, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import ArrowIconsAnt from 'react-native-vector-icons/AntDesign';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import TaskCardItem from './Taskcarditem';
import { CommonActions } from '@react-navigation/native';
import Buttons from './Button';
import StateRequireditem from './StateRequired';
import ResumeDash from './ResumeDash';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const Nonphysicianprofile = ({allNoDetData, addit, finddata, handleButtonPress, navigation, DashboardReducer }) => {
    const stateHit = finddata?.my_recommendations?.mandatory_courses;
    const specHit = finddata?.my_recommendations?.speciality_courses;
    const [valourse, setValcourse] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const carouselReffind = useRef(null);
    console.log(DashboardReducer?.dashboardResponse?.data?.my_recommendations?.length > 0, "DashboardReducer-----------");
    const finalData = DashboardReducer?.dashboardResponse?.data?.my_recommendations?.length > 0 && stateHit?.length == 0 && specHit?.length == 0;
    return (
        <View style={{ paddingVertical: normalize(15) }}>
            {/* {DashboardReducer?.dashboardResponse?.data?.my_activities?.length > 0 && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(0) }}>
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: "NonMain",
                                    params: { myact: { realdata: DashboardReducer?.dashboardResponse?.data?.my_activities, creditData: handleButtonPress } },
                                }
                            ]
                        })
                    );
                }}
                    style={{
                        flexDirection: "row",
                        height: normalize(95),
                        width: normalize(300),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(10),
                        // paddingVertical: normalize(10),
                        alignItems: "center",
                        borderWidth: 0.5,
                        borderColor: "#DADADA"
                    }}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#000000",
                                fontWeight: "bold",
                            }}
                        >
                            {"Start or Resume the online courses you have registered."}
                        </Text>
                        <View style={{ marginTop: normalize(10) }}>
                            <Buttons
                                onPress={() => {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: "NonMain",
                                                    params: { myact: { realdata: DashboardReducer?.dashboardResponse?.data?.my_activities, creditData: handleButtonPress } },
                                                }
                                            ]
                                        })
                                    );
                                }}
                                height={normalize(40)}
                                width={normalize(270)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text="My activities"
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>} */}
            {finddata?.my_activities?.length > 0 ? <View style={{ paddingVertical: normalize(10) }}>
                <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Course", params: { myact: { realdata: DashboardReducer?.dashboardResponse?.data?.my_activities, creditData: handleButtonPress } }, }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(13) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000" }}>{"Start or Resume Courses"}</Text>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr }}>{"View All"}</Text>
                </Pressable>
                <Carousel
                    ref={carouselReffind}
                    layout={'default'}
                    data={finddata?.my_activities}
                    marginTop={normalize(0)}
                    sliderWidth={windowWidth}
                    itemWidth={
                        Platform.OS === 'ios' ? windowWidth - normalize(20) : windowWidth - normalize(20)
                    }
                    itemHeight={windowHeight * 0.9}
                    sliderHeight={windowHeight * 0.9}
                    scrollAnimationDuration={1000}
                    renderItem={({ item, index }) => <ResumeDash allNoDetData={allNoDetData} item={item} index={index} addit={addit} />}
                    firstItem={0}
                    onSnapToItem={(index) => {
                        setValcourse(index);
                    }}
                />
                <View style={styles.paginationContainer}>
                    {finddata?.my_activities && finddata?.my_activities?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                valourse === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
            </View> : null}
            {stateHit?.length > 0 ? <View style={{ height: normalize(220), width: normalize(320), backgroundColor: "#b6d7ff", marginTop: normalize(10) }}>
                <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "StateCourse", params: { back: "tabnav" } }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(13), marginTop: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000" }}>{"State-required Courses"}</Text>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr }}>{"View All"}</Text>
                </Pressable>
                <FlatList
                    data={stateHit}
                    horizontal
                    renderItem={({ item, index }) => <StateRequireditem allNoDetData={allNoDetData} navigation={navigation} addit={addit} item={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View> : null}
            {specHit?.length > 0 ? <View style={{ marginTop: normalize(10) }}>
                <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "SpecialityCourseSlide", params: { back: "tabnav" } }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(15), marginTop: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000" }}>{"Specialty Courses"}</Text>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr }}>{"View All"}</Text>
                </Pressable>
                <FlatList
                    data={specHit}
                    horizontal
                    renderItem={({ item, index }) => <StateRequireditem allNoDetData={allNoDetData} navigation={navigation} addit={addit} item={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View> : null}
            {DashboardReducer?.dashboardResponse?.data?.my_recently_viewed?.length > 0 && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: "NonMain",
                                    params: { myact: { realdata: DashboardReducer?.dashboardResponse?.data?.my_recently_viewed, creditData: handleButtonPress } },
                                }
                            ]
                        })
                    );
                }}
                    style={{
                        flexDirection: "row",
                        height: normalize(95),
                        width: normalize(300),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(10),
                        // paddingVertical: normalize(10),
                        alignItems: "center",
                        borderWidth: 0.5,
                        borderColor: "#DADADA"
                    }}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#000000",
                                fontWeight: "bold",
                            }}
                        >
                            {"Your recently viewed courses are listed below for easy access and continued learning."}
                        </Text>
                        <View style={{ marginTop: normalize(10) }}>
                            <Buttons
                                onPress={() => {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: "NonMain",
                                                    params: { myact: { realdata: DashboardReducer?.dashboardResponse?.data?.my_recently_viewed, creditData: handleButtonPress, recnt: "recnt" } },
                                                }
                                            ]
                                        })
                                    );
                                }}
                                height={normalize(40)}
                                width={normalize(270)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text="Recently viewed"
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>}
            {finalData &&
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(0) }}>
                    <TouchableOpacity onPress={() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "Globalresult",
                                        params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: handleButtonPress } },
                                    }
                                ]
                            })
                        );
                    }}
                        style={{
                            flexDirection: "row",
                            height: normalize(95),
                            width: normalize(300),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            // paddingVertical: normalize(10),
                            alignItems: "center",
                            borderWidth: 0.5,
                            borderColor: "#DADADA"
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: "#000000",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Recommendations are based on your profession, primary area of practice and state requirements."}
                            </Text>
                            <View style={{ marginTop: normalize(10) }}>
                                <Buttons
                                    onPress={() => {
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    {
                                                        name: "Globalresult",
                                                        params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: handleButtonPress, backProps: "yes" } },
                                                    }
                                                ]
                                            })
                                        );
                                    }}
                                    height={normalize(40)}
                                    width={normalize(270)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(5)}
                                    text="Browse Courses"
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>}
        </View>
    )
}

export default Nonphysicianprofile
const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 0
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 3
    },
    inactiveDot: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: Colorpath.white,
        borderColor: Colorpath.ButtonColr,
        borderWidth: 1,
    },
    activeDot: {
        width: 25,
        height: 8,
        borderRadius: 10,
        backgroundColor: Colorpath.ButtonColr, // make active dot longer for effect
    }
})
