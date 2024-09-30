const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'qinglong';
const router = express.Router();
const { setTemperature, getTemperature } = require('../db.js');


// 设置温度
router.post("/set", async (req, res) => {
    console.log(req.body)
    result = setTemperature(req.body.temperature,req.body.time)
    res.json({
        code: 20000, msg: "Set Temperature SuccessFul!"
    })
})

// 获取温度
router.get("/get",async (req,res) => {
    result = await getTemperature()
    res.json({ code: 20000, data: result })
    
})

module.exports = router;