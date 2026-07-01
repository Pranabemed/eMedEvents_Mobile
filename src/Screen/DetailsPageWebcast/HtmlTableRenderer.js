/**
 * Html table renderer screen module. Renders a React Native screen or a screen-scoped support component. Exported members: HtmlTableRenderer.
 */

import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import RenderHTML from 'react-native-render-html';

/**
 * Reusable HtmlTableRenderer component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const HtmlTableRenderer = ({ source, width, tagsStyles, onLinkPress }) => {
    const [webViewHeight, setWebViewHeight] = useState(200);
    const lastHeightRef = useRef(200);
    const html = source?.html || '';
    const hasTable = html.toLowerCase().includes('<table');

    if (hasTable) {
        const injectedJS = `
            (function() {
                function postHeight() {
                    var height = document.documentElement.scrollHeight || document.body.scrollHeight;
                    window.ReactNativeWebView.postMessage(String(height));
                }

                function postLink(event) {
                    var node = event.target;
                    while (node && node.tagName !== 'A') {
                        node = node.parentElement;
                    }

                    if (node && node.tagName === 'A' && node.href) {
                        event.preventDefault();
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'link',
                            href: node.href
                        }));
                    }
                }

                document.addEventListener('click', postLink, true);
                setTimeout(postHeight, 500);
                true;
            })();
        `;

        return (
            <View style={{ height: webViewHeight, width: '100%', marginVertical: 10, overflow: 'hidden' }}>
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
                    scrollEnabled={false}
                    onShouldStartLoadWithRequest={(request) => {
                        const url = request?.url || '';

                        if (!url || url === 'about:blank' || url.startsWith('about:srcdoc') || url.startsWith('javascript:')) {
                            return true;
                        }

                        if (onLinkPress) {
                            onLinkPress(url);
                        }
                        return false;
                    }}
                    onMessage={(event) => {
                        const rawData = event?.nativeEvent?.data;
                        if (!rawData) return;

                        try {
                            const parsed = JSON.parse(rawData);
                            if (parsed?.type === 'link' && parsed?.href) {
                                if (onLinkPress) {
                                    onLinkPress(parsed.href);
                                }
                                return;
                            }
                        } catch (error) {
                            // Not a JSON link payload, fall through to height handling.
                        }

                        const height = Number(rawData);
                        if (height > 0) {
                            const nextHeight = height + 30;
                            if (Math.abs(nextHeight - lastHeightRef.current) > 8) {
                                lastHeightRef.current = nextHeight;
                                setWebViewHeight(nextHeight);
                            }
                        }
                    }}
                    injectedJavaScript={injectedJS}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    }

    return (
        <RenderHTML
            contentWidth={width}
            source={source}
            tagsStyles={tagsStyles}
            renderersProps={{
                a: {
                                        /**
 * On press helper.
 * @param {*} event - Input value.
 * @param {*} href - Input value.
 * @returns {void}
 */
onPress: (event, href) => {
                        if (href && onLinkPress) {
                            onLinkPress(href);
                        }
                    }
                }
            }}
        />
    );
};

/**
 * Html table renderer default export.
 *
 * @returns {*}
 */
export default HtmlTableRenderer;
