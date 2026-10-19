const express = require('express');
const router = express.Router();

// Post

router.get('/',(req,res)=>{
    res.send('Get for Post');
});

router.post('/new',(req,res)=>{
    res.send('Post for Post');
});

router.delete('/:id',(req,res)=>{
    res.send('Delete for Post');
});

router.patch('/:id/edit',(req,res)=>{
    res.send('Patch for Post');
});

module.exports = router;