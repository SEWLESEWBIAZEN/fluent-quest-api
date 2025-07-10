import { it, expect, describe,test } from 'vitest'
import request from 'supertest'
import { app } from '../../../server.cjs'

const newlanguagename = process.env.TEST_NEW_LANGUAGE_NAME
const newlanguagecode = process.env.TEST_NEW_LANGUAGE_CODE
const newlanguageflag = process.env.TEST_NEW_LANGUAGE_FLAG
const newlanguagedescription = process.env.TEST_NEW_LANGUAGE_DESCRIPTION

describe("Should Create", () => {
    const token = process.env.TEST_AUTH_TOKEN;
    test("a language with all fields", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: newlanguagename,
                code: newlanguagecode,
                flag: newlanguageflag,
                description: newlanguagedescription
            },
            )
        expect(response.body).toHaveProperty('statusCode', 201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data.name', newlanguagename);
        expect(response.body.message).toBe('Language registered successfully');
    }, 15000);


    it("a language with no description(optional)", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: newlanguagename,
                code: `${newlanguagecode}1`,
                flag: newlanguageflag
            },
            )
        expect(response.body).toHaveProperty('statusCode', 201);
        expect(response.body).toHaveProperty('data.name', newlanguagename);
        expect(response.body.message).toBe('Language registered successfully');
    }, 15000);

})