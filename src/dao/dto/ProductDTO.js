export default class ProductDTO{
    constructor(product){
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = parseInt(product.price);
        this.thumbnail = product.thumbnail;
        this.stock = parseInt(product.stock);
        this.category = product.category;
        this.code = product.code;
        this.status = product.status;
    }
}