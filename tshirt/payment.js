let pollInterval;

document.getElementById('momo-payment-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const phone = document.getElementById('momo-number').value;
	const amount = document.getElementById('amount').value;
	const messageDiv = document.getElementById('message');

	messageDiv.innerText = "Sending prompt to your phone...";

	// 1. Initiate Request via your secure API function
	const res = await fetch('/api/request-payment', {
		method: 'POST'
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone, amount })
	});

	const data = await res.json()

	if (data.success && data.reference) {
		messageDiv.innerText = "Prompt sent! Enter your Mobile Money PIN on your phone to complete...";

		//2. Start polling for payment status every 5 seconds
		pollInterval = setInterval(() => {
			checkStatus(data.reference);
		}, 5000);

	} else {
		messageDiv.innerText = "Failed to initiate payment. Please try again.";
	}
});

async function checkStatus(reference) {
	const messageDiv = document.getElementById('message');

	const res = await fetch('/api/verify-payment', {
		method: 'POST'
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ reference })
	});

	const data = await res.json();

	if (data.status === 'SUCCESS') {
		clearInterval(pollInterval); // Stop polling
		messageDiv.style.color = "green";
		messageDiv.innerText = "Payment verified! Redirecting to your content...";

		//Grant access or redirect
		setTimeout(() => {
			window.location.href = data.downloadUrl;
		}, 2000);
	} else if (data.status === 'FAILED') {
		clearInterval(pollInterval);
		messageDiv.style.color = "red";
		messageDiv.innerText = "Payment failed or was concelled. Please try again.";
	}
}
