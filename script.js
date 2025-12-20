
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

// في نهاية script.js
// Highlight أول بطاقة لجذب الانتباه
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود الموجود ...
    
    // إذا كان المستخدم جديد، نحركو أول بطاقة
    if (!sessionStorage.getItem('hasSeenGuide')) {
        setTimeout(() => {
            const firstCard = document.querySelector('.product-card');
            if (firstCard) {
                firstCard.style.animation = 'pulse-attention 2s ease-in-out 3';
            }
        }, 5000); // بعد 5 ثواني من الدخول
    }
});

// Animation للفت الانتباه
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse-attention {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        50% { transform: scale(1.02); box-shadow: 0 8px 24px rgba(210, 105, 30, 0.3); }
    }
`;
document.head.appendChild(pulseStyle);

// Tooltip لزر "حبيتو" للمستخدمين الجدد
window.openModal = function(colorName, colorArabic) {
    selectedColorName = colorName;
    selectedColorArabic = colorArabic;
    document.getElementById('selectedColor').textContent = `${colorName} (${colorArabic})`;
    document.getElementById('voteModal').style.display = 'block';
    
    // إذا كانت أول مرة يفتح modal
    if (!sessionStorage.getItem('hasOpenedModal')) {
        sessionStorage.setItem('hasOpenedModal', 'true');
        // نضيفو hint صغير
        showQuickHint();
    }
};

function showQuickHint() {
    const hint = document.createElement('div');
    hint.className = 'quick-hint';
    hint.innerHTML = '👈 اختاري الستيل والثوب ثم أكدي';
    hint.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 1.1rem;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: fadeInOut 3s forwards;
    `;
    document.body.appendChild(hint);
    
    setTimeout(() => hint.remove(), 3000);
}
// ===========================
// Welcome Guide - Event Listener Method
// ===========================

function initWelcomeGuide() {
    const modal = document.getElementById('welcomeGuideModal');
    if (!modal) {
        console.warn('⚠️ welcomeGuideModal not found');
        return;
    }

    // دالة الإغلاق
    function closeGuide() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        sessionStorage.setItem('hasSeenGuide', 'true');
        console.log('✅ Guide closed');
    }

    // ربط الأزرار بـ Event Listeners
    const startBtn = modal.querySelector('.start-btn-primary');
    const skipBtn = modal.querySelector('.skip-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', closeGuide);
        console.log('✅ Start button linked');
    }
    
    if (skipBtn) {
        skipBtn.addEventListener('click', closeGuide);
        console.log('✅ Skip button linked');
    }

    // عرض أو إخفاء الدليل
    if (sessionStorage.getItem('hasSeenGuide')) {
        modal.style.display = 'none';
        console.log('ℹ️ User already seen guide');
    } else {
        modal.style.display = 'flex';
        console.log('👋 Showing welcome guide');
    }
}

// تشغيل الدليل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تشغيل الدليل
    initWelcomeGuide();
    
    // باقي الكود ديالك...
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
