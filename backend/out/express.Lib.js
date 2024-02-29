"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express = () => {
    let mapping = [];
    const server = http_1.default.createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        if (mapping[req.url]) {
            return res.end(JSON.stringify(mapping[req.url]));
        }
        res.end(JSON.stringify({
            data: "invalid url",
        }));
    });
    return {
        get: (url, requestListenerFunction) => {
            requestListenerFunction(null, {
                json: (data) => {
                    mapping[url] = data;
                },
            });
        },
        listen: (port) => {
            server.listen(port);
        },
    };
};
exports.default = express;
