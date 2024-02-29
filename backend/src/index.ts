/* https://medium.com/@nadinCodeHat/rest-api-naming-conventions-and-best-practices-1c4e781eb6a5
https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/ */

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

import express from "express";
import { z } from "zod";
import filesystem from "fs/promises";
import cors from "cors";

console.log("hello");

const server = express();
server.use(cors());
server.use(express.json());
// ha egy olyan http requestet indit meg a neten ketresztül aminek a headerben ottavcn hogy content type hogy application json akkor a body tudja hogy json szerint parsolni fogja

const QueryParamSchema = z.object({
  min: z.coerce.number(),
  max: z.coerce.number(),
});

type Country = z.infer<typeof CountrySchema>;

const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  population: z.number(),
});

const CreateCountrySchema = z.object({
  name: z.string(),
  population: z.number(),
});

const readFile = async () => {
  try {
    const rawData = await filesystem.readFile(
      `${__dirname}/../database.json`,
      "utf-8"
    );
    const countries: Country[] = JSON.parse(rawData);
    return countries;
  } catch (error) {
    return null;
  }
};
server.get("/api/countries", async (req, res) => {
  const result = QueryParamSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }

  const countries = await readFile();
  if (countries === null) {
    res.sendStatus(500);
    return;
  }

  const queryParam = result.data;

  const filteredCountries = countries.filter(
    (country) =>
      country.population > queryParam.min && country.population < queryParam.max
  );

  res.json(filteredCountries);
});

server.post("/api/countries", async (req, res) => {
  const result = CreateCountrySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  console.log(result.data);
  const countries = await readFile();
  if (countries === null) {
    res.sendStatus(500);
    return;
  }
  const randomNumber = Math.random();

  /*   const country = result.data; */

  countries.push({
    ...result.data,
    id: randomNumber,
  });

  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(countries, null, 2)
  );
  //Json stringify egy javascript objectbol csinal egy karakterlancot

  res.json({ id: randomNumber });
});

// ---------------delete carts

server.delete("/api/countries/:id", async (req, res) => {
  const id = +req.params.id;
  const countries = await readFile();
  if (countries === null) {
    res.sendStatus(500);
    return;
  }
  const filteredCountries = countries.filter((country) => country.id !== id);
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(filteredCountries, null, 2)
  );
  res.sendStatus(200);
});

//----------------------------------

server.patch(`/api/countries/:id`, async (req, res) => {
  const id = +req.params.id;
  const countries = await readFile();
  if (countries === null) {
    res.sendStatus(500);
    return;
  }
  let countryToUpdate = countries.find((country) => country.id === id);
  if (!countryToUpdate) return res.sendStatus(400);

  const result = CreateCountrySchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.issues);

  const updatedCountries = countries.map((country) => {
    if (country.id === id) {
      return { ...result.data, id };
    }
    return country;
  });

  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(updatedCountries, null, 2)
  );
  res.sendStatus(200);
});

server.listen(4003);
