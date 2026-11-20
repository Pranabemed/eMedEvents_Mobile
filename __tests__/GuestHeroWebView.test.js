import {CONFERENCE_CHECKOUT_API_BASE} from '../src/Utils/Helpers/ConferenceCheckoutApi';
import React from 'react';
import {Modal, InteractionManager} from 'react-native';
import {postApi} from '../src/Utils/Helpers/ApiRequest';
import {render, fireEvent, act} from '@testing-library/react-native';
import {GuestHeroSection} from '../src/Screen/HomePage/GuestUserModule/components/GuestHeroSection';
jest.mock('../src/Utils/Helpers/ApiRequest', () => ({postApi: jest.fn()}));
jest.mock('react-native-share', () => ({__esModule: true, default: {open: jest.fn()}}));
const mockDispatch = jest.fn();
let mockWebcastState = {};
beforeEach(() => { mockWebcastState = {}; });
jest.mock('react-redux', () => ({useDispatch: () => mockDispatch, useSelector: selector => selector({WebcastReducer: mockWebcastState})}));
const mockGoBack = jest.fn();
const mockStopLoading = jest.fn();
const mockInjectJavaScript = jest.fn();
jest.mock('react-native-webview', () => ({WebView: require('react').forwardRef((props, ref) => {
  require('react').useImperativeHandle(ref, () => ({goBack: mockGoBack, stopLoading: mockStopLoading, injectJavaScript: mockInjectJavaScript}));
  return require('react').createElement('WebView', props);
})}));
jest.mock('react-native-snap-carousel', () => props => require('react').createElement('Carousel', props, props.data.map((item, index) => require('react').createElement(require('react').Fragment, {key: index}, props.renderItem({item, index})))));
jest.mock('react-native-linear-gradient', () => 'Gradient');
jest.mock('react-native-safe-area-context', () => ({SafeAreaProvider: 'SafeAreaProvider', SafeAreaView: 'SafeAreaView'}));
jest.mock('../src/Screen/HomePage/GuestUserModule/components/GuestUserShimmers', () => ({GuestHeroShimmer: 'Shimmer'}));
jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
const setup = () => {
  const navigation = {navigate: jest.fn()};
  const screen = render(<GuestHeroSection topBanners={[{title: 'Conference', banner_url: 'https://example.com/conference'}]} navigation={navigation} width={390} />);
  fireEvent.press(screen.getByText('REGISTER NOW'));
  return {screen, navigation};
};
test('banner styles install once and return if website hydration removes them', () => {
  const {screen} = setup();
  const web = screen.UNSAFE_getByType('WebView');
  const vm = require('vm');
  let installedStyle;
  let onMutation;
  const appendChild = jest.fn(style => { installedStyle = style; });
  const context = vm.createContext({
    window: {},
    location: {href: 'https://example.com/conference'},
    document: {
      head: {appendChild},
      getElementById: () => installedStyle,
      createElement: () => ({}),
    },
    MutationObserver: function (callback) {
      onMutation = callback;
      this.observe = jest.fn();
    },
  });
  vm.runInContext(web.props.injectedJavaScriptBeforeContentLoaded, context);
  vm.runInContext(web.props.injectedJavaScript, context);
  expect(appendChild).toHaveBeenCalledTimes(1);
  expect(installedStyle.textContent).toContain('header[class*="Hero_navbar__"]');
  expect(installedStyle.textContent).toContain('footer[class*="Footer_footer__"]');
  expect(installedStyle.textContent).not.toMatch(/(?:^|,)\s*header\s*[,\{]/);
  expect(installedStyle.textContent).toContain('header:not(main header):not(article header):not(section header):not(aside header)');
  expect(installedStyle.textContent).toContain('.site-footer');
  expect(installedStyle.textContent).toContain('[class*="_nav_mai"]');
  expect(installedStyle.textContent).toContain('nav.navbar');
  expect(installedStyle.textContent).toContain('[class~="footer-main" i]');
  expect(installedStyle.textContent).toContain('a[href*="privacy" i]');
  expect(installedStyle.textContent).toContain('[class*="past-conference" i]');
  expect(installedStyle.textContent).toContain('font-size: 14px');
  const expectedCss = installedStyle.textContent;
  installedStyle.textContent = '';
  onMutation();
  expect(installedStyle.textContent).toBe(expectedCss);
  expect(appendChild).toHaveBeenCalledTimes(1);
  installedStyle = null;
  onMutation();
  expect(appendChild).toHaveBeenCalledTimes(2);
});
test('banner opens inside the app and Close returns to the hero', () => {
  const {screen, navigation} = setup();
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe('https://example.com/conference');
  expect(navigation.navigate).not.toHaveBeenCalled();
  fireEvent.press(screen.getByLabelText('Close banner page'));
  expect(screen.UNSAFE_queryByType('WebView')).toBeNull();
});
test('web links and new windows stay internal; external schemes are blocked', () => {
  const {screen} = setup();
  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.originWhitelist).toEqual(['*']);
  expect(web.props.onShouldStartLoadWithRequest({url: 'https://example.org/register'})).toBe(true);
  for (const url of ['intent://open', 'mailto:test@example.org', 'tel:123', 'javascript:alert(1)']) {
    expect(web.props.onShouldStartLoadWithRequest({url})).toBe(false);
  }
  act(() => web.props.onOpenWindow({nativeEvent: {targetUrl: 'https://example.org/register'}}));
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe('https://example.org/register');
});
test('Android Back uses web history first, then closes the page', () => {
  const {screen} = setup();
  act(() => screen.UNSAFE_getByType('WebView').props.onNavigationStateChange({canGoBack: true}));
  act(() => screen.UNSAFE_getByType(Modal).props.onRequestClose());
  expect(mockGoBack).toHaveBeenCalledTimes(1);
  act(() => screen.UNSAFE_getByType('WebView').props.onNavigationStateChange({canGoBack: false}));
  act(() => screen.UNSAFE_getByType(Modal).props.onRequestClose());
  expect(screen.UNSAFE_queryByType('WebView')).toBeNull();
});

