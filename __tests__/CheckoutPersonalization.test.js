import React from 'react';
import {act, create} from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCheckoutPersonalization, {checkoutPersonalization} from '../src/Utils/Hooks/useCheckoutPersonalization';
import {saveGuestSignupDraft, loadGuestSignupDraft} from '../src/Utils/Helpers/GuestSignupDraft';

let markEdited;
let tree;
const applied = jest.fn();
const draft = {email: 'new@example.com', profession: 'Nurse', specialty: 'Cardiology', specialtyId: '12'};
function Harness(props) { markEdited = useCheckoutPersonalization({...props, onApply: applied}); return null; }
beforeEach(async () => {await AsyncStorage.clear(); applied.mockClear();});
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null;});

test('popup fields and specialty ID survive storage and a new screen without a guest route flag', async () => {
  await saveGuestSignupDraft(draft);
  expect(await loadGuestSignupDraft()).toEqual(draft);
  await act(async () => {tree = create(<Harness focused profile={{}} />);});
  expect(applied).toHaveBeenLastCalledWith({email: draft.email, profession: draft.profession, specialty: {name: draft.specialty, ids: ['12']}});
});

test('late empty or stale profile data cannot overwrite persisted personalization', async () => {
  await saveGuestSignupDraft(draft);
  await act(async () => {tree = create(<Harness focused profile={{}} />);});
  applied.mockClear();
  await act(async () => tree.update(<Harness focused profile={{personal_information: {email: null}, professional_information: {profession: 'Old'}, specialities: {2: 'Old'}}} />));
  expect(applied).not.toHaveBeenCalled();
});

test('manual edits including clearing fields survive profile reload and later draft changes', async () => {
  await saveGuestSignupDraft(draft);
  await act(async () => {tree = create(<Harness focused profile={{}} />);});
  markEdited('email'); markEdited('profession');
  applied.mockClear();
  await act(async () => tree.update(<Harness focused={false} />));
  await saveGuestSignupDraft({...draft, email: 'changed@example.com', profession: 'Physician', specialtyId: '99'});
  await act(async () => tree.update(<Harness focused profile={{}} />));
  expect(applied).not.toHaveBeenCalled();
});

test('popup updates after login are applied when checkout regains focus', async () => {
  await saveGuestSignupDraft(draft);
  await act(async () => {tree = create(<Harness focused profile={{email: 'old@example.com'}} />);});
  await act(async () => tree.update(<Harness focused={false} />));
  await saveGuestSignupDraft({...draft, email: 'updated@example.com', specialty: 'Neurology', specialtyId: '19'});
  await act(async () => tree.update(<Harness focused profile={{email: 'old@example.com'}} />));
  expect(applied).toHaveBeenLastCalledWith({email: 'updated@example.com', specialty: {name: 'Neurology', ids: ['19']}});
});

test('legacy specialty names resolve to IDs when options arrive', () => {
  expect(checkoutPersonalization({}, {...draft, specialtyId: ''}, [{id: 12, name: 'Cardiology'}]).specialty).toEqual({name: 'Cardiology', ids: ['12']});
});

test('profile supplies fallback values and empty responses never clear them', async () => {
  await act(async () => {tree = create(<Harness focused profile={{email: 'profile@example.com', profession: 'Physician', profession_type: 'MD', specialities: {7: 'Surgery'}}} />);});
  expect(applied).toHaveBeenCalledWith({email: 'profile@example.com', profession: 'Physician - MD', specialty: {name: 'Surgery', ids: ['7']}});
  applied.mockClear();
  await act(async () => tree.update(<Harness focused profile={{}} />));
  expect(applied).not.toHaveBeenCalled();
});
