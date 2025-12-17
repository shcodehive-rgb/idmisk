// ===========================
// IDMISK - Supabase Backend
// ===========================

const SUPABASE_URL = 'https://nqwttejjsjkmyziixmaax.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xd3RlampzamtteXppaXhtYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjQ2MDMsImV4cCI6MjA4MTQwMDYwM30.SKWg74C1MSQv9F-_B3DOcLxR1fpvEfdiUWapGHaHZmM';

let selectedColorName = '';
let selectedColorArabic = '';

// ===========================
// Image Protection
// ===========================
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// ===========================
// Filter Function
// ===========================
function filterColors(category) {
    document.querySelectorAll('.filter-chip').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.product-card').forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

// ===========================
// Modal Functions
// ===========================
function openModal(colorName, colorArabic) {
    selectedColorName = colorName;
    selectedColorArabic = colorArabic;
    
    const modal = document.getElementById('voteModal');
    document.getElementById('selectedColor').textContent = `${colorName} (${colorArabic})`;
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('voteModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = e => {
    if (e.target === document.getElementById('voteModal')) {
        closeModal();
    }
}

// ===========================
// Submit Vote to Supabase
// ===========================
async function submitVote() {
    const styles = [];
    document.querySelectorAll('.style-option input:checked').forEach(cb => {
        styles.push(cb.value);
    });
    
    if (styles.length === 0) {
        alert('المرجو اختيار ستيل واحد على الأقل! 🙏');
        return;
    }
    
    const fabrics = [];
    document.querySelectorAll('.fabric-option input:checked').forEach(cb => {
        fabrics.push(cb.value);
    });
    
    if (fabrics.length === 0) {
        alert('المرجو اختيار ثوب واحد على الأقل! 🙏');
        return;
    }
    
    const btn = document.querySelector('.confirm-btn');
    const originalText = btn.textContent;
    btn.textContent = 'جاري الإرسال... ⏳';
    btn.disabled = true;
    
    try {
        const fabricString = `Styles: [${styles.join(', ')}] | Fabrics: [${fabrics.join(', ')}]`;
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                color_name: selectedColorName,
                color_arabic: selectedColorArabic,
                fabric: fabricString
            })
        });

        if (!response.ok) throw new Error('Failed to save');

        console.log('✅ Vote saved!');
        closeModal();
        showSuccessMessage();
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('حدث خطأ! حاول مرة أخرى.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ===========================
// Success Message
// ===========================
function showSuccessMessage() {
    const msg = document.getElementById('successMessage');
    msg.style.display = 'block';
    setTimeout(() => {
        msg.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            msg.style.display = 'none';
            msg.style.animation = '';
        }, 500);
    }, 3000);
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