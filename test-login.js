async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tanim@mail.com',
        password: 'password123'
      })
    });

    const result = await response.json();
    console.log('🔐 Login test result:', {
      status: response.status,
      success: response.ok,
      data: result
    });
  } catch (error) {
    console.error('❌ Login test error:', error);
  }
}

testLogin();
