import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js の推奨設定を読み込む
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // 未使用変数エラーの抑制設定
  {
    rules: {
      // JavaScript コアルール
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^setScore$',
        argsIgnorePattern: '^_'
      }],
      // TypeScript 用ルール
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^setScore$',
        argsIgnorePattern: '^_'
      }]
    }
  }
];

export default eslintConfig;
