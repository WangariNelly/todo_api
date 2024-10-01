import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import app from './app.js';

app.listen(process.env.PORT, () => {
	console.log(
		`Server running on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
	);
});