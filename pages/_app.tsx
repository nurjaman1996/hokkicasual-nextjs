import Head from 'next/head';
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Smart Apps | Hokki Casual</title>
        <link rel="shortcut icon" href="../favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp;
