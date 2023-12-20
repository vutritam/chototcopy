const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Chỉ cần cấu hình loader nếu đang chạy trên phía client
    if (!isServer) {
      config.module.rules.push({
        test: /\.(mp3)$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      });
    }

    return config;
  },
  
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: process.env.BASE_PATH,
  //       permanent: true,
  //     },
  //   ];
  // },
};
