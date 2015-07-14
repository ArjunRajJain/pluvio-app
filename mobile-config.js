
App.info({
  id: 'com.pluvio.umbrella',
  name: 'pluvio',
  description: "pluvio",
  author: 'Arjun Raj Jain',
  email: 'arjunraj@downtochill.com',
  website: 'http://downtochill.com'
});

// Set PhoneGap/Cordova preferences
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference("ShowSplashScreenSpinner" , false)
App.setPreference("SplashScreenDelay", 10000);
App.setPreference("SplashScreen" , "screen");
App.setPreference("AutoHideSplashScreen" , false);
App.setPreference("orientation" , "portrait");
App.setPreference("android-windowSoftInputMode" , "adjustPan");
// Pass preferences for a particular PhoneGap/Cordova plugin

App.accessRule("http://dtozmh1cq40e6.cloudfront.net");
App.accessRule("http://fonts.googleapis.com");
App.accessRule("http://maxcdn.bootstrapcdn.com");
App.accessRule("http://www.google-analytics.com");
App.accessRule("https://engine.kadira.io");
App.accessRule("http://fonts.gstatic.com");
App.accessRule("https://stats.g.doubleclick.net");
App.accessRule("http://d2kt29ohe4uht6.cloudfront.net");
App.accessRule("https://dtc-photos.s3.amazonaws.com");
App.accessRule("http://meteor.local");
App.accessRule("http://maps.google.com");
