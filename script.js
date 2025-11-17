let step = 1;

window.onload = function () {
    document.getElementById("step1").style.display = "block";

    let msg = new SpeechSynthesisUtterance("مرحباً بك في النجم داتا، ابدأ الآن في إنشاء سيرتك الذاتية.");
    msg.lang = "ar-SA";
    speechSynthesis.speak(msg);

    setTimeout(() => {
        document.getElementById("welcomeBox").style.display = "none";
    }, 5000);
};

function nextStep() {
    document.getElementById("step" + step).style.display = "none";
    step++;
    document.getElementById("step" + step).style.display = "block";
}

function addSocial() {
    let div = document.createElement("div");
    div.innerHTML = `
        <input type="text" placeholder="اسم الموقع (Facebook / TikTok / YouTube)">
        <input type="text" placeholder="اللينك">
        <input type="text" placeholder="الاسم البحثي">
        <input type="text" placeholder="رقم الهاتف">
        <input type="email" placeholder="الإيميل">
        <hr>
    `;
    document.getElementById("socialContainer").appendChild(div);
}

function nextStep() {
    document.getElementById("step" + step).style.display = "none";
    step++;
    document.getElementById("step" + step).style.display = "block";

    if (step === 6) generatePreview();
}

function generatePreview() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let job = document.getElementById("job").value;
    let edu = document.getElementById("edu").value;
    let nid = document.getElementById("nid").value;
    let apply = document.getElementById("apply").value;

    let fontColor = document.getElementById("fontColor").value;
    let fontSize = document.getElementById("fontSize").value;
    let fontFamily = document.getElementById("fontFamily").value;

    let socials = document.querySelectorAll("#socialContainer div");

    let socialHTML = "";
    socials.forEach(s => {
        let inputs = s.querySelectorAll("input");
        socialHTML += `
        <p><b>${inputs[0].value}:</b> ${inputs[1].value} – ${inputs[2].value} – ${inputs[3].value} – ${inputs[4].value}</p>
        `;
    });

    document.getElementById("cvPreview").style.display = "block";
    document.getElementById("cvPreview").style.fontSize = fontSize + "px";
    document.getElementById("cvPreview").style.color = fontColor;
    document.getElementById("cvPreview").style.fontFamily = fontFamily;

    document.getElementById("cvPreview").innerHTML = `
        <h2>السيرة الذاتية</h2>
        <p><b>الاسم:</b> ${name}</p>
        <p><b>العمر:</b> ${age}</p>
        <p><b>المهنة:</b> ${job}</p>
        <p><b>التعليم:</b> ${edu}</p>
        <p><b>الرقم القومي:</b> ${nid}</p>
        <p><b>التقديم إلى:</b> ${apply}</p>
        <h3>حسابات السوشيال</h3>
        ${socialHTML}
    `;
}

function downloadPDF() {
    let element = document.getElementById("cvPreview");
    html2pdf().from(element).save("Negm_CV.pdf");
}

function generateQR() {
    document.getElementById("qrCode").innerHTML = "";
    new QRCode(document.getElementById("qrCode"), {
        text: document.getElementById("cvPreview").innerText,
        width: 200,
        height: 200
    });
}
