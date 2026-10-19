const express = require('express');
const router = express.Router();

// User

router.get('/',(req,res)=>{
    res.send('Get for User');
});

router.post('/new',(req,res)=>{
    res.send('Post for User');
});

router.delete('/:id',(req,res)=>{
    res.send('Delete for User');
});

router.patch('/:id/edit',(req,res)=>{
    res.send('Patch for User');
});

module.exports = router;