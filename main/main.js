const database = require("../main/datbase.js");

function selectAllItems(inputs, allitems) {
    let items = [];
    inputs.forEach(function count1(item) {

        let itemBarcode = item.split("-")[0] ? item.split("-")[0] : item;
        let itemCount = item.split("-")[1] ? parseInt(item.split("-")[1], 10) : 1;

        for (let i = 0; i < items.length; i++) {
            if (itemBarcode === items[i].barcode) {
                items[i].count += itemCount;
                return;
            }
        }

        allitems.forEach(function count2(data) {
            if (itemBarcode === data.barcode) {
                items.push({
                    barcode: itemBarcode,
                    name: data.name,
                    count: itemCount,
                    unit: data.unit,
                    price: data.price
                });
            }
        });
    });
    return items;
}


function countPromotion(items, discount) {
    let promotions = [];
    items.forEach(function count3(item) {
        if (discount[0].barcodes.includes(item.barcode)) {
            let countPromotions = Math.floor(item.count / 3);
            promotions.push({
                name: item.name,
                count: countPromotions,
                unit: item.unit
            });
        }
    });
    return promotions;
}

function makeInventory(items, promotions) {
    let str = "";
    let st = "";
    let sum = 0;
    let sumPromotion = 0;
    let sumEnd = '';

    items.forEach(
        function count4(item) {

            let sumPrice = item.count * item.price;

            promotions.forEach(
                function count5(elem) {
                    if (elem.name === item.name) {
                        sumPrice -= elem.count * item.price;
                        sumPromotion += elem.count * item.price;
                        st += "名称：" + elem.name + "，数量：" + elem.count + elem.unit + "\n";
                    }
                });

            str += "名称：" + item.name + "，数量：" + item.count
                + item.unit + "，单价：" + item.price.toFixed(2) + "(元)，小计：" + sumPrice.toFixed(2) + "(元)\n";
            sum += sumPrice;

        });
    sumEnd = "总计：" + sum.toFixed(2) + "(元)\n" +
        "节省：" + sumPromotion.toFixed(2) + "(元)\n";

    let Inventory = '***<没钱赚商店>购物清单***\n' + str + '----------------------\n' + "挥泪赠送商品：\n" + st + '----------------------\n' + sumEnd +
        '**********************';
    return Inventory;
}
module.exports = function main(inputs) {
    let allitems = database.loadAllItems();
    let discount = database.loadPromotions();
    let items = selectAllItems(inputs, allitems);
    let promotions = countPromotion(items, discount);
    let result = makeInventory(items, promotions);
    console.log(result);
};