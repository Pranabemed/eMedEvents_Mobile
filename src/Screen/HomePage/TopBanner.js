import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ImageBackground, TouchableOpacity, ScrollView, Alert, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';

const parseHtmlContent = (htmlContent) => {
    const titleMatch = htmlContent.match(/<h2 class='orange-color'>(.*?)<\/h2>/i);
    const dateMatch = htmlContent.match(/<p class='paratex sliderthreecredits[^>]*'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
    const locationMatch = htmlContent.match(/<p class='d-flex credits'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
    const creditMatch = htmlContent.match(/<p[^>]*>\s*<img[^>]*credits_orange_icon[^>]*>?\s*([^<]+)<\/p>/i);
    let content = [];
    if (dateMatch) {
      content.push({ date: dateMatch[1].trim() });
    }
    if (locationMatch) {
        const locationText = locationMatch[1].trim();
        if (/credit/i.test(locationText)) {
          if (!content.some(item => item.credit)) {
            content.push({ credit: locationText });
          }
        } else if (!content.some(item => item.location)) {
          content.push({ location: locationText });
        }
      }
    if (creditMatch && !content.some(item => item.credit) && !content.some(item => item.location === creditMatch[1].trim())) {
      content.push({ credit: creditMatch[1].trim() });
    }
    return {
      title: titleMatch ? titleMatch[1].trim() : 'Title Unavailable',
      content: content,
    };
  };
  const getContentLengthForPagination = (bannerHtmlContent) => {
    return bannerHtmlContent.reduce((count, item) => {
      const parsedData = parseHtmlContent(item.html_content);
      // Increase count only if the parsed content array has any items (not empty)
      if (parsedData.content.length > 0) {
        return count + 1;
      }
      return count;
    }, 0);
  };
  const BannerComponent = ({val,handleNext,setTopbanner,topbanner, htmlContent,bannerHtmlContent }) => {
  
    
    const [htmlStructure, setHtmlStructure] = useState({ title: '', content: [] });
      useEffect(()=>{
        const totalContentLength = getContentLengthForPagination(bannerHtmlContent);
        if(totalContentLength){
             setTopbanner(totalContentLength);
        }
        console.log(totalContentLength,"vtotalContentLength------------------")
      },[bannerHtmlContent])
    useEffect(() => {
      const parsedData = parseHtmlContent(htmlContent);
      setHtmlStructure(parsedData);
    }, [htmlContent]);
  console.log(htmlStructure ,"htmlStructure.content.-----------")
  const dynamicHeight = normalize(120 + htmlStructure.content.length * 25);
  return (
    htmlStructure.title && htmlStructure.content.some(item => item.date || item.location || item.credit) ? (
      <View style={{ paddingHorizontal: normalize(5), paddingVertical: normalize(10) }}>
      <ImageBackground
          source={Imagepath.HomeUser}
          style={[styles.imageBackground, {height:dynamicHeight, paddingVertical: normalize(15), paddingHorizontal: normalize(10), borderRadius: 10 }]}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="stretch"
      >
           <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
          <Text style={styles.courseTitle}>{htmlStructure?.title}</Text>
          {htmlStructure.content.map((item, idx) => (
            <View style={styles.infoContainer} key={idx}>
              {item?.date && (
                <View style={styles.infoRow}>
                  <Icon name="access-time" size={20} color="#FFFFFF" />
                  <Text style={styles.infoText}>{item?.date}</Text>
                </View>
              )}
              
              {item?.location && (
                <View style={styles.infoRow}>
                    <Icon name="location-on" size={20} color="#FFFFFF" />
                    <Text style={styles.infoText}>{item?.location}</Text>
                </View>
              )}
              
              {item?.credit && (
                <View style={[styles.infoRow, { justifyContent: 'space-between' }]}>
                <View style={styles.iconTextRow}>
                <Image source={Imagepath.CreditValut} style={styles.creditIcon} />
                <Text style={[styles.infoText,{width:normalize(200)}]}>{item?.credit}</Text>
                </View>
                {val < bannerHtmlContent.length - 1 &&<TouchableOpacity onPress={handleNext} style={styles.iconContainer}>
                  <Icon name="chevron-right" size={24} color="#FFFFFF" />
                </TouchableOpacity>}
              </View>
              )}
            </View>
          ))}
        </View>
      </ImageBackground>
  </View>
    ) : null
  )
  };

  export default BannerComponent
  const styles = StyleSheet.create({
    imageBackground: {
      width: normalize(310),
      justifyContent: 'space-between',
      paddingVertical: normalize(15),
      paddingHorizontal: normalize(10),
      borderRadius: 10,
    },
    courseTitle: {
      fontSize: 24,
      fontFamily: Fonts.InterSemiBold,
      color: '#FFFFFF',
    },
    infoContainer: {
      flexDirection: 'column',
      paddingVertical:normalize(2)
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconTextRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginLeft: normalize(6),
      fontFamily: Fonts.InterMedium,
    },
    iconContainer: {
      height: normalize(30),
      width:normalize(30),
      borderWidth: 2,
      borderColor: "#FFFFFF",
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    creditIcon: {
      tintColor: Colorpath.white,
      height: normalize(18),
      width: normalize(18),
      resizeMode: "contain",
    },
  });