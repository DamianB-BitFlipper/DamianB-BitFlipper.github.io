// This file renders the root "/" route, surfacing the Ubuntu desktop experience.
// It also initializes GA tracking when available before showing Meta and UbuntuApp.
import UbuntuApp from "../components/ubuntu_app";
import ReactGA from 'react-ga4';
import Meta from "../components/SEO/Meta";

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
if(TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

function App() {
  return (
    <>
      <Meta />
      <UbuntuApp />
    </>
  )
}

export default App;
