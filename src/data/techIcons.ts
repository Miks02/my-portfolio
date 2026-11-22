// Tech logos from devicon, imported as raw SVG strings and inlined at build time (no client JS).
// Fills are stripped and the icon renders in `currentColor`, which the strip sets to the brand color (design.md exception).

import angular from "devicon/icons/angular/angular-plain.svg?raw";
import csharp from "devicon/icons/csharp/csharp-plain.svg?raw";
import dotnet from "devicon/icons/dotnetcore/dotnetcore-plain.svg?raw";
import efcore from "devicon/icons/entityframeworkcore/entityframeworkcore-plain.svg?raw";
import git from "devicon/icons/git/git-plain.svg?raw";
import sqlserver from "devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg?raw";
import mysql from "devicon/icons/mysql/mysql-original.svg?raw";
import postgresql from "devicon/icons/postgresql/postgresql-plain.svg?raw";
import tailwind from "devicon/icons/tailwindcss/tailwindcss-original.svg?raw";
import typescript from "devicon/icons/typescript/typescript-plain.svg?raw";

// `brand` is the logo's original color.
const icons = {
  angular: { svg: angular, brand: "#DD0031" },
  typescript: { svg: typescript, brand: "#3178C6" },
  tailwind: { svg: tailwind, brand: "#38BDF8" },
  csharp: { svg: csharp, brand: "#9B4F96" },
  dotnet: { svg: dotnet, brand: "#512BD4" },
  efcore: { svg: efcore, brand: "#512BD4" },
  postgresql: { svg: postgresql, brand: "#4169E1" },
  mysql: { svg: mysql, brand: "#4479A1" },
  sqlserver: { svg: sqlserver, brand: "#EE352C" },
  git: { svg: git, brand: "#F05032" },
} as const;

export type TechIconKey = keyof typeof icons;

/** Decorative icon with its fills removed and `currentColor` on the root. */
export function techIcon(key: TechIconKey, className = ""): string {
  return icons[key].svg
    .replace(/\sfill="[^"]*"/g, "")
    .replace(
      "<svg ",
      `<svg fill="currentColor" aria-hidden="true" focusable="false" class="${className}" `,
    );
}

/** The logo's original brand color. */
export function techBrandColor(key: TechIconKey): string {
  return icons[key].brand;
}
