const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
const mobileRegex = /^\d{10}$/;
const email = "test@example.com";
console.log(emailRegex.test(email));
