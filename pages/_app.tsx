import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

const Website = ({ Component, pageProps, router }: AppProps) => (
  <div>
    <Head>
      <title>Snake</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='author' content='idm1try' />
      <meta name='description' content='Snake browser game built, using Next.js' />
      <meta name='keywords' content='snake, snake game, browser game, nextjs, react' />

      <meta property='og:url' content='https://snake-next.vercel.app/' />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='Snake-Game' />
      <meta property='og:title' content='Snake-Game' />
      <meta property='og:description' content='Snake browser game, built using Next.js' />
      <meta property='og:image' content='https://snake-next.vercel.app/snake.png' />
      <meta property='og:image:width' content='512' />
      <meta property='og:image:height' content='512' />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content='https://snake-next.vercel.app/' />
      <meta name='twitter:site' content='@idm1try' />
      <meta name='twitter:title' content='Snake Game' />
      <meta name='twitter:description' content='Snake browser game, built using Next.js' />
      <meta name='twitter:image' content='https://snake-next.vercel.app/snake.png' />
    </Head>
    <Component {...pageProps} key={router.route} />
  </div>
);

export default Website;
