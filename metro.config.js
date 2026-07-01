/**
 * Metro.config module. Contains application logic, configuration, or shared helpers. Exported members: config.
 */

const {
  withStorybook,
} = require('@storybook/react-native/withStorybook');

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withStorybook(mergeConfig(getDefaultConfig(__dirname), config));
