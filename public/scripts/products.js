const storeId = window.location.pathname.match(/\/([0-9]+)\/?/)[1];
const dataUrl = '/dashboard/storeconfig/' + storeId + '/data';

let productTable;
let modal;

let newProductFlag = false;
let currProductID;
let products = {};

$(document).ready(function () {
    productTable = $('#productTable tbody');
    modal = $('#productModal');

    $('button#btn_new').click(function () {
        showNewProductModal();
    });

    productTable.on('click', 'button#btn_edit', function () {
        console.log("clicked edit button");
        let id = $(this).data('id');
        loadAndShowProduct(id);
    });

    productTable.on('click', 'button#btn_delete', function () {
        console.log("clicked delete button");
        let id = $(this).data('id');
        deleteProduct(id);
        $(this).parents("tr").remove();
    });

    // btn_save
    $('form').on('submit', function (e) {
        modal.modal('hide');
        let data = {};
        let inputs = $(this).serializeArray();
        inputs.forEach(function (input) {
           data[input.name] = input.value;
        });

        if(newProductFlag) {
            addProduct(data);
        } else {
            data.id = currProductID;
            updateProduct(data);
        }

        e.preventDefault();
    });

    loadProducts();
});

function loadProducts() {
    $.ajax({
        method: 'GET',
        url: dataUrl + '/products',
        success: function(data) {
            if(data.length === 0) {
                console.log("No products in database")
            } else {
                console.log("Products from database: ", data);

                for(let i=0; i<data.length; i++) {
                    products[data[i].id] = data[i];
                }

                console.log(products);
                fillProductTable(data);
            }
        }
    });
}

function fillProductTable(data) {
    data.forEach(function (product) {
        addProductRow(product)
    });
}

function loadAndShowProduct(id) {
    showProductModal(products[id]);
    currProductID = id;
}

function updateProduct(product) {
    $.ajax({
        method: 'PUT',
        url: dataUrl + '/products/' + product.id,
        contentType: 'application/json',
        data: JSON.stringify(product),
        success: function(result) {
            console.log("product info updated in database: ", result);
            products[product.id] = product;
            updateProductRow(product);
        }
    });
}

function addProduct(product) {
    $.ajax({
        method: 'POST',
        url: dataUrl + '/products',
        contentType: 'application/json',
        data: JSON.stringify(product),
        success: function(result) {
            console.log("product info saved in database: ", result);
            let id = result.insertId;
            product.id = id;
            products[id] = product;
            addProductRow(product);
        }
    });
}

function deleteProduct(id) {
    $.ajax({
        method: 'DELETE',
        url: dataUrl + '/products/' + id,
        success: function(result) {
            console.log("product with id " + id + " deleted from database", result);
        }
    });
}

function showNewProductModal() {
    newProductFlag = true;
    modal.find('.modal-title').text('New product');
    modal.find('input#name').val('new product');
    modal.find('input#duration').val(1);
    modal.find('input#maxOverlapAtStart').val(1);
    modal.find('input#pricePerPerson').val(20);
    modal.find('input#minPersons').val(1);
    modal.find('input#maxPersons').val(4);
    modal.modal('show');
}

function showProductModal(product) {
    newProductFlag = false;
    modal.find('.modal-title').text('Edit product');
    modal.find('input#name').val(product.name);
    modal.find('input#duration').val(product.duration);
    modal.find('input#maxOverlapAtStart').val(product.maxOverlapAtStart);
    modal.find('input#pricePerPerson').val(product.pricePerPerson);
    modal.find('input#minPersons').val(product.minPersons);
    modal.find('input#maxPersons').val(product.maxPersons);
    modal.modal('show');
}

function addProductRow(product) {
    let html =
        '\
            <tr data-id="' + product.id + '">\
                <td><input type="checkbox"></td>\
                <td>' + product.name + '</td>\
                <td>\
                    <button class="btn btn-primary" id="btn_edit" type="button" data-id="' + product.id + '">Edit</button> \
                    <button class="btn btn-danger" id="btn_delete" type="button" data-id="' + product.id + '">Delete</button> \
                </td>\
            </tr>\
        ';

    let dom = $(html);
    productTable.append(dom);
}

function updateProductRow(product) {
    $('tr[data-id=' + product.id + ']').find('td').eq(1).text(product.name);
}

function getColumnIndex(colname) {
    let index = productTable.find('th.col-' + colname).parent().index();

    console.log("index of col-" + colname + " = " + index);
}
