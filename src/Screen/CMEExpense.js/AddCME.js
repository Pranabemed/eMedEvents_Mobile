import { View, Text, Platform, Animated, Easing, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts';
import PlusIcn from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Imagepath from '../../Themes/Imagepath';
import CameraPicker from '../../Components/CameraPicker';
import { useDispatch, useSelector } from 'react-redux';
import { AddExpensesRequest } from '../../Redux/Reducers/CMECEExpensReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import moment from 'moment';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const AddCME = (props) => {
    const CMECEExpensReducer = useSelector(state => state.CMECEExpensReducer);
    const dispatch = useDispatch();
    const [expenses, setExpenses] = useState("");
    const [isfilterVisible, setIsfilterVisible] = useState(false);
    const [travelmodal, setTravelmodal] = useState(false);
    const [modalHeight, setModalHeight] = useState(300);
    const [expensedate, setExpensedate] = useState("");
    const [loadingdate, setLoadingdate] = useState("");
    const [loadingamount, setLoadingamount] = useState("");
    console.log(setExpenses, "setExpenses")
    const [expenspicker, setExpenspicker] = useState(false);
    const [cmeact, setCmeact] = useState("");
    const [examount, setExamount] = useState("");
    const [cameraPicker, setCameraPicker] = useState(false);
    const [ProfilePicObj1, setProfilePicObj1] = useState("");
    const [ProfilePicUri1, setProfilePicUri1] = useState('');
    const [notshowscan, setnNotshowscan] = useState(false);
    const [allExpenses, setAllExpenses] = useState({ expenses: [] });
    const profileBack = () => {
        props.navigation.goBack();
    }
    const addExpens = () => {
        let obj = new FormData();
        const dynamicFieldData = {
            travel_date: new Date().toLocaleDateString('en-CA'),
            mode_of_transport: "Airfare",
        };
        obj.append("id", "122");
        obj.append("type", "Travel Expenses");
        obj.append("course_title", "Oxygen");
        obj.append("in_person", 1);
        obj.append("field_data", JSON.stringify(dynamicFieldData));
        obj.append("amount", 2000);
        obj.append("document[]", ProfilePicObj1);
        console.log(obj, "add credits");
        connectionrequest()
            .then(() => {
                dispatch(AddExpensesRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err);
            });
    };

    useEffect(() => {
        setModalHeight(isfilterVisible || travelmodal ? 500 : 300);
    }, [isfilterVisible, travelmodal]);
  console.log(props?.route?.params?.newjson,"props?.route?.params?.newjson=======")
  useEffect(() => {
    // Fetch new expenses when the component loads
    if (props?.route?.params?.newjson && props?.route?.params?.newjson.length > 0) {
        setAllExpenses((prevExpenses) => {
            const existingExpenses = prevExpenses.expenses;
            const updatedExpenses = [
                ...existingExpenses,
                ...props?.route?.params?.newjson.map((newExpense) => ({
                    id: newExpense.id,
                    type: newExpense.type,
                    date: new Date(newExpense.field_data.travel_date).toLocaleDateString(),
                    transport: newExpense.field_data.mode_of_transport,
                    amount: `$${newExpense.amount}`,
                    document: newExpense.documents,
                }))
            ];

            return {
                ...prevExpenses,
                expenses: updatedExpenses,
            };
        });
    }
}, [props?.route?.params?.newjson]);



    if (status == '' || CMECEExpensReducer.status != status) {
        switch (CMECEExpensReducer.status) {
            case 'Expenses/AddExpensesRequest':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/AddExpensesSuccess':
                status = CMECEExpensReducer.status;
                console.log(CMECEExpensReducer?.AddExpensesResponse?.allowance_data, "cmeceexpense------");
                const newExpense = CMECEExpensReducer?.AddExpensesResponse?.allowance_data;
                if (newExpense) {
                    setAllExpenses((prevExpenses) => ({
                        ...prevExpenses,
                        expenses: [...prevExpenses.expenses, {
                            id: newExpense.id,
                            type: newExpense.type,
                            date: new Date(newExpense.field_data.travel_date).toLocaleDateString(),
                            transport: newExpense.field_data.mode_of_transport,
                            amount: `$${newExpense.amount}`,
                            document: newExpense.documents,
                        }],
                    }));
                }
                break;
            case 'Expenses/AddExpensesFailure':
                status = CMECEExpensReducer.status;
                break;
        }
    }
    console.log(allExpenses,"allExpenses");
    const expenseData = [{ id: 0, name: "Registration Fee" }, { od: 1, name: "Travel" }, { id: 2, name: "Lodging" }, { id: 3, name: "Meals" }, { id: 4, name: "Others" }];
    const expenseType = ({ item, index }) => {
        return (
            <View style={{ paddingHorizontal: normalize(5) }}>
                <TouchableOpacity onPress={() => {
                    if (index == 0) {
                        setIsfilterVisible(!isfilterVisible);
                    } else {
                        setTravelmodal(!travelmodal)
                    }
                }}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: 5,
                        backgroundColor: "#FFFFFF",
                        padding: normalize(10),
                        borderWidth: 1,
                        borderColor: "#DDDDDD",
                        borderRadius: normalize(10),
                    }}
                >
                    <PlusIcn
                        name="plus"
                        size={25}
                        color={"#000000"}
                        style={{ marginRight: normalize(7) }}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: "#000000",
                        }}
                    >
                        {item?.name}
                    </Text>
                </TouchableOpacity>
            </View>

        )
    }
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const deleteExpense = (id) => {
        setAllExpenses((prevState) => ({
          ...prevState,
          expenses: prevState.expenses.filter((expense) => expense.id !== id),
        }));
      };
    useEffect(() => {
        const targetImg = cmeact ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: cmeact ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cmeact]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Add CME/CE Activities"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="Add CME/CE Activities"
                            onBackPress={profileBack}
                        />

                    )}
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                            marginTop: normalize(5)
                        }}>
                        <TouchableOpacity onPress={() => {
                            setExpenspicker(!expenspicker);
                        }}>
                            <CustomTextField
                                value={expenses}
                                // onChangeText={setStatecourse}
                                color={"#000000"}
                                height={normalize(50)}
                                width={normalize(300)}
                                backgroundColor={Colorpath.Pagebg}
                                alignSelf={'center'}
                                placeholder={'Choose expense category*'}
                                placeholderTextColor="#000000"
                                fontSize={16}
                                fontFamily={Fonts.InterRegular}
                                rightIcon={ArrowIcon}
                                rightIconName={expenses ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                rightIconSize={25}
                                rightIconColor="#63748b"
                                editable={false}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(9), paddingVertical: normalize(10) }}>
                    <Animated.View style={{ opacity: animatedValuesemail, transform: [{ scale: scaleValuesemail }] }}>
                        {cmeact ? (
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000", marginLeft: normalize(0) }}>
                                    {"CME/CE activity*"}
                                </Text>
                            </View>
                        ) : null}
                    </Animated.View>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                        }}>
                        <TextInput
                            editable
                            maxLength={290}
                            onChangeText={(val) => setCmeact(val)}
                            value={cmeact}
                            style={{ height: normalize(35), width: normalize(290), paddingVertical: 0, fontSize: 16, color: "#000000", fontFamily: Fonts.InterRegular }}
                            placeholder="CME/CE activity*"
                            placeholderTextColor={"#AAAAAA"}
                            keyboardType="default"
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>{"Select type of expense"}</Text>
                </View>
                <View style={{ marginLeft: normalize(9), height: 0.8, width: normalize(303), backgroundColor: "#DDDDDD" }} />
                <View>
                    <FlatList
                        numColumns={2}
                        data={expenseData}
                        renderItem={expenseType}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    backdropTransitionOutTiming={0}
                    hideModalContentWhileAnimating={true}
                    isVisible={isfilterVisible}
                    style={{ width: '100%', alignSelf: 'center', margin: 0 }}
                    animationInTiming={800}
                    animationOutTiming={1000}
                >
                    <View style={[styles.modalView, { height: modalHeight }]}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={styles.modalIndicator} />
                        </View>
                        <View>
                            <View style={styles.container}>
                                <View style={{ marginLeft: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>{"Registration Fee"}</Text>
                                </View>
                                <TouchableOpacity style={{ marginRight: normalize(10) }} onPress={() => { setIsfilterVisible(!isfilterVisible) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#666666" }}>{"Close"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ justifyContent: "center", alignContent: "center" }}>
                            <View style={{ paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <TouchableOpacity style={{ margin: 2 }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 14,
                                                color: "#000000"
                                            }}
                                        >
                                            {"Upload File"}
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
                            <View style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(17) }}>
                                <View
                                    style={{
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.5,
                                    }}>
                                    <TouchableOpacity>
                                        <CustomTextField
                                            value={expensedate}
                                            color={"#000000"}
                                            alignSelf={'center'}
                                            borderRadius={normalize(9)}
                                            placeholder={'Registration Date'}
                                            placeholderTextColor={"#000000"}
                                            fontSize={16}
                                            rightIcon={CalenderIcon}
                                            rightIconName={"calendar"}
                                            rightIconSize={25}
                                            rightIconColor="#63748b"
                                            editable={false}
                                            fontFamily={Fonts.InterRegular}
                                            onRightIconPress={() => {
                                                console.log("hdfjsfhjh")
                                            }}

                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.5,
                                    }}>
                                    <TextInput
                                        editable
                                        maxLength={290}
                                        onChangeText={(val) => setExamount(val)}
                                        value={examount}
                                        style={{ height: normalize(35), width: normalize(290), paddingVertical: 0, fontSize: 16, color: "#000000", fontFamily: Fonts.InterRegular }}
                                        placeholder="Amount"
                                        placeholderTextColor={"#000000"}
                                        keyboardType="default"
                                    />
                                </View>
                            </View>
                            <Buttons
                                onPress={() => { console.log("helll") }}
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

                        </View>
                    </View>
                </Modal>
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
                    
                    <View style={[styles.modalView, { height: modalHeight }]}>
                    <ScrollView contentContainerStyle={{backgroundColor:"#FFFFFF"}}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <View style={styles.modalIndicator} />
                        </View>
                        <View>
                            <View style={styles.container}>
                                <View style={{ marginLeft: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>{"Lodging Expenses"}</Text>
                                </View>
                                <TouchableOpacity style={{ marginRight: normalize(10) }} onPress={() => { setTravelmodal(!travelmodal) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#666666" }}>{"Close"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ justifyContent: "center", alignContent: "center" }}>
                            <View style={{ paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
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
                                            style={[
                                                styles.uploadText,
                                                {
                                                    color: ProfilePicObj1
                                                        ? Colorpath.ButtonColr
                                                        : 'RGB(170, 170, 170)',
                                                },
                                            ]}
                                        >
                                            {ProfilePicObj1
                                                ? ProfilePicObj1.uri
                                                    ? ProfilePicObj1.uri
                                                        .split('/')
                                                        .pop()
                                                        .replace(/-/g, '')
                                                        .slice(-56)
                                                    : ProfilePicObj1.split('/').pop()
                                                : 'Upload File*'}
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
                            <View style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(17) }}>
                                <View
                                    style={{
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.5,
                                    }}>
                                    <TouchableOpacity>
                                        <CustomTextField
                                            value={loadingdate}
                                            color={"#000000"}
                                            alignSelf={'center'}
                                            borderRadius={normalize(9)}
                                            placeholder={'Registration Date'}
                                            placeholderTextColor={"#000000"}
                                            fontSize={16}
                                            rightIcon={CalenderIcon}
                                            rightIconName={"calendar"}
                                            rightIconSize={25}
                                            rightIconColor="#63748b"
                                            editable={false}
                                            fontFamily={Fonts.InterRegular}
                                            onRightIconPress={() => {
                                                console.log("hdfjsfhjh")
                                            }}

                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
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
                            <View style={{ justifyContent: "flex-end", alignContent: "flex-end", alignSelf: "flex-end", width: "63%" }}>
                                <Buttons
                                    onPress={() => { addExpens() }}
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
                            </View>
                            {allExpenses.expenses.map((expense, index) => (
                                  <View key={index} style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10)}}>
                                  <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000" }}>{"Expenses Details"}</Text>
                                  <View style={{ paddingVertical: normalize(7),alignSelf:"center"}}>
                                      <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10), flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", height: normalize(70), width: normalize(286), borderWidth: 1, borderColor: "#DDDDDD" }}>
                                          <View style={{ flexDirection: "column", gap: 10 }}>
                                              <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{expense?.date}</Text>
                                              <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000000" }}>{expense?.document?.split(10)}</Text>
                                          </View>
                                          <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{`${expense?.amount}`}</Text>
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
                              </View>
                            ))}
                          
                        </View>
                    </ScrollView>
                    </View>
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
                </Modal>

            </SafeAreaView>
        </>
    )
}

export default AddCME
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