test('reapplies conference styles after each completed page load', () => {
  const {screen} = setup();
  const web = screen.UNSAFE_getByType('WebView');
  mockInjectJavaScript.mockClear();
  act(() => web.props.onLoadEnd());
  act(() => web.props.onLoadEnd());
  expect(mockInjectJavaScript).toHaveBeenCalledTimes(2);
  expect(mockInjectJavaScript.mock.calls[0][0]).toContain('guest-hero-page-styles');
});

test('navigating to Checkout maintains web view so Back returns to web view', async () => {
  postApi.mockResolvedValueOnce({data: {success: true, conferenceId: 42}});
  const {screen, navigation} = setup();
  await act(async () => {
    await screen.UNSAFE_getByType('WebView').props.onMessage({nativeEvent: {
      url: 'https://www.emedevents.com/conference',
      data: JSON.stringify({type: 'conference-checkout', pageUrl: 'https://www.emedevents.com/conference', response: {success: true, invoice: 'test-invoice', tickets: [{id: 7, quantity: 1}]}, payload: {
        conference_id: 42, conference_url: 'conference', tickets: [{id: 7, quantity: 1}],
      }}),
    }});
  });
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.any(Object));
  expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(true);
  expect(screen.UNSAFE_getByType(Modal).props.animationType).toBe('none');
  // Closing the web view returns back to hero section
  fireEvent.press(screen.getByLabelText('Close banner page'));
  expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
});

test('requests conference details from the banner href on the initial tap', () => {
  mockDispatch.mockClear();
  const screen = render(<GuestHeroSection topBanners={[{
    title: 'Conference', banner_url: 'https://example.com/other',
    html_content: '<a href="https://www.emedevents.com/cme/conference?ref=1&amp;source=banner">Register</a>',
  }]} navigation={{navigate: jest.fn()}} width={390} />);
  fireEvent.press(screen.getByText('REGISTER NOW'));
  const url = 'https://www.emedevents.com/cme/conference?ref=1&source=banner';
  expect(mockDispatch).toHaveBeenCalledWith({type: 'WebCast/webcastDeatilsRequest', payload: {conference_url: 'conference'}, meta: {checkoutApiBase: `${CONFERENCE_CHECKOUT_API_BASE}`}});
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe(url);
});


