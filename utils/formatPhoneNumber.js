function formatPhoneNumber(phoneNumber) {
  let numberString = phoneNumber.toString();
  if (numberString.length > 10) {
    numberString = numberString.slice(-10);
  }
  return `(${numberString.slice(0, 3)}) ${numberString.slice(3, 6)}-${numberString.slice(6)}`;
}

export default formatPhoneNumber;
