/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config()

const nextConfig = {
  reactStrictMode: true,
  env: {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  }
}

module.exports = nextConfig
