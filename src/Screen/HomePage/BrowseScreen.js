import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, TextInput, KeyboardAvoidingView, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { useIsFocused } from '@react-navigation/native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { BrowseSpecialtyRequest } from '../../Redux/Reducers/BrowsReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import moment from 'moment';
import Loader from '../../Utils/Helpers/Loader';
import CustomFlatList from '../../Utils/Helpers/CustomFlat';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const monthNames = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
};
const BrowseScreen = (props) => {
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemsyr, setSelectedItemsyr] = useState([]);
    const [alphabetItems, setAlphabetItems] = useState([]);
    const [browseSpe, setBrowseSpe] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);
    const FilterBack = () => {
        props.navigation.goBack();
    };
    const isFocus = useIsFocused();
    const dispatch = useDispatch();
    const BrowsReducer = useSelector(state => state.BrowsReducer);
    useEffect(() => {
        setShowLoader(false);
        setSelectedFilter(props?.route?.params?.highText?.highText ? props?.route?.params?.highText?.highText : 'Specialty');
        const getDate = new Date();
        setSelectedYear(moment(getDate, "YYYY-MM-DD").format("YYYY"));
        const formattedYear = moment(getDate, "YYYY-MM-DD").format("YYYY");
        const newYearObject = { year: formattedYear };
        setSelectedItemsyr(prevState => [...prevState, newYearObject]);
    }, [isFocus, props?.route?.params])
    useEffect(() => {
        if (selectedFilter) {
            setSearch("");
            let obj = {
                "apikey": selectedFilter == 'Month-Year' ? "monthYear" : selectedFilter,
                "appurl": {}
            }
            connectionrequest()
                .then(() => {
                    dispatch(BrowseSpecialtyRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [selectedFilter])
    console.log(props?.route?.params, "fkghjkfhjk-----------", selectedFilter)
    if (status == '' || BrowsReducer.status != status) {
        switch (BrowsReducer.status) {
            case 'Browse/BrowseSpecialtyRequest':
                status = BrowsReducer.status;
                break;
            case 'Browse/BrowseSpecialtySuccess':
                status = BrowsReducer.status;
                setBrowseSpe(BrowsReducer?.BrowseSpecialtyResponse);
                break;
            case 'Browse/BrowseSpecialtyFailure':
                status = BrowsReducer.status;
                break;
        }
    }
    const filters = [
        'Profession',
        'Specialty',
        'Topic',
        'Country',
        'State',
        'City',
        'Month-Year',
    ];
    const [alphabetdata, setAlphabetData] = useState({});
    const [filteredProfessions, setFilteredProfessions] = useState([]);
    const [alphabetlisting, setAlphabetListing] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [futureConferences, setFutureConferences] = useState({})
    const [selectedYear, setSelectedYear] = useState("");
    const flatListRef = useRef(null);

    useEffect(() => {
        // Scroll to top when selected list changes or data changes
        if (flatListRef.current && combinedData?.length > 0) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
    }, [selectedFilter, combinedData]);
    const processAlphabetData = (specialties) => {
        const tempAlphabetData = {};
        specialties.forEach((specialty) => {
            if (specialty.name) {
                const firstLetter = specialty.name[0].toUpperCase();
                if (!tempAlphabetData[firstLetter]) {
                    tempAlphabetData[firstLetter] = [];
                }
                tempAlphabetData[firstLetter].push({
                    name: specialty.name,
                    url: specialty.url,
                    count: specialty.count,
                });
            }
        });
        setAlphabetData(tempAlphabetData);
        const sortedAlphabetKeys = Object.keys(tempAlphabetData).sort();
        const sortedData = sortedAlphabetKeys.reduce((result, key) => {
            result[key] = tempAlphabetData[key].sort((a, b) => a.name.localeCompare(b.name));
            return result;
        }, {});
        const tempAlphabetListing = sortedAlphabetKeys.map((key) => ({
            key,
            data: sortedData[key],
        }));
        setAlphabetListing(tempAlphabetListing);
    };
    const processAlphabetStateData = (allStates) => {
        const tempAlphabetData = {};
        Object.entries(allStates).forEach(([country, states]) => {
            Object.entries(states).forEach(([stateName, stateData]) => {
                if (stateName) {
                    if (!tempAlphabetData[country]) {
                        tempAlphabetData[country] = [];
                    }

                    tempAlphabetData[country].push({
                        name: stateData.state_name,
                        url: stateData.url,
                        count: stateData.count,
                    });
                }
            });
        });
        const sortedCountryKeys = Object.keys(tempAlphabetData).sort();
        const sortedData = sortedCountryKeys.reduce((result, country) => {
            result[country] = tempAlphabetData[country];
            return result;
        }, {});
        const tempAlphabetListing = sortedCountryKeys.map((country) => ({
            key: country,
            data: tempAlphabetData[country],
        }));
        setAlphabetData(sortedData);
        setAlphabetListing(tempAlphabetListing);
    };
    const processAlphabeCityData = (allStates) => {
        const tempAlphabetData = {};

        Object.entries(allStates).forEach(([countryName, states]) => {
            if (!tempAlphabetData[countryName]) {
                tempAlphabetData[countryName] = [];
            }

            Object.entries(states).forEach(([stateName, cities]) => {
                Object.entries(cities).forEach(([cityName, cityData]) => {
                    if (cityName) {
                        tempAlphabetData[countryName].push({
                            name: `${stateName} [ ${cityName} (${cityData.doc_count}) ]`,
                            url: cityData.url,
                            count: cityData.doc_count,
                        });
                    }
                });
            });
        });

        const sortedCountryKeys = Object.keys(tempAlphabetData).sort();
        const sortedData = sortedCountryKeys.reduce((result, countryName) => {
            result[countryName] = tempAlphabetData[countryName];
            return result;
        }, {});

        const tempAlphabetListing = sortedCountryKeys.map((countryName) => ({
            key: countryName,
            data: tempAlphabetData[countryName],
        }));
        setAlphabetData(sortedData);
        setAlphabetListing(tempAlphabetListing);
    };
    const processAlphabetYear = (yearTake) => {
        const tempFutureConferences = {};

        // Group all "year"-based data
        yearTake.forEach((yearwiseshow) => {
            if (yearwiseshow.year) {
                if (!tempFutureConferences[yearwiseshow.year]) {
                    tempFutureConferences[yearwiseshow.year] = [];
                }
                tempFutureConferences[yearwiseshow.year].push({
                    month: yearwiseshow.month,
                    count: yearwiseshow.count,
                    url: yearwiseshow.url,
                });
            }
        });
        const browseYearListing = Object.keys(tempFutureConferences)
            .sort((a, b) => a - b)
            .map((year) => ({
                year,
            }));

        setAlphabetListing([
            {
                key: "Browse Year",
                data: browseYearListing,
            },
        ]);
        setFutureConferences(tempFutureConferences);
    };
    useEffect(() => {
        if (browseSpe?.allStates) {
            processAlphabetStateData(browseSpe?.allStates);
        }
    }, [browseSpe])
    useEffect(() => {
        if (browseSpe?.allCities) {
            processAlphabeCityData(browseSpe?.allCities);
        }
    }, [browseSpe])
    useEffect(() => {
        if (browseSpe?.monthYears) {
            processAlphabetYear(browseSpe?.monthYears);
        }
    }, [browseSpe])
    useEffect(() => {
        if (browseSpe?.allspecialities || browseSpe?.allProfessions || browseSpe?.allTopics || browseSpe?.allCountries) {
            processAlphabetData(browseSpe?.allspecialities || browseSpe?.allProfessions || browseSpe?.allTopics || browseSpe?.allCountries);
        }
    }, [browseSpe]);
    useEffect(() => {
        if (browseSpe?.topspecialities || browseSpe?.topProfessions || browseSpe?.topTopics || browseSpe?.topCountries || browseSpe?.topStates || browseSpe?.topCities || browseSpe?.monthYearsPast) {
            const professions = browseSpe?.topspecialities || browseSpe?.topProfessions || browseSpe?.topTopics || browseSpe?.topCountries || browseSpe?.topStates || browseSpe?.topCities || browseSpe?.monthYearsPast;
            const tempFilteredProfessions = professions
                .filter(
                    (p) =>
                        typeof p?.name == "string" &&
                        p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => ({
                    name: p.name,
                    url: p.url,
                    count: p.count,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setFilteredProfessions(tempFilteredProfessions);
        }
    }, [browseSpe, search]);

    useEffect(() => {
        if (alphabetdata) {
            const filteredAlphabetListing = Object.keys(alphabetdata)
                .sort()
                .map((letter) => ({
                    key: letter,
                    data: alphabetdata[letter]
                        .filter((specialty) =>
                            specialty.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .sort((a, b) => a.name.localeCompare(b.name)),
                }))
                .filter((letterData) => letterData.data.length > 0);
            setAlphabetListing(filteredAlphabetListing);
        }
    }, [alphabetdata, search]);
    useEffect(() => {
        setCombinedData([
            { type: "search", data: search },
            { type: selectedFilter == "Month-Year" ? "Browse Year" : selectedFilter, data: selectedFilter == "Month-Year" ? alphabetlisting : filteredProfessions },
            { type: selectedFilter == "Month-Year" ? "Future Conferences" : "alphabetlisting", data: selectedFilter == "Month-Year" ? futureConferences : alphabetlisting },
        ]);
    }, [search, filteredProfessions, alphabetlisting])
    const alphbetSelect = (specialty, rqsttype, mainkey, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { trig: specialty, rqstType: rqsttype, mainKey: mainkey, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setAlphabetItems([totalData]);
    };
    const alphbetSelectState = (statebefore, statecareafter, rqsttype, mainkey, newState, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { beforetake: statebefore, trig: statecareafter, rqstType: rqsttype, mainKey: mainkey, newAdd: newState, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setAlphabetItems([totalData]);
    }
    const stateToggleSingle = (statebefore, statecareafter, rqsttype, mainkey, newState, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { beforetake: statebefore, trig: statecareafter, rqstType: rqsttype, mainKey: mainkey, newAdd: newState, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setSelectedItems([totalData]);
    }
    const cityToggleSingle = (partAll, rqsttype, mainkey, newState, newcity, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { beforetakecity: partAll, rqstType: rqsttype, mainKey: mainkey, newAdd: newState, newCt: newcity, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setSelectedItems([totalData]);
    }
    const cityToggleMulti = (partAllMul, rqsttype, mainkey, newState, newcity, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { beforetakecity: partAllMul, rqstType: rqsttype, mainKey: mainkey, newAdd: newState, newCt: newcity, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setAlphabetItems([totalData]);
    }
    const updateSearch = (text) => setSearch(text);
    const toggleSelection = (singleera, rqsttype, mainkey, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { trig: singleera, rqstType: rqsttype, mainKey: mainkey, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setSelectedItems([singleera]);
    };
    const toggleSelectionyear = (stateTakeit) => {
        setSelectedItemsyr([stateTakeit]);
    };
    const monthyearToggle = (monthyear, rqsttype, mainkey, totalData) => {
        props.navigation.navigate("Globalresult", { trig: { monthAds: monthyear, rqstType: rqsttype, mainKey: mainkey, totalDaa: totalData, creditAll: props?.route?.params?.highText?.CreditData || props?.route?.params?.creditData } });
        setAlphabetItems([totalData]);
    };

    const renderFilterOption = ({ item, index }) => (
        <>
            {index === 0 && (
                <>
                    <View
                        style={{
                            height: normalize(12),
                            width: normalize(120),
                            backgroundColor: Colorpath.Pagebg,
                        }}
                    />
                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E3E3E3'
                    }} />
                </>
            )}
            <TouchableOpacity
                style={[styles.filterOption, selectedFilter === item && styles.selectedFilterOption]}
                onPress={() => {
                    setBrowseSpe(null);
                    setCombinedData([]);
                    setSelectedFilter(item);
                    setShowLoader(false);
                }}
            >
                <Text style={styles.filterOptionText}>{item}</Text>
            </TouchableOpacity>
        </>
    );
    const renderProfessionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.professionItem}
            onPress={() => {
                if (selectedFilter == 'Specialty') {
                    toggleSelection(item?.url, "specialityconferences", "conference_specialitiy", item);
                } else if (selectedFilter == 'Profession') {
                    const url = item?.url;
                    const result = url.substring(url.lastIndexOf('/') + 1);
                    toggleSelection(result, "professionconferences", "conference_profession", item);
                } else if (selectedFilter == 'Topic') {
                    const topicurl = item?.url;
                    const resultTopic = topicurl.substring(topicurl.lastIndexOf('/') + 1);
                    toggleSelection(resultTopic, "topicbasedconferences", "topic", item);
                } else if (selectedFilter == 'Country') {
                    toggleSelection(item?.url, "countryconferences", "country", item);
                } else if (selectedFilter == "State") {
                    const stateurl = item?.url;
                    const [beforeSlash, afterSlash] = stateurl.split('/');
                    stateToggleSingle(beforeSlash, afterSlash, "stateconferences", "country", "state", item);
                } else if (selectedFilter == "City") {
                    const cityUrl = item?.url;
                    const parts = cityUrl.split('/');
                    cityToggleSingle(parts, "cityconferences", "country", "state", "city", item);
                }
            }}
        >
            <View style={styles.professionRow}>
                <Icon
                    name={selectedItems.some(i => i.name === item.name) ? 'check' : 'check'}
                    size={20}
                    color={selectedItems.some(i => i.name === item.name) ? '#FF5733' : '#CCCCCC'}
                />
                <Text style={styles.professionText}>{`${item?.name} (${item?.count})`}</Text>
            </View>
        </TouchableOpacity>
    );
    const renderItem = ({ item, index }) => {
        const wholeData = Object.keys(item?.data).length;
        if (item?.type == selectedFilter && filteredProfessions.length > 0) {
            return (
                <View>
                    <Text style={styles.professionHeader}>{`Top ${item?.type == 'Profession' ? "Professions" : item?.type == 'Specialty' ? "Specialities" : item?.type == 'Topic' ? 'Topics' : item?.type == 'Country' ? 'Countries' : item?.type == 'State' ? 'States' : item?.type == 'City' ? 'Cities' : item?.type}`}</Text>
                    {filteredProfessions.length > 0 ? (
                        filteredProfessions.map((profession, index) => renderProfessionItem({ item: profession, index }))
                    ) : (!showLoader ? <ActivityIndicator color={"green"} size="small" /> :
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No data found</Text>
                        </View>
                    )}
                    <View style={styles.separator} />
                </View>
            );
        } else if (item?.type == "Browse Year" && selectedFilter == "Month-Year") {
            return (
                <View>
                    <Text style={styles.professionHeader}>{"Browse Year"}</Text>
                    {alphabetlisting[0]?.data.map((yearData) => (
                        <TouchableOpacity
                            key={yearData.year}
                            style={styles.professionItem}
                            onPress={() => {
                                setSelectedYear(yearData.year)
                                toggleSelectionyear(yearData);
                            }}
                        >
                            <View style={styles.professionRow}>
                                <Icon
                                    name={selectedItemsyr.some(i => i.year == yearData?.year) ? 'check' : 'check'}
                                    size={20}
                                    color={selectedItemsyr.some(i => i.year == yearData?.year) ? '#FF5733' : '#CCCCCC'}
                                />
                                <Text style={styles.professionText}>{`${yearData?.year}`}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else if (item?.type == "Future Conferences" && selectedFilter == "Month-Year" && selectedYear) {
            const filteredConferences = futureConferences[selectedYear] || [];
            return (
                <View>
                    <View>
                        <Text style={{
                            width: normalize(110),
                            marginRight: normalize(100),
                            fontSize: 14,
                            fontFamily: Fonts.InterBold,
                            color: '#000000',
                            marginTop: normalize(16),
                            fontWeight: "bold"
                        }}>
                            {"Future Conferences"}
                        </Text>
                    </View>
                    {wholeData > 0 ? (
                        filteredConferences.map((conference, conferenceIndex) => (
                            <View key={conference.url}>
                                <TouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => {
                                        if (selectedFilter == "Month-Year" && selectedYear) {
                                            const monthNumber = monthNames[conference?.month] || 0;
                                            const formattedMonth = monthNumber.toString().padStart(2, '0');
                                            const formattedDate = `${selectedYear}-${formattedMonth}`;
                                            monthyearToggle(formattedDate, "monthbasedconferences", "year_month", conference);
                                        }
                                    }}
                                >
                                    <Icon
                                        name={alphabetItems.includes(conference.url) ? "check" : "check"}
                                        size={20}
                                        color={alphabetItems.includes(conference.url) ? "#FF5733" : "#CCCCCC"}
                                    />
                                    <Text style={styles.itemText}>
                                        {`${conference.month} (${conference.count})`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>{"No conferences available"}</Text>
                    )}
                </View>

            );
        } else if (item.type === 'alphabetlisting') {
            return (alphabetlisting?.length > 0 ? (
                <View>
                    {item.data.map((alphabet, index) => (
                        <View key={alphabet.key} style={styles.alphabetSection}>
                            <View
                                style={
                                    selectedFilter == "State" || selectedFilter == "City"
                                        ? { marginRight: normalize(100) }
                                        : {
                                            backgroundColor: "#D6F9E2",
                                            height: normalize(30),
                                            width: normalize(30),
                                            borderRadius: normalize(20),
                                            justifyContent: "center",
                                            alignContent: "center",
                                        }
                                }
                            >
                                <Text
                                    style={
                                        selectedFilter == "State" || selectedFilter == "City"
                                            ? styles.stateKey
                                            : [styles.alphabetHeader]
                                    }
                                >
                                    {alphabet.key}
                                </Text>
                            </View>
                            {alphabet.data.map((specialty) => (
                                <TouchableOpacity
                                    key={specialty.name}
                                    style={styles.itemRow}
                                    onPress={() => {
                                        if (selectedFilter == 'Specialty') {
                                            alphbetSelect(specialty?.url, "specialityconferences", "conference_specialitiy", specialty);
                                        } else if (selectedFilter == 'Profession') {
                                            const url = specialty?.url;
                                            const result = url.substring(url.lastIndexOf('/') + 1);
                                            alphbetSelect(result, "professionconferences", "conference_profession", specialty);
                                        } else if (selectedFilter == 'Topic') {
                                            const topicurl = specialty?.url;
                                            const resultTopic = topicurl.substring(topicurl.lastIndexOf('/') + 1);
                                            alphbetSelect(resultTopic, "topicbasedconferences", "topic", specialty);
                                        } else if (selectedFilter == 'Country') {
                                            alphbetSelect(specialty?.url, "countryconferences", "country", specialty);
                                        } else if (selectedFilter == "State") {
                                            const stateurl = specialty?.url;
                                            const [beforeSlash, afterSlash] = stateurl.split('/');
                                            alphbetSelectState(beforeSlash, afterSlash, "stateconferences", "country", "state", specialty);
                                        } else if (selectedFilter == "City") {
                                            const cityUrlMulti = specialty?.url;
                                            const partsMulti = cityUrlMulti.split('/');
                                            cityToggleMulti(partsMulti, "cityconferences", "country", "state", "city", specialty);
                                        }
                                    }}
                                >
                                    <Icon
                                        name={
                                            alphabetItems.includes(specialty?.name)
                                                ? "check"
                                                : "check"
                                        }
                                        size={20}
                                        color={
                                            alphabetItems.includes(specialty?.name)
                                                ? "#FF5733"
                                                : "#CCCCCC"
                                        }
                                    />
                                    <Text style={styles.itemText}>
                                        {selectedFilter == "City" ? `${specialty?.name}` : `${specialty?.name} (${specialty?.count})`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {index < item?.data?.length - 1 && (
                                <View style={styles.separator} />
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    {showLoader ? <ActivityIndicator color={"green"} size="small" /> :
                        <Text style={styles.emptyText}>No data found</Text>}
                </View>
            ));
        }
        return null;
    };
    const renderContent = () => {
        switch (selectedFilter) {
            case 'Specialty':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}

                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                );
            case 'Profession':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                );
            case 'Topic':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                );
            case 'Country':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                );
            case 'State':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                )
            case 'City':
                return (
                    <>
                        <CustomFlatList
                            ref={flatListRef}
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                            StickyElementComponent={
                                <View style={{ height: normalize(45), width: normalize(160), backgroundColor: "#FFFFFF" }}>
                                    <TextInput
                                        placeholderTextColor={"#999999"}
                                        placeholder='Search here'
                                        style={{
                                            height: normalize(40),
                                            width: normalize(160),
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#DADADA",
                                            paddingHorizontal: normalize(8),
                                        }}
                                        onChangeText={updateSearch}
                                        value={search}
                                    />
                                </View>
                            }

                        />
                    </>
                )
            case 'Month-Year':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item?.url}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    // backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    {!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>}
                                </View>
                            }
                        />
                    </>
                )
            default:
                return null;
        }
    };
    const {
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <Loader visible={BrowsReducer?.status == 'Browse/BrowseSpecialtyRequest'} />
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    <PageHeader title="Browse" onBackPress={FilterBack} />
                </View>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
                    <View style={styles.content}>
                        <FlatList
                            data={filters}
                            renderItem={renderFilterOption}
                            keyExtractor={(item) => item}
                            style={styles.filterList}
                            keyboardShouldPersistTaps="always"
                        />
                        <View style={styles.professionContainer}>
                            {renderContent()}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    filterList: {
        width: '40%',
        backgroundColor: '#EAF5FF',
    },
    filterOption: {
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
    },
    alphabetSection: {
        marginBottom: normalize(15),
        paddingVertical: normalize(5)
    },
    alphabetHeader: {
        fontSize: 18,
        fontFamily: Fonts.InterMedium,
        color: '#000000',
        alignSelf: "center",
        textAlign: "center"
    },
    stateKey: {
        fontSize: 20,
        fontFamily: Fonts.InterBold,
        color: '#000000',
        marginBottom: 5,
        fontWeight: "bold",
        width: normalize(110)
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    itemText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#000000",
        fontFamily: Fonts.InterMedium,
        width: normalize(130)
    },
    selectedFilterOption: {
        backgroundColor: '#FFFFFF',
    },
    filterOptionText: {
        fontSize: 14,
        fontFamily: Fonts.InterMedium,
        color: "#000000"
    },
    professionContainer: {
        width: '60%',
        paddingHorizontal: normalize(15),
        backgroundColor: "#FFFFFF"
    },
    professionHeader: {
        fontSize: 14,
        fontFamily: Fonts.InterBold,
        color: '#000000',
        marginTop: normalize(16),
        marginBottom: normalize(8),
        fontWeight: "bold"
    },
    professionItem: {
        paddingVertical: normalize(8),
    },
    professionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    professionText: {
        fontSize: 14,
        fontFamily: Fonts.InterMedium,
        color: "#000000",
        marginLeft: normalize(8),
        width: normalize(130)
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(18),
        borderTopWidth: 0.5,
        borderTopColor: '#E3E3E3',
        backgroundColor: "#FFFFFF"
    },
    footerButton: {
        height: normalize(20),
        width: normalize(140),
        alignItems: 'center',
    },
    resetButton: {
        fontSize: 20,
        color: '#999999',
        fontFamily: Fonts.InterSemiBold
    },
    applyButton: {
        fontSize: 20,
        color: Colorpath.ButtonColr,
        fontFamily: Fonts.InterSemiBold
    },
    separator: {
        height: 0.8,
        width: normalize(200),
        backgroundColor: "#999999",
        alignSelf: 'center',
    },
});

export default BrowseScreen;
