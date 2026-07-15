/**
 * Guest profession popup reusable component module. Provides a React Native UI building block used across screens. Exported members: POPUP_SHOWN_KEY, getDisplayValue, normalizeList, normalizeProfessionResponse, normalizeSpecialtyResponse, GuestProfessionPopup, validateEmail, styles.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Colorpath from '../../../../Themes/Colorpath';
import Fonts from '../../../../Themes/Fonts';
import normalize from '../../../../Utils/Helpers/Dimen';
import { getApi } from '../../../../Utils/Helpers/ApiRequest';
import getUserAgentJSON from '../../../../Utils/Helpers/UserAgent';
import Buttons from '../../../../Components/Button';
import { professionSaveRequest } from '../../../../Redux/Reducers/GuestReducer';
import { clearGuestSignupDraft, loadGuestSignupDraft, saveGuestSignupDraft } from '../../../../Utils/Helpers/GuestSignupDraft';

/**
 * Popup shown key constant.
 * @returns {string}
 */
const POPUP_SHOWN_KEY = 'GUEST_PROFESSION_POPUP_SHOWN';

/**
 * Returns display value.
 * @param {*} item - Input value.
 * @returns {*}
 */
const getDisplayValue = item =>
  String(
    item?.name ??
    item?.label ??
    item?.profession ??
    item?.profession_name ??
    item?.speciality_name ??
    item?.specialty_name ??
    item?.title ??
    item ??
    '',
  ).trim();

/**
 * Normalizes list.
 * @param {*} source - Input value.
 * @returns {*}
 */
const normalizeList = source => {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source
      .map((item, index) => {
        const label = getDisplayValue(item);
        if (!label) return null;
        return {
          id: String(item?.id ?? item?.profession_id ?? item?.speciality_id ?? index),
          label,
          raw: item,
        };
      })
      .filter(Boolean);
  }

  if (typeof source === 'object') {
    return Object.entries(source)
      .map(([key, value], index) => {
        const label = getDisplayValue(value || key);
        if (!label) return null;
        return {
          id: String(key ?? index),
          label,
          raw: value,
        };
      })
      .filter(Boolean);
  }

  const label = getDisplayValue(source);
  return label ? [{ id: '0', label, raw: source }] : [];
};

/**
 * Normalizes profession response.
 * @param {*} responseData - Input value.
 * @returns {*}
 */
const normalizeProfessionResponse = responseData =>
  normalizeList(
    responseData?.profession_credentials ??
    responseData?.professions ??
    responseData?.profession ??
    responseData?.data ??
    responseData,
  );

/**
 * Normalizes specialty response.
 * @param {*} responseData - Input value.
 * @returns {*}
 */
const normalizeSpecialtyResponse = responseData =>
  normalizeList(
    responseData?.specialities ??
    responseData?.specialties ??
    responseData?.speciality ??
    responseData?.data ??
    responseData,
  );

