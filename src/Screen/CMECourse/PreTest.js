import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, ScrollView, ImageBackground, Alert, TextInput, BackHandler, ActivityIndicator, Dimensions } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import ProgressBarCircle from '../../Components/ProgressBarCircle';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { cmedulicateRequest, evaulateexamRequest, nextactionagainRequest, startTestRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Buttons from '../../Components/Button';
import Loader from '../../Utils/Helpers/Loader';
import { useIsFocused } from '@react-navigation/native';
import CustomCheckBox from './CheckBox';
import { AppContext } from '../GlobalSupport/AppContext';
import { stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const PreTest = (props) => {
  const {
    statepush,
    setStatepush,
    setFinddata,
    isConnected,
    setAddit
  } = useContext(AppContext);
  const CMEReducer = useSelector(state => state.CMEReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();
  const PrePress = () => {
    setAddit(statepush);
    takeCoursepre();
    props.navigation.goBack();
  };
  console.log(props?.route?.params, "route==============");
  const [conn, setConn] = useState("")
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection State:', state.isConnected);
      setConn(state.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [testData, setTestData] = useState(null);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [timeflex, setTimeflex] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [lengthCheck, setLengthCheck] = useState(0);
  const [headerText, setHeaderText] = useState("");
  const [headerTexts, setHeaderTexts] = useState("");
  const [answers, setAnswers] = useState({});
  const isFocus = useIsFocused();
  useEffect(() => {
    if (statepush) {
      const takeIDS = statepush?.state_id || statepush?.creditID?.state_id;
      connectionrequest()
        .then(() => {
          dispatch(stateDashboardRequest({ "state_id": takeIDS }))
        })
        .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }
  }, [statepush])
  const takeCoursepre = () => {
    if (statepush) {
      const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
      connectionrequest()
        .then(() => {
          dispatch(stateDashboardRequest({ "state_id": takeIDST }))
        })
        .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }
  }
  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions(prev => {
      const updatedOptions = { ...prev, [questionId]: optionId };
      const selectedLength = Object.keys(updatedOptions).length;
      const questionGroups = testData?.testData?.[0]?.questions || {};
      const allQuestions = Object.entries(questionGroups).flatMap(([heading, questions]) =>
        Array.isArray(questions)
          ? questions.map(q => ({
            heading: heading == "no_heading" ? null : heading,
            ...q
          }))
          : []
      );
      // Total number of all questions
      const questionsLength = allQuestions.length;
      // const questionsLength = testData?.testData[0]?.questions?.length || 0;
      const allAnswered = selectedLength === questionsLength;
      console.log("Selected Length:", selectedLength, questionsLength);
      // setLengthCheck(selectedLength);
      console.log("Questions Length:", questionsLength);
      console.log("All Answered:", allAnswered);
      // checkIfAllAnswered(updatedOptions, answers);
      // setIsSubmitEnabled(allAnswered);
      // if (!timerStarted) {
      //   setTimerStarted(true);
      // }
      return updatedOptions;
    });
  };
  const handleMultipleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => {
      const currentSelections = prev[questionId] || [];
      const updatedSelections = currentSelections.includes(optionId)
        ? currentSelections.filter((id) => id !== optionId) // Deselect the option
        : [...currentSelections, optionId]; // Select the option
      return { ...prev, [questionId]: updatedSelections };
    });
  };
  // useEffect(() => {
  //   if (timerStarted && timeflex === 0) {
  //    Alert.alert("eMedEvents","You have cross your time",[{text:"Cancel",onPress:()=>{console.log("Hello")},style:"cancel"},{text:"Ok",onPress:()=>{
  //      setIsSubmitEnabled(false);
  //     setTimerStarted(false);
  //     props.navigation.goBack();
  //   },style:"default"}])
  //     setIsSubmitEnabled(false);
  //     setTimerStarted(false);
  //   }
  // }, [timeflex]);

  // useEffect(() => {
  //   if (timerStarted) {
  //     const timer = setInterval(() => {
  //       setTimeflex(prev => prev > 0 ? prev - 1 : 0);
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [timerStarted]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to the top when the page is loaded or when coming back to this page
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [isFocus]);
  console.log(selectedOptions, "slected option", props?.route?.params?.nodata?.activityId || props?.route?.params?.activityID?.activityID || props?.route?.params?.FullID?.FullID || props?.route?.params?.activityID)
  const allquestionHandle = () => {
    const normalizedExamAnswers = Object.fromEntries(
      Object.entries(selectedOptions || {}).map(([key, value]) => {
        // If the value is an array → keep it as is
        if (Array.isArray(value)) {
          return [key, value];
        }
        // If the value is numeric (string or number) → wrap it in an array
        else if (!isNaN(value)) {
          return [key, [String(value)]];
        }
        // Otherwise (for text answers) → keep as plain string
        else {
          return [key, String(value)];
        }
      })
    );
    let obj = {
      "AssessmentId": testData?.testData && testData?.testData?.[0]?.assessment_id,
      "ExamAnswersData": normalizedExamAnswers
    }
    connectionrequest()
      .then(() => {
        dispatch(evaulateexamRequest(obj));
      })
      .catch((err) => { showErrorAlert("Please connect to internet", err) })
  }
  useEffect(() => {
    const obj = { "ActivityId": props?.route?.params?.nodata?.activityId || props?.route?.params?.activityID?.activityID || props?.route?.params?.FullID?.FullID || props?.route?.params?.activityID };
    connectionrequest()
      .then(() => {
        dispatch(startTestRequest(obj));
      })
      .catch((err) => { showErrorAlert("Please connect to internet", err); });
  }, [isFocus]);

  useEffect(() => {
    if (props?.route?.params?.nodata) {
      setSelectedOptions({});
      setTimeflex(0);
      setLengthCheck(0);
    }
  }, [props?.route?.params?.nodata])
  useEffect(() => {
    let obj = {
      "conference_id": props?.route?.params?.FullID?.wholedata?.conferenceId || props?.route?.params?.activityID?.conference_id || props?.route?.params?.nodata?.conferenceId,
      "ActivityId": props?.route?.params?.FullID?.wholedata?.next_activity_id || props?.route?.params?.nodata?.activityId || props?.route?.params?.activityID?.activityID || props?.route?.params?.FullID?.FullID || props?.route?.params?.activityID
    }
    console.log("pretest-----checking======", obj)
    connectionrequest()
      .then(() => {
        dispatch(cmedulicateRequest(obj));
      })
      .catch((err) => { showErrorAlert("Please connect to internet", err) })
  }, [isFocus])
  useEffect(() => {
    if (CMEReducer?.startTestResponse) {
      setTestData(CMEReducer?.startTestResponse);
    }
  }, [CMEReducer?.startTestResponse])
  if (status === '' || CMEReducer.status !== status) {
    switch (CMEReducer.status) {
      case 'CME/startTestRequest':
        status = CMEReducer.status;
        break;
      case 'CME/startTestSuccess':
        status = CMEReducer.status;
        console.log("TestData", CMEReducer?.startTestResponse)
        setTestData(CMEReducer?.startTestResponse);
        break;
      case 'CME/startTestFailure':
        status = CMEReducer.status;
        break;
      case 'CME/evaulateexamRequest':
        status = CMEReducer.status;
        break;
      case 'CME/evaulateexamSuccess':
        status = CMEReducer.status;
        if (CMEReducer?.cmedulicateResponse?.next_activity_text === "Certificate") {
          props.navigation.navigate("DownloadCertificate", { examID: { examID: CMEReducer?.evaulateexamResponse?.examId, CertificateActivityId: CMEReducer?.cmedulicateResponse } })
        } else if (CMEReducer?.cmedulicateResponse?.next_activity_api == "activitysession") {
          props.navigation.navigate("VideoComponent", { postdata: CMEReducer?.cmedulicateResponse });
        } else {
          props.navigation.navigate("PostTestFail", { examID: CMEReducer?.evaulateexamResponse?.examId });
        }
        console.log(CMEReducer?.evaulateexamResponse, "efdmdffjdEvail;l;")
        break;
      case 'CME/evaulateexamFailure':
        status = CMEReducer.status;
        break;
      case 'CME/cmedulicateRequest':
        status = CMEReducer.status;
        break;
      case 'CME/cmedulicateSuccess':
        status = CMEReducer.status;
        console.log(CMEReducer?.cmedulicateResponse, "next act============")
        setHeaderText(CMEReducer?.cmedulicateResponse?.current_activity_text);
        setLengthCheck(0);
        setSelectedOptions({});
        setTimeflex(0);
        if (props?.route?.params?.FullID?.startTest) {
          let obj = {
            "conference_id": CMEReducer?.cmedulicateResponse?.conferenceId,
            "ActivityId": CMEReducer?.cmedulicateResponse?.next_activity_id,
          };
          connectionrequest()
            .then(() => {
              dispatch(nextactionagainRequest(obj));
            })
            .catch((err) => {
              showErrorAlert("Please connect to internet", err);
            });
        }

      case 'CME/cmedulicateFailure':
        status = CMEReducer.status;
        break;
      case 'CME/nextactionagainRequest':
        status = CMEReducer.status;
        break;
      case 'CME/nextactionagainSuccess':
        status = CMEReducer.status;
        if (props?.route?.params?.FullID?.startTest) {
          setHeaderTexts(CMEReducer?.nextactionagainResponse?.current_activity_text);
          setLengthCheck(0);
          setSelectedOptions({});
          setTimeflex(0)
        }
        console.log(CMEReducer?.nextactionagainResponse, "again next===========")
      case 'CME/nextactionagainFailure':
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
        break;
      case 'Dashboard/stateDashboardFailure':
        status1 = DashboardReducer.status;
        break;
    }
  }
  console.log(headerText, "rfejnfgnerfgnhn", lengthCheck, testData)
  // const handleTextChange = (questionId, text) => {
  //   setAnswers((prevAnswers) => ({
  //     ...prevAnswers,
  //     [questionId]: text,
  //   }));
  // };
  const handleTextChange = (questionId, text) => {
    setSelectedOptions(prev => {
      const updatedOptions = { ...prev, [questionId]: text };
      // checkIfAllAnswered(updatedOptions);
      return updatedOptions;
    });
  };
  // const checkIfAllAnswered = (selectedOptions, answers) => {
  //   const questionsLength = testData?.testData[0]?.questions?.length || 0;
  //   const answeredQuestions = {
  //     ...selectedOptions,
  //     ...Object.fromEntries(Object.entries(answers).filter(([, value]) => value.trim() !== ""))
  //   };
  //   const allAnswered = Object.keys(answeredQuestions).length === questionsLength;
  //   setIsSubmitEnabled(allAnswered);
  // };
  // const checkIfAllAnswered = (options) => {
  //   const totalQuestions = testData?.testData[0]?.questions?.length || 0;
  //   const answeredCount = Object.keys(options).length;
  //   const allAnswered = answeredCount === totalQuestions;
  //   setIsSubmitEnabled(allAnswered);
  //   setLengthCheck(answeredCount);
  // };
  useEffect(() => {
    if (Object.keys(selectedOptions)?.length > 0) {
      const otpions_id = Object.keys(selectedOptions);
      const allQuestions = [];
      const questionsObj = testData?.testData?.[0]?.questions || {};
      Object.entries(questionsObj).forEach(([key, questions]) => {
        if (key == "no_heading") {
          // Directly push these questions
          questions.forEach(q => {
            allQuestions.push({
              heading: null,
              ...q
            });
          });
        } else {
          // For other keys, add heading before questions
          questions.forEach(q => {
            allQuestions.push({
              heading: key,
              ...q
            });
          });
        }
      });

      // Now filter mandatory ones if needed
      const mandatoryQuestions = allQuestions.filter(q => q.mandatory == 1);
      console.log(questionsObj, mandatoryQuestions, "dfsgdfjkgbk")
      // const mandatoryQuestions = testData?.testData[0]?.questions?.filter(q => q.mandatory == 1) || [];
      const totalMandatoryQuestions = mandatoryQuestions?.length;
      const answeredMandatoryCount = mandatoryQuestions.filter(q => {
        // Check if the question_id exists in the options array
        return otpions_id.includes(q.question_id);
      }).length;
      console.log('Total Mandatory Questions:', totalMandatoryQuestions, mandatoryQuestions);
      console.log('Answered Mandatory Questions:', answeredMandatoryCount);
      const allMandatoryAnswered = answeredMandatoryCount == totalMandatoryQuestions;
      setIsSubmitEnabled(allMandatoryAnswered);
      setLengthCheck(otpions_id?.length);
      console.log(selectedOptions, "option---------", Object.keys(selectedOptions), answeredMandatoryCount, totalMandatoryQuestions)
    }
  }, [selectedOptions])
  //   const checkIfAllAnswered = (options) => {
  //     const mandatoryQuestions = testData?.testData[0]?.questions?.filter(q => q.mandatory == 1) || [];
  //     const totalMandatoryQuestions = mandatoryQuestions?.length;
  //     const answeredMandatoryCount = mandatoryQuestions.filter(q => 
  //       options[q.question_id] !== undefined && options[q.question_id] !== ''
  //     ).length;
  //     console.log('Total Mandatory:', mandatoryQuestions, options,answeredMandatoryCount,selectedOptions);
  //     console.log('Answered Mandatory:', answeredMandatoryCount);
  //     const allMandatoryAnswered = answeredMandatoryCount == totalMandatoryQuestions;
  //     setIsSubmitEnabled(allMandatoryAnswered);
  //     setLengthCheck(answeredMandatoryCount);
  // };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setSelectedOptions({});
      setIsSubmitEnabled(false);
      setLengthCheck(0);
    });
    return unsubscribe;
  }, [props?.navigation]);
  console.log(answers, "survey & id ")
  const estimatedTime = (val) => {
    console.log("hello", val)
    if (val) {
      const convertedVal = val * 1000;
      setTimeflex(convertedVal);
    }
  }
  const cleanHTML = (htmlString) => {
    if (!htmlString) return "";
    htmlString = htmlString.replace(/<p[^>]*style="[^"]*margin-left:0px;"[^>]*>(.*?)<\/p>/g, "$1");
    htmlString = htmlString.replace(/<\/?[^>]+(>|$)/g, "");
    htmlString = htmlString.replace(/&nbsp;/g, " ");
    return htmlString.trim();
  };
  console.log(timeflex, "timeflex=========", isSubmitEnabled, selectedOptions);
  let questionCounter = 0;
  const totalQuestionsCount = testData && testData?.testData?.[0]?.total_questions || "";
  const renderGroup = ({ item, index: groupIndex }) => {
    return (
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
                fontWeight: '500',
              }}
            >
              {item.heading}
            </Text>
            <View
              style={{
                height: 1,
                width: '90%',
                backgroundColor: '#DDDDDD',
                marginLeft: normalize(10),
              }}
            />
          </>
        )}
        {item.questions.map((q, qIndex) => {
          questionCounter += 1;
          let currentGlobalIndex = 0;
          for (let i = 0; i < groupIndex; i++) {
            currentGlobalIndex += allQuestions[i].questions.length;
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
                  isHeaderActive,
                },
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
  };

  const renderItem = ({ item, index }) => {
    console.log("question_type_id_text", item)
    estimatedTime((item?.estimated_time || 0) * (item?.question_options?.length + 1 || 0));
    const cleanStatement = cleanHTML(item?.statement);
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {item?.mandatory == 1 ? (
            <>
              <Text style={{ color: 'red' }}>*</Text>
              {`${item?.questionNumber}. ${cleanStatement}`}
            </>
          ) : (
            `${item?.questionNumber}. ${cleanStatement}`
          )}
        </Text>

        {item?.question_type_id_text === "Single Choice" ? (
          item?.question_options?.map((option) => (
            <TouchableOpacity
              onPress={() => handleOptionSelect(option.question_id, option.id)}
              key={option.id}
              style={styles.optionContainer}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            >
              <CustomRadioButton
                onPress={() => handleOptionSelect(option.question_id, option.id)}
                selected={selectedOptions[option.question_id] === option.id}
              />
              <Text style={styles.optionText}>
                {cleanHTML(option?.statement)}
              </Text>
            </TouchableOpacity>
          ))
        ) : item?.question_type_id_text === "Multiple Choice" ? (
          item?.question_options?.map((option) => (
            <TouchableOpacity
              onPress={() => handleMultipleOptionSelect(option.question_id, option.id)}
              key={option.id}
              style={styles.optionContainer}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            >
              <CustomCheckBox
                selected={selectedOptions[option.question_id]?.includes(option.id)}
                onPress={() => handleMultipleOptionSelect(option.question_id, option.id)}
              />
              <Text style={styles.optionText}>
                {cleanHTML(option?.statement)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <TextInput
            style={styles.textArea}
            multiline
            value={selectedOptions[item?.question_id] || ''}
            onChangeText={(text) => handleTextChange(item?.question_id, text)}
            placeholder="Enter your answer"
          />
        )}
      </View>
    );
  };
  useEffect(() => {
    const onBackPress = () => {
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
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  const allQuestions = useMemo(() => {
    const questionGroups = testData?.testData?.[0]?.questions;

    if (!questionGroups || typeof questionGroups !== 'object') return [];

    return Object.entries(questionGroups).map(([heading, questions]) => ({
      heading: heading == 'no_heading' ? null : heading,
      questions: Array.isArray(questions) ? questions : [],
    }));
  }, [testData]);
  const wholeTitle = useMemo(() => {
    const title = CMEReducer?.startTestResponse?.testData?.[0]?.title;
    const duplicateName = CMEReducer?.cmedulicateResponse?.conferenceName;
    const nextName = CMEReducer?.nextactionagainResponse?.conferenceName;
    
    return title || duplicateName || nextName;
  }, [
    CMEReducer?.startTestResponse?.testData?.[0]?.title,
    CMEReducer?.cmedulicateResponse?.conferenceName,
    CMEReducer?.nextactionagainResponse?.conferenceName
  ]);
  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  console.log(allQuestions, "fgfgkhgg-----",wholeTitle,headerText);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.Pagebg}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
        <Loader
          visible={CMEReducer?.status == 'CME/startTestRequest' || CMEReducer?.status == 'CME/evaulateexamRequest'} />
        {Platform.OS === 'ios' ? (
          <PageHeader
            title={wholeTitle || headerText || props?.route?.params?.FullID?.Wktext || props?.route?.params?.activityID?.text || headerTexts}
            onBackPress={PrePress}
            nol={"yes"}
          />
        ) : (
          <View>
            <PageHeader
              title={wholeTitle || headerText || props?.route?.params?.FullID?.Wktext || props?.route?.params?.activityID?.text || headerTexts}
              onBackPress={PrePress}
              nol={"yes"}
            />
          </View>
        )}
        {conn == false ? <IntOff /> : <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: normalize(120) }}>
          <View>
            <View style={styles.container}>
              {showLoader ? <ActivityIndicator style={{ paddingVertical: normalize(10) }} size={"small"} color={Colorpath.green} /> : <ImageBackground source={Imagepath.BannerBig} style={styles.imageBackground}>
                <View>
                  <View style={styles.headerRow}>
                    <View style={styles.headerContent}>
                      <Text style={styles.subText}>{headerText || CMEReducer?.cmedulicateResponse?.current_activity_text|| MEReducer?.nextactionagainResponse?.current_activity_text || props?.route?.params?.FullID?.Wktext || props?.route?.params?.activityID?.text}</Text>
                      <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999" }}>{"Question"}</Text>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{lengthCheck}</Text>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 24, color: "#999" }}>{"/"}</Text>
                        <Text style={styles.scoreText}>{`${""}${testData?.testData && testData?.testData?.[0]?.total_questions || 0}`}</Text>
                      </View>
                    </View>
                    {/* <View style={styles.progressContainer}>
                      <ProgressBarCircle
                        key={timeflex}
                        duration={timeflex}
                        size={65}
                        strokeWidth={2}
                        backgroundColor="#e0e0e0"
                        fillColor={Colorpath.green}
                      />
                    </View> */}
                  </View>
                </View>
              </ImageBackground>}

            </View>
          </View>
          {allQuestions && allQuestions?.length > 0 ? (
            <FlatList
              data={allQuestions}
              renderItem={renderGroup}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={showLoader ? <ActivityIndicator size={"small"} color={Colorpath.green} /> :
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
            <Text style={{ padding: 20, textAlign: 'center' }}>Loading questions...</Text>
          )}
          <View style={styles.buttonContainer}>
            <Buttons
              onPress={() => {
                allquestionHandle();
                takeCoursepre();
              }}
              height={normalize(45)}
              width={normalize(288)}
              backgroundColor={isSubmitEnabled ? Colorpath.ButtonColr : Colorpath.grey}
              borderRadius={normalize(5)}
              text="Submit"
              color={Colorpath.white}
              fontSize={16}
              fontFamily={Fonts.InterSemiBold}
              marginTop={normalize(-15)}
              disabled={!isSubmitEnabled}
            />
          </View>
        </ScrollView>}
      </SafeAreaView>
    </>
  );
};

const CustomRadioButton = ({ selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: selected ? Colorpath.green : '#000',
    alignItems: 'center',
    justifyContent: 'center'
  }} >
    {selected ? (
      <View style={styles.radioButtonSelected} />
    ) : (
      <View style={styles.radioButtonUnselected} />
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
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    margin: 0,
    marginBottom: 0,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),

  },
  questionContainer2: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: "yellow",
  },
  questionText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: "#000000",
    // fontWeight: "bold",
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
    color: "#000000",
    fontFamily: Fonts.InterRegular
  },
  divider: {
    height: 1,
    backgroundColor: "#DDDDDD",
    marginTop: normalize(10),
  },
  headerContent: {
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(5),
  },
  scoreContainer: {
    flexDirection: "row",
  },
  scoreText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 24,
    color: Colorpath.ButtonColr,
  },
  progressContainer: {
    paddingVertical: normalize(5),
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: '#000000',
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colorpath.green,
  },
  radioButtonUnselected: {
    height: 10,
    width: 10,
    backgroundColor: 'transparent',
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
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginTop: 10,
    textAlignVertical: 'top'
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

export default PreTest;
