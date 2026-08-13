// ===== PETALS =====
const petals = document.getElementById('petals');
const colors = ['#f2c4ce','#f9dcc4','#c8e6c9','#d4b8e0','#b3d9f2','#ffd9b3'];
for (let i = 0; i < 22; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + '%';
  p.style.top = '-20px';
  p.style.background = colors[Math.floor(Math.random() * colors.length)];
  p.style.width = (10 + Math.random() * 14) + 'px';
  p.style.height = p.style.width;
  p.style.animationDuration = (6 + Math.random() * 8) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  petals.appendChild(p);
}

// ===== COUNTDOWN =====
function updateCountdown() {
  const target = new Date('2026-11-28T09:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent = '0';
    document.getElementById('cd-secs').textContent = '0';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = d;
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ===== RELATION DROPDOWN =====
const RELATION_OPTIONS = {
  groom: ['ญาติเจ้าบ่าว', 'ร.ร. สตรีวิทยา 2', 'ม. มหิดล', 'บ. เอ็มเวิร์ด', 'อื่นๆ'],
  bride: ['ญาติเจ้าสาว', 'ร.ร. สองพี่น้องวิทยา', 'ม. เกษตรศาสตร์', 'กรมป่าไม้', 'อื่นๆ'],
};

function handleSideChange(side) {
  const select = document.getElementById('relation');
  select.disabled = false;
  select.innerHTML = '<option value="">— กรุณาเลือก —</option>';
  RELATION_OPTIONS[side].forEach(opt => {
    const el = document.createElement('option');
    el.value = opt; el.textContent = opt;
    select.appendChild(el);
  });
  document.getElementById('relation-other-group').style.display = 'none';
  document.getElementById('relation-other').value = '';
}

function handleGuestsChange(val) {
  document.getElementById('guests-custom-group').style.display = val === 'custom' ? 'block' : 'none';
  if (val !== 'custom') document.getElementById('guests-custom').value = '';
}

function handleRelationChange(val) {
  document.getElementById('relation-other-group').style.display = val === 'อื่นๆ' ? 'block' : 'none';
}

// ===== FORM =====
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwcv_vez6e7bSxzuPKfcV4TRiL05zPR7vMlq4J0LVoPxL_38-9aCETbIPL2io_ewi_ncg/exec';

async function submitForm() {
  const fname    = document.getElementById('fname').value.trim();
  const lname    = document.getElementById('lname').value.trim();
  const nickname = document.getElementById('nickname').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const side     = document.querySelector('input[name="side"]:checked');
  const relation = document.getElementById('relation').value;
  const relationOther = document.getElementById('relation-other').value.trim();
  const guestsVal = document.getElementById('guests').value;
  let guests;
  if (guestsVal === 'custom') {
    const custom = parseInt(document.getElementById('guests-custom').value);
    if (!custom || custom < 1) { alert('กรุณาระบุจำนวนผู้เข้าร่วม'); return; }
    guests = custom;
  } else {
    guests = parseInt(guestsVal);
  }
  const message  = document.getElementById('msg').value.trim();

  if (!fname || !lname || !phone) {
    alert('กรุณากรอกชื่อ นามสกุล และเบอร์โทรศัพท์');
    return;
  }
  if (!side) {
    alert('กรุณาเลือกว่ารู้จักกับเจ้าบ่าวหรือเจ้าสาว');
    return;
  }
  if (!relation) {
    alert('กรุณาเลือกว่ารู้จักกันจากที่ไหน');
    return;
  }

  const btn = document.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = '⏳ กำลังส่งข้อมูล...';

  const payload = {
    fname,
    lname,
    nickname,
    side: side.value,
    relation: relation === 'อื่นๆ' ? `อื่นๆ: ${relationOther}` : relation,
    phone,
    guests,
    message
  };

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    document.getElementById('form-content').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  } catch(err) {
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    btn.disabled = false;
    btn.textContent = '✉ ยืนยันการเข้าร่วม';
  }
}

// ===== MAP FALLBACK =====
// If iframe fails, show static Google Maps link
document.querySelector('.map-container iframe').onerror = function() {
  this.parentElement.innerHTML = `
    <div style="height:100%;display:flex;align-items:center;justify-content:center;background:#eef8f0;flex-direction:column;gap:16px;">
      <div style="font-size:3rem;">🗺️</div>
      <div style="font-family:'Sarabun',sans-serif;color:#5a4a42;font-size:1rem;">ขจี คาเฟ่ แอนด์รีสอร์ท · สุพรรณบุรี</div>
      <a href="https://maps.google.com/?q=KaJee+Cafe+Suphan+Buri" target="_blank"
         style="background:#c9a96e;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-family:'Sarabun',sans-serif;">
        เปิดใน Google Maps
      </a>
    </div>`;
};



const WISH_URL = 'https://script.google.com/macros/s/AKfycbyjg_XOWugjPU9_NSL-PxmLgPhC8AEvvH7oFUS5dd3IgvmPBVNJwezJZoyP3xLkvMLA_Q/exec';

let userIP = '';
let avatarBase64 = '';
let wishes = [];

// ===== RETRIEVE METADATA WITH MULTI-SERVICE FALLBACKS =====
async function getIPAndLocation() {
  let ip = userIP || '';
  let lat = '';
  let lng = '';

  // 1. Try Browser GPS first
  try {
    const coords = await getBrowserCoordinates();
    if (coords) {
      lat = coords.lat;
      lng = coords.lng;
    }
  } catch (e) {}

  // 2. If IP or Coordinates missing, fetch from IP API service
  if (!ip || !lat || !lng) {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (!ip && data.ip) ip = String(data.ip);
        if (!lat && data.latitude) lat = String(data.latitude);
        if (!lng && data.longitude) lng = String(data.longitude);
      }
    } catch (e) {}
  }

  // 3. Fallback for IP only if still missing
  if (!ip) {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        ip = String(data.ip);
      }
    } catch (e) {}
  }

  userIP = ip;
  return { ip, lat, lng };
}

function getBrowserCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude)
        });
      },
      () => resolve(null),
      { timeout: 4000 }
    );
  });
}

// Pre-fetch IP on page load
getIPAndLocation();

// ===== AVATAR UPLOAD HANDLING =====
function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้นครับ');
    return;
  }
  
  const container = document.getElementById('avatar-preview-container');
  const preview = document.getElementById('avatar-preview');
  
  // Create object URL for instant preview
  const objectUrl = URL.createObjectURL(file);
  preview.src = objectUrl;
  container.style.display = 'flex';
  
  // Compress and convert to Base64 in background
  resizeAndCompressImage(file).then(base64 => {
    avatarBase64 = base64;
  });
}

function removeAvatar() {
  document.getElementById('wish-image').value = '';
  document.getElementById('avatar-preview-container').style.display = 'none';
  document.getElementById('avatar-preview').src = '';
  avatarBase64 = '';
}

function resizeAndCompressImage(file, maxWidth = 150, maxHeight = 150) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
    };
  });
}

// ===== POST-IT RENDERING =====
const POSTIT_COLORS = [
  { bg: '#ffd6e0', text: '#5a4a42', tapeRotate: '-2deg', avatarColor: '#e8899a' },
  { bg: '#ffebd3', text: '#5a4a42', tapeRotate: '3deg', avatarColor: '#d4956a' },
  { bg: '#d6f2ff', text: '#5a4a42', tapeRotate: '-3deg', avatarColor: '#5fa8d3' },
  { bg: '#e6ffd6', text: '#5a4a42', tapeRotate: '1.5deg', avatarColor: '#7bbfa5' },
  { bg: '#ebd6ff', text: '#5a4a42', tapeRotate: '-1.5deg', avatarColor: '#b07cc6' }
];

const WISH_PAGE_SIZE = 15; // Number of wishes to show per batch
let displayedWishCount = 0;
const WISH_CACHE_KEY = 'noonchamp_wedding_wishes_v1';

