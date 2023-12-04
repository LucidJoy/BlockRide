import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { UberProvider } from "../context/UberContext";

function MyApp({ Component, pageProps }) {
  return (
    <UberProvider>
      <Component {...pageProps} />
    </UberProvider>
  );
}

export default MyApp;
