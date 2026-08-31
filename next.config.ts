import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    const evpToken = process.env.CHROME_EVP_ORIGIN_TRIAL_TOKEN;
    if (evpToken === undefined || evpToken.length === 0) {
      return [];
    }

    return [
      {
        source: "/login",
        headers: [{ key: "Origin-Trial", value: evpToken }],
      },
    ];
  },
};

export default nextConfig;
