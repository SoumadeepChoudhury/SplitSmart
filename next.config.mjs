// /** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: false,
});

export default withPWA(config);