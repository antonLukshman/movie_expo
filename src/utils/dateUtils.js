/**
 * Format a date string to a human-readable format
 *
 * @param {string} dateString - The date string to format (e.g., "2023-05-18")
 * @param {Object} options - Formatting options for Intl.DateTimeFormat
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "Unknown";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error formatting date";
  }
};

/**
 * Format runtime minutes into hours and minutes
 *
 * @param {number} minutes - The runtime in minutes
 * @returns {string} Formatted runtime string (e.g., "2h 35m")
 */
export const formatRuntime = (minutes) => {
  if (!minutes || isNaN(minutes)) return "Unknown";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

/**
 * Get the year from a date string
 *
 * @param {string} dateString - The date string
 * @returns {string} The year or "Unknown"
 */
export const getYearFromDate = (dateString) => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.getFullYear().toString();
  } catch (error) {
    console.error("Error extracting year from date:", error);
    return "Unknown";
  }
};

/**
 * Format a date string relative to current time (e.g., "2 days ago")
 *
 * @param {string} dateString - The date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Unknown";
    }

    // Use Intl.RelativeTimeFormat if available
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const now = new Date();
    const diffInSeconds = Math.floor((date - now) / 1000);

    // Convert to appropriate unit
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, "second");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, "minute");
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(diffInHours, "hour");
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(diffInDays, "day");
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(diffInMonths, "month");
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(diffInYears, "year");
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return formatDate(dateString);
  }
};
