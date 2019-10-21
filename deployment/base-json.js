module.exports = {
  version: 2,
  routes: [
    {
      src: "/_next/(.*)",
      dest: "/_next/$1"
    },
    {
      src: "/static/(.*)",
      dest: "/static/$1"
    },
    {
      src: "/favicon.ico",
      dest: "/static/$1"
    },
    {
      src: "/robots.txt",
      dest: "/api/robots"
    },
    {
      src: "/api/(.*)",
      dest: "/api/$1"
    },
    {
      src: "/terms",
      dest: "/terms"
    },
    {
      src: "/create-uid",
      dest: "/create-uid.html"
    },
    {
      src: "/sitemap.xml",
      dest: "/api/sitemap"
    },
    {
      src: "/prismic/preview(.*)",
      dest: "/api/preview"
    },
    {
      src: "/prismic/resolve(.*)",
      dest: "/api/resolve"
    },
    {
      src: "/(.*)",
      dest: "/index"
    }
  ],
  env: {
    AMPLITUDE_PROD: "@amplitude_prod",
    AMPLITUDE_DEV: "@amplitude_dev"
  }
};
