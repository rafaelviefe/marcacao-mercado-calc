export const maskDecimal = (value: string) => {
  if (!value) return "";
  let v = value.replace(".", ",");
  v = v.replace(/[^0-9,]/g, ""); 
  
  const parts = v.split(",");
  if (parts.length > 1) {
    v = `${parts[0]},${parts[1].slice(0, 2)}`;
  }
  return v;
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
  return Number(value.replace(",", "."));
};