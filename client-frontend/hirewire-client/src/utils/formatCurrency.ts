/**
 * Formatea un número como una moneda.
 * @param amount El monto a formatear.
 * @param locale El código de idioma (ej. "en-US").
 * @param currency El tipo de moneda (ej. "USD").
 * @returns Una cadena formateada como moneda.
 */
export const formatCurrency = (
  amount: number,
  locale = "en-US",
  currency = "USD"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};
