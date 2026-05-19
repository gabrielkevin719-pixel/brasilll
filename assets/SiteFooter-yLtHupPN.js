import {
    r as o,
    j as e,
    L as i
} from "./index-veYHHRf4.js";
const d = (...s) => s.filter((a, r, t) => !!a && a.trim() !== "" && t.indexOf(a) === r).join(" ").trim();
const u = s => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const g = s => s.replace(/^([A-Z])|[\s-_]+(\w)/g, (a, r, t) => t ? t.toUpperCase() : r.toLowerCase());
const x = s => {
    const a = g(s);
    return a.charAt(0).toUpperCase() + a.slice(1)
};
var f = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
const v = s => {
    for (const a in s)
        if (a.startsWith("aria-") || a === "role" || a === "title") return !0;
    return !1
};
const N = o.forwardRef(({
    color: s = "currentColor",
    size: a = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: t,
    className: c = "",
    children: l,
    iconNode: m,
    ...n
}, p) => o.createElement("svg", {
    ref: p,
    ...f,
    width: a,
    height: a,
    stroke: s,
    strokeWidth: t ? Number(r) * 24 / Number(a) : r,
    className: d("lucide", c),
    ...!l && !v(n) && {
        "aria-hidden": "true"
    },
    ...n
}, [...m.map(([b, j]) => o.createElement(b, j)), ...Array.isArray(l) ? l : [l]]));
const h = (s, a) => {
    const r = o.forwardRef(({
        className: t,
        ...c
    }, l) => o.createElement(N, {
        ref: l,
        iconNode: a,
        className: d(`lucide-${u(x(s))}`, `lucide-${s}`, t),
        ...c
    }));
    return r.displayName = x(s), r
};
const w = [
        ["path", {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }],
        ["circle", {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }]
    ],
    y = h("search", w);
const k = [
        ["path", {
            d: "M16 10a4 4 0 0 1-8 0",
            key: "1ltviw"
        }],
        ["path", {
            d: "M3.103 6.034h17.794",
            key: "awc11p"
        }],
        ["path", {
            d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
            key: "o988cm"
        }]
    ],
    C = h("shopping-bag", k);

function L() {
    return e.jsx("header", {
        className: "sticky top-0 z-50 border-b border-border bg-canvas/85 backdrop-blur-md",
        children: e.jsxs("div", {
            className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4",
            children: [e.jsx(i, {
                to: "/",
                className: "font-display text-2xl uppercase tracking-tighter italic",
                children: "Camisas do Brasil"
            }), e.jsxs("nav", {
                className: "hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest",
                children: [e.jsx(i, {
                    to: "/",
                    activeOptions: {
                        exact: !0
                    },
                    activeProps: {
                        className: "text-brasil-green"
                    },
                    className: "hover:text-brasil-green transition-colors",
                    children: "Início"
                }), e.jsx(i, {
                    to: "/colecao/oficial",
                    activeProps: {
                        className: "text-brasil-green"
                    },
                    className: "hover:text-brasil-green transition-colors",
                    children: "Oficial"
                }), e.jsx(i, {
                    to: "/colecao/retro",
                    activeProps: {
                        className: "text-brasil-green"
                    },
                    className: "hover:text-brasil-green transition-colors",
                    children: "Retrô"
                }), e.jsx(i, {
                    to: "/historia",
                    activeProps: {
                        className: "text-brasil-green"
                    },
                    className: "hover:text-brasil-green transition-colors",
                    children: "História"
                })]
            }), e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [e.jsx("button", {
                    "aria-label": "Buscar",
                    className: "p-2 hover:text-brasil-green transition-colors",
                    children: e.jsx(y, {
                        className: "size-4"
                    })
                }), e.jsxs("button", {
                    "aria-label": "Sacola",
                    className: "flex items-center gap-2 bg-ink text-canvas px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brasil-green transition-colors",
                    children: [e.jsx(C, {
                        className: "size-3.5"
                    }), " Sacola (0)"]
                })]
            })]
        })
    })
}

function S() {
    return e.jsx("footer", {
        className: "bg-ink text-canvas px-6 pt-20 pb-10 mt-20",
        children: e.jsxs("div", {
            className: "mx-auto max-w-7xl",
            children: [e.jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-canvas/10",
                children: [e.jsxs("div", {
                    className: "col-span-2",
                    children: [e.jsx("h3", {
                        className: "font-display text-3xl uppercase tracking-tighter italic",
                        children: "Camisas do Brasil"
                    }), e.jsx("p", {
                        className: "mt-4 max-w-sm text-sm text-canvas/60 leading-relaxed",
                        children: "A maior curadoria de mantos da Seleção Brasileira. Lançamentos oficiais e edições retrô para o verdadeiro torcedor."
                    }), e.jsxs("form", {
                        className: "mt-6 flex max-w-sm border-b border-canvas/30 pb-2",
                        children: [e.jsx("input", {
                            type: "email",
                            placeholder: "SEU E-MAIL",
                            className: "flex-1 bg-transparent text-xs uppercase tracking-widest outline-none placeholder:text-canvas/40"
                        }), e.jsx("button", {
                            className: "text-[10px] font-bold uppercase tracking-widest hover:text-brasil-yellow",
                            children: "Assinar"
                        })]
                    })]
                }), e.jsxs("div", {
                    children: [e.jsx("h4", {
                        className: "font-mono text-[10px] font-bold uppercase tracking-widest text-brasil-yellow mb-4",
                        children: "Loja"
                    }), e.jsxs("ul", {
                        className: "space-y-2 text-sm text-canvas/70",
                        children: [e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Lançamentos"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Coleção Retrô"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Oficiais 2024"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Acessórios"
                            })
                        })]
                    })]
                }), e.jsxs("div", {
                    children: [e.jsx("h4", {
                        className: "font-mono text-[10px] font-bold uppercase tracking-widest text-brasil-yellow mb-4",
                        children: "Suporte"
                    }), e.jsxs("ul", {
                        className: "space-y-2 text-sm text-canvas/70",
                        children: [e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Envios"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Trocas"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Tabela de Medidas"
                            })
                        }), e.jsx("li", {
                            children: e.jsx("a", {
                                href: "#",
                                className: "hover:text-brasil-yellow",
                                children: "Contato"
                            })
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "pt-8 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-widest text-canvas/40",
                children: [e.jsx("p", {
                    children: "© 2026 Camisas do Brasil — Feito com paixão pela Amarelinha."
                }), e.jsx("p", {
                    children: "Pagamento seguro · Frete para todo o Brasil"
                })]
            })]
        })
    })
}
export {
    L as S, S as a, h as c
};