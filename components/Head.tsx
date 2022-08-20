import Head from 'next/head';

export const HeadComponent = () => (
  <Head>
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='description' content='Snake browser game' />
    <meta name='author' content='idm1try' />
    <meta name='twitter:title' content='Snake Game' />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content='@idm1try' />
    <meta name='twitter:creator' content='@idm1try' />
    <meta name='twitter:image' content='https://snake-next.vercel.app/preview.png' />
    <meta property='og:site_name' content='Snake Game' />
    <meta name='og:title' content='Snake Game' />
    <meta property='og:type' content='website' />
    <meta property='og:image' content='https://snake-next.vercel.app/preview.png' />
    <title>Snake</title>
  </Head>
);
