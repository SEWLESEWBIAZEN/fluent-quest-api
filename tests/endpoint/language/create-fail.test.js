import { it, expect, describe } from 'vitest'
import request from 'supertest'
import { app } from '../../../server.cjs'

describe("Create Language", () => {
    const token = process.env.TEST_AUTH_TOKEN;
    it("should not create a language with existing code", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: "Chinese",
                code: "zh3",
                flag: "CN",
                description: "Language of China"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('This language code already exists!');
    }, 15000);

    
    it("should not create a language with no name", async () => {
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

    it("should not create a language with no code", async () => {
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

    it("should not create a language with no flag", async () => {
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

    it("should not create a language with no auth token", async () => {
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