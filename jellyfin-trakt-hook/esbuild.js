const esbuild = require("esbuild");

esbuild.build({
  //inject: ["cjs-shim.ts"],
  entryPoints: ["src/index.js"],
  bundle: true,
  sourcemap: "inline",
  platform: "node",
  target: "node22",
  //external: ["fs", "child_process", "crypto", "os", "path"],
  //plugins: [externalNativeModulesPlugin(externalizedModules)],

  format: "cjs",
  outfile: "bundle.cjs",

  //format: "esm",
  //outfile: "out2.mjs",
});
