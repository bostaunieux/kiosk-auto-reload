import commonjs from "@rollup/plugin-commonjs";
import eslint from "@rollup/plugin-eslint";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ["./dist"],
  host: "0.0.0.0",
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};

const plugins = [
  nodeResolve(),
  json(),
  commonjs(),
  eslint(),
  typescript(),
  ...(dev ? [serve(serveOptions)] : [terser()]),
];

export default [
  {
    input: "src/kiosk-auto-reload.ts",
    output: {
      file: "dist/kiosk-auto-reload.js",
      format: "es",
      inlineDynamicImports: true,
    },
    plugins,
  },
];
