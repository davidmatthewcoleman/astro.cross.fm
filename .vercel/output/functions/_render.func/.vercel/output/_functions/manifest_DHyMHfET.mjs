import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_DUGC9iyh.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":true,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404/index.html","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"about/bookshelf/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about/bookshelf","isIndex":true,"type":"page","pattern":"^\\/about\\/bookshelf\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}],[{"content":"bookshelf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about/bookshelf/index.astro","pathname":"/about/bookshelf","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":true,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about/index.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/archive/series/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog/archive/series","isIndex":true,"type":"page","pattern":"^\\/blog\\/archive\\/series\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"archive","dynamic":false,"spread":false}],[{"content":"series","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/archive/series/index.astro","pathname":"/blog/archive/series","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/archive/tags/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog/archive/tags","isIndex":true,"type":"page","pattern":"^\\/blog\\/archive\\/tags\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"archive","dynamic":false,"spread":false}],[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/archive/tags/index.astro","pathname":"/blog/archive/tags","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/archive/topics/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog/archive/topics","isIndex":true,"type":"page","pattern":"^\\/blog\\/archive\\/topics\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"archive","dynamic":false,"spread":false}],[{"content":"topics","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/archive/topics/index.astro","pathname":"/blog/archive/topics","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/archive/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog/archive","isIndex":true,"type":"page","pattern":"^\\/blog\\/archive\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"archive","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/archive/index.astro","pathname":"/blog/archive","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"stories/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/stories","isIndex":true,"type":"page","pattern":"^\\/stories\\/?$","segments":[[{"content":"stories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/stories/index.astro","pathname":"/stories","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"works/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/works","isIndex":true,"type":"page","pattern":"^\\/works\\/?$","segments":[[{"content":"works","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/works/index.astro","pathname":"/works","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/david/cross.fm/frontend/src/pages/[slug]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/about/bookshelf/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/[series]/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/[series]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/[series]/page/[pageNum].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/series/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/tags/[tag]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/tags/[tag]/page/[pageNum].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/tags/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/topics/[topic]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/topics/[topic]/page/[pageNum].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/archive/topics/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/blog/page/[pageNum].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/stories/[slug]/[chapter].astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/stories/[slug]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/stories/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/stories/page/[pageNum]/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/works/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/about/index.astro",{"propagation":"none","containsHead":true}],["/Users/david/cross.fm/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_CxsbIkqB.mjs","\u0000@astrojs-manifest":"manifest_DHyMHfET.mjs","/Users/david/cross.fm/frontend/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_yIka5Z0K.mjs","\u0000@astro-page:src/pages/404/index@_@html":"chunks/index_BDCqdn9c.mjs","\u0000@astro-page:src/pages/about/bookshelf/index@_@astro":"chunks/index_9VO2_srs.mjs","\u0000@astro-page:src/pages/about/index@_@astro":"chunks/index_BL8QSL5C.mjs","\u0000@astro-page:src/pages/blog/archive/series/index@_@astro":"chunks/index_TkuwYUB3.mjs","\u0000@astro-page:src/pages/blog/archive/tags/[tag]/page/[pageNum]@_@astro":"chunks/_pageNum__DY0Mp15k.mjs","\u0000@astro-page:src/pages/blog/archive/tags/[tag]/index@_@astro":"chunks/index_BJfhFeH5.mjs","\u0000@astro-page:src/pages/blog/archive/tags/index@_@astro":"chunks/index_C4-Adefd.mjs","\u0000@astro-page:src/pages/blog/archive/topics/[topic]/page/[pageNum]@_@astro":"chunks/_pageNum__p7PoLK62.mjs","\u0000@astro-page:src/pages/blog/archive/topics/[topic]/index@_@astro":"chunks/index_Dr1SloOs.mjs","\u0000@astro-page:src/pages/blog/archive/topics/index@_@astro":"chunks/index_BuzoCfgB.mjs","\u0000@astro-page:src/pages/blog/archive/index@_@astro":"chunks/index_CGBEsRzk.mjs","\u0000@astro-page:src/pages/blog/page/[pageNum]@_@astro":"chunks/_pageNum__BnCgChuy.mjs","\u0000@astro-page:src/pages/blog/[series]/page/[pageNum]@_@astro":"chunks/_pageNum__DxvSPnna.mjs","\u0000@astro-page:src/pages/blog/[series]/[slug]@_@astro":"chunks/_slug__Bf9w6dVv.mjs","\u0000@astro-page:src/pages/blog/[series]/index@_@astro":"chunks/index_C8j7kPca.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"chunks/index_BJOjKv6X.mjs","\u0000@astro-page:src/pages/stories/page/[pageNum]/index@_@astro":"chunks/index_INDs-fj_.mjs","\u0000@astro-page:src/pages/stories/[slug]/[chapter]@_@astro":"chunks/_chapter__tsfasuim.mjs","\u0000@astro-page:src/pages/stories/[slug]/index@_@astro":"chunks/index_BLsLMLF2.mjs","\u0000@astro-page:src/pages/stories/index@_@astro":"chunks/index_DBME9orb.mjs","\u0000@astro-page:src/pages/works/index@_@astro":"chunks/index_DuiZfh-Q.mjs","\u0000@astro-page:src/pages/[slug]/index@_@astro":"chunks/index_g444uMRu.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DU90NdHe.mjs","/Users/david/cross.fm/frontend/src/components/works/Masonry.jsx":"_astro/Masonry.3ilZjcBP.js","/astro/hoisted.js?q=0":"_astro/hoisted.DmEqUK2w.js","/astro/hoisted.js?q=1":"_astro/hoisted.Be7NBLfV.js","/Users/david/cross.fm/frontend/src/components/bookshelf/Bookshelf.jsx":"_astro/Bookshelf.C5tRRmNg.js","@astrojs/react/client.js":"_astro/client.B1npo8iW.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.C15r35G6.css","/_astro/index.CKuBixKR.css","/favicon.svg","/_astro/Bookshelf.C5tRRmNg.js","/_astro/Masonry.3ilZjcBP.js","/_astro/Picture.DM9zuCPk.js","/_astro/SiteFooter.astro_astro_type_script_index_0_lang.N_5nrn3M.js","/_astro/client.B1npo8iW.js","/_astro/hoisted.Be7NBLfV.js","/_astro/hoisted.DmEqUK2w.js","/_astro/index.CPsv_dMH.js","/assets/css/app.css","/assets/css/comments.css","/assets/css/uipress.css","/assets/icons/android-chrome-192x192.png","/assets/icons/android-chrome-192x192.png.webp","/assets/icons/android-chrome-512x512.png","/assets/icons/android-chrome-512x512.png.webp","/assets/icons/apple-touch-icon-precomposed.png","/assets/icons/apple-touch-icon-precomposed.png.webp","/assets/icons/apple-touch-icon.png","/assets/icons/apple-touch-icon.png.webp","/assets/icons/browserconfig.xml","/assets/icons/favicon-16x16.png","/assets/icons/favicon-16x16.png.webp","/assets/icons/favicon-32x32.png","/assets/icons/favicon-32x32.png.webp","/assets/icons/favicon.ico","/assets/icons/favicon.svg","/assets/icons/mstile-144x144.png","/assets/icons/mstile-144x144.png.webp","/assets/icons/mstile-150x150.png","/assets/icons/mstile-150x150.png.webp","/assets/icons/mstile-310x150.png","/assets/icons/mstile-310x150.png.webp","/assets/icons/mstile-310x310.png","/assets/icons/mstile-310x310.png.webp","/assets/icons/mstile-70x70.png","/assets/icons/mstile-70x70.png.webp","/assets/icons/safari-pinned-tab.svg","/assets/icons/site.webmanifest","/assets/js/bookshelf.js","/assets/js/bookshelf.min.js","/assets/js/clipboard.min.js","/assets/js/disqus.min.js","/assets/js/enquire.min.js","/assets/js/fitty.min.js","/assets/js/footer.min.js","/assets/js/fuse.min.js","/assets/js/github-calendar.js","/assets/js/header.min.js","/assets/js/lazysizes.min.js","/assets/js/micromodal.min.js","/assets/js/mutation-events.js","/assets/js/popper.min.js","/assets/js/smooth-scroll.polyfills.min.js","/assets/js/swipe.min.js","/assets/js/tippy.min.js","/assets/js/uipress.js","/assets/js/view-chart.js","/assets/js/views.js","/assets/json/licenses.json","/assets/images/8BIT_logo.png","/assets/images/8BIT_logo_mini.png","/assets/images/admin-banner.jpg","/assets/images/admin-banner.jpg.webp","/assets/images/banner-mask.m.svg","/assets/images/banner-mask.svg","/assets/images/comments_loader.gif","/assets/images/cross.png","/assets/images/cross.png.webp","/assets/images/fanfiction-logo.png","/assets/images/fanfiction-logo.png.webp","/assets/images/fimfiction-logo.png","/assets/images/fimfiction-logo.png.webp","/assets/images/fimfiction.png","/assets/images/fimfiction.png.webp","/assets/images/goodreads-logo.svg","/assets/images/goodreads.png","/assets/images/goodreads.png.webp","/assets/images/gradient-mask.svg","/assets/images/lens-flare.png","/assets/images/lens-flare.png.webp","/assets/images/logo-mask.svg","/assets/images/logo-sweep-mask.svg","/assets/images/logo.jpg","/assets/images/logo.png","/assets/images/logo.png.webp","/assets/images/logo.svg","/assets/images/logo_alt.png","/assets/images/logo_alt.png.webp","/assets/images/logo_m.png","/assets/images/logo_m.png.webp","/assets/images/logo_m_alt.png","/assets/images/logo_m_alt.png.webp","/assets/images/logo_mask.svg","/assets/images/loona.gif","/assets/images/menu.png","/assets/images/menu_open.png","/assets/images/noise.png","/assets/images/noise.png.webp","/assets/images/noise@2x.png","/assets/images/noise@2x.png.webp","/assets/images/profile.png","/assets/images/sprite.svg","/assets/images/squircle.svg","/assets/fonts/Courgette-Regular.woff","/assets/fonts/merriweather-black.woff","/assets/fonts/merriweather-black.woff2","/assets/fonts/merriweather-bold.woff","/assets/fonts/merriweather-bold.woff2","/assets/fonts/merriweather-bolditalic.woff","/assets/fonts/merriweather-bolditalic.woff2","/assets/fonts/merriweather-italic.woff","/assets/fonts/merriweather-italic.woff2","/assets/fonts/merriweather-regular.woff","/assets/fonts/merriweather-regular.woff2","/assets/fonts/montserrat-black.woff","/assets/fonts/montserrat-black.woff2","/assets/fonts/montserrat-bold.woff","/assets/fonts/montserrat-bold.woff2","/assets/fonts/montserrat-regular.woff","/assets/fonts/montserrat-regular.woff2","/assets/fonts/muli-latin-200.woff","/assets/fonts/muli-latin-200.woff2","/assets/fonts/muli-latin-200italic.woff","/assets/fonts/muli-latin-200italic.woff2","/assets/fonts/muli-latin-300.woff","/assets/fonts/muli-latin-300.woff2","/assets/fonts/muli-latin-300italic.woff","/assets/fonts/muli-latin-300italic.woff2","/assets/fonts/muli-latin-400.woff","/assets/fonts/muli-latin-400.woff2","/assets/fonts/muli-latin-400italic.woff","/assets/fonts/muli-latin-400italic.woff2","/assets/fonts/muli-latin-600.woff","/assets/fonts/muli-latin-600.woff2","/assets/fonts/muli-latin-600italic.woff","/assets/fonts/muli-latin-600italic.woff2","/assets/fonts/muli-latin-700.woff","/assets/fonts/muli-latin-700.woff2","/assets/fonts/muli-latin-700italic.woff","/assets/fonts/muli-latin-700italic.woff2","/assets/fonts/muli-latin-800.woff","/assets/fonts/muli-latin-800.woff2","/assets/fonts/muli-latin-800italic.woff","/assets/fonts/muli-latin-800italic.woff2","/assets/fonts/muli-latin-900.woff","/assets/fonts/muli-latin-900.woff2","/assets/fonts/muli-latin-900italic.woff","/assets/fonts/muli-latin-900italic.woff2","/error/css/base.css","/error/css/demo.css","/error/css/fonts.css","/error/css/main.css","/error/css/vendor.css","/error/js/jquery-2.1.3.min.js","/error/js/main.js","/error/js/modernizr.js","/error/js/plugins.js","/error/images/main-logo.png","/assets/js/helper/closest.min.js","/assets/js/helper/fadeinout.min.js","/assets/js/helper/getParents.min.js","/assets/js/helper/isElementVisible.min.js","/assets/js/helper/prev.min.js","/assets/js/helper/prop.min.js","/assets/js/helper/throttle.min.js","/assets/fonts/league-gothic/LICENSE","/assets/fonts/league-gothic/league-gothic.eot","/assets/fonts/league-gothic/league-gothic.ttf","/assets/fonts/league-gothic/league-gothic.woff","/assets/fonts/source-sans-pro/LICENSE","/assets/fonts/source-sans-pro/source-sans-pro-italic.eot","/assets/fonts/source-sans-pro/source-sans-pro-italic.ttf","/assets/fonts/source-sans-pro/source-sans-pro-italic.woff","/assets/fonts/source-sans-pro/source-sans-pro-regular.eot","/assets/fonts/source-sans-pro/source-sans-pro-regular.ttf","/assets/fonts/source-sans-pro/source-sans-pro-regular.woff","/assets/fonts/source-sans-pro/source-sans-pro-semibold.eot","/assets/fonts/source-sans-pro/source-sans-pro-semibold.ttf","/assets/fonts/source-sans-pro/source-sans-pro-semibold.woff","/assets/fonts/source-sans-pro/source-sans-pro-semibolditalic.eot","/assets/fonts/source-sans-pro/source-sans-pro-semibolditalic.ttf","/assets/fonts/source-sans-pro/source-sans-pro-semibolditalic.woff","/error/images/demo/demo-particles.jpg","/error/images/demo/demo-slideshow.jpg","/error/images/demo/demo-static.jpg","/error/images/slides/dandelion.jpg","/error/images/slides/greens.jpg","/error/images/slides/woods.jpg","/error/fonts/roboto/roboto-black-webfont.eot","/error/fonts/roboto/roboto-black-webfont.svg","/error/fonts/roboto/roboto-black-webfont.ttf","/error/fonts/roboto/roboto-black-webfont.woff","/error/fonts/roboto/roboto-black-webfont.woff2","/error/fonts/roboto/roboto-blackitalic-webfont.eot","/error/fonts/roboto/roboto-blackitalic-webfont.svg","/error/fonts/roboto/roboto-blackitalic-webfont.ttf","/error/fonts/roboto/roboto-blackitalic-webfont.woff","/error/fonts/roboto/roboto-blackitalic-webfont.woff2","/error/fonts/roboto/roboto-bold-webfont.eot","/error/fonts/roboto/roboto-bold-webfont.svg","/error/fonts/roboto/roboto-bold-webfont.ttf","/error/fonts/roboto/roboto-bold-webfont.woff","/error/fonts/roboto/roboto-bold-webfont.woff2","/error/fonts/roboto/roboto-bolditalic-webfont.eot","/error/fonts/roboto/roboto-bolditalic-webfont.svg","/error/fonts/roboto/roboto-bolditalic-webfont.ttf","/error/fonts/roboto/roboto-bolditalic-webfont.woff","/error/fonts/roboto/roboto-bolditalic-webfont.woff2","/error/fonts/roboto/roboto-italic-webfont.eot","/error/fonts/roboto/roboto-italic-webfont.svg","/error/fonts/roboto/roboto-italic-webfont.ttf","/error/fonts/roboto/roboto-italic-webfont.woff","/error/fonts/roboto/roboto-italic-webfont.woff2","/error/fonts/roboto/roboto-light-webfont.eot","/error/fonts/roboto/roboto-light-webfont.svg","/error/fonts/roboto/roboto-light-webfont.ttf","/error/fonts/roboto/roboto-light-webfont.woff","/error/fonts/roboto/roboto-light-webfont.woff2","/error/fonts/roboto/roboto-lightitalic-webfont.eot","/error/fonts/roboto/roboto-lightitalic-webfont.svg","/error/fonts/roboto/roboto-lightitalic-webfont.ttf","/error/fonts/roboto/roboto-lightitalic-webfont.woff","/error/fonts/roboto/roboto-lightitalic-webfont.woff2","/error/fonts/roboto/roboto-medium-webfont.eot","/error/fonts/roboto/roboto-medium-webfont.svg","/error/fonts/roboto/roboto-medium-webfont.ttf","/error/fonts/roboto/roboto-medium-webfont.woff","/error/fonts/roboto/roboto-medium-webfont.woff2","/error/fonts/roboto/roboto-mediumitalic-webfont.eot","/error/fonts/roboto/roboto-mediumitalic-webfont.svg","/error/fonts/roboto/roboto-mediumitalic-webfont.ttf","/error/fonts/roboto/roboto-mediumitalic-webfont.woff","/error/fonts/roboto/roboto-mediumitalic-webfont.woff2","/error/fonts/roboto/roboto-regular-webfont.eot","/error/fonts/roboto/roboto-regular-webfont.svg","/error/fonts/roboto/roboto-regular-webfont.ttf","/error/fonts/roboto/roboto-regular-webfont.woff","/error/fonts/roboto/roboto-regular-webfont.woff2","/error/fonts/roboto/roboto-thin-webfont.eot","/error/fonts/roboto/roboto-thin-webfont.svg","/error/fonts/roboto/roboto-thin-webfont.ttf","/error/fonts/roboto/roboto-thin-webfont.woff","/error/fonts/roboto/roboto-thin-webfont.woff2","/error/fonts/roboto/roboto-thinitalic-webfont.eot","/error/fonts/roboto/roboto-thinitalic-webfont.svg","/error/fonts/roboto/roboto-thinitalic-webfont.ttf","/error/fonts/roboto/roboto-thinitalic-webfont.woff","/error/fonts/roboto/roboto-thinitalic-webfont.woff2","/error/fonts/roboto/stylesheet.css","/error/css/font-awesome/css/font-awesome.css","/error/css/font-awesome/css/font-awesome.min.css","/error/css/font-awesome/fonts/FontAwesome.otf","/error/css/font-awesome/fonts/fontawesome-webfont.eot","/error/css/font-awesome/fonts/fontawesome-webfont.svg","/error/css/font-awesome/fonts/fontawesome-webfont.ttf","/error/css/font-awesome/fonts/fontawesome-webfont.woff","/404.html","/about/bookshelf/index.html","/about/index.html","/blog/archive/series/index.html","/blog/archive/tags/index.html","/blog/archive/topics/index.html","/blog/archive/index.html","/blog/index.html","/stories/index.html","/works/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
