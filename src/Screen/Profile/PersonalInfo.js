import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { countryIdentity, isUsCountry, professionCountryParams } from '../../Utils/Helpers/ApplicableCountry';
/**
 * Personal info screen module. Renders a React Native screen or a screen-scoped support component. Exported members: buildProfessionLabel, isPhysicianProfessionalInformation, CustomRadioButton, status, status1, status2, PersonalInfo, SearchBack, clean, specaillized, loadStateCards, searchCountryName, handleProfession, handleSearch, handleSpecialitySelect, handleSpecialityChange, removeSpeciality, makeUpdateProf, styles.
 */

import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet, Alert, Image } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import TextFieldIn from '../../Components/Textfield'
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts'
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo'
import { licesensRequest, professionRequest, specializationRequest } from '../../Redux/Reducers/AuthReducer'
import showErrorAlert from '../../Utils/Helpers/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { searchStateNameFunction } from '../DetailsPageWebcast/SearchStatename'
import ProfileSpeciality from './ProfileSpecialty';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfessionComponent from '../Specialization/ProfessionComponent'
import { professionInfoRequest } from '../../Redux/Reducers/ProfileReducer'
import { chooseStatecardRequest } from '../../Redux/Reducers/AuthReducer'
import Loader from '../../Utils/Helpers/Loader'
import { dashboardRequest, dashMbRequest, dashPerRequest, mainprofileRequest, mainprofileSuccess } from '../../Redux/Reducers/DashboardReducer'
import { AppContext } from '../GlobalSupport/AppContext'
import InputField from '../../Components/CellInput'
import DropdownIcon from 'react-native-vector-icons/Entypo';
import CustomInputTouchable from '../../Components/IconTextIn'
import CustomInputTouchableX from './CustomInputTouchableX'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, markNonUsaStateLicenseFlowCompleted } from '../../Utils/Helpers/nonUsaFlow';

/**
 * Reusable buildProfessionLabel component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const parseProfessionAndType = (profession, professionType = '') => {
    let cleanProf = String(profession || '').trim();
    let cleanType = String(professionType || '').trim();

    // Check if cleanProf has hyphenated suffix like "- DO", "-DO", " - MD", etc.
    const match = cleanProf.match(/^(.*?)\s*-\s*([A-Za-z0-9]+)$/);
    if (match) {
        const base = match[1].trim();
        const type = match[2].trim();
        return {
            baseProf: base,
            profType: type,
            fullProf: `${base} - ${type}`,
        };
    }

    if (cleanType) {
        return {
            baseProf: cleanProf,
            profType: cleanType,
            fullProf: cleanProf ? `${cleanProf} - ${cleanType}` : cleanType,
        };
    }

    return {
        baseProf: cleanProf,
        profType: '',
        fullProf: cleanProf,
    };
};

const buildProfessionLabel = (profession, professionType) => {
    const { fullProf } = parseProfessionAndType(profession, professionType);
    return fullProf;
};

const getBaseProfession = (profession, professionType) => {
    const { baseProf } = parseProfessionAndType(profession, professionType);
    return baseProf;
};

/**
 * Determines whether physician professional information is true.
 * @param {Object} info - Input value.
 * @returns {*}
 */
const isPhysicianProfessionalInformation = (info = {}) => {
    const profession = String(info?.profession || '').trim().toLowerCase();
    const professionType = String(info?.profession_type || '').trim().toLowerCase();

    if (profession !== 'physician' && !profession.startsWith('physician')) return false;
    return ['md', 'do', 'dpm'].includes(professionType);
};

/**
 * Custom radio button component.
 * @param {Object} props - Input object.
 * @param {*} props.selected - Nested property value.
 * @param {*} props.onPress - Nested property value.
 * @returns {JSX.Element}
 */
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
/**
 * Status string constant.
 * @returns {string}
 */
let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
/**
 * Status2 string constant.
 * @returns {string}
 */
