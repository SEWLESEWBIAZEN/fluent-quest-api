import { it, expect, describe } from 'vitest'
import request from 'supertest'
import { app } from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const existedLanguageCode = process.env.TEST_EXISTED_LANGUAGE_CODE;
describe("Should Not", () => {
    it("create a language with existing code", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: "Chinese",
                code: existedLanguageCode,
                flag: "CN",
                description: "Language of China"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('This language code already exists!');
    }, 15000);

    
    it("create a language with no name", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                code: "ar10",
                flag: "AE"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('Language Name is required');
    }, 15000);

    it("create a language with no code", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: "Arabic",
                flag: "AE"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('Language Code is required');
    }, 15000);

    it("create a language with no flag", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: "Arabic",
                code: "ar10"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('Language Flag is required');
    }, 15000);

    it("create a language with no auth token", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .send({
                name: "Arabic",
                code: "ar10",
                flag: "AE"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('Unauthorized');
    }, 15000);

    //closing to describe
}
)


describe("Create language with invalid properties", () => {
  const invalidFields = [
    { field: "name", payload: { name: "" }, expectedKey: "name" },
    { field: "code", payload: { code: "" }, expectedKey: "code" },
    { field: "flag", payload: { flag: "" }, expectedKey: "flag" },
  ];

  invalidFields.forEach(({ field, payload }) => {
    it(`should fail when ${field} is empty`, async () => {
      const response = await request(app)
        .post(`/api/languages/create`)
        .set("authtoken", token)
        .send({
          ...payload,
          // valid values for the rest
          name: payload.name ?? "Oromiffa",
          code: payload.code ?? "OR01",
          flag: payload.flag ?? "ET",
          description: "Oromiffa language, is widely spoken in Ethiopia"
        });

      expect(response.body).toHaveProperty("statusCode", 400); // or 400 if you return validation errors correctly
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", expect.stringMatching(/is required/i));
      expect(response.body.data).toBeNull();
    },15000);
  });
});