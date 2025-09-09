
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from
    // the Firebase Studio environment.
    allowedDevOrigins: [
      '6000-firebase-studio-1757277371367.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'logiflow-8oju4',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:719952558782:web:dc7dddf4ec6ba35baf7cef',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'logiflow-8oju4.firebasestorage.app',
    NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyDxS__aq2vbL6mSV4xsaLWnWCh7oyFu8EE',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'logiflow-8oju4.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '719952558782',
  },
};

export default nextConfig;
