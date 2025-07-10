import { it, expect, describe } from 'vitest'
import request from 'supertest'
import {app} from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const languageId = process.env.TEST_LANGUAGE_ID;
const existedLanguageCode = process.env.TEST_EXISTED_LANGUAGE_CODE;
describe("Should not update",()=>{
    it("without token",async()=>{
        const response = await request(app)
            .put(`/api/languages/update/${languageId}`)
            .send({
                name: "Amharic",
                code: "AM01",
                flag: "ET",
                description: "Amharic language, is widely spoken in Ethiopia"
            })
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    },15000)

    it("with invalid token",async()=>{
        const response = await request(app)
            .put(`/api/languages/update/${languageId}`)
            .set("authtoken", "invalid_token")
            .send({
                name: "Amharic",
                code: "AM01",
                flag: "ET",
                description: "Amharic language, is widely spoken in Ethiopia"
            })
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    },15000)

    it("with no properties",async()=>{
        const response = await request(app)
        .put(`/api/languages/update/${languageId}`)
        .set("authtoken", token)
        .send({})
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'No fields provided for update, what do you wants to update?');
        expect(response.body.data).toBeNull();
    },15000)

    it("with  another already existed language code",async()=>{
        const response = await request(app)
        .put(`/api/languages/update/${languageId}`)
        .set("authtoken", token)
        .send({
            name: "Amharic",
            code: existedLanguageCode,
            flag: "ET",
            description: "Amharic language, is widely spoken in Ethiopia"
        })
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', "Language code already exists");
        expect(response.body.data).toBeNull();
    },15000);

})

describe("Language update with invalid properties", () => {
  const invalidFields = [
    { field: "name", payload: { name: "" }, expectedKey: "name" },
    { field: "code", payload: { code: "" }, expectedKey: "code" },
    { field: "flag", payload: { flag: "" }, expectedKey: "flag" },
  ];

  invalidFields.forEach(({ field, payload }) => {
    it(`should fail when ${field} is empty`, async () => {
      const response = await request(app)
        .put(`/api/languages/update/${languageId}`)
        .set("authtoken", token)
        .send({
          ...payload,
          // valid values for the rest
          name: payload.name ?? "Amharic",
          code: payload.code ?? "AM01",
          flag: payload.flag ?? "ET",
          description: "Amharic language, is widely spoken in Ethiopia"
        });

      expect(response.body).toHaveProperty("statusCode", 500); // or 400 if you return validation errors correctly
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", expect.stringMatching(/validation failed/i));
      expect(response.body.data).toBeNull();
    },15000);
  });
});
