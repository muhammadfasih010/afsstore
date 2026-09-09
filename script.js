/* ============================================================
   config.js
   Shared constants + tiny helpers used by BOTH user.js and admin.js.
   Load this file BEFORE storage.js, api.js, user.js / admin.js.
   ============================================================ */

const ASSET = 'https://afsleather-eebazv6q.manus.space/manus-storage/';

const seedProducts = [
  { id:'jacket', name:'The Rider Jacket', category:'Jackets', price:38900, image:ASSET+'jacket_45bdb1d5.jpg', description:'A tailored silhouette with clean lines and soft structure.', groups:[
    { name:'Color', options:[
      { name:'Classic black', hex:'#171514', price:0 },
      { name:'Tobacco', hex:'#6d3d27', price:1200 },
      { name:'Oxblood', hex:'#5b171e', price:1500 }
    ]},
    { name:'Hardware', options:[
      { name:'Antique brass', price:0 },
      { name:'Gunmetal', price:650 }
    ]}
  ]},
  { id:'belt', name:'The Forge Belt', category:'Belts', price:9200, image:ASSET+'belt_5890ecf3.jpg', description:'Bridle leather with a sculpted profile and two sides to make it yours.', groups:[
    { name:'Strap color', options:[
      { name:'Saddle brown', hex:'#8d4e2a', price:0 },
      { name:'Black', hex:'#1d1a18', price:250 },
      { name:'Oxblood', hex:'#641c1f', price:400 }
    ]},
    { name:'Buckle', options:[
      { name:'Classic pin', price:0 },
      { name:'Matte black automatic', price:1100 }
    ]}
  ]},
  { id:'wallet', name:'The Atelier Bifold', category:'Wallets', price:7800, image:ASSET+'wallet_f4252cca.jpg', description:'A slim bifold cut from a single hide and finished by hand.', groups:[
    { name:'Leather tone', options:[
      { name:'Walnut', hex:'#6f3d25', price:0 },
      { name:'Obsidian', hex:'#1a1817', price:450 },
      { name:'Cognac', hex:'#a85d2f', price:300 }
    ]}
  ]},
  { id:'cap', name:'The Crown Cap', category:'Caps', price:6900, image:ASSET+'cap_a8e460e5.jpg', description:'An understated cap with a considered crown and a blank canvas for your mark.', groups:[
    { name:'Finish color', options:[
      { name:'Coal', hex:'#22201e', price:0 },
      { name:'Tobacco', hex:'#844522', price:350 },
      { name:'Stone', hex:'#8f8479', price:450 }
    ]}
  ]}
];

// Color name -> hex autofill map (used by admin.js)
const colorMap = {
  'black':'#171514','classic black':'#171514','jet black':'#0a0a0a','matte black':'#1a1a1a',
  'white':'#f5f5f5','off white':'#f0ede8','cream':'#f5f0e8','ivory':'#fffff0',
  'red':'#c0392b','dark red':'#8b0000','crimson':'#dc143c',
  'oxblood':'#5b171e','burgundy':'#6d0f1f','maroon':'#5c0a11','wine':'#722f37',
  'brown':'#8b5e3c','dark brown':'#4a2c1a','chocolate':'#3d1c02','chestnut':'#6b3a2a',
  'saddle brown':'#8d4e2a','cognac':'#a85d2f','tan':'#c4986a','camel':'#c19a6b',
  'tobacco':'#6d3d27','walnut':'#6f3d25','mahogany':'#4a1a0e',
  'navy':'#1b2a4a','navy blue':'#1b2a4a','dark blue':'#1a2b4a','blue':'#2c4a7c',
  'grey':'#808080','gray':'#808080','dark grey':'#404040','light grey':'#c0c0c0',
  'stone':'#8f8479','slate':'#6b7280','charcoal':'#36454f',
  'green':'#2d6a4f','dark green':'#1a3d2b','olive':'#6b7c3b','forest':'#2d4a1e',
  'yellow':'#d4a017','gold':'#c79a5a','antique gold':'#b8962e','brass':'#b5a642',
  'antique brass':'#b5a642','gunmetal':'#2c3539','silver':'#a8a9ad','chrome':'#d4d5d9',
  'orange':'#c85a17','rust':'#8b3a0f','copper':'#b87333',
  'pink':'#e8829a','blush':'#de8fa0','rose':'#c4687a',
  'purple':'#6b3fa0','violet':'#7f4f9e','plum':'#5e2750',
  'obsidian':'#1a1817','coal':'#22201e','midnight':'#0d0d1a',
  'natural':'#d4b896','nude':'#d4a882','beige':'#c8a97a'
};

