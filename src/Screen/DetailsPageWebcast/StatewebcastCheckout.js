/**
 * Statewebcast checkout screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, StatewebcastCheckout, fullAction, formatPrice, formatNumberWithCommas.
 */

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

/**
 * Reusable StatewebcastCheckout component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Statewebcast checkout component.
 * @param {Object} props - Input object.
 * @param {*} props.refID - Nested property value.
 * @param {*} props.takePrice - Nested property value.
 * @param {*} props.urlneed - Nested property value.
 * @param {*} props.creditData - Nested property value.
 * @param {*} props.setAddtocartload - Nested property value.
 * @param {*} props.isBundleAddToCart - Nested property value.
 * @param {*} props.bundle_conference_id - Nested property value.
 * @param {*} props.conferenceIDs - Nested property value.
 * @param {*} props.webcastdeatils - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @param {*} props.guestOrigin - Nested property value.
 * @returns {JSX.Element}
 */
const StatewebcastCheckout = ({ refID, takePrice, urlneed, creditData, setAddtocartload, isBundleAddToCart, bundle_conference_id, conferenceIDs, webcastdeatils, navigation, guestOrigin }) => {
  let expiry_date = webcastdeatils && webcastdeatils?.endDate ? webcastdeatils?.endDate : null;
  const AuthReducer = useSelector(state => state.AuthReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const [finalcheck, setFinalcheck] = useState("");
  const videoNavigationData = useCallback((dataItem = webcastdeatils) => {
    const existingActivityData = Array.isArray(dataItem?.activityData) ? dataItem.activityData : [];
    const youtubeVideoId = dataItem?.video_audio_details?.[0]?.youtube_video_id
      || existingActivityData?.[0]?.youtube_video_id
      || "";

    if (!youtubeVideoId && existingActivityData.length === 0) {
      return dataItem;
    }

    const mergedActivityData = existingActivityData.length > 0
      ? existingActivityData.map((activity, index) => (
        index === 0
          ? {
            ...activity,
            ...(dataItem?.video_audio_details?.[0] || {}),
            youtube_video_id: youtubeVideoId || activity?.youtube_video_id || "",
          }
          : activity
      ))
      : [{
        ...(dataItem?.video_audio_details?.[0] || {}),
        youtube_video_id: youtubeVideoId,
      }];

    return {
      ...dataItem,
      activityData: mergedActivityData,
    };
  }, [webcastdeatils]);
  const isCheckoutCta = (
    webcastdeatils?.conferenceTypeText == "Webcast" ||
    webcastdeatils?.conferenceTypeText == "Text-Based CME" ||
    webcastdeatils?.conferenceTypeText == "Journal CME" ||
    webcastdeatils?.conferenceTypeText == "Podcast"
  ) &&
    webcastdeatils?.registrationTickets?.length == 1 &&
    webcastdeatils?.conferenceTypeId != "1" &&
    webcastdeatils?.conferenceTypeId != "6" &&
    webcastdeatils?.conferenceTypeId != "34";
  const showCartAction = webcastdeatils?.buttonType &&
    webcastdeatils?.buttonType.toLowerCase() !== "interest" &&
    webcastdeatils?.is_cart_applicable == 1 &&
    webcastdeatils?.isHavingActivity !== 1;
  console.log(webcastdeatils, creditData, "webcastdeatils=====11", urlneed);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
    /**
 * Full action utility.
 * @param {*} dataItem - Input value.
 * @returns {void}
 */
const fullAction = (dataItem) => {
    if (dataItem?.current_activity_api == "activitysession") {
      navigation.navigate("VideoComponent", { RoleData: videoNavigationData(dataItem) });
    } else if (dataItem?.current_activity_api == "introduction") {
      navigation.navigate("StartTest", { conference: dataItem?.conferenceId })
    } else if (dataItem?.current_activity_api == "startTest") {
      navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.conferenceId } })
    }
  }
    /**
 * Formats price.
 * @param {*} price - Input value.
 * @returns {*}
 */
