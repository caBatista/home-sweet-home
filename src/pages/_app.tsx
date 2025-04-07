import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log("App is changing to: ", url);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Projeto Casa Nova</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
