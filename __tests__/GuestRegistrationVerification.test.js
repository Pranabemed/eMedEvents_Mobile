import fs from 'fs';
import path from 'path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../src/Utils/Helpers/constants';

// Run the actual screen handlers with controlled storage and API timing.
// Native dashboard widgets are not involved in this ordering regression.
function handler(file, name, context = {}) {
  const source = fs.readFileSync(path.resolve(__dirname, '../src/Screen', file), 'utf8');
  const ast = require('@babel/parser').parse(source, {sourceType: 'module', plugins: ['jsx']});
  let found;
  require('@babel/traverse').default(ast, {VariableDeclarator(node) {
    if (node.node.id.name === name) found = node.node.init;
  }});
  if (found.type === 'CallExpression') found = found.arguments[0];
  return new Function(...Object.keys(context), `return (${source.slice(found.start, found.end)});`)(...Object.values(context));
}
const main = 'Dashboard/Main.js';
const guestUser = {email: 'guest@example.com', is_verified: 0, phone_verified: 0, profession: 'Physician', profession_type: 'MD'};
const keys = {
  GUEST_REGISTRATION_FLOW_KEY: 'GUEST_REGISTRATION_FLOW',
  GUEST_PRIME_VERIFICATION_PENDING_KEY: 'GUEST_PRIME_VERIFICATION_PENDING',
  GUEST_VERIFICATION_COMPLETED_KEY: 'GUEST_VERIFICATION_COMPLETED',
  PRIME_MEMBERSHIP_SKIPPED_KEY: 'PrimeMembershipSkipped',
  PRIME_MEMBERSHIP_PROMPT_PENDING_KEY: 'PrimeMembershipPromptPending',
  SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY: 'SUPPRESS_GUEST_HOME_PROMPTS_ONCE',
};
beforeEach(async () => {await AsyncStorage.clear(); jest.spyOn(console, 'log').mockImplementation(() => {});});
afterEach(() => jest.restoreAllMocks());

test.each(['DetailsPageWebcast/Checkout.js', 'DetailsPageWebcast/RegisterInterest.js'])('%s saves guest verification state before publishing login', async file => {
  let savedAtLogin;
  const dispatch = jest.fn(async () => {
    savedAtLogin = await AsyncStorage.multiGet([constants.VERIFYSTATEDATA, 'GUEST_REGISTRATION_FLOW', 'IS_GUEST_CONVERTED_USER']);
  });
  const persist = handler(file, 'persistGuestRegistrationSession', {
    ...keys, AsyncStorage, constants, dispatch, tokenSuccess: token => ({type: 'Auth/tokenSuccess', payload: token}),
    AuthReducer: {}, isNonUsaUser: false, isUsUser: true, state_id: '', licnumber: '', writeNonUsaFlowState: jest.fn(),
  });
  await persist({token: 'guest-token', user: guestUser});
  await Promise.resolve();
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(savedAtLogin.every(([, value]) => value !== null)).toBe(true);
  expect(JSON.parse(savedAtLogin[0][1]).email).toBe(guestUser.email);
  expect(savedAtLogin[2][1]).toBe('true');
});

test.each(['US', 'IN'])('%s guest verification overrides Prime and waits for fresh response on first visit', async country => {
  await AsyncStorage.multiSet([
    ['GUEST_REGISTRATION_FLOW', '{}'], ['IS_GUEST_CONVERTED_USER', 'true'],
    [constants.VERIFYSTATEDATA, JSON.stringify(guestUser)],
    [constants.PROFESSION, JSON.stringify(guestUser)],
  ]);
  const oldVerifiedResponse = {user: {...guestUser, is_verified: 1, phone_verified: 1}};
  const context = {
    ...keys, AsyncStorage, constants, isAccreditationUser: false, verificationEffectActive: true,
    AuthReducer: {status: 'Auth/tokenSuccess', verifyResponse: oldVerifiedResponse},
    DashboardReducer: {}, authProfessionInfo: {}, dashboardProfessionInfo: {}, dashboardProfessionType: '',
    allProfTake: true, resolvedIpCountryCode: country, primeCardSessionSkipped: false,
    primePromptVisibleRef: {current: true}, guestVerifyNavigationRef: {current: false},
    guestVerificationRefreshRef: {current: false}, guestVerificationResponseRef: {current: oldVerifiedResponse},
    parseStoredJson: handler(main, 'parseStoredJson'), buildProfessionLabel: handler(main, 'buildProfessionLabel'),
    requiresVerification: handler(main, 'requiresVerification'),
    setShowGuestPrimePrompt: jest.fn(), setPrimeadd: jest.fn(), setGuestVerifyModalVisible: jest.fn(),
    setGuestVerifyData: jest.fn(), setGuestVerifyLoading: jest.fn(), setIsSkippedFlow: jest.fn(), setPrimeCardSessionSkipped: jest.fn(),
    requestGuestVerificationCheck: jest.fn(),
    setGuestPrimeVerificationPending: () => AsyncStorage.setItem('GUEST_PRIME_VERIFICATION_PENDING', 'true'),
    openGuestVerificationAlert: jest.fn(),
  };
  await handler(main, 'loadGuestVerifyModal', context)();
  expect(context.requestGuestVerificationCheck).toHaveBeenCalledTimes(1);
  expect(context.setPrimeadd).toHaveBeenCalledWith(false);
  expect(context.openGuestVerificationAlert).not.toHaveBeenCalled();
  expect(await AsyncStorage.getItem('GUEST_VERIFICATION_COMPLETED')).toBeNull();
  // Another render before the response must not accept the old verified user.
  await handler(main, 'loadGuestVerifyModal', context)();
  expect(context.openGuestVerificationAlert).not.toHaveBeenCalled();
  context.AuthReducer = {status: 'Auth/verifySuccess', verifyResponse: {user: guestUser}};
  await handler(main, 'loadGuestVerifyModal', context)();
  expect(context.openGuestVerificationAlert).toHaveBeenCalledWith(guestUser, true);
  expect(context.requestGuestVerificationCheck).toHaveBeenCalledTimes(1);
});
