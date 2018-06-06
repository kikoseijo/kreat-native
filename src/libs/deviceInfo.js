// @flow
import DeviceInfo from 'react-native-device-info';

export default {
  DEVICE_INFO: {
    push_token: '', // "1.0", "1.0"
    app_version: DeviceInfo.getVersion(), // "1.0", "1.0"
    device_type: DeviceInfo.getSystemName(), // "iOS","Android"
    device_model: DeviceInfo.getDeviceId(), // "iPhone7,2", "goldfish"
    device_os: DeviceInfo.getSystemVersion(), // "11.0","7.1.1"
    lang: DeviceInfo.getDeviceLocale(), // "en", "en-US"
    country_code: DeviceInfo.getDeviceCountry(), // "US", based on locale.
    timezone_code: DeviceInfo.getTimezone(), // "Africa/Tunis"
    font_scale: DeviceInfo.getFontScale(), // 1.2
    identifier: DeviceInfo.getUniqueID() // "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9", "dd96dec43fb81c97"
  }
};

// const fontScale = DeviceInfo.getFontScale(); // 1.2
// const deviceName = DeviceInfo.getDeviceName(); "Becca's iPhone 6", ? PERMISIONS
// const bundleId = DeviceInfo.getBundleId(); // "com.learnium.mobile"
// const version = DeviceInfo.getVersion(); // "1.0", "1.0"
// const version = DeviceInfo.getReadableVersion(); // 1.0.1, 1.0.1
// const systemName = DeviceInfo.getSystemName(); //"iOS","Android"
// const manufacturer = DeviceInfo.getManufacturer(), // "Apple", "Google"
// const systemVersion = DeviceInfo.getSystemVersion(); "11.0","7.1.1"
// const timezone = DeviceInfo.getTimezone(); // "Africa/Tunis"