// Seeded real wishes from sheet so page loads with 0ms delay!
const INITIAL_WISHES = [
  {"name":"ครอบครัวลุงวีระพงษ์ สุพรรณบุรี","message":"ขออวยพรให้หลานแชมป์และหลานนุ่น เริ่มต้นชีวิตครอบครัวด้วยความรัก ความเข้าอกเข้าใจ และความผูกพันอันแน่นแฟ้น ดั่งคำโบราณที่ว่า น้ำพึ่งเรือเสือพึ่งป่า ขอให้ทั้งคู่ช่วยกันประคับประคอง ดูแลเอาใจใส่ซึ่งกันและกัน ทั้งในยามสุขและยามทุกข์ ขอให้มีแต่ความสุขความเจริญ ร่ำรวยเงินทอง และมีทายาทสืบสกุลที่น่ารักในเร็ววันนี้นะจ๊ะ 💖✨🙏","time":"13 ส.ค. 2569 10:01 น."},
  {"name":"เพื่อนๆ สตรีวิทยา 2 รุ่น 38","message":"ยินดีด้วยนะเพื่อนแชมป์! ยินดีต้อนรับเข้าสู่สมาคมคนรักภรรยาอย่างเป็นทางการ ดีใจด้วยจริงๆ ที่เห็นเพื่อนมีความสุขและได้เจอกับคู่ชีวิตที่ดีอย่างน้องนุ่น ขอให้ชีวิตคู่ราบรื่น มีแต่ความสุขกายสบายใจ สุขภาพแข็งแรงทั้งคู่ ประสบความสำเร็จในหน้าที่การงาน และขอให้มีความรักที่สดชื่นเหมือนวันแรกที่รักกันเสมอไปนะเว้ยเพื่อน! 🎊🎈🍻","time":"13 ส.ค. 2569 10:01 น."},
  {"name":"อาจารย์ประเสริฐ และคณะอาจารย์","message":"ในวาระมงคลสมรสของกิตติพัฒน์และนิตยา ขออัญเชิญคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลาย จงดลบันดาลประทานพรให้คู่บ่าวสาวประสบแต่ความสุขสิริสวัสดิ์พิพัฒนมงคล สมบูรณ์พูนผลด้วยจตุรพิธพรชัย มีความรักความเมตตาต่อกัน ร่วมสร้างฐานะครอบครัวให้มั่นคง มั่งคั่ง และเปี่ยมไปด้วยเกียรติยศชื่อเสียงตลอดกาลนานเทอญ","time":"13 ส.ค. 2569 10:01 น."},
  {"name":"แก๊งเพื่อนสนิท ม.เกษตรศาสตร์","message":"ตั้งแต่เห็นนุ่นกับแชมป์คบกันมาตั้งแต่สมัยเรียน ม.เกษตร จนถึงวันที่ทั้งสองคนตัดสินใจจับมือกันเข้าสู่ประตูวิวาห์ในวันนี้ พวกเราดีใจและภูมิใจกับความรักที่มั่นคงของทั้งคู่มากๆ ขอให้ชีวิตคู่หลังจากนี้เต็มไปด้วยการเดินทางท่องเที่ยวที่มีความสุข มีเสียงหัวเราะในทุกมื้ออาหาร และจับมือเคียงข้างกันผ่านทุกเรื่องราวไปด้วยกันนะเพื่อนรัก รักทั้งสองคนมากๆ จ้าาา 🌸🥂🍾","time":"13 ส.ค. 2569 10:01 น."},
  {"name":"พี่แพร & ครอบครัววงษ์สุวรรณ","message":"ขอแสดงความยินดีจากใจจริงแด่น้องแชมป์และน้องนุ่น ในวันเริ่มต้นชีวิตคู่ที่แสนงดงามนี้ ขอให้ความรักของทั้งสองคนมั่นคงดั่งขุนเขา อบอุ่นดั่งแสงตะวันในยามเช้า มีความเข้าใจและให้อภัยซึ่งกันและกันในทุกๆ วัน ร่วมทุกข์ร่วมสุขและสร้างครอบครัวที่เปี่ยมไปด้วยความสุข ความอบอุ่น และความเจริญรุ่งเรือง มีโซ่ทองคล้องใจที่น่ารักไวๆ นะคะ ยินดีด้วยที่สุดจ้า 🎉💕👰🤵","time":"13 ส.ค. 2569 10:01 น."},
  {"name":"เอก & พิม","message":"Happy Wedding Day! ขอให้ความรักของทั้งคู่เบ่งบานและงดงามในทุกๆ วันตลอดไปนะครับ 💐🤵👰","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"พลอย ม.เกษตร","message":"ยินดีด้วยที่สุดดดด! ขอให้มีความสุขมากๆ ในชีวิตคู่นะคะนุ่น น่ารักเหมาะสมกันมากๆ 💕🎉","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"นัท สตรีวิทยา 2","message":"Congratulations bro! ขอให้รักกันมั่นคง มีความสุขมากๆ ในการเริ่มต้นชีวิตคู่นะเพื่อน 🎈","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"ครอบครัวสุขสันต์","message":"ขออวยพรให้หลานแชมป์และหลานนุ่น มีความสุข ความเจริญในชีวิตสมรส ครองรักครองเรือนกันตลอดไป 💖🙏","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"ฝน เพื่อนที่ทำงาน","message":"ยินดีกับพี่นุ่นคนสวยด้วยนะคะ ขอให้ทุกวันของชีวิตคู่สดใสและเต็มไปด้วยความรักค่ะ 🌸","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"พี่บอย & พี่นิว","message":"ยินดีด้วยนะน้องรัก ขอให้รักกันยืนยาว มีครอบครัวที่อบอุ่นและสมบูรณ์แบบที่สุดนะครับ 🥂✨","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"เต้ แก๊งเกมเมอร์","message":"ยินดีด้วยครับพี่แชมป์! สละโสดอย่างเป็นทางการแล้ว ขอให้ชีวิตคู่แฮปปี้สุดๆ ไปเลยครับบ 🎮🎉","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"จอย เพื่อนมัธยม","message":"ดีใจด้วยจริงๆ น้า เห็นคบกันมานาน ในที่สุดก็มีวันนี้แล้ว มีความสุขมากๆ รักกันตลอดไปนะแชมป์นุ่น 💖","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"อาร์ม & นุ๊ก","message":"ขอแสดงความยินดีกับทั้งสองคนด้วยครับ ขอให้ชีวิตคู่มีแต่ความสุข รอยยิ้ม และความสำเร็จในทุกเรื่องครับ 💐","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"พี่แพร กรมป่าไม้","message":"ยินดีด้วยนะคะน้องนุ่น ขอให้น้องและสามีมีความสุขมากๆ รักกันมั่นคงตลอดไปจ้า 🌿💚","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"ฟิล์ม มหิดล","message":"Congrats na kub Champ & Noon! ยินดีด้วยมากๆ ขอให้มีเบบี๋น่ารักๆ ไวๆ น้า 👶🎉","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"ลุงสมชาย","message":"ขออวยพรให้เจ้าบ่าวเจ้าสาว ครองคู่กันด้วยความเข้าใจ มีความสุข ความเจริญในชีวิตคู่ตลอดไปครับ 🙏","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"บอส & ตอง","message":"ยินดีด้วยนะครับคู่บ่าวสาว ขอให้สร้างครอบครัวที่น่ารักและอบอุ่นไปด้วยกัน มีความสุขในทุกๆ วันครับ 💕","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"แนน เพื่อนเจ้าสาว","message":"เจ้าสาวสวยมากกก วันนี้มีความสุขมากๆ น้า ขอให้ทุกวันต่อจากนี้เต็มไปด้วยความรักและความอบอุ่นนะจ๊ะ 🌷🥰","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"พี่เอ็ม บ.เอ็มเวิร์ด","message":"ยินดีกับน้องแชมป์และเจ้าสาวด้วยครับ ขอให้ทั้งสองคนครองรักกันอย่างมีความสุขและเจริญรุ่งเรืองในทุกๆ ด้านครับ ✨","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"โอ๊ค สตรีวิทยา 2","message":"ยินดีด้วยเว้ยไอ้แชมป์! ในที่สุดก็ถึงวันสำคัญ ขอให้ครอบครัวอบอุ่น มีความสุขมากๆ ตลอดไปเพื่อน 🎊","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"เติ้ล & ก้อย","message":"Happy Wedding Day! ยินดีด้วยมากๆ ครับแชมป์&นุ่น ขอให้มีชีวิตคู่ที่เต็มไปด้วยรอยยิ้มและเสียงหัวเราะนะ 🥂💕","time":"13 ส.ค. 2569 09:55 น."},
  {"name":"ป้าเพ็ญ สองพี่น้อง","message":"ขอให้หลานทั้งสองคนมีความสุขมากๆ รักและเข้าใจกันตลอดไปนะจ๊ะ มีหลานให้อุ้มไวๆ เน้อ 🎉","time":"13 ส.ค. 2569 09:54 น."},
  {"name":"มายด์ เพื่อน ม.เกษตร","message":"ยินดีด้วยนะนุ่น! เป็นคู่ที่น่ารักและเหมาะสมกันที่สุดเลย ขอให้มีความสุขในชีวิตคู่มากๆ น้าาา 🌸✨","time":"13 ส.ค. 2569 09:54 น."},
  {"name":"พี่กอล์ฟ","message":"ขอแสดงความยินดีกับน้องแชมป์และน้องนุ่นด้วยนะครับ ขอให้รักกันยืนยาว ถือไม้เท้ายอดทองกระบองยอดเพชรครับ 💖","time":"13 ส.ค. 2569 09:54 น."},
  {"name":"เจ้านาย","message":"แต่งเช้า บ่ายเข้าออฟฟิศด้วยนะ","time":"6 ส.ค. 2569 22:41 น."},
  {"name":"นิ้ง","message":"เริศศศศศมาก แฮปปี้มีความสุขมากๆน้า ครีเอทสุดๆ ✅❤️","time":"6 มี.ค. 2569 21:32 น."},
  {"name":"นิรนาม","message":"เห่อมากๆๆๆๆๆๆๆ จ้าาาา","time":"6 มี.ค. 2569 21:24 น."},
  {"name":"สมศรี","message":"คอ วอ","time":"22 ก.พ. 2569 23:16 น."},
  {"name":"นุ่น","message":"มีความสุขมากๆ","time":"22 ก.พ. 2569 20:10 น."},
  {"name":"นายแชมป์","message":"ทดสอบ ทดสอบ","time":"22 ก.พ. 2569 11:56 น."}
];

