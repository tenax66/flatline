/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    "use strict";

    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme && storedTheme !== "auto") {
            return storedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    const setTheme = (theme) => {
        if (
            theme === "auto" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    };

    setTheme(getPreferredTheme());

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector("#bd-theme");
        if (!themeSwitcher) return;

        const themeSwitcherText = document.querySelector("#bd-theme-text");
        const activeThemeIcon = document.querySelector(".theme-icon-active use");

        const iconHref = theme === "dark" ? "#moon-stars-fill" : theme === "light" ? "#sun-fill" : "#circle-half";
        if (activeThemeIcon) {
            activeThemeIcon.setAttribute("href", iconHref);
        }

        const labelSource = (themeSwitcherText && themeSwitcherText.textContent) || "Theme";
        themeSwitcher.setAttribute("aria-label", `${labelSource} (${theme})`);

        if (focus) themeSwitcher.focus();
    };

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            const storedTheme = getStoredTheme();
            if (storedTheme !== "light" && storedTheme !== "dark") {
                setTheme(getPreferredTheme());
            }
        });

    window.addEventListener("DOMContentLoaded", () => {
        showActiveTheme(getPreferredTheme());

        const themeSwitchBtn = document.querySelector("#bd-theme");
        if (themeSwitchBtn) {
            themeSwitchBtn.addEventListener("click", () => {
                const current = getStoredTheme() || getPreferredTheme();
                const next = current === "dark" ? "light" : "dark";
                setStoredTheme(next);
                setTheme(next);
                showActiveTheme(next, true);
            });
        }
    });
})();
