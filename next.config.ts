import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  paths: {
    '@/*': ['./src/*'],
  },
};

export default nextConfig;
