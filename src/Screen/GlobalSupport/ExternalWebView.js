/**
 * External web view screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ExternalWebView, handleBack.
 */

import React, { useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Reusable ExternalWebView component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ExternalWebView = (props) => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const targetUrl = props?.route?.params?.url || '';
  const title = props?.route?.params?.title || 'eMedEvents';

    /**
 * Handles back.
 * @returns {void}
 */
const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }

    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
      return;
    }

    props.navigation.navigate('TabNav', { initialRoute: 'Home' });
  };

  return (
    <>
      <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
        {/* {Platform.OS === 'ios' ? (
          <PageHeader title={title} onBackPress={handleBack} />
        ) : (
          <View>
            <PageHeader title={title} onBackPress={handleBack} />
          </View>
        )} */}
        <WebView
          ref={webViewRef}
          source={{ uri: targetUrl }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          startInLoadingState={true}
        />
      </SafeAreaView>
    </>
  );
};

/**
 * External web view default export.
 *
 * @returns {*}
 */
export default ExternalWebView;
