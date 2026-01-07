import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import Colorpath from '../../Themes/Colorpath';
import CamIcn from 'react-native-vector-icons/Feather'
import CameraPicker from '../../Components/CameraPicker';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { profilepicRequest } from '../../Redux/Reducers/ProfileReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
let status = "";
let status1 = "";
const CircleLoader = ({allProfTake, percentage, mainData }) => {
    const size = 150;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percentage) / 100;
    const [cameraPicker, setCameraPicker] = useState(false);
    const [ProfilePicObj1, setProfilePicObj1] = useState('');
    const [ProfilePicUri1, setProfilePicUri1] = useState('');
    const [pathImg, setPathImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [hite, setHite] = useState("hide");
    const dispatch = useDispatch();
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const isFocus = useIsFocused();
    console.log(ProfileReducer, "profiefff=======", ProfilePicObj1, mainData, pathImg);
    useEffect(() => {
        if (ProfilePicObj1) {
            updatProfile();
        }
    }, [ProfilePicObj1])
    useEffect(() => {
        if (mainData?.personal_information) {
            setPathImg(mainData?.personal_information);
        }
    }, [mainData])
    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const [alphaimg, setAlphaimg] = useState("");
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
                    setFinalverifyvault(board_special_json);
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
    const [allProfession, setAllProfession] = useState(null);
    useEffect(() => {
        const profession =
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            finalverifyvault ||
            finalProfession;

        setAllProfession(profession);
    }, [AuthReducer, finalverifyvault, finalProfession]);
    const getInitials = (firstname, lastname) => {
        const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
        const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
        return firstInitial + lastInitial;
    };
    useEffect(() => {
        if (DashboardReducer?.mainprofileResponse || allProfession) {
            const firstName = DashboardReducer?.mainprofileResponse?.personal_information?.firstname || allProfession?.firstname;
            const lastName = DashboardReducer?.mainprofileResponse?.personal_information?.lastname || allProfession?.lastname;
            const initials = getInitials(firstName, lastName);
            setAlphaimg(initials)
        }
    }, [mainData, allProfession])
    const updatProfile = () => {
        let obj = new FormData();
        obj.append("profile_picture", ProfilePicObj1);
        connectionrequest()
            .then(() => {
                dispatch(profilepicRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    if (status == '' || ProfileReducer.status != status) {
        switch (ProfileReducer.status) {
            case 'Profile/profilepicRequest':
                status = ProfileReducer.status;
                setLoading(true);
                break;
            case 'Profile/profilepicSuccess':
                status = ProfileReducer.status;
                dispatch(mainprofileRequest({}));
                setLoading(false);
                setPathImg(ProfileReducer?.profilepicResponse);
                console.log(ProfileReducer?.profilepicResponse, "log-----------");
                break;
            case 'Profile/profilepicFailure':
                status = ProfileReducer.status;
                setLoading(false);
                break;
        }
    }
    console.log(pathImg, "pathimg-------")
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/mainprofileRequest':
                status1 = DashboardReducer.status;
                setLoading(true);
                break;
            case 'Dashboard/mainprofileSuccess':
                status1 = DashboardReducer.status;
                setLoading(false);
                setPathImg(DashboardReducer?.mainprofileResponse?.personal_information);
                console.log(DashboardReducer?.mainprofileResponse, "log-----------");
                break;
            case 'Dashboard/mainprofileFailure':
                status1 = DashboardReducer.status;
                setLoading(false);
                break;
        }
    }
    return (
        <>
            <View style={styles.container}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#1BDC5F" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#1BDC5F" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                        <Circle
                            stroke="#6a82ce"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        {allProfTake && <Circle
                            stroke="url(#grad)"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                        />}
                    </G>
                </Svg>
                <View style={styles.textView}>
                    <ImageBackground source={
                        pathImg?.image_name == null || !pathImg?.image_name || pathImg?.image_name == ""
                            ? null
                            : { uri: `${pathImg?.image_path}${pathImg?.image_name}` }
                    } resizeMode="cover" style={{ height: normalize(90), width: normalize(90) }} imageStyle={{ borderRadius: normalize(90) }}>
                        {(!pathImg?.image_name || !pathImg?.image_path) && (
                            <View
                                style={{
                                    height: normalize(90),
                                    width: normalize(90),
                                    borderRadius: normalize(90),
                                    backgroundColor: Colorpath.white,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colorpath.ButtonColr,
                                        fontSize: 38,
                                        fontWeight: "bold",
                                        fontFamily: Fonts.InterBold,
                                    }}
                                >
                                    {alphaimg}
                                </Text>
                            </View>
                        )}
                        {/* <View style={{ justifyContent: "center", alignSelf: "center", marginTop: normalize(50), marginRight: normalize(30) }}>
                            {loading && (
                                <ActivityIndicator
                                    size="large"
                                    color={Colorpath.ButtonColr}
                                    style={{ position: "absolute" }}
                                />
                            )}
                        </View> */}
                        <TouchableOpacity onPress={() => {
                            setHite("hide");
                            setCameraPicker(!cameraPicker)
                                ;
                        }} style={{
                            justifyContent: "center", alignContent: "center", position: "absolute", zIndex: 999, top: normalize(50),
                            left:Platform.OS === 'ios' ? '75%': '88%', height: normalize(40), width: normalize(40), borderRadius: normalize(20), backgroundColor: Colorpath.Pagebg
                        }}>
                            <CamIcn style={{ alignSelf: "center" }} name="camera" size={25} color={Colorpath.ButtonColr} />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>
            <CameraPicker
                profilehit={hite}
                cropping={true}
                pickerVisible={cameraPicker}
                onBackdropPress={() => setCameraPicker(false)}
                btnClick_cameraUpload={imgObj => {
                    console.log(imgObj);
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
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textView: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "#FFFFFF",
        height: normalize(90),
        width: normalize(90),
        borderRadius: normalize(90)
    }
});

export default CircleLoader;
