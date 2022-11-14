import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang='en'>
    <Head />
    <body className='mx-auto max-w-3xl break-words leading-6 text-zinc-900 transition-colors duration-500 dark:bg-gray-900 dark:text-zinc-300'>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
