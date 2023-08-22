const express=require('express');
const passport=require('passport');


const router=express.Router();

const friendController=require('../controllers/FriendshipController')

router.post('/follow',friendController.friend);
router.get('/search',friendController.search)


module.exports=router;