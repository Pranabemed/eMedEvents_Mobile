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
import { professionRequest, specializationRequest } from '../../Redux/Reducers/AuthReducer'
import showErrorAlert from '../../Utils/Helpers/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { searchStateNameFunction } from '../DetailsPageWebcast/SearchStatename'
import ProfileSpeciality from './ProfileSpecialty';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfessionComponent from '../Specialization/ProfessionComponent'
import { professionInfoRequest } from '../../Redux/Reducers/ProfileReducer'
import Loader from '../../Utils/Helpers/Loader'
import Video from 'react-native-video'
import { dashPerRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer'
import { AppContext } from '../GlobalSupport/AppContext'
import InputField from '../../Components/CellInput'
import DropdownIcon from 'react-native-vector-icons/Entypo';
import CustomInputTouchable from '../../Components/IconTextIn'
import CustomInputTouchableX from './CustomInputTouchableX'
import { SafeAreaView } from 'react-native-safe-area-context'

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
let status = "";
let status1 = "";
let status2 = "";
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
    const SearchBack = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        if (props?.route?.params?.personal) {
            const profession = props?.route?.params?.personal?.professional_information?.profession;
            const profession_type = props?.route?.params?.personal?.professional_information?.profession_type;
            const clean = (value) => {
                if (value == null) return '';
                return String(value).trim();
            };
            const cleanedProfession = clean(profession);
            const cleanedProfessionType = clean(profession_type);
            const combinedValue =
                cleanedProfession && cleanedProfessionType
                    ? `${cleanedProfession} - ${cleanedProfessionType}`
                    : cleanedProfession || cleanedProfessionType;

            setCountry(combinedValue || '');
            // setCountry(`${props?.route?.params?.personal?.professional_information?.profession} - ${props?.route?.params?.personal?.professional_information?.profession_type}`);
            setSelectedOption(props?.route?.params?.personal?.professional_information?.dea_registered);
            const npiNumber = props?.route?.params?.personal?.professional_information?.npi_number;
            setTake(npiNumber && npiNumber !== "0" ? npiNumber : "");
        }
    }, [props?.route?.params?.personal])
    console.log(props?.route?.params?.personal, "props?.route?.params?.specialities------", formData)
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
        connectionrequest()
            .then(() => {
                dispatch(professionRequest());
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }, [props?.route?.params?.personal]);
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
                setSelectState(AuthReducer?.specializationResponse?.specialities);
                setSlist(AuthReducer?.specializationResponse?.specialities);
                break;
            case 'Auth/specializationFailure':
                status = AuthReducer.status;
                break;
        }
    }
    if (status1 == '' || ProfileReducer.status != status1) {
        switch (ProfileReducer.status) {
            case 'Profile/professionInfoRequest':
                status1 = ProfileReducer.status;
                break;
            case 'Profile/professionInfoSuccess':
                status1 = ProfileReducer.status;
                if (ProfileReducer?.professionInfoResponse?.msg == "Professional inforamtion updated successfully.") {
                    showErrorAlert("Professional information updated successfully.")
                    dispatch(mainprofileRequest({}));
                    dispatch(dashPerRequest({}))
                    props.navigation.goBack();
                }
                console.log(ProfileReducer?.professionInfoResponse, "log-----------");
                break;
            case 'Profile/professionInfoFailure':
                status1 = ProfileReducer.status;
                break;

        }
    }
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
    const handleProfession = (did) => {
        setCountry(did);
        setcountrypicker(false);
        specaillized(did?.split(' - ')[0])
        setFormData("");
    }
    const handleSearch = (text) => {
        searchStateNameFunction(text, selectState, setSlist, setSearchState, (filteredList, searchText) => {
            console.log('Filtered Data:', filteredList, 'Search Text:', searchText);
        });
    };
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

    const handleSpecialityChange = (selectedSpecialities, selectedIds) => {
        console.log(selectedSpecialities, selectedIds, "selectedIds============");
        let updatedFormData = formData || { speciality_ids: [], speciality: '' };
        const uniqueSpecialities = [...new Set(selectedSpecialities)];
        const uniqueIds = [...new Set(selectedIds)];
        const specialityString = uniqueSpecialities.join(', ').trim();
        updatedFormData = {
            ...updatedFormData,
            speciality: specialityString,
            speciality_ids: uniqueIds
        };
        setFormData(updatedFormData); // Update state
    };
    const removeSpeciality = (specialityId) => {
        // Ensure speciality_ids and speciality are arrays
        const currentSpecialityIds = formData?.speciality_ids || [];
        const currentSpecialities = formData?.speciality?.split(', ') || [];
        const updatedSpecialityIds = currentSpecialityIds.filter(id => id !== specialityId);
        const updatedSpecialityNames = currentSpecialities.filter((_, index) => currentSpecialityIds[index] !== specialityId);
        handleSpecialityChange(updatedSpecialityNames, updatedSpecialityIds);
    };

    useEffect(() => {
        if (props?.route?.params?.personal?.specialities) {
            const specialties = Object.entries(props?.route?.params?.personal?.specialities).map(([id, name]) => ({
                id: String(id),
                name: String(name),
            }));

            console.log(specialties, "specialties00000001222");
            const namesString = specialties.map(specialty => specialty.name).join(', ');
            const ids = specialties.map(specialty => String(specialty.id));
            setSpeciality(namesString);
            setSpeciality_id(ids);
            setPreviousSpec(specialties);
        }
    }, [props?.route?.params?.personal]);
    console.log(speciality, "initialFormData----------", speciality_id, formData, noloaderext);
    const memoizedSetFormData = useCallback((data) => setFormData(data), [setFormData]);
    useEffect(() => {
        if (speciality && speciality_id) {
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
    const makeUpdateProf = () => {
        if (!country) {
            showErrorAlert("Please choose profession ")
        } else if (!makeDid) {
            showErrorAlert("Please choose specialty")
        } else if (!selectedOption) {
            showErrorAlert("Please choose DEA Registered")
        } else if (isValidWhatsappNodd) {
            showErrorAlert("NPI must be 10 digits only ")
        } else {
            const input = country;
            const match = input.match(/- (\w+)$/);
            const result = match ? match[1] : "";
            console.log(result);
            let obj = {
                "npi_number": take,
                "profession": country,
                "profession_type": result,
                "designation": result,
                "dea_registered": selectedOption,
                "specialities": formData?.speciality_ids
            }
            console.log(obj, "obj===============");
            connectionrequest()
                .then(() => {
                    dispatch(professionInfoRequest(obj));
                })
                .catch((err) => {
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
                                                onPress={() => setSelectedOption('1')}
                                            />
                                            <TouchableOpacity onPress={() => setSelectedOption('1')}>
                                                <Text style={styles.optionText}>{"Yes"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.optionContainer}>
                                            <CustomRadioButton
                                                selected={selectedOption === '0'}
                                                onPress={() => setSelectedOption('0')}
                                            />
                                            <TouchableOpacity onPress={() => setSelectedOption('0')}>
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

export default PersonalInfo
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