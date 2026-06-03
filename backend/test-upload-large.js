async function testUpload() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testlecturer@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    const formData = new FormData();
    const largeArray = new Uint8Array(60 * 1024 * 1024); // 60MB
    const blob = new Blob([largeArray], { type: 'application/octet-stream' });
    formData.append('file', blob, 'large.bin');

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Body:', text);

  } catch (err) {
    console.error('Network err:', err);
  }
}
testUpload();
