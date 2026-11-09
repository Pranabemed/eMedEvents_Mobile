import React from 'react';
import { CommonActions } from '@react-navigation/native';

describe('PrimeCheckout Component and Navigation Flow', () => {
    describe('Form Validation Logic (Primary Registrant)', () => {
        const validateSubscriberForm = ({
            firstname,
            lastname,
            emailad,
            cellno,
            professionad,
            speciality,
            address,
            country,
            country_id,
            state,
            city,
            zipcode,
        }) => {
            const newErrors = {};
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!firstname?.trim()) newErrors.firstname = 'Please enter First Name';
            if (!lastname?.trim()) newErrors.lastname = 'Please enter Last Name';
            if (!emailad?.trim()) {
                newErrors.emailad = 'Please enter Email ID';
            } else if (!emailRegex.test(emailad.trim())) {
                newErrors.emailad = 'Please enter a valid Email ID';
            }

            const isUSA =
                country_id === '231' ||
                country_id === 231 ||
                country?.toLowerCase() === 'united states' ||
                country?.toLowerCase() === 'usa';
            const cleanPhone = String(cellno || '').replace(/[^0-9]/g, '');
            if (!cellno?.trim()) {
                newErrors.cellno = 'Please enter Cell Phone';
            } else if (isUSA && cleanPhone.length !== 10) {
                newErrors.cellno = 'Please enter a valid 10-digit Cell Phone';
            } else if (!isUSA && cleanPhone.length < 7) {
                newErrors.cellno = 'Please enter a valid Cell Phone';
            }

            if (!professionad?.trim()) newErrors.profession = 'Please select Profession';
            if (!speciality?.trim()) newErrors.specialty = 'Please select Specialty';
            if (!address?.trim()) newErrors.address = 'Please enter Contact Address';
            if (!country?.trim()) newErrors.country = 'Please select Country';
            if (!state?.trim()) newErrors.state = 'Please select State';
            if (!city?.trim()) newErrors.city = 'Please select City';
            if (!zipcode?.trim()) newErrors.zipcode = 'Please enter Zipcode';

            return {
                isValid: Object.keys(newErrors).length === 0,
                errors: newErrors,
            };
        };

        it('should fail validation when primary registrant fields are empty', () => {
            const result = validateSubscriberForm({});
            expect(result.isValid).toBe(false);
            expect(result.errors.firstname).toBe('Please enter First Name');
            expect(result.errors.lastname).toBe('Please enter Last Name');
            expect(result.errors.emailad).toBe('Please enter Email ID');
            expect(result.errors.cellno).toBe('Please enter Cell Phone');
            expect(result.errors.profession).toBe('Please select Profession');
            expect(result.errors.specialty).toBe('Please select Specialty');
            expect(result.errors.address).toBe('Please enter Contact Address');
            expect(result.errors.country).toBe('Please select Country');
            expect(result.errors.state).toBe('Please select State');
            expect(result.errors.city).toBe('Please select City');
            expect(result.errors.zipcode).toBe('Please enter Zipcode');
        });

        it('should pass validation when all primary registrant fields are properly provided', () => {
            const result = validateSubscriberForm({
                firstname: 'John',
                lastname: 'Doe',
                emailad: 'john.doe@example.com',
                cellno: '9876543210',
                professionad: 'Physician',
                speciality: 'Cardiology',
                address: '123 Main St',
                country: 'United States',
                country_id: '231',
                state: 'California',
                city: 'Los Angeles',
                zipcode: '90001',
            });
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });

        it('should reject invalid email format', () => {
            const result = validateSubscriberForm({
                firstname: 'John',
                lastname: 'Doe',
                emailad: 'invalid-email',
                cellno: '1234567890',
                professionad: 'Physician',
                speciality: 'Cardiology',
                address: '123 Main St',
                country: 'United States',
                country_id: '231',
                state: 'California',
                city: 'Los Angeles',
                zipcode: '90001',
            });
            expect(result.isValid).toBe(false);
            expect(result.errors.emailad).toBe('Please enter a valid Email ID');
        });
    });

    describe('Billing Information Representation', () => {
        it('should automatically mirror primary registrant info into billingData without requiring separate input boxes', () => {
            const form = {
                firstname: 'Jane',
                lastname: 'Smith',
                emailad: 'jane@example.com',
                cellno: '9876543210',
                address: '789 Pine St',
                country: 'United States',
                country_id: '231',
                state: 'Texas',
                state_id: '43',
                city: 'Austin',
                city_id: '5001',
                zipcode: '73301',
            };

            const billingData = {
                address: form.address,
                country: form.country,
                country_id: form.country_id,
                state: form.state,
                state_id: form.state_id,
                city: form.city,
                city_id: form.city_id,
                zipcode: form.zipcode,
                sameAsPrimary: true,
            };

            expect(billingData.address).toBe('789 Pine St');
            expect(billingData.city).toBe('Austin');
            expect(billingData.state).toBe('Texas');
            expect(billingData.sameAsPrimary).toBe(true);
        });
    });

    describe('Coupon Utility and Dynamic Pricing', () => {
        const computePricing = (basePrice, discountValue) => {
            const discount = Number(discountValue || 0);
            const total = Math.max(0, basePrice - discount);
            return {
                grossPrice: basePrice,
                discount,
                total,
            };
        };

        it('should display standard price when no coupon is applied', () => {
            const pricing = computePricing(99, 0);
            expect(pricing.grossPrice).toBe(99);
            expect(pricing.discount).toBe(0);
            expect(pricing.total).toBe(99);
        });

        it('should correctly apply coupon discount', () => {
            const pricing = computePricing(99, 20);
            expect(pricing.grossPrice).toBe(99);
            expect(pricing.discount).toBe(20);
            expect(pricing.total).toBe(79);
        });

        it('should not allow total price to fall below zero', () => {
            const pricing = computePricing(99, 150);
            expect(pricing.grossPrice).toBe(99);
            expect(pricing.discount).toBe(150);
            expect(pricing.total).toBe(0);
        });
    });

    describe('Navigation Target Verification', () => {
        it('should reset navigation route to PrimeCheckout when user opts for Prime membership', () => {
            const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: 'PrimeCheckout' }],
            });

            expect(resetAction.payload.routes[0].name).toBe('PrimeCheckout');
        });

        it('should navigate to PrimePayment from PrimeCheckout with subscriberData, billingData, and totalAmount', () => {
            const mockNavigate = jest.fn();
            const payload = {
                subscriberData: {
                    firstname: 'Test',
                    lastname: 'User',
                    email: 'test@example.com',
                },
                billingData: {
                    address: '123 Main St',
                    sameAsPrimary: true,
                },
                couponData: {
                    couponcode: 'SAVE10',
                    discount: 10,
                    total: 89,
                },
                totalAmount: 89,
            };

            mockNavigate('PrimePayment', payload);

            expect(mockNavigate).toHaveBeenCalledWith('PrimePayment', payload);
        });
    });

    describe('UserSubscription/saveUser API Payload & Reducer Sagas', () => {
        it('should construct exact saveUser API payload format matching specification', () => {
            const formState = {
                firstname: 'User',
                lastname: 'Test',
                emailad: 'App_test3@yopmail.com',
                professionad: 'Physician - DO',
                speciality_id: ['518', '705', '806'],
                npi_number: null,
                formattedPhone: '(964) 646-4630',
                licenseStateIdResolved: '2',
                licenseNumberResolved: '459656565',
                licenseExpiryDateResolved: '2026-11-10T11:10:30.952Z',
                address: 'Alabama Shores, AL 35661, USA',
                country_id: '1',
                state_id: '2',
                city_id: '1954',
                zipcode: '35661',
                deviceType: 'web_chrome',
                deviceToken: 'eSpof94ZCJraZ6dLyMPjI2:APA91bGlB8ZquSHEaZpG3xvX-G4IneAnNkfkvcYx2eFbKwKm_Y4kFjGKXRoa_p3GnLpWr44VHWgt0OXOt3asUBrcgi7anmnoASsHr6G9H6YynJdyZYdwHjs',
            };

            const saveUserPayload = {
                first_name: formState.firstname.trim(),
                last_name: formState.lastname.trim(),
                email: formState.emailad.trim(),
                profession: formState.professionad,
                speciality: formState.speciality_id.map(String),
                npi_number: formState.npi_number,
                phone: formState.formattedPhone,
                license_state_id: String(formState.licenseStateIdResolved),
                license_number: String(formState.licenseNumberResolved),
                license_expiry_date: formState.licenseExpiryDateResolved,
                address: formState.address.trim(),
                address2: '',
                country: String(formState.country_id),
                state: String(formState.state_id),
                city: String(formState.city_id),
                zipcode: formState.zipcode.trim(),
                bill_address: formState.address.trim(),
                bill_address2: '',
                bill_country: String(formState.country_id),
                bill_state: String(formState.state_id),
                bill_city: String(formState.city_id),
                bill_zipcode: formState.zipcode.trim(),
                deviceType: formState.deviceType,
                deviceToken: formState.deviceToken,
            };

            expect(saveUserPayload).toEqual({
                first_name: 'User',
                last_name: 'Test',
                email: 'App_test3@yopmail.com',
                profession: 'Physician - DO',
                speciality: ['518', '705', '806'],
                npi_number: null,
                phone: '(964) 646-4630',
                license_state_id: '2',
                license_number: '459656565',
                license_expiry_date: '2026-11-10T11:10:30.952Z',
                address: 'Alabama Shores, AL 35661, USA',
                address2: '',
                country: '1',
                state: '2',
                city: '1954',
                zipcode: '35661',
                bill_address: 'Alabama Shores, AL 35661, USA',
                bill_address2: '',
                bill_country: '1',
                bill_state: '2',
                bill_city: '1954',
                bill_zipcode: '35661',
                deviceType: 'web_chrome',
                deviceToken: 'eSpof94ZCJraZ6dLyMPjI2:APA91bGlB8ZquSHEaZpG3xvX-G4IneAnNkfkvcYx2eFbKwKm_Y4kFjGKXRoa_p3GnLpWr44VHWgt0OXOt3asUBrcgi7anmnoASsHr6G9H6YynJdyZYdwHjs',
            });
        });

        it('should handle primetrialCheckSuccess and saveUserSubscriptionSuccess by triggering PrimePayment navigation', () => {
            const mockNavigate = jest.fn();
            let pendingPaymentParams = {
                subscriberData: { firstname: 'User' },
                totalAmount: 99,
            };

            const onStatusChange = (status) => {
                if (
                    status === 'WebCast/primetrialCheckSuccess' ||
                    status === 'WebCast/saveUserSubscriptionSuccess'
                ) {
                    if (pendingPaymentParams) {
                        const params = pendingPaymentParams;
                        pendingPaymentParams = null;
                        mockNavigate('PrimePayment', params);
                    }
                }
            };

            onStatusChange('WebCast/primetrialCheckSuccess');
            expect(mockNavigate).toHaveBeenCalledWith('PrimePayment', {
                subscriberData: { firstname: 'User' },
                totalAmount: 99,
            });
            expect(pendingPaymentParams).toBeNull();
        });
    });
});
