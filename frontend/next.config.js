"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Configuração do Next.js                                                     │
│                                                                             │
│ Este arquivo configura o Next.js com suporte a internacionalização,         │
│ otimizações e outras configurações necessárias.                             │
└─────────────────────────────────────────────────────────────────────────────┘
"""

/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['localhost', 'nowgo-agents.com'],
  },
  experimental: {
    serverActions: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8000'}/api/:path*`,
        permanent: true,
      },
    ];
  },
  webpack(config) {
    // Configurações adicionais do webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