test('injects Redux conference and ticket IDs when details metadata contains a full URL', () => {
  mockWebcastState = {
    webcastDeatilsResponseUrl: 'https://www.emedevents.com/cme/conference?ref=1',
    webcastDeatilsResponse: {conferenceId: '330468', registrationTickets: [{id: '1609693', name: '<b>Physician</b>'}]},
  };
  const {screen} = setup();
  const script = screen.UNSAFE_getByType('WebView').props.injectedJavaScriptBeforeContentLoaded;
  expect(script).toContain('"id":"330468"');
  expect(script).toContain('"id":"1609693"');
  expect(script).toContain('"required":true');
});


test.each(['Back', 'Close banner page'])('reopens the same banner with a fresh WebView after %s', control => {
  const {screen} = setup();
  const firstWeb = screen.UNSAFE_getByType('WebView');
  for (let attempt = 0; attempt < 3; attempt++) {
    fireEvent.press(screen.getByLabelText(control));
    expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
    expect(screen.UNSAFE_queryByType('WebView')).toBeNull();
    fireEvent.press(screen.getByText('REGISTER NOW'));
    const reopened = screen.UNSAFE_getByType('WebView');
    expect(reopened).not.toBe(firstWeb);
    expect(reopened.props.source.uri).toBe('https://example.com/conference');
    expect(reopened.props.onShouldStartLoadWithRequest({url: 'https://example.com/conference'})).toBe(true);
    expect(screen.queryByLabelText('Loading checkout')).toBeNull();
  }
  expect(mockStopLoading).toHaveBeenCalled();
});

test('opens deep link conference directly in GuestHeroSection with matching banner and title', () => {
  const navigation = {navigate: jest.fn()};
  const banners = [
    {title: 'Other Conference', banner_url: 'https://example.com/other'},
    {title: 'Psychedelics in Clinical Medicine 2027', banner_url: 'https://www.emedevents.com/cme/psychedelics-in-clinical-medicine-2027'}
  ];
  const deepLinkUrl = 'https://www.emedevents.com/cme/psychedelics-in-clinical-medicine-2027';

  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
      deepLinkUrl={deepLinkUrl}
    />
  );

  expect(mockDispatch).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'WebCast/webcastDeatilsRequest',
      payload: {conference_url: 'psychedelics-in-clinical-medicine-2027'},
    })
  );

  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.source.uri).toBe(deepLinkUrl);
  expect(screen.getAllByText('Psychedelics in Clinical Medicine 2027').length).toBeGreaterThanOrEqual(1);

  // Closing returns directly to GuestHeroSection
  fireEvent.press(screen.getByLabelText('Close banner page'));
  expect(screen.UNSAFE_queryByType('WebView')).toBeNull();
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test('generic cme deep link maps to GuestHeroSection without auto-opening conference modal', () => {
  const navigation = {navigate: jest.fn()};
  const banners = [{title: 'Conference', banner_url: 'https://example.com/conference'}];

  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
      deepLinkUrl="https://www.emedevents.com/cme"
    />
  );

  expect(screen.UNSAFE_queryByType('WebView')).toBeNull();
  expect(screen.getByText('REGISTER NOW')).toBeTruthy();
});

test('whole hero card is clickable and opens the conference', () => {
  const navigation = {navigate: jest.fn()};
  const banners = [{title: 'Card Click Test', banner_url: 'https://example.com/card-click-test'}];

  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
    />
  );

  // Pressing anywhere on the whole card opens the conference webview modal
  fireEvent.press(screen.getByLabelText('Card Click Test'));
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe('https://example.com/card-click-test');
});

test('global search closes the banner WebView and opens app search', () => {
  const {screen, navigation} = setup();
  fireEvent.press(screen.getByLabelText('Global search'));
  expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
  expect(navigation.navigate).toHaveBeenCalledWith('HeaderSearch');
});

test('share uses the current conference page and leaves the WebView open', async () => {
  const Share = require('react-native-share').default || require('react-native-share');
  Share.open.mockResolvedValueOnce({success: true});
  const {screen} = setup();
  const url = 'https://www.emedevents.com/cme/selected-conference';
  act(() => screen.UNSAFE_getByType('WebView').props.onNavigationStateChange({url, canGoBack: true}));
  await act(async () => { fireEvent.press(screen.getByLabelText('Share conference')); });
  expect(Share.open).toHaveBeenCalledWith(expect.objectContaining({url}));
  expect(screen.UNSAFE_getByType('WebView')).toBeTruthy();
});

