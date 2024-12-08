const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const serviceRoutes = require('./routes/serviceRoute');
const appointmentSlotRoutes = require('./routes/appointmentSlotRoute');
const providerRoutes = require('./routes/providerRoute');
require('dotenv').config();

const webhookRouter = require('./controllers/stripeWebhook');




app.use(express.json());



const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT' , 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials : true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use('/webhook', webhookRouter);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointmentSlots', appointmentSlotRoutes);
app.use('/api/providers', providerRoutes);





const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;