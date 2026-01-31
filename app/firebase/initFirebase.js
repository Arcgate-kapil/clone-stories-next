import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyCOGxBpwaSX8Zma94S0tNFCTthLbZ9gGpM",
//   authDomain: "stories-workmob.firebaseapp.com",
//   databaseURL: "https://stories-workmob.firebaseio.com",
//   projectId: "stories-workmob",
//   storageBucket: "stories-workmob.appspot.com",
//   messagingSenderId: "378730177090",
//   appId: "1:378730177090:web:44c9c8fa26f1c76e0d43db",
//   measurementId: "G-7G8N7ZJGFG"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAE8A2YqSLVgZei8dG9D3eRww9uDS1DUwI",
    authDomain: "workmob-web.firebaseapp.com",
    databaseURL: "https://stories-workmob.firebaseio.com",
    projectId: "workmob-web",
    storageBucket: "workmob-web.appspot.com",
    messagingSenderId: "72648274239",
    appId: "1:72648274239:web:96ba036e62c662759e238a",
    measurementId: "G-G4L18N2N9M"
};

const firebaseConfigViews = {
  apiKey: "AIzaSyAttRDNtODS8c-HUYoNfxVFP5D1yM5a_zw",
  authDomain: "workmob.firebaseapp.com",
  databaseURL: "https://workmob.firebaseio.com",
  projectId: "workmob",
  storageBucket: "workmob.appspot.com",
  messagingSenderId: "227812548834",
  appId: "1:227812548834:web:1ec812487f314f8ad4bebb",
  measurementId: "G-771RKSK6BK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const StoryViewsFirebase = firebase.initializeApp(firebaseConfigViews, "StoryViewsData");



export default firebase;