// Simple POS demo script
const products = [
    {id:1,name:'Apple Pie',price:3.50,category:'Pies',img:'https://via.placeholder.com/80?text=Pie',stock:15},
    {id:2,name:'Blueberry Pie',price:3.75,category:'Pies',img:'https://via.placeholder.com/80?text=Pie',stock:12},
    {id:3,name:'Latte',price:4.00,category:'Drinks',img:'https://via.placeholder.com/80?text=Latte',stock:50},
    {id:4,name:'Espresso',price:2.50,category:'Drinks',img:'https://via.placeholder.com/80?text=Espresso',stock:3},
    {id:5,name:'Cactus Smoothie',price:5.50,category:'Drinks',img:'https://via.placeholder.com/80?text=Drink',stock:8},
    {id:6,name:'Scone',price:2.25,category:'Snacks',img:'https://via.placeholder.com/80?text=Scone',stock:25},
    {id:7,name:'Muffin',price:2.00,category:'Snacks',img:'https://via.placeholder.com/80?text=Muffin',stock:2},
    {id:8,name:'Croissant',price:2.75,category:'Snacks',img:'https://via.placeholder.com/80?text=Croissant',stock:18},
    {id:9,name:'Whipped Cream',price:0.50,category:'Add-ons',img:'https://via.placeholder.com/80?text=Add',stock:100},
    {id:10,name:'Extra Shot',price:0.75,category:'Add-ons',img:'https://via.placeholder.com/80?text=Add',stock:200},
    {id:11,name:'Cactus Juice',price:3.00,category:'Drinks',img:'https://via.placeholder.com/80?text=Juice',stock:5},
    {id:12,name:'Chocolate Chip Cookie',price:1.50,category:'Snacks',img:'https://via.placeholder.com/80?text=Cookie',stock:0},
];

let cart = [];
let heldOrders = [];
let currentCategory = 'All';

// helper functions
function $(id){return document.getElementById(id);}  

function renderCategories(){
    const cats = ['All','Pies','Drinks','Snacks','Add-ons'];
    const container = $('pos-categories');
    if(!container) console.warn('pos-categories element missing');
    container.innerHTML = '';
    cats.forEach(cat=>{
        const chip=document.createElement('div');
        chip.className='category-chip'+(cat===currentCategory?' active':'');
        chip.textContent=cat;
        chip.onclick=()=>{currentCategory=cat;updateProducts();};
        container.appendChild(chip);
    });
}

function updateProducts(){
    const grid=$('products-grid');
    if(!grid) console.warn('products-grid missing');
    const qEl=$('pos-search');
    const query=qEl ? qEl.value.toLowerCase() : '';
    grid.innerHTML='';
    products.filter(p=>{
        if(currentCategory!=='All'&&p.category!==currentCategory) return false;
        if(query && !p.name.toLowerCase().includes(query)) return false;
        return true;
    }).forEach(p=>{
        const card=document.createElement('div');
        card.className='product-card';
        const stockStatus = p.stock === 0 ? 'out-of-stock' : p.stock <= 5 ? 'low-stock' : 'in-stock';
        const stockDisplay = p.stock === 0 ? 'OUT OF STOCK' : `Stock: ${p.stock}`;
        card.innerHTML=`<div class="name">${p.name}</div><div class="price">$${p.price.toFixed(2)}</div><div class="stock-badge ${stockStatus}">${stockDisplay}</div><button ${p.stock === 0 ? 'disabled' : ''}>Add</button>`;
        card.querySelector('button').onclick=()=>addToCart(p);
        grid.appendChild(card);
    });
}

function addToCart(item){
    console.log('addToCart called', item);
    if(item.stock === 0) {
        showModal('❌ This item is out of stock!');
        return;
    }
    const cartQty = cart.reduce((sum, c) => (c.id === item.id ? sum + c.qty : sum), 0);
    if(cartQty >= item.stock) {
        showModal(`⚠️ Cannot add more. Only ${item.stock} available in stock.`);
        return;
    }
    const existing=cart.find(c=>c.id===item.id);
    if(existing){existing.qty++;}
    else cart.push({...item,qty:1});
    renderCart();
}


function renderCart(){
    const cartEl=$('pos-cart');
    cartEl.innerHTML='';
    cart.forEach(i=>{
        const row=document.createElement('div');
        row.className='cart-item';
        row.innerHTML=`<span>${i.name}</span><span class="qty-controls"><button>-</button><span>${i.qty}</span><button>+</button></span><span>$${(i.price*i.qty).toFixed(2)}</span><button class="remove">x</button>`;
        row.querySelector('button.remove').onclick=()=>{cart=cart.filter(c=>c.id!==i.id);renderCart();};
        const buttons=row.querySelectorAll('.qty-controls button');
        const minus=buttons[0];
        const plus=buttons[1];
        minus.onclick=()=>{if(i.qty>1){i.qty--;renderCart();}};
        plus.onclick=()=>{
            if(i.qty<i.stock){i.qty++;renderCart();}
            else showModal(`⚠️ Max quantity for ${i.name} is ${i.stock}`);
        };
        cartEl.appendChild(row);
    });
    updateTotals();
    updateCheckout();
}

