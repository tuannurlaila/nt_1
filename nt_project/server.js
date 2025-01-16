const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static paths
app.use(express.static(path.join(__dirname)));
app.use('/NT_1', express.static('D:/NT_1'));

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nt_database'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// API endpoints

// Get dashboard cards
app.get('/api/dashboard/cards', (req, res) => {
  const query = 'SELECT * FROM dashboard_cards ORDER BY created_at ASC LIMIT 10';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cards:', err);
      res.status(500).json({ error: 'Error fetching cards' });
      return;
    }
    res.json(results);
  });
});

// Add new dashboard card
app.post('/api/dashboard/cards', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  connection.query('SELECT COUNT(*) as count FROM dashboard_cards', (err, results) => {
    if (err) {
      console.error('Error counting cards:', err);
      res.status(500).json({ error: 'Error counting cards' });
      return;
    }

    const currentCount = results[0].count;
    if (currentCount >= 10) {
      res.status(400).json({ error: 'Maximum number of cards reached' });
      return;
    }

    const pageNumber = currentCount + 1;
    const link = `/NT_1/page${pageNumber}.html`;
    const icon_path = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXYSo5MAEOpn3iYW6wohqzWnsOG2KoAJcNnA&s';

    const query = 'INSERT INTO dashboard_cards (title, description, link, icon_path) VALUES (?, ?, ?, ?)';
    connection.query(query, [title, description, link, icon_path], (err, result) => {
      if (err) {
        console.error('Error inserting card:', err);
        res.status(500).json({ error: 'Error adding card' });
        return;
      }

      res.status(201).json({ message: 'Card added successfully', id: result.insertId });
    });
  });
});

// Serve individual pages
app.get('/NT_1/page:number.html', (req, res) => {
  const pageNumber = req.params.number;
  const filePath = path.join('D:/NT_1', `page${pageNumber}.html`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file page${pageNumber}.html:`, err);
      res.status(404).send(`Page ${pageNumber} not found`);
    }
  });
});

// Agents management

// Get all agents
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

// Add new agent
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

// Update agent
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

// Delete agent
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

// Search agents
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

// Error handling middleware
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
