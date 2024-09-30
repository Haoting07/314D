const express = require('express');
const jwt = require('jsonwebtoken');
const { getOrderList,createOrder,deleteOrder,updateOrder,getOrder,createDistribution } = require('../db.js');
const secretKey = 'qinglong';
const router = express.Router();

// 获取订单列表
router.get("/list", async (req, res) => {
    var page = req.query.page
    var limit = req.query.limit
    var sort = req.query.sort
    // 如果有title代表是查询用户请求
    if (req.query.title) {
        // 查询对应类别
        articletype = await getOrder(req.query.title)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: [articletype]

            }
        })
    } else {
        // 查询数据库
        result = await getOrderList(page, limit, sort)
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

// 创建订单
router.post("/create", async (req, res) => {
    // console.log(req.body)
    // console.log(req.body.articlestypeid)
    // console.log(typeid)
    result = await createOrder(req.body)

    // 创建订单表后自动创建配送表
    resultss = await createDistribution(result)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 删除订单
router.post("/delete", async (req, res) => {
    var id = req.body.orderid
    // 根据id删除用物品
    // console.log(id)
    result = await deleteOrder(id)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 修改订单
router.post("/update", async (req, res) => {
    // console.log(req.body)
    // 调用数据库修改物品
    result = await updateOrder(req.body)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

module.exports = router;