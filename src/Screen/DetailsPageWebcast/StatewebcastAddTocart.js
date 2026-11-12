/**
 * Statewebcast add tocart screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastAddTocart, getButtonWidth.
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { addtoCartWebcastRequest, saveTicketAddRequest } from '../../Redux/Reducers/WebcastReducer';
import Feather from 'react-native-vector-icons/Feather';

/**
 * Reusable StatewebcastAddTocart component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastAddTocart = ({
  refID,
  urlneed,
  downlinkdt,
  setDownlinkdt,
  webcastdeatils,
  setAddtocartload,
  status,
  WebcastReducer,
  dispatch,
  bundle_conference_id,
  conferenceIDs,
  shouldRenderAddToCartAndDownload,
  nav,
  isBundleAddToCart,
  hideAddToCart = false,
}) => {
  const [trackFlow, setTrackFlow] = useState("");

  // Create memoized callbacks for event handlers
  const handleTicketsCart = useCallback(() => {
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
          dispatch(saveTicketAddRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch, refID]);

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

  // Use useEffect to handle side effects instead of putting them in render
  useEffect(() => {
    if (WebcastReducer?.status == 'WebCast/saveTicketAddSuccess') {
      if (trackFlow == "singlecart") {
        singleAddtoCart();
      } else if (trackFlow == "doublecart") {
        handleAddtoCart();
      }
    }
  }, [WebcastReducer?.status, trackFlow, singleAddtoCart, handleAddtoCart]);

  useEffect(() => {
    if (WebcastReducer?.status == 'WebCast/addtoCartWebcastRequest') {
      setAddtocartload(true);
    }
  }, [WebcastReducer?.status, setAddtocartload]);

  useEffect(() => {
    if (!trackFlow) return;
    if (WebcastReducer?.status == 'WebCast/addtoCartWebcastSuccess') {
      if (WebcastReducer?.addtoCartWebcastResponse?.success == true && WebcastReducer?.saveTicketAddResponse) {
        setAddtocartload(false);
        setTrackFlow("");
        nav.navigate("AddToCart", {
          addtocart: {
            addtocart: "startcallapi",
            coupon: WebcastReducer?.saveTicketAddResponse,
            webcast: webcastdeatils,
            urlneedTake: urlneed
          }
        });
      }
    }

    if (WebcastReducer?.status == 'WebCast/addtoCartWebcastFailure') {
      setAddtocartload(false);
      setTrackFlow("");
    }
  }, [WebcastReducer?.status, WebcastReducer?.addtoCartWebcastResponse, WebcastReducer?.saveTicketAddResponse, setAddtocartload, nav, webcastdeatils, urlneed, trackFlow]);

  // Determine if we should show the Download Catalog button
  const shouldShowDownloadCatalog = webcastdeatils?.organizerName == "eMedEd, Inc." ||
    webcastdeatils?.organizerName == "eMedEvents Corporation" ||
    webcastdeatils?.organizerName == "eMedEd";

  /**
* Returns button width.
* @returns {*}
*/
  const getButtonWidth = () => {
    if (shouldRenderAddToCartAndDownload) {
      return shouldShowDownloadCatalog ? '100%' : '100%';
    }
    return '100%';
  };

  if (hideAddToCart || (!shouldRenderAddToCartAndDownload && !isBundleAddToCart)) {
    return null;
  }

  const nextTrackFlow = isBundleAddToCart ? "doublecart" : "singlecart";
  const isAlreadyInCart = webcastdeatils?.already_in_cart == 1;

  return (
    <View style={styles.ctaContainer}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (isAlreadyInCart) {
            nav.navigate("AddToCart", {
              addtocart: {
                addtocart: "startcallapi",
                coupon: WebcastReducer?.saveTicketAddResponse,
                webcast: webcastdeatils,
                urlneedTake: urlneed
              }
            });
            return;
          }
          handleTicketsCart();
          setTrackFlow(nextTrackFlow);
        }}
        style={[styles.addToCartBtn, !isBundleAddToCart && { width: getButtonWidth() }]}
      >
        <Feather name="shopping-cart" size={16} color={Colorpath.ButtonColr} />
        <Text style={styles.addToCartText}>{isAlreadyInCart ? "Already in cart" : "Add To Cart"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ctaContainer: {
    marginTop: normalize(12),
    width: '100%',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalize(8),
    height: normalize(44),
    width: '100%',
    backgroundColor: '#F4F8FF',
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#C5D8FA',
  },
  addToCartText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 15,
    color: Colorpath.ButtonColr,
  },
});

/**
 * Statewebcast add tocart default export.
 *
 * @returns {*}
 */
export default memo(StatewebcastAddTocart);