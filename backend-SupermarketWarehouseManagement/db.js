const { MongoClient } = require('mongodb');
const { after } = require('node:test');
const uuid = require("uuid");

var uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0"
// get user token
async function verifyUserPassword(usernames, passwords) {
    // const uri = "mongodb://supermarket:88888888@docdb-2024-09-05-08-48-48.cluster-c1a6qg44ogtk.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0"
    const client = new MongoClient(uri);
    try {
        const database = client.db('supermarket');
        const collection = database.collection('user');
        console.log("query", usernames, passwords)
        // const user = await collection.findOne({ username: "'" + username + "'", password: password });
        const user = await collection.findOne({ username: usernames, password: passwords });
        if (user) {
            console.log("username verified");
            return true;
        } else {
            console.log("Usernot found or password is incorrect.");
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        await client.close();
    }
}

// query user info
async function queryUser(usernames) {
    // const uri = "mongodb://supermarket:88888888@docdb-2024-09-05-08-48-48.cluster-c1a6qg44ogtk.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0"
    const client = new MongoClient(uri);
    try {
        const database = client.db('supermarket');
        const collection = database.collection('user');
        const user = await collection.findOne({ username: usernames });
        if (user) {
            // console.log("User found: ");
            // console.log(user);
            return user;
        } else {
            console.log("User not found.");
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close();
    }
}

// get user list
async function getUserList(page, limitStr, sort) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('user');

        // 将 limitStr 转换为整数，如果它不是一个有效的整数，parseInt 将返回 NaN  
        const limit = parseInt(limitStr, 10); // 第二个参数 10 表示十进制

        // 根据sort参数设置排序条件  
        let sortObj = {};
        if (sort === '+id') {
            sortObj = { id: 1 }; // 升序  
        } else if (sort === '-id') {
            sortObj = { id: -1 }; // 降序  
        }

        // 计算分页的skip数量  
        const skip = (page - 1) * limit;

        // 执行查询  
        const query = {}; // 假设我们不使用任何查询条件，只根据分页和排序来查询  
        const result = await collection.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}


// get user
async function getUser(usernames) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('user');

        // 执行查询 
        const result = await collection.findOne({ username: usernames });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// update user
async function updateUser(id, username, password, role) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('user');

        // 构建查询条件，直接使用 id 字符串  
        const query = { id: id };

        // 构建更新文档，使用 $set 操作符来更新字段  
        const update = {
            $set: {
                username: username,
                password: password, // 注意：在生产环境中，应该存储密码的哈希值  
                role: role
            }
        };

        // 执行更新操作  
        const result = await collection.updateOne(query, update);

        // 返回操作结果，通常 result.modifiedCount 会显示有多少文档被修改了  
        // 注意：如果找不到匹配的文档，modifiedCount 将为 0  
        return result.modifiedCount > 0; // 如果成功修改了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// delete user by id
async function deleteUser(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('user');

        // 构建查询条件，这里假设 id 是字符串或数字类型  
        const query = { id: id };

        // 执行删除操作  
        const result = await collection.deleteOne(query);

        // 返回操作结果，通常 result.deletedCount 会显示有多少文档被删除了  
        // 如果成功删除了文档，deletedCount 将为 1；否则为 0  
        return result.deletedCount > 0; // 如果成功删除了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}
// create user
async function createUser(username, password, role) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('supermarket');

        // 更新 userIdCounter 集合中的 count 字段  
        const counterCollection = database.collection('userIdCounter');
        const result = await counterCollection.findOneAndUpdate(
            { _id: "userId" },
            { $inc: { count: 1 } },
            { returnDocument: 'after' } // 返回更新后的文档  
        );

        // 检查 result 是否为 null 或 undefined，这可能在文档不存在时发生  
        if (!result) {
            throw new Error('Failed to increment user ID counter');
        }

        // 从更新后的文档中获取新的 count 值作为用户的 id  
        const newUserId = result.count;

        // 现在创建用户文档  
        const userCollection = database.collection('user');
        const userDoc = {
            id: newUserId, // 使用新生成的 ID  
            username: username,
            password: password, // 注意：实际应用中应存储密码的哈希值  
            role: role
        };

        await userCollection.insertOne(userDoc);

        // 可以选择返回新创建的用户对象（这里未实现）  
        return newUserId

    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close();
    }
}

