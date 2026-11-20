import {useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../../Utils/Helpers/constants';
import {postApi} from '../../../Utils/Helpers/ApiRequest';
import {CONFERENCE_CHECKOUT_API_BASE, getConferenceSlug} from '../../../Utils/Helpers/ConferenceCheckoutApi';
import {getPublicIP} from '../../../Utils/Helpers/IPServer';

export const isEmedWebUrl = value => /^https:\/\/(?:[a-z0-9-]+\.)*emedevents\.com(?::443)?(?:\/|$)/i.test(value || '');
export const isCmeWebLink = value => isEmedWebUrl(value) && /^https:\/\/[^/]+\/cme(?:[/?#]|$)/i.test(value);

// Keep the website request/session intact; hand its response to native checkout.
export const conferenceCheckoutScript = `
(function () {
  if (window.__nativeConferenceCheckout || !/^https:\\/\\/(?:[a-z0-9-]+\\.)*emedevents\\.com(?::443)?(?:\\/|$)/i.test(location.href)) return;
  window.__nativeConferenceCheckout = true;
  function captureWebsiteCatalogue(data) {
    var details = data && (Array.isArray(data.registrationTickets) ? data : data.data);
    if (details && Array.isArray(details.registrationTickets)) window.__websiteRegistrationTickets = details.registrationTickets;
  }
  function captureEmbeddedCatalogue(selectedTickets) {
    var visited = [];
    function visit(value, depth) {
      if (!value || typeof value !== 'object' || depth > 12 || visited.indexOf(value) >= 0) return;
      visited.push(value);
      if (Array.isArray(value.registrationTickets) && selectedTickets.every(function (selected) {
        return Number(selected.quantity) === 0 || value.registrationTickets.some(function (ticket) { return String(ticket.id) === String(selected.id); });
      })) captureWebsiteCatalogue(value);
      Object.keys(value).forEach(function (key) { visit(value[key], depth + 1); });
    }
    visit(window.__NEXT_DATA__, 0);
    if (typeof document !== 'undefined') {
      var scripts = document.querySelectorAll('script[type="application/json"]');
      for (var i = 0; i < scripts.length; i++) {
        try { visit(JSON.parse(scripts[i].textContent), 0); } catch (_) {}
      }
    }
  }
  function isDetailsUrl(url) {
    try { return /\\/Conference\\/conferenceDetailPage\\/?$/i.test(new URL(url, location.href).pathname); } catch (_) { return false; }
  }
  function withConferenceId(body) {
    try {
      var selection = window.__nativeConferenceSelection;
      var slug = location.pathname ? location.pathname.split('/').filter(Boolean).pop() : new URL(location.href).pathname.split('/').filter(Boolean).pop();
      if (!selection) return body;
      if (!selection.id || selection.slug !== slug) {
        if (selection.required) throw new Error('Conference details are still loading. Please try again.');
        return body;
      }
      var payload = typeof body === 'string' ? JSON.parse(body) : body;
      if (!payload || !Array.isArray(payload.tickets)) return body;
      var catalogue = selection.tickets || [];
      if (selection.required && !catalogue.length) throw new Error('Registration tickets are still loading. Please try again.');
      var websiteCatalogue = window.__websiteRegistrationTickets || [];
      if (!payload.tickets.every(function (selected) {
        return Number(selected.quantity) === 0 || websiteCatalogue.some(function (entry) { return String(entry.id) === String(selected.id); });
      })) captureEmbeddedCatalogue(payload.tickets);
      function label(value) {
        var text = String(value || '');
        for (var pass = 0; pass < 3; pass++) {
          text = text.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&nbsp;|&#160;/gi, ' ');
        }
        return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim().toLowerCase()
          .replace(/\\bphysicians\\b/g, 'physician')
          .replace(/\\bstudents\\b/g, 'student');
      }
      function selectedLabel(ticket) {
        var explicit = ticket.name || ticket.ticket_name || ticket.profession;
        if (explicit) return label(explicit);
        var websiteMatches = (window.__websiteRegistrationTickets || []).filter(function (entry) { return String(entry.id) === String(ticket.id); });
        if (websiteMatches.length === 1) return label(websiteMatches[0].name);
        if (typeof document === 'undefined') return '';
        // Read only the row containing this ticket's control, never the user's profile profession.
        var controls = document.querySelectorAll('input, select, [data-ticket-id]');
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          var id = String(ticket.id);
          if (control.getAttribute('data-ticket-id') !== id && control.value !== id &&
              String(control.id || '').split(/[^0-9]+/).indexOf(id) < 0 &&
              String(control.name || '').split(/[^0-9]+/).indexOf(id) < 0) continue;
          var row = control.closest('tr, [data-ticket-id]') || control.parentElement;
          for (var depth = 0; row && depth < 3; depth++, row = row.parentElement) {
            var lines = String(row.innerText || row.textContent || '').split(/[\\r\\n]+/).map(label);
            var names = catalogue.filter(function (entry) { return lines.indexOf(label(entry.name)) >= 0; });
            if (names.length === 1) return label(names[0].name);
            if (names.length > 1) break;
          }
        }
        return '';
      }
      var tickets = payload.tickets.map(function (ticket) {
        if (!catalogue.length || Number(ticket.quantity) === 0) return ticket;
        var websiteMatches = (window.__websiteRegistrationTickets || []).filter(function (entry) { return String(entry.id) === String(ticket.id); });
        var websiteTicket = websiteMatches.length === 1 ? websiteMatches[0] : null;
        var category = ticket.category || (websiteTicket && websiteTicket.category);
        var knownName = ticket.name || ticket.ticket_name || (websiteTicket && websiteTicket.name);
        var matches = catalogue.filter(function (entry) { return String(entry.id) === String(ticket.id); });
        // IDs from different API environments may collide; verify known ticket identity too.
        if (matches.length === 1 && ((knownName && label(matches[0].name) !== label(knownName)) ||
            (category && label(matches[0].category) !== label(category)))) matches = [];
        if (matches.length !== 1) {
          var name = selectedLabel(ticket);
          matches = catalogue.filter(function (entry) {
            return name && label(entry.name) === name && (!category || label(entry.category) === label(category));
          });
        }
        if (matches.length !== 1) throw new Error('Unable to identify selected ticket');
        return Object.assign({}, ticket, {id: matches[0].id});
      });
      return JSON.stringify(Object.assign({}, payload, {conference_id: selection.id, tickets: tickets}));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'conference-checkout-mapping-error', pageUrl: location.href, reason: error.message,
        diagnostics: {
          conferenceId: selection && selection.id,
          selectedTickets: payload && payload.tickets && payload.tickets.map(function (ticket) { return {id: ticket.id, quantity: ticket.quantity}; }),
          websiteTickets: (window.__websiteRegistrationTickets || []).map(function (ticket) { return {id: ticket.id, name: ticket.name}; }),
          registrationTickets: (selection && selection.tickets) || []
        }
      }));
      return null;
    }
  }
  function isSaveTicketsUrl(url) {
    try {
      var target = new URL(url, location.href);
      return /(^|\\.)emedevents\\.com$/i.test(target.hostname) && /\\/transaction\\/saveTickets\\/?$/i.test(target.pathname);
    } catch (_) { return false; }
  }
  function saveTicketsEndpoint(url) {
    var selection = window.__nativeConferenceSelection;
    if (isSaveTicketsUrl(url) && selection && selection.apiBase === '${CONFERENCE_CHECKOUT_API_BASE}') {
      return selection.apiBase + '/transaction/saveTickets';
    }
    return url;
  }
  function notifyNative(url, body, responseData, status) {
    var target;
    try { target = new URL(url, location.href); } catch (_) { return false; }
    try {
      var payload = typeof body === 'string' ? JSON.parse(body) : body;
      if (!payload || !payload.conference_id || !Array.isArray(payload.tickets) || !payload.tickets.length) return false;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'conference-checkout',
        payload: payload,
        response: responseData || null,
        status: status || 200,
        pageUrl: location.href,
        endpoint: target.href,
        apiOrigin: target.origin
      }));
      return true;
    } catch (_) { return false; }
  }
  var open = XMLHttpRequest.prototype.open;
  var send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    var args = Array.prototype.slice.call(arguments);
    args[1] = saveTicketsEndpoint(url);
    this.__checkoutUrl = args[1];
    return open.apply(this, args);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var xhr = this;
    var url = this.__checkoutUrl;
    if (isDetailsUrl(url)) {
      xhr.addEventListener('load', function () {
        try { captureWebsiteCatalogue(xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText)); } catch (_) {}
      });
    }
    if (isSaveTicketsUrl(url)) {
      body = withConferenceId(body);
      if (body === null) return;
      var handled = false;
      var forwarded = false;
      function handoff(event) {
        if (event.type === 'readystatechange' && xhr.readyState !== 4) return;
        if (!handled) {
          handled = true;
          var data;
          try { data = xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText); } catch (_) {}
          forwarded = notifyNative(url, body, data || {success: false, message: 'Unable to save tickets. Please try again.'}, xhr.status || 500);
        }
        // Prevent website response handlers from redirecting to web checkout.
        if (forwarded) event.stopImmediatePropagation();
      }
      ['readystatechange', 'load', 'loadend', 'error', 'timeout', 'abort'].forEach(function (type) {
        xhr.addEventListener(type, handoff, true);
      });
    }
    return send.call(this, body);
  };
  var fetch = window.fetch;
  if (fetch) {
    window.fetch = function (input, options) {
      var url = typeof input === 'string' ? input : (input && input.url);
      if (isDetailsUrl(url)) {
        return fetch.apply(this, arguments).then(function (response) {
          return response.clone().json().then(function (data) { captureWebsiteCatalogue(data); return response; }, function () { return response; });
        });
      }
      if (!isSaveTicketsUrl(url)) return fetch.apply(this, arguments);
      var body = options && options.body;
      var bodyPromise = body != null ? Promise.resolve(body) :
        (input && typeof input.clone === 'function' ? input.clone().text() : Promise.resolve(null));
      var receiver = this;
      return bodyPromise.then(function (originalBody) {
        var requestBody = withConferenceId(originalBody);
        if (requestBody === null) return new Promise(function () {});
        var requestOptions = requestBody === originalBody ? options : Object.assign({}, options, {body: requestBody});
        var endpoint = saveTicketsEndpoint(url);
        var requestInput = input;
        if (endpoint !== url) {
          requestInput = typeof input === 'string' ? endpoint : new Request(endpoint, input);
        }
        return fetch.call(receiver, requestInput, requestOptions).then(function (response) {
        return response.clone().json().catch(function () {
          return {success: false, message: 'Unable to save tickets. Please try again.'};
        }).then(function (data) {
          if (notifyNative(endpoint, requestBody, data, response.status)) return new Promise(function () {});
          return response;
        });
        });
      });
    };
  }
})();
true;
`;

export default function useConferenceCheckout(navigation, onReady, options = {}) {
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const checkoutOpened = useRef(false);
  const generation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; generation.current += 1; };
  }, []);
  const cancel = () => {
    generation.current += 1;
    checkoutOpened.current = false;
    busy.current = false;
    setLoading(false);
  };

  const onMessage = async ({nativeEvent}) => {
    let message;
    try { message = JSON.parse(nativeEvent.data); } catch (_) { return; }
    if (message.type === 'conference-checkout-mapping-error' && isEmedWebUrl(message.pageUrl) && (!nativeEvent.url || isEmedWebUrl(nativeEvent.url))) {
      console.warn('[transaction/saveTickets] Payload mapping:', message.reason, message.diagnostics);
      Alert.alert('Unable to select tickets', message.reason || 'Please select your tickets again.');
      return;
    }
    if (message.type !== 'conference-checkout' || (nativeEvent.url && !isEmedWebUrl(nativeEvent.url)) || !isEmedWebUrl(message.pageUrl) || busy.current || checkoutOpened.current) return;
    const incomingPayload = message.payload;
    if (!incomingPayload?.conference_id || !Array.isArray(incomingPayload.tickets) ||
      incomingPayload.tickets.some(ticket => !ticket || !Number.isInteger(Number(ticket.quantity)) || Number(ticket.quantity) < 0)) return;
    // Websites can send every ticket row, including unselected zero-quantity rows.
    const payload = {...incomingPayload, tickets: incomingPayload.tickets.filter(ticket => Number(ticket.quantity) > 0)};
    if (!payload.tickets.length || payload.tickets.some(ticket => !ticket.id)) return;
    console.log('[WebView] transaction/saveTickets payload:', JSON.stringify(incomingPayload, null, 2));
    if (options.source === 'GuestHeroSection') {
      console.log('[GuestHeroSection WebView] transaction/saveTickets', {
        action: 'Proceed to pay',
        conference_id: payload.conference_id,
        tickets: payload.tickets.map(({id, quantity}) => ({id, quantity})),
        status: message.status,
        endpoint: message.endpoint,
        success: message.response?.success ?? message.response?.data?.success,
      });
    }
    busy.current = true;
    const requestGeneration = ++generation.current;
    const isCurrent = () => mounted.current && requestGeneration === generation.current;
    setLoading(true);
    let stage = 'Preparing checkout';
    let lastResponse;
    try {
      const token = await AsyncStorage.getItem(constants.TOKEN);
      if (!isCurrent()) return;
      const headers = {Accept: 'application/json', contenttype: 'application/json', authorization: token, IPADDRESS: getPublicIP() || ''};
      const slug = getConferenceSlug(payload.conference_url || message.pageUrl || options.conferenceUrl);
      stage = 'Saving selected tickets';
      lastResponse = {status: message.status};
      const apiOrigin = CONFERENCE_CHECKOUT_API_BASE;
      const finalTicket = message.response;
      if (!finalTicket) {
        throw new Error('The website did not return a ticket response. Please try again.');
      }
      if (finalTicket?.success === false) {
        const reason = finalTicket.message || finalTicket.msg;
        throw new Error(typeof reason === 'string' && reason.trim() ? reason : 'Unable to save selected tickets.');
      }
      const rawTickets = finalTicket?.tickets ||
        finalTicket?.data?.tickets ||
        (Array.isArray(finalTicket?.data) ? finalTicket.data : null) ||
        payload.tickets;
      if (!Array.isArray(rawTickets) || !rawTickets.length) {
        throw new Error(typeof finalTicket?.message === 'string' ? finalTicket.message : 'The ticket response did not include the selected tickets.');
      }
      const normalizedFinalTicket = {
        ...(finalTicket?.data && typeof finalTicket.data === 'object' && !Array.isArray(finalTicket.data) ? finalTicket.data : {}),
        ...finalTicket,
        tickets: rawTickets,
        invoice: finalTicket?.invoice || finalTicket?.invoice_number || finalTicket?.invoiceNumber || (typeof finalTicket?.data?.invoice === 'string' ? finalTicket.data.invoice : '') || '',
      };
      if (payload.refer_params) {
        try {
          await AsyncStorage.setItem('REFID', String(payload.refer_params));
        } catch (_) {}
      }
      if (!isCurrent()) return;
      stage = 'Loading conference details';
      lastResponse = undefined;
      let details = [options.conferenceDetails?.data, options.conferenceDetails].find(candidate => {
        const id = candidate?.conferenceId ?? candidate?.conference_id ?? candidate?.id;
        return candidate?.success !== false && id != null && String(id) === String(payload.conference_id);
      });
      if (!details) {
        details = {};
        try {
          const detailUrl = `${apiOrigin}/Conference/conferenceDetailPage`;
          const response = await postApi(detailUrl, {conference_url: slug}, headers);
          lastResponse = response;
          if (response?.data?.success || response?.data?.conferenceId || response?.data?.title || response?.data?.data) {
            const candidates = [response?.data?.data, response?.data].filter(Boolean);
            details = candidates.find(candidate => {
              const candidateId = candidate?.conferenceId ?? candidate?.conference_id ?? candidate?.id ?? candidate?.conference;
              return candidateId != null && String(candidateId) === String(payload.conference_id);
            }) || {};
          }
        } catch (detailErr) {
          console.warn('[ConferenceCheckout] Detail fetch fallback:', detailErr?.message);
        }
      }
      if (!isCurrent()) return;
      // Catalogue names are optional display metadata, never a checkout prerequisite.
      normalizedFinalTicket.tickets = rawTickets.map(ticket => {
        const catalogueTicket = details?.registrationTickets?.find(item =>
          String(item.id ?? item.ticket_id) === String(ticket.ticket_id ?? ticket.id));
        return !ticket.ticket_name && catalogueTicket?.name ? {...ticket, ticket_name: catalogueTicket.name} : ticket;
      });
      stage = 'Opening app checkout';
      const guestOrigin = token ? undefined : 'guest';
      const normalizedDetails = {
        conference_id: payload.conference_id,
        conference_url: slug,
        title: slug,
        ...(payload.other_country != null ? {other_country: payload.other_country} : {}),
        ...(payload.refer_params != null ? {refer_params: payload.refer_params} : {}),
        ...details,
        conferenceId: details?.conferenceId ?? details?.conference_id ?? details?.id ?? payload.conference_id,
        Realback: guestOrigin,
      };
      navigation.navigate('Checkout', {
        checkoutSpan: {
          checkoutSpan: normalizedDetails,
          finalTicket: normalizedFinalTicket,
          inPersonTicket: normalizedFinalTicket,
          guestOrigin,
          checkoutApiBase: apiOrigin,
          ...(options?.source === 'GuestHeroSection' ? {source: 'GuestHeroSection'} : {}),
        },
        inPersonTicket: {
          inPersonTicket: normalizedFinalTicket,
          inpersonSpanrole: normalizedDetails,
          guestOrigin,
        },
      });
      checkoutOpened.current = true;
      onReady?.();
    } catch (error) {
      if (isCurrent()) {
        const serverMessage = error?.response?.data?.message;
        const reason = typeof serverMessage === 'string' ? serverMessage : error?.message || 'Please try again.';
        // Keep diagnostics useful without logging credentials or checkout personal data.
        console.warn('[ConferenceCheckout]', {
          stage,
          api: message.endpoint || CONFERENCE_CHECKOUT_API_BASE,
          status: error?.response?.status ?? lastResponse?.status ?? null,
          code: error?.code ?? null,
          reason: String(reason).slice(0, 300),
        });
        Alert.alert('Unable to open checkout', `${stage}: ${String(reason).slice(0, 300)}`);
      }
    } finally {
      if (isCurrent()) {
        busy.current = false;
        setLoading(false);
      }
    }
  };
  const shouldStartLoad = ({url}) => {
    if (busy.current || checkoutOpened.current) return false;
    if (isEmedWebUrl(url) && /^https:\/\/[^/]+\/(?:cme\/)?registration(?:[/?#]|$)/i.test(url)) {
      return false;
    }
    return /^https?:\/\//i.test(url) || url === 'about:blank';
  };
  return {onMessage, loading, cancel, shouldStartLoad};
}