const $ = s => document.querySelector(s);
const money = n => 'Rs. ' + Number(n).toLocaleString('en-PK');

function nameToHex(name){
  const key = name.toLowerCase().trim();
  return colorMap[key] || null;
}

function isLight(hex){
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114) / 1000 > 128;
}

/* ============================================================
   storage.js
   Real cloud database layer — Firebase Realtime Database.

   Products and orders are stored in Firebase, so a change made
   in the admin panel on one device/phone shows up on every other
   device — because everyone is now reading/writing the same
   cloud database instead of their own browser's storage.

   The cart stays in THIS browser's localStorage only — a
   shopping bag is personal and in-progress, it shouldn't follow
   you to another phone (same behaviour you'd expect from any
   normal store).

   REQUIRES: firebase-app-compat.js and firebase-database-compat.js
   loaded via <script> BEFORE this file (see user.html / admin.html).

   IMPORTANT — Firebase Realtime Database rules:
   This project has no login system, so the database rules must
   allow open read/write, or every request here will fail with a
   permission-denied error. In the Firebase console →
   Realtime Database → Rules, set:
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
   This is fine for a small store front. If you ever add real user
   accounts, tighten these rules to match.
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAdJnO5Uv6GMTs6TJDJ7f2CHjYsMdDIW_Y",
  authDomain: "leather-731bb.firebaseapp.com",
  databaseURL: "https://leather-731bb-default-rtdb.firebaseio.com",
  projectId: "leather-731bb",
  storageBucket: "leather-731bb.firebasestorage.app",
  messagingSenderId: "1067965421439",
  appId: "1:1067965421439:web:fc1cf12f541f1e04feac4a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---- EmailJS (sends the OTP code to the user's email) ----
// Create a free account at https://www.emailjs.com, add an Email Service
// (e.g. Gmail) and an Email Template with {{to_email}}, {{to_name}} and
// {{otp_code}} variables, then paste your own 3 IDs below.
const EMAILJS_SERVICE_ID = 'service_pwjaxb4';
const EMAILJS_TEMPLATE_ID = 'template_no76svr';
const EMAILJS_PUBLIC_KEY = 'pJneFha-OGAh2MiDz';
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// Removes any base64 data-URLs before using/persisting (keeps the database small)
function stripBase64(arr){
  return arr.map(p => ({
    ...p,
    image: p.image?.startsWith('data:') ? '' : p.image,
    groups: p.groups.map(g => ({
      ...g,
      options: g.options.map(o => ({
        ...o,
        image: o.image?.startsWith('data:') ? '' : o.image
      }))
    }))
  }));
}

// Firebase can return objects OR arrays depending on the keys — normalize to a plain array
function toArray(val){
  if(!val) return [];
  return Array.isArray(val) ? val : Object.values(val);
}

// ---- Products: live, shared across every device ----
// callback(products) fires immediately with the current data, then again
// every time ANY device changes the products (admin edits, deletes, etc.)
function watchProducts(callback){
  const ref = db.ref('products');
  ref.on('value', snap => {
    const val = snap.val();
    if(!val){
      // Nothing in the database yet (brand new project) — seed it once.
      ref.set(seedProducts);
      return; // set() triggers this same listener again with the real data
    }
    callback(stripBase64(toArray(val)));
  }, err => {
    console.error('Could not read products from Firebase:', err);
  });
}
function saveProducts(products){
  return db.ref('products').set(products);
}

// ---- Hero gallery images: admin-managed, shown as the 5 arch photos on the homepage ----
function watchHeroImages(callback){
  const ref = db.ref('settings/hero');
  ref.on('value', snap => {
    const val = snap.val();
    callback(val && val.images ? val.images : []);
  }, err => {
    console.error('Could not read hero images from Firebase:', err);
  });
}
function saveHeroImages(images){
  return db.ref('settings/hero').set({ images });
}

// ---- Orders: live, shared across every device ----
function watchOrders(callback){
  db.ref('orders').on('value', snap => {
    callback(toArray(snap.val()));
  }, err => {
    console.error('Could not read orders from Firebase:', err);
  });
}
function saveOrders(orders){
  return db.ref('orders').set(orders);
}

// ---- Cart: local to this device only (not synced) ----
function getCart(){
  return JSON.parse(localStorage.getItem('afs-cart-static') || '[]');
}
function saveCartData(cart){
  localStorage.setItem('afs-cart-static', JSON.stringify(cart));
}

function statusColor(s){
  const map = {
    'Pending acceptance':'pending',
    'Accepted':'accepted',
    'Shipped':'shipped',
    'Delivered':'delivered',
    'Cancelled':'cancelled'
  };
  return map[s] || 'pending';
}

// Looks up an order inside an already-loaded orders array (no extra fetch needed —
// both user.js and admin.js keep a live-updated copy via watchOrders above)
function trackOrder(id, orders){
  const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  if(!order) return `No order found for ${id}. Check the number and try again.`;
  let msg = `Order ${order.id} · ${order.status} · ${order.items.length} piece${order.items.length===1?'':'s'} · ${money(order.total)}`;
  if(order.eta) msg += ` · Expected: ${order.eta}`;
  return msg;
}

// ============================================================
// Accounts (signup/login) + OTP password reset — new
// ============================================================

// Turns an email into a safe Firebase key (Firebase keys can't contain . # $ [ ])
function userKeyFromEmail(email){
  return email.trim().toLowerCase().replace(/[.#$\[\]]/g, '_');
}

function getUserByEmail(email){
  return db.ref('users/' + userKeyFromEmail(email)).once('value').then(snap => snap.val());
}
function saveUser(user){
  return db.ref('users/' + userKeyFromEmail(user.email)).set(user);
}
function updateUserFields(email, fields){
  return db.ref('users/' + userKeyFromEmail(email)).update(fields);
}

// One-time-password records, used only during "forgot password"
function saveOtp(email, code){
  return db.ref('otps/' + userKeyFromEmail(email)).set({
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // valid for 10 minutes
  });
}
function getOtp(email){
  return db.ref('otps/' + userKeyFromEmail(email)).once('value').then(snap => snap.val());
}
function clearOtp(email){
  return db.ref('otps/' + userKeyFromEmail(email)).remove();
}

// Password hashing (client-side, no backend available).
// NOTE: this is a salted SHA-256 hash, not a slow KDF like bcrypt/scrypt —
// reasonable for a small store with no backend, but worth knowing the limit.
function randomSalt(len = 16){
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function hashPassword(password, salt){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sends the OTP code by email via EmailJS (see EMAILJS_* constants near the
// top of the page — you must fill these in with your own EmailJS account).
function sendOtpEmail(toEmail, toName, code){
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    to_name: toName || '',
    otp_code: code
  });
}

/* ============================================================
   api.js
   The only outside network API this project talks to: Cloudinary,
   used by the admin panel to upload product / option images.
   ============================================================ */

