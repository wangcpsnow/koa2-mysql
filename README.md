#Koa2-mysql
===

Middleware for koa2 mysql

1.GET 
2.POST 
3.PUT 
4.DELETE


## Install
```
npm install koa2-mysql --save
```

## Usage

```
import Koa from "koa";
import koa2Mysql from "koa2-mysql";

app.use(koa2Mysql)

app.use(async ctx => {
    let res = await ctx.mysqlQuery('tbname').get({'id': 1});
});


```




## License

MIT