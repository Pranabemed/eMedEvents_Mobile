/**
 * File Name: GuestHomeHeader.js
 * Module: Guest User
 * Purpose: Renders top-bar and search entry UI for the Guest User home screen.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-vector-icons/MaterialIcons, react-native-vector-icons/Ionicons, ../../../Themes/Imagepath, ../../../Themes/Colorpath, ../../HomePage/GuestUser.styles
 */

import React, { memo } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import Colorpath from '../../../../Themes/Colorpath';
import Imagepath from '../../../../Themes/Imagepath';
import styles from '../../GuestUser.styles';
import { scale } from '../utils/guestUserCore';

/**
 * Description: Guest home header component.
 * Purpose: Displays logo, state selector, sign-in action, and search CTA.
 */
const GuestHomeHeaderComponent = ({ width, navigation, selectedState, stateCode, onOpenStatePicker }) => (
  <>
    <View style={styles.topBar}>
      <Image
        source={Imagepath.Logo}
        style={[styles.logo, { width: scale(width, 40), height: scale(width, 40) }]}
        resizeMode="contain"
      />
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.langPill} onPress={onOpenStatePicker}>
          <Text style={styles.langText}>{stateCode || 'State'}</Text>
          <Icon name="keyboard-arrow-down" size={20} color={Colorpath.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Pressable
      style={styles.searchBar}
      onPress={() =>
        navigation.navigate('GuestSpecialitySearch', {
          taskData: {
            statid: selectedState?.id ?? '',
            creditID: selectedState ?? null,
            isGuest: true,
          },
        })
      }
    >
      <SearchIcon name="search" size={20} color="#9CA3AF" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.searchTextScrollContent}
        style={styles.searchTextScroll}
      >
        <Text numberOfLines={1} style={styles.searchText}>
          Search CME, conferences, specialties
        </Text>
      </ScrollView>
      <Icon name="mic-none" size={20} color="#9CA3AF" />
    </Pressable>
  </>
);

export const GuestHomeHeader = memo(GuestHomeHeaderComponent);
