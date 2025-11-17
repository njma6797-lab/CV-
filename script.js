// ---------- بيانات افتراضية ----------
let socials = [];
let photoData = '';

// ---------- شاشة الترحيب + صوت ---------- 
window.addEventListener('load', ()=> {
  const welcome = document.getElementById('welcome');
  // اقرأ الصوت
  try{
    const u = new SpeechSynthesisUtterance('مرحبًا بك في النجم داتا، أنشئ الآن السيرة الذاتية الخاصة بك');
    u.lang = 'ar-SA'; u.rate = 0.95; speechSynthesis.speak(u);
  }catch(e){}
  // إظهار 5 ثواني ثم إخفاء
  setTimeout(()=>{ if(welcome) welcome.style.display='none'; }, 5000);
});

// ---------- تنقّل بين الصفحات (كل صفحة حقل منفرد) ----------
const pages = Array.from(document.querySelectorAll('.page'));
const stepBtns = Array.from(document.querySelectorAll('.step-btn'));

function showPage(i){
  pages.forEach(p=>p.classList.add('hidden'));
  stepBtns.forEach(b=>b.classList.remove('active'));
  const pg = document.querySelector(`.page[data-page="${i}"]`);
  const sb = document.querySelector(`.step-btn[data-step="${i}"]`);
  if(pg) pg.classList.remove('hidden');
  if(sb) sb.classList.add('active');
}
document.querySelectorAll('.next').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const cur = pages.findIndex(p=>!p.classList.contains('hidden'));
    const nxt = Math.min(cur+1, pages.length-1); showPage(nxt);
  });
});
document.querySelectorAll('.prev').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const cur = pages.findIndex(p=>!p.classList.contains('hidden'));
    const prv = Math.max(cur-1, 0); showPage(prv);
  });
});
stepBtns.forEach(b=> b.addEventListener('click', ()=> showPage(Number(b.dataset.step))));

