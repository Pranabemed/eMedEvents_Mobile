import React, { useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import RenderHTML from 'react-native-render-html';

const HtmlTableRenderer = ({ source, width, tagsStyles }) => {
    const [webViewHeight, setWebViewHeight] = useState(200);
    const html = source?.html || '';
    const hasTable = html.toLowerCase().includes('<table');

    if (hasTable) {
        // Inject script to calculate content height and post it back to React Native
        const injectedJS = `
            setTimeout(function() {
                var height = document.documentElement.scrollHeight || document.body.scrollHeight;
                window.ReactNativeWebView.postMessage(height.toString());
            }, 500);
            true;
        `;

        return (
            <View style={{ height: webViewHeight, width: '100%', marginVertical: 10 }}>
                <WebView
                    originWhitelist={['*']}
                    source={{
                        html: `
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                              body { 
                                font-family: -apple-system, system-ui; 
                                font-size: 16px; 
                                margin: 0; 
                                padding: 0; 
                                color: #000;
                              }
                              table { 
                                width: 100% !important; 
                                border-collapse: collapse; 
                                margin-bottom: 10px; 
                              }
                              th, td { 
                                border: 1px solid #ddd; 
                                padding: 8px; 
                                text-align: left; 
                              }
                              th { 
                                background-color: #f8f8f8; 
                                font-weight: bold;
                              }
                              img {
                                max-width: 100%;
                                height: auto;
                              }
                            </style>
                          </head>
                          <body>
                            <div id="content-wrapper">${html}</div>
                          </body>
                        </html>`
                    }}
                    scrollEnabled={true}
                    onMessage={(event) => {
                        const height = Number(event.nativeEvent.data);
                        if (height > 0) {
                            setWebViewHeight(height + 30);
                        }
                    }}
                    injectedJavaScript={injectedJS}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            </View>
        );
    }

    return (
        <RenderHTML
            contentWidth={width}
            source={source}
            tagsStyles={tagsStyles}
        />
    );
};

export default HtmlTableRenderer;
