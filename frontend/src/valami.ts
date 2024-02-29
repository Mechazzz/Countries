import { z } from "zod";
import { safeFetchX } from "./safeFetchX";

const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  population: z.number(),
});

const minElementX = document.getElementById("minimum") as HTMLInputElement;
const maxElementX = document.getElementById("maximum") as HTMLInputElement;
const searchElementX = document.getElementById("search") as HTMLInputElement;

const updatedNameInputX = document.getElementById(
  "updatedNameInput"
) as HTMLInputElement;
const updatedPopulationInputX = document.getElementById(
  "updatedPopulationInput"
) as HTMLInputElement;

const saveButtonX = document.getElementById("save-update") as HTMLButtonElement;
const cancelButtonX = document.getElementById(
  "cancel-update"
) as HTMLButtonElement;

const hideModifyWindowX = () => {
  (document.getElementById("updateInputsDiv") as HTMLDivElement).style.display =
    "none";
};

let countryIDX: number | null = null;

saveButtonX.addEventListener("click", async () => {
  await modifyDataX();
  hideModifyWindowX();
  getDataX();
});

cancelButtonX.addEventListener("click", hideModifyWindowX);

const displayModifyWindowX = () => {
  (document.getElementById("updateInputsDiv") as HTMLDivElement).style.display =
    "flex";
};

const getDataX = async () => {
  if (!minElementX.value) {
    return;
  }
  const response = await safeFetchX(
    "GET",
    `http://localhost:4004/api/countries?min=${minElementX.value}&max=${maxElementX.value}`
  );

  if (!response.success) {
    alert(response.status);
    return;
  }
  if (response.status >= 500) {
    return;
  }

  const appElementX = document.getElementById("app") as HTMLDivElement;
  const countries = response.data;
  const result = CountrySchema.array().safeParse(countries);
  if (!result.success) {
    alert("oops");
    return;
  }

  const validatedData = result.data;
  let countryContentX = "";
  for (let i = 0; i < result.data.length; i++) {
    countryContentX += ` <p>${result.data[i].name} : population : ${result.data[i].population} </p><button id="${result.data[i]}delete" class="deleteButton">DELETE</button><button class="modifyButton" id="${result.data[i].id}modify">MODIFY</button>`;
  }
  appElementX.innerHTML = countryContentX;

  const deleteButtons = document.getElementsByClassName("deleteButton");

  [...deleteButtons].forEach((button) =>
    button.addEventListener("click", async () => {
      await deleteDataX(button.id.split("delete")[0]);
      getDataX();
    })
  );

  const modifyButtonsX = document.getElementsByClassName("modifyButton");

  [...modifyButtonsX].forEach((button) =>
    button.addEventListener("click", async () => {
      displayModifyWindowX();
      countryIDX = +button.id.split("modify")[0];
      updatedNameInputX.value = validatedData.find((country) => {
        return country.id === countryIDX;
      })!.name;
      updatedPopulationInputX.value =
        "" +
        validatedData.find((country) => {
          return country.id === countryIDX;
        })!.population;
    })
  );
};

searchElementX.addEventListener("click", getDataX);

const countryInput = document.getElementById("nameInput") as HTMLInputElement;
const populationInput = document.getElementById(
  "populationInput"
) as HTMLInputElement;

const postButton = document.getElementById("postButton") as HTMLButtonElement;

postButton.addEventListener("click", async () => {
  await postData();
  getDataX();
});

const modifyDataX = async () => {
  const response = await safeFetchX(
    "PATCH",
    `http://localhost:4003/api/countries/${countryIDX}`,
    {
      name: updatedNameInputX.value,
      population: +updatedPopulationInputX.value,
    }
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

const deleteDataX = async (id: string) => {
  const response = await safeFetchX(
    "DELETE",
    `http://localhost:4003/api/countries/${id}`
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

const postData = async () => {
  const response = await safeFetchX(
    "POST",
    `http://localhost:4003/api/countries`,
    { name: countryInput.value, population: +populationInput.value }
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

minElementX.addEventListener("input", getDataX);
maxElementX.addEventListener("input", getDataX);
