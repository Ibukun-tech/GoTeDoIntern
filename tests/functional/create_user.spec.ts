import { test } from "@japa/runner";

test("Create users", async ({ client }) => {
  // Write your test here
  const response = await client.post("/user").json({
    email_address: "ibk2345@gmail.com",
    full_name: "oluw123",
  });
  response.assertStatus(200);
  response.assertBodyContains({ user: "user has been created" });
});
