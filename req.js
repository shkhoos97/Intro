"use strict";
const http = require("node:http");

const port = 9999;
const statusNotFound = 404;
const statusOk = 202;
const statusBadRequest = 400;

let nextId = 1;
const posts = [];

function sendResponse(res, {status = statusOk, headers = {}, body = null}) {
  Object.entries(headers).forEach(([key,value]) => {
    res.setHeader(key,value)
  });
  res.writeHead(status);
  res.end(body);
}

function sendJSON(res, body) {
  sendResponse(res, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

const methods = new Map();
methods.set('/posts.get',function(req,res){
  sendJSON(res,posts);
})
methods.set('/posts.getById',function(req,res){});
methods.set('/posts.post',function(req,res){
  if (!searchParams.has('content')) {
    sendResponse(res, {status: statusBadRequest});
    return;
  }

  const content = searchParams.get('content');

  const post = {
    id: nextId++,
    content: content,
    created: Date.now(),
  };

  posts.unshift(post);
  sendJSON(res,post);
});
methods.set('/posts.edit',function(req,res){});
methods.set('/posts.delete',function(req,res){});

const server = http.createServer((req, res) => {
  const {pathName, searchParams} = new URL(req.url, `http://${req.headers.host}`);

  const method = methods.get(pathName)
  if (method === undefined) {
    sendResponse(res, {status: statusNotFound});
    return;
  }

  const params = {
    req,
    res,
    pathname,
    searchParams,
  };

  method(params)
});

server.listen(port);