test('focus listener preserves web view on back from Checkout (GuestHeroSection <= web view <= Checkout)', () => {
  let blurCallback, focusCallback;
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn((event, cb) => {
      if (event === 'blur') blurCallback = cb;
      if (event === 'focus') focusCallback = cb;
      return jest.fn();
    }),
  };
  const banners = [{title: 'Conference 1', banner_url: 'https://example.com/conf1'}];
  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
    />
  );

  // 1. Open WebView
  fireEvent.press(screen.getByText('REGISTER NOW'));
  expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(true);

  // 2. Checkout is pushed -> blur event fires, Modal hides cleanly without destroying bannerPage
  act(() => blurCallback?.());
  expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(false);

  // 3. Back from Checkout -> focus event fires, Modal becomes visible again
  act(() => focusCallback?.());
  expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(true);

  // 4. Back from WebView -> closes modal and returns to GuestHeroSection
  fireEvent.press(screen.getByLabelText('Back'));
  expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
});

test('carousel counter accurately reflects visible card and is not forced by deepLinkUrl', () => {
  const navigation = {navigate: jest.fn(), addListener: jest.fn()};
  const banners = [
    {title: 'Banner 1', banner_url: 'https://www.emedevents.com/cme/conf-1'},
    {title: 'Banner 2', banner_url: 'https://www.emedevents.com/cme/conf-2'},
    {title: 'Banner 3', banner_url: 'https://www.emedevents.com/cme/conf-3'},
  ];
  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
      deepLinkUrl="https://www.emedevents.com/cme/conf-3"
    />
  );

  // Initial carousel counter is 1/3 (not falsely desynced to 3/3)
  expect(screen.getByText('1/3')).toBeTruthy();
});

test('renders sticky bold title and disables zoom on webview', () => {
  const {screen} = setup();
  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.scalesPageToFit).toBe(false);
  expect(web.props.pinchGestureEnabled).toBe(false);
  expect(web.props.setBuiltInZoomControls).toBe(false);
  expect(web.props.setDisplayZoomControls).toBe(false);
  expect(web.props.textZoom).toBe(100);
  expect(screen.getAllByText('Conference').length).toBeGreaterThanOrEqual(1);
});

test('restores the carousel position and counter after a home loading refresh', () => {
  const navigation = {navigate: jest.fn()};
  const banners = Array.from({length: 5}, (_, index) => ({title: `Conference ${index}`, banner_url: `https://example.com/conference-${index}`}));
  const screen = render(<GuestHeroSection topBanners={banners} navigation={navigation} width={390} />);
  act(() => screen.UNSAFE_getByType('Carousel').props.onSnapToItem(2));
  expect(screen.getByText('3/5')).toBeTruthy();
  screen.rerender(<GuestHeroSection topBanners={[...banners]} isHomeLoading navigation={navigation} width={390} />);
  screen.rerender(<GuestHeroSection topBanners={[...banners]} navigation={navigation} width={390} />);
  expect(screen.UNSAFE_getByType('Carousel').props.firstItem).toBe(2);
  expect(screen.getByText('3/5')).toBeTruthy();
});

