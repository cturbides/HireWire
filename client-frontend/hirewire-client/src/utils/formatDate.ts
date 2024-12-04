/**
 * Formats a date to the format: "24 Jun 2024"
 * @param date - The date to format (string or Date object)
 * @returns A formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return parsedDate.toLocaleDateString("en-US", options);
};