async function setTemperature(temperature, time) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('supermarket');
        const collection = database.collection('temperature');
        const updateResult = await collection.findOneAndUpdate(
            {}, // 查询条件，这里为空表示匹配集合中的所有文档
            {
                $set: {
                    temperature: temperature,
                    time: time
                }
            },
            {
                upsert: false // 如果没有查询到文档，不插入新文档
            }
        );
        if (updateResult) {
            console.log('set temperature Success');
            return true
        } else {
            console.log('set temperature failure');
            return false
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

// get temperature
async function getTemperature() {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('supermarket');
        const collection = database.collection('temperature');
        const Result = await collection.findOne()
        console.log(Result)
        return Result
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}


async function getArticleist(page, limitStr, sort) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('articles');

        // 将 limitStr 转换为整数，如果它不是一个有效的整数，parseInt 将返回 NaN  
        const limit = parseInt(limitStr, 10); // 第二个参数 10 表示十进制

        // 根据sort参数设置排序条件  
        let sortObj = {};
        if (sort === '+id') {
            sortObj = { articlesid: 1 }; // 升序  
        } else if (sort === '-id') {
            sortObj = { articlesid: -1 }; // 降序  
        }

        // 计算分页的skip数量  
        const skip = (page - 1) * limit;

        // 执行查询  
        const query = {}; // 假设我们不使用任何查询条件，只根据分页和排序来查询  
        const result = await collection.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}



async function getArticle(articlesname) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('articles');

        // 执行查询 
        const result = await collection.findOne({ articlesname: articlesname });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// getArticleTypeList
async function getArticleTypeList(page, limitStr, sort) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('typeitem');

        // 将 limitStr 转换为整数，如果它不是一个有效的整数，parseInt 将返回 NaN  
        const limit = parseInt(limitStr, 10); // 第二个参数 10 表示十进制

        // 根据sort参数设置排序条件  
        let sortObj = {};
        if (sort === '+id') {
            sortObj = { typeid: 1 }; // 升序  
        } else if (sort === '-id') {
            sortObj = { typeid: -1 }; // 降序  
        }

        // 计算分页的skip数量  
        const skip = (page - 1) * limit;

        // 执行查询  
        const query = {}; // 假设我们不使用任何查询条件，只根据分页和排序来查询  
        const result = await collection.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

async function getArticleType(typename) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('typeitem');

        // 执行查询 
        const result = await collection.findOne({ typename: typename });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// delete article by id
async function deleteArticle(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('articles');

        // 构建查询条件，这里假设 id 是字符串或数字类型  
        const query = { articlesid: id };

        // 执行删除操作  
        const result = await collection.deleteOne(query);

        // 返回操作结果，通常 result.deletedCount 会显示有多少文档被删除了  
        // 如果成功删除了文档，deletedCount 将为 1；否则为 0  
        return result.deletedCount > 0; // 如果成功删除了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// update article
async function updateArticle(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('articles');

        // 构建查询条件，直接使用 id 字符串  
        const query = { articlesid: body.articlesid };

        // 构建更新文档，使用 $set 操作符来更新字段  
        const update = {
            $set: {
                articlesname: body.articlesname,
                articlestypeid: body.articlestypeid,
                articlescount: body.articlescount,
                articlessalescount: body.articlessalescount,
                articlesprice: body.articlesprice
            }
        };

        // 执行更新操作  
        const result = await collection.updateOne(query, update);

        // 返回操作结果，通常 result.modifiedCount 会显示有多少文档被修改了  
        // 注意：如果找不到匹配的文档，modifiedCount 将为 0  
        return result.modifiedCount > 0; // 如果成功修改了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// create article
async function createArticle(body,typeid) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('supermarket');

        // 更新 userIdCounter 集合中的 count 字段  
        const counterCollection = database.collection('articlesIdCounter');
        const result = await counterCollection.findOneAndUpdate(
            { _id: "articlesId" },
            { $inc: { count: 1 } },
            { returnDocument: 'after' } // 返回更新后的文档  
        );

        // 检查 result 是否为 null 或 undefined，这可能在文档不存在时发生  
        if (!result) {
            throw new Error('Failed to increment articles ID counter');
        }

        // 从更新后的文档中获取新的 count 值作为用户的 id  
        const newArticlesId = result.count;

        // 现在创建用户文档  
        const articlesCollection = database.collection('articles');
        const articlesDoc = {
            articlesid: newArticlesId, // 使用新生成的 ID  
            articlesname: body.articlesname,
            articlescount: body.articlescount, // 注意：实际应用中应存储密码的哈希值  
            articlestypeid: typeid.typeid,
            articlessalescount: body.articlessalescount,
            articlesprice: body.articlesprice
        };

        await articlesCollection.insertOne(articlesDoc);

        // 可以选择返回新创建的用户对象（这里未实现）  
        return newArticlesId

    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close();
    }
}


