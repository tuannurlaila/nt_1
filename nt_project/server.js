const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const path = require('path'); // เพิ่มบรรทัดนี้

// เพิ่มการตั้งค่า static files ให้ถูกต้อง
app.use(express.static(path.join(__dirname)));
app.use('/pages', express.static(path.join(__dirname, 'NT_1'))); // ชี้ไปที่โฟลเดอร์ NT_1

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// สร้างการเชื่อมต่อ MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nt_database'
});

// เชื่อมต่อกับฐานข้อมูล
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to database:', err);
      return;
  }
  console.log('Connected to MySQL database!');
});

// เพิ่ม endpoints สำหรับ dashboard cards
app.get('/api/dashboard/cards', (req, res) => {
  const query = 'SELECT * FROM dashboard_cards';
  connection.query(query, (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Error fetching cards' });
          return;
      }
      res.json(results);
  });
});

// เพิ่ม route สำหรับจัดการหน้า HTML
app.get('/NT_1/*', (req, res) => {
  // ดึงชื่อไฟล์จาก URL
  const fileName = req.params[0];
  // สร้างเส้นทางเต็มไปยังไฟล์
  const filePath = path.join(__dirname, 'NT_1', fileName);
  
  // ส่งไฟล์กลับไป
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(404).send('File not found');
      }
  });
});

app.post('/api/dashboard/cards', (req, res) => {
  console.log('Data received:', req.body);

  const { title, description, link, icon_path } = req.body;

  // ตรวจสอบว่าข้อมูลครบถ้วน
  if (!title || !description || !link) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
  }

  const query = 'INSERT INTO dashboard_cards (title, description, link, icon_path) VALUES (?, ?, ?, ?)';
  console.log('Executing query:', query);
  console.log('With values:', [title, description, link, icon_path]);

  connection.query(query, [title, description, link, icon_path], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Error adding card' });
          return;
      }
      console.log('Insert result:', result);
      res.status(201).json({ message: 'Card added successfully', id: result.insertId });
  });
});

// GET - ดึงข้อมูลตัวแทนทั้งหมด
app.get('/api/agents', (req, res) => {
  const query = 'SELECT * FROM agents';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching agents:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});

// POST - เพิ่มข้อมูลตัวแทนใหม่
app.post('/api/agents', (req, res) => {
  const {
    agent_code,
    ca_number,
    contract_number,
    registered_name,
    application_type,
    manager_name,
    mobile_phone,
    email,
    service_center,
    agent_type,
    id_number,
    contract_start,
    notes
  } = req.body;

  const query = `
    INSERT INTO agents (
      agent_code, ca_number, contract_number, registered_name,
      application_type, manager_name, mobile_phone, email,
      service_center, agent_type, id_number, contract_start, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    agent_code, ca_number, contract_number, registered_name,
    application_type, manager_name, mobile_phone, email,
    service_center, agent_type, id_number, contract_start, notes
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding agent:', err);
      res.status(500).json({ error: 'Error adding data' });
      return;
    }
    res.status(201).json({ message: 'Agent added successfully', id: result.insertId });
  });
});

// PUT - อัพเดตข้อมูลตัวแทน
app.put('/api/agents/:id', (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  
  const query = 'UPDATE agents SET ? WHERE id = ?';
  connection.query(query, [updateData, id], (err, result) => {
    if (err) {
      console.error('Error updating agent:', err);
      res.status(500).json({ error: 'Error updating data' });
      return;
    }
    res.json({ message: 'Agent updated successfully' });
  });
});

// DELETE - ลบข้อมูลตัวแทน
app.delete('/api/agents/:id', (req, res) => {
  const id = req.params.id;
  
  const query = 'DELETE FROM agents WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting agent:', err);
      res.status(500).json({ error: 'Error deleting data' });
      return;
    }
    res.json({ message: 'Agent deleted successfully' });
  });
});

// ค้นหาตัวแทน
app.get('/api/agents/search', (req, res) => {
  const searchTerm = req.query.term;
  const query = `
    SELECT * FROM agents 
    WHERE manager_name LIKE ? 
    OR agent_code LIKE ? 
    OR ca_number LIKE ?
  `;
  const searchValue = `%${searchTerm}%`;
  
  connection.query(query, [searchValue, searchValue, searchValue], (err, results) => {
    if (err) {
      console.error('Error searching agents:', err);
      res.status(500).json({ error: 'Error searching data' });
      return;
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});