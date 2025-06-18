const userType = require('../enums/userType');
function userTypeOf(types) {
    const role = [];

    for (const type of types) {
        switch (type.toLowerCase()) {
            case userType.ADMIN:
                role.push(userType.ADMIN);
                break;
            case userType.TEACHER:
                role.push(userType.TEACHER);
                break;
            case userType.STUDENT:
                role.push(userType.STUDENT);
                break;
            case userType.USER:
                role.push(userType.USER);
                break;
            default:
                throw new Error("Invalid User Type: " + type);
        }
    }

    return role;
}

module.exports = { userTypeOf };