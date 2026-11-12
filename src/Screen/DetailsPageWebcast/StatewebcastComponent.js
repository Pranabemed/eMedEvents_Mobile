/**
 * Statewebcast component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastComponent.
 */

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useCallback } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';

/**
 * Reusable StatewebcastComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastComponent = memo(({ item, nav, creditData, datawhole }) => {
    const handlePress = useCallback(() => {
        const separateLineorgan = item?.speaker_url;
        if (!separateLineorgan || !nav) return;
        const slugOrgan = String(separateLineorgan).split('/').filter(Boolean).pop();
        if (!slugOrgan) return;
        nav.navigate("SpeakerProfile", {
            fullUrl: {
                fullUrl: slugOrgan,
                creditData: creditData,
                speaks: "speaker",
                textHo: "fs",
                Realback: datawhole,
            },
        });
    }, [creditData, datawhole, item?.speaker_url, nav]);

    const displayName = String(item?.name || '').trim();
    const initialChar = displayName ? displayName.charAt(0).toUpperCase() : 'S';

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={item?.speaker_url ? 0.75 : 1}
            style={styles.card}
        >
            <View style={styles.row}>
                <View style={styles.avatarWrap}>
                    {item?.userImage ? (
                        <Image
                            source={{ uri: item.userImage }}
                            style={styles.avatarImg}
                        />
                    ) : (
                        <Text style={styles.avatarInitial}>{initialChar}</Text>
                    )}
                </View>
                <View style={styles.infoCol}>
                    {displayName ? (
                        <Text style={styles.nameText} numberOfLines={2}>
                            {displayName}
                        </Text>
                    ) : null}
                    {item?.designation ? (
                        <Text style={styles.designationText} numberOfLines={2}>
                            {item.designation}
                        </Text>
                    ) : null}
                    {item?.specialities ? (
                        <Text style={styles.specialityText} numberOfLines={2}>
                            {item.specialities}
                        </Text>
                    ) : null}
                </View>
                {item?.speaker_url ? (
                    <View style={styles.chevronBadge}>
                        <Feather name="chevron-right" size={16} color={Colorpath.ButtonColr} />
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F8FAFD',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E3ECF7',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrap: {
        height: normalize(60),
        width: normalize(60),
        backgroundColor: '#EAF1FF',
        borderRadius: normalize(30),
        borderWidth: 1,
        borderColor: '#D5E3FC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
        overflow: 'hidden',
    },
    avatarImg: {
        height: normalize(60),
        width: normalize(60),
        borderRadius: normalize(30),
    },
    avatarInitial: {
        fontFamily: Fonts.InterBold,
        fontSize: 22,
        color: Colorpath.ButtonColr,
    },
    infoCol: {
        flex: 1,
        justifyContent: 'center',
        gap: normalize(3),
    },
    nameText: {
        fontFamily: Fonts.InterBold,
        fontSize: 15,
        color: '#0F172A',
    },
    designationText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13,
        lineHeight: 18,
        color: '#475569',
    },
    specialityText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12.5,
        lineHeight: 17,
        color: Colorpath.ButtonColr,
    },
    chevronBadge: {
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(14),
        backgroundColor: '#EAF1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(8),
    },
});

/**
 * Statewebcast component default export.
 *
 * @returns {*}
 */
export default StatewebcastComponent;