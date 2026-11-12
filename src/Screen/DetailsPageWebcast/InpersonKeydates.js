/**
 * Inperson keydates screen module. Renders a React Native screen or a screen-scoped support component. Exported members: InpersonKeydates.
 */

import { View, Text, StyleSheet } from 'react-native';
import React, { memo, useMemo } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

const KEY_DATE_CONFIG = [
    { key: 'registrationOpen', label: 'Registrations Open', icon: 'calendar' },
    { key: 'registrationEnd', label: 'Registrations End', icon: 'clock' },
    { key: 'conferenceStartdate', label: 'Conference Start Date', icon: 'play-circle' },
    { key: 'conferenceEnddate', label: 'Conference End Date', icon: 'check-circle' },
];

/**
 * Reusable InpersonKeydates component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const InpersonKeydates = memo(({ wholedata }) => {
    const items = useMemo(() => {
        if (!wholedata) return [];
        return KEY_DATE_CONFIG.filter((entry) => Boolean(wholedata[entry.key])).map((entry) => ({
            ...entry,
            value: wholedata[entry.key],
        }));
    }, [wholedata]);

    if (items.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {items.map((item, idx) => (
                <View
                    key={item.key}
                    style={[
                        styles.row,
                        idx < items.length - 1 && styles.rowDivider,
                    ]}
                >
                    <View style={styles.iconBadge}>
                        <Feather name={item.icon} size={14} color={Colorpath.ButtonColr} />
                    </View>
                    <View style={styles.textCol}>
                        <Text style={styles.labelText}>{item.label}</Text>
                        <Text style={styles.valueText}>{item.value}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8FAFD',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E6EEF8',
        paddingHorizontal: normalize(12),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(10),
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E6EEF8',
    },
    iconBadge: {
        width: normalize(30),
        height: normalize(30),
        borderRadius: normalize(15),
        backgroundColor: '#EAF1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    textCol: {
        flex: 1,
    },
    labelText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12,
        color: '#64748B',
        marginBottom: normalize(2),
    },
    valueText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
});

/**
 * Inperson keydates default export.
 *
 * @returns {*}
 */
export default InpersonKeydates;