// delete article by id
async function deleteArticleType(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('typeitem');

        // 构建查询条件，这里假设 id 是字符串或数字类型  
        const query = { typeid: id };

        // 执行删除操作  
        const result = await collection.deleteOne(query);

        // 返回操作结果，通常 result.deletedCount 会显示有多少文档被删除了  
        // 如果成功删除了文档，deletedCount 将为 1；否则为 0  
        return result.deletedCount > 0; // 如果成功删除了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}


async function updateArticleType(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('typeitem');

        // 构建查询条件，直接使用 id 字符串  
        const query = { typeid: body.typeid };

        // 构建更新文档，使用 $set 操作符来更新字段  
        const update = {
            $set: {
                typename: body.typename
            }
        };

        // 执行更新操作  
        const result = await collection.updateOne(query, update);

        // 返回操作结果，通常 result.modifiedCount 会显示有多少文档被修改了  
        // 注意：如果找不到匹配的文档，modifiedCount 将为 0  
        return result.modifiedCount > 0; // 如果成功修改了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}



async function createArticleType(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('supermarket');

        // 生成随机UUID
        const newArticlesId = uuid.v4()

        // 现在创建用户文档  
        const articlesCollection = database.collection('typeitem');
        const articlesDoc = {
            typeid: newArticlesId, // 使用新生成的 ID  
            typename: body.typename
        };

        await articlesCollection.insertOne(articlesDoc);

        // 可以选择返回新创建的用户对象（这里未实现）  
        return newArticlesId

    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close();
    }
}


async function getOrderList(page, limitStr, sort) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('orderform');

        // 将 limitStr 转换为整数，如果它不是一个有效的整数，parseInt 将返回 NaN  
        const limit = parseInt(limitStr, 10); // 第二个参数 10 表示十进制

        // 根据sort参数设置排序条件  
        let sortObj = {};
        if (sort === '+id') {
            sortObj = { orderid: 1 }; // 升序  
        } else if (sort === '-id') {
            sortObj = { orderid: -1 }; // 降序  
        }

        // 计算分页的skip数量  
        const skip = (page - 1) * limit;

        // 执行查询  
        const query = {}; // 假设我们不使用任何查询条件，只根据分页和排序来查询  
        const result = await collection.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}


async function createOrder(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('supermarket');

        // 生成随机UUID
        const newOrderId = uuid.v4()
        const newDistributionId = uuid.v4()

        // 现在创建用户文档  
        const orderCollection = database.collection('orderform');
        const orderDoc = {
            orderid: newOrderId, // 使用新生成的 ID  
            orderprice: body.orderprice,
            orderstatus: body.orderstatus,
            address: body.address,
            distributionid: newDistributionId
        };

        result =  await orderCollection.insertOne(orderDoc);

        // 可以选择返回新创建的用户对象（这里未实现）  
        return newDistributionId

    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close();
    }
}

