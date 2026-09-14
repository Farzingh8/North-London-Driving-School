"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { PublicPackage as PackageBlok } from "@/content/types";
import { computeFacts, type Facts } from "@/content/facts-core";
import { applyEdits, type StoryContent } from "@/components/apply-edit";
import { getBridge, inVisualEditor } from "@/components/storyblok-bridge";

/**
 * The package catalogue as every component on every page sees it, following the
 * Storyblok editor live.
 *
 * WHY ONE PROVIDER IN THE ROOT LAYOUT. Live preview used to be wired per card
 * list, so typing 650 into Bronze moved the Bronze card and nothing else: the
 * "Packages from $599.99" under it, the comparison table, and every price on
 * the home and contact pages stayed put until the rebuild. Now there is one
 * source. The bridge's `input` event carries the whole Packages story on every
 * keystroke; this applies it over the build's catalogue once, and every card,
 * table cell and <Fact> reads the result. It lives in the layout because the
 * layout survives client-side navigation, so an edit typed on /packages is
 * still showing when the preview moves to the home page.
 *
 * VISITORS. Outside the editor the store never starts, the bridge is never
 * fetched, and the context simply holds the catalogue the page was built with.
 */

// ------------------------------------------------------------ live store
// Module scope: one bridge subscription for the whole tab, however many
// components read it, and it outlives any single page.
let latest: StoryContent | null = null;
const listeners = new Set<() => void>();
let started = false;

function start() {
  if (started || !inVisualEditor()) return;
  started = true;
  void getBridge().then((bridge) => {
    // `input` only. Reloading on `published` or `change` threw away the live
    // preview and, on a static export, showed the PREVIOUS build until
    // Cloudflare finished — which reads as the edit having been lost.
    bridge?.on?.(["input"], (event) => {
      const content = (event as { story?: { content?: StoryContent } })?.story?.content;
      // Only the Packages story drives the catalogue. Anything else opened in
      // the editor is ignored rather than blanking the cards.
      if (!content || content.component !== "packages_page") return;
      latest = content;
      listeners.forEach((notify) => notify());
    });
  });
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  start();
  return () => {
    listeners.delete(notify);
  };
}

const getSnapshot = () => latest;
const getServerSnapshot = () => null;

// ------------------------------------------------------------ context
interface Catalogue {
  packages: PackageBlok[];
  lessons: PackageBlok[];
  /** Lenient: never throws mid-edit. The build computes them strictly. */
  facts: Facts;
}

const CatalogueContext = createContext<Catalogue | null>(null);

export function CatalogueProvider({
  packages,
  lessons,
  children,
}: {
  packages: PackageBlok[];
  lessons: PackageBlok[];
  children: ReactNode;
}) {
  const live = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo(() => {
    const p = live ? applyEdits(packages, live.packages) : packages;
    const l = live ? applyEdits(lessons, live.lessons) : lessons;
    return { packages: p, lessons: l, facts: computeFacts(p, false) };
  }, [packages, lessons, live]);

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue(): Catalogue {
  const value = useContext(CatalogueContext);
  if (!value) throw new Error("useCatalogue must be used inside <CatalogueProvider>.");
  return value;
}

/**
 * True once hydrated inside the editor. False during the server render and
 * during hydration, so the hydrated HTML matches the static HTML exactly and
 * the editing attributes appear only afterwards, only in the editor.
 *
 * useSyncExternalStore gives exactly that: React uses the server snapshot while
 * hydrating and re-renders with the client snapshot straight after. It replaces
 * a setState-in-effect, which did the same thing at the cost of an extra render
 * pass that React's lint rule rightly flags. Whether the page is in the editor
 * cannot change during a page's life, so there is nothing to subscribe to.
 */
const noSubscribe = () => () => {};
export function useEditorMode(): boolean {
  return useSyncExternalStore(noSubscribe, inVisualEditor, () => false);
}

/**
 * Attributes that make an element open `pkg`'s form when clicked in the
 * editor, or nothing at all for visitors.
 */
export function useEditable() {
  const editor = useEditorMode();
  return (pkg: PackageBlok | undefined, className?: string) => {
    if (!editor || !pkg?.editable) return className ? { className } : {};
    return {
      ...pkg.editable,
      className: className ? `${className} storyblok__outline` : "storyblok__outline",
    };
  };
}
