import { createServerFn } from "@tanstack/react-start";

console.log("createServerFn function:", createServerFn);
const builder = createServerFn({ method: "POST" });
console.log("Builder prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(builder)));
console.log("Builder keys:", Object.keys(builder));
