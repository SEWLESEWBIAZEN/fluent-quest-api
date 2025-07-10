import { it, expect, describe } from 'vitest'
import  request  from 'supertest'
import {app} from '../../../server.cjs'

const token = process.env.TEST_AUTH_TOKEN;
const deletedlanguageId = process.env.TEST_DELETED_LANGUAGE_ID;

describe("Should Delete", () => {
    //delete language by id
    it("an existed language by id", async () => {
        const response = await request(app)
            .delete(`/api/languages/delete/${deletedlanguageId  }`)
            .set("authtoken", token)
        expect(response.body).toHaveProperty('statusCode', 200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Language deleted successfully');
        expect(response.body).toHaveProperty('data._id',deletedlanguageId);
    }, 15000);   

}
)