async function deleteOrder(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('orderform');

        // 构建查询条件，这里假设 id 是字符串或数字类型  
        const query = { orderid: id };

        // 执行删除操作  
        const result = await collection.deleteOne(query);

        // 返回操作结果，通常 result.deletedCount 会显示有多少文档被删除了  
        // 如果成功删除了文档，deletedCount 将为 1；否则为 0  
        return result.deletedCount > 0; // 如果成功删除了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

async function updateOrder(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('orderform');

        // 构建查询条件，直接使用 id 字符串  
        const query = { orderid: body.orderid };

        // 构建更新文档，使用 $set 操作符来更新字段  
        const update = {
            $set: {
                orderprice: body.orderprice,
                orderstatus: body.orderstatus,
                address: body.address,
                distributionid: body.distributionid
            }
        };

        // 执行更新操作  
        const result = await collection.updateOne(query, update);
        // 返回操作结果，通常 result.modifiedCount 会显示有多少文档被修改了  
        // 注意：如果找不到匹配的文档，modifiedCount 将为 0  
        return result.modifiedCount > 0; // 如果成功修改了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// 获取单个订单
async function getOrder(orderid) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('orderfrom');

        // 执行查询 
        const result = await collection.findOne({ orderid: orderid });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// 获取配送任务列表

async function getDistributionList(page, limitStr, sort) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('distribution');

        // 将 limitStr 转换为整数，如果它不是一个有效的整数，parseInt 将返回 NaN  
        const limit = parseInt(limitStr, 10); // 第二个参数 10 表示十进制

        // 根据sort参数设置排序条件  
        let sortObj = {};
        if (sort === '+id') {
            sortObj = { distributionid: 1 }; // 升序  
        } else if (sort === '-id') {
            sortObj = { distributionid: -1 }; // 降序  
        }

        // 计算分页的skip数量  
        const skip = (page - 1) * limit;

        // 执行查询  
        const query = {}; // 假设我们不使用任何查询条件，只根据分页和排序来查询  
        const result = await collection.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .toArray();

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// 获取配送任务
async function getDistribution(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('distribution');

        // 执行查询 
        const result = await collection.findOne({ distributionid: id });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// 删除配送任务
async function deleteDistribution(id) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('distribution');

        // 构建查询条件，这里假设 id 是字符串或数字类型  
        const query = { distributionid: id };

        // 执行删除操作  
        const result = await collection.deleteOne(query);

        // 返回操作结果，通常 result.deletedCount 会显示有多少文档被删除了  
        // 如果成功删除了文档，deletedCount 将为 1；否则为 0  
        return result.deletedCount > 0; // 如果成功删除了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}

// 修改配送任务
async function updateDistribution(body) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect(); // 连接到MongoDB  
        const database = client.db('supermarket');
        const collection = database.collection('distribution');

        // 构建查询条件，直接使用 id 字符串  
        const query = { distributionid: body.distributionid };

        // 构建更新文档，使用 $set 操作符来更新字段  
        const update = {
            $set: {
                distributionpersonnel: body.distributionpersonnel,
                distributionprogress: body.distributionprogress,
                distributionstatus: body.distributionstatus
            }
        };

        // 执行更新操作  
        const result = await collection.updateOne(query, update);
        // 返回操作结果，通常 result.modifiedCount 会显示有多少文档被修改了  
        // 注意：如果找不到匹配的文档，modifiedCount 将为 0  
        return result.modifiedCount > 0; // 如果成功修改了文档，返回 true；否则返回 false  
    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close(); // 无论如何，最后都关闭连接  
    }
}


// 创建配送任务
async function createDistribution(diyid) {
    // const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0";  
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('supermarket');

        // 现在创建用户文档  
        const orderCollection = database.collection('distribution');
        const orderDoc = {
            distributionid: diyid, // 使用指定的 ID  
            distributionpersonnel: "未分配",// 默认未分配
            distributionprogress: "未开始配送",//默认未开始配送
            distributionstatus: "未完成"// 默认未完成
        };

        await orderCollection.insertOne(orderDoc);

        // 可以选择返回新创建的用户对象（这里未实现）  
        return diyid

    } catch (err) {
        console.error(err);
        return null; // 或者可以抛出一个错误  
    } finally {
        await client.close();
    }
}



module.exports = {
    verifyUserPassword,
    queryUser,
    getUserList,
    updateUser,
    deleteUser,
    createUser,
    getUser,
    setTemperature,
    getTemperature,
    getArticleist,
    getArticle,
    deleteArticle,
    getArticleTypeList,
    getArticleType,
    updateArticle,
    createArticle,
    deleteArticleType,
    updateArticleType,
    createArticleType,
    getOrderList,
    createOrder,
    deleteOrder,
    updateOrder,
    getOrder,
    getDistributionList,
    getDistribution,
    deleteDistribution,
    updateDistribution,
    createDistribution
};