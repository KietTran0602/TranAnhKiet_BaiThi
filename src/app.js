import express from "express";
import { create as createHandlebarsEngine } from "express-handlebars";

const app = express();
app.use(express.json());

const handlebarsEngine = createHandlebarsEngine({
    extname: "handlebars", //duoi tat ca file la .handlebars
    defaultLayout: "main",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    helpers: {
      eq: (left, right)=>{
        return left === right;
      }
    }
  });
  //cấu hình req body


  //khai bao engine handlebars
app.engine("handlebars", handlebarsEngine.engine);
//su dung handlebar
app.set("view engine", "handlebars");
//cau hinh folder handlebar
app.set("views", "views/pages");

app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/", (req, res)=>{
    res.render("index");
});
app.get("/index", (req, res)=>{
    res.render("index");
});
app.get("/ebooks", (req, res)=>{
    res.render("ebooks");
});

app.listen(3000, ()=> {
    console.log("app is running on port 3000");
});