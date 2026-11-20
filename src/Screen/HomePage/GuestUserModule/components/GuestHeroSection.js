/**
 * File Name: GuestHeroSection.js
 * Module: Guest User
 * Purpose: Renders the guest home top-banner carousel and its loading state.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-15
 * Dependencies: react, react-native, react-native-snap-carousel, react-native-vector-icons/MaterialIcons, react-native-linear-gradient, ../../../Themes/Imagepath, ../../HomePage/GuestUser.styles, ../utils/guestUserContentParsers
 */

import { useDispatch, useSelector } from 'react-redux';
import { webcastDeatilsRequest } from '../../../../Redux/Reducers/WebcastReducer';
import { CONFERENCE_CHECKOUT_API_BASE, getConferenceSlug } from '../../../../Utils/Helpers/ConferenceCheckoutApi';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, InteractionManager, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import ShareIcon from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import Imagepath from '../../../../Themes/Imagepath';
import Fonts from '../../../../Themes/Fonts';
import styles from '../../GuestUser.styles';
import {
  getBannerUrl,
  matchGroup,
  parseBannerMeta,
  splitMetaLine,
} from '../utils/guestUserContentParsers';
import { GuestHeroShimmer } from './GuestUserShimmers';
import normalize from '../../../../Utils/Helpers/Dimen';
import Loader from '../../../../Utils/Helpers/Loader';
import useConferenceCheckout, { conferenceCheckoutScript } from '../../../GlobalSupport/hooks/useConferenceCheckout';

