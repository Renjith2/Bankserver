


const router = require('express').Router();
const User = require('../Schema/userSchema/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authmiddleware = require('../middlewares/authmiddleware');

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
            data:token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.post('/login', async (req, res) => {
    const { userName, password, mobileNumber, otp } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if mobile number matches
        if (user.mobileNumber !== mobileNumber) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate OTP (assuming you have a predefined OTP stored somewhere)
        const storedOTP = '123456'; // Example stored OTP, replace with actual logic to retrieve OTP
        if (otp !== storedOTP) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
           data:token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-current-user',authmiddleware, async(req,res)=>{
    try {
        const user= await User.findById(req.body.userid).select('-password')
        res.send({
            success:true,
            messgae:"User Details Fetched Successfully",
            data:user
        })
    } catch (error) {
        res.send({
           success:false,
           message:error.message
        })
    }

})


module.exports = router;
