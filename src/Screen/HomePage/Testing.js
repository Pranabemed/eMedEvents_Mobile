import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ImageBackground, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
const parseHtmlContent = (htmlContent) => {
  const titleMatch = htmlContent.match(/<h2 class='orange-color'>(.*?)<\/h2>/i);
  const dateMatch = htmlContent.match(/<p class='paratex sliderthreecredits[^>]*'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
  const locationMatch = htmlContent.match(/<p class='d-flex credits'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
  const creditMatch = htmlContent.match(/<p[^>]*>\s*<img[^>]*credits_orange_icon[^>]*>?\s*([^<]+)<\/p>/i);
  let content = [];
  if (dateMatch) {
    content.push({ date: dateMatch[1].trim() });
  }
  if (locationMatch && !content.some(item => item.location)) {
    content.push({ location: locationMatch[1].trim() });
  }
  if (creditMatch && !content.some(item => item.credit) && !content.some(item => item.location === creditMatch[1].trim())) {
    content.push({ credit: creditMatch[1].trim() });
  }
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Title Unavailable',
    content: content,
  };
};
const BannerComponent = ({ htmlContent }) => {
  const [htmlStructure, setHtmlStructure] = useState({ title: '', content: [] });

  useEffect(() => {
    const parsedData = parseHtmlContent(htmlContent);
    setHtmlStructure(parsedData);
  }, [htmlContent]);
  console.log(htmlStructure?.content?.length, "html--------")

  return (
    htmlStructure.title && htmlStructure.content.some(item => item.date || item.location || item.credit) ? (
      <View style={{ paddingHorizontal: normalize(5), paddingVertical: normalize(10) }}>
      <ImageBackground
          source={Imagepath.HomeUser}
          style={[styles.imageBackground, { paddingVertical: normalize(15), paddingHorizontal: normalize(10), borderRadius: 10 }]}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="stretch"
      >
          <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
              <Text style={styles.courseTitle}> {htmlStructure?.title}</Text>
              {/* <Text style={styles.courseProvider}>{"By PEM Courses"}</Text> */}
              {htmlStructure.content.map((item, idx) => (<View style={styles.infoContainer}>
                {item?.date &&  <View style={styles.infoRow}>
                      <Icon name="access-time" size={20} color="#FFFFFF" />
                      <Text style={styles.infoText}>{item?.date}</Text>
                  </View>}
                 
                  {item?.location && <View style={styles.infoRow}>
                      <Icon name="location-on" size={20} color="#FFFFFF" />
                      <Text style={styles.infoText}>{item?.location}</Text>
                  </View>}
                  {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
                      <View style={{
                          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                          width: normalize(50),
                      }}>
                          <Icon name="location-on" size={20} color="#FFFFFF" />
                          <Text style={styles.infoText}>{item?.location}</Text>
                      </View>
                      <TouchableOpacity style={styles.iconContainer}>
                          <Icon name="chevron-right" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                  </View> */}
              </View>))}
              
          </View>
      </ImageBackground>
  </View>
    ) : null
  )
};

// Sample usage of BannerComponent
const Testing = () => {
  const bannerHtmlContent = [
    {
      "banner_name": "Global Neurology summit 2024 Mobile",
      "banner_url": "https://v2.emedevents.com/global-neurology-summit-2024/registration#Registrations",
      "banner_img": null,
      "html_content": "<div class='raw-html-embed'><a href='/global-neurology-summit-2024/registration#Registrations' class='text-decoration-none'><div class='homepageslide comprehensivesection innvotions_mental_health'><div class='slideleft'>    <h2 class='orange-color'>Global Neurology Summit 2024</h2><p class='paratex sliderthreecredits d-flex pt-3'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/Calendar_orange_icon.png' alt='Neurology'> Oct 19 - 20, 2024 </p><p class='d-flex credits'>      <img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-27/email_templates/location_orange.png' alt='Neurology'>Anaheim, California</p><p class='d-flex credits'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/credits_orange_icon.png' alt='Live webinar'> 9 AMA PRA Category 1™ Credits | 9 Contact Hours</p><div class='registerbuttonsection mb-4 pt-4 d-flex align-items-center'><button class='btn btn-primary register subscribe-btn mt-n4 mr-3'>Register Now</button><img width='100' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-27/email_templates/Live_Streaming.jpeg' alt='Neurology'></div></div></div></a></div>",
      "id": "640",
      "conference_id": null,
      "banner_type": "Home Page Top"
    },
    {
      "banner_name": "Course Subscription Mobile",
      "banner_url": "https://v2.emedevents.com/comprehensive-cme-ce-course-bundles-for-physicians-nurses",
      "banner_img": "",
      "html_content": "<div class='raw-html-embed'><a href='/comprehensive-cme-ce-course-bundles-for-physicians-nurses' class='text-decoration-none'><div class='homepageslide comprehensivesection_sale save45 align-items-center'><div class='slideleft'><h2 class='def-text-color mb-2 pb-2'>Unlock upto <span class='dark-orange-color'>40% discount</span> and meet your <span class='dark-orange-color'>state mandatory credit requirements</span> with ease!</h2><div class='registerbuttonsection mb-2'><button class='btn btn-primary register mt-n4 '>Enroll Now</button> <span class='subtext'>for a smarter, more efficient way to earn your credits!</span></div></div><div class='slideright pr-4'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/assets/dt/images/Homepage_banner_images/new-year-sale.webp' width='365px' height='320px' alt='Internal Medicine &amp; Primary care'></div></div></a></div>",
      "id": "635",
      "conference_id": "",
      "banner_type": "Home Page Top"
    },
    {
      "banner_name": "Innovations in Mental Health Care Mobile",
      "banner_url": "https://v2.emedevents.com/innovations-in-mental-health-care-cme-live-webinar",
      "banner_img": "",
      "html_content": "<div class='raw-html-embed'><a href='/innovations-in-mental-health-care-cme-live-webinar' class='text-decoration-none'><div class='homepageslide comprehensivesection innvotions_mental_health'><div class='slideleft'><h2 class='orange-color'>Innovations in Mental Health Care</h2><p class='paratex sliderthreecredits d-flex pt-3'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/Calendar_orange_icon.png' alt='innovation'> May 9, 2024 |12:00 pm EST</p><p class='d-flex credits'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/credits_orange_icon.png' alt=''mental health> 4 AMA PRA Category 1™ Credits | 4 Contact Hours</p><div class='registerbuttonsection mb-4 pt-4 d-flex align-items-center'><button class='btn btn-primary register subscribe-btn mt-n4'>Register Now</button><img width='175' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/live-webinar.png' alt='Mental Health Care'></div></div></div></a></div>",
      "id": "636",
      "conference_id": "",
      "banner_type": "Home Page Top"
    },
    {
      "banner_name": "Pediatrics Horizons Unveiled Mobile",
      "banner_url": "https://v2.emedevents.com/pediatric-ho…",
      "banner_img": null,
      "html_content": "<div class='raw-html-embed'><a href='/pediatric-horizons-unveiled-cme-live-webinar' class='text-decoration-none'><div class='homepageslide comprehensivesection innvotions_mental_health'><div class='slideleft'><h2 class='orange-color'>Pediatric Horizons Unveiled: A Journey into Cutting-Edge Care</h2><p class='paratex sliderthreecredits d-flex pt-3'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/Calendar_orange_icon.png' atl='Pediatric Live Webinar'> June 4 - 5, 2024 | 12 pm EST</p><p class='d-flex credits'><img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/credits_orange_icon.png' alt='Live webinar'> 5 AMA PRA Category 1™ Credits | 5 Contact Hours</p><div class='registerbuttonsection mb-4 pt-4 d-flex align-items-center'><button class='btn btn-primary register subscribe-btn mt-n4'>Register Now</button><img width='175' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-02-03/innovation/live-webinar.png' alt='webinar'></div></div></div></a></div>",
      "id": "637",
      "conference_id": "",
      "banner_type": "Home Page Top"
    }
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      {bannerHtmlContent.map((item, index) => (
        <BannerComponent key={index} htmlContent={item.html_content} />
      ))}
    </ScrollView>
  );
};

export default Testing;
const styles = StyleSheet.create({
  imageBackground: {
      height: normalize(170),
      width: normalize(310),
      justifyContent: 'space-between',
      paddingVertical: normalize(15),
      paddingHorizontal: normalize(10),
  },
  courseTitle: {
      fontSize: 24,
      fontFamily: Fonts.InterSemiBold,
      color: '#FFFFFF',
      marginBottom: normalize(4),
  },
  courseProvider: {
      fontSize: 14,
      color: '#FFFFFF',
      marginBottom: 12,
      fontFamily: Fonts.InterMedium,
  },
  infoContainer: {
      flexDirection: 'column',
      marginBottom: normalize(8),
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: normalize(4),
  },
  infoText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginLeft: normalize(6),
      fontFamily: Fonts.InterMedium,
  },
  iconContainer: {
      marginLeft: normalize(5), // aligns icon to the end of the row
      // paddingLeft: normalize(8),
      borderWidth: 2,
      borderColor: "#FFFFFF",
      borderRadius: 20
  },
});