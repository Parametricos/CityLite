
const withTM = require('next-transpile-modules')(['web-ifc-three', 'web-ifc'])

module.exports = withTM({
  images: {
    domains: ['cassini-hackathon-resources.s3.eu-central-1.amazonaws.com'],
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
})