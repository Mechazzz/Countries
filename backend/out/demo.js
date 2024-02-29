"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const PersonSchema = zod_1.z.object({
    name: zod_1.z.string(),
    age: zod_1.z.number(),
});
let result = PersonSchema.safeParse("");
console.log("-----------------------------");
console.log("result", result);
