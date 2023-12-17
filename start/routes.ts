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
// User schema
const userSchema = () =>
  schema.create({
    email_address: schema.string({}, [rules.email()]),
    full_name: schema.string(),
  });
//Information schema
const informationSchema = schema.create({
  email_address: schema.string([rules.email()]),
  last_name: schema.string(),
  first_name: schema.string(),
  title: schema.string(),
  text: schema.string(),
});

const validate = async (req, schema) => await req.validate({ schema: schema });
//User database
const createUser = async (payload) =>
  await Database.table("users").insert({
    email_address: payload.email_address,
    full_name: payload.full_name,
  });

import Route from "@ioc:Adonis/Core/Route";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";

//
const findUser = async (email) => {
  return await Database.from("users").where("email_address", email);
};
const errorHandler = async (res, err) => {
  return await res.status(500).json({ error: err.message });
};
const customerSupportRequestToDb = async (ctx) => {
  return await Database.table("customer_support_requests").insert(ctx);
};
const createUserHandler = async (req, res) => {
  const schema = userSchema();
  const payload = await validate(req, schema);
  const user = await createUser(payload);
  return res.status(201).json({ user });
};

const createSupportFunc = async (request, response) => {
  const schema = informationSchema;
  const attached_image = request.file("attached_image", {
    size: "5mb",
    extnames: ["jpg", "png"],
  });
  // @ts-ignore
  await attached_image.moveToDisk("./");
  // @ts-ignore
  const fileName = attached_image.fileName;
  // console.log(fileName, "the name of the file");
  const payload = await validate(request, schema);

  // Now We are first going to find the user through the email
  const value = { ...payload };
  const user = await findUser(value.email_address);
  if (user.length === 0) {
    return response
      .status(400)
      .json({ error: `no user of such email ${value.email_address}` });
  }
  if (user.length > 1) {
    return response.status(500).json({
      error: "we already have more than one user using this email",
    });
  }
  const values = user[0];
  const ctxDb = {
    ...payload,
    email_address: values.email_address,
    attached_url: fileName,
  };
  const data = await customerSupportRequestToDb(ctxDb);
  return response.status(201).json({ data });
};
const handleFunc =
  (handler) =>
  async ({ request, response }) => {
    try {
      return await handler(request, response);
    } catch (error) {
      return errorHandler(response, error);
    }
  };

Route.post("/user", handleFunc(createUserHandler));
Route.post("/information", handleFunc(createSupportFunc));
Route.get("/", async () => {
  return { hello: "world" };
});
