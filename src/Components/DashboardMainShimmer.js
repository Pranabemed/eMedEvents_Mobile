import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import normalize from '../Utils/Helpers/Dimen';

const { width: SCREEN_W } = Dimensions.get('window');

/**
 * DashboardMainShimmer
 * Mirrors the section-by-section layout of Dashboardmain.js:
 *   1. "My Course(s)" card - title + 3 stat boxes + arrow button
 *   2. "Start or Resume Courses" header + carousel card
 *   3. Task pill chips row (Due 30 / 60 / 90 days)
 *   4. State-required Courses header + horizontal cards
 *   5. Specialty Courses header + horizontal cards
 */
const DashboardMainShimmer = () => {
    const BG = '#EBEBEB';
    const HL = '#F7F7F7';

    return (
        <ScrollView
            scrollEnabled={false}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.centeredRow}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.myCourseCard}>
                        <View style={styles.courseTitleLine} />
                        <View style={styles.statRow}>
                            <View style={styles.statBox} />
                            <View style={styles.statBox} />
                            <View style={styles.statBox} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.arrowCircle} />
                </SkeletonPlaceholder>
            </View>

            <View style={styles.sectionHeaderRow}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderLeft} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderRight} />
                </SkeletonPlaceholder>
            </View>

            <View style={styles.centeredRow}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.carouselCard}>
                        <View style={styles.carouselInner}>
                            <View style={styles.avatarCircle} />
                            <View style={styles.carouselTextBlock}>
                                <View style={styles.carouselLine1} />
                                <View style={styles.carouselLine2} />
                            </View>
                        </View>
                        <View style={styles.progressBar} />
                        <View style={styles.carouselCTA} />
                    </View>
                </SkeletonPlaceholder>
            </View>

            <View style={styles.dotsRow}>
                {[0, 1, 2].map((i) => (
                    <SkeletonPlaceholder key={i} backgroundColor={BG} highlightColor={HL} speed={1200}>
                        <View style={i === 0 ? styles.dotActive : styles.dotInactive} />
                    </SkeletonPlaceholder>
                ))}
            </View>

            <View style={styles.taskChipsRow}>
                {[0, 1, 2].map((i) => (
                    <SkeletonPlaceholder key={i} backgroundColor={BG} highlightColor={HL} speed={1200}>
                        <View style={styles.taskChip} />
                    </SkeletonPlaceholder>
                ))}
            </View>

            <View style={styles.sectionHeaderRow}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderLeft} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderRight} />
                </SkeletonPlaceholder>
            </View>

            <View style={styles.horizontalCardRow}>
                {[0, 1, 2].map((i) => (
                    <SkeletonPlaceholder key={i} backgroundColor={BG} highlightColor={HL} speed={1200}>
                        <View style={styles.horizontalCard}>
                            <View style={styles.hCardImageBlock} />
                            <View style={styles.hCardLine1} />
                            <View style={styles.hCardLine2} />
                        </View>
                    </SkeletonPlaceholder>
                ))}
            </View>

            <View style={[styles.sectionHeaderRow, { marginTop: normalize(16) }]}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderLeft} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL} speed={1200}>
                    <View style={styles.sectionHeaderRight} />
                </SkeletonPlaceholder>
            </View>

            <View style={styles.horizontalCardRow}>
                {[0, 1, 2].map((i) => (
                    <SkeletonPlaceholder key={i} backgroundColor={BG} highlightColor={HL} speed={1200}>
                        <View style={styles.horizontalCard}>
                            <View style={styles.hCardImageBlock} />
                            <View style={styles.hCardLine1} />
                            <View style={styles.hCardLine2} />
                        </View>
                    </SkeletonPlaceholder>
                ))}
            </View>
        </ScrollView>
    );
};

export default DashboardMainShimmer;

const styles = StyleSheet.create({
    container: {
        paddingBottom: normalize(30),
        paddingTop: normalize(5),
    },
    centeredRow: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalize(8),
    },
    myCourseCard: {
        height: normalize(95),
        width: normalize(300),
        borderRadius: normalize(10),
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(12),
        justifyContent: 'center',
    },
    courseTitleLine: {
        height: normalize(14),
        width: normalize(180),
        borderRadius: 4,
        marginBottom: normalize(12),
    },
    statRow: {
        flexDirection: 'row',
        gap: normalize(5),
    },
    statBox: {
        height: normalize(50),
        width: normalize(82),
        borderRadius: normalize(8),
    },
    arrowCircle: {
        height: normalize(20),
        width: normalize(20),
        borderRadius: normalize(10),
        position: 'absolute',
        right: normalize(35),
        bottom: normalize(10),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(15),
        marginTop: normalize(14),
        marginBottom: normalize(8),
    },
    sectionHeaderLeft: {
        height: normalize(14),
        width: normalize(160),
        borderRadius: 4,
    },
    sectionHeaderRight: {
        height: normalize(14),
        width: normalize(55),
        borderRadius: 4,
    },
    carouselCard: {
        height: normalize(180),
        width: SCREEN_W - normalize(20),
        borderRadius: normalize(9),
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
    },
    carouselInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(12),
    },
    avatarCircle: {
        height: normalize(55),
        width: normalize(55),
        borderRadius: normalize(55),
    },
    carouselTextBlock: {
        gap: normalize(8),
    },
    carouselLine1: {
        height: normalize(14),
        width: normalize(160),
        borderRadius: 4,
    },
    carouselLine2: {
        height: normalize(12),
        width: normalize(120),
        borderRadius: 4,
    },
    progressBar: {
        height: normalize(8),
        width: '90%',
        borderRadius: 4,
        marginTop: normalize(20),
        alignSelf: 'center',
    },
    carouselCTA: {
        height: normalize(36),
        width: normalize(220),
        borderRadius: normalize(5),
        alignSelf: 'center',
        marginTop: normalize(14),
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: normalize(6),
        marginTop: normalize(8),
    },
    dotActive: {
        width: normalize(25),
        height: normalize(8),
        borderRadius: normalize(10),
    },
    dotInactive: {
        width: normalize(8),
        height: normalize(8),
        borderRadius: normalize(8),
    },
    taskChipsRow: {
        flexDirection: 'row',
        gap: normalize(6),
        paddingHorizontal: normalize(18),
        marginTop: normalize(14),
    },
    taskChip: {
        height: normalize(60),
        width: normalize(100),
        borderRadius: normalize(8),
    },
    horizontalCardRow: {
        flexDirection: 'row',
        gap: normalize(10),
        paddingHorizontal: normalize(14),
    },
    horizontalCard: {
        width: normalize(130),
        borderRadius: normalize(8),
        paddingBottom: normalize(10),
        overflow: 'hidden',
    },
    hCardImageBlock: {
        height: normalize(90),
        width: normalize(130),
        borderRadius: normalize(8),
        marginBottom: normalize(8),
    },
    hCardLine1: {
        height: normalize(12),
        width: normalize(110),
        borderRadius: 4,
        marginBottom: normalize(6),
    },
    hCardLine2: {
        height: normalize(10),
        width: normalize(75),
        borderRadius: 4,
    },
});
