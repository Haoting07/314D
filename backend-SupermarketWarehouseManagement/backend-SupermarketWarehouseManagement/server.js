const express = require("express");
const app = express();



//express4的新特性，需要告诉他把请求体作为json解析才可以
app.use(express.json());
// 要注意这个解析还是会看请求头的，然后才使用对应的parser，比如只是用text并不能把json也变成text,需要这样做：
app.use(express.text({type:"*/*"}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// 通过用户名和密码得到token
app.post("/swm/user/login",(req,res) => {
    // res.send("user login")
    // 获取data
    // res.send(req.body)
    console.log(req.body)
    // 模拟获取用户信息去数据库查询到用户并返回token
    var username = req.body.username
    var password = req.body.password

    if(username === "admin") {
        res.json({code: 20000,data: '123456'})
    }
})

// 通过token获取用户信息
app.get("/swm/user/info",(req,res) => {
    console.log("request info")
    res.json({code: 20000,data: {
        roles: ['admin'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
      }})
})

// 退出登入
app.post("/swm/user/logout",(req,res) => {
    res.json({code: 20000,data: 'success'})
})



app.listen(8081, () => {
  console.log("示例应用正在监听 8081 端口 !");
});
