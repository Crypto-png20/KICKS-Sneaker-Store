function getCart(){
  return JSON.parse(localStorage.getItem("kicksCart")) || [];
}
function saveCart(cart){
  localStorage.setItem("kicksCart", JSON.stringify(cart));
}
function updateCartCount(){
  const count = getCart().reduce((sum,item)=>sum + item.qty,0);
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);
}
function addToCart(name,price,image,size="9"){
  const cart=getCart();
  const existing=cart.find(item=>item.name===name && item.size===size);
  if(existing) existing.qty++;
  else cart.push({name,price,image,size,qty:1});
  saveCart(cart); updateCartCount();
  alert(name+" added to cart!");
}
function addSelected(name,price,image,sizeId){
  const size=document.getElementById(sizeId).value;
  addToCart(name,price,image,size);
}
function changeQty(index,delta){
  const cart=getCart();
  cart[index].qty+=delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart(cart); renderCart(); updateCartCount();
}
function removeItem(index){
  const cart=getCart(); cart.splice(index,1); saveCart(cart); renderCart(); updateCartCount();
}
function renderCart(){
  const area=document.getElementById("cartArea");
  if(!area) return;
  const cart=getCart();
  if(cart.length===0){
    area.innerHTML='<div class="empty-cart"><div class="empty-icon">🛒</div><h2>Your cart is empty</h2><p>Add some sneakers and come back here.</p><a class="btn red-btn" href="products.html">SHOP SNEAKERS →</a></div>';
    return;
  }
  let subtotal=0;
  let rows="";
  cart.forEach((item,index)=>{
    subtotal += item.price*item.qty;
    rows += `<div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details"><small>SIZE ${item.size}</small><h3>${item.name}</h3><strong>₹${item.price.toLocaleString("en-IN")}</strong></div>
      <div class="quantity"><button onclick="changeQty(${index},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${index},1)">+</button></div>
      <button class="remove" onclick="removeItem(${index})">REMOVE</button>
    </div>`;
  });
  area.innerHTML=`<div class="cart-layout"><div class="cart-list">${rows}</div>
    <aside class="cart-summary"><h2>Order Summary</h2><div><span>Subtotal</span><strong>₹${subtotal.toLocaleString("en-IN")}</strong></div><div><span>Delivery</span><strong>${subtotal>=4999?"FREE":"₹199"}</strong></div><hr><div class="grand"><span>Total</span><strong>₹${(subtotal+(subtotal>=4999?0:199)).toLocaleString("en-IN")}</strong></div><a class="btn red-btn full-btn" href="payment.html">PROCEED TO PAYMENT →</a></aside></div>`;
}
function renderPaymentSummary(){
  const box=document.getElementById("paymentItems");
  const totalEl=document.getElementById("paymentTotal");
  if(!box) return;
  const cart=getCart();
  let total=0;
  box.innerHTML=cart.map(item=>{
    total+=item.price*item.qty;
    return `<div class="mini-item"><span>${item.name} × ${item.qty}</span><strong>₹${(item.price*item.qty).toLocaleString("en-IN")}</strong></div>`;
  }).join("");
  total += total>=4999 ? 0 : (total ? 199 : 0);
  totalEl.textContent="₹"+total.toLocaleString("en-IN");
}
function setError(id,message){
  document.getElementById(id+"Error").textContent=message;
}
function setupPaymentForm(){
  const form=document.getElementById("paymentForm");
  if(!form) return;
  form.addEventListener("submit",function(e){
    e.preventDefault();
    ["name","email","phone","address","city","pin","card","expiry","cvv"].forEach(id=>setError(id,""));
    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const phone=document.getElementById("phone").value.trim();
    const address=document.getElementById("address").value.trim();
    const city=document.getElementById("city").value.trim();
    const pin=document.getElementById("pin").value.trim();
    const card=document.getElementById("card").value.replace(/\s/g,"");
    const expiry=document.getElementById("expiry").value.trim();
    const cvv=document.getElementById("cvv").value.trim();
    let ok=true;
    if(name.length<3){setError("name","Enter your full name.");ok=false;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("email","Enter a valid email.");ok=false;}
    if(!/^\d{10}$/.test(phone)){setError("phone","Phone must contain 10 digits.");ok=false;}
    if(address.length<8){setError("address","Enter a complete address.");ok=false;}
    if(city.length<2){setError("city","Enter your city.");ok=false;}
    if(!/^\d{6}$/.test(pin)){setError("pin","PIN must contain 6 digits.");ok=false;}
    if(!/^\d{16}$/.test(card)){setError("card","Use exactly 16 digits for this demo.");ok=false;}
    if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)){setError("expiry","Use MM/YY format.");ok=false;}
    if(!/^\d{3}$/.test(cvv)){setError("cvv","CVV must contain 3 digits.");ok=false;}
    if(getCart().length===0){alert("Your cart is empty. Add a sneaker first.");return;}
    if(ok){
      alert("🎉 Order placed successfully! This is a demo checkout.");
      localStorage.removeItem("kicksCart");
      window.location.href="index.html";
    }
  });
}
updateCartCount();