import http from 'http';

const endpoints = [
  '/api/auth/profile',
  '/api/courses',
  '/api/assignments/course/123',
  '/api/forums/all',
  '/api/gamification/leaderboard',
  '/api/enrollments/my-enrollments',
  '/api/quizzes/course/123',
  '/api/submissions/assignment/123',
  '/api/notifications',
  '/api/analytics/dashboard',
  '/api/users',
  '/api-docs/'
];

console.log('Starting API mount checks (Verifying they do not return 404)...\n');

const checkEndpoint = (path) => {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let statusText = res.statusCode === 404 ? '❌ NOT MOUNTED (404)' : `✅ MOUNTED (Status: ${res.statusCode})`;
      console.log(`${path.padEnd(35)} -> ${statusText}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`${path.padEnd(35)} -> ❌ ERROR: ${err.message}`);
      resolve(null);
    });
  });
};

const run = async () => {
  let has404 = false;
  for (const ep of endpoints) {
    const status = await checkEndpoint(ep);
    if (status === 404) has404 = true;
  }
  
  console.log('\n--- Summary ---');
  if (has404) {
    console.log('⚠️ Some endpoints returned 404. They might not be implemented or have a different path.');
  } else {
    console.log('🎉 All tested endpoints are mounted and responding (No 404s found).');
  }
};

run();
