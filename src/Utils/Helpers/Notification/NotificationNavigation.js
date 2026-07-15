/**
 * Notification navigation utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: handleActivityUrlNavigation, handleWebcastNavigation, handleUrlNavigation.
 */

import store from '../../../Redux/Store';
import { cmenextactionRequest } from '../../../Redux/Reducers/CMEReducer';
import { webcastDeatilsRequest } from '../../../Redux/Reducers/WebcastReducer';
import * as RootNavigation from '../../../Navigator/RootNavigation';

/**
 * Handles navigation dynamically by hooking into the Redux store.
 */
/**
 * Handle activity url navigation utility helper.
 * @param {*} conference_id - Input value.
 * @param {*} activity_id - Input value.
 * @returns {*}
 */
export const handleActivityUrlNavigation = (conference_id, activity_id) => {
  return new Promise((resolve) => {
    let unsubscribe;
    
    // Subscribe to Redux store to wait for response
    unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const status = state.CMEReducer?.status;
      const response = state.CMEReducer?.cmenextactionResponse;

      if (status === 'CME/cmenextactionSuccess' && response) {
        if (unsubscribe) {
          unsubscribe();
        }

        const courseModules = Array.isArray(response.courseModule) 
          ? response.courseModule 
          : Array.isArray(response.courseModules) 
            ? response.courseModules 
            : [];
            
        // Find the incomplete section according to existing logic
        const nextIncompleteModule = courseModules.find((item) => Number(item?.completedSection) === 0);
        const nextModuleId =
          nextIncompleteModule?.activity_id ||
          nextIncompleteModule?.current_activity_id ||
          nextIncompleteModule?.next_activity_id ||
          nextIncompleteModule?.id ||
          response.next_activity_id;
          
        const nextModuleName = nextIncompleteModule?.name || response.next_activity_text;

        // Dynamic routing logic based on course progress
        if (response.next_activity_api === "activitysession" || 
            nextModuleName?.toLowerCase()?.includes("section") || 
            nextModuleName?.toLowerCase()?.includes("course")) {
              
          const currentParams = RootNavigation.getCurrentRouteParams() || {};
          RootNavigation.navigate("VideoComponent", {
            ...currentParams,
            activityID: {
              ...response,
              current_activity_id: nextModuleId,
              next_activity_id: nextModuleId,
              next_activity_text: nextModuleName,
              courseModule: courseModules,
            },
            preserveVideoContent: false,
          });

        } else if (
          response.next_activity_api === "startTest" ||
          response.next_activity_api === "introduction" ||
          response.current_activity_api === "introduction" ||
          (typeof response.button_text === "string" &&
            (response.button_text.toLowerCase().includes("start test") ||
             response.button_text.toLowerCase().includes("start course")))
        ) {
          const currentParams = RootNavigation.getCurrentRouteParams() || {};
          RootNavigation.navigate("PreTest", { 
            ...currentParams,
            fromNotification: true,
            testFlowType: "pre", 
            FullID: { 
              FullID: response.next_activity_id, 
              startTest: "startTest", 
              wholedata: response, 
              Wktext: response.current_activity_text 
            } 
          });
        }
        resolve(true);
      } else if (status === 'CME/cmenextactionFailure') {
        if (unsubscribe) {
          unsubscribe();
        }
        resolve(false);
      }
    });

    // Dispatch the request
    store.dispatch(cmenextactionRequest({ conference_id, activity_id }));
  });
};

/**
 * Handles Webcast specific navigation.
 */
/**
 * Handle webcast navigation utility helper.
 * @param {*} parsedUrl - Input value.
 * @returns {*}
 */
export const handleWebcastNavigation = (parsedUrl) => {
  return new Promise((resolve) => {
    let unsubscribe;
    
    unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const status = state.WebcastReducer?.status;
      
      if (status === 'WebCast/webcastDeatilsSuccess') {
        if (unsubscribe) unsubscribe();
        const currentParams = RootNavigation.getCurrentRouteParams() || {};
        RootNavigation.navigate('StateWebcast', {
            ...currentParams,
            webcastDetails: state.WebcastReducer.webcastDeatilsResponse,
            notificationData: parsedUrl,
            slug: parsedUrl.slug
        });
        resolve(true);
      } else if (status === 'WebCast/webcastDeatilsFailure') {
        if (unsubscribe) unsubscribe();
        resolve(false);
      }
    });
    
    // Dispatch using the extracted conference_url dynamically
    store.dispatch(webcastDeatilsRequest({ conference_url: parsedUrl.conference_url || parsedUrl.slug }));
  });
};

/**
 * Handles normal URL routing.
 */
/**
 * Handle url navigation utility helper.
 * @param {*} parsedUrl - Input value.
 * @returns {void}
 */
export const handleUrlNavigation = (parsedUrl) => {
  const { type, route, slug } = parsedUrl;

  switch (type) {
    case 'cart':
      RootNavigation.navigate('AddToCart');
      break;
    case 'course':
      RootNavigation.navigate('CourseDetail', { slug });
      break;
    case 'webcast':
    case 'conference':
      handleWebcastNavigation(parsedUrl);
      break;
    case 'bundle':
      RootNavigation.navigate('CourseBundle');
      break;
    case 'mandatory':
      RootNavigation.navigate('MandatoryTopic');
      break;
    case 'category':
      RootNavigation.navigate('CategoryScreen', { slug });
      break;
    default:
      console.warn('Unknown URL type from push notification:', parsedUrl);
      break;
  }
};
