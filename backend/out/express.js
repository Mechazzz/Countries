"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_Lib_1 = __importDefault(require("./express.Lib"));
// először simán szervert csiálo, ami jsont ad vissza
const server = (0, express_Lib_1.default)();
server.get("/api/countries", (req, res) => {
    res.json({
        data: ["Finnország", "Dánia"],
    });
});
server.get("/api/cities", (req, res) => {
    res.json({
        data: ["Helsinki", "Koppenhága"],
    });
});
server.listen(4001);
