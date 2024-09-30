const express = require("express");
const jwt = require('jsonwebtoken');
const { verifyUserPassword, queryUser, getUserList, updateUser, deleteUser, createUser, getUser } = require('./db.js');
const app = express();
const userRoutes = require('./routes/userRoutes');
const temperatureRoutes = require('./routes/temperatureRoutes');
const articleRoutes = require('./routes/articleRoutes');
const orderRoutes = require('./routes/orderRoutes.js')
const distributionRoutes = require('./routes/distributionRoutes.js')
const secretKey = 'qinglong';

//express4的新特性，需要告诉他把请求体作为json解析才可以
app.use(express.json());
// 要注意这个解析还是会看请求头的，然后才使用对应的parser，比如只是用text并不能把json也变成text,需要这样做：
app.use(express.text({ type: "*/*" }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});



app.use(express.json());
app.use(express.text({ type: "/" }));
app.use('/swm/user', userRoutes);
app.use('/temperature', temperatureRoutes);
app.use("/swm/article",articleRoutes)
app.use("/swm/order",orderRoutes)
app.use("/swm/distribution",distributionRoutes)

app.listen(8081, () => {
    console.log("示例应用正在监听 8081 端口 !")
});
