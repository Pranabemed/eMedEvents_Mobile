import React, { useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { SafeAreaView } from 'react-native-safe-area-context';
const ExternalWebView = (props) => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const targetUrl = props?.route?.params?.url || '';
  const title = props?.route?.params?.title || 'eMedEvents';

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

export default ExternalWebView;