function updateTotals(){
    let subtotal=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
    const tax=subtotal*0.07;
    const total=subtotal+tax;
    let html=`<div class="totals"><div>Subtotal: $${subtotal.toFixed(2)}</div><div>Tax: $${tax.toFixed(2)}</div><div class="total"><strong>Total: $${total.toFixed(2)}</strong></div></div>`;
    html+=`<input class="promo" placeholder="Promo code" />`;
    html+=`<div class="cart-buttons"><button id="hold-btn">Hold Order</button><button id="clear-btn">Clear Cart</button></div>`;
    $('pos-cart').insertAdjacentHTML('beforeend',html);
    $('hold-btn').onclick=holdOrder;
    $('clear-btn').onclick=()=>{cart=[];renderCart();};
}

function updateCheckout(){
    const ch=$('pos-checkout');
    ch.innerHTML='';
    const subtotal=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
    const tax=subtotal*0.07;
    const total=subtotal+tax;
    let methods=['Card','Cash','QR','Split'];
    let html='<div class="payment-methods">';
    methods.forEach(m=>html+=`<div class="payment-method">${m}</div>`);
    html+='</div>';
    html+=`<button id="charge-btn" class="charge-btn${cart.length? '':' disabled'}">Charge $${total.toFixed(2)}</button>`;
    html+=`<div class="receipt"><div><strong>Cactus Café</strong></div>`;
    cart.forEach(i=>html+=`<div class="item"><span>${i.qty}x ${i.name}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`);
    html+=`<div class="item"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>`;
    html+=`<div class="item total"><strong>Total</strong><strong>$${total.toFixed(2)}</strong></div>`;
    html+='</div><div class="receipt-buttons"><button id="print-btn">Print</button><button id="email-btn">Email Receipt</button></div>';
    ch.innerHTML=html;
    if(cart.length) $('charge-btn').onclick=charge;
}

function holdOrder(){
    if(cart.length){ heldOrders.push(cart.slice()); cart=[]; renderCart(); showModal('Order held.'); }
}

function charge(){
    // Deduct stock from inventory
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if(product) {
            product.stock -= item.qty;
        }
    });
    showModal('✅ Payment Successful (Demo)'); 
    cart=[]; 
    renderCart();
    updateProducts();
}

function showModal(msg){
    const modal=$('pos-modal');
    $('pos-modal-body').textContent=msg;
    modal.classList.remove('hidden');
}

function showInventoryModal(){
    const modal=$('pos-modal');
    let html='<h3>📊 Inventory Management</h3>';
    html+='<div class="inventory-list">';
    products.forEach(p=>{
        const status = p.stock === 0 ? '🔴' : p.stock <= 5 ? '🟡' : '🟢';
        html+=`<div class="inventory-item">
            <div class="inventory-info">
                <strong>${p.name}</strong>
                <span>${status} Stock: ${p.stock}</span>
            </div>
            <div class="inventory-controls">
                <button class="stock-btn minus" data-id="${p.id}">-</button>
                <input type="number" class="stock-input" data-id="${p.id}" value="${p.stock}" min="0">
                <button class="stock-btn plus" data-id="${p.id}">+</button>
            </div>
        </div>`;
    });
    html+='</div>';
    html+='<div class="inventory-buttons"><button id="save-inventory">Save Changes</button><button id="close-inventory">Close</button></div>';
    $('pos-modal-body').innerHTML=html;
    modal.classList.remove('hidden');
    
    // Add event listeners
    document.querySelectorAll('.stock-btn.minus').forEach(btn=>{
        btn.onclick=()=>{
            const id=parseInt(btn.dataset.id);
            const input=document.querySelector(`.stock-input[data-id="${id}"]`);
            let val=parseInt(input.value);
            if(val>0) input.value=val-1;
        };
    });
    document.querySelectorAll('.stock-btn.plus').forEach(btn=>{
        btn.onclick=()=>{
            const id=parseInt(btn.dataset.id);
            const input=document.querySelector(`.stock-input[data-id="${id}"]`);
            let val=parseInt(input.value);
            input.value=val+1;
        };
    });
    $('save-inventory').onclick=()=>{
        document.querySelectorAll('.stock-input').forEach(input=>{
            const id=parseInt(input.dataset.id);
            const product=products.find(p=>p.id===id);
            if(product) product.stock=parseInt(input.value);
        });
        updateProducts();
        showModal('✅ Inventory updated successfully!');
    };
    $('close-inventory').onclick=()=>modal.classList.add('hidden');
}

function initTime(){
    const el=$('pos-time');
    setInterval(()=>{el.textContent=new Date().toLocaleTimeString();},1000);
}

// search
$('pos-search').addEventListener('input',updateProducts);

// modal close
$('pos-modal').addEventListener('click',e=>{if(e.target.classList.contains('pos-modal-close')||e.target===$('pos-modal')) $('pos-modal').classList.add('hidden');});

// inventory button click
if($('stock-mgmt-btn')) $('stock-mgmt-btn').onclick=showInventoryModal;

// init
renderCategories();
updateProducts();
renderCart();
initTime();
