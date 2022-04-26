import Head from 'next/head'

export const siteTitle = 'Github Repositories Search'

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Github Repositories Search"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="mb-9 mt-4 text-xl">
        <h1 className="text-center text-gray-600 font-bold">Github Repositories Search</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}