test('keeps modal covering Home through synchronous navigation blur and restores WebView on return', async () => {
  const listeners = {};
  let finishTransition;
  const frame = jest.spyOn(global, 'requestAnimationFrame').mockImplementation(callback => { callback(); return 1; });
  const interaction = jest.spyOn(InteractionManager, 'runAfterInteractions').mockImplementation(callback => {
    finishTransition = callback;
    return {cancel: jest.fn()};
  });
  const navigation = {
    addListener: (name, callback) => { listeners[name] = callback; return () => {}; },
    navigate: jest.fn(() => listeners.blur()),
  };
  postApi.mockResolvedValueOnce({data: {success: true, conferenceId: 42}});
  try {
    const screen = render(<GuestHeroSection topBanners={[{title: 'Conference', banner_url: 'https://www.emedevents.com/conference'}]} navigation={navigation} width={390} />);
    fireEvent.press(screen.getByText('REGISTER NOW'));
    const originalWeb = screen.UNSAFE_getByType('WebView');
    await act(async () => {
      await originalWeb.props.onMessage({nativeEvent: {url: 'https://www.emedevents.com/conference', data: JSON.stringify({
        type: 'conference-checkout', pageUrl: 'https://www.emedevents.com/conference',
        payload: {conference_id: 42, tickets: [{id: 7, quantity: 1}]},
        response: {success: true, invoice: 'invoice', tickets: [{id: 7, quantity: 1}]},
      })}});
    });
    expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(true);
    expect(screen.UNSAFE_getByType(Modal).props.animationType).toBe('none');
    expect(screen.getByLabelText('Loading checkout')).toBeTruthy();
    act(() => finishTransition());
    expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(false);
    act(() => listeners.focus());
    expect(screen.UNSAFE_getByType(Modal).props.visible).toBe(true);
    expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe('https://www.emedevents.com/conference');
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText('Loading checkout')).toBeNull();
  } finally {
    frame.mockRestore();
    interaction.mockRestore();
  }
});

test('normalizes relative deepLinkUrl to full HTTPS URL to prevent net::ERR_ACCESS_DENIED', () => {
  const navigation = {navigate: jest.fn()};
  const banners = [
    {title: 'Psychedelics in Clinical Medicine 2027', html_content: '<a href="/cme/psychedelics-in-clinical-medicine-2027"><h2>Psychedelics in Clinical Medicine 2027</h2></a>'}
  ];
  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
      deepLinkUrl="/cme/psychedelics-in-clinical-medicine-2027"
    />
  );
  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.source.uri).toBe('https://www.emedevents.com/cme/psychedelics-in-clinical-medicine-2027');
});

test('opens hybrid web conferences like American Academy of Neurology 2027 with full HTTPS URL and deepLinkTitle', () => {
  const navigation = {navigate: jest.fn()};
  const banners = [];
  const screen = render(
    <GuestHeroSection
      topBanners={banners}
      navigation={navigation}
      width={390}
      deepLinkUrl="medical-hybrid-events-2027/american-academy-of-neurology-aan-2027-annual-meeting-23"
      deepLinkTitle="American Academy of Neurology (AAN) 2027 Annual Meeting"
    />
  );
  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.source.uri).toBe('https://www.emedevents.com/medical-hybrid-events-2027/american-academy-of-neurology-aan-2027-annual-meeting-23');
  expect(screen.getByText('American Academy of Neurology (AAN) 2027 Annual Meeting')).toBeTruthy();
});

test('Past Conference label cannot hide a container containing the conference title', () => {
  const {screen} = setup();
  const vm = require('vm');
  let installedStyle;
  const wrapper = {querySelector: () => ({tagName: 'H1'}), style: {setProperty: jest.fn()}};
  const label = {textContent: 'Past Conferences', closest: selector => selector === 'section' ? wrapper : null, style: {setProperty: jest.fn()}};
  const context = vm.createContext({
    window: {}, location: {href: 'https://example.com/conference'},
    document: {
      head: {appendChild: style => { installedStyle = style; }},
      getElementById: () => installedStyle,
      createElement: () => ({}),
      querySelectorAll: () => [label],
    },
    MutationObserver: function () { this.observe = jest.fn(); },
  });
  vm.runInContext(screen.UNSAFE_getByType('WebView').props.injectedJavaScript, context);
  expect(wrapper.style.setProperty).not.toHaveBeenCalled();
  expect(label.style.setProperty).toHaveBeenCalledWith('display', 'none', 'important');
});

test('American Neurology banner loads its exact URL and provides a load-error view', () => {
  const url = 'https://www.emedevents.com/cme/american-neurology-summit-2027';
  const screen = render(<GuestHeroSection topBanners={[{title: 'American Neurology Summit 2027', banner_url: url}]} navigation={{navigate: jest.fn()}} width={390} />);
  fireEvent.press(screen.getByText('REGISTER NOW'));
  const web = screen.UNSAFE_getByType('WebView');
  expect(web.props.source.uri).toBe(url);
  expect(web.props.onShouldStartLoadWithRequest({url})).toBe(true);
  const errorView = render(web.props.renderError());
  expect(errorView.getByLabelText('Retry conference page')).toBeTruthy();
});