function formatPrice(price) {
    let num = parseFloat(price);
    if (isNaN(num)) {
      return price;
    }
    let truncated = Math.floor(num * 100) / 100;

    return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
  }
  const ticketPriceAmount = parseFloat(takePrice || "0") || 0;
  const hasCartActionButton = Boolean(
    webcastdeatils?.buttonType &&
      webcastdeatils.buttonType.toLowerCase() !== "interest" &&
      webcastdeatils?.is_cart_applicable == 1 &&
      webcastdeatils?.isHavingActivity !== 1
  );
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
    /**
 * Formats number with commas.
 * @param {*} value - Input value.
 * @returns {*}
 */
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

      if (refID) {
        obj["refer_params"] = refID;
      }

      connectionrequest()
        .then(() => {
          dispatch(checkoutTicketRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch, refID]);
  const checkoutNav = useCallback(() => {
    navigation.navigate("Checkout", {
      checkoutSpan: {
        checkoutSpan: webcastdeatils,
        finalTicket: WebcastReducer?.checkoutTicketResponse,
        guestOrigin,
      }
    });
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse, guestOrigin]);

  const inpersonNav = useCallback(() => {
    navigation.navigate("InPersonStatewebcast", {
      realData: {
        realData: webcastdeatils,
        ticketall: WebcastReducer?.checkoutTicketResponse?.tickets,
        guestOrigin,
      }
    });
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse?.tickets, guestOrigin]);

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
    navigation.navigate("RegisterInterest", {
      checkoutSpan: {
        checkoutSpan: webcastdeatils,
        finalTicket: WebcastReducer?.checkoutTicketResponse
      }
    })
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse])
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
            height: isCheckoutCta
              ? normalize(108)
              : normalize(108),
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: Colorpath.white,
            // borderColor: "#DDDDDD",
            // borderWidth: 1,
            paddingHorizontal: normalize(16),
            paddingTop: normalize(14),
            paddingBottom: normalize(16),
            // zIndex:1
          }}>
            {webcastdeatils?.buttonType &&
              webcastdeatils?.buttonType?.toLowerCase() === "register" &&
              webcastdeatils?.registered_allow === 1 ? (
              <View style={{ flex: 1, justifyContent: isCheckoutCta ? "flex-start" : "center", alignItems: "center" }}>
                {isCheckoutCta && webcastdeatils?.registrationTickets?.length > 0 && ticketPriceAmount > 0 ? (
                  <>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#333" }}>
                          {"Price"}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#333" }}>
                          {`${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(ticketPriceAmount))}`}
                        </Text>
                      </View>
                      <View style={{ marginTop: normalize(0), borderBottomColor: "#D7D7D7", borderBottomWidth: 1, borderStyle: "dashed" }} />
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: normalize(10), gap: normalize(8) }}>
                        <View style={{ flexShrink: 1 }}>
                          <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#333" }}>
                            {"Total"}
                          </Text>
                          <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#333" }}>
                            {`${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(ticketPriceAmount))}`}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(5) }}>
                          {hasCartActionButton ? (
                            <Buttons
                              onPress={() => {
                                handleTicketsCheckout();
                                setFinalcheck(webcastdeatils?.already_in_cart === 1 ? "doublecart" : "singlecart");
                              }}
                              height={normalize(48)}
                              width={normalize(100)}
                              backgroundColor={Colorpath.ButtonColr}
                              borderRadius={normalize(5)}
                              text={webcastdeatils?.already_in_cart === 1 ? "Already in cart" : "ADD TO CART"}
                              color={Colorpath.white}
                              fontSize={14}
                              fontFamily={Fonts.InterSemiBold} />
                          ) : null}
                          <Buttons
                            onPress={() => {
                              if (isCheckoutCta) {
                                handleTicketsCheckout();
                                setFinalcheck("checkout")
                              } else {
                                handleTicketsCheckout();
                                setFinalcheck("inperson");
                              }
                            }}
                            height={normalize(48)}
                            width={showCartAction ? normalize(100) : normalize(160)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text={"Checkout"}
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold} />
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <View>
                      <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#333" }}>
                        {"Total"}
                      </Text>
                      <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#333" }}>
                        {`${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(ticketPriceAmount))}`}
                      </Text>
                    </View>
                    <Buttons
                      onPress={() => {
                        handleTicketsCheckout();
                        setFinalcheck("inperson");
                      }}
                      height={normalize(48)}
                      width={showCartAction ? normalize(122) : normalize(160)}
                      backgroundColor={Colorpath.ButtonColr}
                      borderRadius={normalize(5)}
                      text={"Register"}
                      color={Colorpath.white}
                      fontSize={16}
                      fontFamily={Fonts.InterSemiBold} />
                  </View>
                )}
              </View>
            ) : null}
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
                          Alert.alert('eMedEvents', 'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features', [{ text: "Close",                           /**
 * On press utility.
 * @returns {void}
 */
onPress: () => { "demi" }, style: "default" }])
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
                            if (webcastdeatils?.registrationTickets?.length > 0 && webcastdeatils?.registered_allow == 1) {
                              handleTicketsCheckout();
                            } else {
                              registerCheck();
                            }
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
                              if (webcastdeatils?.registrationTickets?.length > 0 && webcastdeatils?.registered_allow == 1) {
                                handleTicketsCheckout();
                              } else {
                                registerCheck();
                              }
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
                              Alert.alert('eMedEvents', 'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features', [{ text: "Cancel",                               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => { "demi" }, style: "default" }])
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
                                  navigation.navigate("VideoComponent", { RoleData: videoNavigationData(webcastdeatils) });
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
            {null}
          </View>
        </View>
      ) : webcastdeatils?.conference_active == 0 &&
        webcastdeatils?.button_redirect_text == "revise_activity" ? (
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <Buttons
            onPress={() => {
              navigation.navigate("VideoComponent", { RoleData: videoNavigationData(webcastdeatils) });
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

/**
 * Statewebcast checkout default export.
 *
 * @returns {*}
 */
export default StatewebcastCheckout
