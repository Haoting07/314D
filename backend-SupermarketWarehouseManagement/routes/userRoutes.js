const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyUserPassword, queryUser, getUserList, updateUser, deleteUser, createUser, getUser } = require('../db.js');
const secretKey = 'qinglong';
const router = express.Router();



// 通过用户名和密码得到token
router.post("/login", async (req, res) => {
    // res.send("user login")
    // 获取data
    // res.send(req.body)
    // console.log(req.body)
    // 模拟获取用户信息去数据库查询到用户并返回token
    var username = req.body.username
    var password = req.body.password
    const user = await verifyUserPassword(username, password);
    // console.log(user)
    if (user === true) {
        // console.log("login successful!")
        // 生成jwt
        const payload = { user: username, pwd: password };
        const tokens = jwt.sign(payload, secretKey, { expiresIn: '24h' });
        res.json({
            code: 20000, data: { token: tokens }
        })
    } else {
        res.json({ code: 60204, message: 'Account and password are incorrect.' })
    }

})

// 通过token获取用户信息
router.get("/info", async (req, res) => {
    token = req.query.token
    //通过jwt解析用户信息
    try {
        const decoded = jwt.verify(token, secretKey);
        // console.log(decoded.user)
        // JSON.parse(decoded);

        user = await queryUser(decoded.user)
        if (user.role === "admin") {
            res.json({
                code: 20000, data: {
                    roles: ['admin'],
                    introduction: 'I am an admin',
                    avatar: 'https://awsimage-1.oss-cn-hangzhou.aliyuncs.com/admin.png',
                    name: 'admin'
                }
            })
        } else {
            res.json({
                code: 20000, data: {
                    roles: ['yg'],
                    introduction: 'I am an yg',
                    avatar: 'https://awsimage-1.oss-cn-hangzhou.aliyuncs.com/sh.png',
                    name: 'yg'
                }
            })
        }
    } catch (error) {
        console.error('JWT verification failed');
    }
})


// 获取用户列表
router.get("/list", async (req, res) => {
    var page = req.query.page
    var limit = req.query.limit
    var sort = req.query.sort
    // 如果有title代表是查询用户请求
    if (req.query.title) {
        // 查询对应用户
        user = await getUser(req.query.title)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: [user]

            }
        })
    } else {
        // 查询数据库
        result = await getUserList(page, limit, sort)
        // console.log(result)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: result

            }
        })
    }
})


//修改用户
router.post("/update", async (req, res) => {
    var id = req.body.id
    var username = req.body.username
    var password = req.body.password
    var role = req.body.role
    // 调用数据库修改用户
    result = await updateUser(id, username, password, role)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

//删除用户
router.post("/delete", async (req, res) => {
    var id = req.body.id
    // 根据id删除用户
    // console.log(id)
    result = await deleteUser(id)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 创建用户
router.post("/create", async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var role = req.body.role
    result = await createUser(username, password, role)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 退出登入
router.post("/logout", (req, res) => {
    res.json({ code: 20000, data: 'success' })
})

module.exports = router;