let status2 = "";
/**
 * Personal info component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const PersonalInfo = (props) => {
    const {
        setFulldashbaord,
        setGtprof
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [selectedOption, setSelectedOption] = useState(null);
    const [slist, setSlist] = useState('');
    const [selectState, setSelectState] = useState([]);
    const [statepicker, setstatepicker] = useState(false);
    const [searchState, setSearchState] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [previousSpec, setPreviousSpec] = useState("");
    const [speciality_id, setSpeciality_id] = useState([]);
    const [speciality, setSpeciality] = useState("");
    const [formData, setFormData] = useState({});
    const [clist, setClist] = useState('');
    const [selectCountry, setSelectCountry] = useState([]);
    const [searchtext, setSearchtext] = useState(false);
    const [country, setCountry] = useState('');
    const [countrypicker, setcountrypicker] = useState(false);
    const [noloaderext, setNoloaderext] = useState(false);
    const [speids, setSpeids] = useState("");
    const isInitialSpecLoaded = useRef(false);
    const isNavigatingRef = useRef(false);
    const professionUpdatePendingRef = useRef(false);
    const selectedProfessionRef = useRef('');
    const deaSelectionTouchedRef = useRef(false);
    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
        professionUpdateRequired: false,
        stateLicenseFlowCompleted: false,
    });
    useEffect(() => {
        let mounted = true;
        Promise.all([
            readNonUsaFlowState(),
            readNonUsaPermanentFlags(),
        ]).then(([state, flags]) => {
            if (!mounted) return;
            setNonUsaFlowState(state);
            setNonUsaPermanentFlags(flags);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const userObj = DashboardReducer?.mainprofileResponse || props?.route?.params?.personal || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user;
    const [detectedCountry, setDetectedCountry] = useState({});
    useEffect(() => {
        let active = true;
        getCountryAndDialCode().then(info => { if (active) setDetectedCountry(info || {}); }).catch(() => { });
        return () => { active = false; };
    }, []);
    const storedCountry = props?.route?.params?.applicableCountry || userObj?.user_address || userObj || {};
    const applicableCountry = countryIdentity(storedCountry) ? storedCountry : detectedCountry;
    const applicableCountryKey = countryIdentity(applicableCountry);
    const isNonUsaUser = !isUsCountry(applicableCountry);
    const isNonUsaUpdateFlow = nonUsaPermanentFlags?.professionUpdateRequired === true;
    const hasCompletedStateLicenseFlow = nonUsaPermanentFlags?.stateLicenseFlowCompleted === true;
    const dashboardProfessionalInformation = DashboardReducer?.mainprofileResponse?.professional_information;
    const hasExistingPhysicianDashboardProfile = isPhysicianProfessionalInformation(dashboardProfessionalInformation);

    /**
* Search back component.
* @returns {void}
*/
    const SearchBack = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        const source =
            props?.route?.params?.personal ||
            DashboardReducer?.mainprofileResponse ||
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            null;

        if (!source) return;

        const professionalInformation = source?.professional_information;
        const profession = professionalInformation?.profession ?? source?.profession;
        const professionType = professionalInformation
            ? professionalInformation?.profession_type
            : source?.profession_type;

        const { fullProf } = parseProfessionAndType(profession, professionType ?? '');

        if (!props?.route?.params?.forceProfessionChange && !selectedProfessionRef.current) {
            setCountry(fullProf || '');
        }
        const deaRegistered = source?.professional_information?.dea_registered;
        if (!deaSelectionTouchedRef.current) {
            setSelectedOption(
                deaRegistered === 1 || deaRegistered === '1' || deaRegistered === true
                    ? '1'
                    : deaRegistered === 0 || deaRegistered === '0' || deaRegistered === false
                        ? '0'
                        : null
            );
        }
        const npiNumber = source?.professional_information?.npi_number;
        setTake(npiNumber && npiNumber !== "0" ? npiNumber : "");
    }, [props?.route?.params?.personal, DashboardReducer?.mainprofileResponse, AuthReducer?.loginResponse?.user, AuthReducer?.againloginsiginResponse?.user, AuthReducer?.verifymobileResponse?.user]);
    console.log(props?.route?.params?.personal, "props?.route?.params?.specialities------", formData)
    /**
* Specaillized utility.
* @param {*} data - Input value.
* @returns {void}
*/
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
    useEffect(() => {
        let active = true;
        setClist([]);
        setSelectCountry([]);
        if (props?.route?.params?.forceProfessionChange && !selectedProfessionRef.current) {
            isInitialSpecLoaded.current = true;
            setFormData({ speciality: '', speciality_ids: [] });
            setCountry('');
            setSpeciality('');
            setSpeciality_id([]);
            setSelectedSpecialities([]);
            setSlist([]);
            setSelectState([]);
        }
        connectionrequest()
            .then(() => {
                if (active) dispatch(professionRequest(professionCountryParams(applicableCountry)));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
        return () => { active = false; };
    }, [applicableCountryKey, props?.route?.params?.forceProfessionChange]);
    useEffect(() => {
        /**
* Load state cards utility.
*
* @async
* @returns {Promise<*>}
*/
        const loadStateCards = async () => {
            const token = AuthReducer?.token || await AsyncStorage.getItem(constants.TOKEN);
            dispatch(chooseStatecardRequest(token ? { token, key: {} } : {}));
        };
        loadStateCards();
    }, [dispatch, AuthReducer?.token]);
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
    const [take, setTake] = useState("");
    const cellNoRegexwpdd = /^\d{10}$/;
    const isValidWhatsappNodd = take?.length > 0 && !cellNoRegexwpdd.test(take);
    useEffect(() => {
        if (!AuthReducer?.status) return;
        switch (AuthReducer.status) {
            case 'Auth/professionSuccess':
                setSelectCountry(AuthReducer?.professionResponse?.profession_credentials || []);
                setClist(AuthReducer?.professionResponse?.profession_credentials || []);
                break;
            case 'Auth/specializationSuccess':
                setSelectState(AuthReducer?.specializationResponse?.specialities || []);
                setSlist(AuthReducer?.specializationResponse?.specialities || []);
                break;
        }
    }, [AuthReducer?.status, AuthReducer?.professionResponse?.profession_credentials, AuthReducer?.specializationResponse?.specialities]);

    useEffect(() => {
        if (!ProfileReducer?.status) return;
        switch (ProfileReducer.status) {
            case 'Profile/professionInfoSuccess':
                if (!professionUpdatePendingRef.current) break;
                const isProfessionSuccess = Boolean(
                    ProfileReducer?.professionInfoResponse?.status ||
                    ProfileReducer?.professionInfoResponse?.msg?.toLowerCase()?.includes('professional') ||
                    ProfileReducer?.professionInfoResponse?.msg?.toLowerCase()?.includes('updated') ||
                    ProfileReducer?.professionInfoResponse?.user
                );
                if (isProfessionSuccess && !isNavigatingRef.current) {
                    professionUpdatePendingRef.current = false;
                    isNavigatingRef.current = true;
                    const selectedProfession = selectedProfessionRef.current || country;
                    const { profType, fullProf } = parseProfessionAndType(selectedProfession);
                    const specialitiesMap = {};
                    const specNames = formData?.speciality ? formData.speciality.split(', ').map(s => s.trim()) : [];
                    (formData?.speciality_ids || []).forEach((id, idx) => {
                        if (id) {
                            specialitiesMap[String(id)] = specNames[idx] || '';
                        }
                    });

                    const currentMain = DashboardReducer?.mainprofileResponse || {};
                    const updatedMainProfile = {
                        ...currentMain,
                        profession: fullProf,
                        profession_type: profType,
                        designation: profType,
                        specialities: specialitiesMap,
                        professional_information: {
                            ...(currentMain?.professional_information || {}),
                            profession: fullProf,
                            profession_type: profType,
                            designation: profType,
                            specialities: specialitiesMap,
                            npi_number: take,
                            dea_registered: isNonUsaUser ? "0" : selectedOption,
                        }
                    };
                    dispatch(mainprofileSuccess(updatedMainProfile));

                    (async () => {
                        try {
                            const storedProf = await AsyncStorage.getItem(constants.PROFESSION);
                            const parsedProf = storedProf ? JSON.parse(storedProf) : {};
                            const merged = {
                                ...parsedProf,
                                profession: fullProf,
                                profession_type: profType,
                                designation: profType,
                                specialities: specialitiesMap,
                                npi_number: take,
                                dea_registered: isNonUsaUser ? "0" : selectedOption,
                            };
                            await AsyncStorage.setItem(constants.PROFESSION, JSON.stringify(merged));
                        } catch (e) {
                            console.log('Error updating PROFESSION storage:', e);
                        }
                    })();

                    showErrorAlert("Professional information updated successfully.");

                    const activeLicensesList =
                        DashboardReducer?.mainprofileResponse?.licensures ||
                        DashboardReducer?.dashPerResponse?.data?.licensures ||
                        DashboardReducer?.dashboardResponse?.data?.licensures ||
                        userObj?.licensures;
                    const hasActiveLicenses = Boolean(Array.isArray(activeLicensesList) && activeLicensesList.length > 0);
                    const hasLicensureStatesAvailable = Boolean(
                        Array.isArray(AuthReducer?.licesensResponse?.licensure_states) &&
                        AuthReducer?.licesensResponse?.licensure_states.length > 0
                    );

                    console.log(ProfileReducer?.professionInfoResponse, "log-----------", !hasActiveLicenses, hasLicensureStatesAvailable);
                    if (props?.navigation?.canGoBack() && !props?.route?.params?.forceProfessionChange) {
                        props.navigation.goBack();
                    } else if (!hasActiveLicenses && hasLicensureStatesAvailable) {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{
                                    name: "CreateStateInfor",
                                    params: {
                                        dataVerify: {
                                            dataVerify: "Nodasta",
                                            allDat: ProfileReducer?.personalInfoResponse?.user ||
                                                ProfileReducer?.contactInfoResponse?.user ||
                                                ProfileReducer?.professionInfoResponse?.user ||
                                                userObj,
                                        },
                                        allowStateInfoFlow: true,
                                    }
                                }],
                            })
                        );
                    } else if (!hasActiveLicenses) {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{
                                    name: "CreateStateInfor",
                                    params: {
                                        dataVerify: {
                                            dataVerify: "Nodasta",
                                            allDat: ProfileReducer?.personalInfoResponse?.user ||
                                                ProfileReducer?.contactInfoResponse?.user ||
                                                ProfileReducer?.professionInfoResponse?.user ||
                                                userObj,
                                        },
                                        allowStateInfoFlow: true,
                                    }
                                }],
                            })
                        );
                    } else {
                        props.navigation.goBack();
                    }
                }
                break;
            case 'Profile/professionInfoFailure':
                professionUpdatePendingRef.current = false;
                isNavigatingRef.current = false;
                break;
        }
    }, [ProfileReducer?.status, ProfileReducer?.professionInfoResponse]);
    /**
* Search country name utility.
* @param {*} text - Input value.
* @returns {void}
*/
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
    /**
* Handles profession.
* @param {*} did - Input value.
* @returns {void}
*/
    const handleProfession = (did) => {
        selectedProfessionRef.current = did;
        setCountry(did);
        setcountrypicker(false);
        specaillized(did?.split(' - ')[0]);
        setFormData({ speciality: '', speciality_ids: [] });
        setSpeciality('');
        setSpeciality_id([]);
        isInitialSpecLoaded.current = true;
        if (did) {
            dispatch(licesensRequest(did));
        }
    };
    /**
* Handles search.
* @param {*} text - Input value.
* @returns {void}
*/
    const handleSearch = (text) => {
        searchStateNameFunction(text, selectState, setSlist, setSearchState, (filteredList, searchText) => {
            console.log('Filtered Data:', filteredList, 'Search Text:', searchText);
        });
    };
    /**
* Handles speciality select.
* @param {*} selectedItems - Input value.
* @param {*} formData - Input value.
* @returns {void}
*/
    const handleSpecialitySelect = (selectedItems, formData) => {
        // Create a copy of the formData to avoid direct mutation
        const updatedForm = [...formData];
        // Extract selected names and IDs
        const selectedSpecialitiesNames = selectedItems.map(item => item?.name).join(', ');
        const selectedSpecialityIds = selectedItems.map(item => item?.id);

        // Update each entry in the form data
        updatedForm.forEach((entry) => {
            entry.speciality = selectedSpecialitiesNames;
            entry.speciality_ids = selectedSpecialityIds;
        });

        setFormData(updatedForm);
        setstatepicker(false);
        setSearchState("");
        setSelectedSpecialities([]);
    };

    const handleSpecialitySubmit = () => {
        setstatepicker(false);
        setSearchState("");
        setSelectedSpecialities([]);
    };

    /**
* Handles speciality change.
* @param {*} selectedSpecialities - Input value.
* @param {*} selectedIds - Input value.
* @returns {void}
*/
    const handleSpecialityChange = (selectedSpecialities, selectedIds) => {
        console.log(selectedSpecialities, selectedIds, "selectedIds============");
        let updatedFormData = formData || { speciality_ids: [], speciality: '' };
        const uniqueSpecialities = [...new Set(selectedSpecialities)];
        const uniqueIds = [...new Set(selectedIds.map(String))];
        const specialityString = uniqueSpecialities.join(', ').trim();
        updatedFormData = {
            ...updatedFormData,
            speciality: specialityString,
            speciality_ids: uniqueIds
        };
        setFormData(updatedFormData); // Update state
        setSpeciality(specialityString);
        setSpeciality_id(uniqueIds);
    };
    /**
* Remove speciality utility.
* @param {*} specialityId - Input value.
* @returns {void}
*/
    const removeSpeciality = (specialityId) => {
        // Ensure speciality_ids and speciality are arrays
        const currentSpecialityIds = formData?.speciality_ids || [];
        const currentSpecialities = formData?.speciality?.split(', ') || [];
        const updatedSpecialityIds = currentSpecialityIds.filter(id => String(id) !== String(specialityId));
        const updatedSpecialityNames = currentSpecialities.filter((_, index) => String(currentSpecialityIds[index]) !== String(specialityId));
        handleSpecialityChange(updatedSpecialityNames, updatedSpecialityIds);
    };

    useEffect(() => {
        if (isInitialSpecLoaded.current) return;
        const activeSource = (DashboardReducer?.mainprofileResponse && Object.keys(DashboardReducer.mainprofileResponse).length > 0)
            ? DashboardReducer.mainprofileResponse
            : props?.route?.params?.personal;
        const activeSpecialities = activeSource?.specialities || activeSource?.professional_information?.specialities;
        if (!props?.route?.params?.forceProfessionChange && activeSpecialities) {
            let specialties = [];
            if (Array.isArray(activeSpecialities)) {
                specialties = activeSpecialities.map((item, idx) => {
                    if (typeof item === 'object' && item !== null) {
                        return {
                            id: String(item.id || item.speciality_id || idx),
                            name: String(item.name || item.speciality_name || item.id || ''),
                        };
                    }
                    return { id: String(item), name: String(item) };
                });
            } else if (typeof activeSpecialities === 'object' && activeSpecialities !== null) {
                specialties = Object.entries(activeSpecialities).map(([id, name]) => ({
                    id: String(id),
                    name: typeof name === 'object' && name !== null ? String(name.name || name.speciality_name || id) : String(name),
                }));
            }

            if (specialties.length > 0) {
                console.log(specialties, "specialties00000001222");
                const namesString = specialties.map(specialty => specialty.name).join(', ');
                const ids = specialties.map(specialty => String(specialty.id));
                setSpeciality(namesString);
                setSpeciality_id(ids);
                setPreviousSpec(specialties);
                setFormData({
                    speciality: namesString,
                    speciality_ids: ids,
                });
                isInitialSpecLoaded.current = true;
            }
        }
    }, [DashboardReducer?.mainprofileResponse, props?.route?.params?.personal]);
    console.log(speciality, "initialFormData----------", speciality_id, formData, noloaderext);
    const memoizedSetFormData = useCallback((data) => setFormData(data), [setFormData]);
    useEffect(() => {
        if (speciality && speciality_id && !formData?.speciality && (!formData?.speciality_ids || formData?.speciality_ids?.length === 0)) {
            const initialFormData = {
                speciality: speciality || '',
                speciality_ids: Array.isArray(speciality_id) ? speciality_id : [],
            };
            console.log(initialFormData, "initialFormData----------");
            memoizedSetFormData(initialFormData);
        }
    }, [speciality, speciality_id, memoizedSetFormData]);
    const makeDid = formData && formData?.speciality_ids?.length;
    console.log(makeDid, "makeDid============");
    /**
* Make update prof utility.
* @returns {void}
*/
    const makeUpdateProf = () => {
        const selectedProfession = selectedProfessionRef.current || country;
        if (!selectedProfession) {
            showErrorAlert("Please choose profession ")
        } else if (!makeDid) {
            showErrorAlert("Please choose specialty")
        } else if (!selectedOption && !isNonUsaUser) {
            showErrorAlert("Please choose DEA Registered")
        } else if (isValidWhatsappNodd) {
            showErrorAlert("NPI must be 10 digits only ")
        } else {
            if (professionUpdatePendingRef.current) return;
            professionUpdatePendingRef.current = true;
            isNavigatingRef.current = false;
            const { baseProf, profType, fullProf } = parseProfessionAndType(selectedProfession);
            const specialitiesMap = {};
            const specNames = formData?.speciality ? formData.speciality.split(', ').map(s => s.trim()) : [];
            (formData?.speciality_ids || []).forEach((id, idx) => {
                if (id) {
                    specialitiesMap[String(id)] = specNames[idx] || '';
                }
            });
            let obj = {
                "npi_number": take,
                "profession": fullProf || baseProf || selectedProfession,
                "profession_type": profType,
                "designation": profType,
                "dea_registered": isNonUsaUser ? "0" : selectedOption,
                "specialities": formData?.speciality_ids,
                "specialities_data": specialitiesMap,
            }
            console.log(obj, "obj===============");
            connectionrequest()
                .then(() => {
                    dispatch(professionInfoRequest(obj));
                })
                .catch((err) => {
                    professionUpdatePendingRef.current = false;
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const videoRef = useRef(null);
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
                {countrypicker ? <ProfessionComponent
                    setcountrypicker={setcountrypicker}
                    searchtext={searchtext}
                    searchCountryName={searchCountryName}
                    clist={clist}
                    handleProfession={handleProfession}
                    setSearchtext={setSearchtext}
                /> : statepicker ? <ProfileSpeciality
                    formData={formData}
                    statepicker={statepicker}
                    setstatepicker={setstatepicker}
                    setSearchState={setSearchState}
                    searchState={searchState}
                    searchStateName={handleSearch}
                    slist={slist}
                    handleSpecialitySelect={handleSpecialitySelect}
                    selectedSpecialities={selectedSpecialities}
                    setSelectedSpecialities={setSelectedSpecialities}
                    removeSpeciality={removeSpeciality}
                    handleSpecialityChange={handleSpecialityChange}
                    setFormData={setFormData}
                    speciality_id={speciality_id}
                    speciality={speciality}
                    previousSpec={previousSpec}
                    setSpeids={setSpeids}
                    speids={speids}
                    onSubmit={handleSpecialitySubmit}
                /> : <>
                    <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                        {Platform.OS === "ios" ? (
                            <PageHeader
                                title="Professional Information"
                                onBackPress={SearchBack}
                            />
                        ) : (
                            <PageHeader
                                title="Professional Information"
                                onBackPress={SearchBack}
                            />

                        )}
                    </View>
                    <Loader visible={ProfileReducer?.status == 'Profile/professionInfoRequest' || noloaderext} />
                    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <InputField
                                            label='NPI Number'
                                            value={take}
                                            onChangeText={setTake}
                                            placeholder=''
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            maxlength={10}
                                        />
                                    </View>
                                </View>
                                {isValidWhatsappNodd && (
                                    <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterRegular,
                                                fontSize: 12,
                                                color: 'red',
                                            }}>
                                            {"Enter a valid NPI number"}
                                        </Text>
                                    </View>
                                )}
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <CustomInputTouchable
                                            label={"Profession*"}
                                            value={country}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                            onPress={() => {
                                                setcountrypicker(!countrypicker);
                                            }}
                                            onIconpres={() => {
                                                setcountrypicker(!countrypicker);
                                            }}
                                        />
                                    </View>
                                </View>
                                {/* <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    width: normalize(300),
                                    // marginBottom: normalize(10),
                                }}>
                                    {formData?.speciality_ids?.map((id, i) => (
                                        <View key={id} style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#E0E0E0',
                                            padding: normalize(5),
                                            marginRight: normalize(5),
                                            marginBottom: normalize(5),
                                            borderRadius: normalize(5),
                                        }}>
                                            <Text style={{ fontSize: 14, color: '#000', marginRight: normalize(5) }}>
                                                {formData.speciality.split(', ')[i]}
                                            </Text>
                                            <TouchableOpacity onPress={() => removeSpeciality(id)}>
                                                <Icon name="close" size={15} color="#000" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <CustomInputTouchable
                                            label={"Speciality(s)*"}
                                            value={formData?.speciality?.length > 0 ? 'Speciality(s)*' : ""}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                            onPress={() => {
                                                if (makeDid == 5) {
                                                    Alert.alert("eMedEvents", "You can select upto 5 specialities.", [{
                                                        text: "Cancel", onPress: () => {
                                                            console.log("Hello");
                                                        }, style: "default"
                                                    }, {
                                                        text: "Save", onPress: () => {
                                                            console.log("Hello");
                                                        }, style: "default"
                                                    }])
                                                } else {
                                                    specaillized(country?.split(' - ')[0])
                                                    setstatepicker(!statepicker);
                                                }
                                            }}
                                            onIconpres={() => {
                                                if (makeDid == 5) {
                                                    Alert.alert("eMedEvents", "You can select upto 5 specialities.", [{
                                                        text: "Cancel", onPress: () => {
                                                            console.log("Hello");
                                                        }, style: "default"
                                                    }, {
                                                        text: "Save", onPress: () => {
                                                            console.log("Hello");
                                                        }, style: "default"
                                                    }])
                                                } else {
                                                    specaillized(country?.split(' - ')[0])
                                                    setstatepicker(!statepicker);
                                                }
                                            }}
                                        />
                                    </View>
                                </View> */}
                                <CustomInputTouchableX
                                    label={"Speciality(s)*"}
                                    placeholder={""}
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => {
                                        specaillized(country?.split(' - ')[0])
                                        setstatepicker(!statepicker);
                                    }}
                                    onIconpres={() => {
                                        specaillized(country?.split(' - ')[0])
                                        setstatepicker(!statepicker);
                                    }}
                                    chipData={formData?.speciality ? formData.speciality.split(', ') : []}
                                    onRemoveChip={(index) => {
                                        const idToRemove = formData?.speciality_ids?.[index];
                                        if (idToRemove) {
                                            removeSpeciality(idToRemove);
                                        }
                                    }}
                                />
                                <View style={{ paddingVertical: normalize(7) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{"*Drug Enforcement Administration (DEA) Registered ?"}</Text>
                                    <View style={styles.container}>
                                        {/* Yes Option */}
                                        <View style={styles.optionContainer}>
                                            <CustomRadioButton
                                                selected={selectedOption === '1'}
                                                onPress={() => {
                                                    deaSelectionTouchedRef.current = true;
                                                    setSelectedOption('1');
                                                }}
                                            />
                                            <TouchableOpacity onPress={() => {
                                                deaSelectionTouchedRef.current = true;
                                                setSelectedOption('1');
                                            }}>
                                                <Text style={styles.optionText}>{"Yes"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.optionContainer}>
                                            <CustomRadioButton
                                                selected={selectedOption === '0'}
                                                onPress={() => {
                                                    deaSelectionTouchedRef.current = true;
                                                    setSelectedOption('0');
                                                }}
                                            />
                                            <TouchableOpacity onPress={() => {
                                                deaSelectionTouchedRef.current = true;
                                                setSelectedOption('0');
                                            }}>
                                                <Text style={styles.optionText}>{"No"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Buttons
                                onPress={() => { makeUpdateProf(); }}
                                height={normalize(45)}
                                width={normalize(310)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Update"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(0)}
                            />
                            <Buttons
                                onPress={() => { props.navigation.goBack() }}
                                height={normalize(45)}
                                width={normalize(310)}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(0)}
                            />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>}

            </SafeAreaView>
        </>
    )
}

/**
 * Personal info default export.
 *
 * @returns {*}
 */
export default PersonalInfo
/**
 * Styles value.
 * @returns {*}
 */
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
