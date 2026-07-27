/**
 * Light/Dark tema altyapısı (PRD 5.L, 9. madde madde 6/7).
 * Faz 0 kapsamı: yalnızca tercih saklama + <html> class toggling.
 * Henüz ayrı bir "dark" görsel tasarım yok — bu yalnızca altyapı.
 */
import type { ThemeMode } from "@kampla/shared";

const STORAGE_KEY = "kampla_theme";

export function useTheme() {
  const mode = useState<ThemeMode>("kampla-theme-mode", () => "system");

  const apply = (value: ThemeMode) => {
    if (!import.meta.client) return;
    const isDark =
      value === "dark" ||
      (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  };

  const setMode = (value: ThemeMode) => {
    mode.value = value;
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, value);
    }
    apply(value);
  };

  const init = () => {
    if (!import.meta.client) return;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    mode.value = stored ?? "system";
    apply(mode.value);
  };

  return { mode, setMode, init };
}
