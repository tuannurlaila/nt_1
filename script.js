document.addEventListener("DOMContentLoaded", function () {
  // โหลดข้อมูลเมื่อเริ่มต้น
  loadTableData();

  // Event Listener สำหรับปุ่มเพิ่มข้อมูล
  document.getElementById("addRowBtn").addEventListener("click", function () {
      const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
      const rowCount = table.rows.length;
      const newRow = table.insertRow();

      // สร้างแถวใหม่พร้อม input fields
      newRow.innerHTML = `
          <td>${rowCount + 1}</td>
          <td><input type="text" class="form-control" name="agent_code" placeholder="รหัสตัวแทนขาย"></td>
          <td><input type="text" class="form-control" name="ca_number" placeholder="หมายเลข CA"></td>
          <td><input type="text" class="form-control" name="contract_number" placeholder="รหัสสัญญา"></td>
          <td><input type="text" class="form-control" name="registered_name" placeholder="จดทะเบียนในนาม"></td>
          <td>
              <select class="form-select" name="application_type">
                  <option value="Mobile" selected>Mobile</option>
                  <option value="BB">BB</option>
              </select>
          </td>
          <td><input type="text" class="form-control" name="manager_name" placeholder="ชื่อผู้ดูแล"></td>
          <td><input type="text" class="form-control" name="mobile_phone" placeholder="โทรศัพท์ Mobile"></td>
          <td><input type="email" class="form-control" name="email" placeholder="Email"></td>
          <td><input type="text" class="form-control" name="service_center" placeholder="ศูนย์บริการหลัก"></td>
          <td>
              <select class="form-select" name="agent_type">
                  <option value="ร้านค้า" selected>ร้านค้า</option>
                  <option value="นิติบุคคล">นิติบุคคล</option>
                  <option value="บุคคลธรรมดา">บุคคลธรรมดา</option>
              </select>
          </td>
          <td><input type="text" class="form-control" name="id_number" placeholder="เลขที่บัตร"></td>
          <td><input type="date" class="form-control" name="contract_start"></td>
          <td><input type="text" class="form-control" name="notes" placeholder="หมายเหตุ"></td>
          <td><button class="save-btn btn btn-success btn-sm">บันทึก</button></td>
          <td><button class="delete-btn btn btn-danger btn-sm">ลบ</button></td>
      `;

      // เพิ่ม Event Listener สำหรับปุ่มบันทึก
      const saveButton = newRow.querySelector(".save-btn");
      saveButton.addEventListener("click", function() {
          saveRowData(newRow);
      });

      // เพิ่ม Event Listener สำหรับปุ่มลบ
      const deleteButton = newRow.querySelector(".delete-btn");
      deleteButton.addEventListener("click", function() {
          if (newRow.dataset.id) {
              deleteRowData(newRow.dataset.id, newRow);
          } else {
              table.deleteRow(newRow.rowIndex);
          }
      });
  });
});

// ฟังก์ชันโหลดข้อมูลตาราง
function loadTableData() {
  fetch('http://localhost:3000/api/agents')
      .then(response => response.json())
      .then(data => {
          const tbody = document.querySelector('#dataTable tbody');
          tbody.innerHTML = '';
          data.forEach((agent, index) => {
              const row = createDataRow(agent, index + 1);
              tbody.appendChild(row);
          });
      })
      .catch(error => console.error('Error loading data:', error));
}

// ฟังก์ชันสร้างแถวข้อมูล
function createDataRow(agent, index) {
  const row = document.createElement('tr');
  row.dataset.id = agent.id;
  row.innerHTML = `
      <td>${index}</td>
      <td>${agent.agent_code || ''}</td>
      <td>${agent.ca_number || ''}</td>
      <td>${agent.contract_number || '-'}</td>
      <td>${agent.registered_name || ''}</td>
      <td>${agent.application_type || ''}</td>
      <td>${agent.manager_name || ''}</td>
      <td>${agent.mobile_phone || ''}</td>
      <td>${agent.email || ''}</td>
      <td>${agent.service_center || ''}</td>
      <td>${agent.agent_type || ''}</td>
      <td>${agent.id_number || ''}</td>
      <td>${agent.contract_start || ''}</td>
      <td>${agent.notes || '-'}</td>
      <td><button class="edit-btn btn btn-primary btn-sm">แก้ไข</button></td>
      <td><button class="delete-btn btn btn-danger btn-sm">ลบ</button></td>
  `;

  // เพิ่ม Event Listeners
  row.querySelector('.delete-btn').addEventListener('click', () => {
      deleteRowData(agent.id, row);
  });

  row.querySelector('.edit-btn').addEventListener('click', () => {
      makeRowEditable(row, agent);
  });

  return row;
}

