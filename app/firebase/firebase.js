// 'use client';
// import firebase from './initFirebase';

// export const customEvent = (eventName, data) => {
//   const localEnviroment = window?.location?.hostname === 'localhost';
//   if (!!firebase && !localEnviroment) {
//     firebase?.analytics()?.logEvent(eventName, data);
//   }
// };

// export const trackScreen = (screenName) => {
//   const localEnviroment = window?.location?.hostname === 'localhost';
//   if (!!firebase && !localEnviroment) {
//     firebase.analytics().setCurrentScreen(screenName);
//   }
// };

'use client';

import { getFirebaseAnalytics } from './initFirebase';

const runWhenIdle = (callback) => {
  if (typeof window === 'undefined') {
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 3000 });
    return;
  }

  window.setTimeout(callback, 2500);
};

export const customEvent = async (eventName, data) => {
  const localEnviroment = window?.location?.hostname === 'localhost';
  if (localEnviroment) return;

  try {
    const firebase = await getFirebaseAnalytics();

    if (firebase?.analytics) {
      firebase.analytics().logEvent(eventName, data);
    }
  } catch (err) {
    console.error('Firebase analytics error:', err);
  }
};

export const trackScreen = async (screenName) => {
  const localEnviroment = window?.location?.hostname === 'localhost';
  if (localEnviroment) return;

  runWhenIdle(async () => {
    try {
      const firebase = await getFirebaseAnalytics();

      if (firebase?.analytics) {
        firebase.analytics().setCurrentScreen(screenName);
      }
    } catch (err) {
      console.error('Firebase screen tracking error:', err);
    }
  });
};