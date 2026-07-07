/**
 * ==========================================================================
 * ED.utils.dom — small DOM helpers shared across components.
 * --------------------------------------------------------------------------
 * Loaded as a classic <script> (not an ES module) on purpose: ES modules
 * are blocked by browsers under the file:// protocol, and this project's
 * one hard requirement (learned the hard way) is that it must keep working
 * when someone just double-clicks index.html. Every module in this project
 * attaches itself to the single global `window.ED` namespace instead.
 * ==========================================================================
 */
window.ED = window.ED || {};
window.ED.utils = window.ED.utils || {};

(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /** Create an element with attributes + children in one call. */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function isBlank(v) { return v === undefined || v === null || String(v).trim() === ''; }

  /** Debounce: delays calling fn until `wait` ms after the last call. */
  function debounce(fn, wait) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /** Normalize a name for case/whitespace-insensitive join-key matching. */
  function normalizeKey(v) {
    return isBlank(v) ? '' : String(v).trim().toLowerCase();
  }

  window.ED.utils.dom = { $, $all, escapeHtml, el, isBlank, debounce, normalizeKey };
})();
