"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const fs_1 = __importStar(require("fs"));
// először simán szervert csiálo, ami jsont ad vissza
const QueryParamSchema = zod_1.z.object({
    min: zod_1.z.coerce.number(),
    max: zod_1.z.coerce.number(),
});
const CountrySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    population: zod_1.z.number(),
});
const rawData = fs_1.default.readfileSync(`${__dirname}/../database.json`, "utf-8");
const countries = JSON.parse(rawData);
const server = (0, express_1.default)();
const countries = [
    {
        name: "Hungary",
        population: 9500000,
    },
    {
        name: "Austria",
        population: 12500000,
    },
];
server.get("/api/countries", (req, res) => {
    const result = QueryParamSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json(result.error.issues);
    }
    const queryParams = result.data;
    const filteredCountries = countries.filter((country) => country.population > queryParams.min &&
        country.population < queryParams.max);
    res.json(countries);
});
/* server.get("/api/cities", (req, res) => {
  res.json({
    data: ["Budapest", "London"],
  });
}); */
server.post("/api/countries", (req, res) => {
    const result = CountrySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json(result.error.issues);
    }
    const country = result.data;
    countries.push(req.query);
    const res, json;
    (200);
});
// -----------------------------  pénteki óra
//ha jön req hoygtöröljek valamit akkor igy tudom megtenni :
server.delete(`/api/countries/:name`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    console.log(name);
    const countries = yield (0, fs_1.readFile)();
    const filteredCountries = countries.filter(country => CountrySchema.name !== name);
    yield fs_1.default.writeFile(`${__dirname} /../countries.json`, JSON.stringify(filteredCountries, null, 2));
    res.json("success");
}));
// id-kat pakolunk bele most a dologba
server.listen(4000);