// Hide website chrome across conference templates while keeping section headings.
// Reinstall the stylesheet when client-side navigation or hydration replaces it.
const bannerPageStylesScript = `
  (function () {
    try {
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        (document.head || document.documentElement).appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';
    } catch (_) {}
    var styleId = 'guest-hero-page-styles';
    function installStyles() {
      var parent = document.head || document.documentElement;
      if (!parent) return;
      var style = document.getElementById(styleId);
      var isNew = !style;
      if (isNew) {
        style = document.createElement('style');
        style.id = styleId;
      }
      var css = [
        'html, body { touch-action: pan-x pan-y !important; -webkit-text-size-adjust: 100% !important; }',
        'header[class*="Hero_navbar__"], footer[class*="Footer_footer__"], header:not(main header):not(article header):not(section header):not(aside header), footer:not(main footer):not(article footer):not(section footer):not(aside footer), #header, #footer, #site-header, #site-footer, .site-header, .site-footer, [role="banner"], [role="contentinfo"] { display: none !important; }',
        // Legacy templates use div/nav wrappers instead of semantic header/footer tags.
        '[class*="_navbar__"], header[class*="_header__"], [class*="_footer__"] { display: none !important; }',
        'nav.navbar, #conferencenav, [class*="_nav_mai"], .site-navbar, .main-navbar { display: none !important; }',
        '[class~="footer-main" i], [class~="footer_main" i], [class~="footer-wrapper" i], [class~="footer" i] { display: none !important; }',
        // Hide cookie-consent UI only; do not hide unrelated dialogs or set consent cookies.
        '#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter, #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay, .cky-consent-container, .cky-overlay, .cc-window, .cc-overlay, .CookieConsent, #cookie-consent, #cookie-banner, #cookie-modal, [class*="cookieconsent" i], [class*="cookie-consent" i], [class*="cookie_consent" i], [class*="cookiebanner" i], [class*="cookie-banner" i], [class*="cookie_banner" i], [class*="cookiemodal" i], [class*="cookie-modal" i], [class*="cookie_modal" i], [class*="cookiepopup" i], [class*="cookie-popup" i], [class*="cookie_popup" i], [class*="cookie-overlay" i], [class*="cookie-backdrop" i], [role="dialog"][aria-label*="cookie" i], [role="dialog"][aria-label*="consent" i], [class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i] { display: none !important; visibility: hidden !important; pointer-events: none !important; opacity: 0 !important; max-height: 0 !important; overflow: hidden !important; }',
        // Collapse unnecessary top whitespace and body margin after navbar removal
        'html, body, main, #main-content, #__next, .all-container, .activity-detail-page, .container-fluid, .content-wrapper, [class*="Hero_section"], [class*="hero_banner"] { margin-top: 0 !important; padding-top: 0 !important; }',
        // Mobile sections and cards should follow their content, not desktop fixed heights.
        '@media (max-width: 767px) {',
        'section, article, [class*="section" i] { margin-block: 0 !important; padding-block: 20px !important; min-height: 0 !important; height: auto !important; }',
        'body { margin: 0 !important; }',
        'main, section, article { box-sizing: border-box !important; max-width: 100% !important; }',
        '[class*="card" i]:not([class*="cardiac" i]):not([class*="cardio" i]) { box-sizing: border-box !important; min-width: 0 !important; max-width: 100% !important; height: auto !important; min-height: 0 !important; padding: 16px !important; border-radius: 16px !important; }',
        // Fill the available mobile column; never override carousel-owned slide/track widths.
        ':is(#guest-hero-spacing, html) body :is(div, article, li)[class*="card" i]:not([class*="cardiac" i]):not([class*="cardio" i]):not(.slick-slide):not(.swiper-slide):not(.slick-track):not(.swiper-wrapper) { box-sizing: border-box !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; margin-inline: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is([class*="_ceomain__"], [class*="_providersection__"], [class*="_providermain__"], [class*="faqContainer" i]) { box-sizing: border-box !important; width: 100% !important; max-width: 100% !important; margin-inline: 0 !important; }',
        '[class*="card" i] :is(p, blockquote) { margin-block: 0 12px !important; }',
        '[class*="card" i] :is(p, blockquote):last-child { margin-bottom: 0 !important; }',
        '[class*="testimonial" i], [class*="highlight" i], [class*="welcome" i], [class*="chair" i] { min-height: 0 !important; }',
        // Reset outer spacing too: these wrappers do not necessarily contain "card" or "section".
        ':is(#guest-hero-spacing, html) body :is([class*="_NeuroSection__"], [class*="_providermainsection__"], [class*="_providersection__"], [class*="_providermain__"], [class*="_glob2024_testimonial__"], [class*="_glob2025_testimonial__"], [class*="_conferencehighlightsmain__"], [id="CEO"], [id="testimonials"], [id="testimonials "]) { height: auto !important; min-height: 0 !important; margin-block: 0 !important; padding-block: 16px !important; }',
        ':is(#guest-hero-spacing, html) body :is([class*="_ceomain__"], [class*="_neuro_card__"], [class*="testimonial" i] [class*="content" i]) { height: auto !important; min-height: 0 !important; margin-bottom: 0 !important; padding-bottom: 16px !important; }',
        ':is(#guest-hero-spacing, html) body .container.pb-5:has(> #CEO), :is(#guest-hero-spacing, html) body #CEO.pb-5 { padding-bottom: 16px !important; }',
        // Slick may retain an inline list height after fonts/card sizes change.
        ':is(#guest-hero-spacing, html) body .slick-list { height: auto !important; min-height: 0 !important; padding-block: 12px 16px !important; }',
        ':is(#guest-hero-spacing, html) body .slick-track { min-height: 0 !important; align-items: flex-start !important; }',
        ':is(#guest-hero-spacing, html) body .slick-slide > div { box-sizing: border-box !important; height: auto !important; min-height: 0 !important; padding-inline: 8px !important; }',
        ':is(#guest-hero-spacing, html) body .slick-slider { margin-bottom: 16px !important; padding-bottom: 0 !important; min-height: 0 !important; }',
        ':is(#guest-hero-spacing, html) body .slick-slider:has(> .slick-dots) { padding-bottom: 24px !important; }',
        // Keep pagination inside the clipped slider and inset cards without changing track widths.
        ':is(#guest-hero-spacing, html) body .slick-slider > .slick-dots { bottom: 4px !important; margin-block: 0 !important; }',
        ':is(#guest-hero-spacing, html) body .swiper { padding-block: 12px 36px !important; }',
        ':is(#guest-hero-spacing, html) body .swiper-slide { box-sizing: border-box !important; padding-inline: 8px !important; }',
        '[class*="testimonial" i] :is(blockquote, p) { font-size: 14px !important; line-height: 1.5 !important; font-weight: 400 !important; }',
        // Hide only the yellow circular quote icon / badge on testimonial cards without touching the card
        '[class*="card" i] [class*="yellow" i]:not([class*="card" i]), [class*="testimonial" i] [class*="yellow" i]:not([class*="card" i]), [class*="attendee" i] [class*="yellow" i]:not([class*="card" i]), [class*="voice" i] [class*="yellow" i]:not([class*="card" i]), [class*="quote_icon" i], [class*="quoteIcon" i], [class*="quote-icon" i], [class*="quote_badge" i], [class*="quoteBadge" i], [class*="quote-badge" i], [class*="quote_img" i], [class*="quoteImg" i], [class*="quote-img" i], [class*="quote_box" i], [class*="quoteBox" i], [class*="quote-box" i], [class*="testimonial" i] [class*="card" i]::before, [class*="attendee" i] [class*="card" i]::before, [class*="voice" i] [class*="card" i]::before { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; content: none !important; }',
        '[class*="faq" i] button, [class*="accordion" i] button, .accordion-button, [class*="faqQuestion" i] { text-align: left !important; white-space: normal !important; gap: 12px !important; padding: 12px !important; font-size: 14px !important; line-height: 1.4 !important; font-weight: 700 !important; }',
        '.accordion-body, .accordion-body *, [class*="faqAnswer" i], [class*="faqAnswer" i] *, [class*="faq" i] [class*="answer" i], [class*="faq" i] p, [class*="accordion" i] p, [class*="faq" i] li, [class*="accordion" i] li { font-size: 14px !important; line-height: 1.5 !important; font-weight: 400 !important; }',
        // Only question text may shrink; resetting every child collapses the numbered badge.
        ':is(#guest-hero-spacing, html) body [class*="faqQuestion" i] { flex: 1 1 0% !important; min-width: 0 !important; overflow-wrap: anywhere !important; }',
        ':is(#guest-hero-spacing, html) body :is([class*="faqIndex" i], [class*="faqNumber" i], [class*="faqBadge" i]) { box-sizing: border-box !important; display: inline-flex !important; flex: 0 0 28px !important; width: 28px !important; min-width: 28px !important; max-width: 28px !important; height: 28px !important; min-height: 28px !important; padding: 0 !important; border-radius: 50% !important; align-items: center !important; justify-content: center !important; line-height: 1 !important; color: #fff !important; }',
        ':is(#guest-hero-spacing, html) body [class*="faq" i] .accordion-button::after { flex-shrink: 0 !important; }',

        // One gutter per attraction slide; content determines card height.
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) { box-sizing: border-box !important; min-height: 0 !important; height: auto !important; margin-block: 0 !important; padding: 20px 16px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(#tourist_attractions, #wheretostay) { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.container, .container-fluid, .slick-slider, .swiper) { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.slick-list, .slick-slide > div, .slick-slide > div > div) { box-sizing: border-box !important; height: auto !important; min-height: 0 !important; padding: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.row, .grid, [class*="cards" i]):not(.slick-track):not(.swiper-wrapper) { row-gap: 16px !important; align-items: flex-start !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.slick-track, .swiper-wrapper) { align-items: flex-start !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.slick-slide, .swiper-slide) { box-sizing: border-box !important; height: auto !important; min-height: 0 !important; padding: 0 8px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is([class*="touristcard" i], [class*="attractioncard" i]) { box-sizing: border-box !important; width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; align-self: flex-start !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is([class*="touristcardcontent" i], [class*="attractioncardcontent" i]) { padding: 16px 0 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(.slick-slide, .swiper-slide, [class*="touristcard" i], [class*="attractioncard" i]) img:not(.slick-arrow) { display: block !important; width: 100% !important; height: auto !important; aspect-ratio: 11 / 8 !important; object-fit: cover !important; border-radius: 16px !important; margin: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) :is(h3, h4) { margin: 0 0 12px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) p:last-child { margin-bottom: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) .swiper:has(> .swiper-pagination) { padding-bottom: 24px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) .slick-slider:has(> .slick-dots) { padding-bottom: 24px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) .slick-slider .slick-arrow { box-sizing: border-box !important; position: absolute !important; top: clamp(80px, calc((100vw - 48px) * 0.363636), 240px) !important; bottom: auto !important; width: 36px !important; height: 36px !important; padding: 8px !important; border: 1px solid #3B4DB1 !important; border-radius: 50% !important; background-color: #fff !important; z-index: 2 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) .slick-slider .slick-prev { left: 16px !important; right: auto !important; transform: translateY(-50%) rotate(180deg) !important; }',
        ':is(#guest-hero-spacing, html) body :is(#attractions, #tourist_attractions, #wheretostay, section[id*="attraction" i], section[class*="attraction" i], section[id*="tourist" i], section[class*="tourist" i]) .slick-slider .slick-next { right: 16px !important; left: auto !important; transform: translateY(-50%) !important; }',
        // Separate the venue heading from its photo and keep the map marker at icon size.
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) h2 { margin-bottom: 16px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) [class*="locationstrip" i] { padding-top: 12px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) [class*="locationstrip" i] :is([class*="_location__"], .location) { display: flex !important; align-items: flex-start !important; gap: 12px !important; }',
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) [class*="locationstrip" i] :is([class*="_left__"], .left) { flex: 0 0 24px !important; width: 24px !important; margin: 0 !important; padding: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) [class*="locationstrip" i] :is([class*="_right__"], .right) { flex: 1 1 0% !important; min-width: 0 !important; margin: 0 !important; padding: 0 !important; }',
        ':is(#guest-hero-spacing, html) body :is(#venue, #wheretostay, [class*="venuesection" i]) [class*="locationstrip" i] [class*="location" i] img { display: block !important; flex-shrink: 0 !important; width: 24px !important; max-width: 24px !important; height: 24px !important; aspect-ratio: auto !important; object-fit: contain !important; border-radius: 0 !important; margin: 2px 0 0 !important; padding: 0 !important; }',
        '}',
        // Card styling: clean box-sizing and alignment without breaking carousel/slider geometry
        '[class*="card" i] { box-sizing: border-box !important; }',
        '.slick-slider, .swiper, .carousel, [class*="slider" i] { overflow: hidden !important; height: auto !important; }',
        '.slick-track, .swiper-wrapper { display: flex !important; height: auto !important; }',
        '.slick-slide, .swiper-slide { height: auto !important; min-height: 0 !important; }',
        'a[href*="privacy" i], a[href*="privacypolicy" i], [class*="privacy-policy" i], [class*="privacypolicy" i], [class*="privacy_policy" i], [id*="privacy-policy" i], [id*="privacypolicy" i], [id*="privacy_policy" i], [aria-label*="privacy" i] { display: none !important; }',
        '[class*="past-conference" i], [class*="past_conference" i], [class*="pastconference" i], [class*="past-conferences" i], [class*="past_conferences" i], [class*="pastconferences" i], [id*="past-conference" i], [id*="past_conference" i], [id*="pastconference" i], [id*="past-conferences" i], [id*="past_conferences" i], [id*="pastconferences" i], a[href*="past-conference" i], a[href*="past_conference" i], a[href*="pastconference" i], a[href*="past-conferences" i], [aria-label*="past conference" i] { display: none !important; }',
        ':is(#guest-hero-typography, html) body, :is(#guest-hero-typography, html) body :is(p, p *, span, div, a, li, li *, label, label *, td, td *, input, button, select, textarea, em, small, blockquote, blockquote *, [class*="card" i] p, [class*="card" i] span, [class*="content" i] p, [class*="content" i] span, [class*="about" i] p, [class*="about" i] span, [class*="desc" i], [class*="desc" i] *, [class*="detail" i] p, [class*="detail" i] span, section p, article p, main p, div p, .accordion-body, .accordion-body *):not(h1):not(h1 *):not(h2):not(h2 *):not(h3):not(h3 *):not(h4):not(h4 *):not([data-guest-hero-title]):not([data-guest-hero-title] *):not([class*="title" i]):not([class*="heading" i]) { font-size: 14px !important; line-height: 1.5 !important; font-weight: 400 !important; }',
        ':is(#guest-hero-typography, html) body [class*="card" i] :is(p, blockquote) { font-size: 14px !important; line-height: 1.5 !important; font-weight: 400 !important; }',
        ':is(#guest-hero-typography, html) body :is(h1, h1 *, h2, h2 *, h3, h3 *, h4, h4 *, h5, h5 *, h6, h6 *, th, th *, dt, dt *, b, b *, strong, strong *, [class*="title" i], [class*="title" i] *, [class*="heading" i], [class*="heading" i] *, [class*="about" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]), [class*="about" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]) *, [class*="Neuro" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]), [class*="Neuro" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]) *, :is(#CEO, [class*="_ceomain__"], [class*="_ceo" i], [class*="welcome" i], [class*="chair" i], [class*="message" i], [id*="welcome" i], [id*="chair" i], [id*="message" i]) :is(h1, h2, h3, h4, [class*="title" i], [class*="heading" i], [class*="header" i], [class*="_ceo" i]), :is(#CEO, [class*="_ceomain__"], [class*="_ceo" i], [class*="welcome" i], [class*="chair" i], [class*="message" i], [id*="welcome" i], [id*="chair" i], [id*="message" i]) :is(h1, h2, h3, h4, [class*="title" i], [class*="heading" i], [class*="header" i], [class*="_ceo" i]) *, [class*="name" i]:not([class*="user" i]):not([class*="input" i]):not([class*="cityname" i]), [class*="topic" i], [class*="bold" i], [class*="bold" i] *, [class*="fw-700" i], [class*="fw-600" i], [class*="fw-bold" i], .accordion-button, .accordion-header, .accordion-button *) { font-weight: 700 !important; }',
        // All hero banner content other than the conference title (subtitle, dates, location, credits) is normal body text (14px, 400).
        ':is(#guest-hero-typography, html) body :is([class*="hero" i], [class*="banner" i], header:not([class*="nav" i])) :is(p, p *, span, div, a, em, i, small, time):not(h1):not(h1 *):not([data-guest-hero-title]):not([data-guest-hero-title] *):not([class*="btn" i]):not(button):not(button *) { font-size: 14px !important; line-height: 1.5 !important; font-weight: 400 !important; }',
        // Only the main conference title is bold and large (26px, 700).
        ':is(#guest-hero-typography, html) body :is(h1[data-guest-hero-title], [data-guest-hero-title], :is([class*="hero" i], [class*="banner" i], header:not([class*="nav" i])) h1), :is(#guest-hero-typography, html) body :is(h1[data-guest-hero-title], [data-guest-hero-title], :is([class*="hero" i], [class*="banner" i], header:not([class*="nav" i])) h1) * { font-size: 26px !important; line-height: 1.1 !important; font-weight: 700 !important; }',
        ':is(#guest-hero-typography, html) body [data-guest-hero-title] :is(p, div, span) { font-size: 26px !important; margin-block: 0 !important; line-height: 1.1 !important; font-weight: 700 !important; }',
        ':is(#guest-hero-typography, html) body :is(h1:not([data-guest-hero-title]):not([data-guest-hero-title] *):not([class*="hero_banner" i] *):not([class*="Hero_section" i] *):not([class*="heroBanner" i] *):not([class*="hero-banner" i] *), h2:not([data-guest-hero-title]):not([data-guest-hero-title] *):not([class*="hero_banner" i] *):not([class*="Hero_section" i] *):not([class*="heroBanner" i] *):not([class*="hero-banner" i] *), section > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *), section > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *) *, [class*="section" i] > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *), [class*="section" i] > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *) *, [class*="section-title" i], [class*="section-title" i] *, [class*="sectionTitle" i], [class*="sectionTitle" i] *, [class*="section_title" i], [class*="section_title" i] *, [class*="section-heading" i], [class*="section-heading" i] *, [class*="sectionHeading" i], [class*="sectionHeading" i] *, [class*="section_heading" i], [class*="section_heading" i] *, [class*="about" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]), [class*="about" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]) *, [class*="Neuro" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]), [class*="Neuro" i] :is(h1, h2, h3, [class*="title" i], [class*="heading" i]) *, :is(#CEO, [class*="_ceomain__"], [class*="_ceo" i], [id*="welcome" i], [class*="welcome" i], [id*="chair" i], [class*="chair" i], [id*="message" i], [class*="message" i]) :is(h1, h2, h3, [class*="title" i], [class*="heading" i], [class*="header" i]), :is(#CEO, [class*="_ceomain__"], [class*="_ceo" i], [id*="welcome" i], [class*="welcome" i], [id*="chair" i], [class*="chair" i], [id*="message" i], [class*="message" i]) :is(h1, h2, h3, [class*="title" i], [class*="heading" i], [class*="header" i]) *, :is([class*="about" i], [class*="welcome" i], [class*="chair" i], [class*="message" i], [class*="highlight" i], [class*="speaker" i], [class*="agenda" i], [class*="schedule" i], [class*="pricing" i], [class*="venue" i], [class*="attraction" i], [class*="tourist" i], [class*="faq" i], [class*="testimonial" i]) > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *), :is([class*="about" i], [class*="welcome" i], [class*="chair" i], [class*="message" i], [class*="highlight" i], [class*="speaker" i], [class*="agenda" i], [class*="schedule" i], [class*="pricing" i], [class*="venue" i], [class*="attraction" i], [class*="tourist" i], [class*="faq" i], [class*="testimonial" i]) > :is(h1, h2, h3, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *) *) { font-size: 20px !important; line-height: 1.25 !important; font-weight: 700 !important; }',
        ':is(#guest-hero-typography, html) body :is([class*="card" i] :is(h1, h2, h3, h4, h5, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *), [class*="card" i] :is(h1, h2, h3, h4, h5, [class*="title" i], [class*="heading" i]):not([data-guest-hero-title]):not([data-guest-hero-title] *) *, [class*="card-title" i], [class*="card-title" i] *, [class*="cardTitle" i], [class*="cardTitle" i] *, [class*="card_title" i], [class*="card_title" i] *, h3:not([data-guest-hero-title]):not([data-guest-hero-title] *), h4:not([data-guest-hero-title]):not([data-guest-hero-title] *), h5:not([data-guest-hero-title]):not([data-guest-hero-title] *) { font-size: 16px !important; line-height: 1.35 !important; font-weight: 700 !important; }',
        // These two templates use an h3 for their registration section heading.
        ':is(#guest-hero-typography, html) body #pricingsection :is([class*="pcm2027-registration_heading__"], [class*="accs2027-registration_heading__"]) :is(h3, h3 *) { font-size: 20px !important; line-height: 1.25 !important; }',
        ':is(#guest-hero-typography, html) body:has(:is([class*="pcm2027-registration_pcmRegistration__"], [class*="accs2027-registration_accsRegistration__"])) main :is(p, p *, li, li *, label, label *, td, td *, b, strong, em, i, small, time):not(:is(h1, h2, h3, h4, h5, h6, [data-guest-hero-title], [class*="heading" i], [class*="title" i]) *) { font-size: 14px !important; line-height: 1.5 !important; }',
      ].join(' ');
      if (style.textContent !== css) style.textContent = css;
      if (isNew) parent.appendChild(style);
      try {
        // Only the first page title gets compact hero line-height, even when later sections also use h1.
        var primaryTitle = null;
        var heroContainers = document.querySelectorAll ? document.querySelectorAll('[class*="hero" i], [class*="banner" i], [class*="slide" i], header:not([class*="nav" i]), main > section:first-of-type, main > div:first-of-type, body > section:first-of-type') : [];
        if (document.querySelector) {
          primaryTitle = document.querySelector('h1');
        }
        if (!primaryTitle) {
          for (var bIdx = 0; bIdx < heroContainers.length; bIdx++) {
            var container = heroContainers[bIdx];
            if (!container || (container.closest && container.closest('nav, footer, #footer, .site-footer, [role="contentinfo"]'))) continue;
            var tCand = container.querySelector ? container.querySelector('h1, h2, h3, [class*="title" i], [class*="heading" i]') : null;
            if (tCand) {
              primaryTitle = tCand;
              break;
            }
          }
        }
        if (!primaryTitle && document.querySelector) {
          primaryTitle = document.querySelector('h1') || document.querySelector('h2');
        }
        var previousTitles = document.querySelectorAll ? document.querySelectorAll('[data-guest-hero-title]') : [];
        for (var titleIndex = 0; titleIndex < previousTitles.length; titleIndex++) {
          if (previousTitles[titleIndex] !== primaryTitle) previousTitles[titleIndex].removeAttribute('data-guest-hero-title');
        }
        if (primaryTitle) {
          if (!primaryTitle.hasAttribute('data-guest-hero-title')) primaryTitle.setAttribute('data-guest-hero-title', 'true');
          if (primaryTitle.style) {
            primaryTitle.style.setProperty('font-size', '26px', 'important');
            primaryTitle.style.setProperty('font-weight', '700', 'important');
            primaryTitle.style.setProperty('line-height', '1.1', 'important');
          }
          if (primaryTitle.querySelectorAll) {
            var titleKids = primaryTitle.querySelectorAll('*');
            for (var tk = 0; tk < titleKids.length; tk++) {
              if (titleKids[tk].style) {
                titleKids[tk].style.setProperty('font-size', '26px', 'important');
                titleKids[tk].style.setProperty('font-weight', '700', 'important');
                titleKids[tk].style.setProperty('line-height', '1.1', 'important');
                titleKids[tk].style.setProperty('margin-top', '0px', 'important');
                titleKids[tk].style.setProperty('margin-bottom', '0px', 'important');
              }
            }
          }
        }
        // Body section titles should have font size less than conference title (20px, bold)
        var bodyTitles = document.querySelectorAll ? document.querySelectorAll('h1:not([data-guest-hero-title]), h2:not([data-guest-hero-title]), [class*="section-title" i], [class*="sectionTitle" i], [class*="section_title" i]') : [];
        for (var btI = 0; btI < bodyTitles.length; btI++) {
          var bt = bodyTitles[btI];
          if (!bt || bt === primaryTitle || (bt.closest && bt.closest('[data-guest-hero-title], [class*="conferenceinfo" i], [class*="conference-info" i], [class*="bottomsection" i], [class*="cityname" i], [class*="eventdetail" i], [class*="event-detail" i], nav, footer, #footer, .site-footer, [role="contentinfo"]'))) continue;
          if (bt.style) {
            bt.style.setProperty('font-size', '20px', 'important');
            bt.style.setProperty('font-weight', '700', 'important');
            bt.style.setProperty('line-height', '1.25', 'important');
          }
          if (bt.querySelectorAll) {
            var btKids = bt.querySelectorAll('*');
            for (var btk = 0; btk < btKids.length; btk++) {
              if (btKids[btk].style) {
                btKids[btk].style.setProperty('font-size', '20px', 'important');
                btKids[btk].style.setProperty('font-weight', '700', 'important');
                btKids[btk].style.setProperty('line-height', '1.25', 'important');
              }
            }
          }
        }
        // Card and subsection titles (16px, bold)
        var cardTitles = document.querySelectorAll ? document.querySelectorAll('[class*="card-title" i], [class*="cardTitle" i], [class*="card_title" i]') : [];
        for (var ctI = 0; ctI < cardTitles.length; ctI++) {
          var ct = cardTitles[ctI];
          if (!ct || ct === primaryTitle || (ct.closest && ct.closest('[data-guest-hero-title], [class*="conferenceinfo" i], [class*="conference-info" i], [class*="bottomsection" i], [class*="cityname" i], [class*="eventdetail" i], [class*="event-detail" i], nav, footer, #footer, .site-footer, [role="contentinfo"]'))) continue;
          if (ct.style && (!ct.style.fontSize || ct.style.fontSize !== '20px')) {
            ct.style.setProperty('font-size', '16px', 'important');
            ct.style.setProperty('font-weight', '700', 'important');
            ct.style.setProperty('line-height', '1.35', 'important');
          }
          if (ct.querySelectorAll) {
            var ctKids = ct.querySelectorAll('*');
            for (var ctk = 0; ctk < ctKids.length; ctk++) {
              if (ctKids[ctk].style && (!ctKids[ctk].style.fontSize || ctKids[ctk].style.fontSize !== '20px')) {
                ctKids[ctk].style.setProperty('font-size', '16px', 'important');
                ctKids[ctk].style.setProperty('font-weight', '700', 'important');
                ctKids[ctk].style.setProperty('line-height', '1.35', 'important');
              }
            }
          }
        }
      } catch (_) {}
      try {
        if (document.querySelectorAll) {
          // Dynamic cookie consent modal removal and scroll unlock
          var cookieNodes = document.querySelectorAll('#onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter, #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay, .cky-consent-container, .cky-overlay, .cc-window, .cc-overlay, .CookieConsent, #cookie-consent, #cookie-banner, #cookie-modal, [class*="cookieconsent" i], [class*="cookie-consent" i], [class*="cookie_consent" i], [class*="cookiebanner" i], [class*="cookie-banner" i], [class*="cookie_banner" i], [class*="cookiemodal" i], [class*="cookie-modal" i], [class*="cookie_modal" i], [class*="cookiepopup" i], [class*="cookie-popup" i], [class*="cookie_popup" i], [role="dialog"][aria-label*="cookie" i], [role="dialog"][aria-label*="consent" i]');
          for (var c = 0; c < cookieNodes.length; c++) {
            var cNode = cookieNodes[c];
            if (cNode && cNode.style) {
              cNode.style.setProperty('display', 'none', 'important');
              cNode.style.setProperty('visibility', 'hidden', 'important');
              cNode.style.setProperty('pointer-events', 'none', 'important');
            }
            if (cNode && typeof cNode.remove === 'function') {
              try { cNode.remove(); } catch (_) {}
            }
          }

          if (document.body && document.body.style) {
            if (document.body.style.overflow === 'hidden') document.body.style.overflow = 'auto';
            if (document.body.style.position === 'fixed') document.body.style.position = 'static';
          }

          // Dynamic whitespace removal on top containers
          var topSpacers = document.querySelectorAll('body, main, #main-content, #__next, .all-container, .activity-detail-page, .container-fluid, [class*="Hero_section"], [class*="hero_banner"]');
          for (var ts = 0; ts < topSpacers.length; ts++) {
            var sEl = topSpacers[ts];
            if (sEl && sEl.style) {
              sEl.style.setProperty('margin-top', '0px', 'important');
              sEl.style.setProperty('padding-top', '0px', 'important');
            }
          }


          // Dynamic card height equalization across sibling cards (skipping sliders/carousels to maintain clean layout)
          var cardContainers = document.querySelectorAll('[class*="row" i], [class*="grid" i], [class*="cards" i], [class*="tickets" i], [class*="pricing" i], [class*="packages" i]');
          for (var ci = 0; ci < cardContainers.length; ci++) {
            var cContainer = cardContainers[ci];
            if (cContainer && cContainer.closest && cContainer.closest('.slick-slider, .swiper, .carousel, [class*="slider" i]')) continue;
            var children = (cContainer && cContainer.children) || [];
            var childCards = [];
            for (var ch = 0; ch < children.length; ch++) {
              var child = children[ch];
              var cName = (child && child.className && typeof child.className === 'string' ? child.className : '').toLowerCase();
              if (cName.includes('card') || cName.includes('ticket') || cName.includes('pricing') || cName.includes('package')) {
                childCards.push(child);
              } else if (cName.includes('col') && child.firstElementChild) {
                var subName = (child.firstElementChild.className && typeof child.firstElementChild.className === 'string' ? child.firstElementChild.className : '').toLowerCase();
                if (subName.includes('card') || subName.includes('ticket')) {
                  childCards.push(child.firstElementChild);
                }
              }
            }
            // Stacked mobile cards must keep their natural height.
            if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) continue;
            if (childCards.length > 1) {
              var maxHeight = 0;
              for (var cj = 0; cj < childCards.length; cj++) {
                var cardEl = childCards[cj];
                if (cardEl && cardEl.style) {
                  cardEl.style.minHeight = '';
                  var h = cardEl.offsetHeight || (cardEl.getBoundingClientRect && cardEl.getBoundingClientRect().height) || 0;
                  if (h > maxHeight) maxHeight = h;
                }
              }
              if (maxHeight > 50) {
                for (var ck = 0; ck < childCards.length; ck++) {
                  if (childCards[ck] && childCards[ck].style) {
                    childCards[ck].style.setProperty('min-height', maxHeight + 'px', 'important');
                  }
                }
              }
            }
          }


          // Ensure all conference titles and headings across sections and cards are bold
          var allTitleNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="title" i], [class*="heading" i], [class*="name" i]:not([class*="user" i]):not([class*="input" i]):not([class*="cityname" i]), [class*="topic" i], [class*="bold" i], [class*="fw-" i], .accordion-button, .accordion-header, dt, th');
          for (var ati = 0; ati < allTitleNodes.length; ati++) {
            var atEl = allTitleNodes[ati];
            if (!atEl || !atEl.style) continue;
            if (atEl.closest && atEl.closest('nav, footer, #footer, .site-footer, [role="contentinfo"]')) continue;
            if (atEl.closest && atEl.closest('[class*="conferenceinfo" i], [class*="conference-info" i], [class*="bottomsection" i], [class*="cityname" i], [class*="eventdetail" i], [class*="event-detail" i], [class*="meta" i], [class*="date" i], [class*="time" i], [class*="location" i], [class*="venue" i], [class*="address" i], [class*="credit" i], [class*="subtitle" i], [class*="tagline" i], [class*="kicker" i]')) continue;
            atEl.style.setProperty('font-weight', '700', 'important');
            if (atEl.querySelectorAll) {
              var atKids = atEl.querySelectorAll('*');
              for (var aki = 0; aki < atKids.length; aki++) {
                if (atKids[aki].style) atKids[aki].style.setProperty('font-weight', '700', 'important');
              }
            }
          }


          // Normalize body text weight to normal while preserving bold headings and titles
          var textEls = document.querySelectorAll('p, p *, div, span, b, strong, h3, h4, h5, h6, li, td, label, blockquote, blockquote *');
          for (var ti = 0; ti < textEls.length; ti++) {
            var tNode = textEls[ti];
            if (!tNode || !tNode.style) continue;
            var tag = (tNode.tagName || '').toLowerCase();
            if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6' || (tNode.closest && tNode.closest('h1, h2, h3, h4, h5, h6, [class*="title" i], [class*="heading" i], [class*="topic" i], [class*="name" i], [data-guest-hero-title]'))) continue;
            if (tNode.hasAttribute && tNode.hasAttribute('data-guest-hero-title')) continue;
            var tClass = (tNode.className && typeof tNode.className === 'string' ? tNode.className : '').toLowerCase();
            if (tClass.includes('title') || tClass.includes('heading') || tClass.includes('topic') || tClass.includes('bold')) continue;

            var tText = (tNode.textContent || '').trim();
            var pHeading = tNode.closest ? tNode.closest('p, div, h1, h2, h3, h4, h5, h6') : null;
            var pHText = pHeading ? (pHeading.textContent || '').trim() : '';
            if ((/^(?:welcome\s+message|about\s+)/i.test(tText) && tText.length < 150) || (/^(?:welcome\s+message|about\s+)/i.test(pHText) && pHText.length < 150)) {
              tNode.style.setProperty('font-weight', '700', 'important');
              if (!tNode.parentElement || tNode === pHeading) {
                tNode.style.setProperty('font-size', '20px', 'important');
                tNode.style.setProperty('line-height', '1.25', 'important');
              }
              continue;
            }

            if (tag === 'p' || (tNode.closest && tNode.closest('p')) || tag === 'li' || tag === 'td' || tag === 'blockquote') {
              tNode.style.setProperty('font-weight', 'normal', 'important');
              tNode.style.setProperty('font-size', '14px', 'important');
              tNode.style.setProperty('line-height', '1.5', 'important');
            }
          }

          // Explicitly ensure FAQ questions and answers are 14px
          var faqButtons = document.querySelectorAll ? document.querySelectorAll('.accordion-button, .accordion-button *, [class*="faqQuestion" i], [class*="faq" i] button, [class*="accordion" i] button') : [];
          for (var fbi = 0; fbi < faqButtons.length; fbi++) {
            var fb = faqButtons[fbi];
            if (!fb || !fb.style) continue;
            if (fb.classList && (fb.classList.contains('faqBadge') || fb.classList.contains('faqNumber') || fb.classList.contains('faqIndex'))) continue;
            fb.style.setProperty('font-size', '14px', 'important');
            fb.style.setProperty('font-weight', '700', 'important');
            fb.style.setProperty('line-height', '1.4', 'important');
          }
          var faqAnswers = document.querySelectorAll ? document.querySelectorAll('.accordion-body, .accordion-body *, [class*="faqAnswer" i], [class*="faqAnswer" i] *, [class*="faq" i] p, [class*="accordion" i] p') : [];
          for (var fai = 0; fai < faqAnswers.length; fai++) {
            var fa = faqAnswers[fai];
            if (fa && fa.style) {
              fa.style.setProperty('font-size', '14px', 'important');
              fa.style.setProperty('font-weight', 'normal', 'important');
              fa.style.setProperty('line-height', '1.5', 'important');
            }
          }

          // Dates, credits, attendance type, and venue lines in a conference banner are metadata.
          // Some templates mark these up as heading tags, so correct their inline weight last.
          var heroMetadata = document.querySelectorAll ? document.querySelectorAll('[class*="hero" i] :is(p, span, li, h4, h5, h6, b, strong), [class*="banner" i] :is(p, span, li, h4, h5, h6, b, strong), [class*="slide" i] :is(p, span, li, h4, h5, h6, b, strong)') : [];
          var metadataPattern = /(?:\b(?:cme|ce|moc)\b.*\bcredits?\b|\bhybrid\s+event\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2}|\b(?:resort|hotel|boulevard|street|road|avenue|florida|usa|virtual|on-site)\b)/i;
          for (var hm = 0; hm < heroMetadata.length; hm++) {
            var metaNode = heroMetadata[hm];
            if (!metaNode || !metaNode.style) continue;
            if (metaNode.closest && metaNode.closest('[data-guest-hero-title]')) continue;
            var metaText = (metaNode.textContent || '').replace(/\s+/g, ' ').trim();
            if (metadataPattern.test(metaText)) {
              metaNode.style.setProperty('font-weight', '400', 'important');
            }
          }

          // Keep the conference name prominent, but make every other hero label readable body text (14px, 400).
          // This runs last because several conference templates apply bold inline styles to metadata.
          for (var hb = 0; hb < heroContainers.length; hb++) {
            var heroBox = heroContainers[hb];
            if (!heroBox || !heroBox.querySelectorAll) continue;
            var heroTextNodes = heroBox.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, b, strong, li, em, i, small, time');
            for (var hn = 0; hn < heroTextNodes.length; hn++) {
              var heroTextNode = heroTextNodes[hn];
              if (!heroTextNode || !heroTextNode.style) continue;
              if (primaryTitle && (heroTextNode === primaryTitle || (primaryTitle.contains && primaryTitle.contains(heroTextNode)))) continue;
              if (heroTextNode.closest && heroTextNode.closest('[data-guest-hero-title], button, [class*="btn" i]')) continue;
              if (!(heroTextNode.textContent || '').trim()) continue;
              heroTextNode.style.setProperty('font-weight', '400', 'important');
              heroTextNode.style.setProperty('font-size', '14px', 'important');
              heroTextNode.style.setProperty('line-height', '1.5', 'important');
            }
          }


          // Measure before resizing so nested text gains exactly 1px, even after hydration.
          function increaseConferenceTitleSize(title) {
            var isTemplateRegistrationHeading = title.closest && title.closest('#pricingsection [class*="pcm2027-registration_heading__"], #pricingsection [class*="accs2027-registration_heading__"]');
            var titleNodes = [title].concat(Array.prototype.slice.call(title.querySelectorAll('*')));
            for (var ts = 0; ts < titleNodes.length; ts++) {
              var titleNode = titleNodes[ts];
              if (!titleNode.__guestHeroTitleFontSize) {
                var currentSize = isTemplateRegistrationHeading ? 20 : parseFloat(window.getComputedStyle(titleNode).fontSize);
                if (isFinite(currentSize)) titleNode.__guestHeroTitleFontSize = (currentSize + 1) + 'px';
              }
            }
            for (var ta = 0; ta < titleNodes.length; ta++) {
              if (titleNodes[ta].__guestHeroTitleFontSize) {
                titleNodes[ta].style.setProperty('font-size', titleNodes[ta].__guestHeroTitleFontSize, 'important');
              }
            }
          }

          // Preserve bold weight for About and Co-Chairs headings across all conferences.
          var aboutHeadingNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span, b, strong');
          for (var ah = 0; ah < aboutHeadingNodes.length; ah++) {
            var aboutHeading = aboutHeadingNodes[ah];
            if ((aboutHeading.textContent || '').trim().length > 160) continue;
            if (aboutHeading.querySelector('h1, h2, h3, h4, h5, h6, p, div, button, a, input, ul, ol, table')) continue;
            var aboutHeadingText = (aboutHeading.textContent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!/^(?:about|welcomemessagefromthecochairs)/.test(aboutHeadingText)) continue;
            increaseConferenceTitleSize(aboutHeading);
            aboutHeading.style.setProperty('font-weight', '700', 'important');
            var aboutHeadingChildren = aboutHeading.querySelectorAll('*');
            for (var ahc = 0; ahc < aboutHeadingChildren.length; ahc++) {
              aboutHeadingChildren[ahc].style.setProperty('font-weight', '700', 'important');
            }
          }

          // Keep shared conference headings and the payment action bold for every event.
          var conferenceLabelNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span, b, strong, a, button, input[type="submit"], input[type="button"]');
          for (var cl = 0; cl < conferenceLabelNodes.length; cl++) {
            var conferenceLabel = conferenceLabelNodes[cl];
            var conferenceLabelText = (conferenceLabel.textContent || conferenceLabel.value || '').trim();
            if (conferenceLabelText.length > 160) continue;
            var normalizedConferenceLabel = conferenceLabelText.toLowerCase().replace(/[^a-z0-9]/g, '');
            var isVenueAccommodationTitle = /^(?:conference)?venue(?:and|amp)?accom{1,2}odations?$/.test(normalizedConferenceLabel);
            if (!isVenueAccommodationTitle && conferenceLabel.querySelector('h1, h2, h3, h4, h5, h6, p, div, button, a, input, ul, ol, table')) continue;
            var isExistingConferenceTitle = /^(?:conferencetopics?|conferenceagenda|whattoexpectat|conferenceregistration|proceedtopay|conferencehighlights?)/.test(normalizedConferenceLabel);
            var isAdditionalBoldTitle = /^(?:welcomemessage(?:from)?(?:the|our)?(?:co)?(?:chairs?|founders?)|(?:conference)?venue|accommodations?|localattractions?|faqs?$|(?:faqs?)?frequentlyaskedquestions(?:faqs?)?$)/.test(normalizedConferenceLabel);
            if (!isExistingConferenceTitle && !isAdditionalBoldTitle && !isVenueAccommodationTitle) continue;
            if (isExistingConferenceTitle) increaseConferenceTitleSize(conferenceLabel);
            conferenceLabel.style.setProperty('font-weight', '700', 'important');
            var conferenceLabelChildren = conferenceLabel.querySelectorAll('*');
            for (var clc = 0; clc < conferenceLabelChildren.length; clc++) {
              conferenceLabelChildren[clc].style.setProperty('font-weight', '700', 'important');
            }
          }

          // Ensure Local Attractions cards have visible space between them
          var attractionSections = document.querySelectorAll('#attractions, #tourist_attractions, [id*="attraction" i], [class*="attraction" i], [id*="tourist" i], [class*="tourist" i], #wheretostay');
          for (var ai = 0; ai < attractionSections.length; ai++) {
            var aSec = attractionSections[ai];
            if (!aSec || !aSec.querySelectorAll) continue;
            var aSlides = aSec.querySelectorAll('.slick-slide, .swiper-slide, [class*="_touristcard__"], [class*="touristcard" i], [class*="attractioncard" i]');
            for (var asi = 0; asi < aSlides.length; asi++) {
              var aCard = aSlides[asi];
              if (aCard && aCard.style) {
                if (aCard.classList && (aCard.classList.contains('slick-slide') || aCard.classList.contains('swiper-slide'))) {
                  aCard.style.setProperty('padding-left', '8px', 'important');
                  aCard.style.setProperty('padding-right', '8px', 'important');
                } else {
                  aCard.style.setProperty('margin-left', '0px', 'important');
                  aCard.style.setProperty('margin-right', '0px', 'important');
                }
              }
            }
          }

          // Only remove the small yellow quote circle badge on testimonial cards without touching the card
          var candidateBadges = document.querySelectorAll('[class*="yellow" i], [class*="quote" i], div, span, img, svg, i');
          for (var bIdx = 0; bIdx < candidateBadges.length; bIdx++) {
            var badge = candidateBadges[bIdx];
            if (!badge || !badge.style) continue;

            // Do not touch cards or containers holding paragraphs, stars, headings, or attendee info
            if (badge.querySelector && badge.querySelector('p, blockquote, [class*="star" i], [class*="attendee" i], [class*="author" i]')) continue;

            var bText = (badge.textContent || '').trim();
            if (bText.length > 5) continue;

            var bClass = (badge.className && typeof badge.className === 'string' ? badge.className : '').toLowerCase();
            var bId = (badge.id || '').toLowerCase();
            var bTag = (badge.tagName || '').toLowerCase();

            // Guard against hiding page actions or navigation
            if (bTag === 'button' || bTag === 'a' || (badge.closest && badge.closest('button, a, nav'))) continue;

            var bg = badge.style.backgroundColor || (window.getComputedStyle && window.getComputedStyle(badge).backgroundColor) || '';
            var isYellowBg = Boolean(bg && (bg.indexOf('255') !== -1 || bg.indexOf('yellow') !== -1 || bg.indexOf('gold') !== -1 || bg.indexOf('#ff') !== -1 || bg.indexOf('#fd') !== -1 || bg.indexOf('#fc') !== -1));
            var isYellowClass = bClass.includes('yellow') || bId.includes('yellow') || bClass.includes('gold') || bId.includes('gold');
            var isQuoteMark = bText === '"' || bText === '“' || bText === '”' || bText === '„' || bText === '‟' || bText === '66';
            var isQuoteClass = bClass.includes('quote') || bId.includes('quote');

            if (
              (isQuoteMark && (isYellowBg || isYellowClass || isQuoteClass || bClass.includes('circle') || bClass.includes('badge') || bClass.includes('icon') || bTag === 'span' || bTag === 'div' || bTag === 'i')) ||
              (isYellowClass && (isQuoteClass || isQuoteMark || bClass.includes('circle') || bClass.includes('badge') || bClass.includes('icon'))) ||
              (isYellowBg && (isQuoteClass || isQuoteMark || bClass.includes('circle') || bClass.includes('badge') || bClass.includes('icon') || badge.children.length === 0)) ||
              (isQuoteClass && (bClass.includes('icon') || bClass.includes('badge') || bClass.includes('img') || bClass.includes('box') || bTag === 'img' || bTag === 'svg'))
            ) {
              badge.style.setProperty('display', 'none', 'important');
              badge.style.setProperty('visibility', 'hidden', 'important');
              badge.style.setProperty('opacity', '0', 'important');
              badge.style.setProperty('pointer-events', 'none', 'important');
              if (typeof badge.remove === 'function') {
                try { badge.remove(); } catch (_) {}
              }
              // Also hide its immediate parent if that parent is just the circular wrapper
              var pEl = badge.parentElement;
              if (pEl && pEl.style && !pEl.querySelector('p, blockquote, [class*="star" i], [class*="attendee" i]')) {
                var pText = (pEl.textContent || '').trim();
                var pClass = (pEl.className && typeof pEl.className === 'string' ? pEl.className : '').toLowerCase();
                if (pText.length <= 3 || pClass.includes('quote') || pClass.includes('yellow') || pClass.includes('circle')) {
                  pEl.style.setProperty('display', 'none', 'important');
                  pEl.style.setProperty('visibility', 'hidden', 'important');
                  pEl.style.setProperty('opacity', '0', 'important');
                  if (typeof pEl.remove === 'function') {
                    try { pEl.remove(); } catch (_) {}
                  }
                }
              }
            }
          }

          // Some templates name the past-event block generically, so identify its tabs by text.
          // Hide the shared block (including the panel/link), but never the adjacent testimonials.
          var pastTabs = document.querySelectorAll('button, a, [role="tab"], li, span');
          for (var pt = 0; pt < pastTabs.length; pt++) {
            var pastTab = pastTabs[pt];
            var tabLabel = (pastTab.textContent || '').replace(/\\s+/g, ' ').trim();
            if (!/^(ANS 2025|GNS 2024|PNS 2023)$/i.test(tabLabel)) continue;
            var pastBlock = pastTab;
            var ancestor = pastTab.parentElement;
            for (var depth = 0; ancestor && depth < 10; depth++, ancestor = ancestor.parentElement) {
              if (/^(BODY|HTML|MAIN)$/.test(ancestor.tagName || '')) break;
              if (ancestor.querySelector('h1, main, form, input, select, [data-guest-hero-title]')) break;
              var blockText = (ancestor.textContent || '').replace(/\\s+/g, ' ').trim();
              if (/testimonials|frequently asked|conference registration/i.test(blockText)) break;
              if (/ANS 2025/i.test(blockText) && /GNS 2024/i.test(blockText) && /PNS 2023/i.test(blockText)) {
                pastBlock = ancestor;
                if (/learn more about/i.test(blockText)) break;
              }
            }
            if (pastBlock.style) pastBlock.style.setProperty('display', 'none', 'important');
          }

          // These labels can render outside the old-event tabs, including after hydration.
          var oldEventLabels = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, span, div, button');
          for (var oe = 0; oe < oldEventLabels.length; oe++) {
            var oldEventLabel = oldEventLabels[oe];
            var oldEventText = (oldEventLabel.textContent || '')
              .replace(/&#(?:x20|32);/gi, ' ')
              .replace(/\\s+/g, ' ')
              .trim();
            if (
              /^American Neurology Summit 2025\\s*[-–—]\\s*FL$/i.test(oldEventText) ||
              /^Learn more about the American Neurology Summit 2025[\\s→➜➔›»>−–—-]*$/i.test(oldEventText)
            ) {
              if (oldEventLabel.style) oldEventLabel.style.setProperty('display', 'none', 'important');
            }
          }


          var elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, span, li, button');
          for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (!el) continue;
            var text = (el.textContent || '').trim().toLowerCase();
            if (
              text === 'privacy policy' ||
              text === 'privacy' ||
              text === 'privacy notice' ||
              text === 'privacy & policy' ||
              text.startsWith('privacy policy')
            ) {
              var privTarget = (el.closest && (el.closest('li') || el.closest('a') || el.closest('p'))) || el;
              if (privTarget && privTarget.style) {
                privTarget.style.setProperty('display', 'none', 'important');
              }
            }
            if (
              text === 'past conference' ||
              text === 'past conferences' ||
              text === 'past events' ||
              text === 'past event' ||
              text.startsWith('past conference') ||
              text.startsWith('past conferences')
            ) {
              var pastTarget = (el.closest && (el.closest('li') || el.closest('nav') || el.closest('[role="tab"]') || el.closest('button') || el.closest('a'))) || el;
              if (pastTarget && pastTarget.style) {
                pastTarget.style.setProperty('display', 'none', 'important');
              }
            }
          }

        }
      } catch (_) {}
    }
    function enforceVenueHeadingWeight() {
      if (!document.querySelectorAll) return;
      var venueNodes = document.querySelectorAll('body *');
      for (var vn = 0; vn < venueNodes.length; vn++) {
        var venueNode = venueNodes[vn];
        var venueText = (venueNode.textContent || '').trim();
        if (venueText.length > 160) continue;
        venueText = venueText.toLowerCase().replace(/&(?:amp|nbsp|#x20|#32);/g, '').replace(/[^a-z0-9]/g, '');
        // Mobile templates hide the "Conference" span, but textContent still includes it.
        if (!/^(?:conference)?venue(?:and)?accom{1,2}odations?$/.test(venueText)) continue;
        var venueTextNodes = [venueNode].concat(Array.prototype.slice.call(venueNode.querySelectorAll('*')));
        for (var vt = 0; vt < venueTextNodes.length; vt++) {
          var venueStyle = venueTextNodes[vt].style;
          if (!venueStyle) continue;
          if (venueStyle.getPropertyValue('font-weight') !== '700' || venueStyle.getPropertyPriority('font-weight') !== 'important') {
            venueStyle.setProperty('font-weight', '700', 'important');
          }
        }
      }
    }
    installStyles();
    enforceVenueHeadingWeight();
    if (!window.__guestVenueHeadingObserver) {
      window.__guestVenueHeadingObserver = new MutationObserver(enforceVenueHeadingWeight);
      window.__guestVenueHeadingObserver.observe(document, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
    if (!window.__guestHeroStylesObserver) {
      window.__guestHeroStylesObserver = new MutationObserver(installStyles);
      window.__guestHeroStylesObserver.observe(document, { childList: true, subtree: true, characterData: true });
    }
  })();
  true;
`;

