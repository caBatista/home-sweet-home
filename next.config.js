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
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
};
