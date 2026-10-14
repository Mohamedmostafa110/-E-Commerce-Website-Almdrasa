export const money = (n) => {
  const v = Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  return `$${Number.isInteger(v) ? v : v.toFixed(2)}`;
};
