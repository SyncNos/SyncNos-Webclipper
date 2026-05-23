import {
  r as d,
  c as XC,
  o as Qb,
  s as ZC,
  b as JC,
  D as QC,
  a as eO,
  d as tO,
  e as rO,
  f as Fe,
  g as _d,
  N as ts,
  F as Af,
  h as Ed,
  t as w,
  i as ew,
  j as nO,
  p as iO,
  n as Oo,
  k as Pm,
  l as Tc,
  m as rn,
  M as _o,
  q as fl,
  u as aO,
  v as Mc,
  w as Dc,
  x as oO,
  y as sO,
  z as lO,
  A as cO,
  B as uO,
  C as tw,
  E as kd,
  O as Rc,
  G as y,
  H as fO,
  I as dO,
  J as hO,
  K as cs,
  L as mO,
  P as pO,
  Q as gi,
  R as vO,
  S as ki,
  T as jd,
  U as rw,
  V as gO,
  W as nw,
  X as iw,
  Y as aw,
  Z as us,
  _ as yO,
  $ as ba,
  a0 as bO,
  a1 as wO,
  a2 as fs,
  a3 as xO,
  a4 as SO,
  a5 as AO,
  a6 as PO,
  a7 as CO,
  a8 as Eo,
  a9 as OO,
  aa as Cm,
  ab as _O,
  ac as EO,
  ad as kO,
  ae as Om,
  af as _m,
  ag as Em,
  ah as km,
  ai as jO,
  aj as NO,
  ak as IO,
  al as TO,
  am as MO,
  an as DO,
} from './tailwind-DM5HITYn.js';
var jm = 'popstate';
function Nm(e) {
  return (
    typeof e == 'object' && e != null && 'pathname' in e && 'search' in e && 'hash' in e && 'state' in e && 'key' in e
  );
}
function RO(e = {}) {
  function t(i, a) {
    let { pathname: o = '/', search: s = '', hash: l = '' } = Vn(i.location.hash.substring(1));
    return (
      !o.startsWith('/') && !o.startsWith('.') && (o = '/' + o),
      Pf(
        '',
        { pathname: o, search: s, hash: l },
        (a.state && a.state.usr) || null,
        (a.state && a.state.key) || 'default',
      )
    );
  }
  function r(i, a) {
    let o = i.document.querySelector('base'),
      s = '';
    if (o && o.getAttribute('href')) {
      let l = i.location.href,
        c = l.indexOf('#');
      s = c === -1 ? l : l.slice(0, c);
    }
    return s + '#' + (typeof a == 'string' ? a : Aa(a));
  }
  function n(i, a) {
    Jt(i.pathname.charAt(0) === '/', `relative pathnames are not supported in hash history.push(${JSON.stringify(a)})`);
  }
  return $O(t, r, n, e);
}
function Le(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t);
}
function Jt(e, t) {
  if (!e) {
    typeof console < 'u' && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function LO() {
  return Math.random().toString(36).substring(2, 10);
}
function Im(e, t) {
  return {
    usr: e.state,
    key: e.key,
    idx: t,
    masked: e.unstable_mask ? { pathname: e.pathname, search: e.search, hash: e.hash } : void 0,
  };
}
function Pf(e, t, r = null, n, i) {
  return {
    pathname: typeof e == 'string' ? e : e.pathname,
    search: '',
    hash: '',
    ...(typeof t == 'string' ? Vn(t) : t),
    state: r,
    key: (t && t.key) || n || LO(),
    unstable_mask: i,
  };
}
function Aa({ pathname: e = '/', search: t = '', hash: r = '' }) {
  return (
    t && t !== '?' && (e += t.charAt(0) === '?' ? t : '?' + t),
    r && r !== '#' && (e += r.charAt(0) === '#' ? r : '#' + r),
    e
  );
}
function Vn(e) {
  let t = {};
  if (e) {
    let r = e.indexOf('#');
    r >= 0 && ((t.hash = e.substring(r)), (e = e.substring(0, r)));
    let n = e.indexOf('?');
    (n >= 0 && ((t.search = e.substring(n)), (e = e.substring(0, n))), e && (t.pathname = e));
  }
  return t;
}
function $O(e, t, r, n = {}) {
  let { window: i = document.defaultView, v5Compat: a = !1 } = n,
    o = i.history,
    s = 'POP',
    l = null,
    c = u();
  c == null && ((c = 0), o.replaceState({ ...o.state, idx: c }, ''));
  function u() {
    return (o.state || { idx: null }).idx;
  }
  function f() {
    s = 'POP';
    let g = u(),
      b = g == null ? null : g - c;
    ((c = g), l && l({ action: s, location: v.location, delta: b }));
  }
  function h(g, b) {
    s = 'PUSH';
    let S = Nm(g) ? g : Pf(v.location, g, b);
    (r && r(S, g), (c = u() + 1));
    let x = Im(S, c),
      A = v.createHref(S.unstable_mask || S);
    try {
      o.pushState(x, '', A);
    } catch (C) {
      if (C instanceof DOMException && C.name === 'DataCloneError') throw C;
      i.location.assign(A);
    }
    a && l && l({ action: s, location: v.location, delta: 1 });
  }
  function m(g, b) {
    s = 'REPLACE';
    let S = Nm(g) ? g : Pf(v.location, g, b);
    (r && r(S, g), (c = u()));
    let x = Im(S, c),
      A = v.createHref(S.unstable_mask || S);
    (o.replaceState(x, '', A), a && l && l({ action: s, location: v.location, delta: 0 }));
  }
  function p(g) {
    return FO(g);
  }
  let v = {
    get action() {
      return s;
    },
    get location() {
      return e(i, o);
    },
    listen(g) {
      if (l) throw new Error('A history only accepts one active listener');
      return (
        i.addEventListener(jm, f),
        (l = g),
        () => {
          (i.removeEventListener(jm, f), (l = null));
        }
      );
    },
    createHref(g) {
      return t(i, g);
    },
    createURL: p,
    encodeLocation(g) {
      let b = p(g);
      return { pathname: b.pathname, search: b.search, hash: b.hash };
    },
    push: h,
    replace: m,
    go(g) {
      return o.go(g);
    },
  };
  return v;
}
function FO(e, t = !1) {
  let r = 'http://localhost';
  (typeof window < 'u' && (r = window.location.origin !== 'null' ? window.location.origin : window.location.href),
    Le(r, 'No window.location.(origin|href) available to create URL'));
  let n = typeof e == 'string' ? e : Aa(e);
  return ((n = n.replace(/ $/, '%20')), !t && n.startsWith('//') && (n = r + n), new URL(n, r));
}
function ow(e, t, r = '/') {
  return BO(e, t, r, !1);
}
function BO(e, t, r, n) {
  let i = typeof t == 'string' ? Vn(t) : t,
    a = Ur(i.pathname || '/', r);
  if (a == null) return null;
  let o = sw(e);
  UO(o);
  let s = null;
  for (let l = 0; s == null && l < o.length; ++l) {
    let c = JO(a);
    s = XO(o[l], c, n);
  }
  return s;
}
function sw(e, t = [], r = [], n = '', i = !1) {
  let a = (o, s, l = i, c) => {
    let u = {
      relativePath: c === void 0 ? o.path || '' : c,
      caseSensitive: o.caseSensitive === !0,
      childrenIndex: s,
      route: o,
    };
    if (u.relativePath.startsWith('/')) {
      if (!u.relativePath.startsWith(n) && l) return;
      (Le(
        u.relativePath.startsWith(n),
        `Absolute route path "${u.relativePath}" nested under path "${n}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (u.relativePath = u.relativePath.slice(n.length)));
    }
    let f = br([n, u.relativePath]),
      h = r.concat(u);
    (o.children &&
      o.children.length > 0 &&
      (Le(
        o.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${f}".`,
      ),
      sw(o.children, t, h, f, l)),
      !(o.path == null && !o.index) && t.push({ path: f, score: GO(f, o.index), routesMeta: h }));
  };
  return (
    e.forEach((o, s) => {
      if (o.path === '' || !o.path?.includes('?')) a(o, s);
      else for (let l of lw(o.path)) a(o, s, !0, l);
    }),
    t
  );
}
function lw(e) {
  let t = e.split('/');
  if (t.length === 0) return [];
  let [r, ...n] = t,
    i = r.endsWith('?'),
    a = r.replace(/\?$/, '');
  if (n.length === 0) return i ? [a, ''] : [a];
  let o = lw(n.join('/')),
    s = [];
  return (
    s.push(...o.map((l) => (l === '' ? a : [a, l].join('/')))),
    i && s.push(...o),
    s.map((l) => (e.startsWith('/') && l === '' ? '/' : l))
  );
}
function UO(e) {
  e.sort((t, r) =>
    t.score !== r.score
      ? r.score - t.score
      : YO(
          t.routesMeta.map((n) => n.childrenIndex),
          r.routesMeta.map((n) => n.childrenIndex),
        ),
  );
}
var zO = /^:[\w-]+$/,
  KO = 3,
  WO = 2,
  HO = 1,
  qO = 10,
  VO = -2,
  Tm = (e) => e === '*';
function GO(e, t) {
  let r = e.split('/'),
    n = r.length;
  return (
    r.some(Tm) && (n += VO),
    t && (n += WO),
    r.filter((i) => !Tm(i)).reduce((i, a) => i + (zO.test(a) ? KO : a === '' ? HO : qO), n)
  );
}
function YO(e, t) {
  return e.length === t.length && e.slice(0, -1).every((n, i) => n === t[i]) ? e[e.length - 1] - t[t.length - 1] : 0;
}
function XO(e, t, r = !1) {
  let { routesMeta: n } = e,
    i = {},
    a = '/',
    o = [];
  for (let s = 0; s < n.length; ++s) {
    let l = n[s],
      c = s === n.length - 1,
      u = a === '/' ? t : t.slice(a.length) || '/',
      f = ds({ path: l.relativePath, caseSensitive: l.caseSensitive, end: c }, u),
      h = l.route;
    if (
      (!f &&
        c &&
        r &&
        !n[n.length - 1].route.index &&
        (f = ds({ path: l.relativePath, caseSensitive: l.caseSensitive, end: !1 }, u)),
      !f)
    )
      return null;
    (Object.assign(i, f.params),
      o.push({ params: i, pathname: br([a, f.pathname]), pathnameBase: r1(br([a, f.pathnameBase])), route: h }),
      f.pathnameBase !== '/' && (a = br([a, f.pathnameBase])));
  }
  return o;
}
function ds(e, t) {
  typeof e == 'string' && (e = { path: e, caseSensitive: !1, end: !0 });
  let [r, n] = ZO(e.path, e.caseSensitive, e.end),
    i = t.match(r);
  if (!i) return null;
  let a = i[0],
    o = a.replace(/(.)\/+$/, '$1'),
    s = i.slice(1);
  return {
    params: n.reduce((c, { paramName: u, isOptional: f }, h) => {
      if (u === '*') {
        let p = s[h] || '';
        o = a.slice(0, a.length - p.length).replace(/(.)\/+$/, '$1');
      }
      const m = s[h];
      return (f && !m ? (c[u] = void 0) : (c[u] = (m || '').replace(/%2F/g, '/')), c);
    }, {}),
    pathname: a,
    pathnameBase: o,
    pattern: e,
  };
}
function ZO(e, t = !1, r = !0) {
  Jt(
    e === '*' || !e.endsWith('*') || e.endsWith('/*'),
    `Route path "${e}" will be treated as if it were "${e.replace(/\*$/, '/*')}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/, '/*')}".`,
  );
  let n = [],
    i =
      '^' +
      e
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(/\/:([\w-]+)(\?)?/g, (o, s, l, c, u) => {
          if ((n.push({ paramName: s, isOptional: l != null }), l)) {
            let f = u.charAt(c + o.length);
            return f && f !== '/' ? '/([^\\/]*)' : '(?:/([^\\/]*))?';
          }
          return '/([^\\/]+)';
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, '(/$1)?$2');
  return (
    e.endsWith('*')
      ? (n.push({ paramName: '*' }), (i += e === '*' || e === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : r
        ? (i += '\\/*$')
        : e !== '' && e !== '/' && (i += '(?:(?=\\/|$))'),
    [new RegExp(i, t ? void 0 : 'i'), n]
  );
}
function JO(e) {
  try {
    return e
      .split('/')
      .map((t) => decodeURIComponent(t).replace(/\//g, '%2F'))
      .join('/');
  } catch (t) {
    return (
      Jt(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`,
      ),
      e
    );
  }
}
function Ur(e, t) {
  if (t === '/') return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let r = t.endsWith('/') ? t.length - 1 : t.length,
    n = e.charAt(r);
  return n && n !== '/' ? null : e.slice(r) || '/';
}
var QO = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function e1(e, t = '/') {
  let { pathname: r, search: n = '', hash: i = '' } = typeof e == 'string' ? Vn(e) : e,
    a;
  return (
    r ? ((r = r.replace(/\/\/+/g, '/')), r.startsWith('/') ? (a = Mm(r.substring(1), '/')) : (a = Mm(r, t))) : (a = t),
    { pathname: a, search: n1(n), hash: i1(i) }
  );
}
function Mm(e, t) {
  let r = t.replace(/\/+$/, '').split('/');
  return (
    e.split('/').forEach((i) => {
      i === '..' ? r.length > 1 && r.pop() : i !== '.' && r.push(i);
    }),
    r.length > 1 ? r.join('/') : '/'
  );
}
function Lc(e, t, r, n) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(n)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function t1(e) {
  return e.filter((t, r) => r === 0 || (t.route.path && t.route.path.length > 0));
}
function Nd(e) {
  let t = t1(e);
  return t.map((r, n) => (n === t.length - 1 ? r.pathname : r.pathnameBase));
}
function dl(e, t, r, n = !1) {
  let i;
  typeof e == 'string'
    ? (i = Vn(e))
    : ((i = { ...e }),
      Le(!i.pathname || !i.pathname.includes('?'), Lc('?', 'pathname', 'search', i)),
      Le(!i.pathname || !i.pathname.includes('#'), Lc('#', 'pathname', 'hash', i)),
      Le(!i.search || !i.search.includes('#'), Lc('#', 'search', 'hash', i)));
  let a = e === '' || i.pathname === '',
    o = a ? '/' : i.pathname,
    s;
  if (o == null) s = r;
  else {
    let f = t.length - 1;
    if (!n && o.startsWith('..')) {
      let h = o.split('/');
      for (; h[0] === '..'; ) (h.shift(), (f -= 1));
      i.pathname = h.join('/');
    }
    s = f >= 0 ? t[f] : '/';
  }
  let l = e1(i, s),
    c = o && o !== '/' && o.endsWith('/'),
    u = (a || o === '.') && r.endsWith('/');
  return (!l.pathname.endsWith('/') && (c || u) && (l.pathname += '/'), l);
}
var br = (e) => e.join('/').replace(/\/\/+/g, '/'),
  r1 = (e) => e.replace(/\/+$/, '').replace(/^\/*/, '/'),
  n1 = (e) => (!e || e === '?' ? '' : e.startsWith('?') ? e : '?' + e),
  i1 = (e) => (!e || e === '#' ? '' : e.startsWith('#') ? e : '#' + e),
  a1 = class {
    constructor(e, t, r, n = !1) {
      ((this.status = e),
        (this.statusText = t || ''),
        (this.internal = n),
        r instanceof Error ? ((this.data = r.toString()), (this.error = r)) : (this.data = r));
    }
  };
function o1(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.internal == 'boolean' &&
    'data' in e
  );
}
function s1(e) {
  return (
    e
      .map((t) => t.route.path)
      .filter(Boolean)
      .join('/')
      .replace(/\/\/*/g, '/') || '/'
  );
}
var cw = typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
function uw(e, t) {
  let r = e;
  if (typeof r != 'string' || !QO.test(r)) return { absoluteURL: void 0, isExternal: !1, to: r };
  let n = r,
    i = !1;
  if (cw)
    try {
      let a = new URL(window.location.href),
        o = r.startsWith('//') ? new URL(a.protocol + r) : new URL(r),
        s = Ur(o.pathname, t);
      o.origin === a.origin && s != null ? (r = s + o.search + o.hash) : (i = !0);
    } catch {
      Jt(
        !1,
        `<Link to="${r}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: n, isExternal: i, to: r };
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
var fw = ['POST', 'PUT', 'PATCH', 'DELETE'];
new Set(fw);
var l1 = ['GET', ...fw];
new Set(l1);
var ji = d.createContext(null);
ji.displayName = 'DataRouter';
var hl = d.createContext(null);
hl.displayName = 'DataRouterState';
var c1 = d.createContext(!1),
  dw = d.createContext({ isTransitioning: !1 });
dw.displayName = 'ViewTransition';
var u1 = d.createContext(new Map());
u1.displayName = 'Fetchers';
var f1 = d.createContext(null);
f1.displayName = 'Await';
var zt = d.createContext(null);
zt.displayName = 'Navigation';
var Ua = d.createContext(null);
Ua.displayName = 'Location';
var Pr = d.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Pr.displayName = 'Route';
var Id = d.createContext(null);
Id.displayName = 'RouteError';
var hw = 'REACT_ROUTER_ERROR',
  d1 = 'REDIRECT',
  h1 = 'ROUTE_ERROR_RESPONSE';
function m1(e) {
  if (e.startsWith(`${hw}:${d1}:{`))
    try {
      let t = JSON.parse(e.slice(28));
      if (
        typeof t == 'object' &&
        t &&
        typeof t.status == 'number' &&
        typeof t.statusText == 'string' &&
        typeof t.location == 'string' &&
        typeof t.reloadDocument == 'boolean' &&
        typeof t.replace == 'boolean'
      )
        return t;
    } catch {}
}
function p1(e) {
  if (e.startsWith(`${hw}:${h1}:{`))
    try {
      let t = JSON.parse(e.slice(40));
      if (typeof t == 'object' && t && typeof t.status == 'number' && typeof t.statusText == 'string')
        return new a1(t.status, t.statusText, t.data);
    } catch {}
}
function v1(e, { relative: t } = {}) {
  Le(Ni(), 'useHref() may be used only in the context of a <Router> component.');
  let { basename: r, navigator: n } = d.useContext(zt),
    { hash: i, pathname: a, search: o } = za(e, { relative: t }),
    s = a;
  return (r !== '/' && (s = a === '/' ? r : br([r, a])), n.createHref({ pathname: s, search: o, hash: i }));
}
function Ni() {
  return d.useContext(Ua) != null;
}
function Ft() {
  return (
    Le(Ni(), 'useLocation() may be used only in the context of a <Router> component.'),
    d.useContext(Ua).location
  );
}
var mw = 'You should call navigate() in a React.useEffect(), not when your component is first rendered.';
function pw(e) {
  d.useContext(zt).static || d.useLayoutEffect(e);
}
function ml() {
  let { isDataRoute: e } = d.useContext(Pr);
  return e ? k1() : g1();
}
function g1() {
  Le(Ni(), 'useNavigate() may be used only in the context of a <Router> component.');
  let e = d.useContext(ji),
    { basename: t, navigator: r } = d.useContext(zt),
    { matches: n } = d.useContext(Pr),
    { pathname: i } = Ft(),
    a = JSON.stringify(Nd(n)),
    o = d.useRef(!1);
  return (
    pw(() => {
      o.current = !0;
    }),
    d.useCallback(
      (l, c = {}) => {
        if ((Jt(o.current, mw), !o.current)) return;
        if (typeof l == 'number') {
          r.go(l);
          return;
        }
        let u = dl(l, JSON.parse(a), i, c.relative === 'path');
        (e == null && t !== '/' && (u.pathname = u.pathname === '/' ? t : br([t, u.pathname])),
          (c.replace ? r.replace : r.push)(u, c.state, c));
      },
      [t, r, a, i, e],
    )
  );
}
d.createContext(null);
function za(e, { relative: t } = {}) {
  let { matches: r } = d.useContext(Pr),
    { pathname: n } = Ft(),
    i = JSON.stringify(Nd(r));
  return d.useMemo(() => dl(e, JSON.parse(i), n, t === 'path'), [e, i, n, t]);
}
function y1(e, t) {
  return vw(e, t);
}
function vw(e, t, r) {
  Le(Ni(), 'useRoutes() may be used only in the context of a <Router> component.');
  let { navigator: n } = d.useContext(zt),
    { matches: i } = d.useContext(Pr),
    a = i[i.length - 1],
    o = a ? a.params : {},
    s = a ? a.pathname : '/',
    l = a ? a.pathnameBase : '/',
    c = a && a.route;
  {
    let g = (c && c.path) || '';
    yw(
      s,
      !c || g.endsWith('*') || g.endsWith('*?'),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${s}" (under <Route path="${g}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${g}"> to <Route path="${g === '/' ? '*' : `${g}/*`}">.`,
    );
  }
  let u = Ft(),
    f;
  if (t) {
    let g = typeof t == 'string' ? Vn(t) : t;
    (Le(
      l === '/' || g.pathname?.startsWith(l),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${l}" but pathname "${g.pathname}" was given in the \`location\` prop.`,
    ),
      (f = g));
  } else f = u;
  let h = f.pathname || '/',
    m = h;
  if (l !== '/') {
    let g = l.replace(/^\//, '').split('/');
    m = '/' + h.replace(/^\//, '').split('/').slice(g.length).join('/');
  }
  let p = ow(e, { pathname: m });
  (Jt(c || p != null, `No routes matched location "${f.pathname}${f.search}${f.hash}" `),
    Jt(
      p == null ||
        p[p.length - 1].route.element !== void 0 ||
        p[p.length - 1].route.Component !== void 0 ||
        p[p.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${f.pathname}${f.search}${f.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let v = A1(
    p &&
      p.map((g) =>
        Object.assign({}, g, {
          params: Object.assign({}, o, g.params),
          pathname: br([
            l,
            n.encodeLocation
              ? n.encodeLocation(g.pathname.replace(/\?/g, '%3F').replace(/#/g, '%23')).pathname
              : g.pathname,
          ]),
          pathnameBase:
            g.pathnameBase === '/'
              ? l
              : br([
                  l,
                  n.encodeLocation
                    ? n.encodeLocation(g.pathnameBase.replace(/\?/g, '%3F').replace(/#/g, '%23')).pathname
                    : g.pathnameBase,
                ]),
        }),
      ),
    i,
    r,
  );
  return t && v
    ? d.createElement(
        Ua.Provider,
        {
          value: {
            location: { pathname: '/', search: '', hash: '', state: null, key: 'default', unstable_mask: void 0, ...f },
            navigationType: 'POP',
          },
        },
        v,
      )
    : v;
}
function b1() {
  let e = E1(),
    t = o1(e) ? `${e.status} ${e.statusText}` : e instanceof Error ? e.message : JSON.stringify(e),
    r = e instanceof Error ? e.stack : null,
    n = 'rgba(200,200,200, 0.5)',
    i = { padding: '0.5rem', backgroundColor: n },
    a = { padding: '2px 4px', backgroundColor: n },
    o = null;
  return (
    console.error('Error handled by React Router default ErrorBoundary:', e),
    (o = d.createElement(
      d.Fragment,
      null,
      d.createElement('p', null, '💿 Hey developer 👋'),
      d.createElement(
        'p',
        null,
        'You can provide a way better UX than this when your app throws errors by providing your own ',
        d.createElement('code', { style: a }, 'ErrorBoundary'),
        ' or',
        ' ',
        d.createElement('code', { style: a }, 'errorElement'),
        ' prop on your route.',
      ),
    )),
    d.createElement(
      d.Fragment,
      null,
      d.createElement('h2', null, 'Unexpected Application Error!'),
      d.createElement('h3', { style: { fontStyle: 'italic' } }, t),
      r ? d.createElement('pre', { style: i }, r) : null,
      o,
    )
  );
}
var w1 = d.createElement(b1, null),
  gw = class extends d.Component {
    constructor(e) {
      (super(e), (this.state = { location: e.location, revalidation: e.revalidation, error: e.error }));
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location || (t.revalidation !== 'idle' && e.revalidation === 'idle')
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error !== void 0 ? e.error : t.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      this.props.onError
        ? this.props.onError(e, t)
        : console.error('React Router caught the following error during render', e);
    }
    render() {
      let e = this.state.error;
      if (this.context && typeof e == 'object' && e && 'digest' in e && typeof e.digest == 'string') {
        const r = p1(e.digest);
        r && (e = r);
      }
      let t =
        e !== void 0
          ? d.createElement(
              Pr.Provider,
              { value: this.props.routeContext },
              d.createElement(Id.Provider, { value: e, children: this.props.component }),
            )
          : this.props.children;
      return this.context ? d.createElement(x1, { error: e }, t) : t;
    }
  };
gw.contextType = c1;
var $c = new WeakMap();
function x1({ children: e, error: t }) {
  let { basename: r } = d.useContext(zt);
  if (typeof t == 'object' && t && 'digest' in t && typeof t.digest == 'string') {
    let n = m1(t.digest);
    if (n) {
      let i = $c.get(t);
      if (i) throw i;
      let a = uw(n.location, r);
      if (cw && !$c.get(t))
        if (a.isExternal || n.reloadDocument) window.location.href = a.absoluteURL || a.to;
        else {
          const o = Promise.resolve().then(() => window.__reactRouterDataRouter.navigate(a.to, { replace: n.replace }));
          throw ($c.set(t, o), o);
        }
      return d.createElement('meta', { httpEquiv: 'refresh', content: `0;url=${a.absoluteURL || a.to}` });
    }
  }
  return e;
}
function S1({ routeContext: e, match: t, children: r }) {
  let n = d.useContext(ji);
  return (
    n &&
      n.static &&
      n.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (n.staticContext._deepestRenderedBoundaryId = t.route.id),
    d.createElement(Pr.Provider, { value: e }, r)
  );
}
function A1(e, t = [], r) {
  let n = r?.state;
  if (e == null) {
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (t.length === 0 && !n.initialized && n.matches.length > 0) e = n.matches;
    else return null;
  }
  let i = e,
    a = n?.errors;
  if (a != null) {
    let u = i.findIndex((f) => f.route.id && a?.[f.route.id] !== void 0);
    (Le(u >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(a).join(',')}`),
      (i = i.slice(0, Math.min(i.length, u + 1))));
  }
  let o = !1,
    s = -1;
  if (r && n) {
    o = n.renderFallback;
    for (let u = 0; u < i.length; u++) {
      let f = i[u];
      if (((f.route.HydrateFallback || f.route.hydrateFallbackElement) && (s = u), f.route.id)) {
        let { loaderData: h, errors: m } = n,
          p = f.route.loader && !h.hasOwnProperty(f.route.id) && (!m || m[f.route.id] === void 0);
        if (f.route.lazy || p) {
          (r.isStatic && (o = !0), s >= 0 ? (i = i.slice(0, s + 1)) : (i = [i[0]]));
          break;
        }
      }
    }
  }
  let l = r?.onError,
    c =
      n && l
        ? (u, f) => {
            l(u, {
              location: n.location,
              params: n.matches?.[0]?.params ?? {},
              unstable_pattern: s1(n.matches),
              errorInfo: f,
            });
          }
        : void 0;
  return i.reduceRight((u, f, h) => {
    let m,
      p = !1,
      v = null,
      g = null;
    n &&
      ((m = a && f.route.id ? a[f.route.id] : void 0),
      (v = f.route.errorElement || w1),
      o &&
        (s < 0 && h === 0
          ? (yw('route-fallback', !1, 'No `HydrateFallback` element provided to render during initial hydration'),
            (p = !0),
            (g = null))
          : s === h && ((p = !0), (g = f.route.hydrateFallbackElement || null))));
    let b = t.concat(i.slice(0, h + 1)),
      S = () => {
        let x;
        return (
          m
            ? (x = v)
            : p
              ? (x = g)
              : f.route.Component
                ? (x = d.createElement(f.route.Component, null))
                : f.route.element
                  ? (x = f.route.element)
                  : (x = u),
          d.createElement(S1, {
            match: f,
            routeContext: { outlet: u, matches: b, isDataRoute: n != null },
            children: x,
          })
        );
      };
    return n && (f.route.ErrorBoundary || f.route.errorElement || h === 0)
      ? d.createElement(gw, {
          location: n.location,
          revalidation: n.revalidation,
          component: v,
          error: m,
          children: S(),
          routeContext: { outlet: null, matches: b, isDataRoute: !0 },
          onError: c,
        })
      : S();
  }, null);
}
function Td(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function P1(e) {
  let t = d.useContext(ji);
  return (Le(t, Td(e)), t);
}
function C1(e) {
  let t = d.useContext(hl);
  return (Le(t, Td(e)), t);
}
function O1(e) {
  let t = d.useContext(Pr);
  return (Le(t, Td(e)), t);
}
function Md(e) {
  let t = O1(e),
    r = t.matches[t.matches.length - 1];
  return (Le(r.route.id, `${e} can only be used on routes that contain a unique "id"`), r.route.id);
}
function _1() {
  return Md('useRouteId');
}
function E1() {
  let e = d.useContext(Id),
    t = C1('useRouteError'),
    r = Md('useRouteError');
  return e !== void 0 ? e : t.errors?.[r];
}
function k1() {
  let { router: e } = P1('useNavigate'),
    t = Md('useNavigate'),
    r = d.useRef(!1);
  return (
    pw(() => {
      r.current = !0;
    }),
    d.useCallback(
      async (i, a = {}) => {
        (Jt(r.current, mw),
          r.current && (typeof i == 'number' ? await e.navigate(i) : await e.navigate(i, { fromRouteId: t, ...a })));
      },
      [e, t],
    )
  );
}
var Dm = {};
function yw(e, t, r) {
  !t && !Dm[e] && ((Dm[e] = !0), Jt(!1, r));
}
d.memo(j1);
function j1({ routes: e, future: t, state: r, isStatic: n, onError: i }) {
  return vw(e, void 0, { state: r, isStatic: n, onError: i });
}
function ea({ to: e, replace: t, state: r, relative: n }) {
  Le(Ni(), '<Navigate> may be used only in the context of a <Router> component.');
  let { static: i } = d.useContext(zt);
  Jt(
    !i,
    '<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.',
  );
  let { matches: a } = d.useContext(Pr),
    { pathname: o } = Ft(),
    s = ml(),
    l = dl(e, Nd(a), o, n === 'path'),
    c = JSON.stringify(l);
  return (
    d.useEffect(() => {
      s(JSON.parse(c), { replace: t, state: r, relative: n });
    }, [s, c, n, t, r]),
    null
  );
}
function kr(e) {
  Le(
    !1,
    'A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.',
  );
}
function N1({
  basename: e = '/',
  children: t = null,
  location: r,
  navigationType: n = 'POP',
  navigator: i,
  static: a = !1,
  unstable_useTransitions: o,
}) {
  Le(!Ni(), 'You cannot render a <Router> inside another <Router>. You should never have more than one in your app.');
  let s = e.replace(/^\/*/, '/'),
    l = d.useMemo(
      () => ({ basename: s, navigator: i, static: a, unstable_useTransitions: o, future: {} }),
      [s, i, a, o],
    );
  typeof r == 'string' && (r = Vn(r));
  let { pathname: c = '/', search: u = '', hash: f = '', state: h = null, key: m = 'default', unstable_mask: p } = r,
    v = d.useMemo(() => {
      let g = Ur(c, s);
      return g == null
        ? null
        : { location: { pathname: g, search: u, hash: f, state: h, key: m, unstable_mask: p }, navigationType: n };
    }, [s, c, u, f, h, m, n, p]);
  return (
    Jt(
      v != null,
      `<Router basename="${s}"> is not able to match the URL "${c}${u}${f}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    v == null
      ? null
      : d.createElement(zt.Provider, { value: l }, d.createElement(Ua.Provider, { children: t, value: v }))
  );
}
function Rm({ children: e, location: t }) {
  return y1(Cf(e), t);
}
function Cf(e, t = []) {
  let r = [];
  return (
    d.Children.forEach(e, (n, i) => {
      if (!d.isValidElement(n)) return;
      let a = [...t, i];
      if (n.type === d.Fragment) {
        r.push.apply(r, Cf(n.props.children, a));
        return;
      }
      (Le(
        n.type === kr,
        `[${typeof n.type == 'string' ? n.type : n.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        Le(!n.props.index || !n.props.children, 'An index route cannot have child routes.'));
      let o = {
        id: n.props.id || a.join('-'),
        caseSensitive: n.props.caseSensitive,
        element: n.props.element,
        Component: n.props.Component,
        index: n.props.index,
        path: n.props.path,
        middleware: n.props.middleware,
        loader: n.props.loader,
        action: n.props.action,
        hydrateFallbackElement: n.props.hydrateFallbackElement,
        HydrateFallback: n.props.HydrateFallback,
        errorElement: n.props.errorElement,
        ErrorBoundary: n.props.ErrorBoundary,
        hasErrorBoundary:
          n.props.hasErrorBoundary === !0 || n.props.ErrorBoundary != null || n.props.errorElement != null,
        shouldRevalidate: n.props.shouldRevalidate,
        handle: n.props.handle,
        lazy: n.props.lazy,
      };
      (n.props.children && (o.children = Cf(n.props.children, a)), r.push(o));
    }),
    r
  );
}
var rs = 'get',
  ns = 'application/x-www-form-urlencoded';
function pl(e) {
  return typeof HTMLElement < 'u' && e instanceof HTMLElement;
}
function I1(e) {
  return pl(e) && e.tagName.toLowerCase() === 'button';
}
function T1(e) {
  return pl(e) && e.tagName.toLowerCase() === 'form';
}
function M1(e) {
  return pl(e) && e.tagName.toLowerCase() === 'input';
}
function D1(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function R1(e, t) {
  return e.button === 0 && (!t || t === '_self') && !D1(e);
}
var ko = null;
function L1() {
  if (ko === null)
    try {
      (new FormData(document.createElement('form'), 0), (ko = !1));
    } catch {
      ko = !0;
    }
  return ko;
}
var $1 = new Set(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']);
function Fc(e) {
  return e != null && !$1.has(e)
    ? (Jt(!1, `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ns}"`), null)
    : e;
}
function F1(e, t) {
  let r, n, i, a, o;
  if (T1(e)) {
    let s = e.getAttribute('action');
    ((n = s ? Ur(s, t) : null),
      (r = e.getAttribute('method') || rs),
      (i = Fc(e.getAttribute('enctype')) || ns),
      (a = new FormData(e)));
  } else if (I1(e) || (M1(e) && (e.type === 'submit' || e.type === 'image'))) {
    let s = e.form;
    if (s == null) throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let l = e.getAttribute('formaction') || s.getAttribute('action');
    if (
      ((n = l ? Ur(l, t) : null),
      (r = e.getAttribute('formmethod') || s.getAttribute('method') || rs),
      (i = Fc(e.getAttribute('formenctype')) || Fc(s.getAttribute('enctype')) || ns),
      (a = new FormData(s, e)),
      !L1())
    ) {
      let { name: c, type: u, value: f } = e;
      if (u === 'image') {
        let h = c ? `${c}.` : '';
        (a.append(`${h}x`, '0'), a.append(`${h}y`, '0'));
      } else c && a.append(c, f);
    }
  } else {
    if (pl(e)) throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    ((r = rs), (n = null), (i = ns), (o = e));
  }
  return (
    a && i === 'text/plain' && ((o = a), (a = void 0)),
    { action: n, method: r.toLowerCase(), encType: i, formData: a, body: o }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function Dd(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t);
}
function B1(e, t, r, n) {
  let i = typeof e == 'string' ? new URL(e, typeof window > 'u' ? 'server://singlefetch/' : window.location.origin) : e;
  return (
    r
      ? i.pathname.endsWith('/')
        ? (i.pathname = `${i.pathname}_.${n}`)
        : (i.pathname = `${i.pathname}.${n}`)
      : i.pathname === '/'
        ? (i.pathname = `_root.${n}`)
        : t && Ur(i.pathname, t) === '/'
          ? (i.pathname = `${t.replace(/\/$/, '')}/_root.${n}`)
          : (i.pathname = `${i.pathname.replace(/\/$/, '')}.${n}`),
    i
  );
}
async function U1(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let r = await import(e.module);
    return ((t[e.id] = r), r);
  } catch (r) {
    return (
      console.error(`Error loading route module \`${e.module}\`, reloading page...`),
      console.error(r),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function z1(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === 'preload' && typeof e.imageSrcSet == 'string' && typeof e.imageSizes == 'string'
      : typeof e.rel == 'string' && typeof e.href == 'string';
}
async function K1(e, t, r) {
  let n = await Promise.all(
    e.map(async (i) => {
      let a = t.routes[i.route.id];
      if (a) {
        let o = await U1(a, r);
        return o.links ? o.links() : [];
      }
      return [];
    }),
  );
  return V1(
    n
      .flat(1)
      .filter(z1)
      .filter((i) => i.rel === 'stylesheet' || i.rel === 'preload')
      .map((i) => (i.rel === 'stylesheet' ? { ...i, rel: 'prefetch', as: 'style' } : { ...i, rel: 'prefetch' })),
  );
}
function Lm(e, t, r, n, i, a) {
  let o = (l, c) => (r[c] ? l.route.id !== r[c].route.id : !0),
    s = (l, c) =>
      r[c].pathname !== l.pathname || (r[c].route.path?.endsWith('*') && r[c].params['*'] !== l.params['*']);
  return a === 'assets'
    ? t.filter((l, c) => o(l, c) || s(l, c))
    : a === 'data'
      ? t.filter((l, c) => {
          let u = n.routes[l.route.id];
          if (!u || !u.hasLoader) return !1;
          if (o(l, c) || s(l, c)) return !0;
          if (l.route.shouldRevalidate) {
            let f = l.route.shouldRevalidate({
              currentUrl: new URL(i.pathname + i.search + i.hash, window.origin),
              currentParams: r[0]?.params || {},
              nextUrl: new URL(e, window.origin),
              nextParams: l.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof f == 'boolean') return f;
          }
          return !0;
        })
      : [];
}
function W1(e, t, { includeHydrateFallback: r } = {}) {
  return H1(
    e
      .map((n) => {
        let i = t.routes[n.route.id];
        if (!i) return [];
        let a = [i.module];
        return (
          i.clientActionModule && (a = a.concat(i.clientActionModule)),
          i.clientLoaderModule && (a = a.concat(i.clientLoaderModule)),
          r && i.hydrateFallbackModule && (a = a.concat(i.hydrateFallbackModule)),
          i.imports && (a = a.concat(i.imports)),
          a
        );
      })
      .flat(1),
  );
}
function H1(e) {
  return [...new Set(e)];
}
function q1(e) {
  let t = {},
    r = Object.keys(e).sort();
  for (let n of r) t[n] = e[n];
  return t;
}
function V1(e, t) {
  let r = new Set();
  return (
    new Set(t),
    e.reduce((n, i) => {
      let a = JSON.stringify(q1(i));
      return (r.has(a) || (r.add(a), n.push({ key: a, link: i })), n);
    }, [])
  );
}
function bw() {
  let e = d.useContext(ji);
  return (Dd(e, 'You must render this element inside a <DataRouterContext.Provider> element'), e);
}
function G1() {
  let e = d.useContext(hl);
  return (Dd(e, 'You must render this element inside a <DataRouterStateContext.Provider> element'), e);
}
var Rd = d.createContext(void 0);
Rd.displayName = 'FrameworkContext';
function ww() {
  let e = d.useContext(Rd);
  return (Dd(e, 'You must render this element inside a <HydratedRouter> element'), e);
}
function Y1(e, t) {
  let r = d.useContext(Rd),
    [n, i] = d.useState(!1),
    [a, o] = d.useState(!1),
    { onFocus: s, onBlur: l, onMouseEnter: c, onMouseLeave: u, onTouchStart: f } = t,
    h = d.useRef(null);
  (d.useEffect(() => {
    if ((e === 'render' && o(!0), e === 'viewport')) {
      let v = (b) => {
          b.forEach((S) => {
            o(S.isIntersecting);
          });
        },
        g = new IntersectionObserver(v, { threshold: 0.5 });
      return (
        h.current && g.observe(h.current),
        () => {
          g.disconnect();
        }
      );
    }
  }, [e]),
    d.useEffect(() => {
      if (n) {
        let v = setTimeout(() => {
          o(!0);
        }, 100);
        return () => {
          clearTimeout(v);
        };
      }
    }, [n]));
  let m = () => {
      i(!0);
    },
    p = () => {
      (i(!1), o(!1));
    };
  return r
    ? e !== 'intent'
      ? [a, h, {}]
      : [
          a,
          h,
          {
            onFocus: ta(s, m),
            onBlur: ta(l, p),
            onMouseEnter: ta(c, m),
            onMouseLeave: ta(u, p),
            onTouchStart: ta(f, m),
          },
        ]
    : [!1, h, {}];
}
function ta(e, t) {
  return (r) => {
    (e && e(r), r.defaultPrevented || t(r));
  };
}
function X1({ page: e, ...t }) {
  let { router: r } = bw(),
    n = d.useMemo(() => ow(r.routes, e, r.basename), [r.routes, e, r.basename]);
  return n ? d.createElement(J1, { page: e, matches: n, ...t }) : null;
}
function Z1(e) {
  let { manifest: t, routeModules: r } = ww(),
    [n, i] = d.useState([]);
  return (
    d.useEffect(() => {
      let a = !1;
      return (
        K1(e, t, r).then((o) => {
          a || i(o);
        }),
        () => {
          a = !0;
        }
      );
    }, [e, t, r]),
    n
  );
}
function J1({ page: e, matches: t, ...r }) {
  let n = Ft(),
    { future: i, manifest: a, routeModules: o } = ww(),
    { basename: s } = bw(),
    { loaderData: l, matches: c } = G1(),
    u = d.useMemo(() => Lm(e, t, c, a, n, 'data'), [e, t, c, a, n]),
    f = d.useMemo(() => Lm(e, t, c, a, n, 'assets'), [e, t, c, a, n]),
    h = d.useMemo(() => {
      if (e === n.pathname + n.search + n.hash) return [];
      let v = new Set(),
        g = !1;
      if (
        (t.forEach((S) => {
          let x = a.routes[S.route.id];
          !x ||
            !x.hasLoader ||
            ((!u.some((A) => A.route.id === S.route.id) && S.route.id in l && o[S.route.id]?.shouldRevalidate) ||
            x.hasClientLoader
              ? (g = !0)
              : v.add(S.route.id));
        }),
        v.size === 0)
      )
        return [];
      let b = B1(e, s, i.unstable_trailingSlashAwareDataRequests, 'data');
      return (
        g &&
          v.size > 0 &&
          b.searchParams.set(
            '_routes',
            t
              .filter((S) => v.has(S.route.id))
              .map((S) => S.route.id)
              .join(','),
          ),
        [b.pathname + b.search]
      );
    }, [s, i.unstable_trailingSlashAwareDataRequests, l, n, a, u, t, e, o]),
    m = d.useMemo(() => W1(f, a), [f, a]),
    p = Z1(f);
  return d.createElement(
    d.Fragment,
    null,
    h.map((v) => d.createElement('link', { key: v, rel: 'prefetch', as: 'fetch', href: v, ...r })),
    m.map((v) => d.createElement('link', { key: v, rel: 'modulepreload', href: v, ...r })),
    p.map(({ key: v, link: g }) =>
      d.createElement('link', { key: v, nonce: r.nonce, ...g, crossOrigin: g.crossOrigin ?? r.crossOrigin }),
    ),
  );
}
function Q1(...e) {
  return (t) => {
    e.forEach((r) => {
      typeof r == 'function' ? r(t) : r != null && (r.current = t);
    });
  };
}
var e_ = typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
try {
  e_ && (window.__reactRouterVersion = '7.13.1');
} catch {}
function t_({ basename: e, children: t, unstable_useTransitions: r, window: n }) {
  let i = d.useRef();
  i.current == null && (i.current = RO({ window: n, v5Compat: !0 }));
  let a = i.current,
    [o, s] = d.useState({ action: a.action, location: a.location }),
    l = d.useCallback(
      (c) => {
        r === !1 ? s(c) : d.startTransition(() => s(c));
      },
      [r],
    );
  return (
    d.useLayoutEffect(() => a.listen(l), [a, l]),
    d.createElement(N1, {
      basename: e,
      children: t,
      location: o.location,
      navigationType: o.action,
      navigator: a,
      unstable_useTransitions: r,
    })
  );
}
var xw = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Ld = d.forwardRef(function (
    {
      onClick: t,
      discover: r = 'render',
      prefetch: n = 'none',
      relative: i,
      reloadDocument: a,
      replace: o,
      unstable_mask: s,
      state: l,
      target: c,
      to: u,
      preventScrollReset: f,
      viewTransition: h,
      unstable_defaultShouldRevalidate: m,
      ...p
    },
    v,
  ) {
    let { basename: g, navigator: b, unstable_useTransitions: S } = d.useContext(zt),
      x = typeof u == 'string' && xw.test(u),
      A = uw(u, g);
    u = A.to;
    let C = v1(u, { relative: i }),
      P = Ft(),
      _ = null;
    if (s) {
      let Y = dl(s, [], P.unstable_mask ? P.unstable_mask.pathname : '/', !0);
      (g !== '/' && (Y.pathname = Y.pathname === '/' ? g : br([g, Y.pathname])), (_ = b.createHref(Y)));
    }
    let [E, j, N] = Y1(n, p),
      M = a_(u, {
        replace: o,
        unstable_mask: s,
        state: l,
        target: c,
        preventScrollReset: f,
        relative: i,
        viewTransition: h,
        unstable_defaultShouldRevalidate: m,
        unstable_useTransitions: S,
      });
    function O(Y) {
      (t && t(Y), Y.defaultPrevented || M(Y));
    }
    let D = !(A.isExternal || a),
      B = d.createElement('a', {
        ...p,
        ...N,
        href: (D ? _ : void 0) || A.absoluteURL || C,
        onClick: D ? O : t,
        ref: Q1(v, j),
        target: c,
        'data-discover': !x && r === 'render' ? 'true' : void 0,
      });
    return E && !x ? d.createElement(d.Fragment, null, B, d.createElement(X1, { page: C })) : B;
  });
Ld.displayName = 'Link';
var r_ = d.forwardRef(function (
  {
    'aria-current': t = 'page',
    caseSensitive: r = !1,
    className: n = '',
    end: i = !1,
    style: a,
    to: o,
    viewTransition: s,
    children: l,
    ...c
  },
  u,
) {
  let f = za(o, { relative: c.relative }),
    h = Ft(),
    m = d.useContext(hl),
    { navigator: p, basename: v } = d.useContext(zt),
    g = m != null && u_(f) && s === !0,
    b = p.encodeLocation ? p.encodeLocation(f).pathname : f.pathname,
    S = h.pathname,
    x = m && m.navigation && m.navigation.location ? m.navigation.location.pathname : null;
  (r || ((S = S.toLowerCase()), (x = x ? x.toLowerCase() : null), (b = b.toLowerCase())),
    x && v && (x = Ur(x, v) || x));
  const A = b !== '/' && b.endsWith('/') ? b.length - 1 : b.length;
  let C = S === b || (!i && S.startsWith(b) && S.charAt(A) === '/'),
    P = x != null && (x === b || (!i && x.startsWith(b) && x.charAt(b.length) === '/')),
    _ = { isActive: C, isPending: P, isTransitioning: g },
    E = C ? t : void 0,
    j;
  typeof n == 'function'
    ? (j = n(_))
    : (j = [n, C ? 'active' : null, P ? 'pending' : null, g ? 'transitioning' : null].filter(Boolean).join(' '));
  let N = typeof a == 'function' ? a(_) : a;
  return d.createElement(
    Ld,
    { ...c, 'aria-current': E, className: j, ref: u, style: N, to: o, viewTransition: s },
    typeof l == 'function' ? l(_) : l,
  );
});
r_.displayName = 'NavLink';
var n_ = d.forwardRef(
  (
    {
      discover: e = 'render',
      fetcherKey: t,
      navigate: r,
      reloadDocument: n,
      replace: i,
      state: a,
      method: o = rs,
      action: s,
      onSubmit: l,
      relative: c,
      preventScrollReset: u,
      viewTransition: f,
      unstable_defaultShouldRevalidate: h,
      ...m
    },
    p,
  ) => {
    let { unstable_useTransitions: v } = d.useContext(zt),
      g = l_(),
      b = c_(s, { relative: c }),
      S = o.toLowerCase() === 'get' ? 'get' : 'post',
      x = typeof s == 'string' && xw.test(s),
      A = (C) => {
        if ((l && l(C), C.defaultPrevented)) return;
        C.preventDefault();
        let P = C.nativeEvent.submitter,
          _ = P?.getAttribute('formmethod') || o,
          E = () =>
            g(P || C.currentTarget, {
              fetcherKey: t,
              method: _,
              navigate: r,
              replace: i,
              state: a,
              relative: c,
              preventScrollReset: u,
              viewTransition: f,
              unstable_defaultShouldRevalidate: h,
            });
        v && r !== !1 ? d.startTransition(() => E()) : E();
      };
    return d.createElement('form', {
      ref: p,
      method: S,
      action: b,
      onSubmit: n ? l : A,
      ...m,
      'data-discover': !x && e === 'render' ? 'true' : void 0,
    });
  },
);
n_.displayName = 'Form';
function i_(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Sw(e) {
  let t = d.useContext(ji);
  return (Le(t, i_(e)), t);
}
function a_(
  e,
  {
    target: t,
    replace: r,
    unstable_mask: n,
    state: i,
    preventScrollReset: a,
    relative: o,
    viewTransition: s,
    unstable_defaultShouldRevalidate: l,
    unstable_useTransitions: c,
  } = {},
) {
  let u = ml(),
    f = Ft(),
    h = za(e, { relative: o });
  return d.useCallback(
    (m) => {
      if (R1(m, t)) {
        m.preventDefault();
        let p = r !== void 0 ? r : Aa(f) === Aa(h),
          v = () =>
            u(e, {
              replace: p,
              unstable_mask: n,
              state: i,
              preventScrollReset: a,
              relative: o,
              viewTransition: s,
              unstable_defaultShouldRevalidate: l,
            });
        c ? d.startTransition(() => v()) : v();
      }
    },
    [f, u, h, r, n, i, t, e, a, o, s, l, c],
  );
}
var o_ = 0,
  s_ = () => `__${String(++o_)}__`;
function l_() {
  let { router: e } = Sw('useSubmit'),
    { basename: t } = d.useContext(zt),
    r = _1(),
    n = e.fetch,
    i = e.navigate;
  return d.useCallback(
    async (a, o = {}) => {
      let { action: s, method: l, encType: c, formData: u, body: f } = F1(a, t);
      if (o.navigate === !1) {
        let h = o.fetcherKey || s_();
        await n(h, r, o.action || s, {
          unstable_defaultShouldRevalidate: o.unstable_defaultShouldRevalidate,
          preventScrollReset: o.preventScrollReset,
          formData: u,
          body: f,
          formMethod: o.method || l,
          formEncType: o.encType || c,
          flushSync: o.flushSync,
        });
      } else
        await i(o.action || s, {
          unstable_defaultShouldRevalidate: o.unstable_defaultShouldRevalidate,
          preventScrollReset: o.preventScrollReset,
          formData: u,
          body: f,
          formMethod: o.method || l,
          formEncType: o.encType || c,
          replace: o.replace,
          state: o.state,
          fromRouteId: r,
          flushSync: o.flushSync,
          viewTransition: o.viewTransition,
        });
    },
    [n, i, t, r],
  );
}
function c_(e, { relative: t } = {}) {
  let { basename: r } = d.useContext(zt),
    n = d.useContext(Pr);
  Le(n, 'useFormAction must be used inside a RouteContext');
  let [i] = n.matches.slice(-1),
    a = { ...za(e || '.', { relative: t }) },
    o = Ft();
  if (e == null) {
    a.search = o.search;
    let s = new URLSearchParams(a.search),
      l = s.getAll('index');
    if (l.some((u) => u === '')) {
      (s.delete('index'), l.filter((f) => f).forEach((f) => s.append('index', f)));
      let u = s.toString();
      a.search = u ? `?${u}` : '';
    }
  }
  return (
    (!e || e === '.') && i.route.index && (a.search = a.search ? a.search.replace(/^\?/, '?index&') : '?index'),
    r !== '/' && (a.pathname = a.pathname === '/' ? r : br([r, a.pathname])),
    Aa(a)
  );
}
function u_(e, { relative: t } = {}) {
  let r = d.useContext(dw);
  Le(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: n } = Sw('useViewTransitionState'),
    i = za(e, { relative: t });
  if (!r.isTransitioning) return !1;
  let a = Ur(r.currentLocation.pathname, n) || r.currentLocation.pathname,
    o = Ur(r.nextLocation.pathname, n) || r.nextLocation.pathname;
  return ds(i.pathname, o) != null || ds(i.pathname, a) != null;
}
const f_ = [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]],
  d_ = XC('chevron-right', f_),
  hs = [
    {
      titleKey: 'settingsGroupFeatures',
      sections: [{ key: 'general' }, { key: 'articles' }, { key: 'ai_chats' }, { key: 'videos' }, { key: 'chat_with' }],
    },
    {
      titleKey: 'settingsGroupData',
      sections: [{ key: 'backup' }, { key: 'notion' }, { key: 'feishu' }, { key: 'obsidian' }],
    },
    { titleKey: 'settingsGroupAbout', sections: [{ key: 'aboutyou' }, { key: 'aboutme' }] },
  ],
  Aw = hs.flatMap((e) => e.sections),
  h_ = Aw[0]?.key ?? 'backup',
  Pw = 'webclipper_settings_active_section';
function m_(e) {
  return Aw.some((t) => t.key === e);
}
function Cw(e) {
  const t = String(e || '')
    .trim()
    .toLowerCase();
  return t ? (m_(t) ? t : t === 'insight' ? 'aboutyou' : t === 'about' ? 'aboutme' : null) : null;
}
function p_() {
  try {
    const e = String(globalThis.localStorage?.getItem(Pw) || '')
        .trim()
        .toLowerCase(),
      t = Cw(e);
    if (t) return t;
  } catch {}
  return h_;
}
function v_(e) {
  try {
    globalThis.localStorage?.setItem(Pw, e);
  } catch {}
}
const g_ = 1,
  Ow = 2,
  Of = 'last_backup_export_at',
  y_ = 1,
  b_ = 1,
  w_ = new Set([
    'notion_oauth_token_v1',
    'feishu_oauth_token_v1',
    'notion_oauth_client_secret',
    'feishu_oauth_client_secret',
    'obsidian_api_key',
  ]);
function x_(e) {
  const t = String(e || '').trim();
  return !(!t || w_.has(t) || t.startsWith('notion_oauth_token') || t.startsWith('feishu_oauth_token'));
}
function De(e) {
  return typeof e == 'string' && e.trim().length > 0;
}
function S_(e) {
  return Number.isFinite(e) && Number(e) > 0 && Math.floor(Number(e)) === Number(e);
}
function Dr(e) {
  const t = e && e.source ? String(e.source) : '',
    r = e && e.conversationKey ? String(e.conversationKey) : '';
  return !t || !r ? '' : `${t}||${r}`;
}
function ht(e, t) {
  const r = e == null ? '' : String(e);
  if (De(r)) return r.trim();
  const n = t == null ? '' : String(t);
  return De(n) ? n.trim() : '';
}
function Bc(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function A_(e, t) {
  const r = Array.isArray(e) ? e : [],
    n = Array.isArray(t) ? t : [],
    i = new Set();
  for (const a of r) De(a) && i.add(String(a).trim());
  for (const a of n) De(a) && i.add(String(a).trim());
  return Array.from(i);
}
function _w(e, t) {
  const r = e && typeof e == 'object' ? e : {},
    n = t && typeof t == 'object' ? t : {},
    i = { ...r };
  ((i.sourceType = ht(r.sourceType, n.sourceType) || 'chat'),
    (i.source = ht(r.source, n.source)),
    (i.conversationKey = ht(r.conversationKey, n.conversationKey)),
    (i.title = ht(r.title, n.title)),
    (i.url = ht(r.url, n.url)),
    (i.author = ht(r.author, n.author)),
    (i.publishedAt = ht(r.publishedAt, n.publishedAt)),
    (i.warningFlags = A_(r.warningFlags, n.warningFlags)),
    (i.notionPageId = ht(r.notionPageId, n.notionPageId)));
  const a = Number(r.lastCapturedAt) || 0,
    o = Number(n.lastCapturedAt) || 0;
  return ((i.lastCapturedAt = Math.max(a, o, 0)), i);
}
function P_(e, t) {
  const r = e && typeof e == 'object' ? e : {},
    n = t && typeof t == 'object' ? t : {},
    i = Number(r.updatedAt) || 0,
    a = Number(n.updatedAt) || 0;
  if (a && a > i) return !0;
  const o = r.contentMarkdown && String(r.contentMarkdown).trim() ? String(r.contentMarkdown) : '',
    s = n.contentMarkdown && String(n.contentMarkdown).trim() ? String(n.contentMarkdown) : '';
  return !!(!o && s);
}
function Ew(e, t) {
  const r = e && typeof e == 'object' ? e : {},
    n = t && typeof t == 'object' ? t : {},
    a = P_(r, n) ? { ...r, ...n } : { ...n, ...r },
    o = { ...a };
  ((o.role = ht(a.role, 'assistant') || 'assistant'),
    (o.contentText = String(o.contentText || '')),
    (o.contentMarkdown = String(o.contentMarkdown || '')));
  const s = Number(r.updatedAt) || 0,
    l = Number(n.updatedAt) || 0,
    c = Math.max(s, l, 0);
  o.updatedAt = c || Date.now();
  const u = Number(r.sequence),
    f = Number(n.sequence);
  return (Number.isFinite(f) ? (o.sequence = f) : Number.isFinite(u) ? (o.sequence = u) : (o.sequence = 0), o);
}
function kw(e, t) {
  const r = e && typeof e == 'object' ? e : {},
    n = t && typeof t == 'object' ? t : {},
    i = { ...r };
  ((i.source = ht(r.source, n.source)),
    (i.conversationKey = ht(r.conversationKey, n.conversationKey)),
    (i.notionPageId = ht(r.notionPageId, n.notionPageId)),
    (i.feishuDocId = ht(r.feishuDocId, n.feishuDocId)),
    (i.lastSyncedMessageKey = ht(r.lastSyncedMessageKey, n.lastSyncedMessageKey)));
  const a = Number(r.lastSyncedSequence),
    o = Number(n.lastSyncedSequence);
  Number.isFinite(a) ? (i.lastSyncedSequence = a) : Number.isFinite(o) && (i.lastSyncedSequence = o);
  const s = ht(i.lastSyncedMessageKey, ''),
    l = Bc(i.lastSyncedSequence),
    c = ht(r.lastSyncedMessageKey, ''),
    u = ht(n.lastSyncedMessageKey, ''),
    f = s ? c === s : l != null && Number.isFinite(a) && a === l,
    h = s ? u === s : l != null && Number.isFinite(o) && o === l,
    m = Number(r.lastSyncedAt),
    p = Number(n.lastSyncedAt);
  Number.isFinite(m) ? (i.lastSyncedAt = m) : Number.isFinite(p) && (i.lastSyncedAt = p);
  const v = Bc(r.lastSyncedMessageUpdatedAt),
    g = Bc(n.lastSyncedMessageUpdatedAt);
  f && v != null ? (i.lastSyncedMessageUpdatedAt = v) : h && g != null && (i.lastSyncedMessageUpdatedAt = g);
  const b = Number(r.updatedAt) || 0,
    S = Number(n.updatedAt) || 0;
  return ((i.updatedAt = Math.max(b, S, 0)), i);
}
function $d(e) {
  const t = e && typeof e == 'object' ? e : {},
    r = {};
  for (const [n, i] of Object.entries(t)) x_(n) && (r[n] = i);
  return r;
}
function C_(e) {
  const t = e;
  if (!t || typeof t != 'object') return { ok: !1, error: 'Backup is not an object' };
  if (Number(t.schemaVersion) !== g_) return { ok: !1, error: 'Unsupported backup schemaVersion' };
  if (!t.stores || typeof t.stores != 'object') return { ok: !1, error: 'Missing stores' };
  const r = t.stores;
  for (const a of ['conversations', 'messages', 'sync_mappings'])
    if (!Array.isArray(r[a])) return { ok: !1, error: `Invalid store: ${a}` };
  const n = t.storageLocal;
  if (n != null && typeof n != 'object') return { ok: !1, error: 'Invalid storageLocal' };
  const i = new Set();
  for (const a of r.conversations) {
    const o = Dr(a);
    if (o) {
      if (i.has(o)) return { ok: !1, error: 'Duplicate conversation key in backup' };
      i.add(o);
    }
  }
  for (const a of r.messages) {
    if (!a || !De(a.messageKey)) return { ok: !1, error: 'Backup contains messages without messageKey' };
    if (!S_(Number(a.conversationId)))
      return { ok: !1, error: 'Backup contains messages without valid conversationId' };
  }
  return { ok: !0, error: '' };
}
function fi(e) {
  const t = String(e || '').trim();
  return !(
    !t ||
    t.includes('\0') ||
    t.startsWith('/') ||
    t.startsWith('\\') ||
    t.includes('\\') ||
    /(^|\/)\.\.(\/|$)/.test(t)
  );
}
function O_(e) {
  const t = e;
  if (!t || typeof t != 'object') return { ok: !1, error: 'Image cache index is not an object' };
  if (Number(t.schemaVersion) !== y_) return { ok: !1, error: 'Unsupported image cache schemaVersion' };
  const r = Array.isArray(t.assets) ? t.assets : null;
  if (!r) return { ok: !1, error: 'Missing image cache assets' };
  for (const n of r) {
    if (!n || typeof n != 'object') return { ok: !1, error: 'Invalid image cache asset item' };
    const i = Number(n.assetId);
    if (!Number.isFinite(i) || i <= 0) return { ok: !1, error: 'Invalid image cache assetId' };
    const a = String(n.uniqueKey || '').trim();
    if (!De(a) || !a.includes('||')) return { ok: !1, error: 'Invalid image cache uniqueKey' };
    const o = String(n.url || '').trim();
    if (!De(o)) return { ok: !1, error: 'Invalid image cache url' };
    const s = String(n.contentType || '')
      .trim()
      .toLowerCase();
    if (!De(s) || !s.startsWith('image/')) return { ok: !1, error: 'Invalid image cache contentType' };
    const l = Number(n.byteSize);
    if (!Number.isFinite(l) || l <= 0) return { ok: !1, error: 'Invalid image cache byteSize' };
    const c = String(n.blobPath || '').trim();
    if (!De(c) || !fi(c)) return { ok: !1, error: 'Invalid image cache blobPath' };
    if (!c.startsWith('assets/image-cache/blobs/')) return { ok: !1, error: 'Invalid image cache blobPath prefix' };
  }
  return { ok: !0, error: '' };
}
function __(e) {
  const t = e;
  if (!t || typeof t != 'object') return { ok: !1, error: 'Article comments index is not an object' };
  if (Number(t.schemaVersion) !== b_) return { ok: !1, error: 'Unsupported article comments schemaVersion' };
  const r = Array.isArray(t.comments) ? t.comments : null;
  if (!r) return { ok: !1, error: 'Missing article comments list' };
  for (const n of r) {
    if (!n || typeof n != 'object') return { ok: !1, error: 'Invalid article comment item' };
    const i = Number(n.commentId);
    if (!Number.isFinite(i) || i <= 0) return { ok: !1, error: 'Invalid article commentId' };
    const a = n.parentCommentId == null ? null : Number(n.parentCommentId);
    if (a != null && (!Number.isFinite(a) || a <= 0)) return { ok: !1, error: 'Invalid article parentCommentId' };
    const o = n.uniqueKey == null ? '' : String(n.uniqueKey || '').trim();
    if (o && (!De(o) || !o.includes('||'))) return { ok: !1, error: 'Invalid article comment uniqueKey' };
    const s = String(n.canonicalUrl || '').trim();
    if (!De(s)) return { ok: !1, error: 'Invalid article comment canonicalUrl' };
    const l = String(n.commentText || '').trim();
    if (!De(l)) return { ok: !1, error: 'Invalid article comment commentText' };
    const c = Number(n.createdAt),
      u = Number(n.updatedAt);
    if (!Number.isFinite(c) || c < 0) return { ok: !1, error: 'Invalid article comment createdAt' };
    if (!Number.isFinite(u) || u < 0) return { ok: !1, error: 'Invalid article comment updatedAt' };
  }
  return { ok: !0, error: '' };
}
function E_(e) {
  const t = e;
  if (!t || typeof t != 'object') return { ok: !1, error: 'Manifest is not an object' };
  if (Number(t.backupSchemaVersion) !== Ow) return { ok: !1, error: 'Unsupported backupSchemaVersion' };
  if (!De(t.exportedAt)) return { ok: !1, error: 'Missing exportedAt' };
  if (!t.db || typeof t.db != 'object') return { ok: !1, error: 'Missing db' };
  if (!De(t.db.name)) return { ok: !1, error: 'Missing db.name' };
  if (!Number.isFinite(Number(t.db.version))) return { ok: !1, error: 'Missing db.version' };
  if (!t.counts || typeof t.counts != 'object') return { ok: !1, error: 'Missing counts' };
  for (const s of ['conversations', 'messages', 'sync_mappings'])
    if (!Number.isFinite(Number(t.counts[s])) || Number(t.counts[s]) < 0)
      return { ok: !1, error: `Invalid counts.${s}` };
  if (
    t.counts.image_cache != null &&
    (!Number.isFinite(Number(t.counts.image_cache)) || Number(t.counts.image_cache) < 0)
  )
    return { ok: !1, error: 'Invalid counts.image_cache' };
  if (
    t.counts.article_comments != null &&
    (!Number.isFinite(Number(t.counts.article_comments)) || Number(t.counts.article_comments) < 0)
  )
    return { ok: !1, error: 'Invalid counts.article_comments' };
  const r = t.config;
  if (!r || typeof r != 'object') return { ok: !1, error: 'Missing config' };
  const n = r.storageLocalPath;
  if (!De(n) || !fi(n)) return { ok: !1, error: 'Invalid config.storageLocalPath' };
  if (!String(n).endsWith('.json')) return { ok: !1, error: 'Invalid config.storageLocalPath extension' };
  const i = t.index;
  if (!i || typeof i != 'object') return { ok: !1, error: 'Missing index' };
  const a = i.conversationsCsvPath;
  if (!De(a) || !fi(a)) return { ok: !1, error: 'Invalid index.conversationsCsvPath' };
  if (!String(a).endsWith('.csv')) return { ok: !1, error: 'Invalid index.conversationsCsvPath extension' };
  if (!Array.isArray(t.sources)) return { ok: !1, error: 'Missing sources' };
  const o = new Set();
  for (const s of t.sources) {
    if (!s || typeof s != 'object') return { ok: !1, error: 'Invalid sources item' };
    if (!De(s.source)) return { ok: !1, error: 'Invalid sources[].source' };
    const l = Array.isArray(s.files) ? s.files : null;
    if (!l) return { ok: !1, error: 'Invalid sources[].files' };
    const c = Number(s.conversationCount);
    if (!Number.isFinite(c) || c < 0) return { ok: !1, error: 'Invalid sources[].conversationCount' };
    if (c !== l.length) return { ok: !1, error: 'sources[].conversationCount mismatch' };
    for (const u of l) {
      const f = String(u || '').trim();
      if (!f || !fi(f)) return { ok: !1, error: 'Invalid sources file path' };
      if (!f.startsWith('sources/')) return { ok: !1, error: 'Invalid sources file prefix' };
      if (!f.endsWith('.json')) return { ok: !1, error: 'Invalid sources file extension' };
      if (o.has(f)) return { ok: !1, error: 'Duplicate sources file path' };
      o.add(f);
    }
  }
  if (t.assets != null) {
    if (!t.assets || typeof t.assets != 'object') return { ok: !1, error: 'Invalid assets' };
    const s = t.assets.imageCacheIndexPath;
    if (s != null) {
      if (!De(s) || !fi(s)) return { ok: !1, error: 'Invalid assets.imageCacheIndexPath' };
      if (!String(s).endsWith('.json')) return { ok: !1, error: 'Invalid assets.imageCacheIndexPath extension' };
    }
    const l = t.assets.articleCommentsIndexPath;
    if (l != null) {
      if (!De(l) || !fi(l)) return { ok: !1, error: 'Invalid assets.articleCommentsIndexPath' };
      if (!String(l).endsWith('.json')) return { ok: !1, error: 'Invalid assets.articleCommentsIndexPath extension' };
    }
  }
  return { ok: !0, error: '' };
}
function $m(e) {
  const t = e;
  if (!t || typeof t != 'object') return { ok: !1, error: 'Bundle is not an object' };
  if (Number(t.schemaVersion) !== 1) return { ok: !1, error: 'Unsupported bundle schemaVersion' };
  if (!t.conversation || typeof t.conversation != 'object') return { ok: !1, error: 'Missing conversation' };
  const r = t.conversation,
    n = r.source ? String(r.source) : '',
    i = r.conversationKey ? String(r.conversationKey) : '';
  if (!De(n) || !De(i)) return { ok: !1, error: 'Missing conversation.source or conversation.conversationKey' };
  const a = Array.isArray(t.messages) ? t.messages : null;
  if (!a) return { ok: !1, error: 'Missing messages' };
  for (const o of a) {
    if (!o || typeof o != 'object') return { ok: !1, error: 'Invalid message item' };
    if (!De(o.messageKey)) return { ok: !1, error: 'Message missing messageKey' };
  }
  if (t.syncMapping != null) {
    if (!t.syncMapping || typeof t.syncMapping != 'object') return { ok: !1, error: 'Invalid syncMapping' };
    const o = t.syncMapping.source ? String(t.syncMapping.source) : '',
      s = t.syncMapping.conversationKey ? String(t.syncMapping.conversationKey) : '';
    if (!De(o) || !De(s)) return { ok: !1, error: 'syncMapping missing source or conversationKey' };
    if (o !== n || s !== i) return { ok: !1, error: 'syncMapping does not match conversation' };
  }
  return { ok: !0, error: '' };
}
function k_(e) {
  const t = e;
  return !t || typeof t != 'object'
    ? { ok: !1, error: 'Storage backup is not an object' }
    : Number(t.schemaVersion) !== 1
      ? { ok: !1, error: 'Unsupported storage schemaVersion' }
      : t.storageLocal != null && typeof t.storageLocal != 'object'
        ? { ok: !1, error: 'Invalid storageLocal' }
        : { ok: !0, error: '' };
}
let Uc = null,
  ra = null;
async function Fd() {
  return (
    Uc ||
    ra ||
    ((ra = Qb()
      .then((e) => ((Uc = e), e))
      .finally(() => {
        ra = null;
      })),
    ra)
  );
}
function ve(e) {
  return new Promise((t, r) => {
    ((e.onsuccess = () => t(e.result)), (e.onerror = () => r(e.error || new Error('indexedDB request failed'))));
  });
}
function Nr(e) {
  return new Promise((t, r) => {
    ((e.oncomplete = () => t(!0)),
      (e.onerror = () => r(e.error || new Error('transaction failed'))),
      (e.onabort = () => r(e.error || new Error('transaction aborted'))));
  });
}
function Ir(e, t, r) {
  const n = e.transaction(t, r),
    i = {};
  for (const a of t) i[a] = n.objectStore(a);
  return { t: n, stores: i };
}
const Fm = 'assets/image-cache/index.json',
  j_ = 'assets/image-cache/blobs/',
  Bm = 'assets/article-comments/index.json';
function Um(e, t) {
  const r = String(e || '').trim();
  if (!r) return t;
  const n = r
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  return !n || n === '.' || n === '..' ? t : n;
}
function mr(e) {
  const t = e == null ? '' : String(e);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function N_(e) {
  const t = e && typeof e == 'object' ? { ...e } : {};
  return (delete t.id, t);
}
function I_(e) {
  const t = e && typeof e == 'object' ? { ...e } : {};
  return (delete t.id, delete t.conversationId, t);
}
function T_(e) {
  const t = e && typeof e == 'object' ? { ...e } : {};
  return (delete t.id, t);
}
function M_(e, t) {
  const r = Number(e && e.sequence),
    n = Number(t && t.sequence);
  if (Number.isFinite(r) && Number.isFinite(n) && r !== n) return r - n;
  const i = Number(e && e.updatedAt) || 0,
    a = Number(t && t.updatedAt) || 0;
  if (i !== a) return i - a;
  const o = e && e.messageKey ? String(e.messageKey) : '',
    s = t && t.messageKey ? String(t.messageKey) : '';
  return o.localeCompare(s);
}
function jw(e) {
  const t = String(e || '').trim();
  return t ? t.split(';')[0].trim().toLowerCase() : '';
}
function D_(e) {
  const t = String(e || '').trim();
  return t ? /^data:image\/[a-z0-9.+-]+(?:;charset=[a-z0-9._-]+)?(?:;base64)?,/i.test(t) : !1;
}
function R_(e) {
  const t = String(e || '').replace(/\s+/g, '');
  if (!t) return new Uint8Array();
  const r = globalThis.atob;
  if (typeof r == 'function') {
    const i = r(t),
      a = new Uint8Array(i.length);
    for (let o = 0; o < i.length; o += 1) a[o] = i.charCodeAt(o);
    return a;
  }
  const n = globalThis.Buffer;
  if (n && typeof n.from == 'function') {
    const i = n.from(t, 'base64');
    return new Uint8Array(i);
  }
  throw new Error('base64 decoder unavailable');
}
function L_(e) {
  const t = globalThis.TextEncoder;
  if (t) return new t().encode(String(e || ''));
  const r = globalThis.Buffer;
  if (r && typeof r.from == 'function') {
    const a = r.from(String(e || ''), 'utf8');
    return new Uint8Array(a);
  }
  const n = String(e || ''),
    i = new Uint8Array(n.length);
  for (let a = 0; a < n.length; a += 1) i[a] = n.charCodeAt(a) & 255;
  return i;
}
function $_(e) {
  const t = String(e || '').trim();
  if (!D_(t)) return null;
  const r = t.indexOf(',');
  if (r <= 0) return null;
  const n = t.slice(5, r).trim(),
    i = t.slice(r + 1),
    a = n
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean),
    o = jw(a[0] || '');
  if (!o.startsWith('image/')) return null;
  const s = a.some((c) => c.toLowerCase() === 'base64');
  let l;
  try {
    l = s ? R_(i) : L_(decodeURIComponent(i));
  } catch {
    return null;
  }
  return (l.byteLength || 0) <= 0 ? null : new Blob([Uint8Array.from(l)], { type: o });
}
function F_(e) {
  const t = String(e || '')
    .trim()
    .toLowerCase();
  return t.startsWith('image/')
    ? t === 'image/jpeg' || t === 'image/jpg'
      ? 'jpg'
      : t === 'image/png'
        ? 'png'
        : t === 'image/webp'
          ? 'webp'
          : t === 'image/gif'
            ? 'gif'
            : t === 'image/svg+xml'
              ? 'svg'
              : t.slice(6).replace(/[^a-z0-9.+-]/g, '') || 'bin'
    : 'bin';
}
async function B_() {
  const e = await Fd(),
    { t, stores: r } = Ir(
      e,
      ['conversations', 'messages', 'sync_mappings', 'image_cache', 'article_comments'],
      'readonly',
    ),
    n = await ve(r.conversations.getAll()),
    i = await ve(r.messages.getAll()),
    a = await ve(r.sync_mappings.getAll()),
    o = await ve(r.image_cache.getAll()),
    s = await ve(r.article_comments.getAll());
  await Nr(t);
  const l = await ZC(),
    c = $d(l),
    u = Date.now(),
    f = new Date(u).toISOString(),
    h = Array.isArray(n) ? n : [],
    m = Array.isArray(i) ? i : [],
    p = Array.isArray(a) ? a : [],
    v = Array.isArray(o) ? o : [],
    g = Array.isArray(s) ? s : [],
    b = new Map();
  for (const T of m) {
    const F = Number(T && T.conversationId);
    if (!Number.isFinite(F) || F <= 0) continue;
    const W = b.get(F) || [];
    (W.push(T), b.set(F, W));
  }
  const S = new Map();
  for (const T of p) {
    if (!T || typeof T != 'object') continue;
    const F = Dr(T);
    if (!F) continue;
    const W = S.get(F) || null;
    if (!W) {
      S.set(F, T);
      continue;
    }
    const z = Number(W.updatedAt) || 0;
    (Number(T.updatedAt) || 0) > z && S.set(F, T);
  }
  const x = new Map();
  for (const T of h) {
    if (!T || typeof T != 'object') continue;
    const F = T.source ? String(T.source) : '';
    if (!F) continue;
    const W = x.get(F) || [];
    (W.push(T), x.set(F, W));
  }
  const A = [],
    C = [],
    _ = [
      [
        'source',
        'conversationKey',
        'title',
        'url',
        'lastCapturedAt',
        'messageCount',
        'notionPageId',
        'hasNotionPageId',
        'filePath',
      ]
        .map(mr)
        .join(','),
    ],
    E = new Map(),
    j = new Map();
  for (const T of h) {
    const F = Number(T && T.id);
    if (!Number.isFinite(F) || F <= 0) continue;
    const W = Dr(T);
    W && j.set(F, W);
  }
  for (const [T, F] of x.entries()) {
    const W = Um(T.toLowerCase(), 'unknown'),
      z = E.get(W) || new Set();
    E.set(W, z);
    const H = [];
    for (const G of F) {
      const le = G && G.conversationKey ? String(G.conversationKey) : '';
      if (!le) continue;
      const fe = JC(G),
        te = Um(fe, 'conversation').slice(0, 140);
      let ne = te,
        $ = 2,
        U = `sources/${W}/${ne}.json`;
      for (; z.has(U); ) ((ne = `${te}-${$}`), (U = `sources/${W}/${ne}.json`), ($ += 1));
      z.add(U);
      const ie = Number(G && G.id),
        pe = (Number.isFinite(ie) && ie > 0 ? b.get(ie) || [] : []).slice().sort(M_).map(I_),
        ce = Dr(G),
        be = (ce && S.get(ce)) || null,
        de = N_(G),
        K = be ? T_(be) : null,
        ae = { schemaVersion: 1, conversation: de, messages: pe, syncMapping: K };
      (A.push({ name: U, data: JSON.stringify(ae, null, 2), lastModified: f }), H.push(U));
      const we = K && K.notionPageId ? String(K.notionPageId) : de.notionPageId ? String(de.notionPageId) : '',
        me = we ? 'true' : 'false';
      _.push(
        [
          mr(T),
          mr(le),
          mr(de.title || ''),
          mr(de.url || ''),
          mr(de.lastCapturedAt || ''),
          mr(pe.length),
          mr(we),
          mr(me),
          mr(U.replace(/^sources\//, '')),
        ].join(','),
      );
    }
    C.push({ source: T, conversationCount: H.length, files: H });
  }
  const N = { schemaVersion: 1, storageLocal: c };
  (A.push({ name: 'config/storage-local.json', data: JSON.stringify(N, null, 2), lastModified: f }),
    A.push({
      name: 'sources/conversations.csv',
      data: _.join(`
`),
      lastModified: f,
    }));
  const M = [];
  for (const T of v) {
    const F = Number(T && T.id);
    if (!Number.isFinite(F) || F <= 0) continue;
    const W = Number(T && T.conversationId);
    if (!Number.isFinite(W) || W <= 0) continue;
    const z = j.get(W) || '';
    if (!z) continue;
    const H = T && T.url ? String(T.url) : '';
    if (!H.trim()) continue;
    let G = null;
    if ((T && T.blob instanceof Blob ? (G = T.blob) : T && typeof T.dataUrl == 'string' && (G = $_(T.dataUrl)), !G))
      continue;
    const le = jw(T.contentType || G.type);
    if (!le.startsWith('image/')) continue;
    const fe = Number(T.byteSize) || G.size || 0;
    if (fe <= 0) continue;
    const te = F_(le),
      ne = `${j_}${F}.${te}`;
    (A.push({ name: ne, data: G, lastModified: f }),
      M.push({
        assetId: F,
        uniqueKey: z,
        url: H,
        contentType: le,
        byteSize: fe,
        createdAt: Number(T.createdAt) || 0,
        updatedAt: Number(T.updatedAt) || 0,
        blobPath: ne,
      }));
  }
  const O = { schemaVersion: 1, assets: M };
  A.push({ name: Fm, data: JSON.stringify(O, null, 2), lastModified: f });
  const D = [];
  for (const T of g) {
    const F = Number(T && T.id);
    if (!Number.isFinite(F) || F <= 0) continue;
    const W = Number(T && T.parentId),
      z = Number.isFinite(W) && W > 0 ? W : null,
      H = Number(T && T.conversationId),
      G = (Number.isFinite(H) && H > 0 && j.get(H)) || '',
      le = T && T.canonicalUrl ? String(T.canonicalUrl).trim() : '';
    if (!le) continue;
    const fe = T && T.quoteText ? String(T.quoteText) : '',
      te = T && T.commentText ? String(T.commentText).trim() : '';
    if (!te) continue;
    const ne = Number(T && T.createdAt) || 0,
      $ = Number(T && T.updatedAt) || ne || 0;
    D.push({
      commentId: F,
      parentCommentId: z,
      uniqueKey: G,
      canonicalUrl: le,
      quoteText: fe,
      commentText: te,
      createdAt: ne,
      updatedAt: $,
    });
  }
  const B = { schemaVersion: 1, comments: D };
  A.push({ name: Bm, data: JSON.stringify(B, null, 2), lastModified: f });
  const Y = {
    backupSchemaVersion: Ow,
    exportedAt: f,
    db: { name: eO, version: QC },
    counts: {
      conversations: h.length,
      messages: m.length,
      sync_mappings: p.length,
      image_cache: M.length,
      article_comments: D.length,
    },
    config: { storageLocalPath: 'config/storage-local.json' },
    index: { conversationsCsvPath: 'sources/conversations.csv' },
    sources: C,
    assets: { imageCacheIndexPath: Fm, articleCommentsIndexPath: Bm },
  };
  A.unshift({ name: 'manifest.json', data: JSON.stringify(Y, null, 2), lastModified: f });
  const se = `SyncNos-Backup-${tO()}.zip`,
    V = await rO(A);
  try {
    await Fe({ [Of]: u });
  } catch {}
  return { filename: se, blob: V, exportedAt: f, counts: Y.counts };
}
function U_(e) {
  const t = String(e || '').trim();
  return t ? t.split(';')[0].trim().toLowerCase() : '';
}
const Pa = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
function z_(e) {
  const t = String(e || '').trim();
  return /^https?:\/\//i.test(t);
}
function K_(e) {
  const t = String(e || '').trim();
  return t ? /^data:image\/[a-z0-9.+-]+(?:;charset=[a-z0-9._-]+)?(?:;base64)?,/i.test(t) : !1;
}
function _f(e) {
  const t = String(e || '').trim();
  return t && (z_(t) || K_(t)) ? t : Pa;
}
function zm(e, t) {
  const r = String(e || '');
  if (!r || !r.includes('syncnos-asset://')) return r;
  const n = t.remap,
    i = t.fallbackUrlByOldId,
    a = _f(t.defaultUrl || Pa);
  return r.replace(/syncnos-asset:\/\/(\d+)/gi, (o, s) => {
    const l = Number(s);
    if (!Number.isFinite(l) || l <= 0) return o;
    const c = n.get(l);
    if (c) return `syncnos-asset://${c}`;
    const u = i.get(l);
    return u || a;
  });
}
function Ef(e) {
  const t = e instanceof Uint8Array ? e : new Uint8Array(e || []);
  return new TextDecoder('utf-8').decode(t);
}
function jo(e, t) {
  const r = e.get(t);
  if (!r) throw new Error(`Missing entry: ${t}`);
  const n = Ef(r);
  return JSON.parse(n);
}
function Nw() {
  return {
    conversationsAdded: 0,
    conversationsUpdated: 0,
    messagesAdded: 0,
    messagesUpdated: 0,
    messagesSkipped: 0,
    mappingsAdded: 0,
    mappingsUpdated: 0,
    commentsAdded: 0,
    commentsUpdated: 0,
    commentsSkipped: 0,
    settingsApplied: 0,
  };
}
function Yt(e) {
  return String(e ?? '').trim();
}
function is(e) {
  const t = Yt(e);
  if (!t) return '';
  try {
    const r = new URL(t),
      n = Yt(r.protocol).toLowerCase();
    return n !== 'http:' && n !== 'https:' ? '' : ((r.hash = ''), r.toString());
  } catch {
    return '';
  }
}
function W_(e) {
  return Yt(e?.source).toLowerCase() || 'unknown';
}
function H_(e) {
  const t = is(e?.url);
  if (!t) return 'unknown';
  try {
    const r = Yt(new URL(t).hostname).toLowerCase();
    return r ? `domain:${r}` : 'unknown';
  } catch {
    return 'unknown';
  }
}
function Iw(e) {
  if (!e || typeof e != 'object') return e;
  const t = Yt(e?.listSourceKey),
    r = Yt(e?.listSiteKey),
    n = W_(e),
    i = n !== 'unknown' ? n : t || 'unknown',
    a = H_(e),
    o = a !== 'unknown' ? a : r || 'unknown';
  return t === i && r === o ? e : { ...e, listSourceKey: i, listSiteKey: o };
}
function Km(e) {
  return [
    Yt(e.canonicalUrl),
    String(Number(e.createdAt) || 0),
    String(e.quoteText || ''),
    String(e.commentText || ''),
  ].join('||');
}
function Wm(e) {
  return `${e.baseKey}||parent=${e.parentBaseKey || ''}`;
}
async function q_(e, t) {
  const r = C_(e);
  if (!r.ok) throw new Error(r.error || 'Invalid backup file.');
  const n = e,
    i = n.stores || {},
    a = Array.isArray(i.conversations) ? i.conversations : [],
    o = Array.isArray(i.messages) ? i.messages : [],
    s = Array.isArray(i.sync_mappings) ? i.sync_mappings : [],
    l = $d(n.storageLocal || {}),
    c = Object.keys(l),
    u = Nw(),
    h = { done: 0, total: a.length + o.length + s.length + c.length, stage: '' },
    m = () => t?.({ ...h }),
    p = (S, x) => {
      ((h.done += Number(S) || 0), x && (h.stage = x), m());
    };
  m();
  const v = new Map();
  for (const S of a) {
    if (!S) continue;
    const x = Dr(S);
    if (!x) continue;
    const A = Number(S.id);
    Number.isFinite(A) && A > 0 && v.set(A, x);
  }
  const g = await Fd(),
    b = new Map();
  {
    const { t: S, stores: x } = Ir(g, ['conversations'], 'readwrite'),
      A = x.conversations.index('by_source_conversationKey');
    ((h.stage = 'conversations'), m());
    for (let C = 0; C < a.length; C += 1) {
      const P = a[C];
      if (!P) {
        p(1, 'conversations');
        continue;
      }
      const _ = P.source ? String(P.source) : '',
        E = P.conversationKey ? String(P.conversationKey) : '';
      if (!_ || !E) {
        p(1, 'conversations');
        continue;
      }
      const j = await ve(A.get([_, E])),
        N = Iw(_w(j, P));
      if (j && j.id)
        ((N.id = j.id),
          await ve(x.conversations.put(N)),
          (u.conversationsUpdated += 1),
          b.set(`${_}||${E}`, Number(j.id)));
      else {
        const M = await ve(x.conversations.add(N));
        ((u.conversationsAdded += 1), b.set(`${_}||${E}`, Number(M)));
      }
      p(1, 'conversations');
    }
    await Nr(S);
  }
  {
    const { t: S, stores: x } = Ir(g, ['messages'], 'readwrite'),
      A = x.messages.index('by_conversationId_messageKey');
    ((h.stage = 'messages'), m());
    for (let C = 0; C < o.length; C += 1) {
      const P = o[C];
      if (!P) {
        p(1, 'messages');
        continue;
      }
      const _ = Number(P.conversationId),
        E = P.messageKey ? String(P.messageKey) : '';
      if (!Number.isFinite(_) || _ <= 0 || !E) {
        ((u.messagesSkipped += 1), p(1, 'messages'));
        continue;
      }
      const j = v.get(_) || '',
        N = j ? b.get(j) : null;
      if (!N) {
        ((u.messagesSkipped += 1), p(1, 'messages'));
        continue;
      }
      const M = await ve(A.get([N, E])),
        O = { ...(P || {}), conversationId: N, messageKey: E },
        D = Ew(M, O);
      ((D.conversationId = N),
        (D.messageKey = E),
        M && M.id
          ? ((D.id = M.id), await ve(x.messages.put(D)), (u.messagesUpdated += 1))
          : (await ve(x.messages.add(D)), (u.messagesAdded += 1)),
        C % 25 === 0 && m(),
        p(1, 'messages'));
    }
    await Nr(S);
  }
  {
    const { t: S, stores: x } = Ir(g, ['sync_mappings', 'conversations'], 'readwrite'),
      A = x.sync_mappings.index('by_source_conversationKey'),
      C = x.conversations.index('by_source_conversationKey');
    ((h.stage = 'mappings'), m());
    for (let P = 0; P < s.length; P += 1) {
      const _ = s[P];
      if (!_) {
        p(1, 'mappings');
        continue;
      }
      const E = _.source ? String(_.source) : '',
        j = _.conversationKey ? String(_.conversationKey) : '';
      if (!E || !j) {
        p(1, 'mappings');
        continue;
      }
      const N = await ve(A.get([E, j])),
        M = kw(N, _);
      N && N.id
        ? ((M.id = N.id), await ve(x.sync_mappings.put(M)), (u.mappingsUpdated += 1))
        : (await ve(x.sync_mappings.add(M)), (u.mappingsAdded += 1));
      const O = M.notionPageId ? String(M.notionPageId) : '',
        D = M.feishuDocId ? String(M.feishuDocId) : '';
      if (O) {
        const B = await ve(C.get([E, j]));
        if (B && B.id) {
          let Y = !1;
          ((!B.notionPageId || !String(B.notionPageId).trim()) && ((B.notionPageId = O), (Y = !0)),
            D && (!B.feishuDocId || !String(B.feishuDocId).trim()) && ((B.feishuDocId = D), (Y = !0)),
            Y && (await ve(x.conversations.put(B))));
        }
      } else if (D) {
        const B = await ve(C.get([E, j]));
        B &&
          B.id &&
          (!B.feishuDocId || !String(B.feishuDocId).trim()) &&
          ((B.feishuDocId = D), await ve(x.conversations.put(B)));
      }
      p(1, 'mappings');
    }
    await Nr(S);
  }
  return (
    (h.stage = 'settings'),
    m(),
    c.length && (await Fe(l), (u.settingsApplied = c.length), p(c.length, 'settings')),
    u
  );
}
async function V_(e, t) {
  const r = jo(e, 'manifest.json'),
    n = E_(r);
  if (!n.ok) throw new Error(n.error || 'Invalid manifest.json');
  const i = r && r.config ? String(r.config.storageLocalPath || '') : '',
    a = i ? jo(e, i) : null;
  if (!a) throw new Error('Missing config/storage-local.json');
  const o = k_(a);
  if (!o.ok) throw new Error(o.error || 'Invalid storage-local.json');
  const s = $d(a.storageLocal || {}),
    l = Object.keys(s),
    c = [],
    u = Array.isArray(r.sources) ? r.sources : [];
  for (const V of u) {
    const T = V && Array.isArray(V.files) ? V.files : [];
    for (const F of T) c.push(String(F || '').trim());
  }
  const f = r && r.assets ? String(r.assets.imageCacheIndexPath || '').trim() : '',
    m = !!f && !e.has(f),
    p = f && !m ? jo(e, f) : null;
  if (p) {
    const V = O_(p);
    if (!V.ok) throw new Error(V.error || 'Invalid image cache index');
  }
  const v = p && Array.isArray(p.assets) ? p.assets : [],
    g = r && r.assets ? String(r.assets.articleCommentsIndexPath || '').trim() : '',
    b = g && e.has(g) ? jo(e, g) : null;
  if (b) {
    const V = __(b);
    if (!V.ok) throw new Error(V.error || 'Invalid article comments index');
  }
  const S = b && Array.isArray(b.comments) ? b.comments : [],
    x = [],
    A = new Map(),
    C = [],
    P = new Set();
  let _ = 0;
  const E = new Set(),
    j = [];
  for (const V of c) {
    if (!V) continue;
    const T = e.get(V);
    if (!T) {
      j.push(V);
      continue;
    }
    E.add(V);
    const F = JSON.parse(Ef(T)),
      W = $m(F);
    if (!W.ok) throw new Error(W.error || `Invalid conversation bundle: ${V}`);
    const z = F.conversation,
      H = Dr(z);
    if (!H) throw new Error(`Invalid conversation key: ${V}`);
    if (P.has(H)) throw new Error('Duplicate conversation key in zip');
    P.add(H);
    const G = Array.isArray(F.messages) ? F.messages : [];
    (A.set(H, G), (_ += G.length), x.push(z), F.syncMapping && C.push(F.syncMapping));
  }
  if (j.length) {
    const V = [];
    for (const T of e.keys()) T && T.startsWith('sources/') && T.endsWith('.json') && (E.has(T) || V.push(T));
    for (const T of V) {
      const F = e.get(T);
      if (!F) continue;
      let W;
      try {
        W = JSON.parse(Ef(F));
      } catch {
        continue;
      }
      if (!$m(W).ok) continue;
      const H = W.conversation,
        G = Dr(H);
      if (!G) continue;
      if (P.has(G)) throw new Error('Duplicate conversation key in zip');
      P.add(G);
      const le = Array.isArray(W.messages) ? W.messages : [];
      (A.set(G, le), (_ += le.length), x.push(H), W.syncMapping && C.push(W.syncMapping));
    }
  }
  const N = Nw(),
    M = { done: 0, total: x.length + _ + C.length + l.length + v.length + S.length, stage: '' },
    O = () => t?.({ ...M }),
    D = (V, T) => {
      ((M.done += V), T && (M.stage = T));
    },
    B = await Fd(),
    Y = new Map();
  {
    const { t: V, stores: T } = Ir(B, ['conversations'], 'readwrite'),
      F = T.conversations.index('by_source_conversationKey');
    ((M.stage = 'Conversations'), O());
    for (let W = 0; W < x.length; W += 1) {
      const z = x[W],
        H = z && z.source ? String(z.source) : '',
        G = z && z.conversationKey ? String(z.conversationKey) : '';
      if (!H || !G) {
        D(1, 'Conversations');
        continue;
      }
      const le = await ve(F.get([H, G])),
        fe = _w(le, z);
      ((fe.source = H), (fe.conversationKey = G));
      const te = Iw(fe),
        ne = Dr(te);
      if (le && le.id)
        ((te.id = le.id), await ve(T.conversations.put(te)), Y.set(ne, Number(le.id)), (N.conversationsUpdated += 1));
      else {
        const $ = await ve(T.conversations.add(te));
        (Y.set(ne, Number($)), (N.conversationsAdded += 1));
      }
      (W % 20 === 0 && O(), D(1, 'Conversations'));
    }
    await Nr(V);
  }
  if (S.length) {
    const V = [],
      T = new Map(),
      F = new Map(),
      W = new Set();
    let z = 0;
    for (const K of S) {
      const ae = Number(K && K.commentId);
      if (!Number.isFinite(ae) || ae <= 0) {
        ((N.commentsSkipped += 1), D(1, 'Comments'), (z += 1), z % 40 === 0 && O());
        continue;
      }
      const we = is(K && K.canonicalUrl),
        me = Yt(K && K.commentText);
      if (!we || !me) {
        ((N.commentsSkipped += 1), D(1, 'Comments'), (z += 1), z % 40 === 0 && O());
        continue;
      }
      const $e = K && K.parentCommentId,
        We = $e == null ? null : Number($e),
        Et = We != null && Number.isFinite(We) && We > 0 ? We : null,
        Kt = Yt(K && K.uniqueKey),
        pt = K && K.quoteText ? String(K.quoteText) : '',
        oe = Number(K && K.createdAt) || 0,
        Ae = Number(K && K.updatedAt) || oe || 0,
        Oe = Km({ canonicalUrl: we, createdAt: oe, quoteText: pt, commentText: me });
      (F.set(ae, Oe), W.add(we));
      const _e = {
        commentId: ae,
        parentCommentId: Et,
        uniqueKey: Kt,
        canonicalUrl: we,
        quoteText: pt,
        commentText: me,
        createdAt: oe,
        updatedAt: Ae,
        baseKey: Oe,
        parentBaseKey: '',
        fingerprint: '',
      };
      (T.set(ae, _e), V.push(_e));
    }
    for (const K of V) {
      const ae = (K.parentCommentId && F.get(K.parentCommentId)) || '';
      ((K.parentBaseKey = ae), (K.fingerprint = Wm({ baseKey: K.baseKey, parentBaseKey: ae })));
    }
    const H = new Map();
    for (const K of x) {
      const ae = Dr(K),
        we = ae ? Y.get(ae) : null;
      if (!we) continue;
      const me = is(K && K.url);
      me && (H.has(me) || H.set(me, we));
    }
    const G = new Map(),
      le = new Map(),
      fe = [],
      { t: te, stores: ne } = Ir(B, ['article_comments'], 'readwrite'),
      $ = ne.article_comments,
      U = $.index('by_canonicalUrl_createdAt');
    ((M.stage = 'Comments'), O());
    for (const K of W) {
      if (!K) continue;
      const ae = globalThis.IDBKeyRange?.bound ? globalThis.IDBKeyRange.bound([K, -1 / 0], [K, 1 / 0]) : null,
        we = ae ? (await ve(U.getAll(ae))) || [] : [];
      for (const me of we) {
        if (!me || typeof me != 'object') continue;
        const $e = Number(me.id);
        if (!Number.isFinite($e) || $e <= 0) continue;
        const We = is(me.canonicalUrl);
        if (!We) continue;
        const Et = Number(me.createdAt) || 0,
          Kt = me.quoteText ? String(me.quoteText) : '',
          pt = Yt(me.commentText);
        if (!pt) continue;
        const oe = Km({ canonicalUrl: We, createdAt: Et, quoteText: Kt, commentText: pt });
        (le.set($e, oe), fe.push(me));
      }
    }
    for (const K of fe) {
      const ae = Number(K.id),
        we = le.get(ae) || '';
      if (!we) continue;
      const me = Number(K.parentId),
        $e = (Number.isFinite(me) && me > 0 && le.get(me)) || '',
        We = Wm({ baseKey: we, parentBaseKey: $e });
      G.has(We) || G.set(We, K);
    }
    const ie = [],
      R = new Set(),
      pe = new Set(),
      ce = (K) => {
        if (R.has(K) || pe.has(K)) return;
        pe.add(K);
        const ae = T.get(K);
        (ae && ae.parentCommentId && ce(ae.parentCommentId), ae && (R.add(K), ie.push(ae)), pe.delete(K));
      };
    for (const K of V) ce(K.commentId);
    const be = new Map(),
      de = Date.now();
    for (const K of ie) {
      const ae = G.get(K.fingerprint) || null,
        we = K.parentCommentId && be.has(K.parentCommentId) ? be.get(K.parentCommentId) : null,
        me = Yt(K.uniqueKey),
        $e = me && Y.has(me) ? Y.get(me) : H.get(K.canonicalUrl) || null;
      if (ae && ae.id) {
        const pt = Number(ae.id);
        Number.isFinite(pt) && pt > 0 && be.set(K.commentId, pt);
        const oe = Number(ae.updatedAt) || 0,
          Ae = Number(K.updatedAt) || 0,
          Oe =
            Ae > oe &&
            (Yt(ae.commentText) !== K.commentText || String(ae.quoteText || '') !== String(K.quoteText || '')),
          _e = $e != null && (!Number.isFinite(Number(ae.conversationId)) || Number(ae.conversationId) <= 0),
          rt = we != null && (!Number.isFinite(Number(ae.parentId)) || Number(ae.parentId) <= 0);
        if (Oe || _e || rt) {
          const Dt = {
            ...ae,
            canonicalUrl: K.canonicalUrl,
            quoteText: String(K.quoteText || ''),
            commentText: K.commentText,
            conversationId: _e && $e != null ? $e : ae.conversationId,
            parentId: rt && we != null ? we : ae.parentId,
            createdAt: Number(ae.createdAt) || Number(K.createdAt) || de,
            updatedAt: Math.max(oe, Ae, de),
          };
          (await ve($.put(Dt)), (N.commentsUpdated += 1));
        }
        (D(1, 'Comments'), (z += 1), z % 40 === 0 && O());
        continue;
      }
      const We = {
          parentId: we,
          conversationId: $e,
          canonicalUrl: K.canonicalUrl,
          quoteText: String(K.quoteText || ''),
          commentText: K.commentText,
          createdAt: Number(K.createdAt) || de,
          updatedAt: Number(K.updatedAt) || Number(K.createdAt) || de,
        },
        Et = await ve($.add(We)),
        Kt = Number(Et);
      (Number.isFinite(Kt) && Kt > 0 && be.set(K.commentId, Kt),
        (N.commentsAdded += 1),
        D(1, 'Comments'),
        (z += 1),
        z % 40 === 0 && O());
    }
    await Nr(te);
  }
  const Q = new Map(),
    se = new Map();
  if (m)
    for (const [V, T] of A.entries()) {
      const F = Array.isArray(T) ? T : [];
      for (const W of F) {
        if (!W || typeof W != 'object') continue;
        const z = W.contentMarkdown && String(W.contentMarkdown).trim() ? String(W.contentMarkdown) : '';
        if (!z) continue;
        const H = zm(z, { remap: Q, fallbackUrlByOldId: se, defaultUrl: Pa });
        H !== z && (W.contentMarkdown = H);
      }
      A.set(V, F);
    }
  if (v.length) {
    const { t: V, stores: T } = Ir(B, ['image_cache'], 'readwrite'),
      F = T.image_cache.index('by_conversationId_url'),
      W = Date.now();
    ((M.stage = 'Assets'), O());
    for (let z = 0; z < v.length; z += 1) {
      const H = v[z],
        G = Number(H && H.assetId);
      if (!Number.isFinite(G) || G <= 0) {
        (z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const le = H && H.uniqueKey ? String(H.uniqueKey) : '';
      if (!le.trim()) {
        (z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const fe = Y.get(le);
      if (!fe) {
        (z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const ne = (H && H.url ? String(H.url) : '').trim();
      if (!ne) {
        (z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const $ = U_(H && H.contentType ? H.contentType : '');
      if (!$.startsWith('image/')) {
        (z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const U = H && H.blobPath ? String(H.blobPath) : '',
        ie = U ? e.get(U) : null;
      if (!ie) {
        (se.set(G, _f(ne)), z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const R = new Blob([new Uint8Array(ie)], { type: $ }),
        pe = Number(H.byteSize) || R.size || 0;
      if (pe <= 0) {
        (se.set(G, _f(ne)), z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const ce = await ve(F.get([fe, ne]));
      if (ce && ce.id) {
        const ae = Number(ce.id);
        Number.isFinite(ae) && ae > 0 && Q.set(G, ae);
        const we = ce.blob,
          me = Number(ce.byteSize) || (we instanceof Blob ? we.size : 0) || 0;
        if (we instanceof Blob && me > 0) {
          (z % 20 === 0 && O(), D(1, 'Assets'));
          continue;
        }
        const $e = {
          ...ce,
          conversationId: fe,
          url: ne,
          blob: R,
          byteSize: pe,
          contentType: $,
          createdAt: Number(ce.createdAt) || Number(H.createdAt) || W,
          updatedAt: W,
        };
        (await ve(T.image_cache.put($e)), z % 20 === 0 && O(), D(1, 'Assets'));
        continue;
      }
      const be = {
          conversationId: fe,
          url: ne,
          blob: R,
          byteSize: pe,
          contentType: $,
          createdAt: Number(H.createdAt) || W,
          updatedAt: W,
        },
        de = await ve(T.image_cache.add(be)),
        K = Number(de);
      (Number.isFinite(K) && K > 0 && Q.set(G, K), z % 20 === 0 && O(), D(1, 'Assets'));
    }
    await Nr(V);
  }
  if (Q.size || se.size)
    for (const [V, T] of A.entries()) {
      const F = Array.isArray(T) ? T : [];
      for (const W of F) {
        if (!W || typeof W != 'object') continue;
        const z = W.contentMarkdown && String(W.contentMarkdown).trim() ? String(W.contentMarkdown) : '';
        if (!z) continue;
        const H = zm(z, { remap: Q, fallbackUrlByOldId: se, defaultUrl: Pa });
        H !== z && (W.contentMarkdown = H);
      }
      A.set(V, F);
    }
  {
    const { t: V, stores: T } = Ir(B, ['messages'], 'readwrite'),
      F = T.messages.index('by_conversationId_messageKey');
    ((M.stage = 'Messages'), O());
    let W = 0;
    for (const [z, H] of A.entries()) {
      const G = Y.get(z);
      if (!G) {
        ((W += Array.isArray(H) ? H.length : 0), D(Array.isArray(H) ? H.length : 0, 'Messages'));
        continue;
      }
      const le = Array.isArray(H) ? H : [];
      for (const fe of le) {
        const te = fe && fe.messageKey ? String(fe.messageKey) : '';
        if (!te) {
          ((N.messagesSkipped += 1), D(1, 'Messages'));
          continue;
        }
        const ne = await ve(F.get([G, te])),
          $ = { ...(fe || {}), conversationId: G, messageKey: te },
          U = Ew(ne, $);
        ((U.conversationId = G),
          (U.messageKey = te),
          ne && ne.id
            ? ((U.id = ne.id), await ve(T.messages.put(U)), (N.messagesUpdated += 1))
            : (await ve(T.messages.add(U)), (N.messagesAdded += 1)),
          W % 40 === 0 && O(),
          (W += 1),
          D(1, 'Messages'));
      }
    }
    await Nr(V);
  }
  {
    const { t: V, stores: T } = Ir(B, ['sync_mappings', 'conversations'], 'readwrite'),
      F = T.sync_mappings.index('by_source_conversationKey'),
      W = T.conversations.index('by_source_conversationKey');
    ((M.stage = 'Mappings'), O());
    for (let z = 0; z < C.length; z += 1) {
      const H = C[z],
        G = H && H.source ? String(H.source) : '',
        le = H && H.conversationKey ? String(H.conversationKey) : '';
      if (!G || !le) {
        D(1, 'Mappings');
        continue;
      }
      const fe = await ve(F.get([G, le])),
        te = kw(fe, H);
      ((te.source = G),
        (te.conversationKey = le),
        fe && fe.id
          ? ((te.id = fe.id), await ve(T.sync_mappings.put(te)), (N.mappingsUpdated += 1))
          : (await ve(T.sync_mappings.add(te)), (N.mappingsAdded += 1)));
      const ne = te.notionPageId ? String(te.notionPageId) : '';
      if (ne) {
        const $ = await ve(W.get([G, le]));
        $ &&
          $.id &&
          (!$.notionPageId || !String($.notionPageId).trim()) &&
          (($.notionPageId = ne), await ve(T.conversations.put($)));
      }
      D(1, 'Mappings');
    }
    await Nr(V);
  }
  return (
    (M.stage = 'Settings'),
    O(),
    l.length && (await Fe(s), (N.settingsApplied = l.length), D(l.length, 'Settings')),
    N
  );
}
function G_(e) {
  if (!e || typeof e.ok != 'boolean') throw new Error('no response from background');
  if (e.ok) return e.data;
  const t = e.error?.message ?? 'unknown error';
  throw new Error(t);
}
async function Y_() {
  const e = await _d(ts.DISCONNECT);
  G_(e);
}
function X_() {
  return {
    authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenExchangeProxyUrl: 'https://syncnos-notion-oauth.chiimagnus.workers.dev/notion/oauth/exchange',
    redirectUri: 'https://chiimagnus.github.io/syncnos-oauth/callback',
    owner: 'user',
    responseType: 'code',
  };
}
function Z_(e) {
  if (!e || typeof e.ok != 'boolean') throw new Error('no response from background');
  if (e.ok) return e.data;
  const t = e.error?.message ?? 'unknown error';
  throw new Error(t);
}
async function J_() {
  const e = await _d(Af.DISCONNECT);
  Z_(e);
}
function Q_() {
  return {
    authorizationUrl: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
    redirectUri: 'https://chiimagnus.github.io/syncnos-oauth/callback',
    responseType: 'code',
    scope: 'docx:document docx:document.block:convert drive:drive',
  };
}
const St = Object.freeze({
    chatFolder: 'feishu_chat_folder',
    articleFolder: 'feishu_article_folder',
    videoFolder: 'feishu_video_folder',
  }),
  nt = Object.freeze({
    chatFolder: 'SyncNos-AIChats',
    articleFolder: 'SyncNos-WebArticles',
    videoFolder: 'SyncNos-Videos',
  });
function Hm(e) {
  return String(e ?? '').trim();
}
function $r(e, t) {
  const r = Hm(e),
    n = Hm(t),
    i = r || n;
  return (
    (i &&
      (i
        .replace(/\\/g, '/')
        .split('/')
        .map((o) => String(o || '').trim())
        .filter((o) => !!o && o !== '.' && o !== '..')
        .join('/') ||
        n)) ||
    ''
  );
}
async function Tw() {
  const e = await Ed([St.chatFolder, St.articleFolder, St.videoFolder]);
  return {
    chatFolder: $r(e[St.chatFolder], nt.chatFolder),
    articleFolder: $r(e[St.articleFolder], nt.articleFolder),
    videoFolder: $r(e[St.videoFolder], nt.videoFolder),
    defaults: { chatFolder: nt.chatFolder, articleFolder: nt.articleFolder, videoFolder: nt.videoFolder },
  };
}
async function eE(e = {}) {
  const t = {};
  return (
    e.chatFolder != null && (t[St.chatFolder] = $r(e.chatFolder, nt.chatFolder)),
    e.articleFolder != null && (t[St.articleFolder] = $r(e.articleFolder, nt.articleFolder)),
    e.videoFolder != null && (t[St.videoFolder] = $r(e.videoFolder, nt.videoFolder)),
    Object.keys(t).length > 0 && (await Fe(t)),
    Tw()
  );
}
function Mw(e) {
  const t = String(e || '')
    .trim()
    .toLowerCase()
    .replace(/-/g, '');
  return !t || !/^[0-9a-f]{32}$/.test(t) ? '' : t;
}
function zc(e) {
  const t = String(e || '').trim();
  if (!t) return '';
  const r = [],
    n = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g,
    i = /\b[0-9a-fA-F]{32}\b/g;
  for (const o of t.matchAll(n)) r.push(String(o[0] || ''));
  for (const o of t.matchAll(i)) r.push(String(o[0] || ''));
  const a = r.length ? r[r.length - 1] : '';
  return Mw(a);
}
function tE(e) {
  const t = String(e || '').trim();
  if (!t) return '';
  const r = Mw(t);
  if (r) return r;
  try {
    const n = new URL(t),
      i = zc(n.pathname);
    if (i) return i;
    const a = zc(n.toString());
    if (a) return a;
  } catch {}
  return zc(t);
}
const hi = 'anti_hotlink_rules_v1',
  rE = [
    { domain: 'cdnfile.sspai.com', referer: 'https://sspai.com/' },
    { domain: 'sns-webpic-qc.xhscdn.com', referer: 'https://www.xiaohongshu.com/' },
  ],
  Bd = Object.freeze(rE.map((e) => Object.freeze({ ...e })));
let pa = null,
  No = null;
function ms(e) {
  return String(e ?? '').trim();
}
function cn(e) {
  return e.map((t) => ({ domain: t.domain, referer: t.referer }));
}
function Dw(e) {
  const t = ms(e).toLowerCase();
  if (!t || t.includes('://') || /[\s/?#@]/.test(t)) return '';
  const r = t.endsWith('.') ? t.slice(0, -1) : t;
  if (!r) return '';
  const n = r.startsWith('[') && r.endsWith(']') ? r.slice(1, -1) : r;
  if (!n) return '';
  const i = n.split('.');
  if (i.length === 4 && i.every((s) => /^\d{1,3}$/.test(s) && Number(s) >= 0 && Number(s) <= 255)) return n;
  const o = n.split('.');
  if (o.length < 2) return '';
  for (const s of o) if (!/^[a-z0-9-]+$/.test(s) || s.startsWith('-') || s.endsWith('-')) return '';
  return n;
}
function Rw(e) {
  const t = ms(e);
  if (!t) return '';
  try {
    const r = new URL(t),
      n = String(r.protocol || '').toLowerCase();
    return n !== 'http:' && n !== 'https:' ? '' : ((r.hash = ''), (r.username = ''), (r.password = ''), r.toString());
  } catch {
    return '';
  }
}
function Lw(e) {
  if (!e || typeof e != 'object') return { domainRaw: '', refererRaw: '' };
  const t = e;
  return { domainRaw: ms(t.domain), refererRaw: ms(t.referer) };
}
function nE(e) {
  const t = Array.isArray(e) ? e : [],
    r = [],
    n = [],
    i = new Set();
  return (
    t.forEach((a, o) => {
      const { domainRaw: s, refererRaw: l } = Lw(a),
        c = Dw(s),
        u = Rw(l);
      if (
        (s
          ? c ||
            r.push({ index: o, field: 'domain', code: 'domain_invalid', message: 'Domain must be a valid hostname.' })
          : r.push({ index: o, field: 'domain', code: 'domain_required', message: 'Domain is required.' }),
        l
          ? u ||
            r.push({
              index: o,
              field: 'referer',
              code: 'referer_invalid',
              message: 'Referer must be a valid http(s) URL.',
            })
          : r.push({ index: o, field: 'referer', code: 'referer_required', message: 'Referer is required.' }),
        !(!c || !u))
      ) {
        if (i.has(c)) {
          r.push({ index: o, field: 'domain', code: 'domain_duplicate', message: 'Domain must be unique.' });
          return;
        }
        (i.add(c), n.push({ domain: c, referer: u }));
      }
    }),
    { rules: n, issues: r }
  );
}
function $w(e) {
  const t = Array.isArray(e) ? e : [],
    r = [],
    n = new Set();
  for (const i of t) {
    const { domainRaw: a, refererRaw: o } = Lw(i),
      s = Dw(a),
      l = Rw(o);
    !s || !l || n.has(s) || (n.add(s), r.push({ domain: s, referer: l }));
  }
  return r;
}
async function iE() {
  const e = await Ed([hi]);
  if (!Object.prototype.hasOwnProperty.call(e, hi)) {
    const r = cn(Bd);
    return (await Fe({ [hi]: r }), r);
  }
  return $w(e[hi]);
}
async function aE(e = {}) {
  const t = e.forceRefresh === !0;
  if (!t && pa) return cn(pa);
  if (!t && No) return cn(await No);
  const r = iE()
    .then((n) => ((pa = cn(n)), cn(pa)))
    .finally(() => {
      No = null;
    });
  return ((No = r), cn(await r));
}
async function Fw(e) {
  const t = $w(e);
  return (await Fe({ [hi]: t }), (pa = cn(t)), cn(t));
}
async function oE() {
  return await Fw(Bd);
}
const qm = hi;
function Ud(e) {
  return e.map((t) => ({ domain: String(t.domain || ''), referer: String(t.referer || '') }));
}
function sE(e) {
  return (Array.isArray(e) ? e : []).map((t) => ({ domain: t?.domain, referer: t?.referer }));
}
async function lE(e = {}) {
  const t = await aE({ forceRefresh: e.forceRefresh === !0 });
  return Ud(t);
}
function cE() {
  return Ud(Bd);
}
async function uE(e) {
  const { rules: t, issues: r } = nE(sE(e));
  return r.length > 0 ? { ok: !1, issues: r } : { ok: !0, rules: await Fw(t) };
}
async function fE() {
  const e = await oE();
  return Ud(e);
}
const dE = 4,
  hE = 8,
  mE = 3,
  pE = w('insightOtherLabel'),
  vE = w('insightUnknownLabel'),
  gE = w('insightUnknownLabel'),
  yE = w('insightUnknownLabel');
w('untitled');
function bE(e) {
  return new Promise((t, r) => {
    ((e.onsuccess = () => t(e.result)), (e.onerror = () => r(e.error || new Error('indexedDB request failed'))));
  });
}
function wE(e) {
  return new Promise((t, r) => {
    ((e.oncomplete = () => t()),
      (e.onerror = () => r(e.error || new Error('transaction failed'))),
      (e.onabort = () => r(e.error || new Error('transaction aborted'))));
  });
}
function Ca(e) {
  return String(e || '').trim();
}
function xE(e) {
  return Ca(e).toLowerCase();
}
function SE(e) {
  return Ca(e) || gE;
}
function AE(e) {
  return nO(Ca(e));
}
function PE(e, t) {
  return t.count !== e.count ? t.count - e.count : e.label.localeCompare(t.label);
}
function Vm(e, t) {
  const r = Array.from(e.entries())
    .map(([a, o]) => ({ label: a, count: o }))
    .filter((a) => a.count > 0)
    .sort(PE);
  if (r.length <= t) return r;
  const n = r.slice(0, t),
    i = r.slice(t).reduce((a, o) => a + o.count, 0);
  return i <= 0 ? n : [...n, { label: pE, count: i }];
}
function CE(e) {
  return iO(e) || vE;
}
function kf(e) {
  if (!Number.isFinite(e) || e <= 0) return Number.NaN;
  const t = new Date(e);
  return Number.isFinite(t.getTime()) ? (t.setHours(0, 0, 0, 0), t.getTime()) : Number.NaN;
}
function Gm(e) {
  const t = Number(e.since),
    r = Number(e.until),
    n = Number.isFinite(t) && Number.isFinite(r) && t > 0 && r > 0 && r >= t,
    i = 1440 * 60 * 1e3,
    a = [],
    o = Math.max(0, Math.floor(e.unknownCount || 0)),
    s = e.counts;
  if (n) {
    const f = kf(t),
      h = kf(r);
    if (!Number.isFinite(f) || !Number.isFinite(h) || h < f) return a;
    for (let m = f; m <= h; m += i) a.push({ dayStart: m, count: s.get(m) || 0 });
    return a;
  }
  const l = Array.from(s.keys())
    .filter((f) => Number.isFinite(f))
    .sort((f, h) => f - h);
  if (!l.length) return (o > 0 && a.push({ dayStart: -1, count: o }), a);
  const c = l[0],
    u = l[l.length - 1];
  o > 0 && a.push({ dayStart: -1, count: o });
  for (let f = c; f <= u; f += i) a.push({ dayStart: f, count: s.get(f) || 0 });
  return a;
}
async function OE(e) {
  return (await bE(e.getAll())) || [];
}
async function _E(e) {
  const t = new Map();
  return (
    await new Promise((r, n) => {
      const i = e.openCursor();
      ((i.onsuccess = () => {
        const a = i.result;
        if (!a) {
          r();
          return;
        }
        const o = Number(a.value?.conversationId);
        (Number.isFinite(o) && o > 0 && t.set(o, (t.get(o) || 0) + 1), a.continue());
      }),
        (i.onerror = () => n(i.error || new Error('indexedDB request failed'))));
    }),
    t
  );
}
function EE() {
  return {
    totalClips: 0,
    chatCount: 0,
    articleCount: 0,
    chatDailyTrend: [],
    chatSourceDistribution: [],
    totalMessages: 0,
    topConversations: [],
    articleDailyTrend: [],
    articleDomainDistribution: [],
  };
}
function kE(e) {
  return e ? e.totalClips > 0 : !1;
}
function jE(e, t, r) {
  const n = Number(e) || 0;
  return !Number.isFinite(n) || n <= 0 ? !1 : n >= t && n <= r;
}
function Ym(e, t = Date.now()) {
  if (e === 'all') return { since: 0, until: 0 };
  const r = Number.isFinite(t) ? t : Date.now(),
    n = new Date(r);
  n.setHours(0, 0, 0, 0);
  const i = n.getTime(),
    a = 1440 * 60 * 1e3;
  return e === 'today'
    ? { since: i, until: r }
    : e === '7d'
      ? { since: i - a * 6, until: r }
      : { since: i - a * 29, until: r };
}
function Xm(e, t) {
  const r = EE(),
    n = Number(t?.since),
    i = Number(t?.until),
    a = Number.isFinite(n) && Number.isFinite(i) && n > 0 && i > 0 && i >= n,
    o = new Map(),
    s = new Map(),
    l = [],
    c = new Map(),
    u = new Map();
  let f = 0,
    h = 0;
  for (const m of e.conversations) {
    if (a && !jE(m.lastCapturedAt, n, i)) continue;
    const p = xE(m.sourceType),
      v = kf(Number(m.lastCapturedAt) || 0);
    if (p === 'chat') {
      r.chatCount += 1;
      const g = SE(m.source);
      (o.set(g, (o.get(g) || 0) + 1), Number.isFinite(v) ? c.set(v, (c.get(v) || 0) + 1) : a || (f += 1));
      const b = Number(m.id),
        S = Number(e.messageCounts.get(b) || 0),
        x = Ca(m.source).toLowerCase(),
        A = Ca(m.conversationKey);
      ((r.totalMessages += S),
        l.push({
          conversationId: b,
          title: AE(m.title),
          messageCount: S,
          source: g,
          openSource: x,
          openConversationKey: A,
          loc: x && A ? ew({ source: x, conversationKey: A }) : '',
        }));
      continue;
    }
    if (p === 'article') {
      r.articleCount += 1;
      const g = CE(m.url);
      (s.set(g, (s.get(g) || 0) + 1), Number.isFinite(v) ? u.set(v, (u.get(v) || 0) + 1) : a || (h += 1));
    }
  }
  return (
    (r.chatDailyTrend = Gm({ counts: c, unknownCount: f, since: a ? n : void 0, until: a ? i : void 0 })),
    (r.chatSourceDistribution = Vm(o, dE)),
    (r.articleDomainDistribution = Vm(s, hE)),
    (r.topConversations = l
      .sort((m, p) =>
        p.messageCount !== m.messageCount ? p.messageCount - m.messageCount : p.conversationId - m.conversationId,
      )
      .slice(0, mE)),
    (r.totalClips = r.chatCount + r.articleCount),
    (r.articleDailyTrend = Gm({ counts: u, unknownCount: h, since: a ? n : void 0, until: a ? i : void 0 })),
    r
  );
}
async function NE() {
  const e = await Qb();
  try {
    const t = e.transaction(['conversations', 'messages'], 'readonly'),
      r = t.objectStore('conversations'),
      n = t.objectStore('messages'),
      [i, a] = await Promise.all([OE(r), _E(n)]);
    return (await wE(t), { conversations: i, messageCounts: a });
  } finally {
    e.close();
  }
}
function nn(e) {
  if (!e || typeof e.ok != 'boolean') throw new Error('no response from background');
  if (e.ok) return e.data;
  const t = e.error?.message ?? 'unknown error';
  throw new Error(t);
}
function IE(e) {
  if (!e) return '';
  try {
    return new Date(e).toLocaleString();
  } catch {
    return String(e);
  }
}
function Zm(e) {
  const t = Math.max(0, Number(e.total) || 0),
    r = Math.min(t || 0, Math.max(0, Number(e.done) || 0)),
    n = t ? Math.floor((r / t) * 100) : 0,
    i = {
      conversations: w('importStageConversations'),
      messages: w('importStageMessages'),
      mappings: w('importStageMappings'),
      settings: w('importStageSettings'),
    },
    a = String(e.stage || '').trim(),
    o = a ? i[a] || a : '',
    s = o ? ` ${o}` : '';
  return { pct: n, text: `${w('importingDots')} ${n}% (${r}/${t})${s}`.trim() };
}
async function TE(e) {
  if (!e) return !1;
  const t = e.name ? String(e.name).toLowerCase() : '',
    r = e.type ? String(e.type).toLowerCase() : '';
  if (t.endsWith('.zip') || r.includes('zip')) return !0;
  try {
    const n = new Uint8Array(await e.slice(0, 4).arrayBuffer());
    return n.length < 4
      ? !1
      : n[0] === 80 &&
          n[1] === 75 &&
          ((n[2] === 3 && n[3] === 4) || (n[2] === 5 && n[3] === 6) || (n[2] === 7 && n[3] === 8));
  } catch {
    return !1;
  }
}
function Io(e) {
  const t = String(e || '').trim();
  if (!/^https?:\/\//i.test(t)) return !1;
  try {
    const r = globalThis,
      n = r.browser?.tabs ?? r.chrome?.tabs;
    if (n?.create) return (n.create({ url: t }), !0);
  } catch {}
  try {
    return (window.open(t, '_blank', 'noopener,noreferrer'), !0);
  } catch {
    return !1;
  }
}
const Kc = 'about_you_user_name';
function Wc(e) {
  return String(e ?? '').trim();
}
const To = kd('notion'),
  Mo = kd('obsidian'),
  Do = kd('feishu'),
  ME = ['notion_db_id_syncnos_ai_chats', 'notion_db_id_syncnos_web_articles', 'notion_db_id_syncnos_videos'],
  DE = { title: 'SyncNos-AI Chats', storageKey: 'notion_db_id_syncnos_ai_chats' },
  RE = { title: 'SyncNos-Web Articles', storageKey: 'notion_db_id_syncnos_web_articles' },
  LE = { title: 'SyncNos-Videos', storageKey: 'notion_db_id_syncnos_videos' };
function Hc(e, t) {
  try {
    const r = tw?.getNotionDbSpecByKindId?.(e),
      n = String(r?.storageKey || '').trim(),
      i = String(r?.title || '').trim();
    if (n && i) return { storageKey: n, title: i };
  } catch {}
  return { ...t };
}
function Jm() {
  try {
    const e = tw?.getNotionStorageKeys?.();
    if (Array.isArray(e) && e.length) return Array.from(new Set(e.map((t) => String(t || '').trim()).filter(Boolean)));
  } catch {}
  return ME.slice();
}
function $E() {
  try {
    const e = String(globalThis.navigator?.userAgent || '').toLowerCase();
    return e ? e.includes('firefox') || e.includes('librewolf') || e.includes('zen') : !1;
  } catch {
    return !1;
  }
}
function FE() {
  try {
    return String(globalThis.location?.pathname || '')
      .toLowerCase()
      .includes('popup.html');
  } catch {
    return !1;
  }
}
function Qm(e, t) {
  return e instanceof Error && e.message ? e.message : String(e || '').trim() || t;
}
function BE(e) {
  const t = [];
  for (const r of e || []) {
    const n = Number(r?.index);
    if (!Number.isFinite(n) || n < 0) continue;
    const i = t[n] || {};
    (r.field === 'domain' && (i.domain = r.message), r.field === 'referer' && (i.referer = r.message), (t[n] = i));
  }
  return t;
}
function UE(e) {
  const t = String(e || '')
    .trim()
    .toLowerCase();
  return t === 'supported' || t === 'all' || t === 'off' ? t : null;
}
function zE(e) {
  return e === !0 ? 'supported' : 'all';
}
function KE(e) {
  const { activeSection: t, focusKey: r = '' } = e,
    [n, i] = d.useState(0),
    a = n > 0,
    [o, s] = d.useState(null),
    l = d.useRef(Promise.resolve()),
    [c, u] = d.useState(null),
    [f, h] = d.useState(''),
    [m, p] = d.useState(''),
    [v, g] = d.useState(''),
    [b, S] = d.useState(''),
    [x, A] = d.useState(''),
    [C, P] = d.useState(''),
    [_, E] = d.useState([]),
    [j, N] = d.useState(!1),
    [M, O] = d.useState(!1),
    D = d.useRef(!1),
    [B, Y] = d.useState(!0),
    [Q, se] = d.useState(null),
    [V, T] = d.useState(''),
    [F, W] = d.useState(''),
    [z, H] = d.useState(''),
    [G, le] = d.useState(''),
    [fe, te] = d.useState(''),
    [ne, $] = d.useState(!1),
    [U, ie] = d.useState(!0),
    [R, pe] = d.useState(''),
    [ce, be] = d.useState(''),
    [de, K] = d.useState(''),
    [ae, we] = d.useState(''),
    [me, $e] = d.useState(''),
    [We, Et] = d.useState(''),
    [Kt, pt] = d.useState(!1),
    [oe, Ae] = d.useState(''),
    [Oe, _e] = d.useState(''),
    [rt, Dt] = d.useState(''),
    [Wt, Ht] = d.useState(''),
    [xt, nr] = d.useState(w('statusIdle')),
    [oc, Ui] = d.useState(!0),
    [sc, zi] = d.useState(w('statusIdle')),
    [lc, en] = d.useState(w('statusReady')),
    [cc, uo] = d.useState(null),
    [uc, fo] = d.useState(0),
    Jn = d.useRef(null),
    ho = d.useRef(null),
    mo = d.useRef(null),
    [Ki, Wi] = d.useState(''),
    fr = d.useMemo(() => Hc('chat', DE), []),
    dr = d.useMemo(() => Hc('article', RE), []),
    hr = d.useMemo(() => Hc('video', LE), []),
    [fc, dc] = d.useState(!1),
    [Hi, Qn] = d.useState(''),
    [qi, Sn] = d.useState(''),
    [Vi, ei] = d.useState(''),
    [hc, po] = d.useState('all'),
    [mc, vo] = d.useState(!0),
    [pc, go] = d.useState(!1),
    [vc, yo] = d.useState(!1),
    [gc, yc] = d.useState(!1),
    [Gi, tn] = d.useState(() => cE()),
    [bc, Er] = d.useState([]),
    [wc, bo] = d.useState(!0),
    [xc, Yi] = d.useState(() => Oo('')),
    [Xi, wo] = d.useState(Pm),
    [ti, Zi] = d.useState(Tc.slice()),
    xo = d.useRef(!1),
    [Sc, So] = d.useState(null),
    [Ji, Ao] = d.useState(!1),
    [Ac, Po] = d.useState(''),
    [Qi, Pc] = d.useState(!1),
    [An, Co] = d.useState('7d'),
    Pe = d.useRef(null),
    [Cc, Oc] = d.useState(''),
    xm = d.useMemo(() => FE(), []),
    _c = d.useMemo(() => xm && $E(), [xm]),
    ee = d.useCallback(async (k, q = {}) => {
      const L = l.current.then(async () => {
        const { useBusy: J = !0, clearError: ue = !0, fallbackMessage: Ee = 'failed', onError: ut } = q;
        (ue && s(null), J && i((Ve) => Ve + 1));
        try {
          return (await k(), !0);
        } catch (Ve) {
          const ni = Qm(Ve, Ee);
          return (s(ni), ut && ut(ni), !1);
        } finally {
          J && i((Ve) => (Ve <= 0 ? 0 : Ve - 1));
        }
      });
      return (
        (l.current = L.then(
          () => {},
          () => {},
        )),
        L
      );
    }, []),
    uC = d.useCallback(() => {
      s(null);
    }, []),
    ri = d.useCallback(async () => {
      const [k, q, L, J, ue] = await Promise.all([
          rn(ts.GET_AUTH_STATUS, {}),
          rn(Af.GET_AUTH_STATUS, {}),
          Ed([
            'notion_oauth_client_id',
            'notion_oauth_pending_state',
            'notion_oauth_last_error',
            'notion_parent_page_id',
            'notion_parent_page_title',
            'feishu_oauth_client_id',
            'feishu_oauth_client_secret',
            'feishu_oauth_pending_state',
            'feishu_oauth_last_error',
            'feishu_oauth_token_exchange_proxy_url',
            'notion_ai_preferred_model_index',
            fr.storageKey,
            dr.storageKey,
            hr.storageKey,
            To,
            Do,
            Mo,
            'inpage_display_mode',
            'inpage_supported_only',
            'ai_chat_auto_save_enabled',
            'ai_chat_cache_images_enabled',
            'web_article_cache_images_enabled',
            qm,
            'ai_chat_dollar_mention_enabled',
            _o,
            Of,
            Kc,
          ]),
          rn(Rc.GET_SETTINGS, {}),
          lE({ forceRefresh: !0 }),
        ]),
        Ee = nn(k),
        ut = !!Ee?.connected;
      (u(ut),
        h(String(Ee?.workspaceName || Ee?.token?.workspaceName || '')),
        ut || (O(!1), N(!1), E([])),
        S(String(L?.notion_oauth_client_id || '')),
        p(String(L?.notion_oauth_pending_state || '')),
        g(String(L?.notion_oauth_last_error || '')),
        A(String(L?.notion_parent_page_id || '')),
        P(String(L?.notion_parent_page_title || '')),
        Wi(String(L?.notion_ai_preferred_model_index || '')),
        Qn(String(L?.[fr.storageKey] || '')),
        Sn(String(L?.[dr.storageKey] || '')),
        ei(String(L?.[hr.storageKey] || '')),
        Y(L?.[To] !== !1),
        ie(L?.[Do] !== !1),
        Ui(L?.[Mo] !== !1));
      const ni = !!nn(q)?.connected;
      (se(ni),
        ni || $(!1),
        H(String(L?.feishu_oauth_client_id || '')),
        le(String(L?.feishu_oauth_client_secret || '')),
        T(String(L?.feishu_oauth_pending_state || '')),
        W(String(L?.feishu_oauth_last_error || '')),
        te(String(L?.feishu_oauth_token_exchange_proxy_url || '')));
      const Nc = await Tw().catch(() => null);
      (pe(String(Nc?.chatFolder || nt.chatFolder)),
        be(String(Nc?.articleFolder || nt.articleFolder)),
        K(String(Nc?.videoFolder || nt.videoFolder)));
      const YC = UE(L?.inpage_display_mode);
      (po(YC || zE(L?.inpage_supported_only)),
        vo(L?.ai_chat_auto_save_enabled !== !1),
        go(L?.ai_chat_cache_images_enabled === !0),
        yo(L?.web_article_cache_images_enabled === !0),
        tn(Array.isArray(ue) ? ue : []),
        Er([]),
        bo(L?.ai_chat_dollar_mention_enabled !== !1),
        Yi(Oo(L?.[_o])),
        fo(Number(L?.[Of] || 0) || 0),
        Oc(Wc(L?.[Kc])));
      const Pn = nn(J);
      (we(String(Pn?.apiBaseUrl || '')),
        $e(String(Pn?.authHeaderName || '')),
        pt(!!Pn?.apiKeyPresent),
        Ae(String(Pn?.apiKeyMasked || '')),
        _e(String(Pn?.chatFolder || '')),
        Dt(String(Pn?.articleFolder || '')),
        Ht(String(Pn?.videoFolder || '')),
        Et(''),
        nr(w('statusIdle')));
      const Ic = await fl();
      (wo(String(Ic.promptTemplate || Pm)),
        Zi(Array.isArray(Ic.platforms) ? Ic.platforms : Tc.slice()),
        (xo.current = !0));
    }, [dr.storageKey, fr.storageKey, hr.storageKey]),
    kt = d.useCallback(async () => {
      await ee(ri);
    }, [ri, ee]);
  (d.useEffect(() => {
    kt();
  }, [kt]),
    d.useEffect(
      () =>
        aO((k, q) => {
          if (q === 'local' && !(!k || typeof k != 'object')) {
            if (Object.prototype.hasOwnProperty.call(k, To)) {
              const L = k[To]?.newValue;
              Y(L !== !1);
            }
            if (Object.prototype.hasOwnProperty.call(k, Mo)) {
              const L = k[Mo]?.newValue;
              Ui(L !== !1);
            }
            if (Object.prototype.hasOwnProperty.call(k, Do)) {
              const L = k[Do]?.newValue;
              ie(L !== !1);
            }
            if (Object.prototype.hasOwnProperty.call(k, _o)) {
              const L = k[_o]?.newValue;
              Yi(Oo(L));
            }
            if (
              (Object.prototype.hasOwnProperty.call(k, qm) && kt(),
              (Object.prototype.hasOwnProperty.call(k, 'notion_oauth_token_v1') ||
                Object.prototype.hasOwnProperty.call(k, 'notion_oauth_pending_state') ||
                Object.prototype.hasOwnProperty.call(k, 'notion_oauth_last_error')) &&
                kt(),
              (Object.prototype.hasOwnProperty.call(k, 'feishu_oauth_token_v1') ||
                Object.prototype.hasOwnProperty.call(k, 'feishu_oauth_pending_state') ||
                Object.prototype.hasOwnProperty.call(k, 'feishu_oauth_last_error')) &&
                kt(),
              Object.prototype.hasOwnProperty.call(k, St.chatFolder))
            ) {
              const L = k[St.chatFolder]?.newValue;
              pe($r(L, nt.chatFolder));
            }
            if (Object.prototype.hasOwnProperty.call(k, St.articleFolder)) {
              const L = k[St.articleFolder]?.newValue;
              be($r(L, nt.articleFolder));
            }
            if (Object.prototype.hasOwnProperty.call(k, St.videoFolder)) {
              const L = k[St.videoFolder]?.newValue;
              K($r(L, nt.videoFolder));
            }
          }
        }),
      [kt],
    ));
  const fC = d.useCallback(async () => {
    a ||
      (await ee(
        async () => {
          const k = await eE({ chatFolder: R, articleFolder: ce, videoFolder: de });
          (pe(String(k.chatFolder || nt.chatFolder)),
            be(String(k.articleFolder || nt.articleFolder)),
            K(String(k.videoFolder || nt.videoFolder)));
        },
        { fallbackMessage: 'save feishu paths failed' },
      ));
  }, [a, ce, R, de, ee]);
  (d.useEffect(() => {
    if (!M) return;
    const k = Date.now(),
      q = setInterval(() => {
        if (Date.now() - k > 6e4) {
          O(!1);
          return;
        }
        kt();
      }, 750);
    return () => clearInterval(q);
  }, [M, kt]),
    d.useEffect(() => {
      if (M) {
        if (c) {
          O(!1);
          return;
        }
        if (v) {
          O(!1);
          return;
        }
        m || O(!1);
      }
    }, [c, v, m, M]),
    d.useEffect(() => {
      if (!ne) return;
      const k = Date.now(),
        q = setInterval(() => {
          if (Date.now() - k > 6e4) {
            $(!1);
            return;
          }
          kt();
        }, 750);
      return () => clearInterval(q);
    }, [ne, kt]),
    d.useEffect(() => {
      if (ne) {
        if (Q) {
          $(!1);
          return;
        }
        if (F) {
          $(!1);
          return;
        }
        V || $(!1);
      }
    }, [Q, F, V, ne]));
  const Ec = d.useMemo(() => {
      const k = Array.isArray(_) ? _.slice() : [],
        q = String(x || '').trim();
      if (q && !k.some((J) => String(J?.id || '').trim() === q)) {
        const J = String(C || '').trim();
        k.unshift({ id: q, title: J || q });
      }
      const L = new Set();
      return k.filter((J) => {
        const ue = J && J.id ? String(J.id).trim() : '';
        return !ue || L.has(ue) ? !1 : (L.add(ue), !0);
      });
    }, [_, x, C]),
    dC = d.useCallback(async () => {
      await ee(async () => {
        if (nn(await rn(ts.GET_AUTH_STATUS, {}))?.connected) {
          (await Y_(), u(!1), h(''), p(''), g(''), E([]), A(''), P(''), O(!1), N(!1), await ri());
          return;
        }
        const q = String(b || '').trim();
        if (!q) throw new Error('Notion OAuth client id not configured');
        const L = X_(),
          J = `webclipper_${Math.random().toString(16).slice(2)}_${Date.now()}`;
        (await Fe({ notion_oauth_pending_state: J, notion_oauth_last_error: '' }), p(J), g(''));
        const ue = new URL(L.authorizationUrl);
        if (
          (ue.searchParams.set('client_id', q),
          ue.searchParams.set('response_type', L.responseType),
          ue.searchParams.set('owner', L.owner),
          ue.searchParams.set('redirect_uri', L.redirectUri),
          ue.searchParams.set('state', J),
          !Io(ue.toString()))
        )
          throw new Error('Failed to open Notion OAuth tab');
        O(!0);
      });
    }, [b, ri, ee]),
    hC = d.useCallback(
      async (k) => {
        await ee(
          async () => {
            (await Mc('notion', k), Y(k));
          },
          { fallbackMessage: 'save notion sync enabled failed' },
        );
      },
      [ee],
    ),
    mC = d.useCallback(
      async (k) => {
        await ee(
          async () => {
            (await Mc('obsidian', k), Ui(k));
          },
          { fallbackMessage: 'save obsidian sync enabled failed' },
        );
      },
      [ee],
    ),
    pC = d.useCallback(
      async (k) => {
        await ee(
          async () => {
            (await Mc('feishu', k), ie(k));
          },
          { fallbackMessage: 'save feishu sync enabled failed' },
        );
      },
      [ee],
    ),
    Sm = (k) => {
      const q = String(k || '').trim();
      if (!q) return '';
      try {
        const L = new URL(q);
        return L.protocol !== 'https:' ? '' : L.toString();
      } catch {
        return '';
      }
    },
    vC = d.useCallback(async () => {
      await ee(
        async () => {
          const k = String(z || '').trim(),
            q = String(G || '').trim(),
            L = String(fe || '').trim(),
            J = L ? Sm(L) : '';
          if (L && !J) throw new Error('Feishu token exchange proxy url must be https');
          (await Fe({
            feishu_oauth_client_id: k,
            feishu_oauth_client_secret: q,
            feishu_oauth_token_exchange_proxy_url: J,
          }),
            te(J),
            H(k),
            le(q));
        },
        { fallbackMessage: 'save feishu settings failed' },
      );
    }, [z, G, fe, ee]),
    gC = d.useCallback(async () => {
      await ee(async () => {
        if (nn(await rn(Af.GET_AUTH_STATUS, {}))?.connected) {
          (await J_(), se(!1), T(''), W(''), $(!1), await ri());
          return;
        }
        const q = String(z || '').trim();
        if (!q) throw new Error('Feishu OAuth client id not configured');
        const L = String(G || '').trim(),
          J = String(fe || '').trim(),
          ue = J ? Sm(J) : '';
        if (J && !ue) throw new Error('Feishu token exchange proxy url must be https');
        if (!L && !ue)
          throw new Error('Feishu OAuth requires client secret (direct) or token exchange proxy url (worker)');
        (await Fe({
          feishu_oauth_client_id: q,
          feishu_oauth_client_secret: L,
          feishu_oauth_token_exchange_proxy_url: ue,
        }),
          te(ue),
          H(q),
          le(L));
        const Ee = Q_(),
          ut = `webclipper_${Math.random().toString(16).slice(2)}_${Date.now()}`;
        (await Fe({ feishu_oauth_pending_state: ut, feishu_oauth_last_error: '' }), T(ut), W(''));
        const Ve = new URL(Ee.authorizationUrl);
        if (
          (Ve.searchParams.set('client_id', q),
          Ve.searchParams.set('app_id', q),
          Ve.searchParams.set('redirect_uri', Ee.redirectUri),
          Ve.searchParams.set('state', ut),
          Ve.searchParams.set('response_type', Ee.responseType),
          Ve.searchParams.set('scope', Ee.scope),
          !Io(Ve.toString()))
        )
          throw new Error('Failed to open Feishu OAuth tab');
        $(!0);
      });
    }, [z, G, fe, ri, ee]),
    yC = d.useMemo(
      () =>
        Q == null
          ? w('statusUnknown')
          : Q
            ? `${w('statusConnected')} ✅`
            : F
              ? w('statusError')
              : V
                ? w('statusWaiting')
                : w('statusNotConnected'),
      [Q, F, V],
    ),
    kc = d.useCallback(async () => {
      (N(!0),
        await ee(
          async () => {
            const k = String(x || '').trim(),
              q = String(C || '').trim(),
              L = nn(await rn(ts.LIST_PARENT_PAGES, {})),
              J = Array.isArray(L?.pages) ? L.pages : [],
              ue = L?.resolvedSaved ? L.resolvedSaved : null;
            E(J);
            const Ee = k || J[0]?.id || '',
              ut = (ue?.title || (k ? q : J[0]?.title) || '').trim();
            (Ee && A(Ee), ut && P(ut), k && Ee && Ee !== k && (await Dc(Jm())));
            const Ve = {};
            (Ee && Ee !== k && (Ve.notion_parent_page_id = Ee),
              ut && ut !== q && (Ve.notion_parent_page_title = ut),
              Object.keys(Ve).length && (await Fe(Ve)));
          },
          { useBusy: !1, fallbackMessage: 'failed to load pages' },
        ),
        N(!1));
    }, [x, C, ee]);
  d.useEffect(() => {
    if (!c) {
      D.current = !1;
      return;
    }
    if (!D.current) {
      if (Ec.length) {
        D.current = !0;
        return;
      }
      ((D.current = !0), kc());
    }
  }, [c, Ec.length, kc]);
  const bC = d.useCallback(
      async (k) => {
        const q = String(k || '').trim();
        if (!q) return;
        const L = String(x || '').trim();
        await ee(async () => {
          (L && q !== L && (await Dc(Jm())), A(q));
          const J = _.find((Ee) => Ee && String(Ee.id || '').trim() === q) ?? null;
          J && J.title && P(String(J.title || '').trim());
          const ue = { notion_parent_page_id: q };
          (J && J.title && (ue.notion_parent_page_title = String(J.title || '').trim()), await Fe(ue));
        });
      },
      [_, x, ee],
    ),
    wC = d.useCallback(async () => {
      (await ee(async () => {
        const q = String(Ki || '').trim(),
          L = q ? Number(q) : NaN;
        if (!q) await Fe({ notion_ai_preferred_model_index: '' });
        else {
          if (!Number.isFinite(L) || L <= 0) throw new Error('Invalid model index');
          await Fe({ notion_ai_preferred_model_index: Math.floor(L) });
        }
      })) && (await kt());
    }, [Ki, kt, ee]),
    xC = d.useCallback(async () => {
      (await ee(async () => {
        await Fe({ notion_ai_preferred_model_index: '' });
      })) && (await kt());
    }, [kt, ee]),
    SC = d.useCallback(() => {
      dc((k) => !k);
    }, []),
    AC = d.useCallback(
      async (k) => {
        const q = k === 'chat' ? fr : k === 'article' ? dr : hr,
          J = tE(String((k === 'chat' ? Hi : k === 'article' ? qi : Vi) || ''));
        await ee(
          async () => {
            (await Fe({ [q.storageKey]: J }), k === 'chat' ? Qn(J) : k === 'article' ? Sn(J) : ei(J));
          },
          { fallbackMessage: 'save notion database id failed' },
        );
      },
      [dr, fr, qi, Hi, Vi, ee, hr],
    ),
    PC = d.useCallback(
      async (k) => {
        const q = k === 'chat' ? fr : k === 'article' ? dr : hr;
        await ee(
          async () => {
            (await Dc([q.storageKey]), k === 'chat' ? Qn('') : k === 'article' ? Sn('') : ei(''));
          },
          { fallbackMessage: 'reset notion database id failed' },
        );
      },
      [dr, fr, ee, hr],
    ),
    CC = d.useCallback(
      async ({ includeApiKey: k } = {}) => {
        if (a) return;
        (nr(w('statusSaving')),
          (await ee(
            async () => {
              const L = { apiBaseUrl: ae, authHeaderName: me, chatFolder: Oe, articleFolder: rt, videoFolder: Wt };
              k === !0 && String(We || '').trim() && (L.apiKey = We);
              const J = await rn(Rc.SAVE_SETTINGS, L),
                ue = nn(J);
              (we(String(ue?.apiBaseUrl || '')),
                $e(String(ue?.authHeaderName || '')),
                pt(!!ue?.apiKeyPresent),
                Ae(String(ue?.apiKeyMasked || '')),
                _e(String(ue?.chatFolder || '')),
                Dt(String(ue?.articleFolder || '')),
                Ht(String(ue?.videoFolder || '')),
                Et(''));
            },
            {
              fallbackMessage: 'failed',
              onError: () => {
                nr(w('statusError'));
              },
            },
          )) && nr(w('statusSaved')));
      },
      [a, ae, We, rt, me, Oe, Wt, ee],
    ),
    OC = d.useCallback(async () => {
      (nr(w('statusTesting')),
        await ee(
          async () => {
            const k = await rn(Rc.TEST_CONNECTION, {}),
              q = nn(k),
              L = q && q.ok === !0,
              J = q && q.message ? String(q.message) : '';
            nr(L ? `${w('statusOk')} ✓ ${J}`.trim() : `${w('statusError')}: ${J || w('phaseFailed')}`);
          },
          {
            fallbackMessage: 'failed',
            onError: (k) => {
              nr(`${w('statusError')}: ${k}`);
            },
          },
        ));
    }, [ee]),
    _C = d.useCallback(
      async (k) => {
        await ee(async () => {
          (await Fe({ inpage_display_mode: k }), po(k));
        });
      },
      [ee],
    ),
    EC = d.useCallback(
      async (k) => {
        await ee(async () => {
          (await Fe({ ai_chat_auto_save_enabled: k === !0 }), vo(k === !0));
        });
      },
      [ee],
    ),
    kC = d.useCallback(
      async (k) => {
        await ee(async () => {
          (await Fe({ ai_chat_cache_images_enabled: k === !0 }), go(k === !0));
        });
      },
      [ee],
    ),
    jC = d.useCallback(
      async (k) => {
        await ee(async () => {
          (await Fe({ web_article_cache_images_enabled: k === !0 }), yo(k === !0));
        });
      },
      [ee],
    ),
    NC = d.useCallback(() => {
      yc((k) => !k);
    }, []),
    IC = d.useCallback((k, q) => {
      (tn((L) => {
        const J = Array.isArray(L) ? L : [];
        return k < 0 || k >= J.length
          ? J
          : J.map((ue, Ee) =>
              Ee !== k
                ? ue
                : {
                    domain: q.domain == null ? String(ue.domain || '') : String(q.domain),
                    referer: q.referer == null ? String(ue.referer || '') : String(q.referer),
                  },
            );
      }),
        Er((L) => {
          const J = Array.isArray(L) ? L.slice() : [];
          if (k < 0 || k >= J.length) return J;
          const ue = { ...(J[k] || {}) };
          return (
            Object.prototype.hasOwnProperty.call(q, 'domain') && delete ue.domain,
            Object.prototype.hasOwnProperty.call(q, 'referer') && delete ue.referer,
            (J[k] = ue),
            J
          );
        }));
    }, []),
    TC = d.useCallback(() => {
      (tn((k) => (Array.isArray(k) ? k : []).concat([{ domain: '', referer: 'https://' }])),
        Er((k) => {
          const q = Array.isArray(k) ? k.slice() : [];
          return (q.push({}), q);
        }));
    }, []),
    MC = d.useCallback((k) => {
      (tn((q) => {
        const L = Array.isArray(q) ? q : [];
        return k < 0 || k >= L.length ? L : L.filter((J, ue) => ue !== k);
      }),
        Er((q) => {
          const L = Array.isArray(q) ? q : [];
          return k < 0 || k >= L.length ? L : L.filter((J, ue) => ue !== k);
        }));
    }, []),
    DC = d.useCallback(async () => {
      await ee(
        async () => {
          const k = await uE(Gi);
          if (!k.ok) {
            Er(BE(k.issues));
            return;
          }
          (tn(k.rules.map((q) => ({ domain: String(q.domain || ''), referer: String(q.referer || '') }))), Er([]));
        },
        { useBusy: !1, clearError: !1, fallbackMessage: 'save anti-hotlink rules failed' },
      );
    }, [Gi, ee]),
    RC = d.useCallback(async () => {
      await ee(
        async () => {
          const k = await fE();
          (tn(k), Er([]));
        },
        { useBusy: !1, clearError: !1, fallbackMessage: 'reset anti-hotlink rules failed' },
      );
    }, [ee]),
    LC = d.useCallback(
      async (k) => {
        await ee(async () => {
          (await Fe({ ai_chat_dollar_mention_enabled: k === !0 }), bo(k === !0));
        });
      },
      [ee],
    ),
    $C = d.useCallback(
      async (k) => {
        const q = Oo(k);
        await ee(
          async () => {
            (await Fe(oO(q)), Yi(q));
          },
          { fallbackMessage: 'save markdown reading profile failed' },
        );
      },
      [ee],
    ),
    FC = d.useCallback(async () => {
      xo.current &&
        (await ee(
          async () => {
            await sO({ promptTemplate: String(Xi || ''), platforms: Array.isArray(ti) ? ti : [] });
          },
          { useBusy: !1, clearError: !1, fallbackMessage: 'save chat with settings failed' },
        ));
    }, [ti, Xi, ee]);
  (d.useEffect(() => {
    t === 'aboutyou' &&
      (Qi ||
        Ji ||
        (Ao(!0),
        Po(''),
        NE()
          .then((k) => {
            Pe.current = k;
            const q = Ym(An);
            So(Xm(k, q));
          })
          .catch((k) => {
            Po(Qm(k, w('insightLoadFailed')));
          })
          .finally(() => {
            (Ao(!1), Pc(!0));
          })));
  }, [t, Qi, Ji, An]),
    d.useEffect(() => {
      if (t !== 'aboutyou') return;
      const k = Pe.current;
      if (!k) return;
      const q = Ym(An);
      So(Xm(k, q));
    }, [t, An]));
  const BC = d.useCallback(async () => {
      await ee(async () => {
        (await lO(), Zi(Tc.slice()));
      });
    }, [ee]),
    UC = d.useCallback(async () => {
      a ||
        (zi(w('backupExporting')),
        await ee(
          async () => {
            const k = await B_(),
              q = URL.createObjectURL(k.blob),
              L = document.createElement('a');
            ((L.href = q),
              (L.download = k.filename),
              L.click(),
              zi(
                `${w('backupExported')} (${w('statsConversations')} ${k.counts.conversations}, ${w('statsMessages')} ${k.counts.messages}, ${w('statsComments')} ${k.counts.article_comments})`,
              ),
              fo(Date.parse(k.exportedAt) || Date.now()),
              setTimeout(() => URL.revokeObjectURL(q), 6e4));
          },
          {
            fallbackMessage: 'export failed',
            onError: (k) => {
              zi(`${w('statusError')}: ${k}`);
            },
          },
        ));
    }, [a, ee]),
    zC = d.useCallback(
      async (k) => {
        if (!a) {
          (uo(null),
            en(`${w('backupImportingFile')}: ${k.name}`),
            await ee(
              async () => {
                const q = await TE(k);
                let L;
                if (q) {
                  const J = await cO(k);
                  L = await V_(J, (ue) => {
                    const Ee = Zm(ue);
                    en(Ee.text);
                  });
                } else {
                  const J = await k.text(),
                    ue = JSON.parse(J);
                  L = await q_(ue, (Ee) => {
                    const ut = Zm(Ee);
                    en(ut.text);
                  });
                }
                (uo(L), en(w('backupImported')));
              },
              {
                fallbackMessage: 'import failed',
                onError: (q) => {
                  en(`${w('statusError')}: ${q}`);
                },
              },
            ));
          try {
            Jn.current && (Jn.current.value = '');
          } catch {}
        }
      },
      [a, ee],
    ),
    Am = d.useCallback(async () => {
      await uO({ route: '/settings' });
    }, []),
    KC = d.useCallback(async () => {
      if (!a) {
        if (!_c) {
          Jn.current?.click();
          return;
        }
        (en(w('backupImportInAppFirefox')), await Am());
        try {
          window.close();
        } catch {}
      }
    }, [a, Am, _c]),
    WC = d.useCallback(() => {
      Io('https://github.com/chiimagnus/SyncNos/blob/main/.github/guide/obsidian/LocalRestAPI.zh.md');
    }, []),
    jc = d.useMemo(() => {
      try {
        return String(globalThis.navigator?.language || '')
          .toLowerCase()
          .startsWith('zh')
          ? 'https://github.com/chiimagnus/SyncNos/blob/main/.github/guide/feishu/DocxSync.zh.md'
          : 'https://github.com/chiimagnus/SyncNos/blob/main/.github/guide/feishu/DocxSync.en.md';
      } catch {
        return 'https://github.com/chiimagnus/SyncNos/blob/main/.github/guide/feishu/DocxSync.en.md';
      }
    }, []),
    HC = d.useCallback(() => {
      Io(jc);
    }, [jc]),
    qC = d.useMemo(() => {
      if (c == null) return w('statusUnknown');
      if (c) {
        const k = String(f || '').trim();
        return k ? `${w('statusConnected')} ✅ (${k})` : `${w('statusConnected')} ✅`;
      }
      return v ? w('statusError') : m ? w('statusWaiting') : w('statusNotConnected');
    }, [c, v, m, f]);
  (d.useEffect(() => {
    t === 'backup' && r === 'import' && ho.current?.scrollIntoView({ block: 'start' });
  }, [t, r]),
    d.useEffect(() => {
      t === 'notion' && r === 'notion-ai' && mo.current?.scrollIntoView({ block: 'start' });
    }, [t, r]));
  const VC = d.useCallback((k) => {
      Oc(Wc(k));
    }, []),
    GC = d.useCallback(async () => {
      const k = Wc(Cc);
      await ee(
        async () => {
          (await Fe({ [Kc]: k }), Oc(k));
        },
        { useBusy: !1, clearError: !1, fallbackMessage: 'save user name failed' },
      );
    }, [Cc, ee]);
  return {
    busy: a,
    error: o,
    clearError: uC,
    notionSyncEnabled: B,
    onToggleNotionSyncEnabled: hC,
    notionConnected: c,
    pollingNotion: M,
    loadingNotionPages: j,
    notionAiModelIndex: Ki,
    setNotionAiModelIndex: Wi,
    onSaveNotionAiModelIndex: wC,
    onResetNotionAiModelIndex: xC,
    notionAdvancedOpen: fc,
    onToggleNotionAdvancedOpen: SC,
    notionChatDatabaseId: Hi,
    setNotionChatDatabaseId: Qn,
    notionArticleDatabaseId: qi,
    setNotionArticleDatabaseId: Sn,
    notionVideoDatabaseId: Vi,
    setNotionVideoDatabaseId: ei,
    notionChatDatabaseLabel: fr.title,
    notionArticleDatabaseLabel: dr.title,
    notionVideoDatabaseLabel: hr.title,
    onSaveNotionDatabaseId: AC,
    onResetNotionDatabaseId: PC,
    notionAiRef: mo,
    notionParentPageId: x,
    notionPageOptions: Ec,
    notionStatusText: qC,
    onNotionConnectOrDisconnect: dC,
    onSaveNotionParentPage: bC,
    onLoadNotionPages: kc,
    feishuSyncEnabled: U,
    onToggleFeishuSyncEnabled: pC,
    feishuConnected: Q,
    pollingFeishu: ne,
    feishuPendingState: V,
    feishuLastError: F,
    feishuClientId: z,
    setFeishuClientId: H,
    feishuClientSecret: G,
    setFeishuClientSecret: le,
    feishuTokenExchangeProxyUrl: fe,
    setFeishuTokenExchangeProxyUrl: te,
    feishuChatFolder: R,
    setFeishuChatFolder: pe,
    feishuArticleFolder: ce,
    setFeishuArticleFolder: be,
    feishuVideoFolder: de,
    setFeishuVideoFolder: K,
    feishuStatusText: yC,
    onSaveFeishuPaths: fC,
    onSaveFeishuAdvancedSettings: vC,
    onFeishuConnectOrDisconnect: gC,
    onOpenFeishuSetupGuide: HC,
    feishuSetupGuideUrl: jc,
    obsidianSyncEnabled: oc,
    onToggleObsidianSyncEnabled: mC,
    obsidianApiBaseUrl: ae,
    setObsidianApiBaseUrl: we,
    obsidianAuthHeaderName: me,
    setObsidianAuthHeaderName: $e,
    obsidianApiKeyDraft: We,
    setObsidianApiKeyDraft: Et,
    obsidianApiKeyPresent: Kt,
    obsidianApiKeyMasked: oe,
    obsidianChatFolder: Oe,
    setObsidianChatFolder: _e,
    obsidianArticleFolder: rt,
    setObsidianArticleFolder: Dt,
    obsidianVideoFolder: Wt,
    setObsidianVideoFolder: Ht,
    obsidianStatus: xt,
    onSaveObsidianSettings: CC,
    onTestObsidianConnection: OC,
    onOpenObsidianSetupGuide: WC,
    exportStatus: sc,
    importStatus: lc,
    importStats: cc,
    lastBackupExportAt: uc,
    backupImportRef: ho,
    fileInputRef: Jn,
    useAppImport: _c,
    handleBackupExport: UC,
    importFromFile: zC,
    handleBackupImportClick: KC,
    inpageDisplayMode: hc,
    onChangeInpageDisplayMode: _C,
    aiChatAutoSaveEnabled: mc,
    onToggleAiChatAutoSaveEnabled: EC,
    aiChatCacheImagesEnabled: pc,
    onToggleAiChatCacheImagesEnabled: kC,
    webArticleCacheImagesEnabled: vc,
    onToggleWebArticleCacheImagesEnabled: jC,
    antiHotlinkAdvancedOpen: gc,
    onToggleAntiHotlinkAdvancedOpen: NC,
    antiHotlinkRules: Gi,
    antiHotlinkRuleErrors: bc,
    onChangeAntiHotlinkRule: IC,
    onAddAntiHotlinkRule: TC,
    onRemoveAntiHotlinkRule: MC,
    onApplyAntiHotlinkRules: DC,
    onResetAntiHotlinkRules: RC,
    aiChatDollarMentionEnabled: wc,
    onToggleAiChatDollarMentionEnabled: LC,
    markdownReadingProfile: xc,
    onChangeMarkdownReadingProfile: $C,
    insightStats: Sc,
    insightLoading: Ji,
    insightError: Ac,
    hasLoadedInsight: Qi,
    insightRange: An,
    setInsightRange: Co,
    aboutYouUserName: Cc,
    onChangeAboutYouUserName: VC,
    onSaveAboutYouUserName: GC,
    chatWithPromptTemplate: Xi,
    setChatWithPromptTemplate: wo,
    chatWithPlatforms: ti,
    setChatWithPlatforms: Zi,
    onSaveChatWithSettings: FC,
    onResetChatWithPlatforms: BC,
  };
}
function WE(e) {
  return w(`section_${e}_label`);
}
function HE(e) {
  const { activeSection: t, onSelectSection: r } = e;
  return y.jsx('aside', {
    className:
      'tw-flex tw-w-[220px] tw-min-h-0 tw-shrink-0 tw-flex-col tw-border-r tw-border-[var(--border)] tw-bg-[var(--bg-sunken)]',
    children: y.jsx('nav', {
      className: 'tw-flex-1 tw-min-h-0 tw-overflow-y-auto tw-overflow-x-hidden tw-px-4 tw-py-5',
      'aria-label': w('settingsSectionsAria'),
      children: y.jsx('div', {
        className: 'tw-flex tw-flex-col tw-gap-4',
        children: hs.map((n, i) =>
          y.jsxs(
            'div',
            {
              className: ['tw-flex tw-flex-col tw-gap-0.5', i === 0 ? '' : 'tw-pt-3'].join(' '),
              children: [
                y.jsx('div', { className: fO(), children: w(n.titleKey) }),
                n.sections.map((a) => {
                  const o = t === a.key,
                    s = WE(a.key);
                  return y.jsx(
                    'button',
                    {
                      type: 'button',
                      onClick: () => r(a.key),
                      className: dO(o),
                      'aria-current': o ? 'page' : void 0,
                      children: y.jsx('div', { className: 'tw-truncate tw-leading-5', children: s }),
                    },
                    a.key,
                  );
                }),
              ],
            },
            i,
          ),
        ),
      }),
    }),
  });
}
function qE(e) {
  return w(`section_${e}_label`);
}
function VE(e) {
  const { activeSection: t, onSelectSection: r, rightSlot: n } = e;
  return y.jsxs('nav', {
    className: 'tw-flex tw-items-center tw-gap-2 tw-px-2 tw-py-2',
    'aria-label': w('settingsSectionsAria'),
    children: [
      y.jsx('div', {
        className: 'tw-min-w-0 tw-flex-1 tw-overflow-x-auto tw-overflow-y-hidden',
        children: y.jsx('div', {
          className: 'tw-flex tw-min-w-max tw-items-center tw-gap-1.5',
          children: hs.map((i, a) =>
            y.jsxs(
              'div',
              {
                className: 'tw-flex tw-items-center tw-gap-1.5',
                children: [
                  i.sections.map((o) => {
                    const s = t === o.key;
                    return y.jsx(
                      'button',
                      {
                        type: 'button',
                        onClick: () => r(o.key),
                        className: [s ? hO() : cs(), 'tw-shrink-0 tw-whitespace-nowrap'].join(' '),
                        'aria-current': s ? 'page' : void 0,
                        children: qE(o.key),
                      },
                      o.key,
                    );
                  }),
                  a === hs.length - 1
                    ? null
                    : y.jsx('span', {
                        className: 'tw-mx-0.5 tw-h-5 tw-w-px tw-shrink-0 tw-bg-[var(--border)] tw-opacity-70',
                        'aria-hidden': 'true',
                      }),
                ],
              },
              a,
            ),
          ),
        }),
      }),
      n ? y.jsx('div', { className: 'tw-shrink-0', children: n }) : null,
    ],
  });
}
const ye =
    'tw-rounded-[var(--radius-card)] tw-border tw-border-[var(--border)] tw-bg-[var(--bg-card)] tw-p-3 tw-shadow-[var(--card-shadow)]',
  Ue = cs(),
  Bw = mO(),
  Ge =
    'tw-min-h-9 tw-rounded-[var(--radius-control)] tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-px-2.5 tw-text-sm tw-text-[var(--text-primary)] tw-transition-colors tw-duration-150 hover:tw-bg-[var(--bg-primary)] focus-visible:tw-border-[var(--focus-ring)] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)] disabled:tw-cursor-not-allowed disabled:tw-opacity-[0.38]',
  fn =
    'tw-size-[18px] tw-cursor-pointer tw-accent-[var(--accent)] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)] disabled:tw-cursor-not-allowed disabled:tw-opacity-[0.38]';
function GE() {
  const e = (() => {
      try {
        const r = pO();
        return String(r?.version || '');
      } catch {
        return '';
      }
    })(),
    t = async (r) => {
      await vO({ url: r });
    };
  return y.jsxs(y.Fragment, {
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aboutSectionAria'),
        children: [
          y.jsxs('div', {
            className: 'tw-flex tw-items-center tw-gap-3',
            children: [
              y.jsx('img', {
                className: 'tw-size-10 tw-rounded-2xl tw-object-contain',
                src: gi('icons/icon-128.png'),
                alt: '',
                draggable: !1,
              }),
              y.jsxs('div', {
                className: 'tw-min-w-0 tw-flex-1',
                children: [
                  y.jsx('div', {
                    className: 'tw-text-base tw-font-black tw-text-[var(--text-primary)]',
                    children: 'SyncNos WebClipper',
                  }),
                  y.jsx('div', {
                    className: 'tw-mt-0.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                    id: 'aboutVersion',
                    children: e ? `${w('versionPrefix')} ${e}` : w('versionPrefix'),
                  }),
                ],
              }),
            ],
          }),
          y.jsxs('div', {
            className: 'tw-mt-3 tw-flex tw-flex-wrap tw-gap-2',
            'aria-label': w('linksAria'),
            children: [
              y.jsx('button', {
                id: 'btnAboutMacApp',
                className: Ue,
                type: 'button',
                onClick: () => t('https://apps.apple.com/app/syncnos/id6755133888').catch(() => {}),
                children: w('macApp'),
              }),
              y.jsx('button', {
                id: 'btnAboutSource',
                className: Ue,
                type: 'button',
                onClick: () => t('https://github.com/chiimagnus/SyncNos').catch(() => {}),
                children: w('sourceCode'),
              }),
              y.jsx('button', {
                id: 'btnAboutChangelog',
                className: Ue,
                type: 'button',
                onClick: () => t('https://chiimagnus.notion.site/syncnos-changelog').catch(() => {}),
                children: w('changelog'),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('authorSectionAria'),
        children: [
          y.jsxs('div', {
            className: 'tw-flex tw-items-center tw-gap-3',
            children: [
              y.jsx('img', {
                className: 'tw-size-10 tw-rounded-2xl tw-object-cover',
                src: gi('icons/author-avatar.png'),
                alt: 'Chii Magnus avatar',
                draggable: !1,
              }),
              y.jsxs('div', {
                className: 'tw-min-w-0 tw-flex-1',
                children: [
                  y.jsx('div', {
                    className: 'tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
                    children: '𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼',
                  }),
                  y.jsx('div', {
                    className: 'tw-mt-0.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                    children: w('authorTagline'),
                  }),
                  y.jsx('div', {
                    className: 'tw-mt-1 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-break-words',
                    children: w('angelsCta'),
                  }),
                ],
              }),
            ],
          }),
          y.jsxs('div', {
            className: 'tw-mt-3 tw-flex tw-flex-wrap tw-gap-2',
            children: [
              y.jsx('button', {
                id: 'btnAboutMail',
                className: Ue,
                type: 'button',
                onClick: () =>
                  t('mailto:chii_magnus@outlook.com?subject=%5BSyncNos%20WebClipper%5D%20Feedback').catch(() => {}),
                children: w('mail'),
              }),
              y.jsx('button', {
                id: 'btnAboutGitHub',
                className: Ue,
                type: 'button',
                onClick: () => t('https://github.com/chiimagnus').catch(() => {}),
                children: 'GitHub',
              }),
              y.jsx('button', {
                id: 'btnAboutAngels',
                className: Ue,
                type: 'button',
                onClick: () => t('https://chiimagnus.notion.site/syncnos-angels').catch(() => {}),
                children: w('angelsLinkLabel'),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('supportSectionAria'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('supportHeading'),
          }),
          y.jsx('p', {
            className: 'tw-mt-2 tw-text-sm tw-font-semibold tw-leading-6 tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('supportIntro'),
          }),
          y.jsxs('p', {
            className: 'tw-mt-2 tw-text-sm tw-font-semibold tw-leading-6 tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              w('supportAskPrefix'),
              y.jsx('strong', { className: 'tw-text-[var(--text-primary)]', children: w('supportAskEmphasis') }),
              w('supportAskSuffix'),
            ],
          }),
          y.jsx('p', {
            className: 'tw-mt-2 tw-text-sm tw-font-semibold tw-leading-6 tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('supportWhy'),
          }),
          y.jsx('img', {
            className: 'tw-mt-3 tw-w-full tw-rounded-2xl tw-object-cover',
            src: gi('icons/buymeacoffee1.jpg'),
            alt: w('donateSectionAria'),
            draggable: !1,
          }),
        ],
      }),
    ],
  });
}
function jt(e) {
  return y.jsx('span', { className: 'tw-font-mono tw-text-[0.92em]', children: e.children });
}
function YE() {
  return y.jsxs('div', {
    className: 'tw-grid tw-gap-4',
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatsSectionHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatsSectionHeading'),
          }),
          y.jsx('div', {
            className: 'tw-mt-2.5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('aiChatsSectionIntro'),
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatsSectionSupportedHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatsSectionSupportedHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsxs('li', {
                children: [
                  w('aiChatsSectionSupportedListPrefix'),
                  ' ',
                  y.jsx(jt, { children: 'ChatGPT' }),
                  ' / ',
                  y.jsx(jt, { children: 'Claude' }),
                  ' / ',
                  y.jsx(jt, { children: 'Gemini' }),
                  ' /',
                  ' ',
                  y.jsx(jt, { children: 'AI Studio' }),
                  ' / ',
                  y.jsx(jt, { children: 'DeepSeek' }),
                  ' / ',
                  y.jsx(jt, { children: 'Kimi' }),
                  ' / ',
                  y.jsx(jt, { children: '豆包' }),
                  ' / ',
                  y.jsx(jt, { children: '元宝' }),
                  ' /',
                  ' ',
                  y.jsx(jt, { children: 'Poe' }),
                  ' / ',
                  y.jsx(jt, { children: 'Notion AI' }),
                  ' / ',
                  y.jsx(jt, { children: 'Z.ai' }),
                  w('aiChatsSectionSupportedListSuffix'),
                ],
              }),
              y.jsx('li', { children: w('aiChatsSectionSupportedNote') }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatsSectionHowToHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatsSectionHowToHeading'),
          }),
          y.jsxs('ol', {
            className:
              'tw-mt-2.5 tw-list-decimal tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('aiChatsSectionHowToStep1') }),
              y.jsxs('li', {
                children: [
                  w('aiChatsSectionHowToStep2Prefix'),
                  ' ',
                  y.jsx(jt, { children: w('fetchAiChat') }),
                  w('aiChatsSectionHowToStep2Suffix'),
                ],
              }),
              y.jsxs('li', {
                children: [
                  w('aiChatsSectionHowToStep3Prefix'),
                  ' ',
                  y.jsx(jt, { children: w('contextMenuSaveCurrentAiChat') }),
                  w('aiChatsSectionHowToStep3Suffix'),
                ],
              }),
              y.jsx('li', { children: w('aiChatsSectionHowToStep4') }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatsSectionTroubleshootingHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatsSectionTroubleshootingHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('aiChatsSectionTroubleshootingNoVisibleConversation') }),
              y.jsxs('li', {
                children: [
                  w('aiChatsSectionTroubleshootingAutoSavePrefix'),
                  ' ',
                  y.jsx(jt, { children: w('aiChatAutoSaveLabel') }),
                  w('aiChatsSectionTroubleshootingAutoSaveSuffix'),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function XE(e) {
  const t = e.stats;
  return t
    ? y.jsxs('ul', {
        className: 'tw-m-0 tw-pl-[18px]',
        children: [
          y.jsxs('li', {
            children: [
              w('statsConversations'),
              ' ',
              w('statsAdded'),
              ' ',
              t.conversationsAdded,
              ' · ',
              w('statsUpdated'),
              ' ',
              t.conversationsUpdated,
            ],
          }),
          y.jsxs('li', {
            children: [
              w('statsMessages'),
              ' ',
              w('statsAdded'),
              ' ',
              t.messagesAdded,
              ' · ',
              w('statsUpdated'),
              ' ',
              t.messagesUpdated,
              ' (',
              w('skipped'),
              ' ',
              t.messagesSkipped,
              ')',
            ],
          }),
          'commentsAdded' in t
            ? y.jsxs('li', {
                children: [
                  w('statsComments'),
                  ' ',
                  w('statsAdded'),
                  ' ',
                  t.commentsAdded,
                  ' · ',
                  w('statsUpdated'),
                  ' ',
                  t.commentsUpdated,
                  ' (',
                  w('skipped'),
                  ' ',
                  t.commentsSkipped,
                  ')',
                ],
              })
            : null,
          y.jsxs('li', {
            children: [
              w('statsMappings'),
              ' ',
              w('statsAdded'),
              ' ',
              t.mappingsAdded,
              ' · ',
              w('statsUpdated'),
              ' ',
              t.mappingsUpdated,
            ],
          }),
          y.jsxs('li', { children: [w('statsSettingsApplied'), ' ', t.settingsApplied] }),
        ],
      })
    : null;
}
function ZE(e) {
  const {
    busy: t,
    exportStatus: r,
    importStatus: n,
    importStats: i,
    lastBackupExportAt: a,
    backupImportRef: o,
    fileInputRef: s,
    importLabel: l,
    onImportClick: c,
    onExport: u,
    onImportFile: f,
  } = e;
  return y.jsxs('section', {
    className: ye,
    'aria-label': w('databaseBackup'),
    children: [
      y.jsx('h2', {
        className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
        children: w('databaseBackup'),
      }),
      y.jsxs('div', {
        ref: o,
        id: 'settings-backup-import',
        className: 'tw-mt-2.5 tw-flex tw-flex-wrap tw-items-center tw-gap-2.5',
        children: [
          y.jsx('button', { className: Ue, onClick: u, disabled: t, children: w('exportZip') }),
          y.jsx('button', {
            className: Ue,
            disabled: t,
            onClick: () => {
              t || (c ? c() : s.current?.click());
            },
            children: l || w('importDots'),
          }),
          y.jsx('input', {
            ref: s,
            type: 'file',
            accept: '.zip,application/zip,application/json,.json',
            className: 'tw-hidden',
            onChange: (h) => {
              const m = h.target.files?.[0];
              m && f(m);
            },
          }),
        ],
      }),
      y.jsxs('div', {
        className: 'tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: [w('exportStatus'), ' ', r],
      }),
      y.jsxs('div', {
        className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: [w('lastExport'), ' ', a ? IE(a) : '—'],
      }),
      y.jsxs('div', {
        className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: [w('importStatus'), ' ', n],
      }),
      y.jsx('div', { className: 'tw-mt-2.5', children: y.jsx(XE, { stats: i }) }),
    ],
  });
}
function xe(e) {
  const { label: t, align: r = 'center', children: n } = e,
    i = r === 'start' ? 'tw-items-start' : 'tw-items-center';
  return y.jsxs('div', {
    className: `tw-grid tw-grid-cols-[110px_1fr] ${i} tw-gap-3`,
    children: [
      y.jsx('div', { className: 'tw-text-xs tw-font-bold tw-text-[var(--text-secondary)]', children: t }),
      y.jsx('div', { children: n }),
    ],
  });
}
const JE =
  'tw-min-h-[140px] tw-w-full tw-rounded-xl tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-px-2.5 tw-py-2 tw-text-sm tw-text-[var(--text-primary)] focus-visible:tw-border-[var(--focus-ring)] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]';
function QE() {
  const e = Math.random().toString(16).slice(2, 10);
  return `custom-${Date.now()}-${e}`;
}
function ek(e) {
  const {
      busy: t,
      promptTemplate: r,
      onChangePromptTemplate: n,
      platforms: i,
      onChangePlatforms: a,
      onSave: o,
      onResetPlatforms: s,
    } = e,
    l = d.useMemo(() => (Array.isArray(i) ? i : []), [i]),
    c = d.useRef(null),
    u = (m, p) => {
      const v = l.map((g) => (!g || g.id !== m ? g : { ...g, ...p, id: g.id }));
      a(v);
    },
    f = (m) => {
      const p = l.filter((v) => v && v.id !== m);
      a(p);
    },
    h = () => {
      const m = l.concat([{ id: QE(), name: w('chatWithPlatformNamePlaceholder'), url: 'https://', enabled: !0 }]);
      a(m);
    };
  return y.jsxs('section', {
    ref: c,
    className: ye,
    'aria-label': w('chatWithSectionTitle'),
    onBlurCapture: (m) => {
      const p = c.current;
      if (!p) return;
      const v = m?.relatedTarget;
      (v && p.contains(v)) || o();
    },
    children: [
      y.jsx('div', {
        className: 'tw-flex tw-items-center tw-gap-2',
        children: y.jsx('h2', {
          className: 'tw-m-0 tw-min-w-0 tw-flex-1 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
          children: w('chatWithSectionTitle'),
        }),
      }),
      y.jsx('div', {
        className: 'tw-mt-1 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: w('chatWithSectionSubtitle'),
      }),
      y.jsxs('div', {
        className: 'tw-mt-3 tw-grid tw-gap-2',
        children: [
          y.jsx(xe, {
            label: w('chatWithPromptTemplateLabel'),
            align: 'start',
            children: y.jsxs('div', {
              className: 'tw-grid tw-gap-2',
              children: [
                y.jsx('textarea', {
                  id: 'chatWithPromptTemplate',
                  className: JE,
                  disabled: t,
                  value: r,
                  onChange: (m) => n(m.target.value),
                  'aria-label': w('chatWithPromptTemplateAria'),
                }),
                y.jsxs('details', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
                  children: [
                    y.jsx('summary', {
                      className: 'tw-cursor-pointer tw-select-none',
                      children: w('chatWithPromptTemplateHintToggle'),
                    }),
                    y.jsx('div', {
                      className: 'tw-mt-1 tw-whitespace-pre-wrap',
                      children: w('chatWithPromptTemplateHint'),
                    }),
                  ],
                }),
              ],
            }),
          }),
          y.jsx(xe, {
            label: w('chatWithPlatformsLabel'),
            align: 'start',
            children: y.jsxs('div', {
              className: 'tw-grid tw-gap-2',
              children: [
                l.length
                  ? y.jsx('div', {
                      className: 'tw-grid tw-gap-2',
                      children: l.map((m) =>
                        y.jsxs(
                          'div',
                          {
                            className: 'tw-flex tw-flex-wrap tw-items-center tw-gap-2',
                            children: [
                              y.jsxs('label', {
                                className:
                                  'tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
                                children: [
                                  y.jsx('input', {
                                    type: 'checkbox',
                                    checked: !!m.enabled,
                                    disabled: t,
                                    onChange: (p) => u(m.id, { enabled: !!p.target.checked }),
                                    className: fn,
                                  }),
                                  w('chatWithPlatformsEnabled'),
                                ],
                              }),
                              y.jsx('input', {
                                value: String(m.name || ''),
                                disabled: t,
                                onChange: (p) => u(m.id, { name: p.target.value }),
                                'aria-label': `${w('chatWithPlatformNameAriaPrefix')} ${m.id}`,
                                className: `${Ge} tw-w-[180px]`,
                                placeholder: w('chatWithPlatformNamePlaceholder'),
                              }),
                              y.jsx('input', {
                                value: String(m.url || ''),
                                disabled: t,
                                onChange: (p) => u(m.id, { url: p.target.value }),
                                'aria-label': `${w('chatWithPlatformUrlAriaPrefix')} ${m.id}`,
                                className: `${Ge} tw-min-w-[240px] tw-flex-1`,
                                placeholder: w('chatWithPlatformUrlPlaceholder'),
                              }),
                              y.jsx('button', {
                                type: 'button',
                                className: Bw,
                                disabled: t,
                                onClick: () => f(m.id),
                                'aria-label': `${w('chatWithDeletePlatformAriaPrefix')} ${m.id}`,
                                children: w('chatWithDeletePlatform'),
                              }),
                            ],
                          },
                          m.id,
                        ),
                      ),
                    })
                  : y.jsx('div', {
                      className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
                      children: w('chatWithNoPlatforms'),
                    }),
                y.jsxs('div', {
                  className: 'tw-flex tw-items-center tw-gap-2',
                  children: [
                    y.jsx('button', {
                      type: 'button',
                      className: Ue,
                      disabled: t,
                      onClick: h,
                      children: w('chatWithAddPlatform'),
                    }),
                    y.jsx('button', {
                      type: 'button',
                      className: Ue,
                      disabled: t,
                      onClick: s,
                      title: w('chatWithResetDefaultsTitle'),
                      children: w('chatWithResetButton'),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function Uw(e) {
  var t,
    r,
    n = '';
  if (typeof e == 'string' || typeof e == 'number') n += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++) e[t] && (r = Uw(e[t])) && (n && (n += ' '), (n += r));
    } else for (r in e) e[r] && (n && (n += ' '), (n += r));
  return n;
}
function Ne() {
  for (var e, t, r = 0, n = '', i = arguments.length; r < i; r++)
    (e = arguments[r]) && (t = Uw(e)) && (n && (n += ' '), (n += t));
  return n;
}
var tk = [
  'dangerouslySetInnerHTML',
  'onCopy',
  'onCopyCapture',
  'onCut',
  'onCutCapture',
  'onPaste',
  'onPasteCapture',
  'onCompositionEnd',
  'onCompositionEndCapture',
  'onCompositionStart',
  'onCompositionStartCapture',
  'onCompositionUpdate',
  'onCompositionUpdateCapture',
  'onFocus',
  'onFocusCapture',
  'onBlur',
  'onBlurCapture',
  'onChange',
  'onChangeCapture',
  'onBeforeInput',
  'onBeforeInputCapture',
  'onInput',
  'onInputCapture',
  'onReset',
  'onResetCapture',
  'onSubmit',
  'onSubmitCapture',
  'onInvalid',
  'onInvalidCapture',
  'onLoad',
  'onLoadCapture',
  'onError',
  'onErrorCapture',
  'onKeyDown',
  'onKeyDownCapture',
  'onKeyPress',
  'onKeyPressCapture',
  'onKeyUp',
  'onKeyUpCapture',
  'onAbort',
  'onAbortCapture',
  'onCanPlay',
  'onCanPlayCapture',
  'onCanPlayThrough',
  'onCanPlayThroughCapture',
  'onDurationChange',
  'onDurationChangeCapture',
  'onEmptied',
  'onEmptiedCapture',
  'onEncrypted',
  'onEncryptedCapture',
  'onEnded',
  'onEndedCapture',
  'onLoadedData',
  'onLoadedDataCapture',
  'onLoadedMetadata',
  'onLoadedMetadataCapture',
  'onLoadStart',
  'onLoadStartCapture',
  'onPause',
  'onPauseCapture',
  'onPlay',
  'onPlayCapture',
  'onPlaying',
  'onPlayingCapture',
  'onProgress',
  'onProgressCapture',
  'onRateChange',
  'onRateChangeCapture',
  'onSeeked',
  'onSeekedCapture',
  'onSeeking',
  'onSeekingCapture',
  'onStalled',
  'onStalledCapture',
  'onSuspend',
  'onSuspendCapture',
  'onTimeUpdate',
  'onTimeUpdateCapture',
  'onVolumeChange',
  'onVolumeChangeCapture',
  'onWaiting',
  'onWaitingCapture',
  'onAuxClick',
  'onAuxClickCapture',
  'onClick',
  'onClickCapture',
  'onContextMenu',
  'onContextMenuCapture',
  'onDoubleClick',
  'onDoubleClickCapture',
  'onDrag',
  'onDragCapture',
  'onDragEnd',
  'onDragEndCapture',
  'onDragEnter',
  'onDragEnterCapture',
  'onDragExit',
  'onDragExitCapture',
  'onDragLeave',
  'onDragLeaveCapture',
  'onDragOver',
  'onDragOverCapture',
  'onDragStart',
  'onDragStartCapture',
  'onDrop',
  'onDropCapture',
  'onMouseDown',
  'onMouseDownCapture',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseMoveCapture',
  'onMouseOut',
  'onMouseOutCapture',
  'onMouseOver',
  'onMouseOverCapture',
  'onMouseUp',
  'onMouseUpCapture',
  'onSelect',
  'onSelectCapture',
  'onTouchCancel',
  'onTouchCancelCapture',
  'onTouchEnd',
  'onTouchEndCapture',
  'onTouchMove',
  'onTouchMoveCapture',
  'onTouchStart',
  'onTouchStartCapture',
  'onPointerDown',
  'onPointerDownCapture',
  'onPointerMove',
  'onPointerMoveCapture',
  'onPointerUp',
  'onPointerUpCapture',
  'onPointerCancel',
  'onPointerCancelCapture',
  'onPointerEnter',
  'onPointerEnterCapture',
  'onPointerLeave',
  'onPointerLeaveCapture',
  'onPointerOver',
  'onPointerOverCapture',
  'onPointerOut',
  'onPointerOutCapture',
  'onGotPointerCapture',
  'onGotPointerCaptureCapture',
  'onLostPointerCapture',
  'onLostPointerCaptureCapture',
  'onScroll',
  'onScrollCapture',
  'onWheel',
  'onWheelCapture',
  'onAnimationStart',
  'onAnimationStartCapture',
  'onAnimationEnd',
  'onAnimationEndCapture',
  'onAnimationIteration',
  'onAnimationIterationCapture',
  'onTransitionEnd',
  'onTransitionEndCapture',
];
function zd(e) {
  if (typeof e != 'string') return !1;
  var t = tk;
  return t.includes(e);
}
var rk = [
    'aria-activedescendant',
    'aria-atomic',
    'aria-autocomplete',
    'aria-busy',
    'aria-checked',
    'aria-colcount',
    'aria-colindex',
    'aria-colspan',
    'aria-controls',
    'aria-current',
    'aria-describedby',
    'aria-details',
    'aria-disabled',
    'aria-errormessage',
    'aria-expanded',
    'aria-flowto',
    'aria-haspopup',
    'aria-hidden',
    'aria-invalid',
    'aria-keyshortcuts',
    'aria-label',
    'aria-labelledby',
    'aria-level',
    'aria-live',
    'aria-modal',
    'aria-multiline',
    'aria-multiselectable',
    'aria-orientation',
    'aria-owns',
    'aria-placeholder',
    'aria-posinset',
    'aria-pressed',
    'aria-readonly',
    'aria-relevant',
    'aria-required',
    'aria-roledescription',
    'aria-rowcount',
    'aria-rowindex',
    'aria-rowspan',
    'aria-selected',
    'aria-setsize',
    'aria-sort',
    'aria-valuemax',
    'aria-valuemin',
    'aria-valuenow',
    'aria-valuetext',
    'className',
    'color',
    'height',
    'id',
    'lang',
    'max',
    'media',
    'method',
    'min',
    'name',
    'style',
    'target',
    'width',
    'role',
    'tabIndex',
    'accentHeight',
    'accumulate',
    'additive',
    'alignmentBaseline',
    'allowReorder',
    'alphabetic',
    'amplitude',
    'arabicForm',
    'ascent',
    'attributeName',
    'attributeType',
    'autoReverse',
    'azimuth',
    'baseFrequency',
    'baselineShift',
    'baseProfile',
    'bbox',
    'begin',
    'bias',
    'by',
    'calcMode',
    'capHeight',
    'clip',
    'clipPath',
    'clipPathUnits',
    'clipRule',
    'colorInterpolation',
    'colorInterpolationFilters',
    'colorProfile',
    'colorRendering',
    'contentScriptType',
    'contentStyleType',
    'cursor',
    'cx',
    'cy',
    'd',
    'decelerate',
    'descent',
    'diffuseConstant',
    'direction',
    'display',
    'divisor',
    'dominantBaseline',
    'dur',
    'dx',
    'dy',
    'edgeMode',
    'elevation',
    'enableBackground',
    'end',
    'exponent',
    'externalResourcesRequired',
    'fill',
    'fillOpacity',
    'fillRule',
    'filter',
    'filterRes',
    'filterUnits',
    'floodColor',
    'floodOpacity',
    'focusable',
    'fontFamily',
    'fontSize',
    'fontSizeAdjust',
    'fontStretch',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'format',
    'from',
    'fx',
    'fy',
    'g1',
    'g2',
    'glyphName',
    'glyphOrientationHorizontal',
    'glyphOrientationVertical',
    'glyphRef',
    'gradientTransform',
    'gradientUnits',
    'hanging',
    'horizAdvX',
    'horizOriginX',
    'href',
    'ideographic',
    'imageRendering',
    'in2',
    'in',
    'intercept',
    'k1',
    'k2',
    'k3',
    'k4',
    'k',
    'kernelMatrix',
    'kernelUnitLength',
    'kerning',
    'keyPoints',
    'keySplines',
    'keyTimes',
    'lengthAdjust',
    'letterSpacing',
    'lightingColor',
    'limitingConeAngle',
    'local',
    'markerEnd',
    'markerHeight',
    'markerMid',
    'markerStart',
    'markerUnits',
    'markerWidth',
    'mask',
    'maskContentUnits',
    'maskUnits',
    'mathematical',
    'mode',
    'numOctaves',
    'offset',
    'opacity',
    'operator',
    'order',
    'orient',
    'orientation',
    'origin',
    'overflow',
    'overlinePosition',
    'overlineThickness',
    'paintOrder',
    'panose1',
    'pathLength',
    'patternContentUnits',
    'patternTransform',
    'patternUnits',
    'pointerEvents',
    'pointsAtX',
    'pointsAtY',
    'pointsAtZ',
    'preserveAlpha',
    'preserveAspectRatio',
    'primitiveUnits',
    'r',
    'radius',
    'refX',
    'refY',
    'renderingIntent',
    'repeatCount',
    'repeatDur',
    'requiredExtensions',
    'requiredFeatures',
    'restart',
    'result',
    'rotate',
    'rx',
    'ry',
    'seed',
    'shapeRendering',
    'slope',
    'spacing',
    'specularConstant',
    'specularExponent',
    'speed',
    'spreadMethod',
    'startOffset',
    'stdDeviation',
    'stemh',
    'stemv',
    'stitchTiles',
    'stopColor',
    'stopOpacity',
    'strikethroughPosition',
    'strikethroughThickness',
    'string',
    'stroke',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth',
    'surfaceScale',
    'systemLanguage',
    'tableValues',
    'targetX',
    'targetY',
    'textAnchor',
    'textDecoration',
    'textLength',
    'textRendering',
    'to',
    'transform',
    'u1',
    'u2',
    'underlinePosition',
    'underlineThickness',
    'unicode',
    'unicodeBidi',
    'unicodeRange',
    'unitsPerEm',
    'vAlphabetic',
    'values',
    'vectorEffect',
    'version',
    'vertAdvY',
    'vertOriginX',
    'vertOriginY',
    'vHanging',
    'vIdeographic',
    'viewTarget',
    'visibility',
    'vMathematical',
    'widths',
    'wordSpacing',
    'writingMode',
    'x1',
    'x2',
    'x',
    'xChannelSelector',
    'xHeight',
    'xlinkActuate',
    'xlinkArcrole',
    'xlinkHref',
    'xlinkRole',
    'xlinkShow',
    'xlinkTitle',
    'xlinkType',
    'xmlBase',
    'xmlLang',
    'xmlns',
    'xmlnsXlink',
    'xmlSpace',
    'y1',
    'y2',
    'y',
    'yChannelSelector',
    'z',
    'zoomAndPan',
    'ref',
    'key',
    'angle',
  ],
  nk = new Set(rk);
function zw(e) {
  return typeof e != 'string' ? !1 : nk.has(e);
}
function Kw(e) {
  return typeof e == 'string' && e.startsWith('data-');
}
function Qt(e) {
  if (typeof e != 'object' || e === null) return {};
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (zw(r) || Kw(r)) && (t[r] = e[r]);
  return t;
}
function Ka(e) {
  if (e == null) return null;
  if (d.isValidElement(e) && typeof e.props == 'object' && e.props !== null) {
    var t = e.props;
    return Qt(t);
  }
  return typeof e == 'object' && !Array.isArray(e) ? Qt(e) : null;
}
function Ct(e) {
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (zw(r) || Kw(r) || zd(r)) && (t[r] = e[r]);
  return t;
}
function ik(e) {
  return e == null
    ? null
    : d.isValidElement(e)
      ? Ct(e.props)
      : typeof e == 'object' && !Array.isArray(e)
        ? Ct(e)
        : null;
}
var ak = ['children', 'width', 'height', 'viewBox', 'className', 'style', 'title', 'desc'];
function jf() {
  return (
    (jf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    jf.apply(null, arguments)
  );
}
function ok(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = sk(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function sk(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var Ww = d.forwardRef((e, t) => {
    var { children: r, width: n, height: i, viewBox: a, className: o, style: s, title: l, desc: c } = e,
      u = ok(e, ak),
      f = a || { width: n, height: i, x: 0, y: 0 },
      h = Ne('recharts-surface', o);
    return d.createElement(
      'svg',
      jf({}, Ct(u), {
        className: h,
        width: n,
        height: i,
        style: s,
        viewBox: ''.concat(f.x, ' ').concat(f.y, ' ').concat(f.width, ' ').concat(f.height),
        ref: t,
      }),
      d.createElement('title', null, l),
      d.createElement('desc', null, c),
      r,
    );
  }),
  lk = ['children', 'className'];
function Nf() {
  return (
    (Nf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Nf.apply(null, arguments)
  );
}
function ck(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = uk(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function uk(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var yt = d.forwardRef((e, t) => {
    var { children: r, className: n } = e,
      i = ck(e, lk),
      a = Ne('recharts-layer', n);
    return d.createElement('g', Nf({ className: a }, Ct(i), { ref: t }), r);
  }),
  fk = d.createContext(null);
function Ie(e) {
  return function () {
    return e;
  };
}
const Hw = Math.cos,
  ps = Math.sin,
  ur = Math.sqrt,
  vs = Math.PI,
  vl = 2 * vs,
  If = Math.PI,
  Tf = 2 * If,
  kn = 1e-6,
  dk = Tf - kn;
function qw(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t) this._ += arguments[t] + e[t];
}
function hk(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return qw;
  const r = 10 ** t;
  return function (n) {
    this._ += n[0];
    for (let i = 1, a = n.length; i < a; ++i) this._ += Math.round(arguments[i] * r) / r + n[i];
  };
}
class mk {
  constructor(t) {
    ((this._x0 = this._y0 = this._x1 = this._y1 = null), (this._ = ''), (this._append = t == null ? qw : hk(t)));
  }
  moveTo(t, r) {
    this._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +r)}`;
  }
  closePath() {
    this._x1 !== null && ((this._x1 = this._x0), (this._y1 = this._y0), this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${(this._x1 = +t)},${(this._y1 = +r)}`;
  }
  quadraticCurveTo(t, r, n, i) {
    this._append`Q${+t},${+r},${(this._x1 = +n)},${(this._y1 = +i)}`;
  }
  bezierCurveTo(t, r, n, i, a, o) {
    this._append`C${+t},${+r},${+n},${+i},${(this._x1 = +a)},${(this._y1 = +o)}`;
  }
  arcTo(t, r, n, i, a) {
    if (((t = +t), (r = +r), (n = +n), (i = +i), (a = +a), a < 0)) throw new Error(`negative radius: ${a}`);
    let o = this._x1,
      s = this._y1,
      l = n - t,
      c = i - r,
      u = o - t,
      f = s - r,
      h = u * u + f * f;
    if (this._x1 === null) this._append`M${(this._x1 = t)},${(this._y1 = r)}`;
    else if (h > kn)
      if (!(Math.abs(f * l - c * u) > kn) || !a) this._append`L${(this._x1 = t)},${(this._y1 = r)}`;
      else {
        let m = n - o,
          p = i - s,
          v = l * l + c * c,
          g = m * m + p * p,
          b = Math.sqrt(v),
          S = Math.sqrt(h),
          x = a * Math.tan((If - Math.acos((v + h - g) / (2 * b * S))) / 2),
          A = x / S,
          C = x / b;
        (Math.abs(A - 1) > kn && this._append`L${t + A * u},${r + A * f}`,
          this._append`A${a},${a},0,0,${+(f * m > u * p)},${(this._x1 = t + C * l)},${(this._y1 = r + C * c)}`);
      }
  }
  arc(t, r, n, i, a, o) {
    if (((t = +t), (r = +r), (n = +n), (o = !!o), n < 0)) throw new Error(`negative radius: ${n}`);
    let s = n * Math.cos(i),
      l = n * Math.sin(i),
      c = t + s,
      u = r + l,
      f = 1 ^ o,
      h = o ? i - a : a - i;
    (this._x1 === null
      ? this._append`M${c},${u}`
      : (Math.abs(this._x1 - c) > kn || Math.abs(this._y1 - u) > kn) && this._append`L${c},${u}`,
      n &&
        (h < 0 && (h = (h % Tf) + Tf),
        h > dk
          ? this._append`A${n},${n},0,1,${f},${t - s},${r - l}A${n},${n},0,1,${f},${(this._x1 = c)},${(this._y1 = u)}`
          : h > kn &&
            this
              ._append`A${n},${n},0,${+(h >= If)},${f},${(this._x1 = t + n * Math.cos(a))},${(this._y1 = r + n * Math.sin(a))}`));
  }
  rect(t, r, n, i) {
    this._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +r)}h${(n = +n)}v${+i}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function Kd(e) {
  let t = 3;
  return (
    (e.digits = function (r) {
      if (!arguments.length) return t;
      if (r == null) t = null;
      else {
        const n = Math.floor(r);
        if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
        t = n;
      }
      return e;
    }),
    () => new mk(t)
  );
}
function Wd(e) {
  return typeof e == 'object' && 'length' in e ? e : Array.from(e);
}
function Vw(e) {
  this._context = e;
}
Vw.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(e, t);
        break;
    }
  },
};
function gl(e) {
  return new Vw(e);
}
function Gw(e) {
  return e[0];
}
function Yw(e) {
  return e[1];
}
function Xw(e, t) {
  var r = Ie(!0),
    n = null,
    i = gl,
    a = null,
    o = Kd(s);
  ((e = typeof e == 'function' ? e : e === void 0 ? Gw : Ie(e)),
    (t = typeof t == 'function' ? t : t === void 0 ? Yw : Ie(t)));
  function s(l) {
    var c,
      u = (l = Wd(l)).length,
      f,
      h = !1,
      m;
    for (n == null && (a = i((m = o()))), c = 0; c <= u; ++c)
      (!(c < u && r((f = l[c]), c, l)) === h && ((h = !h) ? a.lineStart() : a.lineEnd()),
        h && a.point(+e(f, c, l), +t(f, c, l)));
    if (m) return ((a = null), m + '' || null);
  }
  return (
    (s.x = function (l) {
      return arguments.length ? ((e = typeof l == 'function' ? l : Ie(+l)), s) : e;
    }),
    (s.y = function (l) {
      return arguments.length ? ((t = typeof l == 'function' ? l : Ie(+l)), s) : t;
    }),
    (s.defined = function (l) {
      return arguments.length ? ((r = typeof l == 'function' ? l : Ie(!!l)), s) : r;
    }),
    (s.curve = function (l) {
      return arguments.length ? ((i = l), n != null && (a = i(n)), s) : i;
    }),
    (s.context = function (l) {
      return arguments.length ? (l == null ? (n = a = null) : (a = i((n = l))), s) : n;
    }),
    s
  );
}
function Ro(e, t, r) {
  var n = null,
    i = Ie(!0),
    a = null,
    o = gl,
    s = null,
    l = Kd(c);
  ((e = typeof e == 'function' ? e : e === void 0 ? Gw : Ie(+e)),
    (t = typeof t == 'function' ? t : Ie(t === void 0 ? 0 : +t)),
    (r = typeof r == 'function' ? r : r === void 0 ? Yw : Ie(+r)));
  function c(f) {
    var h,
      m,
      p,
      v = (f = Wd(f)).length,
      g,
      b = !1,
      S,
      x = new Array(v),
      A = new Array(v);
    for (a == null && (s = o((S = l()))), h = 0; h <= v; ++h) {
      if (!(h < v && i((g = f[h]), h, f)) === b)
        if ((b = !b)) ((m = h), s.areaStart(), s.lineStart());
        else {
          for (s.lineEnd(), s.lineStart(), p = h - 1; p >= m; --p) s.point(x[p], A[p]);
          (s.lineEnd(), s.areaEnd());
        }
      b && ((x[h] = +e(g, h, f)), (A[h] = +t(g, h, f)), s.point(n ? +n(g, h, f) : x[h], r ? +r(g, h, f) : A[h]));
    }
    if (S) return ((s = null), S + '' || null);
  }
  function u() {
    return Xw().defined(i).curve(o).context(a);
  }
  return (
    (c.x = function (f) {
      return arguments.length ? ((e = typeof f == 'function' ? f : Ie(+f)), (n = null), c) : e;
    }),
    (c.x0 = function (f) {
      return arguments.length ? ((e = typeof f == 'function' ? f : Ie(+f)), c) : e;
    }),
    (c.x1 = function (f) {
      return arguments.length ? ((n = f == null ? null : typeof f == 'function' ? f : Ie(+f)), c) : n;
    }),
    (c.y = function (f) {
      return arguments.length ? ((t = typeof f == 'function' ? f : Ie(+f)), (r = null), c) : t;
    }),
    (c.y0 = function (f) {
      return arguments.length ? ((t = typeof f == 'function' ? f : Ie(+f)), c) : t;
    }),
    (c.y1 = function (f) {
      return arguments.length ? ((r = f == null ? null : typeof f == 'function' ? f : Ie(+f)), c) : r;
    }),
    (c.lineX0 = c.lineY0 =
      function () {
        return u().x(e).y(t);
      }),
    (c.lineY1 = function () {
      return u().x(e).y(r);
    }),
    (c.lineX1 = function () {
      return u().x(n).y(t);
    }),
    (c.defined = function (f) {
      return arguments.length ? ((i = typeof f == 'function' ? f : Ie(!!f)), c) : i;
    }),
    (c.curve = function (f) {
      return arguments.length ? ((o = f), a != null && (s = o(a)), c) : o;
    }),
    (c.context = function (f) {
      return arguments.length ? (f == null ? (a = s = null) : (s = o((a = f))), c) : a;
    }),
    c
  );
}
class Zw {
  constructor(t, r) {
    ((this._context = t), (this._x = r));
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  }
  point(t, r) {
    switch (((t = +t), (r = +r), this._point)) {
      case 0: {
        ((this._point = 1), this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r));
        break;
      }
      case 1:
        this._point = 2;
      default: {
        this._x
          ? this._context.bezierCurveTo((this._x0 = (this._x0 + t) / 2), this._y0, this._x0, r, t, r)
          : this._context.bezierCurveTo(this._x0, (this._y0 = (this._y0 + r) / 2), t, this._y0, t, r);
        break;
      }
    }
    ((this._x0 = t), (this._y0 = r));
  }
}
function pk(e) {
  return new Zw(e, !0);
}
function vk(e) {
  return new Zw(e, !1);
}
const Hd = {
    draw(e, t) {
      const r = ur(t / vs);
      (e.moveTo(r, 0), e.arc(0, 0, r, 0, vl));
    },
  },
  gk = {
    draw(e, t) {
      const r = ur(t / 5) / 2;
      (e.moveTo(-3 * r, -r),
        e.lineTo(-r, -r),
        e.lineTo(-r, -3 * r),
        e.lineTo(r, -3 * r),
        e.lineTo(r, -r),
        e.lineTo(3 * r, -r),
        e.lineTo(3 * r, r),
        e.lineTo(r, r),
        e.lineTo(r, 3 * r),
        e.lineTo(-r, 3 * r),
        e.lineTo(-r, r),
        e.lineTo(-3 * r, r),
        e.closePath());
    },
  },
  Jw = ur(1 / 3),
  yk = Jw * 2,
  bk = {
    draw(e, t) {
      const r = ur(t / yk),
        n = r * Jw;
      (e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath());
    },
  },
  wk = {
    draw(e, t) {
      const r = ur(t),
        n = -r / 2;
      e.rect(n, n, r, r);
    },
  },
  xk = 0.8908130915292852,
  Qw = ps(vs / 10) / ps((7 * vs) / 10),
  Sk = ps(vl / 10) * Qw,
  Ak = -Hw(vl / 10) * Qw,
  Pk = {
    draw(e, t) {
      const r = ur(t * xk),
        n = Sk * r,
        i = Ak * r;
      (e.moveTo(0, -r), e.lineTo(n, i));
      for (let a = 1; a < 5; ++a) {
        const o = (vl * a) / 5,
          s = Hw(o),
          l = ps(o);
        (e.lineTo(l * r, -s * r), e.lineTo(s * n - l * i, l * n + s * i));
      }
      e.closePath();
    },
  },
  qc = ur(3),
  Ck = {
    draw(e, t) {
      const r = -ur(t / (qc * 3));
      (e.moveTo(0, r * 2), e.lineTo(-qc * r, -r), e.lineTo(qc * r, -r), e.closePath());
    },
  },
  qt = -0.5,
  Vt = ur(3) / 2,
  Mf = 1 / ur(12),
  Ok = (Mf / 2 + 1) * 3,
  _k = {
    draw(e, t) {
      const r = ur(t / Ok),
        n = r / 2,
        i = r * Mf,
        a = n,
        o = r * Mf + r,
        s = -a,
        l = o;
      (e.moveTo(n, i),
        e.lineTo(a, o),
        e.lineTo(s, l),
        e.lineTo(qt * n - Vt * i, Vt * n + qt * i),
        e.lineTo(qt * a - Vt * o, Vt * a + qt * o),
        e.lineTo(qt * s - Vt * l, Vt * s + qt * l),
        e.lineTo(qt * n + Vt * i, qt * i - Vt * n),
        e.lineTo(qt * a + Vt * o, qt * o - Vt * a),
        e.lineTo(qt * s + Vt * l, qt * l - Vt * s),
        e.closePath());
    },
  };
function Ek(e, t) {
  let r = null,
    n = Kd(i);
  ((e = typeof e == 'function' ? e : Ie(e || Hd)), (t = typeof t == 'function' ? t : Ie(t === void 0 ? 64 : +t)));
  function i() {
    let a;
    if ((r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a))
      return ((r = null), a + '' || null);
  }
  return (
    (i.type = function (a) {
      return arguments.length ? ((e = typeof a == 'function' ? a : Ie(a)), i) : e;
    }),
    (i.size = function (a) {
      return arguments.length ? ((t = typeof a == 'function' ? a : Ie(+a)), i) : t;
    }),
    (i.context = function (a) {
      return arguments.length ? ((r = a ?? null), i) : r;
    }),
    i
  );
}
function gs() {}
function ys(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6,
  );
}
function ex(e) {
  this._context = e;
}
ex.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        ys(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        ((this._point = 3), this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6));
      default:
        ys(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function kk(e) {
  return new ex(e);
}
function tx(e) {
  this._context = e;
}
tx.prototype = {
  areaStart: gs,
  areaEnd: gs,
  lineStart: function () {
    ((this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
        NaN),
      (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        (this._context.moveTo(this._x2, this._y2), this._context.closePath());
        break;
      }
      case 2: {
        (this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
          this._context.closePath());
        break;
      }
      case 3: {
        (this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4));
        break;
      }
    }
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), (this._x2 = e), (this._y2 = t));
        break;
      case 1:
        ((this._point = 2), (this._x3 = e), (this._y3 = t));
        break;
      case 2:
        ((this._point = 3),
          (this._x4 = e),
          (this._y4 = t),
          this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6));
        break;
      default:
        ys(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function jk(e) {
  return new tx(e);
}
function rx(e) {
  this._context = e;
}
rx.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    ((this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6,
          n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      default:
        ys(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function Nk(e) {
  return new rx(e);
}
function nx(e) {
  this._context = e;
}
nx.prototype = {
  areaStart: gs,
  areaEnd: gs,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    this._point && this._context.closePath();
  },
  point: function (e, t) {
    ((e = +e), (t = +t), this._point ? this._context.lineTo(e, t) : ((this._point = 1), this._context.moveTo(e, t)));
  },
};
function Ik(e) {
  return new nx(e);
}
function ep(e) {
  return e < 0 ? -1 : 1;
}
function tp(e, t, r) {
  var n = e._x1 - e._x0,
    i = t - e._x1,
    a = (e._y1 - e._y0) / (n || (i < 0 && -0)),
    o = (r - e._y1) / (i || (n < 0 && -0)),
    s = (a * i + o * n) / (n + i);
  return (ep(a) + ep(o)) * Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs(s)) || 0;
}
function rp(e, t) {
  var r = e._x1 - e._x0;
  return r ? ((3 * (e._y1 - e._y0)) / r - t) / 2 : t;
}
function Vc(e, t, r) {
  var n = e._x0,
    i = e._y0,
    a = e._x1,
    o = e._y1,
    s = (a - n) / 3;
  e._context.bezierCurveTo(n + s, i + s * t, a - s, o - s * r, a, o);
}
function bs(e) {
  this._context = e;
}
bs.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Vc(this, this._t0, rp(this, this._t0));
        break;
    }
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    var r = NaN;
    if (((e = +e), (t = +t), !(e === this._x1 && t === this._y1))) {
      switch (this._point) {
        case 0:
          ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          ((this._point = 3), Vc(this, rp(this, (r = tp(this, e, t))), r));
          break;
        default:
          Vc(this, this._t0, (r = tp(this, e, t)));
          break;
      }
      ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t), (this._t0 = r));
    }
  },
};
function ix(e) {
  this._context = new ax(e);
}
(ix.prototype = Object.create(bs.prototype)).point = function (e, t) {
  bs.prototype.point.call(this, t, e);
};
function ax(e) {
  this._context = e;
}
ax.prototype = {
  moveTo: function (e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function (e, t, r, n, i, a) {
    this._context.bezierCurveTo(t, e, n, r, a, i);
  },
};
function Tk(e) {
  return new bs(e);
}
function Mk(e) {
  return new ix(e);
}
function ox(e) {
  this._context = e;
}
ox.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x = []), (this._y = []));
  },
  lineEnd: function () {
    var e = this._x,
      t = this._y,
      r = e.length;
    if (r)
      if ((this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2))
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = np(e), i = np(t), a = 0, o = 1; o < r; ++a, ++o)
          this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
    ((this._line || (this._line !== 0 && r === 1)) && this._context.closePath(),
      (this._line = 1 - this._line),
      (this._x = this._y = null));
  },
  point: function (e, t) {
    (this._x.push(+e), this._y.push(+t));
  },
};
function np(e) {
  var t,
    r = e.length - 1,
    n,
    i = new Array(r),
    a = new Array(r),
    o = new Array(r);
  for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t)
    ((i[t] = 1), (a[t] = 4), (o[t] = 4 * e[t] + 2 * e[t + 1]));
  for (i[r - 1] = 2, a[r - 1] = 7, o[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t)
    ((n = i[t] / a[t - 1]), (a[t] -= n), (o[t] -= n * o[t - 1]));
  for (i[r - 1] = o[r - 1] / a[r - 1], t = r - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
  for (a[r - 1] = (e[r] + i[r - 1]) / 2, t = 0; t < r - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
  return [i, a];
}
function Dk(e) {
  return new ox(e);
}
function yl(e, t) {
  ((this._context = e), (this._t = t));
}
yl.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x = this._y = NaN), (this._point = 0));
  },
  lineEnd: function () {
    (0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y),
      (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line)));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) (this._context.lineTo(this._x, t), this._context.lineTo(e, t));
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          (this._context.lineTo(r, this._y), this._context.lineTo(r, t));
        }
        break;
      }
    }
    ((this._x = e), (this._y = t));
  },
};
function Rk(e) {
  return new yl(e, 0.5);
}
function Lk(e) {
  return new yl(e, 0);
}
function $k(e) {
  return new yl(e, 1);
}
function Bn(e, t) {
  if ((o = e.length) > 1)
    for (var r = 1, n, i, a = e[t[0]], o, s = a.length; r < o; ++r)
      for (i = a, a = e[t[r]], n = 0; n < s; ++n) a[n][1] += a[n][0] = isNaN(i[n][1]) ? i[n][0] : i[n][1];
}
function Df(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function Fk(e, t) {
  return e[t];
}
function Bk(e) {
  const t = [];
  return ((t.key = e), t);
}
function Uk() {
  var e = Ie([]),
    t = Df,
    r = Bn,
    n = Fk;
  function i(a) {
    var o = Array.from(e.apply(this, arguments), Bk),
      s,
      l = o.length,
      c = -1,
      u;
    for (const f of a) for (s = 0, ++c; s < l; ++s) (o[s][c] = [0, +n(f, o[s].key, c, a)]).data = f;
    for (s = 0, u = Wd(t(o)); s < l; ++s) o[u[s]].index = s;
    return (r(o, u), o);
  }
  return (
    (i.keys = function (a) {
      return arguments.length ? ((e = typeof a == 'function' ? a : Ie(Array.from(a))), i) : e;
    }),
    (i.value = function (a) {
      return arguments.length ? ((n = typeof a == 'function' ? a : Ie(+a)), i) : n;
    }),
    (i.order = function (a) {
      return arguments.length ? ((t = a == null ? Df : typeof a == 'function' ? a : Ie(Array.from(a))), i) : t;
    }),
    (i.offset = function (a) {
      return arguments.length ? ((r = a ?? Bn), i) : r;
    }),
    i
  );
}
function zk(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, i = 0, a = e[0].length, o; i < a; ++i) {
      for (o = r = 0; r < n; ++r) o += e[r][i][1] || 0;
      if (o) for (r = 0; r < n; ++r) e[r][i][1] /= o;
    }
    Bn(e, t);
  }
}
function Kk(e, t) {
  if ((i = e.length) > 0) {
    for (var r = 0, n = e[t[0]], i, a = n.length; r < a; ++r) {
      for (var o = 0, s = 0; o < i; ++o) s += e[o][r][1] || 0;
      n[r][1] += n[r][0] = -s / 2;
    }
    Bn(e, t);
  }
}
function Wk(e, t) {
  if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, i, a, o; n < a; ++n) {
      for (var s = 0, l = 0, c = 0; s < o; ++s) {
        for (var u = e[t[s]], f = u[n][1] || 0, h = u[n - 1][1] || 0, m = (f - h) / 2, p = 0; p < s; ++p) {
          var v = e[t[p]],
            g = v[n][1] || 0,
            b = v[n - 1][1] || 0;
          m += g - b;
        }
        ((l += f), (c += m * f));
      }
      ((i[n - 1][1] += i[n - 1][0] = r), l && (r -= c / l));
    }
    ((i[n - 1][1] += i[n - 1][0] = r), Bn(e, t));
  }
}
var Gc = {},
  Yc = {},
  ip;
function Hk() {
  return (
    ip ||
      ((ip = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return r === '__proto__';
        }
        e.isUnsafeProperty = t;
      })(Yc)),
    Yc
  );
}
var Xc = {},
  ap;
function sx() {
  return (
    ap ||
      ((ap = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          switch (typeof r) {
            case 'number':
            case 'symbol':
              return !1;
            case 'string':
              return r.includes('.') || r.includes('[') || r.includes(']');
          }
        }
        e.isDeepKey = t;
      })(Xc)),
    Xc
  );
}
var Zc = {},
  op;
function qd() {
  return (
    op ||
      ((op = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return typeof r == 'string' || typeof r == 'symbol' ? r : Object.is(r?.valueOf?.(), -0) ? '-0' : String(r);
        }
        e.toKey = t;
      })(Zc)),
    Zc
  );
}
var Jc = {},
  Qc = {},
  sp;
function qk() {
  return (
    sp ||
      ((sp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          if (r == null) return '';
          if (typeof r == 'string') return r;
          if (Array.isArray(r)) return r.map(t).join(',');
          const n = String(r);
          return n === '0' && Object.is(Number(r), -0) ? '-0' : n;
        }
        e.toString = t;
      })(Qc)),
    Qc
  );
}
var lp;
function Vd() {
  return (
    lp ||
      ((lp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = qk(),
          r = qd();
        function n(i) {
          if (Array.isArray(i)) return i.map(r.toKey);
          if (typeof i == 'symbol') return [i];
          i = t.toString(i);
          const a = [],
            o = i.length;
          if (o === 0) return a;
          let s = 0,
            l = '',
            c = '',
            u = !1;
          for (i.charCodeAt(0) === 46 && (a.push(''), s++); s < o; ) {
            const f = i[s];
            (c
              ? f === '\\' && s + 1 < o
                ? (s++, (l += i[s]))
                : f === c
                  ? (c = '')
                  : (l += f)
              : u
                ? f === '"' || f === "'"
                  ? (c = f)
                  : f === ']'
                    ? ((u = !1), a.push(l), (l = ''))
                    : (l += f)
                : f === '['
                  ? ((u = !0), l && (a.push(l), (l = '')))
                  : f === '.'
                    ? l && (a.push(l), (l = ''))
                    : (l += f),
              s++);
          }
          return (l && a.push(l), a);
        }
        e.toPath = n;
      })(Jc)),
    Jc
  );
}
var cp;
function Gd() {
  return (
    cp ||
      ((cp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Hk(),
          r = sx(),
          n = qd(),
          i = Vd();
        function a(s, l, c) {
          if (s == null) return c;
          switch (typeof l) {
            case 'string': {
              if (t.isUnsafeProperty(l)) return c;
              const u = s[l];
              return u === void 0 ? (r.isDeepKey(l) ? a(s, i.toPath(l), c) : c) : u;
            }
            case 'number':
            case 'symbol': {
              typeof l == 'number' && (l = n.toKey(l));
              const u = s[l];
              return u === void 0 ? c : u;
            }
            default: {
              if (Array.isArray(l)) return o(s, l, c);
              if ((Object.is(l?.valueOf(), -0) ? (l = '-0') : (l = String(l)), t.isUnsafeProperty(l))) return c;
              const u = s[l];
              return u === void 0 ? c : u;
            }
          }
        }
        function o(s, l, c) {
          if (l.length === 0) return c;
          let u = s;
          for (let f = 0; f < l.length; f++) {
            if (u == null || t.isUnsafeProperty(l[f])) return c;
            u = u[l[f]];
          }
          return u === void 0 ? c : u;
        }
        e.get = a;
      })(Gc)),
    Gc
  );
}
var eu, up;
function Vk() {
  return (up || ((up = 1), (eu = Gd().get)), eu);
}
var Gk = Vk();
const xi = ki(Gk);
var Yk = 4;
function dn(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Yk,
    r = 10 ** t,
    n = Math.round(e * r) / r;
  return Object.is(n, -0) ? 0 : n;
}
function qe(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
  return e.reduce((i, a, o) => {
    var s = r[o - 1];
    return typeof s == 'string' ? i + s + a : s !== void 0 ? i + dn(s) + a : i + a;
  }, '');
}
var Nt = (e) => (e === 0 ? 0 : e > 0 ? 1 : -1),
  sr = (e) => typeof e == 'number' && e != +e,
  Rf = (e) => typeof e == 'string' && e.indexOf('%') === e.length - 1,
  X = (e) => (typeof e == 'number' || e instanceof Number) && !sr(e),
  Sr = (e) => X(e) || typeof e == 'string',
  Xk = 0,
  Oa = (e) => {
    var t = ++Xk;
    return ''.concat(e || '').concat(t);
  },
  lr = function (t, r) {
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0,
      i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
    if (!X(t) && typeof t != 'string') return n;
    var a;
    if (Rf(t)) {
      if (r == null) return n;
      var o = t.indexOf('%');
      a = (r * parseFloat(t.slice(0, o))) / 100;
    } else a = +t;
    return (sr(a) && (a = n), i && r != null && a > r && (a = r), a);
  },
  lx = (e) => {
    if (!Array.isArray(e)) return !1;
    for (var t = e.length, r = {}, n = 0; n < t; n++)
      if (!r[String(e[n])]) r[String(e[n])] = !0;
      else return !0;
    return !1;
  };
function Be(e, t, r) {
  return X(e) && X(t) ? dn(e + r * (t - e)) : t;
}
function cx(e, t, r) {
  if (!(!e || !e.length)) return e.find((n) => n && (typeof t == 'function' ? t(n) : xi(n, t)) === r);
}
var ze = (e) => e === null || typeof e > 'u',
  Wa = (e) => (ze(e) ? e : ''.concat(e.charAt(0).toUpperCase()).concat(e.slice(1)));
function It(e) {
  return e != null;
}
function Gn() {}
var Zk = ['type', 'size', 'sizeType'];
function Lf() {
  return (
    (Lf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Lf.apply(null, arguments)
  );
}
function fp(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function dp(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? fp(Object(r), !0).forEach(function (n) {
          Jk(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : fp(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Jk(e, t, r) {
  return (
    (t = Qk(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Qk(e) {
  var t = ej(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function ej(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function tj(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = rj(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function rj(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var ux = {
    symbolCircle: Hd,
    symbolCross: gk,
    symbolDiamond: bk,
    symbolSquare: wk,
    symbolStar: Pk,
    symbolTriangle: Ck,
    symbolWye: _k,
  },
  nj = Math.PI / 180,
  ij = (e) => {
    var t = 'symbol'.concat(Wa(e));
    return ux[t] || Hd;
  },
  aj = (e, t, r) => {
    if (t === 'area') return e;
    switch (r) {
      case 'cross':
        return (5 * e * e) / 9;
      case 'diamond':
        return (0.5 * e * e) / Math.sqrt(3);
      case 'square':
        return e * e;
      case 'star': {
        var n = 18 * nj;
        return 1.25 * e * e * (Math.tan(n) - Math.tan(n * 2) * Math.tan(n) ** 2);
      }
      case 'triangle':
        return (Math.sqrt(3) * e * e) / 4;
      case 'wye':
        return ((21 - 10 * Math.sqrt(3)) * e * e) / 8;
      default:
        return (Math.PI * e * e) / 4;
    }
  },
  oj = (e, t) => {
    ux['symbol'.concat(Wa(e))] = t;
  },
  fx = (e) => {
    var { type: t = 'circle', size: r = 64, sizeType: n = 'area' } = e,
      i = tj(e, Zk),
      a = dp(dp({}, i), {}, { type: t, size: r, sizeType: n }),
      o = 'circle';
    typeof t == 'string' && (o = t);
    var s = () => {
        var h = ij(o),
          m = Ek()
            .type(h)
            .size(aj(r, n, o)),
          p = m();
        if (p !== null) return p;
      },
      { className: l, cx: c, cy: u } = a,
      f = Ct(a);
    return X(c) && X(u) && X(r)
      ? d.createElement(
          'path',
          Lf({}, f, {
            className: Ne('recharts-symbols', l),
            transform: 'translate('.concat(c, ', ').concat(u, ')'),
            d: s(),
          }),
        )
      : null;
  };
fx.registerSymbol = oj;
var dx = (e) => 'radius' in e && 'startAngle' in e && 'endAngle' in e,
  Yd = (e, t) => {
    if (!e || typeof e == 'function' || typeof e == 'boolean') return null;
    var r = e;
    if ((d.isValidElement(e) && (r = e.props), typeof r != 'object' && typeof r != 'function')) return null;
    var n = {};
    return (
      Object.keys(r).forEach((i) => {
        zd(i) && typeof r[i] == 'function' && (n[i] = (a) => r[i](r, a));
      }),
      n
    );
  },
  sj = (e, t, r) => (n) => (e(t, r, n), null),
  Xd = (e, t, r) => {
    if (e === null || (typeof e != 'object' && typeof e != 'function')) return null;
    var n = null;
    return (
      Object.keys(e).forEach((i) => {
        var a = e[i];
        zd(i) && typeof a == 'function' && (n || (n = {}), (n[i] = sj(a, t, r)));
      }),
      n
    );
  };
function hp(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function lj(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? hp(Object(r), !0).forEach(function (n) {
          cj(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : hp(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function cj(e, t, r) {
  return (
    (t = uj(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function uj(e) {
  var t = fj(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function fj(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Mt(e, t) {
  var r = lj({}, e),
    n = t,
    i = Object.keys(t),
    a = i.reduce((o, s) => (o[s] === void 0 && n[s] !== void 0 && (o[s] = n[s]), o), r);
  return a;
}
var tu = {},
  ru = {},
  mp;
function dj() {
  return (
    mp ||
      ((mp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r, n) {
          const i = new Map();
          for (let a = 0; a < r.length; a++) {
            const o = r[a],
              s = n(o, a, r);
            i.has(s) || i.set(s, o);
          }
          return Array.from(i.values());
        }
        e.uniqBy = t;
      })(ru)),
    ru
  );
}
var nu = {},
  pp;
function hj() {
  return (
    pp ||
      ((pp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r, n) {
          return function (...i) {
            return r.apply(this, i.slice(0, n));
          };
        }
        e.ary = t;
      })(nu)),
    nu
  );
}
var iu = {},
  vp;
function hx() {
  return (
    vp ||
      ((vp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return r;
        }
        e.identity = t;
      })(iu)),
    iu
  );
}
var au = {},
  ou = {},
  su = {},
  gp;
function mj() {
  return (
    gp ||
      ((gp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return Number.isSafeInteger(r) && r >= 0;
        }
        e.isLength = t;
      })(su)),
    su
  );
}
var yp;
function mx() {
  return (
    yp ||
      ((yp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = mj();
        function r(n) {
          return n != null && typeof n != 'function' && t.isLength(n.length);
        }
        e.isArrayLike = r;
      })(ou)),
    ou
  );
}
var lu = {},
  bp;
function pj() {
  return (
    bp ||
      ((bp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return typeof r == 'object' && r !== null;
        }
        e.isObjectLike = t;
      })(lu)),
    lu
  );
}
var wp;
function vj() {
  return (
    wp ||
      ((wp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = mx(),
          r = pj();
        function n(i) {
          return r.isObjectLike(i) && t.isArrayLike(i);
        }
        e.isArrayLikeObject = n;
      })(au)),
    au
  );
}
var cu = {},
  uu = {},
  xp;
function gj() {
  return (
    xp ||
      ((xp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Gd();
        function r(n) {
          return function (i) {
            return t.get(i, n);
          };
        }
        e.property = r;
      })(uu)),
    uu
  );
}
var fu = {},
  du = {},
  hu = {},
  mu = {},
  Sp;
function px() {
  return (
    Sp ||
      ((Sp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return r !== null && (typeof r == 'object' || typeof r == 'function');
        }
        e.isObject = t;
      })(mu)),
    mu
  );
}
var pu = {},
  Ap;
function vx() {
  return (
    Ap ||
      ((Ap = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return r == null || (typeof r != 'object' && typeof r != 'function');
        }
        e.isPrimitive = t;
      })(pu)),
    pu
  );
}
var vu = {},
  Pp;
function gx() {
  return (
    Pp ||
      ((Pp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r, n) {
          return r === n || (Number.isNaN(r) && Number.isNaN(n));
        }
        e.isEqualsSameValueZero = t;
      })(vu)),
    vu
  );
}
var Cp;
function yj() {
  return (
    Cp ||
      ((Cp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = px(),
          r = vx(),
          n = gx();
        function i(u, f, h) {
          return typeof h != 'function'
            ? i(u, f, () => {})
            : a(
                u,
                f,
                function m(p, v, g, b, S, x) {
                  const A = h(p, v, g, b, S, x);
                  return A !== void 0 ? !!A : a(p, v, m, x);
                },
                new Map(),
              );
        }
        function a(u, f, h, m) {
          if (f === u) return !0;
          switch (typeof f) {
            case 'object':
              return o(u, f, h, m);
            case 'function':
              return Object.keys(f).length > 0 ? a(u, { ...f }, h, m) : n.isEqualsSameValueZero(u, f);
            default:
              return t.isObject(u) ? (typeof f == 'string' ? f === '' : !0) : n.isEqualsSameValueZero(u, f);
          }
        }
        function o(u, f, h, m) {
          if (f == null) return !0;
          if (Array.isArray(f)) return l(u, f, h, m);
          if (f instanceof Map) return s(u, f, h, m);
          if (f instanceof Set) return c(u, f, h, m);
          const p = Object.keys(f);
          if (u == null || r.isPrimitive(u)) return p.length === 0;
          if (p.length === 0) return !0;
          if (m?.has(f)) return m.get(f) === u;
          m?.set(f, u);
          try {
            for (let v = 0; v < p.length; v++) {
              const g = p[v];
              if (
                (!r.isPrimitive(u) && !(g in u)) ||
                (f[g] === void 0 && u[g] !== void 0) ||
                (f[g] === null && u[g] !== null) ||
                !h(u[g], f[g], g, u, f, m)
              )
                return !1;
            }
            return !0;
          } finally {
            m?.delete(f);
          }
        }
        function s(u, f, h, m) {
          if (f.size === 0) return !0;
          if (!(u instanceof Map)) return !1;
          for (const [p, v] of f.entries()) {
            const g = u.get(p);
            if (h(g, v, p, u, f, m) === !1) return !1;
          }
          return !0;
        }
        function l(u, f, h, m) {
          if (f.length === 0) return !0;
          if (!Array.isArray(u)) return !1;
          const p = new Set();
          for (let v = 0; v < f.length; v++) {
            const g = f[v];
            let b = !1;
            for (let S = 0; S < u.length; S++) {
              if (p.has(S)) continue;
              const x = u[S];
              let A = !1;
              if ((h(x, g, v, u, f, m) && (A = !0), A)) {
                (p.add(S), (b = !0));
                break;
              }
            }
            if (!b) return !1;
          }
          return !0;
        }
        function c(u, f, h, m) {
          return f.size === 0 ? !0 : u instanceof Set ? l([...u], [...f], h, m) : !1;
        }
        ((e.isMatchWith = i), (e.isSetMatch = c));
      })(hu)),
    hu
  );
}
var Op;
function yx() {
  return (
    Op ||
      ((Op = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = yj();
        function r(n, i) {
          return t.isMatchWith(n, i, () => {});
        }
        e.isMatch = r;
      })(du)),
    du
  );
}
var gu = {},
  yu = {},
  bu = {},
  _p;
function bj() {
  return (
    _p ||
      ((_p = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return Object.getOwnPropertySymbols(r).filter((n) => Object.prototype.propertyIsEnumerable.call(r, n));
        }
        e.getSymbols = t;
      })(bu)),
    bu
  );
}
var wu = {},
  Ep;
function Zd() {
  return (
    Ep ||
      ((Ep = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return r == null
            ? r === void 0
              ? '[object Undefined]'
              : '[object Null]'
            : Object.prototype.toString.call(r);
        }
        e.getTag = t;
      })(wu)),
    wu
  );
}
var xu = {},
  kp;
function bx() {
  return (
    kp ||
      ((kp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = '[object RegExp]',
          r = '[object String]',
          n = '[object Number]',
          i = '[object Boolean]',
          a = '[object Arguments]',
          o = '[object Symbol]',
          s = '[object Date]',
          l = '[object Map]',
          c = '[object Set]',
          u = '[object Array]',
          f = '[object Function]',
          h = '[object ArrayBuffer]',
          m = '[object Object]',
          p = '[object Error]',
          v = '[object DataView]',
          g = '[object Uint8Array]',
          b = '[object Uint8ClampedArray]',
          S = '[object Uint16Array]',
          x = '[object Uint32Array]',
          A = '[object BigUint64Array]',
          C = '[object Int8Array]',
          P = '[object Int16Array]',
          _ = '[object Int32Array]',
          E = '[object BigInt64Array]',
          j = '[object Float32Array]',
          N = '[object Float64Array]';
        ((e.argumentsTag = a),
          (e.arrayBufferTag = h),
          (e.arrayTag = u),
          (e.bigInt64ArrayTag = E),
          (e.bigUint64ArrayTag = A),
          (e.booleanTag = i),
          (e.dataViewTag = v),
          (e.dateTag = s),
          (e.errorTag = p),
          (e.float32ArrayTag = j),
          (e.float64ArrayTag = N),
          (e.functionTag = f),
          (e.int16ArrayTag = P),
          (e.int32ArrayTag = _),
          (e.int8ArrayTag = C),
          (e.mapTag = l),
          (e.numberTag = n),
          (e.objectTag = m),
          (e.regexpTag = t),
          (e.setTag = c),
          (e.stringTag = r),
          (e.symbolTag = o),
          (e.uint16ArrayTag = S),
          (e.uint32ArrayTag = x),
          (e.uint8ArrayTag = g),
          (e.uint8ClampedArrayTag = b));
      })(xu)),
    xu
  );
}
var Su = {},
  jp;
function wj() {
  return (
    jp ||
      ((jp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return ArrayBuffer.isView(r) && !(r instanceof DataView);
        }
        e.isTypedArray = t;
      })(Su)),
    Su
  );
}
var Np;
function wx() {
  return (
    Np ||
      ((Np = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = bj(),
          r = Zd(),
          n = bx(),
          i = vx(),
          a = wj();
        function o(u, f) {
          return s(u, void 0, u, new Map(), f);
        }
        function s(u, f, h, m = new Map(), p = void 0) {
          const v = p?.(u, f, h, m);
          if (v !== void 0) return v;
          if (i.isPrimitive(u)) return u;
          if (m.has(u)) return m.get(u);
          if (Array.isArray(u)) {
            const g = new Array(u.length);
            m.set(u, g);
            for (let b = 0; b < u.length; b++) g[b] = s(u[b], b, h, m, p);
            return (
              Object.hasOwn(u, 'index') && (g.index = u.index),
              Object.hasOwn(u, 'input') && (g.input = u.input),
              g
            );
          }
          if (u instanceof Date) return new Date(u.getTime());
          if (u instanceof RegExp) {
            const g = new RegExp(u.source, u.flags);
            return ((g.lastIndex = u.lastIndex), g);
          }
          if (u instanceof Map) {
            const g = new Map();
            m.set(u, g);
            for (const [b, S] of u) g.set(b, s(S, b, h, m, p));
            return g;
          }
          if (u instanceof Set) {
            const g = new Set();
            m.set(u, g);
            for (const b of u) g.add(s(b, void 0, h, m, p));
            return g;
          }
          if (typeof Buffer < 'u' && Buffer.isBuffer(u)) return u.subarray();
          if (a.isTypedArray(u)) {
            const g = new (Object.getPrototypeOf(u).constructor)(u.length);
            m.set(u, g);
            for (let b = 0; b < u.length; b++) g[b] = s(u[b], b, h, m, p);
            return g;
          }
          if (u instanceof ArrayBuffer || (typeof SharedArrayBuffer < 'u' && u instanceof SharedArrayBuffer))
            return u.slice(0);
          if (u instanceof DataView) {
            const g = new DataView(u.buffer.slice(0), u.byteOffset, u.byteLength);
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (typeof File < 'u' && u instanceof File) {
            const g = new File([u], u.name, { type: u.type });
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (typeof Blob < 'u' && u instanceof Blob) {
            const g = new Blob([u], { type: u.type });
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (u instanceof Error) {
            const g = structuredClone(u);
            return (
              m.set(u, g),
              (g.message = u.message),
              (g.name = u.name),
              (g.stack = u.stack),
              (g.cause = u.cause),
              (g.constructor = u.constructor),
              l(g, u, h, m, p),
              g
            );
          }
          if (u instanceof Boolean) {
            const g = new Boolean(u.valueOf());
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (u instanceof Number) {
            const g = new Number(u.valueOf());
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (u instanceof String) {
            const g = new String(u.valueOf());
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          if (typeof u == 'object' && c(u)) {
            const g = Object.create(Object.getPrototypeOf(u));
            return (m.set(u, g), l(g, u, h, m, p), g);
          }
          return u;
        }
        function l(u, f, h = u, m, p) {
          const v = [...Object.keys(f), ...t.getSymbols(f)];
          for (let g = 0; g < v.length; g++) {
            const b = v[g],
              S = Object.getOwnPropertyDescriptor(u, b);
            (S == null || S.writable) && (u[b] = s(f[b], b, h, m, p));
          }
        }
        function c(u) {
          switch (r.getTag(u)) {
            case n.argumentsTag:
            case n.arrayTag:
            case n.arrayBufferTag:
            case n.dataViewTag:
            case n.booleanTag:
            case n.dateTag:
            case n.float32ArrayTag:
            case n.float64ArrayTag:
            case n.int8ArrayTag:
            case n.int16ArrayTag:
            case n.int32ArrayTag:
            case n.mapTag:
            case n.numberTag:
            case n.objectTag:
            case n.regexpTag:
            case n.setTag:
            case n.stringTag:
            case n.symbolTag:
            case n.uint8ArrayTag:
            case n.uint8ClampedArrayTag:
            case n.uint16ArrayTag:
            case n.uint32ArrayTag:
              return !0;
            default:
              return !1;
          }
        }
        ((e.cloneDeepWith = o), (e.cloneDeepWithImpl = s), (e.copyProperties = l));
      })(yu)),
    yu
  );
}
var Ip;
function xj() {
  return (
    Ip ||
      ((Ip = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = wx();
        function r(n) {
          return t.cloneDeepWithImpl(n, void 0, n, new Map(), void 0);
        }
        e.cloneDeep = r;
      })(gu)),
    gu
  );
}
var Tp;
function Sj() {
  return (
    Tp ||
      ((Tp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = yx(),
          r = xj();
        function n(i) {
          return ((i = r.cloneDeep(i)), (a) => t.isMatch(a, i));
        }
        e.matches = n;
      })(fu)),
    fu
  );
}
var Au = {},
  Pu = {},
  Cu = {},
  Mp;
function Aj() {
  return (
    Mp ||
      ((Mp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = wx(),
          r = Zd(),
          n = bx();
        function i(a, o) {
          return t.cloneDeepWith(a, (s, l, c, u) => {
            const f = o?.(s, l, c, u);
            if (f !== void 0) return f;
            if (typeof a == 'object') {
              if (r.getTag(a) === n.objectTag && typeof a.constructor != 'function') {
                const h = {};
                return (u.set(a, h), t.copyProperties(h, a, c, u), h);
              }
              switch (Object.prototype.toString.call(a)) {
                case n.numberTag:
                case n.stringTag:
                case n.booleanTag: {
                  const h = new a.constructor(a?.valueOf());
                  return (t.copyProperties(h, a), h);
                }
                case n.argumentsTag: {
                  const h = {};
                  return (t.copyProperties(h, a), (h.length = a.length), (h[Symbol.iterator] = a[Symbol.iterator]), h);
                }
                default:
                  return;
              }
            }
          });
        }
        e.cloneDeepWith = i;
      })(Cu)),
    Cu
  );
}
var Dp;
function Pj() {
  return (
    Dp ||
      ((Dp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Aj();
        function r(n) {
          return t.cloneDeepWith(n);
        }
        e.cloneDeep = r;
      })(Pu)),
    Pu
  );
}
var Ou = {},
  _u = {},
  Rp;
function xx() {
  return (
    Rp ||
      ((Rp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = /^(?:0|[1-9]\d*)$/;
        function r(n, i = Number.MAX_SAFE_INTEGER) {
          switch (typeof n) {
            case 'number':
              return Number.isInteger(n) && n >= 0 && n < i;
            case 'symbol':
              return !1;
            case 'string':
              return t.test(n);
          }
        }
        e.isIndex = r;
      })(_u)),
    _u
  );
}
var Eu = {},
  Lp;
function Cj() {
  return (
    Lp ||
      ((Lp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Zd();
        function r(n) {
          return n !== null && typeof n == 'object' && t.getTag(n) === '[object Arguments]';
        }
        e.isArguments = r;
      })(Eu)),
    Eu
  );
}
var $p;
function Oj() {
  return (
    $p ||
      (($p = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = sx(),
          r = xx(),
          n = Cj(),
          i = Vd();
        function a(o, s) {
          let l;
          if (
            (Array.isArray(s)
              ? (l = s)
              : typeof s == 'string' && t.isDeepKey(s) && o?.[s] == null
                ? (l = i.toPath(s))
                : (l = [s]),
            l.length === 0)
          )
            return !1;
          let c = o;
          for (let u = 0; u < l.length; u++) {
            const f = l[u];
            if (
              (c == null || !Object.hasOwn(c, f)) &&
              !((Array.isArray(c) || n.isArguments(c)) && r.isIndex(f) && f < c.length)
            )
              return !1;
            c = c[f];
          }
          return !0;
        }
        e.has = a;
      })(Ou)),
    Ou
  );
}
var Fp;
function _j() {
  return (
    Fp ||
      ((Fp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = yx(),
          r = qd(),
          n = Pj(),
          i = Gd(),
          a = Oj();
        function o(s, l) {
          switch (typeof s) {
            case 'object': {
              Object.is(s?.valueOf(), -0) && (s = '-0');
              break;
            }
            case 'number': {
              s = r.toKey(s);
              break;
            }
          }
          return (
            (l = n.cloneDeep(l)),
            function (c) {
              const u = i.get(c, s);
              return u === void 0 ? a.has(c, s) : l === void 0 ? u === void 0 : t.isMatch(u, l);
            }
          );
        }
        e.matchesProperty = o;
      })(Au)),
    Au
  );
}
var Bp;
function Ej() {
  return (
    Bp ||
      ((Bp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = hx(),
          r = gj(),
          n = Sj(),
          i = _j();
        function a(o) {
          if (o == null) return t.identity;
          switch (typeof o) {
            case 'function':
              return o;
            case 'object':
              return Array.isArray(o) && o.length === 2 ? i.matchesProperty(o[0], o[1]) : n.matches(o);
            case 'string':
            case 'symbol':
            case 'number':
              return r.property(o);
          }
        }
        e.iteratee = a;
      })(cu)),
    cu
  );
}
var Up;
function kj() {
  return (
    Up ||
      ((Up = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = dj(),
          r = hj(),
          n = hx(),
          i = vj(),
          a = Ej();
        function o(s, l = n.identity) {
          return i.isArrayLikeObject(s) ? t.uniqBy(Array.from(s), r.ary(a.iteratee(l), 1)) : [];
        }
        e.uniqBy = o;
      })(tu)),
    tu
  );
}
var ku, zp;
function jj() {
  return (zp || ((zp = 1), (ku = kj().uniqBy)), ku);
}
var Nj = jj();
const Kp = ki(Nj);
function Ij(e, t, r) {
  return t === !0 ? Kp(e, r) : typeof t == 'function' ? Kp(e, t) : e;
}
var ju = { exports: {} },
  Nu = {},
  Iu = { exports: {} },
  Tu = {};
var Wp;
function Tj() {
  if (Wp) return Tu;
  Wp = 1;
  var e = jd();
  function t(f, h) {
    return (f === h && (f !== 0 || 1 / f === 1 / h)) || (f !== f && h !== h);
  }
  var r = typeof Object.is == 'function' ? Object.is : t,
    n = e.useState,
    i = e.useEffect,
    a = e.useLayoutEffect,
    o = e.useDebugValue;
  function s(f, h) {
    var m = h(),
      p = n({ inst: { value: m, getSnapshot: h } }),
      v = p[0].inst,
      g = p[1];
    return (
      a(
        function () {
          ((v.value = m), (v.getSnapshot = h), l(v) && g({ inst: v }));
        },
        [f, m, h],
      ),
      i(
        function () {
          return (
            l(v) && g({ inst: v }),
            f(function () {
              l(v) && g({ inst: v });
            })
          );
        },
        [f],
      ),
      o(m),
      m
    );
  }
  function l(f) {
    var h = f.getSnapshot;
    f = f.value;
    try {
      var m = h();
      return !r(f, m);
    } catch {
      return !0;
    }
  }
  function c(f, h) {
    return h();
  }
  var u = typeof window > 'u' || typeof window.document > 'u' || typeof window.document.createElement > 'u' ? c : s;
  return ((Tu.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u), Tu);
}
var Hp;
function Mj() {
  return (Hp || ((Hp = 1), (Iu.exports = Tj())), Iu.exports);
}
var qp;
function Dj() {
  if (qp) return Nu;
  qp = 1;
  var e = jd(),
    t = Mj();
  function r(c, u) {
    return (c === u && (c !== 0 || 1 / c === 1 / u)) || (c !== c && u !== u);
  }
  var n = typeof Object.is == 'function' ? Object.is : r,
    i = t.useSyncExternalStore,
    a = e.useRef,
    o = e.useEffect,
    s = e.useMemo,
    l = e.useDebugValue;
  return (
    (Nu.useSyncExternalStoreWithSelector = function (c, u, f, h, m) {
      var p = a(null);
      if (p.current === null) {
        var v = { hasValue: !1, value: null };
        p.current = v;
      } else v = p.current;
      p = s(
        function () {
          function b(P) {
            if (!S) {
              if (((S = !0), (x = P), (P = h(P)), m !== void 0 && v.hasValue)) {
                var _ = v.value;
                if (m(_, P)) return (A = _);
              }
              return (A = P);
            }
            if (((_ = A), n(x, P))) return _;
            var E = h(P);
            return m !== void 0 && m(_, E) ? ((x = P), _) : ((x = P), (A = E));
          }
          var S = !1,
            x,
            A,
            C = f === void 0 ? null : f;
          return [
            function () {
              return b(u());
            },
            C === null
              ? void 0
              : function () {
                  return b(C());
                },
          ];
        },
        [u, f, h, m],
      );
      var g = i(c, p[0], p[1]);
      return (
        o(
          function () {
            ((v.hasValue = !0), (v.value = g));
          },
          [g],
        ),
        l(g),
        g
      );
    }),
    Nu
  );
}
var Vp;
function Rj() {
  return (Vp || ((Vp = 1), (ju.exports = Dj())), ju.exports);
}
var Lj = Rj(),
  Jd = d.createContext(null),
  $j = (e) => e,
  Ke = () => {
    var e = d.useContext(Jd);
    return e ? e.store.dispatch : $j;
  },
  as = () => {},
  Fj = () => as,
  Bj = (e, t) => e === t;
function re(e) {
  var t = d.useContext(Jd),
    r = d.useMemo(
      () =>
        t
          ? (n) => {
              if (n != null) return e(n);
            }
          : as,
      [t, e],
    );
  return Lj.useSyncExternalStoreWithSelector(
    t ? t.subscription.addNestedSub : Fj,
    t ? t.store.getState : as,
    t ? t.store.getState : as,
    r,
    Bj,
  );
}
function Uj(e, t = `expected a function, instead received ${typeof e}`) {
  if (typeof e != 'function') throw new TypeError(t);
}
function zj(e, t = `expected an object, instead received ${typeof e}`) {
  if (typeof e != 'object') throw new TypeError(t);
}
function Kj(e, t = 'expected all items to be functions, instead received the following types: ') {
  if (!e.every((r) => typeof r == 'function')) {
    const r = e.map((n) => (typeof n == 'function' ? `function ${n.name || 'unnamed'}()` : typeof n)).join(', ');
    throw new TypeError(`${t}[${r}]`);
  }
}
var Gp = (e) => (Array.isArray(e) ? e : [e]);
function Wj(e) {
  const t = Array.isArray(e[0]) ? e[0] : e;
  return (Kj(t, 'createSelector expects all input-selectors to be functions, but received the following types: '), t);
}
function Hj(e, t) {
  const r = [],
    { length: n } = e;
  for (let i = 0; i < n; i++) r.push(e[i].apply(null, t));
  return r;
}
var qj = class {
    constructor(e) {
      this.value = e;
    }
    deref() {
      return this.value;
    }
  },
  Vj = typeof WeakRef < 'u' ? WeakRef : qj,
  Gj = 0,
  Yp = 1;
function Lo() {
  return { s: Gj, v: void 0, o: null, p: null };
}
function Sx(e, t = {}) {
  let r = Lo();
  const { resultEqualityCheck: n } = t;
  let i,
    a = 0;
  function o() {
    let s = r;
    const { length: l } = arguments;
    for (let f = 0, h = l; f < h; f++) {
      const m = arguments[f];
      if (typeof m == 'function' || (typeof m == 'object' && m !== null)) {
        let p = s.o;
        p === null && (s.o = p = new WeakMap());
        const v = p.get(m);
        v === void 0 ? ((s = Lo()), p.set(m, s)) : (s = v);
      } else {
        let p = s.p;
        p === null && (s.p = p = new Map());
        const v = p.get(m);
        v === void 0 ? ((s = Lo()), p.set(m, s)) : (s = v);
      }
    }
    const c = s;
    let u;
    if (s.s === Yp) u = s.v;
    else if (((u = e.apply(null, arguments)), a++, n)) {
      const f = i?.deref?.() ?? i;
      (f != null && n(f, u) && ((u = f), a !== 0 && a--),
        (i = (typeof u == 'object' && u !== null) || typeof u == 'function' ? new Vj(u) : u));
    }
    return ((c.s = Yp), (c.v = u), u);
  }
  return (
    (o.clearCache = () => {
      ((r = Lo()), o.resetResultsCount());
    }),
    (o.resultsCount = () => a),
    (o.resetResultsCount = () => {
      a = 0;
    }),
    o
  );
}
function Yj(e, ...t) {
  const r = typeof e == 'function' ? { memoize: e, memoizeOptions: t } : e,
    n = (...i) => {
      let a = 0,
        o = 0,
        s,
        l = {},
        c = i.pop();
      (typeof c == 'object' && ((l = c), (c = i.pop())),
        Uj(c, `createSelector expects an output function after the inputs, but received: [${typeof c}]`));
      const u = { ...r, ...l },
        { memoize: f, memoizeOptions: h = [], argsMemoize: m = Sx, argsMemoizeOptions: p = [] } = u,
        v = Gp(h),
        g = Gp(p),
        b = Wj(i),
        S = f(
          function () {
            return (a++, c.apply(null, arguments));
          },
          ...v,
        ),
        x = m(
          function () {
            o++;
            const C = Hj(b, arguments);
            return ((s = S.apply(null, C)), s);
          },
          ...g,
        );
      return Object.assign(x, {
        resultFunc: c,
        memoizedResultFunc: S,
        dependencies: b,
        dependencyRecomputations: () => o,
        resetDependencyRecomputations: () => {
          o = 0;
        },
        lastResult: () => s,
        recomputations: () => a,
        resetRecomputations: () => {
          a = 0;
        },
        memoize: f,
        argsMemoize: m,
      });
    };
  return (Object.assign(n, { withTypes: () => n }), n);
}
var I = Yj(Sx),
  Xj = Object.assign(
    (e, t = I) => {
      zj(
        e,
        `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`,
      );
      const r = Object.keys(e),
        n = r.map((a) => e[a]);
      return t(n, (...a) => a.reduce((o, s, l) => ((o[r[l]] = s), o), {}));
    },
    { withTypes: () => Xj },
  ),
  Mu = {},
  Du = {},
  Ru = {},
  Xp;
function Zj() {
  return (
    Xp ||
      ((Xp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(n) {
          return typeof n == 'symbol' ? 1 : n === null ? 2 : n === void 0 ? 3 : n !== n ? 4 : 0;
        }
        const r = (n, i, a) => {
          if (n !== i) {
            const o = t(n),
              s = t(i);
            if (o === s && o === 0) {
              if (n < i) return a === 'desc' ? 1 : -1;
              if (n > i) return a === 'desc' ? -1 : 1;
            }
            return a === 'desc' ? s - o : o - s;
          }
          return 0;
        };
        e.compareValues = r;
      })(Ru)),
    Ru
  );
}
var Lu = {},
  $u = {},
  Zp;
function Ax() {
  return (
    Zp ||
      ((Zp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          return typeof r == 'symbol' || r instanceof Symbol;
        }
        e.isSymbol = t;
      })($u)),
    $u
  );
}
var Jp;
function Jj() {
  return (
    Jp ||
      ((Jp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Ax(),
          r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          n = /^\w*$/;
        function i(a, o) {
          return Array.isArray(a)
            ? !1
            : typeof a == 'number' || typeof a == 'boolean' || a == null || t.isSymbol(a)
              ? !0
              : (typeof a == 'string' && (n.test(a) || !r.test(a))) || (o != null && Object.hasOwn(o, a));
        }
        e.isKey = i;
      })(Lu)),
    Lu
  );
}
var Qp;
function Qj() {
  return (
    Qp ||
      ((Qp = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Zj(),
          r = Jj(),
          n = Vd();
        function i(a, o, s, l) {
          if (a == null) return [];
          ((s = l ? void 0 : s),
            Array.isArray(a) || (a = Object.values(a)),
            Array.isArray(o) || (o = o == null ? [null] : [o]),
            o.length === 0 && (o = [null]),
            Array.isArray(s) || (s = s == null ? [] : [s]),
            (s = s.map((m) => String(m))));
          const c = (m, p) => {
              let v = m;
              for (let g = 0; g < p.length && v != null; ++g) v = v[p[g]];
              return v;
            },
            u = (m, p) =>
              p == null || m == null
                ? p
                : typeof m == 'object' && 'key' in m
                  ? Object.hasOwn(p, m.key)
                    ? p[m.key]
                    : c(p, m.path)
                  : typeof m == 'function'
                    ? m(p)
                    : Array.isArray(m)
                      ? c(p, m)
                      : typeof p == 'object'
                        ? p[m]
                        : p,
            f = o.map(
              (m) => (
                Array.isArray(m) && m.length === 1 && (m = m[0]),
                m == null || typeof m == 'function' || Array.isArray(m) || r.isKey(m)
                  ? m
                  : { key: m, path: n.toPath(m) }
              ),
            );
          return a
            .map((m) => ({ original: m, criteria: f.map((p) => u(p, m)) }))
            .slice()
            .sort((m, p) => {
              for (let v = 0; v < f.length; v++) {
                const g = t.compareValues(m.criteria[v], p.criteria[v], s[v]);
                if (g !== 0) return g;
              }
              return 0;
            })
            .map((m) => m.original);
        }
        e.orderBy = i;
      })(Du)),
    Du
  );
}
var Fu = {},
  ev;
function eN() {
  return (
    ev ||
      ((ev = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r, n = 1) {
          const i = [],
            a = Math.floor(n),
            o = (s, l) => {
              for (let c = 0; c < s.length; c++) {
                const u = s[c];
                Array.isArray(u) && l < a ? o(u, l + 1) : i.push(u);
              }
            };
          return (o(r, 0), i);
        }
        e.flatten = t;
      })(Fu)),
    Fu
  );
}
var Bu = {},
  tv;
function Px() {
  return (
    tv ||
      ((tv = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = xx(),
          r = mx(),
          n = px(),
          i = gx();
        function a(o, s, l) {
          return n.isObject(l) &&
            ((typeof s == 'number' && r.isArrayLike(l) && t.isIndex(s) && s < l.length) ||
              (typeof s == 'string' && s in l))
            ? i.isEqualsSameValueZero(l[s], o)
            : !1;
        }
        e.isIterateeCall = a;
      })(Bu)),
    Bu
  );
}
var rv;
function tN() {
  return (
    rv ||
      ((rv = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Qj(),
          r = eN(),
          n = Px();
        function i(a, ...o) {
          const s = o.length;
          return (
            s > 1 && n.isIterateeCall(a, o[0], o[1])
              ? (o = [])
              : s > 2 && n.isIterateeCall(o[0], o[1], o[2]) && (o = [o[0]]),
            t.orderBy(a, r.flatten(o), ['asc'])
          );
        }
        e.sortBy = i;
      })(Mu)),
    Mu
  );
}
var Uu, nv;
function rN() {
  return (nv || ((nv = 1), (Uu = tN().sortBy)), Uu);
}
var nN = rN();
const bl = ki(nN);
var Cx = (e) => e.legend.settings,
  iN = (e) => e.legend.size,
  aN = (e) => e.legend.payload;
I([aN, Cx], (e, t) => {
  var { itemSorter: r } = t,
    n = e.flat(1);
  return r ? bl(n, r) : n;
});
var $o = 1;
function oN() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    [t, r] = d.useState({ height: 0, left: 0, top: 0, width: 0 }),
    n = d.useCallback(
      (i) => {
        if (i != null) {
          var a = i.getBoundingClientRect(),
            o = { height: a.height, left: a.left, top: a.top, width: a.width };
          (Math.abs(o.height - t.height) > $o ||
            Math.abs(o.left - t.left) > $o ||
            Math.abs(o.top - t.top) > $o ||
            Math.abs(o.width - t.width) > $o) &&
            r({ height: o.height, left: o.left, top: o.top, width: o.width });
        }
      },
      [t.width, t.height, t.top, t.left, ...e],
    );
  return [t, n];
}
function ft(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var sN = (typeof Symbol == 'function' && Symbol.observable) || '@@observable',
  iv = sN,
  zu = () => Math.random().toString(36).substring(7).split('').join('.'),
  lN = {
    INIT: `@@redux/INIT${zu()}`,
    REPLACE: `@@redux/REPLACE${zu()}`,
    PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${zu()}`,
  },
  ws = lN;
function Qd(e) {
  if (typeof e != 'object' || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; ) t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function Ox(e, t, r) {
  if (typeof e != 'function') throw new Error(ft(2));
  if (
    (typeof t == 'function' && typeof r == 'function') ||
    (typeof r == 'function' && typeof arguments[3] == 'function')
  )
    throw new Error(ft(0));
  if ((typeof t == 'function' && typeof r > 'u' && ((r = t), (t = void 0)), typeof r < 'u')) {
    if (typeof r != 'function') throw new Error(ft(1));
    return r(Ox)(e, t);
  }
  let n = e,
    i = t,
    a = new Map(),
    o = a,
    s = 0,
    l = !1;
  function c() {
    o === a &&
      ((o = new Map()),
      a.forEach((g, b) => {
        o.set(b, g);
      }));
  }
  function u() {
    if (l) throw new Error(ft(3));
    return i;
  }
  function f(g) {
    if (typeof g != 'function') throw new Error(ft(4));
    if (l) throw new Error(ft(5));
    let b = !0;
    c();
    const S = s++;
    return (
      o.set(S, g),
      function () {
        if (b) {
          if (l) throw new Error(ft(6));
          ((b = !1), c(), o.delete(S), (a = null));
        }
      }
    );
  }
  function h(g) {
    if (!Qd(g)) throw new Error(ft(7));
    if (typeof g.type > 'u') throw new Error(ft(8));
    if (typeof g.type != 'string') throw new Error(ft(17));
    if (l) throw new Error(ft(9));
    try {
      ((l = !0), (i = n(i, g)));
    } finally {
      l = !1;
    }
    return (
      (a = o).forEach((S) => {
        S();
      }),
      g
    );
  }
  function m(g) {
    if (typeof g != 'function') throw new Error(ft(10));
    ((n = g), h({ type: ws.REPLACE }));
  }
  function p() {
    const g = f;
    return {
      subscribe(b) {
        if (typeof b != 'object' || b === null) throw new Error(ft(11));
        function S() {
          const A = b;
          A.next && A.next(u());
        }
        return (S(), { unsubscribe: g(S) });
      },
      [iv]() {
        return this;
      },
    };
  }
  return (h({ type: ws.INIT }), { dispatch: h, subscribe: f, getState: u, replaceReducer: m, [iv]: p });
}
function cN(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, { type: ws.INIT }) > 'u') throw new Error(ft(12));
    if (typeof r(void 0, { type: ws.PROBE_UNKNOWN_ACTION() }) > 'u') throw new Error(ft(13));
  });
}
function _x(e) {
  const t = Object.keys(e),
    r = {};
  for (let a = 0; a < t.length; a++) {
    const o = t[a];
    typeof e[o] == 'function' && (r[o] = e[o]);
  }
  const n = Object.keys(r);
  let i;
  try {
    cN(r);
  } catch (a) {
    i = a;
  }
  return function (o = {}, s) {
    if (i) throw i;
    let l = !1;
    const c = {};
    for (let u = 0; u < n.length; u++) {
      const f = n[u],
        h = r[f],
        m = o[f],
        p = h(m, s);
      if (typeof p > 'u') throw (s && s.type, new Error(ft(14)));
      ((c[f] = p), (l = l || p !== m));
    }
    return ((l = l || n.length !== Object.keys(o).length), l ? c : o);
  };
}
function xs(...e) {
  return e.length === 0
    ? (t) => t
    : e.length === 1
      ? e[0]
      : e.reduce(
          (t, r) =>
            (...n) =>
              t(r(...n)),
        );
}
function uN(...e) {
  return (t) => (r, n) => {
    const i = t(r, n);
    let a = () => {
      throw new Error(ft(15));
    };
    const o = { getState: i.getState, dispatch: (l, ...c) => a(l, ...c) },
      s = e.map((l) => l(o));
    return ((a = xs(...s)(i.dispatch)), { ...i, dispatch: a });
  };
}
function Ex(e) {
  return Qd(e) && 'type' in e && typeof e.type == 'string';
}
var kx = Symbol.for('immer-nothing'),
  av = Symbol.for('immer-draftable'),
  Ot = Symbol.for('immer-state');
function ir(e, ...t) {
  throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var Lt = Object,
  Si = Lt.getPrototypeOf,
  Ss = 'constructor',
  wl = 'prototype',
  $f = 'configurable',
  As = 'enumerable',
  os = 'writable',
  _a = 'value',
  zr = (e) => !!e && !!e[Ot];
function cr(e) {
  return e ? jx(e) || Sl(e) || !!e[av] || !!e[Ss]?.[av] || Al(e) || Pl(e) : !1;
}
var fN = Lt[wl][Ss].toString(),
  ov = new WeakMap();
function jx(e) {
  if (!e || !eh(e)) return !1;
  const t = Si(e);
  if (t === null || t === Lt[wl]) return !0;
  const r = Lt.hasOwnProperty.call(t, Ss) && t[Ss];
  if (r === Object) return !0;
  if (!di(r)) return !1;
  let n = ov.get(r);
  return (n === void 0 && ((n = Function.toString.call(r)), ov.set(r, n)), n === fN);
}
function xl(e, t, r = !0) {
  Ha(e) === 0
    ? (r ? Reflect.ownKeys(e) : Lt.keys(e)).forEach((i) => {
        t(i, e[i], e);
      })
    : e.forEach((n, i) => t(i, n, e));
}
function Ha(e) {
  const t = e[Ot];
  return t ? t.type_ : Sl(e) ? 1 : Al(e) ? 2 : Pl(e) ? 3 : 0;
}
var sv = (e, t, r = Ha(e)) => (r === 2 ? e.has(t) : Lt[wl].hasOwnProperty.call(e, t)),
  Ff = (e, t, r = Ha(e)) => (r === 2 ? e.get(t) : e[t]),
  Ps = (e, t, r, n = Ha(e)) => {
    n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : (e[t] = r);
  };
function dN(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Sl = Array.isArray,
  Al = (e) => e instanceof Map,
  Pl = (e) => e instanceof Set,
  eh = (e) => typeof e == 'object',
  di = (e) => typeof e == 'function',
  Ku = (e) => typeof e == 'boolean';
function hN(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
var jr = (e) => e.copy_ || e.base_,
  th = (e) => (e.modified_ ? e.copy_ : e.base_);
function Bf(e, t) {
  if (Al(e)) return new Map(e);
  if (Pl(e)) return new Set(e);
  if (Sl(e)) return Array[wl].slice.call(e);
  const r = jx(e);
  if (t === !0 || (t === 'class_only' && !r)) {
    const n = Lt.getOwnPropertyDescriptors(e);
    delete n[Ot];
    let i = Reflect.ownKeys(n);
    for (let a = 0; a < i.length; a++) {
      const o = i[a],
        s = n[o];
      (s[os] === !1 && ((s[os] = !0), (s[$f] = !0)),
        (s.get || s.set) && (n[o] = { [$f]: !0, [os]: !0, [As]: s[As], [_a]: e[o] }));
    }
    return Lt.create(Si(e), n);
  } else {
    const n = Si(e);
    if (n !== null && r) return { ...e };
    const i = Lt.create(n);
    return Lt.assign(i, e);
  }
}
function rh(e, t = !1) {
  return (
    Cl(e) ||
      zr(e) ||
      !cr(e) ||
      (Ha(e) > 1 && Lt.defineProperties(e, { set: Fo, add: Fo, clear: Fo, delete: Fo }),
      Lt.freeze(e),
      t &&
        xl(
          e,
          (r, n) => {
            rh(n, !0);
          },
          !1,
        )),
    e
  );
}
function mN() {
  ir(2);
}
var Fo = { [_a]: mN };
function Cl(e) {
  return e === null || !eh(e) ? !0 : Lt.isFrozen(e);
}
var Cs = 'MapSet',
  Uf = 'Patches',
  lv = 'ArrayMethods',
  Nx = {};
function Un(e) {
  const t = Nx[e];
  return (t || ir(0, e), t);
}
var cv = (e) => !!Nx[e],
  Ea,
  Ix = () => Ea,
  pN = (e, t) => ({
    drafts_: [],
    parent_: e,
    immer_: t,
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0,
    handledSet_: new Set(),
    processedForPatches_: new Set(),
    mapSetPlugin_: cv(Cs) ? Un(Cs) : void 0,
    arrayMethodsPlugin_: cv(lv) ? Un(lv) : void 0,
  });
function uv(e, t) {
  t && ((e.patchPlugin_ = Un(Uf)), (e.patches_ = []), (e.inversePatches_ = []), (e.patchListener_ = t));
}
function zf(e) {
  (Kf(e), e.drafts_.forEach(vN), (e.drafts_ = null));
}
function Kf(e) {
  e === Ea && (Ea = e.parent_);
}
var fv = (e) => (Ea = pN(Ea, e));
function vN(e) {
  const t = e[Ot];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : (t.revoked_ = !0);
}
function dv(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  if (e !== void 0 && e !== r) {
    (r[Ot].modified_ && (zf(t), ir(4)), cr(e) && (e = hv(t, e)));
    const { patchPlugin_: i } = t;
    i && i.generateReplacementPatches_(r[Ot].base_, e, t);
  } else e = hv(t, r);
  return (gN(t, e, !0), zf(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== kx ? e : void 0);
}
function hv(e, t) {
  if (Cl(t)) return t;
  const r = t[Ot];
  if (!r) return Os(t, e.handledSet_, e);
  if (!Ol(r, e)) return t;
  if (!r.modified_) return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n) for (; n.length > 0; ) n.pop()(e);
    Dx(r, e);
  }
  return r.copy_;
}
function gN(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && rh(t, r);
}
function Tx(e) {
  ((e.finalized_ = !0), e.scope_.unfinalizedDrafts_--);
}
var Ol = (e, t) => e.scope_ === t,
  yN = [];
function Mx(e, t, r, n) {
  const i = jr(e),
    a = e.type_;
  if (n !== void 0 && Ff(i, n, a) === t) {
    Ps(i, n, r, a);
    return;
  }
  if (!e.draftLocations_) {
    const s = (e.draftLocations_ = new Map());
    xl(i, (l, c) => {
      if (zr(c)) {
        const u = s.get(c) || [];
        (u.push(l), s.set(c, u));
      }
    });
  }
  const o = e.draftLocations_.get(t) ?? yN;
  for (const s of o) Ps(i, s, r, a);
}
function bN(e, t, r) {
  e.callbacks_.push(function (i) {
    const a = t;
    if (!a || !Ol(a, i)) return;
    i.mapSetPlugin_?.fixSetContents(a);
    const o = th(a);
    (Mx(e, a.draft_ ?? a, o, r), Dx(a, i));
  });
}
function Dx(e, t) {
  if (
    e.modified_ &&
    !e.finalized_ &&
    (e.type_ === 3 || (e.type_ === 1 && e.allIndicesReassigned_) || (e.assigned_?.size ?? 0) > 0)
  ) {
    const { patchPlugin_: n } = t;
    if (n) {
      const i = n.getPath(e);
      i && n.generatePatches_(e, i, t);
    }
    Tx(e);
  }
}
function wN(e, t, r) {
  const { scope_: n } = e;
  if (zr(r)) {
    const i = r[Ot];
    Ol(i, n) &&
      i.callbacks_.push(function () {
        ss(e);
        const o = th(i);
        Mx(e, r, o, t);
      });
  } else
    cr(r) &&
      e.callbacks_.push(function () {
        const a = jr(e);
        e.type_ === 3
          ? a.has(r) && Os(r, n.handledSet_, n)
          : Ff(a, t, e.type_) === r &&
            n.drafts_.length > 1 &&
            (e.assigned_.get(t) ?? !1) === !0 &&
            e.copy_ &&
            Os(Ff(e.copy_, t, e.type_), n.handledSet_, n);
      });
}
function Os(e, t, r) {
  return (
    (!r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1) ||
      zr(e) ||
      t.has(e) ||
      !cr(e) ||
      Cl(e) ||
      (t.add(e),
      xl(e, (n, i) => {
        if (zr(i)) {
          const a = i[Ot];
          if (Ol(a, r)) {
            const o = th(a);
            (Ps(e, n, o, e.type_), Tx(a));
          }
        } else cr(i) && Os(i, t, r);
      })),
    e
  );
}
function xN(e, t) {
  const r = Sl(e),
    n = {
      type_: r ? 1 : 0,
      scope_: t ? t.scope_ : Ix(),
      modified_: !1,
      finalized_: !1,
      assigned_: void 0,
      parent_: t,
      base_: e,
      draft_: null,
      copy_: null,
      revoke_: null,
      isManual_: !1,
      callbacks_: void 0,
    };
  let i = n,
    a = _s;
  r && ((i = [n]), (a = ka));
  const { revoke: o, proxy: s } = Proxy.revocable(i, a);
  return ((n.draft_ = s), (n.revoke_ = o), [s, n]);
}
var _s = {
    get(e, t) {
      if (t === Ot) return e;
      let r = e.scope_.arrayMethodsPlugin_;
      const n = e.type_ === 1 && typeof t == 'string';
      if (n && r?.isArrayOperationMethod(t)) return r.createMethodInterceptor(e, t);
      const i = jr(e);
      if (!sv(i, t, e.type_)) return SN(e, i, t);
      const a = i[t];
      if (e.finalized_ || !cr(a) || (n && e.operationMethod && r?.isMutatingArrayMethod(e.operationMethod) && hN(t)))
        return a;
      if (a === Wu(e.base_, t)) {
        ss(e);
        const o = e.type_ === 1 ? +t : t,
          s = Hf(e.scope_, a, e, o);
        return (e.copy_[o] = s);
      }
      return a;
    },
    has(e, t) {
      return t in jr(e);
    },
    ownKeys(e) {
      return Reflect.ownKeys(jr(e));
    },
    set(e, t, r) {
      const n = Rx(jr(e), t);
      if (n?.set) return (n.set.call(e.draft_, r), !0);
      if (!e.modified_) {
        const i = Wu(jr(e), t),
          a = i?.[Ot];
        if (a && a.base_ === r) return ((e.copy_[t] = r), e.assigned_.set(t, !1), !0);
        if (dN(r, i) && (r !== void 0 || sv(e.base_, t, e.type_))) return !0;
        (ss(e), Wf(e));
      }
      return (
        (e.copy_[t] === r && (r !== void 0 || t in e.copy_)) ||
          (Number.isNaN(r) && Number.isNaN(e.copy_[t])) ||
          ((e.copy_[t] = r), e.assigned_.set(t, !0), wN(e, t, r)),
        !0
      );
    },
    deleteProperty(e, t) {
      return (
        ss(e),
        Wu(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Wf(e)) : e.assigned_.delete(t),
        e.copy_ && delete e.copy_[t],
        !0
      );
    },
    getOwnPropertyDescriptor(e, t) {
      const r = jr(e),
        n = Reflect.getOwnPropertyDescriptor(r, t);
      return n && { [os]: !0, [$f]: e.type_ !== 1 || t !== 'length', [As]: n[As], [_a]: r[t] };
    },
    defineProperty() {
      ir(11);
    },
    getPrototypeOf(e) {
      return Si(e.base_);
    },
    setPrototypeOf() {
      ir(12);
    },
  },
  ka = {};
for (let e in _s) {
  let t = _s[e];
  ka[e] = function () {
    const r = arguments;
    return ((r[0] = r[0][0]), t.apply(this, r));
  };
}
ka.deleteProperty = function (e, t) {
  return ka.set.call(this, e, t, void 0);
};
ka.set = function (e, t, r) {
  return _s.set.call(this, e[0], t, r, e[0]);
};
function Wu(e, t) {
  const r = e[Ot];
  return (r ? jr(r) : e)[t];
}
function SN(e, t, r) {
  const n = Rx(t, r);
  return n ? (_a in n ? n[_a] : n.get?.call(e.draft_)) : void 0;
}
function Rx(e, t) {
  if (!(t in e)) return;
  let r = Si(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n) return n;
    r = Si(r);
  }
}
function Wf(e) {
  e.modified_ || ((e.modified_ = !0), e.parent_ && Wf(e.parent_));
}
function ss(e) {
  e.copy_ || ((e.assigned_ = new Map()), (e.copy_ = Bf(e.base_, e.scope_.immer_.useStrictShallowCopy_)));
}
var AN = class {
  constructor(t) {
    ((this.autoFreeze_ = !0),
      (this.useStrictShallowCopy_ = !1),
      (this.useStrictIteration_ = !1),
      (this.produce = (r, n, i) => {
        if (di(r) && !di(n)) {
          const o = n;
          n = r;
          const s = this;
          return function (c = o, ...u) {
            return s.produce(c, (f) => n.call(this, f, ...u));
          };
        }
        (di(n) || ir(6), i !== void 0 && !di(i) && ir(7));
        let a;
        if (cr(r)) {
          const o = fv(this),
            s = Hf(o, r, void 0);
          let l = !0;
          try {
            ((a = n(s)), (l = !1));
          } finally {
            l ? zf(o) : Kf(o);
          }
          return (uv(o, i), dv(a, o));
        } else if (!r || !eh(r)) {
          if (((a = n(r)), a === void 0 && (a = r), a === kx && (a = void 0), this.autoFreeze_ && rh(a, !0), i)) {
            const o = [],
              s = [];
            (Un(Uf).generateReplacementPatches_(r, a, { patches_: o, inversePatches_: s }), i(o, s));
          }
          return a;
        } else ir(1, r);
      }),
      (this.produceWithPatches = (r, n) => {
        if (di(r)) return (s, ...l) => this.produceWithPatches(s, (c) => r(c, ...l));
        let i, a;
        return [
          this.produce(r, n, (s, l) => {
            ((i = s), (a = l));
          }),
          i,
          a,
        ];
      }),
      Ku(t?.autoFreeze) && this.setAutoFreeze(t.autoFreeze),
      Ku(t?.useStrictShallowCopy) && this.setUseStrictShallowCopy(t.useStrictShallowCopy),
      Ku(t?.useStrictIteration) && this.setUseStrictIteration(t.useStrictIteration));
  }
  createDraft(t) {
    (cr(t) || ir(8), zr(t) && (t = Xt(t)));
    const r = fv(this),
      n = Hf(r, t, void 0);
    return ((n[Ot].isManual_ = !0), Kf(r), n);
  }
  finishDraft(t, r) {
    const n = t && t[Ot];
    (!n || !n.isManual_) && ir(9);
    const { scope_: i } = n;
    return (uv(i, r), dv(void 0, i));
  }
  setAutoFreeze(t) {
    this.autoFreeze_ = t;
  }
  setUseStrictShallowCopy(t) {
    this.useStrictShallowCopy_ = t;
  }
  setUseStrictIteration(t) {
    this.useStrictIteration_ = t;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(t, r) {
    let n;
    for (n = r.length - 1; n >= 0; n--) {
      const a = r[n];
      if (a.path.length === 0 && a.op === 'replace') {
        t = a.value;
        break;
      }
    }
    n > -1 && (r = r.slice(n + 1));
    const i = Un(Uf).applyPatches_;
    return zr(t) ? i(t, r) : this.produce(t, (a) => i(a, r));
  }
};
function Hf(e, t, r, n) {
  const [i, a] = Al(t) ? Un(Cs).proxyMap_(t, r) : Pl(t) ? Un(Cs).proxySet_(t, r) : xN(t, r);
  return (
    (r?.scope_ ?? Ix()).drafts_.push(i),
    (a.callbacks_ = r?.callbacks_ ?? []),
    (a.key_ = n),
    r && n !== void 0
      ? bN(r, a, n)
      : a.callbacks_.push(function (l) {
          l.mapSetPlugin_?.fixSetContents(a);
          const { patchPlugin_: c } = l;
          a.modified_ && c && c.generatePatches_(a, [], l);
        }),
    i
  );
}
function Xt(e) {
  return (zr(e) || ir(10, e), Lx(e));
}
function Lx(e) {
  if (!cr(e) || Cl(e)) return e;
  const t = e[Ot];
  let r,
    n = !0;
  if (t) {
    if (!t.modified_) return t.base_;
    ((t.finalized_ = !0),
      (r = Bf(e, t.scope_.immer_.useStrictShallowCopy_)),
      (n = t.scope_.immer_.shouldUseStrictIteration()));
  } else r = Bf(e, !0);
  return (
    xl(
      r,
      (i, a) => {
        Ps(r, i, Lx(a));
      },
      n,
    ),
    t && (t.finalized_ = !1),
    r
  );
}
var PN = new AN(),
  $x = PN.produce;
function Fx(e) {
  return ({ dispatch: r, getState: n }) =>
    (i) =>
    (a) =>
      typeof a == 'function' ? a(r, n, e) : i(a);
}
var CN = Fx(),
  ON = Fx,
  _N =
    typeof window < 'u' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : function () {
          if (arguments.length !== 0) return typeof arguments[0] == 'object' ? xs : xs.apply(null, arguments);
        };
function Bt(e, t) {
  function r(...n) {
    if (t) {
      let i = t(...n);
      if (!i) throw new Error($t(0));
      return {
        type: e,
        payload: i.payload,
        ...('meta' in i && { meta: i.meta }),
        ...('error' in i && { error: i.error }),
      };
    }
    return { type: e, payload: n[0] };
  }
  return ((r.toString = () => `${e}`), (r.type = e), (r.match = (n) => Ex(n) && n.type === e), r);
}
var Bx = class va extends Array {
  constructor(...t) {
    (super(...t), Object.setPrototypeOf(this, va.prototype));
  }
  static get [Symbol.species]() {
    return va;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new va(...t[0].concat(this)) : new va(...t.concat(this));
  }
};
function mv(e) {
  return cr(e) ? $x(e, () => {}) : e;
}
function Bo(e, t, r) {
  return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function EN(e) {
  return typeof e == 'boolean';
}
var kN = () =>
    function (t) {
      const { thunk: r = !0, immutableCheck: n = !0, serializableCheck: i = !0, actionCreatorCheck: a = !0 } = t ?? {};
      let o = new Bx();
      return (r && (EN(r) ? o.push(CN) : o.push(ON(r.extraArgument))), o);
    },
  Ux = 'RTK_autoBatch',
  Te = () => (e) => ({ payload: e, meta: { [Ux]: !0 } }),
  pv = (e) => (t) => {
    setTimeout(t, e);
  },
  zx =
    (e = { type: 'raf' }) =>
    (t) =>
    (...r) => {
      const n = t(...r);
      let i = !0,
        a = !1,
        o = !1;
      const s = new Set(),
        l =
          e.type === 'tick'
            ? queueMicrotask
            : e.type === 'raf'
              ? typeof window < 'u' && window.requestAnimationFrame
                ? window.requestAnimationFrame
                : pv(10)
              : e.type === 'callback'
                ? e.queueNotification
                : pv(e.timeout),
        c = () => {
          ((o = !1), a && ((a = !1), s.forEach((u) => u())));
        };
      return Object.assign({}, n, {
        subscribe(u) {
          const f = () => i && u(),
            h = n.subscribe(f);
          return (
            s.add(u),
            () => {
              (h(), s.delete(u));
            }
          );
        },
        dispatch(u) {
          try {
            return ((i = !u?.meta?.[Ux]), (a = !i), a && (o || ((o = !0), l(c))), n.dispatch(u));
          } finally {
            i = !0;
          }
        },
      });
    },
  jN = (e) =>
    function (r) {
      const { autoBatch: n = !0 } = r ?? {};
      let i = new Bx(e);
      return (n && i.push(zx(typeof n == 'object' ? n : void 0)), i);
    };
function NN(e) {
  const t = kN(),
    {
      reducer: r = void 0,
      middleware: n,
      devTools: i = !0,
      preloadedState: a = void 0,
      enhancers: o = void 0,
    } = e || {};
  let s;
  if (typeof r == 'function') s = r;
  else if (Qd(r)) s = _x(r);
  else throw new Error($t(1));
  let l;
  typeof n == 'function' ? (l = n(t)) : (l = t());
  let c = xs;
  i && (c = _N({ trace: !1, ...(typeof i == 'object' && i) }));
  const u = uN(...l),
    f = jN(u);
  let h = typeof o == 'function' ? o(f) : f();
  const m = c(...h);
  return Ox(s, a, m);
}
function Kx(e) {
  const t = {},
    r = [];
  let n;
  const i = {
    addCase(a, o) {
      const s = typeof a == 'string' ? a : a.type;
      if (!s) throw new Error($t(28));
      if (s in t) throw new Error($t(29));
      return ((t[s] = o), i);
    },
    addAsyncThunk(a, o) {
      return (
        o.pending && (t[a.pending.type] = o.pending),
        o.rejected && (t[a.rejected.type] = o.rejected),
        o.fulfilled && (t[a.fulfilled.type] = o.fulfilled),
        o.settled && r.push({ matcher: a.settled, reducer: o.settled }),
        i
      );
    },
    addMatcher(a, o) {
      return (r.push({ matcher: a, reducer: o }), i);
    },
    addDefaultCase(a) {
      return ((n = a), i);
    },
  };
  return (e(i), [t, r, n]);
}
function IN(e) {
  return typeof e == 'function';
}
function TN(e, t) {
  let [r, n, i] = Kx(t),
    a;
  if (IN(e)) a = () => mv(e());
  else {
    const s = mv(e);
    a = () => s;
  }
  function o(s = a(), l) {
    let c = [r[l.type], ...n.filter(({ matcher: u }) => u(l)).map(({ reducer: u }) => u)];
    return (
      c.filter((u) => !!u).length === 0 && (c = [i]),
      c.reduce((u, f) => {
        if (f)
          if (zr(u)) {
            const m = f(u, l);
            return m === void 0 ? u : m;
          } else {
            if (cr(u)) return $x(u, (h) => f(h, l));
            {
              const h = f(u, l);
              if (h === void 0) {
                if (u === null) return u;
                throw Error('A case reducer on a non-draftable value must not return undefined');
              }
              return h;
            }
          }
        return u;
      }, s)
    );
  }
  return ((o.getInitialState = a), o);
}
var MN = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW',
  DN = (e = 21) => {
    let t = '',
      r = e;
    for (; r--; ) t += MN[(Math.random() * 64) | 0];
    return t;
  },
  RN = Symbol.for('rtk-slice-createasyncthunk');
function LN(e, t) {
  return `${e}/${t}`;
}
function $N({ creators: e } = {}) {
  const t = e?.asyncThunk?.[RN];
  return function (n) {
    const { name: i, reducerPath: a = i } = n;
    if (!i) throw new Error($t(11));
    const o = (typeof n.reducers == 'function' ? n.reducers(BN()) : n.reducers) || {},
      s = Object.keys(o),
      l = { sliceCaseReducersByName: {}, sliceCaseReducersByType: {}, actionCreators: {}, sliceMatchers: [] },
      c = {
        addCase(x, A) {
          const C = typeof x == 'string' ? x : x.type;
          if (!C) throw new Error($t(12));
          if (C in l.sliceCaseReducersByType) throw new Error($t(13));
          return ((l.sliceCaseReducersByType[C] = A), c);
        },
        addMatcher(x, A) {
          return (l.sliceMatchers.push({ matcher: x, reducer: A }), c);
        },
        exposeAction(x, A) {
          return ((l.actionCreators[x] = A), c);
        },
        exposeCaseReducer(x, A) {
          return ((l.sliceCaseReducersByName[x] = A), c);
        },
      };
    s.forEach((x) => {
      const A = o[x],
        C = { reducerName: x, type: LN(i, x), createNotation: typeof n.reducers == 'function' };
      zN(A) ? WN(C, A, c, t) : UN(C, A, c);
    });
    function u() {
      const [x = {}, A = [], C = void 0] =
          typeof n.extraReducers == 'function' ? Kx(n.extraReducers) : [n.extraReducers],
        P = { ...x, ...l.sliceCaseReducersByType };
      return TN(n.initialState, (_) => {
        for (let E in P) _.addCase(E, P[E]);
        for (let E of l.sliceMatchers) _.addMatcher(E.matcher, E.reducer);
        for (let E of A) _.addMatcher(E.matcher, E.reducer);
        C && _.addDefaultCase(C);
      });
    }
    const f = (x) => x,
      h = new Map(),
      m = new WeakMap();
    let p;
    function v(x, A) {
      return (p || (p = u()), p(x, A));
    }
    function g() {
      return (p || (p = u()), p.getInitialState());
    }
    function b(x, A = !1) {
      function C(_) {
        let E = _[x];
        return (typeof E > 'u' && A && (E = Bo(m, C, g)), E);
      }
      function P(_ = f) {
        const E = Bo(h, A, () => new WeakMap());
        return Bo(E, _, () => {
          const j = {};
          for (const [N, M] of Object.entries(n.selectors ?? {})) j[N] = FN(M, _, () => Bo(m, _, g), A);
          return j;
        });
      }
      return {
        reducerPath: x,
        getSelectors: P,
        get selectors() {
          return P(C);
        },
        selectSlice: C,
      };
    }
    const S = {
      name: i,
      reducer: v,
      actions: l.actionCreators,
      caseReducers: l.sliceCaseReducersByName,
      getInitialState: g,
      ...b(a),
      injectInto(x, { reducerPath: A, ...C } = {}) {
        const P = A ?? a;
        return (x.inject({ reducerPath: P, reducer: v }, C), { ...S, ...b(P, !0) });
      },
    };
    return S;
  };
}
function FN(e, t, r, n) {
  function i(a, ...o) {
    let s = t(a);
    return (typeof s > 'u' && n && (s = r()), e(s, ...o));
  }
  return ((i.unwrapped = e), i);
}
var bt = $N();
function BN() {
  function e(t, r) {
    return { _reducerDefinitionType: 'asyncThunk', payloadCreator: t, ...r };
  }
  return (
    (e.withTypes = () => e),
    {
      reducer(t) {
        return Object.assign(
          {
            [t.name](...r) {
              return t(...r);
            },
          }[t.name],
          { _reducerDefinitionType: 'reducer' },
        );
      },
      preparedReducer(t, r) {
        return { _reducerDefinitionType: 'reducerWithPrepare', prepare: t, reducer: r };
      },
      asyncThunk: e,
    }
  );
}
function UN({ type: e, reducerName: t, createNotation: r }, n, i) {
  let a, o;
  if ('reducer' in n) {
    if (r && !KN(n)) throw new Error($t(17));
    ((a = n.reducer), (o = n.prepare));
  } else a = n;
  i.addCase(e, a)
    .exposeCaseReducer(t, a)
    .exposeAction(t, o ? Bt(e, o) : Bt(e));
}
function zN(e) {
  return e._reducerDefinitionType === 'asyncThunk';
}
function KN(e) {
  return e._reducerDefinitionType === 'reducerWithPrepare';
}
function WN({ type: e, reducerName: t }, r, n, i) {
  if (!i) throw new Error($t(18));
  const { payloadCreator: a, fulfilled: o, pending: s, rejected: l, settled: c, options: u } = r,
    f = i(e, a, u);
  (n.exposeAction(t, f),
    o && n.addCase(f.fulfilled, o),
    s && n.addCase(f.pending, s),
    l && n.addCase(f.rejected, l),
    c && n.addMatcher(f.settled, c),
    n.exposeCaseReducer(t, { fulfilled: o || Uo, pending: s || Uo, rejected: l || Uo, settled: c || Uo }));
}
function Uo() {}
var HN = 'task',
  Wx = 'listener',
  Hx = 'completed',
  nh = 'cancelled',
  qN = `task-${nh}`,
  VN = `task-${Hx}`,
  qf = `${Wx}-${nh}`,
  GN = `${Wx}-${Hx}`,
  _l = class {
    constructor(e) {
      ((this.code = e), (this.message = `${HN} ${nh} (reason: ${e})`));
    }
    name = 'TaskAbortError';
    message;
  },
  ih = (e, t) => {
    if (typeof e != 'function') throw new TypeError($t(32));
  },
  Es = () => {},
  qx = (e, t = Es) => (e.catch(t), e),
  Vx = (e, t) => (e.addEventListener('abort', t, { once: !0 }), () => e.removeEventListener('abort', t)),
  Rn = (e) => {
    if (e.aborted) throw new _l(e.reason);
  };
function Gx(e, t) {
  let r = Es;
  return new Promise((n, i) => {
    const a = () => i(new _l(e.reason));
    if (e.aborted) {
      a();
      return;
    }
    ((r = Vx(e, a)), t.finally(() => r()).then(n, i));
  }).finally(() => {
    r = Es;
  });
}
var YN = async (e, t) => {
    try {
      return (await Promise.resolve(), { status: 'ok', value: await e() });
    } catch (r) {
      return { status: r instanceof _l ? 'cancelled' : 'rejected', error: r };
    } finally {
      t?.();
    }
  },
  ks = (e) => (t) => qx(Gx(e, t).then((r) => (Rn(e), r))),
  Yx = (e) => {
    const t = ks(e);
    return (r) => t(new Promise((n) => setTimeout(n, r)));
  },
  { assign: yi } = Object,
  vv = {},
  El = 'listenerMiddleware',
  XN = (e, t) => {
    const r = (n) => Vx(e, () => n.abort(e.reason));
    return (n, i) => {
      ih(n);
      const a = new AbortController();
      r(a);
      const o = YN(
        async () => {
          (Rn(e), Rn(a.signal));
          const s = await n({ pause: ks(a.signal), delay: Yx(a.signal), signal: a.signal });
          return (Rn(a.signal), s);
        },
        () => a.abort(VN),
      );
      return (
        i?.autoJoin && t.push(o.catch(Es)),
        {
          result: ks(e)(o),
          cancel() {
            a.abort(qN);
          },
        }
      );
    };
  },
  ZN = (e, t) => {
    const r = async (n, i) => {
      Rn(t);
      let a = () => {};
      const s = [
        new Promise((l, c) => {
          let u = e({
            predicate: n,
            effect: (f, h) => {
              (h.unsubscribe(), l([f, h.getState(), h.getOriginalState()]));
            },
          });
          a = () => {
            (u(), c());
          };
        }),
      ];
      i != null && s.push(new Promise((l) => setTimeout(l, i, null)));
      try {
        const l = await Gx(t, Promise.race(s));
        return (Rn(t), l);
      } finally {
        a();
      }
    };
    return (n, i) => qx(r(n, i));
  },
  Xx = (e) => {
    let { type: t, actionCreator: r, matcher: n, predicate: i, effect: a } = e;
    if (t) i = Bt(t).match;
    else if (r) ((t = r.type), (i = r.match));
    else if (n) i = n;
    else if (!i) throw new Error($t(21));
    return (ih(a), { predicate: i, type: t, effect: a });
  },
  Zx = yi(
    (e) => {
      const { type: t, predicate: r, effect: n } = Xx(e);
      return {
        id: DN(),
        effect: n,
        type: t,
        predicate: r,
        pending: new Set(),
        unsubscribe: () => {
          throw new Error($t(22));
        },
      };
    },
    { withTypes: () => Zx },
  ),
  gv = (e, t) => {
    const { type: r, effect: n, predicate: i } = Xx(t);
    return Array.from(e.values()).find(
      (a) => (typeof r == 'string' ? a.type === r : a.predicate === i) && a.effect === n,
    );
  },
  Vf = (e) => {
    e.pending.forEach((t) => {
      t.abort(qf);
    });
  },
  JN = (e, t) => () => {
    for (const r of t.keys()) Vf(r);
    e.clear();
  },
  yv = (e, t, r) => {
    try {
      e(t, r);
    } catch (n) {
      setTimeout(() => {
        throw n;
      }, 0);
    }
  },
  Jx = yi(Bt(`${El}/add`), { withTypes: () => Jx }),
  QN = Bt(`${El}/removeAll`),
  Qx = yi(Bt(`${El}/remove`), { withTypes: () => Qx }),
  eI = (...e) => {
    console.error(`${El}/error`, ...e);
  },
  qa = (e = {}) => {
    const t = new Map(),
      r = new Map(),
      n = (m) => {
        const p = r.get(m) ?? 0;
        r.set(m, p + 1);
      },
      i = (m) => {
        const p = r.get(m) ?? 1;
        p === 1 ? r.delete(m) : r.set(m, p - 1);
      },
      { extra: a, onError: o = eI } = e;
    ih(o);
    const s = (m) => (
        (m.unsubscribe = () => t.delete(m.id)),
        t.set(m.id, m),
        (p) => {
          (m.unsubscribe(), p?.cancelActive && Vf(m));
        }
      ),
      l = (m) => {
        const p = gv(t, m) ?? Zx(m);
        return s(p);
      };
    yi(l, { withTypes: () => l });
    const c = (m) => {
      const p = gv(t, m);
      return (p && (p.unsubscribe(), m.cancelActive && Vf(p)), !!p);
    };
    yi(c, { withTypes: () => c });
    const u = async (m, p, v, g) => {
        const b = new AbortController(),
          S = ZN(l, b.signal),
          x = [];
        try {
          (m.pending.add(b),
            n(m),
            await Promise.resolve(
              m.effect(
                p,
                yi({}, v, {
                  getOriginalState: g,
                  condition: (A, C) => S(A, C).then(Boolean),
                  take: S,
                  delay: Yx(b.signal),
                  pause: ks(b.signal),
                  extra: a,
                  signal: b.signal,
                  fork: XN(b.signal, x),
                  unsubscribe: m.unsubscribe,
                  subscribe: () => {
                    t.set(m.id, m);
                  },
                  cancelActiveListeners: () => {
                    m.pending.forEach((A, C, P) => {
                      A !== b && (A.abort(qf), P.delete(A));
                    });
                  },
                  cancel: () => {
                    (b.abort(qf), m.pending.delete(b));
                  },
                  throwIfCancelled: () => {
                    Rn(b.signal);
                  },
                }),
              ),
            ));
        } catch (A) {
          A instanceof _l || yv(o, A, { raisedBy: 'effect' });
        } finally {
          (await Promise.all(x), b.abort(GN), i(m), m.pending.delete(b));
        }
      },
      f = JN(t, r);
    return {
      middleware: (m) => (p) => (v) => {
        if (!Ex(v)) return p(v);
        if (Jx.match(v)) return l(v.payload);
        if (QN.match(v)) {
          f();
          return;
        }
        if (Qx.match(v)) return c(v.payload);
        let g = m.getState();
        const b = () => {
          if (g === vv) throw new Error($t(23));
          return g;
        };
        let S;
        try {
          if (((S = p(v)), t.size > 0)) {
            const x = m.getState(),
              A = Array.from(t.values());
            for (const C of A) {
              let P = !1;
              try {
                P = C.predicate(v, x, g);
              } catch (_) {
                ((P = !1), yv(o, _, { raisedBy: 'predicate' }));
              }
              P && u(C, v, m, b);
            }
          }
        } finally {
          g = vv;
        }
        return S;
      },
      startListening: l,
      stopListening: c,
      clearListeners: f,
    };
  };
function $t(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var tI = { layoutType: 'horizontal', width: 0, height: 0, margin: { top: 5, right: 5, bottom: 5, left: 5 }, scale: 1 },
  e0 = bt({
    name: 'chartLayout',
    initialState: tI,
    reducers: {
      setLayout(e, t) {
        e.layoutType = t.payload;
      },
      setChartSize(e, t) {
        ((e.width = t.payload.width), (e.height = t.payload.height));
      },
      setMargin(e, t) {
        var r, n, i, a;
        ((e.margin.top = (r = t.payload.top) !== null && r !== void 0 ? r : 0),
          (e.margin.right = (n = t.payload.right) !== null && n !== void 0 ? n : 0),
          (e.margin.bottom = (i = t.payload.bottom) !== null && i !== void 0 ? i : 0),
          (e.margin.left = (a = t.payload.left) !== null && a !== void 0 ? a : 0));
      },
      setScale(e, t) {
        e.scale = t.payload;
      },
    },
  }),
  { setMargin: rI, setLayout: nI, setChartSize: iI, setScale: aI } = e0.actions,
  oI = e0.reducer;
function t0(e, t, r) {
  return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
}
function he(e) {
  return Number.isFinite(e);
}
function Ai(e) {
  return typeof e == 'number' && e > 0 && Number.isFinite(e);
}
function bv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function mi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? bv(Object(r), !0).forEach(function (n) {
          sI(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : bv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function sI(e, t, r) {
  return (
    (t = lI(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function lI(e) {
  var t = cI(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function cI(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Ye(e, t, r) {
  return ze(e) || ze(t) ? r : Sr(t) ? xi(e, t, r) : typeof t == 'function' ? t(e) : r;
}
var uI = (e, t, r) => {
    if (t && r) {
      var { width: n, height: i } = r,
        { align: a, verticalAlign: o, layout: s } = t;
      if ((s === 'vertical' || (s === 'horizontal' && o === 'middle')) && a !== 'center' && X(e[a]))
        return mi(mi({}, e), {}, { [a]: e[a] + (n || 0) });
      if ((s === 'horizontal' || (s === 'vertical' && a === 'center')) && o !== 'middle' && X(e[o]))
        return mi(mi({}, e), {}, { [o]: e[o] + (i || 0) });
    }
    return e;
  },
  Cr = (e, t) =>
    (e === 'horizontal' && t === 'xAxis') ||
    (e === 'vertical' && t === 'yAxis') ||
    (e === 'centric' && t === 'angleAxis') ||
    (e === 'radial' && t === 'radiusAxis'),
  r0 = (e, t, r, n) => {
    if (n) return e.map((s) => s.coordinate);
    var i,
      a,
      o = e.map((s) => (s.coordinate === t && (i = !0), s.coordinate === r && (a = !0), s.coordinate));
    return (i || o.push(t), a || o.push(r), o);
  },
  n0 = (e, t, r) => {
    if (!e) return null;
    var {
      duplicateDomain: n,
      type: i,
      range: a,
      scale: o,
      realScaleType: s,
      isCategorical: l,
      categoricalDomain: c,
      tickCount: u,
      ticks: f,
      niceTicks: h,
      axisType: m,
    } = e;
    if (!o) return null;
    var p = s === 'scaleBand' && o.bandwidth ? o.bandwidth() / 2 : 2,
      v = i === 'category' && o.bandwidth ? o.bandwidth() / p : 0;
    if (((v = m === 'angleAxis' && a && a.length >= 2 ? Nt(a[0] - a[1]) * 2 * v : v), f || h)) {
      var g = (f || h || [])
        .map((b, S) => {
          var x = n ? n.indexOf(b) : b,
            A = o.map(x);
          return he(A) ? { coordinate: A + v, value: b, offset: v, index: S } : null;
        })
        .filter(It);
      return g;
    }
    return l && c
      ? c
          .map((b, S) => {
            var x = o.map(b);
            return he(x) ? { coordinate: x + v, value: b, index: S, offset: v } : null;
          })
          .filter(It)
      : o.ticks && u != null
        ? o
            .ticks(u)
            .map((b, S) => {
              var x = o.map(b);
              return he(x) ? { coordinate: x + v, value: b, index: S, offset: v } : null;
            })
            .filter(It)
        : o
            .domain()
            .map((b, S) => {
              var x = o.map(b);
              return he(x) ? { coordinate: x + v, value: n ? n[b] : b, index: S, offset: v } : null;
            })
            .filter(It);
  },
  fI = (e, t) => {
    if (!t || t.length !== 2 || !X(t[0]) || !X(t[1])) return e;
    var r = Math.min(t[0], t[1]),
      n = Math.max(t[0], t[1]),
      i = [e[0], e[1]];
    return (
      (!X(e[0]) || e[0] < r) && (i[0] = r),
      (!X(e[1]) || e[1] > n) && (i[1] = n),
      i[0] > n && (i[0] = n),
      i[1] < r && (i[1] = r),
      i
    );
  },
  dI = (e) => {
    var t,
      r = e.length;
    if (!(r <= 0)) {
      var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
      if (!(n == null || n <= 0))
        for (var i = 0; i < n; ++i)
          for (var a = 0, o = 0, s = 0; s < r; ++s) {
            var l = e[s],
              c = l?.[i];
            if (c != null) {
              var u = c[1],
                f = c[0],
                h = sr(u) ? f : u;
              h >= 0 ? ((c[0] = a), (a += h), (c[1] = a)) : ((c[0] = o), (o += h), (c[1] = o));
            }
          }
    }
  },
  hI = (e) => {
    var t,
      r = e.length;
    if (!(r <= 0)) {
      var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
      if (!(n == null || n <= 0))
        for (var i = 0; i < n; ++i)
          for (var a = 0, o = 0; o < r; ++o) {
            var s = e[o],
              l = s?.[i];
            if (l != null) {
              var c = sr(l[1]) ? l[0] : l[1];
              c >= 0 ? ((l[0] = a), (a += c), (l[1] = a)) : ((l[0] = 0), (l[1] = 0));
            }
          }
    }
  },
  mI = { sign: dI, expand: zk, none: Bn, silhouette: Kk, wiggle: Wk, positive: hI },
  pI = (e, t, r) => {
    var n,
      i = (n = mI[r]) !== null && n !== void 0 ? n : Bn,
      a = Uk()
        .keys(t)
        .value((s, l) => Number(Ye(s, l, 0)))
        .order(Df)
        .offset(i),
      o = a(e);
    return (
      o.forEach((s, l) => {
        s.forEach((c, u) => {
          var f = Ye(e[u], t[l], 0);
          Array.isArray(f) && f.length === 2 && X(f[0]) && X(f[1]) && ((c[0] = f[0]), (c[1] = f[1]));
        });
      }),
      o
    );
  };
function i0(e) {
  return e == null ? void 0 : String(e);
}
function wv(e) {
  var { axis: t, ticks: r, bandSize: n, entry: i, index: a, dataKey: o } = e;
  if (t.type === 'category') {
    if (!t.allowDuplicatedCategory && t.dataKey && !ze(i[t.dataKey])) {
      var s = cx(r, 'value', i[t.dataKey]);
      if (s) return s.coordinate + n / 2;
    }
    return r != null && r[a] ? r[a].coordinate + n / 2 : null;
  }
  var l = Ye(i, ze(o) ? t.dataKey : o),
    c = t.scale.map(l);
  return X(c) ? c : null;
}
var xv = (e) => {
    var { axis: t, ticks: r, offset: n, bandSize: i, entry: a, index: o } = e;
    if (t.type === 'category') return r[o] ? r[o].coordinate + n : null;
    var s = Ye(a, t.dataKey, t.scale.domain()[o]);
    if (ze(s)) return null;
    var l = t.scale.map(s);
    return X(l) ? l - i / 2 + n : null;
  },
  vI = (e) => {
    var { numericAxis: t } = e,
      r = t.scale.domain();
    if (t.type === 'number') {
      var n = Math.min(r[0], r[1]),
        i = Math.max(r[0], r[1]);
      return n <= 0 && i >= 0 ? 0 : i < 0 ? i : n;
    }
    return r[0];
  },
  gI = (e) => {
    var t = e.flat(2).filter(X);
    return [Math.min(...t), Math.max(...t)];
  },
  yI = (e) => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]],
  bI = (e, t, r) => {
    if (e != null)
      return yI(
        Object.keys(e).reduce(
          (n, i) => {
            var a = e[i];
            if (!a) return n;
            var { stackedData: o } = a,
              s = o.reduce(
                (l, c) => {
                  var u = t0(c, t, r),
                    f = gI(u);
                  return !he(f[0]) || !he(f[1]) ? l : [Math.min(l[0], f[0]), Math.max(l[1], f[1])];
                },
                [1 / 0, -1 / 0],
              );
            return [Math.min(s[0], n[0]), Math.max(s[1], n[1])];
          },
          [1 / 0, -1 / 0],
        ),
      );
  },
  Sv = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
  Av = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
  Pi = (e, t, r) => {
    if (e && e.scale && e.scale.bandwidth) {
      var n = e.scale.bandwidth();
      if (!r || n > 0) return n;
    }
    if (e && t && t.length >= 2) {
      for (var i = bl(t, (u) => u.coordinate), a = 1 / 0, o = 1, s = i.length; o < s; o++) {
        var l = i[o],
          c = i[o - 1];
        a = Math.min((l?.coordinate || 0) - (c?.coordinate || 0), a);
      }
      return a === 1 / 0 ? 0 : a;
    }
    return r ? void 0 : 0;
  };
function Pv(e) {
  var { tooltipEntrySettings: t, dataKey: r, payload: n, value: i, name: a } = e;
  return mi(mi({}, t), {}, { dataKey: r, payload: n, value: i, name: a });
}
function kl(e, t) {
  if (e) return String(e);
  if (typeof t == 'string') return t;
}
var wI = (e, t) => {
    if (t === 'horizontal') return e.relativeX;
    if (t === 'vertical') return e.relativeY;
  },
  xI = (e, t) => (t === 'centric' ? e.angle : e.radius),
  Vr = (e) => e.layout.width,
  Gr = (e) => e.layout.height,
  SI = (e) => e.layout.scale,
  a0 = (e) => e.layout.margin,
  jl = I(
    (e) => e.cartesianAxis.xAxis,
    (e) => Object.values(e),
  ),
  Nl = I(
    (e) => e.cartesianAxis.yAxis,
    (e) => Object.values(e),
  ),
  AI = 'data-recharts-item-index',
  PI = 'data-recharts-item-id',
  Va = 60;
function Cv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function zo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Cv(Object(r), !0).forEach(function (n) {
          CI(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Cv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function CI(e, t, r) {
  return (
    (t = OI(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function OI(e) {
  var t = _I(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function _I(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var EI = (e) => e.brush.height;
function kI(e) {
  var t = Nl(e);
  return t.reduce((r, n) => {
    if (n.orientation === 'left' && !n.mirror && !n.hide) {
      var i = typeof n.width == 'number' ? n.width : Va;
      return r + i;
    }
    return r;
  }, 0);
}
function jI(e) {
  var t = Nl(e);
  return t.reduce((r, n) => {
    if (n.orientation === 'right' && !n.mirror && !n.hide) {
      var i = typeof n.width == 'number' ? n.width : Va;
      return r + i;
    }
    return r;
  }, 0);
}
function NI(e) {
  var t = jl(e);
  return t.reduce((r, n) => (n.orientation === 'top' && !n.mirror && !n.hide ? r + n.height : r), 0);
}
function II(e) {
  var t = jl(e);
  return t.reduce((r, n) => (n.orientation === 'bottom' && !n.mirror && !n.hide ? r + n.height : r), 0);
}
var ot = I([Vr, Gr, a0, EI, kI, jI, NI, II, Cx, iN], (e, t, r, n, i, a, o, s, l, c) => {
    var u = { left: (r.left || 0) + i, right: (r.right || 0) + a },
      f = { top: (r.top || 0) + o, bottom: (r.bottom || 0) + s },
      h = zo(zo({}, f), u),
      m = h.bottom;
    ((h.bottom += n), (h = uI(h, l, c)));
    var p = e - h.left - h.right,
      v = t - h.top - h.bottom;
    return zo(zo({ brushBottom: m }, h), {}, { width: Math.max(p, 0), height: Math.max(v, 0) });
  }),
  TI = I(ot, (e) => ({ x: e.left, y: e.top, width: e.width, height: e.height })),
  ah = I(Vr, Gr, (e, t) => ({ x: 0, y: 0, width: e, height: t })),
  MI = d.createContext(null),
  wt = () => d.useContext(MI) != null,
  Il = (e) => e.brush,
  Tl = I([Il, ot, a0], (e, t, r) => ({
    height: e.height,
    x: X(e.x) ? e.x : t.left,
    y: X(e.y) ? e.y : t.top + t.height + t.brushBottom - (r?.bottom || 0),
    width: X(e.width) ? e.width : t.width,
  })),
  Ov = function (t, r) {
    for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++) i[a - 2] = arguments[a];
    if (
      typeof console < 'u' &&
      console.warn &&
      (r === void 0 && console.warn('LogUtils requires an error message argument'), !t)
    )
      if (r === void 0)
        console.warn(
          'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
        );
      else {
        var o = 0;
        console.warn(r.replace(/%s/g, () => i[o++]));
      }
  },
  DI = { initialDimension: { width: -1, height: -1 } },
  RI = d.createContext(DI.initialDimension),
  o0 = () => d.useContext(RI);
function oh(e) {
  if (e)
    return {
      x: e.x,
      y: e.y,
      upperWidth: 'upperWidth' in e ? e.upperWidth : e.width,
      lowerWidth: 'lowerWidth' in e ? e.lowerWidth : e.width,
      width: e.width,
      height: e.height,
    };
}
var Ml = () => {
    var e,
      t = wt(),
      r = re(TI),
      n = re(Tl),
      i = (e = re(Il)) === null || e === void 0 ? void 0 : e.padding;
    return !t || !n || !i
      ? r
      : { width: n.width - i.left - i.right, height: n.height - i.top - i.bottom, x: i.left, y: i.top };
  },
  LI = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, brushBottom: 0 },
  s0 = () => {
    var e;
    return (e = re(ot)) !== null && e !== void 0 ? e : LI;
  },
  l0 = () => re(Vr),
  c0 = () => re(Gr),
  Ce = (e) => e.layout.layoutType,
  Yn = () => re(Ce),
  sh = () => {
    var e = Yn();
    if (e === 'horizontal' || e === 'vertical') return e;
  },
  u0 = (e) => {
    var t = e.layout.layoutType;
    if (t === 'centric' || t === 'radial') return t;
  },
  $I = () => {
    var e = Yn();
    return e !== void 0;
  },
  Ga = (e) => {
    var t = Ke(),
      r = wt(),
      { width: n, height: i } = e,
      a = o0(),
      o = n,
      s = i;
    return (
      a && ((o = a.width > 0 ? a.width : n), (s = a.height > 0 ? a.height : i)),
      d.useEffect(() => {
        !r && Ai(o) && Ai(s) && t(iI({ width: o, height: s }));
      }, [t, r, o, s]),
      null
    );
  },
  f0 = Symbol.for('immer-nothing'),
  _v = Symbol.for('immer-draftable'),
  Ut = Symbol.for('immer-state');
function ar(e, ...t) {
  throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var ja = Object.getPrototypeOf;
function Ci(e) {
  return !!e && !!e[Ut];
}
function zn(e) {
  return e ? d0(e) || Array.isArray(e) || !!e[_v] || !!e.constructor?.[_v] || Ya(e) || Rl(e) : !1;
}
var FI = Object.prototype.constructor.toString(),
  Ev = new WeakMap();
function d0(e) {
  if (!e || typeof e != 'object') return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null || t === Object.prototype) return !0;
  const r = Object.hasOwnProperty.call(t, 'constructor') && t.constructor;
  if (r === Object) return !0;
  if (typeof r != 'function') return !1;
  let n = Ev.get(r);
  return (n === void 0 && ((n = Function.toString.call(r)), Ev.set(r, n)), n === FI);
}
function js(e, t, r = !0) {
  Dl(e) === 0
    ? (r ? Reflect.ownKeys(e) : Object.keys(e)).forEach((i) => {
        t(i, e[i], e);
      })
    : e.forEach((n, i) => t(i, n, e));
}
function Dl(e) {
  const t = e[Ut];
  return t ? t.type_ : Array.isArray(e) ? 1 : Ya(e) ? 2 : Rl(e) ? 3 : 0;
}
function Gf(e, t) {
  return Dl(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function h0(e, t, r) {
  const n = Dl(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : (e[t] = r);
}
function BI(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function Ya(e) {
  return e instanceof Map;
}
function Rl(e) {
  return e instanceof Set;
}
function jn(e) {
  return e.copy_ || e.base_;
}
function Yf(e, t) {
  if (Ya(e)) return new Map(e);
  if (Rl(e)) return new Set(e);
  if (Array.isArray(e)) return Array.prototype.slice.call(e);
  const r = d0(e);
  if (t === !0 || (t === 'class_only' && !r)) {
    const n = Object.getOwnPropertyDescriptors(e);
    delete n[Ut];
    let i = Reflect.ownKeys(n);
    for (let a = 0; a < i.length; a++) {
      const o = i[a],
        s = n[o];
      (s.writable === !1 && ((s.writable = !0), (s.configurable = !0)),
        (s.get || s.set) && (n[o] = { configurable: !0, writable: !0, enumerable: s.enumerable, value: e[o] }));
    }
    return Object.create(ja(e), n);
  } else {
    const n = ja(e);
    if (n !== null && r) return { ...e };
    const i = Object.create(n);
    return Object.assign(i, e);
  }
}
function lh(e, t = !1) {
  return (
    Ll(e) ||
      Ci(e) ||
      !zn(e) ||
      (Dl(e) > 1 && Object.defineProperties(e, { set: Ko, add: Ko, clear: Ko, delete: Ko }),
      Object.freeze(e),
      t && Object.values(e).forEach((r) => lh(r, !0))),
    e
  );
}
function UI() {
  ar(2);
}
var Ko = { value: UI };
function Ll(e) {
  return e === null || typeof e != 'object' ? !0 : Object.isFrozen(e);
}
var zI = {};
function Kn(e) {
  const t = zI[e];
  return (t || ar(0, e), t);
}
var Na;
function m0() {
  return Na;
}
function KI(e, t) {
  return { drafts_: [], parent_: e, immer_: t, canAutoFreeze_: !0, unfinalizedDrafts_: 0 };
}
function kv(e, t) {
  t && (Kn('Patches'), (e.patches_ = []), (e.inversePatches_ = []), (e.patchListener_ = t));
}
function Xf(e) {
  (Zf(e), e.drafts_.forEach(WI), (e.drafts_ = null));
}
function Zf(e) {
  e === Na && (Na = e.parent_);
}
function jv(e) {
  return (Na = KI(Na, e));
}
function WI(e) {
  const t = e[Ut];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : (t.revoked_ = !0);
}
function Nv(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  return (
    e !== void 0 && e !== r
      ? (r[Ut].modified_ && (Xf(t), ar(4)),
        zn(e) && ((e = Ns(t, e)), t.parent_ || Is(t, e)),
        t.patches_ && Kn('Patches').generateReplacementPatches_(r[Ut].base_, e, t.patches_, t.inversePatches_))
      : (e = Ns(t, r, [])),
    Xf(t),
    t.patches_ && t.patchListener_(t.patches_, t.inversePatches_),
    e !== f0 ? e : void 0
  );
}
function Ns(e, t, r) {
  if (Ll(t)) return t;
  const n = e.immer_.shouldUseStrictIteration(),
    i = t[Ut];
  if (!i) return (js(t, (a, o) => Iv(e, i, t, a, o, r), n), t);
  if (i.scope_ !== e) return t;
  if (!i.modified_) return (Is(e, i.base_, !0), i.base_);
  if (!i.finalized_) {
    ((i.finalized_ = !0), i.scope_.unfinalizedDrafts_--);
    const a = i.copy_;
    let o = a,
      s = !1;
    (i.type_ === 3 && ((o = new Set(a)), a.clear(), (s = !0)),
      js(o, (l, c) => Iv(e, i, a, l, c, r, s), n),
      Is(e, a, !1),
      r && e.patches_ && Kn('Patches').generatePatches_(i, r, e.patches_, e.inversePatches_));
  }
  return i.copy_;
}
function Iv(e, t, r, n, i, a, o) {
  if (i == null || (typeof i != 'object' && !o)) return;
  const s = Ll(i);
  if (!(s && !o)) {
    if (Ci(i)) {
      const l = a && t && t.type_ !== 3 && !Gf(t.assigned_, n) ? a.concat(n) : void 0,
        c = Ns(e, i, l);
      if ((h0(r, n, c), Ci(c))) e.canAutoFreeze_ = !1;
      else return;
    } else o && r.add(i);
    if (zn(i) && !s) {
      if ((!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1) || (t && t.base_ && t.base_[n] === i && s)) return;
      (Ns(e, i),
        (!t || !t.scope_.parent_) &&
          typeof n != 'symbol' &&
          (Ya(r) ? r.has(n) : Object.prototype.propertyIsEnumerable.call(r, n)) &&
          Is(e, i));
    }
  }
}
function Is(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && lh(t, r);
}
function HI(e, t) {
  const r = Array.isArray(e),
    n = {
      type_: r ? 1 : 0,
      scope_: t ? t.scope_ : m0(),
      modified_: !1,
      finalized_: !1,
      assigned_: {},
      parent_: t,
      base_: e,
      draft_: null,
      copy_: null,
      revoke_: null,
      isManual_: !1,
    };
  let i = n,
    a = ch;
  r && ((i = [n]), (a = Ia));
  const { revoke: o, proxy: s } = Proxy.revocable(i, a);
  return ((n.draft_ = s), (n.revoke_ = o), s);
}
var ch = {
    get(e, t) {
      if (t === Ut) return e;
      const r = jn(e);
      if (!Gf(r, t)) return qI(e, r, t);
      const n = r[t];
      return e.finalized_ || !zn(n) ? n : n === Hu(e.base_, t) ? (qu(e), (e.copy_[t] = Qf(n, e))) : n;
    },
    has(e, t) {
      return t in jn(e);
    },
    ownKeys(e) {
      return Reflect.ownKeys(jn(e));
    },
    set(e, t, r) {
      const n = p0(jn(e), t);
      if (n?.set) return (n.set.call(e.draft_, r), !0);
      if (!e.modified_) {
        const i = Hu(jn(e), t),
          a = i?.[Ut];
        if (a && a.base_ === r) return ((e.copy_[t] = r), (e.assigned_[t] = !1), !0);
        if (BI(r, i) && (r !== void 0 || Gf(e.base_, t))) return !0;
        (qu(e), Jf(e));
      }
      return (
        (e.copy_[t] === r && (r !== void 0 || t in e.copy_)) ||
          (Number.isNaN(r) && Number.isNaN(e.copy_[t])) ||
          ((e.copy_[t] = r), (e.assigned_[t] = !0)),
        !0
      );
    },
    deleteProperty(e, t) {
      return (
        Hu(e.base_, t) !== void 0 || t in e.base_ ? ((e.assigned_[t] = !1), qu(e), Jf(e)) : delete e.assigned_[t],
        e.copy_ && delete e.copy_[t],
        !0
      );
    },
    getOwnPropertyDescriptor(e, t) {
      const r = jn(e),
        n = Reflect.getOwnPropertyDescriptor(r, t);
      return (
        n && { writable: !0, configurable: e.type_ !== 1 || t !== 'length', enumerable: n.enumerable, value: r[t] }
      );
    },
    defineProperty() {
      ar(11);
    },
    getPrototypeOf(e) {
      return ja(e.base_);
    },
    setPrototypeOf() {
      ar(12);
    },
  },
  Ia = {};
js(ch, (e, t) => {
  Ia[e] = function () {
    return ((arguments[0] = arguments[0][0]), t.apply(this, arguments));
  };
});
Ia.deleteProperty = function (e, t) {
  return Ia.set.call(this, e, t, void 0);
};
Ia.set = function (e, t, r) {
  return ch.set.call(this, e[0], t, r, e[0]);
};
function Hu(e, t) {
  const r = e[Ut];
  return (r ? jn(r) : e)[t];
}
function qI(e, t, r) {
  const n = p0(t, r);
  return n ? ('value' in n ? n.value : n.get?.call(e.draft_)) : void 0;
}
function p0(e, t) {
  if (!(t in e)) return;
  let r = ja(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n) return n;
    r = ja(r);
  }
}
function Jf(e) {
  e.modified_ || ((e.modified_ = !0), e.parent_ && Jf(e.parent_));
}
function qu(e) {
  e.copy_ || (e.copy_ = Yf(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var VI = class {
  constructor(e) {
    ((this.autoFreeze_ = !0),
      (this.useStrictShallowCopy_ = !1),
      (this.useStrictIteration_ = !0),
      (this.produce = (t, r, n) => {
        if (typeof t == 'function' && typeof r != 'function') {
          const a = r;
          r = t;
          const o = this;
          return function (l = a, ...c) {
            return o.produce(l, (u) => r.call(this, u, ...c));
          };
        }
        (typeof r != 'function' && ar(6), n !== void 0 && typeof n != 'function' && ar(7));
        let i;
        if (zn(t)) {
          const a = jv(this),
            o = Qf(t, void 0);
          let s = !0;
          try {
            ((i = r(o)), (s = !1));
          } finally {
            s ? Xf(a) : Zf(a);
          }
          return (kv(a, n), Nv(i, a));
        } else if (!t || typeof t != 'object') {
          if (((i = r(t)), i === void 0 && (i = t), i === f0 && (i = void 0), this.autoFreeze_ && lh(i, !0), n)) {
            const a = [],
              o = [];
            (Kn('Patches').generateReplacementPatches_(t, i, a, o), n(a, o));
          }
          return i;
        } else ar(1, t);
      }),
      (this.produceWithPatches = (t, r) => {
        if (typeof t == 'function') return (o, ...s) => this.produceWithPatches(o, (l) => t(l, ...s));
        let n, i;
        return [
          this.produce(t, r, (o, s) => {
            ((n = o), (i = s));
          }),
          n,
          i,
        ];
      }),
      typeof e?.autoFreeze == 'boolean' && this.setAutoFreeze(e.autoFreeze),
      typeof e?.useStrictShallowCopy == 'boolean' && this.setUseStrictShallowCopy(e.useStrictShallowCopy),
      typeof e?.useStrictIteration == 'boolean' && this.setUseStrictIteration(e.useStrictIteration));
  }
  createDraft(e) {
    (zn(e) || ar(8), Ci(e) && (e = GI(e)));
    const t = jv(this),
      r = Qf(e, void 0);
    return ((r[Ut].isManual_ = !0), Zf(t), r);
  }
  finishDraft(e, t) {
    const r = e && e[Ut];
    (!r || !r.isManual_) && ar(9);
    const { scope_: n } = r;
    return (kv(n, t), Nv(void 0, n));
  }
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  setUseStrictIteration(e) {
    this.useStrictIteration_ = e;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(e, t) {
    let r;
    for (r = t.length - 1; r >= 0; r--) {
      const i = t[r];
      if (i.path.length === 0 && i.op === 'replace') {
        e = i.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = Kn('Patches').applyPatches_;
    return Ci(e) ? n(e, t) : this.produce(e, (i) => n(i, t));
  }
};
function Qf(e, t) {
  const r = Ya(e) ? Kn('MapSet').proxyMap_(e, t) : Rl(e) ? Kn('MapSet').proxySet_(e, t) : HI(e, t);
  return ((t ? t.scope_ : m0()).drafts_.push(r), r);
}
function GI(e) {
  return (Ci(e) || ar(10, e), v0(e));
}
function v0(e) {
  if (!zn(e) || Ll(e)) return e;
  const t = e[Ut];
  let r,
    n = !0;
  if (t) {
    if (!t.modified_) return t.base_;
    ((t.finalized_ = !0),
      (r = Yf(e, t.scope_.immer_.useStrictShallowCopy_)),
      (n = t.scope_.immer_.shouldUseStrictIteration()));
  } else r = Yf(e, !0);
  return (
    js(
      r,
      (i, a) => {
        h0(r, i, v0(a));
      },
      n,
    ),
    t && (t.finalized_ = !1),
    r
  );
}
var YI = new VI();
YI.produce;
var XI = {
    settings: { layout: 'horizontal', align: 'center', verticalAlign: 'middle', itemSorter: 'value' },
    size: { width: 0, height: 0 },
    payload: [],
  },
  g0 = bt({
    name: 'legend',
    initialState: XI,
    reducers: {
      setLegendSize(e, t) {
        ((e.size.width = t.payload.width), (e.size.height = t.payload.height));
      },
      setLegendSettings(e, t) {
        ((e.settings.align = t.payload.align),
          (e.settings.layout = t.payload.layout),
          (e.settings.verticalAlign = t.payload.verticalAlign),
          (e.settings.itemSorter = t.payload.itemSorter));
      },
      addLegendPayload: {
        reducer(e, t) {
          e.payload.push(t.payload);
        },
        prepare: Te(),
      },
      replaceLegendPayload: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload,
            i = Xt(e).payload.indexOf(r);
          i > -1 && (e.payload[i] = n);
        },
        prepare: Te(),
      },
      removeLegendPayload: {
        reducer(e, t) {
          var r = Xt(e).payload.indexOf(t.payload);
          r > -1 && e.payload.splice(r, 1);
        },
        prepare: Te(),
      },
    },
  }),
  {
    setLegendSize: l3,
    setLegendSettings: c3,
    addLegendPayload: ZI,
    replaceLegendPayload: JI,
    removeLegendPayload: QI,
  } = g0.actions,
  eT = g0.reducer,
  Vu = { exports: {} },
  Gu = {};
var Tv;
function tT() {
  if (Tv) return Gu;
  Tv = 1;
  var e = jd();
  function t(l, c) {
    return (l === c && (l !== 0 || 1 / l === 1 / c)) || (l !== l && c !== c);
  }
  var r = typeof Object.is == 'function' ? Object.is : t,
    n = e.useSyncExternalStore,
    i = e.useRef,
    a = e.useEffect,
    o = e.useMemo,
    s = e.useDebugValue;
  return (
    (Gu.useSyncExternalStoreWithSelector = function (l, c, u, f, h) {
      var m = i(null);
      if (m.current === null) {
        var p = { hasValue: !1, value: null };
        m.current = p;
      } else p = m.current;
      m = o(
        function () {
          function g(C) {
            if (!b) {
              if (((b = !0), (S = C), (C = f(C)), h !== void 0 && p.hasValue)) {
                var P = p.value;
                if (h(P, C)) return (x = P);
              }
              return (x = C);
            }
            if (((P = x), r(S, C))) return P;
            var _ = f(C);
            return h !== void 0 && h(P, _) ? ((S = C), P) : ((S = C), (x = _));
          }
          var b = !1,
            S,
            x,
            A = u === void 0 ? null : u;
          return [
            function () {
              return g(c());
            },
            A === null
              ? void 0
              : function () {
                  return g(A());
                },
          ];
        },
        [c, u, f, h],
      );
      var v = n(l, m[0], m[1]);
      return (
        a(
          function () {
            ((p.hasValue = !0), (p.value = v));
          },
          [v],
        ),
        s(v),
        v
      );
    }),
    Gu
  );
}
var Mv;
function rT() {
  return (Mv || ((Mv = 1), (Vu.exports = tT())), Vu.exports);
}
rT();
function nT(e) {
  e();
}
function iT() {
  let e = null,
    t = null;
  return {
    clear() {
      ((e = null), (t = null));
    },
    notify() {
      nT(() => {
        let r = e;
        for (; r; ) (r.callback(), (r = r.next));
      });
    },
    get() {
      const r = [];
      let n = e;
      for (; n; ) (r.push(n), (n = n.next));
      return r;
    },
    subscribe(r) {
      let n = !0;
      const i = (t = { callback: r, next: null, prev: t });
      return (
        i.prev ? (i.prev.next = i) : (e = i),
        function () {
          !n ||
            e === null ||
            ((n = !1), i.next ? (i.next.prev = i.prev) : (t = i.prev), i.prev ? (i.prev.next = i.next) : (e = i.next));
        }
      );
    },
  };
}
var Dv = { notify() {}, get: () => [] };
function aT(e, t) {
  let r,
    n = Dv,
    i = 0,
    a = !1;
  function o(v) {
    u();
    const g = n.subscribe(v);
    let b = !1;
    return () => {
      b || ((b = !0), g(), f());
    };
  }
  function s() {
    n.notify();
  }
  function l() {
    p.onStateChange && p.onStateChange();
  }
  function c() {
    return a;
  }
  function u() {
    (i++, r || ((r = e.subscribe(l)), (n = iT())));
  }
  function f() {
    (i--, r && i === 0 && (r(), (r = void 0), n.clear(), (n = Dv)));
  }
  function h() {
    a || ((a = !0), u());
  }
  function m() {
    a && ((a = !1), f());
  }
  const p = {
    addNestedSub: o,
    notifyNestedSubs: s,
    handleChangeWrapper: l,
    isSubscribed: c,
    trySubscribe: h,
    tryUnsubscribe: m,
    getListeners: () => n,
  };
  return p;
}
var oT = () => typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u',
  sT = oT(),
  lT = () => typeof navigator < 'u' && navigator.product === 'ReactNative',
  cT = lT(),
  uT = () => (sT || cT ? d.useLayoutEffect : d.useEffect),
  fT = uT();
function Rv(e, t) {
  return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function dT(e, t) {
  if (Rv(e, t)) return !0;
  if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
  const r = Object.keys(e),
    n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (let i = 0; i < r.length; i++)
    if (!Object.prototype.hasOwnProperty.call(t, r[i]) || !Rv(e[r[i]], t[r[i]])) return !1;
  return !0;
}
var hT = Symbol.for('react-redux-context'),
  mT = typeof globalThis < 'u' ? globalThis : {};
function pT() {
  if (!d.createContext) return {};
  const e = (mT[hT] ??= new Map());
  let t = e.get(d.createContext);
  return (t || ((t = d.createContext(null)), e.set(d.createContext, t)), t);
}
var vT = pT();
function gT(e) {
  const { children: t, context: r, serverState: n, store: i } = e,
    a = d.useMemo(() => {
      const l = aT(i);
      return { store: i, subscription: l, getServerState: n ? () => n : void 0 };
    }, [i, n]),
    o = d.useMemo(() => i.getState(), [i]);
  fT(() => {
    const { subscription: l } = a;
    return (
      (l.onStateChange = l.notifyNestedSubs),
      l.trySubscribe(),
      o !== i.getState() && l.notifyNestedSubs(),
      () => {
        (l.tryUnsubscribe(), (l.onStateChange = void 0));
      }
    );
  }, [a, o]);
  const s = r || vT;
  return d.createElement(s.Provider, { value: a }, t);
}
var yT = gT,
  bT = new Set([
    'axisLine',
    'tickLine',
    'activeBar',
    'activeDot',
    'activeLabel',
    'activeShape',
    'allowEscapeViewBox',
    'background',
    'cursor',
    'dot',
    'label',
    'line',
    'margin',
    'padding',
    'position',
    'shape',
    'style',
    'tick',
    'wrapperStyle',
    'radius',
    'throttledEvents',
  ]);
function wT(e, t) {
  return e == null && t == null
    ? !0
    : typeof e == 'number' && typeof t == 'number'
      ? e === t || (e !== e && t !== t)
      : e === t;
}
function Xa(e, t) {
  var r = new Set([...Object.keys(e), ...Object.keys(t)]);
  for (var n of r)
    if (bT.has(n)) {
      if (e[n] == null && t[n] == null) continue;
      if (!dT(e[n], t[n])) return !1;
    } else if (!wT(e[n], t[n])) return !1;
  return !0;
}
function ed() {
  return (
    (ed = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    ed.apply(null, arguments)
  );
}
function Lv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function na(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Lv(Object(r), !0).forEach(function (n) {
          xT(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Lv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function xT(e, t, r) {
  return (
    (t = ST(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function ST(e) {
  var t = AT(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function AT(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function PT(e) {
  return Array.isArray(e) && Sr(e[0]) && Sr(e[1]) ? e.join(' ~ ') : e;
}
var ii = {
  separator: ' : ',
  contentStyle: { margin: 0, padding: 10, backgroundColor: '#fff', border: '1px solid #ccc', whiteSpace: 'nowrap' },
  itemStyle: { display: 'block', paddingTop: 4, paddingBottom: 4, color: '#000' },
  labelStyle: {},
  accessibilityLayer: !1,
};
function CT(e, t) {
  return t == null ? e : bl(e, t);
}
var OT = (e) => {
    var {
        separator: t = ii.separator,
        contentStyle: r,
        itemStyle: n,
        labelStyle: i = ii.labelStyle,
        payload: a,
        formatter: o,
        itemSorter: s,
        wrapperClassName: l,
        labelClassName: c,
        label: u,
        labelFormatter: f,
        accessibilityLayer: h = ii.accessibilityLayer,
      } = e,
      m = () => {
        if (a && a.length) {
          var C = { padding: 0, margin: 0 },
            P = CT(a, s),
            _ = P.map((E, j) => {
              if (E.type === 'none') return null;
              var N = E.formatter || o || PT,
                { value: M, name: O } = E,
                D = M,
                B = O;
              if (N) {
                var Y = N(M, O, E, j, a);
                if (Array.isArray(Y)) [D, B] = Y;
                else if (Y != null) D = Y;
                else return null;
              }
              var Q = na(na({}, ii.itemStyle), {}, { color: E.color || ii.itemStyle.color }, n);
              return d.createElement(
                'li',
                { className: 'recharts-tooltip-item', key: 'tooltip-item-'.concat(j), style: Q },
                Sr(B) ? d.createElement('span', { className: 'recharts-tooltip-item-name' }, B) : null,
                Sr(B) ? d.createElement('span', { className: 'recharts-tooltip-item-separator' }, t) : null,
                d.createElement('span', { className: 'recharts-tooltip-item-value' }, D),
                d.createElement('span', { className: 'recharts-tooltip-item-unit' }, E.unit || ''),
              );
            });
          return d.createElement('ul', { className: 'recharts-tooltip-item-list', style: C }, _);
        }
        return null;
      },
      p = na(na({}, ii.contentStyle), r),
      v = na({ margin: 0 }, i),
      g = !ze(u),
      b = g ? u : '',
      S = Ne('recharts-default-tooltip', l),
      x = Ne('recharts-tooltip-label', c);
    g && f && a !== void 0 && a !== null && (b = f(u, a));
    var A = h ? { role: 'status', 'aria-live': 'assertive' } : {};
    return d.createElement(
      'div',
      ed({ className: S, style: p }, A),
      d.createElement('p', { className: x, style: v }, d.isValidElement(b) ? b : ''.concat(b)),
      m(),
    );
  },
  ia = 'recharts-tooltip-wrapper',
  _T = { visibility: 'hidden' };
function ET(e) {
  var { coordinate: t, translateX: r, translateY: n } = e;
  return Ne(ia, {
    [''.concat(ia, '-right')]: X(r) && t && X(t.x) && r >= t.x,
    [''.concat(ia, '-left')]: X(r) && t && X(t.x) && r < t.x,
    [''.concat(ia, '-bottom')]: X(n) && t && X(t.y) && n >= t.y,
    [''.concat(ia, '-top')]: X(n) && t && X(t.y) && n < t.y,
  });
}
function $v(e) {
  var {
    allowEscapeViewBox: t,
    coordinate: r,
    key: n,
    offset: i,
    position: a,
    reverseDirection: o,
    tooltipDimension: s,
    viewBox: l,
    viewBoxDimension: c,
  } = e;
  if (a && X(a[n])) return a[n];
  var u = r[n] - s - (i > 0 ? i : 0),
    f = r[n] + i;
  if (t[n]) return o[n] ? u : f;
  var h = l[n];
  if (h == null) return 0;
  if (o[n]) {
    var m = u,
      p = h;
    return m < p ? Math.max(f, h) : Math.max(u, h);
  }
  if (c == null) return 0;
  var v = f + s,
    g = h + c;
  return v > g ? Math.max(u, h) : Math.max(f, h);
}
function kT(e) {
  var { translateX: t, translateY: r, useTranslate3d: n } = e;
  return {
    transform: n
      ? 'translate3d('.concat(t, 'px, ').concat(r, 'px, 0)')
      : 'translate('.concat(t, 'px, ').concat(r, 'px)'),
  };
}
function jT(e) {
  var {
      allowEscapeViewBox: t,
      coordinate: r,
      offsetTop: n,
      offsetLeft: i,
      position: a,
      reverseDirection: o,
      tooltipBox: s,
      useTranslate3d: l,
      viewBox: c,
    } = e,
    u,
    f,
    h;
  return (
    s.height > 0 && s.width > 0 && r
      ? ((f = $v({
          allowEscapeViewBox: t,
          coordinate: r,
          key: 'x',
          offset: i,
          position: a,
          reverseDirection: o,
          tooltipDimension: s.width,
          viewBox: c,
          viewBoxDimension: c.width,
        })),
        (h = $v({
          allowEscapeViewBox: t,
          coordinate: r,
          key: 'y',
          offset: n,
          position: a,
          reverseDirection: o,
          tooltipDimension: s.height,
          viewBox: c,
          viewBoxDimension: c.height,
        })),
        (u = kT({ translateX: f, translateY: h, useTranslate3d: l })))
      : (u = _T),
    { cssProperties: u, cssClasses: ET({ translateX: f, translateY: h, coordinate: r }) }
  );
}
var NT = () => !(typeof window < 'u' && window.document && window.document.createElement && window.setTimeout),
  Za = { isSsr: NT() };
function y0() {
  var [e, t] = d.useState(() =>
    Za.isSsr || !window.matchMedia ? !1 : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  return (
    d.useEffect(() => {
      if (window.matchMedia) {
        var r = window.matchMedia('(prefers-reduced-motion: reduce)'),
          n = () => {
            t(r.matches);
          };
        return (
          r.addEventListener('change', n),
          () => {
            r.removeEventListener('change', n);
          }
        );
      }
    }, []),
    e
  );
}
function Fv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function ai(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Fv(Object(r), !0).forEach(function (n) {
          IT(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Fv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function IT(e, t, r) {
  return (
    (t = TT(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function TT(e) {
  var t = MT(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function MT(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function DT(e) {
  if (!(e.prefersReducedMotion && e.isAnimationActive === 'auto') && e.isAnimationActive && e.active)
    return 'transform '.concat(e.animationDuration, 'ms ').concat(e.animationEasing);
}
function RT(e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    s = y0(),
    [l, c] = d.useState(() => ({ dismissed: !1, dismissedAtCoordinate: { x: 0, y: 0 } }));
  (d.useEffect(() => {
    var p = (v) => {
      if (v.key === 'Escape') {
        var g, b, S, x;
        c({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (g = (b = e.coordinate) === null || b === void 0 ? void 0 : b.x) !== null && g !== void 0 ? g : 0,
            y: (S = (x = e.coordinate) === null || x === void 0 ? void 0 : x.y) !== null && S !== void 0 ? S : 0,
          },
        });
      }
    };
    return (
      document.addEventListener('keydown', p),
      () => {
        document.removeEventListener('keydown', p);
      }
    );
  }, [
    (t = e.coordinate) === null || t === void 0 ? void 0 : t.x,
    (r = e.coordinate) === null || r === void 0 ? void 0 : r.y,
  ]),
    l.dismissed &&
      (((n = (i = e.coordinate) === null || i === void 0 ? void 0 : i.x) !== null && n !== void 0 ? n : 0) !==
        l.dismissedAtCoordinate.x ||
        ((a = (o = e.coordinate) === null || o === void 0 ? void 0 : o.y) !== null && a !== void 0 ? a : 0) !==
          l.dismissedAtCoordinate.y) &&
      c(ai(ai({}, l), {}, { dismissed: !1 })));
  var { cssClasses: u, cssProperties: f } = jT({
      allowEscapeViewBox: e.allowEscapeViewBox,
      coordinate: e.coordinate,
      offsetLeft: typeof e.offset == 'number' ? e.offset : e.offset.x,
      offsetTop: typeof e.offset == 'number' ? e.offset : e.offset.y,
      position: e.position,
      reverseDirection: e.reverseDirection,
      tooltipBox: { height: e.lastBoundingBox.height, width: e.lastBoundingBox.width },
      useTranslate3d: e.useTranslate3d,
      viewBox: e.viewBox,
    }),
    h = e.hasPortalFromProps
      ? {}
      : ai(
          ai(
            {
              transition: DT({
                prefersReducedMotion: s,
                isAnimationActive: e.isAnimationActive,
                active: e.active,
                animationDuration: e.animationDuration,
                animationEasing: e.animationEasing,
              }),
            },
            f,
          ),
          {},
          { pointerEvents: 'none', position: 'absolute', top: 0, left: 0 },
        ),
    m = ai(
      ai({}, h),
      {},
      { visibility: !l.dismissed && e.active && e.hasPayload ? 'visible' : 'hidden' },
      e.wrapperStyle,
    );
  return d.createElement(
    'div',
    { xmlns: 'http://www.w3.org/1999/xhtml', tabIndex: -1, className: u, style: m, ref: e.innerRef },
    e.children,
  );
}
var LT = d.memo(RT),
  b0 = () => {
    var e;
    return (e = re((t) => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0;
  };
function td() {
  return (
    (td = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    td.apply(null, arguments)
  );
}
function Bv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Uv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Bv(Object(r), !0).forEach(function (n) {
          $T(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Bv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function $T(e, t, r) {
  return (
    (t = FT(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function FT(e) {
  var t = BT(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function BT(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var zv = {
    curveBasisClosed: jk,
    curveBasisOpen: Nk,
    curveBasis: kk,
    curveBumpX: pk,
    curveBumpY: vk,
    curveLinearClosed: Ik,
    curveLinear: gl,
    curveMonotoneX: Tk,
    curveMonotoneY: Mk,
    curveNatural: Dk,
    curveStep: Rk,
    curveStepAfter: $k,
    curveStepBefore: Lk,
  },
  Ts = (e) => he(e.x) && he(e.y),
  Kv = (e) => e.base != null && Ts(e.base) && Ts(e),
  aa = (e) => e.x,
  oa = (e) => e.y,
  UT = (e, t) => {
    if (typeof e == 'function') return e;
    var r = 'curve'.concat(Wa(e));
    if ((r === 'curveMonotone' || r === 'curveBump') && t) {
      var n = zv[''.concat(r).concat(t === 'vertical' ? 'Y' : 'X')];
      if (n) return n;
    }
    return zv[r] || gl;
  },
  Wv = { connectNulls: !1, type: 'linear' },
  zT = (e) => {
    var { type: t = Wv.type, points: r = [], baseLine: n, layout: i, connectNulls: a = Wv.connectNulls } = e,
      o = UT(t, i),
      s = a ? r.filter(Ts) : r;
    if (Array.isArray(n)) {
      var l,
        c = r.map((p, v) => Uv(Uv({}, p), {}, { base: n[v] }));
      i === 'vertical'
        ? (l = Ro()
            .y(oa)
            .x1(aa)
            .x0((p) => p.base.x))
        : (l = Ro()
            .x(aa)
            .y1(oa)
            .y0((p) => p.base.y));
      var u = l.defined(Kv).curve(o),
        f = a ? c.filter(Kv) : c;
      return u(f);
    }
    var h;
    i === 'vertical' && X(n)
      ? (h = Ro().y(oa).x1(aa).x0(n))
      : X(n)
        ? (h = Ro().x(aa).y1(oa).y0(n))
        : (h = Xw().x(aa).y(oa));
    var m = h.defined(Ts).curve(o);
    return m(s);
  },
  wa = (e) => {
    var { className: t, points: r, path: n, pathRef: i } = e,
      a = Yn();
    if ((!r || !r.length) && !n) return null;
    var o = {
        type: e.type,
        points: e.points,
        baseLine: e.baseLine,
        layout: e.layout || a,
        connectNulls: e.connectNulls,
      },
      s = r && r.length ? zT(o) : n;
    return d.createElement(
      'path',
      td({}, Qt(e), Yd(e), { className: Ne('recharts-curve', t), d: s === null ? void 0 : s, ref: i }),
    );
  },
  KT = ['x', 'y', 'top', 'left', 'width', 'height', 'className'];
function rd() {
  return (
    (rd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    rd.apply(null, arguments)
  );
}
function Hv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function WT(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Hv(Object(r), !0).forEach(function (n) {
          HT(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Hv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function HT(e, t, r) {
  return (
    (t = qT(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function qT(e) {
  var t = VT(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function VT(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function GT(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = YT(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function YT(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var XT = (e, t, r, n, i, a) => 'M'.concat(e, ',').concat(i, 'v').concat(n, 'M').concat(a, ',').concat(t, 'h').concat(r),
  ZT = (e) => {
    var { x: t = 0, y: r = 0, top: n = 0, left: i = 0, width: a = 0, height: o = 0, className: s } = e,
      l = GT(e, KT),
      c = WT({ x: t, y: r, top: n, left: i, width: a, height: o }, l);
    return !X(t) || !X(r) || !X(a) || !X(o) || !X(n) || !X(i)
      ? null
      : d.createElement('path', rd({}, Ct(c), { className: Ne('recharts-cross', s), d: XT(t, r, a, o, n, i) }));
  };
function JT(e, t, r, n) {
  var i = n / 2;
  return {
    stroke: 'none',
    fill: '#ccc',
    x: e === 'horizontal' ? t.x - i : r.left + 0.5,
    y: e === 'horizontal' ? r.top + 0.5 : t.y - i,
    width: e === 'horizontal' ? n : r.width - 1,
    height: e === 'horizontal' ? r.height - 1 : n,
  };
}
function qv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Vv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? qv(Object(r), !0).forEach(function (n) {
          QT(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : qv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function QT(e, t, r) {
  return (
    (t = eM(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function eM(e) {
  var t = tM(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function tM(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var rM = (e) => e.replace(/([A-Z])/g, (t) => '-'.concat(t.toLowerCase())),
  w0 = (e, t, r) => e.map((n) => ''.concat(rM(n), ' ').concat(t, 'ms ').concat(r)).join(','),
  nM = (e, t) => [Object.keys(e), Object.keys(t)].reduce((r, n) => r.filter((i) => n.includes(i))),
  Ta = (e, t) => Object.keys(t).reduce((r, n) => Vv(Vv({}, r), {}, { [n]: e(n, t[n]) }), {});
function Gv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Qe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Gv(Object(r), !0).forEach(function (n) {
          iM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Gv(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function iM(e, t, r) {
  return (
    (t = aM(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function aM(e) {
  var t = oM(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function oM(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var Ms = (e, t, r) => e + (t - e) * r,
  nd = (e) => {
    var { from: t, to: r } = e;
    return t !== r;
  },
  x0 = (e, t, r) => {
    var n = Ta((i, a) => {
      if (nd(a)) {
        var [o, s] = e(a.from, a.to, a.velocity);
        return Qe(Qe({}, a), {}, { from: o, velocity: s });
      }
      return a;
    }, t);
    return r < 1
      ? Ta(
          (i, a) =>
            nd(a) && n[i] != null
              ? Qe(Qe({}, a), {}, { velocity: Ms(a.velocity, n[i].velocity, r), from: Ms(a.from, n[i].from, r) })
              : a,
          t,
        )
      : x0(e, n, r - 1);
  };
function sM(e, t, r, n, i, a) {
  var o,
    s = n.reduce((h, m) => Qe(Qe({}, h), {}, { [m]: { from: e[m], velocity: 0, to: t[m] } }), {}),
    l = () => Ta((h, m) => m.from, s),
    c = () => !Object.values(s).filter(nd).length,
    u = null,
    f = (h) => {
      o || (o = h);
      var m = h - o,
        p = m / r.dt;
      ((s = x0(r, s, p)), i(Qe(Qe(Qe({}, e), t), l())), (o = h), c() || (u = a.setTimeout(f)));
    };
  return () => (
    (u = a.setTimeout(f)),
    () => {
      var h;
      (h = u) === null || h === void 0 || h();
    }
  );
}
function lM(e, t, r, n, i, a, o) {
  var s = null,
    l = i.reduce((f, h) => {
      var m = e[h],
        p = t[h];
      return m == null || p == null ? f : Qe(Qe({}, f), {}, { [h]: [m, p] });
    }, {}),
    c,
    u = (f) => {
      c || (c = f);
      var h = (f - c) / n,
        m = Ta((v, g) => Ms(...g, r(h)), l);
      if ((a(Qe(Qe(Qe({}, e), t), m)), h < 1)) s = o.setTimeout(u);
      else {
        var p = Ta((v, g) => Ms(...g, r(1)), l);
        a(Qe(Qe(Qe({}, e), t), p));
      }
    };
  return () => (
    (s = o.setTimeout(u)),
    () => {
      var f;
      (f = s) === null || f === void 0 || f();
    }
  );
}
const cM = (e, t, r, n, i, a) => {
  var o = nM(e, t);
  return r == null
    ? () => (i(Qe(Qe({}, e), t)), () => {})
    : r.isStepper === !0
      ? sM(e, t, r, o, i, a)
      : lM(e, t, r, n, o, i, a);
};
var Ds = 1e-4,
  S0 = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1],
  A0 = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n),
  Yv = (e, t) => (r) => {
    var n = S0(e, t);
    return A0(n, r);
  },
  uM = (e, t) => (r) => {
    var n = S0(e, t),
      i = [...n.map((a, o) => a * o).slice(1), 0];
    return A0(i, r);
  },
  fM = (e) => {
    var t,
      r = e.split('(');
    if (r.length !== 2 || r[0] !== 'cubic-bezier') return null;
    var n =
      (t = r[1]) === null || t === void 0 || (t = t.split(')')[0]) === null || t === void 0 ? void 0 : t.split(',');
    if (n == null || n.length !== 4) return null;
    var i = n.map((a) => parseFloat(a));
    return [i[0], i[1], i[2], i[3]];
  },
  dM = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
    if (r.length === 1)
      switch (r[0]) {
        case 'linear':
          return [0, 0, 1, 1];
        case 'ease':
          return [0.25, 0.1, 0.25, 1];
        case 'ease-in':
          return [0.42, 0, 1, 1];
        case 'ease-out':
          return [0.42, 0, 0.58, 1];
        case 'ease-in-out':
          return [0, 0, 0.58, 1];
        default: {
          var i = fM(r[0]);
          if (i) return i;
        }
      }
    return r.length === 4 ? r : [0, 0, 1, 1];
  },
  hM = (e, t, r, n) => {
    var i = Yv(e, r),
      a = Yv(t, n),
      o = uM(e, r),
      s = (c) => (c > 1 ? 1 : c < 0 ? 0 : c),
      l = (c) => {
        for (var u = c > 1 ? 1 : c, f = u, h = 0; h < 8; ++h) {
          var m = i(f) - u,
            p = o(f);
          if (Math.abs(m - u) < Ds || p < Ds) return a(f);
          f = s(f - m / p);
        }
        return a(f);
      };
    return ((l.isStepper = !1), l);
  },
  Xv = function () {
    return hM(...dM(...arguments));
  },
  mM = function () {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      { stiff: r = 100, damping: n = 8, dt: i = 17 } = t,
      a = (o, s, l) => {
        var c = -(o - s) * r,
          u = l * n,
          f = l + ((c - u) * i) / 1e3,
          h = (l * i) / 1e3 + o;
        return Math.abs(h - s) < Ds && Math.abs(f) < Ds ? [s, 0] : [h, f];
      };
    return ((a.isStepper = !0), (a.dt = i), a);
  },
  pM = (e) => {
    if (typeof e == 'string')
      switch (e) {
        case 'ease':
        case 'ease-in-out':
        case 'ease-out':
        case 'ease-in':
        case 'linear':
          return Xv(e);
        case 'spring':
          return mM();
        default:
          if (e.split('(')[0] === 'cubic-bezier') return Xv(e);
      }
    return typeof e == 'function' ? e : null;
  };
function vM(e) {
  var t,
    r = () => null,
    n = !1,
    i = null,
    a = (o) => {
      if (!n) {
        if (Array.isArray(o)) {
          if (!o.length) return;
          var s = o,
            [l, ...c] = s;
          if (typeof l == 'number') {
            i = e.setTimeout(a.bind(null, c), l);
            return;
          }
          (a(l), (i = e.setTimeout(a.bind(null, c))));
          return;
        }
        (typeof o == 'string' && ((t = o), r(t)),
          typeof o == 'object' && ((t = o), r(t)),
          typeof o == 'function' && o());
      }
    };
  return {
    stop: () => {
      n = !0;
    },
    start: (o) => {
      ((n = !1), i && (i(), (i = null)), a(o));
    },
    subscribe: (o) => (
      (r = o),
      () => {
        r = () => null;
      }
    ),
    getTimeoutController: () => e,
  };
}
class gM {
  setTimeout(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      n = performance.now(),
      i = null,
      a = (o) => {
        o - n >= r ? t(o) : typeof requestAnimationFrame == 'function' && (i = requestAnimationFrame(a));
      };
    return (
      (i = requestAnimationFrame(a)),
      () => {
        i != null && cancelAnimationFrame(i);
      }
    );
  }
}
function yM() {
  return vM(new gM());
}
var bM = d.createContext(yM);
function wM(e, t) {
  var r = d.useContext(bM);
  return d.useMemo(() => t ?? r(e), [e, t, r]);
}
var xM = {
    begin: 0,
    duration: 1e3,
    easing: 'ease',
    isActive: !0,
    canBegin: !0,
    onAnimationEnd: () => {},
    onAnimationStart: () => {},
  },
  Zv = { t: 0 },
  Yu = { t: 1 };
function $l(e) {
  var t = Mt(e, xM),
    {
      isActive: r,
      canBegin: n,
      duration: i,
      easing: a,
      begin: o,
      onAnimationEnd: s,
      onAnimationStart: l,
      children: c,
    } = t,
    u = y0(),
    f = r === 'auto' ? !Za.isSsr && !u : r,
    h = wM(t.animationId, t.animationManager),
    [m, p] = d.useState(f ? Zv : Yu),
    v = d.useRef(null);
  return (
    d.useEffect(() => {
      f || p(Yu);
    }, [f]),
    d.useEffect(() => {
      if (!f || !n) return Gn;
      var g = cM(Zv, Yu, pM(a), i, p, h.getTimeoutController()),
        b = () => {
          v.current = g();
        };
      return (
        h.start([l, o, b, i, s]),
        () => {
          (h.stop(), v.current && v.current(), s());
        }
      );
    }, [f, n, i, a, o, l, s, h]),
    c(m.t)
  );
}
function Fl(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'animation-',
    r = d.useRef(Oa(t)),
    n = d.useRef(e);
  return (n.current !== e && ((r.current = Oa(t)), (n.current = e)), r.current);
}
var SM = ['radius'],
  AM = ['radius'],
  Jv,
  Qv,
  eg,
  tg,
  rg,
  ng,
  ig,
  ag,
  og,
  sg;
function lg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function cg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? lg(Object(r), !0).forEach(function (n) {
          PM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : lg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function PM(e, t, r) {
  return (
    (t = CM(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function CM(e) {
  var t = OM(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function OM(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Rs() {
  return (
    (Rs = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Rs.apply(null, arguments)
  );
}
function ug(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = _M(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function _M(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function pr(e, t) {
  return (t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })));
}
var fg = (e, t, r, n, i) => {
    var a = dn(r),
      o = dn(n),
      s = Math.min(Math.abs(a) / 2, Math.abs(o) / 2),
      l = o >= 0 ? 1 : -1,
      c = a >= 0 ? 1 : -1,
      u = (o >= 0 && a >= 0) || (o < 0 && a < 0) ? 1 : 0,
      f;
    if (s > 0 && Array.isArray(i)) {
      for (var h = [0, 0, 0, 0], m = 0, p = 4; m < p; m++) {
        var v,
          g = (v = i[m]) !== null && v !== void 0 ? v : 0;
        h[m] = g > s ? s : g;
      }
      ((f = qe(Jv || (Jv = pr(['M', ',', ''])), e, t + l * h[0])),
        h[0] > 0 && (f += qe(Qv || (Qv = pr(['A ', ',', ',0,0,', ',', ',', ''])), h[0], h[0], u, e + c * h[0], t)),
        (f += qe(eg || (eg = pr(['L ', ',', ''])), e + r - c * h[1], t)),
        h[1] > 0 &&
          (f += qe(
            tg ||
              (tg = pr([
                'A ',
                ',',
                ',0,0,',
                `,
        `,
                ',',
                '',
              ])),
            h[1],
            h[1],
            u,
            e + r,
            t + l * h[1],
          )),
        (f += qe(rg || (rg = pr(['L ', ',', ''])), e + r, t + n - l * h[2])),
        h[2] > 0 &&
          (f += qe(
            ng ||
              (ng = pr([
                'A ',
                ',',
                ',0,0,',
                `,
        `,
                ',',
                '',
              ])),
            h[2],
            h[2],
            u,
            e + r - c * h[2],
            t + n,
          )),
        (f += qe(ig || (ig = pr(['L ', ',', ''])), e + c * h[3], t + n)),
        h[3] > 0 &&
          (f += qe(
            ag ||
              (ag = pr([
                'A ',
                ',',
                ',0,0,',
                `,
        `,
                ',',
                '',
              ])),
            h[3],
            h[3],
            u,
            e,
            t + n - l * h[3],
          )),
        (f += 'Z'));
    } else if (s > 0 && i === +i && i > 0) {
      var b = Math.min(s, i);
      f = qe(
        og ||
          (og = pr([
            'M ',
            ',',
            `
            A `,
            ',',
            ',0,0,',
            ',',
            ',',
            `
            L `,
            ',',
            `
            A `,
            ',',
            ',0,0,',
            ',',
            ',',
            `
            L `,
            ',',
            `
            A `,
            ',',
            ',0,0,',
            ',',
            ',',
            `
            L `,
            ',',
            `
            A `,
            ',',
            ',0,0,',
            ',',
            ',',
            ' Z',
          ])),
        e,
        t + l * b,
        b,
        b,
        u,
        e + c * b,
        t,
        e + r - c * b,
        t,
        b,
        b,
        u,
        e + r,
        t + l * b,
        e + r,
        t + n - l * b,
        b,
        b,
        u,
        e + r - c * b,
        t + n,
        e + c * b,
        t + n,
        b,
        b,
        u,
        e,
        t + n - l * b,
      );
    } else f = qe(sg || (sg = pr(['M ', ',', ' h ', ' v ', ' h ', ' Z'])), e, t, r, n, -r);
    return f;
  },
  dg = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 0,
    isAnimationActive: !1,
    isUpdateAnimationActive: !1,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
  },
  P0 = (e) => {
    var t = Mt(e, dg),
      r = d.useRef(null),
      [n, i] = d.useState(-1);
    d.useEffect(() => {
      if (r.current && r.current.getTotalLength)
        try {
          var se = r.current.getTotalLength();
          se && i(se);
        } catch {}
    }, []);
    var { x: a, y: o, width: s, height: l, radius: c, className: u } = t,
      {
        animationEasing: f,
        animationDuration: h,
        animationBegin: m,
        isAnimationActive: p,
        isUpdateAnimationActive: v,
      } = t,
      g = d.useRef(s),
      b = d.useRef(l),
      S = d.useRef(a),
      x = d.useRef(o),
      A = d.useMemo(() => ({ x: a, y: o, width: s, height: l, radius: c }), [a, o, s, l, c]),
      C = Fl(A, 'rectangle-');
    if (a !== +a || o !== +o || s !== +s || l !== +l || s === 0 || l === 0) return null;
    var P = Ne('recharts-rectangle', u);
    if (!v) {
      var _ = Ct(t),
        { radius: E } = _,
        j = ug(_, SM);
      return d.createElement(
        'path',
        Rs({}, j, {
          x: dn(a),
          y: dn(o),
          width: dn(s),
          height: dn(l),
          radius: typeof c == 'number' ? c : void 0,
          className: P,
          d: fg(a, o, s, l, c),
        }),
      );
    }
    var N = g.current,
      M = b.current,
      O = S.current,
      D = x.current,
      B = '0px '.concat(n === -1 ? 1 : n, 'px'),
      Y = ''.concat(n, 'px ').concat(n, 'px'),
      Q = w0(['strokeDasharray'], h, typeof f == 'string' ? f : dg.animationEasing);
    return d.createElement(
      $l,
      { animationId: C, key: C, canBegin: n > 0, duration: h, easing: f, isActive: v, begin: m },
      (se) => {
        var V = Be(N, s, se),
          T = Be(M, l, se),
          F = Be(O, a, se),
          W = Be(D, o, se);
        r.current && ((g.current = V), (b.current = T), (S.current = F), (x.current = W));
        var z;
        p
          ? se > 0
            ? (z = { transition: Q, strokeDasharray: Y })
            : (z = { strokeDasharray: B })
          : (z = { strokeDasharray: Y });
        var H = Ct(t),
          { radius: G } = H,
          le = ug(H, AM);
        return d.createElement(
          'path',
          Rs({}, le, {
            radius: typeof c == 'number' ? c : void 0,
            className: P,
            d: fg(F, W, V, T, c),
            ref: r,
            style: cg(cg({}, z), t.style),
          }),
        );
      },
    );
  };
function hg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function mg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? hg(Object(r), !0).forEach(function (n) {
          EM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : hg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function EM(e, t, r) {
  return (
    (t = kM(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function kM(e) {
  var t = jM(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function jM(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var Ls = Math.PI / 180,
  NM = (e) => (e * 180) / Math.PI,
  mt = (e, t, r, n) => ({ x: e + Math.cos(-Ls * n) * r, y: t + Math.sin(-Ls * n) * r }),
  IM = function (t, r) {
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { top: 0, right: 0, bottom: 0, left: 0 };
    return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
  },
  TM = (e, t) => {
    var { x: r, y: n } = e,
      { x: i, y: a } = t;
    return Math.sqrt((r - i) ** 2 + (n - a) ** 2);
  },
  MM = (e, t) => {
    var { x: r, y: n } = e,
      { cx: i, cy: a } = t,
      o = TM({ x: r, y: n }, { x: i, y: a });
    if (o <= 0) return { radius: o, angle: 0 };
    var s = (r - i) / o,
      l = Math.acos(s);
    return (n > a && (l = 2 * Math.PI - l), { radius: o, angle: NM(l), angleInRadian: l });
  },
  DM = (e) => {
    var { startAngle: t, endAngle: r } = e,
      n = Math.floor(t / 360),
      i = Math.floor(r / 360),
      a = Math.min(n, i);
    return { startAngle: t - a * 360, endAngle: r - a * 360 };
  },
  RM = (e, t) => {
    var { startAngle: r, endAngle: n } = t,
      i = Math.floor(r / 360),
      a = Math.floor(n / 360),
      o = Math.min(i, a);
    return e + o * 360;
  },
  LM = (e, t) => {
    var { relativeX: r, relativeY: n } = e,
      { radius: i, angle: a } = MM({ x: r, y: n }, t),
      { innerRadius: o, outerRadius: s } = t;
    if (i < o || i > s || i === 0) return null;
    var { startAngle: l, endAngle: c } = DM(t),
      u = a,
      f;
    if (l <= c) {
      for (; u > c; ) u -= 360;
      for (; u < l; ) u += 360;
      f = u >= l && u <= c;
    } else {
      for (; u > l; ) u -= 360;
      for (; u < c; ) u += 360;
      f = u >= c && u <= l;
    }
    return f ? mg(mg({}, t), {}, { radius: i, angle: RM(u, t) }) : null;
  };
function C0(e) {
  var { cx: t, cy: r, radius: n, startAngle: i, endAngle: a } = e,
    o = mt(t, r, n, i),
    s = mt(t, r, n, a);
  return { points: [o, s], cx: t, cy: r, radius: n, startAngle: i, endAngle: a };
}
var pg, vg, gg, yg, bg, wg, xg;
function id() {
  return (
    (id = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    id.apply(null, arguments)
  );
}
function In(e, t) {
  return (t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })));
}
var $M = (e, t) => {
    var r = Nt(t - e),
      n = Math.min(Math.abs(t - e), 359.999);
    return r * n;
  },
  Wo = (e) => {
    var { cx: t, cy: r, radius: n, angle: i, sign: a, isExternal: o, cornerRadius: s, cornerIsExternal: l } = e,
      c = s * (o ? 1 : -1) + n,
      u = Math.asin(s / c) / Ls,
      f = l ? i : i + a * u,
      h = mt(t, r, c, f),
      m = mt(t, r, n, f),
      p = l ? i - a * u : i,
      v = mt(t, r, c * Math.cos(u * Ls), p);
    return { center: h, circleTangency: m, lineTangency: v, theta: u };
  },
  O0 = (e) => {
    var { cx: t, cy: r, innerRadius: n, outerRadius: i, startAngle: a, endAngle: o } = e,
      s = $M(a, o),
      l = a + s,
      c = mt(t, r, i, a),
      u = mt(t, r, i, l),
      f = qe(
        pg ||
          (pg = In([
            'M ',
            ',',
            `
    A `,
            ',',
            `,0,
    `,
            ',',
            `,
    `,
            ',',
            `
  `,
          ])),
        c.x,
        c.y,
        i,
        i,
        +(Math.abs(s) > 180),
        +(a > l),
        u.x,
        u.y,
      );
    if (n > 0) {
      var h = mt(t, r, n, a),
        m = mt(t, r, n, l);
      f += qe(
        vg ||
          (vg = In([
            'L ',
            ',',
            `
            A `,
            ',',
            `,0,
            `,
            ',',
            `,
            `,
            ',',
            ' Z',
          ])),
        m.x,
        m.y,
        n,
        n,
        +(Math.abs(s) > 180),
        +(a <= l),
        h.x,
        h.y,
      );
    } else f += qe(gg || (gg = In(['L ', ',', ' Z'])), t, r);
    return f;
  },
  FM = (e) => {
    var {
        cx: t,
        cy: r,
        innerRadius: n,
        outerRadius: i,
        cornerRadius: a,
        forceCornerRadius: o,
        cornerIsExternal: s,
        startAngle: l,
        endAngle: c,
      } = e,
      u = Nt(c - l),
      {
        circleTangency: f,
        lineTangency: h,
        theta: m,
      } = Wo({ cx: t, cy: r, radius: i, angle: l, sign: u, cornerRadius: a, cornerIsExternal: s }),
      {
        circleTangency: p,
        lineTangency: v,
        theta: g,
      } = Wo({ cx: t, cy: r, radius: i, angle: c, sign: -u, cornerRadius: a, cornerIsExternal: s }),
      b = s ? Math.abs(l - c) : Math.abs(l - c) - m - g;
    if (b < 0)
      return o
        ? qe(
            yg ||
              (yg = In([
                'M ',
                ',',
                `
        a`,
                ',',
                ',0,0,1,',
                `,0
        a`,
                ',',
                ',0,0,1,',
                `,0
      `,
              ])),
            h.x,
            h.y,
            a,
            a,
            a * 2,
            a,
            a,
            -a * 2,
          )
        : O0({ cx: t, cy: r, innerRadius: n, outerRadius: i, startAngle: l, endAngle: c });
    var S = qe(
      bg ||
        (bg = In([
          'M ',
          ',',
          `
    A`,
          ',',
          ',0,0,',
          ',',
          ',',
          `
    A`,
          ',',
          ',0,',
          ',',
          ',',
          ',',
          `
    A`,
          ',',
          ',0,0,',
          ',',
          ',',
          `
  `,
        ])),
      h.x,
      h.y,
      a,
      a,
      +(u < 0),
      f.x,
      f.y,
      i,
      i,
      +(b > 180),
      +(u < 0),
      p.x,
      p.y,
      a,
      a,
      +(u < 0),
      v.x,
      v.y,
    );
    if (n > 0) {
      var {
          circleTangency: x,
          lineTangency: A,
          theta: C,
        } = Wo({ cx: t, cy: r, radius: n, angle: l, sign: u, isExternal: !0, cornerRadius: a, cornerIsExternal: s }),
        {
          circleTangency: P,
          lineTangency: _,
          theta: E,
        } = Wo({ cx: t, cy: r, radius: n, angle: c, sign: -u, isExternal: !0, cornerRadius: a, cornerIsExternal: s }),
        j = s ? Math.abs(l - c) : Math.abs(l - c) - C - E;
      if (j < 0 && a === 0) return ''.concat(S, 'L').concat(t, ',').concat(r, 'Z');
      S += qe(
        wg ||
          (wg = In([
            'L',
            ',',
            `
      A`,
            ',',
            ',0,0,',
            ',',
            ',',
            `
      A`,
            ',',
            ',0,',
            ',',
            ',',
            ',',
            `
      A`,
            ',',
            ',0,0,',
            ',',
            ',',
            'Z',
          ])),
        _.x,
        _.y,
        a,
        a,
        +(u < 0),
        P.x,
        P.y,
        n,
        n,
        +(j > 180),
        +(u > 0),
        x.x,
        x.y,
        a,
        a,
        +(u < 0),
        A.x,
        A.y,
      );
    } else S += qe(xg || (xg = In(['L', ',', 'Z'])), t, r);
    return S;
  },
  BM = {
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
    cornerRadius: 0,
    forceCornerRadius: !1,
    cornerIsExternal: !1,
  },
  _0 = (e) => {
    var t = Mt(e, BM),
      {
        cx: r,
        cy: n,
        innerRadius: i,
        outerRadius: a,
        cornerRadius: o,
        forceCornerRadius: s,
        cornerIsExternal: l,
        startAngle: c,
        endAngle: u,
        className: f,
      } = t;
    if (a < i || c === u) return null;
    var h = Ne('recharts-sector', f),
      m = a - i,
      p = lr(o, m, 0, !0),
      v;
    return (
      p > 0 && Math.abs(c - u) < 360
        ? (v = FM({
            cx: r,
            cy: n,
            innerRadius: i,
            outerRadius: a,
            cornerRadius: Math.min(p, m / 2),
            forceCornerRadius: s,
            cornerIsExternal: l,
            startAngle: c,
            endAngle: u,
          }))
        : (v = O0({ cx: r, cy: n, innerRadius: i, outerRadius: a, startAngle: c, endAngle: u })),
      d.createElement('path', id({}, Ct(t), { className: h, d: v }))
    );
  };
function UM(e, t, r) {
  if (e === 'horizontal')
    return [
      { x: t.x, y: r.top },
      { x: t.x, y: r.top + r.height },
    ];
  if (e === 'vertical')
    return [
      { x: r.left, y: t.y },
      { x: r.left + r.width, y: t.y },
    ];
  if (dx(t)) {
    if (e === 'centric') {
      var { cx: n, cy: i, innerRadius: a, outerRadius: o, angle: s } = t,
        l = mt(n, i, a, s),
        c = mt(n, i, o, s);
      return [
        { x: l.x, y: l.y },
        { x: c.x, y: c.y },
      ];
    }
    return C0(t);
  }
}
var Xu = {},
  Zu = {},
  Ju = {},
  Sg;
function zM() {
  return (
    Sg ||
      ((Sg = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Ax();
        function r(n) {
          return t.isSymbol(n) ? NaN : Number(n);
        }
        e.toNumber = r;
      })(Ju)),
    Ju
  );
}
var Ag;
function KM() {
  return (
    Ag ||
      ((Ag = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = zM();
        function r(n) {
          return n
            ? ((n = t.toNumber(n)), n === 1 / 0 || n === -1 / 0 ? (n < 0 ? -1 : 1) * Number.MAX_VALUE : n === n ? n : 0)
            : n === 0
              ? n
              : 0;
        }
        e.toFinite = r;
      })(Zu)),
    Zu
  );
}
var Pg;
function WM() {
  return (
    Pg ||
      ((Pg = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        const t = Px(),
          r = KM();
        function n(i, a, o) {
          (o && typeof o != 'number' && t.isIterateeCall(i, a, o) && (a = o = void 0),
            (i = r.toFinite(i)),
            a === void 0 ? ((a = i), (i = 0)) : (a = r.toFinite(a)),
            (o = o === void 0 ? (i < a ? 1 : -1) : r.toFinite(o)));
          const s = Math.max(Math.ceil((a - i) / (o || 1)), 0),
            l = new Array(s);
          for (let c = 0; c < s; c++) ((l[c] = i), (i += o));
          return l;
        }
        e.range = n;
      })(Xu)),
    Xu
  );
}
var Qu, Cg;
function HM() {
  return (Cg || ((Cg = 1), (Qu = WM().range)), Qu);
}
var qM = HM();
const E0 = ki(qM);
var Yr = (e) => e.chartData,
  k0 = I([Yr], (e) => {
    var t = e.chartData != null ? e.chartData.length - 1 : 0;
    return { chartData: e.chartData, computedData: e.computedData, dataEndIndex: t, dataStartIndex: 0 };
  }),
  j0 = (e, t, r, n) => (n ? k0(e) : Yr(e)),
  N0 = (e, t, r) => (r ? k0(e) : Yr(e));
function wr(e) {
  if (Array.isArray(e) && e.length === 2) {
    var [t, r] = e;
    if (he(t) && he(r)) return !0;
  }
  return !1;
}
function Og(e, t, r) {
  return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function I0(e, t) {
  if (t && typeof e != 'function' && Array.isArray(e) && e.length === 2) {
    var [r, n] = e,
      i,
      a;
    if (he(r)) i = r;
    else if (typeof r == 'function') return;
    if (he(n)) a = n;
    else if (typeof n == 'function') return;
    var o = [i, a];
    if (wr(o)) return o;
  }
}
function VM(e, t, r) {
  if (!(!r && t == null)) {
    if (typeof e == 'function' && t != null)
      try {
        var n = e(t, r);
        if (wr(n)) return Og(n, t, r);
      } catch {}
    if (Array.isArray(e) && e.length === 2) {
      var [i, a] = e,
        o,
        s;
      if (i === 'auto') t != null && (o = Math.min(...t));
      else if (X(i)) o = i;
      else if (typeof i == 'function')
        try {
          t != null && (o = i(t?.[0]));
        } catch {}
      else if (typeof i == 'string' && Sv.test(i)) {
        var l = Sv.exec(i);
        if (l == null || l[1] == null || t == null) o = void 0;
        else {
          var c = +l[1];
          o = t[0] - c;
        }
      } else o = t?.[0];
      if (a === 'auto') t != null && (s = Math.max(...t));
      else if (X(a)) s = a;
      else if (typeof a == 'function')
        try {
          t != null && (s = a(t?.[1]));
        } catch {}
      else if (typeof a == 'string' && Av.test(a)) {
        var u = Av.exec(a);
        if (u == null || u[1] == null || t == null) s = void 0;
        else {
          var f = +u[1];
          s = t[1] + f;
        }
      } else s = t?.[1];
      var h = [o, s];
      if (wr(h)) return t == null ? h : Og(h, t, r);
    }
  }
}
var Ii = 1e9,
  GM = {
    precision: 20,
    rounding: 4,
    toExpNeg: -7,
    toExpPos: 21,
    LN10: '2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286',
  },
  fh,
  Re = !0,
  er = '[DecimalError] ',
  Ln = er + 'Invalid argument: ',
  uh = er + 'Exponent out of range: ',
  Ti = Math.floor,
  Nn = Math.pow,
  YM = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
  Rt,
  it = 1e7,
  Me = 7,
  T0 = 9007199254740991,
  $s = Ti(T0 / Me),
  Z = {};
Z.absoluteValue = Z.abs = function () {
  var e = new this.constructor(this);
  return (e.s && (e.s = 1), e);
};
Z.comparedTo = Z.cmp = function (e) {
  var t,
    r,
    n,
    i,
    a = this;
  if (((e = new a.constructor(e)), a.s !== e.s)) return a.s || -e.s;
  if (a.e !== e.e) return (a.e > e.e) ^ (a.s < 0) ? 1 : -1;
  for (n = a.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t)
    if (a.d[t] !== e.d[t]) return (a.d[t] > e.d[t]) ^ (a.s < 0) ? 1 : -1;
  return n === i ? 0 : (n > i) ^ (a.s < 0) ? 1 : -1;
};
Z.decimalPlaces = Z.dp = function () {
  var e = this,
    t = e.d.length - 1,
    r = (t - e.e) * Me;
  if (((t = e.d[t]), t)) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
Z.dividedBy = Z.div = function (e) {
  return Fr(this, new this.constructor(e));
};
Z.dividedToIntegerBy = Z.idiv = function (e) {
  var t = this,
    r = t.constructor;
  return je(Fr(t, new r(e), 0, 1), r.precision);
};
Z.equals = Z.eq = function (e) {
  return !this.cmp(e);
};
Z.exponent = function () {
  return Xe(this);
};
Z.greaterThan = Z.gt = function (e) {
  return this.cmp(e) > 0;
};
Z.greaterThanOrEqualTo = Z.gte = function (e) {
  return this.cmp(e) >= 0;
};
Z.isInteger = Z.isint = function () {
  return this.e > this.d.length - 2;
};
Z.isNegative = Z.isneg = function () {
  return this.s < 0;
};
Z.isPositive = Z.ispos = function () {
  return this.s > 0;
};
Z.isZero = function () {
  return this.s === 0;
};
Z.lessThan = Z.lt = function (e) {
  return this.cmp(e) < 0;
};
Z.lessThanOrEqualTo = Z.lte = function (e) {
  return this.cmp(e) < 1;
};
Z.logarithm = Z.log = function (e) {
  var t,
    r = this,
    n = r.constructor,
    i = n.precision,
    a = i + 5;
  if (e === void 0) e = new n(10);
  else if (((e = new n(e)), e.s < 1 || e.eq(Rt))) throw Error(er + 'NaN');
  if (r.s < 1) throw Error(er + (r.s ? 'NaN' : '-Infinity'));
  return r.eq(Rt) ? new n(0) : ((Re = !1), (t = Fr(Ma(r, a), Ma(e, a), a)), (Re = !0), je(t, i));
};
Z.minus = Z.sub = function (e) {
  var t = this;
  return ((e = new t.constructor(e)), t.s == e.s ? R0(t, e) : M0(t, ((e.s = -e.s), e)));
};
Z.modulo = Z.mod = function (e) {
  var t,
    r = this,
    n = r.constructor,
    i = n.precision;
  if (((e = new n(e)), !e.s)) throw Error(er + 'NaN');
  return r.s ? ((Re = !1), (t = Fr(r, e, 0, 1).times(e)), (Re = !0), r.minus(t)) : je(new n(r), i);
};
Z.naturalExponential = Z.exp = function () {
  return D0(this);
};
Z.naturalLogarithm = Z.ln = function () {
  return Ma(this);
};
Z.negated = Z.neg = function () {
  var e = new this.constructor(this);
  return ((e.s = -e.s || 0), e);
};
Z.plus = Z.add = function (e) {
  var t = this;
  return ((e = new t.constructor(e)), t.s == e.s ? M0(t, e) : R0(t, ((e.s = -e.s), e)));
};
Z.precision = Z.sd = function (e) {
  var t,
    r,
    n,
    i = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Ln + e);
  if (((t = Xe(i) + 1), (n = i.d.length - 1), (r = n * Me + 1), (n = i.d[n]), n)) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = i.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
Z.squareRoot = Z.sqrt = function () {
  var e,
    t,
    r,
    n,
    i,
    a,
    o,
    s = this,
    l = s.constructor;
  if (s.s < 1) {
    if (!s.s) return new l(0);
    throw Error(er + 'NaN');
  }
  for (
    e = Xe(s),
      Re = !1,
      i = Math.sqrt(+s),
      i == 0 || i == 1 / 0
        ? ((t = yr(s.d)),
          (t.length + e) % 2 == 0 && (t += '0'),
          (i = Math.sqrt(t)),
          (e = Ti((e + 1) / 2) - (e < 0 || e % 2)),
          i == 1 / 0 ? (t = '5e' + e) : ((t = i.toExponential()), (t = t.slice(0, t.indexOf('e') + 1) + e)),
          (n = new l(t)))
        : (n = new l(i.toString())),
      r = l.precision,
      i = o = r + 3;
    ;
  )
    if (((a = n), (n = a.plus(Fr(s, a, o + 2)).times(0.5)), yr(a.d).slice(0, o) === (t = yr(n.d)).slice(0, o))) {
      if (((t = t.slice(o - 3, o + 1)), i == o && t == '4999')) {
        if ((je(a, r + 1, 0), a.times(a).eq(s))) {
          n = a;
          break;
        }
      } else if (t != '9999') break;
      o += 4;
    }
  return ((Re = !0), je(n, r));
};
Z.times = Z.mul = function (e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    s,
    l,
    c,
    u = this,
    f = u.constructor,
    h = u.d,
    m = (e = new f(e)).d;
  if (!u.s || !e.s) return new f(0);
  for (
    e.s *= u.s,
      r = u.e + e.e,
      l = h.length,
      c = m.length,
      l < c && ((a = h), (h = m), (m = a), (o = l), (l = c), (c = o)),
      a = [],
      o = l + c,
      n = o;
    n--;
  )
    a.push(0);
  for (n = c; --n >= 0; ) {
    for (t = 0, i = l + n; i > n; ) ((s = a[i] + m[n] * h[i - n - 1] + t), (a[i--] = (s % it) | 0), (t = (s / it) | 0));
    a[i] = ((a[i] + t) % it) | 0;
  }
  for (; !a[--o]; ) a.pop();
  return (t ? ++r : a.shift(), (e.d = a), (e.e = r), Re ? je(e, f.precision) : e);
};
Z.toDecimalPlaces = Z.todp = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    (r = new n(r)),
    e === void 0 ? r : (Ar(e, 0, Ii), t === void 0 ? (t = n.rounding) : Ar(t, 0, 8), je(r, e + Xe(r) + 1, t))
  );
};
Z.toExponential = function (e, t) {
  var r,
    n = this,
    i = n.constructor;
  return (
    e === void 0
      ? (r = Wn(n, !0))
      : (Ar(e, 0, Ii),
        t === void 0 ? (t = i.rounding) : Ar(t, 0, 8),
        (n = je(new i(n), e + 1, t)),
        (r = Wn(n, !0, e + 1))),
    r
  );
};
Z.toFixed = function (e, t) {
  var r,
    n,
    i = this,
    a = i.constructor;
  return e === void 0
    ? Wn(i)
    : (Ar(e, 0, Ii),
      t === void 0 ? (t = a.rounding) : Ar(t, 0, 8),
      (n = je(new a(i), e + Xe(i) + 1, t)),
      (r = Wn(n.abs(), !1, e + Xe(n) + 1)),
      i.isneg() && !i.isZero() ? '-' + r : r);
};
Z.toInteger = Z.toint = function () {
  var e = this,
    t = e.constructor;
  return je(new t(e), Xe(e) + 1, t.rounding);
};
Z.toNumber = function () {
  return +this;
};
Z.toPower = Z.pow = function (e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    s = this,
    l = s.constructor,
    c = 12,
    u = +(e = new l(e));
  if (!e.s) return new l(Rt);
  if (((s = new l(s)), !s.s)) {
    if (e.s < 1) throw Error(er + 'Infinity');
    return s;
  }
  if (s.eq(Rt)) return s;
  if (((n = l.precision), e.eq(Rt))) return je(s, n);
  if (((t = e.e), (r = e.d.length - 1), (o = t >= r), (a = s.s), o)) {
    if ((r = u < 0 ? -u : u) <= T0) {
      for (
        i = new l(Rt), t = Math.ceil(n / Me + 4), Re = !1;
        r % 2 && ((i = i.times(s)), Eg(i.d, t)), (r = Ti(r / 2)), r !== 0;
      )
        ((s = s.times(s)), Eg(s.d, t));
      return ((Re = !0), e.s < 0 ? new l(Rt).div(i) : je(i, n));
    }
  } else if (a < 0) throw Error(er + 'NaN');
  return (
    (a = a < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1),
    (s.s = 1),
    (Re = !1),
    (i = e.times(Ma(s, n + c))),
    (Re = !0),
    (i = D0(i)),
    (i.s = a),
    i
  );
};
Z.toPrecision = function (e, t) {
  var r,
    n,
    i = this,
    a = i.constructor;
  return (
    e === void 0
      ? ((r = Xe(i)), (n = Wn(i, r <= a.toExpNeg || r >= a.toExpPos)))
      : (Ar(e, 1, Ii),
        t === void 0 ? (t = a.rounding) : Ar(t, 0, 8),
        (i = je(new a(i), e, t)),
        (r = Xe(i)),
        (n = Wn(i, e <= r || r <= a.toExpNeg, e))),
    n
  );
};
Z.toSignificantDigits = Z.tosd = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    e === void 0
      ? ((e = n.precision), (t = n.rounding))
      : (Ar(e, 1, Ii), t === void 0 ? (t = n.rounding) : Ar(t, 0, 8)),
    je(new n(r), e, t)
  );
};
Z.toString =
  Z.valueOf =
  Z.val =
  Z.toJSON =
  Z[Symbol.for('nodejs.util.inspect.custom')] =
    function () {
      var e = this,
        t = Xe(e),
        r = e.constructor;
      return Wn(e, t <= r.toExpNeg || t >= r.toExpPos);
    };
function M0(e, t) {
  var r,
    n,
    i,
    a,
    o,
    s,
    l,
    c,
    u = e.constructor,
    f = u.precision;
  if (!e.s || !t.s) return (t.s || (t = new u(e)), Re ? je(t, f) : t);
  if (((l = e.d), (c = t.d), (o = e.e), (i = t.e), (l = l.slice()), (a = o - i), a)) {
    for (
      a < 0 ? ((n = l), (a = -a), (s = c.length)) : ((n = c), (i = o), (s = l.length)),
        o = Math.ceil(f / Me),
        s = o > s ? o + 1 : s + 1,
        a > s && ((a = s), (n.length = 1)),
        n.reverse();
      a--;
    )
      n.push(0);
    n.reverse();
  }
  for (s = l.length, a = c.length, s - a < 0 && ((a = s), (n = c), (c = l), (l = n)), r = 0; a; )
    ((r = ((l[--a] = l[a] + c[a] + r) / it) | 0), (l[a] %= it));
  for (r && (l.unshift(r), ++i), s = l.length; l[--s] == 0; ) l.pop();
  return ((t.d = l), (t.e = i), Re ? je(t, f) : t);
}
function Ar(e, t, r) {
  if (e !== ~~e || e < t || e > r) throw Error(Ln + e);
}
function yr(e) {
  var t,
    r,
    n,
    i = e.length - 1,
    a = '',
    o = e[0];
  if (i > 0) {
    for (a += o, t = 1; t < i; t++) ((n = e[t] + ''), (r = Me - n.length), r && (a += on(r)), (a += n));
    ((o = e[t]), (n = o + ''), (r = Me - n.length), r && (a += on(r)));
  } else if (o === 0) return '0';
  for (; o % 10 === 0; ) o /= 10;
  return a + o;
}
var Fr = (function () {
  function e(n, i) {
    var a,
      o = 0,
      s = n.length;
    for (n = n.slice(); s--; ) ((a = n[s] * i + o), (n[s] = (a % it) | 0), (o = (a / it) | 0));
    return (o && n.unshift(o), n);
  }
  function t(n, i, a, o) {
    var s, l;
    if (a != o) l = a > o ? 1 : -1;
    else
      for (s = l = 0; s < a; s++)
        if (n[s] != i[s]) {
          l = n[s] > i[s] ? 1 : -1;
          break;
        }
    return l;
  }
  function r(n, i, a) {
    for (var o = 0; a--; ) ((n[a] -= o), (o = n[a] < i[a] ? 1 : 0), (n[a] = o * it + n[a] - i[a]));
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function (n, i, a, o) {
    var s,
      l,
      c,
      u,
      f,
      h,
      m,
      p,
      v,
      g,
      b,
      S,
      x,
      A,
      C,
      P,
      _,
      E,
      j = n.constructor,
      N = n.s == i.s ? 1 : -1,
      M = n.d,
      O = i.d;
    if (!n.s) return new j(n);
    if (!i.s) throw Error(er + 'Division by zero');
    for (l = n.e - i.e, _ = O.length, C = M.length, m = new j(N), p = m.d = [], c = 0; O[c] == (M[c] || 0); ) ++c;
    if (
      (O[c] > (M[c] || 0) && --l,
      a == null ? (S = a = j.precision) : o ? (S = a + (Xe(n) - Xe(i)) + 1) : (S = a),
      S < 0)
    )
      return new j(0);
    if (((S = (S / Me + 2) | 0), (c = 0), _ == 1))
      for (u = 0, O = O[0], S++; (c < C || u) && S--; c++)
        ((x = u * it + (M[c] || 0)), (p[c] = (x / O) | 0), (u = (x % O) | 0));
    else {
      for (
        u = (it / (O[0] + 1)) | 0,
          u > 1 && ((O = e(O, u)), (M = e(M, u)), (_ = O.length), (C = M.length)),
          A = _,
          v = M.slice(0, _),
          g = v.length;
        g < _;
      )
        v[g++] = 0;
      ((E = O.slice()), E.unshift(0), (P = O[0]), O[1] >= it / 2 && ++P);
      do
        ((u = 0),
          (s = t(O, v, _, g)),
          s < 0
            ? ((b = v[0]),
              _ != g && (b = b * it + (v[1] || 0)),
              (u = (b / P) | 0),
              u > 1
                ? (u >= it && (u = it - 1),
                  (f = e(O, u)),
                  (h = f.length),
                  (g = v.length),
                  (s = t(f, v, h, g)),
                  s == 1 && (u--, r(f, _ < h ? E : O, h)))
                : (u == 0 && (s = u = 1), (f = O.slice())),
              (h = f.length),
              h < g && f.unshift(0),
              r(v, f, g),
              s == -1 && ((g = v.length), (s = t(O, v, _, g)), s < 1 && (u++, r(v, _ < g ? E : O, g))),
              (g = v.length))
            : s === 0 && (u++, (v = [0])),
          (p[c++] = u),
          s && v[0] ? (v[g++] = M[A] || 0) : ((v = [M[A]]), (g = 1)));
      while ((A++ < C || v[0] !== void 0) && S--);
    }
    return (p[0] || p.shift(), (m.e = l), je(m, o ? a + Xe(m) + 1 : a));
  };
})();
function D0(e, t) {
  var r,
    n,
    i,
    a,
    o,
    s,
    l = 0,
    c = 0,
    u = e.constructor,
    f = u.precision;
  if (Xe(e) > 16) throw Error(uh + Xe(e));
  if (!e.s) return new u(Rt);
  for (Re = !1, s = f, o = new u(0.03125); e.abs().gte(0.1); ) ((e = e.times(o)), (c += 5));
  for (n = ((Math.log(Nn(2, c)) / Math.LN10) * 2 + 5) | 0, s += n, r = i = a = new u(Rt), u.precision = s; ; ) {
    if (
      ((i = je(i.times(e), s)),
      (r = r.times(++l)),
      (o = a.plus(Fr(i, r, s))),
      yr(o.d).slice(0, s) === yr(a.d).slice(0, s))
    ) {
      for (; c--; ) a = je(a.times(a), s);
      return ((u.precision = f), t == null ? ((Re = !0), je(a, f)) : a);
    }
    a = o;
  }
}
function Xe(e) {
  for (var t = e.e * Me, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function ef(e, t, r) {
  if (t > e.LN10.sd()) throw ((Re = !0), r && (e.precision = r), Error(er + 'LN10 precision limit exceeded'));
  return je(new e(e.LN10), t);
}
function on(e) {
  for (var t = ''; e--; ) t += '0';
  return t;
}
function Ma(e, t) {
  var r,
    n,
    i,
    a,
    o,
    s,
    l,
    c,
    u,
    f = 1,
    h = 10,
    m = e,
    p = m.d,
    v = m.constructor,
    g = v.precision;
  if (m.s < 1) throw Error(er + (m.s ? 'NaN' : '-Infinity'));
  if (m.eq(Rt)) return new v(0);
  if ((t == null ? ((Re = !1), (c = g)) : (c = t), m.eq(10))) return (t == null && (Re = !0), ef(v, c));
  if (((c += h), (v.precision = c), (r = yr(p)), (n = r.charAt(0)), (a = Xe(m)), Math.abs(a) < 15e14)) {
    for (; (n < 7 && n != 1) || (n == 1 && r.charAt(1) > 3); )
      ((m = m.times(e)), (r = yr(m.d)), (n = r.charAt(0)), f++);
    ((a = Xe(m)), n > 1 ? ((m = new v('0.' + r)), a++) : (m = new v(n + '.' + r.slice(1))));
  } else
    return (
      (l = ef(v, c + 2, g).times(a + '')),
      (m = Ma(new v(n + '.' + r.slice(1)), c - h).plus(l)),
      (v.precision = g),
      t == null ? ((Re = !0), je(m, g)) : m
    );
  for (s = o = m = Fr(m.minus(Rt), m.plus(Rt), c), u = je(m.times(m), c), i = 3; ; ) {
    if (((o = je(o.times(u), c)), (l = s.plus(Fr(o, new v(i), c))), yr(l.d).slice(0, c) === yr(s.d).slice(0, c)))
      return (
        (s = s.times(2)),
        a !== 0 && (s = s.plus(ef(v, c + 2, g).times(a + ''))),
        (s = Fr(s, new v(f), c)),
        (v.precision = g),
        t == null ? ((Re = !0), je(s, g)) : s
      );
    ((s = l), (i += 2));
  }
}
function _g(e, t) {
  var r, n, i;
  for (
    (r = t.indexOf('.')) > -1 && (t = t.replace('.', '')),
      (n = t.search(/e/i)) > 0
        ? (r < 0 && (r = n), (r += +t.slice(n + 1)), (t = t.substring(0, n)))
        : r < 0 && (r = t.length),
      n = 0;
    t.charCodeAt(n) === 48;
  )
    ++n;
  for (i = t.length; t.charCodeAt(i - 1) === 48; ) --i;
  if (((t = t.slice(n, i)), t)) {
    if (((i -= n), (r = r - n - 1), (e.e = Ti(r / Me)), (e.d = []), (n = (r + 1) % Me), r < 0 && (n += Me), n < i)) {
      for (n && e.d.push(+t.slice(0, n)), i -= Me; n < i; ) e.d.push(+t.slice(n, (n += Me)));
      ((t = t.slice(n)), (n = Me - t.length));
    } else n -= i;
    for (; n--; ) t += '0';
    if ((e.d.push(+t), Re && (e.e > $s || e.e < -$s))) throw Error(uh + r);
  } else ((e.s = 0), (e.e = 0), (e.d = [0]));
  return e;
}
function je(e, t, r) {
  var n,
    i,
    a,
    o,
    s,
    l,
    c,
    u,
    f = e.d;
  for (o = 1, a = f[0]; a >= 10; a /= 10) o++;
  if (((n = t - o), n < 0)) ((n += Me), (i = t), (c = f[(u = 0)]));
  else {
    if (((u = Math.ceil((n + 1) / Me)), (a = f.length), u >= a)) return e;
    for (c = a = f[u], o = 1; a >= 10; a /= 10) o++;
    ((n %= Me), (i = n - Me + o));
  }
  if (
    (r !== void 0 &&
      ((a = Nn(10, o - i - 1)),
      (s = ((c / a) % 10) | 0),
      (l = t < 0 || f[u + 1] !== void 0 || c % a),
      (l =
        r < 4
          ? (s || l) && (r == 0 || r == (e.s < 0 ? 3 : 2))
          : s > 5 ||
            (s == 5 &&
              (r == 4 ||
                l ||
                (r == 6 && ((n > 0 ? (i > 0 ? c / Nn(10, o - i) : 0) : f[u - 1]) % 10) & 1) ||
                r == (e.s < 0 ? 8 : 7))))),
    t < 1 || !f[0])
  )
    return (
      l
        ? ((a = Xe(e)),
          (f.length = 1),
          (t = t - a - 1),
          (f[0] = Nn(10, (Me - (t % Me)) % Me)),
          (e.e = Ti(-t / Me) || 0))
        : ((f.length = 1), (f[0] = e.e = e.s = 0)),
      e
    );
  if (
    (n == 0
      ? ((f.length = u), (a = 1), u--)
      : ((f.length = u + 1), (a = Nn(10, Me - n)), (f[u] = i > 0 ? (((c / Nn(10, o - i)) % Nn(10, i)) | 0) * a : 0)),
    l)
  )
    for (;;)
      if (u == 0) {
        (f[0] += a) == it && ((f[0] = 1), ++e.e);
        break;
      } else {
        if (((f[u] += a), f[u] != it)) break;
        ((f[u--] = 0), (a = 1));
      }
  for (n = f.length; f[--n] === 0; ) f.pop();
  if (Re && (e.e > $s || e.e < -$s)) throw Error(uh + Xe(e));
  return e;
}
function R0(e, t) {
  var r,
    n,
    i,
    a,
    o,
    s,
    l,
    c,
    u,
    f,
    h = e.constructor,
    m = h.precision;
  if (!e.s || !t.s) return (t.s ? (t.s = -t.s) : (t = new h(e)), Re ? je(t, m) : t);
  if (((l = e.d), (f = t.d), (n = t.e), (c = e.e), (l = l.slice()), (o = c - n), o)) {
    for (
      u = o < 0,
        u ? ((r = l), (o = -o), (s = f.length)) : ((r = f), (n = c), (s = l.length)),
        i = Math.max(Math.ceil(m / Me), s) + 2,
        o > i && ((o = i), (r.length = 1)),
        r.reverse(),
        i = o;
      i--;
    )
      r.push(0);
    r.reverse();
  } else {
    for (i = l.length, s = f.length, u = i < s, u && (s = i), i = 0; i < s; i++)
      if (l[i] != f[i]) {
        u = l[i] < f[i];
        break;
      }
    o = 0;
  }
  for (u && ((r = l), (l = f), (f = r), (t.s = -t.s)), s = l.length, i = f.length - s; i > 0; --i) l[s++] = 0;
  for (i = f.length; i > o; ) {
    if (l[--i] < f[i]) {
      for (a = i; a && l[--a] === 0; ) l[a] = it - 1;
      (--l[a], (l[i] += it));
    }
    l[i] -= f[i];
  }
  for (; l[--s] === 0; ) l.pop();
  for (; l[0] === 0; l.shift()) --n;
  return l[0] ? ((t.d = l), (t.e = n), Re ? je(t, m) : t) : new h(0);
}
function Wn(e, t, r) {
  var n,
    i = Xe(e),
    a = yr(e.d),
    o = a.length;
  return (
    t
      ? (r && (n = r - o) > 0
          ? (a = a.charAt(0) + '.' + a.slice(1) + on(n))
          : o > 1 && (a = a.charAt(0) + '.' + a.slice(1)),
        (a = a + (i < 0 ? 'e' : 'e+') + i))
      : i < 0
        ? ((a = '0.' + on(-i - 1) + a), r && (n = r - o) > 0 && (a += on(n)))
        : i >= o
          ? ((a += on(i + 1 - o)), r && (n = r - i - 1) > 0 && (a = a + '.' + on(n)))
          : ((n = i + 1) < o && (a = a.slice(0, n) + '.' + a.slice(n)),
            r && (n = r - o) > 0 && (i + 1 === o && (a += '.'), (a += on(n)))),
    e.s < 0 ? '-' + a : a
  );
}
function Eg(e, t) {
  if (e.length > t) return ((e.length = t), !0);
}
function L0(e) {
  var t, r, n;
  function i(a) {
    var o = this;
    if (!(o instanceof i)) return new i(a);
    if (((o.constructor = i), a instanceof i)) {
      ((o.s = a.s), (o.e = a.e), (o.d = (a = a.d) ? a.slice() : a));
      return;
    }
    if (typeof a == 'number') {
      if (a * 0 !== 0) throw Error(Ln + a);
      if (a > 0) o.s = 1;
      else if (a < 0) ((a = -a), (o.s = -1));
      else {
        ((o.s = 0), (o.e = 0), (o.d = [0]));
        return;
      }
      if (a === ~~a && a < 1e7) {
        ((o.e = 0), (o.d = [a]));
        return;
      }
      return _g(o, a.toString());
    } else if (typeof a != 'string') throw Error(Ln + a);
    if ((a.charCodeAt(0) === 45 ? ((a = a.slice(1)), (o.s = -1)) : (o.s = 1), YM.test(a))) _g(o, a);
    else throw Error(Ln + a);
  }
  if (
    ((i.prototype = Z),
    (i.ROUND_UP = 0),
    (i.ROUND_DOWN = 1),
    (i.ROUND_CEIL = 2),
    (i.ROUND_FLOOR = 3),
    (i.ROUND_HALF_UP = 4),
    (i.ROUND_HALF_DOWN = 5),
    (i.ROUND_HALF_EVEN = 6),
    (i.ROUND_HALF_CEIL = 7),
    (i.ROUND_HALF_FLOOR = 8),
    (i.clone = L0),
    (i.config = i.set = XM),
    e === void 0 && (e = {}),
    e)
  )
    for (n = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'], t = 0; t < n.length; )
      e.hasOwnProperty((r = n[t++])) || (e[r] = this[r]);
  return (i.config(e), i);
}
function XM(e) {
  if (!e || typeof e != 'object') throw Error(er + 'Object expected');
  var t,
    r,
    n,
    i = ['precision', 1, Ii, 'rounding', 0, 8, 'toExpNeg', -1 / 0, 0, 'toExpPos', 0, 1 / 0];
  for (t = 0; t < i.length; t += 3)
    if ((n = e[(r = i[t])]) !== void 0)
      if (Ti(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(Ln + r + ': ' + n);
  if ((n = e[(r = 'LN10')]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(Ln + r + ': ' + n);
  return this;
}
var fh = L0(GM);
Rt = new fh(1);
const ge = fh;
function $0(e) {
  var t;
  return (e === 0 ? (t = 1) : (t = Math.floor(new ge(e).abs().log(10).toNumber()) + 1), t);
}
function F0(e, t, r) {
  for (var n = new ge(e), i = 0, a = []; n.lt(t) && i < 1e5; ) (a.push(n.toNumber()), (n = n.add(r)), i++);
  return a;
}
var B0 = (e) => {
    var [t, r] = e,
      [n, i] = [t, r];
    return (t > r && ([n, i] = [r, t]), [n, i]);
  },
  dh = (e, t, r) => {
    if (e.lte(0)) return new ge(0);
    var n = $0(e.toNumber()),
      i = new ge(10).pow(n),
      a = e.div(i),
      o = n !== 1 ? 0.05 : 0.1,
      s = new ge(Math.ceil(a.div(o).toNumber())).add(r).mul(o),
      l = s.mul(i);
    return t ? new ge(l.toNumber()) : new ge(Math.ceil(l.toNumber()));
  },
  U0 = (e, t, r) => {
    var n;
    if (e.lte(0)) return new ge(0);
    var i = [1, 2, 2.5, 5],
      a = e.toNumber(),
      o = Math.floor(new ge(a).abs().log(10).toNumber()),
      s = new ge(10).pow(o),
      l = e.div(s).toNumber(),
      c = i.findIndex((m) => m >= l - 1e-10);
    if ((c === -1 && ((s = s.mul(10)), (c = 0)), (c += r), c >= i.length)) {
      var u = Math.floor(c / i.length);
      ((c %= i.length), (s = s.mul(new ge(10).pow(u))));
    }
    var f = (n = i[c]) !== null && n !== void 0 ? n : 1,
      h = new ge(f).mul(s);
    return t ? h : new ge(Math.ceil(h.toNumber()));
  },
  ZM = (e, t, r) => {
    var n = new ge(1),
      i = new ge(e);
    if (!i.isint() && r) {
      var a = Math.abs(e);
      a < 1
        ? ((n = new ge(10).pow($0(e) - 1)), (i = new ge(Math.floor(i.div(n).toNumber())).mul(n)))
        : a > 1 && (i = new ge(Math.floor(e)));
    } else e === 0 ? (i = new ge(Math.floor((t - 1) / 2))) : r || (i = new ge(Math.floor(e)));
    for (var o = Math.floor((t - 1) / 2), s = [], l = 0; l < t; l++) s.push(i.add(new ge(l - o).mul(n)).toNumber());
    return s;
  },
  z0 = function (t, r, n, i) {
    var a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0,
      o = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : dh;
    if (!Number.isFinite((r - t) / (n - 1))) return { step: new ge(0), tickMin: new ge(0), tickMax: new ge(0) };
    var s = o(new ge(r).sub(t).div(n - 1), i, a),
      l;
    t <= 0 && r >= 0 ? (l = new ge(0)) : ((l = new ge(t).add(r).div(2)), (l = l.sub(new ge(l).mod(s))));
    var c = Math.ceil(l.sub(t).div(s).toNumber()),
      u = Math.ceil(new ge(r).sub(l).div(s).toNumber()),
      f = c + u + 1;
    return f > n
      ? z0(t, r, n, i, a + 1, o)
      : (f < n && ((u = r > 0 ? u + (n - f) : u), (c = r > 0 ? c : c + (n - f))),
        { step: s, tickMin: l.sub(new ge(c).mul(s)), tickMax: l.add(new ge(u).mul(s)) });
  },
  kg = function (t) {
    var [r, n] = t,
      i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6,
      a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
      o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'auto',
      s = Math.max(i, 2),
      [l, c] = B0([r, n]);
    if (l === -1 / 0 || c === 1 / 0) {
      var u = c === 1 / 0 ? [l, ...Array(i - 1).fill(1 / 0)] : [...Array(i - 1).fill(-1 / 0), c];
      return r > n ? u.reverse() : u;
    }
    if (l === c) return ZM(l, i, a);
    var f = o === 'snap125' ? U0 : dh,
      { step: h, tickMin: m, tickMax: p } = z0(l, c, s, a, 0, f),
      v = F0(m, p.add(new ge(0.1).mul(h)), h);
    return r > n ? v.reverse() : v;
  },
  jg = function (t, r) {
    var [n, i] = t,
      a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
      o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'auto',
      [s, l] = B0([n, i]);
    if (s === -1 / 0 || l === 1 / 0) return [n, i];
    if (s === l) return [s];
    var c = o === 'snap125' ? U0 : dh,
      u = Math.max(r, 2),
      f = c(new ge(l).sub(s).div(u - 1), a, 0),
      h = [...F0(new ge(s), new ge(l), f), l];
    return (a === !1 && (h = h.map((m) => Math.round(m))), n > i ? h.reverse() : h);
  },
  K0 = (e) => e.rootProps.maxBarSize,
  JM = (e) => e.rootProps.barGap,
  W0 = (e) => e.rootProps.barCategoryGap,
  QM = (e) => e.rootProps.barSize,
  Bl = (e) => e.rootProps.stackOffset,
  H0 = (e) => e.rootProps.reverseStackOrder,
  hh = (e) => e.options.chartName,
  mh = (e) => e.rootProps.syncId,
  q0 = (e) => e.rootProps.syncMethod,
  ph = (e) => e.options.eventEmitter,
  eD = (e) => e.rootProps.baseValue,
  at = {
    grid: -100,
    barBackground: -50,
    area: 100,
    cursorRectangle: 200,
    bar: 300,
    line: 400,
    axis: 500,
    scatter: 600,
    activeBar: 1e3,
    cursorLine: 1100,
    activeDot: 1200,
    label: 2e3,
  },
  Cn = {
    allowDecimals: !1,
    allowDataOverflow: !1,
    angleAxisId: 0,
    reversed: !1,
    scale: 'auto',
    tick: !0,
    type: 'auto',
  },
  vr = {
    allowDataOverflow: !1,
    allowDecimals: !1,
    allowDuplicatedCategory: !0,
    includeHidden: !1,
    radiusAxisId: 0,
    reversed: !1,
    scale: 'auto',
    tick: !0,
    tickCount: 5,
    type: 'auto',
  },
  Ul = (e, t) => {
    if (!(!e || !t)) return e != null && e.reversed ? [t[1], t[0]] : t;
  };
function zl(e, t, r) {
  if (r !== 'auto') return r;
  if (e != null) return Cr(e, t) ? 'category' : 'number';
}
function Ng(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Fs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ng(Object(r), !0).forEach(function (n) {
          tD(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ng(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function tD(e, t, r) {
  return (
    (t = rD(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function rD(e) {
  var t = nD(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function nD(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var Ig = {
    allowDataOverflow: Cn.allowDataOverflow,
    allowDecimals: Cn.allowDecimals,
    allowDuplicatedCategory: !1,
    dataKey: void 0,
    domain: void 0,
    id: Cn.angleAxisId,
    includeHidden: !1,
    name: void 0,
    reversed: Cn.reversed,
    scale: Cn.scale,
    tick: Cn.tick,
    tickCount: void 0,
    ticks: void 0,
    type: Cn.type,
    unit: void 0,
    niceTicks: 'auto',
  },
  Tg = {
    allowDataOverflow: vr.allowDataOverflow,
    allowDecimals: vr.allowDecimals,
    allowDuplicatedCategory: vr.allowDuplicatedCategory,
    dataKey: void 0,
    domain: void 0,
    id: vr.radiusAxisId,
    includeHidden: vr.includeHidden,
    name: void 0,
    reversed: vr.reversed,
    scale: vr.scale,
    tick: vr.tick,
    tickCount: vr.tickCount,
    ticks: void 0,
    type: vr.type,
    unit: void 0,
    niceTicks: 'auto',
  },
  iD = (e, t) => {
    if (t != null) return e.polarAxis.angleAxis[t];
  },
  vh = I([iD, u0], (e, t) => {
    var r;
    if (e != null) return e;
    var n = (r = zl(t, 'angleAxis', Ig.type)) !== null && r !== void 0 ? r : 'category';
    return Fs(Fs({}, Ig), {}, { type: n });
  }),
  aD = (e, t) => e.polarAxis.radiusAxis[t],
  gh = I([aD, u0], (e, t) => {
    var r;
    if (e != null) return e;
    var n = (r = zl(t, 'radiusAxis', Tg.type)) !== null && r !== void 0 ? r : 'category';
    return Fs(Fs({}, Tg), {}, { type: n });
  }),
  Kl = (e) => e.polarOptions,
  yh = I([Vr, Gr, ot], IM),
  V0 = I([Kl, yh], (e, t) => {
    if (e != null) return lr(e.innerRadius, t, 0);
  }),
  G0 = I([Kl, yh], (e, t) => {
    if (e != null) return lr(e.outerRadius, t, t * 0.8);
  }),
  oD = (e) => {
    if (e == null) return [0, 0];
    var { startAngle: t, endAngle: r } = e;
    return [t, r];
  },
  Y0 = I([Kl], oD);
I([vh, Y0], Ul);
var X0 = I([yh, V0, G0], (e, t, r) => {
  if (!(e == null || t == null || r == null)) return [t, r];
});
I([gh, X0], Ul);
var Z0 = I([Ce, Kl, V0, G0, Vr, Gr], (e, t, r, n, i, a) => {
    if (!((e !== 'centric' && e !== 'radial') || t == null || r == null || n == null)) {
      var { cx: o, cy: s, startAngle: l, endAngle: c } = t;
      return {
        cx: lr(o, i, i / 2),
        cy: lr(s, a, a / 2),
        innerRadius: r,
        outerRadius: n,
        startAngle: l,
        endAngle: c,
        clockWise: !1,
      };
    }
  }),
  st = (e, t) => t,
  Wl = (e, t, r) => r;
function Hl(e) {
  return e?.id;
}
function J0(e, t, r) {
  var { chartData: n = [] } = t,
    { allowDuplicatedCategory: i, dataKey: a } = r,
    o = new Map();
  return (
    e.forEach((s) => {
      var l,
        c = (l = s.data) !== null && l !== void 0 ? l : n;
      if (!(c == null || c.length === 0)) {
        var u = Hl(s);
        c.forEach((f, h) => {
          var m = a == null || i ? h : String(Ye(f, a, null)),
            p = Ye(f, s.dataKey, 0),
            v;
          (o.has(m) ? (v = o.get(m)) : (v = {}), Object.assign(v, { [u]: p }), o.set(m, v));
        });
      }
    }),
    Array.from(o.values())
  );
}
function ql(e) {
  return 'stackId' in e && e.stackId != null && e.dataKey != null;
}
var Vl = (e, t) => (e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1]);
function Gl(e, t) {
  return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function sD(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++) if (e[r] !== t[r]) return !1;
    return !0;
  }
  return !1;
}
var lt = (e) => {
    var t = Ce(e);
    return t === 'horizontal' ? 'xAxis' : t === 'vertical' ? 'yAxis' : t === 'centric' ? 'angleAxis' : 'radiusAxis';
  },
  Mi = (e) => e.tooltip.settings.axisId;
function bh(e) {
  if (e != null) {
    var t = e.ticks,
      r = e.bandwidth,
      n = e.range(),
      i = [Math.min(...n), Math.max(...n)];
    return {
      domain: () => e.domain(),
      range: (function (a) {
        function o() {
          return a.apply(this, arguments);
        }
        return (
          (o.toString = function () {
            return a.toString();
          }),
          o
        );
      })(() => i),
      rangeMin: () => i[0],
      rangeMax: () => i[1],
      isInRange(a) {
        var o = i[0],
          s = i[1];
        return o <= s ? a >= o && a <= s : a >= s && a <= o;
      },
      bandwidth: r ? () => r.call(e) : void 0,
      ticks: t ? (a) => t.call(e, a) : void 0,
      map: (a, o) => {
        var s = e(a);
        if (s != null) {
          if (e.bandwidth && o !== null && o !== void 0 && o.position) {
            var l = e.bandwidth();
            switch (o.position) {
              case 'middle':
                s += l / 2;
                break;
              case 'end':
                s += l;
                break;
            }
          }
          return s;
        }
      },
    };
  }
}
var lD = (e, t) => {
  if (t != null)
    switch (e) {
      case 'linear': {
        if (!wr(t)) {
          for (var r, n, i = 0; i < t.length; i++) {
            var a = t[i];
            he(a) && ((r === void 0 || a < r) && (r = a), (n === void 0 || a > n) && (n = a));
          }
          return r !== void 0 && n !== void 0 ? [r, n] : void 0;
        }
        return t;
      }
      default:
        return t;
    }
};
function pn(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function cD(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function wh(e) {
  let t, r, n;
  e.length !== 2
    ? ((t = pn), (r = (s, l) => pn(e(s), l)), (n = (s, l) => e(s) - l))
    : ((t = e === pn || e === cD ? e : uD), (r = e), (n = e));
  function i(s, l, c = 0, u = s.length) {
    if (c < u) {
      if (t(l, l) !== 0) return u;
      do {
        const f = (c + u) >>> 1;
        r(s[f], l) < 0 ? (c = f + 1) : (u = f);
      } while (c < u);
    }
    return c;
  }
  function a(s, l, c = 0, u = s.length) {
    if (c < u) {
      if (t(l, l) !== 0) return u;
      do {
        const f = (c + u) >>> 1;
        r(s[f], l) <= 0 ? (c = f + 1) : (u = f);
      } while (c < u);
    }
    return c;
  }
  function o(s, l, c = 0, u = s.length) {
    const f = i(s, l, c, u - 1);
    return f > c && n(s[f - 1], l) > -n(s[f], l) ? f - 1 : f;
  }
  return { left: i, center: o, right: a };
}
function uD() {
  return 0;
}
function Q0(e) {
  return e === null ? NaN : +e;
}
function* fD(e, t) {
  for (let r of e) r != null && (r = +r) >= r && (yield r);
}
const dD = wh(pn),
  Ja = dD.right;
wh(Q0).center;
class Mg extends Map {
  constructor(t, r = pD) {
    if ((super(), Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: r } }), t != null))
      for (const [n, i] of t) this.set(n, i);
  }
  get(t) {
    return super.get(Dg(this, t));
  }
  has(t) {
    return super.has(Dg(this, t));
  }
  set(t, r) {
    return super.set(hD(this, t), r);
  }
  delete(t) {
    return super.delete(mD(this, t));
  }
}
function Dg({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function hD({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function mD({ _intern: e, _key: t }, r) {
  const n = t(r);
  return (e.has(n) && ((r = e.get(n)), e.delete(n)), r);
}
function pD(e) {
  return e !== null && typeof e == 'object' ? e.valueOf() : e;
}
function vD(e = pn) {
  if (e === pn) return eS;
  if (typeof e != 'function') throw new TypeError('compare is not a function');
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function eS(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const gD = Math.sqrt(50),
  yD = Math.sqrt(10),
  bD = Math.sqrt(2);
function Bs(e, t, r) {
  const n = (t - e) / Math.max(0, r),
    i = Math.floor(Math.log10(n)),
    a = n / Math.pow(10, i),
    o = a >= gD ? 10 : a >= yD ? 5 : a >= bD ? 2 : 1;
  let s, l, c;
  return (
    i < 0
      ? ((c = Math.pow(10, -i) / o),
        (s = Math.round(e * c)),
        (l = Math.round(t * c)),
        s / c < e && ++s,
        l / c > t && --l,
        (c = -c))
      : ((c = Math.pow(10, i) * o),
        (s = Math.round(e / c)),
        (l = Math.round(t / c)),
        s * c < e && ++s,
        l * c > t && --l),
    l < s && 0.5 <= r && r < 2 ? Bs(e, t, r * 2) : [s, l, c]
  );
}
function ad(e, t, r) {
  if (((t = +t), (e = +e), (r = +r), !(r > 0))) return [];
  if (e === t) return [e];
  const n = t < e,
    [i, a, o] = n ? Bs(t, e, r) : Bs(e, t, r);
  if (!(a >= i)) return [];
  const s = a - i + 1,
    l = new Array(s);
  if (n)
    if (o < 0) for (let c = 0; c < s; ++c) l[c] = (a - c) / -o;
    else for (let c = 0; c < s; ++c) l[c] = (a - c) * o;
  else if (o < 0) for (let c = 0; c < s; ++c) l[c] = (i + c) / -o;
  else for (let c = 0; c < s; ++c) l[c] = (i + c) * o;
  return l;
}
function od(e, t, r) {
  return ((t = +t), (e = +e), (r = +r), Bs(e, t, r)[2]);
}
function sd(e, t, r) {
  ((t = +t), (e = +e), (r = +r));
  const n = t < e,
    i = n ? od(t, e, r) : od(e, t, r);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function Rg(e, t) {
  let r;
  for (const n of e) n != null && (r < n || (r === void 0 && n >= n)) && (r = n);
  return r;
}
function Lg(e, t) {
  let r;
  for (const n of e) n != null && (r > n || (r === void 0 && n >= n)) && (r = n);
  return r;
}
function tS(e, t, r = 0, n = 1 / 0, i) {
  if (
    ((t = Math.floor(t)),
    (r = Math.floor(Math.max(0, r))),
    (n = Math.floor(Math.min(e.length - 1, n))),
    !(r <= t && t <= n))
  )
    return e;
  for (i = i === void 0 ? eS : vD(i); n > r; ) {
    if (n - r > 600) {
      const l = n - r + 1,
        c = t - r + 1,
        u = Math.log(l),
        f = 0.5 * Math.exp((2 * u) / 3),
        h = 0.5 * Math.sqrt((u * f * (l - f)) / l) * (c - l / 2 < 0 ? -1 : 1),
        m = Math.max(r, Math.floor(t - (c * f) / l + h)),
        p = Math.min(n, Math.floor(t + ((l - c) * f) / l + h));
      tS(e, t, m, p, i);
    }
    const a = e[t];
    let o = r,
      s = n;
    for (sa(e, r, t), i(e[n], a) > 0 && sa(e, r, n); o < s; ) {
      for (sa(e, o, s), ++o, --s; i(e[o], a) < 0; ) ++o;
      for (; i(e[s], a) > 0; ) --s;
    }
    (i(e[r], a) === 0 ? sa(e, r, s) : (++s, sa(e, s, n)), s <= t && (r = s + 1), t <= s && (n = s - 1));
  }
  return e;
}
function sa(e, t, r) {
  const n = e[t];
  ((e[t] = e[r]), (e[r] = n));
}
function wD(e, t, r) {
  if (((e = Float64Array.from(fD(e))), !(!(n = e.length) || isNaN((t = +t))))) {
    if (t <= 0 || n < 2) return Lg(e);
    if (t >= 1) return Rg(e);
    var n,
      i = (n - 1) * t,
      a = Math.floor(i),
      o = Rg(tS(e, a).subarray(0, a + 1)),
      s = Lg(e.subarray(a + 1));
    return o + (s - o) * (i - a);
  }
}
function xD(e, t, r = Q0) {
  if (!(!(n = e.length) || isNaN((t = +t)))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n,
      i = (n - 1) * t,
      a = Math.floor(i),
      o = +r(e[a], a, e),
      s = +r(e[a + 1], a + 1, e);
    return o + (s - o) * (i - a);
  }
}
function SD(e, t, r) {
  ((e = +e), (t = +t), (r = (i = arguments.length) < 2 ? ((t = e), (e = 0), 1) : i < 3 ? 1 : +r));
  for (var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, a = new Array(i); ++n < i; ) a[n] = e + n * r;
  return a;
}
function tr(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function Xr(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == 'function' ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      (this.domain(e), typeof t == 'function' ? this.interpolator(t) : this.range(t));
      break;
    }
  }
  return this;
}
const ld = Symbol('implicit');
function xh() {
  var e = new Mg(),
    t = [],
    r = [],
    n = ld;
  function i(a) {
    let o = e.get(a);
    if (o === void 0) {
      if (n !== ld) return n;
      e.set(a, (o = t.push(a) - 1));
    }
    return r[o % r.length];
  }
  return (
    (i.domain = function (a) {
      if (!arguments.length) return t.slice();
      ((t = []), (e = new Mg()));
      for (const o of a) e.has(o) || e.set(o, t.push(o) - 1);
      return i;
    }),
    (i.range = function (a) {
      return arguments.length ? ((r = Array.from(a)), i) : r.slice();
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((n = a), i) : n;
    }),
    (i.copy = function () {
      return xh(t, r).unknown(n);
    }),
    tr.apply(i, arguments),
    i
  );
}
function Sh() {
  var e = xh().unknown(void 0),
    t = e.domain,
    r = e.range,
    n = 0,
    i = 1,
    a,
    o,
    s = !1,
    l = 0,
    c = 0,
    u = 0.5;
  delete e.unknown;
  function f() {
    var h = t().length,
      m = i < n,
      p = m ? i : n,
      v = m ? n : i;
    ((a = (v - p) / Math.max(1, h - l + c * 2)),
      s && (a = Math.floor(a)),
      (p += (v - p - a * (h - l)) * u),
      (o = a * (1 - l)),
      s && ((p = Math.round(p)), (o = Math.round(o))));
    var g = SD(h).map(function (b) {
      return p + a * b;
    });
    return r(m ? g.reverse() : g);
  }
  return (
    (e.domain = function (h) {
      return arguments.length ? (t(h), f()) : t();
    }),
    (e.range = function (h) {
      return arguments.length ? (([n, i] = h), (n = +n), (i = +i), f()) : [n, i];
    }),
    (e.rangeRound = function (h) {
      return (([n, i] = h), (n = +n), (i = +i), (s = !0), f());
    }),
    (e.bandwidth = function () {
      return o;
    }),
    (e.step = function () {
      return a;
    }),
    (e.round = function (h) {
      return arguments.length ? ((s = !!h), f()) : s;
    }),
    (e.padding = function (h) {
      return arguments.length ? ((l = Math.min(1, (c = +h))), f()) : l;
    }),
    (e.paddingInner = function (h) {
      return arguments.length ? ((l = Math.min(1, h)), f()) : l;
    }),
    (e.paddingOuter = function (h) {
      return arguments.length ? ((c = +h), f()) : c;
    }),
    (e.align = function (h) {
      return arguments.length ? ((u = Math.max(0, Math.min(1, h))), f()) : u;
    }),
    (e.copy = function () {
      return Sh(t(), [n, i]).round(s).paddingInner(l).paddingOuter(c).align(u);
    }),
    tr.apply(f(), arguments)
  );
}
function rS(e) {
  var t = e.copy;
  return (
    (e.padding = e.paddingOuter),
    delete e.paddingInner,
    delete e.paddingOuter,
    (e.copy = function () {
      return rS(t());
    }),
    e
  );
}
function AD() {
  return rS(Sh.apply(null, arguments).paddingInner(1));
}
function Ah(e, t, r) {
  ((e.prototype = t.prototype = r), (r.constructor = e));
}
function nS(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function Qa() {}
var Da = 0.7,
  Us = 1 / Da,
  bi = '\\s*([+-]?\\d+)\\s*',
  Ra = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  xr = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  PD = /^#([0-9a-f]{3,8})$/,
  CD = new RegExp(`^rgb\\(${bi},${bi},${bi}\\)$`),
  OD = new RegExp(`^rgb\\(${xr},${xr},${xr}\\)$`),
  _D = new RegExp(`^rgba\\(${bi},${bi},${bi},${Ra}\\)$`),
  ED = new RegExp(`^rgba\\(${xr},${xr},${xr},${Ra}\\)$`),
  kD = new RegExp(`^hsl\\(${Ra},${xr},${xr}\\)$`),
  jD = new RegExp(`^hsla\\(${Ra},${xr},${xr},${Ra}\\)$`),
  $g = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
Ah(Qa, La, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Fg,
  formatHex: Fg,
  formatHex8: ND,
  formatHsl: ID,
  formatRgb: Bg,
  toString: Bg,
});
function Fg() {
  return this.rgb().formatHex();
}
function ND() {
  return this.rgb().formatHex8();
}
function ID() {
  return iS(this).formatHsl();
}
function Bg() {
  return this.rgb().formatRgb();
}
function La(e) {
  var t, r;
  return (
    (e = (e + '').trim().toLowerCase()),
    (t = PD.exec(e))
      ? ((r = t[1].length),
        (t = parseInt(t[1], 16)),
        r === 6
          ? Ug(t)
          : r === 3
            ? new Tt(((t >> 8) & 15) | ((t >> 4) & 240), ((t >> 4) & 15) | (t & 240), ((t & 15) << 4) | (t & 15), 1)
            : r === 8
              ? Ho((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, (t & 255) / 255)
              : r === 4
                ? Ho(
                    ((t >> 12) & 15) | ((t >> 8) & 240),
                    ((t >> 8) & 15) | ((t >> 4) & 240),
                    ((t >> 4) & 15) | (t & 240),
                    (((t & 15) << 4) | (t & 15)) / 255,
                  )
                : null)
      : (t = CD.exec(e))
        ? new Tt(t[1], t[2], t[3], 1)
        : (t = OD.exec(e))
          ? new Tt((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, 1)
          : (t = _D.exec(e))
            ? Ho(t[1], t[2], t[3], t[4])
            : (t = ED.exec(e))
              ? Ho((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, t[4])
              : (t = kD.exec(e))
                ? Wg(t[1], t[2] / 100, t[3] / 100, 1)
                : (t = jD.exec(e))
                  ? Wg(t[1], t[2] / 100, t[3] / 100, t[4])
                  : $g.hasOwnProperty(e)
                    ? Ug($g[e])
                    : e === 'transparent'
                      ? new Tt(NaN, NaN, NaN, 0)
                      : null
  );
}
function Ug(e) {
  return new Tt((e >> 16) & 255, (e >> 8) & 255, e & 255, 1);
}
function Ho(e, t, r, n) {
  return (n <= 0 && (e = t = r = NaN), new Tt(e, t, r, n));
}
function TD(e) {
  return (e instanceof Qa || (e = La(e)), e ? ((e = e.rgb()), new Tt(e.r, e.g, e.b, e.opacity)) : new Tt());
}
function cd(e, t, r, n) {
  return arguments.length === 1 ? TD(e) : new Tt(e, t, r, n ?? 1);
}
function Tt(e, t, r, n) {
  ((this.r = +e), (this.g = +t), (this.b = +r), (this.opacity = +n));
}
Ah(
  Tt,
  cd,
  nS(Qa, {
    brighter(e) {
      return ((e = e == null ? Us : Math.pow(Us, e)), new Tt(this.r * e, this.g * e, this.b * e, this.opacity));
    },
    darker(e) {
      return ((e = e == null ? Da : Math.pow(Da, e)), new Tt(this.r * e, this.g * e, this.b * e, this.opacity));
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Tt($n(this.r), $n(this.g), $n(this.b), zs(this.opacity));
    },
    displayable() {
      return (
        -0.5 <= this.r &&
        this.r < 255.5 &&
        -0.5 <= this.g &&
        this.g < 255.5 &&
        -0.5 <= this.b &&
        this.b < 255.5 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    hex: zg,
    formatHex: zg,
    formatHex8: MD,
    formatRgb: Kg,
    toString: Kg,
  }),
);
function zg() {
  return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}`;
}
function MD() {
  return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}${Tn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Kg() {
  const e = zs(this.opacity);
  return `${e === 1 ? 'rgb(' : 'rgba('}${$n(this.r)}, ${$n(this.g)}, ${$n(this.b)}${e === 1 ? ')' : `, ${e})`}`;
}
function zs(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function $n(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Tn(e) {
  return ((e = $n(e)), (e < 16 ? '0' : '') + e.toString(16));
}
function Wg(e, t, r, n) {
  return (n <= 0 ? (e = t = r = NaN) : r <= 0 || r >= 1 ? (e = t = NaN) : t <= 0 && (e = NaN), new or(e, t, r, n));
}
function iS(e) {
  if (e instanceof or) return new or(e.h, e.s, e.l, e.opacity);
  if ((e instanceof Qa || (e = La(e)), !e)) return new or();
  if (e instanceof or) return e;
  e = e.rgb();
  var t = e.r / 255,
    r = e.g / 255,
    n = e.b / 255,
    i = Math.min(t, r, n),
    a = Math.max(t, r, n),
    o = NaN,
    s = a - i,
    l = (a + i) / 2;
  return (
    s
      ? (t === a ? (o = (r - n) / s + (r < n) * 6) : r === a ? (o = (n - t) / s + 2) : (o = (t - r) / s + 4),
        (s /= l < 0.5 ? a + i : 2 - a - i),
        (o *= 60))
      : (s = l > 0 && l < 1 ? 0 : o),
    new or(o, s, l, e.opacity)
  );
}
function DD(e, t, r, n) {
  return arguments.length === 1 ? iS(e) : new or(e, t, r, n ?? 1);
}
function or(e, t, r, n) {
  ((this.h = +e), (this.s = +t), (this.l = +r), (this.opacity = +n));
}
Ah(
  or,
  DD,
  nS(Qa, {
    brighter(e) {
      return ((e = e == null ? Us : Math.pow(Us, e)), new or(this.h, this.s, this.l * e, this.opacity));
    },
    darker(e) {
      return ((e = e == null ? Da : Math.pow(Da, e)), new or(this.h, this.s, this.l * e, this.opacity));
    },
    rgb() {
      var e = (this.h % 360) + (this.h < 0) * 360,
        t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        r = this.l,
        n = r + (r < 0.5 ? r : 1 - r) * t,
        i = 2 * r - n;
      return new Tt(
        tf(e >= 240 ? e - 240 : e + 120, i, n),
        tf(e, i, n),
        tf(e < 120 ? e + 240 : e - 120, i, n),
        this.opacity,
      );
    },
    clamp() {
      return new or(Hg(this.h), qo(this.s), qo(this.l), zs(this.opacity));
    },
    displayable() {
      return (
        ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
        0 <= this.l &&
        this.l <= 1 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    formatHsl() {
      const e = zs(this.opacity);
      return `${e === 1 ? 'hsl(' : 'hsla('}${Hg(this.h)}, ${qo(this.s) * 100}%, ${qo(this.l) * 100}%${e === 1 ? ')' : `, ${e})`}`;
    },
  }),
);
function Hg(e) {
  return ((e = (e || 0) % 360), e < 0 ? e + 360 : e);
}
function qo(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function tf(e, t, r) {
  return (e < 60 ? t + ((r - t) * e) / 60 : e < 180 ? r : e < 240 ? t + ((r - t) * (240 - e)) / 60 : t) * 255;
}
const Ph = (e) => () => e;
function RD(e, t) {
  return function (r) {
    return e + r * t;
  };
}
function LD(e, t, r) {
  return (
    (e = Math.pow(e, r)),
    (t = Math.pow(t, r) - e),
    (r = 1 / r),
    function (n) {
      return Math.pow(e + n * t, r);
    }
  );
}
function $D(e) {
  return (e = +e) == 1
    ? aS
    : function (t, r) {
        return r - t ? LD(t, r, e) : Ph(isNaN(t) ? r : t);
      };
}
function aS(e, t) {
  var r = t - e;
  return r ? RD(e, r) : Ph(isNaN(e) ? t : e);
}
const qg = (function e(t) {
  var r = $D(t);
  function n(i, a) {
    var o = r((i = cd(i)).r, (a = cd(a)).r),
      s = r(i.g, a.g),
      l = r(i.b, a.b),
      c = aS(i.opacity, a.opacity);
    return function (u) {
      return ((i.r = o(u)), (i.g = s(u)), (i.b = l(u)), (i.opacity = c(u)), i + '');
    };
  }
  return ((n.gamma = e), n);
})(1);
function FD(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0,
    n = t.slice(),
    i;
  return function (a) {
    for (i = 0; i < r; ++i) n[i] = e[i] * (1 - a) + t[i] * a;
    return n;
  };
}
function BD(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function UD(e, t) {
  var r = t ? t.length : 0,
    n = e ? Math.min(r, e.length) : 0,
    i = new Array(n),
    a = new Array(r),
    o;
  for (o = 0; o < n; ++o) i[o] = Di(e[o], t[o]);
  for (; o < r; ++o) a[o] = t[o];
  return function (s) {
    for (o = 0; o < n; ++o) a[o] = i[o](s);
    return a;
  };
}
function zD(e, t) {
  var r = new Date();
  return (
    (e = +e),
    (t = +t),
    function (n) {
      return (r.setTime(e * (1 - n) + t * n), r);
    }
  );
}
function Ks(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return e * (1 - r) + t * r;
    }
  );
}
function KD(e, t) {
  var r = {},
    n = {},
    i;
  ((e === null || typeof e != 'object') && (e = {}), (t === null || typeof t != 'object') && (t = {}));
  for (i in t) i in e ? (r[i] = Di(e[i], t[i])) : (n[i] = t[i]);
  return function (a) {
    for (i in r) n[i] = r[i](a);
    return n;
  };
}
var ud = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  rf = new RegExp(ud.source, 'g');
function WD(e) {
  return function () {
    return e;
  };
}
function HD(e) {
  return function (t) {
    return e(t) + '';
  };
}
function qD(e, t) {
  var r = (ud.lastIndex = rf.lastIndex = 0),
    n,
    i,
    a,
    o = -1,
    s = [],
    l = [];
  for (e = e + '', t = t + ''; (n = ud.exec(e)) && (i = rf.exec(t)); )
    ((a = i.index) > r && ((a = t.slice(r, a)), s[o] ? (s[o] += a) : (s[++o] = a)),
      (n = n[0]) === (i = i[0])
        ? s[o]
          ? (s[o] += i)
          : (s[++o] = i)
        : ((s[++o] = null), l.push({ i: o, x: Ks(n, i) })),
      (r = rf.lastIndex));
  return (
    r < t.length && ((a = t.slice(r)), s[o] ? (s[o] += a) : (s[++o] = a)),
    s.length < 2
      ? l[0]
        ? HD(l[0].x)
        : WD(t)
      : ((t = l.length),
        function (c) {
          for (var u = 0, f; u < t; ++u) s[(f = l[u]).i] = f.x(c);
          return s.join('');
        })
  );
}
function Di(e, t) {
  var r = typeof t,
    n;
  return t == null || r === 'boolean'
    ? Ph(t)
    : (r === 'number'
        ? Ks
        : r === 'string'
          ? (n = La(t))
            ? ((t = n), qg)
            : qD
          : t instanceof La
            ? qg
            : t instanceof Date
              ? zD
              : BD(t)
                ? FD
                : Array.isArray(t)
                  ? UD
                  : (typeof t.valueOf != 'function' && typeof t.toString != 'function') || isNaN(t)
                    ? KD
                    : Ks)(e, t);
}
function Ch(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return Math.round(e * (1 - r) + t * r);
    }
  );
}
function VD(e, t) {
  t === void 0 && ((t = e), (e = Di));
  for (var r = 0, n = t.length - 1, i = t[0], a = new Array(n < 0 ? 0 : n); r < n; ) a[r] = e(i, (i = t[++r]));
  return function (o) {
    var s = Math.max(0, Math.min(n - 1, Math.floor((o *= n))));
    return a[s](o - s);
  };
}
function GD(e) {
  return function () {
    return e;
  };
}
function Ws(e) {
  return +e;
}
var Vg = [0, 1];
function Pt(e) {
  return e;
}
function fd(e, t) {
  return (t -= e = +e)
    ? function (r) {
        return (r - e) / t;
      }
    : GD(isNaN(t) ? NaN : 0.5);
}
function YD(e, t) {
  var r;
  return (
    e > t && ((r = e), (e = t), (t = r)),
    function (n) {
      return Math.max(e, Math.min(t, n));
    }
  );
}
function XD(e, t, r) {
  var n = e[0],
    i = e[1],
    a = t[0],
    o = t[1];
  return (
    i < n ? ((n = fd(i, n)), (a = r(o, a))) : ((n = fd(n, i)), (a = r(a, o))),
    function (s) {
      return a(n(s));
    }
  );
}
function ZD(e, t, r) {
  var n = Math.min(e.length, t.length) - 1,
    i = new Array(n),
    a = new Array(n),
    o = -1;
  for (e[n] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse())); ++o < n; )
    ((i[o] = fd(e[o], e[o + 1])), (a[o] = r(t[o], t[o + 1])));
  return function (s) {
    var l = Ja(e, s, 1, n) - 1;
    return a[l](i[l](s));
  };
}
function eo(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Yl() {
  var e = Vg,
    t = Vg,
    r = Di,
    n,
    i,
    a,
    o = Pt,
    s,
    l,
    c;
  function u() {
    var h = Math.min(e.length, t.length);
    return (o !== Pt && (o = YD(e[0], e[h - 1])), (s = h > 2 ? ZD : XD), (l = c = null), f);
  }
  function f(h) {
    return h == null || isNaN((h = +h)) ? a : (l || (l = s(e.map(n), t, r)))(n(o(h)));
  }
  return (
    (f.invert = function (h) {
      return o(i((c || (c = s(t, e.map(n), Ks)))(h)));
    }),
    (f.domain = function (h) {
      return arguments.length ? ((e = Array.from(h, Ws)), u()) : e.slice();
    }),
    (f.range = function (h) {
      return arguments.length ? ((t = Array.from(h)), u()) : t.slice();
    }),
    (f.rangeRound = function (h) {
      return ((t = Array.from(h)), (r = Ch), u());
    }),
    (f.clamp = function (h) {
      return arguments.length ? ((o = h ? !0 : Pt), u()) : o !== Pt;
    }),
    (f.interpolate = function (h) {
      return arguments.length ? ((r = h), u()) : r;
    }),
    (f.unknown = function (h) {
      return arguments.length ? ((a = h), f) : a;
    }),
    function (h, m) {
      return ((n = h), (i = m), u());
    }
  );
}
function Oh() {
  return Yl()(Pt, Pt);
}
function JD(e) {
  return Math.abs((e = Math.round(e))) >= 1e21 ? e.toLocaleString('en').replace(/,/g, '') : e.toString(10);
}
function Hs(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf('e'),
    n = e.slice(0, r);
  return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)];
}
function Oi(e) {
  return ((e = Hs(Math.abs(e))), e ? e[1] : NaN);
}
function QD(e, t) {
  return function (r, n) {
    for (
      var i = r.length, a = [], o = 0, s = e[0], l = 0;
      i > 0 &&
      s > 0 &&
      (l + s + 1 > n && (s = Math.max(1, n - l)), a.push(r.substring((i -= s), i + s)), !((l += s + 1) > n));
    )
      s = e[(o = (o + 1) % e.length)];
    return a.reverse().join(t);
  };
}
function eR(e) {
  return function (t) {
    return t.replace(/[0-9]/g, function (r) {
      return e[+r];
    });
  };
}
var tR = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function $a(e) {
  if (!(t = tR.exec(e))) throw new Error('invalid format: ' + e);
  var t;
  return new _h({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
$a.prototype = _h.prototype;
function _h(e) {
  ((this.fill = e.fill === void 0 ? ' ' : e.fill + ''),
    (this.align = e.align === void 0 ? '>' : e.align + ''),
    (this.sign = e.sign === void 0 ? '-' : e.sign + ''),
    (this.symbol = e.symbol === void 0 ? '' : e.symbol + ''),
    (this.zero = !!e.zero),
    (this.width = e.width === void 0 ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = e.precision === void 0 ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = e.type === void 0 ? '' : e.type + ''));
}
_h.prototype.toString = function () {
  return (
    this.fill +
    this.align +
    this.sign +
    this.symbol +
    (this.zero ? '0' : '') +
    (this.width === void 0 ? '' : Math.max(1, this.width | 0)) +
    (this.comma ? ',' : '') +
    (this.precision === void 0 ? '' : '.' + Math.max(0, this.precision | 0)) +
    (this.trim ? '~' : '') +
    this.type
  );
};
function rR(e) {
  e: for (var t = e.length, r = 1, n = -1, i; r < t; ++r)
    switch (e[r]) {
      case '.':
        n = i = r;
        break;
      case '0':
        (n === 0 && (n = r), (i = r));
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e;
}
var qs;
function nR(e, t) {
  var r = Hs(e, t);
  if (!r) return ((qs = void 0), e.toPrecision(t));
  var n = r[0],
    i = r[1],
    a = i - (qs = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
    o = n.length;
  return a === o
    ? n
    : a > o
      ? n + new Array(a - o + 1).join('0')
      : a > 0
        ? n.slice(0, a) + '.' + n.slice(a)
        : '0.' + new Array(1 - a).join('0') + Hs(e, Math.max(0, t + a - 1))[0];
}
function Gg(e, t) {
  var r = Hs(e, t);
  if (!r) return e + '';
  var n = r[0],
    i = r[1];
  return i < 0
    ? '0.' + new Array(-i).join('0') + n
    : n.length > i + 1
      ? n.slice(0, i + 1) + '.' + n.slice(i + 1)
      : n + new Array(i - n.length + 2).join('0');
}
const Yg = {
  '%': (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + '',
  d: JD,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => Gg(e * 100, t),
  r: Gg,
  s: nR,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16),
};
function Xg(e) {
  return e;
}
var Zg = Array.prototype.map,
  Jg = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
function iR(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? Xg : QD(Zg.call(e.grouping, Number), e.thousands + ''),
    r = e.currency === void 0 ? '' : e.currency[0] + '',
    n = e.currency === void 0 ? '' : e.currency[1] + '',
    i = e.decimal === void 0 ? '.' : e.decimal + '',
    a = e.numerals === void 0 ? Xg : eR(Zg.call(e.numerals, String)),
    o = e.percent === void 0 ? '%' : e.percent + '',
    s = e.minus === void 0 ? '−' : e.minus + '',
    l = e.nan === void 0 ? 'NaN' : e.nan + '';
  function c(f, h) {
    f = $a(f);
    var m = f.fill,
      p = f.align,
      v = f.sign,
      g = f.symbol,
      b = f.zero,
      S = f.width,
      x = f.comma,
      A = f.precision,
      C = f.trim,
      P = f.type;
    (P === 'n' ? ((x = !0), (P = 'g')) : Yg[P] || (A === void 0 && (A = 12), (C = !0), (P = 'g')),
      (b || (m === '0' && p === '=')) && ((b = !0), (m = '0'), (p = '=')));
    var _ =
        (h && h.prefix !== void 0 ? h.prefix : '') +
        (g === '$' ? r : g === '#' && /[boxX]/.test(P) ? '0' + P.toLowerCase() : ''),
      E = (g === '$' ? n : /[%p]/.test(P) ? o : '') + (h && h.suffix !== void 0 ? h.suffix : ''),
      j = Yg[P],
      N = /[defgprs%]/.test(P);
    A = A === void 0 ? 6 : /[gprs]/.test(P) ? Math.max(1, Math.min(21, A)) : Math.max(0, Math.min(20, A));
    function M(O) {
      var D = _,
        B = E,
        Y,
        Q,
        se;
      if (P === 'c') ((B = j(O) + B), (O = ''));
      else {
        O = +O;
        var V = O < 0 || 1 / O < 0;
        if (
          ((O = isNaN(O) ? l : j(Math.abs(O), A)),
          C && (O = rR(O)),
          V && +O == 0 && v !== '+' && (V = !1),
          (D = (V ? (v === '(' ? v : s) : v === '-' || v === '(' ? '' : v) + D),
          (B = (P === 's' && !isNaN(O) && qs !== void 0 ? Jg[8 + qs / 3] : '') + B + (V && v === '(' ? ')' : '')),
          N)
        ) {
          for (Y = -1, Q = O.length; ++Y < Q; )
            if (((se = O.charCodeAt(Y)), 48 > se || se > 57)) {
              ((B = (se === 46 ? i + O.slice(Y + 1) : O.slice(Y)) + B), (O = O.slice(0, Y)));
              break;
            }
        }
      }
      x && !b && (O = t(O, 1 / 0));
      var T = D.length + O.length + B.length,
        F = T < S ? new Array(S - T + 1).join(m) : '';
      switch ((x && b && ((O = t(F + O, F.length ? S - B.length : 1 / 0)), (F = '')), p)) {
        case '<':
          O = D + O + B + F;
          break;
        case '=':
          O = D + F + O + B;
          break;
        case '^':
          O = F.slice(0, (T = F.length >> 1)) + D + O + B + F.slice(T);
          break;
        default:
          O = F + D + O + B;
          break;
      }
      return a(O);
    }
    return (
      (M.toString = function () {
        return f + '';
      }),
      M
    );
  }
  function u(f, h) {
    var m = Math.max(-8, Math.min(8, Math.floor(Oi(h) / 3))) * 3,
      p = Math.pow(10, -m),
      v = c(((f = $a(f)), (f.type = 'f'), f), { suffix: Jg[8 + m / 3] });
    return function (g) {
      return v(p * g);
    };
  }
  return { format: c, formatPrefix: u };
}
var Vo, Eh, oS;
aR({ thousands: ',', grouping: [3], currency: ['$', ''] });
function aR(e) {
  return ((Vo = iR(e)), (Eh = Vo.format), (oS = Vo.formatPrefix), Vo);
}
function oR(e) {
  return Math.max(0, -Oi(Math.abs(e)));
}
function sR(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Oi(t) / 3))) * 3 - Oi(Math.abs(e)));
}
function lR(e, t) {
  return ((e = Math.abs(e)), (t = Math.abs(t) - e), Math.max(0, Oi(t) - Oi(e)) + 1);
}
function sS(e, t, r, n) {
  var i = sd(e, t, r),
    a;
  switch (((n = $a(n ?? ',f')), n.type)) {
    case 's': {
      var o = Math.max(Math.abs(e), Math.abs(t));
      return (n.precision == null && !isNaN((a = sR(i, o))) && (n.precision = a), oS(n, o));
    }
    case '':
    case 'e':
    case 'g':
    case 'p':
    case 'r': {
      n.precision == null &&
        !isNaN((a = lR(i, Math.max(Math.abs(e), Math.abs(t))))) &&
        (n.precision = a - (n.type === 'e'));
      break;
    }
    case 'f':
    case '%': {
      n.precision == null && !isNaN((a = oR(i))) && (n.precision = a - (n.type === '%') * 2);
      break;
    }
  }
  return Eh(n);
}
function wn(e) {
  var t = e.domain;
  return (
    (e.ticks = function (r) {
      var n = t();
      return ad(n[0], n[n.length - 1], r ?? 10);
    }),
    (e.tickFormat = function (r, n) {
      var i = t();
      return sS(i[0], i[i.length - 1], r ?? 10, n);
    }),
    (e.nice = function (r) {
      r == null && (r = 10);
      var n = t(),
        i = 0,
        a = n.length - 1,
        o = n[i],
        s = n[a],
        l,
        c,
        u = 10;
      for (s < o && ((c = o), (o = s), (s = c), (c = i), (i = a), (a = c)); u-- > 0; ) {
        if (((c = od(o, s, r)), c === l)) return ((n[i] = o), (n[a] = s), t(n));
        if (c > 0) ((o = Math.floor(o / c) * c), (s = Math.ceil(s / c) * c));
        else if (c < 0) ((o = Math.ceil(o * c) / c), (s = Math.floor(s * c) / c));
        else break;
        l = c;
      }
      return e;
    }),
    e
  );
}
function lS() {
  var e = Oh();
  return (
    (e.copy = function () {
      return eo(e, lS());
    }),
    tr.apply(e, arguments),
    wn(e)
  );
}
function cS(e) {
  var t;
  function r(n) {
    return n == null || isNaN((n = +n)) ? t : n;
  }
  return (
    (r.invert = r),
    (r.domain = r.range =
      function (n) {
        return arguments.length ? ((e = Array.from(n, Ws)), r) : e.slice();
      }),
    (r.unknown = function (n) {
      return arguments.length ? ((t = n), r) : t;
    }),
    (r.copy = function () {
      return cS(e).unknown(t);
    }),
    (e = arguments.length ? Array.from(e, Ws) : [0, 1]),
    wn(r)
  );
}
function uS(e, t) {
  e = e.slice();
  var r = 0,
    n = e.length - 1,
    i = e[r],
    a = e[n],
    o;
  return (a < i && ((o = r), (r = n), (n = o), (o = i), (i = a), (a = o)), (e[r] = t.floor(i)), (e[n] = t.ceil(a)), e);
}
function Qg(e) {
  return Math.log(e);
}
function ey(e) {
  return Math.exp(e);
}
function cR(e) {
  return -Math.log(-e);
}
function uR(e) {
  return -Math.exp(-e);
}
function fR(e) {
  return isFinite(e) ? +('1e' + e) : e < 0 ? 0 : e;
}
function dR(e) {
  return e === 10 ? fR : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function hR(e) {
  return e === Math.E
    ? Math.log
    : (e === 10 && Math.log10) || (e === 2 && Math.log2) || ((e = Math.log(e)), (t) => Math.log(t) / e);
}
function ty(e) {
  return (t, r) => -e(-t, r);
}
function kh(e) {
  const t = e(Qg, ey),
    r = t.domain;
  let n = 10,
    i,
    a;
  function o() {
    return ((i = hR(n)), (a = dR(n)), r()[0] < 0 ? ((i = ty(i)), (a = ty(a)), e(cR, uR)) : e(Qg, ey), t);
  }
  return (
    (t.base = function (s) {
      return arguments.length ? ((n = +s), o()) : n;
    }),
    (t.domain = function (s) {
      return arguments.length ? (r(s), o()) : r();
    }),
    (t.ticks = (s) => {
      const l = r();
      let c = l[0],
        u = l[l.length - 1];
      const f = u < c;
      f && ([c, u] = [u, c]);
      let h = i(c),
        m = i(u),
        p,
        v;
      const g = s == null ? 10 : +s;
      let b = [];
      if (!(n % 1) && m - h < g) {
        if (((h = Math.floor(h)), (m = Math.ceil(m)), c > 0)) {
          for (; h <= m; ++h)
            for (p = 1; p < n; ++p)
              if (((v = h < 0 ? p / a(-h) : p * a(h)), !(v < c))) {
                if (v > u) break;
                b.push(v);
              }
        } else
          for (; h <= m; ++h)
            for (p = n - 1; p >= 1; --p)
              if (((v = h > 0 ? p / a(-h) : p * a(h)), !(v < c))) {
                if (v > u) break;
                b.push(v);
              }
        b.length * 2 < g && (b = ad(c, u, g));
      } else b = ad(h, m, Math.min(m - h, g)).map(a);
      return f ? b.reverse() : b;
    }),
    (t.tickFormat = (s, l) => {
      if (
        (s == null && (s = 10),
        l == null && (l = n === 10 ? 's' : ','),
        typeof l != 'function' && (!(n % 1) && (l = $a(l)).precision == null && (l.trim = !0), (l = Eh(l))),
        s === 1 / 0)
      )
        return l;
      const c = Math.max(1, (n * s) / t.ticks().length);
      return (u) => {
        let f = u / a(Math.round(i(u)));
        return (f * n < n - 0.5 && (f *= n), f <= c ? l(u) : '');
      };
    }),
    (t.nice = () => r(uS(r(), { floor: (s) => a(Math.floor(i(s))), ceil: (s) => a(Math.ceil(i(s))) }))),
    t
  );
}
function fS() {
  const e = kh(Yl()).domain([1, 10]);
  return ((e.copy = () => eo(e, fS()).base(e.base())), tr.apply(e, arguments), e);
}
function ry(e) {
  return function (t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function ny(e) {
  return function (t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function jh(e) {
  var t = 1,
    r = e(ry(t), ny(t));
  return (
    (r.constant = function (n) {
      return arguments.length ? e(ry((t = +n)), ny(t)) : t;
    }),
    wn(r)
  );
}
function dS() {
  var e = jh(Yl());
  return (
    (e.copy = function () {
      return eo(e, dS()).constant(e.constant());
    }),
    tr.apply(e, arguments)
  );
}
function iy(e) {
  return function (t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function mR(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function pR(e) {
  return e < 0 ? -e * e : e * e;
}
function Nh(e) {
  var t = e(Pt, Pt),
    r = 1;
  function n() {
    return r === 1 ? e(Pt, Pt) : r === 0.5 ? e(mR, pR) : e(iy(r), iy(1 / r));
  }
  return (
    (t.exponent = function (i) {
      return arguments.length ? ((r = +i), n()) : r;
    }),
    wn(t)
  );
}
function Ih() {
  var e = Nh(Yl());
  return (
    (e.copy = function () {
      return eo(e, Ih()).exponent(e.exponent());
    }),
    tr.apply(e, arguments),
    e
  );
}
function vR() {
  return Ih.apply(null, arguments).exponent(0.5);
}
function ay(e) {
  return Math.sign(e) * e * e;
}
function gR(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function hS() {
  var e = Oh(),
    t = [0, 1],
    r = !1,
    n;
  function i(a) {
    var o = gR(e(a));
    return isNaN(o) ? n : r ? Math.round(o) : o;
  }
  return (
    (i.invert = function (a) {
      return e.invert(ay(a));
    }),
    (i.domain = function (a) {
      return arguments.length ? (e.domain(a), i) : e.domain();
    }),
    (i.range = function (a) {
      return arguments.length ? (e.range((t = Array.from(a, Ws)).map(ay)), i) : t.slice();
    }),
    (i.rangeRound = function (a) {
      return i.range(a).round(!0);
    }),
    (i.round = function (a) {
      return arguments.length ? ((r = !!a), i) : r;
    }),
    (i.clamp = function (a) {
      return arguments.length ? (e.clamp(a), i) : e.clamp();
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((n = a), i) : n;
    }),
    (i.copy = function () {
      return hS(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
    }),
    tr.apply(i, arguments),
    wn(i)
  );
}
function mS() {
  var e = [],
    t = [],
    r = [],
    n;
  function i() {
    var o = 0,
      s = Math.max(1, t.length);
    for (r = new Array(s - 1); ++o < s; ) r[o - 1] = xD(e, o / s);
    return a;
  }
  function a(o) {
    return o == null || isNaN((o = +o)) ? n : t[Ja(r, o)];
  }
  return (
    (a.invertExtent = function (o) {
      var s = t.indexOf(o);
      return s < 0 ? [NaN, NaN] : [s > 0 ? r[s - 1] : e[0], s < r.length ? r[s] : e[e.length - 1]];
    }),
    (a.domain = function (o) {
      if (!arguments.length) return e.slice();
      e = [];
      for (let s of o) s != null && !isNaN((s = +s)) && e.push(s);
      return (e.sort(pn), i());
    }),
    (a.range = function (o) {
      return arguments.length ? ((t = Array.from(o)), i()) : t.slice();
    }),
    (a.unknown = function (o) {
      return arguments.length ? ((n = o), a) : n;
    }),
    (a.quantiles = function () {
      return r.slice();
    }),
    (a.copy = function () {
      return mS().domain(e).range(t).unknown(n);
    }),
    tr.apply(a, arguments)
  );
}
function pS() {
  var e = 0,
    t = 1,
    r = 1,
    n = [0.5],
    i = [0, 1],
    a;
  function o(l) {
    return l != null && l <= l ? i[Ja(n, l, 0, r)] : a;
  }
  function s() {
    var l = -1;
    for (n = new Array(r); ++l < r; ) n[l] = ((l + 1) * t - (l - r) * e) / (r + 1);
    return o;
  }
  return (
    (o.domain = function (l) {
      return arguments.length ? (([e, t] = l), (e = +e), (t = +t), s()) : [e, t];
    }),
    (o.range = function (l) {
      return arguments.length ? ((r = (i = Array.from(l)).length - 1), s()) : i.slice();
    }),
    (o.invertExtent = function (l) {
      var c = i.indexOf(l);
      return c < 0 ? [NaN, NaN] : c < 1 ? [e, n[0]] : c >= r ? [n[r - 1], t] : [n[c - 1], n[c]];
    }),
    (o.unknown = function (l) {
      return (arguments.length && (a = l), o);
    }),
    (o.thresholds = function () {
      return n.slice();
    }),
    (o.copy = function () {
      return pS().domain([e, t]).range(i).unknown(a);
    }),
    tr.apply(wn(o), arguments)
  );
}
function vS() {
  var e = [0.5],
    t = [0, 1],
    r,
    n = 1;
  function i(a) {
    return a != null && a <= a ? t[Ja(e, a, 0, n)] : r;
  }
  return (
    (i.domain = function (a) {
      return arguments.length ? ((e = Array.from(a)), (n = Math.min(e.length, t.length - 1)), i) : e.slice();
    }),
    (i.range = function (a) {
      return arguments.length ? ((t = Array.from(a)), (n = Math.min(e.length, t.length - 1)), i) : t.slice();
    }),
    (i.invertExtent = function (a) {
      var o = t.indexOf(a);
      return [e[o - 1], e[o]];
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((r = a), i) : r;
    }),
    (i.copy = function () {
      return vS().domain(e).range(t).unknown(r);
    }),
    tr.apply(i, arguments)
  );
}
const nf = new Date(),
  af = new Date();
function et(e, t, r, n) {
  function i(a) {
    return (e((a = arguments.length === 0 ? new Date() : new Date(+a))), a);
  }
  return (
    (i.floor = (a) => (e((a = new Date(+a))), a)),
    (i.ceil = (a) => (e((a = new Date(a - 1))), t(a, 1), e(a), a)),
    (i.round = (a) => {
      const o = i(a),
        s = i.ceil(a);
      return a - o < s - a ? o : s;
    }),
    (i.offset = (a, o) => (t((a = new Date(+a)), o == null ? 1 : Math.floor(o)), a)),
    (i.range = (a, o, s) => {
      const l = [];
      if (((a = i.ceil(a)), (s = s == null ? 1 : Math.floor(s)), !(a < o) || !(s > 0))) return l;
      let c;
      do (l.push((c = new Date(+a))), t(a, s), e(a));
      while (c < a && a < o);
      return l;
    }),
    (i.filter = (a) =>
      et(
        (o) => {
          if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
        },
        (o, s) => {
          if (o >= o)
            if (s < 0) for (; ++s <= 0; ) for (; t(o, -1), !a(o); );
            else for (; --s >= 0; ) for (; t(o, 1), !a(o); );
        },
      )),
    r &&
      ((i.count = (a, o) => (nf.setTime(+a), af.setTime(+o), e(nf), e(af), Math.floor(r(nf, af)))),
      (i.every = (a) => (
        (a = Math.floor(a)),
        !isFinite(a) || !(a > 0)
          ? null
          : a > 1
            ? i.filter(n ? (o) => n(o) % a === 0 : (o) => i.count(0, o) % a === 0)
            : i
      ))),
    i
  );
}
const Vs = et(
  () => {},
  (e, t) => {
    e.setTime(+e + t);
  },
  (e, t) => t - e,
);
Vs.every = (e) => (
  (e = Math.floor(e)),
  !isFinite(e) || !(e > 0)
    ? null
    : e > 1
      ? et(
          (t) => {
            t.setTime(Math.floor(t / e) * e);
          },
          (t, r) => {
            t.setTime(+t + r * e);
          },
          (t, r) => (r - t) / e,
        )
      : Vs
);
Vs.range;
const Rr = 1e3,
  Zt = Rr * 60,
  Lr = Zt * 60,
  Kr = Lr * 24,
  Th = Kr * 7,
  oy = Kr * 30,
  of = Kr * 365,
  Mn = et(
    (e) => {
      e.setTime(e - e.getMilliseconds());
    },
    (e, t) => {
      e.setTime(+e + t * Rr);
    },
    (e, t) => (t - e) / Rr,
    (e) => e.getUTCSeconds(),
  );
Mn.range;
const Mh = et(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * Rr);
  },
  (e, t) => {
    e.setTime(+e + t * Zt);
  },
  (e, t) => (t - e) / Zt,
  (e) => e.getMinutes(),
);
Mh.range;
const Dh = et(
  (e) => {
    e.setUTCSeconds(0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * Zt);
  },
  (e, t) => (t - e) / Zt,
  (e) => e.getUTCMinutes(),
);
Dh.range;
const Rh = et(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * Rr - e.getMinutes() * Zt);
  },
  (e, t) => {
    e.setTime(+e + t * Lr);
  },
  (e, t) => (t - e) / Lr,
  (e) => e.getHours(),
);
Rh.range;
const Lh = et(
  (e) => {
    e.setUTCMinutes(0, 0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * Lr);
  },
  (e, t) => (t - e) / Lr,
  (e) => e.getUTCHours(),
);
Lh.range;
const to = et(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Zt) / Kr,
  (e) => e.getDate() - 1,
);
to.range;
const Xl = et(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Kr,
  (e) => e.getUTCDate() - 1,
);
Xl.range;
const gS = et(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Kr,
  (e) => Math.floor(e / Kr),
);
gS.range;
function Xn(e) {
  return et(
    (t) => {
      (t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0));
    },
    (t, r) => {
      t.setDate(t.getDate() + r * 7);
    },
    (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * Zt) / Th,
  );
}
const Zl = Xn(0),
  Gs = Xn(1),
  yR = Xn(2),
  bR = Xn(3),
  _i = Xn(4),
  wR = Xn(5),
  xR = Xn(6);
Zl.range;
Gs.range;
yR.range;
bR.range;
_i.range;
wR.range;
xR.range;
function Zn(e) {
  return et(
    (t) => {
      (t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0));
    },
    (t, r) => {
      t.setUTCDate(t.getUTCDate() + r * 7);
    },
    (t, r) => (r - t) / Th,
  );
}
const Jl = Zn(0),
  Ys = Zn(1),
  SR = Zn(2),
  AR = Zn(3),
  Ei = Zn(4),
  PR = Zn(5),
  CR = Zn(6);
Jl.range;
Ys.range;
SR.range;
AR.range;
Ei.range;
PR.range;
CR.range;
const $h = et(
  (e) => {
    (e.setDate(1), e.setHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setMonth(e.getMonth() + t);
  },
  (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12,
  (e) => e.getMonth(),
);
$h.range;
const Fh = et(
  (e) => {
    (e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setUTCMonth(e.getUTCMonth() + t);
  },
  (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12,
  (e) => e.getUTCMonth(),
);
Fh.range;
const Wr = et(
  (e) => {
    (e.setMonth(0, 1), e.setHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setFullYear(e.getFullYear() + t);
  },
  (e, t) => t.getFullYear() - e.getFullYear(),
  (e) => e.getFullYear(),
);
Wr.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : et(
        (t) => {
          (t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0));
        },
        (t, r) => {
          t.setFullYear(t.getFullYear() + r * e);
        },
      );
Wr.range;
const Hr = et(
  (e) => {
    (e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  },
  (e, t) => t.getUTCFullYear() - e.getUTCFullYear(),
  (e) => e.getUTCFullYear(),
);
Hr.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : et(
        (t) => {
          (t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0));
        },
        (t, r) => {
          t.setUTCFullYear(t.getUTCFullYear() + r * e);
        },
      );
Hr.range;
function yS(e, t, r, n, i, a) {
  const o = [
    [Mn, 1, Rr],
    [Mn, 5, 5 * Rr],
    [Mn, 15, 15 * Rr],
    [Mn, 30, 30 * Rr],
    [a, 1, Zt],
    [a, 5, 5 * Zt],
    [a, 15, 15 * Zt],
    [a, 30, 30 * Zt],
    [i, 1, Lr],
    [i, 3, 3 * Lr],
    [i, 6, 6 * Lr],
    [i, 12, 12 * Lr],
    [n, 1, Kr],
    [n, 2, 2 * Kr],
    [r, 1, Th],
    [t, 1, oy],
    [t, 3, 3 * oy],
    [e, 1, of],
  ];
  function s(c, u, f) {
    const h = u < c;
    h && ([c, u] = [u, c]);
    const m = f && typeof f.range == 'function' ? f : l(c, u, f),
      p = m ? m.range(c, +u + 1) : [];
    return h ? p.reverse() : p;
  }
  function l(c, u, f) {
    const h = Math.abs(u - c) / f,
      m = wh(([, , g]) => g).right(o, h);
    if (m === o.length) return e.every(sd(c / of, u / of, f));
    if (m === 0) return Vs.every(Math.max(sd(c, u, f), 1));
    const [p, v] = o[h / o[m - 1][2] < o[m][2] / h ? m - 1 : m];
    return p.every(v);
  }
  return [s, l];
}
const [OR, _R] = yS(Hr, Fh, Jl, gS, Lh, Dh),
  [ER, kR] = yS(Wr, $h, Zl, to, Rh, Mh);
function sf(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return (t.setFullYear(e.y), t);
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function lf(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return (t.setUTCFullYear(e.y), t);
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function la(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function jR(e) {
  var t = e.dateTime,
    r = e.date,
    n = e.time,
    i = e.periods,
    a = e.days,
    o = e.shortDays,
    s = e.months,
    l = e.shortMonths,
    c = ca(i),
    u = ua(i),
    f = ca(a),
    h = ua(a),
    m = ca(o),
    p = ua(o),
    v = ca(s),
    g = ua(s),
    b = ca(l),
    S = ua(l),
    x = {
      a: se,
      A: V,
      b: T,
      B: F,
      c: null,
      d: dy,
      e: dy,
      f: QR,
      g: cL,
      G: fL,
      H: XR,
      I: ZR,
      j: JR,
      L: bS,
      m: eL,
      M: tL,
      p: W,
      q: z,
      Q: py,
      s: vy,
      S: rL,
      u: nL,
      U: iL,
      V: aL,
      w: oL,
      W: sL,
      x: null,
      X: null,
      y: lL,
      Y: uL,
      Z: dL,
      '%': my,
    },
    A = {
      a: H,
      A: G,
      b: le,
      B: fe,
      c: null,
      d: hy,
      e: hy,
      f: vL,
      g: OL,
      G: EL,
      H: hL,
      I: mL,
      j: pL,
      L: xS,
      m: gL,
      M: yL,
      p: te,
      q: ne,
      Q: py,
      s: vy,
      S: bL,
      u: wL,
      U: xL,
      V: SL,
      w: AL,
      W: PL,
      x: null,
      X: null,
      y: CL,
      Y: _L,
      Z: kL,
      '%': my,
    },
    C = {
      a: N,
      A: M,
      b: O,
      B: D,
      c: B,
      d: uy,
      e: uy,
      f: qR,
      g: cy,
      G: ly,
      H: fy,
      I: fy,
      j: zR,
      L: HR,
      m: UR,
      M: KR,
      p: j,
      q: BR,
      Q: GR,
      s: YR,
      S: WR,
      u: DR,
      U: RR,
      V: LR,
      w: MR,
      W: $R,
      x: Y,
      X: Q,
      y: cy,
      Y: ly,
      Z: FR,
      '%': VR,
    };
  ((x.x = P(r, x)), (x.X = P(n, x)), (x.c = P(t, x)), (A.x = P(r, A)), (A.X = P(n, A)), (A.c = P(t, A)));
  function P($, U) {
    return function (ie) {
      var R = [],
        pe = -1,
        ce = 0,
        be = $.length,
        de,
        K,
        ae;
      for (ie instanceof Date || (ie = new Date(+ie)); ++pe < be; )
        $.charCodeAt(pe) === 37 &&
          (R.push($.slice(ce, pe)),
          (K = sy[(de = $.charAt(++pe))]) != null ? (de = $.charAt(++pe)) : (K = de === 'e' ? ' ' : '0'),
          (ae = U[de]) && (de = ae(ie, K)),
          R.push(de),
          (ce = pe + 1));
      return (R.push($.slice(ce, pe)), R.join(''));
    };
  }
  function _($, U) {
    return function (ie) {
      var R = la(1900, void 0, 1),
        pe = E(R, $, (ie += ''), 0),
        ce,
        be;
      if (pe != ie.length) return null;
      if ('Q' in R) return new Date(R.Q);
      if ('s' in R) return new Date(R.s * 1e3 + ('L' in R ? R.L : 0));
      if (
        (U && !('Z' in R) && (R.Z = 0),
        'p' in R && (R.H = (R.H % 12) + R.p * 12),
        R.m === void 0 && (R.m = 'q' in R ? R.q : 0),
        'V' in R)
      ) {
        if (R.V < 1 || R.V > 53) return null;
        ('w' in R || (R.w = 1),
          'Z' in R
            ? ((ce = lf(la(R.y, 0, 1))),
              (be = ce.getUTCDay()),
              (ce = be > 4 || be === 0 ? Ys.ceil(ce) : Ys(ce)),
              (ce = Xl.offset(ce, (R.V - 1) * 7)),
              (R.y = ce.getUTCFullYear()),
              (R.m = ce.getUTCMonth()),
              (R.d = ce.getUTCDate() + ((R.w + 6) % 7)))
            : ((ce = sf(la(R.y, 0, 1))),
              (be = ce.getDay()),
              (ce = be > 4 || be === 0 ? Gs.ceil(ce) : Gs(ce)),
              (ce = to.offset(ce, (R.V - 1) * 7)),
              (R.y = ce.getFullYear()),
              (R.m = ce.getMonth()),
              (R.d = ce.getDate() + ((R.w + 6) % 7))));
      } else
        ('W' in R || 'U' in R) &&
          ('w' in R || (R.w = 'u' in R ? R.u % 7 : 'W' in R ? 1 : 0),
          (be = 'Z' in R ? lf(la(R.y, 0, 1)).getUTCDay() : sf(la(R.y, 0, 1)).getDay()),
          (R.m = 0),
          (R.d = 'W' in R ? ((R.w + 6) % 7) + R.W * 7 - ((be + 5) % 7) : R.w + R.U * 7 - ((be + 6) % 7)));
      return 'Z' in R ? ((R.H += (R.Z / 100) | 0), (R.M += R.Z % 100), lf(R)) : sf(R);
    };
  }
  function E($, U, ie, R) {
    for (var pe = 0, ce = U.length, be = ie.length, de, K; pe < ce; ) {
      if (R >= be) return -1;
      if (((de = U.charCodeAt(pe++)), de === 37)) {
        if (((de = U.charAt(pe++)), (K = C[de in sy ? U.charAt(pe++) : de]), !K || (R = K($, ie, R)) < 0)) return -1;
      } else if (de != ie.charCodeAt(R++)) return -1;
    }
    return R;
  }
  function j($, U, ie) {
    var R = c.exec(U.slice(ie));
    return R ? (($.p = u.get(R[0].toLowerCase())), ie + R[0].length) : -1;
  }
  function N($, U, ie) {
    var R = m.exec(U.slice(ie));
    return R ? (($.w = p.get(R[0].toLowerCase())), ie + R[0].length) : -1;
  }
  function M($, U, ie) {
    var R = f.exec(U.slice(ie));
    return R ? (($.w = h.get(R[0].toLowerCase())), ie + R[0].length) : -1;
  }
  function O($, U, ie) {
    var R = b.exec(U.slice(ie));
    return R ? (($.m = S.get(R[0].toLowerCase())), ie + R[0].length) : -1;
  }
  function D($, U, ie) {
    var R = v.exec(U.slice(ie));
    return R ? (($.m = g.get(R[0].toLowerCase())), ie + R[0].length) : -1;
  }
  function B($, U, ie) {
    return E($, t, U, ie);
  }
  function Y($, U, ie) {
    return E($, r, U, ie);
  }
  function Q($, U, ie) {
    return E($, n, U, ie);
  }
  function se($) {
    return o[$.getDay()];
  }
  function V($) {
    return a[$.getDay()];
  }
  function T($) {
    return l[$.getMonth()];
  }
  function F($) {
    return s[$.getMonth()];
  }
  function W($) {
    return i[+($.getHours() >= 12)];
  }
  function z($) {
    return 1 + ~~($.getMonth() / 3);
  }
  function H($) {
    return o[$.getUTCDay()];
  }
  function G($) {
    return a[$.getUTCDay()];
  }
  function le($) {
    return l[$.getUTCMonth()];
  }
  function fe($) {
    return s[$.getUTCMonth()];
  }
  function te($) {
    return i[+($.getUTCHours() >= 12)];
  }
  function ne($) {
    return 1 + ~~($.getUTCMonth() / 3);
  }
  return {
    format: function ($) {
      var U = P(($ += ''), x);
      return (
        (U.toString = function () {
          return $;
        }),
        U
      );
    },
    parse: function ($) {
      var U = _(($ += ''), !1);
      return (
        (U.toString = function () {
          return $;
        }),
        U
      );
    },
    utcFormat: function ($) {
      var U = P(($ += ''), A);
      return (
        (U.toString = function () {
          return $;
        }),
        U
      );
    },
    utcParse: function ($) {
      var U = _(($ += ''), !0);
      return (
        (U.toString = function () {
          return $;
        }),
        U
      );
    },
  };
}
var sy = { '-': '', _: ' ', 0: '0' },
  ct = /^\s*\d+/,
  NR = /^%/,
  IR = /[\\^$*+?|[\]().{}]/g;
function Se(e, t, r) {
  var n = e < 0 ? '-' : '',
    i = (n ? -e : e) + '',
    a = i.length;
  return n + (a < r ? new Array(r - a + 1).join(t) + i : i);
}
function TR(e) {
  return e.replace(IR, '\\$&');
}
function ca(e) {
  return new RegExp('^(?:' + e.map(TR).join('|') + ')', 'i');
}
function ua(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function MR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 1));
  return n ? ((e.w = +n[0]), r + n[0].length) : -1;
}
function DR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 1));
  return n ? ((e.u = +n[0]), r + n[0].length) : -1;
}
function RR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.U = +n[0]), r + n[0].length) : -1;
}
function LR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.V = +n[0]), r + n[0].length) : -1;
}
function $R(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.W = +n[0]), r + n[0].length) : -1;
}
function ly(e, t, r) {
  var n = ct.exec(t.slice(r, r + 4));
  return n ? ((e.y = +n[0]), r + n[0].length) : -1;
}
function cy(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3)), r + n[0].length) : -1;
}
function FR(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? ((e.Z = n[1] ? 0 : -(n[2] + (n[3] || '00'))), r + n[0].length) : -1;
}
function BR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 1));
  return n ? ((e.q = n[0] * 3 - 3), r + n[0].length) : -1;
}
function UR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.m = n[0] - 1), r + n[0].length) : -1;
}
function uy(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.d = +n[0]), r + n[0].length) : -1;
}
function zR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 3));
  return n ? ((e.m = 0), (e.d = +n[0]), r + n[0].length) : -1;
}
function fy(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.H = +n[0]), r + n[0].length) : -1;
}
function KR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.M = +n[0]), r + n[0].length) : -1;
}
function WR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 2));
  return n ? ((e.S = +n[0]), r + n[0].length) : -1;
}
function HR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 3));
  return n ? ((e.L = +n[0]), r + n[0].length) : -1;
}
function qR(e, t, r) {
  var n = ct.exec(t.slice(r, r + 6));
  return n ? ((e.L = Math.floor(n[0] / 1e3)), r + n[0].length) : -1;
}
function VR(e, t, r) {
  var n = NR.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function GR(e, t, r) {
  var n = ct.exec(t.slice(r));
  return n ? ((e.Q = +n[0]), r + n[0].length) : -1;
}
function YR(e, t, r) {
  var n = ct.exec(t.slice(r));
  return n ? ((e.s = +n[0]), r + n[0].length) : -1;
}
function dy(e, t) {
  return Se(e.getDate(), t, 2);
}
function XR(e, t) {
  return Se(e.getHours(), t, 2);
}
function ZR(e, t) {
  return Se(e.getHours() % 12 || 12, t, 2);
}
function JR(e, t) {
  return Se(1 + to.count(Wr(e), e), t, 3);
}
function bS(e, t) {
  return Se(e.getMilliseconds(), t, 3);
}
function QR(e, t) {
  return bS(e, t) + '000';
}
function eL(e, t) {
  return Se(e.getMonth() + 1, t, 2);
}
function tL(e, t) {
  return Se(e.getMinutes(), t, 2);
}
function rL(e, t) {
  return Se(e.getSeconds(), t, 2);
}
function nL(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function iL(e, t) {
  return Se(Zl.count(Wr(e) - 1, e), t, 2);
}
function wS(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? _i(e) : _i.ceil(e);
}
function aL(e, t) {
  return ((e = wS(e)), Se(_i.count(Wr(e), e) + (Wr(e).getDay() === 4), t, 2));
}
function oL(e) {
  return e.getDay();
}
function sL(e, t) {
  return Se(Gs.count(Wr(e) - 1, e), t, 2);
}
function lL(e, t) {
  return Se(e.getFullYear() % 100, t, 2);
}
function cL(e, t) {
  return ((e = wS(e)), Se(e.getFullYear() % 100, t, 2));
}
function uL(e, t) {
  return Se(e.getFullYear() % 1e4, t, 4);
}
function fL(e, t) {
  var r = e.getDay();
  return ((e = r >= 4 || r === 0 ? _i(e) : _i.ceil(e)), Se(e.getFullYear() % 1e4, t, 4));
}
function dL(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? '-' : ((t *= -1), '+')) + Se((t / 60) | 0, '0', 2) + Se(t % 60, '0', 2);
}
function hy(e, t) {
  return Se(e.getUTCDate(), t, 2);
}
function hL(e, t) {
  return Se(e.getUTCHours(), t, 2);
}
function mL(e, t) {
  return Se(e.getUTCHours() % 12 || 12, t, 2);
}
function pL(e, t) {
  return Se(1 + Xl.count(Hr(e), e), t, 3);
}
function xS(e, t) {
  return Se(e.getUTCMilliseconds(), t, 3);
}
function vL(e, t) {
  return xS(e, t) + '000';
}
function gL(e, t) {
  return Se(e.getUTCMonth() + 1, t, 2);
}
function yL(e, t) {
  return Se(e.getUTCMinutes(), t, 2);
}
function bL(e, t) {
  return Se(e.getUTCSeconds(), t, 2);
}
function wL(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function xL(e, t) {
  return Se(Jl.count(Hr(e) - 1, e), t, 2);
}
function SS(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? Ei(e) : Ei.ceil(e);
}
function SL(e, t) {
  return ((e = SS(e)), Se(Ei.count(Hr(e), e) + (Hr(e).getUTCDay() === 4), t, 2));
}
function AL(e) {
  return e.getUTCDay();
}
function PL(e, t) {
  return Se(Ys.count(Hr(e) - 1, e), t, 2);
}
function CL(e, t) {
  return Se(e.getUTCFullYear() % 100, t, 2);
}
function OL(e, t) {
  return ((e = SS(e)), Se(e.getUTCFullYear() % 100, t, 2));
}
function _L(e, t) {
  return Se(e.getUTCFullYear() % 1e4, t, 4);
}
function EL(e, t) {
  var r = e.getUTCDay();
  return ((e = r >= 4 || r === 0 ? Ei(e) : Ei.ceil(e)), Se(e.getUTCFullYear() % 1e4, t, 4));
}
function kL() {
  return '+0000';
}
function my() {
  return '%';
}
function py(e) {
  return +e;
}
function vy(e) {
  return Math.floor(+e / 1e3);
}
var oi, AS, PS;
jL({
  dateTime: '%x, %X',
  date: '%-m/%-d/%Y',
  time: '%-I:%M:%S %p',
  periods: ['AM', 'PM'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
});
function jL(e) {
  return ((oi = jR(e)), (AS = oi.format), oi.parse, (PS = oi.utcFormat), oi.utcParse, oi);
}
function NL(e) {
  return new Date(e);
}
function IL(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Bh(e, t, r, n, i, a, o, s, l, c) {
  var u = Oh(),
    f = u.invert,
    h = u.domain,
    m = c('.%L'),
    p = c(':%S'),
    v = c('%I:%M'),
    g = c('%I %p'),
    b = c('%a %d'),
    S = c('%b %d'),
    x = c('%B'),
    A = c('%Y');
  function C(P) {
    return (
      l(P) < P ? m : s(P) < P ? p : o(P) < P ? v : a(P) < P ? g : n(P) < P ? (i(P) < P ? b : S) : r(P) < P ? x : A
    )(P);
  }
  return (
    (u.invert = function (P) {
      return new Date(f(P));
    }),
    (u.domain = function (P) {
      return arguments.length ? h(Array.from(P, IL)) : h().map(NL);
    }),
    (u.ticks = function (P) {
      var _ = h();
      return e(_[0], _[_.length - 1], P ?? 10);
    }),
    (u.tickFormat = function (P, _) {
      return _ == null ? C : c(_);
    }),
    (u.nice = function (P) {
      var _ = h();
      return ((!P || typeof P.range != 'function') && (P = t(_[0], _[_.length - 1], P ?? 10)), P ? h(uS(_, P)) : u);
    }),
    (u.copy = function () {
      return eo(u, Bh(e, t, r, n, i, a, o, s, l, c));
    }),
    u
  );
}
function TL() {
  return tr.apply(
    Bh(ER, kR, Wr, $h, Zl, to, Rh, Mh, Mn, AS).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]),
    arguments,
  );
}
function ML() {
  return tr.apply(
    Bh(OR, _R, Hr, Fh, Jl, Xl, Lh, Dh, Mn, PS).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]),
    arguments,
  );
}
function Ql() {
  var e = 0,
    t = 1,
    r,
    n,
    i,
    a,
    o = Pt,
    s = !1,
    l;
  function c(f) {
    return f == null || isNaN((f = +f))
      ? l
      : o(i === 0 ? 0.5 : ((f = (a(f) - r) * i), s ? Math.max(0, Math.min(1, f)) : f));
  }
  ((c.domain = function (f) {
    return arguments.length
      ? (([e, t] = f), (r = a((e = +e))), (n = a((t = +t))), (i = r === n ? 0 : 1 / (n - r)), c)
      : [e, t];
  }),
    (c.clamp = function (f) {
      return arguments.length ? ((s = !!f), c) : s;
    }),
    (c.interpolator = function (f) {
      return arguments.length ? ((o = f), c) : o;
    }));
  function u(f) {
    return function (h) {
      var m, p;
      return arguments.length ? (([m, p] = h), (o = f(m, p)), c) : [o(0), o(1)];
    };
  }
  return (
    (c.range = u(Di)),
    (c.rangeRound = u(Ch)),
    (c.unknown = function (f) {
      return arguments.length ? ((l = f), c) : l;
    }),
    function (f) {
      return ((a = f), (r = f(e)), (n = f(t)), (i = r === n ? 0 : 1 / (n - r)), c);
    }
  );
}
function xn(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function CS() {
  var e = wn(Ql()(Pt));
  return (
    (e.copy = function () {
      return xn(e, CS());
    }),
    Xr.apply(e, arguments)
  );
}
function OS() {
  var e = kh(Ql()).domain([1, 10]);
  return (
    (e.copy = function () {
      return xn(e, OS()).base(e.base());
    }),
    Xr.apply(e, arguments)
  );
}
function _S() {
  var e = jh(Ql());
  return (
    (e.copy = function () {
      return xn(e, _S()).constant(e.constant());
    }),
    Xr.apply(e, arguments)
  );
}
function Uh() {
  var e = Nh(Ql());
  return (
    (e.copy = function () {
      return xn(e, Uh()).exponent(e.exponent());
    }),
    Xr.apply(e, arguments)
  );
}
function DL() {
  return Uh.apply(null, arguments).exponent(0.5);
}
function ES() {
  var e = [],
    t = Pt;
  function r(n) {
    if (n != null && !isNaN((n = +n))) return t((Ja(e, n, 1) - 1) / (e.length - 1));
  }
  return (
    (r.domain = function (n) {
      if (!arguments.length) return e.slice();
      e = [];
      for (let i of n) i != null && !isNaN((i = +i)) && e.push(i);
      return (e.sort(pn), r);
    }),
    (r.interpolator = function (n) {
      return arguments.length ? ((t = n), r) : t;
    }),
    (r.range = function () {
      return e.map((n, i) => t(i / (e.length - 1)));
    }),
    (r.quantiles = function (n) {
      return Array.from({ length: n + 1 }, (i, a) => wD(e, a / n));
    }),
    (r.copy = function () {
      return ES(t).domain(e);
    }),
    Xr.apply(r, arguments)
  );
}
function ec() {
  var e = 0,
    t = 0.5,
    r = 1,
    n = 1,
    i,
    a,
    o,
    s,
    l,
    c = Pt,
    u,
    f = !1,
    h;
  function m(v) {
    return isNaN((v = +v))
      ? h
      : ((v = 0.5 + ((v = +u(v)) - a) * (n * v < n * a ? s : l)), c(f ? Math.max(0, Math.min(1, v)) : v));
  }
  ((m.domain = function (v) {
    return arguments.length
      ? (([e, t, r] = v),
        (i = u((e = +e))),
        (a = u((t = +t))),
        (o = u((r = +r))),
        (s = i === a ? 0 : 0.5 / (a - i)),
        (l = a === o ? 0 : 0.5 / (o - a)),
        (n = a < i ? -1 : 1),
        m)
      : [e, t, r];
  }),
    (m.clamp = function (v) {
      return arguments.length ? ((f = !!v), m) : f;
    }),
    (m.interpolator = function (v) {
      return arguments.length ? ((c = v), m) : c;
    }));
  function p(v) {
    return function (g) {
      var b, S, x;
      return arguments.length ? (([b, S, x] = g), (c = VD(v, [b, S, x])), m) : [c(0), c(0.5), c(1)];
    };
  }
  return (
    (m.range = p(Di)),
    (m.rangeRound = p(Ch)),
    (m.unknown = function (v) {
      return arguments.length ? ((h = v), m) : h;
    }),
    function (v) {
      return (
        (u = v),
        (i = v(e)),
        (a = v(t)),
        (o = v(r)),
        (s = i === a ? 0 : 0.5 / (a - i)),
        (l = a === o ? 0 : 0.5 / (o - a)),
        (n = a < i ? -1 : 1),
        m
      );
    }
  );
}
function kS() {
  var e = wn(ec()(Pt));
  return (
    (e.copy = function () {
      return xn(e, kS());
    }),
    Xr.apply(e, arguments)
  );
}
function jS() {
  var e = kh(ec()).domain([0.1, 1, 10]);
  return (
    (e.copy = function () {
      return xn(e, jS()).base(e.base());
    }),
    Xr.apply(e, arguments)
  );
}
function NS() {
  var e = jh(ec());
  return (
    (e.copy = function () {
      return xn(e, NS()).constant(e.constant());
    }),
    Xr.apply(e, arguments)
  );
}
function zh() {
  var e = Nh(ec());
  return (
    (e.copy = function () {
      return xn(e, zh()).exponent(e.exponent());
    }),
    Xr.apply(e, arguments)
  );
}
function RL() {
  return zh.apply(null, arguments).exponent(0.5);
}
const ga = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      scaleBand: Sh,
      scaleDiverging: kS,
      scaleDivergingLog: jS,
      scaleDivergingPow: zh,
      scaleDivergingSqrt: RL,
      scaleDivergingSymlog: NS,
      scaleIdentity: cS,
      scaleImplicit: ld,
      scaleLinear: lS,
      scaleLog: fS,
      scaleOrdinal: xh,
      scalePoint: AD,
      scalePow: Ih,
      scaleQuantile: mS,
      scaleQuantize: pS,
      scaleRadial: hS,
      scaleSequential: CS,
      scaleSequentialLog: OS,
      scaleSequentialPow: Uh,
      scaleSequentialQuantile: ES,
      scaleSequentialSqrt: DL,
      scaleSequentialSymlog: _S,
      scaleSqrt: vR,
      scaleSymlog: dS,
      scaleThreshold: vS,
      scaleTime: TL,
      scaleUtc: ML,
      tickFormat: sS,
    },
    Symbol.toStringTag,
    { value: 'Module' },
  ),
);
function LL(e) {
  if (e in ga) return ga[e]();
  var t = 'scale'.concat(Wa(e));
  if (t in ga) return ga[t]();
}
function gy(e, t, r) {
  if (typeof e == 'function') return e.copy().domain(t).range(r);
  if (e != null) {
    var n = LL(e);
    if (n != null) return (n.domain(t).range(r), n);
  }
}
function Kh(e, t, r, n) {
  if (!(r == null || n == null)) return typeof e.scale == 'function' ? gy(e.scale, r, n) : gy(t, r, n);
}
function $L(e) {
  return 'scale'.concat(Wa(e));
}
function FL(e) {
  return $L(e) in ga;
}
var IS = (e, t, r) => {
  if (e != null) {
    var { scale: n, type: i } = e;
    if (n === 'auto')
      return i === 'category' &&
        r &&
        (r.indexOf('LineChart') >= 0 || r.indexOf('AreaChart') >= 0 || (r.indexOf('ComposedChart') >= 0 && !t))
        ? 'point'
        : i === 'category'
          ? 'band'
          : 'linear';
    if (typeof n == 'string') return FL(n) ? n : 'point';
  }
};
function BL(e, t) {
  for (var r = 0, n = e.length, i = e[0] < e[e.length - 1]; r < n; ) {
    var a = Math.floor((r + n) / 2);
    (i ? e[a] < t : e[a] > t) ? (r = a + 1) : (n = a);
  }
  return r;
}
function TS(e, t) {
  if (e) {
    var r = t ?? e.domain(),
      n = r.map((a) => {
        var o;
        return (o = e(a)) !== null && o !== void 0 ? o : 0;
      }),
      i = e.range();
    if (!(r.length === 0 || i.length < 2))
      return (a) => {
        var o,
          s,
          l = BL(n, a);
        if (l <= 0) return r[0];
        if (l >= r.length) return r[r.length - 1];
        var c = (o = n[l - 1]) !== null && o !== void 0 ? o : 0,
          u = (s = n[l]) !== null && s !== void 0 ? s : 0;
        return Math.abs(a - c) <= Math.abs(a - u) ? r[l - 1] : r[l];
      };
  }
}
function UL(e) {
  if (e != null) return 'invert' in e && typeof e.invert == 'function' ? e.invert.bind(e) : TS(e, void 0);
}
function yy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Xs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? yy(Object(r), !0).forEach(function (n) {
          zL(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : yy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function zL(e, t, r) {
  return (
    (t = KL(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function KL(e) {
  var t = WL(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function WL(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var dd = [0, 'auto'],
  Ze = {
    allowDataOverflow: !1,
    allowDecimals: !0,
    allowDuplicatedCategory: !0,
    angle: 0,
    dataKey: void 0,
    domain: void 0,
    height: 30,
    hide: !0,
    id: 0,
    includeHidden: !1,
    interval: 'preserveEnd',
    minTickGap: 5,
    mirror: !1,
    name: void 0,
    orientation: 'bottom',
    padding: { left: 0, right: 0 },
    reversed: !1,
    scale: 'auto',
    tick: !0,
    tickCount: 5,
    tickFormatter: void 0,
    ticks: void 0,
    type: 'category',
    unit: void 0,
    niceTicks: 'auto',
  },
  MS = (e, t) => e.cartesianAxis.xAxis[t],
  Zr = (e, t) => {
    var r = MS(e, t);
    return r ?? Ze;
  },
  Je = {
    allowDataOverflow: !1,
    allowDecimals: !0,
    allowDuplicatedCategory: !0,
    angle: 0,
    dataKey: void 0,
    domain: dd,
    hide: !0,
    id: 0,
    includeHidden: !1,
    interval: 'preserveEnd',
    minTickGap: 5,
    mirror: !1,
    name: void 0,
    orientation: 'left',
    padding: { top: 0, bottom: 0 },
    reversed: !1,
    scale: 'auto',
    tick: !0,
    tickCount: 5,
    tickFormatter: void 0,
    ticks: void 0,
    type: 'number',
    unit: void 0,
    niceTicks: 'auto',
    width: Va,
  },
  DS = (e, t) => e.cartesianAxis.yAxis[t],
  Jr = (e, t) => {
    var r = DS(e, t);
    return r ?? Je;
  },
  HL = {
    domain: [0, 'auto'],
    includeHidden: !1,
    reversed: !1,
    allowDataOverflow: !1,
    allowDuplicatedCategory: !1,
    dataKey: void 0,
    id: 0,
    name: '',
    range: [64, 64],
    scale: 'auto',
    type: 'number',
    unit: '',
  },
  Wh = (e, t) => {
    var r = e.cartesianAxis.zAxis[t];
    return r ?? HL;
  },
  _t = (e, t, r) => {
    switch (t) {
      case 'xAxis':
        return Zr(e, r);
      case 'yAxis':
        return Jr(e, r);
      case 'zAxis':
        return Wh(e, r);
      case 'angleAxis':
        return vh(e, r);
      case 'radiusAxis':
        return gh(e, r);
      default:
        throw new Error('Unexpected axis type: '.concat(t));
    }
  },
  qL = (e, t, r) => {
    switch (t) {
      case 'xAxis':
        return Zr(e, r);
      case 'yAxis':
        return Jr(e, r);
      default:
        throw new Error('Unexpected axis type: '.concat(t));
    }
  },
  ro = (e, t, r) => {
    switch (t) {
      case 'xAxis':
        return Zr(e, r);
      case 'yAxis':
        return Jr(e, r);
      case 'angleAxis':
        return vh(e, r);
      case 'radiusAxis':
        return gh(e, r);
      default:
        throw new Error('Unexpected axis type: '.concat(t));
    }
  },
  RS = (e) =>
    e.graphicalItems.cartesianItems.some((t) => t.type === 'bar') ||
    e.graphicalItems.polarItems.some((t) => t.type === 'radialBar');
function LS(e, t) {
  return (r) => {
    switch (e) {
      case 'xAxis':
        return 'xAxisId' in r && r.xAxisId === t;
      case 'yAxis':
        return 'yAxisId' in r && r.yAxisId === t;
      case 'zAxis':
        return 'zAxisId' in r && r.zAxisId === t;
      case 'angleAxis':
        return 'angleAxisId' in r && r.angleAxisId === t;
      case 'radiusAxis':
        return 'radiusAxisId' in r && r.radiusAxisId === t;
      default:
        return !1;
    }
  };
}
var tc = (e) => e.graphicalItems.cartesianItems,
  VL = I([st, Wl], LS),
  $S = (e, t, r) => e.filter(r).filter((n) => (t?.includeHidden === !0 ? !0 : !n.hide)),
  no = I([tc, _t, VL], $S, { memoizeOptions: { resultEqualityCheck: Gl } }),
  FS = I([no], (e) => e.filter((t) => t.type === 'area' || t.type === 'bar').filter(ql)),
  BS = (e) => e.filter((t) => !('stackId' in t) || t.stackId === void 0),
  GL = I([no], BS),
  US = (e) =>
    e
      .map((t) => t.data)
      .filter(Boolean)
      .flat(1),
  YL = I([no], US, { memoizeOptions: { resultEqualityCheck: Gl } }),
  zS = (e, t) => {
    var { chartData: r = [], dataStartIndex: n, dataEndIndex: i } = t;
    return e.length > 0 ? e : r.slice(n, i + 1);
  },
  Hh = I([YL, j0], zS),
  KS = (e, t, r) =>
    t?.dataKey != null
      ? e.map((n) => ({ value: Ye(n, t.dataKey) }))
      : r.length > 0
        ? r.map((n) => n.dataKey).flatMap((n) => e.map((i) => ({ value: Ye(i, n) })))
        : e.map((n) => ({ value: n })),
  io = I([Hh, _t, no], KS);
function wi(e) {
  if (Sr(e) || e instanceof Date) {
    var t = Number(e);
    if (he(t)) return t;
  }
}
function by(e) {
  if (Array.isArray(e)) {
    var t = [wi(e[0]), wi(e[1])];
    return wr(t) ? t : void 0;
  }
  var r = wi(e);
  if (r != null) return [r, r];
}
function qr(e) {
  return e.map(wi).filter(It);
}
function XL(e, t) {
  var r = wi(e),
    n = wi(t);
  return r == null && n == null ? 0 : r == null ? -1 : n == null ? 1 : r - n;
}
var ZL = I([io], (e) => e?.map((t) => t.value).sort(XL));
function WS(e, t) {
  switch (e) {
    case 'xAxis':
      return t.direction === 'x';
    case 'yAxis':
      return t.direction === 'y';
    default:
      return !1;
  }
}
function JL(e, t, r) {
  return !r || typeof t != 'number' || sr(t)
    ? []
    : r.length
      ? qr(
          r.flatMap((n) => {
            var i = Ye(e, n.dataKey),
              a,
              o;
            if ((Array.isArray(i) ? ([a, o] = i) : (a = o = i), !(!he(a) || !he(o)))) return [t - a, t + o];
          }),
        )
      : [];
}
var tt = (e) => {
    var t = lt(e),
      r = Mi(e);
    return ro(e, t, r);
  },
  ao = I([tt], (e) => e?.dataKey),
  QL = I([FS, j0, tt], J0),
  HS = (e, t, r, n) => {
    var i = {},
      a = t.reduce((o, s) => {
        if (s.stackId == null) return o;
        var l = o[s.stackId];
        return (l == null && (l = []), l.push(s), (o[s.stackId] = l), o);
      }, i);
    return Object.fromEntries(
      Object.entries(a).map((o) => {
        var [s, l] = o,
          c = n ? [...l].reverse() : l,
          u = c.map(Hl);
        return [s, { stackedData: pI(e, u, r), graphicalItems: c }];
      }),
    );
  },
  Zs = I([QL, FS, Bl, H0], HS),
  qS = (e, t, r, n) => {
    var { dataStartIndex: i, dataEndIndex: a } = t;
    if (n == null && r !== 'zAxis') {
      var o = bI(e, i, a);
      if (!(o != null && o[0] === 0 && o[1] === 0)) return o;
    }
  },
  e2 = I([_t], (e) => e.allowDataOverflow),
  qh = (e) => {
    var t;
    if (e == null || !('domain' in e)) return dd;
    if (e.domain != null) return e.domain;
    if ('ticks' in e && e.ticks != null) {
      if (e.type === 'number') {
        var r = qr(e.ticks);
        return [Math.min(...r), Math.max(...r)];
      }
      if (e.type === 'category') return e.ticks.map(String);
    }
    return (t = e?.domain) !== null && t !== void 0 ? t : dd;
  },
  VS = I([_t], qh),
  GS = I([VS, e2], I0),
  t2 = I([Zs, Yr, st, GS], qS, { memoizeOptions: { resultEqualityCheck: Vl } }),
  Vh = (e) => e.errorBars,
  r2 = (e, t, r) =>
    e
      .flatMap((n) => t[n.id])
      .filter(Boolean)
      .filter((n) => WS(r, n)),
  Js = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
    var i = r.filter(Boolean);
    if (i.length !== 0) {
      var a = i.flat(),
        o = Math.min(...a),
        s = Math.max(...a);
      return [o, s];
    }
  },
  YS = (e, t, r, n, i) => {
    var a, o;
    if (
      (r.length > 0 &&
        e.forEach((s) => {
          r.forEach((l) => {
            var c,
              u,
              f = (c = n[l.id]) === null || c === void 0 ? void 0 : c.filter((b) => WS(i, b)),
              h = Ye(s, (u = t.dataKey) !== null && u !== void 0 ? u : l.dataKey),
              m = JL(s, h, f);
            if (m.length >= 2) {
              var p = Math.min(...m),
                v = Math.max(...m);
              ((a == null || p < a) && (a = p), (o == null || v > o) && (o = v));
            }
            var g = by(h);
            g != null && ((a = a == null ? g[0] : Math.min(a, g[0])), (o = o == null ? g[1] : Math.max(o, g[1])));
          });
        }),
      t?.dataKey != null &&
        e.forEach((s) => {
          var l = by(Ye(s, t.dataKey));
          l != null && ((a = a == null ? l[0] : Math.min(a, l[0])), (o = o == null ? l[1] : Math.max(o, l[1])));
        }),
      he(a) && he(o))
    )
      return [a, o];
  },
  n2 = I([Hh, _t, GL, Vh, st], YS, { memoizeOptions: { resultEqualityCheck: Vl } });
function i2(e) {
  var { value: t } = e;
  if (Sr(t) || t instanceof Date) return t;
}
var a2 = (e, t, r) => {
    var n = e.map(i2).filter((i) => i != null);
    return r && (t.dataKey == null || (t.allowDuplicatedCategory && lx(n)))
      ? E0(0, e.length)
      : t.allowDuplicatedCategory
        ? n
        : Array.from(new Set(n));
  },
  XS = (e) => e.referenceElements.dots,
  Ri = (e, t, r) =>
    e.filter((n) => n.ifOverflow === 'extendDomain').filter((n) => (t === 'xAxis' ? n.xAxisId === r : n.yAxisId === r)),
  o2 = I([XS, st, Wl], Ri),
  ZS = (e) => e.referenceElements.areas,
  s2 = I([ZS, st, Wl], Ri),
  JS = (e) => e.referenceElements.lines,
  l2 = I([JS, st, Wl], Ri),
  QS = (e, t) => {
    if (e != null) {
      var r = qr(e.map((n) => (t === 'xAxis' ? n.x : n.y)));
      if (r.length !== 0) return [Math.min(...r), Math.max(...r)];
    }
  },
  c2 = I(o2, st, QS),
  eA = (e, t) => {
    if (e != null) {
      var r = qr(e.flatMap((n) => [t === 'xAxis' ? n.x1 : n.y1, t === 'xAxis' ? n.x2 : n.y2]));
      if (r.length !== 0) return [Math.min(...r), Math.max(...r)];
    }
  },
  u2 = I([s2, st], eA);
function f2(e) {
  var t;
  if (e.x != null) return qr([e.x]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.x);
  return r == null || r.length === 0 ? [] : qr(r);
}
function d2(e) {
  var t;
  if (e.y != null) return qr([e.y]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.y);
  return r == null || r.length === 0 ? [] : qr(r);
}
var tA = (e, t) => {
    if (e != null) {
      var r = e.flatMap((n) => (t === 'xAxis' ? f2(n) : d2(n)));
      if (r.length !== 0) return [Math.min(...r), Math.max(...r)];
    }
  },
  h2 = I([l2, st], tA),
  m2 = I(c2, h2, u2, (e, t, r) => Js(e, r, t)),
  rA = (e, t, r, n, i, a, o, s) => {
    if (r != null) return r;
    var l = (o === 'vertical' && s === 'xAxis') || (o === 'horizontal' && s === 'yAxis'),
      c = l ? Js(n, a, i) : Js(a, i);
    return VM(t, c, e.allowDataOverflow);
  },
  p2 = I([_t, VS, GS, t2, n2, m2, Ce, st], rA, { memoizeOptions: { resultEqualityCheck: Vl } }),
  v2 = [0, 1],
  nA = (e, t, r, n, i, a, o) => {
    if (!((e == null || r == null || r.length === 0) && o === void 0)) {
      var { dataKey: s, type: l } = e,
        c = Cr(t, a);
      if (c && s == null) {
        var u;
        return E0(0, (u = r?.length) !== null && u !== void 0 ? u : 0);
      }
      return l === 'category' ? a2(n, e, c) : i === 'expand' ? v2 : o;
    }
  },
  Gh = I([_t, Ce, Hh, io, Bl, st, p2], nA),
  Li = I([_t, RS, hh], IS),
  iA = (e, t, r) => {
    var { niceTicks: n } = t;
    if (n !== 'none') {
      var i = qh(t),
        a = Array.isArray(i) && (i[0] === 'auto' || i[1] === 'auto');
      if ((n === 'snap125' || n === 'adaptive') && t != null && t.tickCount && wr(e)) {
        if (a) return kg(e, t.tickCount, t.allowDecimals, n);
        if (t.type === 'number') return jg(e, t.tickCount, t.allowDecimals, n);
      }
      if (n === 'auto' && r === 'linear' && t != null && t.tickCount) {
        if (a && wr(e)) return kg(e, t.tickCount, t.allowDecimals, 'adaptive');
        if (t.type === 'number' && wr(e)) return jg(e, t.tickCount, t.allowDecimals, 'adaptive');
      }
    }
  },
  Yh = I([Gh, ro, Li], iA),
  aA = (e, t, r, n) => {
    if (n !== 'angleAxis' && e?.type === 'number' && wr(t) && Array.isArray(r) && r.length > 0) {
      var i,
        a,
        o = t[0],
        s = (i = r[0]) !== null && i !== void 0 ? i : 0,
        l = t[1],
        c = (a = r[r.length - 1]) !== null && a !== void 0 ? a : 0;
      return [Math.min(o, s), Math.max(l, c)];
    }
    return t;
  },
  g2 = I([_t, Gh, Yh, st], aA),
  y2 = I(io, _t, (e, t) => {
    if (!(!t || t.type !== 'number')) {
      var r = 1 / 0,
        n = Array.from(qr(e.map((f) => f.value))).sort((f, h) => f - h),
        i = n[0],
        a = n[n.length - 1];
      if (i == null || a == null) return 1 / 0;
      var o = a - i;
      if (o === 0) return 1 / 0;
      for (var s = 0; s < n.length - 1; s++) {
        var l = n[s],
          c = n[s + 1];
        if (!(l == null || c == null)) {
          var u = c - l;
          r = Math.min(r, u);
        }
      }
      return r / o;
    }
  }),
  oA = I(
    y2,
    Ce,
    W0,
    ot,
    (e, t, r, n, i) => i,
    (e, t, r, n, i) => {
      if (!he(e)) return 0;
      var a = t === 'vertical' ? n.height : n.width;
      if (i === 'gap') return (e * a) / 2;
      if (i === 'no-gap') {
        var o = lr(r, e * a),
          s = (e * a) / 2;
        return s - o - ((s - o) / a) * o;
      }
      return 0;
    },
  ),
  b2 = (e, t, r) => {
    var n = Zr(e, t);
    return n == null || typeof n.padding != 'string' ? 0 : oA(e, 'xAxis', t, r, n.padding);
  },
  w2 = (e, t, r) => {
    var n = Jr(e, t);
    return n == null || typeof n.padding != 'string' ? 0 : oA(e, 'yAxis', t, r, n.padding);
  },
  x2 = I(Zr, b2, (e, t) => {
    var r, n;
    if (e == null) return { left: 0, right: 0 };
    var { padding: i } = e;
    return typeof i == 'string'
      ? { left: t, right: t }
      : {
          left: ((r = i.left) !== null && r !== void 0 ? r : 0) + t,
          right: ((n = i.right) !== null && n !== void 0 ? n : 0) + t,
        };
  }),
  S2 = I(Jr, w2, (e, t) => {
    var r, n;
    if (e == null) return { top: 0, bottom: 0 };
    var { padding: i } = e;
    return typeof i == 'string'
      ? { top: t, bottom: t }
      : {
          top: ((r = i.top) !== null && r !== void 0 ? r : 0) + t,
          bottom: ((n = i.bottom) !== null && n !== void 0 ? n : 0) + t,
        };
  }),
  A2 = I([ot, x2, Tl, Il, (e, t, r) => r], (e, t, r, n, i) => {
    var { padding: a } = n;
    return i ? [a.left, r.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
  }),
  P2 = I([ot, Ce, S2, Tl, Il, (e, t, r) => r], (e, t, r, n, i, a) => {
    var { padding: o } = i;
    return a
      ? [n.height - o.bottom, o.top]
      : t === 'horizontal'
        ? [e.top + e.height - r.bottom, e.top + r.top]
        : [e.top + r.top, e.top + e.height - r.bottom];
  }),
  oo = (e, t, r, n) => {
    var i;
    switch (t) {
      case 'xAxis':
        return A2(e, r, n);
      case 'yAxis':
        return P2(e, r, n);
      case 'zAxis':
        return (i = Wh(e, r)) === null || i === void 0 ? void 0 : i.range;
      case 'angleAxis':
        return Y0(e);
      case 'radiusAxis':
        return X0(e, r);
      default:
        return;
    }
  },
  sA = I([_t, oo], Ul),
  C2 = I([Li, g2], lD),
  Xh = I([_t, Li, C2, sA], Kh),
  lA = (e, t, r, n) => {
    if (!(r == null || r.dataKey == null)) {
      var { type: i, scale: a } = r,
        o = Cr(e, n);
      if (o && (i === 'number' || a !== 'auto')) return t.map((s) => s.value);
    }
  },
  Zh = I([Ce, io, ro, st], lA),
  rc = I([Xh], bh);
I([Xh], UL);
I([Xh, ZL], TS);
I([no, Vh, st], r2);
function cA(e, t) {
  return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}
var nc = (e, t) => t,
  ic = (e, t, r) => r,
  O2 = I(jl, nc, ic, (e, t, r) =>
    e
      .filter((n) => n.orientation === t)
      .filter((n) => n.mirror === r)
      .sort(cA),
  ),
  _2 = I(Nl, nc, ic, (e, t, r) =>
    e
      .filter((n) => n.orientation === t)
      .filter((n) => n.mirror === r)
      .sort(cA),
  ),
  uA = (e, t) => ({ width: e.width, height: t.height }),
  E2 = (e, t) => {
    var r = typeof t.width == 'number' ? t.width : Va;
    return { width: r, height: e.height };
  },
  fA = I(ot, Zr, uA),
  k2 = (e, t, r) => {
    switch (t) {
      case 'top':
        return e.top;
      case 'bottom':
        return r - e.bottom;
      default:
        return 0;
    }
  },
  j2 = (e, t, r) => {
    switch (t) {
      case 'left':
        return e.left;
      case 'right':
        return r - e.right;
      default:
        return 0;
    }
  },
  N2 = I(Gr, ot, O2, nc, ic, (e, t, r, n, i) => {
    var a = {},
      o;
    return (
      r.forEach((s) => {
        var l = uA(t, s);
        o == null && (o = k2(t, n, e));
        var c = (n === 'top' && !i) || (n === 'bottom' && i);
        ((a[s.id] = o - Number(c) * l.height), (o += (c ? -1 : 1) * l.height));
      }),
      a
    );
  }),
  I2 = I(Vr, ot, _2, nc, ic, (e, t, r, n, i) => {
    var a = {},
      o;
    return (
      r.forEach((s) => {
        var l = E2(t, s);
        o == null && (o = j2(t, n, e));
        var c = (n === 'left' && !i) || (n === 'right' && i);
        ((a[s.id] = o - Number(c) * l.width), (o += (c ? -1 : 1) * l.width));
      }),
      a
    );
  }),
  T2 = (e, t) => {
    var r = Zr(e, t);
    if (r != null) return N2(e, r.orientation, r.mirror);
  },
  M2 = I([ot, Zr, T2, (e, t) => t], (e, t, r, n) => {
    if (t != null) {
      var i = r?.[n];
      return i == null ? { x: e.left, y: 0 } : { x: e.left, y: i };
    }
  }),
  D2 = (e, t) => {
    var r = Jr(e, t);
    if (r != null) return I2(e, r.orientation, r.mirror);
  },
  R2 = I([ot, Jr, D2, (e, t) => t], (e, t, r, n) => {
    if (t != null) {
      var i = r?.[n];
      return i == null ? { x: 0, y: e.top } : { x: i, y: e.top };
    }
  }),
  dA = I(ot, Jr, (e, t) => {
    var r = typeof t.width == 'number' ? t.width : Va;
    return { width: r, height: e.height };
  }),
  wy = (e, t, r) => {
    switch (t) {
      case 'xAxis':
        return fA(e, r).width;
      case 'yAxis':
        return dA(e, r).height;
      default:
        return;
    }
  },
  hA = (e, t, r, n) => {
    if (r != null) {
      var { allowDuplicatedCategory: i, type: a, dataKey: o } = r,
        s = Cr(e, n),
        l = t.map((c) => c.value);
      if (o && s && a === 'category' && i && lx(l)) return l;
    }
  },
  Jh = I([Ce, io, _t, st], hA),
  xy = I([Ce, qL, Li, rc, Jh, Zh, oo, Yh, st], (e, t, r, n, i, a, o, s, l) => {
    if (t != null) {
      var c = Cr(e, l);
      return {
        angle: t.angle,
        interval: t.interval,
        minTickGap: t.minTickGap,
        orientation: t.orientation,
        tick: t.tick,
        tickCount: t.tickCount,
        tickFormatter: t.tickFormatter,
        ticks: t.ticks,
        type: t.type,
        unit: t.unit,
        axisType: l,
        categoricalDomain: a,
        duplicateDomain: i,
        isCategorical: c,
        niceTicks: s,
        range: o,
        realScaleType: r,
        scale: n,
      };
    }
  }),
  L2 = (e, t, r, n, i, a, o, s, l) => {
    if (!(t == null || n == null)) {
      var c = Cr(e, l),
        { type: u, ticks: f, tickCount: h } = t,
        m = r === 'scaleBand' && typeof n.bandwidth == 'function' ? n.bandwidth() / 2 : 2,
        p = u === 'category' && n.bandwidth ? n.bandwidth() / m : 0;
      p = l === 'angleAxis' && a != null && a.length >= 2 ? Nt(a[0] - a[1]) * 2 * p : p;
      var v = f || i;
      return v
        ? v
            .map((g, b) => {
              var S = o ? o.indexOf(g) : g,
                x = n.map(S);
              return he(x) ? { index: b, coordinate: x + p, value: g, offset: p } : null;
            })
            .filter(It)
        : c && s
          ? s
              .map((g, b) => {
                var S = n.map(g);
                return he(S) ? { coordinate: S + p, value: g, index: b, offset: p } : null;
              })
              .filter(It)
          : n.ticks
            ? n
                .ticks(h)
                .map((g, b) => {
                  var S = n.map(g);
                  return he(S) ? { coordinate: S + p, value: g, index: b, offset: p } : null;
                })
                .filter(It)
            : n
                .domain()
                .map((g, b) => {
                  var S = n.map(g);
                  return he(S) ? { coordinate: S + p, value: o ? o[g] : g, index: b, offset: p } : null;
                })
                .filter(It);
    }
  },
  mA = I([Ce, ro, Li, rc, Yh, oo, Jh, Zh, st], L2),
  $2 = (e, t, r, n, i, a, o) => {
    if (!(t == null || r == null || n == null || n[0] === n[1])) {
      var s = Cr(e, o),
        { tickCount: l } = t,
        c = 0;
      return (
        (c = o === 'angleAxis' && n?.length >= 2 ? Nt(n[0] - n[1]) * 2 * c : c),
        s && a
          ? a
              .map((u, f) => {
                var h = r.map(u);
                return he(h) ? { coordinate: h + c, value: u, index: f, offset: c } : null;
              })
              .filter(It)
          : r.ticks
            ? r
                .ticks(l)
                .map((u, f) => {
                  var h = r.map(u);
                  return he(h) ? { coordinate: h + c, value: u, index: f, offset: c } : null;
                })
                .filter(It)
            : r
                .domain()
                .map((u, f) => {
                  var h = r.map(u);
                  return he(h) ? { coordinate: h + c, value: i ? i[u] : u, index: f, offset: c } : null;
                })
                .filter(It)
      );
    }
  },
  gn = I([Ce, ro, rc, oo, Jh, Zh, st], $2),
  yn = I(_t, rc, (e, t) => {
    if (!(e == null || t == null)) return Xs(Xs({}, e), {}, { scale: t });
  }),
  F2 = I([_t, Li, Gh, sA], Kh),
  B2 = I([F2], bh);
I(
  (e, t, r) => Wh(e, r),
  B2,
  (e, t) => {
    if (!(e == null || t == null)) return Xs(Xs({}, e), {}, { scale: t });
  },
);
var U2 = I([Ce, jl, Nl], (e, t, r) => {
    switch (e) {
      case 'horizontal':
        return t.some((n) => n.reversed) ? 'right-to-left' : 'left-to-right';
      case 'vertical':
        return r.some((n) => n.reversed) ? 'bottom-to-top' : 'top-to-bottom';
      case 'centric':
      case 'radial':
        return 'left-to-right';
      default:
        return;
    }
  }),
  z2 = (e, t, r) => {
    var n;
    return (n = e.renderedTicks[t]) === null || n === void 0 ? void 0 : n[r];
  };
I([z2], (e) => {
  if (!(!e || e.length === 0))
    return (t) => {
      var r,
        n = 1 / 0,
        i = e[0];
      for (var a of e) {
        var o = Math.abs(a.coordinate - t);
        o < n && ((n = o), (i = a));
      }
      return (r = i) === null || r === void 0 ? void 0 : r.value;
    };
});
var pA = (e) => e.options.defaultTooltipEventType,
  vA = (e) => e.options.validateTooltipEventTypes;
function gA(e, t, r) {
  if (e == null) return t;
  var n = e ? 'axis' : 'item';
  return r == null ? t : r.includes(n) ? n : t;
}
function Qh(e, t) {
  var r = pA(e),
    n = vA(e);
  return gA(t, r, n);
}
function K2(e) {
  return re((t) => Qh(t, e));
}
var yA = (e, t) => {
    var r,
      n = Number(t);
    if (!(sr(n) || t == null))
      return n >= 0 ? (e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value) : void 0;
  },
  W2 = (e) => e.tooltip.settings,
  un = { active: !1, index: null, dataKey: void 0, graphicalItemId: void 0, coordinate: void 0 },
  H2 = {
    itemInteraction: { click: un, hover: un },
    axisInteraction: { click: un, hover: un },
    keyboardInteraction: un,
    syncInteraction: {
      active: !1,
      index: null,
      dataKey: void 0,
      label: void 0,
      coordinate: void 0,
      sourceViewBox: void 0,
      graphicalItemId: void 0,
    },
    tooltipItemPayloads: [],
    settings: { shared: void 0, trigger: 'hover', axisId: 0, active: !1, defaultIndex: void 0 },
  },
  bA = bt({
    name: 'tooltip',
    initialState: H2,
    reducers: {
      addTooltipEntrySettings: {
        reducer(e, t) {
          e.tooltipItemPayloads.push(t.payload);
        },
        prepare: Te(),
      },
      replaceTooltipEntrySettings: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload,
            i = Xt(e).tooltipItemPayloads.indexOf(r);
          i > -1 && (e.tooltipItemPayloads[i] = n);
        },
        prepare: Te(),
      },
      removeTooltipEntrySettings: {
        reducer(e, t) {
          var r = Xt(e).tooltipItemPayloads.indexOf(t.payload);
          r > -1 && e.tooltipItemPayloads.splice(r, 1);
        },
        prepare: Te(),
      },
      setTooltipSettingsState(e, t) {
        e.settings = t.payload;
      },
      setActiveMouseOverItemIndex(e, t) {
        ((e.syncInteraction.active = !1),
          (e.keyboardInteraction.active = !1),
          (e.itemInteraction.hover.active = !0),
          (e.itemInteraction.hover.index = t.payload.activeIndex),
          (e.itemInteraction.hover.dataKey = t.payload.activeDataKey),
          (e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId),
          (e.itemInteraction.hover.coordinate = t.payload.activeCoordinate));
      },
      mouseLeaveChart(e) {
        ((e.itemInteraction.hover.active = !1), (e.axisInteraction.hover.active = !1));
      },
      mouseLeaveItem(e) {
        e.itemInteraction.hover.active = !1;
      },
      setActiveClickItemIndex(e, t) {
        ((e.syncInteraction.active = !1),
          (e.itemInteraction.click.active = !0),
          (e.keyboardInteraction.active = !1),
          (e.itemInteraction.click.index = t.payload.activeIndex),
          (e.itemInteraction.click.dataKey = t.payload.activeDataKey),
          (e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId),
          (e.itemInteraction.click.coordinate = t.payload.activeCoordinate));
      },
      setMouseOverAxisIndex(e, t) {
        ((e.syncInteraction.active = !1),
          (e.axisInteraction.hover.active = !0),
          (e.keyboardInteraction.active = !1),
          (e.axisInteraction.hover.index = t.payload.activeIndex),
          (e.axisInteraction.hover.dataKey = t.payload.activeDataKey),
          (e.axisInteraction.hover.coordinate = t.payload.activeCoordinate));
      },
      setMouseClickAxisIndex(e, t) {
        ((e.syncInteraction.active = !1),
          (e.keyboardInteraction.active = !1),
          (e.axisInteraction.click.active = !0),
          (e.axisInteraction.click.index = t.payload.activeIndex),
          (e.axisInteraction.click.dataKey = t.payload.activeDataKey),
          (e.axisInteraction.click.coordinate = t.payload.activeCoordinate));
      },
      setSyncInteraction(e, t) {
        e.syncInteraction = t.payload;
      },
      setKeyboardInteraction(e, t) {
        ((e.keyboardInteraction.active = t.payload.active),
          (e.keyboardInteraction.index = t.payload.activeIndex),
          (e.keyboardInteraction.coordinate = t.payload.activeCoordinate));
      },
    },
  }),
  {
    addTooltipEntrySettings: q2,
    replaceTooltipEntrySettings: V2,
    removeTooltipEntrySettings: G2,
    setTooltipSettingsState: Y2,
    setActiveMouseOverItemIndex: wA,
    mouseLeaveItem: X2,
    mouseLeaveChart: xA,
    setActiveClickItemIndex: Z2,
    setMouseOverAxisIndex: SA,
    setMouseClickAxisIndex: J2,
    setSyncInteraction: hd,
    setKeyboardInteraction: Qs,
  } = bA.actions,
  Q2 = bA.reducer;
function Sy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Go(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Sy(Object(r), !0).forEach(function (n) {
          e$(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Sy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function e$(e, t, r) {
  return (
    (t = t$(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function t$(e) {
  var t = r$(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function r$(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function n$(e, t, r) {
  return t === 'axis'
    ? r === 'click'
      ? e.axisInteraction.click
      : e.axisInteraction.hover
    : r === 'click'
      ? e.itemInteraction.click
      : e.itemInteraction.hover;
}
function i$(e) {
  return e.index != null;
}
var AA = (e, t, r, n) => {
  if (t == null) return un;
  var i = n$(e, t, r);
  if (i == null) return un;
  if (i.active) return i;
  if (e.keyboardInteraction.active) return e.keyboardInteraction;
  if (e.syncInteraction.active && e.syncInteraction.index != null) return e.syncInteraction;
  var a = e.settings.active === !0;
  if (i$(i)) {
    if (a) return Go(Go({}, i), {}, { active: !0 });
  } else if (n != null) return { active: !0, coordinate: void 0, dataKey: void 0, index: n, graphicalItemId: void 0 };
  return Go(Go({}, un), {}, { coordinate: i.coordinate });
};
function a$(e) {
  if (typeof e == 'number') return Number.isFinite(e) ? e : void 0;
  if (e instanceof Date) {
    var t = e.valueOf();
    return Number.isFinite(t) ? t : void 0;
  }
  var r = Number(e);
  return Number.isFinite(r) ? r : void 0;
}
function o$(e, t) {
  var r = a$(e),
    n = t[0],
    i = t[1];
  if (r === void 0) return !1;
  var a = Math.min(n, i),
    o = Math.max(n, i);
  return r >= a && r <= o;
}
function s$(e, t, r) {
  if (r == null || t == null) return !0;
  var n = Ye(e, t);
  return n == null || !wr(r) ? !0 : o$(n, r);
}
var em = (e, t, r, n) => {
    var i = e?.index;
    if (i == null) return null;
    var a = Number(i);
    if (!he(a)) return i;
    var o = 0,
      s = 1 / 0;
    t.length > 0 && (s = t.length - 1);
    var l = Math.max(o, Math.min(a, s)),
      c = t[l];
    return c == null || s$(c, r, n) ? String(l) : null;
  },
  PA = (e, t, r, n, i, a, o) => {
    if (a != null) {
      var s = o[0],
        l = s?.getPosition(a);
      if (l != null) return l;
      var c = i?.[Number(a)];
      if (c)
        return r === 'horizontal' ? { x: c.coordinate, y: (n.top + t) / 2 } : { x: (n.left + e) / 2, y: c.coordinate };
    }
  },
  CA = (e, t, r, n) => {
    if (t === 'axis') return e.tooltipItemPayloads;
    if (e.tooltipItemPayloads.length === 0) return [];
    var i;
    if (
      (r === 'hover' ? (i = e.itemInteraction.hover.graphicalItemId) : (i = e.itemInteraction.click.graphicalItemId),
      e.syncInteraction.active && i == null)
    )
      return e.tooltipItemPayloads;
    if (i == null && n != null) {
      var a = e.tooltipItemPayloads[0];
      return a != null ? [a] : [];
    }
    return e.tooltipItemPayloads.filter((o) => {
      var s;
      return ((s = o.settings) === null || s === void 0 ? void 0 : s.graphicalItemId) === i;
    });
  },
  OA = (e) => e.options.tooltipPayloadSearcher,
  $i = (e) => e.tooltip;
function Ay(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Py(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ay(Object(r), !0).forEach(function (n) {
          l$(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ay(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function l$(e, t, r) {
  return (
    (t = c$(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function c$(e) {
  var t = u$(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function u$(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function f$(e) {
  if (typeof e == 'string' || typeof e == 'number') return e;
}
function d$(e) {
  if (typeof e == 'string' || typeof e == 'number' || typeof e == 'boolean') return e;
}
function h$(e) {
  if (typeof e == 'string' || typeof e == 'number') return e;
  if (typeof e == 'function') return (t) => e(t);
}
function Cy(e) {
  if (typeof e == 'string') return e;
}
function m$(e) {
  if (!(e == null || typeof e != 'object')) {
    var t = 'name' in e ? f$(e.name) : void 0,
      r = 'unit' in e ? d$(e.unit) : void 0,
      n = 'dataKey' in e ? h$(e.dataKey) : void 0,
      i = 'payload' in e ? e.payload : void 0,
      a = 'color' in e ? Cy(e.color) : void 0,
      o = 'fill' in e ? Cy(e.fill) : void 0;
    return { name: t, unit: r, dataKey: n, payload: i, color: a, fill: o };
  }
}
function p$(e, t) {
  return e ?? t;
}
var _A = (e, t, r, n, i, a, o) => {
    if (!(t == null || a == null)) {
      var { chartData: s, computedData: l, dataStartIndex: c, dataEndIndex: u } = r,
        f = [];
      return e.reduce((h, m) => {
        var p,
          { dataDefinedOnItem: v, settings: g } = m,
          b = p$(v, s),
          S = Array.isArray(b) ? t0(b, c, u) : b,
          x = (p = g?.dataKey) !== null && p !== void 0 ? p : n,
          A = g?.nameKey,
          C;
        if (
          (n && Array.isArray(S) && !Array.isArray(S[0]) && o === 'axis' ? (C = cx(S, n, i)) : (C = a(S, t, l, A)),
          Array.isArray(C))
        )
          C.forEach((_) => {
            var E,
              j,
              N = m$(_),
              M = N?.name,
              O = N?.dataKey,
              D = N?.payload,
              B = Py(
                Py({}, g),
                {},
                {
                  name: M,
                  unit: N?.unit,
                  color: (E = N?.color) !== null && E !== void 0 ? E : g?.color,
                  fill: (j = N?.fill) !== null && j !== void 0 ? j : g?.fill,
                },
              );
            h.push(
              Pv({
                tooltipEntrySettings: B,
                dataKey: O,
                payload: D,
                value: Ye(D, O),
                name: M == null ? void 0 : String(M),
              }),
            );
          });
        else {
          var P;
          h.push(
            Pv({
              tooltipEntrySettings: g,
              dataKey: x,
              payload: C,
              value: Ye(C, x),
              name: (P = Ye(C, A)) !== null && P !== void 0 ? P : g?.name,
            }),
          );
        }
        return h;
      }, f);
    }
  },
  tm = I([tt, RS, hh], IS),
  v$ = I([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
  g$ = I([lt, Mi], LS),
  Fi = I([v$, tt, g$], $S, { memoizeOptions: { resultEqualityCheck: Gl } }),
  y$ = I([Fi], (e) => e.filter(ql)),
  b$ = I([Fi], US, { memoizeOptions: { resultEqualityCheck: Gl } }),
  Bi = I([b$, Yr], zS),
  w$ = I([y$, Yr, tt], J0),
  rm = I([Bi, tt, Fi], KS),
  EA = I([tt], qh),
  x$ = I([tt], (e) => e.allowDataOverflow),
  kA = I([EA, x$], I0),
  S$ = I([Fi], (e) => e.filter(ql)),
  A$ = I([w$, S$, Bl, H0], HS),
  P$ = I([A$, Yr, lt, kA], qS),
  C$ = I([Fi], BS),
  O$ = I([Bi, tt, C$, Vh, lt], YS, { memoizeOptions: { resultEqualityCheck: Vl } }),
  _$ = I([XS, lt, Mi], Ri),
  E$ = I([_$, lt], QS),
  k$ = I([ZS, lt, Mi], Ri),
  j$ = I([k$, lt], eA),
  N$ = I([JS, lt, Mi], Ri),
  I$ = I([N$, lt], tA),
  T$ = I([E$, I$, j$], Js),
  M$ = I([tt, EA, kA, P$, O$, T$, Ce, lt], rA),
  so = I([tt, Ce, Bi, rm, Bl, lt, M$], nA),
  D$ = I([so, tt, tm], iA),
  R$ = I([tt, so, D$, lt], aA),
  jA = (e) => {
    var t = lt(e),
      r = Mi(e),
      n = !1;
    return oo(e, t, r, n);
  },
  NA = I([tt, jA], Ul),
  L$ = I([tt, tm, R$, NA], Kh),
  IA = I([L$], bh),
  $$ = I([Ce, rm, tt, lt], hA),
  F$ = I([Ce, rm, tt, lt], lA),
  B$ = (e, t, r, n, i, a, o, s) => {
    if (t) {
      var { type: l } = t,
        c = Cr(e, s);
      if (n) {
        var u = r === 'scaleBand' && n.bandwidth ? n.bandwidth() / 2 : 2,
          f = l === 'category' && n.bandwidth ? n.bandwidth() / u : 0;
        return (
          (f = s === 'angleAxis' && i != null && i?.length >= 2 ? Nt(i[0] - i[1]) * 2 * f : f),
          c && o
            ? o
                .map((h, m) => {
                  var p = n.map(h);
                  return he(p) ? { coordinate: p + f, value: h, index: m, offset: f } : null;
                })
                .filter(It)
            : n
                .domain()
                .map((h, m) => {
                  var p = n.map(h);
                  return he(p) ? { coordinate: p + f, value: a ? a[h] : h, index: m, offset: f } : null;
                })
                .filter(It)
        );
      }
    }
  },
  Qr = I([Ce, tt, tm, IA, jA, $$, F$, lt], B$),
  nm = I([pA, vA, W2], (e, t, r) => gA(r.shared, e, t)),
  TA = (e) => e.tooltip.settings.trigger,
  im = (e) => e.tooltip.settings.defaultIndex,
  lo = I([$i, nm, TA, im], AA),
  Hn = I([lo, Bi, ao, so], em),
  MA = I([Qr, Hn], yA),
  DA = I([lo], (e) => {
    if (e) return e.dataKey;
  }),
  U$ = I([lo], (e) => {
    if (e) return e.graphicalItemId;
  }),
  RA = I([$i, nm, TA, im], CA),
  z$ = I([Vr, Gr, Ce, ot, Qr, im, RA], PA),
  K$ = I([lo, z$], (e, t) => (e != null && e.coordinate ? e.coordinate : t)),
  W$ = I([lo], (e) => {
    var t;
    return (t = e?.active) !== null && t !== void 0 ? t : !1;
  }),
  H$ = I([RA, Hn, Yr, ao, MA, OA, nm], _A),
  q$ = I([H$], (e) => {
    if (e != null) {
      var t = e.map((r) => r.payload).filter((r) => r != null);
      return Array.from(new Set(t));
    }
  });
function Oy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function _y(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Oy(Object(r), !0).forEach(function (n) {
          V$(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Oy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function V$(e, t, r) {
  return (
    (t = G$(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function G$(e) {
  var t = Y$(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function Y$(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var X$ = () => re(tt),
  Z$ = () => {
    var e = X$(),
      t = re(Qr),
      r = re(IA);
    return Pi(!e || !r ? void 0 : _y(_y({}, e), {}, { scale: r }), t);
  };
function Ey(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function si(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ey(Object(r), !0).forEach(function (n) {
          J$(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ey(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function J$(e, t, r) {
  return (
    (t = Q$(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Q$(e) {
  var t = eF(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function eF(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var tF = (e, t, r, n) => {
    var i = t.find((a) => a && a.index === r);
    if (i) {
      if (e === 'horizontal') return { x: i.coordinate, y: n.relativeY };
      if (e === 'vertical') return { x: n.relativeX, y: i.coordinate };
    }
    return { x: 0, y: 0 };
  },
  rF = (e, t, r, n) => {
    var i = t.find((c) => c && c.index === r);
    if (i) {
      if (e === 'centric') {
        var a = i.coordinate,
          { radius: o } = n;
        return si(si(si({}, n), mt(n.cx, n.cy, o, a)), {}, { angle: a, radius: o });
      }
      var s = i.coordinate,
        { angle: l } = n;
      return si(si(si({}, n), mt(n.cx, n.cy, s, l)), {}, { angle: l, radius: s });
    }
    return {
      angle: 0,
      clockWise: !1,
      cx: 0,
      cy: 0,
      endAngle: 0,
      innerRadius: 0,
      outerRadius: 0,
      radius: 0,
      startAngle: 0,
      x: 0,
      y: 0,
    };
  };
function nF(e, t) {
  var { relativeX: r, relativeY: n } = e;
  return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
}
var LA = (e, t, r, n, i) => {
    var a,
      o = (a = t?.length) !== null && a !== void 0 ? a : 0;
    if (o <= 1 || e == null) return 0;
    if (n === 'angleAxis' && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6)
      for (var s = 0; s < o; s++) {
        var l,
          c,
          u,
          f,
          h,
          m =
            s > 0
              ? (l = r[s - 1]) === null || l === void 0
                ? void 0
                : l.coordinate
              : (c = r[o - 1]) === null || c === void 0
                ? void 0
                : c.coordinate,
          p = (u = r[s]) === null || u === void 0 ? void 0 : u.coordinate,
          v =
            s >= o - 1
              ? (f = r[0]) === null || f === void 0
                ? void 0
                : f.coordinate
              : (h = r[s + 1]) === null || h === void 0
                ? void 0
                : h.coordinate,
          g = void 0;
        if (!(m == null || p == null || v == null))
          if (Nt(p - m) !== Nt(v - p)) {
            var b = [];
            if (Nt(v - p) === Nt(i[1] - i[0])) {
              g = v;
              var S = p + i[1] - i[0];
              ((b[0] = Math.min(S, (S + m) / 2)), (b[1] = Math.max(S, (S + m) / 2)));
            } else {
              g = m;
              var x = v + i[1] - i[0];
              ((b[0] = Math.min(p, (x + p) / 2)), (b[1] = Math.max(p, (x + p) / 2)));
            }
            var A = [Math.min(p, (g + p) / 2), Math.max(p, (g + p) / 2)];
            if ((e > A[0] && e <= A[1]) || (e >= b[0] && e <= b[1])) {
              var C;
              return (C = r[s]) === null || C === void 0 ? void 0 : C.index;
            }
          } else {
            var P = Math.min(m, v),
              _ = Math.max(m, v);
            if (e > (P + p) / 2 && e <= (_ + p) / 2) {
              var E;
              return (E = r[s]) === null || E === void 0 ? void 0 : E.index;
            }
          }
      }
    else if (t)
      for (var j = 0; j < o; j++) {
        var N = t[j];
        if (N != null) {
          var M = t[j + 1],
            O = t[j - 1];
          if (
            (j === 0 && M != null && e <= (N.coordinate + M.coordinate) / 2) ||
            (j === o - 1 && O != null && e > (N.coordinate + O.coordinate) / 2) ||
            (j > 0 &&
              j < o - 1 &&
              O != null &&
              M != null &&
              e > (N.coordinate + O.coordinate) / 2 &&
              e <= (N.coordinate + M.coordinate) / 2)
          )
            return N.index;
        }
      }
    return -1;
  },
  $A = () => re(hh),
  am = (e, t) => t,
  FA = (e, t, r) => r,
  om = (e, t, r, n) => n,
  iF = I(Qr, (e) => bl(e, (t) => t.coordinate)),
  sm = I([$i, am, FA, om], AA),
  lm = I([sm, Bi, ao, so], em),
  aF = (e, t, r) => {
    if (t != null) {
      var n = $i(e);
      return t === 'axis'
        ? r === 'hover'
          ? n.axisInteraction.hover.dataKey
          : n.axisInteraction.click.dataKey
        : r === 'hover'
          ? n.itemInteraction.hover.dataKey
          : n.itemInteraction.click.dataKey;
    }
  },
  BA = I([$i, am, FA, om], CA),
  el = I([Vr, Gr, Ce, ot, Qr, om, BA], PA),
  oF = I([sm, el], (e, t) => {
    var r;
    return (r = e.coordinate) !== null && r !== void 0 ? r : t;
  }),
  UA = I([Qr, lm], yA),
  sF = I([BA, lm, Yr, ao, UA, OA, am], _A),
  lF = I([sm, lm], (e, t) => ({ isActive: e.active && t != null, activeIndex: t })),
  cF = (e, t, r, n, i, a, o) => {
    if (!(!e || !r || !n || !i) && nF(e, o)) {
      var s = wI(e, t),
        l = LA(s, a, i, r, n),
        c = tF(t, i, l, e);
      return { activeIndex: String(l), activeCoordinate: c };
    }
  },
  uF = (e, t, r, n, i, a, o) => {
    if (!(!e || !n || !i || !a || !r)) {
      var s = LM(e, r);
      if (s) {
        var l = xI(s, t),
          c = LA(l, o, a, n, i),
          u = rF(t, a, c, s);
        return { activeIndex: String(c), activeCoordinate: u };
      }
    }
  },
  fF = (e, t, r, n, i, a, o, s) => {
    if (!(!e || !t || !n || !i || !a))
      return t === 'horizontal' || t === 'vertical' ? cF(e, t, n, i, a, o, s) : uF(e, t, r, n, i, a, o);
  },
  dF = I(
    (e) => e.zIndex.zIndexMap,
    (e, t) => t,
    (e, t, r) => r,
    (e, t, r) => {
      if (t != null) {
        var n = e[t];
        if (n != null) return r ? n.panoramaElement : n.element;
      }
    },
  ),
  hF = I(
    (e) => e.zIndex.zIndexMap,
    (e) => {
      var t = Object.keys(e)
          .map((n) => parseInt(n, 10))
          .concat(Object.values(at)),
        r = Array.from(new Set(t));
      return r.sort((n, i) => n - i);
    },
    { memoizeOptions: { resultEqualityCheck: sD } },
  );
function ky(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function jy(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ky(Object(r), !0).forEach(function (n) {
          mF(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ky(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function mF(e, t, r) {
  return (
    (t = pF(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function pF(e) {
  var t = vF(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function vF(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var gF = {},
  yF = {
    zIndexMap: Object.values(at).reduce(
      (e, t) => jy(jy({}, e), {}, { [t]: { element: void 0, panoramaElement: void 0, consumers: 0 } }),
      gF,
    ),
  },
  bF = new Set(Object.values(at));
function wF(e) {
  return bF.has(e);
}
var zA = bt({
    name: 'zIndex',
    initialState: yF,
    reducers: {
      registerZIndexPortal: {
        reducer: (e, t) => {
          var { zIndex: r } = t.payload;
          e.zIndexMap[r]
            ? (e.zIndexMap[r].consumers += 1)
            : (e.zIndexMap[r] = { consumers: 1, element: void 0, panoramaElement: void 0 });
        },
        prepare: Te(),
      },
      unregisterZIndexPortal: {
        reducer: (e, t) => {
          var { zIndex: r } = t.payload;
          e.zIndexMap[r] &&
            ((e.zIndexMap[r].consumers -= 1), e.zIndexMap[r].consumers <= 0 && !wF(r) && delete e.zIndexMap[r]);
        },
        prepare: Te(),
      },
      registerZIndexPortalElement: {
        reducer: (e, t) => {
          var { zIndex: r, element: n, isPanorama: i } = t.payload;
          e.zIndexMap[r]
            ? i
              ? (e.zIndexMap[r].panoramaElement = n)
              : (e.zIndexMap[r].element = n)
            : (e.zIndexMap[r] = { consumers: 0, element: i ? void 0 : n, panoramaElement: i ? n : void 0 });
        },
        prepare: Te(),
      },
      unregisterZIndexPortalElement: {
        reducer: (e, t) => {
          var { zIndex: r } = t.payload;
          e.zIndexMap[r] &&
            (t.payload.isPanorama ? (e.zIndexMap[r].panoramaElement = void 0) : (e.zIndexMap[r].element = void 0));
        },
        prepare: Te(),
      },
    },
  }),
  {
    registerZIndexPortal: xF,
    unregisterZIndexPortal: SF,
    registerZIndexPortalElement: AF,
    unregisterZIndexPortalElement: PF,
  } = zA.actions,
  CF = zA.reducer;
function rr(e) {
  var { zIndex: t, children: r } = e,
    n = $I(),
    i = n && t !== void 0 && t !== 0,
    a = wt(),
    o = Ke();
  d.useLayoutEffect(
    () =>
      i
        ? (o(xF({ zIndex: t })),
          () => {
            o(SF({ zIndex: t }));
          })
        : Gn,
    [o, t, i],
  );
  var s = re((l) => dF(l, t, a));
  return i ? (s ? rw.createPortal(r, s) : null) : r;
}
function md() {
  return (
    (md = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    md.apply(null, arguments)
  );
}
function Ny(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Yo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ny(Object(r), !0).forEach(function (n) {
          OF(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ny(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function OF(e, t, r) {
  return (
    (t = _F(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function _F(e) {
  var t = EF(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function EF(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function kF(e) {
  var { cursor: t, cursorComp: r, cursorProps: n } = e;
  return d.isValidElement(t) ? d.cloneElement(t, n) : d.createElement(r, n);
}
function jF(e) {
  var t,
    {
      coordinate: r,
      payload: n,
      index: i,
      offset: a,
      tooltipAxisBandSize: o,
      layout: s,
      cursor: l,
      tooltipEventType: c,
      chartName: u,
    } = e,
    f = r,
    h = n,
    m = i;
  if (!l || !f || (u !== 'ScatterChart' && c !== 'axis')) return null;
  var p, v, g;
  if (u === 'ScatterChart') ((p = f), (v = ZT), (g = at.cursorLine));
  else if (u === 'BarChart') ((p = JT(s, f, a, o)), (v = P0), (g = at.cursorRectangle));
  else if (s === 'radial' && dx(f)) {
    var { cx: b, cy: S, radius: x, startAngle: A, endAngle: C } = C0(f);
    ((p = { cx: b, cy: S, startAngle: A, endAngle: C, innerRadius: x, outerRadius: x }), (v = _0), (g = at.cursorLine));
  } else ((p = { points: UM(s, f, a) }), (v = wa), (g = at.cursorLine));
  var P = typeof l == 'object' && 'className' in l ? l.className : void 0,
    _ = Yo(
      Yo(Yo(Yo({ stroke: '#ccc', pointerEvents: 'none' }, a), p), Ka(l)),
      {},
      { payload: h, payloadIndex: m, className: Ne('recharts-tooltip-cursor', P) },
    );
  return d.createElement(
    rr,
    { zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : g },
    d.createElement(kF, { cursor: l, cursorComp: v, cursorProps: _ }),
  );
}
function NF(e) {
  var t = Z$(),
    r = s0(),
    n = Yn(),
    i = $A();
  return t == null || r == null || n == null || i == null
    ? null
    : d.createElement(jF, md({}, e, { offset: r, layout: n, tooltipAxisBandSize: t, chartName: i }));
}
var KA = d.createContext(null),
  IF = () => d.useContext(KA),
  cf = { exports: {} },
  Iy;
function TF() {
  return (
    Iy ||
      ((Iy = 1),
      (function (e) {
        var t = Object.prototype.hasOwnProperty,
          r = '~';
        function n() {}
        Object.create && ((n.prototype = Object.create(null)), new n().__proto__ || (r = !1));
        function i(l, c, u) {
          ((this.fn = l), (this.context = c), (this.once = u || !1));
        }
        function a(l, c, u, f, h) {
          if (typeof u != 'function') throw new TypeError('The listener must be a function');
          var m = new i(u, f || l, h),
            p = r ? r + c : c;
          return (
            l._events[p]
              ? l._events[p].fn
                ? (l._events[p] = [l._events[p], m])
                : l._events[p].push(m)
              : ((l._events[p] = m), l._eventsCount++),
            l
          );
        }
        function o(l, c) {
          --l._eventsCount === 0 ? (l._events = new n()) : delete l._events[c];
        }
        function s() {
          ((this._events = new n()), (this._eventsCount = 0));
        }
        ((s.prototype.eventNames = function () {
          var c = [],
            u,
            f;
          if (this._eventsCount === 0) return c;
          for (f in (u = this._events)) t.call(u, f) && c.push(r ? f.slice(1) : f);
          return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(u)) : c;
        }),
          (s.prototype.listeners = function (c) {
            var u = r ? r + c : c,
              f = this._events[u];
            if (!f) return [];
            if (f.fn) return [f.fn];
            for (var h = 0, m = f.length, p = new Array(m); h < m; h++) p[h] = f[h].fn;
            return p;
          }),
          (s.prototype.listenerCount = function (c) {
            var u = r ? r + c : c,
              f = this._events[u];
            return f ? (f.fn ? 1 : f.length) : 0;
          }),
          (s.prototype.emit = function (c, u, f, h, m, p) {
            var v = r ? r + c : c;
            if (!this._events[v]) return !1;
            var g = this._events[v],
              b = arguments.length,
              S,
              x;
            if (g.fn) {
              switch ((g.once && this.removeListener(c, g.fn, void 0, !0), b)) {
                case 1:
                  return (g.fn.call(g.context), !0);
                case 2:
                  return (g.fn.call(g.context, u), !0);
                case 3:
                  return (g.fn.call(g.context, u, f), !0);
                case 4:
                  return (g.fn.call(g.context, u, f, h), !0);
                case 5:
                  return (g.fn.call(g.context, u, f, h, m), !0);
                case 6:
                  return (g.fn.call(g.context, u, f, h, m, p), !0);
              }
              for (x = 1, S = new Array(b - 1); x < b; x++) S[x - 1] = arguments[x];
              g.fn.apply(g.context, S);
            } else {
              var A = g.length,
                C;
              for (x = 0; x < A; x++)
                switch ((g[x].once && this.removeListener(c, g[x].fn, void 0, !0), b)) {
                  case 1:
                    g[x].fn.call(g[x].context);
                    break;
                  case 2:
                    g[x].fn.call(g[x].context, u);
                    break;
                  case 3:
                    g[x].fn.call(g[x].context, u, f);
                    break;
                  case 4:
                    g[x].fn.call(g[x].context, u, f, h);
                    break;
                  default:
                    if (!S) for (C = 1, S = new Array(b - 1); C < b; C++) S[C - 1] = arguments[C];
                    g[x].fn.apply(g[x].context, S);
                }
            }
            return !0;
          }),
          (s.prototype.on = function (c, u, f) {
            return a(this, c, u, f, !1);
          }),
          (s.prototype.once = function (c, u, f) {
            return a(this, c, u, f, !0);
          }),
          (s.prototype.removeListener = function (c, u, f, h) {
            var m = r ? r + c : c;
            if (!this._events[m]) return this;
            if (!u) return (o(this, m), this);
            var p = this._events[m];
            if (p.fn) p.fn === u && (!h || p.once) && (!f || p.context === f) && o(this, m);
            else {
              for (var v = 0, g = [], b = p.length; v < b; v++)
                (p[v].fn !== u || (h && !p[v].once) || (f && p[v].context !== f)) && g.push(p[v]);
              g.length ? (this._events[m] = g.length === 1 ? g[0] : g) : o(this, m);
            }
            return this;
          }),
          (s.prototype.removeAllListeners = function (c) {
            var u;
            return (
              c
                ? ((u = r ? r + c : c), this._events[u] && o(this, u))
                : ((this._events = new n()), (this._eventsCount = 0)),
              this
            );
          }),
          (s.prototype.off = s.prototype.removeListener),
          (s.prototype.addListener = s.prototype.on),
          (s.prefixed = r),
          (s.EventEmitter = s),
          (e.exports = s));
      })(cf)),
    cf.exports
  );
}
var MF = TF();
const DF = ki(MF);
var Fa = new DF(),
  pd = 'recharts.syncEvent.tooltip',
  Ty = 'recharts.syncEvent.brush',
  WA = (e, t) => {
    if (t && Array.isArray(e)) {
      var r = Number.parseInt(t, 10);
      if (!sr(r)) return e[r];
    }
  },
  RF = { chartName: '', tooltipPayloadSearcher: () => {}, eventEmitter: void 0, defaultTooltipEventType: 'axis' },
  HA = bt({
    name: 'options',
    initialState: RF,
    reducers: {
      createEventEmitter: (e) => {
        e.eventEmitter == null && (e.eventEmitter = Symbol('rechartsEventEmitter'));
      },
    },
  }),
  LF = HA.reducer,
  { createEventEmitter: $F } = HA.actions;
function FF(e) {
  return e.tooltip.syncInteraction;
}
var BF = { chartData: void 0, computedData: void 0, dataStartIndex: 0, dataEndIndex: 0 },
  qA = bt({
    name: 'chartData',
    initialState: BF,
    reducers: {
      setChartData(e, t) {
        if (((e.chartData = t.payload), t.payload == null)) {
          ((e.dataStartIndex = 0), (e.dataEndIndex = 0));
          return;
        }
        t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
      },
      setComputedData(e, t) {
        e.computedData = t.payload;
      },
      setDataStartEndIndexes(e, t) {
        var { startIndex: r, endIndex: n } = t.payload;
        (r != null && (e.dataStartIndex = r), n != null && (e.dataEndIndex = n));
      },
    },
  }),
  { setChartData: My, setDataStartEndIndexes: UF, setComputedData: u3 } = qA.actions,
  zF = qA.reducer,
  KF = ['x', 'y'];
function Dy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function li(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Dy(Object(r), !0).forEach(function (n) {
          WF(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Dy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function WF(e, t, r) {
  return (
    (t = HF(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function HF(e) {
  var t = qF(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function qF(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function VF(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = GF(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function GF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function YF() {
  var e = re(mh),
    t = re(ph),
    r = Ke(),
    n = re(q0),
    i = re(Qr),
    a = Yn(),
    o = Ml(),
    s = re((l) => l.rootProps.className);
  d.useEffect(() => {
    if (e == null) return Gn;
    var l = (c, u, f) => {
      if (t !== f && e === c) {
        if (n === 'index') {
          var h;
          if (
            o &&
            u !== null &&
            u !== void 0 &&
            (h = u.payload) !== null &&
            h !== void 0 &&
            h.coordinate &&
            u.payload.sourceViewBox
          ) {
            var m = u.payload.coordinate,
              { x: p, y: v } = m,
              g = VF(m, KF),
              { x: b, y: S, width: x, height: A } = u.payload.sourceViewBox,
              C = li(
                li({}, g),
                {},
                { x: o.x + (x ? (p - b) / x : 0) * o.width, y: o.y + (A ? (v - S) / A : 0) * o.height },
              );
            r(li(li({}, u), {}, { payload: li(li({}, u.payload), {}, { coordinate: C }) }));
          } else r(u);
          return;
        }
        if (i != null) {
          var P;
          if (typeof n == 'function') {
            var _ = {
                activeTooltipIndex: u.payload.index == null ? void 0 : Number(u.payload.index),
                isTooltipActive: u.payload.active,
                activeIndex: u.payload.index == null ? void 0 : Number(u.payload.index),
                activeLabel: u.payload.label,
                activeDataKey: u.payload.dataKey,
                activeCoordinate: u.payload.coordinate,
              },
              E = n(i, _);
            P = i[E];
          } else n === 'value' && (P = i.find((Q) => String(Q.value) === u.payload.label));
          var { coordinate: j } = u.payload;
          if (P == null || u.payload.active === !1 || j == null || o == null) {
            r(
              hd({
                active: !1,
                coordinate: void 0,
                dataKey: void 0,
                index: null,
                label: void 0,
                sourceViewBox: void 0,
                graphicalItemId: void 0,
              }),
            );
            return;
          }
          var { x: N, y: M } = j,
            O = Math.min(N, o.x + o.width),
            D = Math.min(M, o.y + o.height),
            B = { x: a === 'horizontal' ? P.coordinate : O, y: a === 'horizontal' ? D : P.coordinate },
            Y = hd({
              active: u.payload.active,
              coordinate: B,
              dataKey: u.payload.dataKey,
              index: String(P.index),
              label: u.payload.label,
              sourceViewBox: u.payload.sourceViewBox,
              graphicalItemId: u.payload.graphicalItemId,
            });
          r(Y);
        }
      }
    };
    return (
      Fa.on(pd, l),
      () => {
        Fa.off(pd, l);
      }
    );
  }, [s, r, t, e, n, i, a, o]);
}
function XF() {
  var e = re(mh),
    t = re(ph),
    r = Ke();
  d.useEffect(() => {
    if (e == null) return Gn;
    var n = (i, a, o) => {
      t !== o && e === i && r(UF(a));
    };
    return (
      Fa.on(Ty, n),
      () => {
        Fa.off(Ty, n);
      }
    );
  }, [r, t, e]);
}
function ZF() {
  var e = Ke();
  (d.useEffect(() => {
    e($F());
  }, [e]),
    YF(),
    XF());
}
function JF(e, t, r, n, i, a) {
  var o = re((p) => aF(p, e, t)),
    s = re(U$),
    l = re(ph),
    c = re(mh),
    u = re(q0),
    f = re(FF),
    h = f?.active,
    m = Ml();
  d.useEffect(() => {
    if (!h && c != null && l != null) {
      var p = hd({
        active: a,
        coordinate: r,
        dataKey: o,
        index: i,
        label: typeof n == 'number' ? String(n) : n,
        sourceViewBox: m,
        graphicalItemId: s,
      });
      Fa.emit(pd, c, p, l);
    }
  }, [h, r, o, s, i, n, l, c, u, a, m]);
}
function Ry(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Ly(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ry(Object(r), !0).forEach(function (n) {
          QF(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ry(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function QF(e, t, r) {
  return (
    (t = eB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function eB(e) {
  var t = tB(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function tB(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function rB(e) {
  return e.dataKey;
}
function nB(e, t) {
  return d.isValidElement(e)
    ? d.cloneElement(e, t)
    : typeof e == 'function'
      ? d.createElement(e, t)
      : d.createElement(OT, t);
}
var $y = [],
  iB = {
    allowEscapeViewBox: { x: !1, y: !1 },
    animationDuration: 400,
    animationEasing: 'ease',
    axisId: 0,
    contentStyle: {},
    cursor: !0,
    filterNull: !0,
    includeHidden: !1,
    isAnimationActive: 'auto',
    itemSorter: 'name',
    itemStyle: {},
    labelStyle: {},
    offset: 10,
    reverseDirection: { x: !1, y: !1 },
    separator: ' : ',
    trigger: 'hover',
    useTranslate3d: !1,
    wrapperStyle: {},
  };
function VA(e) {
  var t,
    r,
    n = Mt(e, iB),
    {
      active: i,
      allowEscapeViewBox: a,
      animationDuration: o,
      animationEasing: s,
      content: l,
      filterNull: c,
      isAnimationActive: u,
      offset: f,
      payloadUniqBy: h,
      position: m,
      reverseDirection: p,
      useTranslate3d: v,
      wrapperStyle: g,
      cursor: b,
      shared: S,
      trigger: x,
      defaultIndex: A,
      portal: C,
      axisId: P,
    } = n,
    _ = Ke(),
    E = typeof A == 'number' ? String(A) : A;
  d.useEffect(() => {
    _(Y2({ shared: S, trigger: x, axisId: P, active: i, defaultIndex: E }));
  }, [_, S, x, P, i, E]);
  var j = Ml(),
    N = b0(),
    M = K2(S),
    { activeIndex: O, isActive: D } = (t = re((ne) => lF(ne, M, x, E))) !== null && t !== void 0 ? t : {},
    B = re((ne) => sF(ne, M, x, E)),
    Y = re((ne) => UA(ne, M, x, E)),
    Q = re((ne) => oF(ne, M, x, E)),
    se = B,
    V = IF(),
    T = (r = i ?? D) !== null && r !== void 0 ? r : !1,
    [F, W] = oN([se, T]),
    z = M === 'axis' ? Y : void 0;
  JF(M, x, Q, z, O, T);
  var H = C ?? V;
  if (H == null || j == null || M == null) return null;
  var G = se ?? $y;
  (T || (G = $y),
    c &&
      G.length &&
      (G = Ij(
        G.filter((ne) => ne.value != null && (ne.hide !== !0 || n.includeHidden)),
        h,
        rB,
      )));
  var le = G.length > 0,
    fe = Ly(Ly({}, n), {}, { payload: G, label: z, active: T, activeIndex: O, coordinate: Q, accessibilityLayer: N }),
    te = d.createElement(
      LT,
      {
        allowEscapeViewBox: a,
        animationDuration: o,
        animationEasing: s,
        isAnimationActive: u,
        active: T,
        coordinate: Q,
        hasPayload: le,
        offset: f,
        position: m,
        reverseDirection: p,
        useTranslate3d: v,
        viewBox: j,
        wrapperStyle: g,
        lastBoundingBox: F,
        innerRef: W,
        hasPortalFromProps: !!C,
      },
      nB(l, fe),
    );
  return d.createElement(
    d.Fragment,
    null,
    rw.createPortal(te, H),
    T && d.createElement(NF, { cursor: b, tooltipEventType: M, coordinate: Q, payload: G, index: O }),
  );
}
var cm = (e) => null;
cm.displayName = 'Cell';
function aB(e, t, r) {
  return (
    (t = oB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function oB(e) {
  var t = sB(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function sB(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
class lB {
  constructor(t) {
    (aB(this, 'cache', new Map()), (this.maxSize = t));
  }
  get(t) {
    var r = this.cache.get(t);
    return (r !== void 0 && (this.cache.delete(t), this.cache.set(t, r)), r);
  }
  set(t, r) {
    if (this.cache.has(t)) this.cache.delete(t);
    else if (this.cache.size >= this.maxSize) {
      var n = this.cache.keys().next().value;
      n != null && this.cache.delete(n);
    }
    this.cache.set(t, r);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}
function Fy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function cB(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Fy(Object(r), !0).forEach(function (n) {
          uB(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Fy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function uB(e, t, r) {
  return (
    (t = fB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function fB(e) {
  var t = dB(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function dB(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var hB = { cacheSize: 2e3, enableCache: !0 },
  GA = cB({}, hB),
  By = new lB(GA.cacheSize),
  mB = { position: 'absolute', top: '-20000px', left: 0, padding: 0, margin: 0, border: 'none', whiteSpace: 'pre' },
  Uy = 'recharts_measurement_span';
function pB(e, t) {
  var r = t.fontSize || '',
    n = t.fontFamily || '',
    i = t.fontWeight || '',
    a = t.fontStyle || '',
    o = t.letterSpacing || '',
    s = t.textTransform || '';
  return ''.concat(e, '|').concat(r, '|').concat(n, '|').concat(i, '|').concat(a, '|').concat(o, '|').concat(s);
}
var zy = (e, t) => {
    try {
      var r = document.getElementById(Uy);
      (r ||
        ((r = document.createElement('span')),
        r.setAttribute('id', Uy),
        r.setAttribute('aria-hidden', 'true'),
        document.body.appendChild(r)),
        Object.assign(r.style, mB, t),
        (r.textContent = ''.concat(e)));
      var n = r.getBoundingClientRect();
      return { width: n.width, height: n.height };
    } catch {
      return { width: 0, height: 0 };
    }
  },
  xa = function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (t == null || Za.isSsr) return { width: 0, height: 0 };
    if (!GA.enableCache) return zy(t, r);
    var n = pB(t, r),
      i = By.get(n);
    if (i) return i;
    var a = zy(t, r);
    return (By.set(n, a), a);
  },
  YA;
function vB(e, t, r) {
  return (
    (t = gB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function gB(e) {
  var t = yB(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function yB(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var Ky = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
  Wy = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
  bB = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/,
  wB = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
  xB = { cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 96 / 6, in: 96, Q: 96 / (2.54 * 40), px: 1 },
  SB = ['cm', 'mm', 'pt', 'pc', 'in', 'Q', 'px'];
function AB(e) {
  return SB.includes(e);
}
var pi = 'NaN';
function PB(e, t) {
  return e * xB[t];
}
class dt {
  static parse(t) {
    var r,
      [, n, i] = (r = wB.exec(t)) !== null && r !== void 0 ? r : [];
    return n == null ? dt.NaN : new dt(parseFloat(n), i ?? '');
  }
  constructor(t, r) {
    ((this.num = t),
      (this.unit = r),
      (this.num = t),
      (this.unit = r),
      sr(t) && (this.unit = ''),
      r !== '' && !bB.test(r) && ((this.num = NaN), (this.unit = '')),
      AB(r) && ((this.num = PB(t, r)), (this.unit = 'px')));
  }
  add(t) {
    return this.unit !== t.unit ? new dt(NaN, '') : new dt(this.num + t.num, this.unit);
  }
  subtract(t) {
    return this.unit !== t.unit ? new dt(NaN, '') : new dt(this.num - t.num, this.unit);
  }
  multiply(t) {
    return this.unit !== '' && t.unit !== '' && this.unit !== t.unit
      ? new dt(NaN, '')
      : new dt(this.num * t.num, this.unit || t.unit);
  }
  divide(t) {
    return this.unit !== '' && t.unit !== '' && this.unit !== t.unit
      ? new dt(NaN, '')
      : new dt(this.num / t.num, this.unit || t.unit);
  }
  toString() {
    return ''.concat(this.num).concat(this.unit);
  }
  isNaN() {
    return sr(this.num);
  }
}
YA = dt;
vB(dt, 'NaN', new YA(NaN, ''));
function XA(e) {
  if (e == null || e.includes(pi)) return pi;
  for (var t = e; t.includes('*') || t.includes('/'); ) {
    var r,
      [, n, i, a] = (r = Ky.exec(t)) !== null && r !== void 0 ? r : [],
      o = dt.parse(n ?? ''),
      s = dt.parse(a ?? ''),
      l = i === '*' ? o.multiply(s) : o.divide(s);
    if (l.isNaN()) return pi;
    t = t.replace(Ky, l.toString());
  }
  for (; t.includes('+') || /.-\d+(?:\.\d+)?/.test(t); ) {
    var c,
      [, u, f, h] = (c = Wy.exec(t)) !== null && c !== void 0 ? c : [],
      m = dt.parse(u ?? ''),
      p = dt.parse(h ?? ''),
      v = f === '+' ? m.add(p) : m.subtract(p);
    if (v.isNaN()) return pi;
    t = t.replace(Wy, v.toString());
  }
  return t;
}
var Hy = /\(([^()]*)\)/;
function CB(e) {
  for (var t = e, r; (r = Hy.exec(t)) != null; ) {
    var [, n] = r;
    t = t.replace(Hy, XA(n));
  }
  return t;
}
function OB(e) {
  var t = e.replace(/\s+/g, '');
  return ((t = CB(t)), (t = XA(t)), t);
}
function _B(e) {
  try {
    return OB(e);
  } catch {
    return pi;
  }
}
function uf(e) {
  var t = _B(e.slice(5, -1));
  return t === pi ? '' : t;
}
var EB = ['x', 'y', 'lineHeight', 'capHeight', 'fill', 'scaleToFit', 'textAnchor', 'verticalAnchor'],
  kB = ['dx', 'dy', 'angle', 'className', 'breakAll'];
function vd() {
  return (
    (vd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    vd.apply(null, arguments)
  );
}
function qy(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = jB(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function jB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var ZA = /[ \f\n\r\t\v\u2028\u2029]+/,
  JA = (e) => {
    var { children: t, breakAll: r, style: n } = e;
    try {
      var i = [];
      ze(t) || (r ? (i = t.toString().split('')) : (i = t.toString().split(ZA)));
      var a = i.map((s) => ({ word: s, width: xa(s, n).width })),
        o = r ? 0 : xa(' ', n).width;
      return { wordsWithComputedWidth: a, spaceWidth: o };
    } catch {
      return null;
    }
  };
function QA(e) {
  return e === 'start' || e === 'middle' || e === 'end' || e === 'inherit';
}
function NB(e) {
  return ze(e) || typeof e == 'string' || typeof e == 'number' || typeof e == 'boolean';
}
var eP = (e, t, r, n) =>
    e.reduce((i, a) => {
      var { word: o, width: s } = a,
        l = i[i.length - 1];
      if (l && s != null && (t == null || n || l.width + s + r < Number(t))) (l.words.push(o), (l.width += s + r));
      else {
        var c = { words: [o], width: s };
        i.push(c);
      }
      return i;
    }, []),
  tP = (e) => e.reduce((t, r) => (t.width > r.width ? t : r)),
  IB = '…',
  Vy = (e, t, r, n, i, a, o, s) => {
    var l = e.slice(0, t),
      c = JA({ breakAll: r, style: n, children: l + IB });
    if (!c) return [!1, []];
    var u = eP(c.wordsWithComputedWidth, a, o, s),
      f = u.length > i || tP(u).width > Number(a);
    return [f, u];
  },
  TB = (e, t, r, n, i) => {
    var { maxLines: a, children: o, style: s, breakAll: l } = e,
      c = X(a),
      u = String(o),
      f = eP(t, n, r, i);
    if (!c || i) return f;
    var h = f.length > a || tP(f).width > Number(n);
    if (!h) return f;
    for (var m = 0, p = u.length - 1, v = 0, g; m <= p && v <= u.length - 1; ) {
      var b = Math.floor((m + p) / 2),
        S = b - 1,
        [x, A] = Vy(u, S, l, s, a, n, r, i),
        [C] = Vy(u, b, l, s, a, n, r, i);
      if ((!x && !C && (m = b + 1), x && C && (p = b - 1), !x && C)) {
        g = A;
        break;
      }
      v++;
    }
    return g || f;
  },
  Gy = (e) => {
    var t = ze(e) ? [] : e.toString().split(ZA);
    return [{ words: t, width: void 0 }];
  },
  MB = (e) => {
    var { width: t, scaleToFit: r, children: n, style: i, breakAll: a, maxLines: o } = e;
    if ((t || r) && !Za.isSsr) {
      var s,
        l,
        c = JA({ breakAll: a, children: n, style: i });
      if (c) {
        var { wordsWithComputedWidth: u, spaceWidth: f } = c;
        ((s = u), (l = f));
      } else return Gy(n);
      return TB({ breakAll: a, children: n, maxLines: o, style: i }, s, l, t, !!r);
    }
    return Gy(n);
  },
  rP = '#808080',
  DB = {
    angle: 0,
    breakAll: !1,
    capHeight: '0.71em',
    fill: rP,
    lineHeight: '1em',
    scaleToFit: !1,
    textAnchor: 'start',
    verticalAnchor: 'end',
    x: 0,
    y: 0,
  },
  um = d.forwardRef((e, t) => {
    var r = Mt(e, DB),
      { x: n, y: i, lineHeight: a, capHeight: o, fill: s, scaleToFit: l, textAnchor: c, verticalAnchor: u } = r,
      f = qy(r, EB),
      h = d.useMemo(
        () =>
          MB({
            breakAll: f.breakAll,
            children: f.children,
            maxLines: f.maxLines,
            scaleToFit: l,
            style: f.style,
            width: f.width,
          }),
        [f.breakAll, f.children, f.maxLines, l, f.style, f.width],
      ),
      { dx: m, dy: p, angle: v, className: g, breakAll: b } = f,
      S = qy(f, kB);
    if (!Sr(n) || !Sr(i) || h.length === 0) return null;
    var x = Number(n) + (X(m) ? m : 0),
      A = Number(i) + (X(p) ? p : 0);
    if (!he(x) || !he(A)) return null;
    var C;
    switch (u) {
      case 'start':
        C = uf('calc('.concat(o, ')'));
        break;
      case 'middle':
        C = uf(
          'calc('
            .concat((h.length - 1) / 2, ' * -')
            .concat(a, ' + (')
            .concat(o, ' / 2))'),
        );
        break;
      default:
        C = uf('calc('.concat(h.length - 1, ' * -').concat(a, ')'));
        break;
    }
    var P = [],
      _ = h[0];
    if (l && _ != null) {
      var E = _.width,
        { width: j } = f;
      P.push('scale('.concat(X(j) && X(E) ? j / E : 1, ')'));
    }
    return (
      v && P.push('rotate('.concat(v, ', ').concat(x, ', ').concat(A, ')')),
      P.length && (S.transform = P.join(' ')),
      d.createElement(
        'text',
        vd({}, Ct(S), {
          ref: t,
          x,
          y: A,
          className: Ne('recharts-text', g),
          textAnchor: c,
          fill: s.includes('url') ? rP : s,
        }),
        h.map((N, M) => {
          var O = N.words.join(b ? '' : ' ');
          return d.createElement('tspan', { x, dy: M === 0 ? C : a, key: ''.concat(O, '-').concat(M) }, O);
        }),
      )
    );
  });
um.displayName = 'Text';
function Yy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Yy(Object(r), !0).forEach(function (n) {
          RB(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Yy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function RB(e, t, r) {
  return (
    (t = LB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function LB(e) {
  var t = $B(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function $B(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var FB = (e) => {
    var { viewBox: t, position: r, offset: n = 0, parentViewBox: i } = e,
      { x: a, y: o, height: s, upperWidth: l, lowerWidth: c } = oh(t),
      u = a,
      f = a + (l - c) / 2,
      h = (u + f) / 2,
      m = (l + c) / 2,
      p = u + l / 2,
      v = s >= 0 ? 1 : -1,
      g = v * n,
      b = v > 0 ? 'end' : 'start',
      S = v > 0 ? 'start' : 'end',
      x = l >= 0 ? 1 : -1,
      A = x * n,
      C = x > 0 ? 'end' : 'start',
      P = x > 0 ? 'start' : 'end',
      _ = i;
    if (r === 'top') {
      var E = { x: u + l / 2, y: o - g, horizontalAnchor: 'middle', verticalAnchor: b };
      return (_ && ((E.height = Math.max(o - _.y, 0)), (E.width = l)), E);
    }
    if (r === 'bottom') {
      var j = { x: f + c / 2, y: o + s + g, horizontalAnchor: 'middle', verticalAnchor: S };
      return (_ && ((j.height = Math.max(_.y + _.height - (o + s), 0)), (j.width = c)), j);
    }
    if (r === 'left') {
      var N = { x: h - A, y: o + s / 2, horizontalAnchor: C, verticalAnchor: 'middle' };
      return (_ && ((N.width = Math.max(N.x - _.x, 0)), (N.height = s)), N);
    }
    if (r === 'right') {
      var M = { x: h + m + A, y: o + s / 2, horizontalAnchor: P, verticalAnchor: 'middle' };
      return (_ && ((M.width = Math.max(_.x + _.width - M.x, 0)), (M.height = s)), M);
    }
    var O = _ ? { width: m, height: s } : {};
    return r === 'insideLeft'
      ? gr({ x: h + A, y: o + s / 2, horizontalAnchor: P, verticalAnchor: 'middle' }, O)
      : r === 'insideRight'
        ? gr({ x: h + m - A, y: o + s / 2, horizontalAnchor: C, verticalAnchor: 'middle' }, O)
        : r === 'insideTop'
          ? gr({ x: u + l / 2, y: o + g, horizontalAnchor: 'middle', verticalAnchor: S }, O)
          : r === 'insideBottom'
            ? gr({ x: f + c / 2, y: o + s - g, horizontalAnchor: 'middle', verticalAnchor: b }, O)
            : r === 'insideTopLeft'
              ? gr({ x: u + A, y: o + g, horizontalAnchor: P, verticalAnchor: S }, O)
              : r === 'insideTopRight'
                ? gr({ x: u + l - A, y: o + g, horizontalAnchor: C, verticalAnchor: S }, O)
                : r === 'insideBottomLeft'
                  ? gr({ x: f + A, y: o + s - g, horizontalAnchor: P, verticalAnchor: b }, O)
                  : r === 'insideBottomRight'
                    ? gr({ x: f + c - A, y: o + s - g, horizontalAnchor: C, verticalAnchor: b }, O)
                    : r && typeof r == 'object' && (X(r.x) || Rf(r.x)) && (X(r.y) || Rf(r.y))
                      ? gr({ x: a + lr(r.x, m), y: o + lr(r.y, s), horizontalAnchor: 'end', verticalAnchor: 'end' }, O)
                      : gr({ x: p, y: o + s / 2, horizontalAnchor: 'middle', verticalAnchor: 'middle' }, O);
  },
  BB = ['labelRef'],
  UB = ['content'];
function Xy(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = zB(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function zB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function Zy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function ya(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Zy(Object(r), !0).forEach(function (n) {
          KB(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Zy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function KB(e, t, r) {
  return (
    (t = WB(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function WB(e) {
  var t = HB(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function HB(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Tr() {
  return (
    (Tr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Tr.apply(null, arguments)
  );
}
var nP = d.createContext(null),
  qB = (e) => {
    var { x: t, y: r, upperWidth: n, lowerWidth: i, width: a, height: o, children: s } = e,
      l = d.useMemo(() => ({ x: t, y: r, upperWidth: n, lowerWidth: i, width: a, height: o }), [t, r, n, i, a, o]);
    return d.createElement(nP.Provider, { value: l }, s);
  },
  iP = () => {
    var e = d.useContext(nP),
      t = Ml();
    return e || (t ? oh(t) : void 0);
  },
  VB = d.createContext(null),
  GB = () => {
    var e = d.useContext(VB),
      t = re(Z0);
    return e || t;
  },
  YB = (e) => {
    var { value: t, formatter: r } = e,
      n = ze(e.children) ? t : e.children;
    return typeof r == 'function' ? r(n) : n;
  },
  fm = (e) => e != null && typeof e == 'function',
  XB = (e, t) => {
    var r = Nt(t - e),
      n = Math.min(Math.abs(t - e), 360);
    return r * n;
  },
  ZB = (e, t, r, n, i) => {
    var { offset: a, className: o } = e,
      { cx: s, cy: l, innerRadius: c, outerRadius: u, startAngle: f, endAngle: h, clockWise: m } = i,
      p = (c + u) / 2,
      v = XB(f, h),
      g = v >= 0 ? 1 : -1,
      b,
      S;
    switch (t) {
      case 'insideStart':
        ((b = f + g * a), (S = m));
        break;
      case 'insideEnd':
        ((b = h - g * a), (S = !m));
        break;
      case 'end':
        ((b = h + g * a), (S = m));
        break;
      default:
        throw new Error('Unsupported position '.concat(t));
    }
    S = v <= 0 ? S : !S;
    var x = mt(s, l, p, b),
      A = mt(s, l, p, b + (S ? 1 : -1) * 359),
      C = 'M'
        .concat(x.x, ',')
        .concat(
          x.y,
          `
    A`,
        )
        .concat(p, ',')
        .concat(p, ',0,1,')
        .concat(
          S ? 0 : 1,
          `,
    `,
        )
        .concat(A.x, ',')
        .concat(A.y),
      P = ze(e.id) ? Oa('recharts-radial-line-') : e.id;
    return d.createElement(
      'text',
      Tr({}, n, { dominantBaseline: 'central', className: Ne('recharts-radial-bar-label', o) }),
      d.createElement('defs', null, d.createElement('path', { id: P, d: C })),
      d.createElement('textPath', { xlinkHref: '#'.concat(P) }, r),
    );
  },
  JB = (e, t, r) => {
    var { cx: n, cy: i, innerRadius: a, outerRadius: o, startAngle: s, endAngle: l } = e,
      c = (s + l) / 2;
    if (r === 'outside') {
      var { x: u, y: f } = mt(n, i, o + t, c);
      return { x: u, y: f, textAnchor: u >= n ? 'start' : 'end', verticalAnchor: 'middle' };
    }
    if (r === 'center') return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'middle' };
    if (r === 'centerTop') return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'start' };
    if (r === 'centerBottom') return { x: n, y: i, textAnchor: 'middle', verticalAnchor: 'end' };
    var h = (a + o) / 2,
      { x: m, y: p } = mt(n, i, h, c);
    return { x: m, y: p, textAnchor: 'middle', verticalAnchor: 'middle' };
  },
  ls = (e) => e != null && 'cx' in e && X(e.cx),
  QB = { angle: 0, offset: 5, zIndex: at.label, position: 'middle', textBreakAll: !1 };
function eU(e) {
  if (!ls(e)) return e;
  var { cx: t, cy: r, outerRadius: n } = e,
    i = n * 2;
  return { x: t - n, y: r - n, width: i, upperWidth: i, lowerWidth: i, height: i };
}
function sn(e) {
  var t = Mt(e, QB),
    {
      viewBox: r,
      parentViewBox: n,
      position: i,
      value: a,
      children: o,
      content: s,
      className: l = '',
      textBreakAll: c,
      labelRef: u,
    } = t,
    f = GB(),
    h = iP(),
    m = i === 'center' ? h : (f ?? h),
    p,
    v,
    g;
  r == null ? (p = m) : ls(r) ? (p = r) : (p = oh(r));
  var b = eU(p);
  if (!p || (ze(a) && ze(o) && !d.isValidElement(s) && typeof s != 'function')) return null;
  var S = ya(ya({}, t), {}, { viewBox: p });
  if (d.isValidElement(s)) {
    var { labelRef: x } = S,
      A = Xy(S, BB);
    return d.cloneElement(s, A);
  }
  if (typeof s == 'function') {
    var { content: C } = S,
      P = Xy(S, UB);
    if (((v = d.createElement(s, P)), d.isValidElement(v))) return v;
  } else v = YB(t);
  var _ = Ct(t);
  if (ls(p)) {
    if (i === 'insideStart' || i === 'insideEnd' || i === 'end') return ZB(t, i, v, _, p);
    g = JB(p, t.offset, t.position);
  } else {
    if (!b) return null;
    var E = FB({ viewBox: b, position: i, offset: t.offset, parentViewBox: ls(n) ? void 0 : n });
    g = ya(
      ya(
        { x: E.x, y: E.y, textAnchor: E.horizontalAnchor, verticalAnchor: E.verticalAnchor },
        E.width !== void 0 ? { width: E.width } : {},
      ),
      E.height !== void 0 ? { height: E.height } : {},
    );
  }
  return d.createElement(
    rr,
    { zIndex: t.zIndex },
    d.createElement(
      um,
      Tr({ ref: u, className: Ne('recharts-label', l) }, _, g, {
        textAnchor: QA(_.textAnchor) ? _.textAnchor : g.textAnchor,
        breakAll: c,
      }),
      v,
    ),
  );
}
sn.displayName = 'Label';
var tU = (e, t, r) => {
  if (!e) return null;
  var n = { viewBox: t, labelRef: r };
  return e === !0
    ? d.createElement(sn, Tr({ key: 'label-implicit' }, n))
    : Sr(e)
      ? d.createElement(sn, Tr({ key: 'label-implicit', value: e }, n))
      : d.isValidElement(e)
        ? e.type === sn
          ? d.cloneElement(e, ya({ key: 'label-implicit' }, n))
          : d.createElement(sn, Tr({ key: 'label-implicit', content: e }, n))
        : fm(e)
          ? d.createElement(sn, Tr({ key: 'label-implicit', content: e }, n))
          : e && typeof e == 'object'
            ? d.createElement(sn, Tr({}, e, { key: 'label-implicit' }, n))
            : null;
};
function rU(e) {
  var { label: t, labelRef: r } = e,
    n = iP();
  return tU(t, n, r) || null;
}
var nU = ['valueAccessor'],
  iU = ['dataKey', 'clockWise', 'id', 'textBreakAll', 'zIndex'];
function tl() {
  return (
    (tl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    tl.apply(null, arguments)
  );
}
function Jy(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = aU(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function aU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var oU = (e) => {
    var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
    if (NB(t)) return t;
  },
  aP = d.createContext(void 0),
  oP = aP.Provider,
  sP = d.createContext(void 0);
sP.Provider;
function sU() {
  return d.useContext(aP);
}
function lU() {
  return d.useContext(sP);
}
function Sa(e) {
  var { valueAccessor: t = oU } = e,
    r = Jy(e, nU),
    { dataKey: n, clockWise: i, id: a, textBreakAll: o, zIndex: s } = r,
    l = Jy(r, iU),
    c = sU(),
    u = lU(),
    f = c || u;
  return !f || !f.length
    ? null
    : d.createElement(
        rr,
        { zIndex: s ?? at.label },
        d.createElement(
          yt,
          { className: 'recharts-label-list' },
          f.map((h, m) => {
            var p,
              v = ze(n) ? t(h, m) : Ye(h.payload, n),
              g = ze(a) ? {} : { id: ''.concat(a, '-').concat(m) };
            return d.createElement(
              sn,
              tl({ key: 'label-'.concat(m) }, Ct(h), l, g, {
                fill: (p = r.fill) !== null && p !== void 0 ? p : h.fill,
                parentViewBox: h.parentViewBox,
                value: v,
                textBreakAll: o,
                viewBox: h.viewBox,
                index: m,
                zIndex: 0,
              }),
            );
          }),
        ),
      );
}
Sa.displayName = 'LabelList';
function lP(e) {
  var { label: t } = e;
  return t
    ? t === !0
      ? d.createElement(Sa, { key: 'labelList-implicit' })
      : d.isValidElement(t) || fm(t)
        ? d.createElement(Sa, { key: 'labelList-implicit', content: t })
        : typeof t == 'object'
          ? d.createElement(Sa, tl({ key: 'labelList-implicit' }, t, { type: String(t.type) }))
          : null
    : null;
}
function gd() {
  return (
    (gd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    gd.apply(null, arguments)
  );
}
var cP = (e) => {
    var { cx: t, cy: r, r: n, className: i } = e,
      a = Ne('recharts-dot', i);
    return X(t) && X(r) && X(n)
      ? d.createElement('circle', gd({}, Qt(e), Yd(e), { className: a, cx: t, cy: r, r: n }))
      : null;
  },
  cU = { radiusAxis: {}, angleAxis: {} },
  uP = bt({
    name: 'polarAxis',
    initialState: cU,
    reducers: {
      addRadiusAxis(e, t) {
        e.radiusAxis[t.payload.id] = t.payload;
      },
      removeRadiusAxis(e, t) {
        delete e.radiusAxis[t.payload.id];
      },
      addAngleAxis(e, t) {
        e.angleAxis[t.payload.id] = t.payload;
      },
      removeAngleAxis(e, t) {
        delete e.angleAxis[t.payload.id];
      },
    },
  }),
  { addRadiusAxis: f3, removeRadiusAxis: d3, addAngleAxis: h3, removeAngleAxis: m3 } = uP.actions,
  uU = uP.reducer;
function fU(e) {
  return e && typeof e == 'object' && 'className' in e && typeof e.className == 'string' ? e.className : '';
}
var ff = { exports: {} },
  ke = {};
var Qy;
function dU() {
  if (Qy) return ke;
  Qy = 1;
  var e = Symbol.for('react.transitional.element'),
    t = Symbol.for('react.portal'),
    r = Symbol.for('react.fragment'),
    n = Symbol.for('react.strict_mode'),
    i = Symbol.for('react.profiler'),
    a = Symbol.for('react.consumer'),
    o = Symbol.for('react.context'),
    s = Symbol.for('react.forward_ref'),
    l = Symbol.for('react.suspense'),
    c = Symbol.for('react.suspense_list'),
    u = Symbol.for('react.memo'),
    f = Symbol.for('react.lazy'),
    h = Symbol.for('react.view_transition'),
    m = Symbol.for('react.client.reference');
  function p(v) {
    if (typeof v == 'object' && v !== null) {
      var g = v.$$typeof;
      switch (g) {
        case e:
          switch (((v = v.type), v)) {
            case r:
            case i:
            case n:
            case l:
            case c:
            case h:
              return v;
            default:
              switch (((v = v && v.$$typeof), v)) {
                case o:
                case s:
                case f:
                case u:
                  return v;
                case a:
                  return v;
                default:
                  return g;
              }
          }
        case t:
          return g;
      }
    }
  }
  return (
    (ke.ContextConsumer = a),
    (ke.ContextProvider = o),
    (ke.Element = e),
    (ke.ForwardRef = s),
    (ke.Fragment = r),
    (ke.Lazy = f),
    (ke.Memo = u),
    (ke.Portal = t),
    (ke.Profiler = i),
    (ke.StrictMode = n),
    (ke.Suspense = l),
    (ke.SuspenseList = c),
    (ke.isContextConsumer = function (v) {
      return p(v) === a;
    }),
    (ke.isContextProvider = function (v) {
      return p(v) === o;
    }),
    (ke.isElement = function (v) {
      return typeof v == 'object' && v !== null && v.$$typeof === e;
    }),
    (ke.isForwardRef = function (v) {
      return p(v) === s;
    }),
    (ke.isFragment = function (v) {
      return p(v) === r;
    }),
    (ke.isLazy = function (v) {
      return p(v) === f;
    }),
    (ke.isMemo = function (v) {
      return p(v) === u;
    }),
    (ke.isPortal = function (v) {
      return p(v) === t;
    }),
    (ke.isProfiler = function (v) {
      return p(v) === i;
    }),
    (ke.isStrictMode = function (v) {
      return p(v) === n;
    }),
    (ke.isSuspense = function (v) {
      return p(v) === l;
    }),
    (ke.isSuspenseList = function (v) {
      return p(v) === c;
    }),
    (ke.isValidElementType = function (v) {
      return (
        typeof v == 'string' ||
        typeof v == 'function' ||
        v === r ||
        v === i ||
        v === n ||
        v === l ||
        v === c ||
        (typeof v == 'object' &&
          v !== null &&
          (v.$$typeof === f ||
            v.$$typeof === u ||
            v.$$typeof === o ||
            v.$$typeof === a ||
            v.$$typeof === s ||
            v.$$typeof === m ||
            v.getModuleId !== void 0))
      );
    }),
    (ke.typeOf = p),
    ke
  );
}
var eb;
function hU() {
  return (eb || ((eb = 1), (ff.exports = dU())), ff.exports);
}
var mU = hU(),
  tb = (e) => (typeof e == 'string' ? e : e ? e.displayName || e.name || 'Component' : ''),
  rb = null,
  df = null,
  fP = (e) => {
    if (e === rb && Array.isArray(df)) return df;
    var t = [];
    return (
      d.Children.forEach(e, (r) => {
        ze(r) || (mU.isFragment(r) ? (t = t.concat(fP(r.props.children))) : t.push(r));
      }),
      (df = t),
      (rb = e),
      t
    );
  };
function pU(e, t) {
  var r = [],
    n = [];
  return (
    Array.isArray(t) ? (n = t.map((i) => tb(i))) : (n = [tb(t)]),
    fP(e).forEach((i) => {
      var a = xi(i, 'type.displayName') || xi(i, 'type.name');
      a && n.indexOf(a) !== -1 && r.push(i);
    }),
    r
  );
}
var dP = (e) => (e && typeof e == 'object' && 'clipDot' in e ? !!e.clipDot : !0),
  hf = {},
  nb;
function vU() {
  return (
    nb ||
      ((nb = 1),
      (function (e) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
        function t(r) {
          if (typeof r != 'object' || r == null) return !1;
          if (Object.getPrototypeOf(r) === null) return !0;
          if (Object.prototype.toString.call(r) !== '[object Object]') {
            const i = r[Symbol.toStringTag];
            return i == null || !Object.getOwnPropertyDescriptor(r, Symbol.toStringTag)?.writable
              ? !1
              : r.toString() === `[object ${i}]`;
          }
          let n = r;
          for (; Object.getPrototypeOf(n) !== null; ) n = Object.getPrototypeOf(n);
          return Object.getPrototypeOf(r) === n;
        }
        e.isPlainObject = t;
      })(hf)),
    hf
  );
}
var mf, ib;
function gU() {
  return (ib || ((ib = 1), (mf = vU().isPlainObject)), mf);
}
var yU = gU();
const bU = ki(yU);
var ab, ob, sb, lb, cb;
function ub(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function fb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ub(Object(r), !0).forEach(function (n) {
          wU(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ub(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function wU(e, t, r) {
  return (
    (t = xU(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function xU(e) {
  var t = SU(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function SU(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function rl() {
  return (
    (rl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    rl.apply(null, arguments)
  );
}
function fa(e, t) {
  return (t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })));
}
var db = (e, t, r, n, i) => {
    var a = r - n,
      o;
    return (
      (o = qe(ab || (ab = fa(['M ', ',', ''])), e, t)),
      (o += qe(ob || (ob = fa(['L ', ',', ''])), e + r, t)),
      (o += qe(sb || (sb = fa(['L ', ',', ''])), e + r - a / 2, t + i)),
      (o += qe(lb || (lb = fa(['L ', ',', ''])), e + r - a / 2 - n, t + i)),
      (o += qe(cb || (cb = fa(['L ', ',', ' Z'])), e, t)),
      o
    );
  },
  AU = {
    x: 0,
    y: 0,
    upperWidth: 0,
    lowerWidth: 0,
    height: 0,
    isUpdateAnimationActive: !1,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
  },
  PU = (e) => {
    var t = Mt(e, AU),
      { x: r, y: n, upperWidth: i, lowerWidth: a, height: o, className: s } = t,
      { animationEasing: l, animationDuration: c, animationBegin: u, isUpdateAnimationActive: f } = t,
      h = d.useRef(null),
      [m, p] = d.useState(-1),
      v = d.useRef(i),
      g = d.useRef(a),
      b = d.useRef(o),
      S = d.useRef(r),
      x = d.useRef(n),
      A = Fl(e, 'trapezoid-');
    if (
      (d.useEffect(() => {
        if (h.current && h.current.getTotalLength)
          try {
            var B = h.current.getTotalLength();
            B && p(B);
          } catch {}
      }, []),
      r !== +r || n !== +n || i !== +i || a !== +a || o !== +o || (i === 0 && a === 0) || o === 0)
    )
      return null;
    var C = Ne('recharts-trapezoid', s);
    if (!f)
      return d.createElement('g', null, d.createElement('path', rl({}, Ct(t), { className: C, d: db(r, n, i, a, o) })));
    var P = v.current,
      _ = g.current,
      E = b.current,
      j = S.current,
      N = x.current,
      M = '0px '.concat(m === -1 ? 1 : m, 'px'),
      O = ''.concat(m, 'px ').concat(m, 'px'),
      D = w0(['strokeDasharray'], c, l);
    return d.createElement(
      $l,
      { animationId: A, key: A, canBegin: m > 0, duration: c, easing: l, isActive: f, begin: u },
      (B) => {
        var Y = Be(P, i, B),
          Q = Be(_, a, B),
          se = Be(E, o, B),
          V = Be(j, r, B),
          T = Be(N, n, B);
        h.current && ((v.current = Y), (g.current = Q), (b.current = se), (S.current = V), (x.current = T));
        var F = B > 0 ? { transition: D, strokeDasharray: O } : { strokeDasharray: M };
        return d.createElement(
          'path',
          rl({}, Ct(t), { className: C, d: db(V, T, Y, Q, se), ref: h, style: fb(fb({}, F), t.style) }),
        );
      },
    );
  },
  CU = ['option', 'shapeType', 'activeClassName', 'inActiveClassName'];
function OU(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = _U(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function _U(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function hb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function nl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? hb(Object(r), !0).forEach(function (n) {
          EU(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : hb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function EU(e, t, r) {
  return (
    (t = kU(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function kU(e) {
  var t = jU(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function jU(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function NU(e, t) {
  return nl(nl({}, t), e);
}
function IU(e, t) {
  return e === 'symbols';
}
function mb(e) {
  var { shapeType: t, elementProps: r } = e;
  switch (t) {
    case 'rectangle':
      return d.createElement(P0, r);
    case 'trapezoid':
      return d.createElement(PU, r);
    case 'sector':
      return d.createElement(_0, r);
    case 'symbols':
      if (IU(t)) return d.createElement(fx, r);
      break;
    case 'curve':
      return d.createElement(wa, r);
    default:
      return null;
  }
}
function TU(e) {
  return d.isValidElement(e) ? e.props : e;
}
function MU(e) {
  var {
      option: t,
      shapeType: r,
      activeClassName: n = 'recharts-active-shape',
      inActiveClassName: i = 'recharts-shape',
    } = e,
    a = OU(e, CU),
    o;
  if (d.isValidElement(t)) o = d.cloneElement(t, nl(nl({}, a), TU(t)));
  else if (typeof t == 'function') o = t(a, a.index);
  else if (bU(t) && typeof t != 'boolean') {
    var s = NU(t, a);
    o = d.createElement(mb, { shapeType: r, elementProps: s });
  } else {
    var l = a;
    o = d.createElement(mb, { shapeType: r, elementProps: l });
  }
  return a.isActive ? d.createElement(yt, { className: n }, o) : d.createElement(yt, { className: i }, o);
}
var hP = (e, t, r) => {
    var n = Ke();
    return (i, a) => (o) => {
      (e?.(i, a, o),
        n(
          wA({
            activeIndex: String(a),
            activeDataKey: t,
            activeCoordinate: i.tooltipPosition,
            activeGraphicalItemId: r,
          }),
        ));
    };
  },
  mP = (e) => {
    var t = Ke();
    return (r, n) => (i) => {
      (e?.(r, n, i), t(X2()));
    };
  },
  pP = (e, t, r) => {
    var n = Ke();
    return (i, a) => (o) => {
      (e?.(i, a, o),
        n(
          Z2({
            activeIndex: String(a),
            activeDataKey: t,
            activeCoordinate: i.tooltipPosition,
            activeGraphicalItemId: r,
          }),
        ));
    };
  };
function vP(e) {
  var { tooltipEntrySettings: t } = e,
    r = Ke(),
    n = wt(),
    i = d.useRef(null);
  return (
    d.useLayoutEffect(() => {
      n || (i.current === null ? r(q2(t)) : i.current !== t && r(V2({ prev: i.current, next: t })), (i.current = t));
    }, [t, r, n]),
    d.useLayoutEffect(
      () => () => {
        i.current && (r(G2(i.current)), (i.current = null));
      },
      [r],
    ),
    null
  );
}
function gP(e) {
  var { legendPayload: t } = e,
    r = Ke(),
    n = wt(),
    i = d.useRef(null);
  return (
    d.useLayoutEffect(() => {
      n || (i.current === null ? r(ZI(t)) : i.current !== t && r(JI({ prev: i.current, next: t })), (i.current = t));
    }, [r, n, t]),
    d.useLayoutEffect(
      () => () => {
        i.current && (r(QI(i.current)), (i.current = null));
      },
      [r],
    ),
    null
  );
}
var pf,
  DU = () => {
    var [e] = d.useState(() => Oa('uid-'));
    return e;
  },
  RU = (pf = gO.useId) !== null && pf !== void 0 ? pf : DU;
function LU(e, t) {
  var r = RU();
  return t || (e ? ''.concat(e, '-').concat(r) : r);
}
var $U = d.createContext(void 0),
  yP = (e) => {
    var { id: t, type: r, children: n } = e,
      i = LU('recharts-'.concat(r), t);
    return d.createElement($U.Provider, { value: i }, n(i));
  },
  FU = { cartesianItems: [], polarItems: [] },
  bP = bt({
    name: 'graphicalItems',
    initialState: FU,
    reducers: {
      addCartesianGraphicalItem: {
        reducer(e, t) {
          e.cartesianItems.push(t.payload);
        },
        prepare: Te(),
      },
      replaceCartesianGraphicalItem: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload,
            i = Xt(e).cartesianItems.indexOf(r);
          i > -1 && (e.cartesianItems[i] = n);
        },
        prepare: Te(),
      },
      removeCartesianGraphicalItem: {
        reducer(e, t) {
          var r = Xt(e).cartesianItems.indexOf(t.payload);
          r > -1 && e.cartesianItems.splice(r, 1);
        },
        prepare: Te(),
      },
      addPolarGraphicalItem: {
        reducer(e, t) {
          e.polarItems.push(t.payload);
        },
        prepare: Te(),
      },
      removePolarGraphicalItem: {
        reducer(e, t) {
          var r = Xt(e).polarItems.indexOf(t.payload);
          r > -1 && e.polarItems.splice(r, 1);
        },
        prepare: Te(),
      },
      replacePolarGraphicalItem: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload,
            i = Xt(e).polarItems.indexOf(r);
          i > -1 && (e.polarItems[i] = n);
        },
        prepare: Te(),
      },
    },
  }),
  {
    addCartesianGraphicalItem: BU,
    replaceCartesianGraphicalItem: UU,
    removeCartesianGraphicalItem: zU,
    addPolarGraphicalItem: p3,
    removePolarGraphicalItem: v3,
    replacePolarGraphicalItem: g3,
  } = bP.actions,
  KU = bP.reducer,
  WU = (e) => {
    var t = Ke(),
      r = d.useRef(null);
    return (
      d.useLayoutEffect(() => {
        (r.current === null ? t(BU(e)) : r.current !== e && t(UU({ prev: r.current, next: e })), (r.current = e));
      }, [t, e]),
      d.useLayoutEffect(
        () => () => {
          r.current && (t(zU(r.current)), (r.current = null));
        },
        [t],
      ),
      null
    );
  },
  wP = d.memo(WU),
  HU = ['points'];
function pb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function vf(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? pb(Object(r), !0).forEach(function (n) {
          qU(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : pb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function qU(e, t, r) {
  return (
    (t = VU(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function VU(e) {
  var t = GU(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function GU(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function il() {
  return (
    (il = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    il.apply(null, arguments)
  );
}
function YU(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = XU(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function XU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function ZU(e) {
  var { option: t, dotProps: r, className: n } = e;
  if (d.isValidElement(t)) return d.cloneElement(t, r);
  if (typeof t == 'function') return t(r);
  var i = Ne(n, typeof t != 'boolean' ? t.className : ''),
    a = r ?? {},
    { points: o } = a,
    s = YU(a, HU);
  return d.createElement(cP, il({}, s, { className: i }));
}
function JU(e, t) {
  return e == null ? !1 : t ? !0 : e.length === 1;
}
function QU(e) {
  var {
    points: t,
    dot: r,
    className: n,
    dotClassName: i,
    dataKey: a,
    baseProps: o,
    needClip: s,
    clipPathId: l,
    zIndex: c = at.scatter,
  } = e;
  if (!JU(t, r)) return null;
  var u = dP(r),
    f = ik(r),
    h = t.map((p, v) => {
      var g,
        b,
        S = vf(
          vf(vf({ r: 3 }, o), f),
          {},
          {
            index: v,
            cx: (g = p.x) !== null && g !== void 0 ? g : void 0,
            cy: (b = p.y) !== null && b !== void 0 ? b : void 0,
            dataKey: a,
            value: p.value,
            payload: p.payload,
            points: t,
          },
        );
      return d.createElement(ZU, { key: 'dot-'.concat(v), option: r, dotProps: S, className: i });
    }),
    m = {};
  return (
    s && l != null && (m.clipPath = 'url(#clipPath-'.concat(u ? '' : 'dots-').concat(l, ')')),
    d.createElement(rr, { zIndex: c }, d.createElement(yt, il({ className: n }, m), h))
  );
}
function vb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? vb(Object(r), !0).forEach(function (n) {
          ez(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : vb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function ez(e, t, r) {
  return (
    (t = tz(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function tz(e) {
  var t = rz(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function rz(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var xP = 0,
  nz = { xAxis: {}, yAxis: {}, zAxis: {} },
  SP = bt({
    name: 'cartesianAxis',
    initialState: nz,
    reducers: {
      addXAxis: {
        reducer(e, t) {
          e.xAxis[t.payload.id] = t.payload;
        },
        prepare: Te(),
      },
      replaceXAxis: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload;
          e.xAxis[r.id] !== void 0 && (r.id !== n.id && delete e.xAxis[r.id], (e.xAxis[n.id] = n));
        },
        prepare: Te(),
      },
      removeXAxis: {
        reducer(e, t) {
          delete e.xAxis[t.payload.id];
        },
        prepare: Te(),
      },
      addYAxis: {
        reducer(e, t) {
          e.yAxis[t.payload.id] = t.payload;
        },
        prepare: Te(),
      },
      replaceYAxis: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload;
          e.yAxis[r.id] !== void 0 && (r.id !== n.id && delete e.yAxis[r.id], (e.yAxis[n.id] = n));
        },
        prepare: Te(),
      },
      removeYAxis: {
        reducer(e, t) {
          delete e.yAxis[t.payload.id];
        },
        prepare: Te(),
      },
      addZAxis: {
        reducer(e, t) {
          e.zAxis[t.payload.id] = t.payload;
        },
        prepare: Te(),
      },
      replaceZAxis: {
        reducer(e, t) {
          var { prev: r, next: n } = t.payload;
          e.zAxis[r.id] !== void 0 && (r.id !== n.id && delete e.zAxis[r.id], (e.zAxis[n.id] = n));
        },
        prepare: Te(),
      },
      removeZAxis: {
        reducer(e, t) {
          delete e.zAxis[t.payload.id];
        },
        prepare: Te(),
      },
      updateYAxisWidth(e, t) {
        var { id: r, width: n } = t.payload,
          i = e.yAxis[r];
        if (i) {
          var a,
            o = i.widthHistory || [];
          if (
            o.length === 3 &&
            o[0] === o[2] &&
            n === o[1] &&
            n !== i.width &&
            Math.abs(n - ((a = o[0]) !== null && a !== void 0 ? a : 0)) <= 1
          )
            return;
          var s = [...o, n].slice(-3);
          e.yAxis[r] = gb(gb({}, i), {}, { width: n, widthHistory: s });
        }
      },
    },
  }),
  {
    addXAxis: iz,
    replaceXAxis: az,
    removeXAxis: oz,
    addYAxis: sz,
    replaceYAxis: lz,
    removeYAxis: cz,
    addZAxis: y3,
    replaceZAxis: b3,
    removeZAxis: w3,
    updateYAxisWidth: uz,
  } = SP.actions,
  fz = SP.reducer,
  dz = I([ot], (e) => ({ top: e.top, bottom: e.bottom, left: e.left, right: e.right })),
  hz = I([dz, Vr, Gr], (e, t, r) => {
    if (!(!e || t == null || r == null))
      return {
        x: e.left,
        y: e.top,
        width: Math.max(0, t - e.left - e.right),
        height: Math.max(0, r - e.top - e.bottom),
      };
  }),
  dm = () => re(hz),
  mz = () => re(q$);
function yb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gf(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? yb(Object(r), !0).forEach(function (n) {
          pz(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : yb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function pz(e, t, r) {
  return (
    (t = vz(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function vz(e) {
  var t = gz(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function gz(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var yz = (e) => {
  var { point: t, childIndex: r, mainColor: n, activeDot: i, dataKey: a, clipPath: o } = e;
  if (i === !1 || t.x == null || t.y == null) return null;
  var s = {
      index: r,
      dataKey: a,
      cx: t.x,
      cy: t.y,
      r: 4,
      fill: n ?? 'none',
      strokeWidth: 2,
      stroke: '#fff',
      payload: t.payload,
      value: t.value,
    },
    l = gf(gf(gf({}, s), Ka(i)), Yd(i)),
    c;
  return (
    d.isValidElement(i)
      ? (c = d.cloneElement(i, l))
      : typeof i == 'function'
        ? (c = i(l))
        : (c = d.createElement(cP, l)),
    d.createElement(yt, { className: 'recharts-active-dot', clipPath: o }, c)
  );
};
function bb(e) {
  var { points: t, mainColor: r, activeDot: n, itemDataKey: i, clipPath: a, zIndex: o = at.activeDot } = e,
    s = re(Hn),
    l = mz();
  if (t == null || l == null) return null;
  var c = t.find((u) => l.includes(u.payload));
  return ze(c)
    ? null
    : d.createElement(
        rr,
        { zIndex: o },
        d.createElement(yz, { point: c, childIndex: Number(s), mainColor: r, dataKey: i, activeDot: n, clipPath: a }),
      );
}
var wb = (e, t, r) => {
    var n = r ?? e;
    if (!ze(n)) return lr(n, t, 0);
  },
  bz = (e, t, r) => {
    var n = {},
      i = e.filter(ql),
      a = e.filter((c) => c.stackId == null),
      o = i.reduce((c, u) => {
        var f = c[u.stackId];
        return (f == null && (f = []), f.push(u), (c[u.stackId] = f), c);
      }, n),
      s = Object.entries(o).map((c) => {
        var u,
          [f, h] = c,
          m = h.map((v) => v.dataKey),
          p = wb(t, r, (u = h[0]) === null || u === void 0 ? void 0 : u.barSize);
        return { stackId: f, dataKeys: m, barSize: p };
      }),
      l = a.map((c) => {
        var u = [c.dataKey].filter((h) => h != null),
          f = wb(t, r, c.barSize);
        return { stackId: void 0, dataKeys: u, barSize: f };
      });
    return [...s, ...l];
  };
function xb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Xo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? xb(Object(r), !0).forEach(function (n) {
          wz(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : xb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function wz(e, t, r) {
  return (
    (t = xz(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function xz(e) {
  var t = Sz(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function Sz(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Az(e, t, r, n, i) {
  var a,
    o = n.length;
  if (!(o < 1)) {
    var s = lr(e, r, 0, !0),
      l,
      c = [];
    if (he((a = n[0]) === null || a === void 0 ? void 0 : a.barSize)) {
      var u = !1,
        f = r / o,
        h = n.reduce((S, x) => S + (x.barSize || 0), 0);
      ((h += (o - 1) * s),
        h >= r && ((h -= (o - 1) * s), (s = 0)),
        h >= r && f > 0 && ((u = !0), (f *= 0.9), (h = o * f)));
      var m = ((r - h) / 2) >> 0,
        p = { offset: m - s, size: 0 };
      l = n.reduce((S, x) => {
        var A,
          C = {
            stackId: x.stackId,
            dataKeys: x.dataKeys,
            position: { offset: p.offset + p.size + s, size: u ? f : (A = x.barSize) !== null && A !== void 0 ? A : 0 },
          },
          P = [...S, C];
        return ((p = C.position), P);
      }, c);
    } else {
      var v = lr(t, r, 0, !0);
      r - 2 * v - (o - 1) * s <= 0 && (s = 0);
      var g = (r - 2 * v - (o - 1) * s) / o;
      g > 1 && (g >>= 0);
      var b = he(i) ? Math.min(g, i) : g;
      l = n.reduce(
        (S, x, A) => [
          ...S,
          { stackId: x.stackId, dataKeys: x.dataKeys, position: { offset: v + (g + s) * A + (g - b) / 2, size: b } },
        ],
        c,
      );
    }
    return l;
  }
}
var Pz = (e, t, r, n, i, a, o) => {
    var s = ze(o) ? t : o,
      l = Az(r, n, i !== a ? i : a, e, s);
    return (
      i !== a &&
        l != null &&
        (l = l.map((c) =>
          Xo(Xo({}, c), {}, { position: Xo(Xo({}, c.position), {}, { offset: c.position.offset - i / 2 }) }),
        )),
      l
    );
  },
  Cz = (e, t) => {
    var r = Hl(t);
    if (!(!e || r == null || t == null)) {
      var { stackId: n } = t;
      if (n != null) {
        var i = e[n];
        if (i) {
          var { stackedData: a } = i;
          if (a) return a.find((o) => o.key === r);
        }
      }
    }
  },
  Oz = (e, t) => {
    if (!(e == null || t == null)) {
      var r = e.find((n) => n.stackId === t.stackId && t.dataKey != null && n.dataKeys.includes(t.dataKey));
      if (r != null) return r.position;
    }
  };
function _z(e, t) {
  return e && typeof e == 'object' && 'zIndex' in e && typeof e.zIndex == 'number' && he(e.zIndex) ? e.zIndex : t;
}
var Ez = (e) => {
    var { chartData: t } = e,
      r = Ke(),
      n = wt();
    return (
      d.useEffect(
        () =>
          n
            ? () => {}
            : (r(My(t)),
              () => {
                r(My(void 0));
              }),
        [t, r, n],
      ),
      null
    );
  },
  Sb = { x: 0, y: 0, width: 0, height: 0, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
  AP = bt({
    name: 'brush',
    initialState: Sb,
    reducers: {
      setBrushSettings(e, t) {
        return t.payload == null ? Sb : t.payload;
      },
    },
  }),
  { setBrushSettings: x3 } = AP.actions,
  kz = AP.reducer;
function jz(e) {
  return ((e % 180) + 180) % 180;
}
var Nz = function (t) {
    var { width: r, height: n } = t,
      i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      a = jz(i),
      o = (a * Math.PI) / 180,
      s = Math.atan(n / r),
      l = o > s && o < Math.PI - s ? n / Math.sin(o) : r / Math.cos(o);
    return Math.abs(l);
  },
  Iz = { dots: [], areas: [], lines: [] },
  PP = bt({
    name: 'referenceElements',
    initialState: Iz,
    reducers: {
      addDot: (e, t) => {
        e.dots.push(t.payload);
      },
      removeDot: (e, t) => {
        var r = Xt(e).dots.findIndex((n) => n === t.payload);
        r !== -1 && e.dots.splice(r, 1);
      },
      addArea: (e, t) => {
        e.areas.push(t.payload);
      },
      removeArea: (e, t) => {
        var r = Xt(e).areas.findIndex((n) => n === t.payload);
        r !== -1 && e.areas.splice(r, 1);
      },
      addLine: (e, t) => {
        e.lines.push(t.payload);
      },
      removeLine: (e, t) => {
        var r = Xt(e).lines.findIndex((n) => n === t.payload);
        r !== -1 && e.lines.splice(r, 1);
      },
    },
  }),
  { addDot: S3, removeDot: A3, addArea: P3, removeArea: C3, addLine: O3, removeLine: _3 } = PP.actions,
  Tz = PP.reducer,
  Mz = d.createContext(void 0),
  Dz = (e) => {
    var { children: t } = e,
      [r] = d.useState(''.concat(Oa('recharts'), '-clip')),
      n = dm();
    if (n == null) return null;
    var { x: i, y: a, width: o, height: s } = n;
    return d.createElement(
      Mz.Provider,
      { value: r },
      d.createElement(
        'defs',
        null,
        d.createElement('clipPath', { id: r }, d.createElement('rect', { x: i, y: a, height: s, width: o })),
      ),
      t,
    );
  };
function CP(e, t) {
  if (t < 1) return [];
  if (t === 1) return e;
  for (var r = [], n = 0; n < e.length; n += t) {
    var i = e[n];
    i !== void 0 && r.push(i);
  }
  return r;
}
function Rz(e, t, r) {
  var n = { width: e.width + t.width, height: e.height + t.height };
  return Nz(n, r);
}
function Lz(e, t, r) {
  var n = r === 'width',
    { x: i, y: a, width: o, height: s } = e;
  return t === 1 ? { start: n ? i : a, end: n ? i + o : a + s } : { start: n ? i + o : a + s, end: n ? i : a };
}
function Ba(e, t, r, n, i) {
  if (e * t < e * n || e * t > e * i) return !1;
  var a = r();
  return e * (t - (e * a) / 2 - n) >= 0 && e * (t + (e * a) / 2 - i) <= 0;
}
function $z(e, t) {
  return CP(e, t + 1);
}
function Fz(e, t, r, n, i) {
  for (
    var a = (n || []).slice(),
      { start: o, end: s } = t,
      l = 0,
      c = 1,
      u = o,
      f = function () {
        var p = n?.[l];
        if (p === void 0) return { v: CP(n, c) };
        var v = l,
          g,
          b = () => (g === void 0 && (g = r(p, v)), g),
          S = p.coordinate,
          x = l === 0 || Ba(e, S, b, u, s);
        (x || ((l = 0), (u = o), (c += 1)), x && ((u = S + e * (b() / 2 + i)), (l += c)));
      },
      h;
    c <= a.length;
  )
    if (((h = f()), h)) return h.v;
  return [];
}
function Bz(e, t, r, n, i) {
  var a = (n || []).slice(),
    o = a.length;
  if (o === 0) return [];
  for (var { start: s, end: l } = t, c = 1; c <= o; c++) {
    for (
      var u = (o - 1) % c,
        f = s,
        h = !0,
        m = function () {
          var A = n[v];
          if (A == null) return 0;
          var C = v,
            P,
            _ = () => (P === void 0 && (P = r(A, C)), P),
            E = A.coordinate,
            j = v === u || Ba(e, E, _, f, l);
          if (!j) return ((h = !1), 1);
          j && (f = E + e * (_() / 2 + i));
        },
        p,
        v = u;
      v < o && ((p = m()), !(p !== 0 && p === 1));
      v += c
    );
    if (h) {
      for (var g = [], b = u; b < o; b += c) {
        var S = n[b];
        S != null && g.push(S);
      }
      return g;
    }
  }
  return [];
}
function Ab(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function vt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ab(Object(r), !0).forEach(function (n) {
          Uz(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ab(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Uz(e, t, r) {
  return (
    (t = zz(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function zz(e) {
  var t = Kz(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function Kz(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Wz(e, t, r, n, i) {
  for (
    var a = (n || []).slice(),
      o = a.length,
      { start: s } = t,
      { end: l } = t,
      c = function (h) {
        var m = a[h];
        if (m == null) return 1;
        var p = m,
          v,
          g = () => (v === void 0 && (v = r(m, h)), v);
        if (h === o - 1) {
          var b = e * (p.coordinate + (e * g()) / 2 - l);
          a[h] = p = vt(vt({}, p), {}, { tickCoord: b > 0 ? p.coordinate - b * e : p.coordinate });
        } else a[h] = p = vt(vt({}, p), {}, { tickCoord: p.coordinate });
        if (p.tickCoord != null) {
          var S = Ba(e, p.tickCoord, g, s, l);
          S && ((l = p.tickCoord - e * (g() / 2 + i)), (a[h] = vt(vt({}, p), {}, { isShow: !0 })));
        }
      },
      u = o - 1;
    u >= 0;
    u--
  )
    c(u);
  return a;
}
function Hz(e, t, r, n, i, a) {
  var o = (n || []).slice(),
    s = o.length,
    { start: l, end: c } = t;
  if (a) {
    var u = n[s - 1];
    if (u != null) {
      var f = r(u, s - 1),
        h = e * (u.coordinate + (e * f) / 2 - c);
      if (
        ((o[s - 1] = u = vt(vt({}, u), {}, { tickCoord: h > 0 ? u.coordinate - h * e : u.coordinate })),
        u.tickCoord != null)
      ) {
        var m = Ba(e, u.tickCoord, () => f, l, c);
        m && ((c = u.tickCoord - e * (f / 2 + i)), (o[s - 1] = vt(vt({}, u), {}, { isShow: !0 })));
      }
    }
  }
  for (
    var p = a ? s - 1 : s,
      v = function (S) {
        var x = o[S];
        if (x == null) return 1;
        var A = x,
          C,
          P = () => (C === void 0 && (C = r(x, S)), C);
        if (S === 0) {
          var _ = e * (A.coordinate - (e * P()) / 2 - l);
          o[S] = A = vt(vt({}, A), {}, { tickCoord: _ < 0 ? A.coordinate - _ * e : A.coordinate });
        } else o[S] = A = vt(vt({}, A), {}, { tickCoord: A.coordinate });
        if (A.tickCoord != null) {
          var E = Ba(e, A.tickCoord, P, l, c);
          E && ((l = A.tickCoord + e * (P() / 2 + i)), (o[S] = vt(vt({}, A), {}, { isShow: !0 })));
        }
      },
      g = 0;
    g < p;
    g++
  )
    v(g);
  return o;
}
function hm(e, t, r) {
  var {
    tick: n,
    ticks: i,
    viewBox: a,
    minTickGap: o,
    orientation: s,
    interval: l,
    tickFormatter: c,
    unit: u,
    angle: f,
  } = e;
  if (!i || !i.length || !n) return [];
  if (X(l) || Za.isSsr) {
    var h;
    return (h = $z(i, X(l) ? l : 0)) !== null && h !== void 0 ? h : [];
  }
  var m = [],
    p = s === 'top' || s === 'bottom' ? 'width' : 'height',
    v = u && p === 'width' ? xa(u, { fontSize: t, letterSpacing: r }) : { width: 0, height: 0 },
    g = (C, P) => {
      var _ = typeof c == 'function' ? c(C.value, P) : C.value;
      return p === 'width'
        ? Rz(xa(_, { fontSize: t, letterSpacing: r }), v, f)
        : xa(_, { fontSize: t, letterSpacing: r })[p];
    },
    b = i[0],
    S = i[1],
    x = i.length >= 2 && b != null && S != null ? Nt(S.coordinate - b.coordinate) : 1,
    A = Lz(a, x, p);
  return l === 'equidistantPreserveStart'
    ? Fz(x, A, g, i, o)
    : l === 'equidistantPreserveEnd'
      ? Bz(x, A, g, i, o)
      : (l === 'preserveStart' || l === 'preserveStartEnd'
          ? (m = Hz(x, A, g, i, o, l === 'preserveStartEnd'))
          : (m = Wz(x, A, g, i, o)),
        m.filter((C) => C.isShow));
}
var qz = (e) => {
    var { ticks: t, label: r, labelGapWithTick: n = 5, tickSize: i = 0, tickMargin: a = 0 } = e,
      o = 0;
    if (t) {
      Array.from(t).forEach((u) => {
        if (u) {
          var f = u.getBoundingClientRect();
          f.width > o && (o = f.width);
        }
      });
      var s = r ? r.getBoundingClientRect().width : 0,
        l = i + a,
        c = o + l + s + (r ? n : 0);
      return Math.round(c);
    }
    return 0;
  },
  Vz = { xAxis: {}, yAxis: {} },
  OP = bt({
    name: 'renderedTicks',
    initialState: Vz,
    reducers: {
      setRenderedTicks: (e, t) => {
        var { axisType: r, axisId: n, ticks: i } = t.payload;
        e[r][n] = i;
      },
      removeRenderedTicks: (e, t) => {
        var { axisType: r, axisId: n } = t.payload;
        delete e[r][n];
      },
    },
  }),
  { setRenderedTicks: Gz, removeRenderedTicks: Yz } = OP.actions,
  Xz = OP.reducer,
  Zz = ['axisLine', 'width', 'height', 'className', 'hide', 'ticks', 'axisType', 'axisId'];
function Jz(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = Qz(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function Qz(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function qn() {
  return (
    (qn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    qn.apply(null, arguments)
  );
}
function Pb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function He(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Pb(Object(r), !0).forEach(function (n) {
          eK(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Pb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function eK(e, t, r) {
  return (
    (t = tK(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function tK(e) {
  var t = rK(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function rK(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var Br = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: { x: 0, y: 0, width: 0, height: 0 },
  orientation: 'bottom',
  ticks: [],
  stroke: '#666',
  tickLine: !0,
  axisLine: !0,
  tick: !0,
  mirror: !1,
  minTickGap: 5,
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd',
  zIndex: at.axis,
};
function nK(e) {
  var { x: t, y: r, width: n, height: i, orientation: a, mirror: o, axisLine: s, otherSvgProps: l } = e;
  if (!s) return null;
  var c = He(He(He({}, l), Qt(s)), {}, { fill: 'none' });
  if (a === 'top' || a === 'bottom') {
    var u = +((a === 'top' && !o) || (a === 'bottom' && o));
    c = He(He({}, c), {}, { x1: t, y1: r + u * i, x2: t + n, y2: r + u * i });
  } else {
    var f = +((a === 'left' && !o) || (a === 'right' && o));
    c = He(He({}, c), {}, { x1: t + f * n, y1: r, x2: t + f * n, y2: r + i });
  }
  return d.createElement('line', qn({}, c, { className: Ne('recharts-cartesian-axis-line', xi(s, 'className')) }));
}
function iK(e, t, r, n, i, a, o, s, l) {
  var c,
    u,
    f,
    h,
    m,
    p,
    v = s ? -1 : 1,
    g = e.tickSize || o,
    b = X(e.tickCoord) ? e.tickCoord : e.coordinate;
  switch (a) {
    case 'top':
      ((c = u = e.coordinate), (h = r + +!s * i), (f = h - v * g), (p = f - v * l), (m = b));
      break;
    case 'left':
      ((f = h = e.coordinate), (u = t + +!s * n), (c = u - v * g), (m = c - v * l), (p = b));
      break;
    case 'right':
      ((f = h = e.coordinate), (u = t + +s * n), (c = u + v * g), (m = c + v * l), (p = b));
      break;
    default:
      ((c = u = e.coordinate), (h = r + +s * i), (f = h + v * g), (p = f + v * l), (m = b));
      break;
  }
  return { line: { x1: c, y1: f, x2: u, y2: h }, tick: { x: m, y: p } };
}
function aK(e, t) {
  switch (e) {
    case 'left':
      return t ? 'start' : 'end';
    case 'right':
      return t ? 'end' : 'start';
    default:
      return 'middle';
  }
}
function oK(e, t) {
  switch (e) {
    case 'left':
    case 'right':
      return 'middle';
    case 'top':
      return t ? 'start' : 'end';
    default:
      return t ? 'end' : 'start';
  }
}
function sK(e) {
  var { option: t, tickProps: r, value: n } = e,
    i,
    a = Ne(r.className, 'recharts-cartesian-axis-tick-value');
  if (d.isValidElement(t)) i = d.cloneElement(t, He(He({}, r), {}, { className: a }));
  else if (typeof t == 'function') i = t(He(He({}, r), {}, { className: a }));
  else {
    var o = 'recharts-cartesian-axis-tick-value';
    (typeof t != 'boolean' && (o = Ne(o, fU(t))), (i = d.createElement(um, qn({}, r, { className: o }), n)));
  }
  return i;
}
function lK(e) {
  var { ticks: t, axisType: r, axisId: n } = e,
    i = Ke();
  return (
    d.useEffect(() => {
      if (n == null || r == null) return Gn;
      var a = t.map((o) => ({ value: o.value, coordinate: o.coordinate, offset: o.offset, index: o.index }));
      return (
        i(Gz({ ticks: a, axisId: n, axisType: r })),
        () => {
          i(Yz({ axisId: n, axisType: r }));
        }
      );
    }, [i, t, n, r]),
    null
  );
}
var cK = d.forwardRef((e, t) => {
    var {
        ticks: r = [],
        tick: n,
        tickLine: i,
        stroke: a,
        tickFormatter: o,
        unit: s,
        padding: l,
        tickTextProps: c,
        orientation: u,
        mirror: f,
        x: h,
        y: m,
        width: p,
        height: v,
        tickSize: g,
        tickMargin: b,
        fontSize: S,
        letterSpacing: x,
        getTicksConfig: A,
        events: C,
        axisType: P,
        axisId: _,
      } = e,
      E = hm(He(He({}, A), {}, { ticks: r }), S, x),
      j = Qt(A),
      N = Ka(n),
      M = QA(j.textAnchor) ? j.textAnchor : aK(u, f),
      O = oK(u, f),
      D = {};
    typeof i == 'object' && (D = i);
    var B = He(He({}, j), {}, { fill: 'none' }, D),
      Y = E.map((V) => He({ entry: V }, iK(V, h, m, p, v, u, g, f, b))),
      Q = Y.map((V) => {
        var { entry: T, line: F } = V;
        return d.createElement(
          yt,
          {
            className: 'recharts-cartesian-axis-tick',
            key: 'tick-'.concat(T.value, '-').concat(T.coordinate, '-').concat(T.tickCoord),
          },
          i &&
            d.createElement(
              'line',
              qn({}, B, F, { className: Ne('recharts-cartesian-axis-tick-line', xi(i, 'className')) }),
            ),
        );
      }),
      se = Y.map((V, T) => {
        var F,
          W,
          { entry: z, tick: H } = V,
          G = He(
            He(
              He(He({ verticalAnchor: O }, j), {}, { textAnchor: M, stroke: 'none', fill: a }, H),
              {},
              { index: T, payload: z, visibleTicksCount: E.length, tickFormatter: o, padding: l },
              c,
            ),
            {},
            { angle: (F = (W = c?.angle) !== null && W !== void 0 ? W : j.angle) !== null && F !== void 0 ? F : 0 },
          ),
          le = He(He({}, G), N);
        return d.createElement(
          yt,
          qn(
            {
              className: 'recharts-cartesian-axis-tick-label',
              key: 'tick-label-'.concat(z.value, '-').concat(z.coordinate, '-').concat(z.tickCoord),
            },
            Xd(C, z, T),
          ),
          n &&
            d.createElement(sK, {
              option: n,
              tickProps: le,
              value: ''.concat(typeof o == 'function' ? o(z.value, T) : z.value).concat(s || ''),
            }),
        );
      });
    return d.createElement(
      'g',
      { className: 'recharts-cartesian-axis-ticks recharts-'.concat(P, '-ticks') },
      d.createElement(lK, { ticks: E, axisId: _, axisType: P }),
      se.length > 0 &&
        d.createElement(
          rr,
          { zIndex: at.label },
          d.createElement(
            'g',
            { className: 'recharts-cartesian-axis-tick-labels recharts-'.concat(P, '-tick-labels'), ref: t },
            se,
          ),
        ),
      Q.length > 0 &&
        d.createElement('g', { className: 'recharts-cartesian-axis-tick-lines recharts-'.concat(P, '-tick-lines') }, Q),
    );
  }),
  uK = d.forwardRef((e, t) => {
    var { axisLine: r, width: n, height: i, className: a, hide: o, ticks: s, axisType: l, axisId: c } = e,
      u = Jz(e, Zz),
      [f, h] = d.useState(''),
      [m, p] = d.useState(''),
      v = d.useRef(null);
    d.useImperativeHandle(t, () => ({
      getCalculatedWidth: () => {
        var b;
        return qz({
          ticks: v.current,
          label: (b = e.labelRef) === null || b === void 0 ? void 0 : b.current,
          labelGapWithTick: 5,
          tickSize: e.tickSize,
          tickMargin: e.tickMargin,
        });
      },
    }));
    var g = d.useCallback(
      (b) => {
        if (b) {
          var S = b.getElementsByClassName('recharts-cartesian-axis-tick-value');
          v.current = S;
          var x = S[0];
          if (x) {
            var A = window.getComputedStyle(x),
              C = A.fontSize,
              P = A.letterSpacing;
            (C !== f || P !== m) && (h(C), p(P));
          }
        }
      },
      [f, m],
    );
    return o || (n != null && n <= 0) || (i != null && i <= 0)
      ? null
      : d.createElement(
          rr,
          { zIndex: e.zIndex },
          d.createElement(
            yt,
            { className: Ne('recharts-cartesian-axis', a) },
            d.createElement(nK, {
              x: e.x,
              y: e.y,
              width: n,
              height: i,
              orientation: e.orientation,
              mirror: e.mirror,
              axisLine: r,
              otherSvgProps: Qt(e),
            }),
            d.createElement(cK, {
              ref: g,
              axisType: l,
              events: u,
              fontSize: f,
              getTicksConfig: e,
              height: e.height,
              letterSpacing: m,
              mirror: e.mirror,
              orientation: e.orientation,
              padding: e.padding,
              stroke: e.stroke,
              tick: e.tick,
              tickFormatter: e.tickFormatter,
              tickLine: e.tickLine,
              tickMargin: e.tickMargin,
              tickSize: e.tickSize,
              tickTextProps: e.tickTextProps,
              ticks: s,
              unit: e.unit,
              width: e.width,
              x: e.x,
              y: e.y,
              axisId: c,
            }),
            d.createElement(
              qB,
              { x: e.x, y: e.y, width: e.width, height: e.height, lowerWidth: e.width, upperWidth: e.width },
              d.createElement(rU, { label: e.label, labelRef: e.labelRef }),
              e.children,
            ),
          ),
        );
  }),
  mm = d.forwardRef((e, t) => {
    var r = Mt(e, Br);
    return d.createElement(uK, qn({}, r, { ref: t }));
  });
mm.displayName = 'CartesianAxis';
var fK = ['x1', 'y1', 'x2', 'y2', 'key'],
  dK = ['offset'],
  hK = ['xAxisId', 'yAxisId'],
  mK = ['xAxisId', 'yAxisId'];
function Cb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Cb(Object(r), !0).forEach(function (n) {
          pK(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Cb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function pK(e, t, r) {
  return (
    (t = vK(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function vK(e) {
  var t = gK(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function gK(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Dn() {
  return (
    (Dn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Dn.apply(null, arguments)
  );
}
function al(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = yK(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function yK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var bK = (e) => {
  var { fill: t } = e;
  if (!t || t === 'none') return null;
  var { fillOpacity: r, x: n, y: i, width: a, height: o, ry: s } = e;
  return d.createElement('rect', {
    x: n,
    y: i,
    ry: s,
    width: a,
    height: o,
    stroke: 'none',
    fill: t,
    fillOpacity: r,
    className: 'recharts-cartesian-grid-bg',
  });
};
function _P(e) {
  var { option: t, lineItemProps: r } = e,
    n;
  if (d.isValidElement(t)) n = d.cloneElement(t, r);
  else if (typeof t == 'function') n = t(r);
  else {
    var i,
      { x1: a, y1: o, x2: s, y2: l, key: c } = r,
      u = al(r, fK),
      f = (i = Qt(u)) !== null && i !== void 0 ? i : {},
      { offset: h } = f,
      m = al(f, dK);
    n = d.createElement('line', Dn({}, m, { x1: a, y1: o, x2: s, y2: l, fill: 'none', key: c }));
  }
  return n;
}
function wK(e) {
  var { x: t, width: r, horizontal: n = !0, horizontalPoints: i } = e;
  if (!n || !i || !i.length) return null;
  var { xAxisId: a, yAxisId: o } = e,
    s = al(e, hK),
    l = i.map((c, u) => {
      var f = gt(gt({}, s), {}, { x1: t, y1: c, x2: t + r, y2: c, key: 'line-'.concat(u), index: u });
      return d.createElement(_P, { key: 'line-'.concat(u), option: n, lineItemProps: f });
    });
  return d.createElement('g', { className: 'recharts-cartesian-grid-horizontal' }, l);
}
function xK(e) {
  var { y: t, height: r, vertical: n = !0, verticalPoints: i } = e;
  if (!n || !i || !i.length) return null;
  var { xAxisId: a, yAxisId: o } = e,
    s = al(e, mK),
    l = i.map((c, u) => {
      var f = gt(gt({}, s), {}, { x1: c, y1: t, x2: c, y2: t + r, key: 'line-'.concat(u), index: u });
      return d.createElement(_P, { option: n, lineItemProps: f, key: 'line-'.concat(u) });
    });
  return d.createElement('g', { className: 'recharts-cartesian-grid-vertical' }, l);
}
function SK(e) {
  var {
    horizontalFill: t,
    fillOpacity: r,
    x: n,
    y: i,
    width: a,
    height: o,
    horizontalPoints: s,
    horizontal: l = !0,
  } = e;
  if (!l || !t || !t.length || s == null) return null;
  var c = s.map((f) => Math.round(f + i - i)).sort((f, h) => f - h);
  i !== c[0] && c.unshift(0);
  var u = c.map((f, h) => {
    var m = c[h + 1],
      p = m == null,
      v = p ? i + o - f : m - f;
    if (v <= 0) return null;
    var g = h % t.length;
    return d.createElement('rect', {
      key: 'react-'.concat(h),
      y: f,
      x: n,
      height: v,
      width: a,
      stroke: 'none',
      fill: t[g],
      fillOpacity: r,
      className: 'recharts-cartesian-grid-bg',
    });
  });
  return d.createElement('g', { className: 'recharts-cartesian-gridstripes-horizontal' }, u);
}
function AK(e) {
  var { vertical: t = !0, verticalFill: r, fillOpacity: n, x: i, y: a, width: o, height: s, verticalPoints: l } = e;
  if (!t || !r || !r.length) return null;
  var c = l.map((f) => Math.round(f + i - i)).sort((f, h) => f - h);
  i !== c[0] && c.unshift(0);
  var u = c.map((f, h) => {
    var m = c[h + 1],
      p = m == null,
      v = p ? i + o - f : m - f;
    if (v <= 0) return null;
    var g = h % r.length;
    return d.createElement('rect', {
      key: 'react-'.concat(h),
      x: f,
      y: a,
      width: v,
      height: s,
      stroke: 'none',
      fill: r[g],
      fillOpacity: n,
      className: 'recharts-cartesian-grid-bg',
    });
  });
  return d.createElement('g', { className: 'recharts-cartesian-gridstripes-vertical' }, u);
}
var PK = (e, t) => {
    var { xAxis: r, width: n, height: i, offset: a } = e;
    return r0(
      hm(gt(gt(gt({}, Br), r), {}, { ticks: n0(r), viewBox: { x: 0, y: 0, width: n, height: i } })),
      a.left,
      a.left + a.width,
      t,
    );
  },
  CK = (e, t) => {
    var { yAxis: r, width: n, height: i, offset: a } = e;
    return r0(
      hm(gt(gt(gt({}, Br), r), {}, { ticks: n0(r), viewBox: { x: 0, y: 0, width: n, height: i } })),
      a.top,
      a.top + a.height,
      t,
    );
  },
  OK = {
    horizontal: !0,
    vertical: !0,
    horizontalPoints: [],
    verticalPoints: [],
    stroke: '#ccc',
    fill: 'none',
    verticalFill: [],
    horizontalFill: [],
    xAxisId: 0,
    yAxisId: 0,
    syncWithTicks: !1,
    zIndex: at.grid,
  };
function EP(e) {
  var t = l0(),
    r = c0(),
    n = s0(),
    i = gt(
      gt({}, Mt(e, OK)),
      {},
      {
        x: X(e.x) ? e.x : n.left,
        y: X(e.y) ? e.y : n.top,
        width: X(e.width) ? e.width : n.width,
        height: X(e.height) ? e.height : n.height,
      },
    ),
    {
      xAxisId: a,
      yAxisId: o,
      x: s,
      y: l,
      width: c,
      height: u,
      syncWithTicks: f,
      horizontalValues: h,
      verticalValues: m,
    } = i,
    p = wt(),
    v = re((j) => xy(j, 'xAxis', a, p)),
    g = re((j) => xy(j, 'yAxis', o, p));
  if (!Ai(c) || !Ai(u) || !X(s) || !X(l)) return null;
  var b = i.verticalCoordinatesGenerator || PK,
    S = i.horizontalCoordinatesGenerator || CK,
    { horizontalPoints: x, verticalPoints: A } = i;
  if ((!x || !x.length) && typeof S == 'function') {
    var C = h && h.length,
      P = S(
        { yAxis: g ? gt(gt({}, g), {}, { ticks: C ? h : g.ticks }) : void 0, width: t ?? c, height: r ?? u, offset: n },
        C ? !0 : f,
      );
    (Ov(
      Array.isArray(P),
      'horizontalCoordinatesGenerator should return Array but instead it returned ['.concat(typeof P, ']'),
    ),
      Array.isArray(P) && (x = P));
  }
  if ((!A || !A.length) && typeof b == 'function') {
    var _ = m && m.length,
      E = b(
        { xAxis: v ? gt(gt({}, v), {}, { ticks: _ ? m : v.ticks }) : void 0, width: t ?? c, height: r ?? u, offset: n },
        _ ? !0 : f,
      );
    (Ov(
      Array.isArray(E),
      'verticalCoordinatesGenerator should return Array but instead it returned ['.concat(typeof E, ']'),
    ),
      Array.isArray(E) && (A = E));
  }
  return d.createElement(
    rr,
    { zIndex: i.zIndex },
    d.createElement(
      'g',
      { className: 'recharts-cartesian-grid' },
      d.createElement(bK, {
        fill: i.fill,
        fillOpacity: i.fillOpacity,
        x: i.x,
        y: i.y,
        width: i.width,
        height: i.height,
        ry: i.ry,
      }),
      d.createElement(SK, Dn({}, i, { horizontalPoints: x })),
      d.createElement(AK, Dn({}, i, { verticalPoints: A })),
      d.createElement(wK, Dn({}, i, { offset: n, horizontalPoints: x, xAxis: v, yAxis: g })),
      d.createElement(xK, Dn({}, i, { offset: n, verticalPoints: A, xAxis: v, yAxis: g })),
    ),
  );
}
EP.displayName = 'CartesianGrid';
var _K = {},
  kP = bt({
    name: 'errorBars',
    initialState: _K,
    reducers: {
      addErrorBar: (e, t) => {
        var { itemId: r, errorBar: n } = t.payload;
        (e[r] || (e[r] = []), e[r].push(n));
      },
      replaceErrorBar: (e, t) => {
        var { itemId: r, prev: n, next: i } = t.payload;
        e[r] && (e[r] = e[r].map((a) => (a.dataKey === n.dataKey && a.direction === n.direction ? i : a)));
      },
      removeErrorBar: (e, t) => {
        var { itemId: r, errorBar: n } = t.payload;
        e[r] && (e[r] = e[r].filter((i) => i.dataKey !== n.dataKey || i.direction !== n.direction));
      },
    },
  }),
  { addErrorBar: E3, replaceErrorBar: k3, removeErrorBar: j3 } = kP.actions,
  EK = kP.reducer,
  kK = ['children'];
function jK(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = NK(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function NK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var IK = {
    data: [],
    xAxisId: 'xAxis-0',
    yAxisId: 'yAxis-0',
    dataPointFormatter: () => ({ x: 0, y: 0, value: 0 }),
    errorBarOffset: 0,
  },
  TK = d.createContext(IK);
function MK(e) {
  var { children: t } = e,
    r = jK(e, kK);
  return d.createElement(TK.Provider, { value: r }, t);
}
function pm(e, t) {
  var r,
    n,
    i = re((c) => Zr(c, e)),
    a = re((c) => Jr(c, t)),
    o = (r = i?.allowDataOverflow) !== null && r !== void 0 ? r : Ze.allowDataOverflow,
    s = (n = a?.allowDataOverflow) !== null && n !== void 0 ? n : Je.allowDataOverflow,
    l = o || s;
  return { needClip: l, needClipX: o, needClipY: s };
}
function jP(e) {
  var { xAxisId: t, yAxisId: r, clipPathId: n } = e,
    i = dm(),
    { needClipX: a, needClipY: o, needClip: s } = pm(t, r);
  if (!s || !i) return null;
  var { x: l, y: c, width: u, height: f } = i;
  return d.createElement(
    'clipPath',
    { id: 'clipPath-'.concat(n) },
    d.createElement('rect', {
      x: a ? l : l - u / 2,
      y: o ? c : c - f / 2,
      width: a ? u : u * 2,
      height: o ? f : f * 2,
    }),
  );
}
function DK(e) {
  var t = Ka(e),
    r = 3,
    n = 2;
  if (t != null) {
    var { r: i, strokeWidth: a } = t,
      o = Number(i),
      s = Number(a);
    return ((Number.isNaN(o) || o < 0) && (o = r), (Number.isNaN(s) || s < 0) && (s = n), { r: o, strokeWidth: s });
  }
  return { r, strokeWidth: n };
}
function Or(e, t) {
  var r, n;
  return (r =
    (n = e.graphicalItems.cartesianItems.find((i) => i.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !==
    null && r !== void 0
    ? r
    : xP;
}
function _r(e, t) {
  var r, n;
  return (r =
    (n = e.graphicalItems.cartesianItems.find((i) => i.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !==
    null && r !== void 0
    ? r
    : xP;
}
var NP = (e, t, r) => yn(e, 'xAxis', Or(e, t), r),
  IP = (e, t, r) => gn(e, 'xAxis', Or(e, t), r),
  TP = (e, t, r) => yn(e, 'yAxis', _r(e, t), r),
  MP = (e, t, r) => gn(e, 'yAxis', _r(e, t), r),
  RK = I([Ce, NP, TP, IP, MP], (e, t, r, n, i) => (Cr(e, 'xAxis') ? Pi(t, n, !1) : Pi(r, i, !1))),
  LK = (e, t) => t,
  DP = I([tc, LK], (e, t) => e.filter((r) => r.type === 'area').find((r) => r.id === t)),
  RP = (e) => {
    var t = Ce(e),
      r = Cr(t, 'xAxis');
    return r ? 'yAxis' : 'xAxis';
  },
  $K = (e, t) => {
    var r = RP(e);
    return r === 'yAxis' ? _r(e, t) : Or(e, t);
  },
  FK = (e, t, r) => Zs(e, RP(e), $K(e, t), r),
  BK = I([DP, FK], (e, t) => {
    var r;
    if (!(e == null || t == null)) {
      var { stackId: n } = e,
        i = Hl(e);
      if (!(n == null || i == null)) {
        var a = (r = t[n]) === null || r === void 0 ? void 0 : r.stackedData,
          o = a?.find((s) => s.key === i);
        if (o != null) return o.map((s) => [s[0], s[1]]);
      }
    }
  }),
  UK = I([Ce, NP, TP, IP, MP, BK, N0, RK, DP, eD], (e, t, r, n, i, a, o, s, l, c) => {
    var { chartData: u, dataStartIndex: f, dataEndIndex: h } = o;
    if (
      !(
        l == null ||
        (e !== 'horizontal' && e !== 'vertical') ||
        t == null ||
        r == null ||
        n == null ||
        i == null ||
        n.length === 0 ||
        i.length === 0 ||
        s == null
      )
    ) {
      var { data: m } = l,
        p;
      if ((m && m.length > 0 ? (p = m) : (p = u?.slice(f, h + 1)), p != null))
        return sW({
          layout: e,
          xAxis: t,
          yAxis: r,
          xAxisTicks: n,
          yAxisTicks: i,
          dataStartIndex: f,
          areaSettings: l,
          stackedData: a,
          displayedData: p,
          chartBaseValue: c,
          bandSize: s,
        });
    }
  }),
  zK = ['id'],
  KK = [
    'activeDot',
    'animationBegin',
    'animationDuration',
    'animationEasing',
    'connectNulls',
    'dot',
    'fill',
    'fillOpacity',
    'hide',
    'isAnimationActive',
    'legendType',
    'stroke',
    'xAxisId',
    'yAxisId',
  ];
function Fn() {
  return (
    (Fn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Fn.apply(null, arguments)
  );
}
function LP(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = WK(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function WK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function Ob(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function vi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ob(Object(r), !0).forEach(function (n) {
          HK(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ob(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function HK(e, t, r) {
  return (
    (t = qK(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function qK(e) {
  var t = VK(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function VK(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function ol(e, t) {
  return e && e !== 'none' ? e : t;
}
var GK = (e) => {
    var { dataKey: t, name: r, stroke: n, fill: i, legendType: a, hide: o } = e;
    return [{ inactive: o, dataKey: t, type: a, color: ol(n, i), value: kl(r, t), payload: e }];
  },
  YK = d.memo((e) => {
    var {
        dataKey: t,
        data: r,
        stroke: n,
        strokeWidth: i,
        fill: a,
        name: o,
        hide: s,
        unit: l,
        tooltipType: c,
        id: u,
      } = e,
      f = {
        dataDefinedOnItem: r,
        getPosition: Gn,
        settings: {
          stroke: n,
          strokeWidth: i,
          fill: a,
          dataKey: t,
          nameKey: void 0,
          name: kl(o, t),
          hide: s,
          type: c,
          color: ol(n, a),
          unit: l,
          graphicalItemId: u,
        },
      };
    return d.createElement(vP, { tooltipEntrySettings: f });
  });
function XK(e) {
  var { clipPathId: t, points: r, props: n } = e,
    { needClip: i, dot: a, dataKey: o } = n,
    s = Qt(n);
  return d.createElement(QU, {
    points: r,
    dot: a,
    className: 'recharts-area-dots',
    dotClassName: 'recharts-area-dot',
    dataKey: o,
    baseProps: s,
    needClip: i,
    clipPathId: t,
  });
}
function ZK(e) {
  var { showLabels: t, children: r, points: n } = e,
    i = n.map((a) => {
      var o,
        s,
        l = {
          x: (o = a.x) !== null && o !== void 0 ? o : 0,
          y: (s = a.y) !== null && s !== void 0 ? s : 0,
          width: 0,
          lowerWidth: 0,
          upperWidth: 0,
          height: 0,
        };
      return vi(vi({}, l), {}, { value: a.value, payload: a.payload, parentViewBox: void 0, viewBox: l, fill: void 0 });
    });
  return d.createElement(oP, { value: t ? i : void 0 }, r);
}
function _b(e) {
  var { points: t, baseLine: r, needClip: n, clipPathId: i, props: a } = e,
    { layout: o, type: s, stroke: l, connectNulls: c, isRange: u } = a,
    { id: f } = a,
    h = LP(a, zK),
    m = Qt(h),
    p = Ct(h);
  return d.createElement(
    d.Fragment,
    null,
    t?.length > 1 &&
      d.createElement(
        yt,
        { clipPath: n ? 'url(#clipPath-'.concat(i, ')') : void 0 },
        d.createElement(
          wa,
          Fn({}, p, {
            id: f,
            points: t,
            connectNulls: c,
            type: s,
            baseLine: r,
            layout: o,
            stroke: 'none',
            className: 'recharts-area-area',
          }),
        ),
        l !== 'none' &&
          d.createElement(
            wa,
            Fn({}, m, {
              className: 'recharts-area-curve',
              layout: o,
              type: s,
              connectNulls: c,
              fill: 'none',
              points: t,
            }),
          ),
        l !== 'none' &&
          u &&
          Array.isArray(r) &&
          d.createElement(
            wa,
            Fn({}, m, {
              className: 'recharts-area-curve',
              layout: o,
              type: s,
              connectNulls: c,
              fill: 'none',
              points: r,
            }),
          ),
      ),
    d.createElement(XK, { points: t, props: h, clipPathId: i }),
  );
}
function JK(e) {
  var t,
    r,
    { alpha: n, baseLine: i, points: a, strokeWidth: o } = e,
    s = (t = a[0]) === null || t === void 0 ? void 0 : t.y,
    l = (r = a[a.length - 1]) === null || r === void 0 ? void 0 : r.y;
  if (!he(s) || !he(l)) return null;
  var c = n * Math.abs(s - l),
    u = Math.max(...a.map((f) => f.x || 0));
  return (
    X(i) ? (u = Math.max(i, u)) : i && Array.isArray(i) && i.length && (u = Math.max(...i.map((f) => f.x || 0), u)),
    X(u)
      ? d.createElement('rect', {
          x: 0,
          y: s < l ? s : s - c,
          width: u + (o ? parseInt(''.concat(o), 10) : 1),
          height: Math.floor(c),
        })
      : null
  );
}
function QK(e) {
  var t,
    r,
    { alpha: n, baseLine: i, points: a, strokeWidth: o } = e,
    s = (t = a[0]) === null || t === void 0 ? void 0 : t.x,
    l = (r = a[a.length - 1]) === null || r === void 0 ? void 0 : r.x;
  if (!he(s) || !he(l)) return null;
  var c = n * Math.abs(s - l),
    u = Math.max(...a.map((f) => f.y || 0));
  return (
    X(i) ? (u = Math.max(i, u)) : i && Array.isArray(i) && i.length && (u = Math.max(...i.map((f) => f.y || 0), u)),
    X(u)
      ? d.createElement('rect', {
          x: s < l ? s : s - c,
          y: 0,
          width: c,
          height: Math.floor(u + (o ? parseInt(''.concat(o), 10) : 1)),
        })
      : null
  );
}
function eW(e) {
  var { alpha: t, layout: r, points: n, baseLine: i, strokeWidth: a } = e;
  return r === 'vertical'
    ? d.createElement(JK, { alpha: t, points: n, baseLine: i, strokeWidth: a })
    : d.createElement(QK, { alpha: t, points: n, baseLine: i, strokeWidth: a });
}
function tW(e) {
  var { needClip: t, clipPathId: r, props: n, previousPointsRef: i, previousBaselineRef: a } = e,
    {
      points: o,
      baseLine: s,
      isAnimationActive: l,
      animationBegin: c,
      animationDuration: u,
      animationEasing: f,
      onAnimationStart: h,
      onAnimationEnd: m,
    } = n,
    p = d.useMemo(() => ({ points: o, baseLine: s }), [o, s]),
    v = Fl(p, 'recharts-area-'),
    g = sh(),
    [b, S] = d.useState(!1),
    x = !b,
    A = d.useCallback(() => {
      (typeof m == 'function' && m(), S(!1));
    }, [m]),
    C = d.useCallback(() => {
      (typeof h == 'function' && h(), S(!0));
    }, [h]);
  if (g == null) return null;
  var P = i.current,
    _ = a.current;
  return d.createElement(
    ZK,
    { showLabels: x, points: o },
    n.children,
    d.createElement(
      $l,
      { animationId: v, begin: c, duration: u, isActive: l, easing: f, onAnimationEnd: A, onAnimationStart: C, key: v },
      (E) => {
        if (P) {
          var j = P.length / o.length,
            N =
              E === 1
                ? o
                : o.map((O, D) => {
                    var B = Math.floor(D * j);
                    if (P[B]) {
                      var Y = P[B];
                      return vi(vi({}, O), {}, { x: Be(Y.x, O.x, E), y: Be(Y.y, O.y, E) });
                    }
                    return O;
                  }),
            M;
          return (
            X(s)
              ? (M = Be(_, s, E))
              : ze(s) || sr(s)
                ? (M = Be(_, 0, E))
                : (M = s.map((O, D) => {
                    var B = Math.floor(D * j);
                    if (Array.isArray(_) && _[B]) {
                      var Y = _[B];
                      return vi(vi({}, O), {}, { x: Be(Y.x, O.x, E), y: Be(Y.y, O.y, E) });
                    }
                    return O;
                  })),
            E > 0 && ((i.current = N), (a.current = M)),
            d.createElement(_b, { points: N, baseLine: M, needClip: t, clipPathId: r, props: n })
          );
        }
        return (
          E > 0 && ((i.current = o), (a.current = s)),
          d.createElement(
            yt,
            null,
            l &&
              d.createElement(
                'defs',
                null,
                d.createElement(
                  'clipPath',
                  { id: 'animationClipPath-'.concat(r) },
                  d.createElement(eW, { alpha: E, points: o, baseLine: s, layout: g, strokeWidth: n.strokeWidth }),
                ),
              ),
            d.createElement(
              yt,
              { clipPath: 'url(#animationClipPath-'.concat(r, ')') },
              d.createElement(_b, { points: o, baseLine: s, needClip: t, clipPathId: r, props: n }),
            ),
          )
        );
      },
    ),
    d.createElement(lP, { label: n.label }),
  );
}
function rW(e) {
  var { needClip: t, clipPathId: r, props: n } = e,
    i = d.useRef(null),
    a = d.useRef();
  return d.createElement(tW, { needClip: t, clipPathId: r, props: n, previousPointsRef: i, previousBaselineRef: a });
}
class nW extends d.PureComponent {
  render() {
    var {
      hide: t,
      dot: r,
      points: n,
      className: i,
      top: a,
      left: o,
      needClip: s,
      xAxisId: l,
      yAxisId: c,
      width: u,
      height: f,
      id: h,
      baseLine: m,
      zIndex: p,
    } = this.props;
    if (t) return null;
    var v = Ne('recharts-area', i),
      g = h,
      { r: b, strokeWidth: S } = DK(r),
      x = dP(r),
      A = b * 2 + S,
      C = s ? 'url(#clipPath-'.concat(x ? '' : 'dots-').concat(g, ')') : void 0;
    return d.createElement(
      rr,
      { zIndex: p },
      d.createElement(
        yt,
        { className: v },
        s &&
          d.createElement(
            'defs',
            null,
            d.createElement(jP, { clipPathId: g, xAxisId: l, yAxisId: c }),
            !x &&
              d.createElement(
                'clipPath',
                { id: 'clipPath-dots-'.concat(g) },
                d.createElement('rect', { x: o - A / 2, y: a - A / 2, width: u + A, height: f + A }),
              ),
          ),
        d.createElement(rW, { needClip: s, clipPathId: g, props: this.props }),
      ),
      d.createElement(bb, {
        points: n,
        mainColor: ol(this.props.stroke, this.props.fill),
        itemDataKey: this.props.dataKey,
        activeDot: this.props.activeDot,
        clipPath: C,
      }),
      this.props.isRange &&
        Array.isArray(m) &&
        d.createElement(bb, {
          points: m,
          mainColor: ol(this.props.stroke, this.props.fill),
          itemDataKey: this.props.dataKey,
          activeDot: this.props.activeDot,
          clipPath: C,
        }),
    );
  }
}
var iW = {
  activeDot: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: !1,
  dot: !1,
  fill: '#3182bd',
  fillOpacity: 0.6,
  hide: !1,
  isAnimationActive: 'auto',
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  type: 'linear',
  label: !1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: at.area,
};
function aW(e) {
  var t,
    {
      activeDot: r,
      animationBegin: n,
      animationDuration: i,
      animationEasing: a,
      connectNulls: o,
      dot: s,
      fill: l,
      fillOpacity: c,
      hide: u,
      isAnimationActive: f,
      legendType: h,
      stroke: m,
      xAxisId: p,
      yAxisId: v,
    } = e,
    g = LP(e, KK),
    b = Yn(),
    S = $A(),
    { needClip: x } = pm(p, v),
    A = wt(),
    { points: C, isRange: P, baseLine: _ } = (t = re((D) => UK(D, e.id, A))) !== null && t !== void 0 ? t : {},
    E = dm();
  if ((b !== 'horizontal' && b !== 'vertical') || E == null || (S !== 'AreaChart' && S !== 'ComposedChart'))
    return null;
  var { height: j, width: N, x: M, y: O } = E;
  return !C || !C.length
    ? null
    : d.createElement(
        nW,
        Fn({}, g, {
          activeDot: r,
          animationBegin: n,
          animationDuration: i,
          animationEasing: a,
          baseLine: _,
          connectNulls: o,
          dot: s,
          fill: l,
          fillOpacity: c,
          height: j,
          hide: u,
          layout: b,
          isAnimationActive: f,
          isRange: P,
          legendType: h,
          needClip: x,
          points: C,
          stroke: m,
          width: N,
          left: M,
          top: O,
          xAxisId: p,
          yAxisId: v,
        }),
      );
}
var oW = (e, t, r, n, i) => {
  var a = r ?? t;
  if (X(a)) return a;
  var o = e === 'horizontal' ? i : n,
    s = o.scale.domain();
  if (o.type === 'number') {
    var l = Math.max(s[0], s[1]),
      c = Math.min(s[0], s[1]);
    return a === 'dataMin' ? c : a === 'dataMax' || l < 0 ? l : Math.max(Math.min(s[0], s[1]), 0);
  }
  return a === 'dataMin' ? s[0] : a === 'dataMax' ? s[1] : s[0];
};
function sW(e) {
  var {
      areaSettings: { connectNulls: t, baseValue: r, dataKey: n },
      stackedData: i,
      layout: a,
      chartBaseValue: o,
      xAxis: s,
      yAxis: l,
      displayedData: c,
      dataStartIndex: u,
      xAxisTicks: f,
      yAxisTicks: h,
      bandSize: m,
    } = e,
    p = i && i.length,
    v = oW(a, o, r, s, l),
    g = a === 'horizontal',
    b = !1,
    S = c.map((A, C) => {
      var P, _, E, j;
      if (p) j = i[u + C];
      else {
        var N = Ye(A, n);
        Array.isArray(N) ? ((j = N), (b = !0)) : (j = [v, N]);
      }
      var M = (P = (_ = j) === null || _ === void 0 ? void 0 : _[1]) !== null && P !== void 0 ? P : null,
        O = M == null || (p && !t && Ye(A, n) == null);
      if (g) {
        var D;
        return {
          x: wv({ axis: s, ticks: f, bandSize: m, entry: A, index: C }),
          y: O ? null : (D = l.scale.map(M)) !== null && D !== void 0 ? D : null,
          value: j,
          payload: A,
        };
      }
      return {
        x: O ? null : (E = s.scale.map(M)) !== null && E !== void 0 ? E : null,
        y: wv({ axis: l, ticks: h, bandSize: m, entry: A, index: C }),
        value: j,
        payload: A,
      };
    }),
    x;
  return (
    p || b
      ? (x = S.map((A) => {
          var C,
            P = Array.isArray(A.value) ? A.value[0] : null;
          if (g) {
            var _;
            return {
              x: A.x,
              y: P != null && A.y != null && (_ = l.scale.map(P)) !== null && _ !== void 0 ? _ : null,
              payload: A.payload,
            };
          }
          return {
            x: P != null && (C = s.scale.map(P)) !== null && C !== void 0 ? C : null,
            y: A.y,
            payload: A.payload,
          };
        }))
      : (x = g ? l.scale.map(v) : s.scale.map(v)),
    { points: S, baseLine: x ?? 0, isRange: b }
  );
}
function lW(e) {
  var t = Mt(e, iW),
    r = wt();
  return d.createElement(yP, { id: t.id, type: 'area' }, (n) =>
    d.createElement(
      d.Fragment,
      null,
      d.createElement(gP, { legendPayload: GK(t) }),
      d.createElement(YK, {
        dataKey: t.dataKey,
        data: t.data,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        unit: t.unit,
        tooltipType: t.tooltipType,
        id: n,
      }),
      d.createElement(wP, {
        type: 'area',
        id: n,
        data: t.data,
        dataKey: t.dataKey,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: 0,
        stackId: i0(t.stackId),
        hide: t.hide,
        barSize: void 0,
        baseValue: t.baseValue,
        isPanorama: r,
        connectNulls: t.connectNulls,
      }),
      d.createElement(aW, Fn({}, t, { id: n })),
    ),
  );
}
var $P = d.memo(lW, Xa);
$P.displayName = 'Area';
var cW = 'Invariant failed';
function uW(e, t) {
  throw new Error(cW);
}
function yd() {
  return (
    (yd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    yd.apply(null, arguments)
  );
}
function vm(e) {
  return d.createElement(
    MU,
    yd(
      { shapeType: 'rectangle', activeClassName: 'recharts-active-bar', inActiveClassName: 'recharts-inactive-bar' },
      e,
    ),
  );
}
var fW = function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return (n, i) => {
      if (X(t)) return t;
      var a = X(n) || ze(n);
      return a ? t(n, i) : (a || uW(), r);
    };
  },
  dW = (e, t, r) => r,
  hW = (e, t) => t,
  co = I([tc, hW], (e, t) => e.filter((r) => r.type === 'bar').find((r) => r.id === t)),
  mW = I([co], (e) => e?.maxBarSize),
  pW = (e, t, r, n) => n,
  vW = I([Ce, tc, Or, _r, dW], (e, t, r, n, i) =>
    t
      .filter((a) => (e === 'horizontal' ? a.xAxisId === r : a.yAxisId === n))
      .filter((a) => a.isPanorama === i)
      .filter((a) => a.hide === !1)
      .filter((a) => a.type === 'bar'),
  ),
  gW = (e, t, r) => {
    var n = Ce(e),
      i = Or(e, t),
      a = _r(e, t);
    if (!(i == null || a == null)) return n === 'horizontal' ? Zs(e, 'yAxis', a, r) : Zs(e, 'xAxis', i, r);
  },
  yW = (e, t) => {
    var r = Ce(e),
      n = Or(e, t),
      i = _r(e, t);
    if (!(n == null || i == null)) return r === 'horizontal' ? wy(e, 'xAxis', n) : wy(e, 'yAxis', i);
  },
  bW = I([vW, QM, yW], bz),
  wW = (e, t, r) => {
    var n,
      i,
      a = co(e, t);
    if (a == null) return 0;
    var o = Or(e, t),
      s = _r(e, t);
    if (o == null || s == null) return 0;
    var l = Ce(e),
      c = K0(e),
      { maxBarSize: u } = a,
      f = ze(u) ? c : u,
      h,
      m;
    return (
      l === 'horizontal'
        ? ((h = yn(e, 'xAxis', o, r)), (m = gn(e, 'xAxis', o, r)))
        : ((h = yn(e, 'yAxis', s, r)), (m = gn(e, 'yAxis', s, r))),
      (n = (i = Pi(h, m, !0)) !== null && i !== void 0 ? i : f) !== null && n !== void 0 ? n : 0
    );
  },
  FP = (e, t, r) => {
    var n = Ce(e),
      i = Or(e, t),
      a = _r(e, t);
    if (!(i == null || a == null)) {
      var o, s;
      return (
        n === 'horizontal'
          ? ((o = yn(e, 'xAxis', i, r)), (s = gn(e, 'xAxis', i, r)))
          : ((o = yn(e, 'yAxis', a, r)), (s = gn(e, 'yAxis', a, r))),
        Pi(o, s)
      );
    }
  },
  xW = I([bW, K0, JM, W0, wW, FP, mW], Pz),
  SW = (e, t, r) => {
    var n = Or(e, t);
    if (n != null) return yn(e, 'xAxis', n, r);
  },
  AW = (e, t, r) => {
    var n = _r(e, t);
    if (n != null) return yn(e, 'yAxis', n, r);
  },
  PW = (e, t, r) => {
    var n = Or(e, t);
    if (n != null) return gn(e, 'xAxis', n, r);
  },
  CW = (e, t, r) => {
    var n = _r(e, t);
    if (n != null) return gn(e, 'yAxis', n, r);
  },
  OW = I([xW, co], Oz),
  _W = I([gW, co], Cz),
  EW = I([ot, ah, SW, AW, PW, CW, OW, Ce, N0, FP, _W, co, pW], (e, t, r, n, i, a, o, s, l, c, u, f, h) => {
    var { chartData: m, dataStartIndex: p, dataEndIndex: v } = l;
    if (
      !(
        f == null ||
        o == null ||
        t == null ||
        (s !== 'horizontal' && s !== 'vertical') ||
        r == null ||
        n == null ||
        i == null ||
        a == null ||
        c == null
      )
    ) {
      var { data: g } = f,
        b;
      if ((g != null && g.length > 0 ? (b = g) : (b = m?.slice(p, v + 1)), b != null))
        return rH({
          layout: s,
          barSettings: f,
          pos: o,
          parentViewBox: t,
          bandSize: c,
          xAxis: r,
          yAxis: n,
          xAxisTicks: i,
          yAxisTicks: a,
          stackedData: u,
          displayedData: b,
          offset: e,
          cells: h,
          dataStartIndex: p,
        });
    }
  }),
  kW = ['index'];
function bd() {
  return (
    (bd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    bd.apply(null, arguments)
  );
}
function jW(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = NW(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function NW(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var BP = d.createContext(void 0),
  IW = (e) => {
    var t = d.useContext(BP);
    if (t != null) return t.stackId;
    if (e != null) return i0(e);
  },
  TW = (e, t) => 'recharts-bar-stack-clip-path-'.concat(e, '-').concat(t),
  MW = (e) => {
    var t = d.useContext(BP);
    if (t != null) {
      var { stackId: r } = t;
      return 'url(#'.concat(TW(r, e), ')');
    }
  },
  UP = (e) => {
    var { index: t } = e,
      r = jW(e, kW),
      n = MW(t);
    return d.createElement(yt, bd({ className: 'recharts-bar-stack-layer', clipPath: n }, r));
  },
  DW = ['onMouseEnter', 'onMouseLeave', 'onClick'],
  RW = ['value', 'background', 'tooltipPosition'],
  LW = ['id'],
  $W = ['onMouseEnter', 'onClick', 'onMouseLeave'];
function bn() {
  return (
    (bn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    bn.apply(null, arguments)
  );
}
function Eb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function At(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Eb(Object(r), !0).forEach(function (n) {
          FW(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Eb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function FW(e, t, r) {
  return (
    (t = BW(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function BW(e) {
  var t = UW(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function UW(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function sl(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = zW(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function zW(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var KW = (e) => {
    var { dataKey: t, name: r, fill: n, legendType: i, hide: a } = e;
    return [{ inactive: a, dataKey: t, type: i, color: n, value: kl(r, t), payload: e }];
  },
  WW = d.memo((e) => {
    var { dataKey: t, stroke: r, strokeWidth: n, fill: i, name: a, hide: o, unit: s, tooltipType: l, id: c } = e,
      u = {
        dataDefinedOnItem: void 0,
        getPosition: Gn,
        settings: {
          stroke: r,
          strokeWidth: n,
          fill: i,
          dataKey: t,
          nameKey: void 0,
          name: kl(a, t),
          hide: o,
          type: l,
          color: i,
          unit: s,
          graphicalItemId: c,
        },
      };
    return d.createElement(vP, { tooltipEntrySettings: u });
  });
function HW(e) {
  var t = re(Hn),
    { data: r, dataKey: n, background: i, allOtherBarProps: a } = e,
    { onMouseEnter: o, onMouseLeave: s, onClick: l } = a,
    c = sl(a, DW),
    u = hP(o, n, a.id),
    f = mP(s),
    h = pP(l, n, a.id);
  if (!i || r == null) return null;
  var m = Ka(i);
  return d.createElement(
    rr,
    { zIndex: _z(i, at.barBackground) },
    r.map((p, v) => {
      var { value: g, background: b, tooltipPosition: S } = p,
        x = sl(p, RW);
      if (!b) return null;
      var A = u(p, v),
        C = f(p, v),
        P = h(p, v),
        _ = At(
          At(At(At(At({ option: i, isActive: String(v) === t }, x), {}, { fill: '#eee' }, b), m), Xd(c, p, v)),
          {},
          {
            onMouseEnter: A,
            onMouseLeave: C,
            onClick: P,
            dataKey: n,
            index: v,
            className: 'recharts-bar-background-rectangle',
          },
        );
      return d.createElement(vm, bn({ key: 'background-bar-'.concat(v) }, _));
    }),
  );
}
function qW(e) {
  var { showLabels: t, children: r, rects: n } = e,
    i = n?.map((a) => {
      var o = { x: a.x, y: a.y, width: a.width, lowerWidth: a.width, upperWidth: a.width, height: a.height };
      return At(
        At({}, o),
        {},
        { value: a.value, payload: a.payload, parentViewBox: a.parentViewBox, viewBox: o, fill: a.fill },
      );
    });
  return d.createElement(oP, { value: t ? i : void 0 }, r);
}
function VW(e) {
  var { shape: t, activeBar: r, baseProps: n, entry: i, index: a, dataKey: o } = e,
    s = re(Hn),
    l = re(DA),
    c = r && String(i.originalDataIndex) === s && (l == null || o === l),
    [u, f] = d.useState(!1),
    [h, m] = d.useState(!1);
  d.useEffect(() => {
    var x;
    return (
      c
        ? (f(!0),
          (x = requestAnimationFrame(() => {
            m(!0);
          })))
        : m(!1),
      () => {
        cancelAnimationFrame(x);
      }
    );
  }, [c]);
  var p = d.useCallback(() => {
      c || f(!1);
    }, [c]),
    v = c && h,
    g = c || u,
    b;
  c ? (r === !0 ? (b = t) : (b = r)) : (b = t);
  var S = d.createElement(
    vm,
    bn({}, n, { name: String(n.name) }, i, { isActive: v, option: b, index: a, dataKey: o, onTransitionEnd: p }),
  );
  return g ? d.createElement(rr, { zIndex: at.activeBar }, d.createElement(UP, { index: i.originalDataIndex }, S)) : S;
}
function GW(e) {
  var { shape: t, baseProps: r, entry: n, index: i, dataKey: a } = e;
  return d.createElement(vm, bn({}, r, { name: String(r.name) }, n, { isActive: !1, option: t, index: i, dataKey: a }));
}
function YW(e) {
  var t,
    { data: r, props: n } = e,
    i = (t = Qt(n)) !== null && t !== void 0 ? t : {},
    { id: a } = i,
    o = sl(i, LW),
    { shape: s, dataKey: l, activeBar: c } = n,
    { onMouseEnter: u, onClick: f, onMouseLeave: h } = n,
    m = sl(n, $W),
    p = hP(u, l, a),
    v = mP(h),
    g = pP(f, l, a);
  return r
    ? d.createElement(
        d.Fragment,
        null,
        r.map((b, S) =>
          d.createElement(
            UP,
            bn(
              {
                index: b.originalDataIndex,
                key: 'rectangle-'.concat(b?.x, '-').concat(b?.y, '-').concat(b?.value, '-').concat(S),
                className: 'recharts-bar-rectangle',
              },
              Xd(m, b, S),
              { onMouseEnter: p(b, S), onMouseLeave: v(b, S), onClick: g(b, S) },
            ),
            c
              ? d.createElement(VW, { shape: s, activeBar: c, baseProps: o, entry: b, index: S, dataKey: l })
              : d.createElement(GW, { shape: s, baseProps: o, entry: b, index: S, dataKey: l }),
          ),
        ),
      )
    : null;
}
function XW(e) {
  var { props: t, previousRectanglesRef: r } = e,
    {
      data: n,
      layout: i,
      isAnimationActive: a,
      animationBegin: o,
      animationDuration: s,
      animationEasing: l,
      onAnimationEnd: c,
      onAnimationStart: u,
    } = t,
    f = r.current,
    h = Fl(t, 'recharts-bar-'),
    [m, p] = d.useState(!1),
    v = !m,
    g = d.useCallback(() => {
      (typeof c == 'function' && c(), p(!1));
    }, [c]),
    b = d.useCallback(() => {
      (typeof u == 'function' && u(), p(!0));
    }, [u]);
  return d.createElement(
    qW,
    { showLabels: v, rects: n },
    d.createElement(
      $l,
      { animationId: h, begin: o, duration: s, isActive: a, easing: l, onAnimationEnd: g, onAnimationStart: b, key: h },
      (S) => {
        var x =
          S === 1
            ? n
            : n?.map((A, C) => {
                var P = f && f[C];
                if (P)
                  return At(
                    At({}, A),
                    {},
                    {
                      x: Be(P.x, A.x, S),
                      y: Be(P.y, A.y, S),
                      width: Be(P.width, A.width, S),
                      height: Be(P.height, A.height, S),
                    },
                  );
                if (i === 'horizontal') {
                  var _ = Be(0, A.height, S),
                    E = Be(A.stackedBarStart, A.y, S);
                  return At(At({}, A), {}, { y: E, height: _ });
                }
                var j = Be(0, A.width, S),
                  N = Be(A.stackedBarStart, A.x, S);
                return At(At({}, A), {}, { width: j, x: N });
              });
        return (
          S > 0 && (r.current = x ?? null),
          x == null ? null : d.createElement(yt, null, d.createElement(YW, { props: t, data: x }))
        );
      },
    ),
    d.createElement(lP, { label: t.label }),
    t.children,
  );
}
function ZW(e) {
  var t = d.useRef(null);
  return d.createElement(XW, { previousRectanglesRef: t, props: e });
}
var zP = 0,
  JW = (e, t) => {
    var r = Array.isArray(e.value) ? e.value[1] : e.value;
    return { x: e.x, y: e.y, value: r, errorVal: Ye(e, t) };
  };
class QW extends d.PureComponent {
  render() {
    var {
      hide: t,
      data: r,
      dataKey: n,
      className: i,
      xAxisId: a,
      yAxisId: o,
      needClip: s,
      background: l,
      id: c,
    } = this.props;
    if (t || r == null) return null;
    var u = Ne('recharts-bar', i),
      f = c;
    return d.createElement(
      yt,
      { className: u, id: c },
      s && d.createElement('defs', null, d.createElement(jP, { clipPathId: f, xAxisId: a, yAxisId: o })),
      d.createElement(
        yt,
        { className: 'recharts-bar-rectangles', clipPath: s ? 'url(#clipPath-'.concat(f, ')') : void 0 },
        d.createElement(HW, { data: r, dataKey: n, background: l, allOtherBarProps: this.props }),
        d.createElement(ZW, this.props),
      ),
    );
  }
}
var eH = {
  activeBar: !1,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease',
  background: !1,
  hide: !1,
  isAnimationActive: 'auto',
  label: !1,
  legendType: 'rect',
  minPointSize: zP,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: at.bar,
};
function tH(e) {
  var {
      xAxisId: t,
      yAxisId: r,
      hide: n,
      legendType: i,
      minPointSize: a,
      activeBar: o,
      animationBegin: s,
      animationDuration: l,
      animationEasing: c,
      isAnimationActive: u,
    } = e,
    { needClip: f } = pm(t, r),
    h = Yn(),
    m = wt(),
    p = pU(e.children, cm),
    v = re((S) => EW(S, e.id, m, p));
  if (h !== 'vertical' && h !== 'horizontal') return null;
  var g,
    b = v?.[0];
  return (
    b == null || b.height == null || b.width == null ? (g = 0) : (g = h === 'vertical' ? b.height / 2 : b.width / 2),
    d.createElement(
      MK,
      { xAxisId: t, yAxisId: r, data: v, dataPointFormatter: JW, errorBarOffset: g },
      d.createElement(
        QW,
        bn({}, e, {
          layout: h,
          needClip: f,
          data: v,
          xAxisId: t,
          yAxisId: r,
          hide: n,
          legendType: i,
          minPointSize: a,
          activeBar: o,
          animationBegin: s,
          animationDuration: l,
          animationEasing: c,
          isAnimationActive: u,
        }),
      ),
    )
  );
}
function rH(e) {
  var {
      layout: t,
      barSettings: { dataKey: r, minPointSize: n, hasCustomShape: i },
      pos: a,
      bandSize: o,
      xAxis: s,
      yAxis: l,
      xAxisTicks: c,
      yAxisTicks: u,
      stackedData: f,
      displayedData: h,
      offset: m,
      cells: p,
      parentViewBox: v,
      dataStartIndex: g,
    } = e,
    b = t === 'horizontal' ? l : s,
    S = f ? b.scale.domain() : null,
    x = vI({ numericAxis: b }),
    A = b.scale.map(x);
  return h
    .map((C, P) => {
      var _, E, j, N, M, O;
      if (f) {
        var D = f[P + g];
        if (D == null) return null;
        _ = fI(D, S);
      } else ((_ = Ye(C, r)), Array.isArray(_) || (_ = [x, _]));
      var B = fW(n, zP)(_[1], P);
      if (t === 'horizontal') {
        var Y,
          Q = l.scale.map(_[0]),
          se = l.scale.map(_[1]);
        if (Q == null || se == null) return null;
        ((E = xv({ axis: s, ticks: c, bandSize: o, offset: a.offset, entry: C, index: P })),
          (j = (Y = se ?? Q) !== null && Y !== void 0 ? Y : void 0),
          (N = a.size));
        var V = Q - se;
        if (
          ((M = sr(V) ? 0 : V),
          (O = { x: E, y: m.top, width: N, height: m.height }),
          Math.abs(B) > 0 && Math.abs(M) < Math.abs(B))
        ) {
          var T = Nt(M || B) * (Math.abs(B) - Math.abs(M));
          ((j -= T), (M += T));
        }
      } else {
        var F = s.scale.map(_[0]),
          W = s.scale.map(_[1]);
        if (F == null || W == null) return null;
        if (
          ((E = F),
          (j = xv({ axis: l, ticks: u, bandSize: o, offset: a.offset, entry: C, index: P })),
          (N = W - F),
          (M = a.size),
          (O = { x: m.left, y: j, width: m.width, height: M }),
          Math.abs(B) > 0 && Math.abs(N) < Math.abs(B))
        ) {
          var z = Nt(N || B) * (Math.abs(B) - Math.abs(N));
          N += z;
        }
      }
      if (E == null || j == null || N == null || M == null || (!i && (N === 0 || M === 0))) return null;
      var H = At(
        At({}, C),
        {},
        {
          stackedBarStart: A,
          x: E,
          y: j,
          width: N,
          height: M,
          value: f ? _ : _[1],
          payload: C,
          background: O,
          tooltipPosition: { x: E + N / 2, y: j + M / 2 },
          parentViewBox: v,
          originalDataIndex: P,
        },
        p && p[P] && p[P].props,
      );
      return H;
    })
    .filter(Boolean);
}
function nH(e) {
  var t = Mt(e, eH),
    r = IW(t.stackId),
    n = wt();
  return d.createElement(yP, { id: t.id, type: 'bar' }, (i) =>
    d.createElement(
      d.Fragment,
      null,
      d.createElement(gP, { legendPayload: KW(t) }),
      d.createElement(WW, {
        dataKey: t.dataKey,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        unit: t.unit,
        tooltipType: t.tooltipType,
        id: i,
      }),
      d.createElement(wP, {
        type: 'bar',
        id: i,
        data: void 0,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: 0,
        dataKey: t.dataKey,
        stackId: r,
        hide: t.hide,
        barSize: t.barSize,
        minPointSize: t.minPointSize,
        maxBarSize: t.maxBarSize,
        isPanorama: n,
        hasCustomShape: t.shape != null,
      }),
      d.createElement(rr, { zIndex: t.zIndex }, d.createElement(tH, bn({}, t, { id: i }))),
    ),
  );
}
var KP = d.memo(nH, Xa);
KP.displayName = 'Bar';
var iH = ['domain', 'range'],
  aH = ['domain', 'range'];
function kb(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = oH(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function oH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function jb(e, t) {
  return e === t
    ? !0
    : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2
      ? e[0] === t[0] && e[1] === t[1]
      : !1;
}
function WP(e, t) {
  if (e === t) return !0;
  var { domain: r, range: n } = e,
    i = kb(e, iH),
    { domain: a, range: o } = t,
    s = kb(t, aH);
  return !jb(r, a) || !jb(n, o) ? !1 : Xa(i, s);
}
var sH = ['type'],
  lH = ['dangerouslySetInnerHTML', 'ticks', 'scale'],
  cH = ['id', 'scale'];
function wd() {
  return (
    (wd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    wd.apply(null, arguments)
  );
}
function Nb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Ib(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Nb(Object(r), !0).forEach(function (n) {
          uH(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Nb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function uH(e, t, r) {
  return (
    (t = fH(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function fH(e) {
  var t = dH(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function dH(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function xd(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = hH(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function hH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function mH(e) {
  var t = Ke(),
    r = d.useRef(null),
    n = sh(),
    { type: i } = e,
    a = xd(e, sH),
    o = zl(n, 'xAxis', i),
    s = d.useMemo(() => {
      if (o != null) return Ib(Ib({}, a), {}, { type: o });
    }, [a, o]);
  return (
    d.useLayoutEffect(() => {
      s != null &&
        (r.current === null ? t(iz(s)) : r.current !== s && t(az({ prev: r.current, next: s })), (r.current = s));
    }, [s, t]),
    d.useLayoutEffect(
      () => () => {
        r.current && (t(oz(r.current)), (r.current = null));
      },
      [t],
    ),
    null
  );
}
var pH = (e) => {
    var { xAxisId: t, className: r } = e,
      n = re(ah),
      i = wt(),
      a = 'xAxis',
      o = re((b) => mA(b, a, t, i)),
      s = re((b) => fA(b, t)),
      l = re((b) => M2(b, t)),
      c = re((b) => MS(b, t));
    if (s == null || l == null || c == null) return null;
    var { dangerouslySetInnerHTML: u, ticks: f, scale: h } = e,
      m = xd(e, lH),
      { id: p, scale: v } = c,
      g = xd(c, cH);
    return d.createElement(
      mm,
      wd({}, m, g, {
        x: l.x,
        y: l.y,
        width: s.width,
        height: s.height,
        className: Ne('recharts-'.concat(a, ' ').concat(a), r),
        viewBox: n,
        ticks: o,
        axisType: a,
        axisId: t,
      }),
    );
  },
  vH = {
    allowDataOverflow: Ze.allowDataOverflow,
    allowDecimals: Ze.allowDecimals,
    allowDuplicatedCategory: Ze.allowDuplicatedCategory,
    angle: Ze.angle,
    axisLine: Br.axisLine,
    height: Ze.height,
    hide: !1,
    includeHidden: Ze.includeHidden,
    interval: Ze.interval,
    label: !1,
    minTickGap: Ze.minTickGap,
    mirror: Ze.mirror,
    orientation: Ze.orientation,
    padding: Ze.padding,
    reversed: Ze.reversed,
    scale: Ze.scale,
    tick: Ze.tick,
    tickCount: Ze.tickCount,
    tickLine: Br.tickLine,
    tickSize: Br.tickSize,
    type: Ze.type,
    niceTicks: Ze.niceTicks,
    xAxisId: 0,
  },
  gH = (e) => {
    var t = Mt(e, vH);
    return d.createElement(
      d.Fragment,
      null,
      d.createElement(mH, {
        allowDataOverflow: t.allowDataOverflow,
        allowDecimals: t.allowDecimals,
        allowDuplicatedCategory: t.allowDuplicatedCategory,
        angle: t.angle,
        dataKey: t.dataKey,
        domain: t.domain,
        height: t.height,
        hide: t.hide,
        id: t.xAxisId,
        includeHidden: t.includeHidden,
        interval: t.interval,
        minTickGap: t.minTickGap,
        mirror: t.mirror,
        name: t.name,
        orientation: t.orientation,
        padding: t.padding,
        reversed: t.reversed,
        scale: t.scale,
        tick: t.tick,
        tickCount: t.tickCount,
        tickFormatter: t.tickFormatter,
        ticks: t.ticks,
        type: t.type,
        unit: t.unit,
        niceTicks: t.niceTicks,
      }),
      d.createElement(pH, t),
    );
  },
  gm = d.memo(gH, WP);
gm.displayName = 'XAxis';
var yH = ['type'],
  bH = ['dangerouslySetInnerHTML', 'ticks', 'scale'],
  wH = ['id', 'scale'];
function Sd() {
  return (
    (Sd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Sd.apply(null, arguments)
  );
}
function Tb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Mb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Tb(Object(r), !0).forEach(function (n) {
          xH(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Tb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function xH(e, t, r) {
  return (
    (t = SH(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function SH(e) {
  var t = AH(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function AH(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function Ad(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = PH(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function PH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function CH(e) {
  var t = Ke(),
    r = d.useRef(null),
    n = sh(),
    { type: i } = e,
    a = Ad(e, yH),
    o = zl(n, 'yAxis', i),
    s = d.useMemo(() => {
      if (o != null) return Mb(Mb({}, a), {}, { type: o });
    }, [o, a]);
  return (
    d.useLayoutEffect(() => {
      s != null &&
        (r.current === null ? t(sz(s)) : r.current !== s && t(lz({ prev: r.current, next: s })), (r.current = s));
    }, [s, t]),
    d.useLayoutEffect(
      () => () => {
        r.current && (t(cz(r.current)), (r.current = null));
      },
      [t],
    ),
    null
  );
}
function OH(e) {
  var { yAxisId: t, className: r, width: n, label: i } = e,
    a = d.useRef(null),
    o = d.useRef(null),
    s = re(ah),
    l = wt(),
    c = Ke(),
    u = 'yAxis',
    f = re((P) => dA(P, t)),
    h = re((P) => R2(P, t)),
    m = re((P) => mA(P, u, t, l)),
    p = re((P) => DS(P, t));
  if (
    (d.useLayoutEffect(() => {
      if (!(n !== 'auto' || !f || fm(i) || d.isValidElement(i) || p == null)) {
        var P = a.current;
        if (P) {
          var _ = P.getCalculatedWidth();
          Math.round(f.width) !== Math.round(_) && c(uz({ id: t, width: _ }));
        }
      }
    }, [m, f, c, i, t, n, p]),
    f == null || h == null || p == null)
  )
    return null;
  var { dangerouslySetInnerHTML: v, ticks: g, scale: b } = e,
    S = Ad(e, bH),
    { id: x, scale: A } = p,
    C = Ad(p, wH);
  return d.createElement(
    mm,
    Sd({}, S, C, {
      ref: a,
      labelRef: o,
      x: h.x,
      y: h.y,
      tickTextProps: n === 'auto' ? { width: void 0 } : { width: n },
      width: f.width,
      height: f.height,
      className: Ne('recharts-'.concat(u, ' ').concat(u), r),
      viewBox: s,
      ticks: m,
      axisType: u,
      axisId: t,
    }),
  );
}
var _H = {
    allowDataOverflow: Je.allowDataOverflow,
    allowDecimals: Je.allowDecimals,
    allowDuplicatedCategory: Je.allowDuplicatedCategory,
    angle: Je.angle,
    axisLine: Br.axisLine,
    hide: !1,
    includeHidden: Je.includeHidden,
    interval: Je.interval,
    label: !1,
    minTickGap: Je.minTickGap,
    mirror: Je.mirror,
    orientation: Je.orientation,
    padding: Je.padding,
    reversed: Je.reversed,
    scale: Je.scale,
    tick: Je.tick,
    tickCount: Je.tickCount,
    tickLine: Br.tickLine,
    tickSize: Br.tickSize,
    type: Je.type,
    niceTicks: Je.niceTicks,
    width: Je.width,
    yAxisId: 0,
  },
  EH = (e) => {
    var t = Mt(e, _H);
    return d.createElement(
      d.Fragment,
      null,
      d.createElement(CH, {
        interval: t.interval,
        id: t.yAxisId,
        scale: t.scale,
        type: t.type,
        domain: t.domain,
        allowDataOverflow: t.allowDataOverflow,
        dataKey: t.dataKey,
        allowDuplicatedCategory: t.allowDuplicatedCategory,
        allowDecimals: t.allowDecimals,
        tickCount: t.tickCount,
        padding: t.padding,
        includeHidden: t.includeHidden,
        reversed: t.reversed,
        ticks: t.ticks,
        width: t.width,
        orientation: t.orientation,
        mirror: t.mirror,
        hide: t.hide,
        unit: t.unit,
        name: t.name,
        angle: t.angle,
        minTickGap: t.minTickGap,
        tick: t.tick,
        tickFormatter: t.tickFormatter,
        niceTicks: t.niceTicks,
      }),
      d.createElement(OH, t),
    );
  },
  ym = d.memo(EH, WP);
ym.displayName = 'YAxis';
var kH = (e, t) => t,
  bm = I([kH, Ce, Z0, lt, NA, Qr, iF, ot], fF);
function jH(e) {
  return 'getBBox' in e.currentTarget && typeof e.currentTarget.getBBox == 'function';
}
function wm(e) {
  var t = e.currentTarget.getBoundingClientRect(),
    r,
    n;
  if (jH(e)) {
    var i = e.currentTarget.getBBox();
    ((r = i.width > 0 ? t.width / i.width : 1), (n = i.height > 0 ? t.height / i.height : 1));
  } else {
    var a = e.currentTarget;
    ((r = a.offsetWidth > 0 ? t.width / a.offsetWidth : 1), (n = a.offsetHeight > 0 ? t.height / a.offsetHeight : 1));
  }
  var o = (s, l) => ({ relativeX: Math.round((s - t.left) / r), relativeY: Math.round((l - t.top) / n) });
  return 'touches' in e ? Array.from(e.touches).map((s) => o(s.clientX, s.clientY)) : o(e.clientX, e.clientY);
}
var HP = Bt('mouseClick'),
  qP = qa();
qP.startListening({
  actionCreator: HP,
  effect: (e, t) => {
    var r = e.payload,
      n = bm(t.getState(), wm(r));
    n?.activeIndex != null &&
      t.dispatch(J2({ activeIndex: n.activeIndex, activeDataKey: void 0, activeCoordinate: n.activeCoordinate }));
  },
});
var Pd = Bt('mouseMove'),
  VP = qa(),
  ci = null,
  On = null,
  yf = null;
VP.startListening({
  actionCreator: Pd,
  effect: (e, t) => {
    var r = e.payload,
      n = t.getState(),
      { throttleDelay: i, throttledEvents: a } = n.eventSettings,
      o = a === 'all' || a?.includes('mousemove');
    (ci !== null && (cancelAnimationFrame(ci), (ci = null)),
      On !== null && (typeof i != 'number' || !o) && (clearTimeout(On), (On = null)),
      (yf = wm(r)));
    var s = () => {
      var l = t.getState(),
        c = Qh(l, l.tooltip.settings.shared);
      if (!yf) {
        ((ci = null), (On = null));
        return;
      }
      if (c === 'axis') {
        var u = bm(l, yf);
        u?.activeIndex != null
          ? t.dispatch(SA({ activeIndex: u.activeIndex, activeDataKey: void 0, activeCoordinate: u.activeCoordinate }))
          : t.dispatch(xA());
      }
      ((ci = null), (On = null));
    };
    if (!o) {
      s();
      return;
    }
    i === 'raf' ? (ci = requestAnimationFrame(s)) : typeof i == 'number' && On === null && (On = setTimeout(s, i));
  },
});
function NH(e, t) {
  return t instanceof HTMLElement
    ? 'HTMLElement <'.concat(t.tagName, ' class="').concat(t.className, '">')
    : t === window
      ? 'global.window'
      : e === 'children' && typeof t == 'object' && t !== null
        ? '<<CHILDREN>>'
        : t;
}
var Db = {
    accessibilityLayer: !0,
    barCategoryGap: '10%',
    barGap: 4,
    barSize: void 0,
    className: void 0,
    maxBarSize: void 0,
    stackOffset: 'none',
    syncId: void 0,
    syncMethod: 'index',
    baseValue: void 0,
    reverseStackOrder: !1,
  },
  GP = bt({
    name: 'rootProps',
    initialState: Db,
    reducers: {
      updateOptions: (e, t) => {
        var r;
        ((e.accessibilityLayer = t.payload.accessibilityLayer),
          (e.barCategoryGap = t.payload.barCategoryGap),
          (e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : Db.barGap),
          (e.barSize = t.payload.barSize),
          (e.maxBarSize = t.payload.maxBarSize),
          (e.stackOffset = t.payload.stackOffset),
          (e.syncId = t.payload.syncId),
          (e.syncMethod = t.payload.syncMethod),
          (e.className = t.payload.className),
          (e.baseValue = t.payload.baseValue),
          (e.reverseStackOrder = t.payload.reverseStackOrder));
      },
    },
  }),
  IH = GP.reducer,
  { updateOptions: TH } = GP.actions,
  MH = null,
  DH = {
    updatePolarOptions: (e, t) =>
      e === null
        ? t.payload
        : ((e.startAngle = t.payload.startAngle),
          (e.endAngle = t.payload.endAngle),
          (e.cx = t.payload.cx),
          (e.cy = t.payload.cy),
          (e.innerRadius = t.payload.innerRadius),
          (e.outerRadius = t.payload.outerRadius),
          e),
  },
  YP = bt({ name: 'polarOptions', initialState: MH, reducers: DH }),
  { updatePolarOptions: N3 } = YP.actions,
  RH = YP.reducer,
  XP = Bt('keyDown'),
  ZP = Bt('focus'),
  JP = Bt('blur'),
  ac = qa(),
  ui = null,
  _n = null,
  Zo = null;
ac.startListening({
  actionCreator: XP,
  effect: (e, t) => {
    ((Zo = e.payload), ui !== null && (cancelAnimationFrame(ui), (ui = null)));
    var r = t.getState(),
      { throttleDelay: n, throttledEvents: i } = r.eventSettings,
      a = i === 'all' || i.includes('keydown');
    _n !== null && (typeof n != 'number' || !a) && (clearTimeout(_n), (_n = null));
    var o = () => {
      try {
        var s = t.getState(),
          l = s.rootProps.accessibilityLayer !== !1;
        if (!l) return;
        var { keyboardInteraction: c } = s.tooltip,
          u = Zo;
        if (u !== 'ArrowRight' && u !== 'ArrowLeft' && u !== 'Enter') return;
        var f = em(c, Bi(s), ao(s), so(s)),
          h = f == null ? -1 : Number(f);
        if (!Number.isFinite(h) || h < 0) return;
        var m = Qr(s);
        if (u === 'Enter') {
          var p = el(s, 'axis', 'hover', String(c.index));
          t.dispatch(Qs({ active: !c.active, activeIndex: c.index, activeCoordinate: p }));
          return;
        }
        var v = U2(s),
          g = v === 'left-to-right' ? 1 : -1,
          b = u === 'ArrowRight' ? 1 : -1,
          S = h + b * g;
        if (m == null || S >= m.length || S < 0) return;
        var x = el(s, 'axis', 'hover', String(S));
        t.dispatch(Qs({ active: !0, activeIndex: S.toString(), activeCoordinate: x }));
      } finally {
        ((ui = null), (_n = null));
      }
    };
    if (!a) {
      o();
      return;
    }
    n === 'raf'
      ? (ui = requestAnimationFrame(o))
      : typeof n == 'number' &&
        _n === null &&
        (o(),
        (Zo = null),
        (_n = setTimeout(() => {
          Zo ? o() : ((_n = null), (ui = null));
        }, n)));
  },
});
ac.startListening({
  actionCreator: ZP,
  effect: (e, t) => {
    var r = t.getState(),
      n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var { keyboardInteraction: i } = r.tooltip;
      if (!i.active && i.index == null) {
        var a = '0',
          o = el(r, 'axis', 'hover', String(a));
        t.dispatch(Qs({ active: !0, activeIndex: a, activeCoordinate: o }));
      }
    }
  },
});
ac.startListening({
  actionCreator: JP,
  effect: (e, t) => {
    var r = t.getState(),
      n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var { keyboardInteraction: i } = r.tooltip;
      i.active && t.dispatch(Qs({ active: !1, activeIndex: i.index, activeCoordinate: i.coordinate }));
    }
  },
});
function QP(e) {
  e.persist();
  var { currentTarget: t } = e;
  return new Proxy(e, {
    get: (r, n) => {
      if (n === 'currentTarget') return t;
      var i = Reflect.get(r, n);
      return typeof i == 'function' ? i.bind(r) : i;
    },
  });
}
var Gt = Bt('externalEvent'),
  eC = qa(),
  Jo = new Map(),
  da = new Map(),
  bf = new Map();
eC.startListening({
  actionCreator: Gt,
  effect: (e, t) => {
    var { handler: r, reactEvent: n } = e.payload;
    if (r != null) {
      var i = n.type,
        a = QP(n);
      bf.set(i, { handler: r, reactEvent: a });
      var o = Jo.get(i);
      o !== void 0 && (cancelAnimationFrame(o), Jo.delete(i));
      var s = t.getState(),
        { throttleDelay: l, throttledEvents: c } = s.eventSettings,
        u = c,
        f = u === 'all' || u?.includes(i),
        h = da.get(i);
      h !== void 0 && (typeof l != 'number' || !f) && (clearTimeout(h), da.delete(i));
      var m = () => {
        var g = bf.get(i);
        try {
          if (!g) return;
          var { handler: b, reactEvent: S } = g,
            x = t.getState(),
            A = {
              activeCoordinate: K$(x),
              activeDataKey: DA(x),
              activeIndex: Hn(x),
              activeLabel: MA(x),
              activeTooltipIndex: Hn(x),
              isTooltipActive: W$(x),
            };
          b && b(A, S);
        } finally {
          (Jo.delete(i), da.delete(i), bf.delete(i));
        }
      };
      if (!f) {
        m();
        return;
      }
      if (l === 'raf') {
        var p = requestAnimationFrame(m);
        Jo.set(i, p);
      } else if (typeof l == 'number') {
        if (!da.has(i)) {
          m();
          var v = setTimeout(m, l);
          da.set(i, v);
        }
      } else m();
    }
  },
});
var LH = I([$i], (e) => e.tooltipItemPayloads),
  $H = I([LH, (e, t) => t, (e, t, r) => r], (e, t, r) => {
    if (t != null) {
      var n = e.find((a) => a.settings.graphicalItemId === r);
      if (n != null) {
        var { getPosition: i } = n;
        if (i != null) return i(t);
      }
    }
  }),
  tC = Bt('touchMove'),
  rC = qa(),
  En = null,
  an = null,
  Rb = null,
  ha = null;
rC.startListening({
  actionCreator: tC,
  effect: (e, t) => {
    var r = e.payload;
    if (!(r.touches == null || r.touches.length === 0)) {
      ha = QP(r);
      var n = t.getState(),
        { throttleDelay: i, throttledEvents: a } = n.eventSettings,
        o = a === 'all' || a.includes('touchmove');
      (En !== null && (cancelAnimationFrame(En), (En = null)),
        an !== null && (typeof i != 'number' || !o) && (clearTimeout(an), (an = null)),
        (Rb = Array.from(r.touches).map((l) =>
          wm({ clientX: l.clientX, clientY: l.clientY, currentTarget: r.currentTarget }),
        )));
      var s = () => {
        if (ha != null) {
          var l = t.getState(),
            c = Qh(l, l.tooltip.settings.shared);
          if (c === 'axis') {
            var u,
              f = (u = Rb) === null || u === void 0 ? void 0 : u[0];
            if (f == null) {
              ((En = null), (an = null));
              return;
            }
            var h = bm(l, f);
            h?.activeIndex != null &&
              t.dispatch(
                SA({ activeIndex: h.activeIndex, activeDataKey: void 0, activeCoordinate: h.activeCoordinate }),
              );
          } else if (c === 'item') {
            var m,
              p = ha.touches[0];
            if (document.elementFromPoint == null || p == null) return;
            var v = document.elementFromPoint(p.clientX, p.clientY);
            if (!v || !v.getAttribute) return;
            var g = v.getAttribute(AI),
              b = (m = v.getAttribute(PI)) !== null && m !== void 0 ? m : void 0,
              S = Fi(l).find((C) => C.id === b);
            if (g == null || S == null || b == null) return;
            var { dataKey: x } = S,
              A = $H(l, g, b);
            t.dispatch(wA({ activeDataKey: x, activeIndex: g, activeCoordinate: A, activeGraphicalItemId: b }));
          }
          ((En = null), (an = null));
        }
      };
      if (!o) {
        s();
        return;
      }
      i === 'raf'
        ? (En = requestAnimationFrame(s))
        : typeof i == 'number' &&
          an === null &&
          (s(),
          (ha = null),
          (an = setTimeout(() => {
            ha ? s() : ((an = null), (En = null));
          }, i)));
    }
  },
});
var nC = { throttleDelay: 'raf', throttledEvents: ['mousemove', 'touchmove', 'pointermove', 'scroll', 'wheel'] },
  iC = bt({
    name: 'eventSettings',
    initialState: nC,
    reducers: {
      setEventSettings: (e, t) => {
        (t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay),
          t.payload.throttledEvents != null && (e.throttledEvents = t.payload.throttledEvents));
      },
    },
  }),
  { setEventSettings: FH } = iC.actions,
  BH = iC.reducer,
  UH = _x({
    brush: kz,
    cartesianAxis: fz,
    chartData: zF,
    errorBars: EK,
    eventSettings: BH,
    graphicalItems: KU,
    layout: oI,
    legend: eT,
    options: LF,
    polarAxis: uU,
    polarOptions: RH,
    referenceElements: Tz,
    renderedTicks: Xz,
    rootProps: IH,
    tooltip: Q2,
    zIndex: CF,
  }),
  zH = function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'Chart';
    return NN({
      reducer: UH,
      preloadedState: t,
      middleware: (n) => {
        var i;
        return n({
          serializableCheck: !1,
          immutableCheck: !['commonjs', 'es6', 'production'].includes((i = 'es6') !== null && i !== void 0 ? i : ''),
        }).concat([qP.middleware, VP.middleware, ac.middleware, eC.middleware, rC.middleware]);
      },
      enhancers: (n) => {
        var i = n;
        return (typeof n == 'function' && (i = n()), i.concat(zx({ type: 'raf' })));
      },
      devTools: { serialize: { replacer: NH }, name: 'recharts-'.concat(r) },
    });
  };
function KH(e) {
  var { preloadedState: t, children: r, reduxStoreName: n } = e,
    i = wt(),
    a = d.useRef(null);
  if (i) return r;
  a.current == null && (a.current = zH(t, n));
  var o = Jd;
  return d.createElement(yT, { context: o, store: a.current }, r);
}
function WH(e) {
  var { layout: t, margin: r } = e,
    n = Ke(),
    i = wt();
  return (
    d.useEffect(() => {
      i || (n(nI(t)), n(rI(r)));
    }, [n, i, t, r]),
    null
  );
}
var HH = d.memo(WH, Xa);
function qH(e) {
  var t = Ke();
  return (
    d.useEffect(() => {
      t(TH(e));
    }, [t, e]),
    null
  );
}
var VH = (e) => {
    var t = Ke();
    return (
      d.useEffect(() => {
        t(FH(e));
      }, [t, e]),
      null
    );
  },
  GH = d.memo(VH, Xa);
function Lb(e) {
  var { zIndex: t, isPanorama: r } = e,
    n = d.useRef(null),
    i = Ke();
  return (
    d.useLayoutEffect(
      () => (
        n.current && i(AF({ zIndex: t, element: n.current, isPanorama: r })),
        () => {
          i(PF({ zIndex: t, isPanorama: r }));
        }
      ),
      [i, t, r],
    ),
    d.createElement('g', { tabIndex: -1, ref: n, className: 'recharts-zIndex-layer_'.concat(t) })
  );
}
function $b(e) {
  var { children: t, isPanorama: r } = e,
    n = re(hF);
  if (!n || n.length === 0) return t;
  var i = n.filter((o) => o < 0),
    a = n.filter((o) => o > 0);
  return d.createElement(
    d.Fragment,
    null,
    i.map((o) => d.createElement(Lb, { key: o, zIndex: o, isPanorama: r })),
    t,
    a.map((o) => d.createElement(Lb, { key: o, zIndex: o, isPanorama: r })),
  );
}
var YH = ['children'];
function XH(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = ZH(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function ZH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
function ll() {
  return (
    (ll = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    ll.apply(null, arguments)
  );
}
var JH = { width: '100%', height: '100%', display: 'block' },
  QH = d.forwardRef((e, t) => {
    var r = l0(),
      n = c0(),
      i = b0();
    if (!Ai(r) || !Ai(n)) return null;
    var { children: a, otherAttributes: o, title: s, desc: l } = e,
      c,
      u;
    return (
      o != null &&
        (typeof o.tabIndex == 'number' ? (c = o.tabIndex) : (c = i ? 0 : void 0),
        typeof o.role == 'string' ? (u = o.role) : (u = i ? 'application' : void 0)),
      d.createElement(
        Ww,
        ll({}, o, { title: s, desc: l, role: u, tabIndex: c, width: r, height: n, style: JH, ref: t }),
        a,
      )
    );
  }),
  eq = (e) => {
    var { children: t } = e,
      r = re(Tl);
    if (!r) return null;
    var { width: n, height: i, y: a, x: o } = r;
    return d.createElement(Ww, { width: n, height: i, x: o, y: a }, t);
  },
  Fb = d.forwardRef((e, t) => {
    var { children: r } = e,
      n = XH(e, YH),
      i = wt();
    return i
      ? d.createElement(eq, null, d.createElement($b, { isPanorama: !0 }, r))
      : d.createElement(QH, ll({ ref: t }, n), d.createElement($b, { isPanorama: !1 }, r));
  });
function tq() {
  var e = Ke(),
    [t, r] = d.useState(null),
    n = re(SI);
  return (
    d.useEffect(() => {
      if (t != null) {
        var i = t.getBoundingClientRect(),
          a = i.width / t.offsetWidth;
        he(a) && a !== n && e(aI(a));
      }
    }, [t, e, n]),
    r
  );
}
function Bb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function rq(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Bb(Object(r), !0).forEach(function (n) {
          nq(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Bb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function nq(e, t, r) {
  return (
    (t = iq(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function iq(e) {
  var t = aq(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function aq(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
function vn() {
  return (
    (vn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    vn.apply(null, arguments)
  );
}
var oq = () => (ZF(), null);
function cl(e) {
  if (typeof e == 'number') return e;
  if (typeof e == 'string') {
    var t = parseFloat(e);
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}
var sq = d.forwardRef((e, t) => {
    var r,
      n,
      i = d.useRef(null),
      [a, o] = d.useState({
        containerWidth: cl((r = e.style) === null || r === void 0 ? void 0 : r.width),
        containerHeight: cl((n = e.style) === null || n === void 0 ? void 0 : n.height),
      }),
      s = d.useCallback((c, u) => {
        o((f) => {
          var h = Math.round(c),
            m = Math.round(u);
          return f.containerWidth === h && f.containerHeight === m ? f : { containerWidth: h, containerHeight: m };
        });
      }, []),
      l = d.useCallback(
        (c) => {
          if ((typeof t == 'function' && t(c), c != null && typeof ResizeObserver < 'u')) {
            var { width: u, height: f } = c.getBoundingClientRect();
            s(u, f);
            var h = (p) => {
                var v = p[0];
                if (v != null) {
                  var { width: g, height: b } = v.contentRect;
                  s(g, b);
                }
              },
              m = new ResizeObserver(h);
            (m.observe(c), (i.current = m));
          }
        },
        [t, s],
      );
    return (
      d.useEffect(
        () => () => {
          var c = i.current;
          c?.disconnect();
        },
        [s],
      ),
      d.createElement(
        d.Fragment,
        null,
        d.createElement(Ga, { width: a.containerWidth, height: a.containerHeight }),
        d.createElement('div', vn({ ref: l }, e)),
      )
    );
  }),
  lq = d.forwardRef((e, t) => {
    var { width: r, height: n } = e,
      [i, a] = d.useState({ containerWidth: cl(r), containerHeight: cl(n) }),
      o = d.useCallback((l, c) => {
        a((u) => {
          var f = Math.round(l),
            h = Math.round(c);
          return u.containerWidth === f && u.containerHeight === h ? u : { containerWidth: f, containerHeight: h };
        });
      }, []),
      s = d.useCallback(
        (l) => {
          if ((typeof t == 'function' && t(l), l != null)) {
            var { width: c, height: u } = l.getBoundingClientRect();
            o(c, u);
          }
        },
        [t, o],
      );
    return d.createElement(
      d.Fragment,
      null,
      d.createElement(Ga, { width: i.containerWidth, height: i.containerHeight }),
      d.createElement('div', vn({ ref: s }, e)),
    );
  }),
  cq = d.forwardRef((e, t) => {
    var { width: r, height: n } = e;
    return d.createElement(
      d.Fragment,
      null,
      d.createElement(Ga, { width: r, height: n }),
      d.createElement('div', vn({ ref: t }, e)),
    );
  }),
  uq = d.forwardRef((e, t) => {
    var { width: r, height: n } = e;
    return typeof r == 'string' || typeof n == 'string'
      ? d.createElement(lq, vn({}, e, { ref: t }))
      : typeof r == 'number' && typeof n == 'number'
        ? d.createElement(cq, vn({}, e, { width: r, height: n, ref: t }))
        : d.createElement(
            d.Fragment,
            null,
            d.createElement(Ga, { width: r, height: n }),
            d.createElement('div', vn({ ref: t }, e)),
          );
  });
function fq(e) {
  return e ? sq : uq;
}
var dq = d.forwardRef((e, t) => {
    var {
        children: r,
        className: n,
        height: i,
        onClick: a,
        onContextMenu: o,
        onDoubleClick: s,
        onMouseDown: l,
        onMouseEnter: c,
        onMouseLeave: u,
        onMouseMove: f,
        onMouseUp: h,
        onTouchEnd: m,
        onTouchMove: p,
        onTouchStart: v,
        style: g,
        width: b,
        responsive: S,
        dispatchTouchEvents: x = !0,
      } = e,
      A = d.useRef(null),
      C = Ke(),
      [P, _] = d.useState(null),
      [E, j] = d.useState(null),
      N = tq(),
      M = o0(),
      O = M?.width > 0 ? M.width : b,
      D = M?.height > 0 ? M.height : i,
      B = d.useCallback(
        (U) => {
          (N(U), typeof t == 'function' && t(U), _(U), j(U), U != null && (A.current = U));
        },
        [N, t, _, j],
      ),
      Y = d.useCallback(
        (U) => {
          (C(HP(U)), C(Gt({ handler: a, reactEvent: U })));
        },
        [C, a],
      ),
      Q = d.useCallback(
        (U) => {
          (C(Pd(U)), C(Gt({ handler: c, reactEvent: U })));
        },
        [C, c],
      ),
      se = d.useCallback(
        (U) => {
          (C(xA()), C(Gt({ handler: u, reactEvent: U })));
        },
        [C, u],
      ),
      V = d.useCallback(
        (U) => {
          (C(Pd(U)), C(Gt({ handler: f, reactEvent: U })));
        },
        [C, f],
      ),
      T = d.useCallback(() => {
        C(ZP());
      }, [C]),
      F = d.useCallback(() => {
        C(JP());
      }, [C]),
      W = d.useCallback(
        (U) => {
          C(XP(U.key));
        },
        [C],
      ),
      z = d.useCallback(
        (U) => {
          C(Gt({ handler: o, reactEvent: U }));
        },
        [C, o],
      ),
      H = d.useCallback(
        (U) => {
          C(Gt({ handler: s, reactEvent: U }));
        },
        [C, s],
      ),
      G = d.useCallback(
        (U) => {
          C(Gt({ handler: l, reactEvent: U }));
        },
        [C, l],
      ),
      le = d.useCallback(
        (U) => {
          C(Gt({ handler: h, reactEvent: U }));
        },
        [C, h],
      ),
      fe = d.useCallback(
        (U) => {
          C(Gt({ handler: v, reactEvent: U }));
        },
        [C, v],
      ),
      te = d.useCallback(
        (U) => {
          (x && C(tC(U)), C(Gt({ handler: p, reactEvent: U })));
        },
        [C, x, p],
      ),
      ne = d.useCallback(
        (U) => {
          C(Gt({ handler: m, reactEvent: U }));
        },
        [C, m],
      ),
      $ = fq(S);
    return d.createElement(
      KA.Provider,
      { value: P },
      d.createElement(
        fk.Provider,
        { value: E },
        d.createElement(
          $,
          {
            width: O ?? g?.width,
            height: D ?? g?.height,
            className: Ne('recharts-wrapper', n),
            style: rq({ position: 'relative', cursor: 'default', width: O, height: D }, g),
            onClick: Y,
            onContextMenu: z,
            onDoubleClick: H,
            onFocus: T,
            onBlur: F,
            onKeyDown: W,
            onMouseDown: G,
            onMouseEnter: Q,
            onMouseLeave: se,
            onMouseMove: V,
            onMouseUp: le,
            onTouchEnd: ne,
            onTouchMove: te,
            onTouchStart: fe,
            ref: B,
          },
          d.createElement(oq, null),
          r,
        ),
      ),
    );
  }),
  hq = ['width', 'height', 'responsive', 'children', 'className', 'style', 'compact', 'title', 'desc'];
function mq(e, t) {
  if (e == null) return {};
  var r,
    n,
    i = pq(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++)
      ((r = a[n]), t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
  }
  return i;
}
function pq(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if ({}.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) !== -1) continue;
      r[n] = e[n];
    }
  return r;
}
var vq = d.forwardRef((e, t) => {
  var { width: r, height: n, responsive: i, children: a, className: o, style: s, compact: l, title: c, desc: u } = e,
    f = mq(e, hq),
    h = Qt(f);
  return l
    ? d.createElement(
        d.Fragment,
        null,
        d.createElement(Ga, { width: r, height: n }),
        d.createElement(Fb, { otherAttributes: h, title: c, desc: u }, a),
      )
    : d.createElement(
        dq,
        {
          className: o,
          style: s,
          width: r,
          height: n,
          responsive: i ?? !1,
          onClick: e.onClick,
          onMouseLeave: e.onMouseLeave,
          onMouseEnter: e.onMouseEnter,
          onMouseMove: e.onMouseMove,
          onMouseDown: e.onMouseDown,
          onMouseUp: e.onMouseUp,
          onContextMenu: e.onContextMenu,
          onDoubleClick: e.onDoubleClick,
          onTouchStart: e.onTouchStart,
          onTouchMove: e.onTouchMove,
          onTouchEnd: e.onTouchEnd,
        },
        d.createElement(Fb, { otherAttributes: h, title: c, desc: u, ref: t }, d.createElement(Dz, null, a)),
      );
});
function Cd() {
  return (
    (Cd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Cd.apply(null, arguments)
  );
}
function Ub(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gq(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ub(Object(r), !0).forEach(function (n) {
          yq(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ub(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function yq(e, t, r) {
  return (
    (t = bq(t)) in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function bq(e) {
  var t = wq(e, 'string');
  return typeof t == 'symbol' ? t : t + '';
}
function wq(e, t) {
  if (typeof e != 'object' || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (t === 'string' ? String : Number)(e);
}
var xq = { top: 5, right: 5, bottom: 5, left: 5 },
  Sq = gq(
    {
      accessibilityLayer: !0,
      barCategoryGap: '10%',
      barGap: 4,
      layout: 'horizontal',
      margin: xq,
      responsive: !1,
      reverseStackOrder: !1,
      stackOffset: 'none',
      syncMethod: 'index',
    },
    nC,
  ),
  aC = d.forwardRef(function (t, r) {
    var n,
      i = Mt(t.categoricalChartProps, Sq),
      {
        chartName: a,
        defaultTooltipEventType: o,
        validateTooltipEventTypes: s,
        tooltipPayloadSearcher: l,
        categoricalChartProps: c,
      } = t,
      u = {
        chartName: a,
        defaultTooltipEventType: o,
        validateTooltipEventTypes: s,
        tooltipPayloadSearcher: l,
        eventEmitter: void 0,
      };
    return d.createElement(
      KH,
      { preloadedState: { options: u }, reduxStoreName: (n = c.id) !== null && n !== void 0 ? n : a },
      d.createElement(Ez, { chartData: c.data }),
      d.createElement(HH, { layout: i.layout, margin: i.margin }),
      d.createElement(GH, { throttleDelay: i.throttleDelay, throttledEvents: i.throttledEvents }),
      d.createElement(qH, {
        baseValue: i.baseValue,
        accessibilityLayer: i.accessibilityLayer,
        barCategoryGap: i.barCategoryGap,
        maxBarSize: i.maxBarSize,
        stackOffset: i.stackOffset,
        barGap: i.barGap,
        barSize: i.barSize,
        syncId: i.syncId,
        syncMethod: i.syncMethod,
        className: i.className,
        reverseStackOrder: i.reverseStackOrder,
      }),
      d.createElement(vq, Cd({}, i, { ref: r })),
    );
  }),
  Aq = ['axis', 'item'],
  Pq = d.forwardRef((e, t) =>
    d.createElement(aC, {
      chartName: 'BarChart',
      defaultTooltipEventType: 'axis',
      validateTooltipEventTypes: Aq,
      tooltipPayloadSearcher: WA,
      categoricalChartProps: e,
      ref: t,
    }),
  ),
  Cq = ['axis'],
  Oq = d.forwardRef((e, t) =>
    d.createElement(aC, {
      chartName: 'AreaChart',
      defaultTooltipEventType: 'axis',
      validateTooltipEventTypes: Cq,
      tooltipPayloadSearcher: WA,
      categoricalChartProps: e,
      ref: t,
    }),
  );
function _q(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r) || r <= 0) return null;
  const n = Math.floor(r);
  return (
    t.clearSelected?.(),
    t.setActiveId(n),
    t.onOpenConversation ? t.onOpenConversation(n) : t.isNarrow && nw(n),
    n
  );
}
const zb = 'var(--accent)';
function hn(e) {
  return Number(e || 0).toLocaleString();
}
function Kb(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r) || r === -1) return yE;
  const n =
    t === 'short' ? { month: 'numeric', day: 'numeric' } : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Intl.DateTimeFormat(void 0, n).format(new Date(r));
}
function Eq(e, t) {
  const r = Math.max(1, Math.floor(t || 0));
  if (r <= 1) return zb;
  const n = Math.min(Math.max(0, Math.floor(e || 0)), r - 1),
    i = r === 1 ? 0 : n / (r - 1),
    a = Math.round(92 - i * 44),
    o = Math.min(94, Math.max(42, a));
  return `color-mix(in srgb, ${zb} ${o}%, var(--bg-card))`;
}
function Wb(e) {
  const { items: t, emptyText: r } = e,
    n = Math.max(212, t.length * 48),
    i = d.useRef(null),
    [a, o] = d.useState(0);
  return (
    d.useLayoutEffect(() => {
      if (!t.length) return;
      const s = i.current;
      if (!s) return;
      const l = () => {
        const c = Math.max(0, Math.floor(s.getBoundingClientRect().width));
        o((u) => (u === c ? u : c));
      };
      if ((l(), typeof ResizeObserver == 'function')) {
        const c = new ResizeObserver(() => l());
        return (c.observe(s), () => c.disconnect());
      }
      return (window.addEventListener('resize', l), () => window.removeEventListener('resize', l));
    }, [n, t.length]),
    t.length
      ? y.jsx('div', {
          ref: i,
          style: { height: n },
          className: 'tw-w-full tw-min-w-0',
          children:
            a > 0
              ? y.jsxs(Pq, {
                  width: a,
                  height: n,
                  data: t,
                  layout: 'vertical',
                  margin: { top: 4, right: 16, bottom: 4, left: 0 },
                  children: [
                    y.jsx(gm, { type: 'number', hide: !0, allowDecimals: !1 }),
                    y.jsx(ym, {
                      type: 'category',
                      dataKey: 'label',
                      width: 136,
                      axisLine: !1,
                      tickLine: !1,
                      tick: { fill: 'var(--text-primary)', fontSize: 12, fontWeight: 700 },
                    }),
                    y.jsx(VA, {
                      cursor: { fill: 'color-mix(in srgb, var(--accent) 18%, transparent)' },
                      formatter: (s) => [hn(Number(s || 0)), w('insightTooltipClips')],
                      itemStyle: { color: 'var(--text-primary)', fontSize: 12, fontWeight: 800 },
                      labelStyle: { color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 },
                      contentStyle: {
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        boxShadow: 'none',
                      },
                    }),
                    y.jsx(KP, {
                      dataKey: 'count',
                      radius: [0, 10, 10, 0],
                      barSize: 22,
                      children: t.map((s, l) => y.jsx(cm, { fill: Eq(l, t.length) }, s.label)),
                    }),
                  ],
                })
              : null,
        })
      : y.jsx('div', { className: 'tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]', children: r })
  );
}
function Hb(e) {
  const { items: t, stroke: r, ariaLabel: n } = e,
    i = 204,
    a = d.useRef(null),
    [o, s] = d.useState(0),
    l = t.length <= 32 ? 'short' : 'long',
    c = t.length <= 90,
    u = t.length <= 16;
  return (
    d.useLayoutEffect(() => {
      if (!t.length) return;
      const f = a.current;
      if (!f) return;
      const h = () => {
        const m = Math.max(0, Math.floor(f.getBoundingClientRect().width));
        s((p) => (p === m ? p : m));
      };
      if ((h(), typeof ResizeObserver == 'function')) {
        const m = new ResizeObserver(() => h());
        return (m.observe(f), () => m.disconnect());
      }
      return (window.addEventListener('resize', h), () => window.removeEventListener('resize', h));
    }, [t.length]),
    t.length
      ? y.jsx('div', {
          ref: a,
          'aria-label': n,
          style: { height: i },
          className: 'tw-w-full tw-min-w-0',
          children:
            o > 0
              ? y.jsxs(Oq, {
                  width: o,
                  height: i,
                  data: t,
                  margin: { top: 26, right: 16, bottom: 36, left: 0 },
                  children: [
                    y.jsx(EP, { stroke: 'var(--border)', strokeDasharray: '3 3', vertical: !1 }),
                    y.jsx(gm, {
                      dataKey: 'dayStart',
                      axisLine: !1,
                      tickLine: !1,
                      minTickGap: 18,
                      interval: 'preserveStartEnd',
                      angle: -42,
                      textAnchor: 'end',
                      height: 44,
                      tick: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 },
                      tickFormatter: (f) => Kb(Number(f), l),
                    }),
                    y.jsx(ym, {
                      dataKey: 'count',
                      axisLine: !1,
                      tickLine: !1,
                      width: 34,
                      allowDecimals: !1,
                      tick: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 },
                    }),
                    y.jsx(VA, {
                      cursor: { stroke: 'color-mix(in srgb, var(--accent) 26%, transparent)', strokeWidth: 1 },
                      formatter: (f) => [hn(Number(f || 0)), w('insightTooltipClips')],
                      labelFormatter: (f) => Kb(Number(f), 'long'),
                      itemStyle: { color: 'var(--text-primary)', fontSize: 12, fontWeight: 800 },
                      labelStyle: { color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 },
                      contentStyle: {
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        boxShadow: 'none',
                      },
                    }),
                    y.jsx($P, {
                      type: 'monotone',
                      dataKey: 'count',
                      stroke: r,
                      strokeWidth: 2,
                      fill: `color-mix(in srgb, ${r} 22%, transparent)`,
                      fillOpacity: 1,
                      dot: c ? { r: 2.5, strokeWidth: 2, fill: 'var(--bg-card)' } : !1,
                      activeDot: { r: 4, strokeWidth: 2, fill: 'var(--bg-card)' },
                      isAnimationActive: !1,
                      children: u
                        ? y.jsx(Sa, {
                            dataKey: 'count',
                            position: 'top',
                            content: (f) => {
                              const h = Number(f?.value || 0);
                              if (!Number.isFinite(h) || h <= 0) return null;
                              const m = Number(f?.x || 0),
                                p = Number(f?.y || 0),
                                v = p < 22 ? p + 16 : p - 6;
                              return y.jsx('text', {
                                x: m,
                                y: v,
                                textAnchor: 'middle',
                                fill: 'var(--text-secondary)',
                                fontSize: 12,
                                fontWeight: 800,
                                children: hn(h),
                              });
                            },
                          })
                        : null,
                    }),
                  ],
                })
              : null,
        })
      : y.jsx('div', {
          className: 'tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
          children: w('insightDistributionEmpty'),
        })
  );
}
function kq(e) {
  const { items: t, getLinkTo: r, onOpenConversation: n } = e;
  if (!t.length)
    return y.jsx('div', {
      className: 'tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
      children: w('insightTopConversationsEmpty'),
    });
  const i = (a) =>
    a === 0
      ? 'tw-text-[#FFA500]'
      : a === 1
        ? 'tw-text-[var(--info)]'
        : a === 2
          ? 'tw-text-[var(--secondary)]'
          : 'tw-text-[var(--text-primary)]';
  return y.jsx('div', {
    className: 'tw-grid tw-gap-2.5',
    children: t.map((a, o) =>
      y.jsxs(
        'div',
        {
          className: 'tw-grid tw-grid-cols-[auto_minmax(0,1fr)_auto] tw-items-start tw-gap-3',
          children: [
            y.jsxs('div', { className: ['tw-text-sm tw-font-black', i(o)].join(' '), children: [o + 1, '.'] }),
            y.jsxs('div', {
              className: 'tw-min-w-0',
              children: [
                y.jsxs(Ld, {
                  to: r(a),
                  replace: !0,
                  className: [
                    'tw-group tw-flex tw-min-w-0 tw-items-center tw-gap-1 tw-text-left',
                    'tw-truncate tw-text-sm tw-font-bold tw-text-[var(--text-primary)]',
                    'hover:tw-opacity-85',
                    'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
                  ].join(' '),
                  title: a.title,
                  'aria-label': a.title,
                  onClick: (s) => {
                    s.defaultPrevented || s.metaKey || s.altKey || s.ctrlKey || s.shiftKey || n(a);
                  },
                  children: [
                    y.jsx('span', {
                      className: 'tw-min-w-0 tw-truncate tw-underline-offset-2 group-hover:tw-underline',
                      children: a.title,
                    }),
                    y.jsx(d_, {
                      size: 14,
                      strokeWidth: 2,
                      'aria-hidden': 'true',
                      className: 'tw-shrink-0 tw-text-[var(--text-secondary)] tw-opacity-70 group-hover:tw-opacity-100',
                    }),
                  ],
                }),
                y.jsx('div', {
                  className: 'tw-mt-0.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: a.source,
                }),
              ],
            }),
            y.jsxs('div', {
              className: 'tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
              children: [hn(a.messageCount), ' ', w('insightTurnsUnit')],
            }),
          ],
        },
        a.conversationId,
      ),
    ),
  });
}
function jq(e) {
  const { stats: t, range: r, onChangeRange: n } = e,
    { openConversationInListScopeByLoc: i, openConversationInListScopeById: a } = iw(),
    o = aw(),
    s = Ft(),
    l = d.useMemo(() => {
      const f = s?.state ?? {};
      return String(f?.from || '').trim() || '/';
    }, [s]),
    c = (f) => {
      const h = String(f?.loc || '').trim();
      return h ? yO(h) : l;
    },
    u = (f) => {
      const h = String(f?.openSource || '').trim(),
        m = String(f?.openConversationKey || '').trim(),
        p = Number(f?.conversationId),
        v = _q(p, {
          isNarrow: o,
          setActiveId: (g) => {
            if (h && m) {
              i({ source: h, conversationKey: m });
              return;
            }
            a(Number(g));
          },
        });
      o && v && h && m && nw(v, { source: h, conversationKey: m });
    };
  return y.jsxs('div', {
    className: 'tw-grid tw-gap-4',
    children: [
      y.jsxs('header', {
        className: 'tw-flex tw-items-center tw-justify-between tw-gap-3',
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aboutYouInsightSectionTitle'),
          }),
          y.jsx(us, {
            value: r,
            onChange: n,
            ariaLabel: w('insightRangeAria'),
            buttonClassName: Ue,
            options: [
              { value: 'all', label: w('insightRangeAll') },
              { value: 'today', label: w('insightRangeToday') },
              { value: '7d', label: w('insightRange7d') },
              { value: '30d', label: w('insightRange30d') },
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: 'tw-grid tw-gap-3 md:tw-grid-cols-3',
        'aria-label': w('insightOverviewAria'),
        children: [
          y.jsxs('div', {
            className: [
              ye,
              'tw-flex tw-min-h-[124px] tw-flex-col tw-justify-between',
              'tw-border-[color-mix(in_srgb,var(--accent)_34%,var(--border))]',
              'tw-bg-[color-mix(in_srgb,var(--accent)_12%,var(--bg-card))]',
            ].join(' '),
            children: [
              y.jsxs('div', {
                className: 'tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-text-[var(--text-secondary)]',
                children: [
                  y.jsx('span', {
                    className: 'tw-inline-flex tw-size-2 tw-shrink-0 tw-rounded-full tw-bg-[var(--accent)]',
                    'aria-hidden': 'true',
                  }),
                  w('insightOverviewTotalClips'),
                ],
              }),
              y.jsx('div', {
                className: 'tw-mt-2 tw-text-3xl tw-font-black tw-text-[var(--accent)]',
                children: hn(t.totalClips),
              }),
            ],
          }),
          y.jsxs('div', {
            className: [
              ye,
              'tw-flex tw-min-h-[124px] tw-flex-col tw-justify-between',
              'tw-border-[color-mix(in_srgb,var(--info)_34%,var(--border))]',
              'tw-bg-[color-mix(in_srgb,var(--info)_10%,var(--bg-card))]',
            ].join(' '),
            children: [
              y.jsxs('div', {
                className: 'tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-text-[var(--text-secondary)]',
                children: [
                  y.jsx('span', {
                    className: 'tw-inline-flex tw-size-2 tw-shrink-0 tw-rounded-full tw-bg-[var(--info)]',
                    'aria-hidden': 'true',
                  }),
                  w('insightOverviewChatCount'),
                ],
              }),
              y.jsx('div', {
                className: 'tw-mt-2 tw-text-3xl tw-font-black tw-text-[var(--info)]',
                children: hn(t.chatCount),
              }),
            ],
          }),
          y.jsxs('div', {
            className: [
              ye,
              'tw-flex tw-min-h-[124px] tw-flex-col tw-justify-between',
              'tw-border-[color-mix(in_srgb,var(--secondary)_34%,var(--border))]',
              'tw-bg-[color-mix(in_srgb,var(--secondary)_10%,var(--bg-card))]',
            ].join(' '),
            children: [
              y.jsxs('div', {
                className: 'tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-text-[var(--text-secondary)]',
                children: [
                  y.jsx('span', {
                    className: 'tw-inline-flex tw-size-2 tw-shrink-0 tw-rounded-full tw-bg-[var(--secondary)]',
                    'aria-hidden': 'true',
                  }),
                  w('insightOverviewArticleCount'),
                ],
              }),
              y.jsx('div', {
                className: 'tw-mt-2 tw-text-3xl tw-font-black tw-text-[var(--secondary)]',
                children: hn(t.articleCount),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('div', {
        className: 'tw-grid tw-gap-4 lg:tw-grid-cols-2',
        children: [
          y.jsxs('section', {
            className: `${ye} tw-h-full tw-min-w-0`,
            'aria-label': w('insightChatSectionAria'),
            children: [
              y.jsx('h2', {
                className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
                children: w('insightChatSectionTitle'),
              }),
              y.jsx('div', {
                className: 'tw-mt-3',
                children: y.jsx(Hb, {
                  items: t.chatDailyTrend,
                  stroke: 'var(--info)',
                  ariaLabel: w('insightOverviewChatCount'),
                }),
              }),
              y.jsxs('div', {
                className: 'tw-mt-4',
                children: [
                  y.jsx('div', {
                    className: 'tw-mb-2 tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
                    children: w('insightSourceDistributionTitle'),
                  }),
                  y.jsx(Wb, { items: t.chatSourceDistribution, emptyText: w('insightDistributionEmpty') }),
                ],
              }),
              y.jsxs('div', {
                className: 'tw-mt-5',
                children: [
                  y.jsxs('div', {
                    className: 'tw-mb-2 tw-flex tw-items-start tw-justify-between tw-gap-4',
                    children: [
                      y.jsx('div', {
                        className: 'tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
                        children: w('insightTopConversationsTitle'),
                      }),
                      y.jsxs('div', {
                        className: 'tw-text-right',
                        children: [
                          y.jsx('div', {
                            className: 'tw-text-xs tw-font-bold tw-text-[var(--text-secondary)]',
                            children: w('insightTotalMessagesLabel'),
                          }),
                          y.jsx('div', {
                            className: 'tw-mt-1 tw-text-2xl tw-font-black tw-text-[#FFA500]',
                            children: hn(t.totalMessages),
                          }),
                        ],
                      }),
                    ],
                  }),
                  y.jsx(kq, { items: t.topConversations, getLinkTo: c, onOpenConversation: u }),
                ],
              }),
            ],
          }),
          y.jsxs('section', {
            className: `${ye} tw-h-full tw-min-w-0`,
            'aria-label': w('insightArticlesSectionAria'),
            children: [
              y.jsx('h2', {
                className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
                children: w('insightArticlesSectionTitle'),
              }),
              y.jsx('div', {
                className: 'tw-mt-3',
                children: y.jsx(Hb, {
                  items: t.articleDailyTrend,
                  stroke: 'var(--secondary)',
                  ariaLabel: w('insightOverviewArticleCount'),
                }),
              }),
              y.jsxs('div', {
                className: 'tw-mt-4',
                children: [
                  y.jsx('div', {
                    className: 'tw-mb-2 tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
                    children: w('insightArticleDomainsTitle'),
                  }),
                  y.jsx(Wb, { items: t.articleDomainDistribution, emptyText: w('insightDistributionEmpty') }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function wf(e) {
  const { title: t, detail: r, tone: n = 'default' } = e;
  return y.jsxs('section', {
    className: [
      `${ye} tw-flex tw-min-h-[220px] tw-flex-col tw-justify-center`,
      n === 'error' ? 'tw-border-[var(--error)]' : '',
    ].join(' '),
    'aria-label': w('aboutYouInsightSectionTitle'),
    children: [
      y.jsx('h2', {
        className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
        children: w('aboutYouInsightSectionTitle'),
      }),
      y.jsx('div', {
        className: [
          'tw-mt-3 tw-text-lg tw-font-black',
          n === 'error' ? 'tw-text-[var(--error)]' : 'tw-text-[var(--text-primary)]',
        ].join(' '),
        children: t,
      }),
      r
        ? y.jsx('div', {
            className: 'tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: r,
          })
        : null,
    ],
  });
}
function Qo(e) {
  const { value: t, onChange: r, onSave: n } = e;
  return y.jsxs('section', {
    className: ye,
    'aria-label': w('aboutYouUserNameSectionAria'),
    children: [
      y.jsx('h2', {
        className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
        children: w('aboutYouUserNameSectionTitle'),
      }),
      y.jsx('input', {
        className: [
          'tw-mt-3 tw-w-full tw-rounded-lg tw-border tw-border-[var(--border)] tw-bg-[var(--bg-primary)]',
          'tw-px-3 tw-py-2 tw-text-sm tw-font-semibold tw-text-[var(--text-primary)]',
          'focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-[var(--focus)] focus-visible:tw-ring-offset-2',
          'focus-visible:tw-ring-offset-[var(--bg-card)]',
        ].join(' '),
        value: t,
        onChange: (i) => r(String(i.target?.value || '')),
        onBlur: n,
        onKeyDown: (i) => {
          i.key === 'Enter' && (i.preventDefault(), n());
        },
        placeholder: w('aboutYouUserNamePlaceholder'),
        autoComplete: 'off',
        spellCheck: !1,
      }),
      y.jsx('div', {
        className: 'tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: w('aboutYouUserNameHint'),
      }),
    ],
  });
}
function Nq(e) {
  const {
    loading: t,
    error: r,
    stats: n,
    hasLoaded: i,
    range: a,
    onChangeRange: o,
    userName: s,
    onChangeUserName: l,
    onSaveUserName: c,
  } = e;
  return t || !i
    ? y.jsxs('div', {
        className: 'tw-grid tw-gap-4',
        children: [y.jsx(Qo, { value: s, onChange: l, onSave: c }), y.jsx(wf, { title: w('insightLoadingTitle') })],
      })
    : r
      ? y.jsxs('div', {
          className: 'tw-grid tw-gap-4',
          children: [
            y.jsx(Qo, { value: s, onChange: l, onSave: c }),
            y.jsx(wf, { title: w('insightErrorTitle'), detail: r, tone: 'error' }),
          ],
        })
      : !n || !kE(n)
        ? y.jsxs('div', {
            className: 'tw-grid tw-gap-4',
            children: [y.jsx(Qo, { value: s, onChange: l, onSave: c }), y.jsx(wf, { title: w('insightEmptyTitle') })],
          })
        : y.jsxs('div', {
            className: 'tw-grid tw-gap-4',
            children: [
              y.jsx(Qo, { value: s, onChange: l, onSave: c }),
              y.jsx(jq, { stats: n, range: a, onChangeRange: o }),
            ],
          });
}
const Od = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    hosts: ['chatgpt.com', 'www.chatgpt.com', 'chat.openai.com'],
    features: { dollarMention: !0 },
  },
  { id: 'claude', name: 'Claude', hosts: ['claude.ai'], features: { dollarMention: !0 } },
  { id: 'gemini', name: 'Gemini', hosts: ['gemini.google.com'], features: { dollarMention: !0 } },
  {
    id: 'googleaistudio',
    name: 'Google AI Studio',
    hosts: ['aistudio.google.com', 'makersuite.google.com'],
    features: { dollarMention: !0 },
  },
  { id: 'deepseek', name: 'DeepSeek', hosts: ['chat.deepseek.com'], features: { dollarMention: !0 } },
  { id: 'kimi', name: 'Kimi', hosts: ['kimi.moonshot.cn', 'kimi.com'], features: { dollarMention: !0 } },
  { id: 'doubao', name: 'Doubao', hosts: ['doubao.com'], features: { dollarMention: !0 } },
  { id: 'yuanbao', name: 'Yuanbao', hosts: ['yuanbao.tencent.com'], features: { dollarMention: !0 } },
  { id: 'poe', name: 'Poe', hosts: ['poe.com'], features: { dollarMention: !0 } },
  { id: 'notionai', name: 'Notion AI', hosts: ['notion.so'], features: { dollarMention: !0 } },
  { id: 'zai', name: 'z.ai', hosts: ['chat.z.ai'], features: { dollarMention: !0 } },
];
new Set(Od.map((e) => e.id).filter((e) => e !== 'googleaistudio'));
function Iq(e) {
  const {
      id: t,
      busy: r,
      rules: n,
      errors: i,
      onChangeRule: a,
      onAddRule: o,
      onRemoveRule: s,
      onApplyRules: l,
      onResetRules: c,
    } = e,
    u = d.useMemo(() => (Array.isArray(n) ? n : []), [n]),
    f = d.useMemo(() => (Array.isArray(i) ? i : []), [i]),
    h = d.useRef(null);
  return y.jsxs('section', {
    id: t,
    ref: h,
    className: 'tw-mt-3 tw-grid tw-gap-3 tw-pl-4 tw-border-l-2 tw-border-[var(--border)]',
    'aria-label': w('antiHotlinkRulesLabel'),
    onBlurCapture: (m) => {
      const p = h.current;
      if (!p) return;
      const v = m?.relatedTarget;
      (v && p.contains(v)) || l();
    },
    children: [
      y.jsx('div', {
        className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
        children: w('antiHotlinkRulesHint'),
      }),
      u.length
        ? y.jsx('div', {
            className: 'tw-grid tw-gap-3',
            children: u.map((m, p) => {
              const v = String(f[p]?.domain || ''),
                g = String(f[p]?.referer || ''),
                b = !!v || !!g;
              return y.jsxs(
                'div',
                {
                  className: `tw-grid tw-gap-2 tw-border-b tw-pb-3 last:tw-border-b-0 last:tw-pb-0 ${b ? 'tw-border-red-400/70' : 'tw-border-[var(--border)]'}`,
                  children: [
                    y.jsxs('div', {
                      className: 'tw-flex tw-flex-wrap tw-items-center tw-gap-3',
                      children: [
                        y.jsxs('label', {
                          className:
                            'tw-flex tw-min-w-[260px] tw-flex-[1.1] tw-items-center tw-gap-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                          children: [
                            y.jsx('span', { className: 'tw-shrink-0 tw-w-12', children: w('antiHotlinkDomainLabel') }),
                            y.jsx('input', {
                              value: String(m?.domain || ''),
                              disabled: r,
                              onChange: (S) => a(p, { domain: S.target.value }),
                              placeholder: w('antiHotlinkDomainPlaceholder'),
                              'aria-label': `${w('antiHotlinkDomainLabel')} ${p + 1}`,
                              className: `${Ge} tw-min-w-0 tw-flex-1`,
                              spellCheck: !1,
                              autoCapitalize: 'none',
                              autoCorrect: 'off',
                            }),
                          ],
                        }),
                        y.jsxs('label', {
                          className:
                            'tw-flex tw-min-w-[340px] tw-flex-[1.6] tw-items-center tw-gap-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                          children: [
                            y.jsx('span', { className: 'tw-shrink-0 tw-w-16', children: w('antiHotlinkRefererLabel') }),
                            y.jsx('input', {
                              value: String(m?.referer || ''),
                              disabled: r,
                              onChange: (S) => a(p, { referer: S.target.value }),
                              placeholder: w('antiHotlinkRefererPlaceholder'),
                              'aria-label': `${w('antiHotlinkRefererLabel')} ${p + 1}`,
                              className: `${Ge} tw-min-w-0 tw-flex-1`,
                              spellCheck: !1,
                              autoCapitalize: 'none',
                              autoCorrect: 'off',
                            }),
                          ],
                        }),
                        y.jsx('button', {
                          type: 'button',
                          className: `${Bw} tw-self-stretch`,
                          disabled: r,
                          onClick: () => s(p),
                          'aria-label': `${w('antiHotlinkDeleteRule')} ${p + 1}`,
                          children: w('antiHotlinkDeleteRule'),
                        }),
                      ],
                    }),
                    y.jsxs('div', {
                      className: 'tw-grid tw-gap-1 tw-pl-14',
                      children: [
                        v
                          ? y.jsx('div', { className: 'tw-text-xs tw-font-semibold tw-text-red-500', children: v })
                          : null,
                        g
                          ? y.jsx('div', { className: 'tw-text-xs tw-font-semibold tw-text-red-500', children: g })
                          : null,
                      ],
                    }),
                  ],
                },
                p,
              );
            }),
          })
        : y.jsx('div', {
            className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('antiHotlinkNoRules'),
          }),
      y.jsxs('div', {
        className: 'tw-flex tw-flex-wrap tw-gap-2',
        children: [
          y.jsx('button', {
            type: 'button',
            className: Ue,
            disabled: r,
            onClick: o,
            children: w('antiHotlinkAddRule'),
          }),
          y.jsx('button', { type: 'button', className: Ue, disabled: r, onClick: c, children: w('reset') }),
        ],
      }),
    ],
  });
}
function Tq(e) {
  const {
      busy: t,
      displayMode: r,
      onChangeDisplayMode: n,
      markdownReadingProfile: i,
      onChangeMarkdownReadingProfile: a,
      aiChatAutoSaveEnabled: o,
      onToggleAiChatAutoSaveEnabled: s,
      aiChatCacheImagesEnabled: l,
      onToggleAiChatCacheImagesEnabled: c,
      webArticleCacheImagesEnabled: u,
      onToggleWebArticleCacheImagesEnabled: f,
      antiHotlinkAdvancedOpen: h,
      onToggleAntiHotlinkAdvancedOpen: m,
      antiHotlinkRules: p,
      antiHotlinkRuleErrors: v,
      onChangeAntiHotlinkRule: g,
      onAddAntiHotlinkRule: b,
      onRemoveAntiHotlinkRule: S,
      onApplyAntiHotlinkRules: x,
      onResetAntiHotlinkRules: A,
      aiChatDollarMentionEnabled: C,
      onToggleAiChatDollarMentionEnabled: P,
    } = e,
    _ = {
      medium: 'markdownReadingProfileMediumDesc',
      notion: 'markdownReadingProfileNotionDesc',
      book: 'markdownReadingProfileBookDesc',
    },
    j = Od.filter((N) => N?.features?.dollarMention === !0)
      .map((N) => N.name)
      .join(' / ');
  return y.jsxs('div', {
    className: 'tw-grid tw-gap-4',
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('inpageButtonHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('inpageButtonHeading'),
          }),
          y.jsxs('div', {
            className: 'tw-mt-2.5 tw-grid tw-gap-1.5',
            children: [
              y.jsxs('div', {
                className: 'tw-flex tw-items-center tw-justify-between tw-gap-3',
                children: [
                  y.jsx('label', {
                    className: 'tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
                    children: w('inpageDisplayModeLabel'),
                  }),
                  y.jsx(us, {
                    value: r,
                    onChange: n,
                    disabled: t,
                    ariaLabel: w('inpageDisplayModeLabel'),
                    minWidth: 180,
                    buttonClassName: [cs(), 'tw-min-w-[180px]'].join(' '),
                    options: [
                      { value: 'supported', label: w('inpageDisplayModeSupported') },
                      { value: 'all', label: w('inpageDisplayModeAll') },
                      { value: 'off', label: w('inpageDisplayModeOff') },
                    ],
                  }),
                ],
              }),
              y.jsx('div', {
                className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
                children: w('inpageDisplayModeHint'),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('readingHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('readingHeading'),
          }),
          y.jsxs('div', {
            className: 'tw-mt-2.5 tw-grid tw-gap-1.5',
            children: [
              y.jsxs('div', {
                className: 'tw-flex tw-items-center tw-justify-between tw-gap-3',
                children: [
                  y.jsx('label', {
                    className: 'tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
                    children: w('markdownReadingProfileLabel'),
                  }),
                  y.jsx(us, {
                    value: i,
                    onChange: a,
                    disabled: t,
                    ariaLabel: w('markdownReadingProfileLabel'),
                    minWidth: 180,
                    buttonClassName: [cs(), 'tw-min-w-[180px]'].join(' '),
                    options: [
                      { value: 'medium', label: w('markdownReadingProfileMediumLabel') },
                      { value: 'notion', label: w('markdownReadingProfileNotionLabel') },
                      { value: 'book', label: w('markdownReadingProfileBookLabel') },
                    ],
                  }),
                ],
              }),
              y.jsx('div', {
                className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
                children: w('markdownReadingProfileHint'),
              }),
              y.jsx('div', {
                className: 'tw-text-[11px] tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-80',
                children: w(_[i]),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatDollarMentionHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatDollarMentionHeading'),
          }),
          y.jsxs('label', {
            className:
              'tw-mt-2.5 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
            children: [
              y.jsx('input', {
                type: 'checkbox',
                checked: C,
                disabled: t,
                onChange: (N) => P(!!N.target.checked),
                className: fn,
              }),
              w('aiChatDollarMentionLabel'),
            ],
          }),
          y.jsx('div', {
            className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('aiChatDollarMentionHint'),
          }),
          !!j &&
            y.jsx('div', {
              className: 'tw-mt-2 tw-text-[11px] tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-80',
              children: j,
            }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('aiChatAutoSaveHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('aiChatAutoSaveHeading'),
          }),
          y.jsxs('label', {
            className:
              'tw-mt-2.5 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
            children: [
              y.jsx('input', {
                type: 'checkbox',
                checked: o,
                disabled: t,
                onChange: (N) => s(!!N.target.checked),
                className: fn,
              }),
              w('aiChatAutoSaveLabel'),
            ],
          }),
          y.jsx('div', {
            className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('aiChatAutoSaveHint'),
          }),
          y.jsxs('label', {
            className:
              'tw-mt-3 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
            children: [
              y.jsx('input', {
                type: 'checkbox',
                checked: l,
                disabled: t,
                onChange: (N) => c(!!N.target.checked),
                className: fn,
              }),
              y.jsxs('span', {
                className: 'tw-inline-flex tw-items-center tw-gap-2',
                children: [
                  y.jsx('span', { children: w('aiChatCacheImagesLabel') }),
                  y.jsx('span', {
                    className:
                      'tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-px-1.5 tw-py-0.5 tw-text-[10px] tw-font-black tw-tracking-wide tw-text-[var(--text-secondary)]',
                    children: w('betaTag'),
                  }),
                ],
              }),
            ],
          }),
          y.jsx('div', {
            className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('aiChatCacheImagesHint'),
          }),
          y.jsxs('label', {
            className:
              'tw-mt-3 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)]',
            children: [
              y.jsx('input', {
                type: 'checkbox',
                checked: u,
                disabled: t,
                onChange: (N) => f(!!N.target.checked),
                className: fn,
              }),
              y.jsxs('span', {
                className: 'tw-inline-flex tw-items-center tw-gap-2',
                children: [
                  y.jsx('span', { children: w('webArticleCacheImagesLabel') }),
                  y.jsx('span', {
                    className:
                      'tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-px-1.5 tw-py-0.5 tw-text-[10px] tw-font-black tw-tracking-wide tw-text-[var(--text-secondary)]',
                    children: w('betaTag'),
                  }),
                ],
              }),
            ],
          }),
          y.jsx('div', {
            className: 'tw-mt-1.5 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('webArticleCacheImagesHint'),
          }),
          y.jsx('div', {
            className: 'tw-mt-3',
            children: y.jsx('button', {
              type: 'button',
              className: Ue,
              onClick: m,
              disabled: t,
              'aria-expanded': h,
              'aria-controls': 'anti-hotlink-domains-editor',
              children: h ? w('advancedHide') : w('advancedShow'),
            }),
          }),
          h
            ? y.jsx(Iq, {
                id: 'anti-hotlink-domains-editor',
                busy: t,
                rules: p,
                errors: v,
                onChangeRule: g,
                onAddRule: b,
                onRemoveRule: S,
                onApplyRules: x,
                onResetRules: A,
              })
            : null,
          y.jsx('div', {
            className: 'tw-mt-2.5 tw-grid tw-gap-2',
            children: Od.map((N) => {
              const M = Array.isArray(N.hosts) ? N.hosts.filter(Boolean) : [],
                O = M.length ? M.join(' / ') : N.id;
              return y.jsxs(
                'div',
                {
                  className:
                    'tw-flex tw-min-w-0 tw-items-center tw-justify-between tw-gap-3 tw-rounded-2xl tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-px-3 tw-py-2',
                  children: [
                    y.jsx('div', {
                      className: 'tw-text-sm tw-font-black tw-text-[var(--text-primary)]',
                      children: N.name,
                    }),
                    y.jsx('div', {
                      className: 'tw-truncate tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                      children: O,
                    }),
                  ],
                },
                N.id,
              );
            }),
          }),
        ],
      }),
    ],
  });
}
function Mq(e) {
  const { busy: t, modelIndex: r, onChangeModelIndex: n, onSave: i, onReset: a } = e,
    o = (s) => {
      s.key === 'Enter' && (s.preventDefault(), i());
    };
  return y.jsxs('section', {
    className: ye,
    'aria-label': w('notionAI'),
    children: [
      y.jsx('div', {
        className: 'tw-flex tw-items-center tw-gap-2',
        children: y.jsx('h2', {
          className: 'tw-m-0 tw-min-w-0 tw-flex-1 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
          children: w('notionAI'),
        }),
      }),
      y.jsxs('div', {
        className: 'tw-mt-3 tw-grid tw-gap-2',
        children: [
          y.jsx('div', {
            'aria-label': w('modelIndex'),
            children: y.jsx(xe, {
              label: w('modelIndex'),
              children: y.jsxs('div', {
                className: 'tw-flex tw-min-w-0 tw-items-center tw-gap-2',
                children: [
                  y.jsx('input', {
                    id: 'notionAiModelIndex',
                    value: r,
                    onChange: (s) => n(s.target.value),
                    onBlur: i,
                    onKeyDown: o,
                    disabled: t,
                    type: 'number',
                    inputMode: 'numeric',
                    min: 1,
                    step: 1,
                    placeholder: '3',
                    'aria-label': w('modelIndex'),
                    className: `${Ge} tw-w-[120px]`,
                  }),
                  y.jsx('button', {
                    id: 'btnNotionAiModelReset',
                    className: Ue,
                    onClick: a,
                    disabled: t,
                    type: 'button',
                    title: w('reset'),
                    children: w('reset'),
                  }),
                ],
              }),
            }),
          }),
          y.jsx('div', {
            'aria-label': w('note'),
            children: y.jsx(xe, {
              label: w('note'),
              align: 'start',
              children: y.jsx('div', {
                className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                children: w('notionAiModelNote'),
              }),
            }),
          }),
        ],
      }),
    ],
  });
}
function Dq(e) {
  const {
      busy: t,
      syncEnabled: r,
      notionStatusText: n,
      notionConnected: i,
      pollingNotion: a,
      loadingNotionPages: o,
      notionAdvancedOpen: s,
      notionParentPageId: l,
      notionChatDatabaseId: c,
      notionArticleDatabaseId: u,
      notionVideoDatabaseId: f,
      notionChatDatabaseLabel: h,
      notionArticleDatabaseLabel: m,
      notionVideoDatabaseLabel: p,
      notionPageOptions: v,
      notionLogoUrl: g,
      onToggleSyncEnabled: b,
      onToggleAdvancedOpen: S,
      onConnectOrDisconnect: x,
      onSaveNotionParentPage: A,
      onChangeNotionChatDatabaseId: C,
      onChangeNotionArticleDatabaseId: P,
      onChangeNotionVideoDatabaseId: _,
      onSaveNotionDatabaseId: E,
      onResetNotionDatabaseId: j,
      onLoadNotionPages: N,
    } = e,
    M = (O, D) => {
      O.key === 'Enter' && (O.preventDefault(), E(D));
    };
  return y.jsxs('section', {
    className: ye,
    'aria-label': w('notionOAuth'),
    children: [
      y.jsxs('div', {
        className: 'tw-flex tw-items-center tw-gap-2',
        children: [
          y.jsx('img', { className: 'tw-h-5 tw-w-5 tw-shrink-0', src: g, alt: '', 'aria-hidden': 'true' }),
          y.jsxs('div', {
            className: 'tw-min-w-0 tw-flex-1 tw-text-[var(--text-primary)]',
            children: [
              y.jsx('span', { className: 'tw-text-base tw-font-extrabold', children: w('notionOAuth') }),
              y.jsx('span', {
                className: 'tw-mx-2 tw-text-[var(--text-secondary)]',
                'aria-hidden': 'true',
                children: '|',
              }),
              y.jsx('span', { className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]', children: n }),
            ],
          }),
          y.jsx('button', {
            onClick: x,
            disabled: t,
            type: 'button',
            className: Ue,
            children: i ? w('disconnect') : a ? w('connectingDots') : w('connect'),
          }),
        ],
      }),
      y.jsxs('div', {
        className: 'tw-mt-3',
        'aria-label': w('notionSyncEnabledLabel'),
        children: [
          y.jsx(xe, {
            label: w('notionSyncEnabledLabel'),
            children: y.jsx('input', {
              id: 'notionSyncEnabledToggle',
              type: 'checkbox',
              className: fn,
              checked: r,
              disabled: t,
              'aria-label': w('notionSyncEnabledLabel'),
              onChange: (O) => b(O.target.checked),
            }),
          }),
          r
            ? null
            : y.jsx('div', {
                className: 'tw-mt-2',
                children: y.jsx(xe, {
                  label: '',
                  align: 'start',
                  children: y.jsx('div', {
                    className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                    children: w('notionSyncEnabledHint'),
                  }),
                }),
              }),
        ],
      }),
      y.jsx('div', {
        className: 'tw-mt-3',
        'aria-label': w('parentPage'),
        children: y.jsx(xe, {
          label: w('parentPage'),
          children: y.jsxs('div', {
            className: 'tw-flex tw-min-w-0 tw-items-center tw-gap-2',
            children: [
              y.jsx(us, {
                buttonId: 'notionPages',
                className: 'tw-flex-1 tw-min-w-0',
                buttonClassName: `${Ue} tw-w-full`,
                value: String(l || ''),
                disabled: t || !i || o,
                ariaLabel: w('parentPage'),
                maxHeight: 320,
                onChange: (O) => A(O),
                options: [
                  { value: '', label: i ? w('parentPage') : w('connectNotionFirst'), disabled: !0 },
                  ...v.map((O) => ({ value: O.id, label: O.title })),
                ],
              }),
              y.jsx('button', {
                type: 'button',
                title: w('refresh'),
                onClick: N,
                disabled: t || !i || o,
                className: 'webclipper-btn webclipper-btn--icon',
                'aria-label': w('refreshPagesAria'),
                'aria-busy': o,
                children: o ? '⏳' : '↻',
              }),
            ],
          }),
        }),
      }),
      y.jsx('div', {
        className: 'tw-mt-3',
        children: y.jsx('button', {
          type: 'button',
          className: Ue,
          onClick: S,
          disabled: t || !i,
          'aria-expanded': s,
          'aria-controls': 'notion-advanced-settings',
          children: s ? w('advancedHide') : w('advancedShow'),
        }),
      }),
      s
        ? y.jsxs('div', {
            id: 'notion-advanced-settings',
            className: 'tw-mt-3 tw-grid tw-gap-2',
            children: [
              y.jsx(xe, {
                label: w('notionDbIdAiChats'),
                children: y.jsxs('div', {
                  className: 'tw-flex tw-min-w-0 tw-items-center tw-gap-2',
                  children: [
                    y.jsx('input', {
                      value: c,
                      onChange: (O) => C(O.target.value),
                      onBlur: () => E('chat'),
                      onKeyDown: (O) => M(O, 'chat'),
                      disabled: t || !i,
                      spellCheck: !1,
                      placeholder: h,
                      'aria-label': w('notionDbIdAiChats'),
                      className: `${Ge} tw-min-w-0 tw-flex-1`,
                    }),
                    y.jsx('button', {
                      type: 'button',
                      className: Ue,
                      onClick: () => j('chat'),
                      disabled: t || !i,
                      children: w('reset'),
                    }),
                  ],
                }),
              }),
              y.jsx(xe, {
                label: w('notionDbIdWebArticles'),
                children: y.jsxs('div', {
                  className: 'tw-flex tw-min-w-0 tw-items-center tw-gap-2',
                  children: [
                    y.jsx('input', {
                      value: u,
                      onChange: (O) => P(O.target.value),
                      onBlur: () => E('article'),
                      onKeyDown: (O) => M(O, 'article'),
                      disabled: t || !i,
                      spellCheck: !1,
                      placeholder: m,
                      'aria-label': w('notionDbIdWebArticles'),
                      className: `${Ge} tw-min-w-0 tw-flex-1`,
                    }),
                    y.jsx('button', {
                      type: 'button',
                      className: Ue,
                      onClick: () => j('article'),
                      disabled: t || !i,
                      children: w('reset'),
                    }),
                  ],
                }),
              }),
              y.jsx(xe, {
                label: w('notionDbIdVideos'),
                children: y.jsxs('div', {
                  className: 'tw-flex tw-min-w-0 tw-items-center tw-gap-2',
                  children: [
                    y.jsx('input', {
                      value: f,
                      onChange: (O) => _(O.target.value),
                      onBlur: () => E('video'),
                      onKeyDown: (O) => M(O, 'video'),
                      disabled: t || !i,
                      spellCheck: !1,
                      placeholder: p,
                      'aria-label': w('notionDbIdVideos'),
                      className: `${Ge} tw-min-w-0 tw-flex-1`,
                    }),
                    y.jsx('button', {
                      type: 'button',
                      className: Ue,
                      onClick: () => j('video'),
                      disabled: t || !i,
                      children: w('reset'),
                    }),
                  ],
                }),
              }),
              y.jsx(xe, {
                label: w('note'),
                align: 'start',
                children: y.jsx('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: w('notionAdvancedDbIdHint'),
                }),
              }),
            ],
          })
        : null,
    ],
  });
}
function Rq(e) {
  const {
      busy: t,
      syncEnabled: r,
      feishuStatusText: n,
      feishuConnected: i,
      pollingFeishu: a,
      feishuPendingState: o,
      feishuLastError: s,
      feishuClientId: l,
      feishuClientSecret: c,
      feishuTokenExchangeProxyUrl: u,
      feishuChatFolder: f,
      feishuArticleFolder: h,
      feishuVideoFolder: m,
      setupGuideUrl: p,
      onToggleSyncEnabled: v,
      onConnectOrDisconnect: g,
      onChangeClientId: b,
      onChangeClientSecret: S,
      onChangeTokenExchangeProxyUrl: x,
      onChangeChatFolder: A,
      onChangeArticleFolder: C,
      onChangeVideoFolder: P,
      onSavePaths: _,
      onSaveAdvanced: E,
      onOpenSetupGuide: j,
    } = e,
    N = (O) => {
      O.key === 'Enter' && (O.preventDefault(), _());
    },
    M = (O) => {
      O.key === 'Enter' && (O.preventDefault(), E());
    };
  return y.jsxs(y.Fragment, {
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('feishuOAuth'),
        children: [
          y.jsxs('div', {
            className: 'tw-flex tw-items-center tw-gap-2',
            children: [
              y.jsxs('div', {
                className: 'tw-min-w-0 tw-flex-1 tw-text-[var(--text-primary)]',
                children: [
                  y.jsx('span', { className: 'tw-text-base tw-font-extrabold', children: w('feishuOAuth') }),
                  y.jsx('span', {
                    className: 'tw-mx-2 tw-text-[var(--text-secondary)]',
                    'aria-hidden': 'true',
                    children: '|',
                  }),
                  y.jsx('span', {
                    className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                    children: n,
                  }),
                ],
              }),
              y.jsx('button', {
                onClick: g,
                disabled: t,
                type: 'button',
                className: Ue,
                children: i ? w('disconnect') : a ? w('connectingDots') : w('connect'),
              }),
            ],
          }),
          s
            ? y.jsxs('div', {
                className: 'tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--error)]',
                children: [w('statusError'), ': ', s],
              })
            : !i && (a || o)
              ? y.jsx('div', {
                  className: 'tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
                  children: w('feishuWaitingHint'),
                })
              : null,
          y.jsxs('div', {
            className: 'tw-mt-3',
            'aria-label': w('feishuSyncEnabledLabel'),
            children: [
              y.jsx(xe, {
                label: w('feishuSyncEnabledLabel'),
                children: y.jsx('input', {
                  id: 'feishuSyncEnabledToggle',
                  type: 'checkbox',
                  className: fn,
                  checked: r,
                  disabled: t,
                  'aria-label': w('feishuSyncEnabledLabel'),
                  onChange: (O) => v(O.target.checked),
                }),
              }),
              r
                ? null
                : y.jsx('div', {
                    className: 'tw-mt-2',
                    children: y.jsx(xe, {
                      label: '',
                      align: 'start',
                      children: y.jsx('div', {
                        className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                        children: w('feishuSyncEnabledHint'),
                      }),
                    }),
                  }),
            ],
          }),
          y.jsxs('div', {
            id: 'feishu-advanced-settings',
            className: 'tw-mt-3 tw-grid tw-gap-2',
            children: [
              y.jsx(xe, {
                label: w('feishuOAuthClientIdLabel'),
                children: y.jsx('input', {
                  value: l,
                  onChange: (O) => b(O.target.value),
                  onBlur: E,
                  onKeyDown: M,
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'cli_xxx',
                  'aria-label': w('feishuOAuthClientIdLabel'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('feishuOAuthClientSecretLabel'),
                children: y.jsx('input', {
                  value: c,
                  onChange: (O) => S(O.target.value),
                  onBlur: E,
                  onKeyDown: M,
                  disabled: t,
                  spellCheck: !1,
                  type: 'password',
                  placeholder: '••••••••',
                  'aria-label': w('feishuOAuthClientSecretLabel'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('feishuTokenExchangeProxyUrlLabel'),
                children: y.jsx('input', {
                  value: u,
                  onChange: (O) => x(O.target.value),
                  onBlur: E,
                  onKeyDown: M,
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'https://.../feishu/oauth/exchange',
                  'aria-label': w('feishuTokenExchangeProxyUrlLabel'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('note'),
                align: 'start',
                children: y.jsxs('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: [
                    w('feishuAdvancedHint'),
                    ' ',
                    y.jsx('a', {
                      className: 'tw-underline hover:tw-opacity-80',
                      href: p,
                      target: '_blank',
                      rel: 'noreferrer',
                      onClick: (O) => {
                        (O.preventDefault(), j());
                      },
                      children: w('openSetupGuide'),
                    }),
                    '. If you updated Feishu OAuth scopes/permissions (e.g. Convert), disconnect and connect again to re-authorize.',
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('feishuPaths'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('feishuPaths'),
          }),
          y.jsxs('div', {
            className: 'tw-mt-3 tw-grid tw-gap-2',
            children: [
              y.jsx(xe, {
                label: w('aiChatsFolder'),
                children: y.jsx('input', {
                  value: f,
                  onChange: (O) => A(O.target.value),
                  onBlur: _,
                  onKeyDown: N,
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-AIChats',
                  'aria-label': w('aiChatsFolder'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('webClipperFolder'),
                children: y.jsx('input', {
                  value: h,
                  onChange: (O) => C(O.target.value),
                  onBlur: _,
                  onKeyDown: N,
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-WebArticles',
                  'aria-label': w('webClipperFolder'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('videoScriptsFolder'),
                children: y.jsx('input', {
                  value: m,
                  onChange: (O) => P(O.target.value),
                  onBlur: _,
                  onKeyDown: N,
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-Videos',
                  'aria-label': w('videoScriptsFolder'),
                  className: `${Ge} tw-w-full`,
                }),
              }),
              y.jsx(xe, {
                label: w('note'),
                align: 'start',
                children: y.jsx('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: w('feishuPathsNote'),
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Lq(e) {
  const {
      busy: t,
      syncEnabled: r,
      apiBaseUrl: n,
      authHeaderName: i,
      apiKeyDraft: a,
      apiKeyPresent: o,
      apiKeyMasked: s,
      chatFolder: l,
      articleFolder: c,
      videoFolder: u,
      statusText: f,
      obsidianLogoUrl: h,
      onChangeApiBaseUrl: m,
      onChangeAuthHeaderName: p,
      onChangeApiKeyDraft: v,
      onChangeChatFolder: g,
      onChangeArticleFolder: b,
      onChangeVideoFolder: S,
      onToggleSyncEnabled: x,
      onSave: A,
      onSaveApiKey: C,
      onTest: P,
      onOpenSetupGuide: _,
    } = e,
    E = (j, N = 'default') => {
      if (j.key === 'Enter') {
        if ((j.preventDefault(), N === 'apiKey')) {
          if (!String(a || '').trim()) return;
          C();
          return;
        }
        A();
      }
    };
  return y.jsxs(y.Fragment, {
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('obsidianLocalRestApi'),
        children: [
          y.jsxs('div', {
            className: 'tw-flex tw-items-center tw-gap-2',
            children: [
              y.jsx('img', { className: 'tw-h-5 tw-w-5 tw-shrink-0', src: h, alt: '', 'aria-hidden': 'true' }),
              y.jsx('h2', {
                className: 'tw-m-0 tw-min-w-0 tw-flex-1 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
                children: w('obsidianLocalRestApi'),
              }),
            ],
          }),
          y.jsxs('div', {
            className: 'tw-mt-3 tw-grid tw-gap-2',
            children: [
              y.jsx(xe, {
                label: w('obsidianSyncEnabledLabel'),
                children: y.jsx('input', {
                  id: 'obsidianSyncEnabledToggle',
                  type: 'checkbox',
                  className: fn,
                  checked: r,
                  disabled: t,
                  'aria-label': w('obsidianSyncEnabledLabel'),
                  onChange: (j) => x(j.target.checked),
                }),
              }),
              r
                ? null
                : y.jsx(xe, {
                    label: '',
                    align: 'start',
                    children: y.jsx('div', {
                      className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                      children: w('obsidianSyncEnabledHint'),
                    }),
                  }),
              y.jsx(xe, {
                label: w('baseUrl'),
                children: y.jsx('input', {
                  value: n,
                  onChange: (j) => m(j.target.value),
                  onBlur: A,
                  onKeyDown: (j) => E(j),
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'http://127.0.0.1:27123',
                  className: Ge,
                  'aria-label': w('baseUrl'),
                }),
              }),
              y.jsx(xe, {
                label: w('apiKey'),
                children: y.jsx('input', {
                  value: a,
                  onChange: (j) => v(j.target.value),
                  onBlur: () => {
                    String(a || '').trim() && C();
                  },
                  onKeyDown: (j) => E(j, 'apiKey'),
                  disabled: t,
                  placeholder: o ? s : '',
                  className: Ge,
                  'aria-label': w('apiKey'),
                }),
              }),
              y.jsx(xe, {
                label: w('authHeader'),
                children: y.jsx('input', {
                  value: i,
                  onChange: (j) => p(j.target.value),
                  onBlur: A,
                  onKeyDown: (j) => E(j),
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'Authorization',
                  className: Ge,
                  'aria-label': w('authHeader'),
                }),
              }),
              y.jsx(xe, {
                label: '',
                children: y.jsx('div', {
                  className: 'tw-flex tw-items-center tw-gap-2',
                  children: y.jsx('button', {
                    className: Ue,
                    onClick: P,
                    disabled: t,
                    type: 'button',
                    children: w('test'),
                  }),
                }),
              }),
              y.jsx(xe, {
                label: w('status'),
                align: 'start',
                children: y.jsx('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: f,
                }),
              }),
              y.jsx(xe, {
                label: w('note'),
                align: 'start',
                children: y.jsxs('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: [
                    w('obsidianInstallNote'),
                    ' ',
                    y.jsx('a', {
                      className: 'tw-underline hover:tw-opacity-80',
                      href: 'https://github.com/chiimagnus/SyncNos/blob/main/.github/guide/obsidian/LocalRestAPI.zh.md',
                      target: '_blank',
                      rel: 'noreferrer',
                      onClick: (j) => {
                        (j.preventDefault(), _());
                      },
                      children: w('openSetupGuide'),
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('obsidianPaths'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('obsidianPaths'),
          }),
          y.jsxs('div', {
            className: 'tw-mt-3 tw-grid tw-gap-2',
            children: [
              y.jsx(xe, {
                label: w('aiChatsFolder'),
                children: y.jsx('input', {
                  value: l,
                  onChange: (j) => g(j.target.value),
                  onBlur: A,
                  onKeyDown: (j) => E(j),
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-AIChats',
                  className: Ge,
                  'aria-label': w('aiChatsFolder'),
                }),
              }),
              y.jsx(xe, {
                label: w('webClipperFolder'),
                children: y.jsx('input', {
                  value: c,
                  onChange: (j) => b(j.target.value),
                  onBlur: A,
                  onKeyDown: (j) => E(j),
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-WebArticles',
                  className: Ge,
                  'aria-label': w('webClipperFolder'),
                }),
              }),
              y.jsx(xe, {
                label: w('videoScriptsFolder'),
                children: y.jsx('input', {
                  value: u,
                  onChange: (j) => S(j.target.value),
                  onBlur: A,
                  onKeyDown: (j) => E(j),
                  disabled: t,
                  spellCheck: !1,
                  placeholder: 'SyncNos-Videos',
                  className: Ge,
                  'aria-label': w('videoScriptsFolder'),
                }),
              }),
              y.jsx(xe, {
                label: w('note'),
                align: 'start',
                children: y.jsx('div', {
                  className: 'tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
                  children: w('obsidianPathsNote'),
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ma(e) {
  return y.jsx('span', { className: 'tw-font-mono tw-text-[0.92em]', children: e.children });
}
function $q() {
  return y.jsxs('div', {
    className: 'tw-grid tw-gap-4',
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('articlesSectionHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('articlesSectionHeading'),
          }),
          y.jsx('div', {
            className: 'tw-mt-2.5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('articlesSectionIntro'),
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('articlesSectionSupportedHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('articlesSectionSupportedHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('articlesSectionSupportedGeneral') }),
              y.jsxs('li', {
                children: [
                  w('articlesSectionSupportedEnhancedPrefix'),
                  ' ',
                  y.jsx(ma, { children: 'mp.weixin.qq.com' }),
                  ' / ',
                  y.jsx(ma, { children: 'discourse' }),
                  ' /',
                  ' ',
                  y.jsx(ma, { children: 'bilibili.com/opus' }),
                  w('articlesSectionSupportedEnhancedSuffix'),
                ],
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('articlesSectionHowToHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('articlesSectionHowToHeading'),
          }),
          y.jsxs('ol', {
            className:
              'tw-mt-2.5 tw-list-decimal tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('articlesSectionHowToStep1') }),
              y.jsxs('li', {
                children: [
                  w('articlesSectionHowToStep2Prefix'),
                  ' ',
                  y.jsx(ma, { children: w('fetchArticle') }),
                  w('articlesSectionHowToStep2Suffix'),
                ],
              }),
              y.jsxs('li', {
                children: [
                  w('articlesSectionHowToStep3Prefix'),
                  ' ',
                  y.jsx(ma, { children: w('contextMenuSaveCurrentPage') }),
                  w('articlesSectionHowToStep3Suffix'),
                ],
              }),
              y.jsx('li', { children: w('articlesSectionHowToStep4') }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('articlesSectionTroubleshootingHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('articlesSectionTroubleshootingHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('articlesSectionTroubleshootingUnsupported') }),
              y.jsx('li', { children: w('articlesSectionTroubleshootingDynamic') }),
            ],
          }),
        ],
      }),
    ],
  });
}
function xf(e) {
  return y.jsx('span', { className: 'tw-font-mono tw-text-[0.92em]', children: e.children });
}
function Fq() {
  return y.jsxs('div', {
    className: 'tw-grid tw-gap-4',
    children: [
      y.jsxs('section', {
        className: ye,
        'aria-label': w('videosSectionHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('videosSectionHeading'),
          }),
          y.jsx('div', {
            className: 'tw-mt-2.5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: w('videosSectionIntro'),
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('videosSectionSupportedHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('videosSectionSupportedHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsxs('li', {
                children: [
                  w('videosSectionSupportedYoutubePrefix'),
                  ' ',
                  y.jsx(xf, { children: 'youtube.com/watch' }),
                  ' / ',
                  y.jsx(xf, { children: 'youtu.be' }),
                  w('videosSectionSupportedYoutubeSuffix'),
                ],
              }),
              y.jsxs('li', {
                children: [
                  w('videosSectionSupportedBilibiliPrefix'),
                  ' ',
                  y.jsx(xf, { children: 'bilibili.com/video' }),
                  w('videosSectionSupportedBilibiliSuffix'),
                ],
              }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('videosSectionHowToHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('videosSectionHowToHeading'),
          }),
          y.jsxs('ol', {
            className:
              'tw-mt-2.5 tw-list-decimal tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('videosSectionHowToStep1') }),
              y.jsx('li', { children: w('videosSectionHowToStep2') }),
              y.jsx('li', { children: w('videosSectionHowToStep3') }),
              y.jsx('li', { children: w('videosSectionHowToStep4') }),
            ],
          }),
        ],
      }),
      y.jsxs('section', {
        className: ye,
        'aria-label': w('videosSectionTroubleshootingHeading'),
        children: [
          y.jsx('h2', {
            className: 'tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]',
            children: w('videosSectionTroubleshootingHeading'),
          }),
          y.jsxs('ul', {
            className:
              'tw-mt-2.5 tw-list-disc tw-pl-5 tw-text-sm tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90',
            children: [
              y.jsx('li', { children: w('videosSectionTroubleshootingNoSubtitles') }),
              y.jsx('li', { children: w('videosSectionTroubleshootingUnsupported') }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Bq(e) {
  const { activeSection: t, focusKey: r = '', onSelectSection: n, onClose: i } = e,
    a = aw(),
    o = (Pe) => {
      n(Pe);
    },
    {
      busy: s,
      error: l,
      clearError: c,
      notionSyncEnabled: u,
      onToggleNotionSyncEnabled: f,
      notionConnected: h,
      pollingNotion: m,
      loadingNotionPages: p,
      notionAdvancedOpen: v,
      notionAiModelIndex: g,
      setNotionAiModelIndex: b,
      notionParentPageId: S,
      notionChatDatabaseId: x,
      setNotionChatDatabaseId: A,
      notionArticleDatabaseId: C,
      setNotionArticleDatabaseId: P,
      notionVideoDatabaseId: _,
      setNotionVideoDatabaseId: E,
      notionChatDatabaseLabel: j,
      notionArticleDatabaseLabel: N,
      notionVideoDatabaseLabel: M,
      notionPageOptions: O,
      notionStatusText: D,
      onSaveNotionAiModelIndex: B,
      onResetNotionAiModelIndex: Y,
      notionAiRef: Q,
      onToggleNotionAdvancedOpen: se,
      onSaveNotionDatabaseId: V,
      onResetNotionDatabaseId: T,
      onNotionConnectOrDisconnect: F,
      onSaveNotionParentPage: W,
      onLoadNotionPages: z,
      feishuSyncEnabled: H,
      onToggleFeishuSyncEnabled: G,
      feishuConnected: le,
      pollingFeishu: fe,
      feishuPendingState: te,
      feishuLastError: ne,
      feishuClientId: $,
      setFeishuClientId: U,
      feishuClientSecret: ie,
      setFeishuClientSecret: R,
      feishuTokenExchangeProxyUrl: pe,
      setFeishuTokenExchangeProxyUrl: ce,
      feishuChatFolder: be,
      setFeishuChatFolder: de,
      feishuArticleFolder: K,
      setFeishuArticleFolder: ae,
      feishuVideoFolder: we,
      setFeishuVideoFolder: me,
      feishuStatusText: $e,
      onSaveFeishuPaths: We,
      onSaveFeishuAdvancedSettings: Et,
      onFeishuConnectOrDisconnect: Kt,
      onOpenFeishuSetupGuide: pt,
      feishuSetupGuideUrl: oe,
      chatWithPromptTemplate: Ae,
      setChatWithPromptTemplate: Oe,
      chatWithPlatforms: _e,
      setChatWithPlatforms: rt,
      onSaveChatWithSettings: Dt,
      onResetChatWithPlatforms: Wt,
      obsidianSyncEnabled: Ht,
      onToggleObsidianSyncEnabled: xt,
      obsidianApiBaseUrl: nr,
      setObsidianApiBaseUrl: oc,
      obsidianAuthHeaderName: Ui,
      setObsidianAuthHeaderName: sc,
      obsidianApiKeyDraft: zi,
      setObsidianApiKeyDraft: lc,
      obsidianApiKeyPresent: en,
      obsidianApiKeyMasked: cc,
      obsidianChatFolder: uo,
      setObsidianChatFolder: uc,
      obsidianArticleFolder: fo,
      setObsidianArticleFolder: Jn,
      obsidianVideoFolder: ho,
      setObsidianVideoFolder: mo,
      obsidianStatus: Ki,
      onSaveObsidianSettings: Wi,
      onTestObsidianConnection: fr,
      onOpenObsidianSetupGuide: dr,
      exportStatus: hr,
      importStatus: fc,
      importStats: dc,
      lastBackupExportAt: Hi,
      backupImportRef: Qn,
      fileInputRef: qi,
      useAppImport: Sn,
      handleBackupExport: Vi,
      importFromFile: ei,
      handleBackupImportClick: hc,
      inpageDisplayMode: po,
      onChangeInpageDisplayMode: mc,
      markdownReadingProfile: vo,
      onChangeMarkdownReadingProfile: pc,
      aiChatAutoSaveEnabled: go,
      onToggleAiChatAutoSaveEnabled: vc,
      aiChatCacheImagesEnabled: yo,
      onToggleAiChatCacheImagesEnabled: gc,
      webArticleCacheImagesEnabled: yc,
      onToggleWebArticleCacheImagesEnabled: Gi,
      antiHotlinkAdvancedOpen: tn,
      onToggleAntiHotlinkAdvancedOpen: bc,
      antiHotlinkRules: Er,
      antiHotlinkRuleErrors: wc,
      onChangeAntiHotlinkRule: bo,
      onAddAntiHotlinkRule: xc,
      onRemoveAntiHotlinkRule: Yi,
      onApplyAntiHotlinkRules: Xi,
      onResetAntiHotlinkRules: wo,
      aiChatDollarMentionEnabled: ti,
      onToggleAiChatDollarMentionEnabled: Zi,
      insightStats: xo,
      insightLoading: Sc,
      insightError: So,
      hasLoadedInsight: Ji,
      insightRange: Ao,
      setInsightRange: Ac,
      aboutYouUserName: Po,
      onChangeAboutYouUserName: Qi,
      onSaveAboutYouUserName: Pc,
    } = KE({ activeSection: t, focusKey: r }),
    An = t === 'aboutyou' ? 'tw-max-w-[1120px]' : 'tw-max-w-[980px]',
    Co = () =>
      y.jsxs('section', {
        className: `route-scroll tw-mx-auto tw-grid tw-w-full ${An} tw-gap-4 tw-pr-1`,
        children: [
          l
            ? y.jsx('section', {
                className: [
                  'tw-rounded-[var(--radius-card)] tw-border tw-border-[var(--error)] tw-bg-[var(--bg-card)] tw-p-3',
                  'tw-text-[var(--text-primary)]',
                ].join(' '),
                'aria-label': 'settings-error',
                children: y.jsxs('div', {
                  className: 'tw-flex tw-items-start tw-gap-3',
                  children: [
                    y.jsx('div', {
                      className: 'tw-min-w-0 tw-flex-1',
                      children: y.jsx('div', {
                        className: 'tw-text-sm tw-font-black tw-text-[var(--error)]',
                        children: l,
                      }),
                    }),
                    y.jsx('button', {
                      type: 'button',
                      className: ba(),
                      onClick: c,
                      'aria-label': 'dismiss error',
                      children: y.jsxs('svg', {
                        width: '16',
                        height: '16',
                        viewBox: '0 0 16 16',
                        fill: 'none',
                        'aria-hidden': 'true',
                        children: [
                          y.jsx('path', {
                            d: 'M4 4L12 12',
                            stroke: 'currentColor',
                            strokeWidth: '1.6',
                            strokeLinecap: 'round',
                          }),
                          y.jsx('path', {
                            d: 'M12 4L4 12',
                            stroke: 'currentColor',
                            strokeWidth: '1.6',
                            strokeLinecap: 'round',
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              })
            : null,
          t === 'notion'
            ? y.jsxs(y.Fragment, {
                children: [
                  y.jsx(Dq, {
                    busy: s,
                    syncEnabled: u,
                    notionStatusText: D,
                    notionConnected: !!h,
                    pollingNotion: m,
                    loadingNotionPages: p,
                    notionAdvancedOpen: v,
                    notionParentPageId: S,
                    notionChatDatabaseId: x,
                    notionArticleDatabaseId: C,
                    notionVideoDatabaseId: _,
                    notionChatDatabaseLabel: j,
                    notionArticleDatabaseLabel: N,
                    notionVideoDatabaseLabel: M,
                    notionPageOptions: O,
                    notionLogoUrl: gi('icons/notion.svg'),
                    onToggleSyncEnabled: (Pe) => {
                      f(Pe);
                    },
                    onToggleAdvancedOpen: () => {
                      se();
                    },
                    onConnectOrDisconnect: () => {
                      F();
                    },
                    onSaveNotionParentPage: (Pe) => {
                      W(Pe);
                    },
                    onChangeNotionChatDatabaseId: A,
                    onChangeNotionArticleDatabaseId: P,
                    onChangeNotionVideoDatabaseId: E,
                    onSaveNotionDatabaseId: (Pe) => {
                      V(Pe);
                    },
                    onResetNotionDatabaseId: (Pe) => {
                      T(Pe);
                    },
                    onLoadNotionPages: () => {
                      z();
                    },
                  }),
                  y.jsx('div', {
                    ref: Q,
                    id: 'settings-notion-ai',
                    children: y.jsx(Mq, {
                      busy: s,
                      modelIndex: g,
                      onChangeModelIndex: b,
                      onSave: () => {
                        B();
                      },
                      onReset: () => {
                        Y();
                      },
                    }),
                  }),
                ],
              })
            : null,
          t === 'feishu'
            ? y.jsx(Rq, {
                busy: s,
                syncEnabled: H,
                feishuStatusText: $e,
                feishuConnected: !!le,
                pollingFeishu: fe,
                feishuPendingState: te,
                feishuLastError: ne,
                feishuClientId: $,
                feishuClientSecret: ie,
                feishuTokenExchangeProxyUrl: pe,
                feishuChatFolder: be,
                feishuArticleFolder: K,
                feishuVideoFolder: we,
                setupGuideUrl: oe,
                onToggleSyncEnabled: (Pe) => {
                  G(Pe);
                },
                onChangeClientId: U,
                onChangeClientSecret: R,
                onChangeTokenExchangeProxyUrl: ce,
                onChangeChatFolder: de,
                onChangeArticleFolder: ae,
                onChangeVideoFolder: me,
                onSavePaths: () => {
                  We();
                },
                onSaveAdvanced: () => {
                  Et();
                },
                onConnectOrDisconnect: () => {
                  Kt();
                },
                onOpenSetupGuide: pt,
              })
            : null,
          t === 'chat_with'
            ? y.jsx(ek, {
                busy: s,
                promptTemplate: Ae,
                onChangePromptTemplate: Oe,
                platforms: _e,
                onChangePlatforms: rt,
                onSave: () => {
                  Dt();
                },
                onResetPlatforms: () => {
                  Wt();
                },
              })
            : null,
          t === 'obsidian'
            ? y.jsx(Lq, {
                busy: s,
                syncEnabled: Ht,
                apiBaseUrl: nr,
                authHeaderName: Ui,
                apiKeyDraft: zi,
                apiKeyPresent: en,
                apiKeyMasked: cc,
                chatFolder: uo,
                articleFolder: fo,
                videoFolder: ho,
                statusText: Ki,
                obsidianLogoUrl: gi('icons/obsidian.svg'),
                onChangeApiBaseUrl: oc,
                onChangeAuthHeaderName: sc,
                onChangeApiKeyDraft: lc,
                onChangeChatFolder: uc,
                onChangeArticleFolder: Jn,
                onChangeVideoFolder: mo,
                onToggleSyncEnabled: (Pe) => {
                  xt(Pe);
                },
                onSave: () => {
                  Wi();
                },
                onSaveApiKey: () => {
                  Wi({ includeApiKey: !0 });
                },
                onTest: () => {
                  fr();
                },
                onOpenSetupGuide: dr,
              })
            : null,
          t === 'backup'
            ? y.jsx(ZE, {
                busy: s,
                exportStatus: hr,
                importStatus: fc,
                importStats: dc,
                lastBackupExportAt: Hi,
                backupImportRef: Qn,
                fileInputRef: qi,
                importLabel: Sn ? w('importInApp') : void 0,
                onImportClick: Sn
                  ? () => {
                      hc();
                    }
                  : void 0,
                onExport: () => {
                  Vi();
                },
                onImportFile: (Pe) => {
                  ei(Pe);
                },
              })
            : null,
          t === 'aboutyou'
            ? y.jsx(Nq, {
                loading: Sc,
                error: So,
                stats: xo,
                hasLoaded: Ji,
                range: Ao,
                onChangeRange: Ac,
                userName: Po,
                onChangeUserName: Qi,
                onSaveUserName: () => {
                  Pc();
                },
              })
            : null,
          t === 'general'
            ? y.jsx(Tq, {
                busy: s,
                displayMode: po,
                onChangeDisplayMode: (Pe) => {
                  mc(Pe);
                },
                markdownReadingProfile: vo,
                onChangeMarkdownReadingProfile: (Pe) => {
                  pc(Pe);
                },
                aiChatAutoSaveEnabled: go,
                onToggleAiChatAutoSaveEnabled: (Pe) => {
                  vc(Pe);
                },
                aiChatCacheImagesEnabled: yo,
                onToggleAiChatCacheImagesEnabled: (Pe) => {
                  gc(Pe);
                },
                webArticleCacheImagesEnabled: yc,
                onToggleWebArticleCacheImagesEnabled: (Pe) => {
                  Gi(Pe);
                },
                antiHotlinkAdvancedOpen: tn,
                onToggleAntiHotlinkAdvancedOpen: bc,
                antiHotlinkRules: Er,
                antiHotlinkRuleErrors: wc,
                onChangeAntiHotlinkRule: bo,
                onAddAntiHotlinkRule: xc,
                onRemoveAntiHotlinkRule: Yi,
                onApplyAntiHotlinkRules: () => {
                  Xi();
                },
                onResetAntiHotlinkRules: () => {
                  wo();
                },
                aiChatDollarMentionEnabled: ti,
                onToggleAiChatDollarMentionEnabled: (Pe) => {
                  Zi(Pe);
                },
              })
            : null,
          t === 'articles' ? y.jsx($q, {}) : null,
          t === 'ai_chats' ? y.jsx(YE, {}) : null,
          t === 'videos' ? y.jsx(Fq, {}) : null,
          t === 'aboutme' ? y.jsx(GE, {}) : null,
        ],
      });
  return a
    ? y.jsxs('div', {
        className:
          'tw-flex tw-h-full tw-min-h-0 tw-w-full tw-min-w-0 tw-flex-col tw-bg-[var(--bg-primary)] tw-text-[var(--text-primary)]',
        children: [
          y.jsx('div', {
            className: 'tw-border-b tw-border-[var(--border)] tw-bg-[var(--bg-card)]',
            children: y.jsx(VE, {
              activeSection: t,
              onSelectSection: o,
              rightSlot: i
                ? y.jsx('button', {
                    type: 'button',
                    onClick: i,
                    className: ba(),
                    'aria-label': w('closeSettings'),
                    children: y.jsxs('svg', {
                      width: '16',
                      height: '16',
                      viewBox: '0 0 16 16',
                      fill: 'none',
                      'aria-hidden': 'true',
                      children: [
                        y.jsx('path', {
                          d: 'M4 4L12 12',
                          stroke: 'currentColor',
                          strokeWidth: '1.6',
                          strokeLinecap: 'round',
                        }),
                        y.jsx('path', {
                          d: 'M12 4L4 12',
                          stroke: 'currentColor',
                          strokeWidth: '1.6',
                          strokeLinecap: 'round',
                        }),
                      ],
                    }),
                  })
                : null,
            }),
          }),
          y.jsx('div', {
            className:
              'route-scroll tw-min-h-0 tw-flex-1 tw-overflow-auto tw-overflow-x-hidden tw-bg-[var(--bg-primary)] tw-p-3',
            children: Co(),
          }),
        ],
      })
    : y.jsxs('div', {
        className:
          'tw-flex tw-h-full tw-min-h-0 tw-w-full tw-min-w-0 tw-bg-[var(--bg-primary)] tw-text-[var(--text-primary)]',
        children: [
          y.jsx(HE, { activeSection: t, onSelectSection: o }),
          y.jsx('div', {
            className: 'tw-min-w-0 tw-flex-1 tw-overflow-y-auto tw-overflow-x-hidden tw-bg-[var(--bg-primary)] tw-p-4',
            children: Co(),
          }),
        ],
      });
}
function qb() {
  const e = Ft(),
    t = ml(),
    r = d.useMemo(() => {
      const s = new URLSearchParams(e.search || ''),
        l = String(s.get('section') || '')
          .trim()
          .toLowerCase(),
        c = String(s.get('focus') || '')
          .trim()
          .toLowerCase();
      return l === 'notion-ai' ? { section: 'notion', focus: c || 'notion-ai' } : { section: Cw(l) ?? p_(), focus: c };
    }, [e.search]),
    n = r.section,
    i = r.focus,
    a = (s) => {
      v_(s);
      const l = new URLSearchParams(e.search || '');
      (l.set('section', s),
        l.delete('focus'),
        t({ pathname: e.pathname, search: `?${l.toString()}` }, { replace: !0, state: e.state }));
    },
    o = () => {
      const s = e?.state ?? {},
        l = String(s?.from || '').trim();
      l ? t(l, { replace: !0 }) : t('/', { replace: !0 });
    };
  return y.jsx(Bq, { activeSection: n, focusKey: i, onSelectSection: a, onClose: o });
}
async function oC(e) {
  const t = String(e ?? '');
  if (!t) return !1;
  try {
    if (globalThis.navigator?.clipboard?.writeText) return (await globalThis.navigator.clipboard.writeText(t), !0);
  } catch {}
  try {
    const r = globalThis.document;
    if (!r) return !1;
    const n = r.createElement('textarea');
    ((n.value = t),
      n.setAttribute('readonly', 'true'),
      (n.style.position = 'fixed'),
      (n.style.left = '-9999px'),
      (n.style.top = '0'),
      r.body?.appendChild(n),
      n.focus(),
      n.select());
    const i = typeof r.execCommand == 'function' ? r.execCommand('copy') : !1;
    return (n.remove(), !!i);
  } catch {
    return !1;
  }
}
function ul(e) {
  return String(e || '').trim();
}
function sC(e) {
  return /^https?:\/\//i.test(ul(e));
}
const Uq = {
  async openPlatform(e, t) {
    const r = ul(t);
    return !r || !sC(r) ? !1 : bO(r);
  },
};
async function lC(e) {
  const t = e.platform,
    r = ul(t?.id),
    n = ul(t?.url);
  if (!r || !n || !sC(n)) return !1;
  const i = e.port || Uq,
    a = e?.context || null;
  return !!(a ? await i.openPlatform(r, n, a) : await i.openPlatform(r, n));
}
function Sf(e) {
  return String(e ?? '').trim();
}
function zq(e) {
  if (!e) return null;
  const t = Sf(e?.sourceType),
    r = Sf(e?.conversationKey);
  if (t !== 'article' && !r.startsWith('article:')) return null;
  const n = fs(e?.url);
  if (n) return n;
  if (r.startsWith('article:')) {
    const i = r.slice(8);
    return fs(i) || Sf(i) || null;
  }
  return null;
}
function Kq(e) {
  const { conversation: t, detail: r, platform: n, payload: i, port: a } = e;
  if (
    !t ||
    !r ||
    !Array.isArray(r.messages) ||
    !r.messages.length ||
    !n ||
    !n.enabled ||
    !String(n.url || '').trim() ||
    !String(n.name || '').trim() ||
    Number(r.conversationId) !== Number(t.id)
  )
    return null;
  const o = String(n.url || '').trim(),
    s = `Chat with ${String(n.name || '').trim()}`,
    l = `✅ 已复制，正在跳转 ${String(n.name || '').trim()}…`,
    c = {
      openPlatform: async (h, m) => {
        const p = String(m || '').trim();
        return p ? a.openExternalUrl(p) : !1;
      },
    },
    u = e.openPort || c,
    f = zq(t);
  return {
    id: `chat-with-${String(n.id || '').trim()}`,
    label: s,
    kind: 'external-link',
    provider: String(n.id || 'chat-with'),
    slot: 'tools',
    href: o,
    afterTriggerLabel: l,
    onTrigger: async () => {
      if (!(await oC(i))) throw new Error('Failed to copy content to clipboard');
      if (!(await lC({ platform: n, port: u, context: f ? { articleKey: f } : null })))
        throw new Error(`Failed to open ${String(n.name || '').trim()}`);
    },
  };
}
async function Wq({ conversation: e, detail: t, port: r, openPort: n }) {
  try {
    if (!e || !t || !Array.isArray(t.messages) || !t.messages.length) return [];
    const i = await fl(),
      a = await wO(e, t, i.promptTemplate),
      o = [];
    for (const s of i.platforms || []) {
      if (!s || !s.enabled) continue;
      const l = Kq({ conversation: e, detail: t, port: r, platform: s, payload: a, openPort: n });
      l && o.push(l);
    }
    return o;
  } catch {
    return [];
  }
}
async function cC() {
  try {
    const t = ((await fl()).platforms || []).filter((n) => n && n.enabled);
    if (t.length !== 1) return null;
    const r = String(t[0]?.name || '').trim();
    return r ? `Chat with ${r}` : null;
  } catch {
    return null;
  }
}
const Hq = [
  '请基于以下信息，帮助我理解并回应这条评论。',
  '',
  'Article Title: {{article_title}}',
  'Article URL: {{article_url}}',
  '',
  '{{article_content}}',
].join(`
`);
function es(e) {
  return String(e ?? '').trim();
}
function qq(e) {
  const t = es(e?.commentText);
  if (!t) return '';
  const r = es(e?.quoteText),
    n = es(e?.articleTitle),
    i = es(e?.canonicalUrl),
    a = [];
  (r && a.push('Quote:', r, ''), a.push(t));
  const o = a
      .join(
        `
`,
      )
      .trim(),
    s = String(e?.promptTemplate ?? ''),
    l = s.trim() ? s : Hq;
  return `${xO(l, { article_title: n, article_url: i, article_content: o, conversation_markdown: o })}
`;
}
function Mr(e) {
  return String(e ?? '').trim();
}
function Vq(e) {
  const t = [];
  for (const r of e || []) {
    if (!r || !r.enabled) continue;
    const n = Mr(r.id),
      i = Mr(r.name);
    !n || !i || t.push(r);
  }
  return t;
}
function Gq(e, t) {
  const r = `Chat with ${Mr(e.name)}`;
  return Mr(t) || r;
}
async function Yq(e) {
  const t = Mr(e?.commentText);
  if (!t) return [];
  const r = Mr(e?.canonicalUrl),
    n = await fl(),
    i = Vq(n.platforms || []);
  if (!i.length) return [];
  const a = qq({
    quoteText: e?.quoteText,
    commentText: t,
    articleTitle: e?.articleTitle,
    canonicalUrl: e?.canonicalUrl,
    promptTemplate: n.promptTemplate,
  });
  if (!Mr(a)) return [];
  const o = i.length === 1 ? await cC() : null,
    s = [];
  for (const l of i) {
    const c = Mr(l.id),
      u = Mr(l.name);
    !c ||
      !u ||
      s.push({
        id: `chat-with-${c}`,
        label: Gq(l, o),
        onTrigger: async () => {
          if (!(await oC(a))) throw new Error('Failed to copy content to clipboard');
          if (!(await lC({ platform: l, port: e?.openPort || null, context: r ? { articleKey: r } : null })))
            throw new Error(`Failed to open ${u}`);
          return `✅ 已复制，正在跳转 ${u}…`;
        },
      });
  }
  return s;
}
function mn(e) {
  return String(e ?? '').trim();
}
function Vb(e) {
  const t = e || {};
  return { articleTitle: mn(t.articleTitle), canonicalUrl: mn(t.canonicalUrl) };
}
function Xq(e, t) {
  const r = mn(e?.commentText);
  if (!r) return '';
  const i = (Array.isArray(t) ? t : [])
      .map((l) => ({ text: mn(l?.commentText), authorName: mn(l?.authorName) }))
      .filter((l) => l.text),
    a = mn(e?.authorName),
    s = [a ? `Reply 1 (${a}):` : 'Reply 1:', r];
  for (let l = 0; l < i.length; l += 1) {
    const c = i[l],
      u = l + 2,
      f = c.authorName ? `Reply ${u} (${c.authorName}):` : `Reply ${u}:`;
    s.push('', f, c.text);
  }
  return s
    .join(
      `
`,
    )
    .trim();
}
async function Gb(e) {
  return typeof e != 'function' ? !0 : !!(await e());
}
async function Zq(e) {
  return typeof e != 'function' ? null : (await e()) || null;
}
function Jq(e) {
  const t = async () => Vb(await e.resolveContext());
  return {
    resolveContext: t,
    resolveActions: async (r, n, i) => {
      if (!(await Gb(e.isEnabled))) return [];
      if (!(await Gb(e.hasConversation))) return [];
      const a = Vb(n || {}),
        o = a.articleTitle || a.canonicalUrl ? a : await t();
      return await Yq({
        quoteText: String(r?.quoteText || ''),
        commentText: Xq(r, i),
        articleTitle: mn(o.articleTitle),
        canonicalUrl: mn(o.canonicalUrl),
        openPort: await Zq(e.resolveOpenPort),
      });
    },
  };
}
function Qq(e = {}) {
  const t = d.useRef(e.onClose);
  t.current = e.onClose;
  const r = d.useRef(new Set()),
    n = d.useRef(null),
    i = (p, v) => {
      const g = globalThis;
      if (
        g.__SYNCNOS_DEBUG_COMMENTS_SELECTION__ === !0 ||
        (() => {
          try {
            return String(g.localStorage?.getItem?.('__SYNCNOS_DEBUG_COMMENTS_SELECTION__') || '') === '1';
          } catch {
            return !1;
          }
        })()
      )
        try {
          console.log('[CommentsSelection][app]', p, v);
        } catch {}
    },
    a = () => {
      const p = n.current;
      if (!p)
        return (
          i('resolve_selection', { ok: !1, reason: 'missing_locator_root' }),
          { selectionText: '', locator: null }
        );
      try {
        const v = globalThis.getSelection?.();
        if (!v || v.rangeCount <= 0)
          return (
            i('resolve_selection', {
              ok: !1,
              reason: 'no_selection_range',
              selectionRangeCount: Number(v?.rangeCount || 0) || 0,
            }),
            { selectionText: '', locator: null }
          );
        const g = String(v.toString() || '').trim();
        if (!g) return (i('resolve_selection', { ok: !1, reason: 'empty_text' }), { selectionText: '', locator: null });
        const b = v.anchorNode,
          S = v.focusNode;
        if ((b && !p.contains(b)) || (S && !p.contains(S)))
          return (
            i('resolve_selection', { ok: !1, reason: 'selection_outside_locator_root', selectionTextLen: g.length }),
            { selectionText: '', locator: null }
          );
        const x = v.getRangeAt(0)?.cloneRange?.();
        if (!x)
          return (
            i('resolve_selection', { ok: !0, selectionTextLen: g.length, locatorOk: !1 }),
            { selectionText: g, locator: null }
          );
        const A = { selectionText: g, locator: CO({ env: 'app', root: p, range: x }) ?? null };
        return (
          i('resolve_selection', { ok: !0, selectionTextLen: A.selectionText.length, locatorOk: !!A.locator }),
          A
        );
      } catch {
        return (i('resolve_selection', { ok: !1, reason: 'exception' }), { selectionText: '', locator: null });
      }
    },
    o = d.useRef(null);
  o.current || (o.current = SO());
  const s = o.current,
    l = d.useRef(null);
  l.current ||
    (l.current = AO({
      session: s,
      adapter: PO(),
      resolveComposerSelection: () => a(),
      onClose: () => {
        t.current?.();
        for (const p of r.current)
          try {
            p();
          } catch {}
      },
    }));
  const c = l.current,
    u = d.useSyncExternalStore(
      (p) => s.subscribe(p),
      () => s.getSnapshot(),
      () => s.getSnapshot(),
    ),
    f = d.useCallback((p) => {
      n.current = p;
    }, []),
    h = d.useCallback(() => n.current, []),
    m = d.useCallback(
      (p) =>
        typeof p != 'function'
          ? () => {}
          : (r.current.add(p),
            () => {
              r.current.delete(p);
            }),
      [],
    );
  return {
    sidebarSession: s,
    sidebarController: c,
    sidebarSnapshot: u,
    setLocatorRoot: f,
    getLocatorRoot: h,
    subscribeSidebarClose: m,
  };
}
const Yb = 'Extension context invalidated';
function e3(e, t) {
  return e instanceof Error ? e : new Error(String(e ?? t));
}
function t3() {
  const e = globalThis,
    t = e.browser?.runtime ?? e.chrome?.runtime;
  return !!(t && t.id);
}
function r3() {
  let e = !1;
  const t = new Set();
  function r(l) {
    if (e) return;
    e = !0;
    const c = e3(l, Yb);
    for (const u of Array.from(t))
      try {
        u(c);
      } catch {}
  }
  function n() {
    if (!t3() || e) throw new Error(Yb);
  }
  async function i(l) {
    try {
      return (n(), await OO(l));
    } catch (c) {
      throw (Eo(c) && r(c), c);
    }
  }
  async function a(l, c) {
    try {
      return (n(), await _d(l, c));
    } catch (u) {
      throw (Eo(u) && r(u), u);
    }
  }
  function o(l) {
    try {
      return (n(), gi(l));
    } catch (c) {
      return (Eo(c) && r(c), '');
    }
  }
  function s(l) {
    return typeof l != 'function' ? () => {} : (t.add(l), () => t.delete(l));
  }
  return { getURL: o, isInvalidContextError: Eo, onInvalidated: s, send: a, sendMessage: i };
}
const Xb = 'webclipper_app_sidebar_collapsed',
  Zb = 'webclipper_app_comments_sidebar_collapsed';
function n3(e) {
  return String(e?.sourceType || '')
    .trim()
    .toLowerCase() === 'article'
    ? !0
    : String(e?.source || '')
          .trim()
          .toLowerCase() !== 'web'
      ? !1
      : !!fs(e?.url);
}
function ln(e) {
  return String(e || '').trim();
}
function i3(e) {
  return /^https?:\/\//i.test(ln(e));
}
function Jb(e) {
  const t = ln(e);
  if (!t || !i3(t)) return !1;
  try {
    return (globalThis.window?.open(t, '_blank', 'noopener,noreferrer'), !0);
  } catch {
    return !1;
  }
}
function a3() {
  const [e, t] = d.useState(!1),
    [r, n] = d.useState(!1),
    [i, a] = d.useState(!0);
  (d.useEffect(() => {
    try {
      localStorage.getItem(Xb) === '1' && t(!0);
    } catch {}
  }, []),
    d.useEffect(() => {
      try {
        localStorage.getItem(Zb) === '1' && n(!0);
      } catch {}
    }, []));
  const o = (u) => {
      t(u);
      try {
        localStorage.setItem(Xb, u ? '1' : '0');
      } catch {}
    },
    s = (u) => {
      n(u);
      try {
        localStorage.setItem(Zb, u ? '1' : '0');
      } catch {}
    },
    l = d.useMemo(
      () =>
        function ({
          sidebarCollapsed: f,
          wideCommentsSidebarCollapsed: h,
          mediumCommentsSidebarCollapsed: m,
          setCollapsed: p,
          setWideCommentsCollapsed: v,
          setMediumCommentsCollapsed: g,
        }) {
          const b = Ft(),
            S = d.useRef(void 0);
          if (S.current === void 0) {
            const x = String(b.search || ''),
              C = new URLSearchParams(x.startsWith('?') ? x.slice(1) : x).get('loc');
            S.current = C ? Cm(C) : null;
          }
          return y.jsxs(_O, {
            initialOpenLoc: S.current ?? null,
            children: [
              y.jsx(c, {
                sidebarCollapsed: f,
                wideCommentsSidebarCollapsed: h,
                mediumCommentsSidebarCollapsed: m,
                setCollapsed: p,
                setWideCommentsCollapsed: v,
                setMediumCommentsCollapsed: g,
              }),
              y.jsx(EO, {}),
            ],
          });
        },
      [],
    );
  function c({
    sidebarCollapsed: u,
    wideCommentsSidebarCollapsed: f,
    mediumCommentsSidebarCollapsed: h,
    setCollapsed: m,
    setWideCommentsCollapsed: p,
    setMediumCommentsCollapsed: v,
  }) {
    const g = kO(),
      b = g === 'narrow',
      S = g === 'medium',
      x = g === 'wide',
      A = d.useRef(null),
      C = d.useRef(!1),
      {
        sidebarSession: P,
        sidebarController: _,
        sidebarSnapshot: E,
        setLocatorRoot: j,
        getLocatorRoot: N,
        subscribeSidebarClose: M,
      } = Qq({
        onClose: () => {
          if (!C.current) {
            if (S) {
              v(!0);
              return;
            }
            x && p(!0);
          }
        },
      }),
      O = d.useRef(null);
    O.current || (O.current = r3());
    const D = Ft(),
      B = ml(),
      { openConversationExternalByLoc: Y, selectedConversation: Q, detail: se } = iw(),
      V = d.useRef(null),
      T = d.useRef(null),
      F = d.useRef(!1),
      W = n3(Q),
      z = fs(Q?.url),
      H = !b && W && !!z,
      G = S ? h : f,
      le = x && H,
      fe = d.useMemo(
        () => ({
          openPlatform: async (oe, Ae, Oe) => {
            const _e = ln(oe).toLowerCase(),
              rt = ln(Ae),
              Dt = ln(Oe?.articleKey);
            if (!_e) return !1;
            const Wt = O.current;
            if (!Wt?.send) return Jb(rt);
            let Ht = '';
            if (Dt)
              try {
                const xt = await Wt.send(Om.OPEN_OR_FOCUS_GROUPED_CHAT_TAB, {
                  platformId: _e,
                  articleKey: Dt,
                  fallbackUrl: rt,
                });
                if (xt?.ok) return !0;
                Ht = ln(xt?.error?.message) || `Failed to open grouped platform tab: ${_e}`;
              } catch (xt) {
                Ht = ln(xt?.message);
              }
            try {
              const xt = await Wt.send(Om.OPEN_PLATFORM_TAB, { platformId: _e, fallbackUrl: rt });
              if (xt?.ok) return !0;
              const nr = ln(xt?.error?.message) || Ht || `Failed to open platform: ${_e}`;
              throw new Error(nr);
            } catch (xt) {
              if (Jb(rt)) return !0;
              throw xt instanceof Error ? xt : new Error(String(xt || `Failed to open platform: ${_e}`));
            }
          },
        }),
        [],
      ),
      te = !b && D.pathname === '/settings',
      ne = D?.state ?? {},
      $ = te ? (ne?.backgroundLocation ?? null) : null,
      U = D.pathname === '/settings',
      ie = H && !te && !G && (S || E.openRequested || E.isOpen),
      R = d.useRef({
        showCommentsSidebar: !1,
        hasConversation: !1,
        articleTitle: '',
        canonicalUrl: '',
        openPort: null,
      });
    R.current = {
      showCommentsSidebar: ie,
      hasConversation: !!Q,
      articleTitle: String(Q?.title || '').trim(),
      canonicalUrl: z || '',
      openPort: fe,
    };
    const pe = d.useMemo(
        () =>
          Jq({
            resolveContext: () => ({ articleTitle: R.current.articleTitle, canonicalUrl: R.current.canonicalUrl }),
            isEnabled: () => R.current.showCommentsSidebar,
            hasConversation: () => R.current.hasConversation,
            resolveOpenPort: () => R.current.openPort,
          }),
        [],
      ),
      ce = $ || (te ? { ...D, pathname: '/' } : D),
      be = d.useRef(null),
      de = d.useRef(null),
      K = () => {
        const oe = String(ne?.from || '').trim();
        oe ? B(oe, { replace: !0 }) : B('/', { replace: !0 });
      },
      ae = () => {
        if (U) {
          K();
          return;
        }
        const oe = document.activeElement;
        ((de.current = oe instanceof HTMLElement ? oe : null),
          de.current?.blur(),
          B('/settings', {
            state: {
              backgroundLocation: { pathname: D.pathname, search: D.search, hash: D.hash },
              from: `${D.pathname || '/'}${D.search || ''}`,
            },
          }));
      },
      we = () => {
        if (U) {
          B('/settings?section=aboutyou', { replace: !0, state: D.state });
          return;
        }
        const oe = document.activeElement;
        ((de.current = oe instanceof HTMLElement ? oe : null),
          de.current?.blur(),
          B('/settings?section=aboutyou', {
            state: {
              backgroundLocation: { pathname: D.pathname, search: D.search, hash: D.hash },
              from: `${D.pathname || '/'}${D.search || ''}`,
            },
          }));
      },
      me = (oe) => {
        const Ae =
            String(oe || '')
              .trim()
              .toLowerCase() || 'notion',
          Oe = `/settings?section=${encodeURIComponent(Ae)}`;
        if (U) {
          B(Oe, { replace: !0, state: D.state });
          return;
        }
        const _e = document.activeElement;
        ((de.current = _e instanceof HTMLElement ? _e : null),
          de.current?.blur(),
          B(Oe, {
            state: {
              backgroundLocation: { pathname: D.pathname, search: D.search, hash: D.hash },
              from: `${D.pathname || '/'}${D.search || ''}`,
            },
          }));
      };
    (d.useEffect(() => {
      const oe = A.current;
      if (((A.current = g), g === 'medium' && !(oe == null || oe === 'medium'))) {
        (v(!0), (C.current = !0));
        try {
          P.requestClose();
        } finally {
          C.current = !1;
        }
      }
    }, [P, v, g]),
      d.useEffect(() => {
        if (W && z) {
          _.setContext({ canonicalUrl: z, conversationId: Number(Q?.id || 0) || null });
          return;
        }
        (_.setContext(null), (C.current = !0));
        try {
          P.requestClose();
        } finally {
          C.current = !1;
        }
        P.setQuoteText('');
      }, [z, _, P, W, Q]),
      d.useEffect(() => {
        te ||
          (le &&
            (G ||
              E.openRequested ||
              E.isOpen ||
              _.open({ source: 'app-default', focusComposer: !1, ensureContext: !1 })));
      }, [le, G, _, P, E.isOpen, E.openRequested, te]));
    const $e = () => {
        (S ? v(!1) : x && p(!1), _.open({ focusComposer: !0, source: 'app', ensureContext: !1 }));
      },
      We = d.useCallback(async () => {
        if (!Q) return [];
        if (!ie) return [];
        const oe = Number(Q?.id || 0);
        if (!Number.isFinite(oe) || oe <= 0) return [];
        const Ae = se && Number(se?.conversationId || 0) === oe ? se : null;
        if (!Ae || !Array.isArray(Ae?.messages) || !Ae?.messages.length)
          throw new Error('Conversation detail is not ready yet');
        const Oe = await Wq({ conversation: Q, detail: Ae, port: TO, openPort: fe }),
          _e = [];
        for (const rt of Oe) {
          const Dt = String(rt?.id || '').trim(),
            Wt = String(rt?.label || '').trim(),
            Ht = rt?.onTrigger;
          !Dt ||
            !Wt ||
            typeof Ht != 'function' ||
            _e.push({ id: Dt, label: Wt, disabled: !!rt?.disabled, onTrigger: () => Ht() });
        }
        return _e;
      }, [fe, se, Q, ie]),
      Et = d.useCallback(async () => cC(), []);
    (d.useEffect(() => {
      if (!te) return;
      const oe = (Ae) => {
        Ae.key === 'Escape' && (Ae.preventDefault(), Ae.stopPropagation(), K());
      };
      return (document.addEventListener('keydown', oe, !0), () => document.removeEventListener('keydown', oe, !0));
    }, [te]),
      d.useEffect(() => {
        if (te) {
          const Ae = document.activeElement;
          de.current || (de.current = Ae instanceof HTMLElement ? Ae : null);
          const Oe = window.setTimeout(() => {
            be.current?.focus({ preventScroll: !0 });
          }, 0);
          return () => window.clearTimeout(Oe);
        }
        const oe = de.current;
        if (((de.current = null), !!oe && document.contains(oe)))
          try {
            oe.focus({ preventScroll: !0 });
          } catch {}
      }, [te]),
      d.useEffect(() => {
        if (!F.current) {
          F.current = !0;
          return;
        }
        if (D.pathname !== '/') return;
        const oe = String(D.search || ''),
          Oe = new URLSearchParams(oe.startsWith('?') ? oe.slice(1) : oe).get('loc');
        if (Oe && V.current && Oe === V.current) {
          ((V.current = null), (T.current = Oe));
          return;
        }
        if (!Oe || T.current === Oe) return;
        const _e = Cm(Oe);
        if (!_e) {
          T.current = Oe;
          return;
        }
        ((T.current = Oe),
          Promise.resolve(Y({ source: _e.source, conversationKey: _e.conversationKey })).catch(() => {}));
      }, [D.pathname, D.search, Y]),
      d.useEffect(() => {
        if (D.pathname !== '/' || !Q) return;
        const oe = ew({ source: Q.source, conversationKey: Q.conversationKey }),
          Ae = new URLSearchParams(String(D.search || ''));
        Ae.get('loc') !== oe &&
          (Ae.set('loc', oe), (V.current = oe), B({ pathname: '/', search: `?${Ae.toString()}` }, { replace: !0 }));
      }, [D.pathname, D.search, B, Q]));
    const pt = !b && (u || (S && ie));
    return y.jsx('div', {
      className: 'tw-flex tw-h-[100dvh] tw-w-full tw-min-w-0 tw-bg-[var(--bg-primary)] tw-text-[var(--text-primary)]',
      children: y.jsxs('main', {
        className: 'tw-relative tw-min-w-0 tw-flex-1 tw-overflow-hidden',
        children: [
          b
            ? y.jsx('div', {
                className: [
                  'tw-flex tw-h-full tw-min-h-0 tw-flex-col',
                  te ? 'tw-pointer-events-none tw-select-none tw-overflow-hidden' : '',
                ].join(' '),
                'aria-hidden': te,
                children: y.jsx('div', {
                  className: 'tw-min-h-0 tw-flex-1',
                  children: y.jsxs(Rm, {
                    location: ce,
                    children: [
                      y.jsx(kr, {
                        path: '/',
                        element: y.jsx(_m, {
                          inlineNarrowDetailHeader: !0,
                          listShell: {
                            rightSlot: y.jsxs('button', {
                              type: 'button',
                              onClick: ae,
                              className: ba(),
                              'aria-label': w('openSettingsAria'),
                              ...km(w('openSettings')),
                              children: [
                                y.jsx('span', { className: 'tw-sr-only', children: w('settingsLabel') }),
                                y.jsx(Em, { size: 16, strokeWidth: 1.6, 'aria-hidden': 'true' }),
                              ],
                            }),
                          },
                          onOpenInsightsSection: we,
                          onOpenSettingsSection: me,
                          commentsSidebarRuntime: {
                            sidebarSession: P,
                            sidebarController: _,
                            sidebarSnapshot: E,
                            setLocatorRoot: j,
                            getLocatorRoot: N,
                            subscribeSidebarClose: M,
                          },
                          narrowCommentsOpenSource: 'app',
                          resolveCommentsSidebarChatWithActions: We,
                          resolveCommentsSidebarSingleChatWithLabel: Et,
                          commentsSidebarCommentChatWith: pe,
                        }),
                      }),
                      y.jsx(kr, { path: '/settings', element: y.jsx(qb, {}) }),
                      y.jsx(kr, { path: '/sync', element: y.jsx(ea, { to: '/settings', replace: !0 }) }),
                      y.jsx(kr, { path: '/backup', element: y.jsx(ea, { to: '/settings', replace: !0 }) }),
                    ],
                  }),
                }),
              })
            : y.jsxs('div', {
                className: 'tw-flex tw-h-full tw-min-h-0 tw-min-w-0',
                children: [
                  y.jsx('div', {
                    className: [
                      'tw-h-full tw-min-w-0 tw-flex-1 tw-overflow-hidden',
                      te ? 'tw-pointer-events-none tw-select-none tw-overflow-hidden' : '',
                    ].join(' '),
                    ...(te ? { inert: '' } : {}),
                    'aria-hidden': te,
                    children: y.jsxs(Rm, {
                      location: ce,
                      children: [
                        y.jsx(kr, {
                          path: '/',
                          element: y.jsx(_m, {
                            wideChrome: 'none',
                            wideHideList: pt,
                            wideDetail: y.jsx(jO, {
                              onExpandSidebar: u ? () => m(!1) : void 0,
                              onTriggerCommentsSidebar: H ? $e : void 0,
                              onCommentsLocatorRootChange: (oe) => {
                                j(oe);
                              },
                              commentsSidebarOpen: ie,
                            }),
                            listShell: {
                              rightSlot: y.jsxs(y.Fragment, {
                                children: [
                                  y.jsxs('button', {
                                    type: 'button',
                                    onClick: ae,
                                    className: ba(),
                                    'aria-label': w('openSettingsAria'),
                                    ...km(w('openSettings')),
                                    children: [
                                      y.jsx('span', { className: 'tw-sr-only', children: w('settingsLabel') }),
                                      y.jsx(Em, { size: 16, strokeWidth: 1.6, 'aria-hidden': 'true' }),
                                    ],
                                  }),
                                  y.jsx('button', {
                                    type: 'button',
                                    onClick: () => m(!0),
                                    className: ba(),
                                    'aria-label': w('collapseSidebar'),
                                    children: y.jsxs('svg', {
                                      width: '16',
                                      height: '16',
                                      viewBox: '0 0 16 16',
                                      fill: 'none',
                                      'aria-hidden': 'true',
                                      children: [
                                        y.jsx('path', {
                                          d: 'M6.25 3.25L3 6.5L6.25 9.75',
                                          stroke: 'currentColor',
                                          strokeWidth: '1.6',
                                          strokeLinecap: 'round',
                                          strokeLinejoin: 'round',
                                        }),
                                        y.jsx('path', {
                                          d: 'M3.2 6.5H12.75',
                                          stroke: 'currentColor',
                                          strokeWidth: '1.6',
                                          strokeLinecap: 'round',
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            },
                            onOpenInsightsSection: we,
                            onOpenSettingsSection: me,
                          }),
                        }),
                        y.jsx(kr, { path: '/settings', element: y.jsx(ea, { to: '/', replace: !0 }) }),
                        y.jsx(kr, { path: '/sync', element: y.jsx(ea, { to: '/settings', replace: !0 }) }),
                        y.jsx(kr, { path: '/backup', element: y.jsx(ea, { to: '/settings', replace: !0 }) }),
                      ],
                    }),
                  }),
                  ie
                    ? y.jsx('div', {
                        className: 'tw-h-full tw-min-h-0 tw-shrink-0',
                        children: y.jsx(NO, {
                          sidebarSession: P,
                          containerClassName: 'tw-h-full tw-min-h-0',
                          getLocatorRoot: N,
                          resolveChatWithActions: We,
                          resolveChatWithSingleActionLabel: Et,
                          commentChatWith: pe,
                        }),
                      })
                    : null,
                ],
              }),
          te
            ? y.jsxs('div', {
                className: 'tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-label': w('settingsDialogAria'),
                children: [
                  y.jsx('div', {
                    className: 'tw-absolute tw-inset-0 tw-bg-[var(--bg-overlay)]',
                    role: 'presentation',
                    onMouseDown: (oe) => {
                      (oe.preventDefault(), K());
                    },
                  }),
                  y.jsxs('div', {
                    className:
                      'tw-relative tw-z-10 tw-h-[min(760px,calc(100vh-40px))] tw-w-[min(1080px,calc(100vw-40px))] tw-overflow-hidden tw-rounded-[var(--radius-outer)] tw-border tw-border-[var(--border)] tw-bg-[var(--bg-card)]',
                    onMouseDown: (oe) => oe.stopPropagation(),
                    children: [
                      y.jsx('button', {
                        type: 'button',
                        onClick: K,
                        ref: be,
                        className: ['tw-absolute tw-right-1 tw-top-1 tw-z-20', IO()].join(' '),
                        'aria-label': w('closeSettings'),
                        children: y.jsxs('svg', {
                          width: '12',
                          height: '12',
                          viewBox: '0 0 16 16',
                          fill: 'none',
                          'aria-hidden': 'true',
                          children: [
                            y.jsx('path', {
                              d: 'M4 4L12 12',
                              stroke: 'currentColor',
                              strokeWidth: '1.6',
                              strokeLinecap: 'round',
                            }),
                            y.jsx('path', {
                              d: 'M12 4L4 12',
                              stroke: 'currentColor',
                              strokeWidth: '1.6',
                              strokeLinecap: 'round',
                            }),
                          ],
                        }),
                      }),
                      y.jsx('div', { className: 'tw-h-full tw-overflow-hidden', children: y.jsx(qb, {}) }),
                    ],
                  }),
                ],
              })
            : null,
        ],
      }),
    });
  }
  return y.jsx(t_, {
    children: y.jsx(l, {
      sidebarCollapsed: e,
      wideCommentsSidebarCollapsed: r,
      mediumCommentsSidebarCollapsed: i,
      setCollapsed: o,
      setWideCommentsCollapsed: s,
      setMediumCommentsCollapsed: a,
    }),
  });
}
MO.createRoot(document.getElementById('root')).render(y.jsx(DO.StrictMode, { children: y.jsx(a3, {}) }));
