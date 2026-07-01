/**
 * Email regex value.
 * @returns {*}
 */
const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
/**
 * Mobile regex value.
 * @returns {*}
 */
const mobileRegex = /^\d{10}$/;
/**
 * Email string constant.
 * @returns {string}
 */
const email = "test@example.com";
console.log(emailRegex.test(email));
