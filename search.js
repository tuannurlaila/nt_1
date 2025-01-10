document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase(); 
    const rows = document.querySelectorAll('#dataTable tbody tr');

    rows.forEach(row => {
        const cell = row.cells[6]; // สมมติว่าคอลัมน์ที่ 8 คือชื่อผู้ดูแล
        if (cell) {
            console.log(cell.textContent || cell.innerText);  // ดูข้อมูลที่อยู่ใน cell
            const text = cell.textContent || cell.innerText;
            row.style.display = text.toLowerCase().indexOf(filter) > -1 ? '' : 'none';
        }
    });
});