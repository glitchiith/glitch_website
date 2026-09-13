import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      brotliHeader(
        "/gameglitch/TestBuild/Build/TestBuild.data.br",
        "application/octet-stream",
      ),
      brotliHeader(
        "/gameglitch/TestBuild/Build/TestBuild.framework.js.br",
        "application/javascript",
      ),
      brotliHeader(
        "/gameglitch/TestBuild/Build/TestBuild.wasm.br",
        "application/wasm",
      ),
    ];
  },
};

function brotliHeader(source: string, contentType: string) {
  return {
    source,
    headers: [
      { key: "Content-Encoding", value: "br" },
      { key: "Content-Type", value: contentType },
    ],
  };
}

export default nextConfig;
