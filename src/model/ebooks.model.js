import mongoose from "mongoose";

const schema1 = new mongoose.Schema({
    name: String,
    author: String,
    desc: String,
    numofpage: Number,
    releasedate: String,
    price: Number,
    image: {
        type : String
    }
});

export const EbooksModel = mongoose.model("Ebook", schema1,"ebooks");