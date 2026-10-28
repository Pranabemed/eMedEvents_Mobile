import fs from 'fs';
import path from 'path';
import AsyncStorage from '@react-native-async-storage/async-storage';

const source = fs.readFileSync(path.resolve(__dirname, '../src/Navigator/StackNav.js'), 'utf8');
const ast = require('@babel/parser').parse(source, {sourceType: 'module', plugins: ['jsx']});
function readHandler(name, context) {
  let expression;
  require('@babel/traverse').default(ast, {VariableDeclarator({node}) {
    if (node.id.name === name) expression = node.init;
  }});
  if (expression.type === 'CallExpression') expression = expression.arguments[0];
  return new Function(...Object.keys(context), `return (${source.slice(expression.start, expression.end)});`)(...Object.values(context));
}

beforeEach(async () => AsyncStorage.clear());

test.each(['Login', 'SignUp', 'Onboard'])('%s handles app switching without resetting an unfinished auth form', async route => {
  const dispatch = jest.fn();
  const reset = readHandler('resetToSplashScreen', {
    getCurrentRoute: () => route,
    navigationRef: {dispatch}, CommonActions: {reset: payload => ({type: 'RESET', payload})},
  });
  const onChange = readHandler('handleAppStateChange', {
    wasBackgrounded: {current: false}, notificationPermissionBackground: {current: false},
    isPushPermissionRequestInProgress: () => false, isExternalNavigationInProgress: {current: false},
    AsyncStorage, constants: {TOKEN: 'token'}, GUEST_REGISTRATION_FLOW_KEY: 'GUEST_REGISTRATION_FLOW',
    resetToSplashScreen: reset,
  });
  for (let repeat = 0; repeat < 2; repeat += 1) {
    onChange('background');
    onChange('active');
    await new Promise(resolve => setImmediate(resolve));
  }
  if (route === 'Onboard') expect(dispatch).toHaveBeenCalledTimes(2);
  else expect(dispatch).not.toHaveBeenCalled();
});

test('delayed storage lookup cannot reset a login form opened during resume', async () => {
  let route = 'Onboard';
  const dispatch = jest.fn();
  const reset = readHandler('resetToSplashScreen', {
    getCurrentRoute: () => route, navigationRef: {dispatch}, CommonActions: {reset: jest.fn()},
  });
  route = 'Login';
  reset();
  expect(dispatch).not.toHaveBeenCalled();
});
