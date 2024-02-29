"use strict";
/* https://medium.com/@nadinCodeHat/rest-api-naming-conventions-and-best-practices-1c4e781eb6a5
https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/ */
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
const promises_1 = __importDefault(require("fs/promises"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
const QueryParamSchema = zod_1.z.object({
    min: zod_1.z.coerce.number(),
    max: zod_1.z.coerce.number(),
});
const CountrySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    population: zod_1.z.number(),
});
const CreateCountry = zod_1.z.object({
    name: zod_1.z.string(),
    population: zod_1.z.number(),
});
const readFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield promises_1.default.readFile(`${__dirname}/../database.json`, "utf-8");
    const countries = JSON.parse(data);
    return countries;
});
server.get("/api/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = QueryParamSchema.safeParse(req.query);
    if (!result.success)
        return res.status(400).json(result.error.issues);
    const countries = yield readFile();
    const queryParams = result.data;
    const filteredCountries = countries.filter((country) => country.population > queryParams.min &&
        country.population < queryParams.max);
    res.json(res.sendStatus(200));
}));
server.post("/api/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = CountrySchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.issues);
    const countries = yield readFile();
    /*   const country = result.data; */
    const randomNumber = Math.random();
    countries.push(Object.assign(Object.assign({}, result.data), { id: randomNumber }));
    yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(countries, null, 2));
    res.sendStatus(200);
}));
server.delete("/api/countries/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = +req.params.id;
    const countries = yield readFile();
    const filteredCountries = countries.filter((country) => country.id !== id);
    yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(filteredCountries, null, 2));
    res.json(id, randomNumber);
    //------  szünet után a kövit irtukl be először, modositunk valamit
    server.patch("/api/countries/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = +req.params.id;
        const countries = yield readFile();
        let countryToUpDate = countries.find(country => country.id === id);
        if (!countryToUpDate)
            return res.sendStatus(404);
        const result = CountrySchema.safeParse(req.body);
        if (!result.success)
            return res.status(404).json(result.error.issues);
        const updatedCountries = countries.map(country => {
            if (country.id === id) {
                return Object.assign(Object.assign({}, result.data), { id: id });
            }
            return country;
        });
        yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(updatedCountries, null, 2));
        res.sendStatus(200);
    }));
    server.listen(4000);
    // 18: 20 korül megnézhet mit ,modositott fent
}));
// 18: 20 korül megnézhet mit ,modositott fent
