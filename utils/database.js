const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

async function getCourseById(id) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
}

async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*');

  return { data, error };
}

async function getUserPurchases(userId) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*, courses(*)')
    .eq('user_id', userId)
    .eq('payment_status', 'completed');

  return { data, error };
}

async function checkUserExists(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  return { data, error };
}

async function createOrUpdateUser(userId, userData) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      ...userData
    });

  return { data, error };
}

async function createPurchase(userId, courseId, price) {
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const { data, error } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      course_id: courseId,
      payment_status: 'pending',
      transaction_id: transactionId,
      amount: price,
    });

  return { data, error, transactionId };
}

async function getPurchaseByTransactionId(transactionId) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*, courses(*), users(*)')
    .eq('transaction_id', transactionId)
    .maybeSingle();

  return { data, error };
}

async function completePurchase(transactionId) {
  const { data, error } = await supabase
    .from('purchases')
    .update({ payment_status: 'completed' })
    .eq('transaction_id', transactionId);

  return { data, error };
}

module.exports = {
  getCourseById,
  getAllCourses,
  getUserPurchases,
  checkUserExists,
  createOrUpdateUser,
  createPurchase,
  getPurchaseByTransactionId,
  completePurchase,
};