/**
 * Reusable GuestHeroSectionComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Guest hero carousel section.
 * Purpose: Preserves the current hero-banner UI and navigation behavior in an isolated component.
 */
const GuestHeroSectionComponent = ({ topBanners, isHomeLoading, navigation, width, deepLinkUrl, deepLinkTitle }) => {
  const dispatch = useDispatch();
  const webcastDetails = useSelector(state => state.WebcastReducer?.webcastDeatilsResponse);
  const webcastDetailsUrl = useSelector(state => state.WebcastReducer?.webcastDeatilsResponseUrl);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [bannerPage, setBannerPage] = useState(null);
  const [openingCheckout, setOpeningCheckout] = useState(false);
  const checkoutTransition = useRef(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const carouselRef = useRef(null);
  const webViewRef = useRef(null);
  const currentWebUrl = useRef('');
  const webViewSession = useRef(0);
  const webCanGoBack = useRef(false);
  const handledDeepLinkRef = useRef(null);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribeFocus = navigation.addListener('focus', () => {
      checkoutTransition.current = false;
      setIsScreenFocused(true);
      setOpeningCheckout(false);
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (!checkoutTransition.current) {
        setIsScreenFocused(false);
      }
    });
    return () => {
      unsubscribeFocus?.();
      unsubscribeBlur?.();
    };
  }, [navigation]);

  useEffect(() => {
    if (!openingCheckout) return;
    let task;
    const frame = requestAnimationFrame(() => {
      task = InteractionManager.runAfterInteractions(() => {
        setIsScreenFocused(false);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      task?.cancel();
    };
  }, [openingCheckout]);

  const closeBannerPage = () => {
    webViewRef.current?.stopLoading();
    checkout.cancel();
    checkoutTransition.current = false;
    setOpeningCheckout(false);
    webCanGoBack.current = false;
    setBannerPage(null);
    navigation?.setParams?.({ deepLinkUrl: null, url: null });
  };
  const handleWebBack = () => {
    checkout.cancel();
    if (webCanGoBack.current && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      closeBannerPage();
    }
  };
  const isWebUrl = url => /^https?:\/\//i.test(String(url || ''));
  const selectedConferenceDetails = getConferenceSlug(bannerPage?.url) === getConferenceSlug(webcastDetailsUrl) ? webcastDetails : null;
  const selectedConferenceId = selectedConferenceDetails?.conferenceId ?? selectedConferenceDetails?.data?.conferenceId;
  const conferenceSelectionScript = `window.__nativeConferenceSelection = ${JSON.stringify({ required: true, apiBase: CONFERENCE_CHECKOUT_API_BASE, id: selectedConferenceId ?? null, slug: getConferenceSlug(bannerPage?.url), tickets: (selectedConferenceDetails?.registrationTickets ?? selectedConferenceDetails?.data?.registrationTickets ?? []).map(ticket => ({ id: ticket.id, name: ticket.name, category: ticket.category })) })}; true;`;
  useEffect(() => {
    webViewRef.current?.injectJavaScript(conferenceSelectionScript);
  }, [conferenceSelectionScript]);
  const checkoutNavigation = useMemo(() => ({
    ...navigation,
    navigate: (...args) => {
      if (args[0] === 'Checkout') {
        // Set synchronously before navigate emits blur, so the modal keeps covering Home.
        checkoutTransition.current = true;
        setOpeningCheckout(true);
      }
      navigation.navigate(...args);
    },
  }), [navigation]);
  const checkout = useConferenceCheckout(checkoutNavigation, undefined, {
    source: 'GuestHeroSection',
    conferenceUrl: bannerPage?.url,
    conferenceDetails: selectedConferenceDetails,
  });

  const deepLinkSlug = useMemo(() => {
    const slug = getConferenceSlug(deepLinkUrl);
    return slug && slug.toLowerCase() !== 'cme' ? slug : '';
  }, [deepLinkUrl]);

  const matchedBannerIndex = useMemo(() => {
    if (!deepLinkSlug || !topBanners?.length) return -1;
    return topBanners.findIndex(item => {
      const bannerHref = String(item.html_content || '').match(/<a[^>]*href=['"]([^'"]+)['"]/i)?.[1];
      const itemUrl = getBannerUrl(bannerHref ? { url: bannerHref.replace(/&amp;/gi, '&') } : item);
      return getConferenceSlug(itemUrl) === deepLinkSlug;
    });
  }, [deepLinkSlug, topBanners]);

  const matchedBanner = matchedBannerIndex >= 0 ? topBanners[matchedBannerIndex] : null;
  const matchedTitle =
    (matchedBanner?.html_content ? matchGroup(matchedBanner.html_content, /<h2[^>]*>([\s\S]*?)<\/h2>/i)?.replace(/<[^>]*>/g, '').trim() : '') ||
    matchedBanner?.conference_title ||
    matchedBanner?.title ||
    matchedBanner?.course_name ||
    '';

  const formattedSlugTitle = useMemo(() => {
    if (!deepLinkSlug) return '';
    return deepLinkSlug
      .split('-')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [deepLinkSlug]);

  useEffect(() => {
    setActiveBannerIndex(index => Math.max(0, Math.min(index, (topBanners?.length || 1) - 1)));
  }, [topBanners?.length]);

  useEffect(() => {
    if (matchedTitle && bannerPage && bannerPage.title !== matchedTitle) {
      setBannerPage(current => current ? { ...current, title: matchedTitle } : null);
    }
  }, [matchedTitle, bannerPage?.title]);

  useEffect(() => {
    if (!deepLinkUrl || !deepLinkSlug) return;
    if (handledDeepLinkRef.current === deepLinkUrl) return;
    handledDeepLinkRef.current = deepLinkUrl;

    checkout.cancel();
    dispatch({
      ...webcastDeatilsRequest({ conference_url: deepLinkSlug }),
      meta: { checkoutApiBase: CONFERENCE_CHECKOUT_API_BASE },
    });
    setOpeningCheckout(false);
    webCanGoBack.current = false;

    let targetUrl = matchedBanner ? getBannerUrl(matchedBanner) : deepLinkUrl;
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://www.emedevents.com/${targetUrl.replace(/^\/+/, '')}`;
    }

    const displayTitle = matchedTitle || deepLinkTitle || formattedSlugTitle || 'eMedEvents';
    setBannerPage({
      url: targetUrl || deepLinkUrl,
      title: displayTitle,
      sessionId: ++webViewSession.current,
    });
  }, [deepLinkUrl, deepLinkSlug, matchedTitle, formattedSlugTitle, checkout, dispatch]);

  const sideMargin = normalize(16);
  const cardGap = normalize(12);
  const slideWidth = Math.round(width - 2 * sideMargin);
  const cardWidth = slideWidth - cardGap;
  const cardHeight = Platform.OS === 'ios' ? normalize(215) : normalize(190);

  return (
    <>
      {bannerPage && <Modal key={bannerPage.sessionId} visible={Boolean(bannerPage && isScreenFocused)} animationType={checkout.loading || openingCheckout ? "none" : "slide"} onRequestClose={openingCheckout ? () => { } : handleWebBack}>
        <SafeAreaProvider>
          <SafeAreaView style={localStyles.webScreen}>
            <View style={localStyles.webHeader}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back" disabled={checkout.loading} onPress={handleWebBack} style={localStyles.webAction}>
                <Icon name="keyboard-arrow-left" size={32} color="#111827" />
              </TouchableOpacity>
              <Text numberOfLines={1} ellipsizeMode="tail" style={localStyles.webTitle}>
                {bannerPage?.title || 'eMedEvents'}
              </Text>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Global search" disabled={checkout.loading} onPress={() => {
                closeBannerPage();
                navigation.navigate('HeaderSearch');
              }} style={localStyles.webAction}>
                <SearchIcon name="search" size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Share conference" disabled={checkout.loading} onPress={() => {
                Share.open({ title: 'Share ConferenceURL', message: 'Check out this ConferenceURL >>! ', url: currentWebUrl.current || bannerPage.url })
                  .catch(error => { if (error) console.log('Share Error:', error); });
              }} style={localStyles.webAction}>
                <ShareIcon name="share-2" size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close banner page" disabled={checkout.loading} onPress={closeBannerPage} style={localStyles.webAction}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={localStyles.webScreen}>
              {bannerPage && <WebView
                ref={webViewRef}
                style={localStyles.webScreen}
                source={{ uri: bannerPage.url }}
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
                injectedJavaScriptBeforeContentLoaded={conferenceSelectionScript + bannerPageStylesScript + conferenceCheckoutScript}
                injectedJavaScript={conferenceSelectionScript + bannerPageStylesScript + conferenceCheckoutScript}
                onMessage={checkout.onMessage}
                originWhitelist={['*']}
                onShouldStartLoadWithRequest={checkout.shouldStartLoad}
                setSupportMultipleWindows={false}
                onOpenWindow={({ nativeEvent }) => {
                  if (isWebUrl(nativeEvent.targetUrl) && checkout.shouldStartLoad({ url: nativeEvent.targetUrl })) {
                    setBannerPage(current => current ? { ...current, url: nativeEvent.targetUrl } : null);
                  }
                }}
                onNavigationStateChange={({ canGoBack, url }) => {
                  webCanGoBack.current = canGoBack;
                  if (isWebUrl(url)) currentWebUrl.current = url;
                }}
                onLoadEnd={() => webViewRef.current?.injectJavaScript(conferenceSelectionScript + bannerPageStylesScript)}
                startInLoadingState
                renderLoading={() => <ActivityIndicator style={localStyles.webLoading} size="large" color="#2C4DB9" />}
                onError={({ nativeEvent }) => console.warn('[GuestHero WebView] Load failed', { url: nativeEvent.url, code: nativeEvent.code, description: nativeEvent.description })}
                onHttpError={({ nativeEvent }) => console.warn('[GuestHero WebView] HTTP error', { url: nativeEvent.url, status: nativeEvent.statusCode })}
                renderError={() => (
                  <View style={[localStyles.webLoading, { padding: 24 }]}>
                    <Text style={{ fontFamily: Fonts.InterMedium, color: '#111827', textAlign: 'center' }}>Unable to load this conference. Please try again.</Text>
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry conference page" onPress={() => webViewRef.current?.reload()} style={{ padding: 16 }}>
                      <Text style={{ fontFamily: Fonts.InterBold, color: '#2C4DB9' }}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />}
              {(checkout.loading || openingCheckout) && (
                <View style={[localStyles.webLoading, { padding: 20 }]} accessibilityLabel="Loading checkout" accessibilityState={{ busy: true }}>
                  <SkeletonPlaceholder backgroundColor="#E2E8F0" highlightColor="#F8FAFC" speed={1000}>
                    <View>
                      <View style={{ width: 160, height: 24, borderRadius: 6, marginBottom: 24 }} />
                      {[0, 1, 2, 3, 4].map(index => (
                        <View key={index} style={{ marginBottom: 22 }}>
                          <View style={{ width: 110, height: 14, borderRadius: 4, marginBottom: 10 }} />
                          <View style={{ width: '100%', height: 48, borderRadius: 8 }} />
                        </View>
                      ))}
                      <View style={{ width: '100%', height: 48, borderRadius: 8 }} />
                    </View>
                  </SkeletonPlaceholder>
                </View>
              )}
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>}
      {isHomeLoading ? (
        <GuestHeroShimmer width={width} />
      ) : !topBanners?.length ? null : (
        <>
          <View style={{ width, overflow: 'visible' }}>
            <Carousel
              ref={carouselRef}
              layout="default"
              data={topBanners}
              onSnapToItem={index => setActiveBannerIndex(index)}
              sliderWidth={width}
              itemWidth={slideWidth}
              firstItem={Math.max(0, Math.min(activeBannerIndex, (topBanners.length || 1) - 1))}
              activeSlideAlignment="center"
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              useScrollView={Platform.OS === 'ios'}
              nestedScrollEnabled
              removeClippedSubviews={false}
              containerCustomStyle={{ overflow: 'visible' }}
              contentContainerCustomStyle={{ overflow: 'visible' }}
              renderItem={({ item }) => {
                let parsedHtml = {};
                if (item.html_content) {
                  const html = item.html_content;
                  const cleanHtml = html.replace(/\n/g, ' ');
                  const creditsCountMatch = cleanHtml.match(/<span>(\d+)<\/span>/i);
                  const creditTypesMatch = cleanHtml.match(/\b(CME|CE|MOC)\b/g);
                  const titleMatch = matchGroup(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
                  const subtitleMatch = matchGroup(
                    html,
                    /<p[^>]*class=['"][^'"]*headingpara[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
                  );
                  const locationMatch = matchGroup(
                    html,
                    /<span[^>]*class=['"][^'"]*location[^'"]*['"][^>]*>([\s\S]*?)<\/span>/i,
                  );
                  const imageMatch = html.match(
                    /<div[^>]*class=['"][^'"]*slideright[^'"]*['"][^>]*>[\s\S]*?<img[^>]*src=['"]([^'"]+)['"]/i,
                  );
                  const bannerMeta = parseBannerMeta(html);
                  const dateMatch =
                    bannerMeta.date ||
                    matchGroup(html, /Calendar\.png[^>]*>\s*([^<]+)(?:<|&nbsp;|$)/i);
                  parsedHtml = {
                    title: titleMatch,
                    subtitle: subtitleMatch,
                    location: locationMatch,
                    image: imageMatch ? imageMatch[1] : null,
                    date: dateMatch,
                    credits: bannerMeta.credits,
                    creditsCount: creditsCountMatch?.[1] || '',
                    creditTypes: creditTypesMatch || [],
                  };
                }

                const displayTitle =
                  parsedHtml.title ||
                  item.title ||
                  item.course_title ||
                  item.name ||
                  item.banner_title ||
                  item.heading ||
                  '';
                const displayKicker =
                  parsedHtml.subtitle ||
                  (item.organizer_name || item.organizer
                    ? `By ${item.organizer_name || item.organizer}`
                    : '');
                const displayMeta = splitMetaLine(
                  parsedHtml.date ||
                  item.start_date ||
                  item.course_start_date ||
                  item.event_date ||
                  item.banner_date,
                );
                const displayDate = displayMeta.date;
                const displayCredits =
                  parsedHtml.credits ||
                  [parsedHtml.creditsCount, (parsedHtml.creditTypes || []).join(' | ')]
                    .filter(Boolean)
                    .join(' ')
                    .trim() ||
                  displayMeta.credits;
                const displayLocation =
                  parsedHtml.location ||
                  item.location ||
                  item.course_location ||
                  item.venue ||
                  item.city;
                const bannerHref = String(item.html_content || '').match(/<a[^>]*href=['"]([^'"]+)['"]/i)?.[1];
                const stateWebcastUrl = getBannerUrl(bannerHref ? { url: bannerHref.replace(/&amp;/gi, '&') } : item);
                /**
* Handles register press.
* @returns {void}
*/
                const handleRegisterPress = () => {
                  if (isWebUrl(stateWebcastUrl)) {
                    checkout.cancel();
                    dispatch({
                      ...webcastDeatilsRequest({ conference_url: getConferenceSlug(stateWebcastUrl) }),
                      meta: { checkoutApiBase: CONFERENCE_CHECKOUT_API_BASE },
                    });
                    setOpeningCheckout(false);
                    webCanGoBack.current = false;
                    currentWebUrl.current = stateWebcastUrl;
                    setBannerPage({ url: stateWebcastUrl, title: displayTitle || 'eMedEvents', sessionId: ++webViewSession.current });
                  }
                };

                return (
                  <View style={{ width: slideWidth, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={handleRegisterPress}
                      accessibilityRole="button"
                      accessibilityLabel={displayTitle || 'Register for conference'}
                      style={{ borderRadius: 16, overflow: 'hidden' }}
                    >
                      <LinearGradient
                        colors={['#2C4DB9', '#7A22B8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.hero, { width: cardWidth, height: cardHeight, borderRadius: 16 }]}
                      >
                        <View>
                          <Text style={styles.heroKicker}>{displayKicker}</Text>
                          <Text numberOfLines={2} style={styles.heroTitle}>{displayTitle}</Text>
                        </View>
                        <View style={styles.heroBottomRow}>
                          <View style={styles.heroMeta}>
                            {displayDate ? (
                              <View style={styles.heroMetaRow}>
                                <Icon name="access-time" size={18} color="#FFFFFF" />
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>{displayDate}</Text>
                              </View>
                            ) : null}
                            {displayCredits ? (
                              <View style={styles.heroMetaRow}>
                                <Image source={Imagepath.CreditValut} style={styles.heroCreditIcon} resizeMode="contain" />
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>
                                  {displayCredits} Credits
                                </Text>
                              </View>
                            ) : null}
                            {displayLocation ? (
                              <View style={styles.heroLocationRow}>
                                <View style={styles.heroLocationTextWrap}>
                                  <Icon name="location-on" size={18} color="#FFFFFF" />
                                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>{displayLocation}</Text>
                                </View>
                                <View style={styles.heroRegisterButton}>
                                  <Text numberOfLines={1} style={styles.heroButtonText}>REGISTER NOW</Text>
                                </View>
                              </View>
                            ) : (
                              <View style={styles.heroButton}>
                                <Text style={styles.heroButtonText}>REGISTER NOW</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.bannerCounterWrap}>
            <Text style={styles.bannerCounterText}>
              {`${Math.max(0, Math.min(activeBannerIndex, (topBanners.length || 1) - 1)) + 1}/${topBanners.length || 1}`}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

/**
 * Guest hero section value.
 * @returns {*}
 */
export const GuestHeroSection = memo(GuestHeroSectionComponent);

/**
 * Local styles value.
 * @returns {*}
 */
const localStyles = StyleSheet.create({
  webScreen: { flex: 1, backgroundColor: '#FFFFFF' },
  webHeader: { flexDirection: 'row', alignItems: 'center', minHeight: 56, flexShrink: 0, paddingHorizontal: 4, backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D7DEEA' },
  webAction: { width: 40, height: 48, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  webTitle: { flex: 1, minWidth: 0, marginHorizontal: 8, fontFamily: Fonts.InterBold, fontWeight: '700', fontSize: normalize(15), color: '#111827' },
  webLoading: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF' },
  heroSlideWrap: {
    alignItems: 'center',
  },
});
