'use client';
import firebase from './initFirebase';

export const customEvent = (eventName, data) => {
  const localEnviroment = window?.location?.hostname === 'localhost';
  if (!!firebase && !localEnviroment) {
    firebase?.analytics()?.logEvent(eventName, data);
  }
};

export const trackScreen = (screenName) => {
  const localEnviroment = window?.location?.hostname === 'localhost';
  if (!!firebase && !localEnviroment) {
    firebase.analytics().setCurrentScreen(screenName);
  }
};