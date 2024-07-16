


const router = require('express').Router();
const User = require('../Schema/userSchema/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const {
        firstName,
        surName,
        userName,
        password,
        mobileNumber,
        email,
        tempAddress,
        permanentAddress,
        panDetails,
        aadhaarDetails
    } = req.body;

    try {
        // Check for duplicate entries
        const duplicateChecks = [
            { field: 'userName', value: userName },
            { field: 'panDetails', value: panDetails },
            { field: 'aadhaarDetails', value: aadhaarDetails },
            { field: 'email', value: email },
            { field: 'mobileNumber', value: mobileNumber }
        ];

        const duplicateFields = await Promise.all(duplicateChecks.map(async check => {
            const query = {};
            query[check.field] = check.value;
            const existingUser = await User.findOne(query);
            return existingUser ? check.field : null;
        }));

        const existingFields = duplicateFields.filter(field => field !== null);

        if (existingFields.length >= 2) {
            return res.status(400).json({ error: 'User already exists' });
        } else if (existingFields.length > 0) {
            const errorMsg = existingFields.map(field => {
                if (field === 'userName') return 'Username already exists';
                if (field === 'panDetails') return 'PAN details already exist';
                if (field === 'aadhaarDetails') return 'Aadhaar details already exist';
                if (field === 'email') return 'Email already exists';
                if (field === 'mobileNumber') return 'Mobile number already exists';
                return '';
            }).join(', ');
            return res.status(400).json({ error: errorMsg });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            firstName,
            surName,
            userName,
            password: hashedPassword,
            mobileNumber,
            email,
            tempAddress,
            permanentAddress,
            panDetails,
            aadhaarDetails
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
