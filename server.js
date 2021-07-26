#!/usr/bin/env node

/**
 * @file Server for local use
 * @author Fredrik Lidström
 * @copyright 2021 Fredrik Lidström
 * @license MIT (MIT)
*/

const http = require("http");
const fs = require("fs");
const session = require("./functions/session");
const captcha = require("./functions/captcha");
const authenticate = require("./functions/authenticate");
const validate = require("./functions/validate");

const PORT = Number(process.env["LISTEN_PORT"]) || 15198;
const HOSTNAME = Number(process.env["LISTEN_HOST"]) || "";

if (!process.versions || !process.versions.node || parseInt(process.versions.node.split(".")[0]) < 12) {
  throw new Error("Node version 12.0.0 or higher required");
}

http
  .createServer(function (request, response) {
    let inputBody = "";
    request
      .on("data", chunk => (inputBody += chunk))
      .on("end", async () => {
        if (request.url === "/session") {
          /** Tesla API Proxy function **/
          const payload = await session.handler();
          response.writeHead(payload.statusCode, payload.headers);
          response.write(payload.body);
          response.end();

        } else if (request.url === "/authenticate") {
          /** Tesla API Proxy function **/
          const payload = await authenticate.handler({ body: inputBody });
          response.writeHead(payload.statusCode, payload.headers);
          response.write(payload.body);
          response.end();

        } else if (request.url === "/captcha") {
          /** Tesla API Proxy function **/
          const payload = await captcha.handler({ body: inputBody });
          response.writeHead(payload.statusCode, payload.headers);
          response.write(payload.body);
          response.end();

        } else if (request.url === "/validate") {
          /** Tesla API Proxy function **/
          const payload = await validate.handler({ body: inputBody });
          response.writeHead(payload.statusCode, payload.headers);
          response.write(payload.body);
          response.end();

        } else if (request.url === "/") {
          /** HTML page **/

          fs.readFile("index.html", "binary", (err, file) => {
            if (!err) {
              response.writeHead(200);
              response.write(file, "binary");
            } else {
              response.writeHead(500);
            }
            response.end();
          });
        } else {
          response.writeHead(404);
          response.end();
        }
      })
      .on("error", () => {
        response.writeHead(500);
        response.end();
      });
  })
  .listen(PORT, HOSTNAME)
  .on("listening", () => {
    console.log(`Connect to http://localhost:${PORT}`);
  });
