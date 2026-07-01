/**
 * Jest.config module. Contains application logic, configuration, or shared helpers.
 */

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|moti|@rneui/.*|@dev-amirzubair/react-native-voice|react-native-reanimated|react-native-worklets)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  clearMocks: true,
};
