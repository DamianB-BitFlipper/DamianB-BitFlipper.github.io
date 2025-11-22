// This custom App component wraps every page and hosts global providers.
// It imports Tailwind and site-wide CSS once so every route shares styles.
import 'tailwindcss/tailwind.css'
import '../styles/index.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
