require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = 'admin123'; // Change this!

// Auth middleware
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: 'admin-token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get all courses
app.get('/api/courses', checkAuth, async (req, res) => {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Add course
app.post('/api/courses', checkAuth, async (req, res) => {
  const { title, description, price, file_url } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price required' });
  }

  const { data, error } = await supabase.from('courses').insert({
    title,
    description,
    price: parseInt(price),
    file_url,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Course added', data });
});

// Update course
app.put('/api/courses/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, file_url } = req.body;

  const { data, error } = await supabase
    .from('courses')
    .update({ title, description, price: parseInt(price), file_url })
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Course updated', data });
});

// Delete course
app.delete('/api/courses/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('courses').delete().eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Course deleted' });
});

// Get all purchases
app.get('/api/purchases', checkAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*, courses(*), users(*)');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Mark payment as completed
app.put('/api/purchases/:id/complete', checkAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('purchases')
    .update({ payment_status: 'completed' })
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Payment completed', data });
});

// Get all users
app.get('/api/users', checkAuth, async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get analytics
app.get('/api/analytics', checkAuth, async (req, res) => {
  const { data: totalRevenue } = await supabase
    .from('purchases')
    .select('amount')
    .eq('payment_status', 'completed');

  const { data: totalUsers } = await supabase.from('users').select('id');

  const { data: totalCourses } = await supabase.from('courses').select('id');

  const { data: totalSales } = await supabase
    .from('purchases')
    .select('id')
    .eq('payment_status', 'completed');

  const revenue = totalRevenue?.reduce((sum, p) => sum + p.amount, 0) || 0;

  res.json({
    totalRevenue: revenue,
    totalUsers: totalUsers?.length || 0,
    totalCourses: totalCourses?.length || 0,
    totalSales: totalSales?.length || 0,
  });
});

app.listen(3001, () => {
  console.log('📊 Admin API ishlayapti: http://localhost:3001');
});
