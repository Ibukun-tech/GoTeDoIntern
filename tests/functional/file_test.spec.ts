import { test } from "@japa/runner";
import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";

test("File test", async ({ client, assert }) => {
  // think about handling the file first
  const fakeDrive = Drive.fake();
  const fakeImage = await file.generateJpg("1mb");
  const response = await client
    .post("/information")
    .file("attached_image", (await fakeImage).contents, {
      filename: (await fakeImage).name,
    })
    .fields({
      email_address: "testing12@gmail.com",
      last_name: "testing",
      first_name: "tested",
      title: "tested title",
      text: "tested title",
    });
  assert.isTrue(await fakeDrive.exists(fakeImage.name));

  // console.log(response);
  response.assertStatus(201);
  response.assertBodyContains({});
  Drive.restore();
});
