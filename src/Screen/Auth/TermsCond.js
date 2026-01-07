import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, StyleSheet, Linking, Platform, TouchableOpacity, View } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context'
const TermsAndConditions = (props) => {
    const openEmail = () => {
        Linking.openURL('mailto:legal@emedevents.com');
    };

    const openWebsite = () => {
        Linking.openURL('https://www.emedevents.com');
    };
    const Privcy = () => {
        props.navigation.navigate("PrivacyPolicy")
    }
    const goBack = () => {
        props.navigation.goBack();
    };
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
                        title={"Terms of Service"}
                        onBackPress={goBack}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={"Terms of Service"}
                            onBackPress={goBack}
                        />
                    </View>
                )}
                <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }} style={styles.scrollView}>
                    <Text style={styles.paragraph}>
                        Welcome to the Website of eMedEvents Corporation (hereinafter <Text style={styles.subHeader}>"EMED EVENTS,"</Text> <Text style={styles.subHeader}>"we,"</Text> or <Text style={styles.subHeader}>"us"</Text>) Website at <Text style={styles.link} onPress={openWebsite}>https://www.emedevents.com</Text> (including all content provided at that domain and referred to herein as the <Text style={styles.subHeader}>"Website"</Text>). We provide the Website and the associated services, educational programs and associated materials, information, tools, Software, updates, and materials (altogether, the <Text style={styles.subHeader}>"Services"</Text>), subject to your Agreement to and compliance with the terms and conditions outlined in this document (the <Text style={styles.subHeader}>"Agreement"</Text>). However, many educational programs, materials, and offers made available through the Website are provided by third-party program organizers ("Organizers"), the identities of which are disclosed and provided on the Website and in the Services.
                    </Text>

                    <Text style={styles.paragraph}>
                        Please carefully read this Agreement that governs your access to and use of the Website and Services and that applies to all users of the Website.<Text style={styles.subHeader}>If you do not agree and consent to this Agreement, please do not use the Website and/or the Services. </Text> If you are accepting this Agreement on behalf of a legal entity other than yourself as an individual, including a business or a government, you represent and warrant that you have the full legal authority to bind such entity to this Agreement.
                    </Text>

                    <Text style={styles.sectionHeader}>INCORPORATED TERMS</Text>
                    <Text style={styles.paragraph}>
                        The following additional terms are incorporated into this Agreement as if fully set forth herein:
                    </Text>
                    <Text style={styles.listItem}>• Privacy Policy</Text>
                    <Text style={styles.listItem}>• Copyright Policy</Text>
                    <Text style={styles.listItem}>• Complaint Policy</Text>

                    <Text style={styles.sectionHeader}>1. IMPORTANT NOTICES</Text>
                    <Text style={styles.paragraph}>A. <Text style={styles.subHeader}>
                        By using and/or visiting the Website, you represent that you have read, understand, and agree to all the terms and conditions of this Agreement, including our Privacy Policy <Text onPress={Privcy} style={{ color: Colorpath.ButtonColr }}>("Privacy Policy")</Text> incorporated herein by reference.
                    </Text>
                    </Text>

                    <Text style={styles.paragraph}>B. We reserve the right to change, modify, add to, or otherwise alter this Agreement at any time or to change or discontinue any aspect or feature of the Website or Services without notice. Such changes, modifications, additions, or deletions shall be effective immediately upon their posting on the Website. You agree to review this Agreement periodically to be aware of such revisions. Your use of the Website and/or Services after we post such changes, modifications, additions or deletions constitutes your acceptance of such changes, modifications, additions or deletions. <Text style={styles.subHeader}>
                        Notwithstanding the foregoing, we will notify you via email regarding any changes in the Privacy Policy, if you have provided your email address to us.
                    </Text></Text>

                    <Text style={styles.sectionHeader}>2. LICENSE</Text>
                    <Text style={styles.paragraph}>
                        A. As long as you are in compliance with all the terms and conditions of this Agreement (and all incorporated documents) and have paid any applicable Fees (as defined below), we hereby grant to you during the Term (as defined below) a limited, revocable, non-assignable, non-transferrable, non-sublicensable, non-exclusive license to use the Website, and to access and receive the Services thereon that are intended for public display or access. We strictly withheld and reserved any rights not explicitly granted in this Agreement.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. You agree that (i) except in your normal use of the Website, you will not copy or distribute any part of the Website or Services in any medium without our prior written authorization; (ii) you will not alter or modify any part of the Website or Services other than as is necessary to use the Website or Services for their intended purposes; and (iii) you will otherwise comply with this Agreement.
                    </Text>

                    <Text style={styles.sectionHeader}>3. RESTRICTIONS</Text>
                    <Text style={styles.paragraph}>
                        A. You agree that you will not violate any applicable law or regulation in connection with your use of the Website or Services.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. You agree that you will not distribute, upload, make available or otherwise publish through the Website or Services any suggestions, information, ideas, comments, causes, promotions, documents, questions, notes, plans, drawings, proposals, graphics, text, information, links, profiles, personal information, name, likeness, audio, photos, Software, music, sounds, video, comments, messages, tags or similar materials ("Submissions") that:
                    </Text>
                    <Text style={styles.listItem}>• are unlawful or encourage another to engage in anything unlawful;</Text>
                    <Text style={styles.listItem}>• contain a virus or any other similar malicious software that may damage the operation of our or another's computers;</Text>
                    <Text style={styles.listItem}>• infringe upon any copyright, patent, trademark, trade secret, right of privacy, right of publicity or other rights of any person or entity;</Text>
                    <Text style={styles.listItem}>• are false, inaccurate, fraudulent or misleading; or</Text>
                    <Text style={styles.listItem}>• are libelous, defamatory, obscene, inappropriate, abusing, harassing, threatening, or bullying.</Text>
                    <Text style={styles.paragraph}>
                        C. You further agree that you will not do any of the following:
                    </Text>
                    <Text style={styles.listItem}>• modify, adapt, translate, copy, reverse engineer, decompile or disassemble any portion of the Website or Services;</Text>
                    <Text style={styles.listItem}>• interfere with or disrupt the operation of the Website or Services, including restricting or inhibiting any other person from using the Website or Services by means of hacking or defacing;</Text>
                    <Text style={styles.listItem}>• transmit to or make available in connection with the Website or Services any denial of service attack, virus, worm, Trojan horse, or other harmful code or activity;</Text>
                    <Text style={styles.listItem}>• attempt to probe, scan or test the vulnerability of the Website or Services or to breach our security or authentication measures;</Text>
                    <Text style={styles.listItem}>• take any action that imposes an unreasonable or disproportionately large load on our infrastructure, as determined in our sole discretion;</Text>
                    <Text style={styles.listItem}>• harvest or collect the email addresses or other contact information of other users of the Website or Services;</Text>
                    <Text style={styles.listItem}>• scrape or collect any content from the Website or Services via automated means;</Text>
                    <Text style={styles.listItem}>• submit or post false, incomplete, or misleading information to the Website or Services, or otherwise provide such information to us;</Text>
                    <Text style={styles.listItem}>• register for more than one user account; or</Text>
                    <Text style={styles.listItem}>• impersonate any other person or business.</Text>
                    <Text style={styles.paragraph}>
                        D. In addition, while we reserve the right to review, edit or remove any Submissions, we are not required to routinely screen, monitor, or review Submissions on the Website or Services. YOU AGREE THAT WE ARE NOT RESPONSIBLE FOR ANY SUCH SUBMISSIONS, AND YOUR RELIANCE ON ANY SUCH INFORMATION IS AT YOUR OWN RISK.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. You agree that you are not licensed to access any portion of the Website or Services that we have not made public or accessible to users (whether registered or not), and you may not attempt to override any security measures in place on the Website or Services.
                    </Text>
                    <Text style={styles.paragraph}>
                        F. Notwithstanding the foregoing rules of conduct, our unlimited right to terminate your access to the Website or Services shall not be limited to violations of this Restrictions section.
                    </Text>

                    <Text style={styles.sectionHeader}>4. ELIGIBILITY</Text>
                    <Text style={styles.paragraph}>
                        A. Access to the Website and Services is subject to compliance with applicable laws and regulations, including U.S. export control laws. Certain portions of the Website or Services may be restricted based on legal or regulatory requirements. We may periodically define or update eligibility criteria to ensure lawful and appropriate use. We reserve the right to modify these criteria as needed to maintain compliance and service integrity.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. Our Services are specifically designed for healthcare professionals and continuing education providers who support the professional development of healthcare practitioners. To create an account or access the Services, you must be at least 18 years of age. Registering or using the Services confirms that you meet this age requirement.
                    </Text>

                    <Text style={styles.paragraph}>
                        This Website and its Services are not intended for children under 13. If you are under 13, please refrain from using the Website unless you have obtained verifiable consent from a parent or guardian. In accordance with 47 U.S.C. Section 230(d), we inform you that commercially available parental control tools (including hardware, software, or filtering services) can help restrict access to content that may be inappropriate for minors. You may consult publicly available resources or contact your Internet service provider for more information.
                    </Text>

                    <Text style={styles.sectionHeader}>5. FEES, TRANSACTIONS, AND PAYMENTS</Text>
                    <Text style={styles.paragraph}>
                        A. As more fully described on the Website, access to certain Services and Website features may require your payment of fees ("Fees"). Access to educational programs is a Service that often (but not always) requires the payment of Fees.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. If you wish to obtain Services through the Website (each a "Transaction"), you will be asked to establish an account and supply certain information relevant to such Transaction, including without limitation your credit card number, your credit card verification or other security code, the expiration date of your credit card, and your address, as well as your professional qualifications and affiliation and the location in which you are licensed or are seeking educational credits. We will treat any such information provided through the Website in accordance with this Agreement and the Privacy Policy. Verification of information may be required prior to the acknowledgment or completion of any Transaction. You represent and warrant that you have the legal right to use any credit card(s) or other Payment Method (as defined below) that you have used in connection with any Transaction.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. You may be required to register your personal and/or financial information with us in order to use certain areas of the Website or the Services, for example, to access/provide Submissions or to initiate Transactions. In doing so, you agree that you will provide accurate and complete information. We may refuse to process your information or requested Transactions if we believe that you may be: i) impersonating another person; ii) violating the intellectual property or other rights of any entity; iii) posting Submissions that are offensive; or iv) providing any information that we may otherwise reject for any or no reason in our sole discretion.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. We may use a third-party payment processor (the "Payment Processor") to charge Fees to you through your registered account for using the Services. You agree to pay us, through the Payment Processor, all charges for purchases made by you, and you authorize us, through the Payment Processor, to charge your chosen payment provider (e.g., credit card) (your "Payment Method"). The processing of payments will be subject to the Payment Processor's terms, conditions, and privacy policies in addition to this Agreement. We are not responsible for errors made by the Payment Processor.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. We will automatically charge your Payment Method when payments are due, as more fully identified on the Website.
                    </Text>
                    <Text style={styles.paragraph}>
                        F. If you purchase a subscription for Services from us or from an Organizer, it may result in recurring charges to your Payment Method, and you agree that we may charge such amounts until such time as your subscription expires, is terminated, or you cancel the subscription, depending on the subscription type. If you wish to cancel your subscription, you may do so at any time through your account. Any charges incurred prior to cancellation are non-refundable. If you upgrade your subscription, you will be charged the difference in your current subscription and the upgraded subscription at that time, and you will be charged the price for the upgraded subscription on an ongoing basis until cancellation. If you downgrade your subscription, you will be charged a reduced fee at the beginning of the next subscription term.
                    </Text>
                    <Text style={styles.paragraph}>
                        G. WE MAY SUBMIT PERIODIC CHARGES TO YOU WITHOUT FURTHER AUTHORIZATION FROM YOU UNTIL YOU PROVIDE NOTICE (RECEIPT OF WHICH IS CONFIRMED BY US) THAT YOU HAVE TERMINATED THIS AUTHORIZATION OR WISH TO CHANGE YOUR PAYMENT METHOD. SUCH NOTICE WILL NOT AFFECT CHARGES SUBMITTED BEFORE WE COULD REASONABLY ACT.
                    </Text>
                    <Text style={styles.paragraph}>
                        H. Your account will be considered delinquent if payment in full is not successful when a charge is initiated. Unless specified in an invoice, amounts due are exclusive of all applicable taxes, levies, or duties, and you will be responsible for payment of all such charges.
                    </Text>
                    <Text style={styles.paragraph}>
                        I. In addition to other applicable remedies, we reserve the right to suspend and/or terminate your access to the Services and/or terminate this Agreement if your Payment Method is declined or fails and your account therefore is delinquent. Charges to delinquent accounts are subject to interest of 1.5% per month on any outstanding balance, or the maximum permitted by law, whichever is less, plus all collection expenses, including reasonable attorneys' fees and court costs.
                    </Text>
                    <Text style={styles.paragraph}>
                        J. If you believe that any specific charge for Fees made under this Agreement is incorrect or was unauthorized, you must contact us in writing within thirty (30) days after the payment was processed, and you must set forth the nature and amount of the requested correction. Otherwise, those charges are final.
                    </Text>
                    <Text style={styles.paragraph}>
                        K. Refund policies for Services are set by the Organizer of each program and will be disclosed in the program materials. You must obtain a refund directly from the Organizer. No refunds will be issued without the approval of the Organizer. Regardless of the nature of your request for any refund, you acknowledge and agree that we are not responsible for the initiation of any refunds and that we have no liability to you to make refunds. If we do refund any amount to you after authorization is issued by the Organizer, you agree that we may retain amounts we paid for payment gateway charges, credit card fees, taxes, and other similar third party impositions, prior to delivering any refund to you.
                    </Text>
                    <Text style={styles.paragraph}>
                        L. If you are an Organizer, you agree to post or otherwise publicize your subscription cancellation and program refund policy and will indemnify, defend and hold us harmless from any and all claims made for refunds, as further set forth and agreed in our Organizer Agreement.
                    </Text>

                    <Text style={styles.sectionHeader}>6. CREDENTIALS SECURITY</Text>
                    <Text style={styles.paragraph}>
                        A. You understand and agree that in order to use certain functions of the Website or Services, we may ask you to provide us with certain credentials or other login information ("Credentials"). You are under no obligation to provide Credentials to us; however, if you do, you represent and warrant that you are authorized to provide these Credentials for use with the Services and that the Credentials are and will be true and accurate throughout the Term of this Agreement. By providing your Credentials, you agree that we may store and use the Credentials in accordance with our Privacy Policy.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. If you are registered with a user account on the Website, you agree to keep your user name and password and/or any other Credentials needed to login to the Website or Services confidential and secure. You are responsible for controlling the access to and use of your account. You understand and agree that we assume that instructions we receive from your account are authoritative and that we should act upon such instructions. We are not responsible for any unauthorized access to your account or profile or the ramifications of such access. We are not required to take action to disable any account. You agree that you will not bring any action against us arising out of or related to any claimed unauthorized access using your account Credentials.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. Notwithstanding the foregoing, if we believe that there has been unauthorized access to your account, we may take reasonable actions to disable or lock your account or otherwise address your situation.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. You may not transfer your account to any other person.
                    </Text>

                    <Text style={styles.sectionHeader}>7. SUBMISSIONS MADE AVAILABLE TO US</Text>
                    <Text style={styles.paragraph}>
                        A. You are under no obligation to submit anything to us, and unless otherwise noted, we will not claim ownership of your Submissions. In order for us to provide the Services to you or for promotion of our Services, however, we require your permission to process, display, reproduce, and otherwise use Submissions you make available to us. Therefore, if you choose to submit any Submissions (including your name, likeness, and other personal information) to the Website or Services or otherwise make any Submissions available through the Services, you hereby grant to us a perpetual, irrevocable, transferrable, sub-licensable, non-exclusive, worldwide, royalty-free license to reproduce, use, modify, display, perform, distribute, translate and create derivative works from any such Submissions, including without limitation distributing part or all of the Submissions in any media format through any media channels.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. Notwithstanding the foregoing grant, as further identified in the Privacy Policy, Personal Data that you upload or make available for the purpose of using the Services will only be used by us for the purpose of providing the Website and Services to you.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. By submitting any Submissions to us, you hereby agree, warrant, and represent that: (a) the Submissions do not contain proprietary or confidential information, and your provision of the Submissions does not violate any third party's rights; (b) all such Submissions are accurate and true, (c) we are not under any confidentiality obligation relating to the Submissions; (d) we may use or disclose the Submissions in any way; and (e) you are not entitled to compensation or attribution from us in exchange for the Submissions.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. You acknowledge that we are under no obligation to maintain any submissions you submit, post, or make available to or on the Website or Services. We reserve the right to withhold, remove, or discard any such materials at any time.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. Additional terms and conditions apply to Organizers as set forth in the Organizer Agreement.
                    </Text>

                    <Text style={styles.sectionHeader}>8. INFORMATION SHARED THROUGH THE SERVICES</Text>
                    <Text style={styles.paragraph}>
                        You understand that by sharing information on the Website or Services, and requesting information to be sent through the Services, you may be revealing information about yourself and/or your business or medical or dental practice that you may include or that may be generated by the Services. You understand and acknowledge that you are fully aware and responsible for the impact of sharing such materials, and you agree that we are not responsible or liable in any way in connection with such sharing. You agree to indemnify, defend and hold us harmless from any claim made by any other person or entity as a result of your sharing information on the Website or Services.
                    </Text>

                    <Text style={styles.sectionHeader}>9. LINKS TO THIRD-PARTY WEBSITES</Text>
                    <Text style={styles.paragraph}>
                        For your convenience, the Website may contain links to the websites of third parties on which you may be able to obtain information or use services. For example, we may provide links to medical or dental societies and to social media sites (e.g., LinkedIn, Twitter). We may also provide links to companies and persons who offer goods or services which may be of interest to you, such as insurance and travel services. Except as otherwise noted, such third-party websites and such information and services are provided by organizations that are independent of us. We do not make any representations or warranties concerning such websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. In addition, we cannot censor or edit the content of any third-party site. Therefore, we make no representation as to the accuracy or any other aspect of the information contained in or on such websites, sources or servers. Any linking to or from any such off-site pages or other websites by you is at your own risk. By using the Website, you expressly relieve us from any and all liability arising from your use of any third-party website. Accordingly, we encourage you to be aware when you leave the Website, and to read the agreements and privacy policy of each other Websites that you visit.
                    </Text>

                    <Text style={styles.sectionHeader}>10. OUR INTELLECTUAL PROPERTY</Text>
                    <Text style={styles.paragraph}>
                        A. Our graphics, logos, names, designs, page headers, button icons, scripts, and service names are our trademarks, trade names and/or trade dress. The "look and feel" of the Website and Services (including color combinations, button shapes, layout, design, and all other graphical elements) are protected by international copyright and trademark laws. All product names, service names, trademarks, and service marks ("Marks") are either our property or the property of their respective owners, as indicated. You may not use the Marks for any purpose whatsoever other than as permitted by this Agreement.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. You acknowledge that i) the Software used to provide the Services, and all enhancements, updates, upgrades, corrections, and modifications to such Software (the "Software"), ii) all copyrights, patents, trade secrets, or trademarks, or other intellectual property rights protecting or pertaining to any aspect of the Software (or any enhancements, corrections or modifications) and iii) all documentation therefor, are the sole and exclusive property of us and/or our licensors. This Agreement does not convey title or ownership to you but instead gives you only the limited use rights set forth herein.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. To the extent that you gain access to or receive any copies of the Software, you agree that you will delete such copies of the Software upon any termination of this Agreement, termination of your use of the Services, or at our request.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. Copies of educational and other materials by Organizers are subject to the terms and conditions set by the Organizer.
                    </Text>

                    <Text style={styles.sectionHeader}>11. TERM AND TERMINATION</Text>
                    <Text style={styles.paragraph}>
                        A. The "Term" of this Agreement will continue until the Agreement is terminated as provided herein. We reserve the right to terminate this Agreement and/or deny all or some portion of the Website or Services to any user at any time, in our sole discretion.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. Without limiting the foregoing or assuming any additional legal obligations, we reserve the right to terminate violators of the Copyright Act in accordance with applicable law. All rights that you grant to us herein related to Submissions shall survive any termination of this Agreement. Further, your representations, warranties, and indemnification obligations herein shall survive any termination of this Agreement.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. You may terminate this Agreement at any time by ceasing use of the Website or Services and by closing your account.
                    </Text>

                    <Text style={styles.sectionHeader}>12. DISCLAIMERS AND LIMITATIONS ON LIABILITY</Text>
                    <Text style={styles.paragraph}>
                        A. We do not represent or warrant that access to the Services will be error-free or uninterrupted, and we do not guarantee that users will be able to access or use the Services or their features at all times. We reserve the right at any time to modify or discontinue (temporarily or permanently) the Services, or any part thereof, with or without notice.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. The Services may be used to perform data analysis and other analytics; however, we do not guarantee the results of any such use.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. Certain data displayed by the Services rely on the receipt of underlying data from third-party sources. Such data sources may not be real-time or accurate, and there may be delays or inaccuracies in such displayed data.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. The Website or Services may contain typographical errors or inaccuracies and may not be complete or current. We reserve the right to correct any such errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. Although we have the right to review, edit, remove or modify information from or on the Website or Services, we may not screen this Material or control the sources of this information, and we do not guarantee the accuracy, suitability, completeness, currency, quality, adequacy or applicability of any such information.
                    </Text>
                    <Text style={styles.paragraph}>
                        F. The materials appearing on the Website or Services, including but not limited to summaries, descriptions, publications, and any other such materials, are not intended to and DO NOT constitute legal, medical, dental, financial, investment, business, or professional advice of any kind. Those accessing the materials appearing on the Services should not act upon them without first seeking relevant professional counsel. The materials should not be used as a substitute for consultation with a professional adviser. You agree that we are not responsible for any medical, dental, financial, business, or legal decisions that you may make.
                    </Text>
                    <Text style={styles.paragraph}>
                        G. Circular 230 Disclosure: Pursuant to U.S. Treasury Department Regulations, we are required to advise you that, unless otherwise expressly indicated, any federal tax advice contained in the Website or Services, including attachments and enclosures, is not intended or written to be used, and may not be used, for the purpose of (i) avoiding tax-related penalties under the Internal Revenue Code or (ii) promoting, marketing or recommending to another party any tax-related matters addressed herein.
                    </Text>
                    <Text style={styles.paragraph}>
                        H. BY USING THE WEBSITE AND/OR SERVICES, YOU AGREE AND ACKNOWLEDGE THAT WE PROVIDE THE WEBSITE AND SERVICES "AS IS" AND WITHOUT ANY WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY. WE AND OUR PARENTS, SUBSIDIARIES, OFFICERS, DIRECTORS, SHAREHOLDERS, MEMBERS, MANAGERS, EMPLOYEES, AND SUPPLIERS SPECIFICALLY DISCLAIM ANY IMPLIED WARRANTIES OF TITLE, ACCURACY, SUITABILITY, APPLICABILITY, MERCHANTABILITY, PERFORMANCE, FITNESS FOR A PARTICULAR PURPOSE; NON-INFRINGEMENT, OR ANY OTHER WARRANTIES OF ANY KIND. NO ADVICE OR INFORMATION (ORAL OR WRITTEN) OBTAINED BY YOU FROM US SHALL CREATE ANY WARRANTY.
                    </Text>
                    <Text style={styles.paragraph}>
                        I. USE OF THE WEBSITE AND/OR SERVICES IS AT YOUR SOLE RISK. WE DO NOT WARRANT THAT YOU WILL BE ABLE TO ACCESS OR USE THE WEBSITE AND/OR SERVICES AT THE TIMES OR LOCATIONS OF YOUR CHOOSING; THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE; THAT DEFECTS WILL BE CORRECTED; OR THAT THE SERVICES ARE FREE OF INACCURACIES, MISREPRESENTATIONS BY ORGANIZERS, PRESENTERS, USERS, MALWARE OR OTHER HARMFUL COMPONENTS.
                    </Text>
                    <Text style={styles.paragraph}>
                        J. TO THE MAXIMUM EXTENT PERMITTED BY LAW, AND EXCEPT AS OTHERWISE PROHIBITED BY LAW, IN NO EVENT SHALL WE OR OUR AFFILIATES, LICENSORS, ORGANIZERS, OR BUSINESS PARTNERS (COLLECTIVELY, THE "RELATED PARTIES") BE LIABLE TO YOU BASED ON OR RELATED TO THE SERVICES, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE AND SHALL NOT BE RESPONSIBLE FOR ANY LOSSES OR DAMAGES, INCLUDING WITHOUT LIMITATION DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY OR SPECIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH ACCESS TO OR USE OF THE WEBSITE AND/OR SERVICES, EVEN IF WE AND/OR RELATED PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </Text>
                    <Text style={styles.paragraph}>
                        K. Notwithstanding the foregoing, in the event that a court shall find that any of the above disclaimers are not enforceable, then you agree that neither we nor any of our subsidiaries, affiliated companies, employees, members, shareholders, or directors shall be liable for (1) any damages in excess of the greater of the Fees you have paid to us during the most recent twelve (12) month period or $100.00, or (2) any indirect, incidental, punitive, special, exemplary or consequential damages or loss of use, lost revenue, lost profits or data to you or any third party from your use of the Website or Services. This limitation shall apply regardless of the basis of your claim or whether or not the limited remedies provided herein fail of their essential purpose.
                    </Text>
                    <Text style={styles.paragraph}>
                        L. SOME JURISDICTIONS MAY NOT PERMIT CERTAIN DISCLAIMERS AND LIMITATIONS, AND ANY SUCH DISCLAIMERS OR LIMITATIONS ARE VOID WHERE PROHIBITED.
                    </Text>

                    <Text style={styles.sectionHeader}>13. INDEMNIFICATION</Text>
                    <Text style={styles.paragraph}>
                        You agree to defend, indemnify and hold harmless us and our officers, directors, members, employees, Organizers, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to reasonable attorney's fees) arising from (i) your use of and access to the Website or Services; (ii) your violation of any term of this Agreement; (iii) your violation of any third party right, including without limitation any copyright, property or privacy right; (iv) any claim that any of your Submissions caused damage to a third party; or (v) any conduct, activity or action that is unlawful or illegal under any state, federal or common law, or is violative of the rights of any individual or entity, engaged in, caused by, or facilitated in any way through the use of the Website or Services. This defense and indemnification obligation will survive any termination or expiration of this Agreement or your use of the Website and/or Services.
                    </Text>

                    <Text style={styles.sectionHeader}>14. DISPUTES, GOVERNING LAW, AND JURISDICTION</Text>
                    <Text style={styles.paragraph}>
                        A. You agree that any claim or dispute arising out of or relating in any way to your use of the Website, Services or any service provided by us will be resolved solely and exclusively by binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify. The Federal Arbitration Act and federal arbitration law apply to this Agreement. YOU UNDERSTAND AND AGREE TO SUBMIT TO ARBITRATION PROCEEDINGS TO SETTLE ANY DISPUTES HEREUNDER, THAT SUCH ARBITRATION WILL BE IN LIEU OF LITIGATION, AND EACH PARTY HEREBY WAIVES THE RIGHT TO SUE IN COURT IN FAVOR OF THE ARBITRATION PROCEEDING EXCEPT AS PERMITTED UNDER THIS AGREEMENT.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. There is no judge or jury in arbitration, and court review of an arbitration award is limited. An arbitrator, however, may award on an individual basis the same damages and relief as a court (including injunctive and declaratory relief or statutory damages), and must follow the terms of this Agreement as a court would.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. To begin an arbitration proceeding, you must send a letter requesting arbitration and describing your claim to our address specified in the Notice section below.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. Arbitration under this Agreement will be conducted by the American Arbitration Association ("AAA") under its rules then in effect. Payment of all filing, administration and arbitrator fees will be governed by the AAA's rules.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated or representative action. If, for any reason, a claim proceeds in court rather than in arbitration, we both agree that we have each waived any right to a jury trial.
                    </Text>
                    <Text style={styles.paragraph}>
                        F. Notwithstanding the foregoing, you agree that we may bring suit in court to enjoin infringement or other misuses of intellectual property or other proprietary rights.
                    </Text>
                    <Text style={styles.paragraph}>
                        G. Any dispute or alleged claim you may have with respect to your access or use of the Website or Services must be commenced within one (1) year after the occurrence of the events leading to the dispute or alleged claim.
                    </Text>
                    <Text style={styles.paragraph}>
                        H. The laws of the State of New York shall govern this Agreement. Any arbitration shall be held in New York, New York (the "Dispute Resolution Location"). To the extent arbitration does not apply, you agree that any dispute arising out of or relating to the Website, Services, or us may only be brought by you in a state or federal court located in the Dispute Resolution Location. YOU HEREBY WAIVE ANY OBJECTION TO THIS VENUE, INCONVENIENT OR INAPPROPRIATE, AND AGREE TO EXCLUSIVE JURISDICTION AND VENUE IN THE DISPUTE RESOLUTION LOCATION.
                    </Text>

                    <Text style={styles.sectionHeader}>15. GENERAL</Text>
                    <Text style={styles.paragraph}>
                        A. <Text style={{ textDecorationLine: "underline" }}>Severability.</Text> If any provision of this Agreement is found for any reason to be unlawful, void, or unenforceable, then that provision will be given its maximum enforceable effect or shall be deemed severable from this Agreement and will not affect the validity and enforceability of any remaining provision.
                    </Text>
                    <Text style={styles.paragraph}>
                        B. <Text style={{ textDecorationLine: "underline" }}>Revisions.</Text> This Agreement may only be revised in writing, signed by us, or posted by us to the Website or Services. In the event that we update this Agreement, and you are made aware of the update, your continued use of the Website or Services after the update shall constitute an agreement to the updated terms.
                    </Text>
                    <Text style={styles.paragraph}>
                        C. <Text style={{ textDecorationLine: "underline" }}>No Partnership.</Text> You agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of this Agreement or your use of the Website or Services.
                    </Text>
                    <Text style={styles.paragraph}>
                        D. <Text style={{ textDecorationLine: "underline" }}>Assignment.</Text> We may assign our rights under this Agreement, in whole or in part, to any person or entity at any time with or without your consent. You may not assign the Agreement without our prior written consent. Any unauthorized assignment shall be null and void.
                    </Text>
                    <Text style={styles.paragraph}>
                        E. <Text style={{ textDecorationLine: "underline" }}>No Waiver.</Text> Our failure to enforce any provision of this Agreement shall in no way be construed to be a present or future waiver of such provision, nor in any way affect the right of any party to enforce each and every such provision thereafter. The express waiver by us of any provision, condition or requirement of this Agreement shall not constitute a waiver of any future obligation to comply with such provision, condition or requirement.
                    </Text>
                    <Text style={styles.paragraph}>
                        F. <Text style={{ textDecorationLine: "underline" }}>Equitable Remedies.</Text> You hereby agree that we would be irreparably damaged if the terms of this Agreement were not specifically enforced, and therefore you agree that we shall be entitled, without bond, other security, or proof of irreparable harm or other damages, to appropriate equitable remedies with respect to breaches of this Agreement, in addition to such other remedies as we may otherwise have available to us under applicable laws.
                    </Text>
                    <Text style={styles.paragraph}>
                        G. <Text style={{ textDecorationLine: "underline" }}>Entire Agreement.</Text> This Agreement, including the documents expressly incorporated by reference, constitutes the entire Agreement between you and us with respect to the Website or Services and supersedes all prior or contemporaneous communications, whether electronic, oral, or written.
                    </Text>
                    <Text style={styles.paragraph}>
                        H. <Text style={{ textDecorationLine: "underline" }}>Notices.</Text> All notices given by you or required under this Agreement shall be in writing and addressed to eMedEvents Corporation, P.O. Box 58, Mendham, NJ 07945, attention CEO, with a copy to: <Text style={styles.link} onPress={openEmail}>legal@emedevents.com</Text>.
                    </Text>
                    <Text style={styles.paragraph}>
                        I. <Text style={{ textDecorationLine: "underline" }}>Survival.</Text> Any provision of this Agreement that may reasonably be interpreted as being intended by the parties to survive termination or expiration of the Agreement shall survive any such termination or expiration.
                    </Text>

                    <Text style={styles.sectionHeader}>COPYRIGHT POLICY</Text>
                    <Text style={styles.paragraph}>
                        If you believe in good faith that any materials posted on the Website or accessed via the Services (the "Materials") infringe any copyright in any work of yours, you agree to contact our "DMCA Copyright Agent" as identified below, hereby designated under the Digital Millennium Copyright Act ("DMCA") (17 U.S.C. §512(c)(3)), with correspondence containing the following:
                    </Text>
                    <Text style={styles.listItem}>• A physical or electronic signature of the owner, or a person authorized to act on behalf of the owner, of the copyright that is allegedly infringed;</Text>
                    <Text style={styles.listItem}>• Identification of the copyrighted work claimed to have been infringed;</Text>
                    <Text style={styles.listItem}>• Identification, with information reasonably sufficient to allow the location of the Material that is claimed to be infringing;</Text>
                    <Text style={styles.listItem}>• Information reasonably sufficient to permit us to contact you;</Text>
                    <Text style={styles.listItem}>• A statement that you have a good faith belief that use of the Material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and</Text>
                    <Text style={styles.listItem}>• A statement that the information in the notification is accurate and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</Text>

                    <Text style={styles.paragraph}>
                        You agree that if you fail to comply with all of the requirements of this policy, your DMCA notice may not be valid. For any questions regarding this procedure or to submit a complaint, please contact our designated DMCA Copyright Agent:
                    </Text>

                    <Text style={styles.paragraph}>
                        Copyright Agent{"\n"}
                        eMedEvents Corporation{"\n"}
                        P.O. Box 58 5 Cold Hill{"\n"}
                        Road, Suite 29{"\n"}
                        Mendham, NJ 07945{"\n"}
                        Attention: Legal Department
                    </Text>

                    <Text style={styles.sectionHeader}>COMPLAINT POLICY FOR INFRINGEMENT OF OTHER RIGHTS</Text>
                    <Text style={styles.paragraph}>
                        If you believe in good faith that any Materials (as defined above) posted on the Website or accessed via the Services infringe any of your rights (including any trademark or privacy rights, but not including rights in copyright as addressed in the Copyright Policy, above), or are otherwise unlawful, you agree to send a notice to <Text style={styles.link} onPress={openEmail}>legal@emedevents.com</Text>, containing the following information:
                    </Text>
                    <Text style={styles.listItem}>• Your name, physical address, email address, and phone number;</Text>
                    <Text style={styles.listItem}>• A description of the Materials posted on the Website that you believe violate your rights or are otherwise unlawful, and which parts of said Materials you believe should be remedied or removed;</Text>
                    <Text style={styles.listItem}>• Identification of the location of the Material on the Website;</Text>
                    <Text style={styles.listItem}>• If you believe that the Materials violate your rights, a statement as to the basis of the rights that you claim are violated;</Text>
                    <Text style={styles.listItem}>• If you believe that the Materials are unlawful or violate the rights of others, a statement as to the basis of this belief;</Text>
                    <Text style={styles.listItem}>• A statement under penalty of perjury that you have a good faith belief that use of the Materials in the manner complained of is not authorized and that the information you are providing is accurate to the best of your knowledge and in good faith; and</Text>
                    <Text style={styles.listItem}>• Your physical or electronic signature.</Text>

                    <Text style={styles.paragraph}>
                        If we receive a message from you that complies with all of the above requirements, we will evaluate the submission, and if appropriate, in our sole discretion, we will take action. We may disclose your submission to any entity that posted the claimed violative Materials or any other entity as we deem appropriate.
                    </Text>

                    <Text style={styles.paragraph}>
                        Copyright © EMED EVENTS CORPORATION. All rights reserved. The Website is protected by the United States and international copyright, trademark, and other applicable laws. This includes the content, appearance, and design of the Website, as well as the trademarks, product names, graphics, logos, service names, slogans, colors, and designs.
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
    sectionHeader: {
        fontSize: 18,
        fontFamily: Fonts.InterBold,
        marginTop: 16,
        marginBottom: 8,
        color: '#000000',
        fontWeight: "bold"
    },
    subHeader: {
        fontSize: 16,
        fontFamily: Fonts.InterBold,
        marginTop: 12,
        marginBottom: 4,
        color: '#000000',
        fontWeight: "bold"
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: Fonts.InterRegular,
        color: "#333",
        fontWeight: "400"
    },
    listItem: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 6,
        fontFamily: Fonts.InterRegular,
        color: "#333",
        marginLeft: 16,
        fontWeight: "400"
    },
    link: {
        color: Colorpath.ButtonColr,
        textDecorationLine: 'underline',
    },
});

export default TermsAndConditions;