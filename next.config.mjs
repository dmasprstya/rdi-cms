import { withSentryConfig } from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Enable Next.js 14 instrumentation hook for Sentry
    experimental: {
        instrumentationHook: true,
        // Optimize package imports to only load what's needed
        optimizePackageImports: [
            'lucide-react',
            'recharts',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'react-hook-form',
            'date-fns'
        ],
        // Exclude database packages from serverless bundle
        serverComponentsExternalPackages: ['postgres', 'drizzle-orm', '@neondatabase/serverless'],
    },


    // Webpack configuration
    webpack: (config, { isServer }) => {
        // Ignore node-specific modules when bundling for the browser
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };

            // Advanced chunking strategy
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        // Separate vendor libraries
                        default: false,
                        vendors: false,
                        // Framework chunk (React, Next.js)
                        framework: {
                            name: 'framework',
                            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
                            priority: 40,
                            enforce: true,
                        },
                        // Common libraries chunk
                        lib: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                const packageName = module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                                )?.[1];
                                return `npm.${packageName?.replace('@', '')}`;
                            },
                            priority: 30,
                            minChunks: 1,
                            reuseExistingChunk: true,
                        },
                        // Shared components
                        commons: {
                            name: 'commons',
                            minChunks: 2,
                            priority: 20,
                        },
                    },
                    maxInitialRequests: 25,
                    minSize: 20000,
                },
            };
        }

        return config;
    },


    // Production optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Output configuration
    poweredByHeader: false,
    compress: true,
};

// Sentry webpack plugin configuration
const sentryWebpackPluginOptions = {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Automatically annotate errors with source map information
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the Sentry DSN is available on the client side.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
};

// Make sure adding Sentry options is the last code to run before exporting
export default withBundleAnalyzer(withSentryConfig(nextConfig, sentryWebpackPluginOptions));
