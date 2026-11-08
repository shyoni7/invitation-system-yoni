import { createElement, type ComponentType } from "react";
import type { TemplateProps } from "./types";
import ClassicTemplate from "./classic/Template";
import MinimalTemplate from "./minimal/Template";
import MidnightTemplate from "./midnight/Template";

// Templates without a component yet fall back to the closest finished one.
const components: Record<string, ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  midnight: MidnightTemplate,
  floral: ClassicTemplate,
  gold: MidnightTemplate,
  kids: MinimalTemplate,
  corporate: MinimalTemplate,
  tech: MidnightTemplate,
  festive: ClassicTemplate,
  romantic: ClassicTemplate,
};

export function renderTemplate(id: string, props: TemplateProps) {
  return createElement(components[id] ?? ClassicTemplate, props);
}
