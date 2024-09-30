const express = require('express');
const jwt = require('jsonwebtoken');
const { getArticleist,getArticle,deleteArticle,getArticleTypeList,getArticleType,updateArticle,createArticle,deleteArticleType,updateArticleType,createArticleType } = require('../db.js');
const secretKey = 'qinglong';
const router = express.Router();

// 获取物品类型列表
router.get("/typelist", async (req, res) => {
    var page = req.query.page
    var limit = req.query.limit
    var sort = req.query.sort
    // 如果有title代表是查询用户请求
    if (req.query.title) {
        // 查询对应类别
        articletype = await getArticleType(req.query.title)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: [articletype]

            }
        })
    } else {
        // 查询数据库
        result = await getArticleTypeList(page, limit, sort)
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


// 删除物品类型
router.post("/deletetype", async (req, res) => {
    var id = req.body.typeid
    // 根据id删除用物品
    // console.log(id)
    result = await deleteArticleType(id)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 修改物品类型
router.post("/updatetype", async (req, res) => {
    // console.log(req.body)
    // 调用数据库修改物品
    result = await updateArticleType(req.body)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 创建物品类型
router.post("/createtype", async (req, res) => {
    // console.log(req.body)
    // console.log(req.body.articlestypeid)
    // console.log(typeid)
    result = await createArticleType(req.body)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})



// 获取物品列表
router.get("/list", async (req, res) => {
    var page = req.query.page
    var limit = req.query.limit
    var sort = req.query.sort
    // 如果有title代表是查询用户请求
    if (req.query.title) {
        // 查询对应用户
        article = await getArticle(req.query.title)
        res.json({
            code: 20000,
            data: {
                total: 1,
                items: [article]

            }
        })
    } else {
        // 查询数据库
        result = await getArticleist(page, limit, sort)
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
// 删除物品
router.post("/delete", async (req, res) => {
    var id = req.body.articlesid
    // 根据id删除用物品
    // console.log(id)
    result = await deleteArticle(id)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 修改物品
router.post("/update", async (req, res) => {
    // console.log(req.body)
    // 调用数据库修改物品
    result = await updateArticle(req.body)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})

// 创建物品
router.post("/create", async (req, res) => {
    // console.log(req.body)
    // console.log(req.body.articlestypeid)
    typeid = await getArticleType(req.body.articlestypeid)
    // console.log(typeid)
    result = await createArticle(req.body,typeid)
    if (result) {
        res.json({ code: 20000, data: 'success' })
    } else {
        res.json({ code: 60204, message: 'failed' })
    }
})
module.exports = router;