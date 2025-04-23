module.exports = {
  trailingSlash: true,
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
    };
  },
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
};
