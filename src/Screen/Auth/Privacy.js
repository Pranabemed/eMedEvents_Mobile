import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, StyleSheet, Linking, Platform, TouchableOpacity, View } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context'
const PrivacyPolicy = (props) => {
    const openEmail = () => {
        Linking.openURL('mailto:legal@emedevents.com');
    };

    const openPhone = () => {
        Linking.openURL('tel:1-800-828-2059');
    };

    const openFTC = () => {
        Linking.openURL('https://www.emedevents.com/');
    };

    const openEDPS = () => {
        Linking.openURL('https://edps.europa.eu/data-protection/our-role-supervisor/complaints_en');
    };
    const PrvBack = () => {
        props.navigation.goBack();
    }
    useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title={"Privacy Policy"}
                        onBackPress={PrvBack}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={"Privacy Policy"}
                            onBackPress={PrvBack}
                        />
                    </View>
                )}
                <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }} style={styles.scrollView}>
                    {/* <Text style={styles.title}>Privacy Policy</Text> */}

                    <Text style={styles.paragraph}>
                        Welcome to the eMedEvents Corporation (hereinafter <Text style={styles.subHeader}>"eMedEvents</Text>," <Text style={styles.subHeader}>"we"</Text> or <Text style={styles.subHeader}>"us"</Text>) website at <Text onPress={openFTC} style={{color:Colorpath.ButtonColr}}>emedevents.com</Text> (including all content under the "emedevents.com" domain name, referred to herein as the <Text style={styles.subHeader}>"Website"</Text>). This notice (<Text style={styles.subHeader}>"Privacy Policy"</Text>) is included with and supplements our Website <Text style={styles.subHeader}>Terms of Service.</Text> It also applies to our software application that can be downloaded from app stores (including all content, referred to herein as the <Text style={styles.subHeader}>"App"</Text>). The services that we may provide to you via the Website or the App are referred to herein and in the Terms of Service document as the <Text style={styles.subHeader}>"Services."</Text> This Privacy Policy explains our online and App information collection and use practices and the choices you can make about the way we use such information. It is important that you take the time to read and understand this Privacy Policy so that you can appreciate how we use your personal information. REMEMBER IF YOU USE OR ACCESS THE WE Website, APP, OR SERVICES, YOU AGREE TO THIS PRIVACY POLICY. AS WE UPDATE THE WEBSITE OR APP OR EXPAND OUR SERVICES, WE MAY CHANGE THIS PRIVACY POLICY UPON NOTICE TO YOU; HOWEVER, PLEASE REVIEW IT FROM TIME TO TIME. <Text style={styles.subHeader}>
                        For users that are residents of European countries, this Privacy Policy is subject to the provisions of the General Data Protection Regulation ("GDPR") and other applicable privacy laws in European countries. In such a case, we are a "Data Controller" and you are a "Data Subject" with certain protected privacy rights concerning your "Personal Data." Your Personal Data may identify you as a person and thus is often referred to as Personally Identifiable Information ("PII").
                    </Text>
                    </Text>
                    <Text style={styles.sectionHeader}>1. Who collects your information on our website and app?</Text>
                    <Text style={styles.paragraph}>
                        We do. We collect information from you on the Website and App, and <Text style={styles.subHeader}>we are responsible for the protection of your information.</Text>
                    </Text>

                    <Text style={styles.sectionHeader}>2. What information do we collect?</Text>
                    <Text style={styles.paragraph}>
                        A. Requested Information.On various pages on the Website or App, we may request specific PII about you in order to register you for an account to use our Services, add you to our email list, facilitate your payments for Services, or fulfill your requests for information. You may choose not to provide your PII, but then you might not be able to take advantage of some of the features of our Services. We only collect basic Personal Data about you that does not include any special types of information (e.g., health-related) as defined in the GDPR. The types of Personal Data we collect and save include:
                    </Text>

                    <Text style={styles.listItem}>
                        • Contact and account registration information such as name, email address, physical address, phone number, medical or other healthcare practice name or other business name, business URL, and your medical or other healthcare specialty or other credentials if applicable;
                    </Text>
                    <Text style={styles.listItem}>
                        • Financial information such as credit card number, name, CVV code, or date of expiration, which we pass through to a payment processor and do not retain;
                    </Text>
                    <Text style={styles.listItem}>
                        • Information that you provide in using our Services, such as courses taken, program feedback, instructor evaluations, comments or other messages;
                    </Text>
                    <Text style={styles.listItem}>
                        • Technical information collected in our logs (e.g., your IP address, page URLs and timestamp, etc.); and
                    </Text>
                    <Text style={styles.listItem}>
                        • Device information such as mobile phone provider associated with the device you are using to access the Services, the type of device and its operating system, the pages or features accessed most frequently, calls and messages placed through the Services, and how pages or features of the Services are used, search terms entered, and similar analytics about the use of the Services.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. Aggregate Information.We may also collect anonymous, non-identifying, and aggregate information such as the type of browser you are using, device type, the operating system you are using, and the domain name of your Internet service provider.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. Location Information.When the Services you request requires location-based information, the Website or App may need to use GPS or other location-based services to identify your physical location. With your consent, the Website or App may access your device's calendar, contacts, call history, camera roll, or other device-stored information in order to facilitate and provide the Services.
                    </Text>

                    <Text style={styles.sectionHeader}>3. Why is my information being collected?</Text>
                    <Text style={styles.paragraph}>
                        We need to collect your Personal Data so that we can provide the Services, respond to your requests for information and programs, add you to our emailing lists, and process your requests for access to and payment for our Services. We also collect aggregate information to help us better design the Website and App. We collect log information for monitoring purposes to help us to diagnose problems with our servers, administer the Website and App, calculate usage levels, and otherwise provide services to you.
                    </Text>
                    <Text style={styles.sectionHeader}>4. How do we use the information we collect?</Text>
                    <Text style={styles.paragraph}>A. We use the Personal Data you provide for the purposes for which you have submitted it, including:</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>• Responding To Your Inquiries and Fulfilling Your Requests.</Text> We may use your PII to respond to your inquiries and to fulfill your requests for information and for programming.</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>• Creating and Maintaining Your User Account.</Text> We use your PII to create and maintain an account for you to allow you to purchase and use the Services we make available on the Website and through the App.</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>• Subscribing To and Paying For Our Services.</Text>We use your PII to add your subscriptions to our Services and process your payment for these Services.</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>•Communicating With You About Our Services.</Text>We may use your PII to send you information about new Services and other items that may be of interest to you. This may include advertisements and other notifications about programs that will provide continuing education credits in your specialty or in your locality. You may opt out of receiving these messages by responding to the link provided in each email we send you, by limiting notifications you may receive through the App's functionality, or otherwise, as we may instruct you within the message.</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>•Improving Our Services.</Text>We may use your information to make our platform more stable and user-friendly, to analyze Services issues, and to develop new marketing programs relating to the Services.</Text>
                    <Text style={styles.listItem}><Text style={styles.subHeader}>• Sending Administrative Emails.</Text>We may use your PII to send you emails, texts, or other messages to: (a) confirm your account and your other PII, (b) process your transactions to purchase our Services, (c) provide you with information regarding the Website or App, or (d) inform you of changes to this Privacy Policy, our Terms of Service, or our other policies.</Text>
                    <Text style={styles.paragraph}>B. We may use anonymous information that we collect to improve the design and content of our Website and App and to enable us to personalize how you experience our Service.  We also may use this information in the aggregate to analyze how our Website and App are used, analyze industry trends, as well as to offer you programs or services that may be of interest to you. </Text>
                    <Text style={styles.sectionHeader}>5. Do we share your personal data?</Text>
                    <Text style={styles.paragraph}>In general, we will not share your Personal Data except: (a) for the purposes for which you provided it; (b) with your consent; (c) as may be required by law (e.g., in response to a court order or subpoena, or in response to a law enforcement agency request); (d) as we think necessary to protect our organization or others from injury (e.g., when we believe that someone is causing, or is about to cause, injury to or interference with the rights or property of another); (e) on a confidential basis with persons or organizations with whom we contract to carry out internal site operations or to enable us to render Services to you; or (f) on a confidential basis with persons or organizations with whom we contract to provide continuing medical education to you, or otherwise as necessary for them to render the Services to you. Additionally, either a third party provider or we may input and use your Personal Information (i) in continuing medical education learning management systems in order to register and certify your fulfillment of course requirements, or (ii) in other program management systems, for example, to issue a ticket to you for a conference or an individual program.</Text>
                    <Text style={styles.notePar}>NOTE: In accordance with the guidelines from ACCME, ANCC, ACPE, and other accreditation bodies, eMedEvents does not share or sell participants' contact information to ACCME, ANNC, ACPE, and other accreditation bodies-defined ineligible entities or any third parties. However, we share participant information with the CME/CE providers who have listed their activities on our platform to maintain an attendee roster, as required for their records and accreditation compliance. This commitment reflects our dedication to protecting participant privacy and adhering to accreditation body guidelines.</Text>
                    <Text style={styles.paragraph}>With your consent, we may share your personal data with Exhibitors & Sponsors of programs. These business partners may include medical device and pharmaceutical companies. You may opt in or out of data sharing with these partners in your profile settings anytime.</Text>
                    <Text style={styles.paragraph}>We may also share aggregate information with others, including affiliated and non-affiliated organizations.  </Text>
                    <Text style={styles.paragraph}>Finally, we may transfer your Personal Data to our successor-in-interest in the event of an acquisition, sale, merger, or bankruptcy.</Text>
                    <Text style={styles.sectionHeader}>6. Are there other ways my personal data could be shared?</Text>
                    <Text style={styles.paragraph}>You may elect to share certain Personal Data with individuals or with the public via your use of the Website or App. In this case, you will control such sharing via the settings that we provide. For example, either the Website or App may make it possible for you to publicly share information via social media such as Facebook or Twitter. Be aware that when you choose to share information with friends, public officials, your employer, or with the public at large, you may be disclosing sensitive information or information from which sensitive information can be inferred. Always use caution when sharing information through the Website or App. You understand and agree that we are not responsible for any consequences of your sharing of information through and beyond the Website or App.</Text>
                    <Text style={styles.sectionHeader}>7. How can you access and control your information?</Text>
                    <Text style={styles.paragraph}>After registering for an account on the Website or App, you may log in to the account and edit your Personal Data in your profile. For instructions on how you can further access your Personal Data that we have collected or how to correct errors in such information, please send an email to <Text style={styles.link} onPress={openEmail}>legal@emedevents.com</Text> or call us at <Text onPress={openPhone} style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000" }}>1-800-828-2059.</Text> </Text>
                    <Text style={styles.paragraph}>We will also promptly stop using your information and remove it from our servers and database at any time upon your request. To protect your privacy and security, we will take reasonable steps to help verify your identity before granting access, making corrections, or removing your information.</Text>
                    <Text style={styles.paragraph}>If you are a resident of a European nation and believe that we have misused your Personal Data, you have the right to contact the European Data Protection Supervisor ("EDPS") or your national equivalent to ask for advice on how to exercise your rights or to ask for an investigation of a complaint. For more information for European Union residents, see <Text onPress={openEDPS} style={{ color: Colorpath.ButtonColr }}>EDPS Complaints.</Text></Text>

                    <Text style={styles.sectionHeader}>8. How do we store and protect your information?</Text>
                    <Text style={styles.paragraph}>A. After receiving your Personal Data, we will store it on our computer servers for future use. We have physical, electronic, and managerial procedures in place to safeguard and help prevent unauthorized access, maintain data security, and correctly use the information we collect. Unfortunately, no data transmission or data storage solution can ever be completely secure. As a result, although we take industry-standard steps to protect your information (e.g., strong encryption when data is in transit or in storage), we cannot ensure or warrant the security of any information you transmit to or receive from us or that we store on our or our service providers' systems.</Text>
                    <Text style={styles.paragraph}>B. If you are visiting the Website or using the App from outside the USA, you understand that your connection will be through and to servers located in the USA, and the information you provide will be securely stored in our web servers and internal systems located within the USA. By accessing or using the Services or otherwise providing information to us, you consent to the processing, transfer, and storage of information in and to the USA, where you may not have the same rights and protections as you do under local law.</Text>
                    <Text style={styles.paragraph}>C. We store Personal Data for as long as reasonably required for its purpose or for any additional period required by law (if any). Account information is deleted when you or when we delete your account. We may store information longer for legitimate business reasons (for example, Personal Data may remain in backups for a reasonable period of time), or as legally required. Otherwise, we store your Personal Data until you request us to remove it from our servers. Except as required by law, we store our logs and other technical records indefinitely but will dispose of them in accordance with our document retention policy as in effect from time to time.</Text>
                    <Text style={styles.sectionHeader}>9. How do we use cookies and other network technologies?</Text>
                    <Text style={styles.paragraph}>A. To enhance your online experience with us, our web pages may presently or in the future use "cookies."  Among other things, we use cookies to help us tailor our recommendations for courses and programs to the professional interests and certification requirements of our users and to the location of the user's practice. Cookies are text files that our web server may place on your hard disk to store your preferences.  We may use session, persistent, first-party, and third-party cookies. Cookies, by themselves, do not tell us your email address or other PII unless you choose to provide this information to us.  Once you choose to provide PII, however, this information may be linked to the data stored in a cookie. You can set your browser to notify you when you receive a cookie, providing you with as much control as you wish as to the decision to accept/reject the cookie and deletion of the cookie upon leaving our Service. Please note, however, that if your browser does not accept cookies, you may not be able to take advantage of all of the features of our Service.</Text>
                    <Text style={styles.paragraph}>B. We or our service providers may also use "pixel tags," "web beacons," "clear GIFs," "embedded links," and other commonly-used information-gathering tools in connection with some Website or App pages and HTML-formatted email messages. We use these tools for such purposes as compiling aggregate statistics about Website or App usage and response rates. A pixel tag is an electronic image (often a single pixel) that is ordinarily not visible to you and may be associated with cookies on your hard drive. Pixel tags allow us and our service providers to count users who have visited certain pages of the Website, to deliver customized services, and to help determine the effectiveness of our Website, App, and Services. When used in HTML-formatted email messages, pixel tags can inform the sender of the email whether and when the email has been opened.</Text>
                    <Text style={styles.paragraph}>C. As you use the Internet, you leave a trail of electronic information at each Website you visit. This information, which is sometimes referred to as "clickstream data", can be collected and stored by a website's server.  Clickstream data can reveal the type of computer and browsing software you use and the address of the Website from which you linked to the Website.  We may use clickstream data as a form of non-PII to determine how much time visitors spend on each page of our Website, how visitors navigate through the Website, and how we may tailor our web pages to better meet the needs of visitors. We will only use this information to improve our Website.</Text>
                    <Text style={styles.paragraph}>D. Many modern web browsers give you the option to send a "Do Not Track" signal to the websites you visit, indicating that you do not wish to be tracked. At this time, the Website and Services do not specifically respond to "Do Not Track" signals.</Text>
                    <Text style={styles.sectionHeader}>10. Collection of information by others</Text>
                    <Text style={styles.paragraph}>We may provide links to certain third-party websites that you may click-on from our Website. Please check the privacy policies of these other websites to learn how they collect, use, store and share information that you may submit to them or that they collect.</Text>
                    <Text style={styles.sectionHeader}>11. Children and young people's information</Text>
                    <Text style={styles.paragraph}>We do not knowingly collect any information from any minors, and we comply with all applicable privacy laws, including the GDPR, CCPA, USA Children's Online Privacy Protection Act ("COPPA") and associated Federal Trade Commission ("FTC") rules for collecting Personal Data from minors. Please see the FTC's Website (www.ftc.gov) for more information. Our Services will not knowingly accept Personal Data from anyone under 13 years old in violation of applicable laws without the consent of a parent or guardian.  In the event that we discover that a child under the age of 13 has provided PII to us without parental consent, we will make efforts to delete the child's information in accordance with the COPPA. If you wish to find out if your child has accessed our Services or wish to remove your child's Personal Data from our servers, please contact us at <Text style={styles.link} onPress={() => Linking.openURL('mailto:legal@emedevents.com.')}>legal@emedevents.com.</Text></Text>
                    <Text style={styles.sectionHeader}>12. California privacy rights</Text>
                    <Text style={styles.paragraph}>The California Consumer Privacy Act ("CCPA") of 2018 enhances privacy rights and consumer protection for residents of California. Under the CCPA, California residents have the rights to: 1) know what Personal Data is being collected about them; 2) know whether their Personal Data is sold or disclosed and to whom; 3) say 'no' to the sale of their Personal Data; 4) access their Personal Data; and 5) not be discriminated against for exercising their privacy rights under the CCPA. California law allows California residents to request information regarding our disclosures in the prior calendar year, if any, of their PII to third parties. To make such a request, please contact us at <Text style={styles.link} onPress={() => Linking.openURL('mailto:legal@emedevents.com')}>legal@emedevents.com</Text> or <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000" }} onPress={() => Linking.openURL('tel:1-800-828-2059')}>1-800-828-2059.</Text>  Please include enough detail for us to locate your file; at a minimum, your name, email, and username, if any. We will attempt to provide you with the requested information within thirty (30) days of receipt. We reserve our right not to respond to requests sent more than once in a calendar year or requests submitted to an address other than the one posted in this notice. Please note that this law does not cover all information sharing. Our disclosure only includes information covered by the law.</Text>
                    <Text style={styles.sectionHeader}>13. Changes to this policy</Text>
                    <Text style={styles.paragraph}>Because our business needs may change over time, we reserve the right to modify this Privacy Policy.  If at any time in the future we plan to use your PII in a way that differs from this Privacy Policy, we will revise this Privacy Policy as appropriate.  In the event of a change to our Privacy Policy, we will email notice of the updated policy to the email address that you provided to us. Your continued use of the Website or App following our notice of changes to this Privacy Policy means you accept such changes.</Text>
                    <Text style={styles.sectionHeader}>14. Our contact information</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions or concerns about this Privacy Policy, please get in touch with us via email at  <Text style={styles.link} onPress={() => Linking.openURL('mailto:legal@emedevents.com')}>legal@emedevents.com</Text>.
                    </Text>

                    <Text style={styles.paragraph}>
                        Copyright ©eMedEvents Corporation. All rights reserved. The Website and the App are protected by the United States and international copyright, trademark, and other applicable laws. This includes the content, appearance, and design of the Website and App, as well as our trademarks, product names, graphics, logos, service names, slogans, colors, and designs. Event organizers, advertisers, and sponsors own their own trademarks and content.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#264092',
        fontWeight:"bold"
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: Fonts.InterBold,
        marginTop: 16,
        marginBottom: 8,
        color: '#000000',
        fontWeight:"bold"
    },
    subHeader: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: Fonts.InterBold,
        color: '#000',
        fontWeight:"bold"
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: Fonts.InterRegular,
        color: "#333",
        fontWeight:"400"
    },
    notePar: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: "Inter-Italic",
        fontStyle:"italic",
        color: "red",
        fontWeight:"400"
    },
    listItem: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: Fonts.InterRegular,
        color: "#333",
        marginLeft: 16,
        marginBottom: 6,
        fontWeight:"400"
    },
    link: {
        color: '#264092',
        textDecorationLine: 'underline',
    },
    note: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        fontStyle: 'italic',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#264092',
    },
});

export default PrivacyPolicy;