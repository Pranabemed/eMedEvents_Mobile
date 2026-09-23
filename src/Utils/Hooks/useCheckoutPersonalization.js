import {useCallback, useEffect, useRef, useState} from 'react';
import {loadGuestSignupDraft} from '../Helpers/GuestSignupDraft';

const clean = value => String(value ?? '').trim();

export const checkoutPersonalization = (profile = {}, draft, options = []) => {
  const info = profile?.professional_information || profile || {};
  const profession = clean(info.profession);
  const type = clean(info.profession_type);
  const profileProfession = profession && type && !profession.endsWith(` - ${type}`)
    ? `${profession} - ${type}` : profession;
  const result = {
    email: clean(draft?.email) || clean(profile?.personal_information?.email || profile?.email),
    profession: clean(draft?.profession) || profileProfession,
  };
  if (draft?.specialty || draft?.specialtyId) {
    const match = (Array.isArray(options) ? options : []).find(item => draft.specialtyId
      ? String(item.id ?? item.speciality_id) === String(draft.specialtyId)
      : clean(item.name || item.label).toLowerCase() === clean(draft.specialty).toLowerCase());
    const id = clean(draft.specialtyId || match?.id || match?.speciality_id);
    result.specialty = {name: clean(draft.specialty || match?.name || match?.label), ids: id ? [id] : []};
  } else if (!draft?.profession && profile?.specialities && Object.keys(profile.specialities).length) {
    result.specialty = {name: Object.values(profile.specialities).join(', '), ids: Object.keys(profile.specialities)};
  }
  return result;
};

// Read persistent personalization on every focus, independent of navigation origin.
// API hydration may fill fields, but cannot erase or replace manual checkout edits.
export default function useCheckoutPersonalization({focused, profile, options, onApply}) {
  const [draft, setDraft] = useState(null);
  const edited = useRef(new Set());
  const applied = useRef({});
  const applyRef = useRef(onApply);
  applyRef.current = onApply;
  const markEdited = useCallback(field => {
    edited.current.add(field);
    if (field === 'profession') edited.current.add('specialty');
  }, []);
  useEffect(() => {
    if (!focused) return;
    let active = true;
    loadGuestSignupDraft().then(value => { if (active) setDraft(value); });
    return () => { active = false; };
  }, [focused]);
  const serialized = JSON.stringify(checkoutPersonalization(profile, draft, options));
  useEffect(() => {
    if (!focused) return;
    const values = JSON.parse(serialized);
    const patch = {};
    Object.entries(values).forEach(([field, value]) => {
      if (!value || edited.current.has(field)) return;
      const key = JSON.stringify(value);
      if (applied.current[field] === key) return;
      applied.current[field] = key;
      patch[field] = value;
    });
    if (Object.keys(patch).length) applyRef.current(patch);
  }, [focused, serialized]);
  return markEdited;
}
