const productCatalog=require( './productCatalog.js');
const {cart,listDiscounts,BuyOneGetOneFreeFashion,TenPercentOffElectronics,CurrencyConverter,Discount}=require( './Ecommerce.js');

// Command-line processing
const args = process.argv.slice(2);

switch (args[0]) {
    case "add_to_cart":
        const product = productCatalog[args[1]];
        const quantity = parseInt(args[2]);
        if (product) {
            cart.addToCart(product, quantity);
        } else {
            console.log("Product not found.");
        }
        break;

    case "remove_from_cart":
        const productId = args[1];
        const removeQuantity = args[2] ? parseInt(args[2]) : 0;
        cart.removeFromCart(productId, removeQuantity);
        break;

    case "view_cart":
        cart.viewCart();
        break;

    case "list_discounts":
        listDiscounts();
        break;

    case "checkout":
        const currency = args[1] || "USD";
        cart.discounts = [new BuyOneGetOneFreeFashion(), new TenPercentOffElectronics()];
        cart.checkout(currency);
        break;

    default:
        console.log("Command not recognized. Available commands:");
        console.log("> add_to_cart [productID] [quantity]");
        console.log("> remove_from_cart [productID] [quantity]");
        console.log("> view_cart");
        console.log("> list_discounts");
        console.log("> checkout [currency]");
}