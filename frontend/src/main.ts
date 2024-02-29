import "./style.css";
import { z } from "zod";
import { safeFetch } from "./safeFetch";

const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  population: z.number(),
});

const minElement = document.getElementById("min") as HTMLInputElement;
const maxElement = document.getElementById("max") as HTMLInputElement;
const searchElement = document.getElementById("search") as HTMLButtonElement;

const updatedNameInput = document.getElementById(
  "updatedNameInput"
) as HTMLInputElement;
const updatedPopulationInput = document.getElementById(
  "updatedPopulationInput"
) as HTMLInputElement;

const saveButton = document.getElementById("save-update") as HTMLButtonElement;
const cancelButton = document.getElementById(
  "cancel-update"
) as HTMLButtonElement;

const hideModifyWindow = () => {
  (document.getElementById("updateInputsDiv") as HTMLDivElement).style.display =
    "none";
};

let countryId: number | null = null;

saveButton.addEventListener("click", async () => {
  await modifyData();
  hideModifyWindow();
  getData();
});

cancelButton.addEventListener("click", hideModifyWindow);

const displayModifyWindow = () => {
  (document.getElementById("updateInputsDiv") as HTMLDivElement).style.display =
    "flex";
};

const getData = async () => {
  if (!minElement.value) {
    return;
  }
  const response = await safeFetch(
    "get",
    `http://localhost:4003/api/countries?min=${minElement.value}&max=${maxElement.value}`
  );
  if (!response.success) {
    alert(response.status);
    return;
  }

  if (response.status >= 500) {
    return;
  }

  const appElement = document.getElementById("app") as HTMLDivElement;
  const countries = response.data;
  const result = CountrySchema.array().safeParse(countries);
  if (!result.success) {
    alert("oops");
    return;
  }
  const validatedData = result.data;
  let countryContent = "";
  for (let i = 0; i < result.data.length; i++) {
    countryContent += `<p>${result.data[i].name}: population : ${result.data[i].population} </p><button id="${result.data[i].id}delete" class="deleteButton">DELETE</button><button class="modifyButton" id="${result.data[i].id}modify">MODIFY</button>`;
  }
  appElement.innerHTML = countryContent;

  const deleteButtons = document.getElementsByClassName("deleteButton");

  [...deleteButtons].forEach((button) =>
    button.addEventListener("click", async () => {
      await deleteData(button.id.split("delete")[0]);
      getData();
    })
  );

  const modifyButtons = document.getElementsByClassName("modifyButton");

  [...modifyButtons].forEach((button) =>
    button.addEventListener("click", async () => {
      displayModifyWindow();
      countryId = +button.id.split("modify")[0];
      updatedNameInput.value = validatedData.find((country) => {
        return country.id === countryId;
      })!.name;
      updatedPopulationInput.value =
        "" +
        validatedData.find((country) => {
          return country.id === countryId;
        })!.population;
    })
  );
};

searchElement.addEventListener("click", getData);

const countryInput = document.getElementById("nameInput") as HTMLInputElement;
const populationInput = document.getElementById(
  "populationInput"
) as HTMLInputElement;

const postButton = document.getElementById("postButton") as HTMLButtonElement;

postButton.addEventListener("click", async () => {
  await postData();
  getData();
});

//PATCH
const modifyData = async () => {
  const response = await safeFetch(
    "PATCH",
    `http://localhost:4003/api/countries/${countryId}`,
    { name: updatedNameInput.value, population: +updatedPopulationInput.value }
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

const deleteData = async (id: string) => {
  const response = await safeFetch(
    "delete",
    `http://localhost:4003/api/countries/${id}`
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

const postData = async () => {
  const response = await safeFetch(
    "post",
    `http://localhost:4003/api/countries`,
    {
      name: countryInput.value,
      population: +populationInput.value,
    }
  );
  if (response?.status === 200) {
    alert("Success");
  } else {
    alert("Error");
  }
};

minElement.addEventListener("input", getData);
maxElement.addEventListener("input", getData);
