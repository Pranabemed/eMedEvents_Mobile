import { View, ScrollView, Platform, KeyboardAvoidingView, Image, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Imagepath from '../../Themes/Imagepath';
import { AppContext } from '../GlobalSupport/AppContext';;
import HandleTextInput from './HandleTextInput';
import Snackbar from 'react-native-snackbar';
import NewProfession from '../../Components/NewProfession';
import NonPhysicianCat from '../../Components/NonPhysicianCat';
import StateIntData from '../../Components/StateInt';
import { SafeAreaView } from 'react-native-safe-area-context'

let status2 = "";
const MainInt = (props) => {
  const {
    takestate,
    addit,
    setTakestate,
    setAddit,
    fulldashbaord,
    setFulldashbaord,
    stateCount,
    setStateCount,
    gtprof,
    totalcard,
    setTotalCred,
    stateid,
    setStateid,
    renewal,
    setRenewal
  } = useContext(AppContext);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showLine, setShowLine] = useState(false);

  const backPressCount = useRef(0);
  const isSnackbarVisible = useRef(false);
  const snackbarTimeout = useRef(null);
  useEffect(() => {
    const resetState = () => {
      backPressCount.current = 0;
      isSnackbarVisible.current = false;
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = null;
      }
    };

    const onBackPress = () => {
      if (isSnackbarVisible.current) {
        resetState();
        BackHandler.exitApp();
        return true;
      }
      backPressCount.current = 1;
      isSnackbarVisible.current = true;
      Snackbar.show({
        text: 'Press back again to exit',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#2C2C2C',
        textColor: '#FFFFFF',
        action: {
          text: 'EXIT',
          textColor: '#D87AF6',
          onPress: () => {
            resetState();
            BackHandler.exitApp();
          },
        },
      });
      snackbarTimeout.current = setTimeout(() => {
        isSnackbarVisible.current = false;
        backPressCount.current = 0;
      }, 3000);

      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      backHandler.remove();
      resetState();
    };
  }, []);
  useLayoutEffect(() => {
          props.navigation.setOptions({ gestureEnabled: false });
      }, []);
  return (<>
    <MyStatusBar
      barStyle={'light-content'}
      backgroundColor={Colorpath.Pagebg}
    />
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
        <View style={Platform.OS === 'android' ? { marginTop: normalize(40) } : {}}>
          <Image source={Imagepath.eMedfulllogo} style={{ alignSelf: "center", height: normalize(40), width: normalize(212) }} resizeMode="contain" />
        </View>
        <HandleTextInput showLine={showLine} nav={props.navigation} takestate={takestate} addit={addit} setFocusedInput={setFocusedInput} focusedInput={focusedInput} />
        <ScrollView contentContainerStyle={{ paddingBottom: normalize(90) }} scrollEventThrottle={16}>
          <View>
            <View>
              {fulldashbaord == 0 ? <NewProfession finalProfessionmain={"gkfgk"} setPrimeadd={"false"} enables={"dfjk"} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={"sdfkkkghkjf"} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} /> : gtprof ?
                <StateIntData setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={"dfgjfhk"} setPrimeadd={"false"} enables={"fgfgdjh"} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={"fdsdfbjhdf"} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} /> : <NonPhysicianCat finalProfessionmain={"dfdghhfd"} setPrimeadd={"fgjfjjk"} enables={"dfjgfjh"} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={"fdbgfd"} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} />}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </>


  )
}

export default MainInt