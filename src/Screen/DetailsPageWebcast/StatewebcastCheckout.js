/**
 * Statewebcast checkout screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, StatewebcastCheckout, fullAction, formatPrice, formatNumberWithCommas.
 */

import { View, Text, Linking, useWindowDimensions, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
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
/**
 * Derives bottom checkout/cart CTA flags so the parent screen can avoid rendering a duplicate Add To Cart button.
 * @param {Object} webcastdeatils - Conference/webcast details payload.
 * @param {string|number} takePrice - Calculated ticket price.
 * @returns {{isCheckoutCta: boolean, hasCartActionButton: boolean, ticketPriceAmount: number, hasBottomCart: boolean}}
 */
export const getCheckoutCtaFlags = (webcastdeatils, takePrice) => {
  const buttonTypeLower = webcastdeatils?.buttonType?.toLowerCase();
  const ticketPriceAmount = parseFloat(takePrice || "0") || 0;
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
  const hasCartActionButton = Boolean(
    webcastdeatils?.buttonType &&
    buttonTypeLower !== "interest" &&
    webcastdeatils?.is_cart_applicable == 1 &&
    webcastdeatils?.isHavingActivity !== 1
  );
  const hasStandardBottomCart =
    webcastdeatils?.conference_active !== 0 &&
    buttonTypeLower === "register" &&
    webcastdeatils?.registered_allow === 1 &&
    isCheckoutCta &&
    webcastdeatils?.registrationTickets?.length > 0 &&
    ticketPriceAmount > 0 &&
    hasCartActionButton;
  const hasBundleBottomCart =
    webcastdeatils?.conference_active == 0 &&
    webcastdeatils?.button_redirect_text !== "revise_activity" &&
    Boolean(webcastdeatils?.bundle_conf_taken_msg) &&
    webcastdeatils?.bundle_add_cart == "1";

  return {
    isCheckoutCta,
    hasCartActionButton,
    ticketPriceAmount,
    hasBottomCart: Boolean(hasStandardBottomCart || hasBundleBottomCart),
  };
};

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
const StatewebcastCheckout = memo(({ refID, takePrice, urlneed, creditData, setAddtocartload, isBundleAddToCart, bundle_conference_id, conferenceIDs, webcastdeatils, navigation, guestOrigin }) => {
  let expiry_date = webcastdeatils && webcastdeatils?.endDate ? webcastdeatils?.endDate : null;
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const [finalcheck, setFinalcheck] = useState("");
  const checkoutRequestStartedRef = useRef(false);
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
  const { isCheckoutCta, hasCartActionButton, ticketPriceAmount } = getCheckoutCtaFlags(webcastdeatils, takePrice);
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
      navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.conferenceId, webcastdeatils: dataItem } })
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
  const handleAddtoCart = useCallback(() => {
    let obj = {
      "bundle_conference_id": bundle_conference_id,
      "conference_ids": conferenceIDs
    }
    if (refID) {
      obj["refer_params"] = refID;
    }
    connectionrequest()
      .then(() => {
        dispatch(addtoCartWebcastRequest(obj))
      })
      .catch((err) => {
        showErrorAlert("Please connect to internet")
      })
  }, [bundle_conference_id, conferenceIDs, dispatch, refID]);
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
      if (refID) {
        obj["refer_params"] = refID;
      }
      connectionrequest()
        .then(() => {
          dispatch(addtoCartWebcastRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch, refID]);
  const handleTicketsCheckout = useCallback(() => {
    if (checkoutRequestStartedRef.current) return;
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
          checkoutRequestStartedRef.current = true;
          dispatch(checkoutTicketRequest(obj));
        })
        .catch((err) => {
          checkoutRequestStartedRef.current = false;
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
        finalTicket: WebcastReducer?.checkoutTicketResponse,
        guestOrigin,
      }
    })
  }, [navigation, webcastdeatils, WebcastReducer?.checkoutTicketResponse, guestOrigin])
  useEffect(() => {
    if (checkoutRequestStartedRef.current && WebcastReducer.status == 'WebCast/checkoutTicketFailure') {
      checkoutRequestStartedRef.current = false;
      setFinalcheck("");
      return;
    }
    if (checkoutRequestStartedRef.current && WebcastReducer.status == 'WebCast/checkoutTicketSuccess') {
      checkoutRequestStartedRef.current = false;
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
  }, [WebcastReducer.status, finalcheck, singleAddtoCart, checkoutNav, inpersonNav, alreadyCart, handleAddtoCart, registerCheck]);
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

  const formattedPriceAmount = formatPrice(ticketPriceAmount);
  const isFreePrice = Number(formattedPriceAmount) <= 0;
  const formattedTotalPrice = isFreePrice
    ? "Free"
    : `${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formattedPriceAmount)}`;

  const renderPrimaryButton = (label, onPress, disabled = false, extraStyle = null) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.primaryButton,
        disabled && styles.disabledButton,
        extraStyle,
      ]}
    >
      <Text style={styles.primaryButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFooterContent = () => {
    if (webcastdeatils?.conference_active !== 0) {
      const buttonTypeLower = webcastdeatils?.buttonType?.toLowerCase();

      if (buttonTypeLower === "register" && webcastdeatils?.registered_allow === 1) {
        if (isCheckoutCta && webcastdeatils?.registrationTickets?.length > 0 && ticketPriceAmount > 0) {
          return (
            <View style={styles.checkoutActionRow}>
              <View style={styles.totalCol}>
                <Text style={styles.totalLabel}>{"Total"}</Text>
                <Text style={styles.totalValue}>{formattedTotalPrice}</Text>
              </View>
              <View style={styles.actionButtonsGroup}>
                {hasCartActionButton ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleTicketsCheckout();
                      setFinalcheck(webcastdeatils?.already_in_cart === 1 ? "doublecart" : "singlecart");
                    }}
                    activeOpacity={0.85}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                      {webcastdeatils?.already_in_cart === 1 ? "Already in cart" : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {renderPrimaryButton(
                  "Checkout",
                  () => {
                    if (isCheckoutCta) {
                      handleTicketsCheckout();
                      setFinalcheck("checkout");
                    } else {
                      handleTicketsCheckout();
                      setFinalcheck("inperson");
                    }
                  },
                  false,
                  hasCartActionButton ? styles.rowCtaFlex : styles.singleCtaFlex,
                )}
              </View>
            </View>
          );
        }

        return (
          <View style={styles.registerRow}>
            <View style={styles.totalCol}>
              {!isFreePrice ? <Text style={styles.totalLabel}>{"Total"}</Text> : null}
              <Text style={styles.totalValue}>{formattedTotalPrice}</Text>
            </View>
            {renderPrimaryButton(
              "Register",
              () => {
                handleTicketsCheckout();
                setFinalcheck("inperson");
              },
              false,
              styles.registerButton,
            )}
          </View>
        );
      }

      if (expiry_date && dayjs().isBefore(dayjs(expiry_date))) {
        return null;
      }

      if (
        buttonTypeLower === "interest" &&
        webcastdeatils?.interested_allow === 1 &&
        webcastdeatils?.organizerName == 'IV Pro' &&
        webcastdeatils?.conferenceId == '288600'
      ) {
        return renderPrimaryButton(
          "ENROLL NOW",
          () => {
            Alert.alert(
              'eMedEvents',
              'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features',
              [{
                text: "Close",
                /**
                 * On press utility.
                 * @returns {void}
                 */
                onPress: () => { "demi"; },
                style: "default",
              }],
            );
          },
        );
      }

      if (buttonTypeLower === "interest" && webcastdeatils?.interested_allow === 1) {
        return renderPrimaryButton(
          "PROCEED TO REGISTER",
          () => {
            if (webcastdeatils?.registrationTickets?.length > 0 && webcastdeatils?.registered_allow == 1) {
              handleTicketsCheckout();
            } else {
              registerCheck();
            }
            setFinalcheck("textproceed");
          },
        );
      }

      if (buttonTypeLower === "interest" && webcastdeatils?.interested_allow === 0) {
        return renderPrimaryButton(
          "SHOWN INTEREST",
          () => {
            Alert.alert(
              'eMedEvents',
              'The Recommended In-Person Conferences Online Courses Medical Conference,and Interested Conference sections are not available in the mobile version. Please visit our website to access these features',
              [{
                text: "Cancel",
                /**
                 * On press utility.
                 * @returns {void}
                 */
                onPress: () => { "demi"; },
                style: "default",
              }],
            );
          },
          true,
        );
      }

      if (
        webcastdeatils?.button_display_text == "Revise Course" &&
        webcastdeatils?.button_redirect_text == "revise_activity"
      ) {
        return (
          <View style={styles.registeredStack}>
            <Text style={styles.registeredNote}>{"You have already registered"}</Text>
            {renderPrimaryButton(
              webcastdeatils?.button_display_text,
              () => {
                if (webcastdeatils?.current_activity_api == "activitysession") {
                  navigation.navigate("VideoComponent", { RoleData: videoNavigationData(webcastdeatils) });
                } else if (webcastdeatils?.current_activity_api == "introduction") {
                  navigation.navigate("StartTest", { conference: webcastdeatils?.conferenceId });
                } else if (webcastdeatils?.current_activity_api == "startTest") {
                  navigation.navigate("PreTest", {
                    activityID: {
                      activityID: webcastdeatils?.current_activity_id,
                      conference_id: webcastdeatils?.conferenceId,
                      webcastdeatils: webcastdeatils,
                    },
                  });
                }
              },
            )}
          </View>
        );
      }

      if (webcastdeatils?.dkbmed_link) {
        return (
          <View style={styles.registeredStack}>
            <Text style={styles.registeredNote}>{"You have already registered"}</Text>
            {renderPrimaryButton(
              webcastdeatils?.buttonText || "Continue",
              () => {
                Linking.openURL(webcastdeatils?.dkbmed_link);
              },
            )}
          </View>
        );
      }

      if (webcastdeatils?.button_redirect_text == "redirect_creditvault") {
        return renderPrimaryButton(
          "Add Credits",
          () => {
            navigation.navigate("AddCredits", { mainAdd: creditData });
          },
        );
      }

      if (webcastdeatils) {
        return (
          <View style={styles.registeredStack}>
            <Text style={styles.registeredNote}>{"You have already registered"}</Text>
            {renderPrimaryButton(
              webcastdeatils?.buttonText || "Continue",
              () => {
                fullAction(webcastdeatils);
              },
            )}
          </View>
        );
      }

      return null;
    }

    if (
      webcastdeatils?.conference_active == 0 &&
      webcastdeatils?.button_redirect_text == "revise_activity"
    ) {
      return renderPrimaryButton(
        "Revise Activity",
        () => {
          navigation.navigate("VideoComponent", { RoleData: videoNavigationData(webcastdeatils) });
        },
      );
    }

    if (webcastdeatils?.conference_active == 0 && webcastdeatils?.bundle_conf_taken_msg) {
      return (
        <View style={styles.bundleBlock}>
          <RenderHTML
            contentWidth={Math.max(width - normalize(32), 220)}
            source={{ html: webcastdeatils?.bundle_conf_taken_msg }}
            tagsStyles={{
              p: styles.bundleMsgText,
            }}
          />
          {webcastdeatils?.bundle_add_cart == "1" ? renderPrimaryButton(
            webcastdeatils?.already_in_cart == 1 ? "Already in cart" : "ADD TO CART",
            () => {
              handleTicketsCheckout();
              setFinalcheck(webcastdeatils?.already_in_cart == 1 ? "doublecart" : "freshcart");
            },
          ) : null}
        </View>
      );
    }

    return null;
  };

  const footerContent = renderFooterContent();
  if (!footerContent) {
    return null;
  }

  return (
    <View style={styles.footerContainer}>
      {footerContent}
    </View>
  );
});

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    flexShrink: 0,
    backgroundColor: '#EAF4FF',
    borderTopWidth: 1,
    borderTopColor: '#C7E0FC',
    paddingHorizontal: normalize(12),
    paddingTop: normalize(10),
    paddingBottom: normalize(14),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: normalize(8),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: normalize(12),
  },
  totalCol: {
    flexShrink: 1,
  },
  totalLabel: {
    fontFamily: Fonts.InterMedium,
    fontSize: 12.5,
    color: '#64748B',
  },
  totalValue: {
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    color: '#0F172A',
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: normalize(8),
  },
  primaryButton: {
    height: normalize(44),
    width: '100%',
    backgroundColor: Colorpath.ButtonColr,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(14),
  },
  rowCtaFlex: {
    flex: 1,
    width: undefined,
    paddingHorizontal: normalize(10),
  },
  singleCtaFlex: {
    flex: 0,
    width: undefined,
    minWidth: normalize(160),
  },
  registerButton: {
    flex: 0,
    width: undefined,
    minWidth: normalize(150),
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
  primaryButtonText: {
    color: Colorpath.white,
    fontSize: 14.5,
    fontFamily: Fonts.InterSemiBold,
  },
  secondaryButton: {
    height: normalize(44),
    flex: 1.3,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: Colorpath.ButtonColr,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
  },
  secondaryButtonText: {
    color: Colorpath.ButtonColr,
    fontSize: 13,
    fontFamily: Fonts.InterSemiBold,
  },
  registeredStack: {
    width: '100%',
    gap: normalize(8),
  },
  registeredNote: {
    fontFamily: Fonts.InterSemiBold,
    color: '#0F172A',
    fontSize: 13.5,
    textAlign: 'center',
  },
  bundleBlock: {
    gap: normalize(8),
  },
  bundleMsgText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 13.5,
    color: '#0F172A',
    marginVertical: 0,
  },
});

/**
 * Statewebcast checkout default export.
 *
 * @returns {*}
 */
export default StatewebcastCheckout;
