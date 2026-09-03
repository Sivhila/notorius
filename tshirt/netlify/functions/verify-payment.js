export async function handler(event, context) {
	const { reference } = JSON.parse(event.body);

	try {
		// Call MoneyUnify's Verify Payment endpoint
		const response = await fetch('https://moneyunify.one/api/v1/payment/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
		                'Authorization': `Bearer ${process.env.MONEYUNIFY_AUTH_KEY}`
			},
			body: JSON.stringify({ reference: reference })
		});

		const data = await response.json();

		//Check if status is SCCESSFUL or COMPLETED
		if (data.status == 'SUCCESSFUL' || data.status === 'COMPLETED') {
			return {
				statusCode: 200,
				body: JSON.stringify({
					status: 'SUCCESS'
					// Deliver access token, download link, or confirmation playload here
					downloadUrl: 'https://twokidsdesign.com/protected-downloads/design-file.zip'
				})
			});
		} else {
			return {
				statusCode: 200,
				body: JSON.stringify({ status: data.status || 'PENDING' })
			};
		}
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message })
		};
	}
}
