// Fixed navbar: solid state after scrolling, active section (home only), mobile menu.

const header = document.querySelector<HTMLElement>("[data-navbar]");
const sentinel = document.querySelector<HTMLElement>("[data-nav-sentinel]");
const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
const menu = document.getElementById("mobile-menu");
const scrim = document.querySelector<HTMLElement>("[data-nav-scrim]");

if (header && sentinel && toggle && menu) {
  // --- Solid state once the 1px sentinel scrolls out of view ---
  new IntersectionObserver(([entry]) => {
    header.toggleAttribute("data-scrolled", !entry.isIntersecting);
  }).observe(sentinel);

  // --- Active section (home page only) ---
  // A section belongs to the nav link with the same id, or to the one named in its
  // `data-nav-section` attribute (e.g. Other projects → "projects").
  if (header.hasAttribute("data-track-sections")) {
    const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
    const ids = new Set([...links].map((link) => link.dataset.navLink));
    const sections = [
      ...[...ids].map((id) => (id ? document.getElementById(id) : null)),
      ...document.querySelectorAll<HTMLElement>("[data-nav-section]"),
    ].filter((el): el is HTMLElement => el !== null);

    const navIdOf = (section: Element) =>
      (section as HTMLElement).dataset.navSection ?? section.id;

    const setActive = (id: string | null) => {
      links.forEach((link) => {
        if (link.dataset.navLink === id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    // Sections currently crossing a thin band in the middle of the viewport.
    const inBand = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const active = [...inBand].at(-1);
        setActive(active ? navIdOf(active) : null);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // --- Mobile menu ---
  const desktop = window.matchMedia("(min-width: 48rem)");
  const firstLink = menu.querySelector<HTMLAnchorElement>("a");

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  const setOpen = (open: boolean, restoreFocus = true) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? "",
    );
    menu.hidden = !open;
    if (scrim) scrim.hidden = !open;
    header.toggleAttribute("data-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";

    if (open) firstLink?.focus();
    else if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  scrim?.addEventListener("click", () => setOpen(false));

  menu.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) setOpen(false, false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setOpen(false);
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches && isOpen()) setOpen(false, false);
  });
}
