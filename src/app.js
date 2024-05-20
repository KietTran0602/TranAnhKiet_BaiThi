import express from "express";
import { create as createHandlebarsEngine } from "express-handlebars";
import {connectMongoDb} from "./config.js"
import {EbooksRepo} from "./db/ebooks.js"
import {EbooksModel} from "./model/ebooks.model.js"
import multer from 'multer';

const multerUploader = multer({
    storage: multer.diskStorage({
        destination:function (req, file, cb) {
            cb(null, 'public/assets/img')
          },
        filename: function (req, file, cb) {
            const originalName = file.originalname;
            const [name, ext]= originalName.split(".");
            const filename = `${name}_${Date.now()}.${ext}`;
            cb(null,filename) //(err, filename)
          }
    })
})
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
connectMongoDb();


app.get("/", (req, res)=>{
    res.render("index",{
        pageCode: "index"
    }
    );
});
app.get("/index", (req, res)=>{
    res.render("index",{
        pageCode: "index"
    });
});
app.get("/ebooks", async (req, res)=>{
    const ebooksItems = await EbooksRepo.getItem();
    res.render("ebooks",{
        pageCode: "ebooks",
        ebooksItems
    });
});

app.get("/ebooks/add-ebook", async (req, res)=>{
    const ebooksItems = await EbooksRepo.getItem();
    res.render("add-ebook",{
        pageCode: "ebooks"
    });
});

app.post("/ebooks/add-ebook",multerUploader.single("image"), async (req, res)=>{
    const data = req.body;
    const file = req.file;
    await EbooksModel.create({
        name: data.name,
        author: data.author,
        desc: data.desc,
        numofpage: data.numofpage,
        releasedate: data.releasedate,
        price: data.price,
        image: data.image
    });
    res.redirect("/ebooks");
});

app.get("/ebooks/add-ebook/:id", async (req,res)=>{
    const id = req.params.id;
    const ebook = await EbooksModel.findById(id).lean();
    console.log(ebook);
    res.render("add-ebook",{
        pageCode: "ebooks",
        ebook,
        isEditing: true,
    }); 
});

app.post("/ebooks/add-ebook/:id", async (req,res)=>{
    const id = req.params.id;
    const data = req.body;
    const file = req.file;
    await EbooksModel.updateOne(
        {
            _id: id,
        },
        {
            $set: {
                name: data.name,
                author: data.author,
                desc: data.desc,
                numofpage: data.numofpage,
                releasedate: data.releasedate,
                price: data.price,
                image: data.image
            }
        }
    );
    res.redirect("/ebooks");
});

app.delete("/ebooks/:id/delete", async (req,res)=>{
    const id = req.params.id;
    await EbooksModel.deleteOne({
        _id: id
    });

    res.json({
        status:true
    });
});

app.listen(3000, ()=> {
    console.log("app is running on port 3000");
});