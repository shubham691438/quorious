const exp = require("constants");

// Product class
class Product {
    constructor(productID, name, price, category) {
        this.productID = productID;
        this.name = name;
        this.price = price;
        this.category = category;
    }
}
// Product Catalog
const productCatalog = {
    "P001": new Product("P001", "Laptop", 1000.00, "Electronics"),
    "P002": new Product("P002", "Phone", 500.00, "Electronics"),
    "P003": new Product("P003", "T-Shirt", 20.00, "Fashion")
};

module.exports = productCatalog;