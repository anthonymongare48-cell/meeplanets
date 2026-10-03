import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { void: "#070707", ember: "#ff6b22" } } },
  plugins: []
};
export default config;
