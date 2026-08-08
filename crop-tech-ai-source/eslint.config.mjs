import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [".next/**", "dist/**", "server-upload/**", "next-env.d.ts"]
  }
];

export default eslintConfig;
