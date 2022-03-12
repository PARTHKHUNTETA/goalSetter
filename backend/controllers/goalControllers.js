
const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc  Getgoals
// route  GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })

    res.status(200).json(goals)
})


// @desc  Setgoals
// route  POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        user: req.user.id,
        text: req.body.text
    })
    res.status(200).json(goal)
})

// @desc  Update goals
// route  PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal Not Found')
    }



    //check for user
    if (!req.user) {
        res.status(400)
        throw new Error('User not found')
    }


    //make sure loggedin User matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorised')
    }

    const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true
        })
    res.status(200).json(updateGoal)
})

// @desc  Delete goals
// route  DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal Not Found')
    }



    //check for user
    if (!req.user) {
        res.status(400)
        throw new Error('User not found')
    }


    //make sure loggedin User matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorised')
    }
    await goal.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}