import { it, expect, describe } from 'vitest'
import request from 'supertest'
import {app} from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const languageId = process.env.TEST_LANGUAGE_ID;
const languageCode = process.env.TEST_LANGUAGE_CODE;
const invalidId = process.env.TEST_LANGUAGE_INVALID_ID;
const invalidCode = process.env.TEST_LANGUAGE_INVALID_CODE;

describe("Should not find", () => {
    //get language by not valid id
    it("an existed language by invalid object_id", async () => {
        const response = await request(app)
            .get(`/api/languages/getById/${invalidId}`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 500);
        expect(response.body).toHaveProperty('success', false);        
        expect(response.body.data).toBeNull();
    }, 15000);

    //get language without token -> unauthorized
    it("an existed language by id without token" , async () => {
        const response = await request(app)
            .get(`/api/languages/getById/${languageId}`)
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
        expect(response.body.data).toBeNull();
    }, 15000);

    //get language by code -> No language found!
    it("an existed language by code with invalid code", async () => {
        const response = await request(app)
            .get(`/api/languages/getByCode/${invalidCode}`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'No language found!');
        expect(response.body.data).toBeNull();
    }, 15000);

    //get language without token -> unauthorized
    it("an existed language by code without token", async () => {
        const response = await request(app)
            .get(`/api/languages/getByCode/${languageCode}`)
        expect(response.body).toHaveProperty('statusCode', 401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
        expect(response.body.data).toBeNull();
    }, 15000);     

    // closing to describe
})