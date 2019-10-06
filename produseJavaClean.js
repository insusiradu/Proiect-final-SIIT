var lista=[]

async function draw(){
	var response = await fetch("https://electroit-d9de1.firebaseio.com/.json");
	window.lista = await response.json();
	var str = "";
	for(var i in lista){
		str+=`
		<div class="container col-xs-12 col-md-6 col-lg-3">
			<div class="product">
				<div class="productPicture">
					<img src="${lista[i].imagine}">
				</div>
				<div class="productDescr">${lista[i].nume}</div>
				<div class="productPrice">${lista[i].pret} <span>Lei</span></div>
				<div class="productButton">
					<a href="detaliuProdusClean.html?id=${i}">
						<input id="detailsBtn" type="button" name="" value="Detalii">
					</a>
				</div>
			</div>
		</div>`;
	}	
	document.querySelector("#productSection").innerHTML = str;
}

async function drawDetails(){
	var i = window.location.search.substring(4);
	var response = await fetch(`https://electroit-d9de1.firebaseio.com/${i}.json`);
	window.product= await response.json();
	var str = "";
	str+=`<div class="container col-xs-12 col-md-6 col-lg-3">
				<div class="product">
					<div class="productPicture">
						<img src="${product.imagine}">
					</div>
					<div class="productTitle">${product.nume}</div>
					<div class="productDescr">${product.descriere}</div>
					<div class="productStock">In stoc: <span>${product.cantitate}</span> <span>buc.</span> </div>
					<div class="productQty">Cantitate: 
						<span>
							<input id="detailsQtyProd" type="number" name="quantity" min="1" max="1000" value="1">
						</span>
					</div>
					<div class="productPrice">${product.pret} <span>Lei</span></div>
					<div>
						<a href="cosProduseClean.html?">
							<input id="cartBtn" type="button" name="" value="Adauga in cos" onclick="adaugaInCos()">
						</a>
					</div>
				</div>
			</div>`;
	document.querySelector("#productSection").innerHTML = str;
}

function adaugaInCos(){
	var i = window.location.search.substring(4);
	alert("Produsul a fost adaugat in cos");
	var original = localStorage.getItem("myStore");
	if(original!==null){
		var lista = JSON.parse(original);
	}else{
		var lista = {};
	}
	product.quantity = document.querySelector("#detailsQtyProd").value;
	lista[i]=product;
	
	localStorage.setItem("myStore", JSON.stringify(lista));
}

function drawCart(){
	var original = localStorage.getItem("myStore");
	if(original!==null){
		var lista = JSON.parse(original);
		str = "";
		for(var i in lista){
			str+=`
			<div class="cart-row">
	            <span class="cart-item cart-column">
	            	<img class="cart-item-image" src="${lista[i].imagine}" width="90" height="90">
	            	<span class="cart-item-title">${lista[i].nume}</span>
	            </span>
	            <span class="cart-price cart-column">
	            	<span class="cart-price">${lista[i].pret} Lei </span>
	            </span>
	            <span class="cart-quantity cart-column">
	            	<input class="cart-quantity-input qtyProdInCart" type="number" name="qtyInCos" value="${lista[i].quantity}" onclick="quantityChanged(event); cartQtyChange(${i})">
	        	</span>
	            <span class="cartSubtotal cart-column"> ${lista[i].pret*lista[i].quantity}</span>
	            <span class="cart-remove cart-column">
	            	<button class="btn btn-danger" type="button" onclick="deleteFromCart(${i})">STERGE</button>
	            </span>
	       	</div>
			`;
		}	
		document.querySelector("#productRows").innerHTML = str;
	}
	updateCartTotal();
}


function deleteFromCart(index) {
	var produseInCos = JSON.parse(localStorage.getItem("myStore"));
	delete produseInCos[index];
	localStorage.setItem("myStore", JSON.stringify(produseInCos));
	drawCart();
}



// Nu sterge. O folosesti la update cart total
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        alert ("Introduceti o cantitate valida");
        input.value = 1;
    }
    updateCartTotal();
}

function updateCartTotal() {
    var cartItemContainer = document.getElementById('productRows');
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText);
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = total + ' Lei';
}


function deleteAllFromCart () {
	alert("Comanda dvs. a fost preluata. Va multumim pentru cumparaturile facute!");
	window.localStorage.clear();
	location.reload(); 
}

function cartQtyChange (index) {
	var cartProd = JSON.parse(localStorage.getItem("myStore"));
	var qtyA = document.getElementsByClassName("qtyProdInCart")[index].value;
	var qty = parseFloat(qtyA);
	cartProd[index].quantity = qty;
	localStorage.setItem("myStore", JSON.stringify(cartProd));
	drawCart();
}