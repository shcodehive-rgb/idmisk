
// ===========================
// IDMISK - Firebase Backend (FINAL)
// ===========================

// 1. استدعاء مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. إعدادات المشروع (من التصويرة اللي صيفطتي)
const firebaseConfig = {
  apiKey: "AIzaSyDRhrHeOMbLNbfrrltPrRqfcDD6qXDAktT0",
  authDomain: "idmisk-votes.firebaseapp.com",
  databaseURL: "https://idmisk-votes-default-rtdb.firebaseio.com",
  projectId: "idmisk-votes",
  storageBucket: "idmisk-votes.firebasestorage.app",
  messagingSenderId: "14722409078",
  appId: "1:14722409078:web:54d70a9bc4114e4c2bf557",
  measurementId: "G-J3HTRV4ZL3"
};

// 3. تشغيل Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("🔥 Firebase Connected!");

// المتغيرات
let selectedColorName = '';
let selectedColorArabic = '';

// ===========================
// دوال النظام (System Functions)
// ===========================

// جعل الدوال متاحة للصفحة (Global)
window.filterColors = function(category) {
    document.querySelectorAll('.filter-chip').forEach(btn => {
        if (btn.dataset.category === category) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('.product-card').forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
};

window.openModal = function(colorName, colorArabic) {
    selectedColorName = colorName;
    selectedColorArabic = colorArabic;
    document.getElementById('selectedColor').textContent = `${colorName} (${colorArabic})`;
    document.getElementById('voteModal').style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('voteModal').style.display = 'none';
};

// ===========================
// إرسال التصويت إلى Firebase
// ===========================
window.submitVote = async function() {
    const styles = [];
    document.querySelectorAll('.style-option input:checked').forEach(cb => styles.push(cb.value));
    
    const fabrics = [];
    document.querySelectorAll('.fabric-option input:checked').forEach(cb => fabrics.push(cb.value));
    
    if (styles.length === 0 || fabrics.length === 0) {
        alert('المرجو اختيار ستيل وثوب واحد على الأقل! 🙏');
        return;
    }

    const btn = document.querySelector('.confirm-btn');
    btn.textContent = 'جاري الإرسال... ⏳';
    btn.disabled = true;

    try {
        // إرسال البيانات لقاعدة البيانات الحقيقية
        await push(ref(db, 'votes'), {
            color: selectedColorName,
            color_ar: selectedColorArabic,
            styles: styles,
            fabrics: fabrics,
            date: new Date().toISOString()
        });

        console.log("✅ Vote Saved in Firebase!");
        window.closeModal();
        showSuccessMessage();

    } catch (error) {
        console.error("❌ Error:", error);
        alert('حدث خطأ في الاتصال، حاول مرة أخرى!');
    } finally {
        btn.textContent = 'تأكيد صوتي ✅';
        btn.disabled = false;
    }
};

function showSuccessMessage() {
    const msg = document.getElementById('successMessage');
    msg.style.display = 'block';
    setTimeout(() => {
        msg.style.display = 'none';
    }, 4000);
}
// ===========================
// Initialize
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.draggable = false;
        img.style.userSelect = 'none';
    });
    
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.05}s forwards`;
        card.style.opacity = '0';
    });
    
    console.log('✅ IDMISK System Ready');
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
