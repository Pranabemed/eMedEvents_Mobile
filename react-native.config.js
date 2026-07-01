/**
 * React native.config module. Contains application logic, configuration, or shared helpers.
 */

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  assets: ['./src/Assets/Fonts'],
};