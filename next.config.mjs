/** @type {import('next').NextConfig} */
// GitHub project pages: BASE_PATH=/your-repo-name  (e.g. /amplitelstra)
// User/org site (username.github.io repo): leave BASE_PATH unset
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // index.html per folder — works reliably on GitHub Pages
  trailingSlash: true,
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
