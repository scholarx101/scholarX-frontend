import React, { useEffect } from "react";

// Minimal, safe shim for react-helmet-async API used in the app.
// - Provides HelmetProvider and Helmet with a tiny subset of behavior (sets document.title)
// - Intended as a reversible, low-risk replacement while running on React 19

export function HelmetProvider({ children }) {
  return <>{children}</>;
}

export function Helmet({ children }) {
  useEffect(() => {
    if (!children) return;

    // Common usage is: <Helmet><title>Page title</title></Helmet>
    // We support simple string children and <title> element children.
    const collectTitle = (node) => {
      if (typeof node === "string") return node;
      if (!node) return "";
      if (Array.isArray(node)) return node.map(collectTitle).join("");
      if (node.props && node.props.children) return collectTitle(node.props.children);
      return "";
    };

    const t = collectTitle(children).trim();
    if (t) document.title = t;
  }, [children]);
  return null;
}
