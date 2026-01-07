import React from 'react';
import { View, Text } from 'react-native';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { addtoCartWebcastRequest } from '../../Redux/Reducers/WebcastReducer';
const StatewebcastAddTocart = ({urlneed,downlinkdt,setDownlinkdt,webcastdeatils,ticketSave,setAddtocartload,status,WebcastReducer,dispatch,bundle_conference_id,conferenceIDs,shouldRenderAddToCartAndDownload,nav,isBundleAddToCart}) => {
    console.log(ticketSave,"ticketSave23334",webcastdeatils,(webcastdeatils?.organizerName !== "eMedEd, Inc." ||
        webcastdeatils?.organizerName !== "eMedEvents Corporation" ||
        webcastdeatils?.organizerName !== "eMedEd") )
    const handleAddtoCart =()=>{
        let obj ={
            "bundle_conference_id": bundle_conference_id,
            "conference_ids": conferenceIDs
        }
        connectionrequest()
        .then(()=>{
            dispatch(addtoCartWebcastRequest(obj))
        })
        .catch((err)=>{
          showErrorAlert("Please connect to internet")
        })
    }
    const singleAddtoCart =()=>{
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
    }
    if (status == '' || WebcastReducer.status != status) {
        switch (WebcastReducer.status) {
            case 'WebCast/addtoCartWebcastRequest':
                status = WebcastReducer.status;
                setAddtocartload(true);
                break;
            case 'WebCast/addtoCartWebcastSuccess':
                status = WebcastReducer.status;
                console.log("add to cart followed>>>>", WebcastReducer?.addtoCartWebcastResponse?.success == true);
                if(WebcastReducer?.addtoCartWebcastResponse?.success == true){
                    setAddtocartload(false);
                    nav.navigate("AddToCart",{addtocart:{addtocart:"startcallapi",coupon:ticketSave,webcast:webcastdeatils,urlneedTake:urlneed}});
                }
                break;
            case 'WebCast/addtoCartWebcastFailure':
                status = WebcastReducer.status;
                setAddtocartload(false);
                break;
        }
    }
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
                    singleAddtoCart();
                }}
                height={normalize(45)}
                width={(webcastdeatils?.organizerName !== "eMedEd, Inc." &&
                    webcastdeatils?.organizerName !== "eMedEvents Corporation" &&
                    webcastdeatils?.organizerName !== "eMedEd") ? normalize(290):normalize(290)}
                backgroundColor={Colorpath.white}
                borderRadius={normalize(9)}
                text="Add To Cart"
                color={"#000000"}
                fontSize={16}
                fontFamily={Fonts.InterSemiBold}
                borderWidth={0.5}
                borderColor={"#000000"}
            />
            {(webcastdeatils?.organizerName === "eMedEd, Inc." ||
                webcastdeatils?.organizerName === "eMedEvents Corporation" ||
                webcastdeatils?.organizerName === "eMedEd") && (<></>
                // <Buttons
                //     onPress={() => {
                //       setDownlinkdt(!downlinkdt);
                //     }}
                //     height={normalize(45)}
                //     width={normalize(145)}
                //     backgroundColor={Colorpath.white}
                //     borderRadius={normalize(9)}
                //     text="Download Catalog"
                //     color={Colorpath.ButtonColr}
                //     fontSize={16}
                //     fontFamily={Fonts.InterSemiBold}
                //     borderWidth={0.5}
                //     borderColor={Colorpath.ButtonColr}
                // />
            )}
        </View>
    ) : (!isBundleAddToCart &&
        (webcastdeatils?.organizerName === "eMedEd, Inc." ||
            webcastdeatils?.organizerName === "eMedEvents Corporation" ||
            webcastdeatils?.organizerName === "eMedEd")) && (<></>
        // <View
        //     style={{
        //         flexDirection: 'row',
        //         justifyContent: 'space-between',
        //         alignContent: 'space-between',
        //         paddingHorizontal: normalize(10),
        //         paddingVertical: normalize(10),
        //     }}>
        //     <Buttons
        //         onPress={() => {
        //             setDownlinkdt(!downlinkdt);
        //         }}
        //         height={normalize(45)}
        //         width={normalize(299)}
        //         backgroundColor={Colorpath.white}
        //         borderRadius={normalize(9)}
        //         text="Download Catalog"
        //         color={Colorpath.ButtonColr}
        //         fontSize={16}
        //         fontFamily={Fonts.InterSemiBold}
        //         borderWidth={0.5}
        //         borderColor={Colorpath.ButtonColr}
        //     />
        // </View>
    )}

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
                    handleAddtoCart();
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
            {(webcastdeatils?.organizerName === "eMedEd, Inc." ||
                webcastdeatils?.organizerName === "eMedEvents Corporation" ||
                webcastdeatils?.organizerName === "eMedEd") && (<></>
                // <Buttons
                //     onPress={() => {
                //         setDownlinkdt(!downlinkdt);
                //     }}
                //     height={normalize(45)}
                //     width={normalize(145)}
                //     backgroundColor={Colorpath.white}
                //     borderRadius={normalize(9)}
                //     text="Download Catalog"
                //     color={Colorpath.ButtonColr}
                //     fontSize={16}
                //     fontFamily={Fonts.InterSemiBold}
                //     borderWidth={0.5}
                //     borderColor={Colorpath.ButtonColr}
                // />
            )}
        </View>
    )}
</>

  );
}

export default StatewebcastAddTocart;
