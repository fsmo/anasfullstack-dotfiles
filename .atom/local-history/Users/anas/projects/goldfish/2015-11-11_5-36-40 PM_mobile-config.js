// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.doremir.goldfish',
  name: 'goldfish',
  description: 'Recording your chords and editing them',
  author: 'Doremir.com',
  email: 'info@doremir.com',
  website: 'http://doremir.com'
});

// // Set up resources such as icons and launch screens.
// App.icons({
//   'iphone': 'icons/icon-60.png',
//   'iphone_2x': 'icons/icon-60@2x.png',
//   // ... more screen sizes and platforms ...
// });
//
// App.launchScreens({
//   'iphone': 'splash/Default~iphone.png',
//   'iphone_2x': 'splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey'
// });
App.accessRule('blob:*');
App.accessRule('*');

// Give mobile app access to samples and keymaps.
// If not, errors like "ERROR whitelist rejection: url='http://download.scorecloud.com/jsaudio/instruments/Piano/Piano_keymap.json'"
// will show up in the iOS debug log.
App.accessRule('http://download.scorecloud.com');