async function uploadToCloudinary(file, statusEl, onSuccess){
  if(!file) return;
  statusEl.textContent = 'Uploading...';
  statusEl.style.color = 'var(--gold)';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'Imagee');
  fd.append('api_key', 'V2ZzYvfWumKsgoDhS9ITW6QMcVY');
  try{
    const res = await fetch('https://api.cloudinary.com/v1_1/j8ilvbr9/image/upload', { method:'POST', body:fd });
    const data = await res.json();
    if(data.secure_url){
      onSuccess(data.secure_url);
      statusEl.textContent = '✓ Upload ho gaya!';
      statusEl.style.color = '#a9d0aa';
      setTimeout(() => statusEl.textContent = '', 3000);
    } else {
      statusEl.textContent = 'Error: ' + (data.error?.message || 'Try again');
      statusEl.style.color = '#b76d5d';
    }
  } catch(e){
    statusEl.textContent = 'Upload fail hua. Internet check karo.';
    statusEl.style.color = '#b76d5d';
  }
}

/* ============================================================
   auth.js
   Customer accounts: signup, login, forgot-password (email OTP),
   and keeping the logged-in state on this device.
   Depends on: config.js, storage.js (must load before this).
   ============================================================ */

let pendingCheckoutAfterAuth = false;
let fpEmailForReset = '';

