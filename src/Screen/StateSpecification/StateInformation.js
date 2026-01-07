import { View, Text, TouchableOpacity, KeyboardAvoidingView, FlatList, Platform, Animated, Easing, Image, BackHandler } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import normalize from '../../Utils/Helpers/Dimen';
import CalenderIcon from 'react-native-vector-icons/Feather';
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomTextField from '../../Components/CustomTextfiled';
import Buttons from '../../Components/Button';
import { primeTrailRequest, stateInformSaveRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Utils/Helpers/Loader';
import Modal from 'react-native-modal';
import { styles } from '../CMECreditValut/Statevaultstyes';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import DropdownInputs from '../../Components/DropDownSec';
import CustomizedYear from './CustomizedYear';
import Header from '../../Components/Header';
import Imagepath from '../../Themes/Imagepath';
import { dashMbRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const StateInformation = (props) => {
    const {
        setFulldashbaord,
        setGtprof
    } = useContext(AppContext);
    console.log(props?.route?.params?.InvokedData, "alll data ========>=======")
    const [opendatelic, setOpendatelic] = useState(false);
    const [rdate, setRdate] = useState("");
    const [opendatelicy, setOpendatelicy] = useState(false);
    const [cdate, setCdate] = useState("");
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [citypickeryear, setCitypickeryear] = useState(false);
    const [finalverify, setFinalverify] = useState(null);
    const [yearOnlyfv, setYearOnlyfv] = useState(false);
    const [noloadnew, setNoloadnew] = useState(false);
    const isFocus = useIsFocused();
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle_verifyfd = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
                console.log(loginHandle_verifyfd, "statelicesene=================");
                const jsonObject = JSON.parse(loginHandle_verifyfd);
                setFinalverify(jsonObject);
            }, 100);
        };

        try {
            token_handle();
        } catch (error) {
            console.log(error);
        }
    }, [isFocus]);
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from(
        { length: 11 },
        (_, index) => currentYear + index
    );
    console.log("Try programiz.pro", yearRange, cdate);
    const dispatch = useDispatch();
    const transformData = (oldData) => {
        if (Array.isArray(oldData)) {
            return oldData.map(name => name);
        } else if (typeof oldData === 'object') {
            return Object.values(oldData);
        } else {
            return [oldData];
        }
    };
    const oldData = props?.route?.params?.InvokedData?.specialities || "Family";
    const transformedData = transformData(oldData);
    const animatedValuesdate = useRef(new Animated.Value(1)).current;
    const scaleValuesesdate = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetyear = cdate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: cdate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetyear,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cdate]);
    useEffect(() => {
        const targetDate = AuthReducer?.verifymobileResponse?.user?.renewal_date
            || finalverify?.renewal_date
            || formattedDate?.dayMonth ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesdate, {
                toValue: AuthReducer?.verifymobileResponse?.user?.renewal_date
                    || finalverify?.renewal_date
                    || formattedDate?.dayMonth ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesdate, {
                toValue: targetDate,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [AuthReducer?.verifymobileResponse?.user?.renewal_date
        || finalverify?.renewal_date
        || formattedDate?.dayMonth]);
    function splitFormattedDate(dateString) {
        if (!dateString || isNaN(Date.parse(dateString))) {
            return {
                dayMonth: 'Date',
                year: 'Year'
            };
        }
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const dayMonth = `${day} ${month}`;
        const yearStr = `${year}`;
        return {
            dayMonth,
            year: yearStr
        };
    }
    const dateStr = cdate ? cdate : "";
    const formattedDate = splitFormattedDate(dateStr);
    console.log(formattedDate?.dayMonth);
    console.log(formattedDate?.year);
    const handleAutoInforSave = () => {
        const renewalDate = AuthReducer?.verifymobileResponse?.user?.renewal_date || finalverify?.renewal_date;
        if (!cdate) {
            if (!renewalDate) {
                showErrorAlert("Please choose date & year");
            } else {
                showErrorAlert("Please choose year");
            }
        } else {
            let obj2 = {}
            connectionrequest()
                .then(() => {
                    dispatch(primeTrailRequest(obj2))
                })
                .catch((err) => showErrorAlert("Please connect to internet", err))
            let obj = {
                "license_number": props?.route?.params?.InvokedData?.license_number,
                "license_expiry_date": AuthReducer?.verifymobileResponse?.user?.renewal_date
                    ? `${moment(AuthReducer?.verifymobileResponse?.user?.renewal_date, "MMM DD").format("DD-MM")}-${cdate}`
                    : finalverify?.renewal_date
                        ? `${moment(finalverify?.renewal_date, "MMM DD").format("DD-MM")}-${cdate}`
                        : cdate,
                "zip_code": props?.route?.params?.InvokedData?.zipcode,
                "city_id": props?.route?.params?.InvokedData?.city_id,
                "npi_number": props?.route?.params?.InvokedData?.npi_number
            }
            console.log(obj, "obj----------")
            connectionrequest()
                .then(() => {
                    dispatch(stateInformSaveRequest(obj))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }

    const finalShowDatefetched = useMemo(() => {
        const renewalDate = AuthReducer?.verifymobileResponse?.user?.renewal_date || finalverify?.renewal_date;
        if (renewalDate) {
            return splitFormattedDate(renewalDate).dayMonth;
        }
        return formattedDate?.dayMonth && formattedDate.dayMonth !== 'Date';
    }, [AuthReducer?.verifymobileResponse?.user?.renewal_date, finalverify?.renewal_date, formattedDate]);
    console.log(finalShowDatefetched, "finaldatae");
    //   const finalShowDatefetched =  AuthReducer?.verifymobileResponse?.user?.renewal_date  || finalverify?.renewal_date || formattedDate?.dayMonth

    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/stateInformSaveRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/stateInformSaveSuccess':
                status = AuthReducer.status;
                setGtprof(true);
                setNoloadnew(true);
                setTimeout(async () => {
                    const loginHandleProccess = await AsyncStorage.getItem(constants.TOKEN);
                    let objToken = { "token": loginHandleProccess || AuthReducer?.loginsiginResponse?.token, "key": {} }
                    dispatch(dashMbRequest(objToken));
                }, 10);
                break;
            case 'Auth/stateInformSaveFailure':
                status = AuthReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashMbRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/dashMbSuccess':
                status1 = DashboardReducer.status;
                // console.log("DashboardReducer999912222", DashboardReducer.dashMbResponse.data?.licensures);
                const uniqueStates = DashboardReducer?.dashMbResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                setNoloadnew(false);
                dispatch(mainprofileRequest({}))
                setFulldashbaord(uniqueStates);
                props.navigation.navigate("CheckMembership");
                break;
            case 'Dashboard/dashMbFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    const handleYearcust = (don) => {
        setCdate(don);
        setCitypickeryear(false);
    }
    useEffect(() => {
        const onBackPress = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
    const licensureLabel = useMemo(() =>
        AuthReducer?.verifymobileResponse?.user?.renewal_date ||
            finalverify?.renewal_date ||
            formattedDate?.dayMonth ? "Licensure Renewal Date*" : null,
        []);

    const licensureValue = useMemo(() =>
        AuthReducer?.verifymobileResponse?.user?.renewal_date ||
        finalverify?.renewal_date ||
        formattedDate?.dayMonth,
        []);
        useLayoutEffect(() => {
                    props.navigation.setOptions({ gestureEnabled: false });
                }, []);
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {citypickeryear ? (
                    <CustomizedYear yearRange={yearRange} setCitypickeryear={setCitypickeryear} handleYearcust={handleYearcust} />
                ) : (<>
                    <Loader visible={AuthReducer?.status == 'Auth/stateInformSaveRequest' || noloadnew} />
                    <View style={Platform.OS === 'ios' ? { marginBottom: normalize(35) } : { marginTop: normalize(80) }}>
                    </View>
                    <View style={{ paddingHorizontal: normalize(14), paddingVertical: 0, marginBottom: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 22, color: '#000000' }}>
                            {`${props?.route?.params?.InvokedData?.state_name} State License \nInformation`}
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: normalize(14), marginBottom: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 13, color: '#666666' }}>
                            {"Fill the remaining fields to complete the signup process"}
                        </Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                        <View
                            style={{
                                width: normalize(300),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(10),
                            }}
                        >
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"First Name"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"Last Name"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ textTransform: "capitalize", fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {props?.route?.params?.InvokedData?.firstname}
                                    </Text>
                                    <Text style={{ textTransform: "capitalize", fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {props?.route?.params?.InvokedData?.lastname}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"Profession"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"Specialty"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {`${props?.route?.params?.InvokedData?.job_title}-${props?.route?.params?.InvokedData?.designation}`}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {transformedData?.length > 0 && transformedData?.map((dd) => { return dd })}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"Licensure State"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"City & Zip code"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {props?.route?.params?.InvokedData?.state_name}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {`${props?.route?.params?.InvokedData?.state_name}\n${props?.route?.params?.InvokedData?.zipcode}`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"Licensure Number"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                        {"NPI Number"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {props?.route?.params?.InvokedData?.license_number}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                        {props?.route?.params?.InvokedData?.npi_number}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                {finalShowDatefetched && !yearOnlyfv ? (
                                    <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <DropdownInputs
                                                label={licensureLabel}
                                                placeholder="Date*"
                                                value={licensureValue}
                                                editable={false}
                                                style={{ height: normalize(40), width: normalize(130), paddingVertical: 0, fontSize: 12, color: "#000", fontFamily: Fonts.InterMedium }}
                                                dropdownIcon={true}
                                                animatedValue={animatedValuesdate}
                                                scaleValue={scaleValuesesdate}
                                                dropdisable={false}
                                                onDropdownPress={() => console.log("Hello")}
                                                isDatachange={null}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setCitypickeryear(prev => !prev)}
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <DropdownInputs
                                                    label={cdate ? "Licensure Renewal Year*" : null}
                                                    placeholder="Year*"
                                                    value={cdate ? cdate.toString() : ""}
                                                    editable={false}
                                                    style={{ height: normalize(40), width: normalize(130), paddingVertical: 0, fontSize: 12, color: "#000", fontFamily: Fonts.InterMedium }}
                                                    dropdownIcons={true}
                                                    animatedValue={animatedValuesyear}
                                                    scaleValue={scaleValuesesyear}
                                                    dropdisable={false}
                                                    onDropdownPress={() => setCitypickeryear(prev => !prev)}
                                                    isDatachange={cdate ? "calendar" : "calendar"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                {"Licensure Renewal Date & Year *"}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setOpendatelicy(true);
                                                        setYearOnlyfv(true);
                                                    }}
                                                >
                                                    <CustomTextField
                                                        value={(() => {
                                                            const rawDateD = cdate || "";
                                                            // Check if date is in YYYY-MM-DD format
                                                            if (moment(rawDateD, "YYYY-MM-DD", true).isValid()) {
                                                                return moment(rawDateD, "YYYY-MM-DD").format("MM-DD-YYYY");
                                                            }
                                                            return rawDateD;
                                                        })()}
                                                        onChangeText={setCdate}
                                                        height={normalize(50)}
                                                        width={normalize(280)}
                                                        backgroundColor={Colorpath.white}
                                                        alignSelf={'center'}
                                                        color={"#000000"}
                                                        borderRadius={normalize(9)}
                                                        placeholder={'Date & Year*'}
                                                        placeholderTextColor={"RGB(170, 170, 170)"}
                                                        fontSize={normalize(12)}
                                                        autoCapitalize="none"
                                                        keyboardType='default'
                                                        paddingHorizontal={normalize(1)}
                                                        borderColor={"#DDDDDD"}
                                                        rightIcon={CalenderIcon}
                                                        rightIconName={"calendar"}
                                                        rightIconSize={25}
                                                        rightIconColor="#63748b"
                                                        editable={false}
                                                        onRightIconPress={() => {
                                                            setOpendatelicy(true);
                                                            setYearOnlyfv(true);
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </>)}

                <DateTimePickerModal
                    isVisible={opendatelic}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={val => {
                        setRdate(moment(val).format('YYYY-MM-DD'));
                        setOpendatelic(false);
                    }}
                    onCancel={() => setOpendatelic(false)}
                    textColor="black"
                />
                <DateTimePickerModal
                    isVisible={opendatelicy}
                    mode="date"
                    minimumDate={new Date()}
                    date={cdate ? new Date(cdate) : new Date()}
                    onConfirm={val => {
                        setCdate(moment(val).format('YYYY-MM-DD'));
                        setOpendatelicy(false);
                    }}
                    onCancel={() => setOpendatelicy(false)}
                    textColor="black"
                />

                <View>
                    <Buttons
                        onPress={handleAutoInforSave}
                        // onPress={() => { props.navigation.navigate("CreateStateInfor") }}
                        height={normalize(45)}
                        width={normalize(300)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(9)}
                        text={"Submit"}
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        marginTop={normalize(30)}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default StateInformation;
