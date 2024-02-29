import { z } from "zod";

const PersonSchema = z.object({
  name: z.string(),
  age: z.number(),
});

let result = PersonSchema.safeParse("");

console.log("-----------------------------");
console.log("result", result);
