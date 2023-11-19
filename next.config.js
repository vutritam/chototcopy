/** @type {import('next').NextConfig} */
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
  },
 
}

module.exports = nextConfig
