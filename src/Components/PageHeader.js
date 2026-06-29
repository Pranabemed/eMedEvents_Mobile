import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import normalize from '../Utils/Helpers/Dimen';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import SearchIcn from 'react-native-vector-icons/Ionicons';
import IconSh from 'react-native-vector-icons/Feather';
import showErrorAlert from '../Utils/Helpers/Toast';
import Share from 'react-native-share';
import constants from '../Utils/Helpers/constants';

/**
 * Reusable PageHeader component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const PageHeader = ({ nol, search, setSearch, title, onBackPress, avoid, sharetrue, searchPress, cartcount, cartHand, hideCart = false }) => {
  const navigation = useNavigation();
  const cleanTitle = (title || '').replace(/\*/g, '').toLowerCase().trim();

  const placeholders = useMemo(() => [
    "Search for CME/CE courses",
    "Search for your state required courses ",
    "Search for topic",
    "Search for specialty",
    "Search for medical conferences",
    "Search for conferences by location "
  ], []);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);
  const isPaymentOrCheckout = cleanTitle === 'payment' || 
                              cleanTitle === 'checkout' || 
                              cleanTitle.includes('payment') || 
                              cleanTitle.includes('checkout') ||
                              cleanTitle.includes('profession') ||
                              cleanTitle.includes('specialty') ||
                              cleanTitle.includes('speciality') ||
                              cleanTitle.includes('specialities') ||
                              cleanTitle.includes('state') ||
                              cleanTitle.includes('country') ||
                              cleanTitle.includes('city') ||
                              cleanTitle.includes('medical license state');

  console.log(cartcount, "fdgjhjfdghjh");

  const handleSearch = () => {
    if (searchPress) {
      const websiteBaseUrl = constants.BASE_URL == "https://newdev.emedevents.com"
        ? 'https://www.emedevents.com'
        : 'https://v2.emedevents.com';
      const normalizedConferenceUrl = String(searchPress || '').trim();
      const endpoint = /^https?:\/\//i.test(normalizedConferenceUrl)
        ? normalizedConferenceUrl
        : `${websiteBaseUrl}/${normalizedConferenceUrl.replace(/^\/+/, '')}`;

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
          {!isPaymentOrCheckout ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("HeaderSearch")}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: normalize(5),
                height: normalize(32),
                flex: 1,
                marginRight: normalize(10),
                paddingHorizontal: normalize(8),
                backgroundColor: '#F5F5F5',
                gap: normalize(5)
              }}
            >
              <SearchIcn name="search" size={16} color="#AAAAAA" />
              <Text 
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.InterRegular,
                  fontSize: 14,
                  color: '#AAAAAA',
                  flex: 1
                }}
              >
                {placeholders[placeholderIndex]}
              </Text>
            </TouchableOpacity>
          ) : (
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
          )}
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
        {!hideCart ? (
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
        ) : null}
      </View>
    ) : (
      <View style={{
        height: normalize(40),
        width: '100%',
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: normalize(10)
      }}>
        {/* Back arrow and title container / search box */}
        {!isPaymentOrCheckout && !search ? (
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
                <ArrowIcons name="keyboard-arrow-left" size={30} color={Colorpath.black} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate("HeaderSearch")}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: normalize(5),
                height: normalize(32),
                flex: 1,
                marginRight: 0,
                paddingHorizontal: normalize(8),
                backgroundColor: '#F5F5F5',
                gap: normalize(5)
              }}
            >
              <SearchIcn name="search" size={16} color="#AAAAAA" />
              <Text 
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.InterRegular,
                  fontSize: 14,
                  color: '#AAAAAA',
                  flex: 1
                }}
              >
                {placeholders[placeholderIndex]}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
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
        )}

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
