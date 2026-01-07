import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, Platform, Pressable, StyleSheet } from 'react-native'
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
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ResumeDash from './ResumeDash';
import StateRequireditem from './StateRequired';
const Dashboardmain = ({ allProfTake, finddata, setPrimeadd, enables, handleButtonPress, setAddit, addit, takestate, setTakestate, cmecourse, tasksData, navigation, completedCount, pendingCount, totalcard, DashboardReducer, hasTasks, cmeValult }) => {
    console.log(DashboardReducer?.dashboardResponse?.data, completedCount, totalcard, "dash=======", handleButtonPress);
    console.log(cmecourse, "fgfdh", enables, addit, "cmecourse==========", finddata, takestate, completedCount == 1);
    const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const [valourse, setValcourse] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const carouselReffind = useRef(null);
    const topicEarned = cleanNumber(addit?.credits_data?.topic_earned_credits);
    const topicTotal = cleanNumber(addit?.credits_data?.topic_credits);
    const generalEarned = cleanNumber(addit?.credits_data?.total_general_earned_credits);
    const generalTotal = cleanNumber(addit?.credits_data?.total_general_credits);
    const bothNoRequirement =
        (topicEarned === 0 && topicTotal === 0 &&
            generalEarned === 0 && generalTotal === 0);
    const stateHit = finddata?.my_recommendations?.mandatory_courses;
    const specHit = finddata?.my_recommendations?.speciality_courses
    return (
        <>
            <View style={{ paddingVertical: normalize(15) }}>
                {(completedCount == 0 && pendingCount == 0) ? <></> : <View style={DashboardReducer?.dashboardResponse?.data?.licensures?.length == 1 ? { justifyContent: "center", alignItems: "center", marginTop: normalize(10) } : { justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {
                        // if (enables) {
                        //     setPrimeadd(true);
                        // } else {
                        //     navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Course" }] }));
                        // }
                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Course" }] }));
                    }}
                        style={{
                            flexDirection: "row",
                            height: normalize(95),
                            width: normalize(300),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(15),
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
                                {`My Course(s) for ${addit?.state_name}`}
                            </Text>
                            <View style={{ flexDirection: "row", gap: normalize(5), marginTop: normalize(4) }}>
                                <View style={{
                                    flexDirection: "row",
                                    height: normalize(50),
                                    width: normalize(88),
                                    borderRadius: normalize(8),
                                    // paddingHorizontal: normalize(10),
                                    backgroundColor: "#EAF5FF",
                                    marginTop: normalize(5),
                                    justifyContent: "center", alignItems: "center"
                                }}>
                                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", alignSelf: "center", fontWeight: "bold" }}>{String(completedCount + pendingCount).padStart(2, '0')}</Text>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000", alignSelf: "center" }}>{"Registered"}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    height: normalize(50),
                                    width: normalize(88),
                                    borderRadius: normalize(8),
                                    // paddingHorizontal: normalize(10),
                                    backgroundColor: "#E7F5E8",
                                    marginTop: normalize(5),
                                    justifyContent: "center", alignItems: "center"
                                }}>
                                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", fontWeight: "bold" }}>{String(completedCount).padStart(completedCount == 0 ? 1 : 2, '0')}</Text>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000" }}>{"Completed"}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    height: normalize(50),
                                    width: normalize(88),
                                    borderRadius: normalize(8),
                                    backgroundColor: "#F1EBFF",
                                    // paddingHorizontal: normalize(10),
                                    marginTop: normalize(5),
                                    justifyContent: "center", alignItems: "center"
                                }}>
                                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", fontWeight: "bold" }}>{String(pendingCount).padStart(pendingCount == 0 ? 1 : 2, '0')}</Text>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000" }}>{"Pending"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{ marginBottom: normalize(60), backgroundColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(20), justifyContent: "center", alignItems: "center" }} onPress={() => {
                            // if (enables) {
                            //     setPrimeadd(true);
                            // } else {
                            //     navigation.dispatch(CommonActions.reset({
                            //         index: 0, routes: [{
                            //             name: "Course", params: {
                            //                 taskData: { statid: takestate, creditID: addit },
                            //             }
                            //         }]
                            //     }));
                            // }
                             navigation.dispatch(CommonActions.reset({
                                    index: 0, routes: [{
                                        name: "Course", params: {
                                            taskData: { statid: takestate, creditID: addit },
                                        }
                                    }]
                                }));
                        }}>
                            <ArrowIconsAnt
                                name="arrowright"
                                size={18}
                                color={Colorpath.white}
                                style={{ alignSelf: "center" }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>}
                {/* {!enables && !bothNoRequirement && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <TouchableOpacity onPress={() => {
                        if (enables) {
                            setPrimeadd(true);
                        } else {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: "ChooseSpecailization",
                                            params: { stateID: handleButtonPress }
                                        }
                                    ]
                                })
                            );
                        }
                    }}
                        style={{
                            flexDirection: "row",
                            height: normalize(95),
                            width: normalize(300),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(15),
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
                                {"Recommendations for Compliance "}
                            </Text>
                            <View style={{ marginTop: normalize(10) }}>
                                <Buttons
                                    onPress={() => {
                                        if (enables) {
                                            setPrimeadd(true);
                                        } else {
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        {
                                                            name: "ChooseSpecailization",
                                                            params: { stateID: handleButtonPress }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                    }}
                                    height={normalize(40)}
                                    width={normalize(270)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(5)}
                                    text={`Courses for ${addit?.state_code} Compliance ->`}
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>} */}


                {finddata?.my_activities?.length > 0 ? <View style={{ paddingVertical: hasTasks ? normalize(10) : normalize(10) }}>
                    <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Course" }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(13) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000",fontWeight:"bold" }}>{"Start or Resume Courses"}</Text>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr,fontWeight:"bold" }}>{"View All"}</Text>
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
                        renderItem={({ item, index }) => <ResumeDash allProfTake={allProfTake} item={item} index={index} addit={addit} />}
                        firstItem={0}
                        onSnapToItem={(index) => {
                            setValcourse(index);
                        }}
                    />
                    <View style={styles.paginationContainer}>
                        {finddata?.my_activities && finddata?.my_activities?.length >= 2 && finddata?.my_activities?.map((_, index) => (
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
                {hasTasks ? (
                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: enables ? normalize(10) : normalize(10), marginLeft: normalize(18) }}>
                        <View
                            style={{
                                height: normalize(60),
                                width: normalize(320),
                            }}
                        >
                            <FlatList
                                data={[
                                    {
                                        taskType: "Due in 30 Days",
                                        tasksKey: "due_in_30_days",
                                        item: tasksData,
                                    },
                                    {
                                        taskType: "Due in 60 Days",
                                        tasksKey: "due_in_60_days",
                                        item: tasksData,
                                    },
                                    {
                                        taskType: "Due in 90 Days",
                                        tasksKey: "due_in_90_days",
                                        item: tasksData,
                                    },
                                ]}
                                renderItem={({ item, index }) => (
                                    <TaskCardItem {...item} index={index} setAddit={setAddit} addit={addit} navigation={navigation} takestate={takestate} setTakestate={setTakestate} />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                contentContainerStyle={{
                                    paddingHorizontal: 0,
                                    paddingRight: normalize(18) // Add paddingRight to prevent the last item from being cut off
                                }}
                                ItemSeparatorComponent={() => <View style={{ width: normalize(0) }} />}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                ) : null}
                {stateHit?.length > 0 ? <View style={{ height:Platform.OS === 'ios' ? normalize(200):normalize(220), width: normalize(320), backgroundColor: "#b6d7ff", marginTop: normalize(20) }}>
                    <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "StateCourse", params: { back: "tabnav" } }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(13), marginTop: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000",fontWeight:"bold" }}>{"State-required Courses"}</Text>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr,fontWeight:"bold" }}>{"View All"}</Text>
                    </Pressable>
                    <FlatList
                        data={stateHit}
                        horizontal
                        renderItem={({ item, index }) => <StateRequireditem allProfTake={allProfTake} navigation={navigation} addit={addit} item={item} index={index} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View> : null}
                {specHit?.length > 0 ? <View style={{ marginTop:stateHit?.length > 0 ? normalize(0): normalize(10) }}>
                    <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "SpecialityCourseSlide", params: { back: "tabnav" } }] }))} style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingHorizontal: normalize(15), marginTop: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000",fontWeight:"bold" }}>{"Specialty Courses"}</Text>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr,fontWeight:"bold" }}>{"View All"}</Text>
                    </Pressable>
                    <FlatList
                        data={specHit}
                        horizontal
                        renderItem={({ item, index }) => <StateRequireditem allProfTake={allProfTake} navigation={navigation} addit={addit} item={item} index={index} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View> : null}
                  {enables && <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10) }}>
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
        </>
    )
}
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
export default Dashboardmain
