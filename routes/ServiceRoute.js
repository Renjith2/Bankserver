// serviceRoutes.js
const router = require('express').Router();
const Service = require('../Schema/serviceSchema/serviceSchema');
const authmiddleware = require('../middlewares/authmiddleware');

router.post('/register', authmiddleware, async (req, res) => {
  try {
    const { serviceName, serviceId, requestType } = req.body;

    // Create a new service instance
    const newService = new Service({
      serviceName,
      serviceId,
      requestType
    });

    // Save the service to the database
    await newService.save();

    res.status(201).json({ success: true, message: 'Service registered successfully', data: newService });
  } catch (error) {
    console.error('Error registering service:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
