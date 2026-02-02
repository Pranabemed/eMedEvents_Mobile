import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import {
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import TextModal from './TextModal';
import Cmemodal from './Cmemodal';
import CreditValult from './CreditValult';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { boardSpecialityRequest, dashboardRequest, stateDashboardRequest } from '../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import connectionrequest from '../Utils/Helpers/NetInfo';
import HomeShimmer from './DashBoardShimmer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import BoardCarousel from './BoardCarousel';
import Boardonedata from './Boardonedata';
import Noboardfound from './Noboardfound';
import Boardtwodata from './Boardtwodata';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
let status = "";
export default function BoardCertificate({finalShow, setFinalShow, boardnamereal, setBoardnamereal }) {
    const {
        setFulldashbaord
      } = useContext(AppContext);
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [val, setval] = useState(0);
    const [detailsmodal, setDetailsmodal] = useState(false);
    const [cmemodal, setCmemodal] = useState(false);
    const [vaultModal, setVaultmodal] = useState(false);
    const [totalcard, setTotalCred] = useState();
    const [stateid, setStateid] = useState();
    const [loadingstart, setLoadingstart] = useState(false);
    const [boardtake, setBoardtake] = useState();
    const carouselRef = useRef(null);
    const modalFalse = () => {
        setDetailsmodal(true);
    }
    const cmeModalFalse = () => {
        setCmemodal(true);
    }
    const cmeValult = () => {
        setVaultmodal(!vaultModal);
    }

    const isFocus = useIsFocused();
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(dashboardRequest({}))
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })

    }, [isFocus]);

    const data = DashboardReducer?.dashboardResponse?.data?.board_certifications
    useEffect(() => {
        if (data?.length > 0) {
            boardIDError(data[val].board_id);
            setTotalCred(data[val]?.credits_data?.topic_earned_credits + Math.floor(data[val]?.credits_data?.total_general_earned_credits));
            setStateid(data[val]?.board_id);
            setBoardtake(data[val]?.board_name);
        }
    }, [data, val]);
    const boardIDError = (id) => {
        let obj = {
            "board_id": id,
            "compliance": 1
        }
        connectionrequest()
            .then(() => {
                dispatch(stateDashboardRequest(obj));
            })
            .catch(err => { showErrorAlert("Please connect to internet", err) })
    }
    const [completedCountboard, setCompletedCountboard] = useState(0);
    const [pendingCountboard, setPendingCountboard] = useState(0);

    useEffect(() => {
        const activitiesBoard = DashboardReducer?.stateDashboardResponse?.data?.my_activities || [];
        let total = 0;
        let completed = 0;
        activitiesBoard?.forEach((d) => {
            if (d?.completed_percentage !== undefined) {
                total++;
                if (d?.completed_percentage === 100) {
                    completed++;
                }
            }
        });
        setCompletedCountboard(completed);
        setPendingCountboard(total - completed);

    }, [DashboardReducer?.stateDashboardResponse?.data]);
    const handleSnapToItem = (index) => {
        setval(index);
    };
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashboardRequest':
                status = DashboardReducer.status;
                setLoadingstart(true);
                break;
            case 'Dashboard/dashboardSuccess':
                status = DashboardReducer.status;
                const mainData = DashboardReducer.dashboardResponse.data?.board_certifications;
                if (mainData) {
                    const uniqueMainData = mainData.filter(
                        (item, index, self) => index === self.findIndex((t) => t.board_id === item.board_id)
                    );
                    setFinalShow(uniqueMainData);
                }
                setLoadingstart(false);
                const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                setFulldashbaord(uniqueStates);
                break;
            case 'Dashboard/dashboardFailure':
                status = DashboardReducer.status;
                setLoadingstart(false);
                break;
        }
    }
    const [finalverifyboard, setFinalverifybaord] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const [boardspecial, setBoardspecial] = useState([]);
    const [totalboardname, setTotalboardname] = useState([]);

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
                    setFinalverifybaord(board_special_json);
                    setFinalProfession(profession_data_json);
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [isFocus]);

    const transformDataSpecial = (data) => {
        return Object.keys(data).map(key => {
            const specialities = Object.values(data[key].specialities).map(spec => spec.name);
            return {
                id: parseInt(key, 10),
                name: data[key].name,
                specialities: specialities.join(', ')
            };
        });
    };
    const roleBoardIds = useMemo(() => {
        const roleData = DashboardReducer?.dashboardResponse?.data?.board_certifications || [];
        return roleData
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.board_id === item.board_id)
            )
            .map(item => item.board_id);
    }, [DashboardReducer?.dashboardResponse?.data?.board_certifications]);

    useEffect(() => {
        const allBoardSpeciality = DashboardReducer?.boardSpecialityResponse?.certification_boards;
        if (allBoardSpeciality) {
            const dynamicDataSpecial = transformDataSpecial(allBoardSpeciality);
            const filteredBoards = dynamicDataSpecial.filter(board =>
                !roleBoardIds.includes(board.id.toString())
            );
            if (JSON.stringify(filteredBoards) !== JSON.stringify(totalboardname)) {
                setTotalboardname(filteredBoards);
                setBoardnamereal(filteredBoards);
            }
        }
    }, [DashboardReducer?.boardSpecialityResponse?.certification_boards, roleBoardIds, totalboardname]);


    useEffect(() => {
        const transformData = (data) => {
            return Object.keys(data).map(key => ({
                id: parseInt(key, 10),
                name: data[key]
            }));
        };

        const allBoardData = AuthReducer?.loginResponse?.user?.specialities ||
            AuthReducer?.againloginsiginResponse?.user?.specialities ||
            AuthReducer?.verifymobileResponse?.user?.specialities || finalverifyboard?.specialities || finalProfession?.specialities
            ;

        if (allBoardData) {
            const dynamicData = transformData(allBoardData);
            if (JSON.stringify(boardspecial) !== JSON.stringify(dynamicData)) {
                setBoardspecial(dynamicData);
            }
        }
    }, [
        AuthReducer?.loginResponse?.user?.specialities,
        AuthReducer?.againloginsiginResponse?.user?.specialities,
        AuthReducer?.verifymobileResponse?.user?.specialities,
        finalverifyboard?.specialities,
        finalProfession?.specialities
    ]);

    useEffect(() => {
        const boardSpecialty = () => {
            if (boardspecial?.length > 0) {
                const AllId = boardspecial.map((d) => d?.id);
                const finalId = AllId?.join(', ');
                let obj = {
                    "profession": AuthReducer?.verifymobileResponse?.user?.profession ||
                        AuthReducer?.loginResponse?.user?.profession ||
                        AuthReducer?.againloginsiginResponse?.user?.profession || finalverifyboard?.profession || finalProfession?.profession,
                    "specilityid": finalId
                };

                connectionrequest()
                    .then(() => {
                        dispatch(boardSpecialityRequest(obj));
                    })
                    .catch(err => {
                        showErrorAlert("Please connect to internet", err);
                    });
            }
        };

        boardSpecialty();
    }, [
        AuthReducer?.loginResponse?.user?.specialities,
        AuthReducer?.againloginsiginResponse?.user?.specialities,
        AuthReducer?.verifymobileResponse?.user?.specialities,
        boardspecial,
        finalverifyboard?.specialities,
        finalProfession?.specialities
    ]);
    return (
        <>
            <View>
                {loadingstart ? (
                    <HomeShimmer />
                ) : finalShow?.length > 0 ? (<View>
                    <Carousel
                        ref={carouselRef}
                        layout={'default'}
                        data={finalShow}
                        marginTop={normalize(10)}
                        sliderWidth={windowWidth}
                        itemWidth={
                            Platform.OS === 'ios' ? windowWidth - 30 : windowWidth - 30
                        }
                        itemHeight={windowHeight * 0.9}
                        sliderHeight={windowHeight * 0.9}
                        renderItem={({ item,index }) => <BoardCarousel setBoardnamereal={setBoardnamereal} setTotalboardname={setTotalboardname} totalboardname={totalboardname} index={index} boardnamereal={boardnamereal} item={item} stateid={stateid} navigation={navigation} boardtake={boardtake} />}
                        firstItem={0}
                        onSnapToItem={handleSnapToItem}
                    />
                    <View
                        style={{
                            width: normalize(40),
                            alignSelf: 'center',
                        }}>
                        <Pagination
                            dotsLength={finalShow?.length}
                            activeDotIndex={val}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                //  marginHorizontal: 2,
                                backgroundColor: Colorpath.ButtonColr,
                            }}
                            inactiveDotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                opacity: 0.7,
                                borderWidth: 1,
                                borderColor: "#666666",
                                backgroundColor: Colorpath.Pagebg
                            }}
                            inactiveDotScale={0.9}
                            renderDots={(val) =>
                                finalShow.map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setval(index);
                                            carouselRef.current?.snapToItem(index);
                                        }}
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            marginHorizontal: 5,
                                            opacity: 0.7,
                                            borderWidth: 1,
                                            borderColor: "#666666",
                                            backgroundColor: val === index ? "blue" : Colorpath.Pagebg,
                                        }}
                                    />
                                ))
                            }
                        />
                    </View>

                    <View>
                        <Boardonedata finalShow={finalShow} completedCountboard={completedCountboard} pendingCountboard={pendingCountboard} />
                        <Boardtwodata totalcard={totalcard} modalFalse={modalFalse} cmeModalFalse={cmeModalFalse} />
                    </View>
                    <TextModal setDetailsmodal={setDetailsmodal} isVisible={detailsmodal} onFalse={modalFalse} />
                        <Cmemodal setCmemodal={setCmemodal} isModal={cmemodal} onCmeFalse={cmeModalFalse} />
                    <CreditValult isVault={vaultModal} onVaultFalse={cmeValult} />
                </View>) : (
                    <Noboardfound navigation={navigation}/>
                )}
            </View>
        </>
    );
}
