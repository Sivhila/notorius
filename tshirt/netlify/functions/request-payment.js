// Example for Netlify / Vercel Serverless Function
export async function handler(event, context) {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
	}

	const { phone, amount } = JSON.parse(event.body);

	try {
		const response = await fetch('https://moneyunify.one/api/v1/payment/request', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.MONEYUNIFY_AUTH_KEY}` // Securely loaded from environment variables
			},
			body: JSON.stringify({
				from_payer: phone,
				amount: amount,
				currency: 'ZMW'
			})
		});

		const data = await response.json();

		// Return the MoneyUnify reference key/number to the frontend
		return {
			statusCode: 200,
	                body: JSON.stringify({
				success: true,
				reference: data.reference || data.transaction_id
			})
		};
	}catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message })
		};
	}
}
