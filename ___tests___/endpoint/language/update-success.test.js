import { it, expect, describe } from 'vitest'
import request from 'supertest'
import { app } from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const languageId = process.env.TEST_LANGUAGE_ID;
describe("Should Update", () => {
    it("a language with all fields", async () => {
        const response = await request(app)
            .put(`/api/languages/update/${languageId}`)
            .set("authtoken", token)
            .send({
                name: "Amharic",
                code: "AM01",
                flag: "ET",
                description: "Amharic language, is widely spoken in Ethiopia"
            })
        expect(response.body).toHaveProperty('statusCode', 200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('name', 'Amharic');
        expect(response.body.data).toHaveProperty('code', 'AM01');
        expect(response.body.data).toHaveProperty('flag', 'ET');
        expect(response.body.data).toHaveProperty('description', 'Amharic language, is widely spoken in Ethiopia');
        expect(response.body).toHaveProperty('message', 'Language updated successfully');
        
    }, 15000);
})

describe('Update language with single field', () => {    
    const testCases = [
        {
            label: 'name',
            payload: { name: 'Amharic' },
            expectedKey: 'name',
            expectedValue: 'Amharic',
        },
        {
            label: 'code',
            payload: { code: 'AM01' },
            expectedKey: 'code',
            expectedValue: 'AM01',
        },
        {
            label: 'flag',
            payload: { flag: 'ET' },
            expectedKey: 'flag',
            expectedValue: 'ET',
        },
        {
            label: 'description',
            payload: {
                description: 'Amharic language, is widely spoken in Ethiopia',
            },
            expectedKey: 'description',
            expectedValue: 'Amharic language, is widely spoken in Ethiopia',
        },
    ];

    testCases.forEach(({ label, payload, expectedKey, expectedValue }) => {
        it(`should update a language with only ${label}`, async () => {
            const response = await request(app)
                .put(`/api/languages/update/${languageId}`)
                .set('authtoken', token)
                .send(payload);
            expect(response.body).toHaveProperty('statusCode', 200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty(`${expectedKey}`, expectedValue);
            expect(response.body).toHaveProperty('message', 'Language updated successfully');
        }, 15000);
    });
});
