import {
    j as r
} from "./index-veYHHRf4.js";
const s = "/assets/jersey-2024-home-9RZ9xY_P.webp",
    t = "/assets/jersey-2025-N-bBGnuX.webp",
    o = "/assets/jersey-2026-away-E1oLqLlO.webp",
    n = "/assets/jersey-retro-1970-BlROcD2P.jpg",
    l = "/assets/jersey-retro-1994-C8TSZE6B.jpg",
    c = "/assets/jersey-retro-2002-B_LmfDjS.jpg",
    d = [{
        id: "brasil-2024-home",
        name: "Brasil Home 2024",
        subtitle: "Manto Oficial · Temporada Atual",
        year: "2024",
        price: 349.9,
        originalPrice: 499.9,
        image: s,
        category: "oficial",
        badge: "Mais Vendida"
    }, {
        id: "brasil-2025",
        name: "Brasil Edição 2025",
        subtitle: "Versão Torcedor Premium",
        year: "2025",
        price: 329.9,
        originalPrice: 449.9,
        image: t,
        category: "oficial",
        badge: "Novo"
    }, {
        id: "brasil-2026-away",
        name: "Brasil Away 2026",
        subtitle: "Reserva Azul Marinho",
        year: "2026",
        price: 379.9,
        originalPrice: 519.9,
        image: o,
        category: "oficial",
        badge: "Pré-Venda"
    }, {
        id: "retro-1970",
        name: "Retrô Tri 1970",
        subtitle: "Edição Comemorativa Pelé",
        year: "1970",
        price: 289.9,
        originalPrice: 399.9,
        image: n,
        category: "retro",
        badge: "Clássica"
    }, {
        id: "retro-1994",
        name: "Retrô Tetra 1994",
        subtitle: "Romário & Bebeto",
        year: "1994",
        price: 279.9,
        originalPrice: 379.9,
        image: l,
        category: "retro"
    }, {
        id: "retro-2002",
        name: "Retrô Penta 2002",
        subtitle: "Ronaldo, Rivaldo, Ronaldinho",
        year: "2002",
        price: 299.9,
        originalPrice: 419.9,
        image: c,
        category: "retro",
        badge: "Icônica"
    }],
    i = e => e.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

function m({
    product: e
}) {
    const a = e.originalPrice ? Math.round((e.originalPrice - e.price) / e.originalPrice * 100) : 0;
    return r.jsxs("article", {
        className: "group cursor-pointer",
        children: [r.jsxs("div", {
            className: "relative aspect-[4/5] overflow-hidden bg-muted border border-border group-hover:border-brasil-green transition-colors",
            children: [r.jsx("img", {
                src: e.image,
                alt: e.name,
                loading: "lazy",
                width: 800,
                height: 1e3,
                className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            }), e.badge && r.jsx("span", {
                className: "absolute top-3 left-3 bg-ink text-canvas px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                children: e.badge
            }), a > 0 && r.jsxs("span", {
                className: "absolute top-3 right-3 bg-brasil-yellow text-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                children: ["-", a, "%"]
            })]
        }), r.jsxs("div", {
            className: "mt-5 flex items-start justify-between gap-4",
            children: [r.jsxs("div", {
                className: "min-w-0",
                children: [r.jsx("h3", {
                    className: "font-display text-xl uppercase tracking-tight truncate",
                    children: e.name
                }), r.jsx("p", {
                    className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1 truncate",
                    children: e.subtitle
                })]
            }), r.jsxs("div", {
                className: "text-right shrink-0",
                children: [e.originalPrice && r.jsx("p", {
                    className: "text-xs text-muted-foreground line-through",
                    children: i(e.originalPrice)
                }), r.jsx("p", {
                    className: "font-display text-xl text-brasil-green",
                    children: i(e.price)
                })]
            })]
        })]
    })
}
export {
    m as P, s as j, d as p
};