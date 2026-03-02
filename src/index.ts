#!/usr/bin/env node

const useHttp = process.env.TRANSPORT === "http" || process.argv.includes("--http");

if (useHttp) {
  const { startHttp } = await import("./transport-http.js");
  await startHttp();
} else {
  const { startStdio } = await import("./transport-stdio.js");
  await startStdio();
}
