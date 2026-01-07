import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, ScrollView, ImageBackground, Image, Alert, BackHandler, ActivityIndicator, Dimensions } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { cmenextactionRequest, evaulatecalculateRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Buttons from '../../Components/Button';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import { stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const PostTestFail = (props) => {
    const {
        statepush,
        setFinddata,
        finddata,
        isConnected
    } = useContext(AppContext);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
       const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const PrePress = () => {
        takeCoursepost();
        props.navigation.goBack();
    };
    const [testData, setTestData] = useState([]);
    useEffect(() => {
        const obj = { "examId": props?.route?.params?.examID };
        connectionrequest()
            .then(() => {
                dispatch(evaulatecalculateRequest(obj));
            })
            .catch((err) => { showErrorAlert("Please connect to internet", err); });
    }, [props?.route?.params]);
    useEffect(() => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [statepush])
    const takeCoursepost = () => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/evaulatecalculateRequest':
                status = CMEReducer.status;
                break;
            case 'CME/evaulatecalculateSuccess':
                status = CMEReducer.status;
                setTestData(CMEReducer?.evaulatecalculateResponse);
                let obj = {
                    "ActivityId": CMEReducer?.evaulatecalculateResponse?.activityId,
                    "conference_id": CMEReducer?.evaulatecalculateResponse?.conferenceId
                }
                dispatch(cmenextactionRequest(obj))
                break;
            case 'CME/evaulatecalculateFailure':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionSuccess':
                status = CMEReducer.status;
                console.log("next action1222====", CMEReducer?.cmenextactionResponse)
                break;
            case 'CME/cmenextactionFailure':
                status = CMEReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status1 = DashboardReducer.status;
                setFinddata(DashboardReducer?.stateDashboardResponse?.data);
                console.log("finddatapostfail====", DashboardReducer?.stateDashboardResponse?.data, finddata)
                break;
            case 'Dashboard/stateDashboardFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    console.log(CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 &&
        (
            CMEReducer?.cmenextactionResponse &&
            (
                CMEReducer?.cmenextactionResponse?.next_activity_text == "Post Assessment" ||
                CMEReducer?.cmenextactionResponse?.next_activity_text == "Pre Assessment" ||
                CMEReducer?.cmenextactionResponse?.next_activity_text == "Survey & Feedback"
            )
        ), CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 && CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Post Assessment" || CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Pre Assessment" || CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Survey & Feedback", CMEReducer?.cmenextactionResponse, "CMEReducer?.evaulatecalculateResponse", CMEReducer?.evaulatecalculateResponse)
    const getCorrectOptionIds = (options) => {
        return options
            .filter(option => option.correctness === "1")
            .map(option => option.id);
    };
    let questionCounter = 0;
    const totalQuestionsCount = testData && testData?.questionsAttempted || "";
    const renderGroup = ({ item, index: groupIndex }) => (
        <View>
            {item.heading && (
                <>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 20,
                            color: Colorpath.ButtonColr,
                            marginBottom: normalize(4),
                            marginTop: normalize(5),
                            marginLeft: normalize(10),
                            fontWeight: "500"
                        }}>
                        {item.heading}
                    </Text>
                    <View style={{ height: 1, width: '90%', backgroundColor: "#DDDDDD", marginLeft: normalize(10) }} />
                </>
            )}

            {item.questions.map((q, qIndex) => {
                questionCounter += 1; // increment globally
                let currentGlobalIndex = 0;
                for (let i = 0; i < groupIndex; i++) {
                    currentGlobalIndex += failQuestion[i].questions.length;
                }
                currentGlobalIndex += qIndex + 1;
                const isLastInGroup = qIndex === item.questions.length - 1;
                const isLastInEntireData = currentGlobalIndex === totalQuestionsCount;
                const isHeaderActive = !!item.heading;
                return (
                    <View key={q.question_id}>
                        {renderItem({
                            item: {
                                ...q,
                                questionNumber: questionCounter,
                                isLastInGroup,
                                isHeaderActive, // ✅ pass to renderItem
                            }
                        })}
                        {!isLastInEntireData && (isLastInGroup || (!isHeaderActive && !isLastInGroup)) && (
                            <View style={styles.groupSeparator}>
                                {Array.from({ length: 34 }).map((_, idx) => (
                                    <View key={idx} style={styles.dot} />
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
    const renderItem = ({ item, index }) => {
        const correctOptionIds = getCorrectOptionIds(item?.question_options || []);
        return (
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {`${item?.questionNumber}. ${item?.statement?.replace(/<\/?[^>]+(>|$)/g, "")}`}
                </Text>
                {item?.question_options?.map((option) => {
                    const userAnswers = Array.isArray(item?.answer) ? item?.answer : [item?.answer]; // Ensure answers are in an array
                    const isUserAnswered = userAnswers.includes(option.id); // Check if this option is among the user's answers
                    const isCorrectAnswer = option.correctness === "1"; // Check if this option is correct

                    // Apply dynamic styles based on the answer and correctness
                    const optionStyle = [
                        styles.optionText,
                        isUserAnswered
                            ? { color: isCorrectAnswer ? "green" : "red" } // Green for correct, red for incorrect
                            : {},
                    ];

                    return (
                        <View key={option.id} style={styles.optionContainer}>
                            <Text style={optionStyle}>
                                {option?.statement?.replace(/<\/?[^>]+(>|$)/g, "")}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };


    useEffect(() => {
        const onBackPress = () => {
            takeCoursepost();
            PrePress();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);

    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);
    const failQuestion = useMemo(() => {
        const questionGroups = testData?.questionsReviews;

        if (!questionGroups || typeof questionGroups !== 'object') return [];

        return Object.entries(questionGroups).map(([heading, questions]) => ({
            heading: heading == 'no_heading' ? null : heading,
            questions: Array.isArray(questions) ? questions : [],
        }));
    }, [testData]);
    useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                <Loader
                    visible={CMEReducer?.status == 'CME/evaulatecalculateRequest'} />
                {Platform.OS === 'ios' ? (
                    <PageHeader
                        nol={"yes"}
                        title={CMEReducer?.cmenextactionResponse?.conferenceName ? CMEReducer?.cmenextactionResponse?.conferenceName : CMEReducer?.cmenextactionResponse?.conferenceName}
                        onBackPress={PrePress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            nol={"yes"}
                            title={CMEReducer?.cmenextactionResponse?.conferenceName ? CMEReducer?.cmenextactionResponse?.conferenceName : CMEReducer?.cmenextactionResponse?.conferenceName}
                            onBackPress={PrePress}
                        />
                    </View>
                )}
                {conn == false ? <IntOff/> :<ScrollView contentContainerStyle={{ paddingBottom: normalize(70) }}>
                    <View>
                        <View style={styles.container}>
                            <ImageBackground source={Imagepath.BannerBig} style={styles.imageBackground}>
                                {showLoader ? <ActivityIndicator style={{ paddingVertical: normalize(10) }} size={"small"} color={Colorpath.green} /> : <View style={styles.headerRow}>
                                    <Image source={CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 ? Imagepath.SucessThumb : Imagepath.Thumb} style={{ height: normalize(20), width: normalize(25), resizeMode: "contain" }} />
                                    <View style={styles.headerTextContainer}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#000000" }}>{CMEReducer?.evaulatecalculateResponse?.evaluationResult}</Text>
                                    </View>
                                    <View style={styles.scoreColumnContainer}>
                                        <View>
                                            <Text style={styles.subText}>{"Grade"}</Text>
                                            <View style={styles.scoreContainer}>
                                                <Text style={styles.scoreText}>{`${CMEReducer?.evaulatecalculateResponse?.gradePercentage}%` || "0%"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingHorizontal: normalize(10) }}>
                                            <Text style={styles.subText}>{"Question"}</Text>
                                            <View style={styles.scoreContainer}>
                                                <Text style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 24,
                                                    color: Colorpath.ButtonColr
                                                }}>{CMEReducer?.evaulatecalculateResponse?.correctedAnswers}</Text>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 24, color: "#999" }}>{"/"}</Text>
                                                <Text style={styles.scoreText}>{testData && testData?.questionsAttempted}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>}
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: normalize(10) }}>
                                    <Buttons
                                        onPress={() => {
                                            if (CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1) {
                                                takeCoursepost();
                                                props.navigation.navigate("TabNav");
                                            } else {
                                                takeCoursepost();
                                                props.navigation.navigate("VideoComponent", { FullID: CMEReducer?.cmenextactionResponse });
                                            }
                                        }}
                                        height={normalize(45)}
                                        width={normalize(148)}
                                        backgroundColor={Colorpath.white}
                                        borderRadius={normalize(8)}
                                        text={CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 ? "Continue Later" : "Retake Course"}
                                        color={Colorpath.ButtonColr}
                                        fontSize={16}
                                        fontFamily={Fonts.InterSemiBold}
                                        borderWidth={0.5}
                                        borderColor={"#DDD"}
                                    />
                                    <Buttons
                                        onPress={() => {
                                            if (CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 && CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Certificate") {
                                                takeCoursepost()
                                                props.navigation.navigate("DownloadCertificate", { examID: { examID: props?.route?.params?.examID, CertificateActivityId: CMEReducer?.cmenextactionResponse } })
                                            } else if (CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 && CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse.next_activity_text == "Course") {
                                                takeCoursepost();
                                                props.navigation.navigate("VideoComponent", { FullID: CMEReducer?.cmenextactionResponse });
                                            } else if (CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 &&
                                                (
                                                    CMEReducer?.cmenextactionResponse &&
                                                    (
                                                        CMEReducer?.cmenextactionResponse?.next_activity_text == "Post Assessment" ||
                                                        CMEReducer?.cmenextactionResponse?.next_activity_text == "Pre Assessment" ||
                                                        CMEReducer?.cmenextactionResponse?.next_activity_text == "Survey & Feedback"
                                                    )
                                                )) {
                                                takeCoursepost();
                                                props.navigation.navigate("PreTest", {
                                                    activityID: { activityID: CMEReducer?.cmenextactionResponse?.next_activity_id, conference_id: CMEReducer?.evaulatecalculateResponse?.conferenceId, text: CMEReducer?.cmenextactionResponse?.next_activity_text }
                                                });
                                            } else {
                                                takeCoursepost();
                                                props.navigation.navigate("PreTest", { nodata: CMEReducer?.evaulatecalculateResponse })
                                            }
                                        }}
                                        height={normalize(45)}
                                        width={normalize(148)}
                                        backgroundColor={Colorpath.white}
                                        borderRadius={normalize(8)}
                                        text={
                                            CMEReducer?.evaulatecalculateResponse?.evaluationStatus == 1 ?
                                                CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Certificate" ?
                                                    "View Certificate" :
                                                    CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse.next_activity_text == "Course"
                                                        ? CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_button_text ? nextData?.next_activity_button_text : "Next" :
                                                        CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Post Assessment" || CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Pre Assessment" || CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_text == "Survey & Feedback" ? CMEReducer?.cmenextactionResponse && CMEReducer?.cmenextactionResponse?.next_activity_button_text ? CMEReducer?.cmenextactionResponse?.next_activity_button_text : "Next" : "" : "Retake Test"
                                        }
                                        color={Colorpath.ButtonColr}
                                        fontSize={16}
                                        fontFamily={Fonts.InterSemiBold}
                                        borderWidth={0.5}
                                        borderColor={"#DDD"}
                                    />
                                </View>
                            </ImageBackground>
                        </View>
                    </View>

                    {failQuestion && failQuestion?.length > 0 ? (
                        <FlatList
                            data={failQuestion}
                            renderItem={renderGroup}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={
                                <Text
                                    style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        color: Colorpath.grey,
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: normalize(20),
                                        paddingTop: normalize(30),
                                    }}>
                                    No data found
                                </Text>
                            }
                        />
                    ) : showLoader ? <ActivityIndicator style={{ paddingVertical: normalize(10) }} size={"small"} color={Colorpath.green} /> : (
                        <Text style={{ padding: 20, textAlign: 'center', fontFamily: Fonts.InterSemiBold, fontSize: 14, color: Colorpath.ButtonColr }}>Loading questions...</Text>
                    )}
                </ScrollView>}
            </SafeAreaView>
        </>
    );
};

const CustomRadioButton = ({ selected, onPress, style, correct }) => (
    <TouchableOpacity onPress={onPress} style={style}>
        {selected ? (
            <View style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: correct ? Colorpath.green : "red"
            }} />
        ) : (
            <View style={{
                height: 10,
                width: 10,
                backgroundColor: 'transparent'
            }} />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    questionContainer: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        // borderBottomWidth: 1,
        // borderBottomColor: "#DDDDDD",
    },
    questionContainer1: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        // borderBottomWidth: 1,
        // borderBottomColor: "#DDDDDD",
    },
    questionText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: "#000000",
        fontWeight: "bold",
        marginBottom: normalize(5),
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
        paddingHorizontal: normalize(12),
    },
    optionText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#000000',
    },
    scoreContainer: {
        flexDirection: "row",
        alignItems: 'center',
    },
    scoreText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 24,
        color: Colorpath.black,
    },
    container: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: normalize(0),
    },
    imageBackground: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        width: normalize(330),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
    },
    subText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#999',
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        height: normalize(100),
        bottom: -40,
        left: 0,
        right: 0,
        backgroundColor: Colorpath.white,
        borderColor: "#DDDDDD",
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalize(20),
    },
    scoreRowContainer: {
        marginBottom: normalize(5),
    },
    scoreColumnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTextContainer: {
        paddingHorizontal: normalize(8),
        flex: 1,
    },
    groupSeparator: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5)
    },
    dot: {
        height: 1,
        width: (Dimensions.get('window').width * 0.4 - 60) / 17,
        backgroundColor: '#DDDDDD',
    },
});


export default PostTestFail;
