const express = require('express');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await req.db('users').select('*');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
