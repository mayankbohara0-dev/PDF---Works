const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
SUPABASE_URL=https://gqdjobcdoacablitfieh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZGpvYmNkb2FjYWJsaXRmaWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTE2NjksImV4cCI6MjA4NTg2NzY2OX0.dZ4oCi-TOF9S9Zsa2FXgfeV3xIyZTBvqHB0n2j1lu1I
`;

const filePath = path.join(__dirname, 'server', '.env');

try {
    fs.writeFileSync(filePath, envContent, { encoding: 'utf8', flag: 'w' });
    console.log('Successfully wrote .env file to:', filePath);

    // Verify
    const readBack = fs.readFileSync(filePath, 'utf8');
    console.log('Read back first line:', readBack.split('\n')[0]);
} catch (err) {
    console.error('Error writing .env:', err);
}