// Load cached wishes immediately
try {
  const cached = localStorage.getItem(WISH_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed) && parsed.length > 0) {
      wishes = parsed;
    }
  }
} catch (e) {}

if (!wishes || wishes.length === 0) {
  wishes = [...INITIAL_WISHES];
}

function renderPostits(reset = true) {
  const board = document.getElementById('wish-board');
  const emptyMsg = document.getElementById('wish-carousel-empty');
  const controls = document.getElementById('board-scroll-controls');
  const countBadge = document.getElementById('board-count-badge');
  const loadMoreBtn = document.getElementById('btn-load-more');
  
  if (!board) return;
  
  if (!wishes || wishes.length === 0) {
    board.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (controls) controls.style.display = 'none';
    return;
  }
  
  if (emptyMsg) emptyMsg.style.display = 'none';
  board.style.display = 'grid';
  if (controls) controls.style.display = 'flex';
  
  if (reset) {
    board.innerHTML = '';
    displayedWishCount = 0;
  }
  
  loadMoreWishes();
}

function loadMoreWishes() {
  const board = document.getElementById('wish-board');
  const countBadge = document.getElementById('board-count-badge');
  if (!board || !wishes || wishes.length === 0) return;
  
  if (displayedWishCount >= wishes.length) {
    if (countBadge) countBadge.textContent = `💌 รวม ${wishes.length} คำอวยพร`;
    return;
  }
  
  const startIndex = displayedWishCount;
  const nextCount = Math.min(startIndex + WISH_PAGE_SIZE, wishes.length);
  const chunk = wishes.slice(startIndex, nextCount);
  
  const fragment = document.createDocumentFragment();
  chunk.forEach((w, i) => {
    const idx = startIndex + i;
    const color = POSTIT_COLORS[idx % POSTIT_COLORS.length];
    const rotate = ((idx * 7) % 9) - 4; // pseudo-random deterministic rotation
    const initials = (w.name || '?').trim().charAt(0).toUpperCase();
    
    const card = document.createElement('div');
    card.className = 'post-it';
    card.style.setProperty('--color-bg', color.bg);
    card.style.setProperty('--rotate', `${rotate}deg`);
    card.style.setProperty('--tape-rotate', color.tapeRotate);
    card.onclick = () => showWishDetail(idx);
    
    let avatarHtml = `<div class="post-it-avatar" style="background:${color.avatarColor};">${initials}</div>`;
    if (w.avatar && String(w.avatar).trim().startsWith('data:image')) {
      avatarHtml = `<img src="${w.avatar}" loading="lazy" decoding="async" class="post-it-avatar" alt="${escapeHtml(w.name)}">`;
    }
    
    card.innerHTML = `
      <div class="post-it-text">${escapeHtml(w.message)}</div>
      <div class="post-it-footer">
        ${avatarHtml}
        <div>
          <div class="post-it-name">${escapeHtml(w.name)}</div>
          <div class="post-it-time">${w.time || ''}</div>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });
  
  board.appendChild(fragment);
  displayedWishCount = nextCount;
  
  // Update badge
  if (countBadge) {
    if (displayedWishCount >= wishes.length) {
      countBadge.textContent = `💌 รวม ${wishes.length} คำอวยพร`;
    } else {
      countBadge.textContent = `💌 แสดง ${displayedWishCount} จาก ${wishes.length} คำอวยพร`;
    }
  }
}

function scrollBoard(direction) {
  const container = document.getElementById('wish-board-container');
  if (!container) return;
  const scrollAmount = 360;
  if (direction === 'up') {
    container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  } else if (direction === 'down') {
    container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    // Check if scrolled near bottom to load more
    if (displayedWishCount < wishes.length) {
      setTimeout(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 250) {
          loadMoreWishes();
        }
      }, 300);
    }
  }
}

// Auto lazy loading on user scrolling down inside the board container or page window
function initWishBoardScrollListener() {
  const container = document.getElementById('wish-board-container');
  if (!container) return;
  
  let isThrottled = false;
  
  // 1. Scroll inside the post-it board container
  container.addEventListener('scroll', () => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => { isThrottled = false; }, 150);
    
    if (displayedWishCount < wishes.length) {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 250) {
        loadMoreWishes();
      }
    }
  }, { passive: true });

  // 2. Scroll the main page (highly useful for mobile where window scroll is primary)
  window.addEventListener('scroll', () => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => { isThrottled = false; }, 150);
    
    if (displayedWishCount < wishes.length) {
      const rect = container.getBoundingClientRect();
      // If the bottom of the board container is close to or visible in the viewport
      if (rect.bottom <= window.innerHeight + 250) {
        loadMoreWishes();
      }
    }
  }, { passive: true });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===== DETAIL MODAL =====
function showWishDetail(index) {
  const w = wishes[index];
  if (!w) return;
  
  const modal = document.getElementById('wish-modal');
  const avatar = document.getElementById('modal-avatar');
  const name = document.getElementById('modal-name');
  const time = document.getElementById('modal-time');
  const msg = document.getElementById('modal-msg');
  
  const color = POSTIT_COLORS[index % POSTIT_COLORS.length];
  const initials = (w.name || '?').trim().charAt(0).toUpperCase();
  
  if (w.avatar && String(w.avatar).trim().startsWith('data:image')) {
    avatar.innerHTML = `<img src="${w.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="${escapeHtml(w.name)}">`;
    avatar.style.background = 'transparent';
  } else {
    avatar.innerHTML = initials;
    avatar.style.background = color.avatarColor;
  }
  
  name.textContent = w.name;
  time.textContent = w.time || '';
  msg.textContent = w.message;
  
  modal.classList.add('active');
}

function closeWishModal() {
  document.getElementById('wish-modal').classList.remove('active');
}

// ===== API WISHES CALLS =====
async function loadWishes() {
  return new Promise((resolve) => {
    const callbackName = 'wishCallback_' + Date.now();
    const scriptId = 'jsonp_' + Date.now();
    let isDone = false;

    // Timeout safety 10 seconds
    const timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        delete window[callbackName];
        const el = document.getElementById(scriptId);
        if (el) el.remove();
        resolve();
      }
    }, 10000);

    window[callbackName] = function(data) {
      if (isDone) return;
      isDone = true;
      clearTimeout(timer);
      delete window[callbackName];
      const el = document.getElementById(scriptId);
      if (el) el.remove();
      
      if (data && data.result === 'success' && Array.isArray(data.wishes) && data.wishes.length > 0) {
        wishes = data.wishes;
        try {
          localStorage.setItem(WISH_CACHE_KEY, JSON.stringify(wishes));
        } catch(e) {}
        renderPostits(true);
      }
      resolve();
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = WISH_URL + '?callback=' + callbackName + '&t=' + Date.now();
    script.onerror = () => {
      if (!isDone) {
        isDone = true;
        clearTimeout(timer);
        delete window[callbackName];
        resolve();
      }
    };
    document.body.appendChild(script);
  });
}

