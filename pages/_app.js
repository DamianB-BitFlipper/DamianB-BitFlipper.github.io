// This custom App component wraps every page and hosts global providers.
// It imports the portfolio styles once for every route.
import '../styles/index.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
