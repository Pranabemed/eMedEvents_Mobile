import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, FlatList, Animated, Easing, TextInput, BackHandler, Pressable } from 'react-native'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import PageHeader from '../../Components/PageHeader'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import TextFieldIn from '../../Components/Textfield'
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button'
import CellModal from '../../Components/CellModal'
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CameraPicker from '../../Components/CameraPicker';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import { boardSpecialityRequest, boardcertificateRequest, dashboardRequest } from '../../Redux/Reducers/DashboardReducer'
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import constants from '../../Utils/Helpers/constants'
import DropdownInput from '../../Components/DropdownInput'
import BoardCustomed from './BoardCustomed';
import TextInputSingle from '../../Components/SingleTextinput'
import CustomInputTouchable from '../../Components/IconTextIn'
import DropdownIcon from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/CellInput'
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const AddCertificate = (props) => {
    console.log(totalboardname, "boardnamerealData=====", props?.route?.params);
    const [certificateboard, setCertificateboard] = useState(false);
    const [certificateID, setCertificateID] = useState(false);
    const [issuedate, setIssuedate] = useState(false);
    const [expirydate, setExpirydate] = useState(false);
    const [modalcert, setModalcert] = useState(false);
    const [boardfd, setBoardfd] = useState(false);
    const [boraded, setBoarded] = useState(false);
    const [boardcamera, setBoardcamera] = useState(false);
    const [boardPic, setBoardPic] = useState("");
    const [boardPicOT, setBoardPicOT] = useState("");
    const [boardID, setBoardID] = useState("");
    const [boardnamereal, setBoardnamereal] = useState([]);
    const [searchboardname, setsearchboardname] = useState("");
    const [bspecialityname, setBspecialityname] = useState("");
    const [boardnamepick, setBoardnamepick] = useState(false);
    const [visible, setVisible] = useState(false);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const addCretBack = () => {
        if (props?.route?.params?.profile) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: "BoardProfile",
                            params: {
                                board: "text",
                            }
                        }
                    ]
                })
            );
            navigation.goBack();
        } else if (props?.route?.params?.takeback == "back") {
            navigation.navigate("TabNav", { initialRoute: "Contact" });
        } else if (props?.route?.params?.profiledet) {
            navigation.goBack();
        } else {
            navigation.navigate("TabNav", { detectmain: "main" });
        }
    }
    const toggleModalcert = () => {
        setModalcert(!modalcert);
    };
    console.log(AuthReducer?.verifymobileResponse?.user?.specialities, DashboardReducer?.mainprofileResponse, "jel========;ooo", AuthReducer);
    console.log(DashboardReducer?.dashboardResponse?.data?.board_certifications, "Dashborad============", boardnamereal);
    const isFocus = useIsFocused();
    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const animatedValuesdate = useRef(new Animated.Value(1)).current;
    const scaleValuesesdate = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    const animatedValuesimg = useRef(new Animated.Value(1)).current;
    const scaleValuesesimg = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetImg = boardPic ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesimg, {
                toValue: boardPic ? 1 : 0,
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
    }, [boardPic]);
    useEffect(() => {
        const targetScaleprof = certificateboard ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: certificateboard ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesespass, {
                toValue: targetScaleprof,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [certificateboard]);
    useEffect(() => {
        const targetScaleIssuedate = issuedate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesdate, {
                toValue: issuedate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesdate, {
                toValue: targetScaleIssuedate,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [issuedate]);
    useEffect(() => {
        const targetScaleIssueex = expirydate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: expirydate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetScaleIssueex,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [expirydate]);
    useEffect(() => {
        const targetScales = certificateID ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: certificateID ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [certificateID]);
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/boardcertificateRequest':
                status = DashboardReducer.status;
                setVisible(!visible);
                break;
            case 'Dashboard/boardcertificateSuccess':
                status = DashboardReducer.status;
                setVisible(false);
                toggleModalcert();
                dispatch(dashboardRequest({}));
                break;
            case 'Dashboard/boardcertificateFailure':
                status = DashboardReducer.status;
                setVisible(false);
                break;
        }
    }
    function directUploadBoard() {
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
                setBoardPic(imageObj);
                setBoardPicOT(imageObj.uri);
            })
            .catch(err => console.log(err));
    }
    console.log(bspecialityname, "AuthReducer?.loginResponse?.user?.specialities=========", boardID, searchboardname);
    const handleBoardname = (roled) => {
        setCertificateboard(roled?.name);
        setBoardID(roled?.id)
        setBoardnamepick(false);
        setBspecialityname(roled?.specialities)
    }
    const [finalverifyboard, setFinalverifybaord] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const [boardspecial, setBoardspecial] = useState([]);
    const [totalboardname, setTotalboardname] = useState([]);

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
                    setFinalverifybaord(board_special_json);
                    setFinalProfession(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [isFocus]);

    const transformDataSpecial = (data) => {
        return Object.keys(data).map(key => {
            const specialities = Object.values(data[key].specialities).map(spec => spec.name);
            return {
                id: parseInt(key, 10),
                name: data[key].name,
                specialities: specialities.join(', ')
            };
        });
    };
    const roleBoardIds = useMemo(() => {
        const roleData = DashboardReducer?.dashboardResponse?.data?.board_certifications || [];
        return roleData
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.board_id === item.board_id)
            )
            .map(item => item.board_id);
    }, [DashboardReducer?.dashboardResponse?.data?.board_certifications]);

    useEffect(() => {
        const allBoardSpeciality = DashboardReducer?.boardSpecialityResponse?.certification_boards;
        if (allBoardSpeciality) {
            const dynamicDataSpecial = transformDataSpecial(allBoardSpeciality);
            const filteredBoards = dynamicDataSpecial.filter(board =>
                !roleBoardIds.includes(board.id.toString())
            );
            if (JSON.stringify(filteredBoards) !== JSON.stringify(totalboardname)) {
                setTotalboardname(filteredBoards);
                setBoardnamereal(filteredBoards);
            }
        }
    }, [DashboardReducer?.boardSpecialityResponse?.certification_boards, roleBoardIds, totalboardname]);

    useEffect(() => {
        if (props?.route?.params?.profiledet) {
            setBoardPic(props?.route?.params?.profiledet?.certification_file);
            setBspecialityname(props?.route?.params?.profiledet?.speciality);
            setCertificateboard(props?.route?.params?.profiledet?.board_name);
            setBoardID(props?.route?.params?.profiledet?.board_id);
            setCertificateID(props?.route?.params?.profiledet?.certification_id);
            setIssuedate(props?.route?.params?.profiledet?.from_date);
            setExpirydate(props?.route?.params?.profiledet?.to_date);
        }
    }, [props?.route?.params?.profiledet])

    useEffect(() => {
        const transformData = (data) => {
            return Object.keys(data).map(key => ({
                id: parseInt(key, 10),
                name: data[key]
            }));
        };

        const allBoardData = DashboardReducer?.mainprofileResponse?.specialities || AuthReducer?.loginResponse?.user?.specialities ||
            AuthReducer?.againloginsiginResponse?.user?.specialities ||
            AuthReducer?.verifymobileResponse?.user?.specialities || finalverifyboard?.specialities || finalProfession?.specialities
            ;

        if (allBoardData) {
            const dynamicData = transformData(allBoardData);
            if (JSON.stringify(boardspecial) !== JSON.stringify(dynamicData)) {
                setBoardspecial(dynamicData);
                console.log(dynamicData, "new json board=========");
            }
        }
    }, [
        DashboardReducer?.mainprofileResponse?.specialities,
        AuthReducer?.loginResponse?.user?.specialities,
        AuthReducer?.againloginsiginResponse?.user?.specialities,
        AuthReducer?.verifymobileResponse?.user?.specialities,
        finalverifyboard?.specialities,
        finalProfession?.specialities
    ]);

    useEffect(() => {
        const boardSpecialty = () => {
            if (boardspecial?.length > 0) {
                const AllId = boardspecial.map((d) => d?.id);
                const finalId = AllId?.join(', ');
                console.log(finalId, "finalId========");
                let obj = {
                    "profession": DashboardReducer?.mainprofileResponse?.professional_information?.profession || AuthReducer?.verifymobileResponse?.user?.profession ||
                        AuthReducer?.loginResponse?.user?.profession ||
                        AuthReducer?.againloginsiginResponse?.user?.profession || finalverifyboard?.profession || finalProfession?.profession,
                    "specilityid": finalId
                };

                connectionrequest()
                    .then(() => {
                        dispatch(boardSpecialityRequest(obj));
                    })
                    .catch(err => {
                        showErrorAlert("Please connect to internet", err);
                    });
            }
        };

        boardSpecialty();
    }, [
        AuthReducer?.loginResponse?.user?.specialities,
        AuthReducer?.againloginsiginResponse?.user?.specialities,
        AuthReducer?.verifymobileResponse?.user?.specialities,
        boardspecial,
        finalverifyboard?.specialities,
        finalProfession?.specialities
    ]);
    const searchBoardNameFinal = text => {
        console.log(text, 'text12333', totalboardname);
        if (text) {
            const boardState = totalboardname?.filter(function (item) {
                console.log('item+++++++++++++++++++state', item);
                const boardFinal = item?.name
                    ? item?.name.toUpperCase() + item?.name.toUpperCase()
                    : ''.toUpperCase();
                const textGetName = text.trim().toUpperCase();
                const boardStateFiltered = boardFinal.indexOf(textGetName) > -1;
                console.log('boardStateFilteredState', boardStateFiltered);
                return boardStateFiltered;
            });
            setBoardnamereal(boardState);
            setsearchboardname(text);
        } else {
            setBoardnamereal(totalboardname);
            setsearchboardname(text);
        }
    };
    useEffect(() => {
        if (certificateboard) {
            setsearchboardname("");
        }
    }, [certificateboard])
    const boardCertificateAdd = () => {
        // if (!boardPic) {
        //     showErrorAlert("Please choose a image !")
        // } else 
        if (!certificateboard) {
            showErrorAlert("Select your specialty board");
        } else if (!certificateID) {
            showErrorAlert("Enter your  board certification id");
        } else if (!issuedate) {
            showErrorAlert("Select your certification issue date")
        } else if (!expirydate) {
            showErrorAlert("Select your certification expiry date")
        } else {
            let obj = new FormData();
            obj.append("id", props?.route?.params?.profiledet ? props?.route?.params?.profiledet?.id : 0);
            obj.append("board_id", boardID);
            obj.append("board_speciality", bspecialityname);
            obj.append("certificate_id", certificateID);
            obj.append("from_date", issuedate);
            obj.append("to_date", expirydate);
            obj.append("certification_file", boardPic ? boardPic : null);
            obj.append("delete_file", boardPic ? 0 : 1)
            connectionrequest()
                .then(() => {
                    dispatch(boardcertificateRequest(obj))
                })
                .catch(err => { showErrorAlert("Please connect to internet", err) })
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            addCretBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {boardnamepick ? (<BoardCustomed setsearchboardname={setsearchboardname} boardnamepick={boardnamepick} handleBoardname={handleBoardname} setBoardnamepick={setBoardnamepick} searchboardname={searchboardname} searchBoardNameFinal={searchBoardNameFinal} boardnamereal={boardnamereal} />) : <>
                    {Platform.OS === 'ios' ? <View style={{ marginTop: normalize(20) }}>
                        <PageHeader
                            title={props?.route?.params?.profiledet ? "Edit Certification" : "Add Certification"}
                            onBackPress={addCretBack}
                        />
                    </View> : <View>
                        <PageHeader
                            title={props?.route?.params?.profiledet ? "Edit Certification" : "Add Certification"}
                            onBackPress={addCretBack}
                        />
                    </View>}

                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <Loader
                            visible={DashboardReducer?.status == 'Dashboard/boardcertificateRequest'} />
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                                <Pressable onPress={() => {
                                    if (boardPic) {
                                        Alert.alert("eMedEvents", "Are you sure want to delete this file ?", [{ text: "No", onPress: () => console.log("dgfhdj"), onCancel: "default" }, { text: "Yes", onPress: () => setBoardPic(""), onCancel: "default" }])
                                    } else {
                                        setBoardcamera(true);
                                    }
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
                                                label={"Upload File"}
                                                value={boardPic
                                                    ? boardPic.uri
                                                        ? boardPic.uri.split('/').pop().replace(/-/g, '').slice(-16)
                                                        : boardPic.split('/').pop()
                                                    : ""}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={boardPic ? <DeleteIcon name="delete" size={25} color="#949494" /> : <ScanIcon name="scan1" size={28} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    if (boardPic) {
                                                        Alert.alert("eMedEvents", "Are you sure want to delete this file ?", [{ text: "No", onPress: () => console.log("fbfg"), onCancel: "default" }, { text: "Yes", onPress: () => setBoardPic(""), onCancel: "default" }])
                                                    } else {
                                                        directUploadBoard();
                                                    }
                                                }}
                                                onwholePress={() => {
                                                    if (boardPic) {
                                                        Alert.alert("eMedEvents", "Are you sure want to delete this file ?", [{ text: "No", onPress: () => console.log("dgfhdj"), onCancel: "default" }, { text: "Yes", onPress: () => setBoardPic(""), onCancel: "default" }])
                                                    } else {
                                                        setBoardcamera(true);
                                                    }
                                                }}
                                                marginleft={boardPic ? normalize(270) : normalize(265)}
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
                                        {/* <CustomInputTouchable
                                                label={"Certification Board*"}
                                                value={certificateboard}
                                                placeholder={""}
                                                placeholderTextColor="#949494"
                                                rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onPress={() => {
                                                    setBoardnamepick(!boardnamepick);
                                                }}
                                                onIconpres={() => { setBoardnamepick(!boardnamepick); }}
                                            /> */}
                                        <InputField
                                            icondisable={props?.route?.params?.profiledet ? true : false}
                                            label={"Certification Board*"}
                                            value={certificateboard}
                                            placeholder=""
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            editable={false}
                                            leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                            onLeftIconPress={() => setBoardnamepick(!boardnamepick)}
                                            marginleft={normalize(270)}
                                            multiline={true}
                                            onwholePress={() => setBoardnamepick(!boardnamepick)}
                                            onlyfor={true}
                                            spaceneeded={true}
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
                                            label='Certification ID*'
                                            value={certificateID}
                                            onChangeText={setCertificateID}
                                            placeholder=''
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            maxlength={100}
                                        />
                                    </View>
                                </View>
                                <Pressable onPress={() => {
                                    if (props?.route?.params?.profiledet?.from_date) {
                                        setBoardfd(true);
                                    } else {
                                        setBoardfd(true);
                                    }
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
                                                label={"Issue Date*"}
                                                value={issuedate && moment(issuedate, "YYYY-MM-DD", true).isValid()
                                                    ? moment(issuedate).format("MM-DD-YYYY")
                                                    : ""}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    if (props?.route?.params?.profiledet?.from_date) {
                                                        setBoardfd(true);
                                                    } else {
                                                        setBoardfd(true);
                                                    }
                                                }}
                                                marginleft={normalize(270)}
                                                onwholePress={() => {
                                                    if (props?.route?.params?.profiledet?.from_date) {
                                                        setBoardfd(true);
                                                    } else {
                                                        setBoardfd(true);
                                                    }
                                                }}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                                <Pressable onPress={() => setBoarded(true)}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <InputField
                                                label={"Expiry Date*"}
                                                value={expirydate && moment(expirydate, "YYYY-MM-DD", true).isValid()
                                                    ? moment(expirydate).format("MM-DD-YYYY")
                                                    : ""}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                onLeftIconPress={() => setBoarded(true)}
                                                marginleft={normalize(270)}
                                                onwholePress={() => setBoarded(true)}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            <Buttons
                                onPress={boardCertificateAdd}
                                height={normalize(45)}
                                width={normalize(291)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text={props?.route?.params?.profiledet ? "Save" : "Add"}
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />
                            <Buttons
                                onPress={() => {
                                    if (props?.route?.params?.profile) {
                                        props.navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    {
                                                        name: "BoardProfile",
                                                        params: {
                                                            board: "text",
                                                        }
                                                    }
                                                ]
                                            })
                                        );
                                    } else if (props?.route?.params?.profiledet) {
                                        navigation.goBack();
                                    } else {
                                        props.navigation.navigate("TabNav", { detectmain: "main" });
                                    }
                                }}
                                height={normalize(45)}
                                width={normalize(280)}
                                backgroundColor={Colorpath.Pagebg}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />
                        </ScrollView>
                        <CellModal
                            isVisible={modalcert}
                            onClose={toggleModalcert}
                            content={props?.route?.params?.profiledet ? "Board certification information \n updated successfully." : "Board certification information \n added successfully."}
                            navigation={props.navigation}
                            name={props?.route?.params?.profiledet ? "text" : props?.route?.params?.profile ? "text" : props?.route?.params?.takeback == "back" ? "Contact" : "TabNav"}
                        />
                        {/* </ScrollView> */}
                        {props?.route?.params?.profiledet?.from_date ? <DateTimePickerModal
                            isVisible={boardfd}
                            mode="date"
                            date={
                                props?.route?.params?.profiledet?.from_date
                                    ? new Date(props?.route?.params?.profiledet?.from_date)
                                    : '' // Fallback to current date if no from_date is provided
                            }
                            onConfirm={val => {
                                setIssuedate(moment(val).format('YYYY-MM-DD'));
                                setBoardfd(false);
                            }}
                            onCancel={() => setBoardfd(false)}
                            textColor="black"
                        /> : <DateTimePickerModal
                            isVisible={boardfd}
                            mode="date"
                            maximumDate={new Date()}
                            onConfirm={val => {
                                setIssuedate(moment(val).format('YYYY-MM-DD'));
                                setBoardfd(false);
                            }}
                            onCancel={() => setBoardfd(false)}
                            textColor="black"
                        />}
                        {props?.route?.params?.profiledet?.to_date ? <DateTimePickerModal
                            isVisible={boraded}
                            mode="date"
                            date={
                                props?.route?.params?.profiledet?.to_date
                                    ? new Date(props?.route?.params?.profiledet?.to_date)
                                    : '' // Fallback to current date if no from_date is provided
                            }
                            onConfirm={val => {
                                setExpirydate(moment(val).format('YYYY-MM-DD'));
                                setBoarded(false);
                            }}
                            onCancel={() => setBoarded(false)}
                            textColor="black"
                        /> : <DateTimePickerModal
                            isVisible={boraded}
                            mode="date"
                            minimumDate={new Date()}
                            onConfirm={val => {
                                setExpirydate(moment(val).format('YYYY-MM-DD'));
                                setBoarded(false);
                            }}
                            onCancel={() => setBoarded(false)}
                            textColor="black"
                        />}
                        <CameraPicker
                            cropping={true}
                            pickerVisible={boardcamera}
                            onBackdropPress={() => setBoardcamera(false)}
                            btnClick_cameraUpload={imgObj => {
                                console.log(imgObj);
                                setBoardPic(imgObj);
                                setBoardPicOT(imgObj.uri);
                                setBoardcamera(false);
                            }}
                            btnClick_ImageUpload={(imgObj) => {
                                console.log(imgObj);
                                setBoardPic(imgObj);
                                setBoardPicOT(imgObj.uri);
                                setBoardcamera(false);
                            }}
                            btnClick_galeryUpload={imgObj => {
                                console.log('imgObj:::::::::', imgObj);
                                setBoardPic(imgObj);
                                setBoardPicOT(imgObj.uri);
                                setBoardcamera(false);
                            }}
                        />


                    </KeyboardAvoidingView>
                </>}

            </SafeAreaView>
        </>
    )
}

export default AddCertificate;
const styles = StyleSheet.create({
    imageBackground: {
        height: normalize(65),
        width: normalize(300),
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
        paddingVertical: normalize(10),
    },
    uploadText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
    },
    separatorLine: {
        height: normalize(35),
        width: 1,
        marginLeft: normalize(160),
        backgroundColor: "#DDDDDD",
    },
    iconContainer: {
        paddingVertical: normalize(5),
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 18,
        color: "#000000",
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
});