// ฟังก์ชันบันทึกข้อมูล
function saveRowData(row) {
  const formData = {
      agent_code: row.querySelector('[name="agent_code"]').value,
      ca_number: row.querySelector('[name="ca_number"]').value,
      contract_number: row.querySelector('[name="contract_number"]').value,
      registered_name: row.querySelector('[name="registered_name"]').value,
      application_type: row.querySelector('[name="application_type"]').value,
      manager_name: row.querySelector('[name="manager_name"]').value,
      mobile_phone: row.querySelector('[name="mobile_phone"]').value,
      email: row.querySelector('[name="email"]').value,
      service_center: row.querySelector('[name="service_center"]').value,
      agent_type: row.querySelector('[name="agent_type"]').value,
      id_number: row.querySelector('[name="id_number"]').value,
      contract_start: row.querySelector('[name="contract_start"]').value,
      notes: row.querySelector('[name="notes"]').value
  };

  const method = row.dataset.id ? 'PUT' : 'POST';
  const url = row.dataset.id 
      ? `http://localhost:3000/api/agents/${row.dataset.id}`
      : 'http://localhost:3000/api/agents';

  fetch(url, {
      method: method,
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(() => {
      loadTableData(); // โหลดข้อมูลใหม่หลังจากบันทึก
  })
  .catch(error => console.error('Error saving data:', error));
}

// ฟังก์ชันลบข้อมูล
function deleteRowData(id, row) {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) {
      fetch(`http://localhost:3000/api/agents/${id}`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(() => {
          row.remove();
      })
      .catch(error => console.error('Error deleting data:', error));
  }
}

// ฟังก์ชันทำให้แถวสามารถแก้ไขได้
function makeRowEditable(row, data) {
  row.innerHTML = `
      <td>${row.cells[0].textContent}</td>
      <td><input type="text" class="form-control" name="agent_code" value="${data.agent_code || ''}"></td>
      <td><input type="text" class="form-control" name="ca_number" value="${data.ca_number || ''}"></td>
      <td><input type="text" class="form-control" name="contract_number" value="${data.contract_number || ''}"></td>
      <td><input type="text" class="form-control" name="registered_name" value="${data.registered_name || ''}"></td>
      <td>
          <select class="form-select" name="application_type">
              <option value="Mobile" ${data.application_type === 'Mobile' ? 'selected' : ''}>Mobile</option>
              <option value="BB" ${data.application_type === 'BB' ? 'selected' : ''}>BB</option>
          </select>
      </td>
      <td><input type="text" class="form-control" name="manager_name" value="${data.manager_name || ''}"></td>
      <td><input type="text" class="form-control" name="mobile_phone" value="${data.mobile_phone || ''}"></td>
      <td><input type="email" class="form-control" name="email" value="${data.email || ''}"></td>
      <td><input type="text" class="form-control" name="service_center" value="${data.service_center || ''}"></td>
      <td>
          <select class="form-select" name="agent_type">
              <option value="ร้านค้า" ${data.agent_type === 'ร้านค้า' ? 'selected' : ''}>ร้านค้า</option>
              <option value="นิติบุคคล" ${data.agent_type === 'นิติบุคคล' ? 'selected' : ''}>นิติบุคคล</option>
              <option value="บุคคลธรรมดา" ${data.agent_type === 'บุคคลธรรมดา' ? 'selected' : ''}>บุคคลธรรมดา</option>
          </select>
      </td>
      <td><input type="text" class="form-control" name="id_number" value="${data.id_number || ''}"></td>
      <td><input type="date" class="form-control" name="contract_start" value="${data.contract_start || ''}"></td>
      <td><input type="text" class="form-control" name="notes" value="${data.notes || ''}"></td>
      <td><button class="save-btn btn btn-success btn-sm">บันทึก</button></td>
      <td><button class="cancel-btn btn btn-secondary btn-sm">ยกเลิก</button></td>
  `;

  // เพิ่ม Event Listeners
  row.querySelector('.save-btn').addEventListener('click', () => {
      saveRowData(row);
  });

  row.querySelector('.cancel-btn').addEventListener('click', () => {
      loadTableData();
  });
}