// ---- Session (this device only — "don't sign up again here") ----
function getCurrentUser(){
  const raw = localStorage.getItem('afs-current-user');
  return raw ? JSON.parse(raw) : null;
}
function setCurrentUser(user){
  localStorage.setItem('afs-current-user', JSON.stringify(user));
}
function clearCurrentUser(){
  localStorage.removeItem('afs-current-user');
}

function initialsFromName(name){
  const words = (name||'').trim().split(/\s+/).filter(Boolean);
  if(words.length === 0) return '?';
  if(words.length === 1) return words[0].slice(0,2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function updateAuthUI(){
  const area = $('#authArea');
  if(!area) return;
  const user = getCurrentUser();
  if(user){
    area.innerHTML = `
      <div class="account-wrap" id="accountWrap">
        <button class="avatar-btn" id="avatarBtn" type="button">
          <span class="avatar-circle">${initialsFromName(user.name)}</span>
          <span class="avatar-name">${(user.name||'').split(' ')[0]||'Account'}</span>
          <span class="avatar-caret">▾</span>
        </button>
        <div class="account-dropdown">
          <div class="account-dropdown-head"><strong>${user.name||'Your account'}</strong><small>${user.email||''}</small></div>
          <button type="button" id="ddMyOrders">📦 My Orders</button>
          <button type="button" id="ddTrackOrder">🔍 Track order</button>
          <button type="button" id="ddChangePassword">🔒 Change password</button>
          <button type="button" class="danger" id="ddLogout">↪ Logout</button>
        </div>
      </div>`;
    const wrap = $('#accountWrap');
    $('#avatarBtn').onclick = (e) => { e.stopPropagation(); wrap.classList.toggle('open'); };
    $('#ddMyOrders').onclick = () => {
      wrap.classList.remove('open');
      renderMyOrders();
      $('#myOrdersDrawer').classList.add('open');
      $('#backdrop').classList.add('open');
    };
    $('#ddTrackOrder').onclick = () => {
      wrap.classList.remove('open');
      openTrackModal();
    };
    $('#ddChangePassword').onclick = () => {
      wrap.classList.remove('open');
      openChangePasswordModal();
    };
    $('#ddLogout').onclick = () => {
      wrap.classList.remove('open');
      clearCurrentUser();
      updateAuthUI();
      showToast('You have been logged out.');
    };
  } else {
    area.innerHTML = `<button class="auth-open-btn" id="openAuthBtn">Sign in / Sign up</button>`;
    $('#openAuthBtn').onclick = () => openAuthModal('login');
  }
}

// ---- Track order popup ----
function openTrackModal(){
  $('#trackModal').classList.add('open');
  $('#backdrop').classList.add('open');
}
function closeTrackModal(){
  $('#trackModal').classList.remove('open');
  $('#backdrop').classList.remove('open');
}

// ---- Change password (requires the current password, updates the Firebase user record) ----
function openChangePasswordModal(){
  const user = getCurrentUser();
  if(!user) return;
  $('#cpCurrent').value = '';
  $('#cpNew').value = '';
  $('#cpConfirm').value = '';
  $('#cpError').textContent = '';
  $('#changePasswordModal').classList.add('open');
  $('#backdrop').classList.add('open');
}
function closeChangePasswordModal(){
  $('#changePasswordModal').classList.remove('open');
  $('#backdrop').classList.remove('open');
}
async function handleChangePassword(e){
  e.preventDefault();
  const user = getCurrentUser();
  const errEl = $('#cpError');
  if(!user){ errEl.textContent = 'Please login again.'; return; }
  const current = $('#cpCurrent').value;
  const next = $('#cpNew').value;
  const confirm = $('#cpConfirm').value;
  if(next.length < 6){ errEl.textContent = 'New password must be at least 6 characters.'; return; }
  if(next !== confirm){ errEl.textContent = 'Passwords do not match.'; return; }

  const submitBtn = $('#changePasswordForm button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Please wait...'; }
  try{
    const record = await getUserByEmail(user.email);
    if(!record){ errEl.textContent = 'Account not found.'; return; }
    const currentHash = await hashPassword(current, record.salt);
    if(currentHash !== record.passwordHash){ errEl.textContent = 'Current password is incorrect.'; return; }
    const salt = randomSalt();
    const passwordHash = await hashPassword(next, salt);
    await updateUserFields(user.email, { passwordHash, salt });
    closeChangePasswordModal();
    showToast('Password updated successfully.');
  } catch(err){
    console.error('Change password error:', err);
    errEl.textContent = 'Something went wrong. Please try again.';
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Update password →'; }
  }
}

// ---- Modal open/close + tab & step switching ----
function openAuthModal(tab){
  clearAuthErrors();
  $('#authModal')?.classList.add('open');
  $('#backdrop')?.classList.add('open');
  switchAuthTab(tab || 'login');
}
function closeAuthModal(){
  $('#authModal')?.classList.remove('open');
  $('#backdrop')?.classList.remove('open');
  pendingCheckoutAfterAuth = false;
}
function clearAuthErrors(){
  ['loginError','signupError','fpStep1Error','fpStep2Error'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent=''; });
}
function switchAuthTab(tab){
  clearAuthErrors();
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.authTab === tab));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  if(tab === 'login') $('#loginForm')?.classList.add('active');
  if(tab === 'signup') $('#signupForm')?.classList.add('active');
}
function showForgotStep1(){
  clearAuthErrors();
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  $('#forgotStep1Form')?.classList.add('active');
}
function showForgotStep2(){
  clearAuthErrors();
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  $('#forgotStep2Form')?.classList.add('active');
}

