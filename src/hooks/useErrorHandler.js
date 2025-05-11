import { useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook for handling API errors consistently across the application
 * @returns {Object} Error handling functions
 */
const useErrorHandler = () => {
  /**
   * Handle API errors and show appropriate toast notifications
   * @param {Error} error - The error object from the API call
   * @param {string} fallbackMessage - Optional fallback message if error doesn't have a message
   */
  const handleApiError = useCallback(
    (error, fallbackMessage = "An error occurred. Please try again.") => {
      console.error("API Error:", error);

      // Extract the error message
      let errorMessage = fallbackMessage;

      if (error?.response?.data?.status_message) {
        // TMDb API specific error format
        errorMessage = error.response.data.status_message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Handle specific HTTP status codes
      if (error?.response?.status === 401) {
        errorMessage = "Unauthorized: Please check your API key";
      } else if (error?.response?.status === 404) {
        errorMessage = "The requested resource was not found";
      } else if (error?.response?.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later";
      }

      // Show toast notification
      toast.error(errorMessage, {
        duration: 4000,
      });

      return errorMessage;
    },
    []
  );

  /**
   * Show a success toast notification
   * @param {string} message - The success message to display
   */
  const showSuccess = useCallback((message) => {
    toast.success(message, {
      duration: 3000,
    });
  }, []);

  return {
    handleApiError,
    showSuccess,
  };
};

export default useErrorHandler;
