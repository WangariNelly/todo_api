const express = require('express');
const db = require('../db/db.js');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await req.db('users').select('*');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



