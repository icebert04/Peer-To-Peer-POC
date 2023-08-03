import Head from 'next/head'
import Image from 'next/image'
import App from "./App";

export default function Home() {
  return (
    <>
    <div className="p-0">
      <Head>
        <title>Peer To Peer POC</title> 
        <meta name="description" content="REVOLUTIONIZING THE ENERGY INDUSTRY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App/>
      </div>
    </>
  )
}