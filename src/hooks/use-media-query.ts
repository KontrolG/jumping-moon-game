/* eslint-disable react-hooks/rules-of-hooks */
// Based on https://github.com/beautifulinteractions/beautiful-react-hooks/blob/HEAD/src/useMediaQuery.js
import { useEffect, useState } from "react";
import isBrowserAPISupported from "../utils/is-browser-api-supported";

const errorMessage =
  "matchMedia is not supported, this could happen both because window.matchMedia is not supported by" +
  " your current browser or you're using the useMediaQuery hook whilst server side rendering.";

/**
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.
 * It also monitor the document changes to detect when it matches or stops matching the media query.
 * Returns the validity state of the given media query.
 *
 */
function useMediaQuery(mediaQuery: string) {
  if (!isBrowserAPISupported("matchMedia")) {
    // eslint-disable-next-line no-console
    console.warn(errorMessage);
    return null;
  }

  const [isVerified, setIsVerified] = useState(
    !!window.matchMedia(mediaQuery).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches);

    try {
      mediaQueryList.addEventListener("change", documentChangeHandler);
    } catch (e) {
      //Safari isn't supporting mediaQueryList.addEventListener
      console.error(e);
      mediaQueryList.addListener(documentChangeHandler);
    }

    documentChangeHandler();
    return () => {
      try {
        mediaQueryList.removeEventListener("change", documentChangeHandler);
      } catch (e) {
        //Safari isn't supporting mediaQueryList.removeEventListener
        console.error(e);
        mediaQueryList.removeListener(documentChangeHandler);
      }
    };
  }, [mediaQuery]);

  return isVerified;
}

export { useMediaQuery };
