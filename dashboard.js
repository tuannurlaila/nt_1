// ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    try {
        // เช็คจำนวนการ์ดปัจจุบัน
        const response = await fetch('http://localhost:3000/api/dashboard/cards');
        const existingCards = await response.json();
        const nextPageNumber = existingCards.length + 1;

        if (nextPageNumber > 10) {
            alert('ไม่สามารถเพิ่มข้อมูลได้เนื่องจากมีหน้าครบ 10 หน้าแล้ว');
            return;
        }

        // สร้าง link ใหม่ตามรูปแบบ page{number}.html
        const link = `/NT_1/page${nextPageNumber}.html`;
        
        const formData = {
            title,
            description,
            link,
            icon_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXYSo5MAEOpn3iYW6wohqzWnsOG2KoAJcNnA&s'
        };

        const postResponse = await fetch('http://localhost:3000/api/dashboard/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!postResponse.ok) {
            throw new Error(`HTTP error! status: ${postResponse.status}`);
        }

        const result = await postResponse.json();
        
        // ปิด Modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDataModal'));
        modal.hide();
        
        // รีเฟรชข้อมูล
        await loadDashboardCards();
        
        // รีเซ็ตฟอร์ม
        document.getElementById('addDataForm').reset();
        
        // แสดงข้อความสำเร็จ
        alert('เพิ่มข้อมูลสำเร็จ');
        
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ' + error.message);
    }
}

// ฟังก์ชันโหลดข้อมูล cards
async function loadDashboardCards() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/cards');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cards = await response.json();
        updateDashboardUI(cards);
    } catch (error) {
        console.error('Error loading cards:', error);
        alert('ไม่สามารถโหลดข้อมูลได้: ' + error.message);
    }
}

// ฟังก์ชันอัพเดต UI
function updateDashboardUI(cards) {
    const container = document.querySelector('.button-container');
    if (!container) return;

    container.innerHTML = ''; // เคลียร์ข้อมูลเก่า

    cards.forEach((card, index) => {
        const pageNumber = index + 1;
        const cardHTML = `
            <div class="card shadow-sm mb-3">
                <button class="card-btn" onclick="window.location.href='/NT_1/page${pageNumber}.html'">
                    <div class="card-body d-flex align-items-center">
                        <img src="${card.icon_path}" alt="Icon" class="me-3" style="width: 48px; height: 48px;">
                        <div>
                            <h5 class="card-title mb-1">${card.title}</h5>
                            <p class="card-text text-muted mb-0">${card.description}</p>
                        </div>
                    </div>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const addDataForm = document.getElementById('addDataForm');
    if (addDataForm) {
        addDataForm.addEventListener('submit', handleFormSubmit);
    }
    
    // โหลดข้อมูลเริ่มต้น
    loadDashboardCards();
});