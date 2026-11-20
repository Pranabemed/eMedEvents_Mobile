/**
 * External web view screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ExternalWebView, handleBack.
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import useConferenceCheckout, {conferenceCheckoutScript} from './hooks/useConferenceCheckout';

/**
 * Reusable ExternalWebView component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ExternalWebViewSession = (props) => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const rawUrl = props?.route?.params?.url || '';
  const targetUrl = useMemo(() => {
    if (!rawUrl) return '';
    const trimmed = String(rawUrl).trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://www.emedevents.com/${trimmed.replace(/^\/+/, '')}`;
  }, [rawUrl]);
  const title = props?.route?.params?.title || 'eMedEvents';
  const checkout = useConferenceCheckout(props.navigation);
  const [popupUrl, setPopupUrl] = useState(null);

    /**
 * Handles back.
 * @returns {void}
 */
const handleBack = useCallback(() => {
    checkout.cancel();
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }

    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
      return;
    }

    props.navigation.navigate('GuestUser');
  }, [canGoBack, props.navigation]);

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => subscription.remove();
  }, [handleBack]));

  return (
    <>
      <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
        <PageHeader title={title} onBackPress={handleBack} hideCart showTitle />
        <WebView
          ref={webViewRef}
          source={{ uri: popupUrl || targetUrl }}
          originWhitelist={['*']}
          scalesPageToFit={false}
          pinchGestureEnabled={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          textZoom={100}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          onShouldStartLoadWithRequest={checkout.shouldStartLoad}
          setSupportMultipleWindows={false}
          onOpenWindow={({nativeEvent}) => {
            if (/^https?:\/\//i.test(nativeEvent.targetUrl) && checkout.shouldStartLoad({url: nativeEvent.targetUrl})) setPopupUrl(nativeEvent.targetUrl);
          }}
          injectedJavaScriptBeforeContentLoaded={conferenceCheckoutScript}
          injectedJavaScript={conferenceCheckoutScript}
          onMessage={checkout.onMessage}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          startInLoadingState={true}
          renderError={() => (
            <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FFFFFF' }]}>
              <Text style={{ fontFamily: Fonts.InterMedium, color: '#111827', textAlign: 'center', fontSize: 14 }}>
                Unable to load this page. Please try again.
              </Text>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry page" onPress={() => webViewRef.current?.reload()} style={{ padding: 16 }}>
                <Text style={{ fontFamily: Fonts.InterBold, color: '#2C4DB9', fontSize: 14 }}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {checkout.loading && <ActivityIndicator size="large" color="#2C4DB9" style={[StyleSheet.absoluteFillObject, {backgroundColor: 'white'}]} />}
      </SafeAreaView>
    </>
  );
};

/**
 * External web view default export.
 *
 * @returns {*}
 */
const ExternalWebView = props => (
  <ExternalWebViewSession
    key={`${props?.route?.params?.url || ''}:${props?.route?.params?.key || ''}`}
    {...props}
  />
);

export default ExternalWebView;
