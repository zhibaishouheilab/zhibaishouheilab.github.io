import { en } from "./en";
import { zh } from "./zh";

export type Locale = "en" | "zh";
export const dictionaries = { en, zh } as const;

export const routeNames = [
  "home",
  "about",
  "publications",
  "research",
  "cv",
  "contact",
] as const;
export type RouteName = (typeof routeNames)[number];

export function pathFor(locale: Locale, route: RouteName): string {
  const segment = route === "home" ? "" : `${route}/`;
  return locale === "zh" ? `/zh/${segment}` : `/${segment}`;
}

export function alternatePath(pathname: string, locale: Locale): string {
  if (pathname === "/404/" || pathname === "/404.html") {
    return locale === "en" ? "/zh/" : "/";
  }
  if (locale === "en") {
    return pathname === "/" ? "/zh/" : `/zh${pathname}`;
  }
  const withoutZh = pathname.replace(/^\/zh/, "");
  return withoutZh || "/";
}
