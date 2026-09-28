# Phone number handling fix

## Causes and changes

- **Missing country prefix:** the four OTP/verification display helpers returned only the national US format. API response normalization also removed `+1` without retaining calling-code metadata. Verification now uses a shared prefix-aware display helper, resolves navigation/account/address country data, and passes the resolved prefix to change-number screens. Response normalization and signup retain country metadata for Redux and saved sessions.
- **Extra digits:** `formatUsPhone` intentionally returned overlong input unchanged, while phone inputs disabled native `maxLength`. The shared formatter now sanitizes input, removes an explicit US prefix, caps the national number at ten digits, and formats `1`, `12`, `123`, `(123) 4`, through `(123) 456-7890`.
- **Submission validation:** input normalization is separate from strict validation. `isValidUsPhone` and `requireUsPhone` validate the original national digits. Incomplete, unsupported, or overlong stored/API values are rejected rather than accepted through truncation. Existing screen error messages and the API request safeguard remain in use.
- **International behavior:** explicit country identity takes precedence over a shared calling code. Canada does not become US solely because its calling code is `+1`. Interested-conference registration no longer hardcodes US validation/prefixes. Change-number fields preserve non-US digits, and add-number screens accept countries beyond US/India. Profile dial-code resolution prefers saved/selected country information to geolocation and removes the unconditional US fallback.

## Coverage

Shared helper/input changes cover signup and profession/specialty continuation, login, password recovery, phone verification/change/add flows, conference registration and checkout, attendee/billing forms, interested-conference registration, profile contact/address and WhatsApp inputs, hospital phone fields in employment information, and Contact Us.

`SignUp`, `Login`, `ForgotMPIN`, `AddEmpInfo`, and their existing submission checks already use the shared formatter and therefore receive the input fix without duplicating it. Employment phone entry is currently a US-only form with country ID 1. The personalization/onboarding and employment display components were reviewed; they do not introduce an additional editable phone path. Numeric inputs for OTPs, duration, credits, ZIP codes and identifiers are not phone numbers.

## API handling

The existing transport and tests require US values as `+1 (XXX) XXX-XXXX`; this contract is preserved rather than switching these endpoints to raw digits. Exactly ten national digits must be present before serialization, and `+1` is serialized once. Explicit non-US country metadata prevents US serialization, including in nested attendee/billing data. Non-US interested-registration payloads use national digits. No backend changes or phone libraries were added.

## Edge cases

- Overlong, formatted and international US pastes; unsupported characters in input.
- An eleventh digit appended to a number whose first digit is 1 must not shift/remove that first digit.
- Backspacing through formatting boundaries down to an empty value.
- Legacy numeric/plain-digit values and incomplete stored values.
- Nested attendee/billing validation, empty optional phone fields and non-US leading zeros.
- Navigation objects, saved profile addresses, missing signup response metadata and invalid/missing calling-code strings.
- Generic user IDs are not interpreted as country IDs.
- Canadian account/input/payload handling despite the shared `+1` calling code.

## Verification and limits

All 120 tests passed across eight suites, covering utilities, input components, actual Axios bodies, country resolution and existing signup/checkout country behavior. All 21 changed JavaScript files parsed successfully; lint found no undefined identifiers or syntax errors. Shared helpers/input have zero lint errors. Screen-level hook-dependency lint issues remain, so this is not a claim of a clean application-wide lint run. Native iOS/Android end-to-end flows, keyboard cursor placement during arbitrary middle edits and live backend round-trips still require device QA. The tests use mocked transport; no live registration or phone verification was submitted. Existing database records are not repaired by this frontend change. If all country metadata and geolocation are unavailable, the app does not invent a US prefix; add/change submission asks the user to select a country in their profile.

## Files changed

- `__tests__/PhoneCountry.test.js`
- `__tests__/PhoneInput.test.js`
- `__tests__/UsPhone.test.js`
- `docs/changes/phone-number-handling.md`
- `src/Components/CellInput.js`
- `src/Redux/Saga/AuthSaga.js`
- `src/Screen/Auth/AddMobile.js`
- `src/Screen/Auth/AddMobileLogin.js`
- `src/Screen/Auth/ChangeMobileNo.js`
- `src/Screen/Auth/LoginMobile.js`
- `src/Screen/Auth/LoginMobileChange.js`
- `src/Screen/Auth/MobileLogin.js`
- `src/Screen/Auth/SplashMobile.js`
- `src/Screen/Auth/SplashMobileChange.js`
- `src/Screen/Auth/VerifyMobileOTP.js`
- `src/Screen/DetailsPageWebcast/Checkout.js`
- `src/Screen/DetailsPageWebcast/CheckoutInputbox.js`
- `src/Screen/DetailsPageWebcast/RegisterInterest.js`
- `src/Screen/GlobalSupport/ContactUs.js`
- `src/Screen/Profile/Contact.js`
- `src/Utils/Helpers/PhoneCountry.js`
- `src/Utils/Helpers/UsPhone.js`
