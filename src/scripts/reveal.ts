// Adds data-revealed to [data-reveal] elements the first time they scroll into view.
const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.setAttribute("data-revealed", ""));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  items.forEach((el) => observer.observe(el));
}
