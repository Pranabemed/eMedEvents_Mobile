import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import SearchIcn from 'react-native-vector-icons/Ionicons';
import IconSh from 'react-native-vector-icons/Feather';
import showErrorAlert from '../Utils/Helpers/Toast';
import Share from 'react-native-share';
import constants from '../Utils/Helpers/constants';

const PageHeader = ({ nol, search, setSearch, title, onBackPress, avoid, sharetrue, searchPress, cartcount, cartHand }) => {
  console.log(cartcount, "fdgjhjfdghjh");

  const handleSearch = () => {
    if (searchPress) {
      const baseUrl = constants.BASE_URL == "https://newdev.emedevents.com" ?'https://www.emedevents.com/online-cme-courses/webcasts' : "https://v2.emedevents.com/online-cme-courses/webcasts";
      const endpoint = `${baseUrl}/${searchPress}`; // ✅ append searchPress to URL dynamically

      const options = {
        title: "Share ConferenceURL",
        message: "Check out this ConferenceURL >>! ",
        url: endpoint,
      };

      Share.open(options)
        .then((res) => {
          console.log("Share Success:", res);
        })
        .catch((err) => {
          if (err) console.log("Share Error:", err);
        });
    }
  };

  console.log(search, "search=========", "https://v2.emedevents.com/online-cme-courses/webcasts");

   return (
    sharetrue ? (
      <View style={{
        height: normalize(40),
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignContent: "space-evenly",
        paddingHorizontal: normalize(10)
      }}>
        {/* Back arrow and title container */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
          {!avoid && (
            <TouchableOpacity 
              onPress={onBackPress} 
              style={{ marginRight: normalize(5) }}
              delayPressIn={0}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowIcons name="keyboard-arrow-left" size={35} color={Colorpath.black} />
            </TouchableOpacity>
          )}
          <Text
            numberOfLines={1}
            style={{
              fontFamily: Fonts.InterBold,
              fontSize: 18,
              color: "#000000",
              marginLeft: avoid ? normalize(15) : normalize(3),
              flexShrink: 1,
              fontWeight: "bold"
            }}
          >
            {title}
          </Text>
        </View>

        {/* Share Icon */}
        <Pressable 
          onPress={handleSearch} 
          style={{ marginTop: normalize(10), width: normalize(35) }}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSh name="share-2" size={24} color={"#000000"} />
        </Pressable>

        {/* Cart Icon with Badge */}
        <Pressable
          onPress={cartHand}
          style={{
            marginTop: normalize(3),
            width: normalize(35),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={{ position: 'relative' }}>
            <IconSh name="shopping-cart" size={25} color={"#000000"} />
            {cartcount ? cartcount == 0 ? <></> : (
              <View style={{
                position: 'absolute',
                top: -5,
                right: -5,
                height: normalize(13),
                width: normalize(13),
                borderRadius: normalize(13),
                backgroundColor: "#008000",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Text style={{
                  fontFamily: Fonts.InterBold,
                  fontSize: 8,
                  color: "#FFFFFF"
                }}>
                  {cartcount}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    ) : (
      <View style={{
        height: normalize(40),
        width: normalize(340),
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: normalize(3)
      }}>
        {/* Back arrow and title container */}
        <TouchableOpacity 
          onPress={onBackPress} 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {!avoid && (
            <ArrowIcons name="keyboard-arrow-left" size={30} color={Colorpath.black} />
          )}
          <Text
            numberOfLines={nol == "yes" ? 2 : 1}
            style={{
              fontFamily: Fonts.InterBold,
              fontSize: 18,
              color: "#000000",
              marginLeft: avoid ? normalize(15) : normalize(3),
              flexShrink: 1,
              bottom: 1,
              fontWeight: "bold"
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>

        {/* Search Icon */}
        {search && (
          <TouchableOpacity 
            onPress={() => { setSearch(true); }} 
            style={{ paddingLeft: normalize(5) }}
            delayPressIn={0}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SearchIcn name="search" size={23} color={Colorpath.black} />
          </TouchableOpacity>
        )}
      </View>
    )
  );
};

export default PageHeader;
