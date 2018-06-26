# Installation boilerplate

### @flow, Decorators y module resolver

```bash
yarn add flow-bin@^0.XX.0 # use .flowconfig version number,.
yarn add babel-plugin-transform-decorators-legacy babel-plugin-module-resolver
```

see bellow for [.babelrc](#babelrc) configuration example.

### Relay

```bash
yarn add react react-dom react-relay react-test-renderer react-relay-network-modern
yarn add --dev babel-plugin-relay graphql
yarn add --dev relay-compiler graphql
```

### schema.graphql

```bash
touch schema.graphql
```

```graphql
# source: http://appgestor.test/v1/graphql
# timestamp: Wed Jun 06 2018 15:19:42 GMT+0200 (CEST)

scalar DateTime
```

### Shoutem ui + theme

```bash
yarn add @shoutem/ui @shoutem/theme
```

### Package

```json
{
  "rnpm": {
    "assets": ["./assets/fonts"]
  },
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "ios": "react-native run-ios",
    "rlink": "react-native link",
    "db": "yarn schema && yarn relay",
    "android_release": "cd android && ./gradlew assembleRelease",
    "schema": "graphql get-schema --p AppGestor --e dev --insecure --no-all",
    "relay": "relay-compiler --src ./src --schema ./schema.graphql",
    "flow": "flow",
    "test": "jest",
    "relaydev": "relay-devtools",
    "reactdev": "react-devtools"
  }
}
```

### Frameworks

```
yarn add native-base react-navigation teaset

yarn add mobx-react mobx-persist mobx mobx-react-form validatorjs valid-url


yarn add --dev relay-devtools babel-plugin-module-resolver babel-plugin-transform-decorators-legacy

yarn add react-native-snap-carousel react-native-image-picker react-native-linear-gradient moment

yarn add react-native-render-html react-native-animatable react-native-scroll-view-parallax

yarn add react-native-zoom-image react-native-hero react-native-confetti-view

yarn add react-native-gravatar react-native-map-link react-native-device-info

yarn add  react-native-google-analytics-bridge react-native-firebase
```

### Install FacebookSDK

```bash
$ react-native install react-native-fbsdk
$ npm view react-native version
$ yarn rlink
$ curl -O https://raw.githubusercontent.com/facebook/react-native-fbsdk/master/bin/ios_setup.js
$ node ios_setup.js 12245689998766 "AppGestor"
```

### Firebase with no POD

Drag "Firebase" into Project -> Frameworks/Firebase select the **Create groups** options, folder will go yellow, (not blue).

```
<key>IS_ADS_ENABLED</key>
<false/>
<key>IS_ANALYTICS_ENABLED</key>
<false/>
<key>IS_APPINVITE_ENABLED</key>
<false/>
<key>IS_GCM_ENABLED</key>
<false/>
<key>IS_SIGNIN_ENABLED</key>
<false/>
```

AppDelegate.m

```
#import "Firebase.h"
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

  ...
  NSURL *jsCodeLocation;

  [FIRApp configure];
  [RNFirebaseNotifications configure];

  jsCodeLocation = ...


- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}
```

Info.plist

```
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### .babelrc

```json
{
  "presets": ["react-native"],
  "plugins": [
    "transform-decorators-legacy",
    "relay",
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "@theme": "./src/libs/theme",
          "@services": "./src/libs/services",
          "@libs": "./src/libs",
          "@components": "./src/components",
          "@graphql": "./src/libs/graphql",
          "@ui": "./src/components/ui",
          "@assets": "./assets",
          "@store": "./src/libs/stores"
        }
      }
    ]
  ]
}
```

### @flow

```
[options]

;  decorators.
esproposal.decorators=ignore
```

### schema.graphql

```graphql
# source: http://appgestor.test/v1/graphql
# timestamp: Wed Jun 06 2018 15:19:42 GMT+0200 (CEST)

scalar DateTime
```