// ---- Validation helpers ----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^0\d{10}$/;
const POSTAL_RE = /^\d{4,6}$/;

// ---- Signup ----
// Pending signup data stored here while OTP is being verified
let pendingSignupData = null;

async function handleSignup(e){
  e.preventDefault();
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const phone = $('#signupPhone').value.trim();
  const citySel = $('#signupCity').value;
  const city = citySel === 'Other' ? $('#signupCityOther').value.trim() : citySel;
  const address = $('#signupAddress').value.trim();
  const postal = $('#signupPostal').value.trim();
  const password = $('#signupPassword').value;
  const confirm = $('#signupConfirmPassword').value;
  const errEl = $('#signupError');

  if(!name || !email || !phone || !city || !address || !postal || !password){ errEl.textContent = 'Sab fields fill karo.'; return; }
  if(!EMAIL_RE.test(email)){ errEl.textContent = 'Email sahi format mein daalo.'; return; }
  if(!PHONE_RE.test(phone)){ errEl.textContent = 'Phone number bilkul 11 digits ka hona chahiye, e.g. 03001234567. Kam ya zyada numbers nahi chalenge.'; return; }
  if(!POSTAL_RE.test(postal)){ errEl.textContent = 'Postal code sahi daalo (4-6 digits).'; return; }
  if(password.length < 6){ errEl.textContent = 'Password kam se kam 6 characters ka ho.'; return; }
  if(password !== confirm){ errEl.textContent = 'Password match nahi ho raha.'; return; }

  const submitBtn = $('#signupForm button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Please wait...'; }
  try{
    const existing = await getUserByEmail(email);
    if(existing){ errEl.textContent = 'Ye email pehle se registered hai. Login karo.'; return; }

    // Generate and send OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, code);
    await sendOtpEmail(email, name, code);

    // Save pending signup data to complete after OTP verify
    const salt = randomSalt();
    const passwordHash = await hashPassword(password, salt);
    pendingSignupData = { name, email, phone, address, city, postal, salt, passwordHash };

    // Show OTP verification panel
    showSignupOtpStep(email);
  } catch(err){
    console.error('Signup error:', err);
    const detail = err?.text || err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
    errEl.textContent = 'Signup nahi ho saka: ' + detail;
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Sign Up →'; }
  }
}

