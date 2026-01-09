import { View, Text, Linking, useWindowDimensions, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Buttons from '../../Components/Button';
import InPersonStatewebcast from '../InPersonWebcast/InPersonStatewebcast';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import RenderHTML from 'react-native-render-html';
import { addtoCartWebcastRequest, checkoutTicketRequest } from '../../Redux/Reducers/WebcastReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
let status = "";
const StatewebcastCheckout = ({ takePrice, urlneed, creditData, setAddtocartload, isBundleAddToCart, bundle_conference_id, conferenceIDs, webcastdeatils, navigation }) => {
  let expiry_date = webcastdeatils && webcastdeatils?.endDate ? webcastdeatils?.endDate : null;
  const AuthReducer = useSelector(state => state.AuthReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const [finalcheck, setFinalcheck] = useState("");
  console.log(webcastdeatils, creditData, "webcastdeatils=====11", urlneed);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const fullAction = (dataItem) => {
    if (dataItem?.current_activity_api == "activitysession") {
      navigation.navigate("VideoComponent", { RoleData: dataItem });
    } else if (dataItem?.current_activity_api == "introduction") {
      navigation.navigate("StartTest", { conference: dataItem?.conferenceId })
    } else if (dataItem?.current_activity_api == "startTest") {
      navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.conferenceId } })
    }
  }
  function formatPrice(price) {
    let num = parseFloat(price);
    if (isNaN(num)) {
      return price;
    }
    let truncated = Math.floor(num * 100) / 100;

    return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
  }
  const handleAddtoCart = useCallback(() => {
    let obj = {
      "bundle_conference_id": bundle_conference_id,
      "conference_ids": conferenceIDs
    }
    connectionrequest()
      .then(() => {
        dispatch(addtoCartWebcastRequest(obj))
      })
      .catch((err) => {
        showErrorAlert("Please connect to internet")
      })
  }, [bundle_conference_id, conferenceIDs, dispatch]);
  const formatNumberWithCommas = (value) => {
    if (value == null || value == undefined) return '';
    const stringValue = value.toString().replace(/,/g, '');
    const parts = stringValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };
  const singleAddtoCart = useCallback(() => {
    if (webcastdeatils) {
      const checkoutSpancart = webcastdeatils?.conferenceId;
      let obj = {
        "conference_id": checkoutSpancart,
        "tickets": webcastdeatils?.registrationTickets?.map(ticket => ({
          "id": ticket?.id,
          "quantity": 1
        }))
      };
      connectionrequest()
        .then(() => {
          dispatch(addtoCartWebcastRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch]);
  const handleTicketsCheckout = useCallback(() => {
    if (webcastdeatils?.registrationTickets?.length > 0) {
      const checkoutSpan = webcastdeatils?.conferenceId;
      let obj = {
        "conference_id": checkoutSpan,
        "tickets": webcastdeatils?.registrationTickets?.map(ticket => ({
          "id": ticket?.id,
          "quantity": 1
        }))
      };
      connectionrequest()
        .then(() => {
          dispatch(checkoutTicketRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch]);
  const checkoutNav = useCallback(() => {
    navigation.navigate("Checkout", {
      checkoutSpan: {
        checkoutSpan: webcastdeatils,
        finalTicket: WebcastReducer?.checkoutTicketResponse
      }
    });
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse]);

  const inpersonNav = useCallback(() => {
    navigation.navigate("InPersonStatewebcast", {
      realData: {
        realData: webcastdeatils,
        ticketall: WebcastReducer?.checkoutTicketResponse?.tickets
      }
    });
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse?.tickets]);

  const alreadyCart = useCallback(() => {
    navigation.navigate("AddToCart", {
      addtocart: {
        addtocart: "startcallapi",
        coupon: WebcastReducer?.checkoutTicketResponse,
        webcast: webcastdeatils,
        urlneedTake: urlneed
      }
    });
  }, [navigation, WebcastReducer?.checkoutTicketResponse, webcastdeatils, urlneed]);
  const registerCheck = useCallback(() => {
    navigation.navigate("RegisterInterest", { checkoutSpan: { checkoutSpan: webcastdeatils, finalTicket: WebcastReducer?.checkoutTicketResponse } })
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse, urlneed])
  useEffect(() => {
    if (WebcastReducer.status == 'WebCast/checkoutTicketSuccess') {
      switch (finalcheck) {
        case "checkout":
          checkoutNav();
          break;
        case "inperson":
          inpersonNav();
          break;
        case "singlecart":
          singleAddtoCart();
          break;
        case "doublecart":
          alreadyCart();
          break;
        case "freshcart":
          handleAddtoCart();
          break;
        case "textproceed":
          registerCheck();
          break;
        default:
          break;
      }
      // Reset finalcheck after handling
      setFinalcheck("");
    }
  }, [WebcastReducer.status, finalcheck, singleAddtoCart, checkoutNav, inpersonNav, alreadyCart, handleAddtoCart]);
  useEffect(() => {
    if (WebcastReducer.status == 'WebCast/addtoCartWebcastSuccess') {
      if (WebcastReducer?.addtoCartWebcastResponse?.success == true && WebcastReducer?.checkoutTicketResponse) {
        setAddtocartload(false);
        setFinalcheck("");
        navigation.navigate("AddToCart", {
          addtocart: {
            addtocart: "startcallapi",
            coupon: WebcastReducer?.checkoutTicketResponse,
            webcast: webcastdeatils,
            urlneedTake: urlneed
          }
        });
      }
    }

    if (WebcastReducer.status == 'WebCast/addtoCartWebcastFailure') {
      setAddtocartload(false);
    }
  }, [WebcastReducer.status, WebcastReducer?.addtoCartWebcastResponse, WebcastReducer?.checkoutTicketResponse, setAddtocartload, navigation, webcastdeatils, urlneed, finalcheck]);

  return (
    <View>
      {webcastdeatils?.conference_active !== 0 ? (
        <View style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
          <View style={{
            width: "100%",
            position: 'absolute',
            height: normalize(120),
            bottom: normalize(-34),
            left: 0,
            right: 0,
            backgroundColor: Colorpath.white,
            // borderColor: "#DDDDDD",
            // borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: normalize(20),
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "space-between",
            marginLeft: normalize(-7)
            // zIndex:1
          }}>

            {webcastdeatils?.buttonType &&
              webcastdeatils?.buttonType?.toLowerCase() === "register" &&
              webcastdeatils?.registered_allow === 1 ? <><View style={{ flexDirection: "column", marginLeft: normalize(10) }}>
                {webcastdeatils?.registrationTickets?.length > 0 ? (
                  <>
                    <View style={{ marginLeft: normalize(5) }}>
                      <Text
                        style={{
                          fontFamily: Fonts.InterMedium,
                          fontSize: 14,
                          color: "#333",
                        }}
                      >
                        {"Total"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.InterBold,
                          fontSize: 18,
                          color: "#333",
                          width: normalize(80)
                        }}
                      >
                        {`${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(takePrice || "0"))}`}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text
                    style={{
                      fontFamily: Fonts.InterBold,
                      fontSize: 20,
                      color: Colorpath.ButtonColr,
                      marginLeft: normalize(5)
                    }}
                  >
                    {"Free"}
                  </Text>
                )}

              </View><Buttons
                onPress={() => {
                  if ((
                    webcastdeatils?.conferenceTypeText == "Webcast" ||
                    webcastdeatils?.conferenceTypeText == "Text-Based CME" ||
                    webcastdeatils?.conferenceTypeText == "Journal CME" ||
                    webcastdeatils?.conferenceTypeText == "Podcast"
                  ) && webcastdeatils?.registrationTickets?.length == 1 && webcastdeatils?.conferenceTypeId != "1" &&
                    webcastdeatils?.conferenceTypeId != "6" &&
                    webcastdeatils?.conferenceTypeId != "34") {
                    handleTicketsCheckout();
                    setFinalcheck("checkout")
                  } else {
                    handleTicketsCheckout();
                    setFinalcheck("inperson");
                    // navigation.navigate("InPersonStatewebcast", { realData: webcastdeatils });
                  }
                }}
                height={normalize(45)}
                width={
                  (webcastdeatils?.is_cart_applicable === 1 &&
                    webcastdeatils?.already_in_cart === 1 &&
                    webcastdeatils?.isHavingActivity !== 1) ||
                    (webcastdeatils?.buttonType &&
                      webcastdeatils?.buttonType.toLowerCase() !== "interest" &&
                      webcastdeatils?.is_cart_applicable === 1 &&
                      webcastdeatils?.already_in_cart === 0 &&
                      webcastdeatils?.isHavingActivity !== 1)
                    ? normalize(100)
                    : normalize(140)
                }
                backgroundColor={Colorpath.ButtonColr}
                borderRadius={normalize(5)}
                text={(
                  (
                    webcastdeatils?.conferenceTypeText == "Webcast" ||
                    webcastdeatils?.conferenceTypeText == "Text-Based CME" ||
                    webcastdeatils?.conferenceTypeText == "Journal CME" ||
                    webcastdeatils?.conferenceTypeText == "Podcast"
                  ) &&
                  webcastdeatils?.registrationTickets?.length == 1 &&
                  webcastdeatils?.conferenceTypeId != "1" &&
                  webcastdeatils?.conferenceTypeId != "6" &&
                  webcastdeatils?.conferenceTypeId != "34"
                )
                  ? "Checkout"
                  : "Register"}
                color={Colorpath.white}
                fontSize={16}
                fontFamily={Fonts.InterSemiBold} /></>
              : null}
          </View>
          <View>
            {

              dayjs().isBefore(dayjs(expiry_date)) ? (
                <></>
              )
                : webcastdeatils?.buttonType &&
                  webcastdeatils?.buttonType.toLowerCase() === "register" &&
                  webcastdeatils?.registered_allow === 1 ? (
                  <></>
                )
                  : webcastdeatils &&
                    webcastdeatils.buttonType &&
                    webcastdeatils.buttonType.toLowerCase() === "interest" &&
                    webcastdeatils.interested_allow === 1 && webcastdeatils?.organizerName == 'IV Pro' && webcastdeatils?.conferenceId == '288600' ? (
                    <>
                      <Buttons
                        onPress={() => {
                          Alert.alert('eMedEvents', 'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features', [{ text: "Close", onPress: () => { "demi" }, style: "default" }])
                        }}
                        height={normalize(45)}
                        width={normalize(140)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text={"ENROLL NOW"}
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                      />
                    </>
                  )
                    : webcastdeatils &&
                      webcastdeatils.buttonType &&
                      webcastdeatils.buttonType.toLowerCase() === "interest" &&
                      webcastdeatils.interested_allow === 1 && AuthReducer?.loginResponse?.user && (AuthReducer?.loginResponse?.user?.subscription_user == "premium" || AuthReducer?.loginResponse?.user?.subscription_user == 'free') ? (
                      <>
                        <Buttons
                          onPress={() => {
                            handleTicketsCheckout();
                            setFinalcheck("textproceed");
                          }}
                          height={normalize(45)}
                          width={normalize(140)}
                          backgroundColor={Colorpath.ButtonColr}
                          borderRadius={normalize(5)}
                          text={"PROCEED TO REGISTER"}
                          color={Colorpath.white}
                          fontSize={16}
                          fontFamily={Fonts.InterSemiBold}
                          marginBottom={normalize(10)}
                        />
                      </>
                    )
                      : webcastdeatils &&
                        webcastdeatils.buttonType &&
                        webcastdeatils.buttonType.toLowerCase() === "interest" &&
                        webcastdeatils.interested_allow === 1 ? (
                        <>
                          <Buttons
                            onPress={() => {
                              handleTicketsCheckout();
                              setFinalcheck("textproceed");
                            }}
                            height={normalize(45)}
                            width={normalize(140)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text={"PROCEED TO REGISTER"}
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                            marginBottom={normalize(10)}
                          />
                        </>
                      )
                        : webcastdeatils &&
                          webcastdeatils.buttonType &&
                          webcastdeatils.buttonType.toLowerCase() === "interest" &&
                          webcastdeatils.interested_allow === 0 ? (
                          <Buttons
                            onPress={() => {
                              Alert.alert('eMedEvents', 'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features', [{ text: "Cancel", onPress: () => { "demi" }, style: "default" }])
                            }}
                            height={normalize(45)}
                            width={normalize(140)}
                            backgroundColor={"#DADADA"}
                            borderRadius={normalize(5)}
                            marginBottom={normalize(10)}
                            text={"SHOWN INTEREST"}
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                            disabled={true}
                          />
                        ) : webcastdeatils?.button_display_text == "Revise Course" &&
                          webcastdeatils.button_redirect_text == "revise_activity" ? (
                          <View style={{ gap: 5 }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, color: "#000000", fontSize: 14, alignSelf: "center" }}>
                              {"You have already registered"}
                            </Text>
                            <Buttons
                              onPress={() => {
                                if (webcastdeatils?.current_activity_api == "activitysession") {
                                  navigation.navigate("VideoComponent", { RoleData: webcastdeatils });
                                } else if (webcastdeatils?.current_activity_api == "introduction") {
                                  navigation.navigate("StartTest", { conference: webcastdeatils?.conferenceId })
                                } else if (webcastdeatils?.current_activity_api == "startTest") {
                                  navigation.navigate("PreTest", { activityID: { activityID: webcastdeatils?.current_activity_id, conference_id: webcastdeatils?.conferenceId } })
                                }
                              }}
                              height={normalize(45)}
                              width={normalize(140)}
                              backgroundColor={Colorpath.ButtonColr}
                              borderRadius={normalize(5)}
                              text={webcastdeatils?.button_display_text}
                              color={Colorpath.white}
                              fontSize={16}
                              fontFamily={Fonts.InterSemiBold}
                              marginBottom={normalize(10)}
                            />
                          </View>
                        ) : webcastdeatils?.dkbmed_link ? (
                          <View>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, color: "#000000", fontSize: 14 }}>
                              {"You have already registered"}
                            </Text>
                            <Buttons
                              onPress={() => {
                                Linking.openURL(webcastdeatils?.dkbmed_link)
                                console.log("hrelll");
                              }}
                              height={normalize(45)}
                              width={normalize(140)}
                              backgroundColor={Colorpath.ButtonColr}
                              borderRadius={normalize(5)}
                              text={webcastdeatils?.buttonText}
                              color={Colorpath.white}
                              fontSize={16}
                              fontFamily={Fonts.InterSemiBold}
                            />
                          </View>
                        ) : webcastdeatils?.button_redirect_text == "redirect_creditvault" ? (
                          <Buttons
                            onPress={() => {
                              navigation.navigate("AddCredits", { mainAdd: creditData })
                            }}
                            height={normalize(45)}
                            width={normalize(140)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            marginBottom={normalize(10)}
                            text={"Add Credits"}
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                          />
                        ) : webcastdeatils ? (
                          <View>
                            <Text style={{ alignSelf: "center", fontFamily: Fonts.InterSemiBold, color: "#000000", fontSize: 14, marginBottom: normalize(10) }}>
                              {"You have already registered"}
                            </Text>
                            <Buttons
                              onPress={() => {
                                fullAction(webcastdeatils);
                              }}
                              height={normalize(45)}
                              width={normalize(140)}
                              backgroundColor={Colorpath.ButtonColr}
                              borderRadius={normalize(5)}
                              text={webcastdeatils?.buttonText}
                              color={Colorpath.white}
                              marginBottom={normalize(10)}
                              fontSize={16}
                              fontFamily={Fonts.InterSemiBold}
                            />
                          </View>
                        ) : (
                          ""
                        )}
            <View style={{ position: 'absolute', bottom: normalize(1), zIndex: 2 }}>
              {webcastdeatils?.buttonType &&
                webcastdeatils.buttonType.toLowerCase() !== "interest" ? (
                webcastdeatils &&
                  webcastdeatils?.is_cart_applicable == 1 &&
                  webcastdeatils?.already_in_cart === 0 &&
                  webcastdeatils.isHavingActivity !== 1 ? (
                  <Buttons
                    onPress={() => {
                      handleTicketsCheckout();
                      setFinalcheck("singlecart")
                    }}
                    height={normalize(45)}
                    width={normalize(100)}
                    backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text={"ADD TO CART"}
                    color={Colorpath.white}
                    fontSize={14}
                    marginLeft={normalize(87)}
                    marginBottom={normalize(13)}
                    fontFamily={Fonts.InterSemiBold}
                  />

                ) : webcastdeatils?.is_cart_applicable &&
                  webcastdeatils.is_cart_applicable == 1 &&
                  webcastdeatils.already_in_cart === 1 &&
                  webcastdeatils.isHavingActivity !== 1 ? (
                  <Buttons
                    onPress={() => {
                      handleTicketsCheckout();
                      setFinalcheck("doublecart");
                    }}
                    height={normalize(45)}
                    width={normalize(100)}
                    backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text={"Already in cart"}
                    color={Colorpath.white}
                    fontSize={14}
                    marginLeft={normalize(87)}
                    marginBottom={normalize(15)}
                    fontFamily={Fonts.InterSemiBold}
                  />
                ) : null
              ) : null}
            </View>
          </View>
        </View>
      ) : webcastdeatils?.conference_active == 0 &&
        webcastdeatils?.button_redirect_text == "revise_activity" ? (
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <Buttons
            onPress={() => {
              navigation.navigate("VideoComponent", { RoleData: webcastdeatils });
            }}
            height={normalize(45)}
            width={normalize(140)}
            backgroundColor={Colorpath.ButtonColr}
            borderRadius={normalize(5)}
            text={"Revise Activity"}
            color={Colorpath.white}
            fontSize={14}
            fontFamily={Fonts.InterSemiBold}
            marginBottom={normalize(10)}
          />
        </View>
      ) : webcastdeatils?.conference_active == 0 && webcastdeatils?.bundle_conf_taken_msg ? (
        <>

          <RenderHTML
            contentWidth={width}
            source={{ html: webcastdeatils?.bundle_conf_taken_msg }}
            tagsStyles={{
              p: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" }
            }}
          />

          {webcastdeatils?.bundle_add_cart == "1" && (<Buttons
            onPress={() => {
              handleTicketsCheckout();
              setFinalcheck("freshcart");
            }}
            height={normalize(45)}
            width={normalize(140)}
            backgroundColor={Colorpath.ButtonColr}
            borderRadius={normalize(5)}
            text={"ADD TO CART"}
            color={Colorpath.white}
            fontSize={14}
            marginBottom={10}
          />)}
        </>

      ) : (
        ""
      )}



    </View>
  )
}

export default StatewebcastCheckout