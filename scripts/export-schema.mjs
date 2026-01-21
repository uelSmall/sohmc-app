console.log('❌ Could not fetch via API. Please run these queries manually in Supabase SQL Editor:\n');
console.log('-- Get all tables and columns:');
console.log(`SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;`);
console.log('\n-- Get RLS policies:');
console.log('SELECT schemaname, tablename, policyname, qual, cmd FROM pg_policies;');
console.log('\n-- Get foreign keys:');
console.log(`SELECT 
  kcu1.table_name, kcu1.column_name,
  kcu2.table_name, kcu2.column_name
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu1 ON rc.constraint_name = kcu1.constraint_name
JOIN information_schema.key_column_usage kcu2 ON rc.unique_constraint_name = kcu2.constraint_name;`);
