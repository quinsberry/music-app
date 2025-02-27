/** @type {import('next').NextConfig} */
const nextConfig = {
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
