import { it, expect, describe } from 'vitest'
import request from 'supertest'
import {app} from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const languageId = process.env.TEST_LANGUAGE_ID;
const languageCode = process.env.TEST_LANGUAGE_CODE;

describe("Should Get", () => {
    //get all languages
        it("all languages languages", async () => {
        const response = await request(app)
            .get(`/api/languages/getAll`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Languages retrieved successfully');
        expect(response.body.data).toBeInstanceOf(Array);
    }, 15000);

    //get language by id
    it("an existed language by id", async () => {
        const response = await request(app)
            .get(`/api/languages/getById/${languageId}`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Language retrieved successfully');
        expect(response.body.data).toHaveProperty('_id', languageId);
    }, 15000);

    //get language by code
    it("an existed language by code", async () => {
        const response = await request(app)
            .get(`/api/languages/getByCode/${languageCode}`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Language retrieved successfully');
        expect(response.body.data).toHaveProperty('_id', languageId);
    }, 15000);



    // closing to describe
})