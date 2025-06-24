const userType = require('../enums/userType');
function userTypeOf(type) {
    let role ="";   
        switch (type.toLowerCase()) {
            case userType.ADMIN:
                role=userType.ADMIN;
                break;
            case userType.TEACHER:
                role=userType.TEACHER;
                break;
            case userType.STUDENT:
                role=userType.STUDENT;
                break;
            case userType.USER:
                role=userType.USER;
                break;
            default:
                throw new Error("Invalid User Type: " + type);
        }
    

    return role;
}

module.exports = { userTypeOf };