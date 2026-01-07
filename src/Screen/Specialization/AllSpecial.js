import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Animated, Easing, Image, Pressable } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import { licesensRequest, professionRequest, signupRequest, specializationRequest, stateRequest } from '../../Redux/Reducers/AuthReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Utils/Helpers/Loader';
import SepcialityComponent from './SepcialityComponent';
import DropdownInput from '../../Components/DropdownInput';
import { styles } from './SpecialStyle';
import ProfessionComponent from './ProfessionComponent';
import PraticingStateComponent from './PraticingStateComponent';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumberUSA } from '../../Utils/Helpers/UsaPhone';
import CustomInputTouchable from '../../Components/IconTextIn';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/CellInput';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const professionalTypes = [
    { id: 1, label: 'MD', name: "Physician - MD" },
    { id: 2, label: 'DO', name: "Physician - DO" },
    { id: 3, label: 'DPM', name: "Physician - DPM" },
    { id: 4, label: 'APRN', name: "Nursing - APRN" },
    { id: 5, label: 'RN', name: "Nursing - RN" },
    { id: 6, label: 'LPN', name: "Nursing - LPN" },
    { id: 7, label: 'CNA', name: "Nursing - CNA" },
    { id: 8, label: 'RDA', name: "Dentist - RDA" },
    { id: 9, label: 'RDH', name: "Dentist - RDH" },
    { id: 10, label: 'DDS', name: "Dentist - DDS" },
    { id: 11, label: 'PharmD', name: "Pharmacist - Pharmacist" },
    { id: 12, label: 'Other' },
];
const AllSpecial = (props) => {
    console.log(props?.route?.params?.Alldata, "props=====")
    const [selectedId, setSelectedId] = useState(null);
    const [clist, setClist] = useState('');
    const [selectCountry, setSelectCountry] = useState([]);
    const [searchtext, setSearchtext] = useState(false);
    const [country, setCountry] = useState('');
    const [countrypicker, setcountrypicker] = useState(false);
    const [slist, setSlist] = useState('');
    const [selectState, setSelectState] = useState([]);
    const [statelist, setStatelist] = useState([]);
    const [searchState, setSearchState] = useState('');
    const [statepicker, setstatepicker] = useState(false);
    const [state, setState] = useState('');
    const [specialid, setSpecailid] = useState([]);
    const [label, setLabel] = useState("");
    const [pratice, setPratice] = useState(false);
    const [searchpratice, setSearchpratice] = useState('');
    const [slistpratice, setSlistpratice] = useState('');
    const [specialidpratice, setSpecailidpratice] = useState("");
    const [statepratice, setStatepratice] = useState('');
    const [statelistpratice, setStatelistpratice] = useState([]);
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [countryId, setCountryId] = useState("1")
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    const animatedValuesprof = useRef(new Animated.Value(1)).current;
    const scaleValuesesprof = useRef(new Animated.Value(0)).current;
    const animatedValuestate = useRef(new Animated.Value(1)).current;
    const scaleValuesestate = useRef(new Animated.Value(0)).current;
    const handlePress = (all) => {
        licData(all?.name)
        setSelectedId(all?.id);
        setLabel(all?.name);
        specaillized(all?.name?.split(' - ')?.[0]);
    };

    useEffect(() => {
        const targetScaleprof = state ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: state ? 1 : 0,
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
    }, [state]);
    useEffect(() => {
        const targetScale = country ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesprof, {
                toValue: country ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesprof, {
                toValue: targetScale,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [country]);
    useEffect(() => {
        const targetScalesp = statepratice ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestate, {
                toValue: statepratice ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestate, {
                toValue: targetScalesp,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [statepratice]);
    console.log(label, "md========")
    const groupedData = [
        professionalTypes.slice(0, 4),
        professionalTypes.slice(4, 8),
        professionalTypes.slice(8)
    ];
    const isfocused = useIsFocused();
    const searchCountryName = text => {
        console.log(text, 'text12333');
        if (text) {
            const listData = selectCountry?.filter(function (item) {
                // console.log('item+++++++++++++++++++1111', item);
                const itemData = item
                    ? item?.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.trim().toUpperCase();
                const filteredData = itemData.indexOf(textData) > -1;
                // console.log('filteredData', filteredData);
                return filteredData;
            });
            setClist(listData);
            setSearchtext(text);
        } else {
            setClist(selectCountry);
            setSearchtext(text);
        }
    };
    const searchStateName = text => {
        console.log(text, 'text12333');
        if (text) {
            const stateListData = selectState?.filter(function (item) {
                // console.log('item+++++++++++++++++++state', item);
                const itemData = item?.name
                    ? item?.name.toUpperCase() + item?.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.trim().toUpperCase();
                const filteredData = itemData.indexOf(textData) > -1;
                // console.log('filteredDataState', filteredData);
                return filteredData;
            });
            setSlist(stateListData);
            setSearchState(text);
        } else {
            setSlist(selectState);
            setSearchState(text);
        }
    };
    const searchStateNamePratice = text => {
        console.log(text, 'text12333');
        if (text) {
            const praticeState = selectStatepratice?.filter(function (item) {
                // console.log('item+++++++++++++++++++state', item);
                const itemData = item?.state_name
                    ? item?.state_name.toUpperCase() + item?.state_name.toUpperCase()
                    : ''.toUpperCase();
                const textDataPratice = text.trim().toUpperCase();
                const praticeStateFiltered = itemData.indexOf(textDataPratice) > -1;
                // console.log('praticeStateFilteredState', praticeStateFiltered);
                return praticeStateFiltered;
            });
            setSlistpratice(praticeState);
            setSearchpratice(text);
        } else {
            setSlistpratice(selectStatepratice);
            setSearchpratice(text);
        }
    };
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(professionRequest());
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }, [isfocused]);
    const specaillized = (data) => {
        const obj = data
        connectionrequest()
            .then(() => {
                dispatch(specializationRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    // const PraticingState = () => {
    //     connectionrequest()
    //         .then(() => {
    //             dispatch(stateRequest(countryId));
    //         })
    //         .catch(err => {
    //             // console.log(err);
    //             showErrorAlert('Please connect to Internet', err);
    //         });
    // }
    const handleStateSelect = (item) => {
        console.log("Hello=======", item);
        setState(item?.name);
        setSpecailid(item.id)
        setstatepicker(false);
        // PraticingState();
    };
    const handleProfession = (did) => {
        console.log("Hello=======did", did);
        licData(did);
        setLabel(did);
        setCountry(did);
        setcountrypicker(false);
        specaillized(did?.split(' - ')[0])
    }
    const handlePratcing = (draw) => {
        setStatepratice(draw?.state_name);
        setSpecailidpratice(draw?.id)
        setPratice(false);
    }
    console.log(selectedId ? selectedId === 12 : undefined, "heloo -------", country,statelist?.length);
     const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      let formatted = '';
      if (match[1]) formatted = `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
    return input;
  };
    console.log("statepicker====", statepicker, country)
    const signupHandle = () => {
        if (!selectedId && !country) {
            showErrorAlert("Select Your Profession")
        } else if (!country && selectedId === 12) {
            showErrorAlert("Select Your Profession")
        } else if (!state) {
            showErrorAlert("Choose Your Specialty")
        } else if (!statepratice && statelistpratice?.length > 0) {
            showErrorAlert("Select Your State of Practice")
        } else {
            let finalFormattedPhone = "";
            if (props?.route?.params?.Alldata?.countryCode == "+1" && props?.route?.params?.Alldata?.phone) {
                const finalCont = formatPhoneNumber(props?.route?.params?.Alldata?.phone);
                finalFormattedPhone = finalCont || "";
                console.log(finalFormattedPhone,"finalFormattedPhone++++++++")
            }
            let obj = finalFormattedPhone ? {
                "first_name": props?.route?.params?.Alldata?.first_name,
                "last_name": props?.route?.params?.Alldata?.last_name,
                "email": props?.route?.params?.Alldata?.email,
                "password": props?.route?.params?.Alldata?.password,
                "phone": `+1${finalFormattedPhone}`,
                "role": 4,
                "state_id": specialidpratice,
                "profession": selectedId === 12 ? country : label,
                "npi_number": "",
                "specialities": [specialid],
                "signup_usa": true,
                "accept_updates": 1,
                "is_mobile": 1
            } :
                {
                    "first_name": props?.route?.params?.Alldata?.first_name,
                    "last_name": props?.route?.params?.Alldata?.last_name,
                    "email": props?.route?.params?.Alldata?.email,
                    "password": props?.route?.params?.Alldata?.password,
                    "phone": `${props?.route?.params?.Alldata?.countryCode}${props?.route?.params?.Alldata?.phone}`,
                    "role": 4,
                    "state_id": specialidpratice || "",
                    "profession": selectedId === 12 ? country : label,
                    "npi_number": "",
                    "specialities": [specialid],
                    "signup_usa": true,
                    "is_mobile": 1
                }
            console.log(obj, "sign up obj ===========")
            connectionrequest()
                .then(() => {
                    dispatch(signupRequest(obj))
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }

    useEffect(() => {
        if (state) {
            setSearchState("");
        }
    }, [state])
    useEffect(() => {
        if (!searchState && AuthReducer?.specializationResponse?.specialities) {
            setSlist(AuthReducer?.specializationResponse?.specialities)
        }
    }, [searchState])
    useEffect(() => {
        if (country) {
            setSearchtext("");
        }
    }, [country])
    useEffect(() => {
        if (!searchtext && AuthReducer?.professionResponse?.profession_credentials) {
            setClist(AuthReducer?.professionResponse?.profession_credentials);
        }
    }, [searchtext])
    useEffect(() => {
        if (statepratice) {
            setSearchpratice("");
        }
    }, [statepratice])
    useEffect(() => {
        if (!searchpratice && AuthReducer?.stateResponse?.states) {
            setSlistpratice(AuthReducer?.stateResponse?.states);
        }
    }, [searchpratice])
    const licData = (hill) => {
        const obj = hill || country;
        connectionrequest()
            .then(() => {
                dispatch(licesensRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/professionRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/professionSuccess':
                status = AuthReducer.status;
                setSelectCountry(AuthReducer?.professionResponse?.profession_credentials);
                setClist(AuthReducer?.professionResponse?.profession_credentials);
                break;
            case 'Auth/professionFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/specializationRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/specializationSuccess':
                status = AuthReducer.status;
                setStatelist(AuthReducer?.specializationResponse?.specialities);
                setSelectState(AuthReducer?.specializationResponse?.specialities);
                setSlist(AuthReducer?.specializationResponse?.specialities);
                break;
            case 'Auth/specializationFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensSuccess':
                status = AuthReducer.status;
                setStatelistpratice(AuthReducer?.licesensResponse?.licensure_states);
                setSelectStatepratice(AuthReducer?.licesensResponse?.licensure_states);
                setSlistpratice(AuthReducer?.licesensResponse?.licensure_states);
                break;
            case 'Auth/licesensFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/signupRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/signupSuccess':
                status = AuthReducer.status;
                props?.navigation.navigate("VerifyOTP", { verifyemail: { verifyemail: props?.route?.params?.Alldata, profession: label || country } });
                break;
            case 'Auth/signupFailure':
                status = AuthReducer.status;
                break;
        }
    }
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.container}>
                {statepicker ? (
                    <SepcialityComponent
                        state={state}
                        handleStateSelect={handleStateSelect}
                        slist={slist}
                        setstatepicker={setstatepicker}
                        searchState={searchState}
                        searchStateName={searchStateName}
                        setSearchState={setSearchState}
                    />
                ) : countrypicker ? (
                    <ProfessionComponent
                        setcountrypicker={setcountrypicker}
                        searchtext={searchtext}
                        searchCountryName={searchCountryName}
                        clist={clist}
                        setSearchtext={setSearchtext}
                        handleProfession={handleProfession}
                    />
                ) : pratice ? (
                    <PraticingStateComponent
                        handlePratcing={handlePratcing}
                        slistpratice={slistpratice}
                        setPratice={setPratice}
                        searchpratice={searchpratice}
                        setSearchpratice={setSearchpratice}
                        searchStateNamePratice={searchStateNamePratice} />
                ) : <>
                    <Loader
                        visible={AuthReducer?.status == 'Auth/signupRequest'} />
                    <View style={{ marginTop: normalize(40), marginLeft: normalize(15) }}>
                        <View style={{ marginBottom: normalize(5), marginRight: normalize(15) }}>
                            <Image source={Imagepath.eMedfulllogo} style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }} />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.AmText}>
                                {"I am a"}
                            </Text>
                            <Text style={{ color: "red", paddingVertical: normalize(2) }}>{"*"}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: normalize(10) }}>
                        <FlatList
                            data={groupedData}
                            renderItem={({ item }) => (
                                <View style={styles.buttonRow}>
                                    {item.map(type => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                styles.button,
                                                selectedId === type.id && styles.selectedButton,
                                                selectedId !== null && selectedId !== type.id && styles.unselectedButton
                                            ]}
                                            onPress={() => {
                                                setCountry("");
                                                setState('')
                                                setStatepratice('')
                                                handlePress(type);
                                            }}
                                        >
                                            <Text
                                                style={[styles.buttonText, { color: selectedId === type.id ? "#FFFFFF" : "#000000" }]}
                                            >
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            {selectedId === 12 ? (<View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>

                                    {/* <CustomInputTouchable
                                        label={country ? "Profession*" : "Profession*"}
                                        value={country}
                                        placeholder={""}
                                        placeholderTextColor="#949494"
                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onPress={() => {
                                            setcountrypicker(!countrypicker);
                                            setState('');
                                            setStatepratice('')
                                        }}
                                        onIconpres={() => {
                                            setcountrypicker(!countrypicker);
                                            setState('');
                                            setStatepratice('')
                                        }}
                                    /> */}

                                    <InputField
                                        label={country ? "Profession*" : "Profession*"}
                                        value={country}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxLength={300}
                                        editable={false}
                                        leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onLeftIconPress={() => {
                                            setcountrypicker(!countrypicker);
                                            setState('');
                                            setStatepratice('')
                                        }}
                                        onwholePress={() => {
                                            setcountrypicker(!countrypicker);
                                            setState('');
                                            setStatepratice('')
                                        }}
                                        marginleft={normalize(280)}
                                        multiline={true}
                                        spaceneeded={true}
                                    />
                                </View>
                            </View>) : null}
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>

                                    {/* <CustomInputTouchable
                                            disabled={statelist?.length > 0 ? false : true}
                                            label={state ? "Speciality*" : "Speciality*"}
                                            value={state}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                            onPress={() => {
                                                setstatepicker(!statepicker);
                                            }}
                                            onIconpres={() => {
                                                setstatepicker(!statepicker);
                                            }}
                                        /> */}
                                    <InputField
                                        icondisable={statelist?.length > 0 ? false : true}
                                        label={state ? "Speciality*" : "Speciality*"}
                                        value={state}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxLength={500}
                                        editable={false}
                                        leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onLeftIconPress={() => setstatepicker(!statepicker)}
                                        marginleft={normalize(280)}
                                        onwholePress={() => setstatepicker(!statepicker)}
                                        multiline={true}
                                        spaceneeded={true}
                                    />
                                </View>
                            </View>

                            {statelistpratice?.length > 0 && <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        icondisable={statelistpratice?.length > 0 ? false : true}
                                        label={statepratice ? "Currently Practicing State In*" : "Currently Practicing State In*"}
                                        value={statepratice}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxLength={300}
                                        editable={false}
                                        leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onLeftIconPress={() => {
                                            setPratice(!pratice);
                                            licData(label);
                                        }}
                                        marginleft={normalize(280)}
                                        onwholePress={() => {
                                            setPratice(!pratice)
                                            licData(label);
                                        }}
                                        multiline={true}
                                        spaceneeded={true}
                                    />
                                </View>
                            </View>}
                        </View>
                        <View>
                            <Buttons
                                onPress={signupHandle}
                                height={normalize(45)}
                                width={normalize(300)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Submit"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />
                        </View>
                    </ScrollView>
                </>}

            </SafeAreaView>
        </>
    );
};
export default AllSpecial;

