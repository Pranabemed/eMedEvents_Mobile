import { hasUsaPrimeProfile } from '../src/Utils/Helpers/primeSubscription';
import { isUsaCountryCode } from '../src/Utils/Helpers/nonUsaFlow';

describe('Prime Dashboard with Non-USA IP for Logged-in User with License and State', () => {
  const evaluateUserDashboardEligibility = ({
    userObj,
    resolvedIpCountryCode,
    hasLicenseNumberAndState,
    hasAnyLicenseData,
    isAddressUsa,
    isPhysicianFlow,
    normalizedFulldashbaord = [],
  }) => {
    // 1. If user has state licenses or both license number and state, they are practicing under US state licensure
    let isNonUsaUser = true;
    if (hasLicenseNumberAndState || hasAnyLicenseData || normalizedFulldashbaord.length > 0) {
      isNonUsaUser = false;
    } else if (hasUsaPrimeProfile(userObj) || isAddressUsa) {
      isNonUsaUser = false;
    } else if (userObj?.usa_user === true || userObj?.usa_user === 1 || userObj?.usa_user === '1') {
      isNonUsaUser = false;
    } else {
      const userCountryName = String(
        userObj?.user_address?.country_name ||
        userObj?.user_address?.country ||
        userObj?.country_name ||
        userObj?.country ||
        ''
      ).trim().toUpperCase();

      const userCountryCode = String(
        userObj?.user_address?.country_code ||
        userObj?.country_code ||
        ''
      ).trim().toUpperCase();

      const userCountryId = String(
        userObj?.user_address?.country_id ||
        userObj?.country_id ||
        ''
      ).trim();

      if (isUsaCountryCode(userCountryName) || isUsaCountryCode(userCountryCode) || userCountryId === '1' || userCountryId === '233') {
        isNonUsaUser = false;
      } else {
        const ipCountry = String(resolvedIpCountryCode || '').trim().toUpperCase();
        if (ipCountry === 'IN' || ipCountry === 'INDIA' || (ipCountry !== '' && !isUsaCountryCode(ipCountry))) {
          isNonUsaUser = true;
        } else if (isUsaCountryCode(ipCountry)) {
          isNonUsaUser = false;
        }
      }
    }

    const shouldRenderStateLicense =
      (!isNonUsaUser || hasLicenseNumberAndState || hasAnyLicenseData || normalizedFulldashbaord.length > 0) &&
      isPhysicianFlow;

    return {
      isNonUsaUser,
      shouldRenderStateLicense,
    };
  };

  test('Logged in user with license number & state accessing from Non-USA IP (India) shows Prime Dashboard (StateLicense)', () => {
    const user = {
      license_number: 'TX12345',
      state_id: 43,
      profession: 'Physician',
      profession_type: 'MD',
      usa_user: true,
    };

    const result = evaluateUserDashboardEligibility({
      userObj: user,
      resolvedIpCountryCode: 'IN', // Non-USA IP address
      hasLicenseNumberAndState: true,
      hasAnyLicenseData: true,
      isAddressUsa: true,
      isPhysicianFlow: true,
      normalizedFulldashbaord: [{ state_id: 43, state_name: 'Texas', license_number: 'TX12345' }],
    });

    expect(result.isNonUsaUser).toBe(false);
    expect(result.shouldRenderStateLicense).toBe(true);
  });

  test('Logged in user with license number in licensures array accessing from UK IP shows Prime Dashboard', () => {
    const user = {
      licensures: [{ license_number: 'CA99887', state_id: 5, state_name: 'California' }],
      profession: 'Physician',
      profession_type: 'DO',
    };

    const result = evaluateUserDashboardEligibility({
      userObj: user,
      resolvedIpCountryCode: 'GB', // Non-USA IP address
      hasLicenseNumberAndState: true,
      hasAnyLicenseData: true,
      isAddressUsa: false,
      isPhysicianFlow: true,
      normalizedFulldashbaord: [{ state_id: 5, state_name: 'California', license_number: 'CA99887' }],
    });

    expect(result.isNonUsaUser).toBe(false);
    expect(result.shouldRenderStateLicense).toBe(true);
  });

  test('Guest or non-licensed user from India IP is properly identified as non-USA user', () => {
    const user = {
      country_name: 'India',
      country_id: '99',
    };

    const result = evaluateUserDashboardEligibility({
      userObj: user,
      resolvedIpCountryCode: 'IN',
      hasLicenseNumberAndState: false,
      hasAnyLicenseData: false,
      isAddressUsa: false,
      isPhysicianFlow: false,
      normalizedFulldashbaord: [],
    });

    expect(result.isNonUsaUser).toBe(true);
    expect(result.shouldRenderStateLicense).toBe(false);
  });
});

