const os = require("os");
// получим имя текущего пользователя
const userName = os.userInfo().username;
 
console.log(userName);