import { useThemeStore } from "../../store/chatStore";

const themeOptions = [
  { key: "light" as const, label: "浅色", description: "适合白天使用" },
  { key: "dark" as const, label: "深色", description: "适合夜间使用" },
];

export default function ThemePage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <main className="h-full bg-[#fafafa] p-6 text-[#19191a] transition-colors dark:bg-[#1e1e1f] dark:text-[#e1e1e5]">
      <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-[#e2e2e4] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-[#2f2f30] dark:bg-[#2a2a2b]/80">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">主题</h2>
          <p className="text-sm text-[#68686d] dark:text-[#b0b0b6]">
            选择一个你喜欢的界面外观。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {themeOptions.map((option) => {
            const isActive = theme === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setTheme(option.key)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#19ac70] bg-[#19ac70]/10 text-[#0f6b49] dark:border-[#19ac70] dark:bg-[#19ac70]/20 dark:text-[#7ee0b3]"
                    : "border-[#e2e2e4] bg-[#fafafa] text-[#19191a] hover:border-[#cfd0d4] dark:border-[#2f2f30] dark:bg-[#232324] dark:text-[#e1e1e5]"
                }`}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="mt-1 text-xs text-[#68686d] dark:text-[#b0b0b6]">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
