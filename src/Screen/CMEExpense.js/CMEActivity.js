import { View, Text, Platform, TouchableOpacity, FlatList, ActivityIndicator, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import TickMark from 'react-native-vector-icons/Ionicons';
import ShareIcn from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { againListRequest, CMEAllowanceRequest, CMEListWiseRequest } from '../../Redux/Reducers/CMECEExpensReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import moment from 'moment';
import GlobalModal from './GlobalModal';
import Dynamicmodal from './Dynamicmodal';
import Loader from '../../Utils/Helpers/Loader';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const CMEActivity = (props) => {
    console.log(props?.route?.params?.name, "mgblfhik000000");
    const CMECEExpensReducer = useSelector(state => state.CMECEExpensReducer);
    const [globaldrop, setGloabaldrop] = useState(false);
    const [travelmodal, setTravelmodal] = useState(false);
    const [typewise, setTypewise] = useState("");
    const [gettitle, setGettitle] = useState("");
    const [selectedCourseTitles, setSelectedCourseTitles] = useState([]);
    const [down,setDown] = useState("");
    const dispatch = useDispatch();
    const CMECEActBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "CMEExDashboard" }
                ],
            })
        );
    }
    useEffect(() => {
        if (props?.route?.params?.name) {
            let obj = { "type": props?.route?.params?.name }
            connectionrequest()
                .then(() => {
                    dispatch(againListRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [props?.route?.params?.name])
    const editjson = [
        {
            "id": "1440",
            "type": "Travel Expenses",
            "field_data": {
                "travel_date": "2024-12-30T07:36:30.104Z",
                "mode_of_transport": "Airfare"
            },
            "amount": "100.00",
            "documents": "custom_invoices/e9a90f295cc8671f66463d1021d344fd.png"
        }
    ];
    const [updatedData, setUpdatedData] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pushdata, setPushdata] = useState("");
    const itemsPerPage = 10;
    useEffect(() => {
        if (props?.route?.params?.name) {
            let obj = {
                "type": "",
                "category": "expenses"
            }
            connectionrequest()
                .then(() => {
                    dispatch(CMEAllowanceRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [props?.route?.params?.name])

    const [cmeceopen, setCmeceopen] = useState(false);
    if (status === '' || CMECEExpensReducer.status !== status) {
        switch (CMECEExpensReducer.status) {
            case 'Expenses/CMEAllowanceRequest':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/CMEAllowanceSuccess':
                status = CMECEExpensReducer.status;
                console.log(typeof CMECEExpensReducer?.CMEAllowanceResponse?.allowances, "cmeceexpense------");
                const seeJson = CMECEExpensReducer?.CMEAllowanceResponse?.allowances;
                if (Array.isArray(seeJson) && seeJson.length > 0) {
                    const updatedJson = seeJson.map(course => {
                        if (!course?.all_documents_types) {
                            const documentTypes = (course?.registration_fees || [])
                                .map(fee => fee.type)
                                .filter((value, index, self) => self.indexOf(value) === index);
                            return {
                                ...course,
                                all_documents_types: documentTypes,
                            };
                        }
                        return course;
                    });
                    setUpdatedData(updatedJson);
                    setPaginatedData(updatedJson.slice(0, itemsPerPage));
                }
                break;
            case 'Expenses/CMEAllowanceFailure':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/againListRequest':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/againListSuccess':
                status = CMECEExpensReducer.status;
                setTypewise(CMECEExpensReducer?.againListResponse?.documents);
                console.log(CMECEExpensReducer?.againListResponse?.documents, "type request------");
                break;
            case 'Expenses/againListFailure':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/CMEListWiseRequest':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/CMEListWiseSuccess':
                status = CMECEExpensReducer.status;
                setDown(CMECEExpensReducer?.CMEListWiseResponse);
                console.log(CMECEExpensReducer?.CMEListWiseResponse, "chekcboxrequest------");
                break;
            case 'Expenses/CMEListWiseFailure':
                status = CMECEExpensReducer.status;
                break;
        }
    }

    const [expandedIndexes, setExpandedIndexes] = useState({});
    useEffect(() => {
        if (updatedData) {
            setTimeout(() => {
                setPaginatedData(updatedData.slice(0, 3));
                // setLoading(false);
            }, 1000);
        }
    }, [updatedData]);
    const toggleExpandKey = (key, index) => {
        setExpandedIndexes((prev) => ({
            ...prev,
            [`${index}-${key}`]: !prev[`${index}-${key}`],
        }));
    };
    const loadMoreData = () => {
        if (loadingMore) return;
        if (paginatedData?.length < updatedData?.length) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const itemsPerPage = 3;
            const newData = updatedData.slice(0, nextPage * itemsPerPage);
            setTimeout(() => {
                setPaginatedData(newData);
                setPage(nextPage);
                setLoadingMore(false);
            }, 1000);
        }
    };
    const renderFooter = () => {
        return loadingMore ? (
            <View style={{ paddingVertical: normalize(20) }}>
                <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
    };
    const [courseTitleExpanded, setCourseTitleExpanded] = useState({});
    const toggleCourseTitle = (index) => {
        setCourseTitleExpanded((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };
    const [selectedCourses, setSelectedCourses] = useState({});
    const toggleSelectAll = () => {
        const newSelectAll = !cmeceopen;
        setCmeceopen(newSelectAll);
        if (paginatedData?.length > 0) {
            if (newSelectAll) {
                setSelectedCourses(paginatedData.map(() => true));
                const allTitles = paginatedData.map(item => item?.course_title);
                setSelectedCourseTitles(allTitles);
            } else {
                setSelectedCourses(paginatedData.map(() => false));
                setSelectedCourseTitles([]);
            }
        }
    };
    const toggleTitlecheckbox = (index, item) => {
        setSelectedCourses((prev) => {
            const updatedSelectedCourses = {
                ...prev,
                [index]: !prev[index],
            };
            if (updatedSelectedCourses[index]) {
                setSelectedCourseTitles((prevTitles) => [
                    ...prevTitles,
                    item?.course_title,
                ]);
            } else {
                setSelectedCourseTitles((prevTitles) =>
                    prevTitles.filter((title) => title !== item?.course_title)
                );
            }

            return updatedSelectedCourses;
        });
    };
    console.log(selectedCourseTitles?.length > 0, "selectedCourseTitles------");
    const goDown = () => {
        let obj = {
            "type": props?.route?.params?.name,
            "titles": selectedCourseTitles?.length > 0 && selectedCourseTitles?.join('|'),
            "download": 1,
            "category": "expenses"
        }
        connectionrequest()
            .then(() => {
                dispatch(CMEListWiseRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    useEffect(() => {
        if (CMECEExpensReducer?.CMEListWiseResponse?.archive_document) {
            downloadZipFile();
        }
    }, [CMECEExpensReducer?.CMEListWiseResponse])
    const downloadZipFile = async () => {
        const fileUrl = `${down?.document_path}${down?.archive_document}`
        const filePath = `${RNFS.DocumentDirectoryPath}/${down?.archive_document}`;
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const fileContent = await response.blob();
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(fileContent);
            });
            const base64 = base64Data.split(',')[1];
            await RNFS.writeFile(filePath, base64, 'base64');
            Alert.alert('Download successful', 'ZIP file has been downloaded to: ' + filePath);
            await openZipFile(filePath);
        } catch (error) {
            console.error('Download error:', error);
            // Alert.alert('Download failed', error.message);
        }
    };
    const openZipFile = async (filePath) => {
        try {
            const isFileExist = await RNFS.exists(filePath);
            if (!isFileExist) {
                Alert.alert('Error', 'File does not exist at the specified path.');
                return;
            }
            if (Platform.OS === 'android') {
                try {
                    await FileViewer.open(filePath, { showOpenWithDialog: true });
                } catch (e) {
                    console.log('No ZIP viewer app available:', e);
                    Alert.alert(
                        'No App Found',
                        'It seems there is no app installed to open ZIP files. Please download one from the Play Store.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Go to Play Store', onPress: () => Linking.openURL('market://details?id=com.winzip.android') }
                        ]
                    );
                }
            } else if (Platform.OS === 'ios') {
                try {
                    await FileViewer.open(filePath);
                } catch (e) {
                    console.log('No ZIP viewer app available:', e);
                    Alert.alert(
                        'No App Found',
                        'It seems there is no app installed to open ZIP files. Please download one from the App Store.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Go to App Store', onPress: () => Linking.openURL('itms-apps://apps.apple.com/us/app/winzip/id500637987') }
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Unable to open the file. Please check if a ZIP file viewer app is installed.');
        }
    };
    const CmeceActivityItem = ({ item, index }) => {
        const renderValidKeys = () => {
            return renderAllDocumentsTypes();
        };

        const renderAllDocumentsTypes = () => {
            const uniqueKeys = new Set();

            const keysToRender = item.all_documents_types.filter((type) => {
                const associatedKey = type.toLowerCase().replace(/\s+/g, "_");
                const associatedData = item[associatedKey];
                const isUnique =
                    !uniqueKeys.has(associatedKey) &&
                    associatedData &&
                    associatedData.length > 0;

                if (isUnique) {
                    uniqueKeys.add(associatedKey);
                }

                return isUnique;
            });

            return keysToRender.map((type, keyIndex) => {
                const associatedKey = type.toLowerCase().replace(/\s+/g, "_");
                const associatedData = item[associatedKey];
                const isExpanded = expandedIndexes[`${index}-${associatedKey}`] || false;
                console.log(item, "associatedData[0]?.show_edit", type, associatedData);

                // Directly render if single data point
                if (Array.isArray(associatedData) && associatedData.length == 1) {
                    return (
                        <View key={keyIndex}
                            style={{
                                flexDirection: "column",
                                alignSelf: "center",
                                marginTop: normalize(10),
                                padding: normalize(10),
                                backgroundColor: "#FFFFFF",
                                width: normalize(300),
                                borderRadius: normalize(5),
                                shadowColor: "#000",
                                shadowOffset: { height: 3, width: 0 },
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                                elevation: 5
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#000000",
                                    }}
                                >
                                    {type.replace(/_/g, " ")}
                                </Text>
                                {(item?.in_person == 1) && (type !== "Registration Fees") ? (
                                    <TouchableOpacity onPress={() => {
                                        setPushdata(associatedData);
                                        setGettitle(item?.course_title);
                                        setGloabaldrop(!globaldrop);
                                    }}>
                                        <IconDot
                                            name="dots-three-vertical"
                                            size={25}
                                            color={"#848484"}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                                {type == "Registration Fees" && associatedData[0]?.show_edit == 1 ?
                                    <TouchableOpacity onPress={() => {
                                        setPushdata(associatedData);
                                        setGettitle(item?.course_title);
                                        setGloabaldrop(!globaldrop);
                                    }}>
                                        <IconDot
                                            name="dots-three-vertical"
                                            size={25}
                                            color={"#848484"}
                                        />
                                    </TouchableOpacity>
                                    : null}
                            </View>
                            {renderFilteredData(type, associatedData)}
                        </View>
                    );
                }

                return (
                    <View key={keyIndex} style={{ marginBottom: 10 }}>
                        <TouchableOpacity
                            onPress={() => toggleExpandKey(associatedKey, index)}
                            style={{
                                flexDirection: "column",
                                alignSelf: "center",
                                marginTop: normalize(10),
                                padding: normalize(10),
                                backgroundColor: "#FFFFFF",
                                width: normalize(300),
                                borderRadius: normalize(5),
                                shadowColor: "#000",
                                shadowOffset: { height: 3, width: 0 },
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#000000",
                                    }}
                                >
                                    {type == "Meals and Incidentals" ? "Meals Expenses" : type.replace(/_/g, " ")}
                                </Text>
                                {type !== "Registration Fees" && Array.isArray(associatedData) && associatedData.length > 0 && (
                                    <ShareIcn
                                        name={isExpanded ? "up" : "down"}
                                        color={"#000000"}
                                        size={20}
                                    />
                                )}
                            </View>

                            {type == "Registration Fees" ? (
                                <View style={{ padding: 0 }}>
                                    {renderFilteredData(type, associatedData, item)}
                                </View>
                            ) : (
                                isExpanded && Array.isArray(associatedData) && associatedData.length > 0 && (
                                    <View>
                                        {renderFilteredData(type, associatedData, item)}
                                    </View>
                                )
                            )}
                        </TouchableOpacity>
                    </View>
                );
            });
        };
        const extractDynamicAmounts = (data) => {
            const result = [];
            for (const key in data) {
                if (Array.isArray(data[key]) && key !== "all_documents" && key !== "all_documents_types") {
                    const amountKey = `${key}_amount`;
                    if (data.hasOwnProperty(amountKey)) {
                        let totalAmount = 0;
                        data[key].forEach((entity) => {
                            if (entity.amount) {
                                totalAmount += parseFloat(entity.amount);
                            }
                        });
                        if (data[key].length > 0 && data[key][0].type) {
                            result.push({
                                type: data[key][0].type,
                                dynamic_amount: totalAmount,
                            });
                        }
                    }
                }
            }

            return result;
        };

        const renderFilteredData = (type, data, mainid) => {
            const dynamicAmounts = mainid ? extractDynamicAmounts(mainid) || [] : [];
            console.log(type, "type-------", data, mainid, dynamicAmounts);
            if (!data || data.length == 0) {
                return (
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>
                        {"No data available"}
                    </Text>
                );
            }
            const filteredDynamicAmounts = dynamicAmounts.filter(
                (dynamicEntry) => dynamicEntry.type == type && dynamicEntry.type !== "Registration Fees"
            );
            return data.map((entry, index) => {
                console.log(entry, "entry========")
                const totalAmount =
                    type == "Registration Fees"
                        ? data.reduce((total, entry) => total + parseFloat(entry.amount) || 0, 0)
                        : 0;

                return (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >

                        <View style={{ flex: 1 }}>
                            {dynamicAmounts
                                .filter((dynamicEntry) => dynamicEntry.type == type)
                                .map((dynamicEntry) => {
                                    if (dynamicEntry.dynamic_amount && index == 0 && dynamicEntry.type !== "Registration Fees") {
                                        return (
                                            <>
                                                <Text
                                                    key={dynamicEntry.type}
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    ${dynamicEntry.dynamic_amount}
                                                </Text>
                                            </>
                                        );
                                    }
                                    return null;
                                })}
                            {filteredDynamicAmounts.length > 0 && index == 0 && (
                                <View
                                    style={{
                                        height: 0.7,
                                        width: normalize(295),
                                        marginLeft: normalize(185),
                                        alignSelf: "center",
                                        backgroundColor: "#CCCCCC",
                                        top: normalize(-7),
                                    }}
                                />
                            )}

                            {entry.field_data &&
                                Object.keys(entry.field_data).map((key) => {
                                    const value = entry.field_data[key];
                                    const isDate = moment(value, moment.ISO_8601, true).isValid();

                                    return !["lodging_date", "travel_date"].includes(key) && value ? (
                                        <View style={{ paddingVertical: normalize(10) }}>
                                            <Text
                                                key={key}
                                                style={{
                                                    fontFamily: Fonts.InterBold,
                                                    fontSize: 16,
                                                    color: "#000000",
                                                }}
                                            >
                                                {`${isDate ? moment(value).format("DD MMMM, YYYY") : value}`}
                                            </Text>
                                        </View>

                                    ) : null;
                                })}


                            {type == "Registration Fees" && index == 0 && totalAmount ? (
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        marginBottom: 10,
                                    }}
                                >
                                    ${totalAmount}
                                </Text>
                            ) : (
                                null
                            )}
                        </View>
                        {type !== "Registration Fees" && (
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    textAlign: "center",
                                    flex: 1,
                                }}
                            >
                                ${entry.amount || "N/A"}
                            </Text>
                        )}
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            {(mainid?.in_person == 1 && type !== "Registration Fees") && (
                                <TouchableOpacity onPress={() => {
                                    setPushdata(entry);
                                    setGettitle(mainid?.course_title);
                                    setGloabaldrop(!globaldrop);
                                }}>
                                    <IconDot
                                        name="dots-three-vertical"
                                        size={25}
                                        color={"#848484"}
                                    />
                                </TouchableOpacity>
                            )}
                            {type == "Registration Fees" && mainid?.registration_fees[0]?.show_edit == 1 && (
                                <TouchableOpacity onPress={() => {
                                    setPushdata(entry);
                                    setGettitle(mainid?.course_title);
                                    setGloabaldrop(!globaldrop);
                                }}>
                                    <IconDot
                                        name="dots-three-vertical"
                                        size={25}
                                        color={"#848484"}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                );
            });
        };




        return (
            <>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: normalize(315),
                        height: normalize(30),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: normalize(10),
                            gap: normalize(10),
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity onPress={() => toggleTitlecheckbox(index, item)}>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: selectedCourses[index]
                                        ? Colorpath.ButtonColr
                                        : "#FFF",
                                    borderColor: Colorpath.ButtonColr,
                                    height: normalize(15),
                                    width: normalize(15),
                                    borderRadius: normalize(2),
                                    borderWidth: normalize(0.5),
                                }}
                            >
                                {selectedCourses[index] && (
                                    <TickMark name="checkmark" color={Colorpath.white} size={14} />
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => { toggleCourseTitle(index) }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#000000",
                                    flex: 1,
                                    textAlignVertical: "center"
                                }}
                            >
                                {item?.course_title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleCourseTitle(index)}
                        style={{ width: normalize(40), alignItems: "flex-end" }}
                    >
                        <ShareIcn
                            name={courseTitleExpanded[index] ? "up" : "down"}
                            color={"#000000"}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{ height: 0.7, width: normalize(305), alignSelf: "center", backgroundColor: "#CCCCCC" }}
                />
                {courseTitleExpanded[index] && <View>{renderValidKeys()}</View>}
            </>
        );
    };


    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <Loader
                    visible={CMECEExpensReducer?.status == 'Expenses/CMEAllowanceRequest' || CMECEExpensReducer?.status == 'Expenses/CMEListWiseRequest'} />
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="CME/CE Activities"
                            onBackPress={CMECEActBack}
                        />
                    ) : (
                        <PageHeader
                            title="CME/CE Activities"
                            onBackPress={CMECEActBack}
                        />
                    )}
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        height: normalize(50),
                        borderWidth: 1,
                        borderColor: "#DDDDDD",
                        // borderRadius: normalize(5)
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: normalize(10),
                            gap: normalize(10)
                        }}>
                            <TouchableOpacity onPress={() => toggleSelectAll()}>
                                {!cmeceopen ? (
                                    <View style={{
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderColor: Colorpath.black,
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }} />
                                ) : (
                                    <View style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: Colorpath.ButtonColr,
                                        borderColor: Colorpath.ButtonColr,
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }}>
                                        <TickMark name="checkmark" color={Colorpath.white} size={14} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 14,
                                color: "#040D14"
                            }}>
                                {"Select All"}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity style={{ width: normalize(40) }}>
                                <ShareIcn name="sharealt" color={"#CCCCCC"} size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { goDown() }} style={{ width: normalize(30) }}>
                                <ShareIcn name="download" color={selectedCourseTitles?.length > 0 ? Colorpath.ButtonColr : "#CCCCCC"} size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <FlatList
                        data={paginatedData}
                        renderItem={CmeceActivityItem}
                        keyExtractor={(item, index) => item.id}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(150) }}
                        ListEmptyComponent={
                            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        // height: normalize(83),
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "center",
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: "center" }}>

                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: "#000000",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {"There are no CME/CE content not available !!."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
                <GlobalModal gettitle={gettitle} title={props?.route?.params?.name} typewise={typewise} travelmodal={travelmodal} setTravelmodal={setTravelmodal} maindata={pushdata} globaldrop={globaldrop} setGloabaldrop={setGloabaldrop} />
                <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("AddCME", { newjson: editjson }) }} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: normalize(50),
                        width: normalize(50),
                        backgroundColor: Colorpath.ButtonColr,
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA",
                        borderRadius: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <ShareIcn name="plus" color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

export default CMEActivity