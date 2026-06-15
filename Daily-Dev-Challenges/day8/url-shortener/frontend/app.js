// frontend/app.js
document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const urlInput = document.getElementById('long-url');
  const longUrl = urlInput.value.trim();
  if (!longUrl) return;

  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl })
    });
    const data = await res.json();
    const resultDiv = document.getElementById('result');
    if (res.ok) {
      resultDiv.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
      resultDiv.textContent = data.error || 'Error creating short link';
    }
  } catch (err) {
    console.error(err);
  }
});
