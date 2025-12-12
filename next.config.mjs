import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Estratégias de cache agressivas para garantir funcionamento offline
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  swcMinify: true,
  disable: false, // Mantém o SW ativo mesmo em dev para testes (pode mudar para process.env.NODE_ENV === "development" se preferir)
  workboxOptions: {
    disableDevLogs: true,
    // Garante que o service worker assuma o controle imediatamente
    skipWaiting: true,
    clientsClaim: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações padrão do Next.js
  reactStrictMode: true,
  output: "standalone", // Otimiza para Vercel/Docker
};

export default withPWA(nextConfig);