test('only the first conference heading gets the large-title style', () => {
  const {screen} = setup();
  const vm = require('vm');
  let installedStyle;
  const primary = {hasAttribute: () => false, setAttribute: jest.fn()};
  const secondary = {removeAttribute: jest.fn()};
  const context = vm.createContext({
    window: {}, location: {href: 'https://example.com/conference'},
    document: {
      head: {appendChild: style => { installedStyle = style; }},
      getElementById: () => installedStyle,
      createElement: () => ({}),
      querySelector: selector => selector === 'h1' ? primary : null,
      querySelectorAll: selector => selector === '[data-guest-hero-title]' ? [secondary] : [],
    },
    MutationObserver: function () { this.observe = jest.fn(); },
  });
  vm.runInContext(screen.UNSAFE_getByType('WebView').props.injectedJavaScript, context);
  expect(primary.setAttribute).toHaveBeenCalledWith('data-guest-hero-title', 'true');
  expect(secondary.removeAttribute).toHaveBeenCalledWith('data-guest-hero-title');
  expect(installedStyle.textContent).toContain('font-size: 26px !important');
  expect(installedStyle.textContent).toContain('font-size: 14px !important');
  expect(installedStyle.textContent).not.toContain('h1, h1 * { font-size: 24px');
});

test('cookie consent modals are hidden, top whitespace is collapsed, and cards are dynamically equalized', () => {
  const {screen} = setup();
  const vm = require('vm');
  let installedStyle;
  const cookieModal = {style: {setProperty: jest.fn()}, remove: jest.fn()};
  const topContainer = {style: {setProperty: jest.fn()}};
  const cardA = {className: 'pricing-card', offsetHeight: 180, style: {setProperty: jest.fn(), minHeight: ''}};
  const cardB = {className: 'pricing-card', offsetHeight: 240, style: {setProperty: jest.fn(), minHeight: ''}};
  const cardContainer = {className: 'pricing-row', children: [cardA, cardB]};
  const bodyEl = {style: {overflow: 'hidden'}};
  const boldPara = {tagName: 'P', style: {fontWeight: 'bold', setProperty: jest.fn()}};
  const attractionSlide = {classList: {contains: cls => cls === 'slick-slide'}, style: {setProperty: jest.fn()}};
  const attractionSection = {querySelectorAll: () => [attractionSlide]};

  const context = vm.createContext({
    window: {},
    location: {href: 'https://example.com/conference'},
    document: {
      body: bodyEl,
      head: {appendChild: style => { installedStyle = style; }},
      getElementById: () => installedStyle,
      createElement: () => ({}),
      querySelector: () => null,
      querySelectorAll: selector => {
        if (selector.includes('cookie') || selector.includes('consent')) return [cookieModal];
        if (selector.includes('main') || selector.includes('Hero_section')) return [topContainer];
        if (selector.includes('row') || selector.includes('cards')) return [cardContainer];
        if (selector.includes('attraction')) return [attractionSection];
        if (selector.includes('blockquote') || selector.includes('p, li, td, label')) return [boldPara];
        return [];
      },
    },
    MutationObserver: function () { this.observe = jest.fn(); },
  });

  vm.runInContext(screen.UNSAFE_getByType('WebView').props.injectedJavaScript, context);

  expect(cookieModal.style.setProperty).toHaveBeenCalledWith('display', 'none', 'important');
  expect(cookieModal.remove).toHaveBeenCalled();
  expect(bodyEl.style.overflow).toBe('auto');
  expect(topContainer.style.setProperty).toHaveBeenCalledWith('margin-top', '0px', 'important');
  expect(cardA.style.setProperty).toHaveBeenCalledWith('min-height', '240px', 'important');
  expect(cardB.style.setProperty).toHaveBeenCalledWith('min-height', '240px', 'important');
  expect(boldPara.style.setProperty).toHaveBeenCalledWith('font-weight', 'normal', 'important');
  expect(attractionSlide.style.setProperty).toHaveBeenCalledWith('padding-left', '8px', 'important');
  expect(attractionSlide.style.setProperty).toHaveBeenCalledWith('padding-right', '8px', 'important');
  expect(installedStyle.textContent).toContain('font-weight: 400 !important;');
  expect(installedStyle.textContent).toContain('margin-top: 0 !important; padding-top: 0 !important;');
});

