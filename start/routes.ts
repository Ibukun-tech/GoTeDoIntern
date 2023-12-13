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
    await Database.table("users").insert({
      email_address: payload.email_address,
      full_name: payload.full_name,
    });
    return { user: "user has been created" };
  } catch (err) {
    if (err) {
      console.log(err);
      return response.status(400).send(err.messages);
    }
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
    });
    const attached_image = request.file("attached_image", {
      size: "5mb",
      extnames: ["jpg", "png"],
    });
    await attached_image.moveToDisk("./");
    const fileName = attached_image.fileName;
    const payload = await request.validate({ schema: informationSchema });
    const value = { ...payload, attached_url: fileName };
  } catch (err) {
    console.log(err);
  }
});
Route.get("/", async () => {
  return { hello: "world" };
});
