import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { addtoCartWebcastRequest, saveTicketAddRequest } from '../../Redux/Reducers/WebcastReducer';
const StatewebcastAddTocart = ({ 
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
  isBundleAddToCart 
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
      connectionrequest()
        .then(() => {
          dispatch(saveTicketAddRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err)
        })
    }
  }, [webcastdeatils, dispatch]);

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

  // Use useEffect to handle side effects instead of putting them in render
  useEffect(() => {
    if (WebcastReducer.status == 'WebCast/saveTicketAddSuccess') {
      if (trackFlow == "singlecart") {
        singleAddtoCart();
      } else if (trackFlow == "doublecart") {
        handleAddtoCart();
      }
    }
  }, [WebcastReducer.status, trackFlow, singleAddtoCart, handleAddtoCart]);

  useEffect(() => {
    if (WebcastReducer.status == 'WebCast/addtoCartWebcastRequest') {
      setAddtocartload(true);
    }
  }, [WebcastReducer.status, setAddtocartload]);

  useEffect(() => {
    if (WebcastReducer.status == 'WebCast/addtoCartWebcastSuccess') {
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
    
    if (WebcastReducer.status == 'WebCast/addtoCartWebcastFailure') {
      setAddtocartload(false);
    }
  }, [WebcastReducer.status, WebcastReducer?.addtoCartWebcastResponse, WebcastReducer?.saveTicketAddResponse, setAddtocartload, nav, webcastdeatils, urlneed]);

  // Determine if we should show the Download Catalog button
  const shouldShowDownloadCatalog = webcastdeatils?.organizerName == "eMedEd, Inc." ||
    webcastdeatils?.organizerName == "eMedEvents Corporation" ||
    webcastdeatils?.organizerName == "eMedEd";

  const getButtonWidth = () => {
    if (shouldRenderAddToCartAndDownload) {
      return shouldShowDownloadCatalog ? normalize(290) : normalize(290);
    }
    return normalize(286);
  };

  return (
    <>
      {shouldRenderAddToCartAndDownload ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
          }}>
          <Buttons
            onPress={() => {
              handleTicketsCart();
              setTrackFlow("singlecart");
            }}
            height={normalize(45)}
            width={getButtonWidth()}
            backgroundColor={Colorpath.white}
            borderRadius={normalize(9)}
            text="Add To Cart"
            color={"#000000"}
            fontSize={16}
            fontFamily={Fonts.InterSemiBold}
            borderWidth={0.5}
            borderColor={"#000000"}
          />
          {shouldShowDownloadCatalog && shouldRenderAddToCartAndDownload && (
            // Uncomment if you need the Download Catalog button
            // <Buttons
            //   onPress={() => {
            //     setDownlinkdt(!downlinkdt);
            //   }}
            //   height={normalize(45)}
            //   width={normalize(145)}
            //   backgroundColor={Colorpath.white}
            //   borderRadius={normalize(9)}
            //   text="Download Catalog"
            //   color={Colorpath.ButtonColr}
            //   fontSize={16}
            //   fontFamily={Fonts.InterSemiBold}
            //   borderWidth={0.5}
            //   borderColor={Colorpath.ButtonColr}
            // />
            <></>
          )}
        </View>
      ) : !isBundleAddToCart && shouldShowDownloadCatalog ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
          }}>
          {/* Uncomment if you need the Download Catalog button */}
          {/* <Buttons
            onPress={() => {
              setDownlinkdt(!downlinkdt);
            }}
            height={normalize(45)}
            width={normalize(299)}
            backgroundColor={Colorpath.white}
            borderRadius={normalize(9)}
            text="Download Catalog"
            color={Colorpath.ButtonColr}
            fontSize={16}
            fontFamily={Fonts.InterSemiBold}
            borderWidth={0.5}
            borderColor={Colorpath.ButtonColr}
          /> */}
        </View>
      ) : null}

      {isBundleAddToCart && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
          }}>
          <Buttons
            onPress={() => {
              handleTicketsCart();
              setTrackFlow("doublecart");
            }}
            height={normalize(45)}
            width={normalize(286)}
            backgroundColor={Colorpath.white}
            borderRadius={normalize(9)}
            text="Add To Cart"
            color={"#000000"}
            fontSize={16}
            fontFamily={Fonts.InterSemiBold}
            borderWidth={0.5}
            borderColor={"#000000"}
          />
          {shouldShowDownloadCatalog && (
            // Uncomment if you need the Download Catalog button
            // <Buttons
            //   onPress={() => {
            //     setDownlinkdt(!downlinkdt);
            //   }}
            //   height={normalize(45)}
            //   width={normalize(145)}
            //   backgroundColor={Colorpath.white}
            //   borderRadius={normalize(9)}
            //   text="Download Catalog"
            //   color={Colorpath.ButtonColr}
            //   fontSize={16}
            //   fontFamily={Fonts.InterSemiBold}
            //   borderWidth={0.5}
            //   borderColor={Colorpath.ButtonColr}
            // />
            <></>
          )}
        </View>
      )}
    </>
  );
}

export default StatewebcastAddTocart;