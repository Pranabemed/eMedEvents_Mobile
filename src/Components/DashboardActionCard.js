/**
 * Dashboard action card reusable component module. Renders consistent action cards for Browse Courses and Recently Viewed sections.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable card for dashboard Browse Courses and Recently Viewed sections.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - Card heading text.
 * @param {string} props.description - Descriptive subtitle text.
 * @param {string} props.buttonText - Action button label.
 * @param {string} [props.iconName='compass'] - Feather icon name for the card badge.
 * @param {Function} props.onCardPress - Handler when pressing the card container.
 * @param {Function} [props.onButtonPress] - Handler when pressing the action button.
 * @returns {JSX.Element}
 */
const DashboardActionCard = ({
    title,
    description,
    buttonText,
    iconName = 'compass',
    onCardPress,
    onButtonPress,
}) => {
    const handleButtonPress = onButtonPress || onCardPress;

    return (
        <View style={styles.outerWrapper}>
            <TouchableOpacity
                activeOpacity={0.88}
                onPress={onCardPress}
                style={styles.cardContainer}
            >
                <View style={styles.topRow}>
                    <View style={styles.iconBadge}>
                        <FeatherIcon name={iconName} size={18} color={Colorpath.ButtonColr} />
                    </View>
                    <View style={styles.textColumn}>
                        <Text numberOfLines={1} style={styles.cardTitle}>
                            {title}
                        </Text>
                        <Text style={styles.cardDescription}>
                            {description}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleButtonPress}
                    style={styles.actionButton}
                >
                    <Text numberOfLines={1} style={styles.actionButtonText}>
                        {buttonText}
                    </Text>
                    <FeatherIcon name="arrow-right" size={15} color={Colorpath.white} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(10),
    },
    cardContainer: {
        width: normalize(296),
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        backgroundColor: Colorpath.white,
        paddingHorizontal: normalize(13),
        paddingVertical: normalize(12),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: normalize(11),
    },
    iconBadge: {
        width: normalize(34),
        height: normalize(34),
        borderRadius: normalize(8),
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
        marginTop: normalize(1),
    },
    textColumn: {
        flex: 1,
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
        marginBottom: normalize(3),
    },
    cardDescription: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12.5,
        lineHeight: 18,
        color: '#64748B',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize(36),
        width: '100%',
        borderRadius: normalize(7),
        backgroundColor: Colorpath.ButtonColr,
        gap: normalize(6),
    },
    actionButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: Colorpath.white,
    },
});

export default DashboardActionCard;

