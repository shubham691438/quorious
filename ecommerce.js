const fs = require('fs');
const path = require('path');
const productCatalog=require( './productCatalog.js');



// CartItem class
class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    itemTotal() {
        return this.product.price * this.quantity;
    }
}

// Cart class
class Cart {
    constructor() {
        this.items = [];
        this.discounts = [];
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.productID === product.productID);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(product, quantity));
        }
        console.log(`Added ${quantity} ${product.name}(s) to the cart.`);
        this.saveCart();
    }

    removeFromCart(productID, quantity = 0) {
        const index = this.items.findIndex(item => item.product.productID === productID);
        if (index !== -1) {
            if (quantity === 0 || this.items[index].quantity <= quantity) {
                console.log(`Removed ${this.items[index].product.name} from the cart.`);
                this.items.splice(index, 1);
            } else {
                this.items[index].quantity -= quantity;
                console.log(`Reduced quantity of ${this.items[index].product.name} by ${quantity}.`);
            }
            this.saveCart();
        }
    }

    viewCart() {
        let total = 0;
        if (this.items.length === 0) {
            console.log("Your cart is empty.");
            return;
        }
        console.log("Your Cart:");
        this.items.forEach(item => {
            console.log(`${item.product.name} - Quantity: ${item.quantity}, Price: ${item.product.price.toFixed(2)} USD, Total: ${item.itemTotal().toFixed(2)} USD`);
            total += item.itemTotal();
        });
        console.log(`Total (before discounts): ${total.toFixed(2)} USD`);
        return total;
    }

    applyDiscounts() {
        let total = this.viewCart();
        this.discounts.forEach(discount => {
            total = discount.apply(this.items, total);
        });
        return total;
    }

    checkout(currency = "USD") {
        let total = this.applyDiscounts();
        if (currency !== "USD") {
            total = CurrencyConverter.convert(total, currency);
        }
        console.log(`Final Total in ${currency}: ${total.toFixed(2)}`);
    }

    saveCart() {
        fs.writeFileSync('cart.json', JSON.stringify(this, null, 2));
    }

    static loadCart() {
        if (fs.existsSync('cart.json')) {
            const data = JSON.parse(fs.readFileSync('cart.json'));
            const cart = new Cart();
            cart.items = data.items.map(item => new CartItem(productCatalog[item.product.productID], item.quantity));
            return cart;
        }
        return new Cart();
    }
}

// Discount classes
class Discount {
    apply(items, total) {
        throw new Error("This method should be overridden in subclasses");
    }
}

class BuyOneGetOneFreeFashion extends Discount {
    apply(items, total) {
        let discount = 0;
        items.forEach(item => {
            if (item.product.category === "Fashion" && item.quantity >= 2) {
                discount += Math.floor(item.quantity / 2) * item.product.price;
            }
        });
        console.log(`Buy 1 Get 1 Free on Fashion items applied. Discount: ${discount.toFixed(2)} USD`);
        return total - discount;
    }
}

class TenPercentOffElectronics extends Discount {
    apply(items, total) {
        let discount = 0;
        items.forEach(item => {
            if (item.product.category === "Electronics") {
                discount += item.itemTotal() * 0.10;
            }
        });
        console.log(`10% Off on Electronics applied. Discount: ${discount.toFixed(2)} USD`);
        return total - discount;
    }
}

// CurrencyConverter class
class CurrencyConverter {
    static rates = {
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.75
    };

    static convert(amount, currency) {
        return amount * this.rates[currency];
    }
}



// Load Cart from file or create a new one
const cart = Cart.loadCart();

// List available discounts
function listDiscounts() {
    console.log("Available Discounts:");
    console.log("1. Buy 1 Get 1 Free on Fashion items");
    console.log("2. 10% Off on Electronics");
}


module.exports = {cart,listDiscounts,BuyOneGetOneFreeFashion,TenPercentOffElectronics,CurrencyConverter,Discount};

