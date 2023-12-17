/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";

/* Request Schemas */

const userSchema = schema.create({
  email_address: schema.string({}, [rules.email()]),
  full_name: schema.string(),
});

const informationSchema = schema.create({
  email_address: schema.string([rules.email()]),
  last_name: schema.string(),
  first_name: schema.string(),
  title: schema.string(),
  text: schema.string(),
});

async function validateRequest(schema, request) {
  return await request.validate({ schema });
}

/* Database */

async function createUser(userData) {
  return await Database.table("users").insert(userData);
}

async function getUsers({ email_address }) {
  return await Database.from("users").where("email_address", email_address);
}

async function createCustomerSupportRequest(csrData) {
  return await Database.table("customer_support_request").insert(csrData);
}

/* File system */

async function saveFileToDisk(file, destination = "./") {
  return await file.moveToDisk(destination)
}

/* Handlers */

async function helloWorldHandler(request, response) {
  return response.status(200).json({ data: "Hello World!" });
}

function errorHandler(request, response, error) {
  console.log(error);
  return response.status(500).json({ error: error.message });
}

async function createUserHandler(request, response) {
  const payload = await validateRequest(userSchema, request);
  const userData = { full_name: payload.full_name, email_address: payload.email_address };
  const user = await createUser(userData);
  return response.json({ data: user });
}

async function createCustomerSupportRequest(request, response) {
  const payload = await validateRequest(informationSchema, request);

  const attached_image = request.file("attached_image", {
    size: "5mb",
    extnames: ["jpg", "png"],
  });
  await saveFileToDisk(attached_image);

  const users = await getUsers({ email_address: payload.email_address });
  if (0 === users.length) {
    return response.status(400).json({ error: `No user with email ${payload.email_address}` });
  }
  if (users.length > 1) {
    return response.status(500).json({ error: `Unexpected error, multiple users email ${payload.email_address}` });
  }
  const user = users[0];

  const csrData = { ...payload, user_id: user.id, attached_url: attached_image.fileName };
  const csr = await createCustomerSupportRequest(csrData);
  return response.status(201).json({ data: csr })

}

/* Routes */

async function handlerFunc(handler) {
  return async (request, response) => {
    try {
      return await handler(request, response);
    } catch (e) {
      return errorHandler(request, response, e);
    }
  }
}

Route.get("/", handlerFunc(helloWorldHandler));
Route.post("/user", handlerFunc(createUserHandler));
Route.post("/information", handlerFunc(createCustomerSupportRequest));
