async function testApi() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/products/');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}
testApi();
