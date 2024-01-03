/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();
const nextConfig = {
    images:{
        domains:["biblioreads.eu.org","images.blinkist.io","businessblog.blinkist.com",'cdn.sanity.io',"images-na.ssl-images-amazon.com"]
    },
    reactStrictMode: false
}
module.exports = nextConfig
