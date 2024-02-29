var EntrySoundEditor = (function(Tt, U, Ze) {
    'use strict';
    var F_ = Object.defineProperty;
    var G_ = (Tt, U, Ze) =>
        U in Tt
            ? F_(Tt, U, { enumerable: !0, configurable: !0, writable: !0, value: Ze })
            : (Tt[U] = Ze);
    var ee = (Tt, U, Ze) => (G_(Tt, typeof U != 'symbol' ? U + '' : U, Ze), Ze);
    function Vc(n) {
        const t = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
        if (n) {
            for (const e in n)
                if (e !== 'default') {
                    const s = Object.getOwnPropertyDescriptor(n, e);
                    Object.defineProperty(t, e, s.get ? s : { enumerable: !0, get: () => n[e] });
                }
        }
        return (t.default = n), Object.freeze(t);
    }
    const ne = Vc(U);
    var Ds =
        typeof globalThis < 'u'
            ? globalThis
            : typeof window < 'u'
            ? window
            : typeof global < 'u'
            ? global
            : typeof self < 'u'
            ? self
            : {};
    function eo(n) {
        return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, 'default')
            ? n.default
            : n;
    }
    var no = { exports: {} },
        Hn = {};
    /**
     * @license React
     * react-jsx-runtime.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */ var so;
    function Wc() {
        if (so) return Hn;
        so = 1;
        var n = U,
            t = Symbol.for('react.element'),
            e = Symbol.for('react.fragment'),
            s = Object.prototype.hasOwnProperty,
            i = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
            r = { key: !0, ref: !0, __self: !0, __source: !0 };
        function a(o, c, u) {
            var l,
                h = {},
                f = null,
                p = null;
            u !== void 0 && (f = '' + u),
                c.key !== void 0 && (f = '' + c.key),
                c.ref !== void 0 && (p = c.ref);
            for (l in c) s.call(c, l) && !r.hasOwnProperty(l) && (h[l] = c[l]);
            if (o && o.defaultProps)
                for (l in ((c = o.defaultProps), c)) h[l] === void 0 && (h[l] = c[l]);
            return { $$typeof: t, type: o, key: f, ref: p, props: h, _owner: i.current };
        }
        return (Hn.Fragment = e), (Hn.jsx = a), (Hn.jsxs = a), Hn;
    }
    no.exports = Wc();
    var L = no.exports,
        Ui = {},
        io = Ze;
    (Ui.createRoot = io.createRoot), (Ui.hydrateRoot = io.hydrateRoot);
    let Fc = 0;
    function W(n, t) {
        const e = `atom${++Fc}`,
            s = { toString: () => e };
        return (
            typeof n == 'function'
                ? (s.read = n)
                : ((s.init = n),
                  (s.read = function(i) {
                      return i(this);
                  }),
                  (s.write = function(i, r, a) {
                      return r(this, typeof a == 'function' ? a(i(this)) : a);
                  })),
            t && (s.write = t),
            s
        );
    }
    const ro = (n) => 'init' in n,
        oo = (n) => !!n.write,
        bs = new WeakMap(),
        Gc = (n, t) => {
            bs.set(n, t), n.catch(() => {}).finally(() => bs.delete(n));
        },
        ao = (n, t) => {
            const e = bs.get(n);
            e && (bs.delete(n), e(t));
        },
        co = (n, t) => {
            (n.status = 'fulfilled'), (n.value = t);
        },
        uo = (n, t) => {
            (n.status = 'rejected'), (n.reason = t);
        },
        Bc = (n) => typeof (n == null ? void 0 : n.then) == 'function',
        $n = (n, t) => !!n && 'v' in n && 'v' in t && Object.is(n.v, t.v),
        lo = (n, t) => !!n && 'e' in n && 'e' in t && Object.is(n.e, t.e),
        mn = (n) => !!n && 'v' in n && n.v instanceof Promise,
        Qc = (n, t) => 'v' in n && 'v' in t && n.v.orig && n.v.orig === t.v.orig,
        Cs = (n) => {
            if ('e' in n) throw n.e;
            return n.v;
        },
        Vi = () => {
            const n = new WeakMap(),
                t = new WeakMap(),
                e = new Map();
            let s, i;
            const r = (M) => n.get(M),
                a = (M, j) => {
                    const x = n.get(M);
                    if ((n.set(M, j), e.has(M) || e.set(M, x), mn(x))) {
                        const I =
                            'v' in j
                                ? j.v instanceof Promise
                                    ? j.v
                                    : Promise.resolve(j.v)
                                : Promise.reject(j.e);
                        x.v !== I && ao(x.v, I);
                    }
                },
                o = (M, j, x) => {
                    const I = new Map();
                    let A = !1;
                    x.forEach((C, D) => {
                        !C && D === M && (C = j), C && (I.set(D, C), j.d.get(D) !== C && (A = !0));
                    }),
                        (A || j.d.size !== I.size) && (j.d = I);
                },
                c = (M, j, x) => {
                    const I = r(M),
                        A = { d: (I == null ? void 0 : I.d) || new Map(), v: j };
                    if ((x && o(M, A, x), $n(I, A) && I.d === A.d)) return I;
                    if (mn(I) && mn(A) && Qc(I, A)) {
                        if (I.d === A.d) return I;
                        A.v = I.v;
                    }
                    return a(M, A), A;
                },
                u = (M, j, x, I) => {
                    if (Bc(j)) {
                        let A;
                        const C = () => {
                                const E = r(M);
                                if (!mn(E) || E.v !== D) return;
                                const z = c(M, D, x);
                                t.has(M) && E.d !== z.d && _(M, z, E.d);
                            },
                            D = new Promise((E, z) => {
                                let O = !1;
                                j.then(
                                    (Y) => {
                                        O || ((O = !0), co(D, Y), E(Y), C());
                                    },
                                    (Y) => {
                                        O || ((O = !0), uo(D, Y), z(Y), C());
                                    }
                                ),
                                    (A = (Y) => {
                                        O ||
                                            ((O = !0),
                                            Y.then(
                                                (P) => co(D, P),
                                                (P) => uo(D, P)
                                            ),
                                            E(Y));
                                    });
                            });
                        return (
                            (D.orig = j),
                            (D.status = 'pending'),
                            Gc(D, (E) => {
                                E && A(E), I == null || I();
                            }),
                            c(M, D, x)
                        );
                    }
                    return c(M, j, x);
                },
                l = (M, j, x) => {
                    const I = r(M),
                        A = { d: (I == null ? void 0 : I.d) || new Map(), e: j };
                    return x && o(M, A, x), lo(I, A) && I.d === A.d ? I : (a(M, A), A);
                },
                h = (M, j) => {
                    const x = r(M);
                    if (
                        !j &&
                        x &&
                        (t.has(M) ||
                            Array.from(x.d).every(([O, Y]) => {
                                if (O === M) return !0;
                                const P = h(O);
                                return P === Y || $n(P, Y);
                            }))
                    )
                        return x;
                    const I = new Map();
                    let A = !0;
                    const C = (O) => {
                        if (O === M) {
                            const P = r(O);
                            if (P) return I.set(O, P), Cs(P);
                            if (ro(O)) return I.set(O, void 0), O.init;
                            throw new Error('no atom init');
                        }
                        const Y = h(O);
                        return I.set(O, Y), Cs(Y);
                    };
                    let D, E;
                    const z = {
                        get signal() {
                            return D || (D = new AbortController()), D.signal;
                        },
                        get setSelf() {
                            return (
                                !E &&
                                    oo(M) &&
                                    (E = (...O) => {
                                        if (!A) return S(M, ...O);
                                    }),
                                E
                            );
                        },
                    };
                    try {
                        const O = M.read(C, z);
                        return u(M, O, I, () => (D == null ? void 0 : D.abort()));
                    } catch (O) {
                        return l(M, O, I);
                    } finally {
                        A = !1;
                    }
                },
                f = (M) => Cs(h(M)),
                p = (M) => {
                    let j = t.get(M);
                    return j || (j = v(M)), j;
                },
                d = (M, j) => !j.l.size && (!j.t.size || (j.t.size === 1 && j.t.has(M))),
                m = (M) => {
                    const j = t.get(M);
                    j && d(M, j) && w(M);
                },
                g = (M) => {
                    const j = new Map(),
                        x = new WeakMap(),
                        I = (D) => {
                            var E;
                            const z = new Set((E = t.get(D)) == null ? void 0 : E.t);
                            return (
                                e.forEach((O, Y) => {
                                    var P;
                                    (P = r(Y)) != null && P.d.has(D) && z.add(Y);
                                }),
                                z
                            );
                        },
                        A = (D) => {
                            I(D).forEach((E) => {
                                E !== D &&
                                    (j.set(E, (j.get(E) || new Set()).add(D)),
                                    x.set(E, (x.get(E) || 0) + 1),
                                    A(E));
                            });
                        };
                    A(M);
                    const C = (D) => {
                        I(D).forEach((E) => {
                            var z;
                            if (E !== D) {
                                let O = x.get(E);
                                if ((O && x.set(E, --O), !O)) {
                                    let Y = !!((z = j.get(E)) != null && z.size);
                                    if (Y) {
                                        const P = r(E),
                                            B = h(E, !0);
                                        Y = !$n(P, B);
                                    }
                                    Y || j.forEach((P) => P.delete(E));
                                }
                                C(E);
                            }
                        });
                    };
                    C(M);
                },
                y = (M, ...j) => {
                    let x = !0;
                    const I = (D) => Cs(h(D)),
                        A = (D, ...E) => {
                            let z;
                            if (D === M) {
                                if (!ro(D)) throw new Error('atom not writable');
                                const O = r(D),
                                    Y = u(D, E[0]);
                                $n(O, Y) || g(D);
                            } else z = y(D, ...E);
                            if (!x) {
                                const O = N();
                            }
                            return z;
                        },
                        C = M.write(I, A, ...j);
                    return (x = !1), C;
                },
                S = (M, ...j) => {
                    const x = y(M, ...j),
                        I = N();
                    return x;
                },
                v = (M, j, x) => {
                    var I;
                    const A = x || [];
                    (I = r(M)) == null ||
                        I.d.forEach((D, E) => {
                            const z = t.get(E);
                            z ? z.t.add(M) : E !== M && v(E, M, A);
                        }),
                        h(M);
                    const C = { t: new Set(j && [j]), l: new Set() };
                    if ((t.set(M, C), oo(M) && M.onMount)) {
                        const { onMount: D } = M;
                        A.push(() => {
                            const E = D((...z) => S(M, ...z));
                            E && (C.u = E);
                        });
                    }
                    return x || A.forEach((D) => D()), C;
                },
                w = (M) => {
                    var j;
                    const x = (j = t.get(M)) == null ? void 0 : j.u;
                    x && x(), t.delete(M);
                    const I = r(M);
                    I &&
                        (mn(I) && ao(I.v),
                        I.d.forEach((A, C) => {
                            if (C !== M) {
                                const D = t.get(C);
                                D && (D.t.delete(M), d(C, D) && w(C));
                            }
                        }));
                },
                _ = (M, j, x) => {
                    const I = new Set(j.d.keys());
                    x == null ||
                        x.forEach((A, C) => {
                            if (I.has(C)) {
                                I.delete(C);
                                return;
                            }
                            const D = t.get(C);
                            D && (D.t.delete(M), d(C, D) && w(C));
                        }),
                        I.forEach((A) => {
                            const C = t.get(A);
                            C ? C.t.add(M) : t.has(M) && v(A, M);
                        });
                },
                N = () => {
                    let M;
                    for (; e.size; ) {
                        const j = Array.from(e);
                        e.clear(),
                            j.forEach(([x, I]) => {
                                const A = r(x);
                                if (A) {
                                    const C = t.get(x);
                                    C &&
                                        A.d !== (I == null ? void 0 : I.d) &&
                                        _(x, A, I == null ? void 0 : I.d),
                                        C &&
                                            !(!mn(I) && ($n(I, A) || lo(I, A))) &&
                                            C.l.forEach((D) => D());
                                }
                            });
                    }
                };
            return {
                get: f,
                set: S,
                sub: (M, j) => {
                    const x = p(M),
                        I = N(),
                        A = x.l;
                    return (
                        A.add(j),
                        () => {
                            A.delete(j), m(M);
                        }
                    );
                },
            };
        };
    let Wi;
    const Zc = () => (Wi || (Wi = Vi()), Wi),
        ho = U.createContext(void 0),
        fo = (n) => {
            const t = U.useContext(ho);
            return (n == null ? void 0 : n.store) || t || Zc();
        },
        Hc = ({ children: n, store: t }) => {
            const e = U.useRef();
            return (
                !t && !e.current && (e.current = Vi()),
                U.createElement(ho.Provider, { value: t || e.current }, n)
            );
        },
        $c = (n) => typeof (n == null ? void 0 : n.then) == 'function',
        qc =
            U.use ||
            ((n) => {
                if (n.status === 'pending') throw n;
                if (n.status === 'fulfilled') return n.value;
                throw n.status === 'rejected'
                    ? n.reason
                    : ((n.status = 'pending'),
                      n.then(
                          (t) => {
                              (n.status = 'fulfilled'), (n.value = t);
                          },
                          (t) => {
                              (n.status = 'rejected'), (n.reason = t);
                          }
                      ),
                      n);
            });
    function F(n, t) {
        const e = fo(t),
            [[s, i, r], a] = U.useReducer(
                (u) => {
                    const l = e.get(n);
                    return Object.is(u[0], l) && u[1] === e && u[2] === n ? u : [l, e, n];
                },
                void 0,
                () => [e.get(n), e, n]
            );
        let o = s;
        (i !== e || r !== n) && (a(), (o = e.get(n)));
        const c = t == null ? void 0 : t.delay;
        return (
            U.useEffect(() => {
                const u = e.sub(n, () => {
                    if (typeof c == 'number') {
                        setTimeout(a, c);
                        return;
                    }
                    a();
                });
                return a(), u;
            }, [e, n, c]),
            U.useDebugValue(o),
            $c(o) ? qc(o) : o
        );
    }
    function Es(n, t) {
        const e = fo(t);
        return U.useCallback((...i) => e.set(n, ...i), [e, n]);
    }
    function Dt(n, t) {
        return [F(n, t), Es(n, t)];
    }
    const Te = W(null),
        Ne = W(null),
        po = W(null),
        mo = (n, t, e) => n >= e.x && n <= e.x + e.width && t >= e.y && t <= e.y + e.height,
        Os = (n) => {
            const t = new Date(n * 1e3),
                e = t
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, '0'),
                s = t
                    .getUTCSeconds()
                    .toString()
                    .padStart(2, '0'),
                i = Math.floor(t.getUTCMilliseconds() / 100).toString();
            return `${e}:${s}.${i}`;
        },
        gn = (n) => {
            const t = n.split(':'),
                e = parseInt(t[0]),
                s = parseFloat(t[1]);
            return e * 60 + s;
        },
        Xc = (n, t, e) => {
            if (n.length === 0) return [];
            const s = Math.floor(t / e),
                i = new Array(s).fill(0),
                r = (n.length - 1) / (t / e - 1);
            for (let a = 0; a < s; a++) {
                const o = a * r,
                    c = Math.floor(o),
                    u = c + 1 < n.length ? c + 1 : c,
                    l = o - c,
                    h = n[c] || 0,
                    f = n[u] || 0,
                    p = h + (f - h) * l;
                i[a] = p;
            }
            return i;
        },
        Fi = (n, t, e, s, i, r = 0) => {
            const a = Number('1'.padEnd(r + 1, '0')),
                o = (n - t) / (e - t);
            return Math.min(Math.max(Math.round((s + o * (i - s)) * a) / a, s), i);
        },
        b = Vi(),
        ks = W(null),
        De = W(null),
        zs = W([]),
        He = W(0),
        Jc = W((n) => {
            const t = n(He);
            return (Number(t) * 12) / 100;
        }),
        Kc = W((n) => ((n(He) + 100) / (100 + 100)) * 100),
        be = W(1),
        tu = W((n) => ((n(be) - 0.5) / (2 - 0.5)) * 100),
        le = W((n) => 1 / n(be)),
        $e = W(0),
        eu = W((n) => ((n($e) + 12) / 24) * 100),
        xt = W('trimmer'),
        Nt = W('default'),
        Bt = W('stopped'),
        go = W((n) => {
            const t = n(xt),
                e = n(Nt),
                s = n(qe),
                i = n(le);
            return t === 'trimmer'
                ? e === 'default'
                    ? (n(bt) - n(Ot)) * i
                    : (s - n(bt) + n(Ot) - 0) * i
                : s * i;
        }),
        Ce = W(0),
        nu = W((n) => {
            const t = n(xt),
                e = n(Nt);
            return t === 'trimmer' ? (e === 'default' ? Math.max(n(Ot), n(Ce)) : 0) : n(Ce);
        }),
        qe = W(0),
        Gi = W((n) => {
            const t = n(le);
            return n(qe) * t;
        }),
        Mo = W(
            (n) => n(qe),
            (n, t, e) => {
                t(qe, e), t(bt, e);
            }
        ),
        Ee = W(0),
        Xe = W(0),
        su = W((n) => {
            const t = n(Xe);
            return Os(t);
        }),
        iu = W((n) => {
            const t = n(Oe);
            if (!t) return 0;
            const e = n(Gi),
                s = n(Xe);
            return (t.width * s) / e;
        }),
        Ot = W(0),
        yo = W((n) => {
            const t = n(le);
            return n(Ot) * t;
        }),
        ru = W(
            (n) => Os(n(yo)),
            (n, t, e) => {
                if (!n(Oe)) return;
                const i = n(le),
                    r = n(bt),
                    a = n(Nt);
                let o;
                if ((typeof e == 'string' ? (o = gn(e) / i) : (o = e / i), Number.isNaN(o))) return;
                let c;
                a === 'default'
                    ? (c = Math.max(Math.min(o, r - 0.1 / i), 0))
                    : (c = Math.max(Math.min(o, r), 0)),
                    t(Ot, c);
            }
        ),
        bt = W(0),
        _o = W((n) => {
            const t = n(le);
            return n(bt) * t;
        }),
        ou = W(
            (n) => Os(n(_o)),
            (n, t, e) => {
                if (!n(Oe)) return;
                const i = n(le),
                    r = n(qe),
                    a = n(Ot),
                    o = n(Nt);
                let c;
                if ((typeof e == 'string' ? (c = gn(e) / i) : (c = e / i), Number.isNaN(c))) return;
                let u;
                o === 'default'
                    ? (u = Math.max(Math.min(c, r), a + 0.1 / i))
                    : (u = Math.max(Math.min(c, r), a)),
                    t(bt, u);
            }
        ),
        Mn = W(
            (n) => {
                const t = n(Oe),
                    e = n(xt);
                if (!t || e !== 'trimmer') return 0;
                const s = n(Gi),
                    i = n(yo);
                return s === 0 ? 0 : (t.width * i) / s;
            },
            (n, t, e) => {
                const s = n(Oe);
                if (!s) return;
                const i = n(le),
                    r = n(qe),
                    a = n(bt),
                    o = n(Nt);
                let c;
                o === 'default'
                    ? (c = Math.max(Math.min((e.x * r) / s.width + e.time, a - 0.1 / i), 0))
                    : (c = Math.max(Math.min((e.x * r) / s.width + e.time, a), 0)),
                    t(Ot, c);
            }
        ),
        yn = W(
            (n) => {
                const t = n(Oe);
                if (!t) return 0;
                const e = n(Gi),
                    s = n(_o);
                return e === 0 ? 0 : (t.width * s) / e + 20;
            },
            (n, t, e) => {
                const s = n(Oe);
                if (!s) return;
                const i = n(le),
                    r = n(qe),
                    a = n(Ot),
                    o = n(Nt);
                let c;
                o === 'default'
                    ? (c = Math.max(Math.min((e.x * r) / s.width + e.time, r), a + 0.1 / i))
                    : (c = Math.max(Math.min((e.x * r) / s.width + e.time, r), a)),
                    t(bt, c);
            }
        ),
        au = W((n) => {
            const t = n(Ps);
            if (!t) return { x: 0, y: 0, width: 0, height: 0 };
            let e = n(Mn);
            return n(Nt) === 'invent' && (e += 20), { x: e, y: 0, width: 20, height: t.height };
        }),
        cu = W((n) => {
            const t = n(Ps);
            if (!t) return { x: 0, y: 0, width: 0, height: 0 };
            let e = n(yn);
            return n(Nt) === 'invent' && (e -= 20), { x: e, y: 0, width: 20, height: t.height };
        }),
        uu = W({ target: '', x: 0, y: 0, time: 0 }),
        Oe = W(null),
        lu = W(null);
    W(null), W(null);
    const Ps = W(null),
        To = W(null),
        hu = W(null),
        du = W(null),
        Bi = W(void 0),
        No = '14.7.77',
        Io = (n, t, e) => ({ endTime: t, insertTime: e, type: 'exponentialRampToValue', value: n }),
        So = (n, t, e) => ({ endTime: t, insertTime: e, type: 'linearRampToValue', value: n }),
        Qi = (n, t) => ({ startTime: t, type: 'setValue', value: n }),
        jo = (n, t, e) => ({ duration: e, startTime: t, type: 'setValueCurve', values: n }),
        Ao = (n, t, { startTime: e, target: s, timeConstant: i }) =>
            s + (t - s) * Math.exp((e - n) / i),
        _n = (n) => n.type === 'exponentialRampToValue',
        Rs = (n) => n.type === 'linearRampToValue',
        ke = (n) => _n(n) || Rs(n),
        Zi = (n) => n.type === 'setValue',
        Ie = (n) => n.type === 'setValueCurve',
        Ys = (n, t, e, s) => {
            const i = n[t];
            return i === void 0
                ? s
                : ke(i) || Zi(i)
                ? i.value
                : Ie(i)
                ? i.values[i.values.length - 1]
                : Ao(e, Ys(n, t - 1, i.startTime, s), i);
        },
        xo = (n, t, e, s, i) =>
            e === void 0
                ? [s.insertTime, i]
                : ke(e)
                ? [e.endTime, e.value]
                : Zi(e)
                ? [e.startTime, e.value]
                : Ie(e)
                ? [e.startTime + e.duration, e.values[e.values.length - 1]]
                : [e.startTime, Ys(n, t - 1, e.startTime, i)],
        Hi = (n) => n.type === 'cancelAndHold',
        $i = (n) => n.type === 'cancelScheduledValues',
        ze = (n) => (Hi(n) || $i(n) ? n.cancelTime : _n(n) || Rs(n) ? n.endTime : n.startTime),
        vo = (n, t, e, { endTime: s, value: i }) =>
            e === i
                ? i
                : (0 < e && 0 < i) || (e < 0 && i < 0)
                ? e * (i / e) ** ((n - t) / (s - t))
                : 0,
        Lo = (n, t, e, { endTime: s, value: i }) => e + ((n - t) / (s - t)) * (i - e),
        fu = (n, t) => {
            const e = Math.floor(t),
                s = Math.ceil(t);
            return e === s ? n[e] : (1 - (t - e)) * n[e] + (1 - (s - t)) * n[s];
        },
        pu = (n, { duration: t, startTime: e, values: s }) => {
            const i = ((n - e) / t) * (s.length - 1);
            return fu(s, i);
        },
        Us = (n) => n.type === 'setTarget';
    class mu {
        constructor(t) {
            (this._automationEvents = []), (this._currenTime = 0), (this._defaultValue = t);
        }
        [Symbol.iterator]() {
            return this._automationEvents[Symbol.iterator]();
        }
        add(t) {
            const e = ze(t);
            if (Hi(t) || $i(t)) {
                const s = this._automationEvents.findIndex((r) =>
                        $i(t) && Ie(r) ? r.startTime + r.duration >= e : ze(r) >= e
                    ),
                    i = this._automationEvents[s];
                if (
                    (s !== -1 && (this._automationEvents = this._automationEvents.slice(0, s)),
                    Hi(t))
                ) {
                    const r = this._automationEvents[this._automationEvents.length - 1];
                    if (i !== void 0 && ke(i)) {
                        if (r !== void 0 && Us(r))
                            throw new Error('The internal list is malformed.');
                        const a =
                                r === void 0
                                    ? i.insertTime
                                    : Ie(r)
                                    ? r.startTime + r.duration
                                    : ze(r),
                            o =
                                r === void 0
                                    ? this._defaultValue
                                    : Ie(r)
                                    ? r.values[r.values.length - 1]
                                    : r.value,
                            c = _n(i) ? vo(e, a, o, i) : Lo(e, a, o, i),
                            u = _n(i) ? Io(c, e, this._currenTime) : So(c, e, this._currenTime);
                        this._automationEvents.push(u);
                    }
                    if (
                        (r !== void 0 &&
                            Us(r) &&
                            this._automationEvents.push(Qi(this.getValue(e), e)),
                        r !== void 0 && Ie(r) && r.startTime + r.duration > e)
                    ) {
                        const a = e - r.startTime,
                            o = (r.values.length - 1) / r.duration,
                            c = Math.max(2, 1 + Math.ceil(a * o)),
                            u = (a / (c - 1)) * o,
                            l = r.values.slice(0, c);
                        if (u < 1)
                            for (let h = 1; h < c; h += 1) {
                                const f = (u * h) % 1;
                                l[h] = r.values[h - 1] * (1 - f) + r.values[h] * f;
                            }
                        this._automationEvents[this._automationEvents.length - 1] = jo(
                            l,
                            r.startTime,
                            a
                        );
                    }
                }
            } else {
                const s = this._automationEvents.findIndex((a) => ze(a) > e),
                    i =
                        s === -1
                            ? this._automationEvents[this._automationEvents.length - 1]
                            : this._automationEvents[s - 1];
                if (i !== void 0 && Ie(i) && ze(i) + i.duration > e) return !1;
                const r = _n(t)
                    ? Io(t.value, t.endTime, this._currenTime)
                    : Rs(t)
                    ? So(t.value, e, this._currenTime)
                    : t;
                if (s === -1) this._automationEvents.push(r);
                else {
                    if (Ie(t) && e + t.duration > ze(this._automationEvents[s])) return !1;
                    this._automationEvents.splice(s, 0, r);
                }
            }
            return !0;
        }
        flush(t) {
            const e = this._automationEvents.findIndex((s) => ze(s) > t);
            if (e > 1) {
                const s = this._automationEvents.slice(e - 1),
                    i = s[0];
                Us(i) &&
                    s.unshift(
                        Qi(
                            Ys(this._automationEvents, e - 2, i.startTime, this._defaultValue),
                            i.startTime
                        )
                    ),
                    (this._automationEvents = s);
            }
        }
        getValue(t) {
            if (this._automationEvents.length === 0) return this._defaultValue;
            const e = this._automationEvents.findIndex((a) => ze(a) > t),
                s = this._automationEvents[e],
                i = (e === -1 ? this._automationEvents.length : e) - 1,
                r = this._automationEvents[i];
            if (r !== void 0 && Us(r) && (s === void 0 || !ke(s) || s.insertTime > t))
                return Ao(t, Ys(this._automationEvents, i - 1, r.startTime, this._defaultValue), r);
            if (r !== void 0 && Zi(r) && (s === void 0 || !ke(s))) return r.value;
            if (r !== void 0 && Ie(r) && (s === void 0 || !ke(s) || r.startTime + r.duration > t))
                return t < r.startTime + r.duration ? pu(t, r) : r.values[r.values.length - 1];
            if (r !== void 0 && ke(r) && (s === void 0 || !ke(s))) return r.value;
            if (s !== void 0 && _n(s)) {
                const [a, o] = xo(this._automationEvents, i, r, s, this._defaultValue);
                return vo(t, a, o, s);
            }
            if (s !== void 0 && Rs(s)) {
                const [a, o] = xo(this._automationEvents, i, r, s, this._defaultValue);
                return Lo(t, a, o, s);
            }
            return this._defaultValue;
        }
    }
    const gu = (n) => ({ cancelTime: n, type: 'cancelAndHold' }),
        Mu = (n) => ({ cancelTime: n, type: 'cancelScheduledValues' }),
        yu = (n, t) => ({ endTime: t, type: 'exponentialRampToValue', value: n }),
        _u = (n, t) => ({ endTime: t, type: 'linearRampToValue', value: n }),
        Tu = (n, t, e) => ({ startTime: t, target: n, timeConstant: e, type: 'setTarget' }),
        Nu = () => new DOMException('', 'AbortError'),
        Iu = (n) => (t, e, [s, i, r], a) => {
            n(t[i], [e, s, r], (o) => o[0] === e && o[1] === s, a);
        },
        Su = (n) => (t, e, s) => {
            const i = [];
            for (let r = 0; r < s.numberOfInputs; r += 1) i.push(new Set());
            n.set(t, {
                activeInputs: i,
                outputs: new Set(),
                passiveInputs: new WeakMap(),
                renderer: e,
            });
        },
        ju = (n) => (t, e) => {
            n.set(t, { activeInputs: new Set(), passiveInputs: new WeakMap(), renderer: e });
        },
        Tn = new WeakSet(),
        wo = new WeakMap(),
        qi = new WeakMap(),
        Do = new WeakMap(),
        Xi = new WeakMap(),
        Vs = new WeakMap(),
        bo = new WeakMap(),
        Ji = new WeakMap(),
        Ki = new WeakMap(),
        tr = new WeakMap(),
        Co = {
            construct() {
                return Co;
            },
        },
        Au = (n) => {
            try {
                const t = new Proxy(n, Co);
                new t();
            } catch {
                return !1;
            }
            return !0;
        },
        Eo = /^import(?:(?:[\s]+[\w]+|(?:[\s]+[\w]+[\s]*,)?[\s]*\{[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?(?:[\s]*,[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?)*[\s]*}|(?:[\s]+[\w]+[\s]*,)?[\s]*\*[\s]+as[\s]+[\w]+)[\s]+from)?(?:[\s]*)("([^"\\]|\\.)+"|'([^'\\]|\\.)+')(?:[\s]*);?/,
        Oo = (n, t) => {
            const e = [];
            let s = n.replace(/^[\s]+/, ''),
                i = s.match(Eo);
            for (; i !== null; ) {
                const r = i[1].slice(1, -1),
                    a = i[0].replace(/([\s]+)?;?$/, '').replace(r, new URL(r, t).toString());
                e.push(a), (s = s.slice(i[0].length).replace(/^[\s]+/, '')), (i = s.match(Eo));
            }
            return [e.join(';'), s];
        },
        ko = (n) => {
            if (n !== void 0 && !Array.isArray(n))
                throw new TypeError(
                    'The parameterDescriptors property of given value for processorCtor is not an array.'
                );
        },
        zo = (n) => {
            if (!Au(n))
                throw new TypeError('The given value for processorCtor should be a constructor.');
            if (n.prototype === null || typeof n.prototype != 'object')
                throw new TypeError('The given value for processorCtor should have a prototype.');
        },
        xu = (n, t, e, s, i, r, a, o, c, u, l, h, f) => {
            let p = 0;
            return (d, m, g = { credentials: 'omit' }) => {
                const y = l.get(d);
                if (y !== void 0 && y.has(m)) return Promise.resolve();
                const S = u.get(d);
                if (S !== void 0) {
                    const _ = S.get(m);
                    if (_ !== void 0) return _;
                }
                const v = r(d),
                    w =
                        v.audioWorklet === void 0
                            ? i(m)
                                  .then(([_, N]) => {
                                      const [T, M] = Oo(_, N),
                                          j = `${T};((a,b)=>{(a[b]=a[b]||[]).push((AudioWorkletProcessor,global,registerProcessor,sampleRate,self,window)=>{${M}
})})(window,'_AWGS')`;
                                      return e(j);
                                  })
                                  .then(() => {
                                      const _ = f._AWGS.pop();
                                      if (_ === void 0) throw new SyntaxError();
                                      s(v.currentTime, v.sampleRate, () =>
                                          _(
                                              class {},
                                              void 0,
                                              (N, T) => {
                                                  if (N.trim() === '') throw t();
                                                  const M = Ki.get(v);
                                                  if (M !== void 0) {
                                                      if (M.has(N)) throw t();
                                                      zo(T),
                                                          ko(T.parameterDescriptors),
                                                          M.set(N, T);
                                                  } else
                                                      zo(T),
                                                          ko(T.parameterDescriptors),
                                                          Ki.set(v, new Map([[N, T]]));
                                              },
                                              v.sampleRate,
                                              void 0,
                                              void 0
                                          )
                                      );
                                  })
                            : Promise.all([i(m), Promise.resolve(n(h, h))]).then(([[_, N], T]) => {
                                  const M = p + 1;
                                  p = M;
                                  const [j, x] = Oo(_, N),
                                      D = `${j};((AudioWorkletProcessor,registerProcessor)=>{${x}
})(${
                                          T
                                              ? 'AudioWorkletProcessor'
                                              : 'class extends AudioWorkletProcessor {__b=new WeakSet();constructor(){super();(p=>p.postMessage=(q=>(m,t)=>q.call(p,m,t?t.filter(u=>!this.__b.has(u)):t))(p.postMessage))(this.port)}}'
                                      },(n,p)=>registerProcessor(n,class extends p{${
                                          T
                                              ? ''
                                              : '__c = (a) => a.forEach(e=>this.__b.add(e.buffer));'
                                      }process(i,o,p){${
                                          T
                                              ? ''
                                              : 'i.forEach(this.__c);o.forEach(this.__c);this.__c(Object.values(p));'
                                      }return super.process(i.map(j=>j.some(k=>k.length===0)?[]:j),o,p)}}));registerProcessor('__sac${M}',class extends AudioWorkletProcessor{process(){return !1}})`,
                                      E = new Blob([D], {
                                          type: 'application/javascript; charset=utf-8',
                                      }),
                                      z = URL.createObjectURL(E);
                                  return v.audioWorklet
                                      .addModule(z, g)
                                      .then(() => {
                                          if (o(v)) return v;
                                          const O = a(v);
                                          return O.audioWorklet.addModule(z, g).then(() => O);
                                      })
                                      .then((O) => {
                                          if (c === null) throw new SyntaxError();
                                          try {
                                              new c(O, `__sac${M}`);
                                          } catch {
                                              throw new SyntaxError();
                                          }
                                      })
                                      .finally(() => URL.revokeObjectURL(z));
                              });
                return (
                    S === void 0 ? u.set(d, new Map([[m, w]])) : S.set(m, w),
                    w
                        .then(() => {
                            const _ = l.get(d);
                            _ === void 0 ? l.set(d, new Set([m])) : _.add(m);
                        })
                        .finally(() => {
                            const _ = u.get(d);
                            _ !== void 0 && _.delete(m);
                        }),
                    w
                );
            };
        },
        se = (n, t) => {
            const e = n.get(t);
            if (e === void 0) throw new Error('A value with the given key could not be found.');
            return e;
        },
        Ws = (n, t) => {
            const e = Array.from(n).filter(t);
            if (e.length > 1) throw Error('More than one element was found.');
            if (e.length === 0) throw Error('No element was found.');
            const [s] = e;
            return n.delete(s), s;
        },
        Po = (n, t, e, s) => {
            const i = se(n, t),
                r = Ws(i, (a) => a[0] === e && a[1] === s);
            return i.size === 0 && n.delete(t), r;
        },
        qn = (n) => se(bo, n),
        Nn = (n) => {
            if (Tn.has(n)) throw new Error('The AudioNode is already stored.');
            Tn.add(n), qn(n).forEach((t) => t(!0));
        },
        Ro = (n) => 'port' in n,
        Xn = (n) => {
            if (!Tn.has(n)) throw new Error('The AudioNode is not stored.');
            Tn.delete(n), qn(n).forEach((t) => t(!1));
        },
        er = (n, t) => {
            !Ro(n) && t.every((e) => e.size === 0) && Xn(n);
        },
        vu = (n, t, e, s, i, r, a, o, c, u, l, h, f) => {
            const p = new WeakMap();
            return (d, m, g, y, S) => {
                const { activeInputs: v, passiveInputs: w } = r(m),
                    { outputs: _ } = r(d),
                    N = o(d),
                    T = (M) => {
                        const j = c(m),
                            x = c(d);
                        if (M) {
                            const I = Po(w, d, g, y);
                            n(v, d, I, !1), !S && !h(d) && e(x, j, g, y), f(m) && Nn(m);
                        } else {
                            const I = s(v, d, g, y);
                            t(w, y, I, !1), !S && !h(d) && i(x, j, g, y);
                            const A = a(m);
                            if (A === 0) l(m) && er(m, v);
                            else {
                                const C = p.get(m);
                                C !== void 0 && clearTimeout(C),
                                    p.set(
                                        m,
                                        setTimeout(() => {
                                            l(m) && er(m, v);
                                        }, A * 1e3)
                                    );
                            }
                        }
                    };
                return u(_, [m, g, y], (M) => M[0] === m && M[1] === g && M[2] === y, !0)
                    ? (N.add(T), l(d) ? n(v, d, [g, y, T], !0) : t(w, y, [d, g, T], !0), !0)
                    : !1;
            };
        },
        Lu = (n) => (t, e, [s, i, r], a) => {
            const o = t.get(s);
            o === void 0
                ? t.set(s, new Set([[i, e, r]]))
                : n(o, [i, e, r], (c) => c[0] === i && c[1] === e, a);
        },
        wu = (n) => (t, e) => {
            const s = n(t, {
                channelCount: 1,
                channelCountMode: 'explicit',
                channelInterpretation: 'discrete',
                gain: 0,
            });
            e.connect(s).connect(t.destination);
            const i = () => {
                e.removeEventListener('ended', i), e.disconnect(s), s.disconnect();
            };
            e.addEventListener('ended', i);
        },
        Du = (n) => (t, e) => {
            n(t).add(e);
        },
        bu = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fftSize: 2048,
            maxDecibels: -30,
            minDecibels: -100,
            smoothingTimeConstant: 0.8,
        },
        Cu = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = i(o),
                        l = { ...bu, ...c },
                        h = s(u, l),
                        f = r(u) ? t() : null;
                    super(o, !1, h, f), (this._nativeAnalyserNode = h);
                }
                get fftSize() {
                    return this._nativeAnalyserNode.fftSize;
                }
                set fftSize(o) {
                    this._nativeAnalyserNode.fftSize = o;
                }
                get frequencyBinCount() {
                    return this._nativeAnalyserNode.frequencyBinCount;
                }
                get maxDecibels() {
                    return this._nativeAnalyserNode.maxDecibels;
                }
                set maxDecibels(o) {
                    const c = this._nativeAnalyserNode.maxDecibels;
                    if (
                        ((this._nativeAnalyserNode.maxDecibels = o),
                        !(o > this._nativeAnalyserNode.minDecibels))
                    )
                        throw ((this._nativeAnalyserNode.maxDecibels = c), e());
                }
                get minDecibels() {
                    return this._nativeAnalyserNode.minDecibels;
                }
                set minDecibels(o) {
                    const c = this._nativeAnalyserNode.minDecibels;
                    if (
                        ((this._nativeAnalyserNode.minDecibels = o),
                        !(this._nativeAnalyserNode.maxDecibels > o))
                    )
                        throw ((this._nativeAnalyserNode.minDecibels = c), e());
                }
                get smoothingTimeConstant() {
                    return this._nativeAnalyserNode.smoothingTimeConstant;
                }
                set smoothingTimeConstant(o) {
                    this._nativeAnalyserNode.smoothingTimeConstant = o;
                }
                getByteFrequencyData(o) {
                    this._nativeAnalyserNode.getByteFrequencyData(o);
                }
                getByteTimeDomainData(o) {
                    this._nativeAnalyserNode.getByteTimeDomainData(o);
                }
                getFloatFrequencyData(o) {
                    this._nativeAnalyserNode.getFloatFrequencyData(o);
                }
                getFloatTimeDomainData(o) {
                    this._nativeAnalyserNode.getFloatTimeDomainData(o);
                }
            },
        Ct = (n, t) => n.context === t,
        Eu = (n, t, e) => () => {
            const s = new WeakMap(),
                i = async (r, a) => {
                    let o = t(r);
                    if (!Ct(o, a)) {
                        const u = {
                            channelCount: o.channelCount,
                            channelCountMode: o.channelCountMode,
                            channelInterpretation: o.channelInterpretation,
                            fftSize: o.fftSize,
                            maxDecibels: o.maxDecibels,
                            minDecibels: o.minDecibels,
                            smoothingTimeConstant: o.smoothingTimeConstant,
                        };
                        o = n(a, u);
                    }
                    return s.set(a, o), await e(r, a, o), o;
                };
            return {
                render(r, a) {
                    const o = s.get(a);
                    return o !== void 0 ? Promise.resolve(o) : i(r, a);
                },
            };
        },
        Fs = (n) => {
            try {
                n.copyToChannel(new Float32Array(1), 0, -1);
            } catch {
                return !1;
            }
            return !0;
        },
        he = () => new DOMException('', 'IndexSizeError'),
        nr = (n) => {
            n.getChannelData = ((t) => (e) => {
                try {
                    return t.call(n, e);
                } catch (s) {
                    throw s.code === 12 ? he() : s;
                }
            })(n.getChannelData);
        },
        Ou = { numberOfChannels: 1 },
        ku = (n, t, e, s, i, r, a, o) => {
            let c = null;
            return class Yc {
                constructor(l) {
                    if (i === null)
                        throw new Error('Missing the native OfflineAudioContext constructor.');
                    const { length: h, numberOfChannels: f, sampleRate: p } = { ...Ou, ...l };
                    c === null && (c = new i(1, 1, 44100));
                    const d =
                        s !== null && t(r, r)
                            ? new s({ length: h, numberOfChannels: f, sampleRate: p })
                            : c.createBuffer(f, h, p);
                    if (d.numberOfChannels === 0) throw e();
                    return (
                        typeof d.copyFromChannel != 'function'
                            ? (a(d), nr(d))
                            : t(Fs, () => Fs(d)) || o(d),
                        n.add(d),
                        d
                    );
                }
                static [Symbol.hasInstance](l) {
                    return (
                        (l !== null &&
                            typeof l == 'object' &&
                            Object.getPrototypeOf(l) === Yc.prototype) ||
                        n.has(l)
                    );
                }
            };
        },
        Vt = -34028234663852886e22,
        kt = -Vt,
        Se = (n) => Tn.has(n),
        zu = {
            buffer: null,
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            loop: !1,
            loopEnd: 0,
            loopStart: 0,
            playbackRate: 1,
        },
        Pu = (n, t, e, s, i, r, a, o) =>
            class extends n {
                constructor(u, l) {
                    const h = r(u),
                        f = { ...zu, ...l },
                        p = i(h, f),
                        d = a(h),
                        m = d ? t() : null;
                    super(u, !1, p, m),
                        (this._audioBufferSourceNodeRenderer = m),
                        (this._isBufferNullified = !1),
                        (this._isBufferSet = f.buffer !== null),
                        (this._nativeAudioBufferSourceNode = p),
                        (this._onended = null),
                        (this._playbackRate = e(this, d, p.playbackRate, kt, Vt));
                }
                get buffer() {
                    return this._isBufferNullified
                        ? null
                        : this._nativeAudioBufferSourceNode.buffer;
                }
                set buffer(u) {
                    if (((this._nativeAudioBufferSourceNode.buffer = u), u !== null)) {
                        if (this._isBufferSet) throw s();
                        this._isBufferSet = !0;
                    }
                }
                get loop() {
                    return this._nativeAudioBufferSourceNode.loop;
                }
                set loop(u) {
                    this._nativeAudioBufferSourceNode.loop = u;
                }
                get loopEnd() {
                    return this._nativeAudioBufferSourceNode.loopEnd;
                }
                set loopEnd(u) {
                    this._nativeAudioBufferSourceNode.loopEnd = u;
                }
                get loopStart() {
                    return this._nativeAudioBufferSourceNode.loopStart;
                }
                set loopStart(u) {
                    this._nativeAudioBufferSourceNode.loopStart = u;
                }
                get onended() {
                    return this._onended;
                }
                set onended(u) {
                    const l = typeof u == 'function' ? o(this, u) : null;
                    this._nativeAudioBufferSourceNode.onended = l;
                    const h = this._nativeAudioBufferSourceNode.onended;
                    this._onended = h !== null && h === l ? u : h;
                }
                get playbackRate() {
                    return this._playbackRate;
                }
                start(u = 0, l = 0, h) {
                    if (
                        (this._nativeAudioBufferSourceNode.start(u, l, h),
                        this._audioBufferSourceNodeRenderer !== null &&
                            (this._audioBufferSourceNodeRenderer.start =
                                h === void 0 ? [u, l] : [u, l, h]),
                        this.context.state !== 'closed')
                    ) {
                        Nn(this);
                        const f = () => {
                            this._nativeAudioBufferSourceNode.removeEventListener('ended', f),
                                Se(this) && Xn(this);
                        };
                        this._nativeAudioBufferSourceNode.addEventListener('ended', f);
                    }
                }
                stop(u = 0) {
                    this._nativeAudioBufferSourceNode.stop(u),
                        this._audioBufferSourceNodeRenderer !== null &&
                            (this._audioBufferSourceNodeRenderer.stop = u);
                }
            },
        Ru = (n, t, e, s, i) => () => {
            const r = new WeakMap();
            let a = null,
                o = null;
            const c = async (u, l) => {
                let h = e(u);
                const f = Ct(h, l);
                if (!f) {
                    const p = {
                        buffer: h.buffer,
                        channelCount: h.channelCount,
                        channelCountMode: h.channelCountMode,
                        channelInterpretation: h.channelInterpretation,
                        loop: h.loop,
                        loopEnd: h.loopEnd,
                        loopStart: h.loopStart,
                        playbackRate: h.playbackRate.value,
                    };
                    (h = t(l, p)), a !== null && h.start(...a), o !== null && h.stop(o);
                }
                return (
                    r.set(l, h),
                    f
                        ? await n(l, u.playbackRate, h.playbackRate)
                        : await s(l, u.playbackRate, h.playbackRate),
                    await i(u, l, h),
                    h
                );
            };
            return {
                set start(u) {
                    a = u;
                },
                set stop(u) {
                    o = u;
                },
                render(u, l) {
                    const h = r.get(l);
                    return h !== void 0 ? Promise.resolve(h) : c(u, l);
                },
            };
        },
        Yu = (n) => 'playbackRate' in n,
        Uu = (n) => 'frequency' in n && 'gain' in n,
        Vu = (n) => 'offset' in n,
        Wu = (n) => !('frequency' in n) && 'gain' in n,
        Fu = (n) => 'detune' in n && 'frequency' in n,
        Gu = (n) => 'pan' in n,
        zt = (n) => se(wo, n),
        Jn = (n) => se(Do, n),
        sr = (n, t) => {
            const { activeInputs: e } = zt(n);
            e.forEach((i) =>
                i.forEach(([r]) => {
                    t.includes(n) || sr(r, [...t, n]);
                })
            );
            const s = Yu(n)
                ? [n.playbackRate]
                : Ro(n)
                ? Array.from(n.parameters.values())
                : Uu(n)
                ? [n.Q, n.detune, n.frequency, n.gain]
                : Vu(n)
                ? [n.offset]
                : Wu(n)
                ? [n.gain]
                : Fu(n)
                ? [n.detune, n.frequency]
                : Gu(n)
                ? [n.pan]
                : [];
            for (const i of s) {
                const r = Jn(i);
                r !== void 0 && r.activeInputs.forEach(([a]) => sr(a, t));
            }
            Se(n) && Xn(n);
        },
        Yo = (n) => {
            sr(n.destination, []);
        },
        Bu = (n) =>
            n === void 0 ||
            typeof n == 'number' ||
            (typeof n == 'string' && (n === 'balanced' || n === 'interactive' || n === 'playback')),
        Qu = (n, t, e, s, i, r, a, o, c) =>
            class extends n {
                constructor(l = {}) {
                    if (c === null) throw new Error('Missing the native AudioContext constructor.');
                    let h;
                    try {
                        h = new c(l);
                    } catch (d) {
                        throw d.code === 12 && d.message === 'sampleRate is not in range' ? e() : d;
                    }
                    if (h === null) throw s();
                    if (!Bu(l.latencyHint))
                        throw new TypeError(
                            `The provided value '${l.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`
                        );
                    if (l.sampleRate !== void 0 && h.sampleRate !== l.sampleRate) throw e();
                    super(h, 2);
                    const { latencyHint: f } = l,
                        { sampleRate: p } = h;
                    if (
                        ((this._baseLatency =
                            typeof h.baseLatency == 'number'
                                ? h.baseLatency
                                : f === 'balanced'
                                ? 512 / p
                                : f === 'interactive' || f === void 0
                                ? 256 / p
                                : f === 'playback'
                                ? 1024 / p
                                : (Math.max(2, Math.min(128, Math.round((f * p) / 128))) * 128) /
                                  p),
                        (this._nativeAudioContext = h),
                        c.name === 'webkitAudioContext'
                            ? ((this._nativeGainNode = h.createGain()),
                              (this._nativeOscillatorNode = h.createOscillator()),
                              (this._nativeGainNode.gain.value = 1e-37),
                              this._nativeOscillatorNode
                                  .connect(this._nativeGainNode)
                                  .connect(h.destination),
                              this._nativeOscillatorNode.start())
                            : ((this._nativeGainNode = null), (this._nativeOscillatorNode = null)),
                        (this._state = null),
                        h.state === 'running')
                    ) {
                        this._state = 'suspended';
                        const d = () => {
                            this._state === 'suspended' && (this._state = null),
                                h.removeEventListener('statechange', d);
                        };
                        h.addEventListener('statechange', d);
                    }
                }
                get baseLatency() {
                    return this._baseLatency;
                }
                get state() {
                    return this._state !== null ? this._state : this._nativeAudioContext.state;
                }
                close() {
                    return this.state === 'closed'
                        ? this._nativeAudioContext.close().then(() => {
                              throw t();
                          })
                        : (this._state === 'suspended' && (this._state = null),
                          this._nativeAudioContext.close().then(() => {
                              this._nativeGainNode !== null &&
                                  this._nativeOscillatorNode !== null &&
                                  (this._nativeOscillatorNode.stop(),
                                  this._nativeGainNode.disconnect(),
                                  this._nativeOscillatorNode.disconnect()),
                                  Yo(this);
                          }));
                }
                createMediaElementSource(l) {
                    return new i(this, { mediaElement: l });
                }
                createMediaStreamDestination() {
                    return new r(this);
                }
                createMediaStreamSource(l) {
                    return new a(this, { mediaStream: l });
                }
                createMediaStreamTrackSource(l) {
                    return new o(this, { mediaStreamTrack: l });
                }
                resume() {
                    return this._state === 'suspended'
                        ? new Promise((l, h) => {
                              const f = () => {
                                  this._nativeAudioContext.removeEventListener('statechange', f),
                                      this._nativeAudioContext.state === 'running'
                                          ? l()
                                          : this.resume().then(l, h);
                              };
                              this._nativeAudioContext.addEventListener('statechange', f);
                          })
                        : this._nativeAudioContext.resume().catch((l) => {
                              throw l === void 0 || l.code === 15 ? t() : l;
                          });
                }
                suspend() {
                    return this._nativeAudioContext.suspend().catch((l) => {
                        throw l === void 0 ? t() : l;
                    });
                }
            },
        Zu = (n, t, e, s, i, r, a, o) =>
            class extends n {
                constructor(u, l) {
                    const h = r(u),
                        f = a(h),
                        p = i(h, l, f),
                        d = f ? t(o) : null;
                    super(u, !1, p, d),
                        (this._isNodeOfNativeOfflineAudioContext = f),
                        (this._nativeAudioDestinationNode = p);
                }
                get channelCount() {
                    return this._nativeAudioDestinationNode.channelCount;
                }
                set channelCount(u) {
                    if (this._isNodeOfNativeOfflineAudioContext) throw s();
                    if (u > this._nativeAudioDestinationNode.maxChannelCount) throw e();
                    this._nativeAudioDestinationNode.channelCount = u;
                }
                get channelCountMode() {
                    return this._nativeAudioDestinationNode.channelCountMode;
                }
                set channelCountMode(u) {
                    if (this._isNodeOfNativeOfflineAudioContext) throw s();
                    this._nativeAudioDestinationNode.channelCountMode = u;
                }
                get maxChannelCount() {
                    return this._nativeAudioDestinationNode.maxChannelCount;
                }
            },
        Hu = (n) => {
            const t = new WeakMap(),
                e = async (s, i) => {
                    const r = i.destination;
                    return t.set(i, r), await n(s, i, r), r;
                };
            return {
                render(s, i) {
                    const r = t.get(i);
                    return r !== void 0 ? Promise.resolve(r) : e(s, i);
                },
            };
        },
        $u = (n, t, e, s, i, r, a, o) => (c, u) => {
            const l = u.listener,
                h = () => {
                    const _ = new Float32Array(1),
                        N = t(u, {
                            channelCount: 1,
                            channelCountMode: 'explicit',
                            channelInterpretation: 'speakers',
                            numberOfInputs: 9,
                        }),
                        T = a(u);
                    let M = !1,
                        j = [0, 0, -1, 0, 1, 0],
                        x = [0, 0, 0];
                    const I = () => {
                            if (M) return;
                            M = !0;
                            const E = s(u, 256, 9, 0);
                            (E.onaudioprocess = ({ inputBuffer: z }) => {
                                const O = [
                                    r(z, _, 0),
                                    r(z, _, 1),
                                    r(z, _, 2),
                                    r(z, _, 3),
                                    r(z, _, 4),
                                    r(z, _, 5),
                                ];
                                O.some((P, B) => P !== j[B]) && (l.setOrientation(...O), (j = O));
                                const Y = [r(z, _, 6), r(z, _, 7), r(z, _, 8)];
                                Y.some((P, B) => P !== x[B]) && (l.setPosition(...Y), (x = Y));
                            }),
                                N.connect(E);
                        },
                        A = (E) => (z) => {
                            z !== j[E] && ((j[E] = z), l.setOrientation(...j));
                        },
                        C = (E) => (z) => {
                            z !== x[E] && ((x[E] = z), l.setPosition(...x));
                        },
                        D = (E, z, O) => {
                            const Y = e(u, {
                                channelCount: 1,
                                channelCountMode: 'explicit',
                                channelInterpretation: 'discrete',
                                offset: z,
                            });
                            Y.connect(N, 0, E),
                                Y.start(),
                                Object.defineProperty(Y.offset, 'defaultValue', {
                                    get() {
                                        return z;
                                    },
                                });
                            const P = n({ context: c }, T, Y.offset, kt, Vt);
                            return (
                                o(
                                    P,
                                    'value',
                                    (B) => () => B.call(P),
                                    (B) => (Z) => {
                                        try {
                                            B.call(P, Z);
                                        } catch (it) {
                                            if (it.code !== 9) throw it;
                                        }
                                        I(), T && O(Z);
                                    }
                                ),
                                (P.cancelAndHoldAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.cancelAndHoldAtTime)),
                                (P.cancelScheduledValues = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.cancelScheduledValues)),
                                (P.exponentialRampToValueAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.exponentialRampToValueAtTime)),
                                (P.linearRampToValueAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.linearRampToValueAtTime)),
                                (P.setTargetAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.setTargetAtTime)),
                                (P.setValueAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.setValueAtTime)),
                                (P.setValueCurveAtTime = ((B) =>
                                    T
                                        ? () => {
                                              throw i();
                                          }
                                        : (...Z) => {
                                              const it = B.apply(P, Z);
                                              return I(), it;
                                          })(P.setValueCurveAtTime)),
                                P
                            );
                        };
                    return {
                        forwardX: D(0, 0, A(0)),
                        forwardY: D(1, 0, A(1)),
                        forwardZ: D(2, -1, A(2)),
                        positionX: D(6, 0, C(0)),
                        positionY: D(7, 0, C(1)),
                        positionZ: D(8, 0, C(2)),
                        upX: D(3, 0, A(3)),
                        upY: D(4, 1, A(4)),
                        upZ: D(5, 0, A(5)),
                    };
                },
                {
                    forwardX: f,
                    forwardY: p,
                    forwardZ: d,
                    positionX: m,
                    positionY: g,
                    positionZ: y,
                    upX: S,
                    upY: v,
                    upZ: w,
                } = l.forwardX === void 0 ? h() : l;
            return {
                get forwardX() {
                    return f;
                },
                get forwardY() {
                    return p;
                },
                get forwardZ() {
                    return d;
                },
                get positionX() {
                    return m;
                },
                get positionY() {
                    return g;
                },
                get positionZ() {
                    return y;
                },
                get upX() {
                    return S;
                },
                get upY() {
                    return v;
                },
                get upZ() {
                    return w;
                },
            };
        },
        Gs = (n) => 'context' in n,
        Kn = (n) => Gs(n[0]),
        Je = (n, t, e, s) => {
            for (const i of n)
                if (e(i)) {
                    if (s) return !1;
                    throw Error('The set contains at least one similar element.');
                }
            return n.add(t), !0;
        },
        Uo = (n, t, [e, s], i) => {
            Je(n, [t, e, s], (r) => r[0] === t && r[1] === e, i);
        },
        Vo = (n, [t, e, s], i) => {
            const r = n.get(t);
            r === void 0 ? n.set(t, new Set([[e, s]])) : Je(r, [e, s], (a) => a[0] === e, i);
        },
        In = (n) => 'inputs' in n,
        Bs = (n, t, e, s) => {
            if (In(t)) {
                const i = t.inputs[s];
                return n.connect(i, e, 0), [i, e, 0];
            }
            return n.connect(t, e, s), [t, e, s];
        },
        Wo = (n, t, e) => {
            for (const s of n) if (s[0] === t && s[1] === e) return n.delete(s), s;
            return null;
        },
        qu = (n, t, e) => Ws(n, (s) => s[0] === t && s[1] === e),
        Fo = (n, t) => {
            if (!qn(n).delete(t)) throw new Error('Missing the expected event listener.');
        },
        Go = (n, t, e) => {
            const s = se(n, t),
                i = Ws(s, (r) => r[0] === e);
            return s.size === 0 && n.delete(t), i;
        },
        Qs = (n, t, e, s) => {
            In(t) ? n.disconnect(t.inputs[s], e, 0) : n.disconnect(t, e, s);
        },
        ct = (n) => se(qi, n),
        ts = (n) => se(Xi, n),
        Ke = (n) => Ji.has(n),
        Zs = (n) => !Tn.has(n),
        Bo = (n, t) =>
            new Promise((e) => {
                if (t !== null) e(!0);
                else {
                    const s = n.createScriptProcessor(256, 1, 1),
                        i = n.createGain(),
                        r = n.createBuffer(1, 2, 44100),
                        a = r.getChannelData(0);
                    (a[0] = 1), (a[1] = 1);
                    const o = n.createBufferSource();
                    (o.buffer = r),
                        (o.loop = !0),
                        o.connect(s).connect(n.destination),
                        o.connect(i),
                        o.disconnect(i),
                        (s.onaudioprocess = (c) => {
                            const u = c.inputBuffer.getChannelData(0);
                            Array.prototype.some.call(u, (l) => l === 1) ? e(!0) : e(!1),
                                o.stop(),
                                (s.onaudioprocess = null),
                                o.disconnect(s),
                                s.disconnect(n.destination);
                        }),
                        o.start();
                }
            }),
        ir = (n, t) => {
            const e = new Map();
            for (const s of n)
                for (const i of s) {
                    const r = e.get(i);
                    e.set(i, r === void 0 ? 1 : r + 1);
                }
            e.forEach((s, i) => t(i, s));
        },
        Hs = (n) => 'context' in n,
        Xu = (n) => {
            const t = new Map();
            (n.connect = ((e) => (s, i = 0, r = 0) => {
                const a = Hs(s) ? e(s, i, r) : e(s, i),
                    o = t.get(s);
                return (
                    o === void 0
                        ? t.set(s, [{ input: r, output: i }])
                        : o.every((c) => c.input !== r || c.output !== i) &&
                          o.push({ input: r, output: i }),
                    a
                );
            })(n.connect.bind(n))),
                (n.disconnect = ((e) => (s, i, r) => {
                    if ((e.apply(n), s === void 0)) t.clear();
                    else if (typeof s == 'number')
                        for (const [a, o] of t) {
                            const c = o.filter((u) => u.output !== s);
                            c.length === 0 ? t.delete(a) : t.set(a, c);
                        }
                    else if (t.has(s))
                        if (i === void 0) t.delete(s);
                        else {
                            const a = t.get(s);
                            if (a !== void 0) {
                                const o = a.filter(
                                    (c) => c.output !== i && (c.input !== r || r === void 0)
                                );
                                o.length === 0 ? t.delete(s) : t.set(s, o);
                            }
                        }
                    for (const [a, o] of t)
                        o.forEach((c) => {
                            Hs(a) ? n.connect(a, c.output, c.input) : n.connect(a, c.output);
                        });
                })(n.disconnect));
        },
        Ju = (n, t, e, s) => {
            const { activeInputs: i, passiveInputs: r } = Jn(t),
                { outputs: a } = zt(n),
                o = qn(n),
                c = (u) => {
                    const l = ct(n),
                        h = ts(t);
                    if (u) {
                        const f = Go(r, n, e);
                        Uo(i, n, f, !1), !s && !Ke(n) && l.connect(h, e);
                    } else {
                        const f = qu(i, n, e);
                        Vo(r, f, !1), !s && !Ke(n) && l.disconnect(h, e);
                    }
                };
            return Je(a, [t, e], (u) => u[0] === t && u[1] === e, !0)
                ? (o.add(c), Se(n) ? Uo(i, n, [e, c], !0) : Vo(r, [n, e, c], !0), !0)
                : !1;
        },
        Ku = (n, t, e, s) => {
            const { activeInputs: i, passiveInputs: r } = zt(t),
                a = Wo(i[s], n, e);
            return a === null ? [Po(r, n, e, s)[2], !1] : [a[2], !0];
        },
        tl = (n, t, e) => {
            const { activeInputs: s, passiveInputs: i } = Jn(t),
                r = Wo(s, n, e);
            return r === null ? [Go(i, n, e)[1], !1] : [r[2], !0];
        },
        rr = (n, t, e, s, i) => {
            const [r, a] = Ku(n, e, s, i);
            if ((r !== null && (Fo(n, r), a && !t && !Ke(n) && Qs(ct(n), ct(e), s, i)), Se(e))) {
                const { activeInputs: o } = zt(e);
                er(e, o);
            }
        },
        or = (n, t, e, s) => {
            const [i, r] = tl(n, e, s);
            i !== null && (Fo(n, i), r && !t && !Ke(n) && ct(n).disconnect(ts(e), s));
        },
        el = (n, t) => {
            const e = zt(n),
                s = [];
            for (const i of e.outputs) Kn(i) ? rr(n, t, ...i) : or(n, t, ...i), s.push(i[0]);
            return e.outputs.clear(), s;
        },
        nl = (n, t, e) => {
            const s = zt(n),
                i = [];
            for (const r of s.outputs)
                r[1] === e &&
                    (Kn(r) ? rr(n, t, ...r) : or(n, t, ...r), i.push(r[0]), s.outputs.delete(r));
            return i;
        },
        sl = (n, t, e, s, i) => {
            const r = zt(n);
            return Array.from(r.outputs)
                .filter(
                    (a) =>
                        a[0] === e && (s === void 0 || a[1] === s) && (i === void 0 || a[2] === i)
                )
                .map((a) => (Kn(a) ? rr(n, t, ...a) : or(n, t, ...a), r.outputs.delete(a), a[0]));
        },
        il = (n, t, e, s, i, r, a, o, c, u, l, h, f, p, d, m) =>
            class extends u {
                constructor(y, S, v, w) {
                    super(v), (this._context = y), (this._nativeAudioNode = v);
                    const _ = l(y);
                    h(_) && e(Bo, () => Bo(_, m)) !== !0 && Xu(v),
                        qi.set(this, v),
                        bo.set(this, new Set()),
                        y.state !== 'closed' && S && Nn(this),
                        n(this, w, v);
                }
                get channelCount() {
                    return this._nativeAudioNode.channelCount;
                }
                set channelCount(y) {
                    this._nativeAudioNode.channelCount = y;
                }
                get channelCountMode() {
                    return this._nativeAudioNode.channelCountMode;
                }
                set channelCountMode(y) {
                    this._nativeAudioNode.channelCountMode = y;
                }
                get channelInterpretation() {
                    return this._nativeAudioNode.channelInterpretation;
                }
                set channelInterpretation(y) {
                    this._nativeAudioNode.channelInterpretation = y;
                }
                get context() {
                    return this._context;
                }
                get numberOfInputs() {
                    return this._nativeAudioNode.numberOfInputs;
                }
                get numberOfOutputs() {
                    return this._nativeAudioNode.numberOfOutputs;
                }
                connect(y, S = 0, v = 0) {
                    if (S < 0 || S >= this._nativeAudioNode.numberOfOutputs) throw i();
                    const w = l(this._context),
                        _ = d(w);
                    if (f(y) || p(y)) throw r();
                    if (Gs(y)) {
                        const M = ct(y);
                        try {
                            const x = Bs(this._nativeAudioNode, M, S, v),
                                I = Zs(this);
                            (_ || I) && this._nativeAudioNode.disconnect(...x),
                                this.context.state !== 'closed' && !I && Zs(y) && Nn(y);
                        } catch (x) {
                            throw x.code === 12 ? r() : x;
                        }
                        if (t(this, y, S, v, _)) {
                            const x = c([this], y);
                            ir(x, s(_));
                        }
                        return y;
                    }
                    const N = ts(y);
                    if (N.name === 'playbackRate' && N.maxValue === 1024) throw a();
                    try {
                        this._nativeAudioNode.connect(N, S),
                            (_ || Zs(this)) && this._nativeAudioNode.disconnect(N, S);
                    } catch (M) {
                        throw M.code === 12 ? r() : M;
                    }
                    if (Ju(this, y, S, _)) {
                        const M = c([this], y);
                        ir(M, s(_));
                    }
                }
                disconnect(y, S, v) {
                    let w;
                    const _ = l(this._context),
                        N = d(_);
                    if (y === void 0) w = el(this, N);
                    else if (typeof y == 'number') {
                        if (y < 0 || y >= this.numberOfOutputs) throw i();
                        w = nl(this, N, y);
                    } else {
                        if (
                            (S !== void 0 && (S < 0 || S >= this.numberOfOutputs)) ||
                            (Gs(y) && v !== void 0 && (v < 0 || v >= y.numberOfInputs))
                        )
                            throw i();
                        if (((w = sl(this, N, y, S, v)), w.length === 0)) throw r();
                    }
                    for (const T of w) {
                        const M = c([this], T);
                        ir(M, o);
                    }
                }
            },
        rl = (n, t, e, s, i, r, a, o, c, u, l, h, f) => (p, d, m, g = null, y = null) => {
            const S = m.value,
                v = new mu(S),
                w = d ? s(v) : null,
                _ = {
                    get defaultValue() {
                        return S;
                    },
                    get maxValue() {
                        return g === null ? m.maxValue : g;
                    },
                    get minValue() {
                        return y === null ? m.minValue : y;
                    },
                    get value() {
                        return m.value;
                    },
                    set value(N) {
                        (m.value = N), _.setValueAtTime(N, p.context.currentTime);
                    },
                    cancelAndHoldAtTime(N) {
                        if (typeof m.cancelAndHoldAtTime == 'function')
                            w === null && v.flush(p.context.currentTime),
                                v.add(i(N)),
                                m.cancelAndHoldAtTime(N);
                        else {
                            const T = Array.from(v).pop();
                            w === null && v.flush(p.context.currentTime), v.add(i(N));
                            const M = Array.from(v).pop();
                            m.cancelScheduledValues(N),
                                T !== M &&
                                    M !== void 0 &&
                                    (M.type === 'exponentialRampToValue'
                                        ? m.exponentialRampToValueAtTime(M.value, M.endTime)
                                        : M.type === 'linearRampToValue'
                                        ? m.linearRampToValueAtTime(M.value, M.endTime)
                                        : M.type === 'setValue'
                                        ? m.setValueAtTime(M.value, M.startTime)
                                        : M.type === 'setValueCurve' &&
                                          m.setValueCurveAtTime(M.values, M.startTime, M.duration));
                        }
                        return _;
                    },
                    cancelScheduledValues(N) {
                        return (
                            w === null && v.flush(p.context.currentTime),
                            v.add(r(N)),
                            m.cancelScheduledValues(N),
                            _
                        );
                    },
                    exponentialRampToValueAtTime(N, T) {
                        if (N === 0) throw new RangeError();
                        if (!Number.isFinite(T) || T < 0) throw new RangeError();
                        const M = p.context.currentTime;
                        return (
                            w === null && v.flush(M),
                            Array.from(v).length === 0 && (v.add(u(S, M)), m.setValueAtTime(S, M)),
                            v.add(a(N, T)),
                            m.exponentialRampToValueAtTime(N, T),
                            _
                        );
                    },
                    linearRampToValueAtTime(N, T) {
                        const M = p.context.currentTime;
                        return (
                            w === null && v.flush(M),
                            Array.from(v).length === 0 && (v.add(u(S, M)), m.setValueAtTime(S, M)),
                            v.add(o(N, T)),
                            m.linearRampToValueAtTime(N, T),
                            _
                        );
                    },
                    setTargetAtTime(N, T, M) {
                        return (
                            w === null && v.flush(p.context.currentTime),
                            v.add(c(N, T, M)),
                            m.setTargetAtTime(N, T, M),
                            _
                        );
                    },
                    setValueAtTime(N, T) {
                        return (
                            w === null && v.flush(p.context.currentTime),
                            v.add(u(N, T)),
                            m.setValueAtTime(N, T),
                            _
                        );
                    },
                    setValueCurveAtTime(N, T, M) {
                        const j = N instanceof Float32Array ? N : new Float32Array(N);
                        if (h !== null && h.name === 'webkitAudioContext') {
                            const x = T + M,
                                I = p.context.sampleRate,
                                A = Math.ceil(T * I),
                                C = Math.floor(x * I),
                                D = C - A,
                                E = new Float32Array(D);
                            for (let O = 0; O < D; O += 1) {
                                const Y = ((j.length - 1) / M) * ((A + O) / I - T),
                                    P = Math.floor(Y),
                                    B = Math.ceil(Y);
                                E[O] = P === B ? j[P] : (1 - (Y - P)) * j[P] + (1 - (B - Y)) * j[B];
                            }
                            w === null && v.flush(p.context.currentTime),
                                v.add(l(E, T, M)),
                                m.setValueCurveAtTime(E, T, M);
                            const z = C / I;
                            z < x && f(_, E[E.length - 1], z), f(_, j[j.length - 1], x);
                        } else
                            w === null && v.flush(p.context.currentTime),
                                v.add(l(j, T, M)),
                                m.setValueCurveAtTime(j, T, M);
                        return _;
                    },
                };
            return e.set(_, m), t.set(_, p), n(_, w), _;
        },
        ol = (n) => ({
            replay(t) {
                for (const e of n)
                    if (e.type === 'exponentialRampToValue') {
                        const { endTime: s, value: i } = e;
                        t.exponentialRampToValueAtTime(i, s);
                    } else if (e.type === 'linearRampToValue') {
                        const { endTime: s, value: i } = e;
                        t.linearRampToValueAtTime(i, s);
                    } else if (e.type === 'setTarget') {
                        const { startTime: s, target: i, timeConstant: r } = e;
                        t.setTargetAtTime(i, s, r);
                    } else if (e.type === 'setValue') {
                        const { startTime: s, value: i } = e;
                        t.setValueAtTime(i, s);
                    } else if (e.type === 'setValueCurve') {
                        const { duration: s, startTime: i, values: r } = e;
                        t.setValueCurveAtTime(r, i, s);
                    } else throw new Error("Can't apply an unknown automation.");
            },
        });
    class Qo {
        constructor(t) {
            this._map = new Map(t);
        }
        get size() {
            return this._map.size;
        }
        entries() {
            return this._map.entries();
        }
        forEach(t, e = null) {
            return this._map.forEach((s, i) => t.call(e, s, i, this));
        }
        get(t) {
            return this._map.get(t);
        }
        has(t) {
            return this._map.has(t);
        }
        keys() {
            return this._map.keys();
        }
        values() {
            return this._map.values();
        }
    }
    const al = {
            channelCount: 2,
            channelCountMode: 'explicit',
            channelInterpretation: 'speakers',
            numberOfInputs: 1,
            numberOfOutputs: 1,
            parameterData: {},
            processorOptions: {},
        },
        cl = (n, t, e, s, i, r, a, o, c, u, l, h, f, p) =>
            class extends t {
                constructor(m, g, y) {
                    var S;
                    const v = o(m),
                        w = c(v),
                        _ = l({ ...al, ...y });
                    f(_);
                    const N = Ki.get(v),
                        T = N == null ? void 0 : N.get(g),
                        M =
                            w || v.state !== 'closed'
                                ? v
                                : (S = a(v)) !== null && S !== void 0
                                ? S
                                : v,
                        j = i(M, w ? null : m.baseLatency, u, g, T, _),
                        x = w ? s(g, _, T) : null;
                    super(m, !0, j, x);
                    const I = [];
                    j.parameters.forEach((C, D) => {
                        const E = e(this, w, C);
                        I.push([D, E]);
                    }),
                        (this._nativeAudioWorkletNode = j),
                        (this._onprocessorerror = null),
                        (this._parameters = new Qo(I)),
                        w && n(v, this);
                    const { activeInputs: A } = r(this);
                    h(j, A);
                }
                get onprocessorerror() {
                    return this._onprocessorerror;
                }
                set onprocessorerror(m) {
                    const g = typeof m == 'function' ? p(this, m) : null;
                    this._nativeAudioWorkletNode.onprocessorerror = g;
                    const y = this._nativeAudioWorkletNode.onprocessorerror;
                    this._onprocessorerror = y !== null && y === g ? m : y;
                }
                get parameters() {
                    return this._parameters === null
                        ? this._nativeAudioWorkletNode.parameters
                        : this._parameters;
                }
                get port() {
                    return this._nativeAudioWorkletNode.port;
                }
            };
    function $s(n, t, e, s, i) {
        if (typeof n.copyFromChannel == 'function')
            t[e].byteLength === 0 && (t[e] = new Float32Array(128)), n.copyFromChannel(t[e], s, i);
        else {
            const r = n.getChannelData(s);
            if (t[e].byteLength === 0) t[e] = r.slice(i, i + 128);
            else {
                const a = new Float32Array(r.buffer, i * Float32Array.BYTES_PER_ELEMENT, 128);
                t[e].set(a);
            }
        }
    }
    const Zo = (n, t, e, s, i) => {
            typeof n.copyToChannel == 'function'
                ? t[e].byteLength !== 0 && n.copyToChannel(t[e], s, i)
                : t[e].byteLength !== 0 && n.getChannelData(s).set(t[e], i);
        },
        qs = (n, t) => {
            const e = [];
            for (let s = 0; s < n; s += 1) {
                const i = [],
                    r = typeof t == 'number' ? t : t[s];
                for (let a = 0; a < r; a += 1) i.push(new Float32Array(128));
                e.push(i);
            }
            return e;
        },
        ul = (n, t) => {
            const e = se(tr, n),
                s = ct(t);
            return se(e, s);
        },
        ll = async (n, t, e, s, i, r, a) => {
            const o = t === null ? Math.ceil(n.context.length / 128) * 128 : t.length,
                c = s.channelCount * s.numberOfInputs,
                u = i.reduce((g, y) => g + y, 0),
                l = u === 0 ? null : e.createBuffer(u, o, e.sampleRate);
            if (r === void 0) throw new Error('Missing the processor constructor.');
            const h = zt(n),
                f = await ul(e, n),
                p = qs(s.numberOfInputs, s.channelCount),
                d = qs(s.numberOfOutputs, i),
                m = Array.from(n.parameters.keys()).reduce(
                    (g, y) => ({ ...g, [y]: new Float32Array(128) }),
                    {}
                );
            for (let g = 0; g < o; g += 128) {
                if (s.numberOfInputs > 0 && t !== null)
                    for (let y = 0; y < s.numberOfInputs; y += 1)
                        for (let S = 0; S < s.channelCount; S += 1) $s(t, p[y], S, S, g);
                r.parameterDescriptors !== void 0 &&
                    t !== null &&
                    r.parameterDescriptors.forEach(({ name: y }, S) => {
                        $s(t, m, y, c + S, g);
                    });
                for (let y = 0; y < s.numberOfInputs; y += 1)
                    for (let S = 0; S < i[y]; S += 1)
                        d[y][S].byteLength === 0 && (d[y][S] = new Float32Array(128));
                try {
                    const y = p.map((v, w) => (h.activeInputs[w].size === 0 ? [] : v)),
                        S = a(g / e.sampleRate, e.sampleRate, () => f.process(y, d, m));
                    if (l !== null)
                        for (let v = 0, w = 0; v < s.numberOfOutputs; v += 1) {
                            for (let _ = 0; _ < i[v]; _ += 1) Zo(l, d[v], _, w + _, g);
                            w += i[v];
                        }
                    if (!S) break;
                } catch (y) {
                    n.dispatchEvent(
                        new ErrorEvent('processorerror', {
                            colno: y.colno,
                            filename: y.filename,
                            lineno: y.lineno,
                            message: y.message,
                        })
                    );
                    break;
                }
            }
            return l;
        },
        hl = (n, t, e, s, i, r, a, o, c, u, l, h, f, p, d, m) => (g, y, S) => {
            const v = new WeakMap();
            let w = null;
            const _ = async (N, T) => {
                let M = l(N),
                    j = null;
                const x = Ct(M, T),
                    I = Array.isArray(y.outputChannelCount)
                        ? y.outputChannelCount
                        : Array.from(y.outputChannelCount);
                if (h === null) {
                    const A = I.reduce((z, O) => z + O, 0),
                        C = i(T, {
                            channelCount: Math.max(1, A),
                            channelCountMode: 'explicit',
                            channelInterpretation: 'discrete',
                            numberOfOutputs: Math.max(1, A),
                        }),
                        D = [];
                    for (let z = 0; z < N.numberOfOutputs; z += 1)
                        D.push(
                            s(T, {
                                channelCount: 1,
                                channelCountMode: 'explicit',
                                channelInterpretation: 'speakers',
                                numberOfInputs: I[z],
                            })
                        );
                    const E = a(T, {
                        channelCount: y.channelCount,
                        channelCountMode: y.channelCountMode,
                        channelInterpretation: y.channelInterpretation,
                        gain: 1,
                    });
                    (E.connect = t.bind(null, D)),
                        (E.disconnect = c.bind(null, D)),
                        (j = [C, D, E]);
                } else x || (M = new h(T, g));
                if ((v.set(T, j === null ? M : j[2]), j !== null)) {
                    if (w === null) {
                        if (S === void 0) throw new Error('Missing the processor constructor.');
                        if (f === null)
                            throw new Error('Missing the native OfflineAudioContext constructor.');
                        const O = N.channelCount * N.numberOfInputs,
                            Y =
                                S.parameterDescriptors === void 0
                                    ? 0
                                    : S.parameterDescriptors.length,
                            P = O + Y;
                        w = ll(
                            N,
                            P === 0
                                ? null
                                : await (async () => {
                                      const Z = new f(
                                              P,
                                              Math.ceil(N.context.length / 128) * 128,
                                              T.sampleRate
                                          ),
                                          it = [],
                                          qt = [];
                                      for (let dt = 0; dt < y.numberOfInputs; dt += 1)
                                          it.push(
                                              a(Z, {
                                                  channelCount: y.channelCount,
                                                  channelCountMode: y.channelCountMode,
                                                  channelInterpretation: y.channelInterpretation,
                                                  gain: 1,
                                              })
                                          ),
                                              qt.push(
                                                  i(Z, {
                                                      channelCount: y.channelCount,
                                                      channelCountMode: 'explicit',
                                                      channelInterpretation: 'discrete',
                                                      numberOfOutputs: y.channelCount,
                                                  })
                                              );
                                      const Xt = await Promise.all(
                                              Array.from(N.parameters.values()).map(async (dt) => {
                                                  const Ut = r(Z, {
                                                      channelCount: 1,
                                                      channelCountMode: 'explicit',
                                                      channelInterpretation: 'discrete',
                                                      offset: dt.value,
                                                  });
                                                  return await p(Z, dt, Ut.offset), Ut;
                                              })
                                          ),
                                          q = s(Z, {
                                              channelCount: 1,
                                              channelCountMode: 'explicit',
                                              channelInterpretation: 'speakers',
                                              numberOfInputs: Math.max(1, O + Y),
                                          });
                                      for (let dt = 0; dt < y.numberOfInputs; dt += 1) {
                                          it[dt].connect(qt[dt]);
                                          for (let Ut = 0; Ut < y.channelCount; Ut += 1)
                                              qt[dt].connect(q, Ut, dt * y.channelCount + Ut);
                                      }
                                      for (const [dt, Ut] of Xt.entries())
                                          Ut.connect(q, 0, O + dt), Ut.start(0);
                                      return (
                                          q.connect(Z.destination),
                                          await Promise.all(it.map((dt) => d(N, Z, dt))),
                                          m(Z)
                                      );
                                  })(),
                            T,
                            y,
                            I,
                            S,
                            u
                        );
                    }
                    const A = await w,
                        C = e(T, {
                            buffer: null,
                            channelCount: 2,
                            channelCountMode: 'max',
                            channelInterpretation: 'speakers',
                            loop: !1,
                            loopEnd: 0,
                            loopStart: 0,
                            playbackRate: 1,
                        }),
                        [D, E, z] = j;
                    A !== null && ((C.buffer = A), C.start(0)), C.connect(D);
                    for (let O = 0, Y = 0; O < N.numberOfOutputs; O += 1) {
                        const P = E[O];
                        for (let B = 0; B < I[O]; B += 1) D.connect(P, Y + B, B);
                        Y += I[O];
                    }
                    return z;
                }
                if (x)
                    for (const [A, C] of N.parameters.entries()) await n(T, C, M.parameters.get(A));
                else
                    for (const [A, C] of N.parameters.entries()) await p(T, C, M.parameters.get(A));
                return await d(N, T, M), M;
            };
            return {
                render(N, T) {
                    o(T, N);
                    const M = v.get(T);
                    return M !== void 0 ? Promise.resolve(M) : _(N, T);
                },
            };
        },
        dl = (n, t, e, s, i, r, a, o, c, u, l, h, f, p, d, m, g, y, S, v) =>
            class extends d {
                constructor(_, N) {
                    super(_, N),
                        (this._nativeContext = _),
                        (this._audioWorklet =
                            n === void 0 ? void 0 : { addModule: (T, M) => n(this, T, M) });
                }
                get audioWorklet() {
                    return this._audioWorklet;
                }
                createAnalyser() {
                    return new t(this);
                }
                createBiquadFilter() {
                    return new i(this);
                }
                createBuffer(_, N, T) {
                    return new e({ length: N, numberOfChannels: _, sampleRate: T });
                }
                createBufferSource() {
                    return new s(this);
                }
                createChannelMerger(_ = 6) {
                    return new r(this, { numberOfInputs: _ });
                }
                createChannelSplitter(_ = 6) {
                    return new a(this, { numberOfOutputs: _ });
                }
                createConstantSource() {
                    return new o(this);
                }
                createConvolver() {
                    return new c(this);
                }
                createDelay(_ = 1) {
                    return new l(this, { maxDelayTime: _ });
                }
                createDynamicsCompressor() {
                    return new h(this);
                }
                createGain() {
                    return new f(this);
                }
                createIIRFilter(_, N) {
                    return new p(this, { feedback: N, feedforward: _ });
                }
                createOscillator() {
                    return new m(this);
                }
                createPanner() {
                    return new g(this);
                }
                createPeriodicWave(_, N, T = { disableNormalization: !1 }) {
                    return new y(this, { ...T, imag: N, real: _ });
                }
                createStereoPanner() {
                    return new S(this);
                }
                createWaveShaper() {
                    return new v(this);
                }
                decodeAudioData(_, N, T) {
                    return u(this._nativeContext, _).then(
                        (M) => (typeof N == 'function' && N(M), M),
                        (M) => {
                            throw (typeof T == 'function' && T(M), M);
                        }
                    );
                }
            },
        fl = {
            Q: 1,
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            detune: 0,
            frequency: 350,
            gain: 0,
            type: 'lowpass',
        },
        pl = (n, t, e, s, i, r, a, o) =>
            class extends n {
                constructor(u, l) {
                    const h = r(u),
                        f = { ...fl, ...l },
                        p = i(h, f),
                        d = a(h),
                        m = d ? e() : null;
                    super(u, !1, p, m),
                        (this._Q = t(this, d, p.Q, kt, Vt)),
                        (this._detune = t(
                            this,
                            d,
                            p.detune,
                            1200 * Math.log2(kt),
                            -1200 * Math.log2(kt)
                        )),
                        (this._frequency = t(this, d, p.frequency, u.sampleRate / 2, 0)),
                        (this._gain = t(this, d, p.gain, 40 * Math.log10(kt), Vt)),
                        (this._nativeBiquadFilterNode = p),
                        o(this, 1);
                }
                get detune() {
                    return this._detune;
                }
                get frequency() {
                    return this._frequency;
                }
                get gain() {
                    return this._gain;
                }
                get Q() {
                    return this._Q;
                }
                get type() {
                    return this._nativeBiquadFilterNode.type;
                }
                set type(u) {
                    this._nativeBiquadFilterNode.type = u;
                }
                getFrequencyResponse(u, l, h) {
                    try {
                        this._nativeBiquadFilterNode.getFrequencyResponse(u, l, h);
                    } catch (f) {
                        throw f.code === 11 ? s() : f;
                    }
                    if (u.length !== l.length || l.length !== h.length) throw s();
                }
            },
        ml = (n, t, e, s, i) => () => {
            const r = new WeakMap(),
                a = async (o, c) => {
                    let u = e(o);
                    const l = Ct(u, c);
                    if (!l) {
                        const h = {
                            Q: u.Q.value,
                            channelCount: u.channelCount,
                            channelCountMode: u.channelCountMode,
                            channelInterpretation: u.channelInterpretation,
                            detune: u.detune.value,
                            frequency: u.frequency.value,
                            gain: u.gain.value,
                            type: u.type,
                        };
                        u = t(c, h);
                    }
                    return (
                        r.set(c, u),
                        l
                            ? (await n(c, o.Q, u.Q),
                              await n(c, o.detune, u.detune),
                              await n(c, o.frequency, u.frequency),
                              await n(c, o.gain, u.gain))
                            : (await s(c, o.Q, u.Q),
                              await s(c, o.detune, u.detune),
                              await s(c, o.frequency, u.frequency),
                              await s(c, o.gain, u.gain)),
                        await i(o, c, u),
                        u
                    );
                };
            return {
                render(o, c) {
                    const u = r.get(c);
                    return u !== void 0 ? Promise.resolve(u) : a(o, c);
                },
            };
        },
        gl = (n, t) => (e, s) => {
            const i = t.get(e);
            if (i !== void 0) return i;
            const r = n.get(e);
            if (r !== void 0) return r;
            try {
                const a = s();
                return a instanceof Promise
                    ? (n.set(e, a), a.catch(() => !1).then((o) => (n.delete(e), t.set(e, o), o)))
                    : (t.set(e, a), a);
            } catch {
                return t.set(e, !1), !1;
            }
        },
        Ml = {
            channelCount: 1,
            channelCountMode: 'explicit',
            channelInterpretation: 'speakers',
            numberOfInputs: 6,
        },
        yl = (n, t, e, s, i) =>
            class extends n {
                constructor(a, o) {
                    const c = s(a),
                        u = { ...Ml, ...o },
                        l = e(c, u),
                        h = i(c) ? t() : null;
                    super(a, !1, l, h);
                }
            },
        _l = (n, t, e) => () => {
            const s = new WeakMap(),
                i = async (r, a) => {
                    let o = t(r);
                    if (!Ct(o, a)) {
                        const u = {
                            channelCount: o.channelCount,
                            channelCountMode: o.channelCountMode,
                            channelInterpretation: o.channelInterpretation,
                            numberOfInputs: o.numberOfInputs,
                        };
                        o = n(a, u);
                    }
                    return s.set(a, o), await e(r, a, o), o;
                };
            return {
                render(r, a) {
                    const o = s.get(a);
                    return o !== void 0 ? Promise.resolve(o) : i(r, a);
                },
            };
        },
        Tl = {
            channelCount: 6,
            channelCountMode: 'explicit',
            channelInterpretation: 'discrete',
            numberOfOutputs: 6,
        },
        Nl = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = s(o),
                        l = r({ ...Tl, ...c }),
                        h = e(u, l),
                        f = i(u) ? t() : null;
                    super(o, !1, h, f);
                }
            },
        Il = (n, t, e) => () => {
            const s = new WeakMap(),
                i = async (r, a) => {
                    let o = t(r);
                    if (!Ct(o, a)) {
                        const u = {
                            channelCount: o.channelCount,
                            channelCountMode: o.channelCountMode,
                            channelInterpretation: o.channelInterpretation,
                            numberOfOutputs: o.numberOfOutputs,
                        };
                        o = n(a, u);
                    }
                    return s.set(a, o), await e(r, a, o), o;
                };
            return {
                render(r, a) {
                    const o = s.get(a);
                    return o !== void 0 ? Promise.resolve(o) : i(r, a);
                },
            };
        },
        Sl = (n) => (t, e, s) => n(e, t, s),
        jl = (n) => (t, e, s = 0, i = 0) => {
            const r = t[s];
            if (r === void 0) throw n();
            return Hs(e) ? r.connect(e, 0, i) : r.connect(e, 0);
        },
        Al = (n) => (t, e) => {
            const s = n(t, {
                    buffer: null,
                    channelCount: 2,
                    channelCountMode: 'max',
                    channelInterpretation: 'speakers',
                    loop: !1,
                    loopEnd: 0,
                    loopStart: 0,
                    playbackRate: 1,
                }),
                i = t.createBuffer(1, 2, 44100);
            return (
                (s.buffer = i),
                (s.loop = !0),
                s.connect(e),
                s.start(),
                () => {
                    s.stop(), s.disconnect(e);
                }
            );
        },
        xl = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            offset: 1,
        },
        vl = (n, t, e, s, i, r, a) =>
            class extends n {
                constructor(c, u) {
                    const l = i(c),
                        h = { ...xl, ...u },
                        f = s(l, h),
                        p = r(l),
                        d = p ? e() : null;
                    super(c, !1, f, d),
                        (this._constantSourceNodeRenderer = d),
                        (this._nativeConstantSourceNode = f),
                        (this._offset = t(this, p, f.offset, kt, Vt)),
                        (this._onended = null);
                }
                get offset() {
                    return this._offset;
                }
                get onended() {
                    return this._onended;
                }
                set onended(c) {
                    const u = typeof c == 'function' ? a(this, c) : null;
                    this._nativeConstantSourceNode.onended = u;
                    const l = this._nativeConstantSourceNode.onended;
                    this._onended = l !== null && l === u ? c : l;
                }
                start(c = 0) {
                    if (
                        (this._nativeConstantSourceNode.start(c),
                        this._constantSourceNodeRenderer !== null &&
                            (this._constantSourceNodeRenderer.start = c),
                        this.context.state !== 'closed')
                    ) {
                        Nn(this);
                        const u = () => {
                            this._nativeConstantSourceNode.removeEventListener('ended', u),
                                Se(this) && Xn(this);
                        };
                        this._nativeConstantSourceNode.addEventListener('ended', u);
                    }
                }
                stop(c = 0) {
                    this._nativeConstantSourceNode.stop(c),
                        this._constantSourceNodeRenderer !== null &&
                            (this._constantSourceNodeRenderer.stop = c);
                }
            },
        Ll = (n, t, e, s, i) => () => {
            const r = new WeakMap();
            let a = null,
                o = null;
            const c = async (u, l) => {
                let h = e(u);
                const f = Ct(h, l);
                if (!f) {
                    const p = {
                        channelCount: h.channelCount,
                        channelCountMode: h.channelCountMode,
                        channelInterpretation: h.channelInterpretation,
                        offset: h.offset.value,
                    };
                    (h = t(l, p)), a !== null && h.start(a), o !== null && h.stop(o);
                }
                return (
                    r.set(l, h),
                    f ? await n(l, u.offset, h.offset) : await s(l, u.offset, h.offset),
                    await i(u, l, h),
                    h
                );
            };
            return {
                set start(u) {
                    a = u;
                },
                set stop(u) {
                    o = u;
                },
                render(u, l) {
                    const h = r.get(l);
                    return h !== void 0 ? Promise.resolve(h) : c(u, l);
                },
            };
        },
        wl = (n) => (t) => ((n[0] = t), n[0]),
        Dl = {
            buffer: null,
            channelCount: 2,
            channelCountMode: 'clamped-max',
            channelInterpretation: 'speakers',
            disableNormalization: !1,
        },
        bl = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = s(o),
                        l = { ...Dl, ...c },
                        h = e(u, l),
                        p = i(u) ? t() : null;
                    super(o, !1, h, p),
                        (this._isBufferNullified = !1),
                        (this._nativeConvolverNode = h),
                        l.buffer !== null && r(this, l.buffer.duration);
                }
                get buffer() {
                    return this._isBufferNullified ? null : this._nativeConvolverNode.buffer;
                }
                set buffer(o) {
                    if (
                        ((this._nativeConvolverNode.buffer = o),
                        o === null && this._nativeConvolverNode.buffer !== null)
                    ) {
                        const c = this._nativeConvolverNode.context;
                        (this._nativeConvolverNode.buffer = c.createBuffer(1, 1, c.sampleRate)),
                            (this._isBufferNullified = !0),
                            r(this, 0);
                    } else
                        (this._isBufferNullified = !1),
                            r(
                                this,
                                this._nativeConvolverNode.buffer === null
                                    ? 0
                                    : this._nativeConvolverNode.buffer.duration
                            );
                }
                get normalize() {
                    return this._nativeConvolverNode.normalize;
                }
                set normalize(o) {
                    this._nativeConvolverNode.normalize = o;
                }
            },
        Cl = (n, t, e) => () => {
            const s = new WeakMap(),
                i = async (r, a) => {
                    let o = t(r);
                    if (!Ct(o, a)) {
                        const u = {
                            buffer: o.buffer,
                            channelCount: o.channelCount,
                            channelCountMode: o.channelCountMode,
                            channelInterpretation: o.channelInterpretation,
                            disableNormalization: !o.normalize,
                        };
                        o = n(a, u);
                    }
                    return s.set(a, o), In(o) ? await e(r, a, o.inputs[0]) : await e(r, a, o), o;
                };
            return {
                render(r, a) {
                    const o = s.get(a);
                    return o !== void 0 ? Promise.resolve(o) : i(r, a);
                },
            };
        },
        El = (n, t) => (e, s, i) => {
            if (t === null) throw new Error('Missing the native OfflineAudioContext constructor.');
            try {
                return new t(e, s, i);
            } catch (r) {
                throw r.name === 'SyntaxError' ? n() : r;
            }
        },
        Ol = () => new DOMException('', 'DataCloneError'),
        Ho = (n) => {
            const { port1: t, port2: e } = new MessageChannel();
            return new Promise((s) => {
                const i = () => {
                    (e.onmessage = null), t.close(), e.close(), s();
                };
                e.onmessage = () => i();
                try {
                    t.postMessage(n, [n]);
                } catch {
                } finally {
                    i();
                }
            });
        },
        kl = (n, t, e, s, i, r, a, o, c, u, l) => (h, f) => {
            const p = a(h) ? h : r(h);
            if (i.has(f)) {
                const d = e();
                return Promise.reject(d);
            }
            try {
                i.add(f);
            } catch {}
            return t(c, () => c(p))
                ? p
                      .decodeAudioData(f)
                      .then((d) => (Ho(f).catch(() => {}), t(o, () => o(d)) || l(d), n.add(d), d))
                : new Promise((d, m) => {
                      const g = async () => {
                              try {
                                  await Ho(f);
                              } catch {}
                          },
                          y = (S) => {
                              m(S), g();
                          };
                      try {
                          p.decodeAudioData(
                              f,
                              (S) => {
                                  typeof S.copyFromChannel != 'function' && (u(S), nr(S)),
                                      n.add(S),
                                      g().then(() => d(S));
                              },
                              (S) => {
                                  y(S === null ? s() : S);
                              }
                          );
                      } catch (S) {
                          y(S);
                      }
                  });
        },
        zl = (n, t, e, s, i, r, a, o) => (c, u) => {
            const l = t.get(c);
            if (l === void 0) throw new Error('Missing the expected cycle count.');
            const h = r(c.context),
                f = o(h);
            if (l === u) {
                if ((t.delete(c), !f && a(c))) {
                    const p = s(c),
                        { outputs: d } = e(c);
                    for (const m of d)
                        if (Kn(m)) {
                            const g = s(m[0]);
                            n(p, g, m[1], m[2]);
                        } else {
                            const g = i(m[0]);
                            p.connect(g, m[1]);
                        }
                }
            } else t.set(c, l - u);
        },
        Pl = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            delayTime: 0,
            maxDelayTime: 1,
        },
        Rl = (n, t, e, s, i, r, a) =>
            class extends n {
                constructor(c, u) {
                    const l = i(c),
                        h = { ...Pl, ...u },
                        f = s(l, h),
                        p = r(l),
                        d = p ? e(h.maxDelayTime) : null;
                    super(c, !1, f, d),
                        (this._delayTime = t(this, p, f.delayTime)),
                        a(this, h.maxDelayTime);
                }
                get delayTime() {
                    return this._delayTime;
                }
            },
        Yl = (n, t, e, s, i) => (r) => {
            const a = new WeakMap(),
                o = async (c, u) => {
                    let l = e(c);
                    const h = Ct(l, u);
                    if (!h) {
                        const f = {
                            channelCount: l.channelCount,
                            channelCountMode: l.channelCountMode,
                            channelInterpretation: l.channelInterpretation,
                            delayTime: l.delayTime.value,
                            maxDelayTime: r,
                        };
                        l = t(u, f);
                    }
                    return (
                        a.set(u, l),
                        h
                            ? await n(u, c.delayTime, l.delayTime)
                            : await s(u, c.delayTime, l.delayTime),
                        await i(c, u, l),
                        l
                    );
                };
            return {
                render(c, u) {
                    const l = a.get(u);
                    return l !== void 0 ? Promise.resolve(l) : o(c, u);
                },
            };
        },
        Ul = (n) => (t, e, s, i) => n(t[i], (r) => r[0] === e && r[1] === s),
        Vl = (n) => (t, e) => {
            n(t).delete(e);
        },
        Wl = (n) => 'delayTime' in n,
        Fl = (n, t, e) =>
            function s(i, r) {
                const a = Gs(r) ? r : e(n, r);
                if (Wl(a)) return [];
                if (i[0] === a) return [i];
                if (i.includes(a)) return [];
                const { outputs: o } = t(a);
                return Array.from(o)
                    .map((c) => s([...i, a], c[0]))
                    .reduce((c, u) => c.concat(u), []);
            },
        Xs = (n, t, e) => {
            const s = t[e];
            if (s === void 0) throw n();
            return s;
        },
        Gl = (n) => (t, e = void 0, s = void 0, i = 0) =>
            e === void 0
                ? t.forEach((r) => r.disconnect())
                : typeof e == 'number'
                ? Xs(n, t, e).disconnect()
                : Hs(e)
                ? s === void 0
                    ? t.forEach((r) => r.disconnect(e))
                    : i === void 0
                    ? Xs(n, t, s).disconnect(e, 0)
                    : Xs(n, t, s).disconnect(e, 0, i)
                : s === void 0
                ? t.forEach((r) => r.disconnect(e))
                : Xs(n, t, s).disconnect(e, 0),
        Bl = {
            attack: 0.003,
            channelCount: 2,
            channelCountMode: 'clamped-max',
            channelInterpretation: 'speakers',
            knee: 30,
            ratio: 12,
            release: 0.25,
            threshold: -24,
        },
        Ql = (n, t, e, s, i, r, a, o) =>
            class extends n {
                constructor(u, l) {
                    const h = r(u),
                        f = { ...Bl, ...l },
                        p = s(h, f),
                        d = a(h),
                        m = d ? e() : null;
                    super(u, !1, p, m),
                        (this._attack = t(this, d, p.attack)),
                        (this._knee = t(this, d, p.knee)),
                        (this._nativeDynamicsCompressorNode = p),
                        (this._ratio = t(this, d, p.ratio)),
                        (this._release = t(this, d, p.release)),
                        (this._threshold = t(this, d, p.threshold)),
                        o(this, 0.006);
                }
                get attack() {
                    return this._attack;
                }
                get channelCount() {
                    return this._nativeDynamicsCompressorNode.channelCount;
                }
                set channelCount(u) {
                    const l = this._nativeDynamicsCompressorNode.channelCount;
                    if (((this._nativeDynamicsCompressorNode.channelCount = u), u > 2))
                        throw ((this._nativeDynamicsCompressorNode.channelCount = l), i());
                }
                get channelCountMode() {
                    return this._nativeDynamicsCompressorNode.channelCountMode;
                }
                set channelCountMode(u) {
                    const l = this._nativeDynamicsCompressorNode.channelCountMode;
                    if (((this._nativeDynamicsCompressorNode.channelCountMode = u), u === 'max'))
                        throw ((this._nativeDynamicsCompressorNode.channelCountMode = l), i());
                }
                get knee() {
                    return this._knee;
                }
                get ratio() {
                    return this._ratio;
                }
                get reduction() {
                    return typeof this._nativeDynamicsCompressorNode.reduction.value == 'number'
                        ? this._nativeDynamicsCompressorNode.reduction.value
                        : this._nativeDynamicsCompressorNode.reduction;
                }
                get release() {
                    return this._release;
                }
                get threshold() {
                    return this._threshold;
                }
            },
        Zl = (n, t, e, s, i) => () => {
            const r = new WeakMap(),
                a = async (o, c) => {
                    let u = e(o);
                    const l = Ct(u, c);
                    if (!l) {
                        const h = {
                            attack: u.attack.value,
                            channelCount: u.channelCount,
                            channelCountMode: u.channelCountMode,
                            channelInterpretation: u.channelInterpretation,
                            knee: u.knee.value,
                            ratio: u.ratio.value,
                            release: u.release.value,
                            threshold: u.threshold.value,
                        };
                        u = t(c, h);
                    }
                    return (
                        r.set(c, u),
                        l
                            ? (await n(c, o.attack, u.attack),
                              await n(c, o.knee, u.knee),
                              await n(c, o.ratio, u.ratio),
                              await n(c, o.release, u.release),
                              await n(c, o.threshold, u.threshold))
                            : (await s(c, o.attack, u.attack),
                              await s(c, o.knee, u.knee),
                              await s(c, o.ratio, u.ratio),
                              await s(c, o.release, u.release),
                              await s(c, o.threshold, u.threshold)),
                        await i(o, c, u),
                        u
                    );
                };
            return {
                render(o, c) {
                    const u = r.get(c);
                    return u !== void 0 ? Promise.resolve(u) : a(o, c);
                },
            };
        },
        Hl = () => new DOMException('', 'EncodingError'),
        $l = (n) => (t) =>
            new Promise((e, s) => {
                if (n === null) {
                    s(new SyntaxError());
                    return;
                }
                const i = n.document.head;
                if (i === null) s(new SyntaxError());
                else {
                    const r = n.document.createElement('script'),
                        a = new Blob([t], { type: 'application/javascript' }),
                        o = URL.createObjectURL(a),
                        c = n.onerror,
                        u = () => {
                            (n.onerror = c), URL.revokeObjectURL(o);
                        };
                    (n.onerror = (l, h, f, p, d) => {
                        if (h === o || (h === n.location.href && f === 1 && p === 1))
                            return u(), s(d), !1;
                        if (c !== null) return c(l, h, f, p, d);
                    }),
                        (r.onerror = () => {
                            u(), s(new SyntaxError());
                        }),
                        (r.onload = () => {
                            u(), e();
                        }),
                        (r.src = o),
                        (r.type = 'module'),
                        i.appendChild(r);
                }
            }),
        ql = (n) =>
            class {
                constructor(e) {
                    (this._nativeEventTarget = e), (this._listeners = new WeakMap());
                }
                addEventListener(e, s, i) {
                    if (s !== null) {
                        let r = this._listeners.get(s);
                        r === void 0 &&
                            ((r = n(this, s)), typeof s == 'function' && this._listeners.set(s, r)),
                            this._nativeEventTarget.addEventListener(e, r, i);
                    }
                }
                dispatchEvent(e) {
                    return this._nativeEventTarget.dispatchEvent(e);
                }
                removeEventListener(e, s, i) {
                    const r = s === null ? void 0 : this._listeners.get(s);
                    this._nativeEventTarget.removeEventListener(e, r === void 0 ? null : r, i);
                }
            },
        Xl = (n) => (t, e, s) => {
            Object.defineProperties(n, {
                currentFrame: {
                    configurable: !0,
                    get() {
                        return Math.round(t * e);
                    },
                },
                currentTime: {
                    configurable: !0,
                    get() {
                        return t;
                    },
                },
            });
            try {
                return s();
            } finally {
                n !== null && (delete n.currentFrame, delete n.currentTime);
            }
        },
        Jl = (n) => async (t) => {
            try {
                const e = await fetch(t);
                if (e.ok) return [await e.text(), e.url];
            } catch {}
            throw n();
        },
        Kl = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            gain: 1,
        },
        th = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = i(o),
                        l = { ...Kl, ...c },
                        h = s(u, l),
                        f = r(u),
                        p = f ? e() : null;
                    super(o, !1, h, p), (this._gain = t(this, f, h.gain, kt, Vt));
                }
                get gain() {
                    return this._gain;
                }
            },
        eh = (n, t, e, s, i) => () => {
            const r = new WeakMap(),
                a = async (o, c) => {
                    let u = e(o);
                    const l = Ct(u, c);
                    if (!l) {
                        const h = {
                            channelCount: u.channelCount,
                            channelCountMode: u.channelCountMode,
                            channelInterpretation: u.channelInterpretation,
                            gain: u.gain.value,
                        };
                        u = t(c, h);
                    }
                    return (
                        r.set(c, u),
                        l ? await n(c, o.gain, u.gain) : await s(c, o.gain, u.gain),
                        await i(o, c, u),
                        u
                    );
                };
            return {
                render(o, c) {
                    const u = r.get(c);
                    return u !== void 0 ? Promise.resolve(u) : a(o, c);
                },
            };
        },
        nh = (n, t) => (e) => t(n, e),
        sh = (n) => (t) => {
            const e = n(t);
            if (e.renderer === null)
                throw new Error('Missing the renderer of the given AudioNode in the audio graph.');
            return e.renderer;
        },
        ih = (n) => (t) => {
            var e;
            return (e = n.get(t)) !== null && e !== void 0 ? e : 0;
        },
        rh = (n) => (t) => {
            const e = n(t);
            if (e.renderer === null)
                throw new Error('Missing the renderer of the given AudioParam in the audio graph.');
            return e.renderer;
        },
        oh = (n) => (t) => n.get(t),
        At = () => new DOMException('', 'InvalidStateError'),
        ah = (n) => (t) => {
            const e = n.get(t);
            if (e === void 0) throw At();
            return e;
        },
        ch = (n, t) => (e) => {
            let s = n.get(e);
            if (s !== void 0) return s;
            if (t === null) throw new Error('Missing the native OfflineAudioContext constructor.');
            return (s = new t(1, 1, 44100)), n.set(e, s), s;
        },
        uh = (n) => (t) => {
            const e = n.get(t);
            if (e === void 0) throw new Error('The context has no set of AudioWorkletNodes.');
            return e;
        },
        Js = () => new DOMException('', 'InvalidAccessError'),
        lh = (n) => {
            n.getFrequencyResponse = ((t) => (e, s, i) => {
                if (e.length !== s.length || s.length !== i.length) throw Js();
                return t.call(n, e, s, i);
            })(n.getFrequencyResponse);
        },
        hh = { channelCount: 2, channelCountMode: 'max', channelInterpretation: 'speakers' },
        dh = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = s(o),
                        l = i(u),
                        h = { ...hh, ...c },
                        f = t(u, l ? null : o.baseLatency, h),
                        p = l ? e(h.feedback, h.feedforward) : null;
                    super(o, !1, f, p), lh(f), (this._nativeIIRFilterNode = f), r(this, 1);
                }
                getFrequencyResponse(o, c, u) {
                    return this._nativeIIRFilterNode.getFrequencyResponse(o, c, u);
                }
            },
        $o = (n, t, e, s, i, r, a, o, c, u, l) => {
            const h = u.length;
            let f = o;
            for (let p = 0; p < h; p += 1) {
                let d = e[0] * u[p];
                for (let m = 1; m < i; m += 1) {
                    const g = (f - m) & (c - 1);
                    (d += e[m] * r[g]), (d -= n[m] * a[g]);
                }
                for (let m = i; m < s; m += 1) d += e[m] * r[(f - m) & (c - 1)];
                for (let m = i; m < t; m += 1) d -= n[m] * a[(f - m) & (c - 1)];
                (r[f] = u[p]), (a[f] = d), (f = (f + 1) & (c - 1)), (l[p] = d);
            }
            return f;
        },
        fh = (n, t, e, s) => {
            const i = e instanceof Float64Array ? e : new Float64Array(e),
                r = s instanceof Float64Array ? s : new Float64Array(s),
                a = i.length,
                o = r.length,
                c = Math.min(a, o);
            if (i[0] !== 1) {
                for (let d = 0; d < a; d += 1) r[d] /= i[0];
                for (let d = 1; d < o; d += 1) i[d] /= i[0];
            }
            const u = 32,
                l = new Float32Array(u),
                h = new Float32Array(u),
                f = t.createBuffer(n.numberOfChannels, n.length, n.sampleRate),
                p = n.numberOfChannels;
            for (let d = 0; d < p; d += 1) {
                const m = n.getChannelData(d),
                    g = f.getChannelData(d);
                l.fill(0), h.fill(0), $o(i, a, r, o, c, l, h, 0, u, m, g);
            }
            return f;
        },
        ph = (n, t, e, s, i) => (r, a) => {
            const o = new WeakMap();
            let c = null;
            const u = async (l, h) => {
                let f = null,
                    p = t(l);
                const d = Ct(p, h);
                if (
                    (h.createIIRFilter === void 0
                        ? (f = n(h, {
                              buffer: null,
                              channelCount: 2,
                              channelCountMode: 'max',
                              channelInterpretation: 'speakers',
                              loop: !1,
                              loopEnd: 0,
                              loopStart: 0,
                              playbackRate: 1,
                          }))
                        : d || (p = h.createIIRFilter(a, r)),
                    o.set(h, f === null ? p : f),
                    f !== null)
                ) {
                    if (c === null) {
                        if (e === null)
                            throw new Error('Missing the native OfflineAudioContext constructor.');
                        const g = new e(
                            l.context.destination.channelCount,
                            l.context.length,
                            h.sampleRate
                        );
                        c = (async () => {
                            await s(l, g, g.destination);
                            const y = await i(g);
                            return fh(y, h, r, a);
                        })();
                    }
                    const m = await c;
                    return (f.buffer = m), f.start(0), f;
                }
                return await s(l, h, p), p;
            };
            return {
                render(l, h) {
                    const f = o.get(h);
                    return f !== void 0 ? Promise.resolve(f) : u(l, h);
                },
            };
        },
        mh = (n, t, e, s, i, r) => (a) => (o, c) => {
            const u = n.get(o);
            if (u === void 0) {
                if (!a && r(o)) {
                    const l = s(o),
                        { outputs: h } = e(o);
                    for (const f of h)
                        if (Kn(f)) {
                            const p = s(f[0]);
                            t(l, p, f[1], f[2]);
                        } else {
                            const p = i(f[0]);
                            l.disconnect(p, f[1]);
                        }
                }
                n.set(o, c);
            } else n.set(o, u + c);
        },
        gh = (n, t) => (e) => {
            const s = n.get(e);
            return t(s) || t(e);
        },
        Mh = (n, t) => (e) => n.has(e) || t(e),
        yh = (n, t) => (e) => n.has(e) || t(e),
        _h = (n, t) => (e) => {
            const s = n.get(e);
            return t(s) || t(e);
        },
        Th = (n) => (t) => n !== null && t instanceof n,
        Nh = (n) => (t) =>
            n !== null && typeof n.AudioNode == 'function' && t instanceof n.AudioNode,
        Ih = (n) => (t) =>
            n !== null && typeof n.AudioParam == 'function' && t instanceof n.AudioParam,
        Sh = (n, t) => (e) => n(e) || t(e),
        jh = (n) => (t) => n !== null && t instanceof n,
        Ah = (n) => n !== null && n.isSecureContext,
        xh = (n, t, e, s) =>
            class extends n {
                constructor(r, a) {
                    const o = e(r),
                        c = t(o, a);
                    if (s(o)) throw TypeError();
                    super(r, !0, c, null), (this._nativeMediaElementAudioSourceNode = c);
                }
                get mediaElement() {
                    return this._nativeMediaElementAudioSourceNode.mediaElement;
                }
            },
        vh = { channelCount: 2, channelCountMode: 'explicit', channelInterpretation: 'speakers' },
        Lh = (n, t, e, s) =>
            class extends n {
                constructor(r, a) {
                    const o = e(r);
                    if (s(o)) throw new TypeError();
                    const c = { ...vh, ...a },
                        u = t(o, c);
                    super(r, !1, u, null), (this._nativeMediaStreamAudioDestinationNode = u);
                }
                get stream() {
                    return this._nativeMediaStreamAudioDestinationNode.stream;
                }
            },
        wh = (n, t, e, s) =>
            class extends n {
                constructor(r, a) {
                    const o = e(r),
                        c = t(o, a);
                    if (s(o)) throw new TypeError();
                    super(r, !0, c, null), (this._nativeMediaStreamAudioSourceNode = c);
                }
                get mediaStream() {
                    return this._nativeMediaStreamAudioSourceNode.mediaStream;
                }
            },
        Dh = (n, t, e) =>
            class extends n {
                constructor(i, r) {
                    const a = e(i),
                        o = t(a, r);
                    super(i, !0, o, null);
                }
            },
        bh = (n, t, e, s, i, r) =>
            class extends e {
                constructor(o, c) {
                    super(o),
                        (this._nativeContext = o),
                        Vs.set(this, o),
                        s(o) && i.set(o, new Set()),
                        (this._destination = new n(this, c)),
                        (this._listener = t(this, o)),
                        (this._onstatechange = null);
                }
                get currentTime() {
                    return this._nativeContext.currentTime;
                }
                get destination() {
                    return this._destination;
                }
                get listener() {
                    return this._listener;
                }
                get onstatechange() {
                    return this._onstatechange;
                }
                set onstatechange(o) {
                    const c = typeof o == 'function' ? r(this, o) : null;
                    this._nativeContext.onstatechange = c;
                    const u = this._nativeContext.onstatechange;
                    this._onstatechange = u !== null && u === c ? o : u;
                }
                get sampleRate() {
                    return this._nativeContext.sampleRate;
                }
                get state() {
                    return this._nativeContext.state;
                }
            },
        es = (n) => {
            const t = new Uint32Array([
                1179011410,
                40,
                1163280727,
                544501094,
                16,
                131073,
                44100,
                176400,
                1048580,
                1635017060,
                4,
                0,
            ]);
            try {
                const e = n.decodeAudioData(t.buffer, () => {});
                return e === void 0 ? !1 : (e.catch(() => {}), !0);
            } catch {}
            return !1;
        },
        Ch = (n, t) => (e, s, i) => {
            const r = new Set();
            return (
                (e.connect = ((a) => (o, c = 0, u = 0) => {
                    const l = r.size === 0;
                    if (t(o))
                        return (
                            a.call(e, o, c, u),
                            n(r, [o, c, u], (h) => h[0] === o && h[1] === c && h[2] === u, !0),
                            l && s(),
                            o
                        );
                    a.call(e, o, c), n(r, [o, c], (h) => h[0] === o && h[1] === c, !0), l && s();
                })(e.connect)),
                (e.disconnect = ((a) => (o, c, u) => {
                    const l = r.size > 0;
                    if (o === void 0) a.apply(e), r.clear();
                    else if (typeof o == 'number') {
                        a.call(e, o);
                        for (const f of r) f[1] === o && r.delete(f);
                    } else {
                        t(o) ? a.call(e, o, c, u) : a.call(e, o, c);
                        for (const f of r)
                            f[0] === o &&
                                (c === void 0 || f[1] === c) &&
                                (u === void 0 || f[2] === u) &&
                                r.delete(f);
                    }
                    const h = r.size === 0;
                    l && h && i();
                })(e.disconnect)),
                e
            );
        },
        ht = (n, t, e) => {
            const s = t[e];
            s !== void 0 && s !== n[e] && (n[e] = s);
        },
        St = (n, t) => {
            ht(n, t, 'channelCount'),
                ht(n, t, 'channelCountMode'),
                ht(n, t, 'channelInterpretation');
        },
        qo = (n) => typeof n.getFloatTimeDomainData == 'function',
        Eh = (n) => {
            n.getFloatTimeDomainData = (t) => {
                const e = new Uint8Array(t.length);
                n.getByteTimeDomainData(e);
                const s = Math.max(e.length, n.fftSize);
                for (let i = 0; i < s; i += 1) t[i] = (e[i] - 128) * 0.0078125;
                return t;
            };
        },
        Oh = (n, t) => (e, s) => {
            const i = e.createAnalyser();
            if ((St(i, s), !(s.maxDecibels > s.minDecibels))) throw t();
            return (
                ht(i, s, 'fftSize'),
                ht(i, s, 'maxDecibels'),
                ht(i, s, 'minDecibels'),
                ht(i, s, 'smoothingTimeConstant'),
                n(qo, () => qo(i)) || Eh(i),
                i
            );
        },
        kh = (n) => (n === null ? null : n.hasOwnProperty('AudioBuffer') ? n.AudioBuffer : null),
        mt = (n, t, e) => {
            const s = t[e];
            s !== void 0 && s !== n[e].value && (n[e].value = s);
        },
        zh = (n) => {
            n.start = ((t) => {
                let e = !1;
                return (s = 0, i = 0, r) => {
                    if (e) throw At();
                    t.call(n, s, i, r), (e = !0);
                };
            })(n.start);
        },
        ar = (n) => {
            n.start = ((t) => (e = 0, s = 0, i) => {
                if ((typeof i == 'number' && i < 0) || s < 0 || e < 0)
                    throw new RangeError("The parameters can't be negative.");
                t.call(n, e, s, i);
            })(n.start);
        },
        cr = (n) => {
            n.stop = ((t) => (e = 0) => {
                if (e < 0) throw new RangeError("The parameter can't be negative.");
                t.call(n, e);
            })(n.stop);
        },
        Ph = (n, t, e, s, i, r, a, o, c, u, l) => (h, f) => {
            const p = h.createBufferSource();
            return (
                St(p, f),
                mt(p, f, 'playbackRate'),
                ht(p, f, 'buffer'),
                ht(p, f, 'loop'),
                ht(p, f, 'loopEnd'),
                ht(p, f, 'loopStart'),
                t(e, () => e(h)) || zh(p),
                t(s, () => s(h)) || c(p),
                t(i, () => i(h)) || u(p, h),
                t(r, () => r(h)) || ar(p),
                t(a, () => a(h)) || l(p, h),
                t(o, () => o(h)) || cr(p),
                n(h, p),
                p
            );
        },
        Rh = (n) =>
            n === null
                ? null
                : n.hasOwnProperty('AudioContext')
                ? n.AudioContext
                : n.hasOwnProperty('webkitAudioContext')
                ? n.webkitAudioContext
                : null,
        Yh = (n, t) => (e, s, i) => {
            const r = e.destination;
            if (r.channelCount !== s)
                try {
                    r.channelCount = s;
                } catch {}
            i && r.channelCountMode !== 'explicit' && (r.channelCountMode = 'explicit'),
                r.maxChannelCount === 0 &&
                    Object.defineProperty(r, 'maxChannelCount', { value: s });
            const a = n(e, {
                channelCount: s,
                channelCountMode: r.channelCountMode,
                channelInterpretation: r.channelInterpretation,
                gain: 1,
            });
            return (
                t(
                    a,
                    'channelCount',
                    (o) => () => o.call(a),
                    (o) => (c) => {
                        o.call(a, c);
                        try {
                            r.channelCount = c;
                        } catch (u) {
                            if (c > r.maxChannelCount) throw u;
                        }
                    }
                ),
                t(
                    a,
                    'channelCountMode',
                    (o) => () => o.call(a),
                    (o) => (c) => {
                        o.call(a, c), (r.channelCountMode = c);
                    }
                ),
                t(
                    a,
                    'channelInterpretation',
                    (o) => () => o.call(a),
                    (o) => (c) => {
                        o.call(a, c), (r.channelInterpretation = c);
                    }
                ),
                Object.defineProperty(a, 'maxChannelCount', { get: () => r.maxChannelCount }),
                a.connect(r),
                a
            );
        },
        Uh = (n) =>
            n === null ? null : n.hasOwnProperty('AudioWorkletNode') ? n.AudioWorkletNode : null,
        Vh = (n) => {
            const { port1: t } = new MessageChannel();
            try {
                t.postMessage(n);
            } finally {
                t.close();
            }
        },
        Wh = (n, t, e, s, i) => (r, a, o, c, u, l) => {
            if (o !== null)
                try {
                    const h = new o(r, c, l),
                        f = new Map();
                    let p = null;
                    if (
                        (Object.defineProperties(h, {
                            channelCount: {
                                get: () => l.channelCount,
                                set: () => {
                                    throw n();
                                },
                            },
                            channelCountMode: {
                                get: () => 'explicit',
                                set: () => {
                                    throw n();
                                },
                            },
                            onprocessorerror: {
                                get: () => p,
                                set: (d) => {
                                    typeof p == 'function' &&
                                        h.removeEventListener('processorerror', p),
                                        (p = typeof d == 'function' ? d : null),
                                        typeof p == 'function' &&
                                            h.addEventListener('processorerror', p);
                                },
                            },
                        }),
                        (h.addEventListener = ((d) => (...m) => {
                            if (m[0] === 'processorerror') {
                                const g =
                                    typeof m[1] == 'function'
                                        ? m[1]
                                        : typeof m[1] == 'object' &&
                                          m[1] !== null &&
                                          typeof m[1].handleEvent == 'function'
                                        ? m[1].handleEvent
                                        : null;
                                if (g !== null) {
                                    const y = f.get(m[1]);
                                    y !== void 0
                                        ? (m[1] = y)
                                        : ((m[1] = (S) => {
                                              S.type === 'error'
                                                  ? (Object.defineProperties(S, {
                                                        type: { value: 'processorerror' },
                                                    }),
                                                    g(S))
                                                  : g(new ErrorEvent(m[0], { ...S }));
                                          }),
                                          f.set(g, m[1]));
                                }
                            }
                            return d.call(h, 'error', m[1], m[2]), d.call(h, ...m);
                        })(h.addEventListener)),
                        (h.removeEventListener = ((d) => (...m) => {
                            if (m[0] === 'processorerror') {
                                const g = f.get(m[1]);
                                g !== void 0 && (f.delete(m[1]), (m[1] = g));
                            }
                            return d.call(h, 'error', m[1], m[2]), d.call(h, m[0], m[1], m[2]);
                        })(h.removeEventListener)),
                        l.numberOfOutputs !== 0)
                    ) {
                        const d = e(r, {
                            channelCount: 1,
                            channelCountMode: 'explicit',
                            channelInterpretation: 'discrete',
                            gain: 0,
                        });
                        return (
                            h.connect(d).connect(r.destination),
                            i(
                                h,
                                () => d.disconnect(),
                                () => d.connect(r.destination)
                            )
                        );
                    }
                    return h;
                } catch (h) {
                    throw h.code === 11 ? s() : h;
                }
            if (u === void 0) throw s();
            return Vh(l), t(r, a, u, l);
        },
        Xo = (n, t) =>
            n === null
                ? 512
                : Math.max(512, Math.min(16384, Math.pow(2, Math.round(Math.log2(n * t))))),
        Fh = (n) =>
            new Promise((t, e) => {
                const { port1: s, port2: i } = new MessageChannel();
                (s.onmessage = ({ data: r }) => {
                    s.close(), i.close(), t(r);
                }),
                    (s.onmessageerror = ({ data: r }) => {
                        s.close(), i.close(), e(r);
                    }),
                    i.postMessage(n);
            }),
        Gh = async (n, t) => {
            const e = await Fh(t);
            return new n(e);
        },
        Bh = (n, t, e, s) => {
            let i = tr.get(n);
            i === void 0 && ((i = new WeakMap()), tr.set(n, i));
            const r = Gh(e, s);
            return i.set(t, r), r;
        },
        Qh = (n, t, e, s, i, r, a, o, c, u, l, h, f) => (p, d, m, g) => {
            if (g.numberOfInputs === 0 && g.numberOfOutputs === 0) throw c();
            const y = Array.isArray(g.outputChannelCount)
                ? g.outputChannelCount
                : Array.from(g.outputChannelCount);
            if (y.some((R) => R < 1)) throw c();
            if (y.length !== g.numberOfOutputs) throw t();
            if (g.channelCountMode !== 'explicit') throw c();
            const S = g.channelCount * g.numberOfInputs,
                v = y.reduce((R, G) => R + G, 0),
                w = m.parameterDescriptors === void 0 ? 0 : m.parameterDescriptors.length;
            if (S + w > 6 || v > 6) throw c();
            const _ = new MessageChannel(),
                N = [],
                T = [];
            for (let R = 0; R < g.numberOfInputs; R += 1)
                N.push(
                    a(p, {
                        channelCount: g.channelCount,
                        channelCountMode: g.channelCountMode,
                        channelInterpretation: g.channelInterpretation,
                        gain: 1,
                    })
                ),
                    T.push(
                        i(p, {
                            channelCount: g.channelCount,
                            channelCountMode: 'explicit',
                            channelInterpretation: 'discrete',
                            numberOfOutputs: g.channelCount,
                        })
                    );
            const M = [];
            if (m.parameterDescriptors !== void 0)
                for (const {
                    defaultValue: R,
                    maxValue: G,
                    minValue: jt,
                    name: pt,
                } of m.parameterDescriptors) {
                    const tt = r(p, {
                        channelCount: 1,
                        channelCountMode: 'explicit',
                        channelInterpretation: 'discrete',
                        offset:
                            g.parameterData[pt] !== void 0
                                ? g.parameterData[pt]
                                : R === void 0
                                ? 0
                                : R,
                    });
                    Object.defineProperties(tt.offset, {
                        defaultValue: { get: () => (R === void 0 ? 0 : R) },
                        maxValue: { get: () => (G === void 0 ? kt : G) },
                        minValue: { get: () => (jt === void 0 ? Vt : jt) },
                    }),
                        M.push(tt);
                }
            const j = s(p, {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'speakers',
                    numberOfInputs: Math.max(1, S + w),
                }),
                x = Xo(d, p.sampleRate),
                I = o(p, x, S + w, Math.max(1, v)),
                A = i(p, {
                    channelCount: Math.max(1, v),
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                    numberOfOutputs: Math.max(1, v),
                }),
                C = [];
            for (let R = 0; R < g.numberOfOutputs; R += 1)
                C.push(
                    s(p, {
                        channelCount: 1,
                        channelCountMode: 'explicit',
                        channelInterpretation: 'speakers',
                        numberOfInputs: y[R],
                    })
                );
            for (let R = 0; R < g.numberOfInputs; R += 1) {
                N[R].connect(T[R]);
                for (let G = 0; G < g.channelCount; G += 1)
                    T[R].connect(j, G, R * g.channelCount + G);
            }
            const D = new Qo(
                m.parameterDescriptors === void 0
                    ? []
                    : m.parameterDescriptors.map(({ name: R }, G) => {
                          const jt = M[G];
                          return jt.connect(j, 0, S + G), jt.start(0), [R, jt.offset];
                      })
            );
            j.connect(I);
            let E = g.channelInterpretation,
                z = null;
            const O = g.numberOfOutputs === 0 ? [I] : C,
                Y = {
                    get bufferSize() {
                        return x;
                    },
                    get channelCount() {
                        return g.channelCount;
                    },
                    set channelCount(R) {
                        throw e();
                    },
                    get channelCountMode() {
                        return g.channelCountMode;
                    },
                    set channelCountMode(R) {
                        throw e();
                    },
                    get channelInterpretation() {
                        return E;
                    },
                    set channelInterpretation(R) {
                        for (const G of N) G.channelInterpretation = R;
                        E = R;
                    },
                    get context() {
                        return I.context;
                    },
                    get inputs() {
                        return N;
                    },
                    get numberOfInputs() {
                        return g.numberOfInputs;
                    },
                    get numberOfOutputs() {
                        return g.numberOfOutputs;
                    },
                    get onprocessorerror() {
                        return z;
                    },
                    set onprocessorerror(R) {
                        typeof z == 'function' && Y.removeEventListener('processorerror', z),
                            (z = typeof R == 'function' ? R : null),
                            typeof z == 'function' && Y.addEventListener('processorerror', z);
                    },
                    get parameters() {
                        return D;
                    },
                    get port() {
                        return _.port2;
                    },
                    addEventListener(...R) {
                        return I.addEventListener(R[0], R[1], R[2]);
                    },
                    connect: n.bind(null, O),
                    disconnect: u.bind(null, O),
                    dispatchEvent(...R) {
                        return I.dispatchEvent(R[0]);
                    },
                    removeEventListener(...R) {
                        return I.removeEventListener(R[0], R[1], R[2]);
                    },
                },
                P = new Map();
            (_.port1.addEventListener = ((R) => (...G) => {
                if (G[0] === 'message') {
                    const jt =
                        typeof G[1] == 'function'
                            ? G[1]
                            : typeof G[1] == 'object' &&
                              G[1] !== null &&
                              typeof G[1].handleEvent == 'function'
                            ? G[1].handleEvent
                            : null;
                    if (jt !== null) {
                        const pt = P.get(G[1]);
                        pt !== void 0
                            ? (G[1] = pt)
                            : ((G[1] = (tt) => {
                                  l(p.currentTime, p.sampleRate, () => jt(tt));
                              }),
                              P.set(jt, G[1]));
                    }
                }
                return R.call(_.port1, G[0], G[1], G[2]);
            })(_.port1.addEventListener)),
                (_.port1.removeEventListener = ((R) => (...G) => {
                    if (G[0] === 'message') {
                        const jt = P.get(G[1]);
                        jt !== void 0 && (P.delete(G[1]), (G[1] = jt));
                    }
                    return R.call(_.port1, G[0], G[1], G[2]);
                })(_.port1.removeEventListener));
            let B = null;
            Object.defineProperty(_.port1, 'onmessage', {
                get: () => B,
                set: (R) => {
                    typeof B == 'function' && _.port1.removeEventListener('message', B),
                        (B = typeof R == 'function' ? R : null),
                        typeof B == 'function' &&
                            (_.port1.addEventListener('message', B), _.port1.start());
                },
            }),
                (m.prototype.port = _.port1);
            let Z = null;
            Bh(p, Y, m, g).then((R) => (Z = R));
            const qt = qs(g.numberOfInputs, g.channelCount),
                Xt = qs(g.numberOfOutputs, y),
                q =
                    m.parameterDescriptors === void 0
                        ? []
                        : m.parameterDescriptors.reduce(
                              (R, { name: G }) => ({ ...R, [G]: new Float32Array(128) }),
                              {}
                          );
            let dt = !0;
            const Ut = () => {
                    g.numberOfOutputs > 0 && I.disconnect(A);
                    for (let R = 0, G = 0; R < g.numberOfOutputs; R += 1) {
                        const jt = C[R];
                        for (let pt = 0; pt < y[R]; pt += 1) A.disconnect(jt, G + pt, pt);
                        G += y[R];
                    }
                },
                V = new Map();
            I.onaudioprocess = ({ inputBuffer: R, outputBuffer: G }) => {
                if (Z !== null) {
                    const jt = h(Y);
                    for (let pt = 0; pt < x; pt += 128) {
                        for (let tt = 0; tt < g.numberOfInputs; tt += 1)
                            for (let gt = 0; gt < g.channelCount; gt += 1)
                                $s(R, qt[tt], gt, gt, pt);
                        m.parameterDescriptors !== void 0 &&
                            m.parameterDescriptors.forEach(({ name: tt }, gt) => {
                                $s(R, q, tt, S + gt, pt);
                            });
                        for (let tt = 0; tt < g.numberOfInputs; tt += 1)
                            for (let gt = 0; gt < y[tt]; gt += 1)
                                Xt[tt][gt].byteLength === 0 && (Xt[tt][gt] = new Float32Array(128));
                        try {
                            const tt = qt.map((te, Qe) => {
                                if (jt[Qe].size > 0) return V.set(Qe, x / 128), te;
                                const to = V.get(Qe);
                                return to === void 0
                                    ? []
                                    : (te.every((V_) => V_.every((W_) => W_ === 0)) &&
                                          (to === 1 ? V.delete(Qe) : V.set(Qe, to - 1)),
                                      te);
                            });
                            dt = l(p.currentTime + pt / p.sampleRate, p.sampleRate, () =>
                                Z.process(tt, Xt, q)
                            );
                            for (let te = 0, Qe = 0; te < g.numberOfOutputs; te += 1) {
                                for (let ws = 0; ws < y[te]; ws += 1)
                                    Zo(G, Xt[te], ws, Qe + ws, pt);
                                Qe += y[te];
                            }
                        } catch (tt) {
                            (dt = !1),
                                Y.dispatchEvent(
                                    new ErrorEvent('processorerror', {
                                        colno: tt.colno,
                                        filename: tt.filename,
                                        lineno: tt.lineno,
                                        message: tt.message,
                                    })
                                );
                        }
                        if (!dt) {
                            for (let tt = 0; tt < g.numberOfInputs; tt += 1) {
                                N[tt].disconnect(T[tt]);
                                for (let gt = 0; gt < g.channelCount; gt += 1)
                                    T[pt].disconnect(j, gt, tt * g.channelCount + gt);
                            }
                            if (m.parameterDescriptors !== void 0) {
                                const tt = m.parameterDescriptors.length;
                                for (let gt = 0; gt < tt; gt += 1) {
                                    const te = M[gt];
                                    te.disconnect(j, 0, S + gt), te.stop();
                                }
                            }
                            j.disconnect(I), (I.onaudioprocess = null), fn ? Ut() : Zn();
                            break;
                        }
                    }
                }
            };
            let fn = !1;
            const pn = a(p, {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                    gain: 0,
                }),
                Qn = () => I.connect(pn).connect(p.destination),
                Zn = () => {
                    I.disconnect(pn), pn.disconnect();
                },
                Y_ = () => {
                    if (dt) {
                        Zn(), g.numberOfOutputs > 0 && I.connect(A);
                        for (let R = 0, G = 0; R < g.numberOfOutputs; R += 1) {
                            const jt = C[R];
                            for (let pt = 0; pt < y[R]; pt += 1) A.connect(jt, G + pt, pt);
                            G += y[R];
                        }
                    }
                    fn = !0;
                },
                U_ = () => {
                    dt && (Qn(), Ut()), (fn = !1);
                };
            return Qn(), f(Y, Y_, U_);
        },
        Jo = (n, t) => {
            const e = n.createBiquadFilter();
            return (
                St(e, t),
                mt(e, t, 'Q'),
                mt(e, t, 'detune'),
                mt(e, t, 'frequency'),
                mt(e, t, 'gain'),
                ht(e, t, 'type'),
                e
            );
        },
        Zh = (n, t) => (e, s) => {
            const i = e.createChannelMerger(s.numberOfInputs);
            return n !== null && n.name === 'webkitAudioContext' && t(e, i), St(i, s), i;
        },
        Hh = (n) => {
            const t = n.numberOfOutputs;
            Object.defineProperty(n, 'channelCount', {
                get: () => t,
                set: (e) => {
                    if (e !== t) throw At();
                },
            }),
                Object.defineProperty(n, 'channelCountMode', {
                    get: () => 'explicit',
                    set: (e) => {
                        if (e !== 'explicit') throw At();
                    },
                }),
                Object.defineProperty(n, 'channelInterpretation', {
                    get: () => 'discrete',
                    set: (e) => {
                        if (e !== 'discrete') throw At();
                    },
                });
        },
        ns = (n, t) => {
            const e = n.createChannelSplitter(t.numberOfOutputs);
            return St(e, t), Hh(e), e;
        },
        $h = (n, t, e, s, i) => (r, a) => {
            if (r.createConstantSource === void 0) return e(r, a);
            const o = r.createConstantSource();
            return (
                St(o, a),
                mt(o, a, 'offset'),
                t(s, () => s(r)) || ar(o),
                t(i, () => i(r)) || cr(o),
                n(r, o),
                o
            );
        },
        Sn = (n, t) => ((n.connect = t.connect.bind(t)), (n.disconnect = t.disconnect.bind(t)), n),
        qh = (n, t, e, s) => (i, { offset: r, ...a }) => {
            const o = i.createBuffer(1, 2, 44100),
                c = t(i, {
                    buffer: null,
                    channelCount: 2,
                    channelCountMode: 'max',
                    channelInterpretation: 'speakers',
                    loop: !1,
                    loopEnd: 0,
                    loopStart: 0,
                    playbackRate: 1,
                }),
                u = e(i, { ...a, gain: r }),
                l = o.getChannelData(0);
            (l[0] = 1), (l[1] = 1), (c.buffer = o), (c.loop = !0);
            const h = {
                    get bufferSize() {},
                    get channelCount() {
                        return u.channelCount;
                    },
                    set channelCount(d) {
                        u.channelCount = d;
                    },
                    get channelCountMode() {
                        return u.channelCountMode;
                    },
                    set channelCountMode(d) {
                        u.channelCountMode = d;
                    },
                    get channelInterpretation() {
                        return u.channelInterpretation;
                    },
                    set channelInterpretation(d) {
                        u.channelInterpretation = d;
                    },
                    get context() {
                        return u.context;
                    },
                    get inputs() {
                        return [];
                    },
                    get numberOfInputs() {
                        return c.numberOfInputs;
                    },
                    get numberOfOutputs() {
                        return u.numberOfOutputs;
                    },
                    get offset() {
                        return u.gain;
                    },
                    get onended() {
                        return c.onended;
                    },
                    set onended(d) {
                        c.onended = d;
                    },
                    addEventListener(...d) {
                        return c.addEventListener(d[0], d[1], d[2]);
                    },
                    dispatchEvent(...d) {
                        return c.dispatchEvent(d[0]);
                    },
                    removeEventListener(...d) {
                        return c.removeEventListener(d[0], d[1], d[2]);
                    },
                    start(d = 0) {
                        c.start.call(c, d);
                    },
                    stop(d = 0) {
                        c.stop.call(c, d);
                    },
                },
                f = () => c.connect(u),
                p = () => c.disconnect(u);
            return n(i, c), s(Sn(h, u), f, p);
        },
        Xh = (n, t) => (e, s) => {
            const i = e.createConvolver();
            if (
                (St(i, s),
                s.disableNormalization === i.normalize && (i.normalize = !s.disableNormalization),
                ht(i, s, 'buffer'),
                s.channelCount > 2 ||
                    (t(
                        i,
                        'channelCount',
                        (r) => () => r.call(i),
                        (r) => (a) => {
                            if (a > 2) throw n();
                            return r.call(i, a);
                        }
                    ),
                    s.channelCountMode === 'max'))
            )
                throw n();
            return (
                t(
                    i,
                    'channelCountMode',
                    (r) => () => r.call(i),
                    (r) => (a) => {
                        if (a === 'max') throw n();
                        return r.call(i, a);
                    }
                ),
                i
            );
        },
        Ko = (n, t) => {
            const e = n.createDelay(t.maxDelayTime);
            return St(e, t), mt(e, t, 'delayTime'), e;
        },
        Jh = (n) => (t, e) => {
            const s = t.createDynamicsCompressor();
            if ((St(s, e), e.channelCount > 2 || e.channelCountMode === 'max')) throw n();
            return (
                mt(s, e, 'attack'),
                mt(s, e, 'knee'),
                mt(s, e, 'ratio'),
                mt(s, e, 'release'),
                mt(s, e, 'threshold'),
                s
            );
        },
        Wt = (n, t) => {
            const e = n.createGain();
            return St(e, t), mt(e, t, 'gain'), e;
        },
        Kh = (n) => (t, e, s) => {
            if (t.createIIRFilter === void 0) return n(t, e, s);
            const i = t.createIIRFilter(s.feedforward, s.feedback);
            return St(i, s), i;
        };
    function td(n, t) {
        const e = t[0] * t[0] + t[1] * t[1];
        return [(n[0] * t[0] + n[1] * t[1]) / e, (n[1] * t[0] - n[0] * t[1]) / e];
    }
    function ed(n, t) {
        return [n[0] * t[0] - n[1] * t[1], n[0] * t[1] + n[1] * t[0]];
    }
    function ta(n, t) {
        let e = [0, 0];
        for (let s = n.length - 1; s >= 0; s -= 1) (e = ed(e, t)), (e[0] += n[s]);
        return e;
    }
    const nd = (n, t, e, s) => (
            i,
            r,
            {
                channelCount: a,
                channelCountMode: o,
                channelInterpretation: c,
                feedback: u,
                feedforward: l,
            }
        ) => {
            const h = Xo(r, i.sampleRate),
                f = u instanceof Float64Array ? u : new Float64Array(u),
                p = l instanceof Float64Array ? l : new Float64Array(l),
                d = f.length,
                m = p.length,
                g = Math.min(d, m);
            if (d === 0 || d > 20) throw s();
            if (f[0] === 0) throw t();
            if (m === 0 || m > 20) throw s();
            if (p[0] === 0) throw t();
            if (f[0] !== 1) {
                for (let M = 0; M < m; M += 1) p[M] /= f[0];
                for (let M = 1; M < d; M += 1) f[M] /= f[0];
            }
            const y = e(i, h, a, a);
            (y.channelCount = a), (y.channelCountMode = o), (y.channelInterpretation = c);
            const S = 32,
                v = [],
                w = [],
                _ = [];
            for (let M = 0; M < a; M += 1) {
                v.push(0);
                const j = new Float32Array(S),
                    x = new Float32Array(S);
                j.fill(0), x.fill(0), w.push(j), _.push(x);
            }
            y.onaudioprocess = (M) => {
                const j = M.inputBuffer,
                    x = M.outputBuffer,
                    I = j.numberOfChannels;
                for (let A = 0; A < I; A += 1) {
                    const C = j.getChannelData(A),
                        D = x.getChannelData(A);
                    v[A] = $o(f, d, p, m, g, w[A], _[A], v[A], S, C, D);
                }
            };
            const N = i.sampleRate / 2;
            return Sn(
                {
                    get bufferSize() {
                        return h;
                    },
                    get channelCount() {
                        return y.channelCount;
                    },
                    set channelCount(M) {
                        y.channelCount = M;
                    },
                    get channelCountMode() {
                        return y.channelCountMode;
                    },
                    set channelCountMode(M) {
                        y.channelCountMode = M;
                    },
                    get channelInterpretation() {
                        return y.channelInterpretation;
                    },
                    set channelInterpretation(M) {
                        y.channelInterpretation = M;
                    },
                    get context() {
                        return y.context;
                    },
                    get inputs() {
                        return [y];
                    },
                    get numberOfInputs() {
                        return y.numberOfInputs;
                    },
                    get numberOfOutputs() {
                        return y.numberOfOutputs;
                    },
                    addEventListener(...M) {
                        return y.addEventListener(M[0], M[1], M[2]);
                    },
                    dispatchEvent(...M) {
                        return y.dispatchEvent(M[0]);
                    },
                    getFrequencyResponse(M, j, x) {
                        if (M.length !== j.length || j.length !== x.length) throw n();
                        const I = M.length;
                        for (let A = 0; A < I; A += 1) {
                            const C = -Math.PI * (M[A] / N),
                                D = [Math.cos(C), Math.sin(C)],
                                E = ta(p, D),
                                z = ta(f, D),
                                O = td(E, z);
                            (j[A] = Math.sqrt(O[0] * O[0] + O[1] * O[1])),
                                (x[A] = Math.atan2(O[1], O[0]));
                        }
                    },
                    removeEventListener(...M) {
                        return y.removeEventListener(M[0], M[1], M[2]);
                    },
                },
                y
            );
        },
        sd = (n, t) => n.createMediaElementSource(t.mediaElement),
        id = (n, t) => {
            const e = n.createMediaStreamDestination();
            return (
                St(e, t),
                e.numberOfOutputs === 1 &&
                    Object.defineProperty(e, 'numberOfOutputs', { get: () => 0 }),
                e
            );
        },
        rd = (n, { mediaStream: t }) => {
            const e = t.getAudioTracks();
            e.sort((r, a) => (r.id < a.id ? -1 : r.id > a.id ? 1 : 0));
            const s = e.slice(0, 1),
                i = n.createMediaStreamSource(new MediaStream(s));
            return Object.defineProperty(i, 'mediaStream', { value: t }), i;
        },
        od = (n, t) => (e, { mediaStreamTrack: s }) => {
            if (typeof e.createMediaStreamTrackSource == 'function')
                return e.createMediaStreamTrackSource(s);
            const i = new MediaStream([s]),
                r = e.createMediaStreamSource(i);
            if (s.kind !== 'audio') throw n();
            if (t(e)) throw new TypeError();
            return r;
        },
        ad = (n) =>
            n === null
                ? null
                : n.hasOwnProperty('OfflineAudioContext')
                ? n.OfflineAudioContext
                : n.hasOwnProperty('webkitOfflineAudioContext')
                ? n.webkitOfflineAudioContext
                : null,
        cd = (n, t, e, s, i, r) => (a, o) => {
            const c = a.createOscillator();
            return (
                St(c, o),
                mt(c, o, 'detune'),
                mt(c, o, 'frequency'),
                o.periodicWave !== void 0 ? c.setPeriodicWave(o.periodicWave) : ht(c, o, 'type'),
                t(e, () => e(a)) || ar(c),
                t(s, () => s(a)) || r(c, a),
                t(i, () => i(a)) || cr(c),
                n(a, c),
                c
            );
        },
        ud = (n) => (t, e) => {
            const s = t.createPanner();
            return s.orientationX === void 0
                ? n(t, e)
                : (St(s, e),
                  mt(s, e, 'orientationX'),
                  mt(s, e, 'orientationY'),
                  mt(s, e, 'orientationZ'),
                  mt(s, e, 'positionX'),
                  mt(s, e, 'positionY'),
                  mt(s, e, 'positionZ'),
                  ht(s, e, 'coneInnerAngle'),
                  ht(s, e, 'coneOuterAngle'),
                  ht(s, e, 'coneOuterGain'),
                  ht(s, e, 'distanceModel'),
                  ht(s, e, 'maxDistance'),
                  ht(s, e, 'panningModel'),
                  ht(s, e, 'refDistance'),
                  ht(s, e, 'rolloffFactor'),
                  s);
        },
        ld = (n, t, e, s, i, r, a, o, c, u) => (
            l,
            {
                coneInnerAngle: h,
                coneOuterAngle: f,
                coneOuterGain: p,
                distanceModel: d,
                maxDistance: m,
                orientationX: g,
                orientationY: y,
                orientationZ: S,
                panningModel: v,
                positionX: w,
                positionY: _,
                positionZ: N,
                refDistance: T,
                rolloffFactor: M,
                ...j
            }
        ) => {
            const x = l.createPanner();
            if (j.channelCount > 2 || j.channelCountMode === 'max') throw a();
            St(x, j);
            const I = {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                },
                A = e(l, { ...I, channelInterpretation: 'speakers', numberOfInputs: 6 }),
                C = s(l, { ...j, gain: 1 }),
                D = s(l, { ...I, gain: 1 }),
                E = s(l, { ...I, gain: 0 }),
                z = s(l, { ...I, gain: 0 }),
                O = s(l, { ...I, gain: 0 }),
                Y = s(l, { ...I, gain: 0 }),
                P = s(l, { ...I, gain: 0 }),
                B = i(l, 256, 6, 1),
                Z = r(l, { ...I, curve: new Float32Array([1, 1]), oversample: 'none' });
            let it = [g, y, S],
                qt = [w, _, N];
            const Xt = new Float32Array(1);
            (B.onaudioprocess = ({ inputBuffer: V }) => {
                const fn = [c(V, Xt, 0), c(V, Xt, 1), c(V, Xt, 2)];
                fn.some((Qn, Zn) => Qn !== it[Zn]) && (x.setOrientation(...fn), (it = fn));
                const pn = [c(V, Xt, 3), c(V, Xt, 4), c(V, Xt, 5)];
                pn.some((Qn, Zn) => Qn !== qt[Zn]) && (x.setPosition(...pn), (qt = pn));
            }),
                Object.defineProperty(E.gain, 'defaultValue', { get: () => 0 }),
                Object.defineProperty(z.gain, 'defaultValue', { get: () => 0 }),
                Object.defineProperty(O.gain, 'defaultValue', { get: () => 0 }),
                Object.defineProperty(Y.gain, 'defaultValue', { get: () => 0 }),
                Object.defineProperty(P.gain, 'defaultValue', { get: () => 0 });
            const q = {
                get bufferSize() {},
                get channelCount() {
                    return x.channelCount;
                },
                set channelCount(V) {
                    if (V > 2) throw a();
                    (C.channelCount = V), (x.channelCount = V);
                },
                get channelCountMode() {
                    return x.channelCountMode;
                },
                set channelCountMode(V) {
                    if (V === 'max') throw a();
                    (C.channelCountMode = V), (x.channelCountMode = V);
                },
                get channelInterpretation() {
                    return x.channelInterpretation;
                },
                set channelInterpretation(V) {
                    (C.channelInterpretation = V), (x.channelInterpretation = V);
                },
                get coneInnerAngle() {
                    return x.coneInnerAngle;
                },
                set coneInnerAngle(V) {
                    x.coneInnerAngle = V;
                },
                get coneOuterAngle() {
                    return x.coneOuterAngle;
                },
                set coneOuterAngle(V) {
                    x.coneOuterAngle = V;
                },
                get coneOuterGain() {
                    return x.coneOuterGain;
                },
                set coneOuterGain(V) {
                    if (V < 0 || V > 1) throw t();
                    x.coneOuterGain = V;
                },
                get context() {
                    return x.context;
                },
                get distanceModel() {
                    return x.distanceModel;
                },
                set distanceModel(V) {
                    x.distanceModel = V;
                },
                get inputs() {
                    return [C];
                },
                get maxDistance() {
                    return x.maxDistance;
                },
                set maxDistance(V) {
                    if (V < 0) throw new RangeError();
                    x.maxDistance = V;
                },
                get numberOfInputs() {
                    return x.numberOfInputs;
                },
                get numberOfOutputs() {
                    return x.numberOfOutputs;
                },
                get orientationX() {
                    return D.gain;
                },
                get orientationY() {
                    return E.gain;
                },
                get orientationZ() {
                    return z.gain;
                },
                get panningModel() {
                    return x.panningModel;
                },
                set panningModel(V) {
                    x.panningModel = V;
                },
                get positionX() {
                    return O.gain;
                },
                get positionY() {
                    return Y.gain;
                },
                get positionZ() {
                    return P.gain;
                },
                get refDistance() {
                    return x.refDistance;
                },
                set refDistance(V) {
                    if (V < 0) throw new RangeError();
                    x.refDistance = V;
                },
                get rolloffFactor() {
                    return x.rolloffFactor;
                },
                set rolloffFactor(V) {
                    if (V < 0) throw new RangeError();
                    x.rolloffFactor = V;
                },
                addEventListener(...V) {
                    return C.addEventListener(V[0], V[1], V[2]);
                },
                dispatchEvent(...V) {
                    return C.dispatchEvent(V[0]);
                },
                removeEventListener(...V) {
                    return C.removeEventListener(V[0], V[1], V[2]);
                },
            };
            h !== q.coneInnerAngle && (q.coneInnerAngle = h),
                f !== q.coneOuterAngle && (q.coneOuterAngle = f),
                p !== q.coneOuterGain && (q.coneOuterGain = p),
                d !== q.distanceModel && (q.distanceModel = d),
                m !== q.maxDistance && (q.maxDistance = m),
                g !== q.orientationX.value && (q.orientationX.value = g),
                y !== q.orientationY.value && (q.orientationY.value = y),
                S !== q.orientationZ.value && (q.orientationZ.value = S),
                v !== q.panningModel && (q.panningModel = v),
                w !== q.positionX.value && (q.positionX.value = w),
                _ !== q.positionY.value && (q.positionY.value = _),
                N !== q.positionZ.value && (q.positionZ.value = N),
                T !== q.refDistance && (q.refDistance = T),
                M !== q.rolloffFactor && (q.rolloffFactor = M),
                (it[0] !== 1 || it[1] !== 0 || it[2] !== 0) && x.setOrientation(...it),
                (qt[0] !== 0 || qt[1] !== 0 || qt[2] !== 0) && x.setPosition(...qt);
            const dt = () => {
                    C.connect(x),
                        n(C, Z, 0, 0),
                        Z.connect(D).connect(A, 0, 0),
                        Z.connect(E).connect(A, 0, 1),
                        Z.connect(z).connect(A, 0, 2),
                        Z.connect(O).connect(A, 0, 3),
                        Z.connect(Y).connect(A, 0, 4),
                        Z.connect(P).connect(A, 0, 5),
                        A.connect(B).connect(l.destination);
                },
                Ut = () => {
                    C.disconnect(x),
                        o(C, Z, 0, 0),
                        Z.disconnect(D),
                        D.disconnect(A),
                        Z.disconnect(E),
                        E.disconnect(A),
                        Z.disconnect(z),
                        z.disconnect(A),
                        Z.disconnect(O),
                        O.disconnect(A),
                        Z.disconnect(Y),
                        Y.disconnect(A),
                        Z.disconnect(P),
                        P.disconnect(A),
                        A.disconnect(B),
                        B.disconnect(l.destination);
                };
            return u(Sn(q, x), dt, Ut);
        },
        hd = (n) => (t, { disableNormalization: e, imag: s, real: i }) => {
            const r = s instanceof Float32Array ? s : new Float32Array(s),
                a = i instanceof Float32Array ? i : new Float32Array(i),
                o = t.createPeriodicWave(a, r, { disableNormalization: e });
            if (Array.from(s).length < 2) throw n();
            return o;
        },
        ss = (n, t, e, s) => n.createScriptProcessor(t, e, s),
        dd = (n, t) => (e, s) => {
            const i = s.channelCountMode;
            if (i === 'clamped-max') throw t();
            if (e.createStereoPanner === void 0) return n(e, s);
            const r = e.createStereoPanner();
            return (
                St(r, s),
                mt(r, s, 'pan'),
                Object.defineProperty(r, 'channelCountMode', {
                    get: () => i,
                    set: (a) => {
                        if (a !== i) throw t();
                    },
                }),
                r
            );
        },
        fd = (n, t, e, s, i, r) => {
            const o = new Float32Array([1, 1]),
                c = Math.PI / 2,
                u = {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                },
                l = { ...u, oversample: 'none' },
                h = (d, m, g, y) => {
                    const S = new Float32Array(16385),
                        v = new Float32Array(16385);
                    for (let j = 0; j < 16385; j += 1) {
                        const x = (j / 16384) * c;
                        (S[j] = Math.cos(x)), (v[j] = Math.sin(x));
                    }
                    const w = e(d, { ...u, gain: 0 }),
                        _ = s(d, { ...l, curve: S }),
                        N = s(d, { ...l, curve: o }),
                        T = e(d, { ...u, gain: 0 }),
                        M = s(d, { ...l, curve: v });
                    return {
                        connectGraph() {
                            m.connect(w),
                                m.connect(N.inputs === void 0 ? N : N.inputs[0]),
                                m.connect(T),
                                N.connect(g),
                                g.connect(_.inputs === void 0 ? _ : _.inputs[0]),
                                g.connect(M.inputs === void 0 ? M : M.inputs[0]),
                                _.connect(w.gain),
                                M.connect(T.gain),
                                w.connect(y, 0, 0),
                                T.connect(y, 0, 1);
                        },
                        disconnectGraph() {
                            m.disconnect(w),
                                m.disconnect(N.inputs === void 0 ? N : N.inputs[0]),
                                m.disconnect(T),
                                N.disconnect(g),
                                g.disconnect(_.inputs === void 0 ? _ : _.inputs[0]),
                                g.disconnect(M.inputs === void 0 ? M : M.inputs[0]),
                                _.disconnect(w.gain),
                                M.disconnect(T.gain),
                                w.disconnect(y, 0, 0),
                                T.disconnect(y, 0, 1);
                        },
                    };
                },
                f = (d, m, g, y) => {
                    const S = new Float32Array(16385),
                        v = new Float32Array(16385),
                        w = new Float32Array(16385),
                        _ = new Float32Array(16385),
                        N = Math.floor(16385 / 2);
                    for (let O = 0; O < 16385; O += 1)
                        if (O > N) {
                            const Y = ((O - N) / (16384 - N)) * c;
                            (S[O] = Math.cos(Y)), (v[O] = Math.sin(Y)), (w[O] = 0), (_[O] = 1);
                        } else {
                            const Y = (O / (16384 - N)) * c;
                            (S[O] = 1), (v[O] = 0), (w[O] = Math.cos(Y)), (_[O] = Math.sin(Y));
                        }
                    const T = t(d, {
                            channelCount: 2,
                            channelCountMode: 'explicit',
                            channelInterpretation: 'discrete',
                            numberOfOutputs: 2,
                        }),
                        M = e(d, { ...u, gain: 0 }),
                        j = s(d, { ...l, curve: S }),
                        x = e(d, { ...u, gain: 0 }),
                        I = s(d, { ...l, curve: v }),
                        A = s(d, { ...l, curve: o }),
                        C = e(d, { ...u, gain: 0 }),
                        D = s(d, { ...l, curve: w }),
                        E = e(d, { ...u, gain: 0 }),
                        z = s(d, { ...l, curve: _ });
                    return {
                        connectGraph() {
                            m.connect(T),
                                m.connect(A.inputs === void 0 ? A : A.inputs[0]),
                                T.connect(M, 0),
                                T.connect(x, 0),
                                T.connect(C, 1),
                                T.connect(E, 1),
                                A.connect(g),
                                g.connect(j.inputs === void 0 ? j : j.inputs[0]),
                                g.connect(I.inputs === void 0 ? I : I.inputs[0]),
                                g.connect(D.inputs === void 0 ? D : D.inputs[0]),
                                g.connect(z.inputs === void 0 ? z : z.inputs[0]),
                                j.connect(M.gain),
                                I.connect(x.gain),
                                D.connect(C.gain),
                                z.connect(E.gain),
                                M.connect(y, 0, 0),
                                C.connect(y, 0, 0),
                                x.connect(y, 0, 1),
                                E.connect(y, 0, 1);
                        },
                        disconnectGraph() {
                            m.disconnect(T),
                                m.disconnect(A.inputs === void 0 ? A : A.inputs[0]),
                                T.disconnect(M, 0),
                                T.disconnect(x, 0),
                                T.disconnect(C, 1),
                                T.disconnect(E, 1),
                                A.disconnect(g),
                                g.disconnect(j.inputs === void 0 ? j : j.inputs[0]),
                                g.disconnect(I.inputs === void 0 ? I : I.inputs[0]),
                                g.disconnect(D.inputs === void 0 ? D : D.inputs[0]),
                                g.disconnect(z.inputs === void 0 ? z : z.inputs[0]),
                                j.disconnect(M.gain),
                                I.disconnect(x.gain),
                                D.disconnect(C.gain),
                                z.disconnect(E.gain),
                                M.disconnect(y, 0, 0),
                                C.disconnect(y, 0, 0),
                                x.disconnect(y, 0, 1),
                                E.disconnect(y, 0, 1);
                        },
                    };
                },
                p = (d, m, g, y, S) => {
                    if (m === 1) return h(d, g, y, S);
                    if (m === 2) return f(d, g, y, S);
                    throw i();
                };
            return (d, { channelCount: m, channelCountMode: g, pan: y, ...S }) => {
                if (g === 'max') throw i();
                const v = n(d, { ...S, channelCount: 1, channelCountMode: g, numberOfInputs: 2 }),
                    w = e(d, { ...S, channelCount: m, channelCountMode: g, gain: 1 }),
                    _ = e(d, {
                        channelCount: 1,
                        channelCountMode: 'explicit',
                        channelInterpretation: 'discrete',
                        gain: y,
                    });
                let { connectGraph: N, disconnectGraph: T } = p(d, m, w, _, v);
                Object.defineProperty(_.gain, 'defaultValue', { get: () => 0 }),
                    Object.defineProperty(_.gain, 'maxValue', { get: () => 1 }),
                    Object.defineProperty(_.gain, 'minValue', { get: () => -1 });
                const M = {
                    get bufferSize() {},
                    get channelCount() {
                        return w.channelCount;
                    },
                    set channelCount(A) {
                        w.channelCount !== A &&
                            (j && T(),
                            ({ connectGraph: N, disconnectGraph: T } = p(d, A, w, _, v)),
                            j && N()),
                            (w.channelCount = A);
                    },
                    get channelCountMode() {
                        return w.channelCountMode;
                    },
                    set channelCountMode(A) {
                        if (A === 'clamped-max' || A === 'max') throw i();
                        w.channelCountMode = A;
                    },
                    get channelInterpretation() {
                        return w.channelInterpretation;
                    },
                    set channelInterpretation(A) {
                        w.channelInterpretation = A;
                    },
                    get context() {
                        return w.context;
                    },
                    get inputs() {
                        return [w];
                    },
                    get numberOfInputs() {
                        return w.numberOfInputs;
                    },
                    get numberOfOutputs() {
                        return w.numberOfOutputs;
                    },
                    get pan() {
                        return _.gain;
                    },
                    addEventListener(...A) {
                        return w.addEventListener(A[0], A[1], A[2]);
                    },
                    dispatchEvent(...A) {
                        return w.dispatchEvent(A[0]);
                    },
                    removeEventListener(...A) {
                        return w.removeEventListener(A[0], A[1], A[2]);
                    },
                };
                let j = !1;
                const x = () => {
                        N(), (j = !0);
                    },
                    I = () => {
                        T(), (j = !1);
                    };
                return r(Sn(M, v), x, I);
            };
        },
        pd = (n, t, e, s, i, r, a) => (o, c) => {
            const u = o.createWaveShaper();
            if (
                r !== null &&
                r.name === 'webkitAudioContext' &&
                o.createGain().gain.automationRate === void 0
            )
                return e(o, c);
            St(u, c);
            const l =
                c.curve === null || c.curve instanceof Float32Array
                    ? c.curve
                    : new Float32Array(c.curve);
            if (l !== null && l.length < 2) throw t();
            ht(u, { curve: l }, 'curve'), ht(u, c, 'oversample');
            let h = null,
                f = !1;
            return (
                a(
                    u,
                    'curve',
                    (m) => () => m.call(u),
                    (m) => (g) => (
                        m.call(u, g),
                        f &&
                            (s(g) && h === null
                                ? (h = n(o, u))
                                : !s(g) && h !== null && (h(), (h = null))),
                        g
                    )
                ),
                i(
                    u,
                    () => {
                        (f = !0), s(u.curve) && (h = n(o, u));
                    },
                    () => {
                        (f = !1), h !== null && (h(), (h = null));
                    }
                )
            );
        },
        md = (n, t, e, s, i) => (r, { curve: a, oversample: o, ...c }) => {
            const u = r.createWaveShaper(),
                l = r.createWaveShaper();
            St(u, c), St(l, c);
            const h = e(r, { ...c, gain: 1 }),
                f = e(r, { ...c, gain: -1 }),
                p = e(r, { ...c, gain: 1 }),
                d = e(r, { ...c, gain: -1 });
            let m = null,
                g = !1,
                y = null;
            const S = {
                get bufferSize() {},
                get channelCount() {
                    return u.channelCount;
                },
                set channelCount(_) {
                    (h.channelCount = _),
                        (f.channelCount = _),
                        (u.channelCount = _),
                        (p.channelCount = _),
                        (l.channelCount = _),
                        (d.channelCount = _);
                },
                get channelCountMode() {
                    return u.channelCountMode;
                },
                set channelCountMode(_) {
                    (h.channelCountMode = _),
                        (f.channelCountMode = _),
                        (u.channelCountMode = _),
                        (p.channelCountMode = _),
                        (l.channelCountMode = _),
                        (d.channelCountMode = _);
                },
                get channelInterpretation() {
                    return u.channelInterpretation;
                },
                set channelInterpretation(_) {
                    (h.channelInterpretation = _),
                        (f.channelInterpretation = _),
                        (u.channelInterpretation = _),
                        (p.channelInterpretation = _),
                        (l.channelInterpretation = _),
                        (d.channelInterpretation = _);
                },
                get context() {
                    return u.context;
                },
                get curve() {
                    return y;
                },
                set curve(_) {
                    if (_ !== null && _.length < 2) throw t();
                    if (_ === null) (u.curve = _), (l.curve = _);
                    else {
                        const N = _.length,
                            T = new Float32Array(N + 2 - (N % 2)),
                            M = new Float32Array(N + 2 - (N % 2));
                        (T[0] = _[0]), (M[0] = -_[N - 1]);
                        const j = Math.ceil((N + 1) / 2),
                            x = (N + 1) / 2 - 1;
                        for (let I = 1; I < j; I += 1) {
                            const A = (I / j) * x,
                                C = Math.floor(A),
                                D = Math.ceil(A);
                            (T[I] = C === D ? _[C] : (1 - (A - C)) * _[C] + (1 - (D - A)) * _[D]),
                                (M[I] =
                                    C === D
                                        ? -_[N - 1 - C]
                                        : -((1 - (A - C)) * _[N - 1 - C]) -
                                          (1 - (D - A)) * _[N - 1 - D]);
                        }
                        (T[j] = N % 2 === 1 ? _[j - 1] : (_[j - 2] + _[j - 1]) / 2),
                            (u.curve = T),
                            (l.curve = M);
                    }
                    (y = _),
                        g && (s(y) && m === null ? (m = n(r, h)) : m !== null && (m(), (m = null)));
                },
                get inputs() {
                    return [h];
                },
                get numberOfInputs() {
                    return u.numberOfInputs;
                },
                get numberOfOutputs() {
                    return u.numberOfOutputs;
                },
                get oversample() {
                    return u.oversample;
                },
                set oversample(_) {
                    (u.oversample = _), (l.oversample = _);
                },
                addEventListener(..._) {
                    return h.addEventListener(_[0], _[1], _[2]);
                },
                dispatchEvent(..._) {
                    return h.dispatchEvent(_[0]);
                },
                removeEventListener(..._) {
                    return h.removeEventListener(_[0], _[1], _[2]);
                },
            };
            a !== null && (S.curve = a instanceof Float32Array ? a : new Float32Array(a)),
                o !== S.oversample && (S.oversample = o);
            const v = () => {
                    h.connect(u).connect(p),
                        h
                            .connect(f)
                            .connect(l)
                            .connect(d)
                            .connect(p),
                        (g = !0),
                        s(y) && (m = n(r, h));
                },
                w = () => {
                    h.disconnect(u),
                        u.disconnect(p),
                        h.disconnect(f),
                        f.disconnect(l),
                        l.disconnect(d),
                        d.disconnect(p),
                        (g = !1),
                        m !== null && (m(), (m = null));
                };
            return i(Sn(S, p), v, w);
        },
        Pt = () => new DOMException('', 'NotSupportedError'),
        gd = { numberOfChannels: 1 },
        Md = (n, t, e, s, i) =>
            class extends n {
                constructor(a, o, c) {
                    let u;
                    if (typeof a == 'number' && o !== void 0 && c !== void 0)
                        u = { length: o, numberOfChannels: a, sampleRate: c };
                    else if (typeof a == 'object') u = a;
                    else throw new Error('The given parameters are not valid.');
                    const { length: l, numberOfChannels: h, sampleRate: f } = { ...gd, ...u },
                        p = s(h, l, f);
                    t(es, () => es(p)) ||
                        p.addEventListener(
                            'statechange',
                            (() => {
                                let d = 0;
                                const m = (g) => {
                                    this._state === 'running' &&
                                        (d > 0
                                            ? (p.removeEventListener('statechange', m),
                                              g.stopImmediatePropagation(),
                                              this._waitForThePromiseToSettle(g))
                                            : (d += 1));
                                };
                                return m;
                            })()
                        ),
                        super(p, h),
                        (this._length = l),
                        (this._nativeOfflineAudioContext = p),
                        (this._state = null);
                }
                get length() {
                    return this._nativeOfflineAudioContext.length === void 0
                        ? this._length
                        : this._nativeOfflineAudioContext.length;
                }
                get state() {
                    return this._state === null
                        ? this._nativeOfflineAudioContext.state
                        : this._state;
                }
                startRendering() {
                    return this._state === 'running'
                        ? Promise.reject(e())
                        : ((this._state = 'running'),
                          i(this.destination, this._nativeOfflineAudioContext).finally(() => {
                              (this._state = null), Yo(this);
                          }));
                }
                _waitForThePromiseToSettle(a) {
                    this._state === null
                        ? this._nativeOfflineAudioContext.dispatchEvent(a)
                        : setTimeout(() => this._waitForThePromiseToSettle(a));
                }
            },
        yd = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            detune: 0,
            frequency: 440,
            periodicWave: void 0,
            type: 'sine',
        },
        _d = (n, t, e, s, i, r, a) =>
            class extends n {
                constructor(c, u) {
                    const l = i(c),
                        h = { ...yd, ...u },
                        f = e(l, h),
                        p = r(l),
                        d = p ? s() : null,
                        m = c.sampleRate / 2;
                    super(c, !1, f, d),
                        (this._detune = t(this, p, f.detune, 153600, -153600)),
                        (this._frequency = t(this, p, f.frequency, m, -m)),
                        (this._nativeOscillatorNode = f),
                        (this._onended = null),
                        (this._oscillatorNodeRenderer = d),
                        this._oscillatorNodeRenderer !== null &&
                            h.periodicWave !== void 0 &&
                            (this._oscillatorNodeRenderer.periodicWave = h.periodicWave);
                }
                get detune() {
                    return this._detune;
                }
                get frequency() {
                    return this._frequency;
                }
                get onended() {
                    return this._onended;
                }
                set onended(c) {
                    const u = typeof c == 'function' ? a(this, c) : null;
                    this._nativeOscillatorNode.onended = u;
                    const l = this._nativeOscillatorNode.onended;
                    this._onended = l !== null && l === u ? c : l;
                }
                get type() {
                    return this._nativeOscillatorNode.type;
                }
                set type(c) {
                    (this._nativeOscillatorNode.type = c),
                        this._oscillatorNodeRenderer !== null &&
                            (this._oscillatorNodeRenderer.periodicWave = null);
                }
                setPeriodicWave(c) {
                    this._nativeOscillatorNode.setPeriodicWave(c),
                        this._oscillatorNodeRenderer !== null &&
                            (this._oscillatorNodeRenderer.periodicWave = c);
                }
                start(c = 0) {
                    if (
                        (this._nativeOscillatorNode.start(c),
                        this._oscillatorNodeRenderer !== null &&
                            (this._oscillatorNodeRenderer.start = c),
                        this.context.state !== 'closed')
                    ) {
                        Nn(this);
                        const u = () => {
                            this._nativeOscillatorNode.removeEventListener('ended', u),
                                Se(this) && Xn(this);
                        };
                        this._nativeOscillatorNode.addEventListener('ended', u);
                    }
                }
                stop(c = 0) {
                    this._nativeOscillatorNode.stop(c),
                        this._oscillatorNodeRenderer !== null &&
                            (this._oscillatorNodeRenderer.stop = c);
                }
            },
        Td = (n, t, e, s, i) => () => {
            const r = new WeakMap();
            let a = null,
                o = null,
                c = null;
            const u = async (l, h) => {
                let f = e(l);
                const p = Ct(f, h);
                if (!p) {
                    const d = {
                        channelCount: f.channelCount,
                        channelCountMode: f.channelCountMode,
                        channelInterpretation: f.channelInterpretation,
                        detune: f.detune.value,
                        frequency: f.frequency.value,
                        periodicWave: a === null ? void 0 : a,
                        type: f.type,
                    };
                    (f = t(h, d)), o !== null && f.start(o), c !== null && f.stop(c);
                }
                return (
                    r.set(h, f),
                    p
                        ? (await n(h, l.detune, f.detune), await n(h, l.frequency, f.frequency))
                        : (await s(h, l.detune, f.detune), await s(h, l.frequency, f.frequency)),
                    await i(l, h, f),
                    f
                );
            };
            return {
                set periodicWave(l) {
                    a = l;
                },
                set start(l) {
                    o = l;
                },
                set stop(l) {
                    c = l;
                },
                render(l, h) {
                    const f = r.get(h);
                    return f !== void 0 ? Promise.resolve(f) : u(l, h);
                },
            };
        },
        Nd = {
            channelCount: 2,
            channelCountMode: 'clamped-max',
            channelInterpretation: 'speakers',
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            coneOuterGain: 0,
            distanceModel: 'inverse',
            maxDistance: 1e4,
            orientationX: 1,
            orientationY: 0,
            orientationZ: 0,
            panningModel: 'equalpower',
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            refDistance: 1,
            rolloffFactor: 1,
        },
        Id = (n, t, e, s, i, r, a) =>
            class extends n {
                constructor(c, u) {
                    const l = i(c),
                        h = { ...Nd, ...u },
                        f = e(l, h),
                        p = r(l),
                        d = p ? s() : null;
                    super(c, !1, f, d),
                        (this._nativePannerNode = f),
                        (this._orientationX = t(this, p, f.orientationX, kt, Vt)),
                        (this._orientationY = t(this, p, f.orientationY, kt, Vt)),
                        (this._orientationZ = t(this, p, f.orientationZ, kt, Vt)),
                        (this._positionX = t(this, p, f.positionX, kt, Vt)),
                        (this._positionY = t(this, p, f.positionY, kt, Vt)),
                        (this._positionZ = t(this, p, f.positionZ, kt, Vt)),
                        a(this, 1);
                }
                get coneInnerAngle() {
                    return this._nativePannerNode.coneInnerAngle;
                }
                set coneInnerAngle(c) {
                    this._nativePannerNode.coneInnerAngle = c;
                }
                get coneOuterAngle() {
                    return this._nativePannerNode.coneOuterAngle;
                }
                set coneOuterAngle(c) {
                    this._nativePannerNode.coneOuterAngle = c;
                }
                get coneOuterGain() {
                    return this._nativePannerNode.coneOuterGain;
                }
                set coneOuterGain(c) {
                    this._nativePannerNode.coneOuterGain = c;
                }
                get distanceModel() {
                    return this._nativePannerNode.distanceModel;
                }
                set distanceModel(c) {
                    this._nativePannerNode.distanceModel = c;
                }
                get maxDistance() {
                    return this._nativePannerNode.maxDistance;
                }
                set maxDistance(c) {
                    this._nativePannerNode.maxDistance = c;
                }
                get orientationX() {
                    return this._orientationX;
                }
                get orientationY() {
                    return this._orientationY;
                }
                get orientationZ() {
                    return this._orientationZ;
                }
                get panningModel() {
                    return this._nativePannerNode.panningModel;
                }
                set panningModel(c) {
                    this._nativePannerNode.panningModel = c;
                }
                get positionX() {
                    return this._positionX;
                }
                get positionY() {
                    return this._positionY;
                }
                get positionZ() {
                    return this._positionZ;
                }
                get refDistance() {
                    return this._nativePannerNode.refDistance;
                }
                set refDistance(c) {
                    this._nativePannerNode.refDistance = c;
                }
                get rolloffFactor() {
                    return this._nativePannerNode.rolloffFactor;
                }
                set rolloffFactor(c) {
                    this._nativePannerNode.rolloffFactor = c;
                }
            },
        Sd = (n, t, e, s, i, r, a, o, c, u) => () => {
            const l = new WeakMap();
            let h = null;
            const f = async (p, d) => {
                let m = null,
                    g = r(p);
                const y = {
                        channelCount: g.channelCount,
                        channelCountMode: g.channelCountMode,
                        channelInterpretation: g.channelInterpretation,
                    },
                    S = {
                        ...y,
                        coneInnerAngle: g.coneInnerAngle,
                        coneOuterAngle: g.coneOuterAngle,
                        coneOuterGain: g.coneOuterGain,
                        distanceModel: g.distanceModel,
                        maxDistance: g.maxDistance,
                        panningModel: g.panningModel,
                        refDistance: g.refDistance,
                        rolloffFactor: g.rolloffFactor,
                    },
                    v = Ct(g, d);
                if ('bufferSize' in g) m = s(d, { ...y, gain: 1 });
                else if (!v) {
                    const w = {
                        ...S,
                        orientationX: g.orientationX.value,
                        orientationY: g.orientationY.value,
                        orientationZ: g.orientationZ.value,
                        positionX: g.positionX.value,
                        positionY: g.positionY.value,
                        positionZ: g.positionZ.value,
                    };
                    g = i(d, w);
                }
                if ((l.set(d, m === null ? g : m), m !== null)) {
                    if (h === null) {
                        if (a === null)
                            throw new Error('Missing the native OfflineAudioContext constructor.');
                        const I = new a(6, p.context.length, d.sampleRate),
                            A = t(I, {
                                channelCount: 1,
                                channelCountMode: 'explicit',
                                channelInterpretation: 'speakers',
                                numberOfInputs: 6,
                            });
                        A.connect(I.destination),
                            (h = (async () => {
                                const C = await Promise.all(
                                    [
                                        p.orientationX,
                                        p.orientationY,
                                        p.orientationZ,
                                        p.positionX,
                                        p.positionY,
                                        p.positionZ,
                                    ].map(async (D, E) => {
                                        const z = e(I, {
                                            channelCount: 1,
                                            channelCountMode: 'explicit',
                                            channelInterpretation: 'discrete',
                                            offset: E === 0 ? 1 : 0,
                                        });
                                        return await o(I, D, z.offset), z;
                                    })
                                );
                                for (let D = 0; D < 6; D += 1) C[D].connect(A, 0, D), C[D].start(0);
                                return u(I);
                            })());
                    }
                    const w = await h,
                        _ = s(d, { ...y, gain: 1 });
                    await c(p, d, _);
                    const N = [];
                    for (let I = 0; I < w.numberOfChannels; I += 1) N.push(w.getChannelData(I));
                    let T = [N[0][0], N[1][0], N[2][0]],
                        M = [N[3][0], N[4][0], N[5][0]],
                        j = s(d, { ...y, gain: 1 }),
                        x = i(d, {
                            ...S,
                            orientationX: T[0],
                            orientationY: T[1],
                            orientationZ: T[2],
                            positionX: M[0],
                            positionY: M[1],
                            positionZ: M[2],
                        });
                    _.connect(j).connect(x.inputs[0]), x.connect(m);
                    for (let I = 128; I < w.length; I += 128) {
                        const A = [N[0][I], N[1][I], N[2][I]],
                            C = [N[3][I], N[4][I], N[5][I]];
                        if (A.some((D, E) => D !== T[E]) || C.some((D, E) => D !== M[E])) {
                            (T = A), (M = C);
                            const D = I / d.sampleRate;
                            j.gain.setValueAtTime(0, D),
                                (j = s(d, { ...y, gain: 0 })),
                                (x = i(d, {
                                    ...S,
                                    orientationX: T[0],
                                    orientationY: T[1],
                                    orientationZ: T[2],
                                    positionX: M[0],
                                    positionY: M[1],
                                    positionZ: M[2],
                                })),
                                j.gain.setValueAtTime(1, D),
                                _.connect(j).connect(x.inputs[0]),
                                x.connect(m);
                        }
                    }
                    return m;
                }
                return (
                    v
                        ? (await n(d, p.orientationX, g.orientationX),
                          await n(d, p.orientationY, g.orientationY),
                          await n(d, p.orientationZ, g.orientationZ),
                          await n(d, p.positionX, g.positionX),
                          await n(d, p.positionY, g.positionY),
                          await n(d, p.positionZ, g.positionZ))
                        : (await o(d, p.orientationX, g.orientationX),
                          await o(d, p.orientationY, g.orientationY),
                          await o(d, p.orientationZ, g.orientationZ),
                          await o(d, p.positionX, g.positionX),
                          await o(d, p.positionY, g.positionY),
                          await o(d, p.positionZ, g.positionZ)),
                    In(g) ? await c(p, d, g.inputs[0]) : await c(p, d, g),
                    g
                );
            };
            return {
                render(p, d) {
                    const m = l.get(d);
                    return m !== void 0 ? Promise.resolve(m) : f(p, d);
                },
            };
        },
        jd = { disableNormalization: !1 },
        Ad = (n, t, e, s) =>
            class Uc {
                constructor(r, a) {
                    const o = t(r),
                        c = s({ ...jd, ...a }),
                        u = n(o, c);
                    return e.add(u), u;
                }
                static [Symbol.hasInstance](r) {
                    return (
                        (r !== null &&
                            typeof r == 'object' &&
                            Object.getPrototypeOf(r) === Uc.prototype) ||
                        e.has(r)
                    );
                }
            },
        xd = (n, t) => (e, s, i) => (n(s).replay(i), t(s, e, i)),
        vd = (n, t, e) => async (s, i, r) => {
            const a = n(s);
            await Promise.all(
                a.activeInputs
                    .map((o, c) =>
                        Array.from(o).map(async ([u, l]) => {
                            const f = await t(u).render(u, i),
                                p = s.context.destination;
                            !e(u) && (s !== p || !e(s)) && f.connect(r, l, c);
                        })
                    )
                    .reduce((o, c) => [...o, ...c], [])
            );
        },
        Ld = (n, t, e) => async (s, i, r) => {
            const a = t(s);
            await Promise.all(
                Array.from(a.activeInputs).map(async ([o, c]) => {
                    const l = await n(o).render(o, i);
                    e(o) || l.connect(r, c);
                })
            );
        },
        wd = (n, t, e, s) => (i) =>
            n(es, () => es(i))
                ? Promise.resolve(n(s, s)).then((r) => {
                      if (!r) {
                          const a = e(i, 512, 0, 1);
                          (i.oncomplete = () => {
                              (a.onaudioprocess = null), a.disconnect();
                          }),
                              (a.onaudioprocess = () => i.currentTime),
                              a.connect(i.destination);
                      }
                      return i.startRendering();
                  })
                : new Promise((r) => {
                      const a = t(i, {
                          channelCount: 1,
                          channelCountMode: 'explicit',
                          channelInterpretation: 'discrete',
                          gain: 0,
                      });
                      (i.oncomplete = (o) => {
                          a.disconnect(), r(o.renderedBuffer);
                      }),
                          a.connect(i.destination),
                          i.startRendering();
                  }),
        Dd = (n) => (t, e) => {
            n.set(t, e);
        },
        bd = (n) => (t, e) => n.set(t, e),
        Cd = (n, t, e, s, i, r, a, o) => (c, u) =>
            e(c)
                .render(c, u)
                .then(() => Promise.all(Array.from(s(u)).map((l) => e(l).render(l, u))))
                .then(() => i(u))
                .then(
                    (l) => (
                        typeof l.copyFromChannel != 'function'
                            ? (a(l), nr(l))
                            : t(r, () => r(l)) || o(l),
                        n.add(l),
                        l
                    )
                ),
        Ed = {
            channelCount: 2,
            channelCountMode: 'explicit',
            channelInterpretation: 'speakers',
            pan: 0,
        },
        Od = (n, t, e, s, i, r) =>
            class extends n {
                constructor(o, c) {
                    const u = i(o),
                        l = { ...Ed, ...c },
                        h = e(u, l),
                        f = r(u),
                        p = f ? s() : null;
                    super(o, !1, h, p), (this._pan = t(this, f, h.pan));
                }
                get pan() {
                    return this._pan;
                }
            },
        kd = (n, t, e, s, i) => () => {
            const r = new WeakMap(),
                a = async (o, c) => {
                    let u = e(o);
                    const l = Ct(u, c);
                    if (!l) {
                        const h = {
                            channelCount: u.channelCount,
                            channelCountMode: u.channelCountMode,
                            channelInterpretation: u.channelInterpretation,
                            pan: u.pan.value,
                        };
                        u = t(c, h);
                    }
                    return (
                        r.set(c, u),
                        l ? await n(c, o.pan, u.pan) : await s(c, o.pan, u.pan),
                        In(u) ? await i(o, c, u.inputs[0]) : await i(o, c, u),
                        u
                    );
                };
            return {
                render(o, c) {
                    const u = r.get(c);
                    return u !== void 0 ? Promise.resolve(u) : a(o, c);
                },
            };
        },
        zd = (n) => () => {
            if (n === null) return !1;
            try {
                new n({ length: 1, sampleRate: 44100 });
            } catch {
                return !1;
            }
            return !0;
        },
        Pd = (n, t) => async () => {
            if (n === null) return !0;
            if (t === null) return !1;
            const e = new Blob(
                    [
                        'class A extends AudioWorkletProcessor{process(i){this.port.postMessage(i,[i[0][0].buffer])}}registerProcessor("a",A)',
                    ],
                    { type: 'application/javascript; charset=utf-8' }
                ),
                s = new t(1, 128, 44100),
                i = URL.createObjectURL(e);
            let r = !1,
                a = !1;
            try {
                await s.audioWorklet.addModule(i);
                const o = new n(s, 'a', { numberOfOutputs: 0 }),
                    c = s.createOscillator();
                (o.port.onmessage = () => (r = !0)),
                    (o.onprocessorerror = () => (a = !0)),
                    c.connect(o),
                    c.start(0),
                    await s.startRendering(),
                    await new Promise((u) => setTimeout(u));
            } catch {
            } finally {
                URL.revokeObjectURL(i);
            }
            return r && !a;
        },
        Rd = (n, t) => () => {
            if (t === null) return Promise.resolve(!1);
            const e = new t(1, 1, 44100),
                s = n(e, {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                    gain: 0,
                });
            return new Promise((i) => {
                (e.oncomplete = () => {
                    s.disconnect(), i(e.currentTime !== 0);
                }),
                    e.startRendering();
            });
        },
        Yd = () => new DOMException('', 'UnknownError'),
        Ud = {
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            curve: null,
            oversample: 'none',
        },
        Vd = (n, t, e, s, i, r, a) =>
            class extends n {
                constructor(c, u) {
                    const l = i(c),
                        h = { ...Ud, ...u },
                        f = e(l, h),
                        d = r(l) ? s() : null;
                    super(c, !0, f, d),
                        (this._isCurveNullified = !1),
                        (this._nativeWaveShaperNode = f),
                        a(this, 1);
                }
                get curve() {
                    return this._isCurveNullified ? null : this._nativeWaveShaperNode.curve;
                }
                set curve(c) {
                    if (c === null)
                        (this._isCurveNullified = !0),
                            (this._nativeWaveShaperNode.curve = new Float32Array([0, 0]));
                    else {
                        if (c.length < 2) throw t();
                        (this._isCurveNullified = !1), (this._nativeWaveShaperNode.curve = c);
                    }
                }
                get oversample() {
                    return this._nativeWaveShaperNode.oversample;
                }
                set oversample(c) {
                    this._nativeWaveShaperNode.oversample = c;
                }
            },
        Wd = (n, t, e) => () => {
            const s = new WeakMap(),
                i = async (r, a) => {
                    let o = t(r);
                    if (!Ct(o, a)) {
                        const u = {
                            channelCount: o.channelCount,
                            channelCountMode: o.channelCountMode,
                            channelInterpretation: o.channelInterpretation,
                            curve: o.curve,
                            oversample: o.oversample,
                        };
                        o = n(a, u);
                    }
                    return s.set(a, o), In(o) ? await e(r, a, o.inputs[0]) : await e(r, a, o), o;
                };
            return {
                render(r, a) {
                    const o = s.get(a);
                    return o !== void 0 ? Promise.resolve(o) : i(r, a);
                },
            };
        },
        Fd = () => (typeof window > 'u' ? null : window),
        Gd = (n, t) => (e) => {
            (e.copyFromChannel = (s, i, r = 0) => {
                const a = n(r),
                    o = n(i);
                if (o >= e.numberOfChannels) throw t();
                const c = e.length,
                    u = e.getChannelData(o),
                    l = s.length;
                for (let h = a < 0 ? -a : 0; h + a < c && h < l; h += 1) s[h] = u[h + a];
            }),
                (e.copyToChannel = (s, i, r = 0) => {
                    const a = n(r),
                        o = n(i);
                    if (o >= e.numberOfChannels) throw t();
                    const c = e.length,
                        u = e.getChannelData(o),
                        l = s.length;
                    for (let h = a < 0 ? -a : 0; h + a < c && h < l; h += 1) u[h + a] = s[h];
                });
        },
        Bd = (n) => (t) => {
            (t.copyFromChannel = ((e) => (s, i, r = 0) => {
                const a = n(r),
                    o = n(i);
                if (a < t.length) return e.call(t, s, o, a);
            })(t.copyFromChannel)),
                (t.copyToChannel = ((e) => (s, i, r = 0) => {
                    const a = n(r),
                        o = n(i);
                    if (a < t.length) return e.call(t, s, o, a);
                })(t.copyToChannel));
        },
        Qd = (n) => (t, e) => {
            const s = e.createBuffer(1, 1, 44100);
            t.buffer === null && (t.buffer = s),
                n(
                    t,
                    'buffer',
                    (i) => () => {
                        const r = i.call(t);
                        return r === s ? null : r;
                    },
                    (i) => (r) => i.call(t, r === null ? s : r)
                );
        },
        Zd = (n, t) => (e, s) => {
            (s.channelCount = 1),
                (s.channelCountMode = 'explicit'),
                Object.defineProperty(s, 'channelCount', {
                    get: () => 1,
                    set: () => {
                        throw n();
                    },
                }),
                Object.defineProperty(s, 'channelCountMode', {
                    get: () => 'explicit',
                    set: () => {
                        throw n();
                    },
                });
            const i = e.createBufferSource();
            t(
                s,
                () => {
                    const o = s.numberOfInputs;
                    for (let c = 0; c < o; c += 1) i.connect(s, 0, c);
                },
                () => i.disconnect(s)
            );
        },
        ea = (n, t, e) =>
            n.copyFromChannel === void 0 ? n.getChannelData(e)[0] : (n.copyFromChannel(t, e), t[0]),
        na = (n) => {
            if (n === null) return !1;
            const t = n.length;
            return t % 2 !== 0 ? n[Math.floor(t / 2)] !== 0 : n[t / 2 - 1] + n[t / 2] !== 0;
        },
        is = (n, t, e, s) => {
            let i = n;
            for (; !i.hasOwnProperty(t); ) i = Object.getPrototypeOf(i);
            const { get: r, set: a } = Object.getOwnPropertyDescriptor(i, t);
            Object.defineProperty(n, t, { get: e(r), set: s(a) });
        },
        Hd = (n) => ({
            ...n,
            outputChannelCount:
                n.outputChannelCount !== void 0
                    ? n.outputChannelCount
                    : n.numberOfInputs === 1 && n.numberOfOutputs === 1
                    ? [n.channelCount]
                    : Array.from({ length: n.numberOfOutputs }, () => 1),
        }),
        $d = (n) => ({ ...n, channelCount: n.numberOfOutputs }),
        qd = (n) => {
            const { imag: t, real: e } = n;
            return t === void 0
                ? e === void 0
                    ? { ...n, imag: [0, 0], real: [0, 0] }
                    : { ...n, imag: Array.from(e, () => 0), real: e }
                : e === void 0
                ? { ...n, imag: t, real: Array.from(t, () => 0) }
                : { ...n, imag: t, real: e };
        },
        sa = (n, t, e) => {
            try {
                n.setValueAtTime(t, e);
            } catch (s) {
                if (s.code !== 9) throw s;
                sa(n, t, e + 1e-7);
            }
        },
        Xd = (n) => {
            const t = n.createBufferSource();
            t.start();
            try {
                t.start();
            } catch {
                return !0;
            }
            return !1;
        },
        Jd = (n) => {
            const t = n.createBufferSource(),
                e = n.createBuffer(1, 1, 44100);
            t.buffer = e;
            try {
                t.start(0, 1);
            } catch {
                return !1;
            }
            return !0;
        },
        Kd = (n) => {
            const t = n.createBufferSource();
            t.start();
            try {
                t.stop();
            } catch {
                return !1;
            }
            return !0;
        },
        ur = (n) => {
            const t = n.createOscillator();
            try {
                t.start(-1);
            } catch (e) {
                return e instanceof RangeError;
            }
            return !1;
        },
        ia = (n) => {
            const t = n.createBuffer(1, 1, 44100),
                e = n.createBufferSource();
            (e.buffer = t), e.start(), e.stop();
            try {
                return e.stop(), !0;
            } catch {
                return !1;
            }
        },
        lr = (n) => {
            const t = n.createOscillator();
            try {
                t.stop(-1);
            } catch (e) {
                return e instanceof RangeError;
            }
            return !1;
        },
        tf = (n) => {
            const { port1: t, port2: e } = new MessageChannel();
            try {
                t.postMessage(n);
            } finally {
                t.close(), e.close();
            }
        },
        ef = (n) => {
            n.start = ((t) => (e = 0, s = 0, i) => {
                const r = n.buffer,
                    a = r === null ? s : Math.min(r.duration, s);
                r !== null && a > r.duration - 0.5 / n.context.sampleRate
                    ? t.call(n, e, 0, 0)
                    : t.call(n, e, a, i);
            })(n.start);
        },
        ra = (n, t) => {
            const e = t.createGain();
            n.connect(e);
            const s = ((i) => () => {
                i.call(n, e), n.removeEventListener('ended', s);
            })(n.disconnect);
            n.addEventListener('ended', s),
                Sn(n, e),
                (n.stop = ((i) => {
                    let r = !1;
                    return (a = 0) => {
                        if (r)
                            try {
                                i.call(n, a);
                            } catch {
                                e.gain.setValueAtTime(0, a);
                            }
                        else i.call(n, a), (r = !0);
                    };
                })(n.stop));
        },
        jn = (n, t) => (e) => {
            const s = { value: n };
            return (
                Object.defineProperties(e, { currentTarget: s, target: s }),
                typeof t == 'function' ? t.call(n, e) : t.handleEvent.call(n, e)
            );
        },
        nf = Iu(Je),
        sf = Lu(Je),
        rf = Ul(Ws),
        oa = new WeakMap(),
        of = ih(oa),
        ie = gl(new Map(), new WeakMap()),
        de = Fd(),
        aa = Oh(ie, he),
        hr = sh(zt),
        vt = vd(zt, hr, Ke),
        af = Eu(aa, ct, vt),
        at = ah(Vs),
        je = ad(de),
        nt = jh(je),
        ca = new WeakMap(),
        ua = ql(jn),
        rs = Rh(de),
        dr = Th(rs),
        fr = Nh(de),
        la = Ih(de),
        os = Uh(de),
        Mt = il(
            Su(wo),
            vu(nf, sf, Bs, rf, Qs, zt, of, qn, ct, Je, Se, Ke, Zs),
            ie,
            mh(Ji, Qs, zt, ct, ts, Se),
            he,
            Js,
            Pt,
            zl(Bs, Ji, zt, ct, ts, at, Se, nt),
            Fl(ca, zt, se),
            ua,
            at,
            dr,
            fr,
            la,
            nt,
            os
        ),
        cf = Cu(Mt, af, he, aa, at, nt),
        pr = new WeakSet(),
        ha = kh(de),
        da = wl(new Uint32Array(1)),
        mr = Gd(da, he),
        gr = Bd(da),
        uf = ku(pr, ie, Pt, ha, je, zd(ha), mr, gr),
        Ks = wu(Wt),
        fa = Ld(hr, Jn, Ke),
        fe = Sl(fa),
        An = Ph(Ks, ie, Xd, Jd, Kd, ur, ia, lr, ef, Qd(is), ra),
        pe = xd(rh(Jn), fa),
        lf = Ru(fe, An, ct, pe, vt),
        re = rl(ju(Do), ca, Xi, ol, gu, Mu, yu, _u, Tu, Qi, jo, rs, sa),
        hf = Pu(Mt, lf, re, At, An, at, nt, jn),
        df = Zu(Mt, Hu, he, At, Yh(Wt, is), at, nt, vt),
        ff = ml(fe, Jo, ct, pe, vt),
        tn = bd(oa),
        pf = pl(Mt, re, ff, Js, Jo, at, nt, tn),
        Pe = Ch(Je, fr),
        mf = Zd(At, Pe),
        Re = Zh(rs, mf),
        gf = _l(Re, ct, vt),
        Mf = yl(Mt, gf, Re, at, nt),
        yf = Il(ns, ct, vt),
        _f = Nl(Mt, yf, ns, at, nt, $d),
        Tf = qh(Ks, An, Wt, Pe),
        xn = $h(Ks, ie, Tf, ur, lr),
        Nf = Ll(fe, xn, ct, pe, vt),
        If = vl(Mt, re, Nf, xn, at, nt, jn),
        pa = Xh(Pt, is),
        Sf = Cl(pa, ct, vt),
        jf = bl(Mt, Sf, pa, at, nt, tn),
        Af = Yl(fe, Ko, ct, pe, vt),
        xf = Rl(Mt, re, Af, Ko, at, nt, tn),
        ma = Jh(Pt),
        vf = Zl(fe, ma, ct, pe, vt),
        Lf = Ql(Mt, re, vf, ma, Pt, at, nt, tn),
        wf = eh(fe, Wt, ct, pe, vt),
        Df = th(Mt, re, wf, Wt, at, nt),
        bf = nd(Js, At, ss, Pt),
        ti = wd(ie, Wt, ss, Rd(Wt, je)),
        Cf = ph(An, ct, je, vt, ti),
        Ef = Kh(bf),
        Of = dh(Mt, Ef, Cf, at, nt, tn),
        kf = $u(re, Re, xn, ss, Pt, ea, nt, is),
        ga = new WeakMap(),
        zf = bh(df, kf, ua, nt, ga, jn),
        Ma = cd(Ks, ie, ur, ia, lr, ra),
        Pf = Td(fe, Ma, ct, pe, vt),
        Rf = _d(Mt, re, Ma, Pf, at, nt, jn),
        ya = Al(An),
        Yf = md(ya, At, Wt, na, Pe),
        ei = pd(ya, At, Yf, na, Pe, rs, is),
        Uf = ld(Bs, At, Re, Wt, ss, ei, Pt, Qs, ea, Pe),
        _a = ud(Uf),
        Vf = Sd(fe, Re, xn, Wt, _a, ct, je, pe, vt, ti),
        Wf = Id(Mt, re, _a, Vf, at, nt, tn),
        Ff = hd(he),
        Gf = Ad(Ff, at, new WeakSet(), qd),
        Bf = fd(Re, ns, Wt, ei, Pt, Pe),
        Ta = dd(Bf, Pt),
        Qf = kd(fe, Ta, ct, pe, vt),
        Zf = Od(Mt, re, Ta, Qf, at, nt),
        Hf = Wd(ei, ct, vt),
        $f = Vd(Mt, At, ei, Hf, at, nt, tn),
        Na = Ah(de),
        Mr = Xl(de),
        Ia = new WeakMap(),
        qf = ch(Ia, je),
        Xf = Na
            ? xu(
                  ie,
                  Pt,
                  $l(de),
                  Mr,
                  Jl(Nu),
                  at,
                  qf,
                  nt,
                  os,
                  new WeakMap(),
                  new WeakMap(),
                  Pd(os, je),
                  de
              )
            : void 0,
        Jf = Sh(dr, nt),
        Kf = kl(pr, ie, Ol, Hl, new WeakSet(), at, Jf, Fs, es, mr, gr),
        Sa = dl(Xf, cf, uf, hf, pf, Mf, _f, If, jf, Kf, xf, Lf, Df, Of, zf, Rf, Wf, Gf, Zf, $f),
        tp = xh(Mt, sd, at, nt),
        ep = Lh(Mt, id, at, nt),
        np = wh(Mt, rd, at, nt),
        sp = od(At, nt),
        ip = Dh(Mt, sp, at),
        rp = Qu(Sa, At, Pt, Yd, tp, ep, np, ip, rs),
        yr = uh(ga),
        op = Du(yr),
        ja = jl(he),
        ap = Vl(yr),
        Aa = Gl(he),
        xa = new WeakMap(),
        cp = nh(xa, se),
        up = Qh(ja, he, At, Re, ns, xn, Wt, ss, Pt, Aa, Mr, cp, Pe),
        lp = Wh(At, up, Wt, Pt, Pe),
        hp = hl(fe, ja, An, Re, ns, xn, Wt, ap, Aa, Mr, ct, os, je, pe, vt, ti),
        dp = oh(Ia),
        fp = Dd(xa),
        va = Na ? cl(op, Mt, re, hp, lp, zt, dp, at, nt, os, Hd, fp, tf, jn) : void 0,
        pp = El(Pt, je),
        mp = Cd(pr, ie, hr, yr, ti, Fs, mr, gr),
        gp = Md(Sa, ie, At, pp, mp),
        Mp = gh(Vs, dr),
        yp = Mh(qi, fr),
        _p = yh(Xi, la),
        Tp = _h(Vs, nt);
    function H(n, t) {
        if (!n) throw new Error(t);
    }
    function Ye(n, t, e = 1 / 0) {
        if (!(t <= n && n <= e))
            throw new RangeError(`Value must be within [${t}, ${e}], got: ${n}`);
    }
    function La(n) {
        !n.isOffline &&
            n.state !== 'running' &&
            Da(
                'The AudioContext is "suspended". Invoke Tone.start() from a user action to start the audio.'
            );
    }
    let wa = console;
    function Np(...n) {
        wa.log(...n);
    }
    function Da(...n) {
        wa.warn(...n);
    }
    function Jt(n) {
        return typeof n > 'u';
    }
    function $(n) {
        return !Jt(n);
    }
    function Ip(n) {
        return typeof n == 'function';
    }
    function en(n) {
        return typeof n == 'number';
    }
    function nn(n) {
        return Object.prototype.toString.call(n) === '[object Object]' && n.constructor === Object;
    }
    function Sp(n) {
        return typeof n == 'boolean';
    }
    function oe(n) {
        return Array.isArray(n);
    }
    function me(n) {
        return typeof n == 'string';
    }
    function ni(n) {
        return me(n) && /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(n);
    }
    function jp(n) {
        return new rp(n);
    }
    function Ap(n, t, e) {
        return new gp(n, t, e);
    }
    const sn = typeof self == 'object' ? self : null,
        xp = sn && (sn.hasOwnProperty('AudioContext') || sn.hasOwnProperty('webkitAudioContext'));
    function vp(n, t, e) {
        return (
            H($(va), 'This node only works in a secure context (https or localhost)'),
            new va(n, t, e)
        );
    }
    function ae(n, t, e, s) {
        var i = arguments.length,
            r = i < 3 ? t : s === null ? (s = Object.getOwnPropertyDescriptor(t, e)) : s,
            a;
        if (typeof Reflect == 'object' && typeof Reflect.decorate == 'function')
            r = Reflect.decorate(n, t, e, s);
        else
            for (var o = n.length - 1; o >= 0; o--)
                (a = n[o]) && (r = (i < 3 ? a(r) : i > 3 ? a(t, e, r) : a(t, e)) || r);
        return i > 3 && r && Object.defineProperty(t, e, r), r;
    }
    function yt(n, t, e, s) {
        function i(r) {
            return r instanceof e
                ? r
                : new e(function(a) {
                      a(r);
                  });
        }
        return new (e || (e = Promise))(function(r, a) {
            function o(l) {
                try {
                    u(s.next(l));
                } catch (h) {
                    a(h);
                }
            }
            function c(l) {
                try {
                    u(s.throw(l));
                } catch (h) {
                    a(h);
                }
            }
            function u(l) {
                l.done ? r(l.value) : i(l.value).then(o, c);
            }
            u((s = s.apply(n, t || [])).next());
        });
    }
    typeof SuppressedError == 'function' && SuppressedError;
    class Lp {
        constructor(t, e, s) {
            (this._callback = t), (this._type = e), (this._updateInterval = s), this._createClock();
        }
        _createWorker() {
            const t = new Blob(
                    [
                        `
			// the initial timeout time
			let timeoutTime =  ${(this._updateInterval * 1e3).toFixed(1)};
			// onmessage callback
			self.onmessage = function(msg){
				timeoutTime = parseInt(msg.data);
			};
			// the tick function which posts a message
			// and schedules a new tick
			function tick(){
				setTimeout(tick, timeoutTime);
				self.postMessage('tick');
			}
			// call tick initially
			tick();
			`,
                    ],
                    { type: 'text/javascript' }
                ),
                e = URL.createObjectURL(t),
                s = new Worker(e);
            (s.onmessage = this._callback.bind(this)), (this._worker = s);
        }
        _createTimeout() {
            this._timeout = setTimeout(() => {
                this._createTimeout(), this._callback();
            }, this._updateInterval * 1e3);
        }
        _createClock() {
            if (this._type === 'worker')
                try {
                    this._createWorker();
                } catch {
                    (this._type = 'timeout'), this._createClock();
                }
            else this._type === 'timeout' && this._createTimeout();
        }
        _disposeClock() {
            this._timeout && (clearTimeout(this._timeout), (this._timeout = 0)),
                this._worker && (this._worker.terminate(), (this._worker.onmessage = null));
        }
        get updateInterval() {
            return this._updateInterval;
        }
        set updateInterval(t) {
            (this._updateInterval = Math.max(t, 0.0029024943310657597)),
                this._type === 'worker' && this._worker.postMessage(Math.max(t * 1e3, 1));
        }
        get type() {
            return this._type;
        }
        set type(t) {
            this._disposeClock(), (this._type = t), this._createClock();
        }
        dispose() {
            this._disposeClock();
        }
    }
    function rn(n) {
        return _p(n);
    }
    function Ue(n) {
        return yp(n);
    }
    function si(n) {
        return Tp(n);
    }
    function vn(n) {
        return Mp(n);
    }
    function ba(n) {
        return n instanceof AudioBuffer;
    }
    function wp(n, t) {
        return n === 'value' || rn(t) || Ue(t) || ba(t);
    }
    function Ln(n, ...t) {
        if (!t.length) return n;
        const e = t.shift();
        if (nn(n) && nn(e))
            for (const s in e)
                wp(s, e[s])
                    ? (n[s] = e[s])
                    : nn(e[s])
                    ? (n[s] || Object.assign(n, { [s]: {} }), Ln(n[s], e[s]))
                    : Object.assign(n, { [s]: e[s] });
        return Ln(n, ...t);
    }
    function Dp(n, t) {
        return n.length === t.length && n.every((e, s) => t[s] === e);
    }
    function k(n, t, e = [], s) {
        const i = {},
            r = Array.from(t);
        if (
            (nn(r[0]) &&
                s &&
                !Reflect.has(r[0], s) &&
                (Object.keys(r[0]).some((o) => Reflect.has(n, o)) ||
                    (Ln(i, { [s]: r[0] }), e.splice(e.indexOf(s), 1), r.shift())),
            r.length === 1 && nn(r[0]))
        )
            Ln(i, r[0]);
        else for (let a = 0; a < e.length; a++) $(r[a]) && (i[e[a]] = r[a]);
        return Ln(n, i);
    }
    function bp(n) {
        return n.constructor.getDefaults();
    }
    function wn(n, t) {
        return Jt(n) ? t : n;
    }
    function Ca(n, t) {
        return (
            t.forEach((e) => {
                Reflect.has(n, e) && delete n[e];
            }),
            n
        );
    }
    /**
     * Tone.js
     * @author Yotam Mann
     * @license http://opensource.org/licenses/MIT MIT License
     * @copyright 2014-2019 Yotam Mann
     */ class Ae {
        constructor() {
            (this.debug = !1), (this._wasDisposed = !1);
        }
        static getDefaults() {
            return {};
        }
        log(...t) {
            (this.debug || (sn && this.toString() === sn.TONE_DEBUG_CLASS)) && Np(this, ...t);
        }
        dispose() {
            return (this._wasDisposed = !0), this;
        }
        get disposed() {
            return this._wasDisposed;
        }
        toString() {
            return this.name;
        }
    }
    Ae.version = No;
    const _r = 1e-6;
    function ii(n, t) {
        return n > t + _r;
    }
    function Tr(n, t) {
        return ii(n, t) || ce(n, t);
    }
    function Ea(n, t) {
        return n + _r < t;
    }
    function ce(n, t) {
        return Math.abs(n - t) < _r;
    }
    function Cp(n, t, e) {
        return Math.max(Math.min(n, e), t);
    }
    class ge extends Ae {
        constructor() {
            super(), (this.name = 'Timeline'), (this._timeline = []);
            const t = k(ge.getDefaults(), arguments, ['memory']);
            (this.memory = t.memory), (this.increasing = t.increasing);
        }
        static getDefaults() {
            return { memory: 1 / 0, increasing: !1 };
        }
        get length() {
            return this._timeline.length;
        }
        add(t) {
            if (
                (H(Reflect.has(t, 'time'), 'Timeline: events must have a time attribute'),
                (t.time = t.time.valueOf()),
                this.increasing && this.length)
            ) {
                const e = this._timeline[this.length - 1];
                H(
                    Tr(t.time, e.time),
                    'The time must be greater than or equal to the last scheduled time'
                ),
                    this._timeline.push(t);
            } else {
                const e = this._search(t.time);
                this._timeline.splice(e + 1, 0, t);
            }
            if (this.length > this.memory) {
                const e = this.length - this.memory;
                this._timeline.splice(0, e);
            }
            return this;
        }
        remove(t) {
            const e = this._timeline.indexOf(t);
            return e !== -1 && this._timeline.splice(e, 1), this;
        }
        get(t, e = 'time') {
            const s = this._search(t, e);
            return s !== -1 ? this._timeline[s] : null;
        }
        peek() {
            return this._timeline[0];
        }
        shift() {
            return this._timeline.shift();
        }
        getAfter(t, e = 'time') {
            const s = this._search(t, e);
            return s + 1 < this._timeline.length ? this._timeline[s + 1] : null;
        }
        getBefore(t) {
            const e = this._timeline.length;
            if (e > 0 && this._timeline[e - 1].time < t) return this._timeline[e - 1];
            const s = this._search(t);
            return s - 1 >= 0 ? this._timeline[s - 1] : null;
        }
        cancel(t) {
            if (this._timeline.length > 1) {
                let e = this._search(t);
                if (e >= 0)
                    if (ce(this._timeline[e].time, t)) {
                        for (let s = e; s >= 0 && ce(this._timeline[s].time, t); s--) e = s;
                        this._timeline = this._timeline.slice(0, e);
                    } else this._timeline = this._timeline.slice(0, e + 1);
                else this._timeline = [];
            } else
                this._timeline.length === 1 &&
                    Tr(this._timeline[0].time, t) &&
                    (this._timeline = []);
            return this;
        }
        cancelBefore(t) {
            const e = this._search(t);
            return e >= 0 && (this._timeline = this._timeline.slice(e + 1)), this;
        }
        previousEvent(t) {
            const e = this._timeline.indexOf(t);
            return e > 0 ? this._timeline[e - 1] : null;
        }
        _search(t, e = 'time') {
            if (this._timeline.length === 0) return -1;
            let s = 0;
            const i = this._timeline.length;
            let r = i;
            if (i > 0 && this._timeline[i - 1][e] <= t) return i - 1;
            for (; s < r; ) {
                let a = Math.floor(s + (r - s) / 2);
                const o = this._timeline[a],
                    c = this._timeline[a + 1];
                if (ce(o[e], t)) {
                    for (let u = a; u < this._timeline.length; u++) {
                        const l = this._timeline[u];
                        if (ce(l[e], t)) a = u;
                        else break;
                    }
                    return a;
                } else {
                    if (Ea(o[e], t) && ii(c[e], t)) return a;
                    ii(o[e], t) ? (r = a) : (s = a + 1);
                }
            }
            return -1;
        }
        _iterate(t, e = 0, s = this._timeline.length - 1) {
            this._timeline.slice(e, s + 1).forEach(t);
        }
        forEach(t) {
            return this._iterate(t), this;
        }
        forEachBefore(t, e) {
            const s = this._search(t);
            return s !== -1 && this._iterate(e, 0, s), this;
        }
        forEachAfter(t, e) {
            const s = this._search(t);
            return this._iterate(e, s + 1), this;
        }
        forEachBetween(t, e, s) {
            let i = this._search(t),
                r = this._search(e);
            return (
                i !== -1 && r !== -1
                    ? (this._timeline[i].time !== t && (i += 1),
                      this._timeline[r].time === e && (r -= 1),
                      this._iterate(s, i, r))
                    : i === -1 && this._iterate(s, 0, r),
                this
            );
        }
        forEachFrom(t, e) {
            let s = this._search(t);
            for (; s >= 0 && this._timeline[s].time >= t; ) s--;
            return this._iterate(e, s + 1), this;
        }
        forEachAtTime(t, e) {
            const s = this._search(t);
            if (s !== -1 && ce(this._timeline[s].time, t)) {
                let i = s;
                for (let r = s; r >= 0 && ce(this._timeline[r].time, t); r--) i = r;
                this._iterate(
                    (r) => {
                        e(r);
                    },
                    i,
                    s
                );
            }
            return this;
        }
        dispose() {
            return super.dispose(), (this._timeline = []), this;
        }
    }
    const Oa = [];
    function ri(n) {
        Oa.push(n);
    }
    function Ep(n) {
        Oa.forEach((t) => t(n));
    }
    const ka = [];
    function oi(n) {
        ka.push(n);
    }
    function Op(n) {
        ka.forEach((t) => t(n));
    }
    class as extends Ae {
        constructor() {
            super(...arguments), (this.name = 'Emitter');
        }
        on(t, e) {
            return (
                t.split(/\W+/).forEach((i) => {
                    Jt(this._events) && (this._events = {}),
                        this._events.hasOwnProperty(i) || (this._events[i] = []),
                        this._events[i].push(e);
                }),
                this
            );
        }
        once(t, e) {
            const s = (...i) => {
                e(...i), this.off(t, s);
            };
            return this.on(t, s), this;
        }
        off(t, e) {
            return (
                t.split(/\W+/).forEach((i) => {
                    if ((Jt(this._events) && (this._events = {}), this._events.hasOwnProperty(t)))
                        if (Jt(e)) this._events[t] = [];
                        else {
                            const r = this._events[t];
                            for (let a = r.length - 1; a >= 0; a--) r[a] === e && r.splice(a, 1);
                        }
                }),
                this
            );
        }
        emit(t, ...e) {
            if (this._events && this._events.hasOwnProperty(t)) {
                const s = this._events[t].slice(0);
                for (let i = 0, r = s.length; i < r; i++) s[i].apply(this, e);
            }
            return this;
        }
        static mixin(t) {
            ['on', 'once', 'off', 'emit'].forEach((e) => {
                const s = Object.getOwnPropertyDescriptor(as.prototype, e);
                Object.defineProperty(t.prototype, e, s);
            });
        }
        dispose() {
            return super.dispose(), (this._events = void 0), this;
        }
    }
    class za extends as {
        constructor() {
            super(...arguments), (this.isOffline = !1);
        }
        toJSON() {
            return {};
        }
    }
    class Dn extends za {
        constructor() {
            super(),
                (this.name = 'Context'),
                (this._constants = new Map()),
                (this._timeouts = new ge()),
                (this._timeoutIds = 0),
                (this._initialized = !1),
                (this.isOffline = !1),
                (this._workletModules = new Map());
            const t = k(Dn.getDefaults(), arguments, ['context']);
            t.context
                ? (this._context = t.context)
                : (this._context = jp({ latencyHint: t.latencyHint })),
                (this._ticker = new Lp(
                    this.emit.bind(this, 'tick'),
                    t.clockSource,
                    t.updateInterval
                )),
                this.on('tick', this._timeoutLoop.bind(this)),
                (this._context.onstatechange = () => {
                    this.emit('statechange', this.state);
                }),
                this._setLatencyHint(t.latencyHint),
                (this.lookAhead = t.lookAhead);
        }
        static getDefaults() {
            return {
                clockSource: 'worker',
                latencyHint: 'interactive',
                lookAhead: 0.1,
                updateInterval: 0.05,
            };
        }
        initialize() {
            return this._initialized || (Ep(this), (this._initialized = !0)), this;
        }
        createAnalyser() {
            return this._context.createAnalyser();
        }
        createOscillator() {
            return this._context.createOscillator();
        }
        createBufferSource() {
            return this._context.createBufferSource();
        }
        createBiquadFilter() {
            return this._context.createBiquadFilter();
        }
        createBuffer(t, e, s) {
            return this._context.createBuffer(t, e, s);
        }
        createChannelMerger(t) {
            return this._context.createChannelMerger(t);
        }
        createChannelSplitter(t) {
            return this._context.createChannelSplitter(t);
        }
        createConstantSource() {
            return this._context.createConstantSource();
        }
        createConvolver() {
            return this._context.createConvolver();
        }
        createDelay(t) {
            return this._context.createDelay(t);
        }
        createDynamicsCompressor() {
            return this._context.createDynamicsCompressor();
        }
        createGain() {
            return this._context.createGain();
        }
        createIIRFilter(t, e) {
            return this._context.createIIRFilter(t, e);
        }
        createPanner() {
            return this._context.createPanner();
        }
        createPeriodicWave(t, e, s) {
            return this._context.createPeriodicWave(t, e, s);
        }
        createStereoPanner() {
            return this._context.createStereoPanner();
        }
        createWaveShaper() {
            return this._context.createWaveShaper();
        }
        createMediaStreamSource(t) {
            return (
                H(vn(this._context), 'Not available if OfflineAudioContext'),
                this._context.createMediaStreamSource(t)
            );
        }
        createMediaElementSource(t) {
            return (
                H(vn(this._context), 'Not available if OfflineAudioContext'),
                this._context.createMediaElementSource(t)
            );
        }
        createMediaStreamDestination() {
            return (
                H(vn(this._context), 'Not available if OfflineAudioContext'),
                this._context.createMediaStreamDestination()
            );
        }
        decodeAudioData(t) {
            return this._context.decodeAudioData(t);
        }
        get currentTime() {
            return this._context.currentTime;
        }
        get state() {
            return this._context.state;
        }
        get sampleRate() {
            return this._context.sampleRate;
        }
        get listener() {
            return this.initialize(), this._listener;
        }
        set listener(t) {
            H(!this._initialized, 'The listener cannot be set after initialization.'),
                (this._listener = t);
        }
        get transport() {
            return this.initialize(), this._transport;
        }
        set transport(t) {
            H(!this._initialized, 'The transport cannot be set after initialization.'),
                (this._transport = t);
        }
        get draw() {
            return this.initialize(), this._draw;
        }
        set draw(t) {
            H(!this._initialized, 'Draw cannot be set after initialization.'), (this._draw = t);
        }
        get destination() {
            return this.initialize(), this._destination;
        }
        set destination(t) {
            H(!this._initialized, 'The destination cannot be set after initialization.'),
                (this._destination = t);
        }
        createAudioWorkletNode(t, e) {
            return vp(this.rawContext, t, e);
        }
        addAudioWorkletModule(t, e) {
            return yt(this, void 0, void 0, function*() {
                H(
                    $(this.rawContext.audioWorklet),
                    'AudioWorkletNode is only available in a secure context (https or localhost)'
                ),
                    this._workletModules.has(e) ||
                        this._workletModules.set(e, this.rawContext.audioWorklet.addModule(t)),
                    yield this._workletModules.get(e);
            });
        }
        workletsAreReady() {
            return yt(this, void 0, void 0, function*() {
                const t = [];
                this._workletModules.forEach((e) => t.push(e)), yield Promise.all(t);
            });
        }
        get updateInterval() {
            return this._ticker.updateInterval;
        }
        set updateInterval(t) {
            this._ticker.updateInterval = t;
        }
        get clockSource() {
            return this._ticker.type;
        }
        set clockSource(t) {
            this._ticker.type = t;
        }
        get latencyHint() {
            return this._latencyHint;
        }
        _setLatencyHint(t) {
            let e = 0;
            if (((this._latencyHint = t), me(t)))
                switch (t) {
                    case 'interactive':
                        e = 0.1;
                        break;
                    case 'playback':
                        e = 0.5;
                        break;
                    case 'balanced':
                        e = 0.25;
                        break;
                }
            (this.lookAhead = e), (this.updateInterval = e / 2);
        }
        get rawContext() {
            return this._context;
        }
        now() {
            return this._context.currentTime + this.lookAhead;
        }
        immediate() {
            return this._context.currentTime;
        }
        resume() {
            return vn(this._context) ? this._context.resume() : Promise.resolve();
        }
        close() {
            return yt(this, void 0, void 0, function*() {
                vn(this._context) && (yield this._context.close()), this._initialized && Op(this);
            });
        }
        getConstant(t) {
            if (this._constants.has(t)) return this._constants.get(t);
            {
                const e = this._context.createBuffer(1, 128, this._context.sampleRate),
                    s = e.getChannelData(0);
                for (let r = 0; r < s.length; r++) s[r] = t;
                const i = this._context.createBufferSource();
                return (
                    (i.channelCount = 1),
                    (i.channelCountMode = 'explicit'),
                    (i.buffer = e),
                    (i.loop = !0),
                    i.start(0),
                    this._constants.set(t, i),
                    i
                );
            }
        }
        dispose() {
            return (
                super.dispose(),
                this._ticker.dispose(),
                this._timeouts.dispose(),
                Object.keys(this._constants).map((t) => this._constants[t].disconnect()),
                this
            );
        }
        _timeoutLoop() {
            const t = this.now();
            let e = this._timeouts.peek();
            for (; this._timeouts.length && e && e.time <= t; )
                e.callback(), this._timeouts.shift(), (e = this._timeouts.peek());
        }
        setTimeout(t, e) {
            this._timeoutIds++;
            const s = this.now();
            return (
                this._timeouts.add({ callback: t, id: this._timeoutIds, time: s + e }),
                this._timeoutIds
            );
        }
        clearTimeout(t) {
            return (
                this._timeouts.forEach((e) => {
                    e.id === t && this._timeouts.remove(e);
                }),
                this
            );
        }
        clearInterval(t) {
            return this.clearTimeout(t);
        }
        setInterval(t, e) {
            const s = ++this._timeoutIds,
                i = () => {
                    const r = this.now();
                    this._timeouts.add({
                        callback: () => {
                            t(), i();
                        },
                        id: s,
                        time: r + e,
                    });
                };
            return i(), s;
        }
    }
    class kp extends za {
        constructor() {
            super(...arguments),
                (this.lookAhead = 0),
                (this.latencyHint = 0),
                (this.isOffline = !1);
        }
        createAnalyser() {
            return {};
        }
        createOscillator() {
            return {};
        }
        createBufferSource() {
            return {};
        }
        createBiquadFilter() {
            return {};
        }
        createBuffer(t, e, s) {
            return {};
        }
        createChannelMerger(t) {
            return {};
        }
        createChannelSplitter(t) {
            return {};
        }
        createConstantSource() {
            return {};
        }
        createConvolver() {
            return {};
        }
        createDelay(t) {
            return {};
        }
        createDynamicsCompressor() {
            return {};
        }
        createGain() {
            return {};
        }
        createIIRFilter(t, e) {
            return {};
        }
        createPanner() {
            return {};
        }
        createPeriodicWave(t, e, s) {
            return {};
        }
        createStereoPanner() {
            return {};
        }
        createWaveShaper() {
            return {};
        }
        createMediaStreamSource(t) {
            return {};
        }
        createMediaElementSource(t) {
            return {};
        }
        createMediaStreamDestination() {
            return {};
        }
        decodeAudioData(t) {
            return Promise.resolve({});
        }
        createAudioWorkletNode(t, e) {
            return {};
        }
        get rawContext() {
            return {};
        }
        addAudioWorkletModule(t, e) {
            return yt(this, void 0, void 0, function*() {
                return Promise.resolve();
            });
        }
        resume() {
            return Promise.resolve();
        }
        setTimeout(t, e) {
            return 0;
        }
        clearTimeout(t) {
            return this;
        }
        setInterval(t, e) {
            return 0;
        }
        clearInterval(t) {
            return this;
        }
        getConstant(t) {
            return {};
        }
        get currentTime() {
            return 0;
        }
        get state() {
            return {};
        }
        get sampleRate() {
            return 0;
        }
        get listener() {
            return {};
        }
        get transport() {
            return {};
        }
        get draw() {
            return {};
        }
        set draw(t) {}
        get destination() {
            return {};
        }
        set destination(t) {}
        now() {
            return 0;
        }
        immediate() {
            return 0;
        }
    }
    function st(n, t) {
        oe(t)
            ? t.forEach((e) => st(n, e))
            : Object.defineProperty(n, t, { enumerable: !0, writable: !1 });
    }
    function Pa(n, t) {
        oe(t) ? t.forEach((e) => Pa(n, e)) : Object.defineProperty(n, t, { writable: !0 });
    }
    const rt = () => {};
    class ot extends Ae {
        constructor() {
            super(), (this.name = 'ToneAudioBuffer'), (this.onload = rt);
            const t = k(ot.getDefaults(), arguments, ['url', 'onload', 'onerror']);
            (this.reverse = t.reverse),
                (this.onload = t.onload),
                (t.url && ba(t.url)) || t.url instanceof ot
                    ? this.set(t.url)
                    : me(t.url) && this.load(t.url).catch(t.onerror);
        }
        static getDefaults() {
            return { onerror: rt, onload: rt, reverse: !1 };
        }
        get sampleRate() {
            return this._buffer ? this._buffer.sampleRate : Rt().sampleRate;
        }
        set(t) {
            return (
                t instanceof ot
                    ? t.loaded
                        ? (this._buffer = t.get())
                        : (t.onload = () => {
                              this.set(t), this.onload(this);
                          })
                    : (this._buffer = t),
                this._reversed && this._reverse(),
                this
            );
        }
        get() {
            return this._buffer;
        }
        load(t) {
            return yt(this, void 0, void 0, function*() {
                const e = ot.load(t).then((s) => {
                    this.set(s), this.onload(this);
                });
                ot.downloads.push(e);
                try {
                    yield e;
                } finally {
                    const s = ot.downloads.indexOf(e);
                    ot.downloads.splice(s, 1);
                }
                return this;
            });
        }
        dispose() {
            return super.dispose(), (this._buffer = void 0), this;
        }
        fromArray(t) {
            const e = oe(t) && t[0].length > 0,
                s = e ? t.length : 1,
                i = e ? t[0].length : t.length,
                r = Rt(),
                a = r.createBuffer(s, i, r.sampleRate),
                o = !e && s === 1 ? [t] : t;
            for (let c = 0; c < s; c++) a.copyToChannel(o[c], c);
            return (this._buffer = a), this;
        }
        toMono(t) {
            if (en(t)) this.fromArray(this.toArray(t));
            else {
                let e = new Float32Array(this.length);
                const s = this.numberOfChannels;
                for (let i = 0; i < s; i++) {
                    const r = this.toArray(i);
                    for (let a = 0; a < r.length; a++) e[a] += r[a];
                }
                (e = e.map((i) => i / s)), this.fromArray(e);
            }
            return this;
        }
        toArray(t) {
            if (en(t)) return this.getChannelData(t);
            if (this.numberOfChannels === 1) return this.toArray(0);
            {
                const e = [];
                for (let s = 0; s < this.numberOfChannels; s++) e[s] = this.getChannelData(s);
                return e;
            }
        }
        getChannelData(t) {
            return this._buffer ? this._buffer.getChannelData(t) : new Float32Array(0);
        }
        slice(t, e = this.duration) {
            const s = Math.floor(t * this.sampleRate),
                i = Math.floor(e * this.sampleRate);
            H(s < i, 'The start time must be less than the end time');
            const r = i - s,
                a = Rt().createBuffer(this.numberOfChannels, r, this.sampleRate);
            for (let o = 0; o < this.numberOfChannels; o++)
                a.copyToChannel(this.getChannelData(o).subarray(s, i), o);
            return new ot(a);
        }
        _reverse() {
            if (this.loaded)
                for (let t = 0; t < this.numberOfChannels; t++) this.getChannelData(t).reverse();
            return this;
        }
        get loaded() {
            return this.length > 0;
        }
        get duration() {
            return this._buffer ? this._buffer.duration : 0;
        }
        get length() {
            return this._buffer ? this._buffer.length : 0;
        }
        get numberOfChannels() {
            return this._buffer ? this._buffer.numberOfChannels : 0;
        }
        get reverse() {
            return this._reversed;
        }
        set reverse(t) {
            this._reversed !== t && ((this._reversed = t), this._reverse());
        }
        static fromArray(t) {
            return new ot().fromArray(t);
        }
        static fromUrl(t) {
            return yt(this, void 0, void 0, function*() {
                return yield new ot().load(t);
            });
        }
        static load(t) {
            return yt(this, void 0, void 0, function*() {
                const e = t.match(/\[([^\]\[]+\|.+)\]$/);
                if (e) {
                    const o = e[1].split('|');
                    let c = o[0];
                    for (const u of o)
                        if (ot.supportsType(u)) {
                            c = u;
                            break;
                        }
                    t = t.replace(e[0], c);
                }
                const s =
                        ot.baseUrl === '' || ot.baseUrl.endsWith('/')
                            ? ot.baseUrl
                            : ot.baseUrl + '/',
                    i = yield fetch(s + t);
                if (!i.ok) throw new Error(`could not load url: ${t}`);
                const r = yield i.arrayBuffer();
                return yield Rt().decodeAudioData(r);
            });
        }
        static supportsType(t) {
            const e = t.split('.'),
                s = e[e.length - 1];
            return document.createElement('audio').canPlayType('audio/' + s) !== '';
        }
        static loaded() {
            return yt(this, void 0, void 0, function*() {
                for (yield Promise.resolve(); ot.downloads.length; ) yield ot.downloads[0];
            });
        }
    }
    (ot.baseUrl = ''), (ot.downloads = []);
    class ai extends Dn {
        constructor() {
            super({
                clockSource: 'offline',
                context: si(arguments[0])
                    ? arguments[0]
                    : Ap(arguments[0], arguments[1] * arguments[2], arguments[2]),
                lookAhead: 0,
                updateInterval: si(arguments[0])
                    ? 128 / arguments[0].sampleRate
                    : 128 / arguments[2],
            }),
                (this.name = 'OfflineContext'),
                (this._currentTime = 0),
                (this.isOffline = !0),
                (this._duration = si(arguments[0])
                    ? arguments[0].length / arguments[0].sampleRate
                    : arguments[1]);
        }
        now() {
            return this._currentTime;
        }
        get currentTime() {
            return this._currentTime;
        }
        _renderClock(t) {
            return yt(this, void 0, void 0, function*() {
                let e = 0;
                for (; this._duration - this._currentTime >= 0; ) {
                    this.emit('tick'), (this._currentTime += 128 / this.sampleRate), e++;
                    const s = Math.floor(this.sampleRate / 128);
                    t && e % s === 0 && (yield new Promise((i) => setTimeout(i, 1)));
                }
            });
        }
        render(t = !0) {
            return yt(this, void 0, void 0, function*() {
                yield this.workletsAreReady(), yield this._renderClock(t);
                const e = yield this._context.startRendering();
                return new ot(e);
            });
        }
        close() {
            return Promise.resolve();
        }
    }
    const Ra = new kp();
    let cs = Ra;
    function Rt() {
        return cs === Ra && xp && ci(new Dn()), cs;
    }
    function ci(n) {
        vn(n) ? (cs = new Dn(n)) : si(n) ? (cs = new ai(n)) : (cs = n);
    }
    if (sn && !sn.TONE_SILENCE_LOGGING) {
        const t = ` * Tone.js v${No} * `;
        console.log(`%c${t}`, 'background: #000; color: #fff');
    }
    function zp(n) {
        return Math.pow(10, n / 20);
    }
    function Pp(n) {
        return 20 * (Math.log(n) / Math.LN10);
    }
    function ui(n) {
        return Math.pow(2, n / 12);
    }
    let li = 440;
    function Rp() {
        return li;
    }
    function Yp(n) {
        li = n;
    }
    function Nr(n) {
        return Math.round(Ya(n));
    }
    function Ya(n) {
        return 69 + 12 * Math.log2(n / li);
    }
    function Up(n) {
        return li * Math.pow(2, (n - 69) / 12);
    }
    class Ir extends Ae {
        constructor(t, e, s) {
            super(),
                (this.defaultUnits = 's'),
                (this._val = e),
                (this._units = s),
                (this.context = t),
                (this._expressions = this._getExpressions());
        }
        _getExpressions() {
            return {
                hz: {
                    method: (t) => this._frequencyToUnits(parseFloat(t)),
                    regexp: /^(\d+(?:\.\d+)?)hz$/i,
                },
                i: { method: (t) => this._ticksToUnits(parseInt(t, 10)), regexp: /^(\d+)i$/i },
                m: {
                    method: (t) => this._beatsToUnits(parseInt(t, 10) * this._getTimeSignature()),
                    regexp: /^(\d+)m$/i,
                },
                n: {
                    method: (t, e) => {
                        const s = parseInt(t, 10),
                            i = e === '.' ? 1.5 : 1;
                        return s === 1
                            ? this._beatsToUnits(this._getTimeSignature()) * i
                            : this._beatsToUnits(4 / s) * i;
                    },
                    regexp: /^(\d+)n(\.?)$/i,
                },
                number: {
                    method: (t) => this._expressions[this.defaultUnits].method.call(this, t),
                    regexp: /^(\d+(?:\.\d+)?)$/,
                },
                s: {
                    method: (t) => this._secondsToUnits(parseFloat(t)),
                    regexp: /^(\d+(?:\.\d+)?)s$/,
                },
                samples: {
                    method: (t) => parseInt(t, 10) / this.context.sampleRate,
                    regexp: /^(\d+)samples$/,
                },
                t: {
                    method: (t) => {
                        const e = parseInt(t, 10);
                        return this._beatsToUnits(8 / (Math.floor(e) * 3));
                    },
                    regexp: /^(\d+)t$/i,
                },
                tr: {
                    method: (t, e, s) => {
                        let i = 0;
                        return (
                            t &&
                                t !== '0' &&
                                (i += this._beatsToUnits(this._getTimeSignature() * parseFloat(t))),
                            e && e !== '0' && (i += this._beatsToUnits(parseFloat(e))),
                            s && s !== '0' && (i += this._beatsToUnits(parseFloat(s) / 4)),
                            i
                        );
                    },
                    regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/,
                },
            };
        }
        valueOf() {
            if ((this._val instanceof Ir && this.fromType(this._val), Jt(this._val)))
                return this._noArg();
            if (me(this._val) && Jt(this._units)) {
                for (const t in this._expressions)
                    if (this._expressions[t].regexp.test(this._val.trim())) {
                        this._units = t;
                        break;
                    }
            } else if (nn(this._val)) {
                let t = 0;
                for (const e in this._val)
                    if ($(this._val[e])) {
                        const s = this._val[e],
                            i = new this.constructor(this.context, e).valueOf() * s;
                        t += i;
                    }
                return t;
            }
            if ($(this._units)) {
                const t = this._expressions[this._units],
                    e = this._val
                        .toString()
                        .trim()
                        .match(t.regexp);
                return e ? t.method.apply(this, e.slice(1)) : t.method.call(this, this._val);
            } else return me(this._val) ? parseFloat(this._val) : this._val;
        }
        _frequencyToUnits(t) {
            return 1 / t;
        }
        _beatsToUnits(t) {
            return (60 / this._getBpm()) * t;
        }
        _secondsToUnits(t) {
            return t;
        }
        _ticksToUnits(t) {
            return (t * this._beatsToUnits(1)) / this._getPPQ();
        }
        _noArg() {
            return this._now();
        }
        _getBpm() {
            return this.context.transport.bpm.value;
        }
        _getTimeSignature() {
            return this.context.transport.timeSignature;
        }
        _getPPQ() {
            return this.context.transport.PPQ;
        }
        fromType(t) {
            switch (((this._units = void 0), this.defaultUnits)) {
                case 's':
                    this._val = t.toSeconds();
                    break;
                case 'i':
                    this._val = t.toTicks();
                    break;
                case 'hz':
                    this._val = t.toFrequency();
                    break;
                case 'midi':
                    this._val = t.toMidi();
                    break;
            }
            return this;
        }
        toFrequency() {
            return 1 / this.toSeconds();
        }
        toSamples() {
            return this.toSeconds() * this.context.sampleRate;
        }
        toMilliseconds() {
            return this.toSeconds() * 1e3;
        }
    }
    class ue extends Ir {
        constructor() {
            super(...arguments), (this.name = 'TimeClass');
        }
        _getExpressions() {
            return Object.assign(super._getExpressions(), {
                now: {
                    method: (t) => this._now() + new this.constructor(this.context, t).valueOf(),
                    regexp: /^\+(.+)/,
                },
                quantize: {
                    method: (t) => {
                        const e = new ue(this.context, t).valueOf();
                        return this._secondsToUnits(this.context.transport.nextSubdivision(e));
                    },
                    regexp: /^@(.+)/,
                },
            });
        }
        quantize(t, e = 1) {
            const s = new this.constructor(this.context, t).valueOf(),
                i = this.valueOf(),
                o = Math.round(i / s) * s - i;
            return i + o * e;
        }
        toNotation() {
            const t = this.toSeconds(),
                e = ['1m'];
            for (let r = 1; r < 9; r++) {
                const a = Math.pow(2, r);
                e.push(a + 'n.'), e.push(a + 'n'), e.push(a + 't');
            }
            e.push('0');
            let s = e[0],
                i = new ue(this.context, e[0]).toSeconds();
            return (
                e.forEach((r) => {
                    const a = new ue(this.context, r).toSeconds();
                    Math.abs(a - t) < Math.abs(i - t) && ((s = r), (i = a));
                }),
                s
            );
        }
        toBarsBeatsSixteenths() {
            const t = this._beatsToUnits(1);
            let e = this.valueOf() / t;
            e = parseFloat(e.toFixed(4));
            const s = Math.floor(e / this._getTimeSignature());
            let i = (e % 1) * 4;
            e = Math.floor(e) % this._getTimeSignature();
            const r = i.toString();
            return r.length > 3 && (i = parseFloat(parseFloat(r).toFixed(3))), [s, e, i].join(':');
        }
        toTicks() {
            const t = this._beatsToUnits(1),
                e = this.valueOf() / t;
            return Math.round(e * this._getPPQ());
        }
        toSeconds() {
            return this.valueOf();
        }
        toMidi() {
            return Nr(this.toFrequency());
        }
        _now() {
            return this.context.now();
        }
    }
    class Kt extends ue {
        constructor() {
            super(...arguments), (this.name = 'Frequency'), (this.defaultUnits = 'hz');
        }
        static get A4() {
            return Rp();
        }
        static set A4(t) {
            Yp(t);
        }
        _getExpressions() {
            return Object.assign({}, super._getExpressions(), {
                midi: {
                    regexp: /^(\d+(?:\.\d+)?midi)/,
                    method(t) {
                        return this.defaultUnits === 'midi' ? t : Kt.mtof(t);
                    },
                },
                note: {
                    regexp: /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,
                    method(t, e) {
                        const i = Vp[t.toLowerCase()] + (parseInt(e, 10) + 1) * 12;
                        return this.defaultUnits === 'midi' ? i : Kt.mtof(i);
                    },
                },
                tr: {
                    regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                    method(t, e, s) {
                        let i = 1;
                        return (
                            t &&
                                t !== '0' &&
                                (i *= this._beatsToUnits(this._getTimeSignature() * parseFloat(t))),
                            e && e !== '0' && (i *= this._beatsToUnits(parseFloat(e))),
                            s && s !== '0' && (i *= this._beatsToUnits(parseFloat(s) / 4)),
                            i
                        );
                    },
                },
            });
        }
        transpose(t) {
            return new Kt(this.context, this.valueOf() * ui(t));
        }
        harmonize(t) {
            return t.map((e) => this.transpose(e));
        }
        toMidi() {
            return Nr(this.valueOf());
        }
        toNote() {
            const t = this.toFrequency(),
                e = Math.log2(t / Kt.A4);
            let s = Math.round(12 * e) + 57;
            const i = Math.floor(s / 12);
            return i < 0 && (s += -12 * i), Wp[s % 12] + i.toString();
        }
        toSeconds() {
            return 1 / super.toSeconds();
        }
        toTicks() {
            const t = this._beatsToUnits(1),
                e = this.valueOf() / t;
            return Math.floor(e * this._getPPQ());
        }
        _noArg() {
            return 0;
        }
        _frequencyToUnits(t) {
            return t;
        }
        _ticksToUnits(t) {
            return 1 / ((t * 60) / (this._getBpm() * this._getPPQ()));
        }
        _beatsToUnits(t) {
            return 1 / super._beatsToUnits(t);
        }
        _secondsToUnits(t) {
            return 1 / t;
        }
        static mtof(t) {
            return Up(t);
        }
        static ftom(t) {
            return Nr(t);
        }
    }
    const Vp = {
            cbb: -2,
            cb: -1,
            c: 0,
            'c#': 1,
            cx: 2,
            dbb: 0,
            db: 1,
            d: 2,
            'd#': 3,
            dx: 4,
            ebb: 2,
            eb: 3,
            e: 4,
            'e#': 5,
            ex: 6,
            fbb: 3,
            fb: 4,
            f: 5,
            'f#': 6,
            fx: 7,
            gbb: 5,
            gb: 6,
            g: 7,
            'g#': 8,
            gx: 9,
            abb: 7,
            ab: 8,
            a: 9,
            'a#': 10,
            ax: 11,
            bbb: 9,
            bb: 10,
            b: 11,
            'b#': 12,
            bx: 13,
        },
        Wp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    class us extends ue {
        constructor() {
            super(...arguments), (this.name = 'TransportTime');
        }
        _now() {
            return this.context.transport.seconds;
        }
    }
    class Ft extends Ae {
        constructor() {
            super();
            const t = k(Ft.getDefaults(), arguments, ['context']);
            this.defaultContext ? (this.context = this.defaultContext) : (this.context = t.context);
        }
        static getDefaults() {
            return { context: Rt() };
        }
        now() {
            return this.context.currentTime + this.context.lookAhead;
        }
        immediate() {
            return this.context.currentTime;
        }
        get sampleTime() {
            return 1 / this.context.sampleRate;
        }
        get blockTime() {
            return 128 / this.context.sampleRate;
        }
        toSeconds(t) {
            return new ue(this.context, t).toSeconds();
        }
        toFrequency(t) {
            return new Kt(this.context, t).toFrequency();
        }
        toTicks(t) {
            return new us(this.context, t).toTicks();
        }
        _getPartialProperties(t) {
            const e = this.get();
            return (
                Object.keys(e).forEach((s) => {
                    Jt(t[s]) && delete e[s];
                }),
                e
            );
        }
        get() {
            const t = bp(this);
            return (
                Object.keys(t).forEach((e) => {
                    if (Reflect.has(this, e)) {
                        const s = this[e];
                        $(s) && $(s.value) && $(s.setValueAtTime)
                            ? (t[e] = s.value)
                            : s instanceof Ft
                            ? (t[e] = s._getPartialProperties(t[e]))
                            : oe(s) || en(s) || me(s) || Sp(s)
                            ? (t[e] = s)
                            : delete t[e];
                    }
                }),
                t
            );
        }
        set(t) {
            return (
                Object.keys(t).forEach((e) => {
                    Reflect.has(this, e) &&
                        $(this[e]) &&
                        (this[e] && $(this[e].value) && $(this[e].setValueAtTime)
                            ? this[e].value !== t[e] && (this[e].value = t[e])
                            : this[e] instanceof Ft
                            ? this[e].set(t[e])
                            : (this[e] = t[e]));
                }),
                this
            );
        }
    }
    class Sr extends ge {
        constructor(t = 'stopped') {
            super(),
                (this.name = 'StateTimeline'),
                (this._initial = t),
                this.setStateAtTime(this._initial, 0);
        }
        getValueAtTime(t) {
            const e = this.get(t);
            return e !== null ? e.state : this._initial;
        }
        setStateAtTime(t, e, s) {
            return Ye(e, 0), this.add(Object.assign({}, s, { state: t, time: e })), this;
        }
        getLastState(t, e) {
            const s = this._search(e);
            for (let i = s; i >= 0; i--) {
                const r = this._timeline[i];
                if (r.state === t) return r;
            }
        }
        getNextState(t, e) {
            const s = this._search(e);
            if (s !== -1)
                for (let i = s; i < this._timeline.length; i++) {
                    const r = this._timeline[i];
                    if (r.state === t) return r;
                }
        }
    }
    class et extends Ft {
        constructor() {
            super(k(et.getDefaults(), arguments, ['param', 'units', 'convert'])),
                (this.name = 'Param'),
                (this.overridden = !1),
                (this._minOutput = 1e-7);
            const t = k(et.getDefaults(), arguments, ['param', 'units', 'convert']);
            for (
                H(
                    $(t.param) && (rn(t.param) || t.param instanceof et),
                    'param must be an AudioParam'
                );
                !rn(t.param);

            )
                t.param = t.param._param;
            (this._swappable = $(t.swappable) ? t.swappable : !1),
                this._swappable
                    ? ((this.input = this.context.createGain()),
                      (this._param = t.param),
                      this.input.connect(this._param))
                    : (this._param = this.input = t.param),
                (this._events = new ge(1e3)),
                (this._initialValue = this._param.defaultValue),
                (this.units = t.units),
                (this.convert = t.convert),
                (this._minValue = t.minValue),
                (this._maxValue = t.maxValue),
                $(t.value) &&
                    t.value !== this._toType(this._initialValue) &&
                    this.setValueAtTime(t.value, 0);
        }
        static getDefaults() {
            return Object.assign(Ft.getDefaults(), { convert: !0, units: 'number' });
        }
        get value() {
            const t = this.now();
            return this.getValueAtTime(t);
        }
        set value(t) {
            this.cancelScheduledValues(this.now()), this.setValueAtTime(t, this.now());
        }
        get minValue() {
            return $(this._minValue)
                ? this._minValue
                : this.units === 'time' ||
                  this.units === 'frequency' ||
                  this.units === 'normalRange' ||
                  this.units === 'positive' ||
                  this.units === 'transportTime' ||
                  this.units === 'ticks' ||
                  this.units === 'bpm' ||
                  this.units === 'hertz' ||
                  this.units === 'samples'
                ? 0
                : this.units === 'audioRange'
                ? -1
                : this.units === 'decibels'
                ? -1 / 0
                : this._param.minValue;
        }
        get maxValue() {
            return $(this._maxValue)
                ? this._maxValue
                : this.units === 'normalRange' || this.units === 'audioRange'
                ? 1
                : this._param.maxValue;
        }
        _is(t, e) {
            return this.units === e;
        }
        _assertRange(t) {
            return (
                $(this.maxValue) &&
                    $(this.minValue) &&
                    Ye(t, this._fromType(this.minValue), this._fromType(this.maxValue)),
                t
            );
        }
        _fromType(t) {
            return this.convert && !this.overridden
                ? this._is(t, 'time')
                    ? this.toSeconds(t)
                    : this._is(t, 'decibels')
                    ? zp(t)
                    : this._is(t, 'frequency')
                    ? this.toFrequency(t)
                    : t
                : this.overridden
                ? 0
                : t;
        }
        _toType(t) {
            return this.convert && this.units === 'decibels' ? Pp(t) : t;
        }
        setValueAtTime(t, e) {
            const s = this.toSeconds(e),
                i = this._fromType(t);
            return (
                H(
                    isFinite(i) && isFinite(s),
                    `Invalid argument(s) to setValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(
                        e
                    )}`
                ),
                this._assertRange(i),
                this.log(this.units, 'setValueAtTime', t, s),
                this._events.add({ time: s, type: 'setValueAtTime', value: i }),
                this._param.setValueAtTime(i, s),
                this
            );
        }
        getValueAtTime(t) {
            const e = Math.max(this.toSeconds(t), 0),
                s = this._events.getAfter(e),
                i = this._events.get(e);
            let r = this._initialValue;
            if (i === null) r = this._initialValue;
            else if (i.type === 'setTargetAtTime' && (s === null || s.type === 'setValueAtTime')) {
                const a = this._events.getBefore(i.time);
                let o;
                a === null ? (o = this._initialValue) : (o = a.value),
                    i.type === 'setTargetAtTime' &&
                        (r = this._exponentialApproach(i.time, o, i.value, i.constant, e));
            } else if (s === null) r = i.value;
            else if (
                s.type === 'linearRampToValueAtTime' ||
                s.type === 'exponentialRampToValueAtTime'
            ) {
                let a = i.value;
                if (i.type === 'setTargetAtTime') {
                    const o = this._events.getBefore(i.time);
                    o === null ? (a = this._initialValue) : (a = o.value);
                }
                s.type === 'linearRampToValueAtTime'
                    ? (r = this._linearInterpolate(i.time, a, s.time, s.value, e))
                    : (r = this._exponentialInterpolate(i.time, a, s.time, s.value, e));
            } else r = i.value;
            return this._toType(r);
        }
        setRampPoint(t) {
            t = this.toSeconds(t);
            let e = this.getValueAtTime(t);
            return (
                this.cancelAndHoldAtTime(t),
                this._fromType(e) === 0 && (e = this._toType(this._minOutput)),
                this.setValueAtTime(e, t),
                this
            );
        }
        linearRampToValueAtTime(t, e) {
            const s = this._fromType(t),
                i = this.toSeconds(e);
            return (
                H(
                    isFinite(s) && isFinite(i),
                    `Invalid argument(s) to linearRampToValueAtTime: ${JSON.stringify(
                        t
                    )}, ${JSON.stringify(e)}`
                ),
                this._assertRange(s),
                this._events.add({ time: i, type: 'linearRampToValueAtTime', value: s }),
                this.log(this.units, 'linearRampToValueAtTime', t, i),
                this._param.linearRampToValueAtTime(s, i),
                this
            );
        }
        exponentialRampToValueAtTime(t, e) {
            let s = this._fromType(t);
            (s = ce(s, 0) ? this._minOutput : s), this._assertRange(s);
            const i = this.toSeconds(e);
            return (
                H(
                    isFinite(s) && isFinite(i),
                    `Invalid argument(s) to exponentialRampToValueAtTime: ${JSON.stringify(
                        t
                    )}, ${JSON.stringify(e)}`
                ),
                this._events.add({ time: i, type: 'exponentialRampToValueAtTime', value: s }),
                this.log(this.units, 'exponentialRampToValueAtTime', t, i),
                this._param.exponentialRampToValueAtTime(s, i),
                this
            );
        }
        exponentialRampTo(t, e, s) {
            return (
                (s = this.toSeconds(s)),
                this.setRampPoint(s),
                this.exponentialRampToValueAtTime(t, s + this.toSeconds(e)),
                this
            );
        }
        linearRampTo(t, e, s) {
            return (
                (s = this.toSeconds(s)),
                this.setRampPoint(s),
                this.linearRampToValueAtTime(t, s + this.toSeconds(e)),
                this
            );
        }
        targetRampTo(t, e, s) {
            return (
                (s = this.toSeconds(s)),
                this.setRampPoint(s),
                this.exponentialApproachValueAtTime(t, s, e),
                this
            );
        }
        exponentialApproachValueAtTime(t, e, s) {
            (e = this.toSeconds(e)), (s = this.toSeconds(s));
            const i = Math.log(s + 1) / Math.log(200);
            return (
                this.setTargetAtTime(t, e, i),
                this.cancelAndHoldAtTime(e + s * 0.9),
                this.linearRampToValueAtTime(t, e + s),
                this
            );
        }
        setTargetAtTime(t, e, s) {
            const i = this._fromType(t);
            H(isFinite(s) && s > 0, 'timeConstant must be a number greater than 0');
            const r = this.toSeconds(e);
            return (
                this._assertRange(i),
                H(
                    isFinite(i) && isFinite(r),
                    `Invalid argument(s) to setTargetAtTime: ${JSON.stringify(t)}, ${JSON.stringify(
                        e
                    )}`
                ),
                this._events.add({ constant: s, time: r, type: 'setTargetAtTime', value: i }),
                this.log(this.units, 'setTargetAtTime', t, r, s),
                this._param.setTargetAtTime(i, r, s),
                this
            );
        }
        setValueCurveAtTime(t, e, s, i = 1) {
            (s = this.toSeconds(s)), (e = this.toSeconds(e));
            const r = this._fromType(t[0]) * i;
            this.setValueAtTime(this._toType(r), e);
            const a = s / (t.length - 1);
            for (let o = 1; o < t.length; o++) {
                const c = this._fromType(t[o]) * i;
                this.linearRampToValueAtTime(this._toType(c), e + o * a);
            }
            return this;
        }
        cancelScheduledValues(t) {
            const e = this.toSeconds(t);
            return (
                H(isFinite(e), `Invalid argument to cancelScheduledValues: ${JSON.stringify(t)}`),
                this._events.cancel(e),
                this._param.cancelScheduledValues(e),
                this.log(this.units, 'cancelScheduledValues', e),
                this
            );
        }
        cancelAndHoldAtTime(t) {
            const e = this.toSeconds(t),
                s = this._fromType(this.getValueAtTime(e));
            H(isFinite(e), `Invalid argument to cancelAndHoldAtTime: ${JSON.stringify(t)}`),
                this.log(this.units, 'cancelAndHoldAtTime', e, 'value=' + s);
            const i = this._events.get(e),
                r = this._events.getAfter(e);
            return (
                i && ce(i.time, e)
                    ? r
                        ? (this._param.cancelScheduledValues(r.time), this._events.cancel(r.time))
                        : (this._param.cancelAndHoldAtTime(e),
                          this._events.cancel(e + this.sampleTime))
                    : r &&
                      (this._param.cancelScheduledValues(r.time),
                      this._events.cancel(r.time),
                      r.type === 'linearRampToValueAtTime'
                          ? this.linearRampToValueAtTime(this._toType(s), e)
                          : r.type === 'exponentialRampToValueAtTime' &&
                            this.exponentialRampToValueAtTime(this._toType(s), e)),
                this._events.add({ time: e, type: 'setValueAtTime', value: s }),
                this._param.setValueAtTime(s, e),
                this
            );
        }
        rampTo(t, e = 0.1, s) {
            return (
                this.units === 'frequency' || this.units === 'bpm' || this.units === 'decibels'
                    ? this.exponentialRampTo(t, e, s)
                    : this.linearRampTo(t, e, s),
                this
            );
        }
        apply(t) {
            const e = this.context.currentTime;
            t.setValueAtTime(this.getValueAtTime(e), e);
            const s = this._events.get(e);
            if (s && s.type === 'setTargetAtTime') {
                const i = this._events.getAfter(s.time),
                    r = i ? i.time : e + 2,
                    a = (r - e) / 10;
                for (let o = e; o < r; o += a) t.linearRampToValueAtTime(this.getValueAtTime(o), o);
            }
            return (
                this._events.forEachAfter(this.context.currentTime, (i) => {
                    i.type === 'cancelScheduledValues'
                        ? t.cancelScheduledValues(i.time)
                        : i.type === 'setTargetAtTime'
                        ? t.setTargetAtTime(i.value, i.time, i.constant)
                        : t[i.type](i.value, i.time);
                }),
                this
            );
        }
        setParam(t) {
            H(this._swappable, "The Param must be assigned as 'swappable' in the constructor");
            const e = this.input;
            return (
                e.disconnect(this._param),
                this.apply(t),
                (this._param = t),
                e.connect(this._param),
                this
            );
        }
        dispose() {
            return super.dispose(), this._events.dispose(), this;
        }
        get defaultValue() {
            return this._toType(this._param.defaultValue);
        }
        _exponentialApproach(t, e, s, i, r) {
            return s + (e - s) * Math.exp(-(r - t) / i);
        }
        _linearInterpolate(t, e, s, i, r) {
            return e + (i - e) * ((r - t) / (s - t));
        }
        _exponentialInterpolate(t, e, s, i, r) {
            return e * Math.pow(i / e, (r - t) / (s - t));
        }
    }
    class Q extends Ft {
        constructor() {
            super(...arguments), (this.name = 'ToneAudioNode'), (this._internalChannels = []);
        }
        get numberOfInputs() {
            return $(this.input)
                ? rn(this.input) || this.input instanceof et
                    ? 1
                    : this.input.numberOfInputs
                : 0;
        }
        get numberOfOutputs() {
            return $(this.output) ? this.output.numberOfOutputs : 0;
        }
        _isAudioNode(t) {
            return $(t) && (t instanceof Q || Ue(t));
        }
        _getInternalNodes() {
            const t = this._internalChannels.slice(0);
            return (
                this._isAudioNode(this.input) && t.push(this.input),
                this._isAudioNode(this.output) && this.input !== this.output && t.push(this.output),
                t
            );
        }
        _setChannelProperties(t) {
            this._getInternalNodes().forEach((s) => {
                (s.channelCount = t.channelCount),
                    (s.channelCountMode = t.channelCountMode),
                    (s.channelInterpretation = t.channelInterpretation);
            });
        }
        _getChannelProperties() {
            const t = this._getInternalNodes();
            H(t.length > 0, 'ToneAudioNode does not have any internal nodes');
            const e = t[0];
            return {
                channelCount: e.channelCount,
                channelCountMode: e.channelCountMode,
                channelInterpretation: e.channelInterpretation,
            };
        }
        get channelCount() {
            return this._getChannelProperties().channelCount;
        }
        set channelCount(t) {
            const e = this._getChannelProperties();
            this._setChannelProperties(Object.assign(e, { channelCount: t }));
        }
        get channelCountMode() {
            return this._getChannelProperties().channelCountMode;
        }
        set channelCountMode(t) {
            const e = this._getChannelProperties();
            this._setChannelProperties(Object.assign(e, { channelCountMode: t }));
        }
        get channelInterpretation() {
            return this._getChannelProperties().channelInterpretation;
        }
        set channelInterpretation(t) {
            const e = this._getChannelProperties();
            this._setChannelProperties(Object.assign(e, { channelInterpretation: t }));
        }
        connect(t, e = 0, s = 0) {
            return xe(this, t, e, s), this;
        }
        toDestination() {
            return this.connect(this.context.destination), this;
        }
        toMaster() {
            return Da('toMaster() has been renamed toDestination()'), this.toDestination();
        }
        disconnect(t, e = 0, s = 0) {
            return Ua(this, t, e, s), this;
        }
        chain(...t) {
            return hi(this, ...t), this;
        }
        fan(...t) {
            return t.forEach((e) => this.connect(e)), this;
        }
        dispose() {
            return (
                super.dispose(),
                $(this.input) &&
                    (this.input instanceof Q
                        ? this.input.dispose()
                        : Ue(this.input) && this.input.disconnect()),
                $(this.output) &&
                    (this.output instanceof Q
                        ? this.output.dispose()
                        : Ue(this.output) && this.output.disconnect()),
                (this._internalChannels = []),
                this
            );
        }
    }
    function hi(...n) {
        const t = n.shift();
        n.reduce((e, s) => (e instanceof Q ? e.connect(s) : Ue(e) && xe(e, s), s), t);
    }
    function xe(n, t, e = 0, s = 0) {
        for (
            H($(n), 'Cannot connect from undefined node'),
                H($(t), 'Cannot connect to undefined node'),
                (t instanceof Q || Ue(t)) &&
                    H(t.numberOfInputs > 0, 'Cannot connect to node with no inputs'),
                H(n.numberOfOutputs > 0, 'Cannot connect from node with no outputs');
            t instanceof Q || t instanceof et;

        )
            $(t.input) && (t = t.input);
        for (; n instanceof Q; ) $(n.output) && (n = n.output);
        rn(t) ? n.connect(t, e) : n.connect(t, e, s);
    }
    function Ua(n, t, e = 0, s = 0) {
        if ($(t)) for (; t instanceof Q; ) t = t.input;
        for (; !Ue(n); ) $(n.output) && (n = n.output);
        rn(t) ? n.disconnect(t, e) : Ue(t) ? n.disconnect(t, e, s) : n.disconnect();
    }
    class ut extends Q {
        constructor() {
            super(k(ut.getDefaults(), arguments, ['gain', 'units'])),
                (this.name = 'Gain'),
                (this._gainNode = this.context.createGain()),
                (this.input = this._gainNode),
                (this.output = this._gainNode);
            const t = k(ut.getDefaults(), arguments, ['gain', 'units']);
            (this.gain = new et({
                context: this.context,
                convert: t.convert,
                param: this._gainNode.gain,
                units: t.units,
                value: t.gain,
                minValue: t.minValue,
                maxValue: t.maxValue,
            })),
                st(this, 'gain');
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { convert: !0, gain: 1, units: 'gain' });
        }
        dispose() {
            return super.dispose(), this._gainNode.disconnect(), this.gain.dispose(), this;
        }
    }
    class bn extends Q {
        constructor(t) {
            super(t),
                (this.onended = rt),
                (this._startTime = -1),
                (this._stopTime = -1),
                (this._timeout = -1),
                (this.output = new ut({ context: this.context, gain: 0 })),
                (this._gainNode = this.output),
                (this.getStateAtTime = function(e) {
                    const s = this.toSeconds(e);
                    return this._startTime !== -1 &&
                        s >= this._startTime &&
                        (this._stopTime === -1 || s <= this._stopTime)
                        ? 'started'
                        : 'stopped';
                }),
                (this._fadeIn = t.fadeIn),
                (this._fadeOut = t.fadeOut),
                (this._curve = t.curve),
                (this.onended = t.onended);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), {
                curve: 'linear',
                fadeIn: 0,
                fadeOut: 0,
                onended: rt,
            });
        }
        _startGain(t, e = 1) {
            H(this._startTime === -1, 'Source cannot be started more than once');
            const s = this.toSeconds(this._fadeIn);
            return (
                (this._startTime = t + s),
                (this._startTime = Math.max(this._startTime, this.context.currentTime)),
                s > 0
                    ? (this._gainNode.gain.setValueAtTime(0, t),
                      this._curve === 'linear'
                          ? this._gainNode.gain.linearRampToValueAtTime(e, t + s)
                          : this._gainNode.gain.exponentialApproachValueAtTime(e, t, s))
                    : this._gainNode.gain.setValueAtTime(e, t),
                this
            );
        }
        stop(t) {
            return this.log('stop', t), this._stopGain(this.toSeconds(t)), this;
        }
        _stopGain(t) {
            H(this._startTime !== -1, "'start' must be called before 'stop'"), this.cancelStop();
            const e = this.toSeconds(this._fadeOut);
            return (
                (this._stopTime = this.toSeconds(t) + e),
                (this._stopTime = Math.max(this._stopTime, this.context.currentTime)),
                e > 0
                    ? this._curve === 'linear'
                        ? this._gainNode.gain.linearRampTo(0, e, t)
                        : this._gainNode.gain.targetRampTo(0, e, t)
                    : (this._gainNode.gain.cancelAndHoldAtTime(t),
                      this._gainNode.gain.setValueAtTime(0, t)),
                this.context.clearTimeout(this._timeout),
                (this._timeout = this.context.setTimeout(() => {
                    const s = this._curve === 'exponential' ? e * 2 : 0;
                    this._stopSource(this.now() + s), this._onended();
                }, this._stopTime - this.context.currentTime)),
                this
            );
        }
        _onended() {
            if (
                this.onended !== rt &&
                (this.onended(this), (this.onended = rt), !this.context.isOffline)
            ) {
                const t = () => this.dispose();
                typeof window.requestIdleCallback < 'u'
                    ? window.requestIdleCallback(t)
                    : setTimeout(t, 1e3);
            }
        }
        get state() {
            return this.getStateAtTime(this.now());
        }
        cancelStop() {
            return (
                this.log('cancelStop'),
                H(this._startTime !== -1, 'Source is not started'),
                this._gainNode.gain.cancelScheduledValues(this._startTime + this.sampleTime),
                this.context.clearTimeout(this._timeout),
                (this._stopTime = -1),
                this
            );
        }
        dispose() {
            return super.dispose(), this._gainNode.disconnect(), this;
        }
    }
    class di extends bn {
        constructor() {
            super(k(di.getDefaults(), arguments, ['offset'])),
                (this.name = 'ToneConstantSource'),
                (this._source = this.context.createConstantSource());
            const t = k(di.getDefaults(), arguments, ['offset']);
            xe(this._source, this._gainNode),
                (this.offset = new et({
                    context: this.context,
                    convert: t.convert,
                    param: this._source.offset,
                    units: t.units,
                    value: t.offset,
                    minValue: t.minValue,
                    maxValue: t.maxValue,
                }));
        }
        static getDefaults() {
            return Object.assign(bn.getDefaults(), { convert: !0, offset: 1, units: 'number' });
        }
        start(t) {
            const e = this.toSeconds(t);
            return this.log('start', e), this._startGain(e), this._source.start(e), this;
        }
        _stopSource(t) {
            this._source.stop(t);
        }
        dispose() {
            return (
                super.dispose(),
                this.state === 'started' && this.stop(),
                this._source.disconnect(),
                this.offset.dispose(),
                this
            );
        }
    }
    class lt extends Q {
        constructor() {
            super(k(lt.getDefaults(), arguments, ['value', 'units'])),
                (this.name = 'Signal'),
                (this.override = !0);
            const t = k(lt.getDefaults(), arguments, ['value', 'units']);
            (this.output = this._constantSource = new di({
                context: this.context,
                convert: t.convert,
                offset: t.value,
                units: t.units,
                minValue: t.minValue,
                maxValue: t.maxValue,
            })),
                this._constantSource.start(0),
                (this.input = this._param = this._constantSource.offset);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { convert: !0, units: 'number', value: 0 });
        }
        connect(t, e = 0, s = 0) {
            return fi(this, t, e, s), this;
        }
        dispose() {
            return super.dispose(), this._param.dispose(), this._constantSource.dispose(), this;
        }
        setValueAtTime(t, e) {
            return this._param.setValueAtTime(t, e), this;
        }
        getValueAtTime(t) {
            return this._param.getValueAtTime(t);
        }
        setRampPoint(t) {
            return this._param.setRampPoint(t), this;
        }
        linearRampToValueAtTime(t, e) {
            return this._param.linearRampToValueAtTime(t, e), this;
        }
        exponentialRampToValueAtTime(t, e) {
            return this._param.exponentialRampToValueAtTime(t, e), this;
        }
        exponentialRampTo(t, e, s) {
            return this._param.exponentialRampTo(t, e, s), this;
        }
        linearRampTo(t, e, s) {
            return this._param.linearRampTo(t, e, s), this;
        }
        targetRampTo(t, e, s) {
            return this._param.targetRampTo(t, e, s), this;
        }
        exponentialApproachValueAtTime(t, e, s) {
            return this._param.exponentialApproachValueAtTime(t, e, s), this;
        }
        setTargetAtTime(t, e, s) {
            return this._param.setTargetAtTime(t, e, s), this;
        }
        setValueCurveAtTime(t, e, s, i) {
            return this._param.setValueCurveAtTime(t, e, s, i), this;
        }
        cancelScheduledValues(t) {
            return this._param.cancelScheduledValues(t), this;
        }
        cancelAndHoldAtTime(t) {
            return this._param.cancelAndHoldAtTime(t), this;
        }
        rampTo(t, e, s) {
            return this._param.rampTo(t, e, s), this;
        }
        get value() {
            return this._param.value;
        }
        set value(t) {
            this._param.value = t;
        }
        get convert() {
            return this._param.convert;
        }
        set convert(t) {
            this._param.convert = t;
        }
        get units() {
            return this._param.units;
        }
        get overridden() {
            return this._param.overridden;
        }
        set overridden(t) {
            this._param.overridden = t;
        }
        get maxValue() {
            return this._param.maxValue;
        }
        get minValue() {
            return this._param.minValue;
        }
        apply(t) {
            return this._param.apply(t), this;
        }
    }
    function fi(n, t, e, s) {
        (t instanceof et || rn(t) || (t instanceof lt && t.override)) &&
            (t.cancelScheduledValues(0),
            t.setValueAtTime(0, 0),
            t instanceof lt && (t.overridden = !0)),
            xe(n, t, e, s);
    }
    class pi extends et {
        constructor() {
            super(k(pi.getDefaults(), arguments, ['value'])),
                (this.name = 'TickParam'),
                (this._events = new ge(1 / 0)),
                (this._multiplier = 1);
            const t = k(pi.getDefaults(), arguments, ['value']);
            (this._multiplier = t.multiplier),
                this._events.cancel(0),
                this._events.add({
                    ticks: 0,
                    time: 0,
                    type: 'setValueAtTime',
                    value: this._fromType(t.value),
                }),
                this.setValueAtTime(t.value, 0);
        }
        static getDefaults() {
            return Object.assign(et.getDefaults(), { multiplier: 1, units: 'hertz', value: 1 });
        }
        setTargetAtTime(t, e, s) {
            (e = this.toSeconds(e)), this.setRampPoint(e);
            const i = this._fromType(t),
                r = this._events.get(e),
                a = Math.round(Math.max(1 / s, 1));
            for (let o = 0; o <= a; o++) {
                const c = s * o + e,
                    u = this._exponentialApproach(r.time, r.value, i, s, c);
                this.linearRampToValueAtTime(this._toType(u), c);
            }
            return this;
        }
        setValueAtTime(t, e) {
            const s = this.toSeconds(e);
            super.setValueAtTime(t, e);
            const i = this._events.get(s),
                r = this._events.previousEvent(i),
                a = this._getTicksUntilEvent(r, s);
            return (i.ticks = Math.max(a, 0)), this;
        }
        linearRampToValueAtTime(t, e) {
            const s = this.toSeconds(e);
            super.linearRampToValueAtTime(t, e);
            const i = this._events.get(s),
                r = this._events.previousEvent(i),
                a = this._getTicksUntilEvent(r, s);
            return (i.ticks = Math.max(a, 0)), this;
        }
        exponentialRampToValueAtTime(t, e) {
            e = this.toSeconds(e);
            const s = this._fromType(t),
                i = this._events.get(e),
                r = Math.round(Math.max((e - i.time) * 10, 1)),
                a = (e - i.time) / r;
            for (let o = 0; o <= r; o++) {
                const c = a * o + i.time,
                    u = this._exponentialInterpolate(i.time, i.value, e, s, c);
                this.linearRampToValueAtTime(this._toType(u), c);
            }
            return this;
        }
        _getTicksUntilEvent(t, e) {
            if (t === null) t = { ticks: 0, time: 0, type: 'setValueAtTime', value: 0 };
            else if (Jt(t.ticks)) {
                const a = this._events.previousEvent(t);
                t.ticks = this._getTicksUntilEvent(a, t.time);
            }
            const s = this._fromType(this.getValueAtTime(t.time));
            let i = this._fromType(this.getValueAtTime(e));
            const r = this._events.get(e);
            return (
                r &&
                    r.time === e &&
                    r.type === 'setValueAtTime' &&
                    (i = this._fromType(this.getValueAtTime(e - this.sampleTime))),
                0.5 * (e - t.time) * (s + i) + t.ticks
            );
        }
        getTicksAtTime(t) {
            const e = this.toSeconds(t),
                s = this._events.get(e);
            return Math.max(this._getTicksUntilEvent(s, e), 0);
        }
        getDurationOfTicks(t, e) {
            const s = this.toSeconds(e),
                i = this.getTicksAtTime(e);
            return this.getTimeOfTick(i + t) - s;
        }
        getTimeOfTick(t) {
            const e = this._events.get(t, 'ticks'),
                s = this._events.getAfter(t, 'ticks');
            if (e && e.ticks === t) return e.time;
            if (e && s && s.type === 'linearRampToValueAtTime' && e.value !== s.value) {
                const i = this._fromType(this.getValueAtTime(e.time)),
                    a = (this._fromType(this.getValueAtTime(s.time)) - i) / (s.time - e.time),
                    o = Math.sqrt(Math.pow(i, 2) - 2 * a * (e.ticks - t)),
                    c = (-i + o) / a,
                    u = (-i - o) / a;
                return (c > 0 ? c : u) + e.time;
            } else
                return e
                    ? e.value === 0
                        ? 1 / 0
                        : e.time + (t - e.ticks) / e.value
                    : t / this._initialValue;
        }
        ticksToTime(t, e) {
            return this.getDurationOfTicks(t, e);
        }
        timeToTicks(t, e) {
            const s = this.toSeconds(e),
                i = this.toSeconds(t),
                r = this.getTicksAtTime(s);
            return this.getTicksAtTime(s + i) - r;
        }
        _fromType(t) {
            return this.units === 'bpm' && this.multiplier
                ? 1 / (60 / t / this.multiplier)
                : super._fromType(t);
        }
        _toType(t) {
            return this.units === 'bpm' && this.multiplier
                ? (t / this.multiplier) * 60
                : super._toType(t);
        }
        get multiplier() {
            return this._multiplier;
        }
        set multiplier(t) {
            const e = this.value;
            (this._multiplier = t), this.cancelScheduledValues(0), this.setValueAtTime(e, 0);
        }
    }
    class mi extends lt {
        constructor() {
            super(k(mi.getDefaults(), arguments, ['value'])), (this.name = 'TickSignal');
            const t = k(mi.getDefaults(), arguments, ['value']);
            this.input = this._param = new pi({
                context: this.context,
                convert: t.convert,
                multiplier: t.multiplier,
                param: this._constantSource.offset,
                units: t.units,
                value: t.value,
            });
        }
        static getDefaults() {
            return Object.assign(lt.getDefaults(), { multiplier: 1, units: 'hertz', value: 1 });
        }
        ticksToTime(t, e) {
            return this._param.ticksToTime(t, e);
        }
        timeToTicks(t, e) {
            return this._param.timeToTicks(t, e);
        }
        getTimeOfTick(t) {
            return this._param.getTimeOfTick(t);
        }
        getDurationOfTicks(t, e) {
            return this._param.getDurationOfTicks(t, e);
        }
        getTicksAtTime(t) {
            return this._param.getTicksAtTime(t);
        }
        get multiplier() {
            return this._param.multiplier;
        }
        set multiplier(t) {
            this._param.multiplier = t;
        }
        dispose() {
            return super.dispose(), this._param.dispose(), this;
        }
    }
    class gi extends Ft {
        constructor() {
            super(k(gi.getDefaults(), arguments, ['frequency'])),
                (this.name = 'TickSource'),
                (this._state = new Sr()),
                (this._tickOffset = new ge());
            const t = k(gi.getDefaults(), arguments, ['frequency']);
            (this.frequency = new mi({
                context: this.context,
                units: t.units,
                value: t.frequency,
            })),
                st(this, 'frequency'),
                this._state.setStateAtTime('stopped', 0),
                this.setTicksAtTime(0, 0);
        }
        static getDefaults() {
            return Object.assign({ frequency: 1, units: 'hertz' }, Ft.getDefaults());
        }
        get state() {
            return this.getStateAtTime(this.now());
        }
        start(t, e) {
            const s = this.toSeconds(t);
            return (
                this._state.getValueAtTime(s) !== 'started' &&
                    (this._state.setStateAtTime('started', s), $(e) && this.setTicksAtTime(e, s)),
                this
            );
        }
        stop(t) {
            const e = this.toSeconds(t);
            if (this._state.getValueAtTime(e) === 'stopped') {
                const s = this._state.get(e);
                s && s.time > 0 && (this._tickOffset.cancel(s.time), this._state.cancel(s.time));
            }
            return (
                this._state.cancel(e),
                this._state.setStateAtTime('stopped', e),
                this.setTicksAtTime(0, e),
                this
            );
        }
        pause(t) {
            const e = this.toSeconds(t);
            return (
                this._state.getValueAtTime(e) === 'started' &&
                    this._state.setStateAtTime('paused', e),
                this
            );
        }
        cancel(t) {
            return (t = this.toSeconds(t)), this._state.cancel(t), this._tickOffset.cancel(t), this;
        }
        getTicksAtTime(t) {
            const e = this.toSeconds(t),
                s = this._state.getLastState('stopped', e),
                i = { state: 'paused', time: e };
            this._state.add(i);
            let r = s,
                a = 0;
            return (
                this._state.forEachBetween(s.time, e + this.sampleTime, (o) => {
                    let c = r.time;
                    const u = this._tickOffset.get(o.time);
                    u && u.time >= r.time && ((a = u.ticks), (c = u.time)),
                        r.state === 'started' &&
                            o.state !== 'started' &&
                            (a +=
                                this.frequency.getTicksAtTime(o.time) -
                                this.frequency.getTicksAtTime(c)),
                        (r = o);
                }),
                this._state.remove(i),
                a
            );
        }
        get ticks() {
            return this.getTicksAtTime(this.now());
        }
        set ticks(t) {
            this.setTicksAtTime(t, this.now());
        }
        get seconds() {
            return this.getSecondsAtTime(this.now());
        }
        set seconds(t) {
            const e = this.now(),
                s = this.frequency.timeToTicks(t, e);
            this.setTicksAtTime(s, e);
        }
        getSecondsAtTime(t) {
            t = this.toSeconds(t);
            const e = this._state.getLastState('stopped', t),
                s = { state: 'paused', time: t };
            this._state.add(s);
            let i = e,
                r = 0;
            return (
                this._state.forEachBetween(e.time, t + this.sampleTime, (a) => {
                    let o = i.time;
                    const c = this._tickOffset.get(a.time);
                    c && c.time >= i.time && ((r = c.seconds), (o = c.time)),
                        i.state === 'started' && a.state !== 'started' && (r += a.time - o),
                        (i = a);
                }),
                this._state.remove(s),
                r
            );
        }
        setTicksAtTime(t, e) {
            return (
                (e = this.toSeconds(e)),
                this._tickOffset.cancel(e),
                this._tickOffset.add({
                    seconds: this.frequency.getDurationOfTicks(t, e),
                    ticks: t,
                    time: e,
                }),
                this
            );
        }
        getStateAtTime(t) {
            return (t = this.toSeconds(t)), this._state.getValueAtTime(t);
        }
        getTimeOfTick(t, e = this.now()) {
            const s = this._tickOffset.get(e),
                i = this._state.get(e),
                r = Math.max(s.time, i.time),
                a = this.frequency.getTicksAtTime(r) + t - s.ticks;
            return this.frequency.getTimeOfTick(a);
        }
        forEachTickBetween(t, e, s) {
            let i = this._state.get(t);
            this._state.forEachBetween(t, e, (a) => {
                i &&
                    i.state === 'started' &&
                    a.state !== 'started' &&
                    this.forEachTickBetween(Math.max(i.time, t), a.time - this.sampleTime, s),
                    (i = a);
            });
            let r = null;
            if (i && i.state === 'started') {
                const a = Math.max(i.time, t),
                    o = this.frequency.getTicksAtTime(a),
                    c = this.frequency.getTicksAtTime(i.time),
                    u = o - c;
                let l = Math.ceil(u) - u;
                l = ce(l, 1) ? 0 : l;
                let h = this.frequency.getTimeOfTick(o + l);
                for (; h < e; ) {
                    try {
                        s(h, Math.round(this.getTicksAtTime(h)));
                    } catch (f) {
                        r = f;
                        break;
                    }
                    h += this.frequency.getDurationOfTicks(1, h);
                }
            }
            if (r) throw r;
            return this;
        }
        dispose() {
            return (
                super.dispose(),
                this._state.dispose(),
                this._tickOffset.dispose(),
                this.frequency.dispose(),
                this
            );
        }
    }
    class ls extends Ft {
        constructor() {
            super(k(ls.getDefaults(), arguments, ['callback', 'frequency'])),
                (this.name = 'Clock'),
                (this.callback = rt),
                (this._lastUpdate = 0),
                (this._state = new Sr('stopped')),
                (this._boundLoop = this._loop.bind(this));
            const t = k(ls.getDefaults(), arguments, ['callback', 'frequency']);
            (this.callback = t.callback),
                (this._tickSource = new gi({
                    context: this.context,
                    frequency: t.frequency,
                    units: t.units,
                })),
                (this._lastUpdate = 0),
                (this.frequency = this._tickSource.frequency),
                st(this, 'frequency'),
                this._state.setStateAtTime('stopped', 0),
                this.context.on('tick', this._boundLoop);
        }
        static getDefaults() {
            return Object.assign(Ft.getDefaults(), { callback: rt, frequency: 1, units: 'hertz' });
        }
        get state() {
            return this._state.getValueAtTime(this.now());
        }
        start(t, e) {
            La(this.context);
            const s = this.toSeconds(t);
            return (
                this.log('start', s),
                this._state.getValueAtTime(s) !== 'started' &&
                    (this._state.setStateAtTime('started', s),
                    this._tickSource.start(s, e),
                    s < this._lastUpdate && this.emit('start', s, e)),
                this
            );
        }
        stop(t) {
            const e = this.toSeconds(t);
            return (
                this.log('stop', e),
                this._state.cancel(e),
                this._state.setStateAtTime('stopped', e),
                this._tickSource.stop(e),
                e < this._lastUpdate && this.emit('stop', e),
                this
            );
        }
        pause(t) {
            const e = this.toSeconds(t);
            return (
                this._state.getValueAtTime(e) === 'started' &&
                    (this._state.setStateAtTime('paused', e),
                    this._tickSource.pause(e),
                    e < this._lastUpdate && this.emit('pause', e)),
                this
            );
        }
        get ticks() {
            return Math.ceil(this.getTicksAtTime(this.now()));
        }
        set ticks(t) {
            this._tickSource.ticks = t;
        }
        get seconds() {
            return this._tickSource.seconds;
        }
        set seconds(t) {
            this._tickSource.seconds = t;
        }
        getSecondsAtTime(t) {
            return this._tickSource.getSecondsAtTime(t);
        }
        setTicksAtTime(t, e) {
            return this._tickSource.setTicksAtTime(t, e), this;
        }
        getTimeOfTick(t, e = this.now()) {
            return this._tickSource.getTimeOfTick(t, e);
        }
        getTicksAtTime(t) {
            return this._tickSource.getTicksAtTime(t);
        }
        nextTickTime(t, e) {
            const s = this.toSeconds(e),
                i = this.getTicksAtTime(s);
            return this._tickSource.getTimeOfTick(i + t, s);
        }
        _loop() {
            const t = this._lastUpdate,
                e = this.now();
            (this._lastUpdate = e),
                this.log('loop', t, e),
                t !== e &&
                    (this._state.forEachBetween(t, e, (s) => {
                        switch (s.state) {
                            case 'started':
                                const i = this._tickSource.getTicksAtTime(s.time);
                                this.emit('start', s.time, i);
                                break;
                            case 'stopped':
                                s.time !== 0 && this.emit('stop', s.time);
                                break;
                            case 'paused':
                                this.emit('pause', s.time);
                                break;
                        }
                    }),
                    this._tickSource.forEachTickBetween(t, e, (s, i) => {
                        this.callback(s, i);
                    }));
        }
        getStateAtTime(t) {
            const e = this.toSeconds(t);
            return this._state.getValueAtTime(e);
        }
        dispose() {
            return (
                super.dispose(),
                this.context.off('tick', this._boundLoop),
                this._tickSource.dispose(),
                this._state.dispose(),
                this
            );
        }
    }
    as.mixin(ls);
    class Cn extends Q {
        constructor() {
            super(k(Cn.getDefaults(), arguments, ['delayTime', 'maxDelay'])), (this.name = 'Delay');
            const t = k(Cn.getDefaults(), arguments, ['delayTime', 'maxDelay']),
                e = this.toSeconds(t.maxDelay);
            (this._maxDelay = Math.max(e, this.toSeconds(t.delayTime))),
                (this._delayNode = this.input = this.output = this.context.createDelay(e)),
                (this.delayTime = new et({
                    context: this.context,
                    param: this._delayNode.delayTime,
                    units: 'time',
                    value: t.delayTime,
                    minValue: 0,
                    maxValue: this.maxDelay,
                })),
                st(this, 'delayTime');
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { delayTime: 0, maxDelay: 1 });
        }
        get maxDelay() {
            return this._maxDelay;
        }
        dispose() {
            return super.dispose(), this._delayNode.disconnect(), this.delayTime.dispose(), this;
        }
    }
    function Fp(n, t, e = 2, s = Rt().sampleRate) {
        return yt(this, void 0, void 0, function*() {
            const i = Rt(),
                r = new ai(e, t, s);
            ci(r), yield n(r);
            const a = r.render();
            ci(i);
            const o = yield a;
            return new ot(o);
        });
    }
    class jr extends Ae {
        constructor() {
            super(),
                (this.name = 'ToneAudioBuffers'),
                (this._buffers = new Map()),
                (this._loadingCount = 0);
            const t = k(jr.getDefaults(), arguments, ['urls', 'onload', 'baseUrl'], 'urls');
            (this.baseUrl = t.baseUrl),
                Object.keys(t.urls).forEach((e) => {
                    this._loadingCount++;
                    const s = t.urls[e];
                    this.add(e, s, this._bufferLoaded.bind(this, t.onload), t.onerror);
                });
        }
        static getDefaults() {
            return { baseUrl: '', onerror: rt, onload: rt, urls: {} };
        }
        has(t) {
            return this._buffers.has(t.toString());
        }
        get(t) {
            return (
                H(this.has(t), `ToneAudioBuffers has no buffer named: ${t}`),
                this._buffers.get(t.toString())
            );
        }
        _bufferLoaded(t) {
            this._loadingCount--, this._loadingCount === 0 && t && t();
        }
        get loaded() {
            return Array.from(this._buffers).every(([t, e]) => e.loaded);
        }
        add(t, e, s = rt, i = rt) {
            return (
                me(e)
                    ? this._buffers.set(t.toString(), new ot(this.baseUrl + e, s, i))
                    : this._buffers.set(t.toString(), new ot(e, s, i)),
                this
            );
        }
        dispose() {
            return (
                super.dispose(),
                this._buffers.forEach((t) => t.dispose()),
                this._buffers.clear(),
                this
            );
        }
    }
    class ve extends us {
        constructor() {
            super(...arguments), (this.name = 'Ticks'), (this.defaultUnits = 'i');
        }
        _now() {
            return this.context.transport.ticks;
        }
        _beatsToUnits(t) {
            return this._getPPQ() * t;
        }
        _secondsToUnits(t) {
            return Math.floor((t / (60 / this._getBpm())) * this._getPPQ());
        }
        _ticksToUnits(t) {
            return t;
        }
        toTicks() {
            return this.valueOf();
        }
        toSeconds() {
            return (this.valueOf() / this._getPPQ()) * (60 / this._getBpm());
        }
    }
    class Gp extends Ft {
        constructor() {
            super(...arguments),
                (this.name = 'Draw'),
                (this.expiration = 0.25),
                (this.anticipation = 0.008),
                (this._events = new ge()),
                (this._boundDrawLoop = this._drawLoop.bind(this)),
                (this._animationFrame = -1);
        }
        schedule(t, e) {
            return (
                this._events.add({ callback: t, time: this.toSeconds(e) }),
                this._events.length === 1 &&
                    (this._animationFrame = requestAnimationFrame(this._boundDrawLoop)),
                this
            );
        }
        cancel(t) {
            return this._events.cancel(this.toSeconds(t)), this;
        }
        _drawLoop() {
            const t = this.context.currentTime;
            for (; this._events.length && this._events.peek().time - this.anticipation <= t; ) {
                const e = this._events.shift();
                e && t - e.time <= this.expiration && e.callback();
            }
            this._events.length > 0 &&
                (this._animationFrame = requestAnimationFrame(this._boundDrawLoop));
        }
        dispose() {
            return (
                super.dispose(),
                this._events.dispose(),
                cancelAnimationFrame(this._animationFrame),
                this
            );
        }
    }
    ri((n) => {
        n.draw = new Gp({ context: n });
    }),
        oi((n) => {
            n.draw.dispose();
        });
    class Bp extends Ae {
        constructor() {
            super(...arguments),
                (this.name = 'IntervalTimeline'),
                (this._root = null),
                (this._length = 0);
        }
        add(t) {
            H($(t.time), 'Events must have a time property'),
                H($(t.duration), 'Events must have a duration parameter'),
                (t.time = t.time.valueOf());
            let e = new Qp(t.time, t.time + t.duration, t);
            for (
                this._root === null ? (this._root = e) : this._root.insert(e), this._length++;
                e !== null;

            )
                e.updateHeight(), e.updateMax(), this._rebalance(e), (e = e.parent);
            return this;
        }
        remove(t) {
            if (this._root !== null) {
                const e = [];
                this._root.search(t.time, e);
                for (const s of e)
                    if (s.event === t) {
                        this._removeNode(s), this._length--;
                        break;
                    }
            }
            return this;
        }
        get length() {
            return this._length;
        }
        cancel(t) {
            return this.forEachFrom(t, (e) => this.remove(e)), this;
        }
        _setRoot(t) {
            (this._root = t), this._root !== null && (this._root.parent = null);
        }
        _replaceNodeInParent(t, e) {
            t.parent !== null
                ? (t.isLeftChild() ? (t.parent.left = e) : (t.parent.right = e),
                  this._rebalance(t.parent))
                : this._setRoot(e);
        }
        _removeNode(t) {
            if (t.left === null && t.right === null) this._replaceNodeInParent(t, null);
            else if (t.right === null) this._replaceNodeInParent(t, t.left);
            else if (t.left === null) this._replaceNodeInParent(t, t.right);
            else {
                const e = t.getBalance();
                let s,
                    i = null;
                if (e > 0)
                    if (t.left.right === null) (s = t.left), (s.right = t.right), (i = s);
                    else {
                        for (s = t.left.right; s.right !== null; ) s = s.right;
                        s.parent &&
                            ((s.parent.right = s.left),
                            (i = s.parent),
                            (s.left = t.left),
                            (s.right = t.right));
                    }
                else if (t.right.left === null) (s = t.right), (s.left = t.left), (i = s);
                else {
                    for (s = t.right.left; s.left !== null; ) s = s.left;
                    s.parent &&
                        ((s.parent.left = s.right),
                        (i = s.parent),
                        (s.left = t.left),
                        (s.right = t.right));
                }
                t.parent !== null
                    ? t.isLeftChild()
                        ? (t.parent.left = s)
                        : (t.parent.right = s)
                    : this._setRoot(s),
                    i && this._rebalance(i);
            }
            t.dispose();
        }
        _rotateLeft(t) {
            const e = t.parent,
                s = t.isLeftChild(),
                i = t.right;
            i && ((t.right = i.left), (i.left = t)),
                e !== null ? (s ? (e.left = i) : (e.right = i)) : this._setRoot(i);
        }
        _rotateRight(t) {
            const e = t.parent,
                s = t.isLeftChild(),
                i = t.left;
            i && ((t.left = i.right), (i.right = t)),
                e !== null ? (s ? (e.left = i) : (e.right = i)) : this._setRoot(i);
        }
        _rebalance(t) {
            const e = t.getBalance();
            e > 1 && t.left
                ? t.left.getBalance() < 0
                    ? this._rotateLeft(t.left)
                    : this._rotateRight(t)
                : e < -1 &&
                  t.right &&
                  (t.right.getBalance() > 0 ? this._rotateRight(t.right) : this._rotateLeft(t));
        }
        get(t) {
            if (this._root !== null) {
                const e = [];
                if ((this._root.search(t, e), e.length > 0)) {
                    let s = e[0];
                    for (let i = 1; i < e.length; i++) e[i].low > s.low && (s = e[i]);
                    return s.event;
                }
            }
            return null;
        }
        forEach(t) {
            if (this._root !== null) {
                const e = [];
                this._root.traverse((s) => e.push(s)),
                    e.forEach((s) => {
                        s.event && t(s.event);
                    });
            }
            return this;
        }
        forEachAtTime(t, e) {
            if (this._root !== null) {
                const s = [];
                this._root.search(t, s),
                    s.forEach((i) => {
                        i.event && e(i.event);
                    });
            }
            return this;
        }
        forEachFrom(t, e) {
            if (this._root !== null) {
                const s = [];
                this._root.searchAfter(t, s),
                    s.forEach((i) => {
                        i.event && e(i.event);
                    });
            }
            return this;
        }
        dispose() {
            return (
                super.dispose(),
                this._root !== null && this._root.traverse((t) => t.dispose()),
                (this._root = null),
                this
            );
        }
    }
    class Qp {
        constructor(t, e, s) {
            (this._left = null),
                (this._right = null),
                (this.parent = null),
                (this.height = 0),
                (this.event = s),
                (this.low = t),
                (this.high = e),
                (this.max = this.high);
        }
        insert(t) {
            t.low <= this.low
                ? this.left === null
                    ? (this.left = t)
                    : this.left.insert(t)
                : this.right === null
                ? (this.right = t)
                : this.right.insert(t);
        }
        search(t, e) {
            t > this.max ||
                (this.left !== null && this.left.search(t, e),
                this.low <= t && this.high > t && e.push(this),
                !(this.low > t) && this.right !== null && this.right.search(t, e));
        }
        searchAfter(t, e) {
            this.low >= t && (e.push(this), this.left !== null && this.left.searchAfter(t, e)),
                this.right !== null && this.right.searchAfter(t, e);
        }
        traverse(t) {
            t(this),
                this.left !== null && this.left.traverse(t),
                this.right !== null && this.right.traverse(t);
        }
        updateHeight() {
            this.left !== null && this.right !== null
                ? (this.height = Math.max(this.left.height, this.right.height) + 1)
                : this.right !== null
                ? (this.height = this.right.height + 1)
                : this.left !== null
                ? (this.height = this.left.height + 1)
                : (this.height = 0);
        }
        updateMax() {
            (this.max = this.high),
                this.left !== null && (this.max = Math.max(this.max, this.left.max)),
                this.right !== null && (this.max = Math.max(this.max, this.right.max));
        }
        getBalance() {
            let t = 0;
            return (
                this.left !== null && this.right !== null
                    ? (t = this.left.height - this.right.height)
                    : this.left !== null
                    ? (t = this.left.height + 1)
                    : this.right !== null && (t = -(this.right.height + 1)),
                t
            );
        }
        isLeftChild() {
            return this.parent !== null && this.parent.left === this;
        }
        get left() {
            return this._left;
        }
        set left(t) {
            (this._left = t),
                t !== null && (t.parent = this),
                this.updateHeight(),
                this.updateMax();
        }
        get right() {
            return this._right;
        }
        set right(t) {
            (this._right = t),
                t !== null && (t.parent = this),
                this.updateHeight(),
                this.updateMax();
        }
        dispose() {
            (this.parent = null), (this._left = null), (this._right = null), (this.event = null);
        }
    }
    class on extends Q {
        constructor() {
            super(k(on.getDefaults(), arguments, ['volume'])), (this.name = 'Volume');
            const t = k(on.getDefaults(), arguments, ['volume']);
            (this.input = this.output = new ut({
                context: this.context,
                gain: t.volume,
                units: 'decibels',
            })),
                (this.volume = this.output.gain),
                st(this, 'volume'),
                (this._unmutedVolume = t.volume),
                (this.mute = t.mute);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { mute: !1, volume: 0 });
        }
        get mute() {
            return this.volume.value === -1 / 0;
        }
        set mute(t) {
            !this.mute && t
                ? ((this._unmutedVolume = this.volume.value), (this.volume.value = -1 / 0))
                : this.mute && !t && (this.volume.value = this._unmutedVolume);
        }
        dispose() {
            return super.dispose(), this.input.dispose(), this.volume.dispose(), this;
        }
    }
    class Mi extends Q {
        constructor() {
            super(k(Mi.getDefaults(), arguments)),
                (this.name = 'Destination'),
                (this.input = new on({ context: this.context })),
                (this.output = new ut({ context: this.context })),
                (this.volume = this.input.volume);
            const t = k(Mi.getDefaults(), arguments);
            hi(this.input, this.output, this.context.rawContext.destination),
                (this.mute = t.mute),
                (this._internalChannels = [
                    this.input,
                    this.context.rawContext.destination,
                    this.output,
                ]);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { mute: !1, volume: 0 });
        }
        get mute() {
            return this.input.mute;
        }
        set mute(t) {
            this.input.mute = t;
        }
        chain(...t) {
            return (
                this.input.disconnect(), t.unshift(this.input), t.push(this.output), hi(...t), this
            );
        }
        get maxChannelCount() {
            return this.context.rawContext.destination.maxChannelCount;
        }
        dispose() {
            return super.dispose(), this.volume.dispose(), this;
        }
    }
    ri((n) => {
        n.destination = new Mi({ context: n });
    }),
        oi((n) => {
            n.destination.dispose();
        });
    class Zp extends Ae {
        constructor(t) {
            super(),
                (this.name = 'TimelineValue'),
                (this._timeline = new ge({ memory: 10 })),
                (this._initialValue = t);
        }
        set(t, e) {
            return this._timeline.add({ value: t, time: e }), this;
        }
        get(t) {
            const e = this._timeline.get(t);
            return e ? e.value : this._initialValue;
        }
    }
    class Ve {
        constructor(t, e) {
            this.id = Ve._eventId++;
            const s = Object.assign(Ve.getDefaults(), e);
            (this.transport = t),
                (this.callback = s.callback),
                (this._once = s.once),
                (this.time = s.time);
        }
        static getDefaults() {
            return { callback: rt, once: !1, time: 0 };
        }
        invoke(t) {
            this.callback && (this.callback(t), this._once && this.transport.clear(this.id));
        }
        dispose() {
            return (this.callback = void 0), this;
        }
    }
    Ve._eventId = 0;
    class Ar extends Ve {
        constructor(t, e) {
            super(t, e),
                (this._currentId = -1),
                (this._nextId = -1),
                (this._nextTick = this.time),
                (this._boundRestart = this._restart.bind(this));
            const s = Object.assign(Ar.getDefaults(), e);
            (this.duration = new ve(t.context, s.duration).valueOf()),
                (this._interval = new ve(t.context, s.interval).valueOf()),
                (this._nextTick = s.time),
                this.transport.on('start', this._boundRestart),
                this.transport.on('loopStart', this._boundRestart),
                (this.context = this.transport.context),
                this._restart();
        }
        static getDefaults() {
            return Object.assign({}, Ve.getDefaults(), { duration: 1 / 0, interval: 1, once: !1 });
        }
        invoke(t) {
            this._createEvents(t), super.invoke(t);
        }
        _createEvents(t) {
            const e = this.transport.getTicksAtTime(t);
            e >= this.time &&
                e >= this._nextTick &&
                this._nextTick + this._interval < this.time + this.duration &&
                ((this._nextTick += this._interval),
                (this._currentId = this._nextId),
                (this._nextId = this.transport.scheduleOnce(
                    this.invoke.bind(this),
                    new ve(this.context, this._nextTick).toSeconds()
                )));
        }
        _restart(t) {
            this.transport.clear(this._currentId),
                this.transport.clear(this._nextId),
                (this._nextTick = this.time);
            const e = this.transport.getTicksAtTime(t);
            e > this.time &&
                (this._nextTick =
                    this.time + Math.ceil((e - this.time) / this._interval) * this._interval),
                (this._currentId = this.transport.scheduleOnce(
                    this.invoke.bind(this),
                    new ve(this.context, this._nextTick).toSeconds()
                )),
                (this._nextTick += this._interval),
                (this._nextId = this.transport.scheduleOnce(
                    this.invoke.bind(this),
                    new ve(this.context, this._nextTick).toSeconds()
                ));
        }
        dispose() {
            return (
                super.dispose(),
                this.transport.clear(this._currentId),
                this.transport.clear(this._nextId),
                this.transport.off('start', this._boundRestart),
                this.transport.off('loopStart', this._boundRestart),
                this
            );
        }
    }
    class hs extends Ft {
        constructor() {
            super(k(hs.getDefaults(), arguments)),
                (this.name = 'Transport'),
                (this._loop = new Zp(!1)),
                (this._loopStart = 0),
                (this._loopEnd = 0),
                (this._scheduledEvents = {}),
                (this._timeline = new ge()),
                (this._repeatedEvents = new Bp()),
                (this._syncedSignals = []),
                (this._swingAmount = 0);
            const t = k(hs.getDefaults(), arguments);
            (this._ppq = t.ppq),
                (this._clock = new ls({
                    callback: this._processTick.bind(this),
                    context: this.context,
                    frequency: 0,
                    units: 'bpm',
                })),
                this._bindClockEvents(),
                (this.bpm = this._clock.frequency),
                (this._clock.frequency.multiplier = t.ppq),
                this.bpm.setValueAtTime(t.bpm, 0),
                st(this, 'bpm'),
                (this._timeSignature = t.timeSignature),
                (this._swingTicks = t.ppq / 2);
        }
        static getDefaults() {
            return Object.assign(Ft.getDefaults(), {
                bpm: 120,
                loopEnd: '4m',
                loopStart: 0,
                ppq: 192,
                swing: 0,
                swingSubdivision: '8n',
                timeSignature: 4,
            });
        }
        _processTick(t, e) {
            if (
                (this._loop.get(t) &&
                    e >= this._loopEnd &&
                    (this.emit('loopEnd', t),
                    this._clock.setTicksAtTime(this._loopStart, t),
                    (e = this._loopStart),
                    this.emit('loopStart', t, this._clock.getSecondsAtTime(t)),
                    this.emit('loop', t)),
                this._swingAmount > 0 && e % this._ppq !== 0 && e % (this._swingTicks * 2) !== 0)
            ) {
                const s = (e % (this._swingTicks * 2)) / (this._swingTicks * 2),
                    i = Math.sin(s * Math.PI) * this._swingAmount;
                t += new ve(this.context, (this._swingTicks * 2) / 3).toSeconds() * i;
            }
            this._timeline.forEachAtTime(e, (s) => s.invoke(t));
        }
        schedule(t, e) {
            const s = new Ve(this, { callback: t, time: new us(this.context, e).toTicks() });
            return this._addEvent(s, this._timeline);
        }
        scheduleRepeat(t, e, s, i = 1 / 0) {
            const r = new Ar(this, {
                callback: t,
                duration: new ue(this.context, i).toTicks(),
                interval: new ue(this.context, e).toTicks(),
                time: new us(this.context, s).toTicks(),
            });
            return this._addEvent(r, this._repeatedEvents);
        }
        scheduleOnce(t, e) {
            const s = new Ve(this, {
                callback: t,
                once: !0,
                time: new us(this.context, e).toTicks(),
            });
            return this._addEvent(s, this._timeline);
        }
        clear(t) {
            if (this._scheduledEvents.hasOwnProperty(t)) {
                const e = this._scheduledEvents[t.toString()];
                e.timeline.remove(e.event),
                    e.event.dispose(),
                    delete this._scheduledEvents[t.toString()];
            }
            return this;
        }
        _addEvent(t, e) {
            return (
                (this._scheduledEvents[t.id.toString()] = { event: t, timeline: e }), e.add(t), t.id
            );
        }
        cancel(t = 0) {
            const e = this.toTicks(t);
            return (
                this._timeline.forEachFrom(e, (s) => this.clear(s.id)),
                this._repeatedEvents.forEachFrom(e, (s) => this.clear(s.id)),
                this
            );
        }
        _bindClockEvents() {
            this._clock.on('start', (t, e) => {
                (e = new ve(this.context, e).toSeconds()), this.emit('start', t, e);
            }),
                this._clock.on('stop', (t) => {
                    this.emit('stop', t);
                }),
                this._clock.on('pause', (t) => {
                    this.emit('pause', t);
                });
        }
        get state() {
            return this._clock.getStateAtTime(this.now());
        }
        start(t, e) {
            let s;
            return $(e) && (s = this.toTicks(e)), this._clock.start(t, s), this;
        }
        stop(t) {
            return this._clock.stop(t), this;
        }
        pause(t) {
            return this._clock.pause(t), this;
        }
        toggle(t) {
            return (
                (t = this.toSeconds(t)),
                this._clock.getStateAtTime(t) !== 'started' ? this.start(t) : this.stop(t),
                this
            );
        }
        get timeSignature() {
            return this._timeSignature;
        }
        set timeSignature(t) {
            oe(t) && (t = (t[0] / t[1]) * 4), (this._timeSignature = t);
        }
        get loopStart() {
            return new ue(this.context, this._loopStart, 'i').toSeconds();
        }
        set loopStart(t) {
            this._loopStart = this.toTicks(t);
        }
        get loopEnd() {
            return new ue(this.context, this._loopEnd, 'i').toSeconds();
        }
        set loopEnd(t) {
            this._loopEnd = this.toTicks(t);
        }
        get loop() {
            return this._loop.get(this.now());
        }
        set loop(t) {
            this._loop.set(t, this.now());
        }
        setLoopPoints(t, e) {
            return (this.loopStart = t), (this.loopEnd = e), this;
        }
        get swing() {
            return this._swingAmount;
        }
        set swing(t) {
            this._swingAmount = t;
        }
        get swingSubdivision() {
            return new ve(this.context, this._swingTicks).toNotation();
        }
        set swingSubdivision(t) {
            this._swingTicks = this.toTicks(t);
        }
        get position() {
            const t = this.now(),
                e = this._clock.getTicksAtTime(t);
            return new ve(this.context, e).toBarsBeatsSixteenths();
        }
        set position(t) {
            const e = this.toTicks(t);
            this.ticks = e;
        }
        get seconds() {
            return this._clock.seconds;
        }
        set seconds(t) {
            const e = this.now(),
                s = this._clock.frequency.timeToTicks(t, e);
            this.ticks = s;
        }
        get progress() {
            if (this.loop) {
                const t = this.now();
                return (
                    (this._clock.getTicksAtTime(t) - this._loopStart) /
                    (this._loopEnd - this._loopStart)
                );
            } else return 0;
        }
        get ticks() {
            return this._clock.ticks;
        }
        set ticks(t) {
            if (this._clock.ticks !== t) {
                const e = this.now();
                if (this.state === 'started') {
                    const s = this._clock.getTicksAtTime(e),
                        i = this._clock.frequency.getDurationOfTicks(Math.ceil(s) - s, e),
                        r = e + i;
                    this.emit('stop', r),
                        this._clock.setTicksAtTime(t, r),
                        this.emit('start', r, this._clock.getSecondsAtTime(r));
                } else this._clock.setTicksAtTime(t, e);
            }
        }
        getTicksAtTime(t) {
            return Math.round(this._clock.getTicksAtTime(t));
        }
        getSecondsAtTime(t) {
            return this._clock.getSecondsAtTime(t);
        }
        get PPQ() {
            return this._clock.frequency.multiplier;
        }
        set PPQ(t) {
            this._clock.frequency.multiplier = t;
        }
        nextSubdivision(t) {
            if (((t = this.toTicks(t)), this.state !== 'started')) return 0;
            {
                const e = this.now(),
                    s = this.getTicksAtTime(e),
                    i = t - (s % t);
                return this._clock.nextTickTime(i, e);
            }
        }
        syncSignal(t, e) {
            if (!e) {
                const i = this.now();
                if (t.getValueAtTime(i) !== 0) {
                    const a = 1 / (60 / this.bpm.getValueAtTime(i) / this.PPQ);
                    e = t.getValueAtTime(i) / a;
                } else e = 0;
            }
            const s = new ut(e);
            return (
                this.bpm.connect(s),
                s.connect(t._param),
                this._syncedSignals.push({ initial: t.value, ratio: s, signal: t }),
                (t.value = 0),
                this
            );
        }
        unsyncSignal(t) {
            for (let e = this._syncedSignals.length - 1; e >= 0; e--) {
                const s = this._syncedSignals[e];
                s.signal === t &&
                    (s.ratio.dispose(),
                    (s.signal.value = s.initial),
                    this._syncedSignals.splice(e, 1));
            }
            return this;
        }
        dispose() {
            return (
                super.dispose(),
                this._clock.dispose(),
                Pa(this, 'bpm'),
                this._timeline.dispose(),
                this._repeatedEvents.dispose(),
                this
            );
        }
    }
    as.mixin(hs),
        ri((n) => {
            n.transport = new hs({ context: n });
        }),
        oi((n) => {
            n.transport.dispose();
        });
    class Qt extends Q {
        constructor(t) {
            super(t),
                (this.input = void 0),
                (this._state = new Sr('stopped')),
                (this._synced = !1),
                (this._scheduled = []),
                (this._syncedStart = rt),
                (this._syncedStop = rt),
                (this._state.memory = 100),
                (this._state.increasing = !0),
                (this._volume = this.output = new on({
                    context: this.context,
                    mute: t.mute,
                    volume: t.volume,
                })),
                (this.volume = this._volume.volume),
                st(this, 'volume'),
                (this.onstop = t.onstop);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { mute: !1, onstop: rt, volume: 0 });
        }
        get state() {
            return this._synced
                ? this.context.transport.state === 'started'
                    ? this._state.getValueAtTime(this.context.transport.seconds)
                    : 'stopped'
                : this._state.getValueAtTime(this.now());
        }
        get mute() {
            return this._volume.mute;
        }
        set mute(t) {
            this._volume.mute = t;
        }
        _clampToCurrentTime(t) {
            return this._synced ? t : Math.max(t, this.context.currentTime);
        }
        start(t, e, s) {
            let i = Jt(t) && this._synced ? this.context.transport.seconds : this.toSeconds(t);
            if (
                ((i = this._clampToCurrentTime(i)),
                !this._synced && this._state.getValueAtTime(i) === 'started')
            )
                H(
                    ii(i, this._state.get(i).time),
                    'Start time must be strictly greater than previous start time'
                ),
                    this._state.cancel(i),
                    this._state.setStateAtTime('started', i),
                    this.log('restart', i),
                    this.restart(i, e, s);
            else if (
                (this.log('start', i), this._state.setStateAtTime('started', i), this._synced)
            ) {
                const r = this._state.get(i);
                r &&
                    ((r.offset = this.toSeconds(wn(e, 0))),
                    (r.duration = s ? this.toSeconds(s) : void 0));
                const a = this.context.transport.schedule((o) => {
                    this._start(o, e, s);
                }, i);
                this._scheduled.push(a),
                    this.context.transport.state === 'started' &&
                        this.context.transport.getSecondsAtTime(this.immediate()) > i &&
                        this._syncedStart(this.now(), this.context.transport.seconds);
            } else La(this.context), this._start(i, e, s);
            return this;
        }
        stop(t) {
            let e = Jt(t) && this._synced ? this.context.transport.seconds : this.toSeconds(t);
            if (
                ((e = this._clampToCurrentTime(e)),
                this._state.getValueAtTime(e) === 'started' ||
                    $(this._state.getNextState('started', e)))
            ) {
                if ((this.log('stop', e), !this._synced)) this._stop(e);
                else {
                    const s = this.context.transport.schedule(this._stop.bind(this), e);
                    this._scheduled.push(s);
                }
                this._state.cancel(e), this._state.setStateAtTime('stopped', e);
            }
            return this;
        }
        restart(t, e, s) {
            return (
                (t = this.toSeconds(t)),
                this._state.getValueAtTime(t) === 'started' &&
                    (this._state.cancel(t), this._restart(t, e, s)),
                this
            );
        }
        sync() {
            return (
                this._synced ||
                    ((this._synced = !0),
                    (this._syncedStart = (t, e) => {
                        if (e > 0) {
                            const s = this._state.get(e);
                            if (s && s.state === 'started' && s.time !== e) {
                                const i = e - this.toSeconds(s.time);
                                let r;
                                s.duration && (r = this.toSeconds(s.duration) - i),
                                    this._start(t, this.toSeconds(s.offset) + i, r);
                            }
                        }
                    }),
                    (this._syncedStop = (t) => {
                        const e = this.context.transport.getSecondsAtTime(
                            Math.max(t - this.sampleTime, 0)
                        );
                        this._state.getValueAtTime(e) === 'started' && this._stop(t);
                    }),
                    this.context.transport.on('start', this._syncedStart),
                    this.context.transport.on('loopStart', this._syncedStart),
                    this.context.transport.on('stop', this._syncedStop),
                    this.context.transport.on('pause', this._syncedStop),
                    this.context.transport.on('loopEnd', this._syncedStop)),
                this
            );
        }
        unsync() {
            return (
                this._synced &&
                    (this.context.transport.off('stop', this._syncedStop),
                    this.context.transport.off('pause', this._syncedStop),
                    this.context.transport.off('loopEnd', this._syncedStop),
                    this.context.transport.off('start', this._syncedStart),
                    this.context.transport.off('loopStart', this._syncedStart)),
                (this._synced = !1),
                this._scheduled.forEach((t) => this.context.transport.clear(t)),
                (this._scheduled = []),
                this._state.cancel(0),
                this._stop(0),
                this
            );
        }
        dispose() {
            return (
                super.dispose(),
                (this.onstop = rt),
                this.unsync(),
                this._volume.dispose(),
                this._state.dispose(),
                this
            );
        }
    }
    class ds extends bn {
        constructor() {
            super(k(ds.getDefaults(), arguments, ['url', 'onload'])),
                (this.name = 'ToneBufferSource'),
                (this._source = this.context.createBufferSource()),
                (this._internalChannels = [this._source]),
                (this._sourceStarted = !1),
                (this._sourceStopped = !1);
            const t = k(ds.getDefaults(), arguments, ['url', 'onload']);
            xe(this._source, this._gainNode),
                (this._source.onended = () => this._stopSource()),
                (this.playbackRate = new et({
                    context: this.context,
                    param: this._source.playbackRate,
                    units: 'positive',
                    value: t.playbackRate,
                })),
                (this.loop = t.loop),
                (this.loopStart = t.loopStart),
                (this.loopEnd = t.loopEnd),
                (this._buffer = new ot(t.url, t.onload, t.onerror)),
                this._internalChannels.push(this._source);
        }
        static getDefaults() {
            return Object.assign(bn.getDefaults(), {
                url: new ot(),
                loop: !1,
                loopEnd: 0,
                loopStart: 0,
                onload: rt,
                onerror: rt,
                playbackRate: 1,
            });
        }
        get fadeIn() {
            return this._fadeIn;
        }
        set fadeIn(t) {
            this._fadeIn = t;
        }
        get fadeOut() {
            return this._fadeOut;
        }
        set fadeOut(t) {
            this._fadeOut = t;
        }
        get curve() {
            return this._curve;
        }
        set curve(t) {
            this._curve = t;
        }
        start(t, e, s, i = 1) {
            H(this.buffer.loaded, 'buffer is either not set or not loaded');
            const r = this.toSeconds(t);
            this._startGain(r, i), this.loop ? (e = wn(e, this.loopStart)) : (e = wn(e, 0));
            let a = Math.max(this.toSeconds(e), 0);
            if (this.loop) {
                const o = this.toSeconds(this.loopEnd) || this.buffer.duration,
                    c = this.toSeconds(this.loopStart),
                    u = o - c;
                Tr(a, o) && (a = ((a - c) % u) + c), ce(a, this.buffer.duration) && (a = 0);
            }
            if (
                ((this._source.buffer = this.buffer.get()),
                (this._source.loopEnd = this.toSeconds(this.loopEnd) || this.buffer.duration),
                Ea(a, this.buffer.duration) &&
                    ((this._sourceStarted = !0), this._source.start(r, a)),
                $(s))
            ) {
                let o = this.toSeconds(s);
                (o = Math.max(o, 0)), this.stop(r + o);
            }
            return this;
        }
        _stopSource(t) {
            !this._sourceStopped &&
                this._sourceStarted &&
                ((this._sourceStopped = !0), this._source.stop(this.toSeconds(t)), this._onended());
        }
        get loopStart() {
            return this._source.loopStart;
        }
        set loopStart(t) {
            this._source.loopStart = this.toSeconds(t);
        }
        get loopEnd() {
            return this._source.loopEnd;
        }
        set loopEnd(t) {
            this._source.loopEnd = this.toSeconds(t);
        }
        get buffer() {
            return this._buffer;
        }
        set buffer(t) {
            this._buffer.set(t);
        }
        get loop() {
            return this._source.loop;
        }
        set loop(t) {
            (this._source.loop = t), this._sourceStarted && this.cancelStop();
        }
        dispose() {
            return (
                super.dispose(),
                (this._source.onended = null),
                this._source.disconnect(),
                this._buffer.dispose(),
                this.playbackRate.dispose(),
                this
            );
        }
    }
    function an(n, t) {
        return yt(this, void 0, void 0, function*() {
            const e = t / n.context.sampleRate,
                s = new ai(1, e, n.context.sampleRate);
            return (
                new n.constructor(
                    Object.assign(n.get(), { frequency: 2 / e, detune: 0, context: s })
                )
                    .toDestination()
                    .start(0),
                (yield s.render()).getChannelData(0)
            );
        });
    }
    class yi extends bn {
        constructor() {
            super(k(yi.getDefaults(), arguments, ['frequency', 'type'])),
                (this.name = 'ToneOscillatorNode'),
                (this._oscillator = this.context.createOscillator()),
                (this._internalChannels = [this._oscillator]);
            const t = k(yi.getDefaults(), arguments, ['frequency', 'type']);
            xe(this._oscillator, this._gainNode),
                (this.type = t.type),
                (this.frequency = new et({
                    context: this.context,
                    param: this._oscillator.frequency,
                    units: 'frequency',
                    value: t.frequency,
                })),
                (this.detune = new et({
                    context: this.context,
                    param: this._oscillator.detune,
                    units: 'cents',
                    value: t.detune,
                })),
                st(this, ['frequency', 'detune']);
        }
        static getDefaults() {
            return Object.assign(bn.getDefaults(), { detune: 0, frequency: 440, type: 'sine' });
        }
        start(t) {
            const e = this.toSeconds(t);
            return this.log('start', e), this._startGain(e), this._oscillator.start(e), this;
        }
        _stopSource(t) {
            this._oscillator.stop(t);
        }
        setPeriodicWave(t) {
            return this._oscillator.setPeriodicWave(t), this;
        }
        get type() {
            return this._oscillator.type;
        }
        set type(t) {
            this._oscillator.type = t;
        }
        dispose() {
            return (
                super.dispose(),
                this.state === 'started' && this.stop(),
                this._oscillator.disconnect(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this
            );
        }
    }
    class ft extends Qt {
        constructor() {
            super(k(ft.getDefaults(), arguments, ['frequency', 'type'])),
                (this.name = 'Oscillator'),
                (this._oscillator = null);
            const t = k(ft.getDefaults(), arguments, ['frequency', 'type']);
            (this.frequency = new lt({
                context: this.context,
                units: 'frequency',
                value: t.frequency,
            })),
                st(this, 'frequency'),
                (this.detune = new lt({ context: this.context, units: 'cents', value: t.detune })),
                st(this, 'detune'),
                (this._partials = t.partials),
                (this._partialCount = t.partialCount),
                (this._type = t.type),
                t.partialCount &&
                    t.type !== 'custom' &&
                    (this._type = this.baseType + t.partialCount.toString()),
                (this.phase = t.phase);
        }
        static getDefaults() {
            return Object.assign(Qt.getDefaults(), {
                detune: 0,
                frequency: 440,
                partialCount: 0,
                partials: [],
                phase: 0,
                type: 'sine',
            });
        }
        _start(t) {
            const e = this.toSeconds(t),
                s = new yi({ context: this.context, onended: () => this.onstop(this) });
            (this._oscillator = s),
                this._wave
                    ? this._oscillator.setPeriodicWave(this._wave)
                    : (this._oscillator.type = this._type),
                this._oscillator.connect(this.output),
                this.frequency.connect(this._oscillator.frequency),
                this.detune.connect(this._oscillator.detune),
                this._oscillator.start(e);
        }
        _stop(t) {
            const e = this.toSeconds(t);
            this._oscillator && this._oscillator.stop(e);
        }
        _restart(t) {
            const e = this.toSeconds(t);
            return (
                this.log('restart', e),
                this._oscillator && this._oscillator.cancelStop(),
                this._state.cancel(e),
                this
            );
        }
        syncFrequency() {
            return this.context.transport.syncSignal(this.frequency), this;
        }
        unsyncFrequency() {
            return this.context.transport.unsyncSignal(this.frequency), this;
        }
        _getCachedPeriodicWave() {
            if (this._type === 'custom')
                return ft._periodicWaveCache.find(
                    (e) => e.phase === this._phase && Dp(e.partials, this._partials)
                );
            {
                const t = ft._periodicWaveCache.find(
                    (e) => e.type === this._type && e.phase === this._phase
                );
                return (this._partialCount = t ? t.partialCount : this._partialCount), t;
            }
        }
        get type() {
            return this._type;
        }
        set type(t) {
            this._type = t;
            const e = ['sine', 'square', 'sawtooth', 'triangle'].indexOf(t) !== -1;
            if (this._phase === 0 && e)
                (this._wave = void 0),
                    (this._partialCount = 0),
                    this._oscillator !== null && (this._oscillator.type = t);
            else {
                const s = this._getCachedPeriodicWave();
                if ($(s)) {
                    const { partials: i, wave: r } = s;
                    (this._wave = r),
                        (this._partials = i),
                        this._oscillator !== null && this._oscillator.setPeriodicWave(this._wave);
                } else {
                    const [i, r] = this._getRealImaginary(t, this._phase),
                        a = this.context.createPeriodicWave(i, r);
                    (this._wave = a),
                        this._oscillator !== null && this._oscillator.setPeriodicWave(this._wave),
                        ft._periodicWaveCache.push({
                            imag: r,
                            partialCount: this._partialCount,
                            partials: this._partials,
                            phase: this._phase,
                            real: i,
                            type: this._type,
                            wave: this._wave,
                        }),
                        ft._periodicWaveCache.length > 100 && ft._periodicWaveCache.shift();
                }
            }
        }
        get baseType() {
            return this._type.replace(this.partialCount.toString(), '');
        }
        set baseType(t) {
            this.partialCount && this._type !== 'custom' && t !== 'custom'
                ? (this.type = t + this.partialCount)
                : (this.type = t);
        }
        get partialCount() {
            return this._partialCount;
        }
        set partialCount(t) {
            Ye(t, 0);
            let e = this._type;
            const s = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(this._type);
            if ((s && (e = s[1]), this._type !== 'custom'))
                t === 0 ? (this.type = e) : (this.type = e + t.toString());
            else {
                const i = new Float32Array(t);
                this._partials.forEach((r, a) => (i[a] = r)),
                    (this._partials = Array.from(i)),
                    (this.type = this._type);
            }
        }
        _getRealImaginary(t, e) {
            let i = 2048;
            const r = new Float32Array(i),
                a = new Float32Array(i);
            let o = 1;
            if (t === 'custom') {
                if (
                    ((o = this._partials.length + 1),
                    (this._partialCount = this._partials.length),
                    (i = o),
                    this._partials.length === 0)
                )
                    return [r, a];
            } else {
                const c = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(t);
                c
                    ? ((o = parseInt(c[2], 10) + 1),
                      (this._partialCount = parseInt(c[2], 10)),
                      (t = c[1]),
                      (o = Math.max(o, 2)),
                      (i = o))
                    : (this._partialCount = 0),
                    (this._partials = []);
            }
            for (let c = 1; c < i; ++c) {
                const u = 2 / (c * Math.PI);
                let l;
                switch (t) {
                    case 'sine':
                        (l = c <= o ? 1 : 0), (this._partials[c - 1] = l);
                        break;
                    case 'square':
                        (l = c & 1 ? 2 * u : 0), (this._partials[c - 1] = l);
                        break;
                    case 'sawtooth':
                        (l = u * (c & 1 ? 1 : -1)), (this._partials[c - 1] = l);
                        break;
                    case 'triangle':
                        c & 1 ? (l = 2 * (u * u) * (((c - 1) >> 1) & 1 ? -1 : 1)) : (l = 0),
                            (this._partials[c - 1] = l);
                        break;
                    case 'custom':
                        l = this._partials[c - 1];
                        break;
                    default:
                        throw new TypeError('Oscillator: invalid type: ' + t);
                }
                l !== 0
                    ? ((r[c] = -l * Math.sin(e * c)), (a[c] = l * Math.cos(e * c)))
                    : ((r[c] = 0), (a[c] = 0));
            }
            return [r, a];
        }
        _inverseFFT(t, e, s) {
            let i = 0;
            const r = t.length;
            for (let a = 0; a < r; a++) i += t[a] * Math.cos(a * s) + e[a] * Math.sin(a * s);
            return i;
        }
        getInitialValue() {
            const [t, e] = this._getRealImaginary(this._type, 0);
            let s = 0;
            const i = Math.PI * 2,
                r = 32;
            for (let a = 0; a < r; a++) s = Math.max(this._inverseFFT(t, e, (a / r) * i), s);
            return Cp(-this._inverseFFT(t, e, this._phase) / s, -1, 1);
        }
        get partials() {
            return this._partials.slice(0, this.partialCount);
        }
        set partials(t) {
            (this._partials = t),
                (this._partialCount = this._partials.length),
                t.length && (this.type = 'custom');
        }
        get phase() {
            return this._phase * (180 / Math.PI);
        }
        set phase(t) {
            (this._phase = (t * Math.PI) / 180), (this.type = this._type);
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this._oscillator !== null && this._oscillator.dispose(),
                (this._wave = void 0),
                this.frequency.dispose(),
                this.detune.dispose(),
                this
            );
        }
    }
    ft._periodicWaveCache = [];
    class We extends Q {
        constructor() {
            super(Object.assign(k(We.getDefaults(), arguments, ['context'])));
        }
        connect(t, e = 0, s = 0) {
            return fi(this, t, e, s), this;
        }
    }
    class En extends We {
        constructor() {
            super(Object.assign(k(En.getDefaults(), arguments, ['mapping', 'length']))),
                (this.name = 'WaveShaper'),
                (this._shaper = this.context.createWaveShaper()),
                (this.input = this._shaper),
                (this.output = this._shaper);
            const t = k(En.getDefaults(), arguments, ['mapping', 'length']);
            oe(t.mapping) || t.mapping instanceof Float32Array
                ? (this.curve = Float32Array.from(t.mapping))
                : Ip(t.mapping) && this.setMap(t.mapping, t.length);
        }
        static getDefaults() {
            return Object.assign(lt.getDefaults(), { length: 1024 });
        }
        setMap(t, e = 1024) {
            const s = new Float32Array(e);
            for (let i = 0, r = e; i < r; i++) {
                const a = (i / (r - 1)) * 2 - 1;
                s[i] = t(a, i);
            }
            return (this.curve = s), this;
        }
        get curve() {
            return this._shaper.curve;
        }
        set curve(t) {
            this._shaper.curve = t;
        }
        get oversample() {
            return this._shaper.oversample;
        }
        set oversample(t) {
            const e = ['none', '2x', '4x'].some((s) => s.includes(t));
            H(e, "oversampling must be either 'none', '2x', or '4x'"),
                (this._shaper.oversample = t);
        }
        dispose() {
            return super.dispose(), this._shaper.disconnect(), this;
        }
    }
    class Va extends We {
        constructor() {
            super(...arguments),
                (this.name = 'AudioToGain'),
                (this._norm = new En({ context: this.context, mapping: (t) => (t + 1) / 2 })),
                (this.input = this._norm),
                (this.output = this._norm);
        }
        dispose() {
            return super.dispose(), this._norm.dispose(), this;
        }
    }
    class Fe extends lt {
        constructor() {
            super(Object.assign(k(Fe.getDefaults(), arguments, ['value']))),
                (this.name = 'Multiply'),
                (this.override = !1);
            const t = k(Fe.getDefaults(), arguments, ['value']);
            (this._mult = this.input = this.output = new ut({
                context: this.context,
                minValue: t.minValue,
                maxValue: t.maxValue,
            })),
                (this.factor = this._param = this._mult.gain),
                this.factor.setValueAtTime(t.value, 0);
        }
        static getDefaults() {
            return Object.assign(lt.getDefaults(), { value: 0 });
        }
        dispose() {
            return super.dispose(), this._mult.dispose(), this;
        }
    }
    class fs extends Qt {
        constructor() {
            super(k(fs.getDefaults(), arguments, ['frequency', 'type', 'modulationType'])),
                (this.name = 'AMOscillator'),
                (this._modulationScale = new Va({ context: this.context })),
                (this._modulationNode = new ut({ context: this.context }));
            const t = k(fs.getDefaults(), arguments, ['frequency', 'type', 'modulationType']);
            (this._carrier = new ft({
                context: this.context,
                detune: t.detune,
                frequency: t.frequency,
                onstop: () => this.onstop(this),
                phase: t.phase,
                type: t.type,
            })),
                (this.frequency = this._carrier.frequency),
                (this.detune = this._carrier.detune),
                (this._modulator = new ft({
                    context: this.context,
                    phase: t.phase,
                    type: t.modulationType,
                })),
                (this.harmonicity = new Fe({
                    context: this.context,
                    units: 'positive',
                    value: t.harmonicity,
                })),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this._modulator.chain(this._modulationScale, this._modulationNode.gain),
                this._carrier.chain(this._modulationNode, this.output),
                st(this, ['frequency', 'detune', 'harmonicity']);
        }
        static getDefaults() {
            return Object.assign(ft.getDefaults(), { harmonicity: 1, modulationType: 'square' });
        }
        _start(t) {
            this._modulator.start(t), this._carrier.start(t);
        }
        _stop(t) {
            this._modulator.stop(t), this._carrier.stop(t);
        }
        _restart(t) {
            this._modulator.restart(t), this._carrier.restart(t);
        }
        get type() {
            return this._carrier.type;
        }
        set type(t) {
            this._carrier.type = t;
        }
        get baseType() {
            return this._carrier.baseType;
        }
        set baseType(t) {
            this._carrier.baseType = t;
        }
        get partialCount() {
            return this._carrier.partialCount;
        }
        set partialCount(t) {
            this._carrier.partialCount = t;
        }
        get modulationType() {
            return this._modulator.type;
        }
        set modulationType(t) {
            this._modulator.type = t;
        }
        get phase() {
            return this._carrier.phase;
        }
        set phase(t) {
            (this._carrier.phase = t), (this._modulator.phase = t);
        }
        get partials() {
            return this._carrier.partials;
        }
        set partials(t) {
            this._carrier.partials = t;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this.harmonicity.dispose(),
                this._carrier.dispose(),
                this._modulator.dispose(),
                this._modulationNode.dispose(),
                this._modulationScale.dispose(),
                this
            );
        }
    }
    class ps extends Qt {
        constructor() {
            super(k(ps.getDefaults(), arguments, ['frequency', 'type', 'modulationType'])),
                (this.name = 'FMOscillator'),
                (this._modulationNode = new ut({ context: this.context, gain: 0 }));
            const t = k(ps.getDefaults(), arguments, ['frequency', 'type', 'modulationType']);
            (this._carrier = new ft({
                context: this.context,
                detune: t.detune,
                frequency: 0,
                onstop: () => this.onstop(this),
                phase: t.phase,
                type: t.type,
            })),
                (this.detune = this._carrier.detune),
                (this.frequency = new lt({
                    context: this.context,
                    units: 'frequency',
                    value: t.frequency,
                })),
                (this._modulator = new ft({
                    context: this.context,
                    phase: t.phase,
                    type: t.modulationType,
                })),
                (this.harmonicity = new Fe({
                    context: this.context,
                    units: 'positive',
                    value: t.harmonicity,
                })),
                (this.modulationIndex = new Fe({
                    context: this.context,
                    units: 'positive',
                    value: t.modulationIndex,
                })),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this.frequency.chain(this.modulationIndex, this._modulationNode),
                this._modulator.connect(this._modulationNode.gain),
                this._modulationNode.connect(this._carrier.frequency),
                this._carrier.connect(this.output),
                this.detune.connect(this._modulator.detune),
                st(this, ['modulationIndex', 'frequency', 'detune', 'harmonicity']);
        }
        static getDefaults() {
            return Object.assign(ft.getDefaults(), {
                harmonicity: 1,
                modulationIndex: 2,
                modulationType: 'square',
            });
        }
        _start(t) {
            this._modulator.start(t), this._carrier.start(t);
        }
        _stop(t) {
            this._modulator.stop(t), this._carrier.stop(t);
        }
        _restart(t) {
            return this._modulator.restart(t), this._carrier.restart(t), this;
        }
        get type() {
            return this._carrier.type;
        }
        set type(t) {
            this._carrier.type = t;
        }
        get baseType() {
            return this._carrier.baseType;
        }
        set baseType(t) {
            this._carrier.baseType = t;
        }
        get partialCount() {
            return this._carrier.partialCount;
        }
        set partialCount(t) {
            this._carrier.partialCount = t;
        }
        get modulationType() {
            return this._modulator.type;
        }
        set modulationType(t) {
            this._modulator.type = t;
        }
        get phase() {
            return this._carrier.phase;
        }
        set phase(t) {
            (this._carrier.phase = t), (this._modulator.phase = t);
        }
        get partials() {
            return this._carrier.partials;
        }
        set partials(t) {
            this._carrier.partials = t;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this.frequency.dispose(),
                this.harmonicity.dispose(),
                this._carrier.dispose(),
                this._modulator.dispose(),
                this._modulationNode.dispose(),
                this.modulationIndex.dispose(),
                this
            );
        }
    }
    class On extends Qt {
        constructor() {
            super(k(On.getDefaults(), arguments, ['frequency', 'width'])),
                (this.name = 'PulseOscillator'),
                (this._widthGate = new ut({ context: this.context, gain: 0 })),
                (this._thresh = new En({
                    context: this.context,
                    mapping: (e) => (e <= 0 ? -1 : 1),
                }));
            const t = k(On.getDefaults(), arguments, ['frequency', 'width']);
            (this.width = new lt({ context: this.context, units: 'audioRange', value: t.width })),
                (this._triangle = new ft({
                    context: this.context,
                    detune: t.detune,
                    frequency: t.frequency,
                    onstop: () => this.onstop(this),
                    phase: t.phase,
                    type: 'triangle',
                })),
                (this.frequency = this._triangle.frequency),
                (this.detune = this._triangle.detune),
                this._triangle.chain(this._thresh, this.output),
                this.width.chain(this._widthGate, this._thresh),
                st(this, ['width', 'frequency', 'detune']);
        }
        static getDefaults() {
            return Object.assign(Qt.getDefaults(), {
                detune: 0,
                frequency: 440,
                phase: 0,
                type: 'pulse',
                width: 0.2,
            });
        }
        _start(t) {
            (t = this.toSeconds(t)),
                this._triangle.start(t),
                this._widthGate.gain.setValueAtTime(1, t);
        }
        _stop(t) {
            (t = this.toSeconds(t)),
                this._triangle.stop(t),
                this._widthGate.gain.cancelScheduledValues(t),
                this._widthGate.gain.setValueAtTime(0, t);
        }
        _restart(t) {
            this._triangle.restart(t),
                this._widthGate.gain.cancelScheduledValues(t),
                this._widthGate.gain.setValueAtTime(1, t);
        }
        get phase() {
            return this._triangle.phase;
        }
        set phase(t) {
            this._triangle.phase = t;
        }
        get type() {
            return 'pulse';
        }
        get baseType() {
            return 'pulse';
        }
        get partials() {
            return [];
        }
        get partialCount() {
            return 0;
        }
        set carrierType(t) {
            this._triangle.type = t;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this._triangle.dispose(),
                this.width.dispose(),
                this._widthGate.dispose(),
                this._thresh.dispose(),
                this
            );
        }
    }
    class ms extends Qt {
        constructor() {
            super(k(ms.getDefaults(), arguments, ['frequency', 'type', 'spread'])),
                (this.name = 'FatOscillator'),
                (this._oscillators = []);
            const t = k(ms.getDefaults(), arguments, ['frequency', 'type', 'spread']);
            (this.frequency = new lt({
                context: this.context,
                units: 'frequency',
                value: t.frequency,
            })),
                (this.detune = new lt({ context: this.context, units: 'cents', value: t.detune })),
                (this._spread = t.spread),
                (this._type = t.type),
                (this._phase = t.phase),
                (this._partials = t.partials),
                (this._partialCount = t.partialCount),
                (this.count = t.count),
                st(this, ['frequency', 'detune']);
        }
        static getDefaults() {
            return Object.assign(ft.getDefaults(), { count: 3, spread: 20, type: 'sawtooth' });
        }
        _start(t) {
            (t = this.toSeconds(t)), this._forEach((e) => e.start(t));
        }
        _stop(t) {
            (t = this.toSeconds(t)), this._forEach((e) => e.stop(t));
        }
        _restart(t) {
            this._forEach((e) => e.restart(t));
        }
        _forEach(t) {
            for (let e = 0; e < this._oscillators.length; e++) t(this._oscillators[e], e);
        }
        get type() {
            return this._type;
        }
        set type(t) {
            (this._type = t), this._forEach((e) => (e.type = t));
        }
        get spread() {
            return this._spread;
        }
        set spread(t) {
            if (((this._spread = t), this._oscillators.length > 1)) {
                const e = -t / 2,
                    s = t / (this._oscillators.length - 1);
                this._forEach((i, r) => (i.detune.value = e + s * r));
            }
        }
        get count() {
            return this._oscillators.length;
        }
        set count(t) {
            if ((Ye(t, 1), this._oscillators.length !== t)) {
                this._forEach((e) => e.dispose()), (this._oscillators = []);
                for (let e = 0; e < t; e++) {
                    const s = new ft({
                        context: this.context,
                        volume: -6 - t * 1.1,
                        type: this._type,
                        phase: this._phase + (e / t) * 360,
                        partialCount: this._partialCount,
                        onstop: e === 0 ? () => this.onstop(this) : rt,
                    });
                    this.type === 'custom' && (s.partials = this._partials),
                        this.frequency.connect(s.frequency),
                        this.detune.connect(s.detune),
                        (s.detune.overridden = !1),
                        s.connect(this.output),
                        (this._oscillators[e] = s);
                }
                (this.spread = this._spread),
                    this.state === 'started' && this._forEach((e) => e.start());
            }
        }
        get phase() {
            return this._phase;
        }
        set phase(t) {
            (this._phase = t),
                this._forEach((e, s) => (e.phase = this._phase + (s / this.count) * 360));
        }
        get baseType() {
            return this._oscillators[0].baseType;
        }
        set baseType(t) {
            this._forEach((e) => (e.baseType = t)), (this._type = this._oscillators[0].type);
        }
        get partials() {
            return this._oscillators[0].partials;
        }
        set partials(t) {
            (this._partials = t),
                (this._partialCount = this._partials.length),
                t.length && ((this._type = 'custom'), this._forEach((e) => (e.partials = t)));
        }
        get partialCount() {
            return this._oscillators[0].partialCount;
        }
        set partialCount(t) {
            (this._partialCount = t),
                this._forEach((e) => (e.partialCount = t)),
                (this._type = this._oscillators[0].type);
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this._forEach((t) => t.dispose()),
                this
            );
        }
    }
    class gs extends Qt {
        constructor() {
            super(k(gs.getDefaults(), arguments, ['frequency', 'modulationFrequency'])),
                (this.name = 'PWMOscillator'),
                (this.sourceType = 'pwm'),
                (this._scale = new Fe({ context: this.context, value: 2 }));
            const t = k(gs.getDefaults(), arguments, ['frequency', 'modulationFrequency']);
            (this._pulse = new On({ context: this.context, frequency: t.modulationFrequency })),
                (this._pulse.carrierType = 'sine'),
                (this.modulationFrequency = this._pulse.frequency),
                (this._modulator = new ft({
                    context: this.context,
                    detune: t.detune,
                    frequency: t.frequency,
                    onstop: () => this.onstop(this),
                    phase: t.phase,
                })),
                (this.frequency = this._modulator.frequency),
                (this.detune = this._modulator.detune),
                this._modulator.chain(this._scale, this._pulse.width),
                this._pulse.connect(this.output),
                st(this, ['modulationFrequency', 'frequency', 'detune']);
        }
        static getDefaults() {
            return Object.assign(Qt.getDefaults(), {
                detune: 0,
                frequency: 440,
                modulationFrequency: 0.4,
                phase: 0,
                type: 'pwm',
            });
        }
        _start(t) {
            (t = this.toSeconds(t)), this._modulator.start(t), this._pulse.start(t);
        }
        _stop(t) {
            (t = this.toSeconds(t)), this._modulator.stop(t), this._pulse.stop(t);
        }
        _restart(t) {
            this._modulator.restart(t), this._pulse.restart(t);
        }
        get type() {
            return 'pwm';
        }
        get baseType() {
            return 'pwm';
        }
        get partials() {
            return [];
        }
        get partialCount() {
            return 0;
        }
        get phase() {
            return this._modulator.phase;
        }
        set phase(t) {
            this._modulator.phase = t;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this._pulse.dispose(),
                this._scale.dispose(),
                this._modulator.dispose(),
                this
            );
        }
    }
    const Wa = { am: fs, fat: ms, fm: ps, oscillator: ft, pulse: On, pwm: gs };
    class Ms extends Qt {
        constructor() {
            super(k(Ms.getDefaults(), arguments, ['frequency', 'type'])),
                (this.name = 'OmniOscillator');
            const t = k(Ms.getDefaults(), arguments, ['frequency', 'type']);
            (this.frequency = new lt({
                context: this.context,
                units: 'frequency',
                value: t.frequency,
            })),
                (this.detune = new lt({ context: this.context, units: 'cents', value: t.detune })),
                st(this, ['frequency', 'detune']),
                this.set(t);
        }
        static getDefaults() {
            return Object.assign(
                ft.getDefaults(),
                ps.getDefaults(),
                fs.getDefaults(),
                ms.getDefaults(),
                On.getDefaults(),
                gs.getDefaults()
            );
        }
        _start(t) {
            this._oscillator.start(t);
        }
        _stop(t) {
            this._oscillator.stop(t);
        }
        _restart(t) {
            return this._oscillator.restart(t), this;
        }
        get type() {
            let t = '';
            return (
                ['am', 'fm', 'fat'].some((e) => this._sourceType === e) && (t = this._sourceType),
                t + this._oscillator.type
            );
        }
        set type(t) {
            t.substr(0, 2) === 'fm'
                ? (this._createNewOscillator('fm'),
                  (this._oscillator = this._oscillator),
                  (this._oscillator.type = t.substr(2)))
                : t.substr(0, 2) === 'am'
                ? (this._createNewOscillator('am'),
                  (this._oscillator = this._oscillator),
                  (this._oscillator.type = t.substr(2)))
                : t.substr(0, 3) === 'fat'
                ? (this._createNewOscillator('fat'),
                  (this._oscillator = this._oscillator),
                  (this._oscillator.type = t.substr(3)))
                : t === 'pwm'
                ? (this._createNewOscillator('pwm'), (this._oscillator = this._oscillator))
                : t === 'pulse'
                ? this._createNewOscillator('pulse')
                : (this._createNewOscillator('oscillator'),
                  (this._oscillator = this._oscillator),
                  (this._oscillator.type = t));
        }
        get partials() {
            return this._oscillator.partials;
        }
        set partials(t) {
            !this._getOscType(this._oscillator, 'pulse') &&
                !this._getOscType(this._oscillator, 'pwm') &&
                (this._oscillator.partials = t);
        }
        get partialCount() {
            return this._oscillator.partialCount;
        }
        set partialCount(t) {
            !this._getOscType(this._oscillator, 'pulse') &&
                !this._getOscType(this._oscillator, 'pwm') &&
                (this._oscillator.partialCount = t);
        }
        set(t) {
            return Reflect.has(t, 'type') && t.type && (this.type = t.type), super.set(t), this;
        }
        _createNewOscillator(t) {
            if (t !== this._sourceType) {
                this._sourceType = t;
                const e = Wa[t],
                    s = this.now();
                if (this._oscillator) {
                    const i = this._oscillator;
                    i.stop(s), this.context.setTimeout(() => i.dispose(), this.blockTime);
                }
                (this._oscillator = new e({ context: this.context })),
                    this.frequency.connect(this._oscillator.frequency),
                    this.detune.connect(this._oscillator.detune),
                    this._oscillator.connect(this.output),
                    (this._oscillator.onstop = () => this.onstop(this)),
                    this.state === 'started' && this._oscillator.start(s);
            }
        }
        get phase() {
            return this._oscillator.phase;
        }
        set phase(t) {
            this._oscillator.phase = t;
        }
        get sourceType() {
            return this._sourceType;
        }
        set sourceType(t) {
            let e = 'sine';
            this._oscillator.type !== 'pwm' &&
                this._oscillator.type !== 'pulse' &&
                (e = this._oscillator.type),
                t === 'fm'
                    ? (this.type = 'fm' + e)
                    : t === 'am'
                    ? (this.type = 'am' + e)
                    : t === 'fat'
                    ? (this.type = 'fat' + e)
                    : t === 'oscillator'
                    ? (this.type = e)
                    : t === 'pulse'
                    ? (this.type = 'pulse')
                    : t === 'pwm' && (this.type = 'pwm');
        }
        _getOscType(t, e) {
            return t instanceof Wa[e];
        }
        get baseType() {
            return this._oscillator.baseType;
        }
        set baseType(t) {
            !this._getOscType(this._oscillator, 'pulse') &&
                !this._getOscType(this._oscillator, 'pwm') &&
                t !== 'pulse' &&
                t !== 'pwm' &&
                (this._oscillator.baseType = t);
        }
        get width() {
            if (this._getOscType(this._oscillator, 'pulse')) return this._oscillator.width;
        }
        get count() {
            if (this._getOscType(this._oscillator, 'fat')) return this._oscillator.count;
        }
        set count(t) {
            this._getOscType(this._oscillator, 'fat') && en(t) && (this._oscillator.count = t);
        }
        get spread() {
            if (this._getOscType(this._oscillator, 'fat')) return this._oscillator.spread;
        }
        set spread(t) {
            this._getOscType(this._oscillator, 'fat') && en(t) && (this._oscillator.spread = t);
        }
        get modulationType() {
            if (
                this._getOscType(this._oscillator, 'fm') ||
                this._getOscType(this._oscillator, 'am')
            )
                return this._oscillator.modulationType;
        }
        set modulationType(t) {
            (this._getOscType(this._oscillator, 'fm') ||
                this._getOscType(this._oscillator, 'am')) &&
                me(t) &&
                (this._oscillator.modulationType = t);
        }
        get modulationIndex() {
            if (this._getOscType(this._oscillator, 'fm')) return this._oscillator.modulationIndex;
        }
        get harmonicity() {
            if (
                this._getOscType(this._oscillator, 'fm') ||
                this._getOscType(this._oscillator, 'am')
            )
                return this._oscillator.harmonicity;
        }
        get modulationFrequency() {
            if (this._getOscType(this._oscillator, 'pwm'))
                return this._oscillator.modulationFrequency;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                return an(this, t);
            });
        }
        dispose() {
            return (
                super.dispose(),
                this.detune.dispose(),
                this.frequency.dispose(),
                this._oscillator.dispose(),
                this
            );
        }
    }
    class xr extends lt {
        constructor() {
            super(Object.assign(k(xr.getDefaults(), arguments, ['value']))),
                (this.override = !1),
                (this.name = 'Add'),
                (this._sum = new ut({ context: this.context })),
                (this.input = this._sum),
                (this.output = this._sum),
                (this.addend = this._param),
                hi(this._constantSource, this._sum);
        }
        static getDefaults() {
            return Object.assign(lt.getDefaults(), { value: 0 });
        }
        dispose() {
            return super.dispose(), this._sum.dispose(), this;
        }
    }
    class _i extends We {
        constructor() {
            super(Object.assign(k(_i.getDefaults(), arguments, ['min', 'max']))),
                (this.name = 'Scale');
            const t = k(_i.getDefaults(), arguments, ['min', 'max']);
            (this._mult = this.input = new Fe({ context: this.context, value: t.max - t.min })),
                (this._add = this.output = new xr({ context: this.context, value: t.min })),
                (this._min = t.min),
                (this._max = t.max),
                this.input.connect(this.output);
        }
        static getDefaults() {
            return Object.assign(We.getDefaults(), { max: 1, min: 0 });
        }
        get min() {
            return this._min;
        }
        set min(t) {
            (this._min = t), this._setRange();
        }
        get max() {
            return this._max;
        }
        set max(t) {
            (this._max = t), this._setRange();
        }
        _setRange() {
            (this._add.value = this._min), (this._mult.value = this._max - this._min);
        }
        dispose() {
            return super.dispose(), this._add.dispose(), this._mult.dispose(), this;
        }
    }
    class vr extends We {
        constructor() {
            super(Object.assign(k(vr.getDefaults(), arguments))),
                (this.name = 'Zero'),
                (this._gain = new ut({ context: this.context })),
                (this.output = this._gain),
                (this.input = void 0),
                xe(this.context.getConstant(0), this._gain);
        }
        dispose() {
            return super.dispose(), Ua(this.context.getConstant(0), this._gain), this;
        }
    }
    class kn extends Q {
        constructor() {
            super(k(kn.getDefaults(), arguments, ['frequency', 'min', 'max'])),
                (this.name = 'LFO'),
                (this._stoppedValue = 0),
                (this._units = 'number'),
                (this.convert = !0),
                (this._fromType = et.prototype._fromType),
                (this._toType = et.prototype._toType),
                (this._is = et.prototype._is),
                (this._clampValue = et.prototype._clampValue);
            const t = k(kn.getDefaults(), arguments, ['frequency', 'min', 'max']);
            (this._oscillator = new ft(t)),
                (this.frequency = this._oscillator.frequency),
                (this._amplitudeGain = new ut({
                    context: this.context,
                    gain: t.amplitude,
                    units: 'normalRange',
                })),
                (this.amplitude = this._amplitudeGain.gain),
                (this._stoppedSignal = new lt({
                    context: this.context,
                    units: 'audioRange',
                    value: 0,
                })),
                (this._zeros = new vr({ context: this.context })),
                (this._a2g = new Va({ context: this.context })),
                (this._scaler = this.output = new _i({
                    context: this.context,
                    max: t.max,
                    min: t.min,
                })),
                (this.units = t.units),
                (this.min = t.min),
                (this.max = t.max),
                this._oscillator.chain(this._amplitudeGain, this._a2g, this._scaler),
                this._zeros.connect(this._a2g),
                this._stoppedSignal.connect(this._a2g),
                st(this, ['amplitude', 'frequency']),
                (this.phase = t.phase);
        }
        static getDefaults() {
            return Object.assign(ft.getDefaults(), {
                amplitude: 1,
                frequency: '4n',
                max: 1,
                min: 0,
                type: 'sine',
                units: 'number',
            });
        }
        start(t) {
            return (
                (t = this.toSeconds(t)),
                this._stoppedSignal.setValueAtTime(0, t),
                this._oscillator.start(t),
                this
            );
        }
        stop(t) {
            return (
                (t = this.toSeconds(t)),
                this._stoppedSignal.setValueAtTime(this._stoppedValue, t),
                this._oscillator.stop(t),
                this
            );
        }
        sync() {
            return this._oscillator.sync(), this._oscillator.syncFrequency(), this;
        }
        unsync() {
            return this._oscillator.unsync(), this._oscillator.unsyncFrequency(), this;
        }
        _setStoppedValue() {
            (this._stoppedValue = this._oscillator.getInitialValue()),
                (this._stoppedSignal.value = this._stoppedValue);
        }
        get min() {
            return this._toType(this._scaler.min);
        }
        set min(t) {
            (t = this._fromType(t)), (this._scaler.min = t);
        }
        get max() {
            return this._toType(this._scaler.max);
        }
        set max(t) {
            (t = this._fromType(t)), (this._scaler.max = t);
        }
        get type() {
            return this._oscillator.type;
        }
        set type(t) {
            (this._oscillator.type = t), this._setStoppedValue();
        }
        get partials() {
            return this._oscillator.partials;
        }
        set partials(t) {
            (this._oscillator.partials = t), this._setStoppedValue();
        }
        get phase() {
            return this._oscillator.phase;
        }
        set phase(t) {
            (this._oscillator.phase = t), this._setStoppedValue();
        }
        get units() {
            return this._units;
        }
        set units(t) {
            const e = this.min,
                s = this.max;
            (this._units = t), (this.min = e), (this.max = s);
        }
        get state() {
            return this._oscillator.state;
        }
        connect(t, e, s) {
            return (
                (t instanceof et || t instanceof lt) &&
                    ((this.convert = t.convert), (this.units = t.units)),
                fi(this, t, e, s),
                this
            );
        }
        dispose() {
            return (
                super.dispose(),
                this._oscillator.dispose(),
                this._stoppedSignal.dispose(),
                this._zeros.dispose(),
                this._scaler.dispose(),
                this._a2g.dispose(),
                this._amplitudeGain.dispose(),
                this.amplitude.dispose(),
                this
            );
        }
    }
    function Fa(n, t = 1 / 0) {
        const e = new WeakMap();
        return function(s, i) {
            Reflect.defineProperty(s, i, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    return e.get(this);
                },
                set: function(r) {
                    Ye(r, n, t), e.set(this, r);
                },
            });
        };
    }
    function Le(n, t = 1 / 0) {
        const e = new WeakMap();
        return function(s, i) {
            Reflect.defineProperty(s, i, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    return e.get(this);
                },
                set: function(r) {
                    Ye(this.toSeconds(r), n, t), e.set(this, r);
                },
            });
        };
    }
    class zn extends Qt {
        constructor() {
            super(k(zn.getDefaults(), arguments, ['url', 'onload'])),
                (this.name = 'Player'),
                (this._activeSources = new Set());
            const t = k(zn.getDefaults(), arguments, ['url', 'onload']);
            (this._buffer = new ot({
                onload: this._onload.bind(this, t.onload),
                onerror: t.onerror,
                reverse: t.reverse,
                url: t.url,
            })),
                (this.autostart = t.autostart),
                (this._loop = t.loop),
                (this._loopStart = t.loopStart),
                (this._loopEnd = t.loopEnd),
                (this._playbackRate = t.playbackRate),
                (this.fadeIn = t.fadeIn),
                (this.fadeOut = t.fadeOut);
        }
        static getDefaults() {
            return Object.assign(Qt.getDefaults(), {
                autostart: !1,
                fadeIn: 0,
                fadeOut: 0,
                loop: !1,
                loopEnd: 0,
                loopStart: 0,
                onload: rt,
                onerror: rt,
                playbackRate: 1,
                reverse: !1,
            });
        }
        load(t) {
            return yt(this, void 0, void 0, function*() {
                return yield this._buffer.load(t), this._onload(), this;
            });
        }
        _onload(t = rt) {
            t(), this.autostart && this.start();
        }
        _onSourceEnd(t) {
            this.onstop(this),
                this._activeSources.delete(t),
                this._activeSources.size === 0 &&
                    !this._synced &&
                    this._state.getValueAtTime(this.now()) === 'started' &&
                    (this._state.cancel(this.now()),
                    this._state.setStateAtTime('stopped', this.now()));
        }
        start(t, e, s) {
            return super.start(t, e, s), this;
        }
        _start(t, e, s) {
            this._loop ? (e = wn(e, this._loopStart)) : (e = wn(e, 0));
            const i = this.toSeconds(e),
                r = s;
            s = wn(s, Math.max(this._buffer.duration - i, 0));
            let a = this.toSeconds(s);
            (a = a / this._playbackRate), (t = this.toSeconds(t));
            const o = new ds({
                url: this._buffer,
                context: this.context,
                fadeIn: this.fadeIn,
                fadeOut: this.fadeOut,
                loop: this._loop,
                loopEnd: this._loopEnd,
                loopStart: this._loopStart,
                onended: this._onSourceEnd.bind(this),
                playbackRate: this._playbackRate,
            }).connect(this.output);
            !this._loop &&
                !this._synced &&
                (this._state.cancel(t + a),
                this._state.setStateAtTime('stopped', t + a, { implicitEnd: !0 })),
                this._activeSources.add(o),
                this._loop && Jt(r)
                    ? o.start(t, i)
                    : o.start(t, i, a - this.toSeconds(this.fadeOut));
        }
        _stop(t) {
            const e = this.toSeconds(t);
            this._activeSources.forEach((s) => s.stop(e));
        }
        restart(t, e, s) {
            return super.restart(t, e, s), this;
        }
        _restart(t, e, s) {
            this._stop(t), this._start(t, e, s);
        }
        seek(t, e) {
            const s = this.toSeconds(e);
            if (this._state.getValueAtTime(s) === 'started') {
                const i = this.toSeconds(t);
                this._stop(s), this._start(s, i);
            }
            return this;
        }
        setLoopPoints(t, e) {
            return (this.loopStart = t), (this.loopEnd = e), this;
        }
        get loopStart() {
            return this._loopStart;
        }
        set loopStart(t) {
            (this._loopStart = t),
                this.buffer.loaded && Ye(this.toSeconds(t), 0, this.buffer.duration),
                this._activeSources.forEach((e) => {
                    e.loopStart = t;
                });
        }
        get loopEnd() {
            return this._loopEnd;
        }
        set loopEnd(t) {
            (this._loopEnd = t),
                this.buffer.loaded && Ye(this.toSeconds(t), 0, this.buffer.duration),
                this._activeSources.forEach((e) => {
                    e.loopEnd = t;
                });
        }
        get buffer() {
            return this._buffer;
        }
        set buffer(t) {
            this._buffer.set(t);
        }
        get loop() {
            return this._loop;
        }
        set loop(t) {
            if (
                this._loop !== t &&
                ((this._loop = t),
                this._activeSources.forEach((e) => {
                    e.loop = t;
                }),
                t)
            ) {
                const e = this._state.getNextState('stopped', this.now());
                e && this._state.cancel(e.time);
            }
        }
        get playbackRate() {
            return this._playbackRate;
        }
        set playbackRate(t) {
            this._playbackRate = t;
            const e = this.now(),
                s = this._state.getNextState('stopped', e);
            s &&
                s.implicitEnd &&
                (this._state.cancel(s.time), this._activeSources.forEach((i) => i.cancelStop())),
                this._activeSources.forEach((i) => {
                    i.playbackRate.setValueAtTime(t, e);
                });
        }
        get reverse() {
            return this._buffer.reverse;
        }
        set reverse(t) {
            this._buffer.reverse = t;
        }
        get loaded() {
            return this._buffer.loaded;
        }
        dispose() {
            return (
                super.dispose(),
                this._activeSources.forEach((t) => t.dispose()),
                this._activeSources.clear(),
                this._buffer.dispose(),
                this
            );
        }
    }
    ae([Le(0)], zn.prototype, 'fadeIn', void 0), ae([Le(0)], zn.prototype, 'fadeOut', void 0);
    class Hp extends We {
        constructor() {
            super(...arguments),
                (this.name = 'GainToAudio'),
                (this._norm = new En({
                    context: this.context,
                    mapping: (t) => Math.abs(t) * 2 - 1,
                })),
                (this.input = this._norm),
                (this.output = this._norm);
        }
        dispose() {
            return super.dispose(), this._norm.dispose(), this;
        }
    }
    class we extends Q {
        constructor() {
            super(k(we.getDefaults(), arguments, ['attack', 'decay', 'sustain', 'release'])),
                (this.name = 'Envelope'),
                (this._sig = new lt({ context: this.context, value: 0 })),
                (this.output = this._sig),
                (this.input = void 0);
            const t = k(we.getDefaults(), arguments, ['attack', 'decay', 'sustain', 'release']);
            (this.attack = t.attack),
                (this.decay = t.decay),
                (this.sustain = t.sustain),
                (this.release = t.release),
                (this.attackCurve = t.attackCurve),
                (this.releaseCurve = t.releaseCurve),
                (this.decayCurve = t.decayCurve);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), {
                attack: 0.01,
                attackCurve: 'linear',
                decay: 0.1,
                decayCurve: 'exponential',
                release: 1,
                releaseCurve: 'exponential',
                sustain: 0.5,
            });
        }
        get value() {
            return this.getValueAtTime(this.now());
        }
        _getCurve(t, e) {
            if (me(t)) return t;
            {
                let s;
                for (s in Ti) if (Ti[s][e] === t) return s;
                return t;
            }
        }
        _setCurve(t, e, s) {
            if (me(s) && Reflect.has(Ti, s)) {
                const i = Ti[s];
                nn(i) ? t !== '_decayCurve' && (this[t] = i[e]) : (this[t] = i);
            } else if (oe(s) && t !== '_decayCurve') this[t] = s;
            else throw new Error('Envelope: invalid curve: ' + s);
        }
        get attackCurve() {
            return this._getCurve(this._attackCurve, 'In');
        }
        set attackCurve(t) {
            this._setCurve('_attackCurve', 'In', t);
        }
        get releaseCurve() {
            return this._getCurve(this._releaseCurve, 'Out');
        }
        set releaseCurve(t) {
            this._setCurve('_releaseCurve', 'Out', t);
        }
        get decayCurve() {
            return this._decayCurve;
        }
        set decayCurve(t) {
            H(
                ['linear', 'exponential'].some((e) => e === t),
                `Invalid envelope curve: ${t}`
            ),
                (this._decayCurve = t);
        }
        triggerAttack(t, e = 1) {
            this.log('triggerAttack', t, e), (t = this.toSeconds(t));
            let i = this.toSeconds(this.attack);
            const r = this.toSeconds(this.decay),
                a = this.getValueAtTime(t);
            if (a > 0) {
                const o = 1 / i;
                i = (1 - a) / o;
            }
            if (i < this.sampleTime)
                this._sig.cancelScheduledValues(t), this._sig.setValueAtTime(e, t);
            else if (this._attackCurve === 'linear') this._sig.linearRampTo(e, i, t);
            else if (this._attackCurve === 'exponential') this._sig.targetRampTo(e, i, t);
            else {
                this._sig.cancelAndHoldAtTime(t);
                let o = this._attackCurve;
                for (let c = 1; c < o.length; c++)
                    if (o[c - 1] <= a && a <= o[c]) {
                        (o = this._attackCurve.slice(c)), (o[0] = a);
                        break;
                    }
                this._sig.setValueCurveAtTime(o, t, i, e);
            }
            if (r && this.sustain < 1) {
                const o = e * this.sustain,
                    c = t + i;
                this.log('decay', c),
                    this._decayCurve === 'linear'
                        ? this._sig.linearRampToValueAtTime(o, r + c)
                        : this._sig.exponentialApproachValueAtTime(o, c, r);
            }
            return this;
        }
        triggerRelease(t) {
            this.log('triggerRelease', t), (t = this.toSeconds(t));
            const e = this.getValueAtTime(t);
            if (e > 0) {
                const s = this.toSeconds(this.release);
                s < this.sampleTime
                    ? this._sig.setValueAtTime(0, t)
                    : this._releaseCurve === 'linear'
                    ? this._sig.linearRampTo(0, s, t)
                    : this._releaseCurve === 'exponential'
                    ? this._sig.targetRampTo(0, s, t)
                    : (H(
                          oe(this._releaseCurve),
                          "releaseCurve must be either 'linear', 'exponential' or an array"
                      ),
                      this._sig.cancelAndHoldAtTime(t),
                      this._sig.setValueCurveAtTime(this._releaseCurve, t, s, e));
            }
            return this;
        }
        getValueAtTime(t) {
            return this._sig.getValueAtTime(t);
        }
        triggerAttackRelease(t, e, s = 1) {
            return (
                (e = this.toSeconds(e)),
                this.triggerAttack(e, s),
                this.triggerRelease(e + this.toSeconds(t)),
                this
            );
        }
        cancel(t) {
            return this._sig.cancelScheduledValues(this.toSeconds(t)), this;
        }
        connect(t, e = 0, s = 0) {
            return fi(this, t, e, s), this;
        }
        asArray(t = 1024) {
            return yt(this, void 0, void 0, function*() {
                const e = t / this.context.sampleRate,
                    s = new ai(1, e, this.context.sampleRate),
                    i = this.toSeconds(this.attack) + this.toSeconds(this.decay),
                    r = i + this.toSeconds(this.release),
                    a = r * 0.1,
                    o = r + a,
                    c = new this.constructor(
                        Object.assign(this.get(), {
                            attack: (e * this.toSeconds(this.attack)) / o,
                            decay: (e * this.toSeconds(this.decay)) / o,
                            release: (e * this.toSeconds(this.release)) / o,
                            context: s,
                        })
                    );
                return (
                    c._sig.toDestination(),
                    c.triggerAttackRelease((e * (i + a)) / o, 0),
                    (yield s.render()).getChannelData(0)
                );
            });
        }
        dispose() {
            return super.dispose(), this._sig.dispose(), this;
        }
    }
    ae([Le(0)], we.prototype, 'attack', void 0),
        ae([Le(0)], we.prototype, 'decay', void 0),
        ae([Fa(0, 1)], we.prototype, 'sustain', void 0),
        ae([Le(0)], we.prototype, 'release', void 0);
    const Ti = (() => {
        let t, e;
        const s = [];
        for (t = 0; t < 128; t++) s[t] = Math.sin((t / (128 - 1)) * (Math.PI / 2));
        const i = [],
            r = 6.4;
        for (t = 0; t < 128 - 1; t++) {
            e = t / (128 - 1);
            const f = Math.sin(e * (Math.PI * 2) * r - Math.PI / 2) + 1;
            i[t] = f / 10 + e * 0.83;
        }
        i[128 - 1] = 1;
        const a = [],
            o = 5;
        for (t = 0; t < 128; t++) a[t] = Math.ceil((t / (128 - 1)) * o) / o;
        const c = [];
        for (t = 0; t < 128; t++) (e = t / (128 - 1)), (c[t] = 0.5 * (1 - Math.cos(Math.PI * e)));
        const u = [];
        for (t = 0; t < 128; t++) {
            e = t / (128 - 1);
            const f = Math.pow(e, 3) * 4 + 0.2,
                p = Math.cos(f * Math.PI * 2 * e);
            u[t] = Math.abs(p * (1 - e));
        }
        function l(f) {
            const p = new Array(f.length);
            for (let d = 0; d < f.length; d++) p[d] = 1 - f[d];
            return p;
        }
        function h(f) {
            return f.slice(0).reverse();
        }
        return {
            bounce: { In: l(u), Out: u },
            cosine: { In: s, Out: h(s) },
            exponential: 'exponential',
            linear: 'linear',
            ripple: { In: i, Out: l(i) },
            sine: { In: c, Out: l(c) },
            step: { In: a, Out: l(a) },
        };
    })();
    class cn extends Q {
        constructor() {
            super(k(cn.getDefaults(), arguments)),
                (this._scheduledEvents = []),
                (this._synced = !1),
                (this._original_triggerAttack = this.triggerAttack),
                (this._original_triggerRelease = this.triggerRelease);
            const t = k(cn.getDefaults(), arguments);
            (this._volume = this.output = new on({ context: this.context, volume: t.volume })),
                (this.volume = this._volume.volume),
                st(this, 'volume');
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { volume: 0 });
        }
        sync() {
            return (
                this._syncState() &&
                    (this._syncMethod('triggerAttack', 1), this._syncMethod('triggerRelease', 0)),
                this
            );
        }
        _syncState() {
            let t = !1;
            return this._synced || ((this._synced = !0), (t = !0)), t;
        }
        _syncMethod(t, e) {
            const s = (this['_original_' + t] = this[t]);
            this[t] = (...i) => {
                const r = i[e],
                    a = this.context.transport.schedule((o) => {
                        (i[e] = o), s.apply(this, i);
                    }, r);
                this._scheduledEvents.push(a);
            };
        }
        unsync() {
            return (
                this._scheduledEvents.forEach((t) => this.context.transport.clear(t)),
                (this._scheduledEvents = []),
                this._synced &&
                    ((this._synced = !1),
                    (this.triggerAttack = this._original_triggerAttack),
                    (this.triggerRelease = this._original_triggerRelease)),
                this
            );
        }
        triggerAttackRelease(t, e, s, i) {
            const r = this.toSeconds(s),
                a = this.toSeconds(e);
            return this.triggerAttack(t, r, i), this.triggerRelease(r + a), this;
        }
        dispose() {
            return (
                super.dispose(),
                this._volume.dispose(),
                this.unsync(),
                (this._scheduledEvents = []),
                this
            );
        }
    }
    class un extends cn {
        constructor() {
            super(k(un.getDefaults(), arguments));
            const t = k(un.getDefaults(), arguments);
            (this.portamento = t.portamento), (this.onsilence = t.onsilence);
        }
        static getDefaults() {
            return Object.assign(cn.getDefaults(), { detune: 0, onsilence: rt, portamento: 0 });
        }
        triggerAttack(t, e, s = 1) {
            this.log('triggerAttack', t, e, s);
            const i = this.toSeconds(e);
            return this._triggerEnvelopeAttack(i, s), this.setNote(t, i), this;
        }
        triggerRelease(t) {
            this.log('triggerRelease', t);
            const e = this.toSeconds(t);
            return this._triggerEnvelopeRelease(e), this;
        }
        setNote(t, e) {
            const s = this.toSeconds(e),
                i = t instanceof Kt ? t.toFrequency() : t;
            if (this.portamento > 0 && this.getLevelAtTime(s) > 0.05) {
                const r = this.toSeconds(this.portamento);
                this.frequency.exponentialRampTo(i, r, s);
            } else this.frequency.setValueAtTime(i, s);
            return this;
        }
    }
    ae([Le(0)], un.prototype, 'portamento', void 0);
    class Lr extends we {
        constructor() {
            super(k(Lr.getDefaults(), arguments, ['attack', 'decay', 'sustain', 'release'])),
                (this.name = 'AmplitudeEnvelope'),
                (this._gainNode = new ut({ context: this.context, gain: 0 })),
                (this.output = this._gainNode),
                (this.input = this._gainNode),
                this._sig.connect(this._gainNode.gain),
                (this.output = this._gainNode),
                (this.input = this._gainNode);
        }
        dispose() {
            return super.dispose(), this._gainNode.dispose(), this;
        }
    }
    class ys extends un {
        constructor() {
            super(k(ys.getDefaults(), arguments)), (this.name = 'Synth');
            const t = k(ys.getDefaults(), arguments);
            (this.oscillator = new Ms(
                Object.assign(
                    { context: this.context, detune: t.detune, onstop: () => this.onsilence(this) },
                    t.oscillator
                )
            )),
                (this.frequency = this.oscillator.frequency),
                (this.detune = this.oscillator.detune),
                (this.envelope = new Lr(Object.assign({ context: this.context }, t.envelope))),
                this.oscillator.chain(this.envelope, this.output),
                st(this, ['oscillator', 'frequency', 'detune', 'envelope']);
        }
        static getDefaults() {
            return Object.assign(un.getDefaults(), {
                envelope: Object.assign(Ca(we.getDefaults(), Object.keys(Q.getDefaults())), {
                    attack: 0.005,
                    decay: 0.1,
                    release: 1,
                    sustain: 0.3,
                }),
                oscillator: Object.assign(
                    Ca(Ms.getDefaults(), [...Object.keys(Qt.getDefaults()), 'frequency', 'detune']),
                    { type: 'triangle' }
                ),
            });
        }
        _triggerEnvelopeAttack(t, e) {
            if (
                (this.envelope.triggerAttack(t, e),
                this.oscillator.start(t),
                this.envelope.sustain === 0)
            ) {
                const s = this.toSeconds(this.envelope.attack),
                    i = this.toSeconds(this.envelope.decay);
                this.oscillator.stop(t + s + i);
            }
        }
        _triggerEnvelopeRelease(t) {
            this.envelope.triggerRelease(t),
                this.oscillator.stop(t + this.toSeconds(this.envelope.release));
        }
        getLevelAtTime(t) {
            return (t = this.toSeconds(t)), this.envelope.getValueAtTime(t);
        }
        dispose() {
            return super.dispose(), this.oscillator.dispose(), this.envelope.dispose(), this;
        }
    }
    class _s extends ys {
        constructor() {
            super(k(_s.getDefaults(), arguments)),
                (this.name = 'MembraneSynth'),
                (this.portamento = 0);
            const t = k(_s.getDefaults(), arguments);
            (this.pitchDecay = t.pitchDecay),
                (this.octaves = t.octaves),
                st(this, ['oscillator', 'envelope']);
        }
        static getDefaults() {
            return Ln(un.getDefaults(), ys.getDefaults(), {
                envelope: {
                    attack: 0.001,
                    attackCurve: 'exponential',
                    decay: 0.4,
                    release: 1.4,
                    sustain: 0.01,
                },
                octaves: 10,
                oscillator: { type: 'sine' },
                pitchDecay: 0.05,
            });
        }
        setNote(t, e) {
            const s = this.toSeconds(e),
                i = this.toFrequency(t instanceof Kt ? t.toFrequency() : t),
                r = i * this.octaves;
            return (
                this.oscillator.frequency.setValueAtTime(r, s),
                this.oscillator.frequency.exponentialRampToValueAtTime(
                    i,
                    s + this.toSeconds(this.pitchDecay)
                ),
                this
            );
        }
        dispose() {
            return super.dispose(), this;
        }
    }
    ae([Fa(0)], _s.prototype, 'octaves', void 0), ae([Le(0)], _s.prototype, 'pitchDecay', void 0);
    const Ga = new Set();
    function wr(n) {
        Ga.add(n);
    }
    function Ba(n, t) {
        const e = `registerProcessor("${n}", ${t})`;
        Ga.add(e);
    }
    wr(`
	/**
	 * The base AudioWorkletProcessor for use in Tone.js. Works with the [[ToneAudioWorklet]]. 
	 */
	class ToneAudioWorkletProcessor extends AudioWorkletProcessor {

		constructor(options) {
			
			super(options);
			/**
			 * If the processor was disposed or not. Keep alive until it's disposed.
			 */
			this.disposed = false;
		   	/** 
			 * The number of samples in the processing block
			 */
			this.blockSize = 128;
			/**
			 * the sample rate
			 */
			this.sampleRate = sampleRate;

			this.port.onmessage = (event) => {
				// when it receives a dispose 
				if (event.data === "dispose") {
					this.disposed = true;
				}
			};
		}
	}
`),
        wr(`
	/**
	 * Abstract class for a single input/output processor. 
	 * has a 'generate' function which processes one sample at a time
	 */
	class SingleIOProcessor extends ToneAudioWorkletProcessor {

		constructor(options) {
			super(Object.assign(options, {
				numberOfInputs: 1,
				numberOfOutputs: 1
			}));
			/**
			 * Holds the name of the parameter and a single value of that
			 * parameter at the current sample
			 * @type { [name: string]: number }
			 */
			this.params = {}
		}

		/**
		 * Generate an output sample from the input sample and parameters
		 * @abstract
		 * @param input number
		 * @param channel number
		 * @param parameters { [name: string]: number }
		 * @returns number
		 */
		generate(){}

		/**
		 * Update the private params object with the 
		 * values of the parameters at the given index
		 * @param parameters { [name: string]: Float32Array },
		 * @param index number
		 */
		updateParams(parameters, index) {
			for (const paramName in parameters) {
				const param = parameters[paramName];
				if (param.length > 1) {
					this.params[paramName] = parameters[paramName][index];
				} else {
					this.params[paramName] = parameters[paramName][0];
				}
			}
		}

		/**
		 * Process a single frame of the audio
		 * @param inputs Float32Array[][]
		 * @param outputs Float32Array[][]
		 */
		process(inputs, outputs, parameters) {
			const input = inputs[0];
			const output = outputs[0];
			// get the parameter values
			const channelCount = Math.max(input && input.length || 0, output.length);
			for (let sample = 0; sample < this.blockSize; sample++) {
				this.updateParams(parameters, sample);
				for (let channel = 0; channel < channelCount; channel++) {
					const inputSample = input && input.length ? input[channel][sample] : 0;
					output[channel][sample] = this.generate(inputSample, channel, this.params);
				}
			}
			return !this.disposed;
		}
	};
`),
        wr(`
	/**
	 * A multichannel buffer for use within an AudioWorkletProcessor as a delay line
	 */
	class DelayLine {
		
		constructor(size, channels) {
			this.buffer = [];
			this.writeHead = []
			this.size = size;

			// create the empty channels
			for (let i = 0; i < channels; i++) {
				this.buffer[i] = new Float32Array(this.size);
				this.writeHead[i] = 0;
			}
		}

		/**
		 * Push a value onto the end
		 * @param channel number
		 * @param value number
		 */
		push(channel, value) {
			this.writeHead[channel] += 1;
			if (this.writeHead[channel] > this.size) {
				this.writeHead[channel] = 0;
			}
			this.buffer[channel][this.writeHead[channel]] = value;
		}

		/**
		 * Get the recorded value of the channel given the delay
		 * @param channel number
		 * @param delay number delay samples
		 */
		get(channel, delay) {
			let readHead = this.writeHead[channel] - Math.floor(delay);
			if (readHead < 0) {
				readHead += this.size;
			}
			return this.buffer[channel][readHead];
		}
	}
`),
        Ba(
            'feedback-comb-filter',
            `
	class FeedbackCombFilterWorklet extends SingleIOProcessor {

		constructor(options) {
			super(options);
			this.delayLine = new DelayLine(this.sampleRate, options.channelCount || 2);
		}

		static get parameterDescriptors() {
			return [{
				name: "delayTime",
				defaultValue: 0.1,
				minValue: 0,
				maxValue: 1,
				automationRate: "k-rate"
			}, {
				name: "feedback",
				defaultValue: 0.5,
				minValue: 0,
				maxValue: 0.9999,
				automationRate: "k-rate"
			}];
		}

		generate(input, channel, parameters) {
			const delayedSample = this.delayLine.get(channel, parameters.delayTime * this.sampleRate);
			this.delayLine.push(channel, input + delayedSample * parameters.feedback);
			return delayedSample;
		}
	}
`
        );
    class Ts extends cn {
        constructor() {
            super(k(Ts.getDefaults(), arguments, ['urls', 'onload', 'baseUrl'], 'urls')),
                (this.name = 'Sampler'),
                (this._activeSources = new Map());
            const t = k(Ts.getDefaults(), arguments, ['urls', 'onload', 'baseUrl'], 'urls'),
                e = {};
            Object.keys(t.urls).forEach((s) => {
                const i = parseInt(s, 10);
                if (
                    (H(
                        ni(s) || (en(i) && isFinite(i)),
                        `url key is neither a note or midi pitch: ${s}`
                    ),
                    ni(s))
                ) {
                    const r = new Kt(this.context, s).toMidi();
                    e[r] = t.urls[s];
                } else en(i) && isFinite(i) && (e[i] = t.urls[i]);
            }),
                (this._buffers = new jr({
                    urls: e,
                    onload: t.onload,
                    baseUrl: t.baseUrl,
                    onerror: t.onerror,
                })),
                (this.attack = t.attack),
                (this.release = t.release),
                (this.curve = t.curve),
                this._buffers.loaded && Promise.resolve().then(t.onload);
        }
        static getDefaults() {
            return Object.assign(cn.getDefaults(), {
                attack: 0,
                baseUrl: '',
                curve: 'exponential',
                onload: rt,
                onerror: rt,
                release: 0.1,
                urls: {},
            });
        }
        _findClosest(t) {
            let s = 0;
            for (; s < 96; ) {
                if (this._buffers.has(t + s)) return -s;
                if (this._buffers.has(t - s)) return s;
                s++;
            }
            throw new Error(`No available buffers for note: ${t}`);
        }
        triggerAttack(t, e, s = 1) {
            return (
                this.log('triggerAttack', t, e, s),
                Array.isArray(t) || (t = [t]),
                t.forEach((i) => {
                    const r = Ya(new Kt(this.context, i).toFrequency()),
                        a = Math.round(r),
                        o = r - a,
                        c = this._findClosest(a),
                        u = a - c,
                        l = this._buffers.get(u),
                        h = ui(c + o),
                        f = new ds({
                            url: l,
                            context: this.context,
                            curve: this.curve,
                            fadeIn: this.attack,
                            fadeOut: this.release,
                            playbackRate: h,
                        }).connect(this.output);
                    f.start(e, 0, l.duration / h, s),
                        oe(this._activeSources.get(a)) || this._activeSources.set(a, []),
                        this._activeSources.get(a).push(f),
                        (f.onended = () => {
                            if (this._activeSources && this._activeSources.has(a)) {
                                const p = this._activeSources.get(a),
                                    d = p.indexOf(f);
                                d !== -1 && p.splice(d, 1);
                            }
                        });
                }),
                this
            );
        }
        triggerRelease(t, e) {
            return (
                this.log('triggerRelease', t, e),
                Array.isArray(t) || (t = [t]),
                t.forEach((s) => {
                    const i = new Kt(this.context, s).toMidi();
                    if (this._activeSources.has(i) && this._activeSources.get(i).length) {
                        const r = this._activeSources.get(i);
                        (e = this.toSeconds(e)),
                            r.forEach((a) => {
                                a.stop(e);
                            }),
                            this._activeSources.set(i, []);
                    }
                }),
                this
            );
        }
        releaseAll(t) {
            const e = this.toSeconds(t);
            return (
                this._activeSources.forEach((s) => {
                    for (; s.length; ) s.shift().stop(e);
                }),
                this
            );
        }
        sync() {
            return (
                this._syncState() &&
                    (this._syncMethod('triggerAttack', 1), this._syncMethod('triggerRelease', 1)),
                this
            );
        }
        triggerAttackRelease(t, e, s, i = 1) {
            const r = this.toSeconds(s);
            return (
                this.triggerAttack(t, r, i),
                oe(e)
                    ? (H(oe(t), 'notes must be an array when duration is array'),
                      t.forEach((a, o) => {
                          const c = e[Math.min(o, e.length - 1)];
                          this.triggerRelease(a, r + this.toSeconds(c));
                      }))
                    : this.triggerRelease(t, r + this.toSeconds(e)),
                this
            );
        }
        add(t, e, s) {
            if ((H(ni(t) || isFinite(t), `note must be a pitch or midi: ${t}`), ni(t))) {
                const i = new Kt(this.context, t).toMidi();
                this._buffers.add(i, e, s);
            } else this._buffers.add(t, e, s);
            return this;
        }
        get loaded() {
            return this._buffers.loaded;
        }
        dispose() {
            return (
                super.dispose(),
                this._buffers.dispose(),
                this._activeSources.forEach((t) => {
                    t.forEach((e) => e.dispose());
                }),
                this._activeSources.clear(),
                this
            );
        }
    }
    ae([Le(0)], Ts.prototype, 'attack', void 0), ae([Le(0)], Ts.prototype, 'release', void 0);
    class Ns extends Q {
        constructor() {
            super(Object.assign(k(Ns.getDefaults(), arguments, ['fade']))),
                (this.name = 'CrossFade'),
                (this._panner = this.context.createStereoPanner()),
                (this._split = this.context.createChannelSplitter(2)),
                (this._g2a = new Hp({ context: this.context })),
                (this.a = new ut({ context: this.context, gain: 0 })),
                (this.b = new ut({ context: this.context, gain: 0 })),
                (this.output = new ut({ context: this.context })),
                (this._internalChannels = [this.a, this.b]);
            const t = k(Ns.getDefaults(), arguments, ['fade']);
            (this.fade = new lt({ context: this.context, units: 'normalRange', value: t.fade })),
                st(this, 'fade'),
                this.context.getConstant(1).connect(this._panner),
                this._panner.connect(this._split),
                (this._panner.channelCount = 1),
                (this._panner.channelCountMode = 'explicit'),
                xe(this._split, this.a.gain, 0),
                xe(this._split, this.b.gain, 1),
                this.fade.chain(this._g2a, this._panner.pan),
                this.a.connect(this.output),
                this.b.connect(this.output);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { fade: 0.5 });
        }
        dispose() {
            return (
                super.dispose(),
                this.a.dispose(),
                this.b.dispose(),
                this.output.dispose(),
                this.fade.dispose(),
                this._g2a.dispose(),
                this._panner.disconnect(),
                this._split.disconnect(),
                this
            );
        }
    }
    class Qa extends Q {
        constructor(t) {
            super(t),
                (this.name = 'Effect'),
                (this._dryWet = new Ns({ context: this.context })),
                (this.wet = this._dryWet.fade),
                (this.effectSend = new ut({ context: this.context })),
                (this.effectReturn = new ut({ context: this.context })),
                (this.input = new ut({ context: this.context })),
                (this.output = this._dryWet),
                this.input.fan(this._dryWet.a, this.effectSend),
                this.effectReturn.connect(this._dryWet.b),
                this.wet.setValueAtTime(t.wet, 0),
                (this._internalChannels = [this.effectReturn, this.effectSend]),
                st(this, 'wet');
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { wet: 1 });
        }
        connectEffect(t) {
            return (
                this._internalChannels.push(t), this.effectSend.chain(t, this.effectReturn), this
            );
        }
        dispose() {
            return (
                super.dispose(),
                this._dryWet.dispose(),
                this.effectSend.dispose(),
                this.effectReturn.dispose(),
                this.wet.dispose(),
                this
            );
        }
    }
    class Ni extends Q {
        constructor() {
            super(Object.assign(k(Ni.getDefaults(), arguments, ['pan']))),
                (this.name = 'Panner'),
                (this._panner = this.context.createStereoPanner()),
                (this.input = this._panner),
                (this.output = this._panner);
            const t = k(Ni.getDefaults(), arguments, ['pan']);
            (this.pan = new et({
                context: this.context,
                param: this._panner.pan,
                value: t.pan,
                minValue: -1,
                maxValue: 1,
            })),
                (this._panner.channelCount = t.channelCount),
                (this._panner.channelCountMode = 'explicit'),
                st(this, 'pan');
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { pan: 0, channelCount: 1 });
        }
        dispose() {
            return super.dispose(), this._panner.disconnect(), this.pan.dispose(), this;
        }
    }
    Ba(
        'bit-crusher',
        `
	class BitCrusherWorklet extends SingleIOProcessor {

		static get parameterDescriptors() {
			return [{
				name: "bits",
				defaultValue: 12,
				minValue: 1,
				maxValue: 16,
				automationRate: 'k-rate'
			}];
		}

		generate(input, _channel, parameters) {
			const step = Math.pow(0.5, parameters.bits - 1);
			const val = step * Math.floor(input / step + 0.5);
			return val;
		}
	}
`
    );
    class Za extends Qa {
        constructor(t) {
            super(t),
                (this.name = 'FeedbackEffect'),
                (this._feedbackGain = new ut({
                    context: this.context,
                    gain: t.feedback,
                    units: 'normalRange',
                })),
                (this.feedback = this._feedbackGain.gain),
                st(this, 'feedback'),
                this.effectReturn.chain(this._feedbackGain, this.effectSend);
        }
        static getDefaults() {
            return Object.assign(Qa.getDefaults(), { feedback: 0.125 });
        }
        dispose() {
            return super.dispose(), this._feedbackGain.dispose(), this.feedback.dispose(), this;
        }
    }
    class Ii extends Za {
        constructor() {
            super(k(Ii.getDefaults(), arguments, ['pitch'])), (this.name = 'PitchShift');
            const t = k(Ii.getDefaults(), arguments, ['pitch']);
            (this._frequency = new lt({ context: this.context })),
                (this._delayA = new Cn({ maxDelay: 1, context: this.context })),
                (this._lfoA = new kn({
                    context: this.context,
                    min: 0,
                    max: 0.1,
                    type: 'sawtooth',
                }).connect(this._delayA.delayTime)),
                (this._delayB = new Cn({ maxDelay: 1, context: this.context })),
                (this._lfoB = new kn({
                    context: this.context,
                    min: 0,
                    max: 0.1,
                    type: 'sawtooth',
                    phase: 180,
                }).connect(this._delayB.delayTime)),
                (this._crossFade = new Ns({ context: this.context })),
                (this._crossFadeLFO = new kn({
                    context: this.context,
                    min: 0,
                    max: 1,
                    type: 'triangle',
                    phase: 90,
                }).connect(this._crossFade.fade)),
                (this._feedbackDelay = new Cn({ delayTime: t.delayTime, context: this.context })),
                (this.delayTime = this._feedbackDelay.delayTime),
                st(this, 'delayTime'),
                (this._pitch = t.pitch),
                (this._windowSize = t.windowSize),
                this._delayA.connect(this._crossFade.a),
                this._delayB.connect(this._crossFade.b),
                this._frequency.fan(
                    this._lfoA.frequency,
                    this._lfoB.frequency,
                    this._crossFadeLFO.frequency
                ),
                this.effectSend.fan(this._delayA, this._delayB),
                this._crossFade.chain(this._feedbackDelay, this.effectReturn);
            const e = this.now();
            this._lfoA.start(e),
                this._lfoB.start(e),
                this._crossFadeLFO.start(e),
                (this.windowSize = this._windowSize);
        }
        static getDefaults() {
            return Object.assign(Za.getDefaults(), {
                pitch: 0,
                windowSize: 0.1,
                delayTime: 0,
                feedback: 0,
            });
        }
        get pitch() {
            return this._pitch;
        }
        set pitch(t) {
            this._pitch = t;
            let e = 0;
            t < 0
                ? ((this._lfoA.min = 0),
                  (this._lfoA.max = this._windowSize),
                  (this._lfoB.min = 0),
                  (this._lfoB.max = this._windowSize),
                  (e = ui(t - 1) + 1))
                : ((this._lfoA.min = this._windowSize),
                  (this._lfoA.max = 0),
                  (this._lfoB.min = this._windowSize),
                  (this._lfoB.max = 0),
                  (e = ui(t) - 1)),
                (this._frequency.value = e * (1.2 / this._windowSize));
        }
        get windowSize() {
            return this._windowSize;
        }
        set windowSize(t) {
            (this._windowSize = this.toSeconds(t)), (this.pitch = this._pitch);
        }
        dispose() {
            return (
                super.dispose(),
                this._frequency.dispose(),
                this._delayA.dispose(),
                this._delayB.dispose(),
                this._lfoA.dispose(),
                this._lfoB.dispose(),
                this._crossFade.dispose(),
                this._crossFadeLFO.dispose(),
                this._feedbackDelay.dispose(),
                this
            );
        }
    }
    class _t extends Q {
        constructor() {
            super(k(_t.getDefaults(), arguments, ['solo'])), (this.name = 'Solo');
            const t = k(_t.getDefaults(), arguments, ['solo']);
            (this.input = this.output = new ut({ context: this.context })),
                _t._allSolos.has(this.context) || _t._allSolos.set(this.context, new Set()),
                _t._allSolos.get(this.context).add(this),
                (this.solo = t.solo);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { solo: !1 });
        }
        get solo() {
            return this._isSoloed();
        }
        set solo(t) {
            t ? this._addSolo() : this._removeSolo(),
                _t._allSolos.get(this.context).forEach((e) => e._updateSolo());
        }
        get muted() {
            return this.input.gain.value === 0;
        }
        _addSolo() {
            _t._soloed.has(this.context) || _t._soloed.set(this.context, new Set()),
                _t._soloed.get(this.context).add(this);
        }
        _removeSolo() {
            _t._soloed.has(this.context) && _t._soloed.get(this.context).delete(this);
        }
        _isSoloed() {
            return _t._soloed.has(this.context) && _t._soloed.get(this.context).has(this);
        }
        _noSolos() {
            return (
                !_t._soloed.has(this.context) ||
                (_t._soloed.has(this.context) && _t._soloed.get(this.context).size === 0)
            );
        }
        _updateSolo() {
            this._isSoloed()
                ? (this.input.gain.value = 1)
                : this._noSolos()
                ? (this.input.gain.value = 1)
                : (this.input.gain.value = 0);
        }
        dispose() {
            return (
                super.dispose(),
                _t._allSolos.get(this.context).delete(this),
                this._removeSolo(),
                this
            );
        }
    }
    (_t._allSolos = new Map()), (_t._soloed = new Map());
    class Si extends Q {
        constructor() {
            super(k(Si.getDefaults(), arguments, ['pan', 'volume'])), (this.name = 'PanVol');
            const t = k(Si.getDefaults(), arguments, ['pan', 'volume']);
            (this._panner = this.input = new Ni({
                context: this.context,
                pan: t.pan,
                channelCount: t.channelCount,
            })),
                (this.pan = this._panner.pan),
                (this._volume = this.output = new on({ context: this.context, volume: t.volume })),
                (this.volume = this._volume.volume),
                this._panner.connect(this._volume),
                (this.mute = t.mute),
                st(this, ['pan', 'volume']);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), { mute: !1, pan: 0, volume: 0, channelCount: 1 });
        }
        get mute() {
            return this._volume.mute;
        }
        set mute(t) {
            this._volume.mute = t;
        }
        dispose() {
            return (
                super.dispose(),
                this._panner.dispose(),
                this.pan.dispose(),
                this._volume.dispose(),
                this.volume.dispose(),
                this
            );
        }
    }
    class ln extends Q {
        constructor() {
            super(k(ln.getDefaults(), arguments, ['volume', 'pan'])), (this.name = 'Channel');
            const t = k(ln.getDefaults(), arguments, ['volume', 'pan']);
            (this._solo = this.input = new _t({ solo: t.solo, context: this.context })),
                (this._panVol = this.output = new Si({
                    context: this.context,
                    pan: t.pan,
                    volume: t.volume,
                    mute: t.mute,
                    channelCount: t.channelCount,
                })),
                (this.pan = this._panVol.pan),
                (this.volume = this._panVol.volume),
                this._solo.connect(this._panVol),
                st(this, ['pan', 'volume']);
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), {
                pan: 0,
                volume: 0,
                mute: !1,
                solo: !1,
                channelCount: 1,
            });
        }
        get solo() {
            return this._solo.solo;
        }
        set solo(t) {
            this._solo.solo = t;
        }
        get muted() {
            return this._solo.muted || this.mute;
        }
        get mute() {
            return this._panVol.mute;
        }
        set mute(t) {
            this._panVol.mute = t;
        }
        _getBus(t) {
            return (
                ln.buses.has(t) || ln.buses.set(t, new ut({ context: this.context })),
                ln.buses.get(t)
            );
        }
        send(t, e = 0) {
            const s = this._getBus(t),
                i = new ut({ context: this.context, units: 'decibels', gain: e });
            return this.connect(i), i.connect(s), i;
        }
        receive(t) {
            return this._getBus(t).connect(this), this;
        }
        dispose() {
            return (
                super.dispose(),
                this._panVol.dispose(),
                this.pan.dispose(),
                this.volume.dispose(),
                this._solo.dispose(),
                this
            );
        }
    }
    ln.buses = new Map();
    class $p extends Q {
        constructor() {
            super(...arguments),
                (this.name = 'Listener'),
                (this.positionX = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.positionX,
                })),
                (this.positionY = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.positionY,
                })),
                (this.positionZ = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.positionZ,
                })),
                (this.forwardX = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardX,
                })),
                (this.forwardY = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardY,
                })),
                (this.forwardZ = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardZ,
                })),
                (this.upX = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.upX,
                })),
                (this.upY = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.upY,
                })),
                (this.upZ = new et({
                    context: this.context,
                    param: this.context.rawContext.listener.upZ,
                }));
        }
        static getDefaults() {
            return Object.assign(Q.getDefaults(), {
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                forwardX: 0,
                forwardY: 0,
                forwardZ: -1,
                upX: 0,
                upY: 1,
                upZ: 0,
            });
        }
        dispose() {
            return (
                super.dispose(),
                this.positionX.dispose(),
                this.positionY.dispose(),
                this.positionZ.dispose(),
                this.forwardX.dispose(),
                this.forwardY.dispose(),
                this.forwardZ.dispose(),
                this.upX.dispose(),
                this.upY.dispose(),
                this.upZ.dispose(),
                this
            );
        }
    }
    ri((n) => {
        n.listener = new $p({ context: n });
    }),
        oi((n) => {
            n.listener.dispose();
        });
    function hn() {
        return Rt().now();
    }
    Rt().transport, Rt().destination, Rt().destination, Rt().listener, Rt().draw, Rt();
    const Zt = W({ snapshots: [], current: -1 }),
        Dr = {
            startHandler: Ot,
            endHandler: bt,
            audioBuffer: De,
            trimmerType: Nt,
            audioEditorType: xt,
            audioPitch: He,
            audioSpeed: be,
            audioVolume: $e,
        },
        br = W({
            startHandler: b.get(Ot),
            endHandler: b.get(bt),
            audioBuffer: b.get(De),
            trimmerType: b.get(Nt),
            audioEditorType: b.get(xt),
            audioPitch: b.get(He),
            audioSpeed: b.get(be),
            audioVolume: b.get($e),
        }),
        qp = () => {
            b.set(Zt, { snapshots: [], current: -1 }),
                b.set(br, {
                    startHandler: b.get(Ot),
                    endHandler: b.get(bt),
                    audioBuffer: b.get(De),
                    trimmerType: b.get(Nt),
                    audioEditorType: b.get(xt),
                    audioPitch: b.get(He),
                    audioSpeed: b.get(be),
                    audioVolume: b.get($e),
                });
        };
    class Xp {
        constructor() {
            ee(this, 'player');
            ee(this, 'waveform');
            ee(this, 'audioBuffer');
            ee(this, 'isPaused', !1);
            ee(this, 'isStopClick', !1);
            ee(this, 'animationKey', 0);
            ee(this, 'startTime', 0);
            ee(this, 'isInventPlaying', !1);
            ee(this, 'pitchShift');
            ee(this, 'isExporting', !1);
            ee(this, 'exportAudioBuffer', async () => {
                var s;
                if (this.isPlaying || !this.isModified || this.isExporting) return;
                (this.isExporting = !0),
                    window != null &&
                        window.Entry &&
                        ((s = window.Entry) == null || s.dispatchEvent('beforeSaveSoundBuffer'));
                const t = b.get(go),
                    e = await Fp(() => {
                        this._play();
                    }, t);
                return this.stop(), (this.isExporting = !1), e ? e.get() : this.audioBuffer;
            });
            ci(new Dn({ latencyHint: 'playback', lookAhead: 0 }));
        }
        get isReady() {
            return this.audioBuffer;
        }
        get isPlaying() {
            var t;
            return this.audioBuffer && ((t = this.player) == null ? void 0 : t.state) === 'started';
        }
        get canControlEdit() {
            return this.isReady && !this.isPlaying;
        }
        async loadAudioBuffer(t) {
            const s = await (await fetch(t)).arrayBuffer();
            return await Rt().decodeAudioData(s);
        }
        async loadSoundByUrl(t) {
            try {
                const e = await this.loadAudioBuffer(t);
                return (
                    (this.audioBuffer = e),
                    b.set(ks, e),
                    b.set(De, e),
                    this.setWaveformData(e),
                    b.set(Mo, e.duration),
                    e
                );
            } catch (e) {
                throw (console.error('Error fetching or decoding audio file', e), e);
            }
        }
        loadSound(t) {
            try {
                return (
                    (this.audioBuffer = t),
                    b.set(ks, t),
                    b.set(De, t),
                    this.setWaveformData(t),
                    b.set(Mo, t.duration),
                    t
                );
            } catch (e) {
                throw (console.error('Error fetching or decoding audio file', e), e);
            }
        }
        setPlayer(t) {
            this.player && this.clearPlayer();
            const e = new Ii(0).toDestination(),
                s = new zn(t).connect(e);
            return (
                (this.pitchShift = e),
                (this.player = s),
                (this.player.onstop = this.handleStop.bind(this)),
                this.player
            );
        }
        clearPlayer() {
            this.player &&
                (this.player.stop(),
                this.player.disconnect(),
                this.player.dispose(),
                (this.player = void 0)),
                this.pitchShift &&
                    (this.pitchShift.disconnect(),
                    this.pitchShift.dispose(),
                    (this.pitchShift = void 0));
        }
        setWaveformData(t) {
            const e = t.getChannelData(0),
                s = this.computeChunkedRMS(e);
            b.set(zs, s);
        }
        computeRMS(t, e = 0.55) {
            if (t.length === 0) return 0;
            let s = 0;
            for (let a = 0; a < t.length; a++) {
                const o = t[a];
                o !== void 0 && (s += Math.pow(o, 2));
            }
            const r = Math.sqrt(s / t.length) / e;
            return Math.sqrt(r);
        }
        computeChunkedRMS(t, e = 1024) {
            const s = t.length,
                i = [];
            for (let r = 0; r < s; r += e) {
                const a = Math.min(s, r + e);
                i.push(this.computeRMS(t.slice(r, a)));
            }
            return i;
        }
        animatePlayback() {
            var t;
            if ((t = this.player) != null && t.buffer.loaded && this.player.state === 'started') {
                b.set(Bt, 'playing');
                const e = b.get(le),
                    s = this.getAudioEndTime() * e,
                    i = b.get(Ee),
                    r = b.get(Ce),
                    a = Math.min(hn() - i + r, s);
                b.set(Xe, a),
                    (this.animationKey = requestAnimationFrame(this.animatePlayback.bind(this)));
            } else
                this.isInventPlaying
                    ? (this.animationKey = requestAnimationFrame(this.animatePlayback.bind(this)))
                    : cancelAnimationFrame(this.animationKey);
        }
        getAudioEndTime() {
            return b.get(xt) === 'trimmer' && b.get(Nt) === 'default'
                ? b.get(bt)
                : this.audioBuffer
                ? this.audioBuffer.duration
                : 0;
        }
        setPitchShift() {
            if (!this.pitchShift) return;
            const t = b.get(Jc);
            this.pitchShift.pitch = t;
        }
        setSpeed() {
            this.player && (this.player.playbackRate = b.get(be));
        }
        setVolume() {
            this.player && (this.player.volume.value = b.get($e));
        }
        setAdjustPlayer() {
            this.setPitchShift(), this.setSpeed(), this.setVolume();
        }
        _play() {
            if (!this.audioBuffer || this.isPlaying) return 0;
            const t = this.setPlayer(this.audioBuffer);
            this.setAdjustPlayer();
            const e = hn(),
                s = Math.round(b.get(nu) * 10) / 10,
                i = b.get(xt),
                r = b.get(Nt),
                a = this.getAudioEndTime();
            if (i === 'trimmer' && r === 'invent') {
                const o = b.get(Ot),
                    c = b.get(bt),
                    u = b.get(le);
                t.start(hn(), 0, o),
                    a - c > 0 && ((this.isInventPlaying = !0), t.start(hn() + o * u, c, a - c));
            } else t.start(hn(), s, a - s);
            return e;
        }
        play() {
            if (!this.audioBuffer || this.isPlaying) return;
            const t = this._play();
            b.set(Ee, t),
                this.animatePlayback(),
                (this.isPaused = !1),
                b.set(Bt, 'playing'),
                (this.isStopClick = !1);
        }
        pause() {
            if (!this.player || this.isPaused) return;
            (this.isPaused = !0), b.set(Bt, 'paused');
            const t = b.get(Ee);
            b.set(Ce, hn() - t),
                b.set(Ee, (e) => e + this.player.context.currentTime - this.startTime),
                this.player.stop();
        }
        stop() {
            this.player &&
                (b.set(Bt, 'stopped'),
                b.set(Ce, 0),
                b.set(Ee, 0),
                b.set(Xe, 0),
                this.player.stop(),
                (this.isStopClick = !0));
        }
        clearSound() {
            this.player && this.player.stop(),
                b.set(De, null),
                b.set(Ce, 0),
                b.set(Ee, 0),
                b.set(Xe, 0),
                b.set(Ot, 0),
                b.set(bt, 0),
                b.set(He, 0),
                b.set(be, 1),
                b.set($e, 0);
        }
        handleStop() {
            if (this.isInventPlaying) {
                this.isInventPlaying = !1;
                return;
            }
            if (!this.isPaused) {
                if ((cancelAnimationFrame(this.animationKey), this.isStopClick)) b.set(Xe, 0);
                else {
                    const t = this.getAudioEndTime(),
                        e = b.get(Ce),
                        s = b.get(Ee);
                    let i = Math.min(hn() - s + e, t);
                    const r = b.get(xt),
                        a = b.get(Nt);
                    r === 'trimmer' &&
                        a === 'invent' &&
                        b.get(bt) >= t &&
                        (i = Math.min(i, b.get(Ot))),
                        b.set(Xe, i),
                        b.set(Ce, 0);
                }
                (this.isStopClick = !1), b.set(Ee, 0), b.set(Bt, 'stopped');
            }
        }
        get isModified() {
            const t = b.get(Zt),
                { snapshots: e, current: s } = t;
            return e.length > 1 && s > 0;
        }
        destroy() {
            this.clearSound(),
                this.clearPlayer(),
                b.set(xt, 'trimmer'),
                b.set(Nt, 'default'),
                b.set(ks, null),
                b.set(zs, []),
                b.set(Bt, 'stopped');
        }
    }
    class Jp {
        get isModified() {
            const t = b.get(Zt),
                { snapshots: e, current: s } = t;
            return e.length > 1 && s > 0;
        }
        applySnapshot(t) {
            Object.entries(t).forEach(([e, s]) => {
                const i = Dr[e];
                ((i && typeof s == 'number') || (i && typeof s == 'string')) && b.set(i, s);
            });
        }
        undo() {
            const t = b.get(Zt),
                { snapshots: e, current: s } = t,
                i = e[s - 1];
            i && (this.applySnapshot(i), b.set(Zt, { ...t, current: s - 1 }));
        }
        redo() {
            const t = b.get(Zt),
                { snapshots: e, current: s } = t,
                i = e[s + 1];
            i && (this.applySnapshot(i), b.set(Zt, { ...t, current: s + 1 }));
        }
        saveSnapshot(t) {
            const { snapshots: e, current: s } = b.get(Zt),
                i = b.get(br),
                r = b.get(xt),
                a = e[s],
                o = t.reduce((c, u) => {
                    const l = Dr[u];
                    if (l) {
                        const h = b.get(l);
                        if (a) {
                            const f = a[u],
                                p = i[u];
                            f !== void 0 ? (i[u] = f) : p !== void 0 && (a[u] = p);
                        }
                        c[u] = h;
                    }
                    return c;
                }, {});
            (o.audioEditorType = r),
                b.set(Zt, { snapshots: [...e.slice(0, s + 1), o], current: s + 1 }),
                b.set(br, i);
        }
        saveAllSnapshot() {
            this.saveSnapshot(Object.keys(Dr));
        }
        clearSnapshots() {
            b.set(Zt, { snapshots: [], current: -1 });
        }
        restoreDefaults() {
            const { snapshots: t } = b.get(Zt),
                [e] = t;
            e && (this.applySnapshot(e), b.set(Zt, { snapshots: t, current: 0 }));
        }
        destroy() {
            qp();
        }
    }
    const Kp = (n) => {
            const { children: t } = n,
                [e, s] = Dt(Ne),
                [i, r] = Dt(Te),
                a = U.useCallback(() => {
                    console.log('run', i), i && i.destroy(), e && e.destroy();
                }, [e, i]);
            return (
                U.useEffect(() => {
                    i || (s((o) => o || new Jp()), r((o) => o || new Xp()));
                }, [a, i, s, r]),
                L.jsx(L.Fragment, { children: t })
            );
        },
        tm = (n) => {
            const { children: t } = n;
            return L.jsx(Hc, { store: b, children: L.jsx(Kp, { children: t }) });
        },
        em = (n, t, e, s, i, r) => {
            const a = n.width,
                o = n.height,
                c = 2,
                u = 4,
                l = 2,
                h = Xc(e, a, u + l);
            if (
                (t.clearRect(0, 0, a, o),
                h.forEach((d, m) => {
                    const g = m * (u + l) + l / 2,
                        y = (d * o) / 2;
                    let S = c;
                    y < c && (S = y),
                        t.beginPath(),
                        t.moveTo(g + S, o / 2 - y),
                        t.lineTo(g + u - S, o / 2 - y),
                        t.arcTo(g + u, o / 2 - y, g + u, o / 2, S),
                        t.lineTo(g + u, o / 2 + y - S),
                        t.arcTo(g + u, o / 2 + y, g + u - S, o / 2 + y, S),
                        t.lineTo(g + S, o / 2 + y),
                        t.arcTo(g, o / 2 + y, g, o / 2 + y - S, S),
                        t.lineTo(g, o / 2 - y + S),
                        t.arcTo(g, o / 2 - y, g + S, o / 2 - y, S),
                        t.closePath(),
                        (t.fillStyle = 'orange'),
                        t.fill();
                }),
                s === 'adjuster')
            )
                return;
            const { start: f, end: p } = r;
            i === 'default'
                ? Pn(t, { x: f, y: 0, width: p - f, height: n.height }, [255, 255, 255])
                : (Pn(t, { x: 0, y: 0, width: f, height: n.height }, [255, 255, 255]),
                  Pn(t, { x: p - 20, y: 0, width: n.width, height: n.height }, [255, 255, 255]));
        },
        Ha = '#4f80ff',
        nm = '#ffffff',
        Ht = 12,
        Yt = 40,
        Cr = 6,
        sm = 36,
        im = 4,
        ji = (n, t, e) => {
            const s = e / 2,
                i = sm / 2;
            (n.strokeStyle = nm),
                (n.lineWidth = im),
                n.beginPath(),
                n.moveTo(t + 5, s - i),
                n.lineTo(t + 5, s + i),
                n.moveTo(t - 5, s - i),
                n.lineTo(t - 5, s + i),
                n.stroke();
        },
        Ai = (n, t, e, s, i) => {
            n.beginPath(),
                i === 'left'
                    ? (n.moveTo(t + Ht, 0),
                      n.lineTo(t + e, 0),
                      n.lineTo(t + e, s),
                      n.lineTo(t + Ht, s),
                      n.arcTo(t, s, t, s - Ht, Ht),
                      n.lineTo(t, Ht),
                      n.arcTo(t, 0, t + Ht, 0, Ht))
                    : (n.moveTo(t, 0),
                      n.lineTo(t + e - Ht, 0),
                      n.arcTo(t + e, 0, t + e, Ht, Ht),
                      n.lineTo(t + e, s - Ht),
                      n.arcTo(t + e, s, t + e - Ht, s, Ht),
                      n.lineTo(t, s),
                      n.lineTo(t, 0)),
                n.closePath(),
                (n.fillStyle = Ha),
                n.fill();
        },
        rm = (n, t, e, s) => {
            const i = n.width,
                r = n.height,
                a = s.start * 2,
                o = s.end * 2;
            if (
                (t.clearRect(0, 0, i, r), (t.strokeStyle = Ha), (t.lineWidth = Cr), e === 'default')
            ) {
                t.strokeRect(a + Cr / 2 + Yt / 2, 0, o - a, r),
                    Ai(t, a, Yt, r, 'left'),
                    Ai(t, o, Yt, r, 'right');
                const c = a + Yt / 2,
                    u = o + Yt / 2;
                ji(t, c, r), ji(t, u, r);
            } else {
                t.strokeRect(0, 0, a + Cr / 2 + Yt, r),
                    t.strokeRect(o, 0, i - o, r),
                    Ai(t, a + Yt, Yt, r, 'right'),
                    Ai(t, o - Yt, Yt, r, 'left');
                const c = a + Yt + Yt / 2,
                    u = o - Yt + Yt / 2;
                ji(t, c, r), ji(t, u, r);
            }
        },
        om = (n, t, e, s, i) => {
            if (
                (t.clearRect(0, 0, n.width, n.height),
                (t.fillStyle = '#f9f9f9'),
                t.fillRect(0, 0, n.width, n.height),
                e === 'adjuster')
            )
                return;
            const { start: r, end: a } = i;
            s === 'default'
                ? Pn(t, { x: r + 20, y: 0, width: a - r, height: n.height }, [255, 181, 0])
                : (Pn(t, { x: 0, y: 0, width: r + Yt / 2 + 10, height: n.height }, [255, 181, 0]),
                  Pn(t, { x: a, y: 0, width: n.width, height: n.height }, [255, 181, 0]));
        },
        Pn = (n, t, e) => {
            if (!n) return;
            const { x: s, y: i, width: r, height: a } = t;
            if (r < 1 || i === a) return;
            const o = n.getImageData(s, i, r, a),
                c = o.data,
                [u = 255, l = 255, h = 255] = e;
            for (let f = 0; f < c.length; f += 4) (c[f] = u), (c[f + 1] = l), (c[f + 2] = h);
            n.putImageData(o, s, i);
        },
        am = (n) => {
            const { width: t, height: e } = n,
                s = F(xt),
                i = F(Nt),
                [r, a] = Dt(hu),
                [o, c] = Dt(du),
                u = F(Mn),
                l = F(yn);
            U.useEffect(() => {
                !o || !r || om(r, o, s, i, { start: u, end: l });
            }, [r, o, u, l, i, s]);
            const h = (f) => {
                if (!f) return;
                const p = f.getContext('2d');
                a(f), c(p);
            };
            return L.jsx('canvas', {
                style: { width: t, height: e, borderRadius: 10 },
                ref: h,
                width: t,
                height: e,
            });
        };
    function xi() {
        return (
            (xi = Object.assign
                ? Object.assign.bind()
                : function(n) {
                      for (var t = 1; t < arguments.length; t++) {
                          var e = arguments[t];
                          for (var s in e)
                              Object.prototype.hasOwnProperty.call(e, s) && (n[s] = e[s]);
                      }
                      return n;
                  }),
            xi.apply(this, arguments)
        );
    }
    function $a(n) {
        var t = Object.create(null);
        return function(e) {
            return t[e] === void 0 && (t[e] = n(e)), t[e];
        };
    }
    var cm = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,
        um = $a(function(n) {
            return (
                cm.test(n) ||
                (n.charCodeAt(0) === 111 && n.charCodeAt(1) === 110 && n.charCodeAt(2) < 91)
            );
        });
    function lm(n) {
        if (n.sheet) return n.sheet;
        for (var t = 0; t < document.styleSheets.length; t++)
            if (document.styleSheets[t].ownerNode === n) return document.styleSheets[t];
    }
    function hm(n) {
        var t = document.createElement('style');
        return (
            t.setAttribute('data-emotion', n.key),
            n.nonce !== void 0 && t.setAttribute('nonce', n.nonce),
            t.appendChild(document.createTextNode('')),
            t.setAttribute('data-s', ''),
            t
        );
    }
    var dm = (function() {
            function n(e) {
                var s = this;
                (this._insertTag = function(i) {
                    var r;
                    s.tags.length === 0
                        ? s.insertionPoint
                            ? (r = s.insertionPoint.nextSibling)
                            : s.prepend
                            ? (r = s.container.firstChild)
                            : (r = s.before)
                        : (r = s.tags[s.tags.length - 1].nextSibling),
                        s.container.insertBefore(i, r),
                        s.tags.push(i);
                }),
                    (this.isSpeedy = e.speedy === void 0 ? !0 : e.speedy),
                    (this.tags = []),
                    (this.ctr = 0),
                    (this.nonce = e.nonce),
                    (this.key = e.key),
                    (this.container = e.container),
                    (this.prepend = e.prepend),
                    (this.insertionPoint = e.insertionPoint),
                    (this.before = null);
            }
            var t = n.prototype;
            return (
                (t.hydrate = function(s) {
                    s.forEach(this._insertTag);
                }),
                (t.insert = function(s) {
                    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(hm(this));
                    var i = this.tags[this.tags.length - 1];
                    if (this.isSpeedy) {
                        var r = lm(i);
                        try {
                            r.insertRule(s, r.cssRules.length);
                        } catch {}
                    } else i.appendChild(document.createTextNode(s));
                    this.ctr++;
                }),
                (t.flush = function() {
                    this.tags.forEach(function(s) {
                        return s.parentNode && s.parentNode.removeChild(s);
                    }),
                        (this.tags = []),
                        (this.ctr = 0);
                }),
                n
            );
        })(),
        Et = '-ms-',
        vi = '-moz-',
        X = '-webkit-',
        qa = 'comm',
        Er = 'rule',
        Or = 'decl',
        fm = '@import',
        Xa = '@keyframes',
        pm = '@layer',
        mm = Math.abs,
        Li = String.fromCharCode,
        gm = Object.assign;
    function Mm(n, t) {
        return Lt(n, 0) ^ 45
            ? (((((((t << 2) ^ Lt(n, 0)) << 2) ^ Lt(n, 1)) << 2) ^ Lt(n, 2)) << 2) ^ Lt(n, 3)
            : 0;
    }
    function Ja(n) {
        return n.trim();
    }
    function ym(n, t) {
        return (n = t.exec(n)) ? n[0] : n;
    }
    function J(n, t, e) {
        return n.replace(t, e);
    }
    function kr(n, t) {
        return n.indexOf(t);
    }
    function Lt(n, t) {
        return n.charCodeAt(t) | 0;
    }
    function Is(n, t, e) {
        return n.slice(t, e);
    }
    function Me(n) {
        return n.length;
    }
    function zr(n) {
        return n.length;
    }
    function wi(n, t) {
        return t.push(n), n;
    }
    function _m(n, t) {
        return n.map(t).join('');
    }
    var Di = 1,
        Rn = 1,
        Ka = 0,
        Gt = 0,
        It = 0,
        Yn = '';
    function bi(n, t, e, s, i, r, a) {
        return {
            value: n,
            root: t,
            parent: e,
            type: s,
            props: i,
            children: r,
            line: Di,
            column: Rn,
            length: a,
            return: '',
        };
    }
    function Ss(n, t) {
        return gm(bi('', null, null, '', null, null, 0), n, { length: -n.length }, t);
    }
    function Tm() {
        return It;
    }
    function Nm() {
        return (It = Gt > 0 ? Lt(Yn, --Gt) : 0), Rn--, It === 10 && ((Rn = 1), Di--), It;
    }
    function $t() {
        return (It = Gt < Ka ? Lt(Yn, Gt++) : 0), Rn++, It === 10 && ((Rn = 1), Di++), It;
    }
    function ye() {
        return Lt(Yn, Gt);
    }
    function Ci() {
        return Gt;
    }
    function js(n, t) {
        return Is(Yn, n, t);
    }
    function As(n) {
        switch (n) {
            case 0:
            case 9:
            case 10:
            case 13:
            case 32:
                return 5;
            case 33:
            case 43:
            case 44:
            case 47:
            case 62:
            case 64:
            case 126:
            case 59:
            case 123:
            case 125:
                return 4;
            case 58:
                return 3;
            case 34:
            case 39:
            case 40:
            case 91:
                return 2;
            case 41:
            case 93:
                return 1;
        }
        return 0;
    }
    function tc(n) {
        return (Di = Rn = 1), (Ka = Me((Yn = n))), (Gt = 0), [];
    }
    function ec(n) {
        return (Yn = ''), n;
    }
    function Ei(n) {
        return Ja(js(Gt - 1, Pr(n === 91 ? n + 2 : n === 40 ? n + 1 : n)));
    }
    function Im(n) {
        for (; (It = ye()) && It < 33; ) $t();
        return As(n) > 2 || As(It) > 3 ? '' : ' ';
    }
    function Sm(n, t) {
        for (
            ;
            --t && $t() && !(It < 48 || It > 102 || (It > 57 && It < 65) || (It > 70 && It < 97));

        );
        return js(n, Ci() + (t < 6 && ye() == 32 && $t() == 32));
    }
    function Pr(n) {
        for (; $t(); )
            switch (It) {
                case n:
                    return Gt;
                case 34:
                case 39:
                    n !== 34 && n !== 39 && Pr(It);
                    break;
                case 40:
                    n === 41 && Pr(n);
                    break;
                case 92:
                    $t();
                    break;
            }
        return Gt;
    }
    function jm(n, t) {
        for (; $t() && n + It !== 57; ) if (n + It === 84 && ye() === 47) break;
        return '/*' + js(t, Gt - 1) + '*' + Li(n === 47 ? n : $t());
    }
    function Am(n) {
        for (; !As(ye()); ) $t();
        return js(n, Gt);
    }
    function xm(n) {
        return ec(Oi('', null, null, null, [''], (n = tc(n)), 0, [0], n));
    }
    function Oi(n, t, e, s, i, r, a, o, c) {
        for (
            var u = 0,
                l = 0,
                h = a,
                f = 0,
                p = 0,
                d = 0,
                m = 1,
                g = 1,
                y = 1,
                S = 0,
                v = '',
                w = i,
                _ = r,
                N = s,
                T = v;
            g;

        )
            switch (((d = S), (S = $t()))) {
                case 40:
                    if (d != 108 && Lt(T, h - 1) == 58) {
                        kr((T += J(Ei(S), '&', '&\f')), '&\f') != -1 && (y = -1);
                        break;
                    }
                case 34:
                case 39:
                case 91:
                    T += Ei(S);
                    break;
                case 9:
                case 10:
                case 13:
                case 32:
                    T += Im(d);
                    break;
                case 92:
                    T += Sm(Ci() - 1, 7);
                    continue;
                case 47:
                    switch (ye()) {
                        case 42:
                        case 47:
                            wi(vm(jm($t(), Ci()), t, e), c);
                            break;
                        default:
                            T += '/';
                    }
                    break;
                case 123 * m:
                    o[u++] = Me(T) * y;
                case 125 * m:
                case 59:
                case 0:
                    switch (S) {
                        case 0:
                        case 125:
                            g = 0;
                        case 59 + l:
                            y == -1 && (T = J(T, /\f/g, '')),
                                p > 0 &&
                                    Me(T) - h &&
                                    wi(
                                        p > 32
                                            ? sc(T + ';', s, e, h - 1)
                                            : sc(J(T, ' ', '') + ';', s, e, h - 2),
                                        c
                                    );
                            break;
                        case 59:
                            T += ';';
                        default:
                            if (
                                (wi((N = nc(T, t, e, u, l, i, o, v, (w = []), (_ = []), h)), r),
                                S === 123)
                            )
                                if (l === 0) Oi(T, t, N, N, w, r, h, o, _);
                                else
                                    switch (f === 99 && Lt(T, 3) === 110 ? 100 : f) {
                                        case 100:
                                        case 108:
                                        case 109:
                                        case 115:
                                            Oi(
                                                n,
                                                N,
                                                N,
                                                s &&
                                                    wi(
                                                        nc(n, N, N, 0, 0, i, o, v, i, (w = []), h),
                                                        _
                                                    ),
                                                i,
                                                _,
                                                h,
                                                o,
                                                s ? w : _
                                            );
                                            break;
                                        default:
                                            Oi(T, N, N, N, [''], _, 0, o, _);
                                    }
                    }
                    (u = l = p = 0), (m = y = 1), (v = T = ''), (h = a);
                    break;
                case 58:
                    (h = 1 + Me(T)), (p = d);
                default:
                    if (m < 1) {
                        if (S == 123) --m;
                        else if (S == 125 && m++ == 0 && Nm() == 125) continue;
                    }
                    switch (((T += Li(S)), S * m)) {
                        case 38:
                            y = l > 0 ? 1 : ((T += '\f'), -1);
                            break;
                        case 44:
                            (o[u++] = (Me(T) - 1) * y), (y = 1);
                            break;
                        case 64:
                            ye() === 45 && (T += Ei($t())),
                                (f = ye()),
                                (l = h = Me((v = T += Am(Ci())))),
                                S++;
                            break;
                        case 45:
                            d === 45 && Me(T) == 2 && (m = 0);
                    }
            }
        return r;
    }
    function nc(n, t, e, s, i, r, a, o, c, u, l) {
        for (var h = i - 1, f = i === 0 ? r : [''], p = zr(f), d = 0, m = 0, g = 0; d < s; ++d)
            for (var y = 0, S = Is(n, h + 1, (h = mm((m = a[d])))), v = n; y < p; ++y)
                (v = Ja(m > 0 ? f[y] + ' ' + S : J(S, /&\f/g, f[y]))) && (c[g++] = v);
        return bi(n, t, e, i === 0 ? Er : o, c, u, l);
    }
    function vm(n, t, e) {
        return bi(n, t, e, qa, Li(Tm()), Is(n, 2, -2), 0);
    }
    function sc(n, t, e, s) {
        return bi(n, t, e, Or, Is(n, 0, s), Is(n, s + 1, -1), s);
    }
    function Un(n, t) {
        for (var e = '', s = zr(n), i = 0; i < s; i++) e += t(n[i], i, n, t) || '';
        return e;
    }
    function Lm(n, t, e, s) {
        switch (n.type) {
            case pm:
                if (n.children.length) break;
            case fm:
            case Or:
                return (n.return = n.return || n.value);
            case qa:
                return '';
            case Xa:
                return (n.return = n.value + '{' + Un(n.children, s) + '}');
            case Er:
                n.value = n.props.join(',');
        }
        return Me((e = Un(n.children, s))) ? (n.return = n.value + '{' + e + '}') : '';
    }
    function wm(n) {
        var t = zr(n);
        return function(e, s, i, r) {
            for (var a = '', o = 0; o < t; o++) a += n[o](e, s, i, r) || '';
            return a;
        };
    }
    function Dm(n) {
        return function(t) {
            t.root || ((t = t.return) && n(t));
        };
    }
    var ic = function(t) {
            var e = new WeakMap();
            return function(s) {
                if (e.has(s)) return e.get(s);
                var i = t(s);
                return e.set(s, i), i;
            };
        },
        bm = function(t, e, s) {
            for (
                var i = 0, r = 0;
                (i = r), (r = ye()), i === 38 && r === 12 && (e[s] = 1), !As(r);

            )
                $t();
            return js(t, Gt);
        },
        Cm = function(t, e) {
            var s = -1,
                i = 44;
            do
                switch (As(i)) {
                    case 0:
                        i === 38 && ye() === 12 && (e[s] = 1), (t[s] += bm(Gt - 1, e, s));
                        break;
                    case 2:
                        t[s] += Ei(i);
                        break;
                    case 4:
                        if (i === 44) {
                            (t[++s] = ye() === 58 ? '&\f' : ''), (e[s] = t[s].length);
                            break;
                        }
                    default:
                        t[s] += Li(i);
                }
            while ((i = $t()));
            return t;
        },
        Em = function(t, e) {
            return ec(Cm(tc(t), e));
        },
        rc = new WeakMap(),
        Om = function(t) {
            if (!(t.type !== 'rule' || !t.parent || t.length < 1)) {
                for (
                    var e = t.value, s = t.parent, i = t.column === s.column && t.line === s.line;
                    s.type !== 'rule';

                )
                    if (((s = s.parent), !s)) return;
                if (!(t.props.length === 1 && e.charCodeAt(0) !== 58 && !rc.get(s)) && !i) {
                    rc.set(t, !0);
                    for (var r = [], a = Em(e, r), o = s.props, c = 0, u = 0; c < a.length; c++)
                        for (var l = 0; l < o.length; l++, u++)
                            t.props[u] = r[c] ? a[c].replace(/&\f/g, o[l]) : o[l] + ' ' + a[c];
                }
            }
        },
        km = function(t) {
            if (t.type === 'decl') {
                var e = t.value;
                e.charCodeAt(0) === 108 &&
                    e.charCodeAt(2) === 98 &&
                    ((t.return = ''), (t.value = ''));
            }
        };
    function oc(n, t) {
        switch (Mm(n, t)) {
            case 5103:
                return X + 'print-' + n + n;
            case 5737:
            case 4201:
            case 3177:
            case 3433:
            case 1641:
            case 4457:
            case 2921:
            case 5572:
            case 6356:
            case 5844:
            case 3191:
            case 6645:
            case 3005:
            case 6391:
            case 5879:
            case 5623:
            case 6135:
            case 4599:
            case 4855:
            case 4215:
            case 6389:
            case 5109:
            case 5365:
            case 5621:
            case 3829:
                return X + n + n;
            case 5349:
            case 4246:
            case 4810:
            case 6968:
            case 2756:
                return X + n + vi + n + Et + n + n;
            case 6828:
            case 4268:
                return X + n + Et + n + n;
            case 6165:
                return X + n + Et + 'flex-' + n + n;
            case 5187:
                return X + n + J(n, /(\w+).+(:[^]+)/, X + 'box-$1$2' + Et + 'flex-$1$2') + n;
            case 5443:
                return X + n + Et + 'flex-item-' + J(n, /flex-|-self/, '') + n;
            case 4675:
                return X + n + Et + 'flex-line-pack' + J(n, /align-content|flex-|-self/, '') + n;
            case 5548:
                return X + n + Et + J(n, 'shrink', 'negative') + n;
            case 5292:
                return X + n + Et + J(n, 'basis', 'preferred-size') + n;
            case 6060:
                return X + 'box-' + J(n, '-grow', '') + X + n + Et + J(n, 'grow', 'positive') + n;
            case 4554:
                return X + J(n, /([^-])(transform)/g, '$1' + X + '$2') + n;
            case 6187:
                return J(J(J(n, /(zoom-|grab)/, X + '$1'), /(image-set)/, X + '$1'), n, '') + n;
            case 5495:
            case 3959:
                return J(n, /(image-set\([^]*)/, X + '$1$`$1');
            case 4968:
                return (
                    J(
                        J(n, /(.+:)(flex-)?(.*)/, X + 'box-pack:$3' + Et + 'flex-pack:$3'),
                        /s.+-b[^;]+/,
                        'justify'
                    ) +
                    X +
                    n +
                    n
                );
            case 4095:
            case 3583:
            case 4068:
            case 2532:
                return J(n, /(.+)-inline(.+)/, X + '$1$2') + n;
            case 8116:
            case 7059:
            case 5753:
            case 5535:
            case 5445:
            case 5701:
            case 4933:
            case 4677:
            case 5533:
            case 5789:
            case 5021:
            case 4765:
                if (Me(n) - 1 - t > 6)
                    switch (Lt(n, t + 1)) {
                        case 109:
                            if (Lt(n, t + 4) !== 45) break;
                        case 102:
                            return (
                                J(
                                    n,
                                    /(.+:)(.+)-([^]+)/,
                                    '$1' +
                                        X +
                                        '$2-$3$1' +
                                        vi +
                                        (Lt(n, t + 3) == 108 ? '$3' : '$2-$3')
                                ) + n
                            );
                        case 115:
                            return ~kr(n, 'stretch')
                                ? oc(J(n, 'stretch', 'fill-available'), t) + n
                                : n;
                    }
                break;
            case 4949:
                if (Lt(n, t + 1) !== 115) break;
            case 6444:
                switch (Lt(n, Me(n) - 3 - (~kr(n, '!important') && 10))) {
                    case 107:
                        return J(n, ':', ':' + X) + n;
                    case 101:
                        return (
                            J(
                                n,
                                /(.+:)([^;!]+)(;|!.+)?/,
                                '$1' +
                                    X +
                                    (Lt(n, 14) === 45 ? 'inline-' : '') +
                                    'box$3$1' +
                                    X +
                                    '$2$3$1' +
                                    Et +
                                    '$2box$3'
                            ) + n
                        );
                }
                break;
            case 5936:
                switch (Lt(n, t + 11)) {
                    case 114:
                        return X + n + Et + J(n, /[svh]\w+-[tblr]{2}/, 'tb') + n;
                    case 108:
                        return X + n + Et + J(n, /[svh]\w+-[tblr]{2}/, 'tb-rl') + n;
                    case 45:
                        return X + n + Et + J(n, /[svh]\w+-[tblr]{2}/, 'lr') + n;
                }
                return X + n + Et + n + n;
        }
        return n;
    }
    var zm = function(t, e, s, i) {
            if (t.length > -1 && !t.return)
                switch (t.type) {
                    case Or:
                        t.return = oc(t.value, t.length);
                        break;
                    case Xa:
                        return Un([Ss(t, { value: J(t.value, '@', '@' + X) })], i);
                    case Er:
                        if (t.length)
                            return _m(t.props, function(r) {
                                switch (ym(r, /(::plac\w+|:read-\w+)/)) {
                                    case ':read-only':
                                    case ':read-write':
                                        return Un(
                                            [
                                                Ss(t, {
                                                    props: [J(r, /:(read-\w+)/, ':' + vi + '$1')],
                                                }),
                                            ],
                                            i
                                        );
                                    case '::placeholder':
                                        return Un(
                                            [
                                                Ss(t, {
                                                    props: [
                                                        J(r, /:(plac\w+)/, ':' + X + 'input-$1'),
                                                    ],
                                                }),
                                                Ss(t, {
                                                    props: [J(r, /:(plac\w+)/, ':' + vi + '$1')],
                                                }),
                                                Ss(t, {
                                                    props: [J(r, /:(plac\w+)/, Et + 'input-$1')],
                                                }),
                                            ],
                                            i
                                        );
                                }
                                return '';
                            });
                }
        },
        Pm = [zm],
        Rm = function(t) {
            var e = t.key;
            if (e === 'css') {
                var s = document.querySelectorAll('style[data-emotion]:not([data-s])');
                Array.prototype.forEach.call(s, function(m) {
                    var g = m.getAttribute('data-emotion');
                    g.indexOf(' ') !== -1 &&
                        (document.head.appendChild(m), m.setAttribute('data-s', ''));
                });
            }
            var i = t.stylisPlugins || Pm,
                r = {},
                a,
                o = [];
            (a = t.container || document.head),
                Array.prototype.forEach.call(
                    document.querySelectorAll('style[data-emotion^="' + e + ' "]'),
                    function(m) {
                        for (
                            var g = m.getAttribute('data-emotion').split(' '), y = 1;
                            y < g.length;
                            y++
                        )
                            r[g[y]] = !0;
                        o.push(m);
                    }
                );
            var c,
                u = [Om, km];
            {
                var l,
                    h = [
                        Lm,
                        Dm(function(m) {
                            l.insert(m);
                        }),
                    ],
                    f = wm(u.concat(i, h)),
                    p = function(g) {
                        return Un(xm(g), f);
                    };
                c = function(g, y, S, v) {
                    (l = S),
                        p(g ? g + '{' + y.styles + '}' : y.styles),
                        v && (d.inserted[y.name] = !0);
                };
            }
            var d = {
                key: e,
                sheet: new dm({
                    key: e,
                    container: a,
                    nonce: t.nonce,
                    speedy: t.speedy,
                    prepend: t.prepend,
                    insertionPoint: t.insertionPoint,
                }),
                nonce: t.nonce,
                inserted: r,
                registered: {},
                insert: c,
            };
            return d.sheet.hydrate(o), d;
        },
        Ym = !0;
    function Um(n, t, e) {
        var s = '';
        return (
            e.split(' ').forEach(function(i) {
                n[i] !== void 0 ? t.push(n[i] + ';') : (s += i + ' ');
            }),
            s
        );
    }
    var ac = function(t, e, s) {
            var i = t.key + '-' + e.name;
            (s === !1 || Ym === !1) && t.registered[i] === void 0 && (t.registered[i] = e.styles);
        },
        Vm = function(t, e, s) {
            ac(t, e, s);
            var i = t.key + '-' + e.name;
            if (t.inserted[e.name] === void 0) {
                var r = e;
                do t.insert(e === r ? '.' + i : '', r, t.sheet, !0), (r = r.next);
                while (r !== void 0);
            }
        };
    function Wm(n) {
        for (var t = 0, e, s = 0, i = n.length; i >= 4; ++s, i -= 4)
            (e =
                (n.charCodeAt(s) & 255) |
                ((n.charCodeAt(++s) & 255) << 8) |
                ((n.charCodeAt(++s) & 255) << 16) |
                ((n.charCodeAt(++s) & 255) << 24)),
                (e = (e & 65535) * 1540483477 + (((e >>> 16) * 59797) << 16)),
                (e ^= e >>> 24),
                (t =
                    ((e & 65535) * 1540483477 + (((e >>> 16) * 59797) << 16)) ^
                    ((t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)));
        switch (i) {
            case 3:
                t ^= (n.charCodeAt(s + 2) & 255) << 16;
            case 2:
                t ^= (n.charCodeAt(s + 1) & 255) << 8;
            case 1:
                (t ^= n.charCodeAt(s) & 255),
                    (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16));
        }
        return (
            (t ^= t >>> 13),
            (t = (t & 65535) * 1540483477 + (((t >>> 16) * 59797) << 16)),
            ((t ^ (t >>> 15)) >>> 0).toString(36)
        );
    }
    var Fm = {
            animationIterationCount: 1,
            aspectRatio: 1,
            borderImageOutset: 1,
            borderImageSlice: 1,
            borderImageWidth: 1,
            boxFlex: 1,
            boxFlexGroup: 1,
            boxOrdinalGroup: 1,
            columnCount: 1,
            columns: 1,
            flex: 1,
            flexGrow: 1,
            flexPositive: 1,
            flexShrink: 1,
            flexNegative: 1,
            flexOrder: 1,
            gridRow: 1,
            gridRowEnd: 1,
            gridRowSpan: 1,
            gridRowStart: 1,
            gridColumn: 1,
            gridColumnEnd: 1,
            gridColumnSpan: 1,
            gridColumnStart: 1,
            msGridRow: 1,
            msGridRowSpan: 1,
            msGridColumn: 1,
            msGridColumnSpan: 1,
            fontWeight: 1,
            lineHeight: 1,
            opacity: 1,
            order: 1,
            orphans: 1,
            tabSize: 1,
            widows: 1,
            zIndex: 1,
            zoom: 1,
            WebkitLineClamp: 1,
            fillOpacity: 1,
            floodOpacity: 1,
            stopOpacity: 1,
            strokeDasharray: 1,
            strokeDashoffset: 1,
            strokeMiterlimit: 1,
            strokeOpacity: 1,
            strokeWidth: 1,
        },
        Gm = /[A-Z]|^ms/g,
        Bm = /_EMO_([^_]+?)_([^]*?)_EMO_/g,
        cc = function(t) {
            return t.charCodeAt(1) === 45;
        },
        uc = function(t) {
            return t != null && typeof t != 'boolean';
        },
        Rr = $a(function(n) {
            return cc(n) ? n : n.replace(Gm, '-$&').toLowerCase();
        }),
        lc = function(t, e) {
            switch (t) {
                case 'animation':
                case 'animationName':
                    if (typeof e == 'string')
                        return e.replace(Bm, function(s, i, r) {
                            return (_e = { name: i, styles: r, next: _e }), i;
                        });
            }
            return Fm[t] !== 1 && !cc(t) && typeof e == 'number' && e !== 0 ? e + 'px' : e;
        },
        J_ =
            'Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.';
    function xs(n, t, e) {
        if (e == null) return '';
        if (e.__emotion_styles !== void 0) return e;
        switch (typeof e) {
            case 'boolean':
                return '';
            case 'object': {
                if (e.anim === 1)
                    return (_e = { name: e.name, styles: e.styles, next: _e }), e.name;
                if (e.styles !== void 0) {
                    var s = e.next;
                    if (s !== void 0)
                        for (; s !== void 0; )
                            (_e = { name: s.name, styles: s.styles, next: _e }), (s = s.next);
                    var i = e.styles + ';';
                    return i;
                }
                return Qm(n, t, e);
            }
            case 'function': {
                if (n !== void 0) {
                    var r = _e,
                        a = e(n);
                    return (_e = r), xs(n, t, a);
                }
                break;
            }
        }
        if (t == null) return e;
        var o = t[e];
        return o !== void 0 ? o : e;
    }
    function Qm(n, t, e) {
        var s = '';
        if (Array.isArray(e)) for (var i = 0; i < e.length; i++) s += xs(n, t, e[i]) + ';';
        else
            for (var r in e) {
                var a = e[r];
                if (typeof a != 'object')
                    t != null && t[a] !== void 0
                        ? (s += r + '{' + t[a] + '}')
                        : uc(a) && (s += Rr(r) + ':' + lc(r, a) + ';');
                else if (
                    Array.isArray(a) &&
                    typeof a[0] == 'string' &&
                    (t == null || t[a[0]] === void 0)
                )
                    for (var o = 0; o < a.length; o++)
                        uc(a[o]) && (s += Rr(r) + ':' + lc(r, a[o]) + ';');
                else {
                    var c = xs(n, t, a);
                    switch (r) {
                        case 'animation':
                        case 'animationName': {
                            s += Rr(r) + ':' + c + ';';
                            break;
                        }
                        default:
                            s += r + '{' + c + '}';
                    }
                }
            }
        return s;
    }
    var hc = /label:\s*([^\s;\n{]+)\s*(;|$)/g,
        _e,
        Zm = function(t, e, s) {
            if (
                t.length === 1 &&
                typeof t[0] == 'object' &&
                t[0] !== null &&
                t[0].styles !== void 0
            )
                return t[0];
            var i = !0,
                r = '';
            _e = void 0;
            var a = t[0];
            a == null || a.raw === void 0 ? ((i = !1), (r += xs(s, e, a))) : (r += a[0]);
            for (var o = 1; o < t.length; o++) (r += xs(s, e, t[o])), i && (r += a[o]);
            hc.lastIndex = 0;
            for (var c = '', u; (u = hc.exec(r)) !== null; ) c += '-' + u[1];
            var l = Wm(r) + c;
            return { name: l, styles: r, next: _e };
        },
        Hm = function(t) {
            return t();
        },
        $m = ne['useInsertionEffect'] ? ne['useInsertionEffect'] : !1,
        qm = $m || Hm,
        dc = ne.createContext(typeof HTMLElement < 'u' ? Rm({ key: 'css' }) : null);
    dc.Provider;
    var Xm = function(t) {
            return U.forwardRef(function(e, s) {
                var i = U.useContext(dc);
                return t(e, i, s);
            });
        },
        Yr = ne.createContext({}),
        Jm = function(t, e) {
            if (typeof e == 'function') {
                var s = e(t);
                return s;
            }
            return xi({}, t, e);
        },
        Km = ic(function(n) {
            return ic(function(t) {
                return Jm(n, t);
            });
        }),
        tg = function(t) {
            var e = ne.useContext(Yr);
            return (
                t.theme !== e && (e = Km(e)(t.theme)),
                ne.createElement(Yr.Provider, { value: e }, t.children)
            );
        },
        eg = um,
        ng = function(t) {
            return t !== 'theme';
        },
        fc = function(t) {
            return typeof t == 'string' && t.charCodeAt(0) > 96 ? eg : ng;
        },
        pc = function(t, e, s) {
            var i;
            if (e) {
                var r = e.shouldForwardProp;
                i =
                    t.__emotion_forwardProp && r
                        ? function(a) {
                              return t.__emotion_forwardProp(a) && r(a);
                          }
                        : r;
            }
            return typeof i != 'function' && s && (i = t.__emotion_forwardProp), i;
        },
        sg = function(t) {
            var e = t.cache,
                s = t.serialized,
                i = t.isStringTag;
            return (
                ac(e, s, i),
                qm(function() {
                    return Vm(e, s, i);
                }),
                null
            );
        },
        ig = function n(t, e) {
            var s = t.__emotion_real === t,
                i = (s && t.__emotion_base) || t,
                r,
                a;
            e !== void 0 && ((r = e.label), (a = e.target));
            var o = pc(t, e, s),
                c = o || fc(i),
                u = !c('as');
            return function() {
                var l = arguments,
                    h = s && t.__emotion_styles !== void 0 ? t.__emotion_styles.slice(0) : [];
                if (
                    (r !== void 0 && h.push('label:' + r + ';'),
                    l[0] == null || l[0].raw === void 0)
                )
                    h.push.apply(h, l);
                else {
                    h.push(l[0][0]);
                    for (var f = l.length, p = 1; p < f; p++) h.push(l[p], l[0][p]);
                }
                var d = Xm(function(m, g, y) {
                    var S = (u && m.as) || i,
                        v = '',
                        w = [],
                        _ = m;
                    if (m.theme == null) {
                        _ = {};
                        for (var N in m) _[N] = m[N];
                        _.theme = ne.useContext(Yr);
                    }
                    typeof m.className == 'string'
                        ? (v = Um(g.registered, w, m.className))
                        : m.className != null && (v = m.className + ' ');
                    var T = Zm(h.concat(w), g.registered, _);
                    (v += g.key + '-' + T.name), a !== void 0 && (v += ' ' + a);
                    var M = u && o === void 0 ? fc(S) : c,
                        j = {};
                    for (var x in m) (u && x === 'as') || (M(x) && (j[x] = m[x]));
                    return (
                        (j.className = v),
                        (j.ref = y),
                        ne.createElement(
                            ne.Fragment,
                            null,
                            ne.createElement(sg, {
                                cache: g,
                                serialized: T,
                                isStringTag: typeof S == 'string',
                            }),
                            ne.createElement(S, j)
                        )
                    );
                });
                return (
                    (d.displayName =
                        r !== void 0
                            ? r
                            : 'Styled(' +
                              (typeof i == 'string' ? i : i.displayName || i.name || 'Component') +
                              ')'),
                    (d.defaultProps = t.defaultProps),
                    (d.__emotion_real = d),
                    (d.__emotion_base = i),
                    (d.__emotion_styles = h),
                    (d.__emotion_forwardProp = o),
                    Object.defineProperty(d, 'toString', {
                        value: function() {
                            return '.' + a;
                        },
                    }),
                    (d.withComponent = function(m, g) {
                        return n(m, xi({}, e, g, { shouldForwardProp: pc(d, g, !0) })).apply(
                            void 0,
                            h
                        );
                    }),
                    d
                );
            };
        },
        rg = [
            'a',
            'abbr',
            'address',
            'area',
            'article',
            'aside',
            'audio',
            'b',
            'base',
            'bdi',
            'bdo',
            'big',
            'blockquote',
            'body',
            'br',
            'button',
            'canvas',
            'caption',
            'cite',
            'code',
            'col',
            'colgroup',
            'data',
            'datalist',
            'dd',
            'del',
            'details',
            'dfn',
            'dialog',
            'div',
            'dl',
            'dt',
            'em',
            'embed',
            'fieldset',
            'figcaption',
            'figure',
            'footer',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'head',
            'header',
            'hgroup',
            'hr',
            'html',
            'i',
            'iframe',
            'img',
            'input',
            'ins',
            'kbd',
            'keygen',
            'label',
            'legend',
            'li',
            'link',
            'main',
            'map',
            'mark',
            'marquee',
            'menu',
            'menuitem',
            'meta',
            'meter',
            'nav',
            'noscript',
            'object',
            'ol',
            'optgroup',
            'option',
            'output',
            'p',
            'param',
            'picture',
            'pre',
            'progress',
            'q',
            'rp',
            'rt',
            'ruby',
            's',
            'samp',
            'script',
            'section',
            'select',
            'small',
            'source',
            'span',
            'strong',
            'style',
            'sub',
            'summary',
            'sup',
            'table',
            'tbody',
            'td',
            'textarea',
            'tfoot',
            'th',
            'thead',
            'time',
            'title',
            'tr',
            'track',
            'u',
            'ul',
            'var',
            'video',
            'wbr',
            'circle',
            'clipPath',
            'defs',
            'ellipse',
            'foreignObject',
            'g',
            'image',
            'line',
            'linearGradient',
            'mask',
            'path',
            'pattern',
            'polygon',
            'polyline',
            'radialGradient',
            'rect',
            'stop',
            'svg',
            'text',
            'tspan',
        ],
        K = ig.bind();
    rg.forEach(function(n) {
        K[n] = K(n);
    });
    const dn = 4,
        Ge = 32,
        mc = 30,
        ki = 12,
        Ur = 11,
        og =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOS45MjEgMTIuMDIyYTIuNSAyLjUgMCAxIDEtNC45NzIuNTIzIDIuNSAyLjUgMCAwIDEgNC45NzItLjUyM3pNNy4zMTUgMTFhMS4xNTMgMS4xNTMgMCAxIDAgLjI0IDIuMjkzQTEuMTUzIDEuMTUzIDAgMCAwIDcuMzE2IDExem00LjgwMS01LjYyMmEyLjUgMi41IDAgMSAxLS41MjMgNC45NzMgMi41IDIuNSAwIDAgMSAuNTIzLTQuOTczem0tNS40NC0zLjY1Ny41ODEgMy45MTMgMS44MTQuMjVjLS4xOTIuMjY1LS4zMi41ODEtLjM1Ni45My0uMDM2LjM0LjAyLjY3LjE0OC45NjVhMS45NCAxLjk0IDAgMCAxLS4yNDgtLjAxTDcuNTUgNy42MWwuMTUgMS4wMDVjLjAwOC4wODMuMDEyLjE2Ni4wMS4yNDhhMS45MTMgMS45MTMgMCAwIDAtLjk2Ni0uMTQ4IDEuOTEzIDEuOTEzIDAgMCAwLS45MjkuMzU2bC0uMjQyLTEuNzU0LTMuODUyLS41NzFhMS45MjIgMS45MjIgMCAwIDEtMS43MS0yLjExMmw1LjI5My43My0uNzQtNS4zNTNhMS45MjIgMS45MjIgMCAwIDEgMi4xMTIgMS43MXptNC4wMyA1Ljg4OWExLjE1NiAxLjE1NiAwIDEgMCAyLjI5OC4yNDIgMS4xNTYgMS4xNTYgMCAwIDAtMi4yOTktLjI0MnpNNS44NzIgNi4xOThhLjU1LjU1IDAgMSAwIDEuMDY4LjI2Ni41NS41NSAwIDAgMC0xLjA2OC0uMjY2eiIgZmlsbD0iIzRGODBGRiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+',
        ag =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMS43NzggNi44MjVhLjg4OS44ODkgMCAwIDEtMS43NzggMHYtMS42NWEuODg5Ljg4OSAwIDAgMSAxLjc3OCAwdjEuNjV6TTUuMzMzIDguNTRhLjg4OS44ODkgMCAxIDEtMS43NzcgMFYzLjQ2YS44ODkuODg5IDAgMSAxIDEuNzc3IDB2NS4wOHptMy41NTYgMi41NzlhLjg4MS44ODEgMCAxIDEtMS43NjMgMFYuODhhLjg4MS44ODEgMCAxIDEgMS43NjMgMHYxMC4yNHptMy41NTUtMi41OGEuODg5Ljg4OSAwIDEgMS0xLjc3NyAwVjMuNDZhLjg4OS44ODkgMCAxIDEgMS43NzcgMHY1LjA4ek0xNiA2LjgyNmEuODg5Ljg4OSAwIDAgMS0xLjc3OCAwdi0xLjY1YS44ODkuODg5IDAgMCAxIDEuNzc4IDB2MS42NXoiIGZpbGw9IiM0RjgwRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==',
        cg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOS45MjEgMTIuMDIyYTIuNSAyLjUgMCAxIDEtNC45NzIuNTIzIDIuNSAyLjUgMCAwIDEgNC45NzItLjUyM3pNNy4zMTUgMTFhMS4xNTMgMS4xNTMgMCAxIDAgLjI0IDIuMjkzQTEuMTUzIDEuMTUzIDAgMCAwIDcuMzE2IDExem00LjgwMS01LjYyMmEyLjUgMi41IDAgMSAxLS41MjMgNC45NzMgMi41IDIuNSAwIDAgMSAuNTIzLTQuOTczem0tNS40NC0zLjY1Ny41ODEgMy45MTMgMS44MTQuMjVjLS4xOTIuMjY1LS4zMi41ODEtLjM1Ni45My0uMDM2LjM0LjAyLjY3LjE0OC45NjVhMS45NCAxLjk0IDAgMCAxLS4yNDgtLjAxTDcuNTUgNy42MWwuMTUgMS4wMDVjLjAwOC4wODMuMDEyLjE2Ni4wMS4yNDhhMS45MTMgMS45MTMgMCAwIDAtLjk2Ni0uMTQ4IDEuOTEzIDEuOTEzIDAgMCAwLS45MjkuMzU2bC0uMjQyLTEuNzU0LTMuODUyLS41NzFhMS45MjIgMS45MjIgMCAwIDEtMS43MS0yLjExMmw1LjI5My43My0uNzQtNS4zNTNhMS45MjIgMS45MjIgMCAwIDEgMi4xMTIgMS43MXptNC4wMyA1Ljg4OWExLjE1NiAxLjE1NiAwIDEgMCAyLjI5OC4yNDIgMS4xNTYgMS4xNTYgMCAwIDAtMi4yOTktLjI0MnpNNS44NzIgNi4xOThhLjU1LjU1IDAgMSAwIDEuMDY4LjI2Ni41NS41NSAwIDAgMC0xLjA2OC0uMjY2eiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+',
        ug =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMS43NzggNi44MjVhLjg4OS44ODkgMCAwIDEtMS43NzggMHYtMS42NWEuODg5Ljg4OSAwIDAgMSAxLjc3OCAwdjEuNjV6TTUuMzMzIDguNTRhLjg4OS44ODkgMCAxIDEtMS43NzcgMFYzLjQ2YS44ODkuODg5IDAgMSAxIDEuNzc3IDB2NS4wOHptMy41NTYgMi41NzlhLjg4MS44ODEgMCAxIDEtMS43NjMgMFYuODhhLjg4MS44ODEgMCAxIDEgMS43NjMgMHYxMC4yNHptMy41NTUtMi41OGEuODg5Ljg4OSAwIDEgMS0xLjc3NyAwVjMuNDZhLjg4OS44ODkgMCAxIDEgMS43NzcgMHY1LjA4ek0xNiA2LjgyNmEuODg5Ljg4OSAwIDAgMS0xLjc3OCAwdi0xLjY1YS44ODkuODg5IDAgMCAxIDEuNzc4IDB2MS42NXoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==',
        lg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMCAxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAxLjAxdjguOThhMSAxIDAgMCAwIDEuNDk4Ljg2OGw3LjgyLTQuNDlhMSAxIDAgMCAwIDAtMS43MzVMMS40OTguMTQzQTEgMSAwIDAgMCAwIDEuMDF6IiBmaWxsPSIjNEY4MEZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=',
        hg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjNEY4MEZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEyIiByeD0iMSIvPjxyZWN0IHg9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjEyIiByeD0iMSIvPjwvZz48L3N2Zz4=',
        dg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjNEY4MEZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=',
        fg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuMDUgMy41Ny45MjkgNi4yNiAyLjkwMi40MDJhMy4wNiAzLjA2IDAgMCAwLS41NyAxLjQ4NiAzLjA2IDMuMDYgMCAwIDAgLjIzNyAxLjU0NSAzLjEwNCAzLjEwNCAwIDAgMS0uMzk4LS4wMTZsLTEuNzAyLS4yNTMuMjM4IDEuNjA2Yy4wMTQuMTM0LjAyLjI2Ni4wMTcuMzk3YTMuMDYgMy4wNiAwIDAgMC0xLjU0Ni0uMjM2IDMuMDYgMy4wNiAwIDAgMC0xLjQ4Ni41N2wtLjM4Ny0yLjgwNy02LjE2NC0uOTE1QTMuMDc1IDMuMDc1IDAgMCAxIDEuMzg0IDguMjNMOS44NTMgOS40IDguNjcuODMzYTMuMDc1IDMuMDc1IDAgMCAxIDMuMzggMi43MzZ6bS0uMjE5IDYuNTJhLjg4Ljg4IDAgMSAwLS40MjYgMS43MS44OC44OCAwIDAgMCAuNDI2LTEuNzF6IiBmaWxsPSIjNEY4MEZGIi8+PHBhdGggZD0iTTEyLjI2NSAxNS43ODFhMy4wNzUgMy4wNzUgMCAxIDEgLjY0MiA2LjExNiAzLjA3NSAzLjA3NSAwIDAgMS0uNjQyLTYuMTE2em0uMTI4IDEuMjIzYTEuODQ1IDEuODQ1IDAgMSAwIC4zODYgMy42NyAxLjg0NSAxLjg0NSAwIDAgMC0uMzg2LTMuNjd6bTMuOTM5LTUuMThhMy4wNzUgMy4wNzUgMCAxIDEgNi4xMTYuNjQ0IDMuMDc1IDMuMDc1IDAgMCAxLTYuMTE2LS42NDN6bTEuMjE5LjEzNWExLjg0OSAxLjg0OSAwIDEgMCAzLjY3Ny4zODYgMS44NDkgMS44NDkgMCAwIDAtMy42NzctLjM4NnoiIGZpbGw9IiNGRkI1MDAiLz48L2c+PC9zdmc+',
        pg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMyA1djE0YTEgMSAwIDAgMS0yIDBWNWExIDEgMCAxIDEgMiAweiIgZmlsbD0iI0ZGQjUwMCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTkgOHY4YTEgMSAwIDAgMS0yIDBWOGExIDEgMCAwIDEgMiAwem04IDB2OGExIDEgMCAwIDEtMiAwVjhhMSAxIDAgMSAxIDIgMHpNNSAxMHY0YTEgMSAwIDAgMS0yIDB2LTRhMSAxIDAgMCAxIDIgMHptMTYgMHY0YTEgMSAwIDAgMS0yIDB2LTRhMSAxIDAgMSAxIDIgMHoiIGZpbGw9IiM0RjgwRkYiLz48L2c+PC9zdmc+',
        mg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0NCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggZD0iTTMxIDhoNWEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMS0yIDJoLTVWOHoiIGlkPSJhIi8+PHBhdGggZD0iTTggOGg1djE2SDhhMiAyIDAgMCAxLTItMlYxMGEyIDIgMCAwIDEgMi0yeiIgaWQ9ImIiLz48bWFzayBpZD0iYyIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI3IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxtYXNrIGlkPSJkIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjciIGhlaWdodD0iMTYiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L21hc2s+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHJlY3Qgc3Ryb2tlPSIjRTJFMkUyIiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9Ii41IiB5PSIuNSIgd2lkdGg9IjQzIiBoZWlnaHQ9IjMxIiByeD0iNCIvPjx1c2Ugc3Ryb2tlPSIjQjFCMUIxIiBtYXNrPSJ1cmwoI2MpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGMkYyRjIiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iMSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIHN0cm9rZT0iI0IxQjFCMSIgbWFzaz0idXJsKCNkKSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRjJGMkYyIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1kYXNoYXJyYXk9IjEiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggc3Ryb2tlPSIjOTU5NTk1IiBmaWxsPSIjRTJFMkUyIiBkPSJNMTUuNSA4LjVoMTN2MTVoLTEzeiIvPjwvZz48L3N2Zz4=',
        gg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0NCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggZD0iTTMxIDhoNWEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMS0yIDJoLTVWOHoiIGlkPSJhIi8+PHBhdGggZD0iTTggOGg1djE2SDhhMiAyIDAgMCAxLTItMlYxMGEyIDIgMCAwIDEgMi0yeiIgaWQ9ImIiLz48bWFzayBpZD0iYyIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI3IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxtYXNrIGlkPSJkIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjciIGhlaWdodD0iMTYiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L21hc2s+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHJlY3Qgc3Ryb2tlPSIjNEY4MEZGIiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9Ii41IiB5PSIuNSIgd2lkdGg9IjQzIiBoZWlnaHQ9IjMxIiByeD0iNCIvPjx1c2Ugc3Ryb2tlPSIjODI4MjgyIiBtYXNrPSJ1cmwoI2MpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGMkYyRjIiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iMSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIHN0cm9rZT0iIzgyODI4MiIgbWFzaz0idXJsKCNkKSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRjJGMkYyIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1kYXNoYXJyYXk9IjEiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggc3Ryb2tlPSIjNEY4MEZGIiBmaWxsPSIjRkVDNzAwIiBkPSJNMTUuNSA4LjVoMTN2MTVoLTEzeiIvPjwvZz48L3N2Zz4=',
        Mg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0NCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0xNSA4aDE0djE2SDE1eiIvPjxtYXNrIGlkPSJiIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHN0cm9rZT0iI0UyRTJFMiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSIuNSIgeT0iLjUiIHdpZHRoPSI0MyIgaGVpZ2h0PSIzMSIgcng9IjQiLz48cGF0aCBkPSJNMzYgOC41Yy40MTQgMCAuNzkuMTY4IDEuMDYuNDQuMjcyLjI3LjQ0LjY0Ni40NCAxLjA2djEyYzAgLjQxNC0uMTY4Ljc5LS40NCAxLjA2YTEuNDkgMS40OSAwIDAgMS0xLjA2LjQ0aC00LjV2LTE1em0tMjMuNSAwdjE1SDhhMS40OSAxLjQ5IDAgMCAxLTEuMDYtLjQ0QTEuNDk1IDEuNDk1IDAgMCAxIDYuNSAyMlYxMGMwLS40MTQuMTY4LS43OS40NC0xLjA2QTEuNDkgMS40OSAwIDAgMSA4IDguNWg0LjV6IiBzdHJva2U9IiM5NTk1OTUiIGZpbGw9IiNFMkUyRTIiIGZpbGwtcnVsZT0ibm9uemVybyIvPjx1c2Ugc3Ryb2tlPSIjQjFCMUIxIiBtYXNrPSJ1cmwoI2IpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGMkYyRjIiIHN0cm9rZS1kYXNoYXJyYXk9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjwvc3ZnPg==',
        yg =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0NCAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0xNSA4aDE0djE2SDE1eiIvPjxtYXNrIGlkPSJiIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHN0cm9rZT0iIzRGODBGRiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSIuNSIgeT0iLjUiIHdpZHRoPSI0MyIgaGVpZ2h0PSIzMSIgcng9IjQiLz48cGF0aCBkPSJNMzYgOC41Yy40MTQgMCAuNzkuMTY4IDEuMDYuNDQuMjcyLjI3LjQ0LjY0Ni40NCAxLjA2djEyYzAgLjQxNC0uMTY4Ljc5LS40NCAxLjA2YTEuNDkgMS40OSAwIDAgMS0xLjA2LjQ0aC00LjV2LTE1em0tMjMuNSAwdjE1SDhhMS40OSAxLjQ5IDAgMCAxLTEuMDYtLjQ0QTEuNDk1IDEuNDk1IDAgMCAxIDYuNSAyMlYxMGMwLS40MTQuMTY4LS43OS40NC0xLjA2QTEuNDkgMS40OSAwIDAgMSA4IDguNWg0LjV6IiBzdHJva2U9IiM0RjgwRkYiIGZpbGw9IiNGRUM3MDAiIGZpbGwtcnVsZT0ibm9uemVybyIvPjx1c2Ugc3Ryb2tlPSIjODI4MjgyIiBtYXNrPSJ1cmwoI2IpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGMkYyRjIiIHN0cm9rZS1kYXNoYXJyYXk9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjwvc3ZnPg==',
        _g = K.div`
    position: relative;
    height: 58px;
    padding: ${ki}px;
    border-style: solid;
    border-width: 1px 0;
    border-color: ${(n) => n.theme.Gray1};
    background-color: ${(n) => n.theme.Blue7};
    box-sizing: border-box;
`,
        Tg = K.div`
    display: inline-block;
    overflow: hidden;
    border: 1px solid ${(n) => n.theme.Blue5};
    border-radius: ${dn}px;
    background-color: ${(n) => n.theme.White1};
    vertical-align: top;
    box-sizing: border-box;
`,
        gc = K.button`
    display: inline-block;
    height: ${Ge}px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 600;
    color: ${(n) => n.theme.Blue5};
    line-height: ${mc}px;
    vertical-align: top;
    cursor: pointer;
    & ~ & {
        border-left: 1px solid ${(n) => n.theme.Blue5};
    }
    &:before {
        display: inline-block;
        margin-right: 4px;
        background-repeat: no-repeat;
        vertical-align: top;
        content: '';
    }
    &.btn_trim:before {
        width: 15px;
        height: 15px;
        margin-top: 8px;
        background-image: url(${og});
    }
    &.btn_adjust:before {
        width: 16px;
        height: 12px;
        margin-top: 9px;
        background-image: url(${ag});
    }
    &.active {
        color: ${(n) => n.theme.White1};
        background-color: ${(n) => n.theme.Blue5};
        &.btn_trim:before {
            background-image: url(${cg});
        }
        &.btn_adjust:before {
            background-image: url(${ug});
        }
    }
`,
        Ng = K.div`
    position: absolute;
    top: ${ki}px;
    right: ${ki}px;
`,
        vs = K.button`
    display: inline-block;
    height: ${Ge}px;
    padding: 0 14px;
    border-radius: ${dn}px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid ${(n) => n.theme.Gray29};
    background-color: ${(n) => n.theme.White1};
    color: ${(n) => n.theme.Gray4};
    line-height: ${mc}px;
    vertical-align: top;
    cursor: pointer;
    & ~ & {
        margin-left: 6px;
    }
    &.disabled {
        background-color: ${(n) => n.theme.Gray3};
        color: ${(n) => n.theme.Gray12};
        cursor: default;
    }
    &.active,
    &.btn_play,
    &.btn_pause,
    &.btn_stop {
        border-color: ${(n) => n.theme.Blue5};
        color: ${(n) => n.theme.Blue5};
    }
    &.btn_play,
    &.btn_pause,
    &.btn_stop {
        width: 80px;
        line-height: ${Ge}px;
        &:before {
            display: inline-block;
            background-repeat: no-repeat;
            content: '';
        }
    }
    &.btn_play:before {
        width: 10px;
        height: 11px;
        background-image: url(${lg});
    }
    &.btn_pause:before {
        width: 12px;
        height: 12px;
        background-image: url(${hg});
    }
    &.btn_stop:before {
        width: 12px;
        height: 12px;
        background-image: url(${dg});
    }
    &.btn_small {
        width: 37px;
        padding: 0;
    }
`;
    K.div`
    height: 170px;
    padding: 27px 13px;
    background-color: ${(n) => n.theme.White1};
`;
    const Vr = K.div`
    padding: 14px ${ki}px;
    border-top: 1px solid ${(n) => n.theme.Gray29};
    background-color: ${(n) => n.theme.Gray3};
    & ~ & {
        border-bottom: 1px solid ${(n) => n.theme.Gray29};
    }
`,
        Wr = K.div`
    display: inline-block;
    vertical-align: top;
    input {
        width: 60px;
        height: ${Ge}px;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid ${(n) => n.theme.Gray29};
        background-color: ${(n) => n.theme.Gray3};
        color: ${(n) => n.theme.DefaultText};
        text-align: center;
        box-sizing: border-box;
        &:disabled {
            background-color: ${(n) => n.theme.Gray11};
            color: ${(n) => n.theme.Gray4};
        }
    }
    .current_time {
        width: 80px;
        margin-left: 9px;
        border-radius: ${dn}px;
    }
`,
        Mc = K.div`
    overflow: hidden;
    font-weight: 600;
    .tool_option_title {
        display: block;
        margin: ${Ur}px 0 8px;
        font-size: 12px;
        color: ${(n) => n.theme.Gray4};
    }
`,
        yc = K.div`
    float: left;
    margin-right: 2px;
    padding: ${Ur}px 16px ${Ur}px 4px;
    border-right: 1px solid ${(n) => n.theme.Gray6};
    font-size: 14px;
    letter-spacing: -0.33px;
    text-align: center;
    box-sizing: border-box;
    &:before {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 auto 9px;
        background-repeat: no-repeat;
        content: '';
    }
    &.tool_trim:before {
        background-image: url(${fg});
    }
    &.tool_adjust:before {
        background-image: url(${pg});
    }
`,
        Vn = K.div`
    float: left;
    margin-left: 14px;
`,
        zi = K.div`
    display: inline-block;
    position: relative;
    height: ${Ge}px;
    vertical-align: top;
    &:before {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 2px;
        margin: -1px 0 0 -5px;
        border-radius: 1.5px;
        background-color: ${(n) => n.theme.Gray5};
        content: '';
        cursor: pointer;
    }
    .btn_option {
        width: ${Ge}px;
        height: ${Ge}px;
        border: 1px solid ${(n) => n.theme.Gray29};
        background-color: ${(n) => n.theme.Gray11};
        cursor: pointer;
    }
    &:first-of-type {
        .btn_option {
            margin-right: -1px;
            border-radius: ${dn}px 0 0 ${dn}px;
        }
    }
    &:last-of-type {
        &:after {
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 10px;
            margin: -5px 0 0 -1px;
            background-color: ${(n) => n.theme.Gray5};
            content: '';
            cursor: pointer;
        }
        .btn_option {
            margin-left: -1px;
            border-radius: 0 ${dn}px ${dn}px 0;
        }
    }
`,
        Ig = K.div`
    display: inline-block;
    vertical-align: top;
`,
        _c = K.button`
    display: inline-block;
    width: 44px;
    height: ${Ge}px;
    background-repeat: no-repeat;
    &.btn_remain {
        background-image: url(${mg});
        &.active {
            background-image: url(${gg});
        }
    }
    &.btn_cut {
        margin-left: 6px;
        background-image: url(${Mg});
        &.active {
            background-image: url(${yg});
        }
    }
`,
        Fr = K.div`
    position: relative;
    width: 113px;
    height: 6px;
    margin-top: 11px;
    &:before {
        display: block;
        position: absolute;
        top: -5px;
        left: ${(n) => (n == null ? void 0 : n.left) || '50%'};
        width: 1px;
        height: 16px;
        background-color: ${(n) => n.theme.Gray1};
        transform: translateX(50%);
        content: '';
    }
    &:after {
        display: block;
        clear: both;
        content: '';
    }
`,
        Gr = K.div`
    overflow: hidden;
    position: relative;
    width: inherit;
    height: inherit;
    border-radius: 5px;
    background-color: ${(n) => n.theme.Gray1};
`,
        Br = K.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: ${(n) => n.theme.sound_blue1};
`,
        Qr = K.div`
    position: absolute;
    top: -7px;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    border-radius: 50%;
    border: 1px solid ${(n) => n.theme.Blue5};
    background-color: ${(n) => n.theme.White1};
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    cursor: pointer;
`,
        Zr = K.strong`
    float: right;
    margin-top: 11px;
    font-size: 10px;
    color: ${(n) => n.theme.Gray4};
    letter-spacing: -0.4px;
`,
        Sg = K.div`
    position: absolute;
    width;
    height;
    left: 20px;
    top: -2px;
    pointerEvents: none;
    zIndex: 20;
`,
        jg = K.div`
    background: #fa5536;
    marginleft: -1.5px;
    width: 3px;
    borderradius: 1.5px;
    height: 100%;
`,
        Ag = (n) => {
            const { width: t, height: e } = n,
                s = F(xt),
                i = F(Nt),
                r = F(iu),
                a = F(Bt),
                o = U.useRef(null),
                c = F(Mn),
                u = F(yn),
                [l, h] = U.useState('prev'),
                f = (m) => {
                    m &&
                        requestAnimationFrame(() => {
                            m.style.transition = 'transform 0.05s linear 0s';
                        });
                },
                p = (m) => {
                    m && (m.style.transition = 'none');
                },
                d = U.useMemo(() => {
                    if (s !== 'trimmer') return r;
                    if (i === 'invent') {
                        if (c > r || u - 19 > t) return h('prev'), r;
                        {
                            const m = Math.min(Math.floor(r - c + u - 19), t);
                            return l === 'prev' ? p(o.current) : f(o.current), h('next'), m;
                        }
                    } else if (i === 'default')
                        return Math.min(Math.floor(Math.min(r + c, u - 20)), t);
                    return 0;
                }, [s, u, l, r, c, i, t]);
            return (
                U.useEffect(() => {
                    const m = o.current;
                    !m || a === 'stopped' || (m.style.transform = `translate3d(${d}px, 0, 0)`);
                }, [d, a]),
                U.useEffect(() => {
                    const m = o.current;
                    m &&
                        (a === 'stopped'
                            ? (m.style.display = 'none')
                            : a === 'playing'
                            ? ((m.style.display = 'block'), f(m))
                            : ((m.style.display = 'block'), p(m)));
                }, [a]),
                L.jsx(Sg, {
                    style: {
                        position: 'absolute',
                        width: t,
                        height: e,
                        left: 20,
                        top: -2,
                        pointerEvents: 'none',
                        zIndex: 20,
                    },
                    children: L.jsx(jg, {
                        ref: o,
                        style: {
                            background: '#fa5536',
                            marginLeft: -1.5,
                            width: 3,
                            borderRadius: 1.5,
                            height: '100%',
                        },
                    }),
                })
            );
        },
        Wn = () => {
            const n = F(Ne),
                t = F(Zt),
                { current: e } = t,
                s = U.useCallback(() => {
                    n.undo();
                }, [n]),
                i = U.useCallback(() => {
                    n.redo();
                }, [n]),
                r = U.useCallback(() => {
                    n.restoreDefaults();
                }, [n]),
                a = U.useCallback(
                    (c) => {
                        n.saveSnapshot(c);
                    },
                    [n]
                ),
                o = U.useCallback(() => {
                    n.saveAllSnapshot();
                }, [n]);
            return {
                undo: s,
                redo: i,
                saveSnapshot: a,
                saveAllSnapshot: o,
                restoreDefaults: r,
                historyIndex: e,
            };
        },
        xg = () => {
            const { saveSnapshot: n } = Wn(),
                t = F(Ps),
                e = F(To),
                [s, i] = Dt(uu),
                r = Es(Mn),
                a = Es(yn),
                o = F(au),
                c = F(cu),
                u = F(Ot),
                l = F(bt),
                h = F(Bt);
            U.useEffect(() => {
                if (!e || !t || h !== 'stopped') return;
                const f = (p) => {
                    const d = p.offsetX,
                        m = p.offsetY;
                    mo(d, m, o)
                        ? (i({ target: 'start', x: p.clientX, y: p.clientY, time: u }),
                          (t.style.cursor = 'pointer'))
                        : mo(d, m, c) &&
                          (i({ target: 'end', x: p.clientX, y: p.clientY, time: l }),
                          (t.style.cursor = 'pointer'));
                };
                return (
                    t.addEventListener('mousedown', f),
                    () => {
                        t.removeEventListener('mousedown', f);
                    }
                );
            }, [t, e, c, l, h, i, o, u]),
                U.useEffect(() => {
                    if (!e || !t) return;
                    const f = (d) => {
                            if (s.target === '') return;
                            const m = d.clientX,
                                g = d.clientY;
                            s.target === 'start'
                                ? r({ x: m - s.x, y: g - s.y, time: s.time })
                                : s.target === 'end' && a({ x: m - s.x, y: g - s.y, time: s.time });
                        },
                        p = () => {
                            s.target !== '' &&
                                (n(['startHandler', 'endHandler']),
                                i({ target: '', x: 0, y: 0, time: 0 }));
                        };
                    return (
                        document.addEventListener('mousemove', f),
                        document.addEventListener('mouseup', p),
                        () => {
                            document.removeEventListener('mousemove', f),
                                document.removeEventListener('mouseup', p);
                        }
                    );
                }, [t, e, s, n, a, i, r]);
        },
        vg = (n) => {
            xg();
            const { width: t, height: e } = n,
                s = F(xt),
                i = F(Nt),
                [r, a] = Dt(Ps),
                [o, c] = Dt(To),
                u = F(Mn),
                l = F(yn),
                h = U.useCallback(
                    (p, d) => {
                        !o || !r || rm(r, o, i, { start: p, end: d });
                    },
                    [r, o, i]
                );
            U.useEffect(() => {
                !o || !r || h(u, l);
            }, [r, o, h, l, u]);
            const f = (p) => {
                if (!p) return;
                const d = p.getContext('2d');
                d && (a(p), c(d));
            };
            return s === 'adjuster'
                ? null
                : L.jsx(L.Fragment, {
                      children: L.jsx('canvas', {
                          style: { position: 'absolute', width: t, height: e, zIndex: 10 },
                          ref: f,
                          width: t * 2,
                          height: e * 2,
                      }),
                  });
        },
        Lg = (n) => {
            const { width: t, height: e } = n,
                s = F(zs),
                i = F(xt),
                r = F(Nt),
                [a, o] = Dt(Oe),
                [c, u] = Dt(lu),
                l = F(Mn),
                h = F(yn);
            U.useEffect(() => {
                !c || !a || em(a, c, s, i, r, { start: l, end: h });
            }, [a, c, s, l, h, r, i]);
            const f = (p) => {
                if (!p) return;
                const d = p.getContext('2d');
                o(p), u(d);
            };
            return L.jsx('canvas', {
                style: { position: 'absolute', width: t, height: e, left: 20 },
                ref: f,
                width: t,
                height: e,
            });
        },
        wg = (n) => {
            const { width: t, height: e } = n,
                s = F(zs);
            return !s || !(s != null && s.length)
                ? L.jsx(Tc, {
                      children: L.jsx('div', {
                          style: {
                              width: t + 40,
                              height: e,
                              position: 'relative',
                              borderRadius: 10,
                              backgroundColor: '#f9f9f9',
                          },
                      }),
                  })
                : L.jsx(Tc, {
                      children: L.jsxs('div', {
                          style: { width: t, height: e, position: 'relative' },
                          children: [
                              L.jsx(vg, { width: t + 40, height: e }),
                              L.jsx(Lg, { width: t, height: e }),
                              L.jsx(Ag, { width: t + 2, height: e + 4 }),
                              L.jsx(am, { width: t + 40, height: e }),
                          ],
                      }),
                  });
        },
        Tc = K.div`
    display: flex;
    justify-content: center;
    height: 224px;
    padding: 27px 13px;
    background-color: ${(n) => n.theme.White1};
`;
    var Nc = { exports: {} };
    /*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/ (function(
        n
    ) {
        (function() {
            var t = {}.hasOwnProperty;
            function e() {
                for (var s = [], i = 0; i < arguments.length; i++) {
                    var r = arguments[i];
                    if (r) {
                        var a = typeof r;
                        if (a === 'string' || a === 'number') s.push(r);
                        else if (Array.isArray(r)) {
                            if (r.length) {
                                var o = e.apply(null, r);
                                o && s.push(o);
                            }
                        } else if (a === 'object') {
                            if (
                                r.toString !== Object.prototype.toString &&
                                !r.toString.toString().includes('[native code]')
                            ) {
                                s.push(r.toString());
                                continue;
                            }
                            for (var c in r) t.call(r, c) && r[c] && s.push(c);
                        }
                    }
                }
                return s.join(' ');
            }
            n.exports ? ((e.default = e), (n.exports = e)) : (window.classNames = e);
        })();
    })(Nc);
    var Dg = Nc.exports;
    const Be = eo(Dg);
    var bg = Array.isArray,
        Hr = bg,
        Cg = typeof Ds == 'object' && Ds && Ds.Object === Object && Ds,
        Eg = Cg,
        Og = Eg,
        kg = typeof self == 'object' && self && self.Object === Object && self,
        zg = Og || kg || Function('return this')(),
        $r = zg,
        Pg = $r,
        Rg = Pg.Symbol,
        qr = Rg,
        Ic = qr,
        Sc = Object.prototype,
        Yg = Sc.hasOwnProperty,
        Ug = Sc.toString,
        Ls = Ic ? Ic.toStringTag : void 0;
    function Vg(n) {
        var t = Yg.call(n, Ls),
            e = n[Ls];
        try {
            n[Ls] = void 0;
            var s = !0;
        } catch {}
        var i = Ug.call(n);
        return s && (t ? (n[Ls] = e) : delete n[Ls]), i;
    }
    var Wg = Vg,
        Fg = Object.prototype,
        Gg = Fg.toString;
    function Bg(n) {
        return Gg.call(n);
    }
    var Qg = Bg,
        jc = qr,
        Zg = Wg,
        Hg = Qg,
        $g = '[object Null]',
        qg = '[object Undefined]',
        Ac = jc ? jc.toStringTag : void 0;
    function Xg(n) {
        return n == null ? (n === void 0 ? qg : $g) : Ac && Ac in Object(n) ? Zg(n) : Hg(n);
    }
    var xc = Xg;
    function Jg(n) {
        return n != null && typeof n == 'object';
    }
    var Kg = Jg,
        tM = xc,
        eM = Kg,
        nM = '[object Symbol]';
    function sM(n) {
        return typeof n == 'symbol' || (eM(n) && tM(n) == nM);
    }
    var Xr = sM,
        iM = Hr,
        rM = Xr,
        oM = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        aM = /^\w*$/;
    function cM(n, t) {
        if (iM(n)) return !1;
        var e = typeof n;
        return e == 'number' || e == 'symbol' || e == 'boolean' || n == null || rM(n)
            ? !0
            : aM.test(n) || !oM.test(n) || (t != null && n in Object(t));
    }
    var uM = cM;
    function lM(n) {
        var t = typeof n;
        return n != null && (t == 'object' || t == 'function');
    }
    var vc = lM,
        hM = xc,
        dM = vc,
        fM = '[object AsyncFunction]',
        pM = '[object Function]',
        mM = '[object GeneratorFunction]',
        gM = '[object Proxy]';
    function MM(n) {
        if (!dM(n)) return !1;
        var t = hM(n);
        return t == pM || t == mM || t == fM || t == gM;
    }
    var yM = MM,
        _M = $r,
        TM = _M['__core-js_shared__'],
        NM = TM,
        Jr = NM,
        Lc = (function() {
            var n = /[^.]+$/.exec((Jr && Jr.keys && Jr.keys.IE_PROTO) || '');
            return n ? 'Symbol(src)_1.' + n : '';
        })();
    function IM(n) {
        return !!Lc && Lc in n;
    }
    var SM = IM,
        jM = Function.prototype,
        AM = jM.toString;
    function xM(n) {
        if (n != null) {
            try {
                return AM.call(n);
            } catch {}
            try {
                return n + '';
            } catch {}
        }
        return '';
    }
    var vM = xM,
        LM = yM,
        wM = SM,
        DM = vc,
        bM = vM,
        CM = /[\\^$.*+?()[\]{}|]/g,
        EM = /^\[object .+?Constructor\]$/,
        OM = Function.prototype,
        kM = Object.prototype,
        zM = OM.toString,
        PM = kM.hasOwnProperty,
        RM = RegExp(
            '^' +
                zM
                    .call(PM)
                    .replace(CM, '\\$&')
                    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
                '$'
        );
    function YM(n) {
        if (!DM(n) || wM(n)) return !1;
        var t = LM(n) ? RM : EM;
        return t.test(bM(n));
    }
    var UM = YM;
    function VM(n, t) {
        return n == null ? void 0 : n[t];
    }
    var WM = VM,
        FM = UM,
        GM = WM;
    function BM(n, t) {
        var e = GM(n, t);
        return FM(e) ? e : void 0;
    }
    var wc = BM,
        QM = wc,
        ZM = QM(Object, 'create'),
        Pi = ZM,
        Dc = Pi;
    function HM() {
        (this.__data__ = Dc ? Dc(null) : {}), (this.size = 0);
    }
    var $M = HM;
    function qM(n) {
        var t = this.has(n) && delete this.__data__[n];
        return (this.size -= t ? 1 : 0), t;
    }
    var XM = qM,
        JM = Pi,
        KM = '__lodash_hash_undefined__',
        ty = Object.prototype,
        ey = ty.hasOwnProperty;
    function ny(n) {
        var t = this.__data__;
        if (JM) {
            var e = t[n];
            return e === KM ? void 0 : e;
        }
        return ey.call(t, n) ? t[n] : void 0;
    }
    var sy = ny,
        iy = Pi,
        ry = Object.prototype,
        oy = ry.hasOwnProperty;
    function ay(n) {
        var t = this.__data__;
        return iy ? t[n] !== void 0 : oy.call(t, n);
    }
    var cy = ay,
        uy = Pi,
        ly = '__lodash_hash_undefined__';
    function hy(n, t) {
        var e = this.__data__;
        return (this.size += this.has(n) ? 0 : 1), (e[n] = uy && t === void 0 ? ly : t), this;
    }
    var dy = hy,
        fy = $M,
        py = XM,
        my = sy,
        gy = cy,
        My = dy;
    function Fn(n) {
        var t = -1,
            e = n == null ? 0 : n.length;
        for (this.clear(); ++t < e; ) {
            var s = n[t];
            this.set(s[0], s[1]);
        }
    }
    (Fn.prototype.clear = fy),
        (Fn.prototype.delete = py),
        (Fn.prototype.get = my),
        (Fn.prototype.has = gy),
        (Fn.prototype.set = My);
    var yy = Fn;
    function _y() {
        (this.__data__ = []), (this.size = 0);
    }
    var Ty = _y;
    function Ny(n, t) {
        return n === t || (n !== n && t !== t);
    }
    var Iy = Ny,
        Sy = Iy;
    function jy(n, t) {
        for (var e = n.length; e--; ) if (Sy(n[e][0], t)) return e;
        return -1;
    }
    var Ri = jy,
        Ay = Ri,
        xy = Array.prototype,
        vy = xy.splice;
    function Ly(n) {
        var t = this.__data__,
            e = Ay(t, n);
        if (e < 0) return !1;
        var s = t.length - 1;
        return e == s ? t.pop() : vy.call(t, e, 1), --this.size, !0;
    }
    var wy = Ly,
        Dy = Ri;
    function by(n) {
        var t = this.__data__,
            e = Dy(t, n);
        return e < 0 ? void 0 : t[e][1];
    }
    var Cy = by,
        Ey = Ri;
    function Oy(n) {
        return Ey(this.__data__, n) > -1;
    }
    var ky = Oy,
        zy = Ri;
    function Py(n, t) {
        var e = this.__data__,
            s = zy(e, n);
        return s < 0 ? (++this.size, e.push([n, t])) : (e[s][1] = t), this;
    }
    var Ry = Py,
        Yy = Ty,
        Uy = wy,
        Vy = Cy,
        Wy = ky,
        Fy = Ry;
    function Gn(n) {
        var t = -1,
            e = n == null ? 0 : n.length;
        for (this.clear(); ++t < e; ) {
            var s = n[t];
            this.set(s[0], s[1]);
        }
    }
    (Gn.prototype.clear = Yy),
        (Gn.prototype.delete = Uy),
        (Gn.prototype.get = Vy),
        (Gn.prototype.has = Wy),
        (Gn.prototype.set = Fy);
    var Gy = Gn,
        By = wc,
        Qy = $r,
        Zy = By(Qy, 'Map'),
        Hy = Zy,
        bc = yy,
        $y = Gy,
        qy = Hy;
    function Xy() {
        (this.size = 0),
            (this.__data__ = { hash: new bc(), map: new (qy || $y)(), string: new bc() });
    }
    var Jy = Xy;
    function Ky(n) {
        var t = typeof n;
        return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
            ? n !== '__proto__'
            : n === null;
    }
    var t0 = Ky,
        e0 = t0;
    function n0(n, t) {
        var e = n.__data__;
        return e0(t) ? e[typeof t == 'string' ? 'string' : 'hash'] : e.map;
    }
    var Yi = n0,
        s0 = Yi;
    function i0(n) {
        var t = s0(this, n).delete(n);
        return (this.size -= t ? 1 : 0), t;
    }
    var r0 = i0,
        o0 = Yi;
    function a0(n) {
        return o0(this, n).get(n);
    }
    var c0 = a0,
        u0 = Yi;
    function l0(n) {
        return u0(this, n).has(n);
    }
    var h0 = l0,
        d0 = Yi;
    function f0(n, t) {
        var e = d0(this, n),
            s = e.size;
        return e.set(n, t), (this.size += e.size == s ? 0 : 1), this;
    }
    var p0 = f0,
        m0 = Jy,
        g0 = r0,
        M0 = c0,
        y0 = h0,
        _0 = p0;
    function Bn(n) {
        var t = -1,
            e = n == null ? 0 : n.length;
        for (this.clear(); ++t < e; ) {
            var s = n[t];
            this.set(s[0], s[1]);
        }
    }
    (Bn.prototype.clear = m0),
        (Bn.prototype.delete = g0),
        (Bn.prototype.get = M0),
        (Bn.prototype.has = y0),
        (Bn.prototype.set = _0);
    var T0 = Bn,
        Cc = T0,
        N0 = 'Expected a function';
    function Kr(n, t) {
        if (typeof n != 'function' || (t != null && typeof t != 'function'))
            throw new TypeError(N0);
        var e = function() {
            var s = arguments,
                i = t ? t.apply(this, s) : s[0],
                r = e.cache;
            if (r.has(i)) return r.get(i);
            var a = n.apply(this, s);
            return (e.cache = r.set(i, a) || r), a;
        };
        return (e.cache = new (Kr.Cache || Cc)()), e;
    }
    Kr.Cache = Cc;
    var I0 = Kr,
        S0 = I0,
        j0 = 500;
    function A0(n) {
        var t = S0(n, function(s) {
                return e.size === j0 && e.clear(), s;
            }),
            e = t.cache;
        return t;
    }
    var x0 = A0,
        v0 = x0,
        L0 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        w0 = /\\(\\)?/g,
        D0 = v0(function(n) {
            var t = [];
            return (
                n.charCodeAt(0) === 46 && t.push(''),
                n.replace(L0, function(e, s, i, r) {
                    t.push(i ? r.replace(w0, '$1') : s || e);
                }),
                t
            );
        }),
        b0 = D0;
    function C0(n, t) {
        for (var e = -1, s = n == null ? 0 : n.length, i = Array(s); ++e < s; )
            i[e] = t(n[e], e, n);
        return i;
    }
    var E0 = C0,
        Ec = qr,
        O0 = E0,
        k0 = Hr,
        z0 = Xr,
        P0 = 1 / 0,
        Oc = Ec ? Ec.prototype : void 0,
        kc = Oc ? Oc.toString : void 0;
    function zc(n) {
        if (typeof n == 'string') return n;
        if (k0(n)) return O0(n, zc) + '';
        if (z0(n)) return kc ? kc.call(n) : '';
        var t = n + '';
        return t == '0' && 1 / n == -P0 ? '-0' : t;
    }
    var R0 = zc,
        Y0 = R0;
    function U0(n) {
        return n == null ? '' : Y0(n);
    }
    var V0 = U0,
        W0 = Hr,
        F0 = uM,
        G0 = b0,
        B0 = V0;
    function Q0(n, t) {
        return W0(n) ? n : F0(n, t) ? [n] : G0(B0(n));
    }
    var Z0 = Q0,
        H0 = Xr,
        $0 = 1 / 0;
    function q0(n) {
        if (typeof n == 'string' || H0(n)) return n;
        var t = n + '';
        return t == '0' && 1 / n == -$0 ? '-0' : t;
    }
    var X0 = q0,
        J0 = Z0,
        K0 = X0;
    function t_(n, t) {
        t = J0(t, n);
        for (var e = 0, s = t.length; n != null && e < s; ) n = n[K0(t[e++])];
        return e && e == s ? n : void 0;
    }
    var e_ = t_,
        n_ = e_;
    function s_(n, t, e) {
        var s = n == null ? void 0 : n_(n, t);
        return s === void 0 ? e : s;
    }
    var i_ = s_;
    const r_ = eo(i_),
        o_ = {},
        wt = (n = '') => {
            const t = window.Lang || o_ || {},
                [e, s] = n.split('.'),
                i = r_(t, `${e}.${s}`, n);
            return typeof i == 'string' ? i : n;
        },
        a_ = () => {
            const n = F(Te),
                [t, e] = Dt(xt),
                s = Es(Bi),
                i = F(ks),
                { restoreDefaults: r, historyIndex: a } = Wn(),
                o = t === 'trimmer',
                c = t === 'adjuster',
                u = async () => {
                    !i || t === 'trimmer' || e('trimmer');
                },
                l = async () => {
                    !i || t === 'adjuster' || e('adjuster');
                },
                h = async () => {
                    if (!i) return;
                    const f = await n.exportAudioBuffer();
                    s(f);
                };
            return L.jsxs(_g, {
                children: [
                    L.jsxs(Tg, {
                        children: [
                            L.jsxs(gc, {
                                type: 'button',
                                onClick: u,
                                className: Be('btn_trim', { active: t === 'trimmer' }),
                                children: [
                                    wt('Buttons.sound_menu_trim'),
                                    o && L.jsx('span', { className: 'blind', children: '선택됨' }),
                                ],
                            }),
                            L.jsxs(gc, {
                                type: 'button',
                                onClick: l,
                                className: Be('btn_adjust', { active: t === 'adjuster' }),
                                children: [
                                    wt('Buttons.sound_menu_adjust'),
                                    c && L.jsx('span', { className: 'blind', children: '선택됨' }),
                                ],
                            }),
                        ],
                    }),
                    L.jsxs(Ng, {
                        children: [
                            L.jsx(vs, {
                                type: 'button',
                                className: Be({ disabled: a < 1 }),
                                onClick: r,
                                children: wt('Buttons.sound_button_reset'),
                            }),
                            L.jsx(vs, {
                                type: 'button',
                                className: 'active',
                                onClick: h,
                                children: wt('Buttons.sound_button_save'),
                            }),
                        ],
                    }),
                ],
            });
        },
        c_ = {
            Gray1: '#e2e2e2',
            Gray2: '#3b3b4b',
            Gray3: '#f9f9f9',
            Gray4: '#555',
            Gray5: '#979797',
            Gray6: '#d8d8d8',
            Gray7: '#f4f4f4',
            Gray8: '#dcdcdc',
            Gray9: '#fcfcfc',
            Gray10: '#3b3b3b',
            Gray11: '#f2f2f2',
            Gray12: '#cbcbcb',
            Gray13: '#888',
            Gray14: '#efefef',
            Gray15: '#ececec',
            Gray16: '#e9e9e9',
            Gray17: '#949494',
            Gray18: '#fafafa',
            Gray19: '#e5e5e5',
            Gray20: '#cfcfcf',
            Gray21: '#a4a4a4',
            Gray22: '#f5f5f5',
            Gray23: '#f0f0f0',
            Gray24: '#f1f7f6',
            Gray25: '#d7d7d7',
            Gray26: '#a9aab7',
            Gray27: '#ceddda',
            Gray28: '#fbfbfb',
            Gray29: '#e2e2e2',
            Gray30: '#e5e6e6',
            Gray31: '#808080',
            Gray32: '#868686',
            Green1: '#1ec800',
            Green2: '#1eb400',
            Green3: '#16d8a3',
            Green4: '#08c490',
            Green5: '#1ad8a3',
            Green6: '#64d4a6',
            Green7: '#32d27d',
            Green8: '#e7fbf6',
            Green9: '#cfede5',
            Green10: '#10c392',
            Green11: '#edf8f5',
            Green12: '#d2e8e2',
            Green13: '#e6f6f2',
            Green14: '#106b23',
            Green15: '#737b22',
            Green16: '#00b400',
            Green17: '#bcede1',
            Green18: '#00cb94',
            Green19: '#dbf2ec',
            Red1: '#fa5536',
            Red2: '#ec2601',
            Red3: '#ff4320',
            Red4: '#e90a15',
            Red5: '#dc3617',
            Red6: '#ff3a61',
            Red7: '#fa5636',
            Blue1: '#f7fcff',
            Blue2: '#d6e9f4',
            Blue3: '#0090d0',
            Blue4: '#d8f0f5',
            Blue5: '#4f80ff',
            Blue6: '#0a85ff',
            Blue7: '#ecf8ff',
            Blue8: '#559dff',
            Blue9: '#89defd',
            Blue10: '#5b83ea',
            Blue11: '#7255ee',
            Blue12: '#19baea',
            Orange1: '#ffb100',
            Orange2: '#eea059',
            Orange3: '#ffb500',
            Orange4: '#ffbc00',
            Yellow1: '#ffc600',
            Purple1: '#ad3efb',
            DefaultText: '#2c313d',
            StudyColor: '#b656d0',
            ShareColor: '#32d27d',
            CommuColor: '#ffb500',
            IntroduceColor: '#5b49ff',
            LayerListColor: '#ecf8ff',
            SignUpHeader: '#ecf8ff',
            ColorRed: '#f00',
            ColorLike: '#ff4c4c',
            Black1: '#000',
            White1: '#fff',
            Card1: '#eaf8f5',
            Card2: '#eaf4f6',
            Card3: '#d8f0f5',
            Border1: '#d4ece7',
            dark_blue: '#6e97ff',
            light_blue: '#9ab6ff',
            dark_green: '#3bce3b',
            light_green: '#6ce06c',
            workspace_main: '#4f80ff',
            workspace_point: '#6e97ff',
            workspace_course: '#00b400',
            workspace_practical: '#8274ff',
            sound_blue1: '#5785fe',
        },
        u_ = () => {
            const [n, t] = Dt($e),
                e = F(eu),
                s = F(Bt),
                i = U.useRef(),
                r = U.useRef(),
                { saveSnapshot: a } = Wn(),
                o = Math.min(e, 50),
                c = U.useMemo(() => (e > 50 ? e - 50 : 50 - o), [e, o]);
            return (
                U.useEffect(() => {
                    if (!i.current || !r.current) return;
                    const u = i.current,
                        l = r.current;
                    let h = 0,
                        f = 0;
                    const p = (g) => {
                            g.preventDefault();
                            const y = Fi(g.clientX, h, h + f, -12, 12);
                            t(y);
                        },
                        d = () => {
                            document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d),
                                a(['audioVolume']);
                        },
                        m = () => {
                            if (s !== 'stopped') return;
                            const g = l.getBoundingClientRect();
                            (h = g.x),
                                (f = g.width),
                                document.addEventListener('mousemove', p),
                                document.addEventListener('mouseup', d);
                        };
                    return (
                        u.addEventListener('mousedown', m),
                        () => {
                            u.removeEventListener('mousedown', m),
                                document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d);
                        }
                    );
                }, [s, a, t]),
                L.jsxs(Vn, {
                    children: [
                        L.jsx('span', {
                            className: 'tool_option_title',
                            children: wt('Workspace.sound_volume'),
                        }),
                        L.jsxs(Fr, {
                            ref: r,
                            children: [
                                L.jsx(Gr, {
                                    children: L.jsx(Br, {
                                        style: { left: `${o}%`, width: `${c}%` },
                                    }),
                                }),
                                L.jsx(Qr, {
                                    ref: i,
                                    role: 'slider',
                                    'aria-valuemin': -60,
                                    'aria-valuemax': 12,
                                    'aria-valuenow': n,
                                    'aria-orientation': 'horizontal',
                                    tabIndex: 0,
                                    style: { left: `${e}%` },
                                    children: L.jsx('span', {
                                        className: 'blind',
                                        children: '자유 조절 슬라이드',
                                    }),
                                }),
                                L.jsxs(Zr, {
                                    children: [
                                        L.jsx('span', { className: 'blind', children: '변화량' }),
                                        n,
                                        'db',
                                    ],
                                }),
                            ],
                        }),
                    ],
                })
            );
        },
        l_ = () => {
            const n = F(Bt),
                [t, e] = Dt(be),
                s = F(tu),
                i = U.useRef(),
                r = U.useRef(),
                { saveSnapshot: a } = Wn(),
                o = Math.min(s, 33.3),
                c = U.useMemo(() => (s > 33.3 ? s - 33.3 : 33.3 - o), [s, o]);
            return (
                U.useEffect(() => {
                    if (!i.current || !r.current) return;
                    const u = i.current,
                        l = r.current;
                    let h = 0,
                        f = 0;
                    const p = (g) => {
                            g.preventDefault();
                            const y = Fi(g.clientX, h, h + f, 0.5, 2, 1);
                            e(y);
                        },
                        d = () => {
                            document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d),
                                a(['audioSpeed']);
                        },
                        m = () => {
                            if (n !== 'stopped') return;
                            const g = l.getBoundingClientRect();
                            (h = g.x),
                                (f = g.width),
                                document.addEventListener('mousemove', p),
                                document.addEventListener('mouseup', d);
                        };
                    return (
                        u.addEventListener('mousedown', m),
                        () => {
                            u.removeEventListener('mousedown', m),
                                document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d);
                        }
                    );
                }, [n, a, e]),
                L.jsxs(Vn, {
                    children: [
                        L.jsx('span', {
                            className: 'tool_option_title',
                            children: wt('Workspace.sound_speed'),
                        }),
                        L.jsxs(Fr, {
                            ref: r,
                            left: '33.3%',
                            children: [
                                L.jsx(Gr, {
                                    children: L.jsx(Br, {
                                        style: { left: `${o}%`, width: `${c}%` },
                                    }),
                                }),
                                L.jsx(Qr, {
                                    ref: i,
                                    role: 'slider',
                                    'aria-valuemin': 0.5,
                                    'aria-valuemax': 2,
                                    'aria-valuenow': t,
                                    'aria-orientation': 'horizontal',
                                    tabIndex: 0,
                                    style: { left: `${s}%` },
                                    children: L.jsx('span', {
                                        className: 'blind',
                                        children: '자유 조절 슬라이드',
                                    }),
                                }),
                                L.jsxs(Zr, {
                                    children: [
                                        L.jsx('span', { className: 'blind', children: '변화량' }),
                                        t,
                                        'x',
                                    ],
                                }),
                            ],
                        }),
                    ],
                })
            );
        },
        h_ = () => {
            const n = F(Bt),
                [t, e] = Dt(He),
                s = F(Kc),
                i = U.useRef(),
                r = U.useRef(),
                { saveSnapshot: a } = Wn(),
                o = Math.min(s, 50),
                c = U.useMemo(() => (s > 50 ? s - 50 : 50 - o), [s, o]);
            return (
                U.useEffect(() => {
                    if (!i.current || !r.current) return;
                    const u = i.current,
                        l = r.current;
                    let h = 0,
                        f = 0;
                    const p = (g) => {
                            g.preventDefault();
                            const y = Fi(g.clientX, h, h + f, -100, 100);
                            e(y);
                        },
                        d = () => {
                            document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d),
                                a(['audioPitch']);
                        },
                        m = () => {
                            if (n !== 'stopped') return;
                            const g = l.getBoundingClientRect();
                            (h = g.x),
                                (f = g.width),
                                document.addEventListener('mousemove', p),
                                document.addEventListener('mouseup', d);
                        };
                    return (
                        u.addEventListener('mousedown', m),
                        () => {
                            u.removeEventListener('mousedown', m),
                                document.removeEventListener('mousemove', p),
                                document.removeEventListener('mouseup', d);
                        }
                    );
                }, [n, a, e]),
                L.jsxs(Vn, {
                    children: [
                        L.jsx('span', {
                            className: 'tool_option_title',
                            children: wt('Workspace.sound_pitch'),
                        }),
                        L.jsxs(Fr, {
                            ref: r,
                            children: [
                                L.jsx(Gr, {
                                    children: L.jsx(Br, {
                                        style: { left: `${o}%`, width: `${c}%` },
                                    }),
                                }),
                                L.jsx(Qr, {
                                    ref: i,
                                    role: 'slider',
                                    'aria-valuemin': -100,
                                    'aria-valuemax': 100,
                                    'aria-valuenow': t,
                                    'aria-orientation': 'horizontal',
                                    tabIndex: 0,
                                    style: { left: `${s}%` },
                                    children: L.jsx('span', {
                                        className: 'blind',
                                        children: '자유 조절 슬라이드',
                                    }),
                                }),
                                L.jsxs(Zr, {
                                    children: [
                                        L.jsx('span', { className: 'blind', children: '변화량' }),
                                        t,
                                        '%',
                                    ],
                                }),
                            ],
                        }),
                    ],
                })
            );
        },
        d_ = () =>
            L.jsx(Vr, {
                children: L.jsxs(Mc, {
                    children: [
                        L.jsx(yc, {
                            className: 'tool_adjust',
                            children: wt('Buttons.sound_menu_adjust'),
                        }),
                        L.jsx(u_, {}),
                        L.jsx(l_, {}),
                        L.jsx(h_, {}),
                    ],
                }),
            }),
        f_ = () => {
            const n = F(Te),
                [t, e] = Dt(Nt),
                [s, i] = Dt(ru),
                [r, a] = Dt(ou),
                o = t === 'default',
                c = U.useRef(),
                u = U.useRef(),
                { saveSnapshot: l } = Wn(),
                h = () => {
                    t !== 'invent' && (e('invent'), l(['trimmerType']));
                },
                f = () => {
                    t !== 'default' && (e('default'), l(['trimmerType']));
                },
                p = (v) => {
                    if ((v.preventDefault(), !n.canControlEdit || !c.current)) return;
                    const w = gn(c.current.value);
                    Number.isNaN(w) || (i((w * 10 - 1) / 10), l(['startHandler', 'endHandler']));
                },
                d = (v) => {
                    if ((v.preventDefault(), !n.canControlEdit || !c.current)) return;
                    const w = gn(c.current.value);
                    Number.isNaN(w) || (i((w * 10 + 1) / 10), l(['startHandler', 'endHandler']));
                },
                m = (v) => {
                    if (!n.canControlEdit) return;
                    const w = v.target.value;
                    i(w), l(['startHandler', 'endHandler']);
                },
                g = (v) => {
                    if ((v.preventDefault(), !n.canControlEdit || !u.current)) return;
                    const w = gn(u.current.value);
                    Number.isNaN(w) || (a((w * 10 - 1) / 10), l(['startHandler', 'endHandler']));
                },
                y = (v) => {
                    if ((v.preventDefault(), !n.canControlEdit || !u.current)) return;
                    const w = gn(u.current.value);
                    Number.isNaN(w) || (a((w * 10 + 1) / 10), l(['startHandler', 'endHandler']));
                },
                S = (v) => {
                    if (!n.canControlEdit) return;
                    const w = v.target.value;
                    a(w), l(['startHandler', 'endHandler']);
                };
            return L.jsx(Vr, {
                children: L.jsxs(Mc, {
                    children: [
                        L.jsx(yc, {
                            className: 'tool_trim',
                            children: wt('Buttons.sound_menu_trim'),
                        }),
                        L.jsxs(Vn, {
                            children: [
                                L.jsx('label', {
                                    htmlFor: 'startTime',
                                    className: 'tool_option_title',
                                    children: wt('Workspace.sound_start_point'),
                                }),
                                L.jsxs(zi, {
                                    onClick: p,
                                    children: [
                                        L.jsx('label', {
                                            htmlFor: 'startTimedDecrease',
                                            className: 'blind',
                                            children: '감소',
                                        }),
                                        L.jsx('input', {
                                            type: 'button',
                                            id: 'startTimedDecrease',
                                            className: 'btn_option decrease',
                                        }),
                                    ],
                                }),
                                L.jsx(Wr, {
                                    children: L.jsx('input', {
                                        ref: c,
                                        id: 'startTime',
                                        type: 'text',
                                        value: s,
                                        onChange: m,
                                    }),
                                }),
                                L.jsxs(zi, {
                                    onClick: d,
                                    children: [
                                        L.jsx('label', {
                                            htmlFor: 'startTimeIncrease',
                                            className: 'blind',
                                            children: '증가',
                                        }),
                                        L.jsx('input', {
                                            type: 'button',
                                            id: 'startTimeIncrease',
                                            className: 'btn_option increase',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        L.jsxs(Vn, {
                            children: [
                                L.jsx('label', {
                                    htmlFor: 'endTime',
                                    className: 'tool_option_title',
                                    children: wt('Workspace.sound_end_point'),
                                }),
                                L.jsxs(zi, {
                                    onClick: g,
                                    children: [
                                        L.jsx('label', {
                                            htmlFor: 'endTimeDecrease',
                                            className: 'blind',
                                            children: '감소',
                                        }),
                                        L.jsx('input', {
                                            type: 'button',
                                            id: 'endTimeDecrease',
                                            className: 'btn_option decrease',
                                        }),
                                    ],
                                }),
                                L.jsx(Wr, {
                                    children: L.jsx('input', {
                                        ref: u,
                                        id: 'endTime',
                                        type: 'text',
                                        value: r,
                                        onChange: S,
                                    }),
                                }),
                                L.jsxs(zi, {
                                    onClick: y,
                                    children: [
                                        L.jsx('label', {
                                            htmlFor: 'endTimeIncrease',
                                            className: 'blind',
                                            children: '증가',
                                        }),
                                        L.jsx('input', {
                                            type: 'button',
                                            id: 'endTimeIncrease',
                                            className: 'btn_option increase',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        L.jsx(Vn, {
                            children: L.jsxs(Ig, {
                                children: [
                                    L.jsx('span', {
                                        className: 'tool_option_title',
                                        children: wt('Workspace.sound_selection'),
                                    }),
                                    L.jsxs(_c, {
                                        type: 'button',
                                        className: Be('btn_remain', { active: o }),
                                        onClick: f,
                                        children: [
                                            L.jsx('span', {
                                                className: 'blind',
                                                children: '남기기',
                                            }),
                                            !o &&
                                                L.jsx('span', {
                                                    className: 'blind',
                                                    children: '선택됨',
                                                }),
                                        ],
                                    }),
                                    L.jsxs(_c, {
                                        type: 'button',
                                        className: Be('btn_cut', { active: !o }),
                                        onClick: h,
                                        children: [
                                            L.jsx('span', {
                                                className: 'blind',
                                                children: '자르기',
                                            }),
                                            o &&
                                                L.jsx('span', {
                                                    className: 'blind',
                                                    children: '선택됨',
                                                }),
                                        ],
                                    }),
                                ],
                            }),
                        }),
                    ],
                }),
            });
        },
        p_ = () => {
            const n = F(Bt),
                t = F(su),
                e = F(go),
                s = U.useMemo(() => (n !== 'stopped' ? t : Os(e)), [t, n, e]);
            return L.jsxs(Wr, {
                children: [
                    L.jsx('label', {
                        htmlFor: 'currentTime',
                        className: 'blind',
                        children: n !== 'stopped' ? '재생시점' : '소리길이',
                    }),
                    L.jsx('input', {
                        id: 'currentTime',
                        type: 'text',
                        value: s,
                        readOnly: !0,
                        disabled: !0,
                        className: 'current_time',
                    }),
                ],
            });
        },
        m_ = () => {
            const n = F(Te),
                t = F(De),
                e = F(Bt),
                s = U.useMemo(() => e === 'playing' || e === 'paused', [e]),
                i = () => {
                    t && n.play();
                },
                r = () => {
                    t && n.pause();
                },
                a = () => {
                    t && n.stop();
                };
            return L.jsxs(L.Fragment, {
                children: [
                    e !== 'playing' &&
                        L.jsx(vs, {
                            type: 'button',
                            className: Be('btn_play', { btn_small: s }),
                            onClick: i,
                            children: L.jsx('span', { className: 'blind', children: '재생하기' }),
                        }),
                    e === 'playing' &&
                        L.jsx(vs, {
                            type: 'button',
                            className: Be('btn_pause', { btn_small: s }),
                            onClick: r,
                            children: L.jsx('span', {
                                className: 'blind',
                                children: '일시 정지 하기',
                            }),
                        }),
                    e !== 'stopped' &&
                        L.jsx(vs, {
                            type: 'button',
                            className: Be('btn_stop', { btn_small: s }),
                            onClick: a,
                            children: L.jsx('span', { className: 'blind', children: '정지하기' }),
                        }),
                ],
            });
        },
        g_ = () => {
            const n = F(xt),
                t = n === 'adjuster',
                e = n === 'trimmer';
            return L.jsxs(L.Fragment, {
                children: [
                    L.jsxs(Vr, { children: [L.jsx(m_, {}), L.jsx(p_, {})] }),
                    t && L.jsx(d_, {}),
                    e && L.jsx(f_, {}),
                ],
            });
        },
        M_ =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjkiIGhlaWdodD0iNTciIHZpZXdCb3g9IjAgMCA2OSA1NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im02NC4xNDkgMjkuMDItLjA0MS0xLjA3NS01LjIxMy0xLjgxLjA2NSAxLjE4NCA1LjE4OSAxLjcwMXptLTEuOTA1IDcuNDI5Yy0uODQyIDAtMS41MjItLjMxMi0xLjg2MS0uODU0LS42MS0uOTczLjA3Ni0yLjM5MyAxLjUzLTMuMTY3YTQuMDIgNC4wMiAwIDAgMSAxLjg3NS0uNDg4Yy4xNjMgMCAuMzIxLjAxMi40NzQuMDM1bC0uMDgxLTIuMTI2LTUuMTgyLTEuODE1LjEzOCAyLjUxYy4yMTUuMTM2LjM4NS4zMDQuNTA4LjQ5OS42MDkuOTcyLS4wNzcgMi4zOTItMS41MyAzLjE2NmE0LjAzMyA0LjAzMyAwIDAgMS0xLjg4MS40OWMtLjg0MyAwLTEuNTIyLS4zMS0xLjg2Mi0uODU0LS42MS0uOTczLjA3Ny0yLjM5MyAxLjUzLTMuMTY2YTQuMDIgNC4wMiAwIDAgMSAxLjg3Ni0uNDg5Yy4xNjIgMCAuMzIuMDEyLjQ3Mi4wMzZsLS4yMjYtNS45NDRhLjEzNi4xMzYgMCAwIDEgLjA1OC0uMTE0LjE2LjE2IDAgMCAxIC4xMzYtLjAyM2w2LjU4NSAxLjgzM2EuMTQxLjE0MSAwIDAgMSAuMTA3LjEyOWwuMjQgNi4xODhhMS42IDEuNiAwIDAgMSAuNTA1LjQ5N2MuNjEuOTczLS4wNzYgMi4zOTMtMS41MyAzLjE2NmE0LjAzNyA0LjAzNyAwIDAgMS0xLjg4LjQ5eiIgZmlsbD0iIzAwMDIzMyIvPjxwYXRoIGQ9Ik02MS4yODMgMzMuOTljLS4wNTguMTItLjA5Ni4yNjctLjAxOS4zNzcuMDUzLjA3Ni4xNDguMTE3LjI0Mi4xNC43OTEuMTk3IDIuNDkyLTEuMTg0IDEuMzYzLTEuNDUtLjUyLS4xMjQtMS4zODkuNTI0LTEuNTg2LjkzM20tNi4xMTQtMi4wOTRjLS4wNTguMTItLjA5Ni4yNjYtLjAyLjM3Ny4wNTMuMDc1LjE0OC4xMTYuMjQyLjE0Ljc5Mi4xOTYgMi40OTMtMS4xODUgMS4zNjQtMS40NTEtLjUyLS4xMjMtMS4zOS41MjQtMS41ODYuOTM0IiBmaWxsPSIjRkZGQ0VCIi8+PHBhdGggZD0iTTUzLjU2MiAyMS4zNjdjLTEuMTUzIDAtMi4wNzUtLjUwMy0yLjM0OC0xLjI4Mi0uMTg4LS41MzctLjA1NS0xLjEzNi4zNzYtMS42ODUuNDItLjUzNiAxLjA3Ny0uOTYyIDEuODUtMS4yLjQyLS4xMy44NDUtLjE5NSAxLjI2Ni0uMTk1LjQzIDAgLjg0LjA3IDEuMTk1LjIwNWwuNDk2LTUuOTZhLjEyNy4xMjcgMCAwIDEgLjExOC0uMTEycy4xODMtLjAxNi40Ny0uMDE2Yy45ODggMCAzLjMuMTkyIDMuMzk3IDEuOTY3LjExMSAyLjAxOS45NjYgMi40MTYuOTc1IDIuNDJhLjEyLjEyIDAgMCAxIC4wNzQuMTMuMTI2LjEyNiAwIDAgMS0uMTE0LjEwMyA0LjgzOCA0LjgzOCAwIDAgMS0uNDc3LjAyNmMtLjUzOCAwLS45MjEtLjExNi0xLjE3My0uMzU1LS4yNzQtLjI2LS4zOTMtLjY1Ny0uMzg2LTEuMjg3LjAxLS44MS0xLjYwMi0xLjAzOS0yLjA3MS0xLjA4OGwtLjQ4NCA0LjcwNmMuMTUxLjE2My4yNjIuMzQ1LjMzMi41NC4zODQgMS4wOTYtLjYxNCAyLjM5LTIuMjI2IDIuODg3LS40MjEuMTMtLjg0OS4xOTYtMS4yNy4xOTYiIGZpbGw9IiMwMDAyMzMiLz48cGF0aCBkPSJNNTIuMTkgMTguNzFjLS4wNS4xMDYtLjA4NC4yMzYtLjAxOC4zMzQuMDQ2LjA2Ni4xMjkuMTAzLjIxLjEyMy42ODguMTc0IDIuMTY2LTEuMDQ3IDEuMTg1LTEuMjgzLS40NTItLjEwOS0xLjIwNy40NjQtMS4zNzguODI2IiBmaWxsPSIjQ0E5MUZGIi8+PHBhdGggZD0iTTMxLjEyMyAxNS40NjRjLjk5IDAgMS42MDctMS4xNjcgMi4xMDItMi4xMDQuMTU1LS4yOTMuMzAxLS41Ny40Mi0uNzMyLjI5Ny0uNDAyLjU2Ny0uNjA2LjgwMS0uNjA2LjM4MyAwIC44NTUuNDk3IDEuMzU1IDEuMDIzLjIxOS4yMy40NDYuNDY4LjY4Ny42OTFhMi42OTYgMi42OTYgMCAwIDAgMS44MzQuNzM4Yy44NDMgMCAxLjYzMy0uNDA2IDIuMTY3LTEuMTE0Ljk3Mi0xLjI4Ni44MjItMy4yMjItLjMzNC00LjMxNC0xLjc2OC0xLjY3MS0zLjUxNi0yLjUxNi01LjE5NC0yLjUxNi0uNjU0IDAtMS4zLjEzLTEuOTE4LjM5LS41MjguMjIyLS42MjIuMjgzLTEuMTEyLjY2NS0uMzU0LjI3OC0uNzE0LjYzLTEuMTMyIDEuMTA3LS44MTcuOTM2LTEuNTYgMy4zMTctMS4yOTQgNC45ODYuMTIuNzQ3LjQzNyAxLjI5My45MjEgMS41ODEuMjI5LjEzNi40NjMuMjA1LjY5Ny4yMDUiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0zNi4yNCAxMS43MmEuODUuODUgMCAwIDEgLjU0Ny0uMDI4IDEuMDI1IDEuMDI1IDAgMCAxLS41MDMtLjU5MWMtLjE5Mi0uNTU0LjA1OC0xLjE3LjU1MS0xLjM4NGEuODc0Ljg3NCAwIDAgMSAuNjg5LjAxMyAxLjAzNCAxLjAzNCAwIDAgMS0uNDQyLS41NDNjLS4xOTEtLjU1NS4xODMtMS4xMzMuNjgtMS4zNDMuMDQ2LS4wMjIuMDkyLS4wMTcuMTQtLjAyOCAxLjEyNy42ODcgMS43ODkgMS4zNjQgMS45NjggMS41MyAxLjAxMi45NTYgMS4xNCAyLjYzNy4yODcgMy43NjUtLjg1IDEuMTI3LTIuMzY3IDEuMjY5LTMuMzg4LjMyLS4zLS4yNzctLjY5OC0uNzc5LTEuMTI1LTEuMDUxLjA0Ni0uMzc1LjI1NS0uNTE4LjU5Ni0uNjYiIGZpbGw9IiM2MTMzMEYiLz48cGF0aCBkPSJNMjUuOTk0IDUuNDk1Yy0xLjY0LjI0NC0zLjIyOCAxLjAzMy00LjI3NiAyLjMyLTEuMDQ4IDEuMjg1LTEuNDk4IDMuMDg1LTEuMDEyIDQuNjcuMDQzLjE0LjEwMy4yOTEuMjMuMzY0LjExLjA2My4yNDUuMDU1LjM3LjA0NGE2OC4wMjkgNjguMDI5IDAgMCAwIDExLjQxNS0xLjk2N2MuNDMxLS4xMTMuODgyLS4yNDEgMS4yMDQtLjU1IDEuMTk4LTEuMTUtMS42OTctMy4yMzItMi41Ny0zLjc1OC0xLjU5Mi0uOTYtMy41MTQtMS4zOTctNS4zNi0xLjEyMyIgZmlsbD0iIzU0NTQ1NCIvPjxwYXRoIGQ9Ik0yNS45OTQgNS40OTVjLTEuNjQuMjQ0LTMuMjI4IDEuMDMzLTQuMjc2IDIuMzItMS4wNDggMS4yODUtMS40OTggMy4wODUtMS4wMTIgNC42Ny4wNDMuMTQuMTAzLjI5MS4yMy4zNjQuMTEuMDYzLjI0NS4wNTUuMzcuMDQ0YTY4LjAyOSA2OC4wMjkgMCAwIDAgMTEuNDE1LTEuOTY3Yy40MzEtLjExMy44ODItLjI0MSAxLjIwNC0uNTUgMS4xOTgtMS4xNS0xLjY5Ny0zLjIzMi0yLjU3LTMuNzU4LTEuNTkyLS45Ni0zLjUxNC0xLjM5Ny01LjM2LTEuMTIzeiIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggZD0iTTIyLjM5OCAxMi42OTVTMzcuOTMgNS44MjMgNDAuNzg2IDEwLjZjMS41MDggMi41Mi0xLjYyIDMuMjIzLTEuNjIgMy4yMjNzLTMuMjY1LTMuMjQ3LTE2Ljc2OC0xLjEyNyIgZmlsbD0iIzM0MzQzNCIvPjxwYXRoIGQ9Ik0yMi4zOTggMTIuNjk1UzM3LjkzIDUuODIzIDQwLjc4NiAxMC42YzEuNTA4IDIuNTItMS42MiAzLjIyMy0xLjYyIDMuMjIzcy0zLjI2NS0zLjI0Ny0xNi43NjgtMS4xMjd6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMC41NDEgNDcuMjUzYy0uNDU3LjA1My0uOTMzLjEwNS0xLjM2OS0uMDQzLTEuNjEyLS41NDctMi4zMTItMy40MjYtMi45NzMtNC44MTQtLjIzNy0uNDk3LS40OTYtLjk5LS42MTQtMS41MjctLjQ4LTIuMTgxIDIuNzA0LTMuMzg2IDQuNzc3LTMuMjI1LjkwNC4wNyAxLjQ1MS0uNzE4IDIuMTctLjE2NGwyLjgyMiAyLjE3MmMxLjAxMi43OCAyLjA3OSAxLjYzNCAyLjQ2MSAyLjg1Mi4zMDguOTc3LjA5OSAyLjEtLjU0IDIuOS0xLjM5NiAxLjc1LTQuNzM2IDEuNjE4LTYuNzM0IDEuODUiIGZpbGw9IiNGMDRDNEMiLz48cGF0aCBkPSJNMTAuNTQxIDQ3LjI1M2MtLjQ1Ny4wNTMtLjkzMy4xMDUtMS4zNjktLjA0My0xLjYxMi0uNTQ3LTIuMzEyLTMuNDI2LTIuOTczLTQuODE0LS4yMzctLjQ5Ny0uNDk2LS45OS0uNjE0LTEuNTI3LS40OC0yLjE4MSAyLjcwNC0zLjM4NiA0Ljc3Ny0zLjIyNS45MDQuMDcgMS40NTEtLjcxOCAyLjE3LS4xNjRsMi44MjIgMi4xNzJjMS4wMTIuNzggMi4wNzkgMS42MzQgMi40NjEgMi44NTIuMzA4Ljk3Ny4wOTkgMi4xLS41NCAyLjktMS4zOTYgMS43NS00LjczNiAxLjYxOC02LjczNCAxLjg1eiIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggZD0iTTQ0LjEzNyA0Ny4wOThjLTIuNDA0LS44NzItNC44NTctMS4xMjUtNy40OC0xLjQzNS0xLjE2LS4xMzctNS4zODEtLjU2LTQuMTc2LTIuNzkuNDM3LS44MDYgMS43ODUtMS4wMDYgMi41ODYtMS4yYTE4LjI2NCAxOC4yNjQgMCAwIDEgNS4yOTMtLjQ4NGMxLjk3Ni4xMDUgMy45MDguNTIzIDUuNzYzIDEuMTY4YTE1LjE4NyAxNS4xODcgMCAwIDAtMS45ODYgNC43NDEiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNNTEuNDQ3IDUyLjI2N2ExOC44NyAxOC44NyAwIDAgMC0xLjc0LTEuODIzIDE1LjcxOCAxNS43MTggMCAwIDAtMi42My0xLjk1Yy0uNDczLS4yOC0uOTczLS41NDctMS41MDYtLjgwMy0uNDc2LS4yMy0uOTU1LS40MTktMS40MzQtLjU5M2ExNS4yMSAxNS4yMSAwIDAgMSAxLjk4NS00Ljc0Yy44OTcuMzExIDEuNzc4LjY3MiAyLjYzMiAxLjA4NCAyLjQzOCAxLjE3NyA1LjE1NSAyLjcgNi45NDQgNC44My44NyAxLjAzNyAxLjIxIDIuNTM1LjY4MSAzLjg4Mi0uMTEuMjgtLjI0NS41NDItLjM4OC43NjEtLjUyNC43OTctMS4zNzYgMS4zODgtMi4zMDIgMS4yNTRhMS43NSAxLjc1IDAgMCAxLS41MDUtLjE2MWMtLjczMy0uMzQ0LTEuMjEtMS4xMjYtMS43MzctMS43NCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMzQ4NEMyIi8+PHBhdGggZD0iTTQxLjczOCA0Ni42MjNjLTIuMjkyLS42NzYtNC43MDItLjk5My02Ljk5NS0xLjY3NC0uNTY3LS4xNjgtMS4xNC0uMzU4LTEuNjI0LS42OTctLjQ4Ni0uMzM5LS44OC0uODUxLS45NDYtMS40NC0uMTY0LTEuNDU1IDEuNjM4LTIuNTk4IDIuNzc0LTMuMDkzIDMuNDE1LTEuNDkgNy4wODYtLjM2NyAxMC40MTcuNzYgMi4wNTkuNjk2IDQuMDYzIDEuNTk1IDUuODUgMi44NDQuMzgzLjI2OCAxLjQzNC43NyAxLjQxNyAxLjMyMS0uMDEuMzUtLjQyMi43NjYtLjYgMS4wNDlhOS4zMTEgOS4zMTEgMCAwIDAtLjY0NyAxLjE4NWMtLjIzNi41MzYtLjU4NCAxLjA1My0uOTM5IDEuNTE3LS41NTcuNzI4LTEuNTUzIDEuODItMi41ODkgMS4zOTMtMS4yMDgtLjQ5OC0yLjItMS41MS0zLjM3Ni0yLjEwNGExNi4wNTIgMTYuMDUyIDAgMCAwLTIuNzQyLTEuMDYxIiBmaWxsPSIjRjA0QzRDIi8+PHBhdGggZD0iTTQxLjczOCA0Ni42MjNjLTIuMjkyLS42NzYtNC43MDItLjk5My02Ljk5NS0xLjY3NC0uNTY3LS4xNjgtMS4xNC0uMzU4LTEuNjI0LS42OTctLjQ4Ni0uMzM5LS44OC0uODUxLS45NDYtMS40NC0uMTY0LTEuNDU1IDEuNjM4LTIuNTk4IDIuNzc0LTMuMDkzIDMuNDE1LTEuNDkgNy4wODYtLjM2NyAxMC40MTcuNzYgMi4wNTkuNjk2IDQuMDYzIDEuNTk1IDUuODUgMi44NDQuMzgzLjI2OCAxLjQzNC43NyAxLjQxNyAxLjMyMS0uMDEuMzUtLjQyMi43NjYtLjYgMS4wNDlhOS4zMTEgOS4zMTEgMCAwIDAtLjY0NyAxLjE4NWMtLjIzNi41MzYtLjU4NCAxLjA1My0uOTM5IDEuNTE3LS41NTcuNzI4LTEuNTUzIDEuODItMi41ODkgMS4zOTMtMS4yMDgtLjQ5OC0yLjItMS41MS0zLjM3Ni0yLjEwNGExNi4wNTIgMTYuMDUyIDAgMCAwLTIuNzQyLTEuMDYxeiIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggZD0iTTU0LjgyIDQ2LjIyN2MtLjUwNi0xLjMxLTIuODA2LTIuOTY4LTMuNzY2LTIuNjU0LS45LjI5NC0xLjgyMiAxLjQyMS0yLjM5MSAyLjEyOC0uNzA1Ljg3Ny0xLjk5NiAyLjQ3OC0xLjQ4NyAzLjYyOC4zNy44NDEgMS4yOTUgMS45NTEgMi4yMzggMi4xNTYuNjIyLjEzNSAxLjE2OC0xLjI0OSAxLjUxNS0xLjc0LjUyLS43MzkgMS4wODYtMS40NTIgMS43NDYtMi4wNzIuMTQ4LS4xMzkgMi4wOS0xLjU5IDIuMTQ2LTEuNDQ2IiBmaWxsPSIjRjA0QzRDIi8+PHBhdGggZD0iTTU0LjgyIDQ2LjIyN2MtLjUwNi0xLjMxLTIuODA2LTIuOTY4LTMuNzY2LTIuNjU0LS45LjI5NC0xLjgyMiAxLjQyMS0yLjM5MSAyLjEyOC0uNzA1Ljg3Ny0xLjk5NiAyLjQ3OC0xLjQ4NyAzLjYyOC4zNy44NDEgMS4yOTUgMS45NTEgMi4yMzggMi4xNTYuNjIyLjEzNSAxLjE2OC0xLjI0OSAxLjUxNS0xLjc0LjUyLS43MzkgMS4wODYtMS40NTIgMS43NDYtMi4wNzIuMTQ4LS4xMzkgMi4wOS0xLjU5IDIuMTQ2LTEuNDQ2eiIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuNzIyIDE3LjM3MWEzLjE4NyAzLjE4NyAwIDAgMCAyLjU1Ny0xLjI3Yy44MDctMS4wNTUgMS43MjgtMi4xODMgMi40NTQtMi4xODMuMTYgMCAuMzEuMDU2LjQ2NS4xNzMuMi4xNS40MzkuNDU0LjY5Mi43NzQuNTY0LjcxMyAxLjI2NiAxLjYwMiAyLjIxIDEuNjAyLjMgMCAuNTk4LS4wOS44ODktLjI2OCAxLjc0OC0xLjA3NC4yODQtMy44NzItLjIwNi00LjcwNC0uOTQxLTEuNTk3LTIuMDYtMy4xNzYtNC40NTMtMy40MTVhNi4zNCA2LjM0IDAgMCAwLS42NC0uMDMyYy0zLjA5NCAwLTUuMjE4IDIuMzYyLTYuNTQ4IDQuMTM5YTMuMjYgMy4yNiAwIDAgMCAuNjMgNC41MmMuNTY2LjQzNSAxLjI0LjY2NCAxLjk1LjY2NCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTE1LjE1IDEzLjk1N2ExLjA5NCAxLjA5NCAwIDAgMC0uNjI3LjEwOWMuMjI3LS4xNzMuMzktLjQyOC40MzMtLjczNWExLjEzNSAxLjEzNSAwIDAgMC0uOTQ5LTEuMjgzIDEuMTA2IDEuMTA2IDAgMCAwLS43NzguMTg3Yy4xOTEtLjE3LjMzNi0uMzk5LjM3NC0uNjcuMDktLjYxOC0uNTA0LTEuMTM5LTEuMTE3LTEuMjMtLjA1Ni0uMDEtLjEwOC4wMDctLjE2NC4wMDctMS4xMi45OTEtMS42ODIgMS44NzYtMS44NDcgMi4wOTMtLjkyOCAxLjIzOS0uNjggMyAuNTUxIDMuOTQzYTIuNzg3IDIuNzg3IDAgMCAwIDMuOTIyLS41MjhjLjI3Ny0uMzYyLjY2LS43NzUgMS4wOC0xLjE2M2ExLjExMiAxLjExMiAwIDAgMC0uODc3LS43MyIgZmlsbD0iIzYxMzMwRiIvPjxwYXRoIGQ9Ik0yNy4zODggNjkuMjQ4YzcuNjIgMCAxNi4zOTgtMy44MzYgMTguODMtMTIuNDAzLjg3NC0zLjA3Mi4xMjgtNi42ODktLjYxOC05LjQ5OGE1NC41OTIgNTQuNTkyIDAgMCAwLS4zMDEtMS4wNzhjLS40NjgtMS42MzgtLjk1Mi0zLjMzNC0uNzc0LTQuOTQuMTIyLTEuMTA5LjYzLTIuMDM3IDEuMTY3LTIuODc0IDEuNDk0LTEuMjU4IDIuNTI0LTIuNzc4IDMuMDY0LTQuNTIuNjAyLTEuOTQ0LjcwNy0zLjg4Ni4zMDQtNS42MTgtLjI0OS0xLjA3LS43My0yLjAyNS0xLjQ3Mi0yLjkxNWEyOS4yMjEgMjkuMjIxIDAgMCAwLS40NTYtMS42MTJjLTEuMjUxLTMuOTE2LTMuNDY2LTcuMTU4LTYuMDc2LTguODk2LTMuNzQyLTIuNDkxLTguMDQ3LTMuOTItMTEuODEtMy45Mi0uNDQyIDAtLjg4NC4wMTktMS4zMjMuMDU4bC0xLjQxOC4xMjJjLTQuMTkuMzU0LTguNjY0IDIuNTY0LTEyLjM1MiA2LjA3MS0yLjI3NCAyLjE2MS0zLjg5NyA1LjczNi00LjQ1NiA5LjgwOWEyMi4xOTIgMjIuMTkyIDAgMCAwIC4zNTEgOC4wNDkgMjAuNzg4IDIwLjc4OCAwIDAgMCAxLjMyMyAzLjk1NmMuNTE3IDEuMTI5LjYyNCAyLjQzLjM0IDQuMDkzLS4yMTcgMS4yNi0uNjM0IDIuNTY5LTEuMDM3IDMuODM0LS40NTcgMS40MzYtLjg4OCAyLjc5My0xLjA1MyA0LjA4Ny0uNTEzIDQuMDY0LjE0IDcuNTAzIDEuOTQ1IDEwLjIyLjk0NCAxLjQyNCAyLjk4NiAzLjkzOCA0Ljc0MiA1LjAyOSAzLjA2MSAxLjg5OSA2Ljk5NiAyLjk0NiAxMS4wOCAyLjk0NnoiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0xMi4xMTkgNDMuMjAyYy4yNi0xLjUxLjI0Ny0yLjk4Ni0uMzcxLTQuMzM2YTIwLjQzOSAyMC40MzkgMCAwIDEtMS4yOTYtMy44NzcgMjEuOTA1IDIxLjkwNSAwIDAgMS0uMzQ1LTcuOWMuNDY2LTMuMzkgMS44MTUtNy4xNzIgNC4zMy05LjU2MyAzLjIzMy0zLjA3MyA3LjU5OC01LjU3OCAxMi4wMjItNS45NTFsLjA4MS0uMDA4IDEuNDItLjEyMWM0LjQyNC0uMzk1IDkuMTU0IDEuMzIyIDEyLjg2NyAzLjc5MyAyLjg4OSAxLjkyMyA0Ljg2OSA1LjQxOCA1LjkxIDguNjc3Ljk4OCAzLjA5MyAxLjg5MyA3Ljc3LjYyOCAxMC45MjEtLjk1MSAyLjM3LTIuOTc0IDMuOTI2LTMuMjUzIDYuNDQ3LS4yMjcgMi4wNTYuNTY3IDQuMjEyIDEuMDg3IDYuMTcuNzU3IDIuODQ2IDEuNDQ3IDYuMzcyLjYyMiA5LjI3Ny0zLjQzIDEyLjA3Ny0xOS45MDggMTUuMDQ1LTI5LjI5NCA5LjIxOC0xLjYwNC0uOTk2LTMuNTY4LTMuMzI0LTQuNjE2LTQuOTA0LTEuOTU3LTIuOTQ4LTIuMzE3LTYuNDcxLTEuODc4LTkuOTQuMzA1LTIuNDE1IDEuNjI1LTUuMjE3IDIuMDg2LTcuOTAzTTI3Ljk2IDExLjQ0NWwtLjA4LjAwNi4wOC0uMDA2IiBmaWxsPSIjNDJBMEUwIi8+PHBhdGggZD0iTTE1LjgxNSAzMi4zM2MtLjkyLTcuMjgxIDEuNzgtMTQuMDI3IDguOTU0LTE2LjY4NyA1Ljk1MS0yLjIwNiAxNS4yNzctMS4zNCAxOC44NCA0LjU5My4zNTUuNTkxIDEuMzMxIDMuMzAxIDEuMzMxIDMuMzAxcy42MjcuNTMuNjc4LjU2OWMxLjQ2OCAxLjEzNCAyLjYwMyAyLjQzMyAzLjAzOSA0LjMwNS40MTIgMS43NzMuMjM4IDMuNjczLS4yOTcgNS40MDEtMi40MjMgNy44MjUtMTQuMzE4IDguODQ3LTIxLjA5IDguNDQ2LTMuNDM1LS4yMDMtNy4wNjEtMS40NDktOS4zMDEtNC4xNzktMS4xOTQtMS40NTQtMS44NzItMy41Mi0yLjE1NC01Ljc0OSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS4xMTMgMzIuMDUzYy4zMTMgMi40MzEtMS4zOSA0LjY1NS0zLjgwMiA0Ljk2NS0yLjQxMy4zMTEtNC42MjItMS40MDgtNC45MzUtMy44NC0uMzEzLTIuNDI4IDEuMzg5LTQuNjUgMy44LTQuOTYyIDIuNDEzLS4zMSA0LjYyNCAxLjQwOCA0LjkzNyAzLjgzN20xOC45ODktMi4yODNjLjIwNyAyLjQ0My0uODgxIDQuNTY5LTIuODYgNC42OTctMi40MjcuMTU3LTQuMjg2LTEuOTc2LTQuNTI1LTMuODYtLjMwOC0yLjQyOS41NjMtNC44MDcgMi45ODYtNS4wMTIgMi40MjQtLjIwNiA0LjMwOCAyLjE3MyA0LjM5OSA0LjE3NSIgZmlsbD0iI0Y1QzFCQyIvPjxwYXRoIGQ9Ik0zNi4xMTEgMjkuMDc4Yy4wNDMuMzE3LS4yNTUuNjE5LS42NzMuNjc2LS40MTguMDU3LS43OS0uMTUzLS44MzMtLjQ3LS4wNDMtLjMxNC4yNTgtLjYxOS42NzYtLjY3Ni40MTgtLjA1Ny43ODcuMTU2LjgzLjQ3IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjIiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMzEuMzkgMzIuNzc2Yy4yMzEgMS4xNjQgMS40OTUgMy44NjUgNC4yNzMgMy4xNTkgMy4wOS0uNTI2IDMuMTg5LTMuMjQ0IDMuMTQ2LTQuMjg1IiBmaWxsPSIjQzg1MjRFIi8+PHBhdGggZD0iTTM0Ljg2OSAzNi4zNjdjLjI4Mi0uMDA4LjU3My0uMDUuODcyLS4xMjYgMi4yNzgtLjM4NiAzLjQ4OC0yLjAyMyAzLjM4NC00LjYwM2EuMzE2LjMxNiAwIDAgMC0uMzI0LS4zMDRoLS4wMDVhLjMxNi4zMTYgMCAwIDAtLjMwMy4zM2MuMDYzIDEuNTcxLS4zODUgMy41MzUtMi44ODIgMy45NTktLjg0LjIxMy0xLjU3Ny4xMTUtMi4yMTItLjI4Ny0xLjA2Ni0uNjcyLTEuNTc2LTIuMDEtMS42OTctMi42MjJhLjMxNy4zMTcgMCAwIDAtLjYyLjEyM2MuMTQ5Ljc1Ny43MzQgMi4yNDkgMS45OCAzLjAzNC41NS4zNDggMS4xNTQuNTEzIDEuODA3LjQ5NiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Im0zNy42OSAzMi4xOS4wMzguMjNjLjAzMy4xOTctLjExMy4zODUtLjMyNi40MmwtNC4yNzUuNzJjLS4yMTMuMDM2LS40MTMtLjA5NC0uNDQ2LS4yOWwtLjAyOC0uMTY4YS4zNjcuMzY3IDAgMCAxIC4yNTQtLjQwMWMuNDktLjE3IDEuNDQtLjU0IDEuODUtLjk2N2EuNDIyLjQyMiAwIDAgMSAuNDQ3LS4xMTcgNC44MyA0LjgzIDAgMCAwIDIuMDgyLjI3OS4zNjguMzY4IDAgMCAxIC40MDMuMjk1IiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTMyLjMxNCAzMy4yNDdjMS40MTYtLjAzOCAyLjkwMS0uODMgMy42MjUtMS42NjVhLjM4LjM4IDAgMCAwLS41NzItLjQ5N2MtLjc5Ni45MTgtMi44OTIgMS44NTMtNC4yMzYgMS4xNjktLjM2Ny0uMTg4LS42MDctLjM5Ni0uNjY3LS40OTlhLjM3OS4zNzkgMCAwIDAtLjY0MS0uNDAzLjY2OC42NjggMCAwIDAtLjExLjU1NGMuMTE0LjQ3My43MjIuODQ0IDEuMDczIDEuMDIzLjQ3LjIzOS45OTQuMzMzIDEuNTI4LjMxOCIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zNy41NDEgMzIuMzQ3Yy43NDctLjAxOSAxLjQ4OC0uMzAyIDIuMDIyLS45MjIuNTkzLS42OS43MjgtMS4zMjUuMzYtMS42OThhLjM3OC4zNzggMCAwIDAtLjUzNi0uMDAzLjM3Ny4zNzcgMCAwIDAtLjAxNy41MjFjLjAwNC4wOTctLjEyMi4zODItLjM4Mi42ODQtLjc4MS45MDktMi4yNzUuODEtMy4wOS4xMTZhLjM3OS4zNzkgMCAwIDAtLjQ5MS41NzdjLjU1Ny40NzYgMS4zNDguNzQ3IDIuMTM0LjcyNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zNy43MzYgMjcuMjc4YS45NTIuOTUyIDAgMSAwIDEuODYtLjQwNi45NTIuOTUyIDAgMCAwLTEuODYuNDA2bS05IDFhLjk1Mi45NTIgMCAxIDAgMS44Ni0uNDA2Ljk1Mi45NTIgMCAwIDAtMS44Ni40MDYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIuMiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik00NS44NzYgNjAuMnMtNC43NSAyLjE0NS03LjE1NyAyLjQ0NmMtOC4yMzUgMS4wMzEtMTYuNzgzIDIuNDM1LTI1LjAxNy42MjMtMS4yMDgtLjI2Ni0zLjA4LTEuMjUxLTMuMDgtMS4yNTFzLS42Mi0yLjYwMi0uNTU0LTMuNjk2Yy42NzktLjIyOSAxLjQwNy0uMjU4IDIuMTI0LS4yODZsMjAuMzEtLjc2N2MyLjQyLS4wOTEgNC44NS0uMTg0IDcuMjM0LS42MSAxLjkwNy0uMzQyIDQuMTA2LTEuODc4IDYuMDIzLTEuMjQ1IDEuNDkzLjQ5Mi4xMTcgNC43ODcuMTE3IDQuNzg3IiBmaWxsPSIjRDg1RjU2Ii8+PHBhdGggZD0iTTQ1Ljg3NiA2MC4ycy00Ljc1IDIuMTQ1LTcuMTU3IDIuNDQ2Yy04LjIzNSAxLjAzMS0xNi43ODMgMi40MzUtMjUuMDE3LjYyMy0xLjIwOC0uMjY2LTMuMDgtMS4yNTEtMy4wOC0xLjI1MXMtLjYyLTIuNjAyLS41NTQtMy42OTZjLjY3OS0uMjI5IDEuNDA3LS4yNTggMi4xMjQtLjI4NmwyMC4zMS0uNzY3YzIuNDItLjA5MSA0Ljg1LS4xODQgNy4yMzQtLjYxIDEuOTA3LS4zNDIgNC4xMDYtMS44NzggNi4wMjMtMS4yNDUgMS40OTMuNDkyLjExNyA0Ljc4Ny4xMTcgNC43ODd6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik00NS4zMzIgMzkuMDA4Yy40ODMuMzEyLjI1NSAxLjEyMy4yNDMgMS42OTctLjA1NyAyLjY2NS4wNTIgNS4xOTguNjUgNy44MzYuNjAxIDIuNjUgMS4zOSA1LjQzOC42NTIgOC4xNDUtNC41MjIgMi4xNTYtOS40OTMgMy4wOTItMTQuNDEzIDMuODE2LTcuMjYyIDEuMDctMTUuMjI2IDEuNTU2LTIyLjA4Ni0xLjU0MS0uNDIyLS4xOS0uODUtLjQxMy0xLjEzMi0uNzgxLS4zLS4zOTQtLjM5NS0uOTA1LS40NzQtMS4zOTQtLjI5Mi0xLjgyMi0uNDg0LTMuNjg4LS4xODMtNS41MS4zOTUtMi4zOSAxLjYxOC00LjU4MiAyLjAzLTYuOTcuMTk2LTEuMTM4LjIwNS0yLjMwOS4wMjMtMy40NS0uMDU5LS4zNjgtLjEzMS0uNzY3LjA0Mi0xLjA5Ni4zODEtLjcyIDEuNDU0LS40NzUgMi4yMDMtLjE1OCA0Ljg0MyAyLjA1OSAxMC4wMzYgMy4zMDkgMTUuMjggMy43MzEgMS45ODguMTYgMy45ODMtLjA2NCA1Ljk1LS4zNTUgMS45MS0uMjgyIDMuODQyLS41MDcgNS43MTItMS4wMDIgMS4yMDktLjMyIDIuMzg3LS43NzcgMy40NDYtMS40NDguMTY1LS4xMDUgMi4wNy0xLjUxMSAyLjA1Ny0xLjUyIiBmaWxsPSIjRjA0QzRDIi8+PHBhdGggZD0iTTQ1LjMzMiAzOS4wMDhjLjQ4My4zMTIuMjU1IDEuMTIzLjI0MyAxLjY5Ny0uMDU3IDIuNjY1LjA1MiA1LjE5OC42NSA3LjgzNi42MDEgMi42NSAxLjM5IDUuNDM4LjY1MiA4LjE0NS00LjUyMiAyLjE1Ni05LjQ5MyAzLjA5Mi0xNC40MTMgMy44MTYtNy4yNjIgMS4wNy0xNS4yMjYgMS41NTYtMjIuMDg2LTEuNTQxLS40MjItLjE5LS44NS0uNDEzLTEuMTMyLS43ODEtLjMtLjM5NC0uMzk1LS45MDUtLjQ3NC0xLjM5NC0uMjkyLTEuODIyLS40ODQtMy42ODgtLjE4My01LjUxLjM5NS0yLjM5IDEuNjE4LTQuNTgyIDIuMDMtNi45Ny4xOTYtMS4xMzguMjA1LTIuMzA5LjAyMy0zLjQ1LS4wNTktLjM2OC0uMTMxLS43NjcuMDQyLTEuMDk2LjM4MS0uNzIgMS40NTQtLjQ3NSAyLjIwMy0uMTU4IDQuODQzIDIuMDU5IDEwLjAzNiAzLjMwOSAxNS4yOCAzLjczMSAxLjk4OC4xNiAzLjk4My0uMDY0IDUuOTUtLjM1NSAxLjkxLS4yODIgMy44NDItLjUwNyA1LjcxMi0xLjAwMiAxLjIwOS0uMzIgMi4zODctLjc3NyAzLjQ0Ni0xLjQ0OC4xNjUtLjEwNSAyLjA3LTEuNTExIDIuMDU3LTEuNTJ6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNS42NDcgNTkuMjY4YzIuNzcuMjM4IDUuNjY4LS4yNTIgOC40MDEtLjcwNCAyLjg3NS0uNDc3IDUuNzIzLTEuMTQgOC40OTUtMi4wNDYuMTc2LS4wNTcuMTY5LTEuNTc5LjE3NC0xLjc4YTE4LjIgMTguMiAwIDAgMC0uMDYzLTEuODcyYy0uMDY0LS43ODUtLjI2My0yLjEzMi0uOTgzLTIuNjEzLS40MjUtLjI4NC0xLjM5LjA4LTEuODYyLjE1NEEzMzAuMzc3IDMzMC4zNzcgMCAwIDEgMjUuOSA1Mi4yOTFjLS4yMjMuMDI2LTEuODQ3LjA2Mi0xLjkxNC4yMTItLjM5Ny44ODUuMTQ4IDEuNzk2LjMyNiAyLjc1LjIyIDEuMTgtLjQwNSAzLjg2MyAxLjMwOSA0LjAxMy4wMDkgMCAuMDE3IDAgLjAyNS4wMDIiIGZpbGw9IiNFNkU2RTYiLz48cGF0aCBkPSJNMjUuNjQ3IDU5LjI2OGMyLjc3LjIzOCA1LjY2OC0uMjUyIDguNDAxLS43MDQgMi44NzUtLjQ3NyA1LjcyMy0xLjE0IDguNDk1LTIuMDQ2LjE3Ni0uMDU3LjE2OS0xLjU3OS4xNzQtMS43OGExOC4yIDE4LjIgMCAwIDAtLjA2My0xLjg3MmMtLjA2NC0uNzg1LS4yNjMtMi4xMzItLjk4My0yLjYxMy0uNDI1LS4yODQtMS4zOS4wOC0xLjg2Mi4xNTRBMzMwLjM3NyAzMzAuMzc3IDAgMCAxIDI1LjkgNTIuMjkxYy0uMjIzLjAyNi0xLjg0Ny4wNjItMS45MTQuMjEyLS4zOTcuODg1LjE0OCAxLjc5Ni4zMjYgMi43NS4yMiAxLjE4LS40MDUgMy44NjMgMS4zMDkgNC4wMTMuMDA5IDAgLjAxNyAwIC4wMjUuMDAyeiIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggZD0iTTMzLjA1OCAzNy4yMjdjLS4wMi4wMjYtLjAzOC4wNTMtLjA1Ny4wOGExOC43NiAxOC43NiAwIDAgMS0xLjUxNCAxLjg4OSAxNS43NDIgMTUuNzQyIDAgMCAxLTIuNDQ3IDIuMTc1Yy0uNDQ4LjMyMi0uOTIyLjYzMi0xLjQzLjkzNS0uNDU0LjI3LS45MTQuNTAxLTEuMzc2LjcxNmExNS4xOTEgMTUuMTkxIDAgMCAwIDIuMzk3IDQuNTQ3Yy44NjYtLjM5IDEuNzEtLjgyNyAyLjUyNy0xLjMxNCAyLjMyMy0xLjM4OCA0Ljg5NS0zLjE0NSA2LjQ4Ny01LjQyNS43NzUtMS4xMS45ODItMi42My4zMzYtMy45MjZhNC4xNzIgNC4xNzIgMCAwIDAtLjQ1NC0uNzI0Yy0uNTkzLS43NDgtMS40OTMtMS4yNi0yLjQwMy0xLjA0NS0uMTgxLjA0Mi0uMzQuMTE3LS40OS4yMDQtLjcuNDA3LTEuMTA1IDEuMjMtMS41NzYgMS44ODgiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzM0ODRDMiIvPjxwYXRoIGQ9Ik0yMy4xNzQgNDMuMTk5Yy0yLjI3Ny43My00LjY3NyAxLjEwNS02Ljk1MyAxLjg0LS41NjMuMTgxLTEuMTMxLjM4NS0xLjYwOC43MzUtLjQ3Ny4zNS0uODU5Ljg3My0uOTExIDEuNDYzLS4xMjkgMS40NTggMS43IDIuNTU3IDIuODQ3IDMuMDI2IDMuNDUgMS40MDggNy4wOTMuMTk4IDEwLjM5Ni0xLjAwOCAyLjA0Mi0uNzQ2IDQuMDI0LTEuNjkyIDUuNzgtMi45ODQuMzc3LS4yNzYgMS40MTYtLjgwMiAxLjM4Ni0xLjM1NC0uMDE4LS4zNS0uNDQtLjc1NS0uNjI1LTEuMDM0YTkuMzEgOS4zMSAwIDAgMS0uNjc1LTEuMTdjLS4yNDgtLjUzLS42MDktMS4wMzgtLjk3NS0xLjQ5NC0uNTc0LS43MTQtMS41OTUtMS43ODItMi42MjItMS4zMy0xLjE5NS41MjctMi4xNjMgMS41Ni0zLjMyNSAyLjE4M2ExNi4yIDE2LjIgMCAwIDEtMi43MTUgMS4xMjciIGZpbGw9IiNGMDRDNEMiLz48cGF0aCBkPSJNMjMuMTc0IDQzLjE5OWMtMi4yNzcuNzMtNC42NzcgMS4xMDUtNi45NTMgMS44NC0uNTYzLjE4MS0xLjEzMS4zODUtMS42MDguNzM1LS40NzcuMzUtLjg1OS44NzMtLjkxMSAxLjQ2My0uMTI5IDEuNDU4IDEuNyAyLjU1NyAyLjg0NyAzLjAyNiAzLjQ1IDEuNDA4IDcuMDkzLjE5OCAxMC4zOTYtMS4wMDggMi4wNDItLjc0NiA0LjAyNC0xLjY5MiA1Ljc4LTIuOTg0LjM3Ny0uMjc2IDEuNDE2LS44MDIgMS4zODYtMS4zNTQtLjAxOC0uMzUtLjQ0LS43NTUtLjYyNS0xLjAzNGE5LjMxIDkuMzEgMCAwIDEtLjY3NS0xLjE3Yy0uMjQ4LS41My0uNjA5LTEuMDM4LS45NzUtMS40OTQtLjU3NC0uNzE0LTEuNTk1LTEuNzgyLTIuNjIyLTEuMzMtMS4xOTUuNTI3LTIuMTYzIDEuNTYtMy4zMjUgMi4xODNhMTYuMiAxNi4yIDAgMCAxLTIuNzE1IDEuMTI3eiIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggZD0iTTM2LjI2MiA0My4yODJjLS40NzUgMS4zMjItMi43MzQgMy4wMzQtMy43MDIgMi43NDQtLjkwNi0uMjcyLTEuODU3LTEuMzc3LTIuNDQxLTIuMDctLjcyNi0uODYtMi4wNTQtMi40MzEtMS41NzQtMy41OTIuMzUxLS44NSAxLjI1LTEuOTgyIDIuMTg2LTIuMjEuNjE5LS4xNSAxLjE5OCAxLjIyMSAxLjU1NiAxLjcwNS41MzguNzI1IDEuMTIxIDEuNDI1IDEuNzk2IDIuMDI4LjE1MS4xMzYgMi4xMjcgMS41NDEgMi4xNzkgMS4zOTUiIGZpbGw9IiNGMDRDNEMiLz48cGF0aCBkPSJNMzYuMjYyIDQzLjI4MmMtLjQ3NSAxLjMyMi0yLjczNCAzLjAzNC0zLjcwMiAyLjc0NC0uOTA2LS4yNzItMS44NTctMS4zNzctMi40NDEtMi4wNy0uNzI2LS44Ni0yLjA1NC0yLjQzMS0xLjU3NC0zLjU5Mi4zNTEtLjg1IDEuMjUtMS45ODIgMi4xODYtMi4yMS42MTktLjE1IDEuMTk4IDEuMjIxIDEuNTU2IDEuNzA1LjUzOC43MjUgMS4xMjEgMS40MjUgMS43OTYgMi4wMjguMTUxLjEzNiAyLjEyNyAxLjU0MSAyLjE3OSAxLjM5NXoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIzLjUzMyA0Ni44OTRjLjU3NC0uMjcxIDEuMjI3LS40MDcgMS44NS0uMjg1LjE1MS4wMy4zMDQuMDc2LjQzMi4xNjUuMjc3LjE5NC4zOS41NjkuMzM2LjkwMy0uMDUzLjMzMy0uMjQ3LjYzLS40NzkuODc3LS42NzQuNzE3LTEuNjYgMS4wNjQtMi42MzYgMS4xODYtLjMyNi4wNC0uNjY5LjA1NS0uOTctLjA3My0uMzAzLS4xMy0uNTUtLjQ0LS41MDUtLjc2Ni4xMy0uOTM3IDEuMjA0LTEuNjQ0IDEuOTcyLTIuMDA3IiBmaWxsPSIjRTZFNkU2Ii8+PHBhdGggZD0iTTMxLjUwOSA4LjVjLS4wNjQtLjEyLS4xMjQtLjE2Mi0uMTc2LS4yMy0uMTI2LS4xNjYtLjI1Mi0uMzMyLS4zOTItLjQ4NGExLjAyNCAxLjAyNCAwIDAgMC0uMjczLS4yMjcuNjA0LjYwNCAwIDAgMC0uMzI1LS4wNjcuMTMuMTMgMCAwIDAtLjA2MS4wMTZjLS4wMzUuMDItLjA1LjA2My0uMDU3LjEwMy0uMDUzLjI2Ni4wMS41MzguMDc0LjgwMmwuMTExLjQ2NCIgc3Ryb2tlPSIjRTZFNkU2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMzEuMSA4LjA2MmMtLjE3LS4wMjMtLjQ5Ni4wNjctLjY1Mi4xNG0tLjkxNS4yNzdhLjg3Mi44NzIgMCAwIDAtLjE1MS4wNDQgNC43OTggNC43OTggMCAwIDEtLjI1My4wODJtLS42MjYtLjcxYy0uMDAzLjE0NC4wMTYuMjktLjAxNy40My0uMDM0LjE0LS4xNC4yNzYtLjI4NC4yODVhLjQyMy40MjMgMCAwIDEtLjE5OC0uMDUyIDEuOTQ2IDEuOTQ2IDAgMCAxLS4zNzItLjIyN2MtLjAyLS4wMTUtLjA0MS0uMDM0LS4wNDItLjA1OG0uNzMuMzY3LjE3LjYyLjA1NS4yYy4wMDIuMDA4LjAwNi4wMTguMDE0LjAxOC4wMDkgMCAuMDA2LS4wMTggMC0uMDEybS0xLjExOS0uNjIyYy4xMjcuMTUuMi4zNC4yMi41MzRhLjUxLjUxIDAgMCAxLS4wMTMuMTk3Yy0uMDQ4LjE1Ny0uMjEyLjI2LS4zNzUuMjYzYS41OTEuNTkxIDAgMCAxLS40MzItLjIwMiAxLjE4MiAxLjE4MiAwIDAgMS0uMjM1LS40MjZjLS4wNjgtLjE5Ni0uMTAyLS41NDUuMTU4LS42MTcuMjM5LS4wNjcuNTI2LjA3NC42NzcuMjUxeiIgc3Ryb2tlPSIjRTZFNkU2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PC9zdmc+',
        y_ = K.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${(n) => n.theme.Blue1};
`,
        __ = K.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 429px;
`,
        T_ = K.h4`
    font-size: 18px;
    font-weight: 600;
    color: ${(n) => n.theme.Blue5};
    letter-spacing: -0.5px;
    &:before {
        display: inline-block;
        width: 69px;
        height: 57px;
        margin-right: 6px;
        background: url(${M_}) no-repeat;
        background-size: 69px 57px;
        vertical-align: middle;
        content: '';
    }
`,
        N_ = K.div`
    padding: 20px;
    border-radius: 6px;
    border: 1px solid ${(n) => n.theme.Blue2};
    background-color: ${(n) => n.theme.White1};
`,
        I_ = K.strong`
    display: block;
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: 600;
    color: ${(n) => n.theme.Gray4};
    letter-spacing: -0.5px;
`,
        S_ = K.ol``,
        Pc = K.li`
    margin-top: 6px;
    font-size: 12px;
    color: ${(n) => n.theme.Gray4};
    line-height: 16px;
    counter-increment: list-number;
    &:before {
        content: counter(list-number) '. ';
    }
    p {
        margin-top: 9px;
    }
`,
        j_ = () =>
            L.jsx(y_, {
                children: L.jsxs(__, {
                    children: [
                        L.jsx(T_, { children: wt('Msgs.sound_empty1') }),
                        L.jsxs(N_, {
                            children: [
                                L.jsx(I_, { children: wt('Msgs.sound_empty2') }),
                                L.jsxs(S_, {
                                    children: [
                                        L.jsx(Pc, { children: wt('Msgs.sound_empty3') }),
                                        L.jsxs(Pc, {
                                            children: [
                                                wt('Msgs.sound_empty4'),
                                                L.jsx('p', { children: wt('Msgs.sound_empty5') }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            }),
        A_ = () =>
            F(De)
                ? L.jsxs(L.Fragment, {
                      children: [
                          L.jsx(a_, {}),
                          L.jsx(wg, { height: 170, width: 380 }),
                          L.jsx(g_, {}),
                      ],
                  })
                : L.jsx(j_, {});
    function x_(n) {
        const { children: t } = n;
        return L.jsx(tm, { children: L.jsxs(tg, { theme: c_, children: [L.jsx(A_, {}), t] }) });
    }
    const v_ = (n) => {
            if (!n) return;
            const t = Ui.createRoot(n);
            b.set(po, t), t.render(L.jsx(U.StrictMode, { children: L.jsx(x_, {}) }));
        },
        L_ = () => {
            const n = b.get(Ne);
            return n == null ? void 0 : n.isModified;
        },
        w_ = () => {
            b.get(Ne).undo();
        },
        D_ = () => {
            b.get(Ne).redo();
        },
        b_ = async (n) => {
            const t = b.get(Ne),
                e = b.get(Te);
            e &&
                (e.clearSound(),
                t && t.clearSnapshots(),
                n && (await e.loadSoundByUrl(n), t.clearSnapshots(), t.saveAllSnapshot()));
        },
        C_ = (n) => {
            const t = b.get(Ne),
                e = b.get(Te);
            e &&
                (e.clearSound(),
                t && t.clearSnapshots(),
                n && (e.loadSound(n), t.clearSnapshots(), t.saveAllSnapshot()));
        },
        E_ = () => {
            const n = b.get(Te);
            n && n.clearSound();
        },
        O_ = () => {
            const n = b.get(Ne);
            n && n.clearSnapshots();
        },
        k_ = () => b.get(Te).exportAudioBuffer(),
        Rc = new Set(),
        z_ = (n) => {
            const t = b.sub(Bi, () => {
                n(b.get(Bi));
            });
            Rc.add(t);
        },
        P_ = () => {
            Rc.forEach((n) => {
                n();
            });
        },
        R_ = () => {
            const n = b.get(po),
                t = b.get(Ne),
                e = b.get(Te);
            n && n.unmount(), t && t.destroy(), e && e.destroy();
        };
    return (
        (Tt.clearHistory = O_),
        (Tt.clearSound = E_),
        (Tt.destroy = R_),
        (Tt.getAudioBuffer = k_),
        (Tt.isModified = L_),
        (Tt.loadSound = C_),
        (Tt.loadSoundByUrl = b_),
        (Tt.redo = D_),
        (Tt.registExportFunction = z_),
        (Tt.renderSoundEditor = v_),
        (Tt.undo = w_),
        (Tt.unregistExportFunction = P_),
        Object.defineProperty(Tt, Symbol.toStringTag, { value: 'Module' }),
        Tt
    );
})({}, React, ReactDOM);
