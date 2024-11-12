const express = require('express');
const app = express();
const clientRoutes = require('../routes/clientRoute');
const appointmentRoutes = require('../routes/appointmentRoute');
const serviceRoutes = require('../routes/serviceRoute');
const appointmentSlotRoutes = require('../routes/appointmentSlotRoute');
const adminRoutes = require('../routes/adminRoute')
require('dotenv').config();

const webhookRouter = require('../controllers/stripeWebhook');

app.use('/', webhookRouter);
app.use('/clients', clientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);
app.use('/appointmentSlot', appointmentSlotRoutes);
app.use('/adminRoutes', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
