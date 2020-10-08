module.exports = {
  env: {
    HOST: process.env.HOST,
    BACKEND_HOST: process.env.BACKEND_HOST,
    API_VERSION: process.env.API_VERSION,
    G_SITE_KEY: process.env.G_SITE_KEY
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/newclassroom',
        permanent: true
      },
      {
        source: '/classroom/:id',
        destination: '/classroom/:id/students',
        permanent: true
      }
    ];
  }
};
