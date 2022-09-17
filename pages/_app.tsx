import type { AppProps } from 'next/app';
import Chakra from '../components/Chakra';

function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra>
      <Component {...pageProps} />
    </Chakra>
  );
}

export default App;
