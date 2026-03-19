export const maskDecimal = (value: string) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");
  if (!digits) return ""; 

  const cents = parseInt(digits, 10);
  if (isNaN(cents)) return "";

  const amount = (cents / 100).toFixed(2);

  const [integerPart, decimalPart] = amount.split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedInteger},${decimalPart}`;
};

export const maskDate = (value: string) => {
  if (!value) return "";
  let v = value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);
  
  if (v.length >= 5) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  } else if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2)}`;
  }
  return v;
};

export const parseStringToNumber = (value: string): number => {
  if (!value) return 0;

  const cleanValue = value.replace(/\./g, "").replace(",", ".");
  return Number(cleanValue);
};