// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // global ignores (keep your existing ignores and add generated paths)
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "lib/generated/**",
      "lib/generated/prisma/**",
      "prisma/**",
    ],
  },

  // YOUR REGULAR RULES / overrides
  // Add an override for generated files to turn off rules that clash with generated bundles.
  {
    files: ["lib/generated/**", "lib/generated/**/*.js", "lib/generated/**/*.ts", "prisma/**", "prisma/**"],
    rules: {
      // lots of generated code patterns: disable these rules for those files
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-unused-expressions": "off",
      "no-console": "off",
      "no-shadow": "off",
    },
  },

  // Optionally, you can add other overrides for build-time bundles if necessary.
];

export default eslintConfig;