async function submitWish() {
  const nameInput = document.getElementById('wish-name');
  const msgInput  = document.getElementById('wish-msg');
  const name = nameInput.value.trim();
  const msg  = msgInput.value.trim();

  if (!name) { alert('กรุณาใส่ชื่อของคุณด้วยนะคะ 😊'); return; }
  if (!msg)  { alert('กรุณาเขียนคำอวยพรก่อนส่งนะคะ 💕'); return; }

  const btn = document.querySelector('.btn-wish');
  btn.disabled = true;

  // Snapshot avatar & current time
  const currentAvatar = avatarBase64 || '';
  const now = new Date();
  const dateStr = now.toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' });
  const timeStr = now.toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' });
  const time = `${dateStr} ${timeStr} น.`;

  const newWishItem = { 
    name, 
    message: msg, 
    time, 
    ip: userIP || '', 
    lat: '', 
    lng: '', 
    avatar: currentAvatar 
  };

  // 1. INSTANT OPTIMISTIC UI: Update the board immediately (0ms wait)
  wishes.unshift(newWishItem);
  try {
    localStorage.setItem(WISH_CACHE_KEY, JSON.stringify(wishes));
  } catch(e) {}
  
  renderPostits(true);
  
  // Smoothly scroll the wish board container to the top so new card is in view
  const container = document.getElementById('wish-board-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Clear input fields immediately
  nameInput.value = '';
  msgInput.value = '';
  removeAvatar();
  
  // Instant visual feedback for user
  btn.textContent = '🎉 ส่งคำอวยพรเรียบร้อยแล้ว!';
  setTimeout(() => { 
    btn.disabled = false; 
    btn.textContent = '💌 ส่งคำอวยพร'; 
  }, 2000);

  // 2. BACKGROUND ASYNC SYNC: Send to Google Sheets in background without blocking the user
  (async () => {
    try {
      let meta = { ip: userIP || '', lat: '', lng: '' };
      try {
        meta = await getIPAndLocation();
      } catch(e) {}

      const payload = {
        type: 'wish',
        name: name,
        message: msg,
        ip: meta.ip || userIP || '',
        lat: meta.lat || '',
        lng: meta.lng || '',
        avatar: currentAvatar
      };

      await fetch(WISH_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(err) {
      console.warn('Background wish sync:', err);
    }
  })();
}

// ===== NAVIGATION & HAMBURGER MENU =====
function toggleNavMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggle || !links) return;

  const isActive = toggle.classList.toggle('active');
  links.classList.toggle('active', isActive);
  if (backdrop) backdrop.classList.toggle('active', isActive);
  document.body.style.overflow = isActive ? 'hidden' : '';
}

function closeNavMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  if (toggle) toggle.classList.remove('active');
  if (links) links.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// Close nav menu on window resize if resized to desktop (> 768px)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeNavMenu();
  }
});

// Initial immediate render and scroll listener setup
initWishBoardScrollListener();
renderPostits(true);
loadWishes();