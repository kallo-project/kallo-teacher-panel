import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html lang='en-US'>
      <Head>
        <meta name='title' content='Kallo Teacher Panel' />
        <meta name='description' content='Manage students and view their activities.' />

        <link rel='apple-touch-icon' sizes='180x180' href='/favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicons/favicon-16x16.png' />
        <link rel='manifest' href='/favicons/site.webmanifest' />
        <link rel='mask-icon' href='/favicons/safari-pinned-tab.svg' color='#5bbad5' />

        <meta name='msapplication-TileColor' content='#2d89ef' />
        <meta name='theme-color' content='#ffffff' />

        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css'
          integrity='sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I'
          crossOrigin='anonymous'
        />
      </Head>

      <body style={{ overflowY: 'scroll' }}>
        <Main />
        <NextScript />

        <script
          dangerouslySetInnerHTML={{
            __html:
              `console.log('%cStop!', 'color: red; font-weight: bold; font-size: 50px; -webkit-text-stroke: 1px black;');` +
              `console.log('Copying-pasting something here could give attackers access to your classroom!');` +
              `console.log('If you know what you are doing, please ignore this warning and stay safe.'); console.log('Please see https://wikipedia.org/wiki/Self-XSS for more information.');`
          }}
        />
      </body>
    </Html>
  );
}

export default MyDocument;
