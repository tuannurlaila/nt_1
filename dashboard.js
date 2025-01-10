// ฟังก์ชันโหลดข้อมูลจาก API
const loadData = async () => {
  try {
      const response = await fetch('http://localhost:3000/api/dashboard');
      const data = await response.json();
      const container = document.querySelector('.button-container');
      container.innerHTML = ''; // เคลียร์ข้อมูลเก่า

      if (data.length === 0) {
          container.innerHTML = '<p class="text-center text-muted">ไม่มีข้อมูล</p>';
          return;
      }

      data.forEach(item => {
          const cardHTML = `
              <div class="card shadow-sm">
                  <button class="card-btn" onclick="window.location.href='page${item.id}.html'">
                      <div class="card-body d-flex align-items-center">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXYSo5MAEOpn3iYW6wohqzWnsOG2KoAJcNnA&s" alt="Icon" class="me-3">
                          <div>
                              <h5 class="card-title">${item.title}</h5>
                              <p class="card-text text-muted">${item.description}</p>
                          </div>
                      </div>
                  </button>
              </div>
          `;
          container.insertAdjacentHTML('beforeend', cardHTML);
      });
  } catch (error) {
      console.error('Error loading data:', error);
  }
};

// ฟังก์ชันค้นหาข้อมูล
const searchData = (searchTerm) => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const description = card.querySelector('.card-text').textContent.toLowerCase();
      
      if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
          card.style.display = '';
      } else {
          card.style.display = 'none';
      }
  });
};

// Event listener สำหรับการค้นหา
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchData(e.target.value);
});

// Event listener สำหรับการเพิ่มข้อมูล
document.getElementById('addDataForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !description) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
  }

  try {
      const response = await fetch('http://localhost:3000/api/dashboard', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
          throw new Error('Failed to add data');
      }

      // โหลดข้อมูลใหม่
      loadData();
      
      // รีเซ็ตฟอร์มและปิด modal
      document.getElementById('addDataForm').reset();
      const closeButton = document.querySelector('.btn-close');
      if (closeButton) {
          closeButton.click();
      }

  } catch (error) {
      console.error('Error adding data:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
  }
});

// โหลดข้อมูลเมื่อหน้าเว็บโหลด
document.addEventListener('DOMContentLoaded', loadData);