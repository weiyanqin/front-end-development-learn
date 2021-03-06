var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
  }

var server = http.createServer(function (request, response) {

    var temp = url.parse(request.url,true)
    var path = temp.pathname
    var query = temp.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/


    if (path === '/') {
        var string = fs.readFileSync('./index4.html', 'utf8')
        var amount = fs.readFileSync('./db', 'utf8')
        string = string.replace('&&&amount&&&', amount)
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(string)
        response.end
    } else if (path === './style.css') {
        var string = fs.readFileSync('./style.css', 'utf8')
        response.setHeader('Content-Type', 'text/css')
        response.write(string)
        response.end()
    } else if (path === './main.js') {
        var string = fs.readFileSync('./main.js', 'utf8')
        response.setHeaderSync('./server.js', 'utf8')
        response.write(string)
        response.end()
    } else if (path === '/pay') {
        var amount = fs.readFileSync('./db', 'utf8')
        var newNumber = amount - 1
        fs.writeFileSync('./db', newNumber) //改写数据库,把减1后的值存放在数据库中
        response.setHeader('Content-Type', 'application/javascript')
        response.statusCode = 200
        response.write(`${query.callback}.call(undefined,{
            "success":true,
            "left":${newNumber}
        })`)//括号俩免得代码当做js执行，是基于http协议
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf8')
        response.write('找不到对应的路径,你需要自行修改 main.js')
        response.end()
    }

    /******** 代码结束，下面不要看 ************/
})
server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)