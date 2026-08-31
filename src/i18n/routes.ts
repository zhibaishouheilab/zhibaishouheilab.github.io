import { en } from "./en";
import { zh } from "./zh";

export type Locale = "en" | "zh";
export const dictionaries = { en, zh } as const;

export const navigationRoutes = [
  "home",
  "about",
  "publications",
  "research",
  "presentations",
  "resources",
  "cv",
  "contact",
] as const;
export const routeNames = [
  ...navigationRoutes,
  "news",
  "privacy",
  "researchCervical",
  "researchVertebral",
  "researchAnomaly",
] as const;
export type RouteName = (typeof routeNames)[number];

const routeSegments: Record<RouteName, string> = {
  home: "",
  about: "about/",
  publications: "publications/",
  research: "research/",
  presentations: "presentations/",
  resources: "resources/",
  cv: "cv/",
  contact: "contact/",
  news: "news/",
  privacy: "privacy/",
  researchCervical: "research/cervical-spine-imaging/",
  researchVertebral: "research/vertebral-fracture-assessment/",
  researchAnomaly: "research/medical-anomaly-detection/",
};

export function pathFor(locale: Locale, route: RouteName): string {
  const segment = routeSegments[route];
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
