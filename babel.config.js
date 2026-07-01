/**
 * Babel.config module. Contains application logic, configuration, or shared helpers.
 */

module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    'react-native-worklets/plugin',
  ]
};
