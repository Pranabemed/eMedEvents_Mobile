import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import CustomTextField from '../../Components/CustomTextfiled';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CalenderIcon from 'react-native-vector-icons/Feather';
import TimeIcon from 'react-native-vector-icons/Ionicons';
import CustomRadioButtons from '../../Components/CustomRadio';
import CustomInputWithDropdown from '../../Components/CustomTextInput';
import TickMark from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { CMEPlannerEditRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
const ScheduleCourse = ({ isfilterVisible, onfilterFalse, onSave, selectedItem, setSelectedItem }) => {
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    console.log(selectedItem, CMEReducer,"selectedItem==========")
    const dataAvail = [
        { id: 0, name: "Once" },
        { id: 1, name: "Daily" },
        { id: 2, name: "Weekly" },
    ];
    const durationData = [
        { id: 0, name: "15min" },
        { id: 1, name: "30min" },
        { id: 2, name: "45min" },
        { id: 3, name: "60min" },
        { id: 4, name: "Custom" }
    ];
    const weekDays = [
        { id: 0, name: "Sun" },
        { id: 1, name: "Mon" },
        { id: 2, name: "Tue" },
        { id: 3, name: "Wed" },
        { id: 4, name: "Thu" },
        { id: 5, name: "Fri" },
        { id: 6, name: "Sat" }
    ]
    const [modalHeight, setModalHeight] = useState(300);
    const [selectedState, setSelectedState] = useState("Once");
    const [durationset, setDurationset] = useState("15min");
    const [timeduation, setTimeduartion] = useState("")
    const [selectdate, setSelectdate] = useState("Start Date*");
    const [selectenddate, setSelectenddate] = useState("");
    const [opendate, setOpendate] = useState(false);
    const [enddate, setEnddate] = useState(false);
    const [selectdatetime, setSelectdatetime] = useState("");
    const [opendatetime, setOpendatetime] = useState(false);
    const [remind, setRemind] = useState("");
    const [durationsdata, setDurationsdata] = useState("");
    const [weekname, setWeekname] = useState("");
    const [frequency, setFrequency] = useState("");
    const [inputdata, setInputdata] = useState("");
    const [texdt, setTextdt] = useState("")
    useEffect(() => {
        setModalHeight(isfilterVisible ? 600 : 300);
    }, [isfilterVisible]);

    const pendingshow = (index) => {
        const selectedName = dataAvail[index].name;
        setSelectedState(selectedName);
    };
    const duartionshow = (index) => {
        const selectedTime = durationData[index].name;
        setDurationset(selectedTime);
    };
    const options = [
        { id: 1, label: 'Notification' },
        { id: 2, label: 'Email' },
    ];

    const handleSelect = (option) => {
        setRemind(option);
        console.log('Selected option:', option);
    };

    const toggleWeekSelection = (item) => {
        if (weekname.includes(item.name)) {
            setWeekname(weekname.filter(week => week !== item.name));
        } else {
            setWeekname([...weekname, item.name]);
        }
    };
    console.log(texdt, inputdata,frequency,weekname, "weekname============")
    const PlannowHandle = () => {
        let obj = {
            "id": selectedItem?.id,
            "conference_id": selectedItem?.confid,
            "frequency": selectedState,
            "start_date": selectenddate,
            "end_date": selectenddate,
            "time": selectdatetime,
            "duration": durationsdata?.id === 4 ? timeduation : durationsdata?.name,
            "week_days": "",
            "reminder_type": remind?.label,
            "reminder_before": texdt,
            "reminder_before_type": inputdata
        }
        connectionrequest()
        .then(()=>{
            dispatch(CMEPlannerEditRequest(obj))
        })
        .catch((err)=>{
            showErrorAlert("Please connect to internet",err)
        })
    }
    const stateDataFilter = ({ item, index }) => {
        const isSelected = selectedState === item.name;
        return (
            <TouchableOpacity
                onPress={() => {
                    pendingshow(index);
                    setFrequency(item);
                    setDurationsdata("15min");
                    setSelectdate(item?.name);
                }}
                style={{
                    paddingHorizontal: normalize(12),
                    paddingVertical: normalize(10),
                    borderWidth: 0.5,
                    borderColor: "#AAAAAA",
                    borderRadius: normalize(25),
                    backgroundColor: isSelected ? Colorpath.ButtonColr : "#FFFFFF",
                    margin: normalize(5),
                    alignSelf: 'flex-start'
                }}
            >
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: isSelected ? Colorpath.white : "#333333" }}>
                    {item?.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const durationFilter = ({ item, index }) => {
        const duartionisset = durationset === item.name;
        return (
            <TouchableOpacity
                onPress={() => {
                    duartionshow(index);
                    setDurationsdata(item);
                }}
                style={{
                    paddingHorizontal: normalize(9),
                    paddingVertical: normalize(9),
                    borderWidth: 0.5,
                    borderColor: "#AAAAAA",
                    borderRadius: normalize(20),
                    backgroundColor: duartionisset ? Colorpath.ButtonColr : "#FFFFFF",
                    margin: normalize(3),
                    alignSelf: 'flex-start'
                }}
            >
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: duartionisset ? Colorpath.white : "#333333" }}>
                    {item?.name}
                </Text>
            </TouchableOpacity>
        );
    };
    const weekFilter = ({ item, index }) => {
        const isSelectedWeek = weekname.includes(item.name);
        return (
            <TouchableOpacity onPress={() => { toggleWeekSelection(item); }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row", marginLeft: normalize(10) }}>
                        <TouchableOpacity onPress={() => { toggleWeekSelection(item); }}>
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: isSelectedWeek ? Colorpath.ButtonColr : 'transparent',
                                borderColor: isSelectedWeek ? Colorpath.ButtonColr : Colorpath.black,
                                height: normalize(17),
                                width: normalize(17),
                                borderRadius: normalize(5),
                                borderWidth: normalize(0.5)
                            }}>
                                {isSelectedWeek && <TickMark name="checkmark" color={Colorpath.white} size={17} />}
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", paddingHorizontal: normalize(4) }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#666666" }}>
                                {item?.name}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
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
                        <Buttons
                            onPress={() => { onfilterFalse(); }}
                            height={normalize(45)}
                            width={normalize(110)}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Plan Activity"
                            color={"#000000"}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            fontWeight={"bold"}
                        />
                        <Buttons
                            onPress={() => {
                                onSave();
                                onfilterFalse();
                            }}
                            height={normalize(45)}
                            width={normalize(110)}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Close"
                            color={"#666666"}
                            fontSize={16}
                            fontFamily={Fonts.InterMedium}
                            fontWeight={"bold"}
                            disabled={false}
                        />
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(0) }}>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16, color: "#333"
                            }}>
                                {"Frequency"}
                            </Text>
                        </View>
                        <View style={styles.container}>
                            <FlatList
                                data={dataAvail}
                                numColumns={3}
                                renderItem={stateDataFilter}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(0) }}>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16, color: "#333"
                            }}>
                                {"Start Date"}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setOpendate(!opendate)} style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <CustomTextField
                                    value={selectdate}
                                    color={"#000000"}
                                    height={normalize(50)}
                                    width={normalize(300)}
                                    backgroundColor={Colorpath.white}
                                    alignSelf={'center'}
                                    borderRadius={normalize(9)}
                                    placeholder={'Start Date*'}
                                    placeholderTextColor={"RGB( 170, 170, 170 )"}
                                    fontSize={normalize(12)}
                                    marginTop={normalize(10)}
                                    autoCapitalize="none"
                                    keyboardType='default'
                                    borderWidth={1}
                                    borderColor={"#DDDDDD"}
                                    rightIcon={CalenderIcon}
                                    rightIconName={"calendar"}
                                    rightIconSize={25}
                                    rightIconColor="#63748b"
                                    editable={false}
                                    onRightIconPress={() => { setOpendate(!opendate) }}
                                />
                            </TouchableOpacity>
                        </View>

                        {frequency?.id == 1 || frequency?.id == 2 ? (
                            <>
                                <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(4) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16, color: "#333"
                                    }}>
                                        {"End Date"}
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => setEnddate(!enddate)} style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <CustomTextField
                                            value={selectenddate}
                                            color={"#000000"}
                                            height={normalize(50)}
                                            width={normalize(300)}
                                            backgroundColor={Colorpath.white}
                                            alignSelf={'center'}
                                            borderRadius={normalize(9)}
                                            placeholder={'End Date*'}
                                            placeholderTextColor={"RGB( 170, 170, 170 )"}
                                            fontSize={normalize(12)}
                                            marginTop={normalize(10)}
                                            autoCapitalize="none"
                                            keyboardType='default'
                                            borderWidth={1}
                                            borderColor={"#DDDDDD"}
                                            rightIcon={CalenderIcon}
                                            rightIconName={"calendar"}
                                            rightIconSize={25}
                                            rightIconColor="#63748b"
                                            editable={false}
                                            onRightIconPress={() => { setEnddate(!enddate) }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : null}

                        {selectdate == selectenddate && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "red" }}>{"Start date & end date should not be same !!"}</Text>
                        </View>}

                        {frequency?.id == 2 ? (
                            <>
                                <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16, color: "#333"
                                    }}>
                                        {"Weekdays"}
                                    </Text>
                                </View>
                                <View>
                                    <FlatList
                                        data={weekDays}
                                        renderItem={weekFilter}
                                        keyExtractor={(item, index) => index.toString()}
                                        numColumns={4}
                                        columnWrapperStyle={{
                                            justifyContent: 'flex-start',
                                            marginBottom: normalize(10)
                                        }}
                                        contentContainerStyle={{ paddingHorizontal: normalize(10) }}
                                    />
                                </View>
                            </>
                        ) : null}

                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16, color: "#333"
                            }}>
                                {"Time"}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setOpendatetime(!opendatetime)} style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <CustomTextField
                                    value={selectdatetime}
                                    color={"#000000"}
                                    height={normalize(50)}
                                    width={normalize(300)}
                                    backgroundColor={Colorpath.white}
                                    alignSelf={'center'}
                                    borderRadius={normalize(9)}
                                    placeholder={'Time*'}
                                    placeholderTextColor={"RGB( 170, 170, 170 )"}
                                    fontSize={normalize(12)}
                                    marginTop={normalize(0)}
                                    autoCapitalize="none"
                                    keyboardType='default'
                                    borderWidth={1}
                                    borderColor={"#DDDDDD"}
                                    rightIcon={TimeIcon}
                                    rightIconName={"time-outline"}
                                    rightIconSize={25}
                                    rightIconColor="#63748b"
                                    editable={false}
                                    onRightIconPress={() => { setOpendatetime(!opendatetime) }}
                                />
                            </TouchableOpacity>
                        </View>


                        {frequency?.id == 1 || frequency?.id == 2 ? (
                            <>
                                <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16, color: "#333"
                                    }}>
                                        {"Duration"}
                                    </Text>
                                </View>
                                <View>
                                    <FlatList
                                        data={durationData}
                                        numColumns={5}
                                        renderItem={durationFilter}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </>
                        ) : null}

                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            {durationsdata?.id === 4 && (<TextInput
                                style={styles.textInput}
                                placeholder="Enter duration in min"
                                keyboardType="phone-pad"
                                maxLength={3}
                                value={timeduation}
                                onChangeText={(val) => { setTimeduartion(val) }}
                            />)}
                        </View>

                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16, color: "#333"
                            }}>
                                {"Reminder"}
                            </Text>
                        </View>
                        <View style={{ paddingVertical: 0, paddingHorizontal: normalize(10) }}>
                            <CustomRadioButtons options={options} onSelect={handleSelect} />
                        </View>
                        {remind && (<View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: normalize(10), paddingVertical: normalize(5) }}>
                            <CustomInputWithDropdown texdt={texdt} setTextdt={setTextdt} inputdata={inputdata} setInputdata={setInputdata} />
                        </View>)}
                        <View style={{ paddingVertical: normalize(10) }}>
                            <Buttons
                                onPress={() => {
                                    onfilterFalse();
                                    PlannowHandle();
                                }}
                                height={normalize(45)}
                                width={normalize(298)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text="Save"
                                color={"#fff"}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                fontWeight={"bold"}
                            />
                        </View>
                        <DateTimePickerModal
                            isVisible={enddate}
                            mode="date"
                            minimumDate={new Date()}
                            onConfirm={val => {
                                setSelectenddate(moment(val).format('YYYY-MM-DD'));
                                setEnddate(false);
                            }}
                            onCancel={() => setEnddate(false)}
                            textColor="black"
                        />
                        <DateTimePickerModal
                            isVisible={opendate}
                            mode="date"
                            maximumDate={new Date()}
                            onConfirm={val => {
                                setSelectdate(moment(val).format('YYYY-MM-DD'));
                                setOpendate(false);
                            }}
                            onCancel={() => setOpendate(false)}
                            textColor="black"
                        />
                        <DateTimePickerModal
                            isVisible={opendatetime}
                            mode="time"
                            maximumDate={new Date()}
                            onConfirm={val => {
                                setSelectdatetime(moment(val).format('hh:mm:mm'));
                                setOpendatetime(false);
                            }}
                            onCancel={() => setOpendatetime(false)}
                            textColor="black"
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ScheduleCourse;

const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
    buttonContainer: {
        flexDirection: "row",
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(5),
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
        height: 10,
        width: normalize(100),
        backgroundColor: "#DDDDDD",
        borderRadius: normalize(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
    },
    image: {
        height: normalize(20),
        width: normalize(20),
        resizeMode: 'contain',
    },
    title: {
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        color: Colorpath.ButtonColr,
        marginLeft: normalize(5),
    },
    description: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: "#000000",
        lineHeight: 20,
    },
    textInput: {
        height: normalize(50),
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        paddingLeft: 10,
        width: normalize(145),
        borderRadius: 10,
        color: '#000000',
        fontSize: 14,
        fontFamily: Fonts.InterSemiBold,
    },
});
