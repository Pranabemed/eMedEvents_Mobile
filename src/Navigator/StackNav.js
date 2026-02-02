import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Onboard from '../Screen/OnboardScreen/Onboard';
import Splash from '../Screen/SplashScreen/Splash';
import Login from '../Screen/Auth/Login';
import SignUp from '../Screen/Auth/SignUp';
import VerifyOTP from '../Screen/Auth/VerifyOTP';
import ChangeMail from '../Screen/Auth/ChangeMail';
import VerifyMobileOTP from '../Screen/Auth/VerifyMobileOTP';
import ChangeMobileNo from '../Screen/Auth/ChangeMobileNo';
import AllSpecial from '../Screen/Specialization/AllSpecial';
import ForgotMPIN from '../Screen/Auth/ForgotMPIN';
import EnterOTP from '../Screen/Auth/EnterOTP';
import ResetMPIN from '../Screen/Auth/ResetMPIN';
import Main from '../Screen/Dashboard/Main';
import CheckMembership from '../Screen/Specialization/CheckMembership';
import TabNavigator from './TabNav';
import ChooseSpecailization from '../Screen/Specialization/ChooseSpecailization';
import StateSpecification from '../Screen/Specialization/StateSpecification';
import CourseRelevant from '../Screen/Specialization/CourseRelevant';
import AddCredits from '../Screen/Specialization/AddCredits';
import AddLicense from '../Screen/Specialization/AddLicense';
import MOCCertification from '../Screen/Specialization/MOCCertification';
import BoardCourse from '../Screen/Specialization/BoardCourse';
import AddCertificate from '../Screen/Specialization/AddCertificate';
import StateCourse from '../Screen/StateRequiredCourse/StateCourse';
import MobileLoginOTP from '../Screen/Auth/MobileLogin';
import ChooseState from '../Screen/StateSpecification/ChooseState';
import StateInformation from '../Screen/StateSpecification/StateInformation';
import CreateStateInfor from '../Screen/StateSpecification/CreateStateInfor';
import Course from '../Screen/CMECourse/Course';
import OnlineCourse from '../Screen/CMECourse/OnlineCourse';
import PDFViewer from '../Components/Download';
import RateReview from '../Components/RateReview';
import VideoComponent from '../Components/Video';
import StartTest from '../Screen/CMECourse/StartTest';
import PreTest from '../Screen/CMECourse/PreTest';
import PostTestFail from '../Screen/CMECourse/PostTestFail';
import Survey from '../Screen/CMECourse/Survey';
import DownloadCertificate from '../Components/FinalCertificate';
import CMEPlanner from '../Screen/CMECourse/CMEPlanner';
import Mytasks from '../Screen/Task/Mytasks';
import DashoardVault from '../Screen/CMECreditValut/DashoardVault';
import StateCertificate from '../Screen/CMECreditValut/StateCertificate';
import DownloadImage from '../Screen/CMECreditValut/PngFile';
import ImagePDF from '../Screen/CMECreditValut/ImagePDF';
import CertficateHandle from '../Screen/CMECreditValut/FileCheck';
import Statewebcast from '../Screen/DetailsPageWebcast/Statewebcast';
import StateDataComponent from '../Components/StateDataComponent';
import Payment from '../Screen/DetailsPageWebcast/Payment';
import Checkout from '../Screen/DetailsPageWebcast/Checkout';
import HeaderSearch from '../Screen/DetailsPageWebcast/HeaderSearch';
import ExploreCastCourse from '../Screen/DetailsPageWebcast/ExploreCastCourse';
import FiltersTopic from '../Screen/DetailsPageWebcast/FiltersTopic';
import AllDownlaodCatlog from '../Components/AllDownloadCatlog';
import ProfileMain from '../Screen/Profile/ProfileMain';
import AddToCart from '../Screen/DetailsPageWebcast/AddToCart';
import InPersonStatewebcast from '../Screen/InPersonWebcast/InPersonStatewebcast';
import GuestUser from '../Screen/HomePage/GuestUser';
import FilterScreen from '../Screen/HomePage/FilterScreen';
import PriceSlider from '../Screen/HomePage/PriceSlider';
import BrowseScreen from '../Screen/HomePage/BrowseScreen';
import SearchScreen from '../Screen/HomePage/SearchScreen';
import SearchResult from '../Screen/HomePage/SearchResult';
import Testing from '../Screen/HomePage/Testing';
import CMEExDashboard from '../Screen/CMEExpense.js/CMEExDashboard';
import CMEListing from '../Screen/CMEExpense.js/CMEListing';
import AddExpenses from '../Screen/CMEExpense.js/AddExpenses';
import CMEActivity from '../Screen/CMEExpense.js/CMEActivity';
import AddCME from '../Screen/CMEExpense.js/AddCME';
import BoardCertificate from '../Components/BoardCertificate';
import InterestedChekout from '../Screen/DetailsPageWebcast/InterestedChekout';
import Registration from '../Screen/Transcation/Registration';
import DashboardTrans from '../Screen/Transcation/DashboardTrans';
import Wallets from '../Screen/Transcation/Wallets';
import HCPSub from '../Screen/Transcation/HCPSub';
import Menu from '../Screen/Auth/Menu';
import AppProvider from '../Screen/GlobalSupport/AppContext';
import PaymentSub from '../Screen/Transcation/PaymentSub';
import SubTransaction from '../Screen/Transcation/SubTransaction'
import BoardCourseSlide from '../Screen/StateRequiredCourse/BoardCourse';
import SpecialityCourseSlide from '../Screen/StateRequiredCourse/SpecialityCourse';
import GlobalSearch from '../Screen/GlobalSupport/GlobalSearch';
import ContactProfile from '../Screen/Profile/Contact';
import PersonalInfo from '../Screen/Profile/PersonalInfo';
import StateProfile from '../Screen/Profile/StateProfile';
import BoardProfile from '../Screen/Profile/BoardProfile';
import EmpInfo from '../Screen/Profile/EmpInfo';
import AddEmpInfo from '../Screen/Profile/AddEmpInfo';
import ProfMember from '../Screen/Profile/ProfMember';
import AddProfMemb from '../Screen/Profile/AddProfMemb';
import Globalresult from '../Screen/GlobalSupport/Globalresult';
import FullscreenMapScreen from '../Screen/DetailsPageWebcast/MapFull';
import VoiceSearchBar from '../Screen/GlobalSupport/Voice';
import NativeVoice from '../Screen/GlobalSupport/NativeVoice';
import PrimePayment from '../Components/PrimePayment';
import Speaker from '../Screen/GlobalSupport/Speaker';
import Internet from '../Screen/GlobalSupport/Internet';
import SpeakerProfile from '../Screen/GlobalSupport/SpeakerProfile';
import ContactUs from '../Screen/GlobalSupport/ContactUs';
import StickyFlatList from '../Screen/GlobalSupport/StickyFlatList';
import NonMain from '../Screen/NonPhysician/NonMain';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import SplashInt from '../Screen/SplashScreen/IntSplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import RegisterInterest from '../Screen/DetailsPageWebcast/RegisterInterest';
import InterestCard from '../Screen/DetailsPageWebcast/InterestCard';
import ChangePassword from '../Screen/Profile/ChangePassword';
import AddToCartNo from '../Screen/DetailsPageWebcast/NoCart';
import PrivacyPolicy from '../Screen/Auth/Privacy';
import TermsAndConditions from '../Screen/Auth/TermsCond';
import VerifyOTPEmail from '../Screen/Auth/SplashEmail';
import ChangeMailSplash from '../Screen/Auth/SplashChangeMail';
import LoginEmail from '../Screen/Auth/LoginEmail';
import SplashMobile from '../Screen/Auth/SplashMobile';
import LoginChangeMail from '../Screen/Auth/LoginChangeMail';
import SplashMobileChange from '../Screen/Auth/SplashMobileChange';
import LoginMobile from '../Screen/Auth/LoginMobile';
import LoginMobileChange from '../Screen/Auth/LoginMobileChange';
import AddMobile from '../Screen/Auth/AddMobile';
import AddMobileLogin from '../Screen/Auth/AddMobileLogin';
const StackNav = props => {
  const [conn, setConn] = useState("")
  const Stack = createStackNavigator();
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  }

  useEffect(() => {
    const token_error = () => {
      setTimeout(() => {
        AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
          if (loginHandleProccess) {
            setConn(true);
          }
        });
      }, 500);
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        setConn(state.isConnected)
      }
    });

    return () => unsubscribe();
  }, []);
  const Screens =
  {
    Splash: conn === false ? SplashInt : Splash,
    Onboard: Onboard,
    Login: Login,
    SignUp: SignUp,
    MobileLoginOTP: MobileLoginOTP,
    VerifyOTP: VerifyOTP,
    ChangeMail: ChangeMail,
    VerifyMobileOTP: VerifyMobileOTP,
    ChangeMobileNo: ChangeMobileNo,
    AllSpecial: AllSpecial,
    ForgotMPIN: ForgotMPIN,
    EnterOTP: EnterOTP,
    ResetMPIN: ResetMPIN,
    Main: Main,
    CheckMembership: CheckMembership,
    TabNav: TabNavigator,
    ChooseSpecailization: ChooseSpecailization,
    StateSpecification: StateSpecification,
    CourseRelevant: CourseRelevant,
    AddCredits: AddCredits,
    AddLicense: AddLicense,
    MOCCertification: MOCCertification,
    BoardCourse: BoardCourse,
    AddCertificate: AddCertificate,
    StateCourse: StateCourse,
    ChooseState: ChooseState,
    StateInformation: StateInformation,
    CreateStateInfor: CreateStateInfor,
    Course: Course,
    OnlineCourse: OnlineCourse,
    PDFViewer: PDFViewer,
    BoardCertificate: BoardCertificate,
    RateReview: RateReview,
    VideoComponent: VideoComponent,
    StartTest: StartTest,
    PreTest: PreTest,
    PostTestFail: PostTestFail,
    Survey: Survey,
    DownloadCertificate: DownloadCertificate,
    CMEPlanner: CMEPlanner,
    Mytasks: Mytasks,
    DashoardVault: DashoardVault,
    StateCertificate: StateCertificate,
    DownloadImage: DownloadImage,
    ImagePDF: ImagePDF,
    CertficateHandle: CertficateHandle,
    Statewebcast: Statewebcast,
    StateDataComponent: StateDataComponent,
    Payment: Payment,
    Checkout: Checkout,
    HeaderSearch: HeaderSearch,
    ExploreCastCourse: ExploreCastCourse,
    FiltersTopic: FiltersTopic,
    AllDownlaodCatlog: AllDownlaodCatlog,
    ProfileMain: ProfileMain,
    AddToCart: AddToCart,
    InPersonStatewebcast: InPersonStatewebcast,
    GuestUser: GuestUser,
    FilterScreen: FilterScreen,
    PriceSlider: PriceSlider,
    BrowseScreen: BrowseScreen,
    SearchScreen: SearchScreen,
    SearchResult: SearchResult,
    Testing: Testing,
    CMEExDashboard: CMEExDashboard,
    CMEListing: CMEListing,
    AddExpenses: AddExpenses,
    CMEActivity: CMEActivity,
    AddCME: AddCME,
    InterestedChekout: InterestedChekout,
    Registration: Registration,
    DashboardTrans: DashboardTrans,
    Wallets: Wallets,
    HCPSub: HCPSub,
    Menu: Menu,
    PaymentSub: PaymentSub,
    SubTransaction: SubTransaction,
    BoardCourseSlide: BoardCourseSlide,
    SpecialityCourseSlide: SpecialityCourseSlide,
    GlobalSearch: GlobalSearch,
    ContactProfile: ContactProfile,
    PersonalInfo: PersonalInfo,
    StateProfile: StateProfile,
    BoardProfile: BoardProfile,
    EmpInfo: EmpInfo,
    AddEmpInfo: AddEmpInfo,
    ProfMember: ProfMember,
    AddProfMemb: AddProfMemb,
    Globalresult: Globalresult,
    FullscreenMapScreen: FullscreenMapScreen,
    VoiceSearchBar: VoiceSearchBar,
    NativeVoice: NativeVoice,
    PrimePayment: PrimePayment,
    Speaker: Speaker,
    Internet: Internet,
    SpeakerProfile: SpeakerProfile,
    ContactUs: ContactUs,
    StickyFlatList: StickyFlatList,
    NonMain: NonMain,
    RegisterInterest: RegisterInterest,
    InterestCard: InterestCard,
    ChangePassword: ChangePassword,
    AddToCartNo: AddToCartNo,
    PrivacyPolicy: PrivacyPolicy,
    TermsAndConditions: TermsAndConditions,
    VerifyOTPEmail:VerifyOTPEmail,
    ChangeMailSplash:ChangeMailSplash,
    LoginEmail:LoginEmail,
    SplashMobile:SplashMobile,
    LoginChangeMail:LoginChangeMail,
    SplashMobileChange:SplashMobileChange,
    LoginMobile:LoginMobile,
    LoginMobileChange:LoginMobileChange,
    AddMobile:AddMobile,
    AddMobileLogin:AddMobileLogin
  }
  const [appState, setAppState] = useState(AppState.currentState);
  const [isColdStart, setIsColdStart] = useState(true);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // Always reset to splash screen when coming from background
        resetToSplashScreen();
      }
      setAppState(nextAppState);
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [appState]);
  const navigationRef = React.createRef();
  const resetToSplashScreen = () => {
    if (!navigationRef.current) return;

    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      })
    );
  };
  return (
    <AppProvider>
      <NavigationContainer theme={mytheme} onReady={() => setIsColdStart(false)}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {Object.entries({
            ...Screens,
          }).map(([name, component]) => {
            return <Stack.Screen  name={name} component={component} />
          })}

        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};
export default StackNav;