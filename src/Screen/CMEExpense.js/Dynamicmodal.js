import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import CameraPicker from '../../Components/CameraPicker'
import { useDispatch, useSelector } from 'react-redux';
import { AddExpensesRequest, CMEAllowanceRequest, deleteExpensesRequest } from '../../Redux/Reducers/CMECEExpensReducer';
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import CustomTextField from '../../Components/CustomTextfiled';
import PlusIcn from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Imagepath from '../../Themes/Imagepath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import TravelMode from './TravelMode';
let status = "";
const Dynamicmodal = ({ gettitle, title, typewise, maindata, travelmodal, setTravelmodal }) => {
    const CMECEExpensReducer = useSelector(state => state.CMECEExpensReducer);
    console.log(maindata, "maindata------", typewise, title);
    const dispatch = useDispatch();
    const [isfilterVisible, setIsfilterVisible] = useState(false);
    const [modalHeight, setModalHeight] = useState(300);
    const [expensedate, setExpensedate] = useState("");
    const [loadingdate, setLoadingdate] = useState("");
    const [loadingamount, setLoadingamount] = useState("");
    const [expenspicker, setExpenspicker] = useState(false);
    const [cmeact, setCmeact] = useState("");
    const [cameraPicker, setCameraPicker] = useState(false);
    const [ProfilePicObj1, setProfilePicObj1] = useState("");
    const [ProfilePicUri1, setProfilePicUri1] = useState('');
    const [notshowscan, setnNotshowscan] = useState(false);
    const [allExpenses, setAllExpenses] = useState({ expenses: [] });
    const [opendate, setOpendate] = useState(false);
    const [cdate, setCdate] = useState('');
    const [traveltake, setTraveltake] = useState("");
    const [closeaction, setCloseaction] = useState(false);
    const buildDynamicFieldData = (type) => {
        const fieldData = {};
        if (type == "Travel Expenses") {
            if (cdate) fieldData["travel_date"] = cdate;
            if (traveltake) fieldData["mode_of_transport"] = traveltake;
        } else if (type == "Lodging Expenses") {
            if (cdate) fieldData["lodging_date"] = cdate;
            if (loadingdate) fieldData["hotel_name"] = loadingdate;
        } else if (type == "Meals and Incidentals") {
            if (cdate) fieldData["meal_date"] = cdate;
        }
        return fieldData;
    };
    const addExpens = () => {
        const isTravelExpenseValid = validateExpenseFields(expensedate);
        if (isTravelExpenseValid) {
            let obj = new FormData();
            const type = maindata?.type || maindata[0]?.type;
            const dynamicFieldData = buildDynamicFieldData(type);
            console.log(dynamicFieldData, "dynamic ----------")
            obj.append("id", "");
            obj.append("type", maindata?.type || maindata[0]?.type);
            obj.append("course_title", gettitle);
            obj.append("in_person", 1);
            obj.append("field_data", JSON.stringify(dynamicFieldData));
            obj.append("amount", loadingamount);
            obj.append("document[]", ProfilePicObj1);
            console.log(obj, "add expens");
            connectionrequest()
                .then(() => {
                    dispatch(AddExpensesRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    };
    const registaddExpe = () => {
        if (!loadingamount) {
            showErrorAlert("Please fillup amount !")
        } else {
            let obj = new FormData();
            obj.append("id", maindata[0]?.id);
            obj.append("type", maindata[0]?.type);
            obj.append("course_title", gettitle);
            obj.append("in_person", 1);
            obj.append("amount", loadingamount);
            obj.append("document[]", ProfilePicObj1);
            console.log(obj, "add expens");
            connectionrequest()
                .then(() => {
                    dispatch(AddExpensesRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    }
    useEffect(() => {
        setModalHeight(isfilterVisible || travelmodal ? 500 : 300);
    }, [isfilterVisible, travelmodal]);
    console.log(maindata, "maindata=======122", opendate, allExpenses);
    const [processedData, setProcessedData] = useState([]);

    const wrapDataInDoubleArray = (hidata) => {
        if (hidata) {
            console.log(hidata, "certificates");
            return [Array.isArray(hidata) ? hidata : [hidata]];
        }
        return [[]];
    };
    const cleanString = (str) => {
        if (!str) return '';
        return str.replace(/\s+/g, ' ').trim().toLowerCase();
    };
    useEffect(() => {
        if (title && maindata && maindata[0]?.type !== "Registration Fees") {
            const wholeType = typewise;
            if (Array.isArray(wholeType)) {
                console.log(wholeType, "wholetype=========", title, maindata);
                if (maindata?.type == "Meals and Incidentals" || maindata[0]?.type == "Meals and Incidentals") {
                    const result = wholeType
                        .filter(item => {
                            const subCategory = cleanString(item?.sub_category);
                            const typeMatch = cleanString(maindata?.type || maindata[0]?.type);
                            if (typeMatch.includes("meal")) {
                                return item?.title == title && subCategory.includes("meal");
                            }
                            return item?.title == title && subCategory == typeMatch;
                        })
                        .map(item => ({
                            field_name: item?.field_name,
                            field_type: item?.field_type,
                            field_value: item?.field_value
                        }));
                    setExpensedate(result);
                    console.log(result, "Filtered data for the selected type");
                } else {
                    const result = wholeType
                        .filter(item =>
                            item?.title == title && item?.sub_category == maindata?.type
                        )
                        .map(item => ({
                            field_name: item?.field_name,
                            field_type: item?.field_type,
                            field_value: item?.field_value
                        }));
                    setExpensedate(result);
                    console.log(result, "Filtered data for other types");
                }
            } else {
                console.error("typewise is not an array or is undefined.");
            }
        } else if (maindata[0]) {
            const wholeType = typewise;
            if (Array.isArray(wholeType)) {
                console.log(wholeType, "wholetype=========", title, maindata);
                if (maindata?.type == "Meals and Incidentals" || maindata[0]?.type == "Meals and Incidentals") {
                    const result = wholeType
                        .filter(item => {
                            const subCategory = cleanString(item?.sub_category);
                            const typeMatch = cleanString(maindata?.type || maindata[0]?.type);
                            if (typeMatch.includes("meal")) {
                                return item?.title == title && subCategory.includes("meal");
                            }
                            return item?.title == title && subCategory == typeMatch;
                        })
                        .map(item => ({
                            field_name: item?.field_name,
                            field_type: item?.field_type,
                            field_value: item?.field_value
                        }));
                    setExpensedate(result);
                    console.log(result, "Filtered data for the selected type");
                } else {
                    const result = wholeType
                        .filter(item =>
                            item?.title == title && item?.sub_category == maindata?.type
                        )
                        .map(item => ({
                            field_name: item?.field_name,
                            field_type: item?.field_type,
                            field_value: item?.field_value
                        }));
                    setExpensedate(result);
                    console.log(result, "Filtered data for other types");
                }
            } else {
                console.error("typewise is not an array or is undefined.");
            }
        }
    }, [maindata, title]);

    useEffect(() => {
        if (maindata) {
            const doubleArrayCertificates = wrapDataInDoubleArray(maindata);
            setProcessedData(doubleArrayCertificates);
            console.log(doubleArrayCertificates, "Processed double array data");
        }
    }, [maindata]);
    console.log(expensedate, "expensedata-------", processedData)
    useEffect(() => {
        if (maindata[0]?.type == "Registration Fees") {
            setProfilePicObj1(maindata[0]?.documents);
            setLoadingamount(maindata[0]?.amount);
        } else {
            setProfilePicObj1("");
            setLoadingamount("");
        }
    }, [maindata[0]])
    useEffect(() => {
        if (processedData && Array.isArray(processedData[0]) && processedData[0].length > 0 && maindata[0]?.type !== "Registration Fees") {
            const newExpenses = processedData[0].map((newExpense) => {
                const newExpenseData = {};
                Object.keys(newExpense).forEach((key) => {
                    if (key == 'field_data' && newExpense[key]) {
                        Object.keys(newExpense[key]).forEach((innerKey) => {
                            newExpenseData[innerKey] = newExpense[key][innerKey];
                        });
                    } else {
                        newExpenseData[key] = newExpense[key];
                    }
                });
                console.log(newExpenseData, "inside || newExpenseData");
                const formattedDate = newExpenseData?.travel_date || newExpenseData?.lodging_date || newExpenseData?.meal_date
                    ? new Date(newExpenseData?.travel_date || newExpenseData?.lodging_date || newExpenseData?.meal_date).toLocaleDateString()
                    : null;
                const transport = newExpenseData?.mode_of_transport || newExpenseData?.hotel_name;
                const amount = newExpenseData?.amount ? `$${newExpenseData.amount}` : `$${newExpenseData.amount}`;
                const documents = newExpenseData?.documents || [];
                return {
                    id: newExpenseData?.id,
                    type: newExpenseData?.type,
                    date: formattedDate,
                    transport: transport,
                    amount: amount,
                    document: documents,
                };
            });
            const groupedByType = newExpenses.reduce((acc, expense) => {
                const { type } = expense;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(expense);
                return acc;
            }, {});
            setAllExpenses(groupedByType);
        } else {
            console.log("Processed data is not in the expected format or is empty:", processedData);
        }
    }, [processedData]);
    const getData = () => {
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
    if (status == '' || CMECEExpensReducer.status != status) {
        switch (CMECEExpensReducer.status) {
            case 'Expenses/AddExpensesRequest':
                status = CMECEExpensReducer.status;
                setCloseaction(false);
                break;
            case 'Expenses/AddExpensesSuccess':
                status = CMECEExpensReducer.status;
                setCloseaction(true);
                console.log(CMECEExpensReducer?.AddExpensesResponse?.allowance_data, "cmeceexpense------");
                const newExpense = CMECEExpensReducer?.AddExpensesResponse?.allowance_data;
                if (newExpense && maindata[0]?.type !== "Registration Fees") {
                    const newExpenseData = {};
                    Object.keys(newExpense).forEach(key => {
                        if (key == 'field_data' && newExpense[key]) {
                            Object.keys(newExpense[key]).forEach(innerKey => {
                                newExpenseData[innerKey] = newExpense[key][innerKey];
                            });
                        } else {
                            newExpenseData[key] = newExpense[key];
                        }
                    });

                    const formattedDate = newExpenseData?.travel_date || newExpenseData?.lodging_date || newExpenseData?.meal_date
                        ? new Date(newExpenseData?.travel_date || newExpenseData?.lodging_date || newExpenseData?.meal_date).toLocaleDateString()
                        : '';
                    const transport = newExpenseData?.mode_of_transport || newExpenseData?.hotel_name;
                    setLoadingamount('');
                    setLoadingdate('');
                    setTraveltake('');
                    setProfilePicObj1("");
                    setCdate("");

                    setAllExpenses((prevExpenses) => {
                        const updatedExpenses = { ...prevExpenses };
                        const expenseType = newExpenseData?.type || 'default';
                        if (!updatedExpenses[expenseType]) {
                            updatedExpenses[expenseType] = [];
                        }
                        updatedExpenses[expenseType].push({
                            id: newExpenseData?.id,
                            type: newExpenseData?.type,
                            date: formattedDate,
                            transport: transport,
                            amount: `$${newExpense.amount}`,
                            document: newExpense.documents,
                        });

                        return updatedExpenses;
                    });
                } else if (maindata[0]?.type == "Registration Fees") {
                    getData();
                    setTravelmodal(!travelmodal);
                }
                break;
            case 'Expenses/AddExpensesFailure':
                status = CMECEExpensReducer.status;
                setCloseaction(false);
                break;
            case 'Expenses/deleteExpensesRequest':
                status = CMECEExpensReducer.status;
                setCloseaction(false);
                break;
            case 'Expenses/deleteExpensesSuccess':
                status = CMECEExpensReducer.status;
                setCloseaction(true);
                break;
            case 'Expenses/deleteExpensesFailure':
                status = CMECEExpensReducer.status;
                setCloseaction(false);
                break;
        }
    }

    const deleteExpense = (id) => {
        setAllExpenses((prevState) => {
            const updatedExpenses = { ...prevState };
            Object.keys(updatedExpenses).forEach((expenseType) => {
                updatedExpenses[expenseType] = updatedExpenses[expenseType].filter((expense) => expense.id !== id);
                if (updatedExpenses[expenseType].length == 0) {
                    delete updatedExpenses[expenseType];
                }
            });
            return updatedExpenses;
        });
        const obj = { "id": id };
        connectionrequest()
            .then(() => {
                dispatch(deleteExpensesRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    };
    useEffect(() => {
        const getField = (fielddrop) => {
            if (fielddrop && fielddrop.field_value) {
                const dropdownOptions = Object.values(fielddrop.field_value);
                setCmeact(dropdownOptions);
            }
        };
        if (Array.isArray(expensedate)) {
            expensedate.forEach(field => {
                if (field.field_type == 'Dropdown') {
                    getField(field);
                }
            });
        }
    }, [expensedate]);
    const validateExpenseFields = (expenseType) => {
        console.log(expenseType, "expenseType")
        const isValid = expenseType.every(field => {
            const { field_type, field_name } = field;
            if (field_type == "File") {
                return true;
            }
            switch (field_type) {
                case "Date Range":
                    if (!cdate) {
                        showErrorAlert('Please select date!');
                        return false;
                    }
                    break;
                case "Dropdown":
                    if (!traveltake) {
                        showErrorAlert("Please choose a travel mode!");
                        return false;
                    }
                    break;
                case "Number":
                    if (!loadingamount) {
                        showErrorAlert("Please enter an amount.");
                        return false;
                    }
                    break;
                case "Text":
                    if (!loadingdate) {
                        showErrorAlert(`Please fillup ${field_name}`);
                        return false;
                    }
                    break;
                default:
                    return false;
            }
            return true; // If field passes all validation
        });

        return isValid;
    };


    const renderFields = (fields) => {
        const fieldArray = Array.isArray(fields) ? fields : [];
        return fieldArray.map((field, index) => {
            const placeholderText = field.field_name;
            const fieldType = field.field_type;
            if (fieldType == "File") {
                return (
                    <View key={index} style={{ paddingHorizontal: normalize(17), paddingVertical: normalize(15) }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setCameraPicker(true);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16, fontFamily: Fonts.InterRegular,
                                        color: ProfilePicObj1
                                            ? Colorpath.ButtonColr
                                            : '#000000',
                                    }}
                                >
                                    {ProfilePicObj1
                                        ? ProfilePicObj1.uri
                                            ? ProfilePicObj1.uri
                                                .split('/')
                                                .pop()
                                                .replace(/-/g, '')
                                                .slice(-56)
                                            : ProfilePicObj1.split('/').pop()
                                        : 'Upload File'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 5,
                            }}
                        >
                            {Array.from({ length: 50 }).map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 4,
                                        height: 2,
                                        backgroundColor: '#000',
                                        borderRadius: 1,
                                        marginHorizontal: 0,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                );
            } else if (fieldType == "Date Range") {
                return (
                    <View key={index} style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(17), paddingVertical: normalize(5) }}>
                        <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}>
                            <TouchableOpacity onPress={() => setOpendate(true)}>
                                <CustomTextField
                                    value={cdate}
                                    color={"#000000"}
                                    alignSelf={'center'}
                                    borderRadius={normalize(9)}
                                    placeholder={placeholderText}
                                    placeholderTextColor={"#000000"}
                                    fontSize={16}
                                    rightIcon={CalenderIcon}
                                    rightIconName={"calendar"}
                                    rightIconSize={25}
                                    rightIconColor="#63748b"
                                    editable={false}
                                    fontFamily={Fonts.InterRegular}
                                    onRightIconPress={() => console.log("Date Picker Opened")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            } else if (fieldType == "Number") {
                return (
                    <View key={index} style={{ paddingHorizontal: normalize(16) }}>
                        <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}>
                            <TextInput
                                editable
                                maxLength={290}
                                onChangeText={(val) => setLoadingamount(val)}
                                value={loadingamount}
                                style={{
                                    height: normalize(35),
                                    width: normalize(290),
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: Fonts.InterRegular
                                }}
                                placeholder={placeholderText}
                                placeholderTextColor={"#000000"}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                );
            } else if (fieldType == "Text") {
                return (
                    <View key={index} style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(5) }}>
                        <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}>
                            <TextInput
                                editable
                                maxLength={290}
                                onChangeText={(val) => setLoadingdate(val)}
                                value={loadingdate}
                                style={{
                                    height: normalize(35),
                                    width: normalize(290),
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: Fonts.InterRegular
                                }}
                                placeholder={placeholderText}
                                placeholderTextColor={"#000000"}
                                keyboardType="default"
                            />
                        </View>
                    </View>
                );
            } else if (fieldType == "Dropdown") {
                return (
                    <View key={index} style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
                        <View
                            style={{
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                            }}>
                            <TouchableOpacity onPress={() => { setExpenspicker(true); }}>
                                <CustomTextField
                                    value={traveltake}
                                    color={"#000000"}
                                    height={normalize(30)}
                                    alignSelf={'center'}
                                    borderRadius={normalize(9)}
                                    placeholder={placeholderText}
                                    placeholderTextColor={"#000000"}
                                    fontSize={16}
                                    rightIcon={ArrowIcon}
                                    rightIconName={traveltake ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                                    rightIconSize={25}
                                    rightIconColor="#63748b"
                                    editable={false}
                                    fontFamily={Fonts.InterRegular}
                                    onRightIconPress={() => {
                                        setExpenspicker(true);
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
            return null;
        });
    };


    return (
        <>
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating={true}
                isVisible={travelmodal}
                style={{ width: '100%', alignSelf: 'center', margin: 0 }}
                animationInTiming={800}
                animationOutTiming={1000}
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                    <View style={[styles.modalView, { height: modalHeight }]}>
                        <ScrollView contentContainerStyle={{ backgroundColor: "#FFFFFF" }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={styles.modalIndicator} />
                            </View>
                            <View>
                                <View style={styles.container}>
                                    <View style={{ marginLeft: normalize(10) }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>{maindata?.type || maindata[0]?.type}</Text>
                                    </View>
                                    <TouchableOpacity style={{ marginRight: normalize(10) }} onPress={() => {
                                        if (closeaction) {
                                            getData();
                                            setTravelmodal(!travelmodal);
                                        } else {
                                            setTravelmodal(!travelmodal);
                                        }
                                    }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#666666" }}>{"Close"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignContent: "center" }}>
                                {maindata[0]?.type !== "Registration Fees" && renderFields(expensedate)}
                                {maindata[0]?.type == "Registration Fees" ? <View style={{ justifyContent: "center", alignContent: "center" }}>
                                    <View style={{ paddingHorizontal: normalize(17), paddingVertical: normalize(15) }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setCameraPicker(true);
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 14, fontFamily: Fonts.InterSemiBold,
                                                        color: ProfilePicObj1
                                                            ? Colorpath.ButtonColr
                                                            : '#000000',
                                                    }}
                                                >
                                                    {ProfilePicObj1
                                                        ? ProfilePicObj1.uri
                                                            ? ProfilePicObj1.uri
                                                                .split('/')
                                                                .pop()
                                                                .replace(/-/g, '')
                                                                .slice(-56)
                                                            : ProfilePicObj1.split('/').pop()
                                                        : 'Upload File'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginVertical: 5,
                                            }}
                                        >
                                            {Array.from({ length: 50 }).map((_, index) => (
                                                <View
                                                    key={index}
                                                    style={{
                                                        width: 4,
                                                        height: 2,
                                                        backgroundColor: '#000',
                                                        borderRadius: 1,
                                                        marginHorizontal: 0,
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: normalize(16) }}>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                            }}>
                                            <TextInput
                                                editable
                                                maxLength={290}
                                                onChangeText={(val) => setLoadingamount(val)}
                                                value={loadingamount}
                                                style={{ height: normalize(35), width: normalize(290), paddingVertical: 0, fontSize: 16, color: "#000000", fontFamily: Fonts.InterRegular }}
                                                placeholder="Amount"
                                                placeholderTextColor={"#000000"}
                                                keyboardType="default"
                                            />
                                        </View>
                                    </View>
                                    <Buttons
                                        onPress={() => { registaddExpe(); }}
                                        height={normalize(45)}
                                        width={normalize(295)}
                                        backgroundColor={Colorpath.ButtonColr}
                                        borderRadius={normalize(9)}
                                        text="Save"
                                        color={Colorpath.white}
                                        fontSize={18}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(30)}
                                    />

                                </View> : <TouchableOpacity onPress={() => { addExpens(); }} style={{ justifyContent: "flex-end", alignContent: "flex-end", alignSelf: "flex-end", width: "63%" }}>
                                    <Buttons
                                        onPress={() => { addExpens(); }}
                                        height={normalize(45)}
                                        width={normalize(170)}
                                        backgroundColor={Colorpath.white}
                                        borderRadius={normalize(9)}
                                        text="Save & Add more"
                                        color={Colorpath.ButtonColr}
                                        fontSize={16}
                                        fontFamily={Fonts.InterMedium}
                                        marginTop={normalize(10)}
                                        borderWidth={1}
                                        borderColor={Colorpath.ButtonColr}
                                    />
                                </TouchableOpacity>}
                                {maindata[0]?.type !== "Registration Fees" && Object.keys(allExpenses).map((category, categoryIndex) => {
                                    const expenses = allExpenses[category];
                                    if (Array.isArray(expenses) && expenses?.length > 0) {
                                        return (
                                            <View key={categoryIndex} style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000" }}>
                                                    {category}
                                                </Text>
                                                {expenses.map((expense, index) => (
                                                    <View key={index} style={{ margin: 5, paddingVertical: normalize(7), alignSelf: "center", backgroundColor: "#F7F7F7", borderColor: "#DDDDDD", borderWidth: 1 }}>
                                                        <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10), flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", height: normalize(70), width: normalize(286) }}>
                                                            <View style={{ flexDirection: "column", gap: 10 }}>
                                                                {expense?.transport && <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{expense?.transport}</Text>}
                                                                {expense?.date && <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{expense?.date}</Text>}
                                                                {expense?.document && <Text numberOfLines={1} style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000000" }}>
                                                                    {typeof expense?.document == "string" && expense?.document?.length > 0
                                                                        ? (() => {
                                                                            const fileName = expense.document.split('/').pop(); 
                                                                            const fileExtension = fileName?.split('.').pop(); 
                                                                            const supportedExtensions = ["pdf", "png", "jpg"]; 
                                                                            if (fileName && supportedExtensions.includes(fileExtension.toLowerCase())) {
                                                                                return `${fileName.slice(0, 15)}.${fileExtension}`;
                                                                            }
                                                                            return `${fileName?.slice(0, 15)}.file`; // Fallback for unsupported types
                                                                        })()
                                                                        : null}
                                                                </Text>}
                                                            </View>
                                                            {expense?.amount && <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{`${expense?.amount}`}</Text>}
                                                            <View style={{ height: normalize(50), width: 1, backgroundColor: "#DDDDDD" }} />
                                                            <View style={{ flexDirection: "column", gap: 10 }}>
                                                                <TouchableOpacity>
                                                                    <Image source={Imagepath.ExpnsEdit} style={{ height: normalize(17), width: normalize(17), resizeMode: "contain", tintColor: "#1C1C1C" }} />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => deleteExpense(expense?.id)}>
                                                                    <PlusIcn name="delete" size={25} color={"#000000"} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <View key={categoryIndex} style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000" }}>
                                                    No {category} available
                                                </Text>
                                            </View>
                                        );
                                    }
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
                <CameraPicker
                    notshowscan={notshowscan}
                    setnNotshowscan={setnNotshowscan}
                    cropping={true}
                    pickerVisible={cameraPicker}
                    onBackdropPress={() => setCameraPicker(false)}
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

                {cmeact && <TravelMode
                    expenspicker={expenspicker}
                    setExpenspicker={setExpenspicker}
                    dommyData={cmeact}
                    traveltake={traveltake}
                    setTraveltake={setTraveltake} />}
            </Modal>
            <DateTimePickerModal
                isVisible={opendate}
                mode="date"
                maximumDate={new Date()}
                onConfirm={val => {
                    setCdate(moment(val).format('YYYY-MM-DDTHH:mm:ss.sssZ'));
                    setOpendate(false);
                }}
                onCancel={() => setOpendate(false)}
                textColor="black"
            />

        </>
    )
}

export default Dynamicmodal
const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
    modalView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: normalize(20),
        borderTopLeftRadius: normalize(20),
        paddingVertical: normalize(10),
    },
    modalIndicator: {
        height: 6,
        width: normalize(70),
        backgroundColor: "#DDDDDD",
        borderRadius: normalize(8),
    },
});