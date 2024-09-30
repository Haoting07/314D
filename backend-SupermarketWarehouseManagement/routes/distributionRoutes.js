const express = require('express');
const jwt = require('jsonwebtoken');
const { getDistributionList,getDistribution,deleteDistribution,updateDistribution,createDistribution } = require('../db.js');
const secretKey = 'qinglong';
const router = express.Router();


// 获取任务列表
router.get("/list", async (req, res) => {
    var page = req.query.page
    var limit = req.query.limit
    var sort = req.query.sort
    if (req.query.title) {
        // 查询对应任务
        user = await getDistribution(req.query.title)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: [user]

            }
        })
    } else {
        // 查询数据库
        result = await getDistributionList(page, limit, sort)
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
    // 调用数据库修改用户
    result = await updateDistribution(req.body)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

//删除用户
router.post("/delete", async (req, res) => {
    var id = req.body.distributionid
    // 根据id删除用户
    // console.log(id)
    result = await deleteDistribution(id)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})


module.exports = router;