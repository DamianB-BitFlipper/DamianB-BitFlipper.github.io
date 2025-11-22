
import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           /* Primary Meta Tags */
            <title>Damian Barabonkov - Software Engineer</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Damian Barabonkov - Software Engineer" />
            <meta name="description"
                content="Damian Barabonkov's Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="author" content="Damian Barabonkov" />
            <meta name="keywords"
                content="Damian Barabonkov, Damian Barabonkov's portfolio, ubuntu portfolio, software engineer, machine learning engineer" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            /* Search Engine */
            <meta name="image" content="/themes/dbtux.png" />
            /* Schema.org for Google */
            <meta itemProp="name" content="Damian Barabonkov - Software Engineer" />
            <meta itemProp="description"
                content="Damian Barabonkov's Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta itemProp="image" content="/themes/dbtux.png" />
            /* Twitter */
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Damian Barabonkov - Software Engineer" />
            <meta name="twitter:description"
                content="Damian Barabonkov's Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="twitter:site" content="Damian Barabonkov" />
            <meta name="twitter:creator" content="Damian Barabonkov" />
            <meta name="twitter:image:src" content="themes/dbtux.png" />
            /* Open Graph general (Facebook, Pinterest & Google+) */
            <meta name="og:title" content="Damian Barabonkov - Software Engineer" />
            <meta name="og:description"
                content="Damian Barabonkov's Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="og:image" content="themes/dbtux.png" />
            <meta name="og:url" content="https://github.com/DamianB-BitFlipper" />
            <meta name="og:site_name" content="Damian Barabonkov Portfolio" />
            <meta name="og:locale" content="en_US" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="/themes/dbtux.png" type="image/png" />
            <link rel="apple-touch-icon" href="themes/dbtux.png" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
