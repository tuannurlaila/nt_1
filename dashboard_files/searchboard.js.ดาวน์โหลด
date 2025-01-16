// ฟังก์ชันการค้นหา
document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase(); // คำที่พิมพ์ในช่องค้นหา
    const cards = document.querySelectorAll('.card'); // เลือกทุก Card

    cards.forEach(card => {
        // ดึงข้อมูลจาก card-title และ card-text
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const text = card.querySelector('.card-text').textContent.toLowerCase();

        // ตรวจสอบว่าคำค้นหาตรงกับ title หรือ text
        const isMatch = title.includes(filter) || text.includes(filter);

        // แสดงหรือซ่อน Card
        card.style.display = isMatch ? '' : 'none';
    });
});
