
import {EbooksModel} from "../model/ebooks.model.js"

export class EbooksRepo {
    static async getItem(){
        const items = await EbooksModel.find({}).lean();
        return items;
    }

    static async createItem(Cname){
        const item = new EbooksModel({
            name,
            author,
            desc,
            numofpage,
            releasedate,
            price,
            image
        });
        return await EbooksModel.create(item);
    }
}