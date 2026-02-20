import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, FlatList, ImageBackground, TextInput, Animated, Easing, BackHandler, Pressable } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import TextFieldIn from '../../Components/Textfield';
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import CellModal from '../../Components/CellModal';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { OCRCertificateRequest, addCreditVaultRequest, addCreditsRequest, dashboardRequest, stateCourseRequest, stateMandatoryRequest } from '../../Redux/Reducers/DashboardReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import CameraPicker from '../../Components/CameraPicker';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../Utils/Helpers/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import CrossIcon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import DropdownInput from '../../Components/DropdownInput';
import CreditTypeComponent from './CreditTypeComponent';
import ChooseMandatoryComponent from './ChooseMandatoryComponent';
import TextInputSingle from '../../Components/SingleTextinput';
import CustomInputTouchable from '../../Components/IconTextIn';
import InputField from '../../Components/CellInput';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import showDur from '../../Utils/Helpers/Duration';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const AddCredits = (props) => {
    console.log(props?.route?.params?.creditvalut, props?.route?.params?.creditvalutboard, "jjjjjjj", props?.route?.params?.creditvalutstate?.state_name, "Props111", props?.route?.params?.creditvalutboard?.board_data?.board_id, ocrData, props?.route?.params?.FullBoard, props?.route?.params?.boardCert);
    console.log("Propsfulldata=====", props?.route?.params, props?.route?.params?.fulldata, "hjhh", props?.route?.params?.fulldata?.fulldata);
    console.log("mainAdd=====1223", props?.route?.params?.mainAdd, props?.route?.params?.mainAdd?.state_name);
    const [activitytitle, setActivitytitle] = useState('');
    const [provideName, setProvideName] = useState('');
    const [creditscount, setCreditscount] = useState('');
    const [cdate, setCdate] = useState('');
    const [cleardata, setCleardata] = useState(false);
    const [stopic, setStopic] = useState('');
    const [isModalVisiblecred, setModalVisiblecred] = useState(false);
    const [opendate, setOpendate] = useState(false);
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [selectCountry, setSelectCountry] = useState([]);
    const [clist, setClist] = useState('');
    const [searchtext, setSearchtext] = useState('');
    const isfocused = useIsFocused();
    const [countrypicker, setcountrypicker] = useState(false);
    const [country, setCountry] = useState('');
    const [creditId, setCreditId] = useState();
    const [cameraPicker, setCameraPicker] = useState(false);
    const [ProfilePicObj1, setProfilePicObj1] = useState("");
    const [ProfilePicUri1, setProfilePicUri1] = useState('');
    const [finalstate, setFinalstate] = useState();
    const [stateMan, setStateMan] = useState(false);
    const [stateManData, setStateManData] = useState([]);
    const [statetopicpicker, setStatetopicpicker] = useState(false);
    const [clisttopic, setClisttopic] = useState('');
    const [searchtexttopic, setSearchtexttopic] = useState('');
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [topicId, setTopicId] = useState("");
    const [ocrData, setOCRData] = useState(null);
    const [moretext, setMoretext] = useState(false);
    console.log(finalstate, "mmmmmmmm", moretext)
    const addCreditBack = () => {
        props.navigation.goBack();
    };
    console.log(AuthReducer, "df,mkkkk", clisttopic, clisttopic[0]?.name, cleardata, ProfilePicObj1);
    console.log(clist, "dropdowndata========", ProfilePicObj1 === null, ProfilePicObj1
        ? ProfilePicObj1.uri
            ? ProfilePicObj1.uri.split('/').pop().replace(/-/g, '').slice(-16)
            : ProfilePicObj1.split('/').pop()
        : ProfilePicObj1)
    const [finalverifyadd, setFinalverifyadd] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    useEffect(() => {
        const token_handle_vault = () => {
            setTimeout(async () => {
                try {
                    const [board_special, profession_data] = await Promise.all([
                        AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                        AsyncStorage.getItem(constants.PROFESSION)
                    ]);
                    const board_special_json = board_special ? JSON.parse(board_special) : null;
                    const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
                    setFinalverifyadd(board_special_json);
                    setFinalProfession(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [props?.route?.params?.creditvalut, props?.route?.params?.creditvalutboard]);
    const handleCreditType = (item) => {
        setCountry(item?.name);
        setcountrypicker(false);
        setCreditId(item?.id);
    }
    useEffect(() => {
        if (country) {
            setSearchtext("");
        }
    }, [country])
    useEffect(() => {
        if (!searchtext && DashboardReducer?.addCreditsResponse?.credit_types) {
            setClist(DashboardReducer?.addCreditsResponse?.credit_types);
        }
    }, [searchtext])
    // useEffect(() => {
    //     const token_handle_vaultadd = () => {
    //       setTimeout(async () => {
    //         const board_special_add = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
    //         console.log(board_special_add, "statelicesene=================addcredit");
    //         const jsonObject = JSON.parse(board_special_add);
    //         setFinalverifyadd(jsonObject);
    //       }, 500);
    //     };

    //     try {
    //         token_handle_vaultadd();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }, [props?.route?.params?.creditvalut]);

    useFocusEffect(
        React.useCallback(() => {
            let obj = {};

            const fetchData = () => {
                connectionrequest()
                    .then(() => {
                        dispatch(stateMandatoryRequest(obj));
                    })
                    .catch((err) => {
                        showErrorAlert("Please connect to internet", err);
                    });
            };

            fetchData();

            // Cleanup if needed
            return () => {
                // Cleanup logic here if necessary
            };
        }, [])
    );

    function directCameraCredit() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            mediaType: 'any',
        })
            .then(response => {
                let imageObj = {
                    name: response.filename
                        ? response.filename
                        : response.path.replace(/^.*[\\\/]/, ''),
                    type: response.mime,
                    uri: response.path,
                };
                setProfilePicObj1(imageObj);
                setProfilePicUri1(imageObj.uri);
            })
            .catch(err => console.log(err));
    }
    const toggleModalcred = () => {
        setModalVisiblecred(!isModalVisiblecred);
    };
    console.log(finalProfession?.profession, "profession======122");
    const addcreditAgain = () => {
        const profession = finalProfession?.profession || AuthReducer?.verifymobileResponse?.user?.profession ||
            AuthReducer?.loginResponse?.user?.profession ||
            AuthReducer?.againloginsiginResponse?.user?.profession || finalverifyadd?.profession;
        connectionrequest()
            .then(() => {
                dispatch(addCreditsRequest(profession));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    // useEffect(() => {
    //     const profession = AuthReducer?.verifymobileResponse?.user?.profession ||
    //         AuthReducer?.loginResponse?.user?.profession ||
    //         AuthReducer?.againloginsiginResponse?.user?.profession || finalverifyadd?.profession ;
    //     connectionrequest()
    //         .then(() => {
    //             dispatch(addCreditsRequest(profession));
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             showErrorAlert('Please connect to Internet');
    //         });
    // }, [isfocused,props?.route?.params?.creditvalut]);
    const StateMandatoryDat = [{ id: 0, name: "No" }, { id: 1, name: "Yes" }]
    const handleAddCredits = () => {
        if (!ProfilePicObj1) {
            showErrorAlert("Please upload a valid file (accepted formats: .docx, .pptx, .word, .jpg, .png, .jpeg)");
        } else if (!activitytitle) {
            showErrorAlert("Enter your activity title.");
        } else if (!provideName) {
            showErrorAlert("Enter your provide name.");
        } else if (!country) {
            showErrorAlert("Select your credit type");
        } else if (!creditscount) {
            showErrorAlert("Enter your credits");
        } else if (!cdate) {
            showErrorAlert("Select your issue date ");
        } else if (finalstate === "Yes" && !stopic) {
            showErrorAlert("Select your topic")
        } else {
            let obj = new FormData();
            obj.append("id", props?.route?.params?.creditvalutstate?.id || props?.route?.params?.mainAdd?.creditID?.id || props?.route?.params?.creditvalut?.id || props?.route?.params?.fulldata?.fulldata?.id || props?.route?.params?.mainAdd?.id || props?.route?.params?.mainAdd?.state_data?.id || "");
            obj.append("course_title", activitytitle);
            obj.append("credit_type", creditId);
            obj.append("credits", +(creditscount));
            obj.append("completion_date", cdate);
            obj.append("certificate", ProfilePicObj1);
            obj.append("board_id", props?.route?.params?.fulldata?.takeboardall?.board_data?.board_id || props?.route?.params?.creditvalutstate?.board_data?.board_id || props?.route?.params?.fulldata?.statenamefull?.board_data?.board_id || props?.route?.params?.creditvalutboard?.board_data?.board_id || props?.route?.params?.FullBoard?.stateid || props?.route?.params?.creditvalut?.board_data?.board_id || props?.route?.params?.fulldata?.fulldata?.state_board_id || props?.route?.params?.mainAdd?.board_data?.board_id || props?.route?.params?.mainAdd?.state_data?.board_data?.board_id || props?.route?.params?.mainAdd?.statid || props?.route?.params?.mainAdd?.creditID?.board_id || props?.route?.params?.mainAdd?.board_id || "");
            obj.append("source_type", props?.route?.params?.fulldata?.takeboardall?.board_data?.board_id || props?.route?.params?.FullBoard?.stateid || props?.route?.params?.creditvalutboard?.board_data?.board_id ? "certificate" : "licensure");
            obj.append("mandatory_topic", finalstate == "Yes" ? topicId : "");
            obj.append("course_provider", provideName)
            obj.append("ocr_format_id", ocrData ? ocrData?.ocr_format_id : "")
            console.log(obj, "add credits");
            connectionrequest()
                .then(() => {
                    dispatch(addCreditVaultRequest(obj));
                })
                .catch(err => { showErrorAlert("Please connect to internet") })
        }
    }
    const searchCreditName = text => {
        console.log(text, 'text12333');
        if (text) {
            const listData = selectCountry?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.name);
                const itemData = item?.name
                    ? item?.name?.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.trim().toUpperCase();
                const filteredData = itemData.indexOf(textData) > -1;
                console.log('filteredData', filteredData);
                return filteredData;
            });
            setClist(listData);
            setSearchtext(text);
        } else {
            setClist(selectCountry);
            setSearchtext(text);
        }
    };
    useEffect(() => {
        if (ocrData?.activity_title) {
            setActivitytitle(ocrData.activity_title);
        } else if (props?.route?.params?.fulldata?.fulldata?.program_title) {
            setActivitytitle(props?.route?.params?.fulldata?.fulldata?.program_title);
        }
    }, [ocrData?.activity_title, props?.route?.params?.fulldata?.fulldata?.program_title]);
    useEffect(() => {
        if (ocrData?.provider_name) {
            setProvideName(ocrData.provider_name);
        } else if (props?.route?.params?.fulldata?.fulldata?.program_provider) {
            setProvideName(props?.route?.params?.fulldata?.fulldata?.program_provider);
        }
    }, [ocrData?.provider_name, props?.route?.params?.fulldata?.fulldata?.program_provider]);
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata?.credit_type) {
            setCountry(props?.route?.params?.fulldata?.fulldata?.credit_type);
            setCreditId(props?.route?.params?.fulldata?.fulldata?.cmetype);
        }
    }, [props?.route?.params?.fulldata?.fulldata?.credit_type])
    useEffect(() => {
        if (ocrData?.number_of_credits_earned) {
            setCreditscount(ocrData?.number_of_credits_earned);
        } else if (props?.route?.params?.fulldata?.fulldata?.cmepoints) {
            setCreditscount(props?.route?.params?.fulldata?.fulldata?.cmepoints);
        }
    }, [ocrData?.number_of_credits_earned, props?.route?.params?.fulldata?.fulldata?.cmepoints]);
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata?.program_date) {
            setCdate(props?.route?.params?.fulldata?.fulldata?.program_date);
        }
    }, [props?.route?.params?.fulldata?.fulldata?.program_date]);
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata) {
            setFinalstate("No");
        }
    }, [props?.route?.params?.fulldata?.fulldata])
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata?.mandated_course === "1") {
            setFinalstate("Yes");
            dispatch(stateMandatoryRequest({}));
        }
    }, [props?.route?.params?.fulldata?.fulldata?.mandated_course]);
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata?.certificate) {
            const fileName = props?.route?.params?.fulldata?.fulldata?.certificate;
            setProfilePicObj1(`${props?.route?.params?.fulldata?.certiPath?.certificate_path}${fileName}`);
        }
    }, [props?.route?.params?.fulldata?.fulldata?.certificate]);
    console.log(ProfilePicObj1, "fileobject12222==========", clisttopic, finalstate)
    useEffect(() => {
        if (props?.route?.params?.fulldata?.fulldata?.mandatory_topic_id && finalstate == "Yes") {
            const handleID = props?.route?.params?.fulldata?.fulldata?.mandatory_topic_id;
            const finalData = clisttopic || [];
            const matchedItem = finalData.find(item => item?.id == handleID);
            if (matchedItem) {
                setStopic(matchedItem?.name || "");
                setTopicId(matchedItem?.id);
            } else if (finalData.length > 0) {
                setStopic(finalData[0]?.name || "");
                setTopicId(finalData[0]?.id);
            }
        }
    }, [clisttopic]);
    console.log(stopic, "stopic------1222")
    const searchTopicName = text => {
        console.log(text, 'text12333');
        if (text) {
            const listAllData = selectCountrytopic?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.name);
                const itemDataTopic = item?.name
                    ? item?.name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                console.log('AllDataFilter', AllDataFilter);
                return AllDataFilter;
            });
            setClisttopic(listAllData);
            setSearchtexttopic(text);
        } else {
            setClisttopic(selectCountrytopic);
            setSearchtexttopic(text);
        }
    };
    const fullDataMemo = useMemo(() => props?.route?.params?.fulldata, [props?.route?.params?.fulldata]);
    useEffect(() => {
        if (!fullDataMemo && !ProfilePicObj1) return;
        if (props?.route?.params?.creditvalutboard) return;
        const obj = new FormData();
        obj.append("document", ProfilePicObj1 || `${fullDataMemo?.certiPath?.certificate_path}${fullDataMemo?.certificate}`);

        const handleRequest = async () => {
            try {
                await connectionrequest();
                dispatch(OCRCertificateRequest(obj));
            } catch (err) {
                showErrorAlert("Please connect to the internet", err);
            }
        };
        handleRequest();
    }, [ProfilePicObj1, fullDataMemo, props?.route?.params?.creditvalutboard]);
    console.log(ProfilePicObj1 ? ProfilePicObj1?.uri?.split('/')?.pop()?.replace(/-/g, '') : ProfilePicObj1, "omg =========")
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/addCreditsRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/addCreditsSuccess':
                status = DashboardReducer.status;
                setSelectCountry(DashboardReducer?.addCreditsResponse?.credit_types);
                setClist(DashboardReducer?.addCreditsResponse?.credit_types);
                break;
            case 'Dashboard/addCreditsFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateMandatoryRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateMandatorySuccess':
                status = DashboardReducer.status;
                setStateManData(DashboardReducer?.stateMandatoryResponse?.state_data)
                break;
            case 'Dashboard/stateMandatoryFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/addCreditVaultRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/addCreditVaultSuccess':
                status = DashboardReducer.status;
                if (props?.route?.params?.mainAdd?.creditID?.state_id || props?.route?.params?.creditvalut?.state_id || props?.route?.params?.fulldata?.statenamefull?.state_id) {
                    let obj = {
                        "state_id": props?.route?.params?.creditvalut?.state_id || props?.route?.params?.fulldata?.statenamefull?.state_id
                    }
                    dispatch(stateCourseRequest(obj));
                }
                dispatch(dashboardRequest({}))
                toggleModalcred();
                break;
            case 'Dashboard/addCreditVaultFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/OCRCertificateRequest':
                status = DashboardReducer.status;
                if (props?.route?.params?.creditvalutstate?.id || props?.route?.params?.creditvalut?.id || moretext) {
                    showDur("We are currently retrieving the details from your certificate.", 10000)
                }
                break;
            case 'Dashboard/OCRCertificateSuccess':
                status = DashboardReducer.status;
                console.log(DashboardReducer?.OCRCertificateResponse?.list_data?.documents[0]?.field_data, "field_data============>>>>>>>>>>>>>>>");
                setOCRData(DashboardReducer?.OCRCertificateResponse?.list_data?.documents[0]?.field_data);
                break;
            case 'Dashboard/OCRCertificateFailure':
                status = DashboardReducer.status;
                break;
        }
    }

    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const animatedValuescrdit = useRef(new Animated.Value(1)).current;
    const scaleValuesescredit = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    const animatedValuestate = useRef(new Animated.Value(1)).current;
    const scaleValuesestate = useRef(new Animated.Value(0)).current;
    const animatedValuestatedate = useRef(new Animated.Value(1)).current;
    const scaleValuesestatedate = useRef(new Animated.Value(0)).current;
    const animatedValuestatedatetopic = useRef(new Animated.Value(1)).current;
    const scaleValuesestatedatetopic = useRef(new Animated.Value(0)).current;
    const animatedValuesimg = useRef(new Animated.Value(1)).current;
    const scaleValuesesimg = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScaleprofdd = finalstate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestate, {
                toValue: finalstate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestate, {
                toValue: targetScaleprofdd,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [finalstate]);
    useEffect(() => {
        const targetScaleprotopic = finalstate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestatedatetopic, {
                toValue: finalstate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestatedatetopic, {
                toValue: targetScaleprotopic,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [stopic]);
    useEffect(() => {
        const targetScaleprofddff = cdate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestatedate, {
                toValue: cdate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestatedate, {
                toValue: targetScaleprofddff,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cdate]);
    useEffect(() => {
        const targetScaleprof = activitytitle ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: activitytitle ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScaleprof,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [activitytitle]);
    useEffect(() => {
        const targetScaleprofd = creditscount ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: creditscount ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetScaleprofd,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [creditscount]);
    useEffect(() => {
        const targetcrdit = country ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuescrdit, {
                toValue: country ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesescredit, {
                toValue: targetcrdit,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [country])
    useEffect(() => {
        const targetImg = ProfilePicObj1 ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesimg, {
                toValue: ProfilePicObj1 ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesimg, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [ProfilePicObj1]);
    useEffect(() => {
        const targetScaleprov = provideName ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: provideName ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesespass, {
                toValue: targetScaleprov,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [provideName]);

    const finalStateWise = stateManData ? stateManData : "No data";
    const StateNameFetch = props?.route?.params?.creditvalutstate?.state_name || props?.route?.params?.fulldata?.statenamefull?.state_name || props?.route?.params?.mainAdd?.creditID?.state_name || props?.route?.params?.creditvalut?.state_name || props?.route?.params?.fulldata?.statenamefull?.state_name || DashboardReducer?.stateCourseResponse?.data?.state_data?.state_name || props?.route?.params?.mainAdd?.state_name || null;
    console.log(StateNameFetch, "StateNameFetch===========", finalStateWise)
    function getStateDataByName(finalStateWise, StateNameFetch) {
        for (const key in finalStateWise) {
            if (finalStateWise[key].state_name === StateNameFetch) {
                return finalStateWise[key];
            }
        }
        return null;
    }
    function detectfileAddcredit(file) {
        console.log(file, "file000");
        const fileName = typeof file === 'string' ? file : file?.uri;
        if (fileName && typeof fileName === 'string') {
            if (fileName.toLowerCase().endsWith('.png')) {
                Alert.alert('eMedEvents', 'Are you sure you want to delete this image?', [{
                    text: "No", onPress: () => console.log("No pressed")
                }, {
                    text: "Yes", onPress: () => {
                        setProfilePicObj1("");
                        setActivitytitle('');
                        setProvideName('');
                        setOCRData(null);
                    }
                }]);
            } else if (fileName.toLowerCase().endsWith('.jpg')) {
                Alert.alert('eMedEvents', 'Are you sure you want to delete this image?', [{
                    text: "No", onPress: () => console.log("No pressed")
                }, {
                    text: "Yes", onPress: () => {
                        setProfilePicObj1("");
                        setActivitytitle('');
                        setProvideName('');
                        setOCRData(null);
                    }
                }]);
            } else if (fileName.toLowerCase().endsWith('.pdf')) {
                Alert.alert('eMedEvents', 'Are you sure you want to delete this PDF?', [{
                    text: "No", onPress: () => console.log("No pressed")
                }, {
                    text: "Yes", onPress: () => {
                        setProfilePicObj1("");
                        setActivitytitle('');
                        setProvideName('');
                        setOCRData(null);
                    }
                }]);
            } else {
                Alert.alert('eMedEvents', 'Are you sure you want to delete this item?', [{
                    text: "No", onPress: () => console.log("No pressed")
                }, {
                    text: "Yes", onPress: () => {
                        setProfilePicObj1("");
                        setActivitytitle('');
                        setProvideName('');
                        setOCRData(null);
                    }
                }]);
            }
        } else {
            console.log("Invalid file or file URI");
        }
    }
    const topicwiseStatehand = (hello) => {
        setStopic(hello?.name);
        setTopicId(hello?.id)
        setStatetopicpicker(false);
    }
    useEffect(() => {
        if (finalStateWise && StateNameFetch) {
            const alabamaData = getStateDataByName(finalStateWise, StateNameFetch);
            const originalData = alabamaData?.topics;
            if (originalData) {
                const transformedData = originalData?.flatMap((item) =>
                    Object.entries(item.topic_list)?.map(([id, name]) => ({
                        id: Number(id),
                        name: name
                    }))
                );
                setSelectCountrytopic(transformedData);
                setClisttopic(transformedData);
            } else {
                setClisttopic([]);
            }
        }
    }, [finalStateWise, StateNameFetch]);
    useEffect(() => {
        if (ProfilePicObj1 === null) {
            setProfilePicObj1("")
        }
    }, [ProfilePicObj1])
    useEffect(() => {
        if (finalstate == "No") {
            setStopic("");
            setFinalstate("No")
        }
    }, [finalstate])
    useEffect(() => {
        const onBackPress = () => {
            addCreditBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const handleChange = (text) => {
        const numericValue = text.replace(/[^0-9.]/g, "");
        if (text.startsWith("-") || text == "-1" || parseFloat(text) < 0) {
            return;
        }
        setCreditscount(numericValue);
    };
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    console.log(clisttopic?.length == 0, DashboardReducer?.stateCourseResponse?.data?.state_data, "creditvault123", props?.route?.params?.creditvalut, clisttopic)
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {countrypicker ? (
                    <CreditTypeComponent
                        clist={clist}
                        searchCreditName={searchCreditName}
                        searchtext={searchtext}
                        handleCreditType={handleCreditType}
                        setcountrypicker={setcountrypicker}
                    />) : statetopicpicker ? (
                        <ChooseMandatoryComponent
                            clisttopic={clisttopic}
                            searchTopicName={searchTopicName}
                            searchtexttopic={searchtexttopic}
                            topicwiseStatehand={topicwiseStatehand}
                            setStatetopicpicker={setStatetopicpicker}
                        />) : <>
                    {Platform.OS === 'ios' ? <PageHeader title="Add Credits" onBackPress={addCreditBack} /> : <View>
                        <PageHeader title="Add Credits" onBackPress={addCreditBack} />
                    </View>}
                    <Loader
                        visible={DashboardReducer?.status == 'Dashboard/addCreditVaultRequest' || DashboardReducer?.status == 'Dashboard/OCRCertificateRequest'} />
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: normalize(50) }}>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), backgroundColor: "#FF6D68", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#FFFFFF" }}>{"Upload/Scan the document first to fill the form"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text style={styles.headerText}>{`Add New Credit for ${props?.route?.params?.creditvalutstate?.state_name || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_name || props?.route?.params?.creditvalutboard?.board_data?.board_name || props?.route?.params?.FullBoard?.boardtakefinal || props?.route?.params?.mainAdd?.creditID?.state || props?.route?.params?.creditvalut?.state_name || props?.route?.params?.fulldata?.statenamefull?.state_name || DashboardReducer?.stateCourseResponse?.data?.state_data?.state_name || props?.route?.params?.mainAdd?.state_name || null
                                    }`}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                                <Pressable>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            {/* <CustomInputTouchable
                                            label={"Upload/Scan Document*"}
                                            value={ProfilePicObj1
                                            ? ProfilePicObj1.uri
                                                ? ProfilePicObj1.uri
                                                    .split('/')
                                                    .pop()
                                                    .replace(/-/g, '')
                                                    .slice(-16)
                                                : ProfilePicObj1.split('/').pop()
                                                : ''}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            rightIcon={ProfilePicObj1 ? <DeleteIcon name="delete" size={25} color="#949494" /> : <ScanIcon name="scan1" size={28} color="#949494" />}
                                            onPress={() => {
                                                setCameraPicker(true)
                                            }}
                                            onIconpres={() => {
                                                if (ProfilePicObj1) {
                                                    detectfileAddcredit(ProfilePicObj1);
                                                    setActivitytitle('');
                                                    setProvideName('');
                                                } else {
                                                    directCameraCredit();
                                                }
                                            }}
                                            textStyle={{ color: ProfilePicObj1 ? Colorpath.ButtonColr : "#949494" }}
                                        /> */}
                                            <InputField
                                                label={"Upload/Scan Document*"}
                                                value={ProfilePicObj1
                                                    ? ProfilePicObj1.uri
                                                        ? ProfilePicObj1.uri
                                                            .split('/')
                                                            .pop()
                                                            .replace(/-/g, '')
                                                            .slice(-16)
                                                        : ProfilePicObj1.split('/').pop()
                                                    : ''}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={ProfilePicObj1 ? <DeleteIcon name="delete" size={25} color="#949494" /> : <ScanIcon name="scan1" size={28} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    if (ProfilePicObj1) {
                                                        detectfileAddcredit(ProfilePicObj1);
                                                    } else {
                                                        setMoretext(true);
                                                        directCameraCredit();
                                                    }
                                                }}
                                                onwholePress={() => {
                                                    if (ProfilePicObj1) {
                                                        detectfileAddcredit(ProfilePicObj1);
                                                    } else {
                                                        setMoretext(true);
                                                        setCameraPicker(true);
                                                    }
                                                }}
                                                marginleft={normalize(270)}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <InputField
                                            label='Activity Title*'
                                            value={activitytitle}
                                            onChangeText={setActivitytitle}
                                            placeholder=''
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            maxlength={100}
                                            editable={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.program_title ? true : false}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <InputField
                                            label={props?.route?.params?.FullBoard || props?.route?.params?.creditvalutboard || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_name ? 'Organizer Name*' : 'Provider Name*'}
                                            value={provideName}
                                            onChangeText={setProvideName}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            maxlength={100}
                                            editable={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.program_provider ? true : false}
                                        />
                                    </View>
                                </View>
                                <Pressable disabled={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.credit_type ? false : true} onPress={() => {
                                    setcountrypicker(!countrypicker);
                                    addcreditAgain();
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <InputField
                                                icondisable={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.credit_type ? false : true}
                                                label={"Credit Type*"}
                                                value={country}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    setcountrypicker(!countrypicker);
                                                    addcreditAgain();
                                                }}
                                                onwholePress={() => {
                                                    setcountrypicker(!countrypicker);
                                                    addcreditAgain();
                                                }}
                                                marginleft={normalize(270)}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>

                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <InputField
                                            label={'No. of Credits*'}
                                            value={creditscount}
                                            onChangeText={handleChange}
                                            placeholder={''}
                                            placeholderTextColor="#949494"
                                            keyboardType="phone-pad"
                                            showCountryCode={false}
                                            maxlength={100}
                                            editable={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.cmepoints ? true : false}
                                        />
                                    </View>
                                </View>
                                <Pressable onPress={() => {
                                    if (cdate) {
                                        setCdate("");
                                    } else {
                                        setOpendate(!opendate)
                                    }
                                }} disabled={ProfilePicObj1 || cdate ? false : true}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <InputField
                                                icondisable={ProfilePicObj1 || cdate ? false : true}
                                                label={"Issue Date*"}
                                                value={cdate ? moment(cdate).format("MM-DD-YYYY") : cdate}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={cdate ? <CrossIcon name="closecircle" size={18} color="#949494" /> : <CalenderIcon name="calendar" size={25} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    if (cdate) {
                                                        Alert.alert("eMedEvents", "Are you sure you want to remove issue date ?", [{ text: "Yes", onPress: () => setCdate(""), style: "default" }, { text: "No", onPress: () => console.log("dfdf"), style: "cancel" }])
                                                    } else {
                                                        setOpendate(!opendate)
                                                    }
                                                }}
                                                onwholePress={() => {
                                                    if (cdate) {
                                                        Alert.alert("eMedEvents", "Are you sure you want to remove issue date ?", [{ text: "Yes", onPress: () => setCdate(""), style: "default" }, { text: "No", onPress: () => console.log("dfdf"), style: "cancel" }])
                                                    } else {
                                                        setOpendate(!opendate)
                                                    }
                                                }}
                                                marginleft={normalize(270)}
                                                spaceneeded={true}
                                            />

                                            {/* <CustomInputTouchable
                                                label={"Issue Date*"}
                                                value={cdate}
                                                placeholder={""}
                                                placeholderTextColor="#949494"
                                                rightIcon={cdate ? <CrossIcon name="closecircle" size={18} color="#949494" /> : <CalenderIcon name="calendar" size={25} color="#949494" />}
                                                onPress={() => {
                                                    setOpendate(!opendate)
                                                }}
                                                onIconpres={() => {
                                                    if (cdate) {
                                                        setCdate("");
                                                    } else {
                                                        setOpendate(!opendate)
                                                    }
                                                }}
                                                disabled={ProfilePicObj1 || cdate ? false : true}
                                            /> */}
                                        </View>
                                    </View>
                                </Pressable>
                                {(clisttopic?.length == 0 || props?.route?.params?.FullBoard?.stateid || props?.route?.params?.creditvalutboard?.board_data?.board_id || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_id) ?
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <Pressable disabled={clisttopic?.length == 0 || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_id || props?.route?.params?.FullBoard?.stateid || props?.route?.params?.creditvalutboard?.board_data?.board_id ? true : false} onPress={() => setStateMan(true)}>
                                                <InputField
                                                    icondisable={clisttopic?.length == 0 || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_id || props?.route?.params?.FullBoard?.stateid || props?.route?.params?.creditvalutboard?.board_data?.board_id ? true : false}
                                                    label={"State Mandated Course*"}
                                                    value={finalstate ? finalstate : undefined}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    editable={false}
                                                    leftIcon={<DropdownIcon name="chevron-small-down" style={{ bottom: -13 }} size={25} color="#949494" />}
                                                    onLeftIconPress={() => {
                                                        setStateMan(true);
                                                    }}
                                                    onwholePress={() => setStateMan(true)}
                                                    marginleft={normalize(270)}
                                                    bgv={true}
                                                    notext={"State Mandated Course*"}
                                                />
                                            </Pressable>
                                        </View>
                                    </View> : <View style={{

                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>

                                            {/* <CustomInputTouchable
                                                label={"State Mandated Course*"}
                                                value={finalstate ? finalstate : undefined}
                                                placeholder={""}
                                                placeholderTextColor="#949494"
                                                rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onPress={() => {
                                                    setStateMan(true);
                                                }}
                                                onIconpres={() => {
                                                    setStateMan(true);
                                                }}
                                                disabled={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.mandated_course ? false : true}
                                            /> */}
                                            <Pressable disabled={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.mandated_course ? false : true} onPress={() => setStateMan(true)}>
                                                <InputField
                                                    icondisable={ProfilePicObj1 || props?.route?.params?.fulldata?.fulldata?.mandated_course ? false : true}
                                                    label={"State Mandated Course*"}
                                                    value={finalstate ? finalstate : undefined}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    editable={false}
                                                    leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onLeftIconPress={() => {
                                                        setStateMan(true);
                                                    }}
                                                    onwholePress={() => setStateMan(true)}
                                                    marginleft={normalize(270)}
                                                    spaceneeded={true}
                                                />
                                            </Pressable>
                                        </View>
                                    </View>}

                                <Pressable disabled={finalstate === "Yes" ? false : true} onPress={() => setStatetopicpicker(!statetopicpicker)}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0),
                                        }}>
                                            <CustomInputTouchable
                                                label={"Choose State Mandatory Topic*"}
                                                value={stopic}
                                                placeholder={finalstate === "Yes" ? "" : "Choose State Mandatory Topic*"}
                                                placeholderTextColor="#949494"
                                                // wrapperStyle={{ backgroundColor:finalstate === "Yes"  ? Colorpath.Pagebg:"#E6ECF2" }}
                                                newstyle={finalstate === "Yes" ? "Yes" : "No"}
                                                rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onPress={() => {
                                                    setStatetopicpicker(!statetopicpicker);
                                                }}
                                                onIconpres={() => {
                                                    setStatetopicpicker(!statetopicpicker);
                                                }}
                                                disabled={finalstate === "Yes" ? false : true}
                                            />
                                            {/* <InputField
                                                icondisable={finalstate === "Yes" ? false : true}
                                                label={"Choose State Mandatory Topic*"}
                                                value={stopic}
                                                addnewtyle={{backgroundColor:"#DADADA"}}
                                                labelStyle={{color:"green"}}
                                                // newstyle={finalstate === "Yes" ? "Yes" : "No"}
                                                placeholder={""}
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onLeftIconPress={() => setStatetopicpicker(!statetopicpicker)}
                                                marginleft={normalize(270)}
                                            /> */}
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            <Buttons
                                onPress={handleAddCredits}
                                height={normalize(45)}
                                width={normalize(300)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Save"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />

                            <Buttons
                                onPress={() => {
                                    props.navigation.goBack();
                                }}
                                height={normalize(45)}
                                width={normalize(280)}
                                backgroundColor={Colorpath.Pagebg}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(0)}
                            />

                            <CellModal
                                isVisible={isModalVisiblecred}
                                onClose={toggleModalcred}
                                content={props?.route?.params?.FullBoard || props?.route?.params?.creditvalutboard || props?.route?.params?.fulldata?.takeboardall?.board_data?.board_name ? "Board certificate details \n added successfully." : "Licensure certificate details \n added successfully."}
                                navigation={props.navigation}
                                name={"TabNav"}
                            />


                            <DateTimePickerModal
                                isVisible={opendate}
                                mode="date"
                                maximumDate={new Date()}
                                onConfirm={val => {
                                    setCdate(moment(val).format('YYYY-MM-DD'));
                                    setOpendate(false);
                                }}
                                onCancel={() => setOpendate(false)}
                                textColor="black"
                            />


                            <Modal
                                animationIn={'slideInUp'}
                                animationOut={'slideOutDown'}
                                isVisible={stateMan}
                                backdropColor={Colorpath.black}
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    margin: 0,
                                }}
                                onBackdropPress={() => setStateMan(false)}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => setStateMan(false)}>
                                    <KeyboardAvoidingView
                                        style={{
                                            flex: 1,
                                        }}
                                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                                        <View
                                            style={[
                                                {
                                                    borderRadius: normalize(7),
                                                    height:
                                                        Platform.OS === 'ios' ? normalize(140) : normalize(120),
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    width: '100%',
                                                    backgroundColor: '#fff',
                                                },
                                            ]}>
                                            <FlatList
                                                contentContainerStyle={{
                                                    paddingBottom: normalize(70),
                                                    paddingTop: normalize(7),
                                                }}
                                                showsVerticalScrollIndicator={false}
                                                keyExtractor={item => item.id}
                                                data={StateMandatoryDat}
                                                ListEmptyComponent={
                                                    <View
                                                        style={{
                                                            height:
                                                                Platform.OS === 'ios'
                                                                    ? normalize(500)
                                                                    : normalize(390),
                                                        }}>
                                                        <Text
                                                            style={{
                                                                alignContent: 'center',
                                                                alignItems: 'center',
                                                                alignSelf: 'center',
                                                                color: Colorpath.grey,
                                                                fontWeight: 'bold',
                                                                fontFamily: Fonts.InterSemiBold,
                                                                fontSize: normalize(20),
                                                                paddingTop: normalize(30),
                                                            }}>
                                                            No state course found
                                                        </Text>
                                                    </View>
                                                }
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => {
                                                                setFinalstate(item?.name);
                                                                setStateMan(false);
                                                                dispatch(stateMandatoryRequest({}))
                                                            }}
                                                            style={[styles.dropDownItem]}>
                                                            <Text style={[styles.dropDownItemText]}>
                                                                {item?.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </View>
                                    </KeyboardAvoidingView>
                                </TouchableOpacity>
                            </Modal>



                        </ScrollView>
                    </KeyboardAvoidingView>
                    <CameraPicker
                        cropping={true}
                        pickerVisible={cameraPicker}
                        onBackdropPress={() => setCameraPicker(false)}
                        btnClick_cameraUpload={imgObj => {
                            console.log('imgObj:::::::::', imgObj);
                            setProfilePicObj1(imgObj);
                            setProfilePicUri1(imgObj.uri);
                            setCameraPicker(false);
                        }}
                        btnClick_ImageUpload={imgObj => {
                            console.log('imgObj:::::::::', imgObj);
                            setProfilePicObj1(imgObj);
                            setProfilePicUri1(imgObj.uri);
                            setCameraPicker(false);
                        }}
                        btnClick_galeryUpload={imgObj => {
                            setProfilePicObj1(imgObj);
                            setProfilePicUri1(imgObj.uri);
                            setCameraPicker(false);
                        }}
                    />

                </>}

            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 18,
        color: "#000000",
        fontWeight: "bold",
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: normalize(65),
        width: normalize(308),
        resizeMode: 'contain',
    },
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: normalize(14),
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize'
    },
    dropdown: {
        height: normalize(45),
        width: normalize(280),
        alignSelf: 'center',
        backgroundColor: Colorpath.textField,
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.5,
        marginTop: normalize(9),
        borderRadius: normalize(8),
    },
    imageBackground: {
        // height: normalize(65),
        // width: normalize(300),
        resizeMode: "contain",
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(10),
    },
    textContainer: {
        marginLeft: normalize(2),
    },
    uploadText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000s"
    },
    separatorLine: {
        height: normalize(35),
        width: 1,
        marginLeft: normalize(160),
        backgroundColor: "#DDDDDD",
    },
    iconContainer: {
        paddingVertical: normalize(6),
    },
});

export default AddCredits;
