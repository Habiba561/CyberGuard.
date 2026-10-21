// ===============================
// التنقل بين الصفحات
// ===============================

const links = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".page-section");

function showPage(pageName) {

    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


links.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const pageName =
            link.getAttribute("data-page");

        showPage(pageName);

    });

});


// ===============================
// زر تسجيل الدخول
// ===============================

const loginBtn =
    document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {

    showPage("login");

});


// ===============================
// تسجيل المستخدم
// ===============================

const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("userName").value.trim();

    const phone =
        document.getElementById("userPhone").value.trim();

    const email =
        document.getElementById("userEmail").value.trim();


    if (name === "" || phone === ""  || email === "") {

        alert("من فضلك املأ جميع البيانات.");

        return;
    }


    // الانتقال إلى الفحص

    showPage("scan");

});


// ===============================
// زر ابدأ الفحص
// ===============================

const startScanBtn =
    document.getElementById("startScanBtn");

startScanBtn.addEventListener("click", function () {

    showPage("scan");

});


// ===============================
// فحص الملف
// ===============================
const fileScanBtn = document.getElementById("fileScanBtn");

if (fileScanBtn) {
    fileScanBtn.addEventListener("click", async function () {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (!file) {
            alert("من فضلك اختر ملف أولاً");
            return;
        }

        showResult("جاري فحص الملف...", "يتم إرسال الملف إلى الخادم...");

        try {
            const response = await fetch('http://localhost:5000/api/scan/file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName: file.name })
            });

            const data = await response.json();
            showResult("نتيجة فحص الملف", "اسم الملف: "  + file.name + " | الحالة: " + data.message + " | مستوى الخطر: " + data.riskLevel);

        } catch (error) {
            console.error("Error:", error);
            showResult("خطأ في الاتصال", "فشل الاتصال بخادم الباك إند!");
        }
    });
}
// دالة لجلب وعرض سجل الفحوصات من السيرفر
async function loadScanHistory() {
    try {
        const response = require ? null : await fetch('http://localhost:5000/api/scans/history');
        // أو بالطريقة القياسية للمتصفح:
        const res = await fetch('http://localhost:5000/api/scans/history');
        const data = await res.json();
        
        if (data.status === "success") {
            console.log("سجل الفحوصات اللي جاي من السيرفر:", data.history);
            // هنا تقدري تاخدي data.history وتعرضيها جوه جدول في صفحة HTML بتاعتك
        }
    } catch (error) {
        console.error("خطأ في جلب الهيستوري:", error);
    }
}


// ===============================
// فحص الصورة
// ===============================
// مثال لكود فحص الصورة في script.js
async function scanImage() {
    const fileInput = document.getElementById('imageInput'); // حسب اسم الـ ID عندك
    if (fileInput.files.length === 0) {
        alert("الرجاء اختيار صورة أولاً!");
        return;
    }
    
    const fileName = fileInput.files[0].name;

    const response = await fetch('http://localhost:5000/api/scan/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: fileName })
    });
    
    const data = await response.json();
    // عرض النتيجة على الشاشة
    document.getElementById('imageResult').innerText = data.message;
}

// ===============================
// فحص الرابط (متصل بالـ Backend)
// ===============================

const urlScanBtn =
    document.getElementById("urlScanBtn");

urlScanBtn.addEventListener("click", async function () {

    const url =
        document.getElementById("urlInput").value.trim();


    if (url === "") {

        alert("من فضلك أدخل الرابط أولاً.");

        return;
    }

    // إظهار رسالة جاري الفحص
    showResult(
        "جاري الفحص...",
        "يتم إرسال الرابط إلى سيرفر CyberGuard للتحليل الأمني..."
    );

    try {
        // إرسال الطلب للـ Backend الحقيقي
        const response = await fetch('http://localhost:5000/api/scan/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        // عرض النتيجة الحقيقية القادمة من السيرفر
            showResult("نتيجة فحص الرابط (من الـ Backend)", "الرابط المدخل: " + data.url + " | الحالة: " + data.message + " | مستوى الخطر: " + data.riskLevel);
    

    } catch (error) {
        console.error("Error:", error);
        showResult(
            "خطأ في الاتصال",
            "فشل الاتصال بالسيرفر، تأكد من تشغيل الـ Backend بنجاح!"
        );
    }

});
// ===============================
// فحص الصورة (متصل بالـ Backend)
// ===============================
const imageScanBtn = document.getElementById("imageScanBtn");

if (imageScanBtn) {
    imageScanBtn.addEventListener("click", async function () {
        const fileInput = document.getElementById("imageInput");
        const file = fileInput.files[0];

        if (!file) {
            alert("من فضلك اختر صورة أولاً");
            return;
        }

        showResult(
            "جاري فحص الصورة...",
            "يتم إرسال الصورة إلى سيرفر CyberGuard للتحليل الأمني..."
        );

        try {
            const response = await fetch('http://localhost:5000/api/scan/file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName: file.name })
            });

            const data = await response.json();
            
            showResult(
                "نتيجة فحص الصورة", 
                "اسم الصورة: " + file.name + " | الحالة: " + data.message + " | مستوى الخطر: " + data.riskLevel
            );

        } catch (error) {
            console.error("Error:", error);
            showResult(
                "خطأ في الاتصال",
                "فشل الاتصال بخادم الباك إند أثناء فحص الصورة!"
            );
        }
    });
}
// ===============================
// إظهار النتيجة
// ===============================

function showResult(title, text) {

    const result =
        document.getElementById("scanResult");

    const resultTitle =
        document.getElementById("resultTitle");

    const resultText =
        document.getElementById("resultText");


    resultTitle.textContent = title;

    resultText.textContent = text;

    result.classList.add("show");

}
// دالة لجلب وعرض الهيستوري في الجدول بتنسيق ألوان الموقع
async function fetchAndDisplayHistory() {
    try {
        const response = await fetch('http://localhost:5000/api/scans/history');
        const data = await response.json();
        
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = ''; // تفريغ الجدول أولاً

        if (data.status === "success" && data.history.length > 0) {
            data.history.forEach(item => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #1e293b';
                
                row.innerHTML = `
                    <td style="padding: 10px;">${item.type === 'file' ? '📁 ملف' : '🔗 رابط'}</td>
                    <td style="padding: 10px; color: #38bdf8;">${item.target || item.fileName || 'غير محدد'}</td>
                    <td style="padding: 10px; color: #00ff88; font-weight: bold;">${item.riskLevel}</td>
                    <td style="padding: 10px;">${item.message}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="padding: 15px; text-align: center; color: #888;">لا توجد فحوصات مسجلة حتى الآن</td></tr>`;
        }
    } catch (error) {
        console.error("خطأ في جلب السجل:", error);
        alert("تعذر الاتصال بالسيرفر لجلب السجل!");
    }
}