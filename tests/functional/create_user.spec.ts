import { test } from "@japa/runner";

test("Create users", async ({ client }) => {
  // Write your test here
  // To make the create user test to keep on passing you must send in a new email because the email must be unique
  const response = await client.post("/user").json({
    email_address: "testing12@gmail.com",
    full_name: "oluw123",
  });
  response.assertStatus(200);
  response.assertBodyContains({ user: "user has been created" });
});
