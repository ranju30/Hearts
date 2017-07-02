var http = require("http");
var controller = require("./lib/controller");
http.createServer(controller).listen(process.env.OPENSHIFT_NODEJS_PORT || 8000, process.env.OPENSHIFT_NODEJS_IP);
console.log("server is running at port 8000...");
