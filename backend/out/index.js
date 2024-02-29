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
/* hibaüzenetek: 404 : szerver feleli hogy nincs ilyen resource
500: szerver adja meg magát, szerveroldali hiba
400: a kliens küldött orssz requestet (nem létezik)
400 as hibák a kliens oldaliak
400: sim ross zrequest
404: not found
500 as hibák a szerveroldaliak
200 asok a sikeresek
300 asok : átirányítások, redirect-ek */
/* res.json:
ez beállítja a 200 as statuszkodot
ez beállitja hogy a headerben legyen ott hogy content type hogy jsont valaszol
az odaadott objectet json stringgé alakitja (jaavscript objectbol karakterlancot csinal)
Mindezt megcsinalja egy sorba */
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const promises_1 = __importDefault(require("fs/promises"));
const cors_1 = __importDefault(require("cors"));
console.log("hello");
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
// ha egy olyan http requestet indit meg a neten ketresztül aminek a headerben ottavcn hogy content type hogy application json akkor a body tudja hogy json szerint parsolni fogja
const QueryParamSchema = zod_1.z.object({
    min: zod_1.z.coerce.number(),
    max: zod_1.z.coerce.number(),
});
const CountrySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    population: zod_1.z.number(),
});
const CreateCountrySchema = zod_1.z.object({
    name: zod_1.z.string(),
    population: zod_1.z.number(),
});
const readFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield promises_1.default.readFile(`${__dirname}/../database.json`, "utf-8");
        const countries = JSON.parse(rawData);
        return countries;
    }
    catch (error) {
        return null;
    }
});
server.get("/api/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = QueryParamSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json(result.error.issues);
    }
    const countries = yield readFile();
    if (countries === null) {
        res.sendStatus(500);
        return;
    }
    const queryParam = result.data;
    const filteredCountries = countries.filter((country) => country.population > queryParam.min && country.population < queryParam.max);
    res.json(filteredCountries);
}));
server.post("/api/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = CreateCountrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(result.error.issues);
    }
    console.log(result.data);
    const countries = yield readFile();
    if (countries === null) {
        res.sendStatus(500);
        return;
    }
    const randomNumber = Math.random();
    /*   const country = result.data; */
    countries.push(Object.assign(Object.assign({}, result.data), { id: randomNumber }));
    yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(countries, null, 2));
    //Json stringify egy javascript objectbol csinal egy karakterlancot
    res.json({ id: randomNumber });
}));
// országok törlése :
server.delete("/api/countries/:x", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("valami");
    const id = +req.params.x;
    const countries = yield readFile();
    if (countries === null) {
        res.sendStatus(500);
        return;
    }
    const filteredCountries = countries.filter((country) => country.id !== id);
    yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(filteredCountries, null, 2));
    res.sendStatus(200);
}));
server.patch(`/api/countries/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const countries = yield readFile();
    if (countries === null) {
        res.sendStatus(500);
        return;
    }
    let countryToUpdate = countries.find((country) => country.id === id);
    if (!countryToUpdate)
        return res.sendStatus(400);
    const result = CreateCountrySchema.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.issues);
    const updatedCountries = countries.map((country) => {
        if (country.id === id) {
            return Object.assign(Object.assign({}, result.data), { id });
        }
        return country;
    });
    yield promises_1.default.writeFile(`${__dirname}/../database.json`, JSON.stringify(updatedCountries, null, 2));
    res.sendStatus(200);
}));
server.listen(4003);
