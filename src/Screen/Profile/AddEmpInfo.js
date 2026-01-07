import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import TextFieldIn from '../../Components/Textfield';
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { cityRequest, stateRequest } from '../../Redux/Reducers/AuthReducer';
import { useIsFocused } from '@react-navigation/native';
import CheckStateShowCont from './StateContact'
import CheckThreeCity from '../DetailsPageWebcast/CheckoutModalFourth'
import { searchStateNamePraticeFunction } from '../DetailsPageWebcast/SearchStateNamePratice'
import { searchCityNameFunction } from '../DetailsPageWebcast/SearchCityName'
import { EmpAddProfileRequest, SearchHospRequest } from '../../Redux/Reducers/ProfileReducer'
import { searchHospFunction } from '../DetailsPageWebcast/HospProfile'
import HospitalList from '../DetailsPageWebcast/HospitalList'
import EmpStatusModal from './EmpStatus'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'
import Loader from '../../Utils/Helpers/Loader'
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer'
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
let status1 = "";
const CustomRadioButton = ({ selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: selected ? Colorpath.ButtonColr : '#000',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {selected ? (
            <View style={styles.radioButtonSelected} />
        ) : null}
    </TouchableOpacity>
);
const AddEmpInfo = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const [pratice, setPratice] = useState(false);
    const [searchpratice, setSearchpratice] = useState('');
    const [state_id, setState_id] = useState("");
    const [city_id, setCity_id] = useState("");
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [cityAll, setCityAll] = useState('');
    const [cityshow, setCityshow] = useState([]);
    const [hospAll, setHospAll] = useState('');
    const [searchhosp, setSearchhosp] = useState('');
    const [hospgetshow, setHospgetshow] = useState([]);
    const [statepicker, setStatepicker] = useState(false);
    const [citypicker, setCitypicker] = useState(false);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [searchcity, setSearchcity] = useState('');
    const [countryId, setCountryId] = useState("1");
    const [hosppicker, setHosppicker] = useState(false);
    const [hospname, setHospname] = useState("");
    const [hospid, setHospid] = useState("");
    const [profiletakeshow, setProfiletakeshow] = useState(false);
    const [empstatusname, setEmpstatusname] = useState("");
    const [position, setPosition] = useState("");
    const [phoneno, setPhoneno] = useState("");
    const [fromdate, setFromdate] = useState(props?.route?.params?.editDats?.from_date ? props?.route?.params?.editDats?.from_date : "");
    const [frompicker, setFromPicker] = useState(false);
    const [todate, setTodate] = useState(props?.route?.params?.editDats?.to_date ? props?.route?.params?.editDats?.to_date : "");
    const [topicker, setTopicker] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [address, setAddress] = useState("");
    const [anoth, setAnoth] = useState("");
    const isFocus = useIsFocused();
    const SearchBack = () => {
        props.navigation.goBack();
    }
    const [socheck, setSocheck] = useState(false);
    const handleInputChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setAmount(numericValue);
    };
    useEffect(() => {
        setCountryId("1");
        setSelectedOption("Hospitalist");
        PraticingState(countryId);
    }, [isFocus])
    useEffect(() => {
        if (props?.route?.params?.editDats) {
            setSelectedOption(props?.route?.params?.editDats?.employment_type);
            setState(props?.route?.params?.editDats?.state_name);
            setState_id(props?.route?.params?.editDats?.state_id);
            setCity(props?.route?.params?.editDats?.city_name);
            setCity_id(props?.route?.params?.editDats?.city_id);
            setHospname(props?.route?.params?.editDats?.organization_name);
            setAddress(props?.route?.params?.editDats?.address)
            setPosition(props?.route?.params?.editDats?.position_description);
            setEmpstatusname(props?.route?.params?.editDats?.emp_status);
            setPhoneno(props?.route?.params?.editDats?.contact_no);
            setFromdate(props?.route?.params?.editDats?.from_date);
            setTodate(props?.route?.params?.editDats?.to_date);
            setAmount(props?.route?.params?.editDats?.allowance_limit);
            setSocheck(props?.route?.params?.editDats?.currently_held == 1 ? true : false)
        }
    }, [props?.route?.params?.editDats])
    const PraticingState = (index) => {
        connectionrequest()
            .then(() => {
                dispatch(stateRequest(index));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    };
    useEffect(() => {
        if (city_id && state_id) {
            let obj = {
                cityid: city_id,
                stateid: state_id
            }
            connectionrequest()
                .then(() => {
                    dispatch(SearchHospRequest(obj));
                })
                .catch(err => {
                    showErrorAlert('Please connect to Internet', err);
                });
        }
    }, [city_id, state_id])
    useEffect(() => {
        if (state) {
            setSearchpratice("");
        }
    }, [state])
    useEffect(() => {
        if (city) {
            setSearchcity("");
        }
    }, [city])
    useEffect(() => {
        if (hospname) {
            setSearchhosp("");
        }
    }, [hospname])
    console.log(hospAll, "dfkjsdk");
    const handleFromDateConfirm = (val) => {
        const formattedDate = moment(val).format('YYYY-MM-DD');
        setFromdate(formattedDate);
        setFromPicker(false);
        setTodate("");
        setTodate(null); // Reset to_date when from_date changes
    };
    const handleToDateConfirm = (val) => {
        setTodate(moment(val).format('YYYY-MM-DD'));
        setTopicker(false);
    };

    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/stateRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/stateSuccess':
                status = AuthReducer.status;
                setSelectStatepratice(AuthReducer?.stateResponse?.states);
                setSlistpratice(AuthReducer?.stateResponse?.states);
                break;
            case 'Auth/stateFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/cityRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/citySuccess':
                status = AuthReducer.status;
                setCityAll(AuthReducer?.cityResponse?.cities);
                setCityshow(AuthReducer?.cityResponse?.cities);
                break;
            case 'Auth/cityFailure':
                status = AuthReducer.status;
                break;
        }
    }

    if (status1 == '' || ProfileReducer.status != status1) {
        switch (ProfileReducer.status) {
            case 'Profile/SearchHospRequest':
                status1 = ProfileReducer.status;
                break;
            case 'Profile/SearchHospSuccess':
                status1 = ProfileReducer.status;
                const addNew = {
                    "id": null,
                    "name": "Add New Hospital",
                    "address": null,
                    "city_id": null,
                    "state_id": null,
                    "country_id": null,
                    "zipcode": null,
                    "website": null
                };
                const updatedHospitalList = [
                    addNew,
                    ...(ProfileReducer?.SearchHospResponse?.hospital_list || [])
                ];
                setHospAll(updatedHospitalList);
                setHospgetshow(updatedHospitalList);
                break;
            case 'Profile/SearchHospFailure':
                status1 = ProfileReducer.status;
                break;
            case 'Profile/EmpAddProfileRequest':
                status1 = ProfileReducer.status;
                break;
            case 'Profile/EmpAddProfileSuccess':
                status1 = ProfileReducer.status;
                if (ProfileReducer?.EmpAddProfileResponse?.msg == "Employment information updated successfully.") {
                    showErrorAlert("Employment information updated successfully.");
                    props.navigation.goBack();
                    dispatch(mainprofileRequest({}))
                }
                break;
            case 'Profile/EmpAddProfileFailure':
                status1 = ProfileReducer.status;
                break;
        }
    }
    console.log(props?.route?.params?.editDats, "props?.route?.params?.editDats-----")
    const AddEmpTake = () => {
        const cellNoRegex = /^\d{10,15}$/;
         const filteredTextcell = phoneno && phoneno?.length > 0 && phoneno.replace(/[^\d]/g, '');
        if (!state) {
            showErrorAlert("Please choose state ");
        } else if (!city) {
            showErrorAlert("Please choose city");
        } else if (!hospname) {
            showErrorAlert("Please choose Hospital / Medical Facility");
        } else if (!empstatusname && selectedOption == 'Hospitalist') {
            showErrorAlert("Please choose Employment Status");
        } else if (!address && selectedOption == 'Self Practice') {
            showErrorAlert("Please enter address");
        } else if (!phoneno) {
            showErrorAlert("Please enter phone no");
        } else if (!cellNoRegex.test(filteredTextcell)) {
            showErrorAlert("Invalid cell number. It must be 10-15 digits.");
        } else if (!fromdate) {
            showErrorAlert("Please choose from date");
        } else if (!todate && !socheck) {
            showErrorAlert("Please choose to date");
        } else {
            let obj = selectedOption == 'Hospitalist' ? {
                "employement_id": props?.route?.params?.editDats?.id ? props?.route?.params?.editDats?.id : 0,
                "employment_type": selectedOption,
                "address": address || "",
                "country_id": countryId,
                "state_id": state_id,
                "city_id": city_id,
                "contact_number": phoneno,
                "organization_name": hospname,
                "calling_code": countryId,
                "from_date": fromdate,
                "to_date": socheck ? fromdate : todate,
                "position_description": position,
                "hospital_id": hospid,
                "currently_held": socheck ? 1 : 0,
                "emp_status": empstatusname,
                "name": hospname,
                "city": city_id,
                "state": state_id,
                "country": countryId,
                "allowance_limit": amount
            } :
                {
                    "employement_id": props?.route?.params?.editDats?.id ? props?.route?.params?.editDats?.id : 0,
                    "employment_type": selectedOption,
                    "address": address,
                    "country_id": countryId,
                    "state_id": state_id,
                    "city_id": city_id,
                    "contact_number": phoneno,
                    "organization_name": hospname,
                    "calling_code": countryId,
                    "from_date": fromdate,
                    "to_date": socheck ? fromdate : todate,
                    "position_description": position,
                    "hospital_id": "",
                    "currently_held": socheck ? 1 : 0,
                    "emp_status": "",
                    "name": hospname,
                    "city": city_id,
                    "state": state_id,
                    "country": countryId,
                    "allowance_limit": ""
                }
            connectionrequest()
                .then(() => {
                    dispatch(EmpAddProfileRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please conenct to internet", err)
                })
            console.log(obj, "obkkkkkkkk==============");
        }
    }
    const handleStateshows = (ctid) => {
        cityReq(ctid?.id)
        setState(ctid?.name);
        cityRequest(ctid?.id);
        setState_id(ctid?.id);
    }
    const handlecityShows = (ctshows) => {
        setCity(ctshows?.name);
        setCity_id(ctshows?.id)
    }
    const handlehospShows = (hosp) => {
        console.log(hosp, "hosp------------")
        if (hosp?.name === "Add New Hospital") {
            setHospname("");
            setHospid("")
            setAnoth(hosp?.name);
        } else {
            setHospname(hosp?.name);
            setHospid(hosp?.id)
        }
    }
    const cityReq = (itid) => {
        connectionrequest()
            .then(() => {
                dispatch(cityRequest(itid));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }
    const handlePratice = (text) => {
        searchStateNamePraticeFunction(text, selectStatepratice, setSlistpratice, setSearchpratice, (praticefil, praticetxtcount) => {
            console.log('countryfil Data:', praticefil, 'Search Text:', praticetxtcount);
        })
    }
    const handleCity = (text) => {
        searchCityNameFunction(text, cityshow, setCityAll, setSearchcity, (cityfill, citycountname) => {
            console.log('countryfil Data:', cityfill, 'Search Text:', citycountname);
        })
    }
    const handleHosp = (text) => {
        searchHospFunction(text, hospgetshow, setHospAll, setSearchhosp, (cityfill, citycountname) => {
            console.log('countryfil Data:', cityfill, 'Search Text:', citycountname);
        })
    }
    const isValidWhatsappNodd = amount?.length > 0 && amount == 0;
    const formatPhoneNumber = (input, isUSA = false) => {
        if (isUSA) {
            // USA format: (XXX) XXX-XXXX
            const cleaned = input.replace(/\D/g, '').slice(0, 10);
            const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

            if (match) {
                let formatted = '';
                if (match[1]) formatted = `(${match[1]}`;
                if (match[2]) formatted += `) ${match[2]}`;
                if (match[3]) formatted += `-${match[3]}`;
                return formatted;
            }
        } else {
            // International format: remove non-digits but allow up to 15 digits
            return input.replace(/[^0-9]/g, '').slice(0, 15);
        }
        return input;
    };
     const cellNoRegexwpcell = /^\d{10,15}$/;
    const filteredTextcell = phoneno && phoneno?.length > 0 && phoneno.replace(/[^\d]/g, '');
    const isValidcell = filteredTextcell?.length > 0 && !cellNoRegexwpcell.test(filteredTextcell);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {statepicker ? (
                    <CheckStateShowCont
                        pratice={pratice}
                        setSearchState={setSearchpratice}
                        searchpratice={searchpratice}
                        handleStateshows={handleStateshows}
                        setPratice={setPratice}
                        searchStateNamePratice={handlePratice}
                        slistpratice={slistpratice}
                        statepicker={statepicker}
                        setStatepicker={setStatepicker}
                    />) :
                    citypicker ? (
                        <CheckThreeCity
                            handlecityShows={handlecityShows}
                            cityPicker={citypicker}
                            setCityPicker={setCitypicker}
                            setSearchcity={setSearchcity}
                            searchcity={searchcity}
                            searchCityName={handleCity}
                            cityAll={cityAll} />) :
                        hosppicker ? (
                            <HospitalList
                                handlehospShows={handlehospShows}
                                hosppicker={hosppicker}
                                setHosppicker={setHosppicker}
                                setSearchhosp={setSearchhosp}
                                searchhosp={searchhosp}
                                searchHospName={handleHosp}
                                hospAll={hospAll} />) : <>
                            <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                                {Platform.OS === "ios" ? (
                                    <PageHeader
                                        title={props?.route?.params?.editDats ? "Edit Employment Information" : "Add Employment Information"}
                                        onBackPress={SearchBack}
                                    />
                                ) : (
                                    <PageHeader
                                        title={props?.route?.params?.editDats ? "Edit Employment Information" : "Add Employment Information"}
                                        onBackPress={SearchBack}
                                    />

                                )}
                            </View>
                            <Loader visible={ProfileReducer?.status == 'Profile/EmpAddProfileRequest'} />
                            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                    <View style={styles.container}>
                                        <View style={styles.optionContainer}>
                                            <CustomRadioButton
                                                selected={selectedOption === 'Hospitalist'}
                                                onPress={() => setSelectedOption('Hospitalist')}
                                            />
                                            <TouchableOpacity onPress={() => { setSelectedOption('Hospitalist') }}>
                                                <Text style={styles.optionText}>{"Hospitalist"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.optionContainer}>
                                            <CustomRadioButton
                                                selected={selectedOption === 'Self Practice'}
                                                onPress={() => setSelectedOption('Self Practice')}
                                            />
                                            <TouchableOpacity onPress={() => { setSelectedOption('Self Practice') }}>
                                                <Text style={styles.optionText}>{"Self Practice"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {selectedOption == 'Hospitalist' ? <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setStatepicker(!statepicker);
                                                PraticingState(countryId);
                                                setHospname("");
                                                setCity("");
                                            }}>
                                                <CustomTextField
                                                    value={state}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'State*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={state ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setStatepicker(!statepicker);
                                                        PraticingState(countryId);
                                                        setHospname("");
                                                        setCity("");
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity disabled={state ? false : true} onPress={() => {
                                                setCitypicker(!citypicker);
                                                cityReq(state_id);
                                            }}>
                                                <CustomTextField
                                                    value={city}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'City*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={city ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        if (state) {
                                                            setCitypicker(!citypicker);
                                                            cityReq(state_id);
                                                        };
                                                    }}
                                                    onDisable={state ? false : true}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {hospAll == 0 ? <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={hospname}
                                                onChangeText={(val) => setHospname(val)}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Hospital / Medical Facility *'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View> : anoth === "Add New Hospital" ? <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={hospname}
                                                onChangeText={(val) => setHospname(val)}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Hospital / Medical Facility *'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View> : <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setHosppicker(!hosppicker);
                                            }}>
                                                <CustomTextField
                                                    value={hospname}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={"Hospital / Medical Facility *"}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={hospname ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setHosppicker(!hosppicker);
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                    {anoth === "Add New Hospital" && <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={address}
                                                onChangeText={(val) => setAddress(val)}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Address Line*'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View>}
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={position}
                                                onChangeText={(val) => setPosition(val)}
                                                height={normalize(45)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Position Description'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setProfiletakeshow(!profiletakeshow);
                                            }}>
                                                <CustomTextField
                                                    value={empstatusname}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={"Employment Status*"}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={empstatusname ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setProfiletakeshow(!profiletakeshow);
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={phoneno}
                                                onChangeText={(val) => {
                                                    const isUSA = true;
                                                    const formattedVal = formatPhoneNumber(val, isUSA);
                                                    setPhoneno(formattedVal)
                                                }}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Hospital Phone Number*'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={15}
                                                leftname={"+1"}
                                                lefttext={true}
                                                leftfontset={Fonts.InterRegular}
                                                leftfont={16}
                                                leftcolor={"#000000"}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                     {isValidcell && (
                                            <View style={{ paddingHorizontal: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Please enter a valid Cell number"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => { setFromPicker(!frompicker) }}>
                                                <CustomTextField
                                                    value={fromdate}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'From Date*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={CalenderIcon}
                                                    rightIconName={"calendar"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setFromPicker(!frompicker);
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5),
                                            }}>
                                            <TouchableOpacity disabled={socheck ? true : false} onPress={() => { setTopicker(!topicker) }}>
                                                <CustomTextField
                                                    value={socheck ? fromdate : todate}
                                                    color={socheck ? "#AAAAAA" : "#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={socheck ? "#DADADA" : Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'To Date*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={CalenderIcon}
                                                    rightIconName={"calendar"}
                                                    rightIconSize={25}
                                                    rightIconColor={socheck ? "#AAAAAA" : "#63748b"}
                                                    editable={false}
                                                    onRightIconPress={() => {
                                                        setTopicker(!topicker)
                                                    }}
                                                    onDisable={socheck ? true : false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: normalize(15), paddingHorizontal: normalize(10) }}>
                                        <View style={{ flexDirection: "row", gap: normalize(10) }}>
                                            <TouchableOpacity onPress={() => { setSocheck(!socheck) }} >
                                                {socheck ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                                                    <TickMark name="checkmark" color={Colorpath.white} size={20} />
                                                </View> :
                                                    <View style={{ height: normalize(20), width: normalize(20), borderColor: Colorpath.black, borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                                                }
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: "row", paddingVertical: Platform.OS === 'ios' ? normalize(8) : normalize(5) }}>
                                                <TouchableOpacity onPress={() => { setSocheck(!socheck) }}>
                                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#040D14" }}>
                                                        {"Currently Held"}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    borderBottomColor: '#000000',
                                                    borderBottomWidth: 0.5,
                                                    marginTop: normalize(5)
                                                }}>
                                                <TextFieldIn
                                                    value={amount}
                                                    onChangeText={handleInputChange}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    color={"#000000"}
                                                    placeholder={'Annual CME Allowance Limit'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    maxLength={5}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                        {isValidWhatsappNodd && (
                                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(5) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Please enter valid allowance limit"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Buttons
                                        onPress={() => { AddEmpTake(); }}
                                        height={normalize(45)}
                                        width={normalize(310)}
                                        backgroundColor={isValidWhatsappNodd ? "#DADADA" : Colorpath.ButtonColr}
                                        borderRadius={normalize(9)}
                                        text={props?.route?.params?.editDats ? "Update" : "Save"}
                                        color={Colorpath.white}
                                        fontSize={18}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(30)}
                                        disabled={isValidWhatsappNodd}
                                    />
                                    {!props?.route?.params?.editDats && <Buttons
                                        onPress={() => { props.navigation.goBack() }}
                                        height={normalize(45)}
                                        width={normalize(310)}
                                        borderRadius={normalize(9)}
                                        text="Cancel"
                                        color={Colorpath.ButtonColr}
                                        fontSize={14}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(10)}
                                    />}
                                </ScrollView> : <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setStatepicker(!statepicker);
                                                PraticingState(countryId);
                                                setHospname("");
                                                setCity("");
                                            }}>
                                                <CustomTextField
                                                    value={state}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'State*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={state ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setStatepicker(!statepicker);
                                                        PraticingState(countryId);
                                                        setHospname("");
                                                        setCity("");
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity disabled={state ? false : true} onPress={() => {
                                                setCitypicker(!citypicker);
                                                cityReq(state_id);
                                            }}>
                                                <CustomTextField
                                                    value={city}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'City*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={ArrowIcon}
                                                    rightIconName={city ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        if (state) {
                                                            setCitypicker(!citypicker);
                                                            cityReq(state_id);
                                                        };
                                                    }}
                                                    editable={false}
                                                    onDisable={state ? false : true}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={hospname}
                                                onChangeText={(val) => setHospname(val)}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Hospital / Medical Facility*'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={address}
                                                onChangeText={(val) => setAddress(val)}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Address Line*'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={position}
                                                onChangeText={(val) => setPosition(val)}
                                                height={normalize(45)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Position Description'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TextFieldIn
                                                value={phoneno}
                                                onChangeText={(val) => {
                                                    const isUSA = true;
                                                    const formattedVal = formatPhoneNumber(val, isUSA);
                                                    setPhoneno(formattedVal)
                                                }}
                                                height={normalize(50)}
                                                width={normalize(300)}
                                                backgroundColor={Colorpath.Pagebg}
                                                alignSelf={'center'}
                                                color={"#000000"}
                                                placeholder={'Hospital Phone Number*'}
                                                placeholderTextColor="#AAAAAA"
                                                fontSize={16}
                                                fontFamily={Fonts.InterRegular}
                                                maxLength={15}
                                                leftname={"+1"}
                                                lefttext={true}
                                                leftfontset={Fonts.InterRegular}
                                                leftfont={16}
                                                leftcolor={"#000000"}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                    {isValidcell && (
                                            <View style={{ paddingHorizontal: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Please enter a valid Cell number"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity onPress={() => { setFromPicker(!frompicker) }}>
                                                <CustomTextField
                                                    value={fromdate}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'From Date*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={CalenderIcon}
                                                    rightIconName={"calendar"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    onRightIconPress={() => {
                                                        setFromPicker(!frompicker);
                                                    }}
                                                    editable={false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                marginTop: normalize(5)
                                            }}>
                                            <TouchableOpacity disabled={socheck ? true : false} onPress={() => { setTopicker(!topicker) }}>
                                                <CustomTextField
                                                    value={socheck ? fromdate : todate}
                                                    color={"#000000"}
                                                    height={normalize(50)}
                                                    width={normalize(300)}
                                                    backgroundColor={Colorpath.Pagebg}
                                                    alignSelf={'center'}
                                                    placeholder={'To Date*'}
                                                    placeholderTextColor="#AAAAAA"
                                                    fontSize={16}
                                                    fontFamily={Fonts.InterRegular}
                                                    rightIcon={CalenderIcon}
                                                    rightIconName={"calendar"}
                                                    rightIconSize={25}
                                                    rightIconColor="#63748b"
                                                    editable={false}
                                                    onRightIconPress={() => {
                                                        setTopicker(!topicker)
                                                    }}
                                                    onDisable={socheck ? true : false}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: normalize(15), paddingHorizontal: normalize(10) }}>
                                        <View style={{ flexDirection: "row", gap: normalize(10) }}>
                                            <TouchableOpacity onPress={() => { setSocheck(!socheck) }} >
                                                {socheck ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                                                    <TickMark name="checkmark" color={Colorpath.white} size={20} />
                                                </View> :
                                                    <View style={{ height: normalize(20), width: normalize(20), borderColor: Colorpath.black, borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                                                }
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: "row", paddingVertical: normalize(7) }}>
                                                <TouchableOpacity onPress={() => { setSocheck(!socheck) }}>
                                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#040D14" }}>
                                                        {"Currently Held"}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>
                                    <Buttons
                                        onPress={() => { AddEmpTake(); }}
                                        height={normalize(45)}
                                        width={normalize(310)}
                                        backgroundColor={Colorpath.ButtonColr}
                                        borderRadius={normalize(9)}
                                        text={props?.route?.params?.editDats ? "Update" : "Save"}
                                        color={Colorpath.white}
                                        fontSize={18}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(30)}
                                    />
                                    {!props?.route?.params?.editDats && <Buttons
                                        onPress={() => { props.navigation.goBack() }}
                                        height={normalize(45)}
                                        width={normalize(310)}
                                        borderRadius={normalize(9)}
                                        text="Cancel"
                                        color={Colorpath.ButtonColr}
                                        fontSize={14}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(10)}
                                    />}
                                </ScrollView>}
                            </KeyboardAvoidingView>
                        </>}
                <DateTimePickerModal
                    isVisible={frompicker}
                    maximumDate={new Date()}
                    mode="date"
                    date={fromdate ? new Date(fromdate) : new Date()}
                    onConfirm={handleFromDateConfirm}
                    onCancel={() => setFromPicker(false)}
                />
                <DateTimePickerModal
                    isVisible={topicker}
                    mode="date"
                    minimumDate={fromdate ? new Date(fromdate) : new Date()}
                    date={todate ? new Date(todate) : new Date(fromdate || new Date())}
                    onConfirm={handleToDateConfirm}
                    onCancel={() => setTopicker(false)}
                />
            </SafeAreaView>
            <EmpStatusModal setEmpstatusname={setEmpstatusname} empstatusname={empstatusname} profiletakeshow={profiletakeshow} setProfiletakeshow={setProfiletakeshow} />
        </>
    )
}

export default AddEmpInfo
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: normalize(10),
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: normalize(3),
    },
    optionText: {
        fontSize: 16,
        color: '#000',
        marginLeft: 8,
        fontFamily: Fonts.InterMedium
    },
    radioButtonSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colorpath.ButtonColr,
    },
});