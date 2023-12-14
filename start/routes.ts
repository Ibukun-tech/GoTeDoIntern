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
      return response.status(500).json({ error: err.message });
    }
  }
});
//
Route.post("/information", async ({ request, response }) => {
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
    // @ts-ignore
    await attached_image.moveToDisk("./");
    // @ts-ignore
    const fileName = attached_image.fileName;
    // console.log(fileName, "the name of the file");
    const payload = await request.validate({ schema: informationSchema });
    const value = { ...payload, attached_url: fileName };
    // Now We are first going to find the user through the email
    const user = await Database.from("users").where(
      "email_address",
      value.email_address
    );
    if (user.length === 0) {
      return response.status(400).json({ error: "no user of such email" });
    }
    await Database.table("customer_support_requests").insert({
      email_address: value.email_address,
      last_name: value.last_name,
      first_name: value.first_name,
      title: value.title,
      text: value.text,
      user_id: user[0].id,
      attached_url: value.attached_url,
    });
    return response.status(201).json(value);
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: err.message });
  }
});
Route.get("/", async () => {
  return { hello: "world" };
});
