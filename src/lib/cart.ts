"use client";

import { useSyncExternalStore } from "react";

/**
 * Guest shopping bag, persisted in localStorage and shared across tabs.
 * Only ids and quantities are stored; names and prices always come from the catalog,
 * and the server re-prices everything at checkout.
 */
export type CartLine = { id: string; qty: number };

const STORAGE_KEY = "amalia-cart-v1";
export const MAX_QTY = 10;

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let lines: CartLine[] | null = null;

function load(): CartLine[] {
    if (lines) return lines;

    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        lines = Array.isArray(parsed)
            ? parsed.filter((line): line is CartLine => typeof line?.id === "string" && Number.isInteger(line?.qty) && line.qty > 0)
            : [];
    } catch {
        lines = [];
    }

    return lines;
}

function save(next: CartLine[]) {
    lines = next;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Private mode / full storage: the bag still works for this page view.
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) return;
        lines = null;
        listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

const clamp = (qty: number) => Math.max(1, Math.min(MAX_QTY, Math.round(qty)));

export const cart = {
    add(id: string, qty = 1) {
        const current = load();
        const existing = current.find((line) => line.id === id);
        save(
            existing
                ? current.map((line) => (line.id === id ? { ...line, qty: clamp(line.qty + qty) } : line))
                : [...current, { id, qty: clamp(qty) }]
        );
    },
    setQty(id: string, qty: number) {
        save(load().map((line) => (line.id === id ? { ...line, qty: clamp(qty) } : line)));
    },
    remove(id: string) {
        save(load().filter((line) => line.id !== id));
    },
    clear() {
        save([]);
    },
};

export function useCart() {
    const current = useSyncExternalStore(subscribe, load, () => EMPTY);
    const count = current.reduce((sum, line) => sum + line.qty, 0);

    return { lines: current, count };
}
