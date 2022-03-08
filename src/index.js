import app from "./app";

async function main() {
  await app.listen(4000);
  console.log("backend on port 4000");
}

main();