export /**
 * Guest profession popup component.
 * @param {Object} props - Input object.
 * @param {*} props.visible - Nested property value.
 * @param {*} props.onClose - Nested property value.
 * @param {*} props.isUsaUser - Nested property value.
 * @param {*} props.guestData - Nested property value.
 * @returns {JSX.Element}
 */
  const GuestProfessionPopup = ({
    visible,
    onClose,
    isUsaUser,
    guestData,
  }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const GuestReducer = useSelector(state => state.GuestReducer);
    const specialtyRequestIdRef = useRef(0);

    const [profession, setProfession] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [professionOptions, setProfessionOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [professionLoading, setProfessionLoading] = useState(false);
    const [specialtyLoading, setSpecialtyLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [professionOpen, setProfessionOpen] = useState(false);
    const [specialtyOpen, setSpecialtyOpen] = useState(false);
    const [errors, setErrors] = useState({
      profession: '',
      specialty: '',
      email: '',
    });

    const persistGuestDraft = useCallback(
      async (nextProfession = profession, nextSpecialty = specialty, nextEmail = email) => {
        try {
          await saveGuestSignupDraft({
            profession: nextProfession,
            specialty: nextSpecialty,
            email: nextEmail,
          });
        } catch (error) {
          console.warn('[GuestProfessionPopup] Unable to persist guest draft:', error);
        }
      },
      [email, profession, specialty],
    );

    const closeAndPersist = useCallback(async () => {
      try {
        await AsyncStorage.setItem(POPUP_SHOWN_KEY, 'true');
      } catch (error) {
        console.warn('[GuestProfessionPopup] Unable to persist close flag:', error);
      }
      onClose?.();
    }, [onClose]);

    const resetState = useCallback(() => {
      setProfession('');
      setSpecialty('');
      setProfessionOptions([]);
      setSpecialtyOptions([]);
      setProfessionLoading(false);
      setSpecialtyLoading(false);
      setIsSubmitting(false);
      setEmail(guestData?.email || '');
      setEmailTouched(false);
      setProfessionOpen(false);
      setSpecialtyOpen(false);
      setErrors({
        profession: '',
        specialty: '',
        email: '',
      });
      specialtyRequestIdRef.current += 1;
    }, [guestData?.email]);

    const fetchProfessions = useCallback(async () => {
      setProfessionLoading(true);
      try {
        getUserAgentJSON();
        const endpoint = isUsaUser === false
          ? 'master/professionCredentials?other_country=1'
          : 'master/professionCredentials';
        const response = await getApi(endpoint);
        const normalized = normalizeProfessionResponse(response?.data);
        setProfessionOptions(normalized);
      } catch (error) {
        console.warn('[GuestProfessionPopup] Failed to load professions:', error);
        setProfessionOptions([]);
      } finally {
        setProfessionLoading(false);
      }
    }, [isUsaUser]);

    const fetchSpecialties = useCallback(async selectedProfession => {
      if (!selectedProfession) {
        setSpecialtyOptions([]);
        return;
      }

      const requestId = specialtyRequestIdRef.current + 1;
      specialtyRequestIdRef.current = requestId;

      setSpecialtyLoading(true);
      try {
        getUserAgentJSON();
        const response = await getApi(
          `master/specialities?profession=${encodeURIComponent(selectedProfession)}`,
        );
        if (requestId !== specialtyRequestIdRef.current) {
          return;
        }
        const normalized = normalizeSpecialtyResponse(response?.data);
        setSpecialtyOptions(normalized);
      } catch (error) {
        if (requestId === specialtyRequestIdRef.current) {
          setSpecialtyOptions([]);
        }
        console.warn('[GuestProfessionPopup] Failed to load specialties:', error);
      } finally {
        if (requestId === specialtyRequestIdRef.current) {
          setSpecialtyLoading(false);
        }
      }
    }, []);

    useEffect(() => {
      if (!visible) {
        resetState();
        return;
      }

      resetState();
      fetchProfessions();
      let isActive = true;

            /**
 * Hydrate guest draft utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const hydrateGuestDraft = async () => {
        try {
          const guestDraft = await loadGuestSignupDraft();
          if (!isActive || !guestDraft) {
            return;
          }

          setProfession(guestDraft.profession || '');
          setSpecialty(guestDraft.specialty || '');
          setEmail(guestDraft.email || '');

          if (guestDraft.profession) {
            fetchSpecialties(guestDraft.profession);
          }
        } catch (error) {
          console.warn('[GuestProfessionPopup] Unable to load guest draft:', error);
        }
      };

      hydrateGuestDraft();

      return () => {
        isActive = false;
      };
    }, [fetchProfessions, fetchSpecialties, resetState, visible]);

    const professionLabel = useMemo(
      () => (profession ? profession : 'Select your profession'),
      [profession],
    );

    const specialtyLabel = useMemo(
      () => (specialty ? specialty : 'Select your specialty'),
      [specialty],
    );

    const isFormValid = Boolean(profession && specialty);
    /**
 * Validate email utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
    const validateEmail = value =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
    const trimmedEmail = String(email || '').trim();
    const isEmailValid = validateEmail(trimmedEmail);
    const showEmailError = emailTouched && !isEmailValid;
    const emailFieldBorderColor = showEmailError
      ? '#D11A2A'
      : trimmedEmail && isEmailValid
        ? '#16A34A'
        : '#D7DEEA';

    useEffect(() => {
      if (!isSubmitting) {
        return;
      }

      if (GuestReducer?.status === 'Guest/professionSaveSuccess') {
        setIsSubmitting(false);
        closeAndPersist();
        return;
      }

      if (GuestReducer?.status === 'Guest/professionSaveFailure') {
        setIsSubmitting(false);
      }
    }, [GuestReducer?.status, closeAndPersist, isSubmitting]);

    const handleProfessionSelect = useCallback(
      item => {
        const selectedProfession = item?.label || '';
        setProfession(selectedProfession);
        setSpecialty('');
        setSpecialtyOptions([]);
        setProfessionOpen(false);
        setSpecialtyOpen(false);
        setErrors(prev => ({
          ...prev,
          profession: '',
          specialty: '',
        }));
        persistGuestDraft(selectedProfession, '', email);
        fetchSpecialties(selectedProfession);
      },
      [email, fetchSpecialties, persistGuestDraft],
    );

    const handleSpecialtySelect = useCallback(item => {
      const selectedSpecialty = item?.label || '';
      setSpecialty(selectedSpecialty);
      setSpecialtyOpen(false);
      setErrors(prev => ({
        ...prev,
        specialty: '',
      }));
      persistGuestDraft(profession, selectedSpecialty, email);
    }, [email, persistGuestDraft, profession]);

    const handleSubmit = useCallback(async () => {
      const nextErrors = {
        profession: profession ? '' : 'Please select a profession.',
        specialty: specialty ? '' : 'Please select a specialty.',
        email: email ? (validateEmail(email) ? '' : 'Please enter a valid email address.') : 'Please enter your email address.',
      };
      setErrors(nextErrors);
      setEmailTouched(true);

      if (!profession || !specialty || !email || !validateEmail(email) || isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {
        await saveGuestSignupDraft({
          profession,
          specialty,
          email: trimmedEmail,
        });
      } catch (error) {
        console.warn('[GuestProfessionPopup] Unable to save guest signup draft:', error);
      }

      let dynamicCity = guestData?.city_name || '';
      let dynamicState = guestData?.state_name || '';
      let dynamicCountryName = guestData?.country_name || '';

      try {
        if (!dynamicCity || dynamicCountryName === 'IN' || dynamicCountryName === guestData?.country) {
          const geoRes = await fetch('https://ipwhois.app/json/');
          const geoData = await geoRes.json();
          dynamicCity = geoData?.city || dynamicCity;
          dynamicState = geoData?.region || dynamicState;
          dynamicCountryName = geoData?.country || dynamicCountryName;
        }
      } catch (error) {
        console.log('Error fetching dynamic geo data:', error);
      }

      const payload = {
        profession,
        speciality: specialty,
        email,
        playerSessionID: guestData?.playerSessionID || '',
        ip: guestData?.ip || '',
        city: dynamicCity,
        state_name: dynamicState,
        region: dynamicState,
        country_name: dynamicCountryName,
        deviceToken: guestData?.deviceToken || '',
        deviceType: Platform.OS === 'web' ? 'web_chrome' : Platform.OS,
      };
      dispatch(professionSaveRequest(payload));
    }, [
      dispatch,
      guestData?.city_name,
      guestData?.country,
      guestData?.country_name,
      guestData?.deviceToken,
      guestData?.ip,
      guestData?.playerSessionID,
      guestData?.state_name,
      email,
      isSubmitting,
      profession,
      specialty,
      trimmedEmail,
    ]);

    const handleSkip = useCallback(async () => {
      await clearGuestSignupDraft();
      closeAndPersist();
    }, [closeAndPersist]);

    if (!visible) {
      return null;
    }

    return (
      <Modal
        isVisible={visible}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.45}
        useNativeDriver
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
        statusBarTranslucent
        onBackButtonPress={handleSkip}
        onBackdropPress={handleSkip}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? normalize(12) : 0}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom, normalize(12)) },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.header, { paddingTop: Math.max(insets.top, normalize(12)) }]}>
                <Text style={styles.title}>Personalize Your CME/CE Journey</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Close profession selection"
                  onPress={handleSkip}
                  style={styles.closeButton}
                  activeOpacity={0.8}
                >
                  <Icon name="close" size={normalize(24)} color={Colorpath.black} />
                </TouchableOpacity>
              </View>

              <View style={styles.body}>
                <Text style={styles.description}>
                  Share your profession, specialty, and email so we can recommend CME/CE activities that match your interests and send timely course-related notifications.{'\n\n'}We use this information only to personalize your CME/CE experience, send reminders, and relevant notifications. It will not be used for marketing or promotions.
                </Text>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>
                    <Text style={styles.required}>* </Text>Profession
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.selector,
                      professionOpen && styles.selectorActive,
                      errors.profession ? styles.selectorError : null,
                    ]}
                    onPress={() => {
                      setProfessionOpen(prev => !prev);
                      setSpecialtyOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.selectorText, !profession && styles.placeholderText]}>
                      {professionLabel}
                    </Text>
                    <Icon
                      name={professionOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={normalize(22)}
                      color="#8B93A7"
                    />
                  </TouchableOpacity>
                  {errors.profession ? <Text style={styles.errorText}>{errors.profession}</Text> : null}

                  {professionOpen ? (
                    <View style={styles.dropdownShell}>
                      {professionLoading ? (
                        <View style={styles.loaderWrap}>
                          <ActivityIndicator color={Colorpath.ButtonColr} />
                          <Text style={styles.loaderText}>Loading professions...</Text>
                        </View>
                      ) : (
                        <FlatList
                          data={professionOptions}
                          keyExtractor={(item, index) => String(item?.id ?? index)}
                          showsVerticalScrollIndicator={false}
                          keyboardShouldPersistTaps="handled"
                          nestedScrollEnabled
                          style={styles.dropdownList}
                          contentContainerStyle={styles.dropdownContent}
                          ListEmptyComponent={
                            <Text style={styles.emptyText}>No professions found</Text>
                          }
                          renderItem={({ item }) => {
                            const isSelected = profession === item?.label;
                            return (
                              <TouchableOpacity
                                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                                activeOpacity={0.8}
                                onPress={() => handleProfessionSelect(item)}
                              >
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                  {item?.label}
                                </Text>
                                {isSelected ? (
                                  <Icon name="check" size={normalize(18)} color={Colorpath.ButtonColr} />
                                ) : null}
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>
                    <Text style={styles.required}>* </Text>Specialty
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.selector,
                      (!profession || specialtyLoading) && styles.selectorDisabled,
                      specialtyOpen && styles.selectorActive,
                      errors.specialty ? styles.selectorError : null,
                    ]}
                    onPress={() => {
                      if (!profession || specialtyLoading) {
                        return;
                      }
                      setSpecialtyOpen(prev => !prev);
                      setProfessionOpen(false);
                    }}
                    activeOpacity={0.8}
                    disabled={!profession || specialtyLoading}
                  >
                    <Text style={[styles.selectorText, !specialty && styles.placeholderText]}>
                      {specialtyLoading ? 'Loading specialties...' : specialtyLabel}
                    </Text>
                    <Icon
                      name={specialtyOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={normalize(22)}
                      color="#8B93A7"
                    />
                  </TouchableOpacity>
                  {!profession ? (
                    <Text style={styles.helperText}>Select a profession first.</Text>
                  ) : null}
                  {errors.specialty ? <Text style={styles.errorText}>{errors.specialty}</Text> : null}

                  {specialtyOpen ? (
                    <View style={styles.dropdownShell}>
                      {specialtyLoading ? (
                        <View style={styles.loaderWrap}>
                          <ActivityIndicator color={Colorpath.ButtonColr} />
                          <Text style={styles.loaderText}>Loading specialties...</Text>
                        </View>
                      ) : (
                        <FlatList
                          data={specialtyOptions}
                          keyExtractor={(item, index) => String(item?.id ?? index)}
                          showsVerticalScrollIndicator={false}
                          keyboardShouldPersistTaps="handled"
                          nestedScrollEnabled
                          style={styles.dropdownList}
                          contentContainerStyle={styles.dropdownContent}
                          ListEmptyComponent={
                            <Text style={styles.emptyText}>No specialties found</Text>
                          }
                          renderItem={({ item }) => {
                            const isSelected = specialty === item?.label;
                            return (
                              <TouchableOpacity
                                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                                activeOpacity={0.8}
                                onPress={() => handleSpecialtySelect(item)}
                              >
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                  {item?.label}
                                </Text>
                                {isSelected ? (
                                  <Icon name="check" size={normalize(18)} color={Colorpath.ButtonColr} />
                                ) : null}
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>
                    <Text style={styles.required}>* </Text>Email Address
                  </Text>
                  <View style={[styles.emailWrap, { borderColor: emailFieldBorderColor }]}>
                    <TextInput
                      style={styles.emailInput}
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        setEmailTouched(true);
                        setErrors(prev => ({
                          ...prev,
                          email: text && validateEmail(text)
                            ? ''
                            : prev.email && !text
                              ? 'Please enter your email address.'
                              : prev.email,
                        }));
                        persistGuestDraft(profession, specialty, text);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="Enter your email address"
                      placeholderTextColor="#8D97AA"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                    />
                  </View>
                  {showEmailError ? (
                    <Text style={styles.errorText}>
                      {!trimmedEmail
                        ? 'Please enter your email address.'
                        : 'Please enter a valid email address.'}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.footer}>
                  <Buttons
                    text="Submit"
                    loading={isSubmitting}
                    disabled={!profession || !specialty || !trimmedEmail || !isEmailValid || isSubmitting}
                    onPress={handleSubmit}
                    height={normalize(48)}
                    width="100%"
                    borderRadius={normalize(10)}
                    backgroundColor={!isFormValid || isSubmitting ? '#8DA0E5' : Colorpath.ButtonColr}
                    color={Colorpath.white}
                    fontSize={normalize(16)}
                    fontFamily={Fonts.InterBold}
                  />

                  <TouchableOpacity
                    onPress={handleSkip}
                    style={styles.skipButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.skipText}>Skip for Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colorpath.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colorpath.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: normalize(18),
    paddingBottom: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  title: {
    flex: 1,
    color: Colorpath.ButtonColr,
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    lineHeight: normalize(24),
  },
  closeButton: {
    width: normalize(34),
    height: normalize(34),
    borderRadius: normalize(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FB',
  },
  body: {
    flex: 1,
    paddingHorizontal: normalize(18),
    paddingTop: normalize(18),
  },
  description: {
    color: '#52607A',
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    lineHeight: normalize(22),
    marginBottom: normalize(18),
  },
  fieldWrap: {
    marginBottom: normalize(18),
  },
  fieldLabel: {
    color: '#111827',
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
    marginBottom: normalize(8),
  },
  required: {
    color: '#D11A2A',
  },
  selector: {
    minHeight: normalize(52),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#D7DEEA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorActive: {
    borderColor: Colorpath.ButtonColr,
    shadowColor: '#2C4DB9',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  selectorDisabled: {
    backgroundColor: '#F7F8FB',
  },
  selectorError: {
    borderColor: '#D11A2A',
  },
  emailWrap: {
    minHeight: normalize(52),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#D7DEEA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(14),
    justifyContent: 'center',
  },
  emailInput: {
    color: '#111827',
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(15),
    padding: 0,
    minHeight: normalize(22),
  },
  selectorText: {
    flex: 1,
    color: '#111827',
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(15),
    paddingRight: normalize(12),
  },
  placeholderText: {
    color: '#8D97AA',
  },
  helperText: {
    marginTop: normalize(6),
    color: '#6B7280',
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
  },
  errorText: {
    marginTop: normalize(6),
    color: '#D11A2A',
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
  },
  dropdownShell: {
    marginTop: normalize(10),
    borderWidth: 1,
    borderColor: '#E0E6F0',
    borderRadius: normalize(12),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  dropdownList: {
    maxHeight: normalize(210),
  },
  dropdownContent: {
    paddingVertical: normalize(6),
  },
  loaderWrap: {
    minHeight: normalize(72),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: normalize(10),
    paddingHorizontal: normalize(12),
  },
  loaderText: {
    color: '#51607B',
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(13),
  },
  emptyText: {
    paddingVertical: normalize(18),
    textAlign: 'center',
    color: '#6B7280',
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(13),
  },
  optionRow: {
    minHeight: normalize(48),
    paddingHorizontal: normalize(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8ECF3',
  },
  optionRowSelected: {
    backgroundColor: '#EEF3FF',
  },
  optionText: {
    flex: 1,
    color: '#111827',
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    paddingRight: normalize(10),
  },
  optionTextSelected: {
    fontFamily: Fonts.InterSemiBold,
    color: Colorpath.ButtonColr,
  },
  footer: {
    marginTop: normalize(4),
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: '#E8ECF3',
    backgroundColor: Colorpath.white,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(14),
  },
  skipText: {
    color: Colorpath.ButtonColr,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
  },
});
