import type { AppProps } from 'next/app'
import React from 'react'
import { Analytics } from 'vercel/analytics/react'
import '../styles/globals.css'

type CustomAppProps = AppProps & {
    pageProps: any
}

function MyApp({ Component, pageProps }: CustomAppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    )
}

export default MyApp
