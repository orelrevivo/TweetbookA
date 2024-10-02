import Head from 'next/head';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>Tweetbook</title>
      <meta name='og:title' content='Tweetbook' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
      <meta name='Tweetbook:site' content='@Tweetbook' />
      <meta name='Tweetbook:card' content='summary_large_image' />
    </Head>
  );
}
