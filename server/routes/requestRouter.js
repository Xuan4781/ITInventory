import express from 'express';
import { Request } from '../models/requestModel.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';
import {updateRequestStatus} from "../controllers/requestController.js"
const router = express.Router();

/**
 * @route   POST /api/requests
 * @desc    Create a new peripheral request (User only)
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { category, notes } = req.body;

    const validCategories = ['Headset', 'Mouse', 'Keyboard', 'Charger'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing category' });
    }

    const user = req.user;
    if (!user || !user._id || !user.email) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const newRequest = new Request({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      category,
      notes: notes || '',
      status: 'Pending',
    });

    await newRequest.save();

    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

/**
 * @route   GET /api/requests/my
 * @desc    Get all requests of current user (User only)
 */
router.get('/my', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const requests = await Request.find({ 'user.id': user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

/**
 * @route   GET /api/requests
 * @desc    Get all requests (Admin only)
 */
router.get('/', isAuthenticated, isAuthorized('Admin'), async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

/**
 * @route   PUT /api/requests/:id
 * @desc    Update request status (Admin only)
 */
router.put('/:id', isAuthenticated, isAuthorized('Admin'), updateRequestStatus);


export default router;
