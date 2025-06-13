const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User'); // To validate users
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/teams
// @desc    Create a new team
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const adminId = req.user.id;

  if (!name) {
    return res.status(400).json({ msg: 'Team name is required' });
  }

  try {
    let team = await Team.findOne({ name });
    if (team) {
      return res.status(400).json({ msg: 'Team name already exists' });
    }

    const newTeam = new Team({
      name,
      description,
      admin: adminId,
      members: [adminId], // Admin is automatically a member
    });

    team = await newTeam.save();
    await team.populate('admin', 'name email username');
    await team.populate('members', 'name email username');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teams
// @desc    Get all teams the current user is a member of
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.id })
      .populate('admin', 'name email username')
      .populate('members', 'name email username')
      .sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teams/:teamId
// @desc    Get a specific team's details
// @access  Private (user must be a member to view)
router.get('/:teamId', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.teamId, members: req.user.id })
      .populate('admin', 'name email username')
      .populate('members', 'name email username');

    if (!team) {
      return res.status(404).json({ msg: 'Team not found or you are not a member' });
    }
    res.json(team);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/teams/:teamId
// @desc    Update team details (name, description)
// @access  Private (only admin)
router.put('/:teamId', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const teamId = req.params.teamId;
  const userId = req.user.id;

  try {
    let team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    if (team.admin.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to update this team' });
    }

    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ name });
      if (existingTeam && existingTeam._id.toString() !== teamId) {
        return res.status(400).json({ msg: 'Team name already exists' });
      }
      team.name = name;
    }
    if (description !== undefined) {
      team.description = description;
    }

    await team.save();
    await team.populate('admin', 'name email username');
    await team.populate('members', 'name email username');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/teams/:teamId/members
// @desc    Add a member to the team
// @access  Private (only admin)
router.post('/:teamId/members', authMiddleware, async (req, res) => {
  const { userIdToAdd } = req.body; // Expecting the ID of the user to add
  const teamId = req.params.teamId;
  const adminId = req.user.id;

  if (!userIdToAdd) {
    return res.status(400).json({ msg: 'User ID to add is required' });
  }

  try {
    let team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    if (team.admin.toString() !== adminId) {
      return res.status(401).json({ msg: 'Not authorized to add members to this team' });
    }

    const userToAdd = await User.findById(userIdToAdd);
    if (!userToAdd) {
      return res.status(404).json({ msg: 'User to add not found' });
    }

    if (team.members.includes(userIdToAdd)) {
      return res.status(400).json({ msg: 'User is already a member of this team' });
    }

    team.members.push(userIdToAdd);
    await team.save();
    await team.populate('admin', 'name email username');
    await team.populate('members', 'name email username');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/teams/:teamId/members/:memberId
// @desc    Remove a member from the team (or user leaves team)
// @access  Private (admin can remove anyone, member can remove themselves)
router.delete('/:teamId/members/:memberIdToRemove', authMiddleware, async (req, res) => {
  const { teamId, memberIdToRemove } = req.params;
  const currentUserId = req.user.id;

  try {
    let team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    const memberIndex = team.members.findIndex(member => member.toString() === memberIdToRemove);
    if (memberIndex === -1) {
      return res.status(404).json({ msg: 'Member not found in this team' });
    }

    // Admin can remove anyone (except themselves if they are the last member, handled below)
    // Member can remove themselves
    if (team.admin.toString() !== currentUserId && currentUserId !== memberIdToRemove) {
      return res.status(401).json({ msg: 'Not authorized to remove this member' });
    }
    
    // Prevent admin from removing themselves if they are the only member left
    if (team.admin.toString() === memberIdToRemove && team.members.length === 1) {
        return res.status(400).json({ msg: 'Admin cannot leave the team if they are the only member. Delete the team instead or transfer admin rights.' });
    }

    // If admin is removing themselves, and there are other members, a new admin should be assigned or team deleted.
    // For simplicity, this example doesn't handle admin transfer. Admin should delete team or assign new admin manually.
    if (team.admin.toString() === memberIdToRemove && team.members.length > 1) {
        return res.status(400).json({ msg: 'Admin cannot leave the team. Please transfer admin rights or delete the team.' });
    }


    team.members.splice(memberIndex, 1);
    
    // If no members left, consider deleting the team or specific logic
    if (team.members.length === 0) {
        await Team.findByIdAndDelete(teamId);
        return res.json({ msg: 'Member removed and team deleted as it has no members left.' });
    }

    await team.save();
    await team.populate('admin', 'name email username');
    await team.populate('members', 'name email username');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/teams/:teamId
// @desc    Delete a team
// @access  Private (only admin)
router.delete('/:teamId', authMiddleware, async (req, res) => {
  const teamId = req.params.teamId;
  const userId = req.user.id;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    if (team.admin.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to delete this team' });
    }

    await Team.findByIdAndDelete(teamId); // Using findByIdAndDelete
    res.json({ msg: 'Team deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;