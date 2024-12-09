import { supabase } from './supabaseClient';

// Fetch all applications
export const fetchApplications = async () => {
  const { data, error } = await supabase.from('applications').select('*');
  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
  return data;
};

// Add a new application
export const addApplication = async (application) => {
  const { data, error } = await supabase.from('applications').insert([application]);
  if (error) {
    console.error('Error adding application:', error);
    return null;
  }
  return data;
};

// Update an application
export const updateApplication = async (id, updates) => {
  const { data, error } = await supabase.from('applications').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating application:', error);
    return null;
  }
  return data;
};

// Delete an application
export const deleteApplication = async (id) => {
  const { data, error } = await supabase.from('applications').delete().eq('id', id);
  if (error) {
    console.error('Error deleting application:', error);
    return null;
  }
  return data;
};