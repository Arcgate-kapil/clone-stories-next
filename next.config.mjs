import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['cdn.workmob.com'],
  },
  turbopack: {},
  // matcher: [
  //   '/', 
  //   '/((?!api|_next|.*\\..*).*)' 
  // ],
};

export default withNextIntl(nextConfig);