test('only removes the yellow quote circle badge while preserving the testimonial card, avatar initials, and normalizing body text', () => {
  const {screen} = setup();
  const vm = require('vm');
  let installedStyle;
  const quoteCircle = {className: 'quote-badge yellow', textContent: '"', offsetWidth: 40, offsetHeight: 40, style: {setProperty: jest.fn(), backgroundColor: '#FFD700'}};
  const avatarCircle = {className: 'attendee-avatar', textContent: 'DG', children: [], style: {setProperty: jest.fn(), backgroundColor: '#7A22B8'}};
  const testimonialCard = {
    className: 'testimonial-card',
    style: {setProperty: jest.fn()},
    querySelectorAll: selector => {
      return [quoteCircle, avatarCircle];
    },
  };
  const welcomePara = {tagName: 'P', textContent: 'As Chair of #HerOncology2027: Updates in Breast & Gynecologic Cancer Therapeutics...', style: {setProperty: jest.fn()}};

  const context = vm.createContext({
    window: {getComputedStyle: el => ({backgroundColor: el?.style?.backgroundColor || ''})},
    location: {href: 'https://example.com/conference'},
    document: {
      head: {appendChild: style => { installedStyle = style; }},
      getElementById: () => installedStyle,
      createElement: () => ({}),
      querySelector: () => null,
      querySelectorAll: selector => {
        if (selector.startsWith('p, p *')) return [welcomePara];
        if (selector.includes('yellow') || selector.includes('quote') || selector.includes('div, span, img')) return [quoteCircle, avatarCircle];
        if (selector.includes('testimonial') || selector.includes('attendee') || selector.includes('card')) return [testimonialCard];
        return [];
      },
    },
    MutationObserver: function () { this.observe = jest.fn(); },
  });

  vm.runInContext(screen.UNSAFE_getByType('WebView').props.injectedJavaScript, context);

  expect(quoteCircle.style.setProperty).toHaveBeenCalledWith('display', 'none', 'important');
  expect(avatarCircle.style.setProperty).not.toHaveBeenCalledWith('display', 'none', 'important');
  expect(testimonialCard.style.setProperty).not.toHaveBeenCalledWith('display', 'none', 'important');
  expect(welcomePara.style.setProperty).toHaveBeenCalledWith('font-weight', 'normal', 'important');
  expect(installedStyle.textContent).toContain('[class*="yellow" i]:not([class*="card" i])');
});

test('all titles across the conference are styled bold and body text is normalized', () => {
  const {screen} = setup();
  const vm = require('vm');
  let installedStyle;
  const sectionTitle = {tagName: 'H2', textContent: 'About Innovations in Stroke and Cardiac Care Conference #ISCC2027', style: {setProperty: jest.fn()}};
  const cardTitle = {tagName: 'DIV', className: 'card_title', textContent: 'General Session', style: {setProperty: jest.fn()}};
  const bodyPara = {tagName: 'P', textContent: 'This CME/CE-accredited hybrid conference brings together specialists...', style: {setProperty: jest.fn()}};

  const context = vm.createContext({
    window: {},
    location: {href: 'https://example.com/conference'},
    document: {
      head: {appendChild: style => { installedStyle = style; }},
      getElementById: () => installedStyle,
      createElement: () => ({}),
      querySelector: () => null,
      querySelectorAll: selector => {
        if (selector.startsWith('p, p *')) return [sectionTitle, cardTitle, bodyPara];
        return [];
      },
    },
    MutationObserver: function () { this.observe = jest.fn(); },
  });

  vm.runInContext(screen.UNSAFE_getByType('WebView').props.injectedJavaScript, context);

  expect(sectionTitle.style.setProperty).not.toHaveBeenCalledWith('font-weight', 'normal', 'important');
  expect(cardTitle.style.setProperty).not.toHaveBeenCalledWith('font-weight', 'normal', 'important');
  expect(bodyPara.style.setProperty).toHaveBeenCalledWith('font-weight', 'normal', 'important');
  expect(installedStyle.textContent).toContain('font-weight: 700 !important');
});
