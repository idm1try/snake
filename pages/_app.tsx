import type { AppProps } from 'next/app';
import Chakra from '../components/chakra';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </Chakra>
  );
}

export default MyApp;
