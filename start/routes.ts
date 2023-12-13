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
Route.post("/user", async ({ request, response }) => {
  try {
    const userSchema = schema.create({
      email_address: schema.string({}, [rules.email()]),
      full_name: schema.string(),
    });
    const payload = await request.validate({ schema: userSchema });
    // console.log(payload);
    // 1. WE WILL ADD IT TO BE SENT TO THE DATABASE

    // 2. WE THEN SEND A RESPONSE TO IT
    console.log(request.body());
    return;
  } catch (err) {
    console.log(err);
    return response.badRequest(err.messages);
  }
});
//
Route.post("/information", async ({ request }) => {
  try {
    const informationSchema = schema.create({
      email_address: schema.string([rules.email()]),
      last_name: schema.string(),
      first_name: schema.string(),
      title: schema.string(),
      text: schema.string(),
      attached_url: schema.string(),
    });
  } catch (err) {
    console.log(err);
  }
});
Route.get("/", async () => {
  return { hello: "world" };
});