function showSignupOtpStep(email){
  clearAuthErrors();
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  const panel = $('#signupOtpForm');
  if(panel){
    panel.classList.add('active');
    const hint = panel.querySelector('.signup-otp-hint');
    if(hint) hint.textContent = `OTP bheja gaya: ${email}`;
  }
}

async function handleSignupOtp(e){
  e.preventDefault();
  const errEl = $('#signupOtpError');
  if(!pendingSignupData){ errEl.textContent = 'Session expire ho gaya. Dobara signup karo.'; return; }
  const entered = $('#signupOtpInput').value.trim();
  const { email } = pendingSignupData;

  const submitBtn = $('#signupOtpForm button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
  try{
    const record = await getOtp(email);
    if(!record){ errEl.textContent = 'OTP nahi mila. Dobara signup karo.'; return; }
    if(Date.now() > record.expiresAt){ errEl.textContent = 'OTP expire ho gaya. Dobara signup karo.'; clearOtp(email); return; }
    if(record.code !== entered){ errEl.textContent = 'OTP galat hai. Dobara check karo.'; return; }

    // OTP correct — create account
    await clearOtp(email);
    const { name, phone, address, city, postal, salt, passwordHash } = pendingSignupData;
    const user = { name, email, phone, address, city, postal, salt, passwordHash, createdAt: new Date().toISOString() };
    await saveUser(user);
    setCurrentUser({ name, email, phone, address, city, postal });
    pendingSignupData = null;
    updateAuthUI();
    const shouldContinueToCheckout = pendingCheckoutAfterAuth;
    closeAuthModal();
    if(shouldContinueToCheckout) openCheckout();
  } catch(err){
    console.error('Signup OTP error:', err);
    errEl.textContent = 'Verification nahi ho saka. Dobara try karo.';
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Verify & Sign Up →'; }
  }
}

// ---- Login ----
async function handleLogin(e){
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  const errEl = $('#loginError');
  if(!email || !password){ errEl.textContent = 'Email aur password dono daalo.'; return; }

  const submitBtn = $('#loginForm button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Please wait...'; }
  try{
    const user = await getUserByEmail(email);
    if(!user){ errEl.textContent = 'Account nahi mila. Sign up karo.'; return; }
    const hash = await hashPassword(password, user.salt);
    if(hash !== user.passwordHash){ errEl.textContent = 'Email ya password galat hai.'; return; }
    setCurrentUser({ name:user.name, email:user.email, phone:user.phone, address:user.address, city:user.city, postal:user.postal });
    updateAuthUI();
    const shouldContinueToCheckout = pendingCheckoutAfterAuth;
    closeAuthModal();
    if(shouldContinueToCheckout) openCheckout();
  } catch(err){
    console.error('Login error:', err);
    const detail = err?.text || err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
    errEl.textContent = 'Login nahi ho saka: ' + detail;
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Login →'; }
  }
}

// ---- Forgot password: step 1, send OTP ----
async function handleSendOtp(e){
  e.preventDefault();
  const email = $('#fpEmail').value.trim().toLowerCase();
  const errEl = $('#fpStep1Error');
  if(!EMAIL_RE.test(email)){ errEl.textContent = 'Email sahi format mein daalo.'; return; }

  const submitBtn = $('#forgotStep1Form button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
  try{
    const user = await getUserByEmail(email);
    if(!user){ errEl.textContent = 'Ye email registered nahi hai.'; return; }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, code);
    await sendOtpEmail(email, user.name, code);
    fpEmailForReset = email;
    showForgotStep2();
  } catch(err){
    console.error('OTP send error:', err);
    const detail = err?.text || err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
    errEl.textContent = 'OTP email nahi bhej saka: ' + detail;
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Send OTP →'; }
  }
}

// ---- Forgot password: step 2, verify OTP + set new password ----
async function handleResetPassword(e){
  e.preventDefault();
  const enteredCode = $('#fpOtp').value.trim();
  const newPassword = $('#fpNewPassword').value;
  const confirm = $('#fpConfirmPassword').value;
  const errEl = $('#fpStep2Error');
  if(newPassword.length < 6){ errEl.textContent = 'Password kam se kam 6 characters ka ho.'; return; }
  if(newPassword !== confirm){ errEl.textContent = 'Password match nahi ho raha.'; return; }

  const submitBtn = $('#forgotStep2Form button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Please wait...'; }
  try{
    const otpRecord = await getOtp(fpEmailForReset);
    if(!otpRecord || otpRecord.code !== enteredCode){ errEl.textContent = 'OTP galat hai.'; return; }
    if(Date.now() > otpRecord.expiresAt){ errEl.textContent = 'OTP expire ho gaya. Dobara bhejo.'; return; }
    const salt = randomSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    await updateUserFields(fpEmailForReset, { passwordHash, salt });
    await clearOtp(fpEmailForReset);
    switchAuthTab('login');
    $('#loginEmail').value = fpEmailForReset;
    $('#loginError').textContent = 'Password change ho gaya — ab login karo.';
  } catch(err){
    console.error('Reset password error:', err);
    const detail = err?.text || err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
    errEl.textContent = 'Kuch ghalat ho gaya: ' + detail;
  } finally {
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Reset password →'; }
  }
}

function wireAuthModal(){
  document.querySelectorAll('.auth-tab').forEach(t => t.onclick = () => switchAuthTab(t.dataset.authTab));
  $('#loginForm')?.addEventListener('submit', handleLogin);
  $('#signupForm')?.addEventListener('submit', handleSignup);
  $('#signupOtpForm')?.addEventListener('submit', handleSignupOtp);
  $('#forgotStep1Form')?.addEventListener('submit', handleSendOtp);
  $('#forgotStep2Form')?.addEventListener('submit', handleResetPassword);
  $('#forgotPasswordLink')?.addEventListener('click', e => { e.preventDefault(); showForgotStep1(); });
  $('#backToLoginLink')?.addEventListener('click', e => { e.preventDefault(); switchAuthTab('login'); });
  document.querySelector('[data-close-auth]')?.addEventListener('click', closeAuthModal);
  $('#signupCity')?.addEventListener('change', () => {
    $('#signupCityOther').style.display = $('#signupCity').value === 'Other' ? 'block' : 'none';
  });
}

