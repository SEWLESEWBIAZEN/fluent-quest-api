import { it, expect, describe } from 'vitest'
import request from 'supertest'
import { app } from '../../../server.cjs'

describe("Should Create", () => {
    const token = process.env.TEST_AUTH_TOKEN;
    it("a language with all fields", async () => {
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
        expect(response.body).toHaveProperty('statusCode', 201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data.name', 'Chinese');
        expect(response.body.message).toBe('Language registered successfully');
    }, 15000);


    it("a language with no description(optional)", async () => {
        const response = await request(app)
            .post("/api/languages/create")
            .set("authtoken", token)
            .send({
                name: "Arabic",
                code: "ar3",
                flag: "AE"
            },
            )
        expect(response.body).toHaveProperty('statusCode', 201);
        expect(response.body).toHaveProperty('data.name', 'Arabic');
        expect(response.body.message).toBe('Language registered successfully');
    }, 15000);





    // it("should delete a language", async()=>{
    //     const response = await request(app)
    //         .delete("/api/languages/delete/686782395fb4cf57c92329a8") 
    //         .set("authtoken", token)            
    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual(expect.objectContaining({
    //         statusCode: 404,
    //         success: false,
    //         message: `No language found!` || "",
    //         data: null
    //     }));
    // },15000);

})