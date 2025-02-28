import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        typedEnv: true,
    },
    distDir: 'build',
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
