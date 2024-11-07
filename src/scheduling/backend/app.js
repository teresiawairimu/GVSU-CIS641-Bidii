const express = require('express');
const app = express();
require('dotenv').config();

const webhookRouter = require('../controllers/stripeWebhook');

app.use('/', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
