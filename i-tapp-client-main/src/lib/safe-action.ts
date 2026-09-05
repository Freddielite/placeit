// lib/safe-action.ts
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      // console.error("instance of Error  :", e);
      // console.error("instance of Error message  :", e.message);
      return e.message;
    }

    // console.error("Unknown error type:", e);
    return "An unexpected error occurred. Please try again later.";
  },
});
