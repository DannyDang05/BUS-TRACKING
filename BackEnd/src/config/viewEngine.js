import express from "express"

const configViewEngine = (app) =>{
    app.use(express.static("./src/public")) //* cau hinh client lay du lieu
    app.set("view engine", "ejs");
    app.set("views", "./src/View"); //* cau hinh noi viet ejs
}

export default configViewEngine;
