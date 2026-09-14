/**
 * One Storyblok bridge for the whole page, loaded only inside the editor.
 *
 * There were two instances before this: StoryblokBridge created one to enable
 * click-to-select, PackageCardsLive created another to subscribe to keystrokes.
 * The bridge binds click handlers to every `data-blok-c` element when it starts,
 * so two of them bind twice over the same nodes, and which one wins a click is
 * not something to leave to chance. Everything now shares this single instance.
 */

type BridgeInstance = {
  on?: (events: string[], cb: (event: unknown) => void) => void;
};

const SCRIPT = "https://app.storyblok.com/f/storyblok-v2-latest.js";

const SESSION_FLAG = "nlds:storyblok-editor";

/**
 * True only inside Storyblok's editor iframe.
 *
 * `_storyblok` is appended by the editor and by nothing else, and the frame
 * check means a guessed URL in a normal tab still loads no third-party script.
 *
 * REMEMBERED ACROSS PAGES IN THE SAME FRAME. The editor adds `_storyblok` to the
 * page it opens, but following a link inside the preview drops it, so the home
 * page reached from /packages used to fall back to visitor mode: nothing live,
 * nothing clickable. The first page that sees the parameter records it in
 * sessionStorage, which is scoped to this tab and, inside a third-party frame,
 * partitioned to it, so an ordinary visit in a normal tab never sees the flag.
 *
 * The frame check stays mandatory either way, and public/_headers only allows
 * app.storyblok.com (and this site) to frame these pages at all. Storyblok's
 * own bridge does not need the parameter; only this gate did.
 */
export function inVisualEditor(): boolean {
  if (typeof window === "undefined") return false;
  if (window.self === window.top) return false;

  if (new URLSearchParams(window.location.search).has("_storyblok")) {
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // Storage blocked: this page still works, later pages fall back to visitor.
    }
    return true;
  }
  try {
    return sessionStorage.getItem(SESSION_FLAG) === "1";
  } catch {
    return false;
  }
}

let pending: Promise<BridgeInstance | null> | undefined;

/** Resolves with the shared bridge, or null when not in the editor. */
export function getBridge(): Promise<BridgeInstance | null> {
  if (!inVisualEditor()) return Promise.resolve(null);
  pending ??= load();
  return pending;
}

function load(): Promise<BridgeInstance | null> {
  return new Promise((resolve) => {
    const start = () => {
      const Ctor = (
        window as unknown as {
          StoryblokBridge?: new (options?: unknown) => BridgeInstance;
        }
      ).StoryblokBridge;
      resolve(Ctor ? new Ctor() : null);
    };

    if ((window as unknown as { StoryblokBridge?: unknown }).StoryblokBridge) {
      start();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT}"]`,
    );
    if (existing) {
      existing.addEventListener("load", start, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.addEventListener("load", start, { once: true });
    script.addEventListener("error", () => resolve(null), { once: true });
    document.head.appendChild(script);
  });
}
