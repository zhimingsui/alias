import json from "@rollup/plugin-json";
// import terser from "@rollup/plugin-terser";
import html from "@rollup/plugin-html";
import swc from "@rollup/plugin-swc";
import serve from "rollup-plugin-serve";
import styles from "rollup-plugin-styles";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "esm",
    // plugins: [terser()],
    assetFileNames: "[name]-[hash][extname]",
  },
  plugins: [
    json(),
    styles(),
    html({
      attributes: {
        script: { defer: true },
      },
    }),
    swc(),
    serve("dist"),
  ],
};