// ---------- إدارة الحقول: رفع صورة -> dataURL ----------
const photoFile = document.getElementById('photoFile');
photoFile.addEventListener('change', function(){
  const f = this.files[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{ photoData = reader.result; document.getElementById('photoUrl').value = photoData; };
  reader.readAsDataURL(f);
});

// ---------- إضافة حسابات تواصل ----------
document.getElementById('addSocial').addEventListener('click', ()=>{
  const n = document.getElementById('s_name').value.trim();
  const l = document.getElementById('s_link').value.trim();
  if(!n || !l) return alert('ادخل اسم المنصة والرابط');
  socials.push({name:n,link:l});
  document.getElementById('s_name').value=''; document.getElementById('s_link').value='';
  renderSocials();
});
function renderSocials(){
  const el = document.getElementById('socialsList'); el.innerHTML='';
  socials.forEach((s,i)=>{
    const div = document.createElement('div'); div.className='social-item';
    div.innerHTML = `<div><strong>${s.name}</strong><div class="small">${s.link}</div></div>
      <div><button class="btn" data-i="${i}">حذف</button></div>`;
    el.appendChild(div);
    div.querySelector('button').addEventListener('click', ()=>{ socials.splice(i,1); renderSocials(); });
  });
}

// ---------- خيارات التصميم -->
const fontSizeInput = document.getElementById('fontSize');
const fontSizeLabel = document.getElementById('fontSizeLabel');
const fontColorInput = document.getElementById('fontColor');
const fontFamilyInput = document.getElementById('fontFamily');
const bgSelect = document.getElementById('bgSelect');

fontSizeInput.addEventListener('input', ()=> fontSizeLabel.textContent = fontSizeInput.value);
bgSelect.addEventListener('change', ()=> {
  const v = bgSelect.value; const bg = document.querySelector('.cinema-bg');
  if(v==='cinema1'){ bg.style.background = 'radial-gradient(circle at 20% 10%, rgba(245,200,66,0.06), transparent 8%), radial-gradient(circle at 80% 90%, rgba(255,255,255,0.02), transparent 12%), linear-gradient(180deg,#02020a,#071227 60%)'; }
  if(v==='cinema2'){ bg.style.background = 'radial-gradient(circle at 10% 10%, rgba(245,200,66,0.08), transparent 10%), linear-gradient(90deg, rgba(255,215,0,0.06), rgba(20,12,0,0.12))'; }
  if(v==='cinema3'){ bg.style.background = 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.02), transparent 10%), linear-gradient(180deg,#02030a,#020618)'; }
});

// ---------- بناء السيرة -->
function collectData(){
  return {
    name: document.getElementById('name').value.trim(),
    photo: document.getElementById('photoUrl').value.trim() || photoData,
    age: document.getElementById('age').value.trim(),
    job: document.getElementById('job').value.trim(),
    education: document.getElementById('education').value.trim(),
    nid: document.getElementById('nid').value.trim(),
    applyTo: document.getElementById('applyTo').value.trim(),
    socials: JSON.parse(JSON.stringify(socials)),
    style: {
      fontSize: fontSizeInput.value,
      fontColor: fontColorInput.value,
      fontFamily: fontFamilyInput.value
    }
  };
}

function buildSections(data){
  const sections = [];
  sections.push({id:'personal',title:'البيانات الشخصية',html:
    `<div style="display:flex;gap:12px;align-items:center">
      <div style="width:96px;height:96px;border-radius:8px;overflow:hidden;background:#eee">
        ${data.photo?`<img src="${data.photo}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">`:''}
      </div>
      <div>
        <h2 style="margin:0">${data.name||''}</h2>
        <div>${data.job||''}</div>
        <div class="small">العمر: ${data.age||''} — ${data.education||''}</div>
      </div>
    </div>`});
  sections.push({id:'apply',title:'التقديم إلى',html:`<div><strong>${data.applyTo||'—'}</strong></div>`});
  sections.push({id:'nid',title:'الرقم القومي',html:`<div>${data.nid||'—'}</div>`});
  if((data.socials||[]).length) sections.push({id:'social',title:'الحسابات',html:`<ul>${data.socials.map(s=>`<li>${s.name}: <a href="${s.link}" target="_blank">${s.link}</a></li>`).join('')}</ul>`});
  return sections;
}

function renderCv(data){
  const container = document.getElementById('cvContainer'); container.innerHTML='';
  const secs = buildSections(data);
  secs.forEach(s=>{
    const el = document.createElement('div'); el.className='cv-section'; el.dataset.id = s.id;
    el.style.padding='10px 0'; el.style.borderBottom='1px solid rgba(0,0,0,0.06)';
    el.innerHTML = `<h3 style="margin:0 0 6px 0">${s.title}</h3>${s.html}`;
    container.appendChild(el);
  });
  // تطبيق خيارات التصميم
  container.style.fontSize = data.style.fontSize + 'px';
  container.style.color = data.style.fontColor;
  container.style.fontFamily = data.style.fontFamily;

  // تفعيل السحب لإعادة الترتيب
  if(window.sortableInstance) window.sortableInstance.destroy();
  window.sortableInstance = new Sortable(container, { animation:150 });
}

// ربط زر البناء
document.getElementById('buildCv').addEventListener('click', ()=>{
  const d = collectData(); renderCv(d);
});

// ---------- حفظ / تحميل محلي ----------
document.getElementById('saveData').addEventListener('click', ()=>{
  const d = collectData(); localStorage.setItem('negm_cv', JSON.stringify(d)); alert('تم الحفظ محليًا');
});
document.getElementById('loadData').addEventListener('click', ()=>{
  const s = localStorage.getItem('negm_cv'); if(!s) return alert('لا يوجد محفوظ');
  const d = JSON.parse(s);
  document.getElementById('name').value = d.name||'';
  document.getElementById('photoUrl').value = d.photo||'';
  photoData = d.photo||'';
  document.getElementById('age').value = d.age||'';
  document.getElementById('job').value = d.job||'';
  document.getElementById('education').value = d.education||'';
  document.getElementById('nid').value = d.nid||'';
  document.getElementById('applyTo').value = d.applyTo||'';
  socials.length = 0; (d.socials||[]).forEach(x=>socials.push(x)); renderSocials();
  if(d.style){ fontSizeInput.value = d.style.fontSize || 16; fontSizeLabel.textContent = fontSizeInput.value; fontColorInput.value = d.style.fontColor || '#111111'; fontFamilyInput.value = d.style.fontFamily || 'Tahoma, Arial, sans-serif'; }
  alert('تم استرجاع البيانات');
});

// ---------- PDF ----------
document.getElementById('downloadPdf').addEventListener('click', ()=>{
  const el = document.getElementById('cvContainer');
  if(!el.innerHTML.trim()) return alert('ابني السيرة أولاً');
  const opt = { filename: (document.getElementById('name').value||'cv') + '.pdf', margin:0.5, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} };
  html2pdf().set(opt).from(el).save();
});

// ---------- QR ----------
let qrInst = null;
document.getElementById('genQR').addEventListener('click', ()=>{
  const el = document.getElementById('cvContainer');
  if(!el.innerHTML.trim()) return alert('ابني السيرة أولاً');
  // نبني HTML مبسط ونحوّله إلى data URL
  const html = '<!doctype html><meta charset="utf-8"><div>'+ el.innerHTML +'</div>';
  const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  const area = document.getElementById('qrArea'); area.innerHTML = ''; qrInst = new QRCode(area, { text: dataUrl, width:160, height:160 });
});
document.getElementById('downloadQR').addEventListener('click', ()=>{
  const area = document.getElementById('qrArea');
  const img = area.querySelector('img') || area.querySelector('canvas');
  if(!img) return alert('انشئ QR أولاً');
  const url = img.src || img.toDataURL('image/png');
  const a = document.createElement('a'); a.href = url; a.download = 'cv_qr.png'; a.click();
});

// ---------- انتقال للمعاينة عند الضغط -->
document.getElementById('goPreview').addEventListener('click', ()=> showPage(9));

// عند التهيئة: عرض الصفحة 0
showPage(0);
