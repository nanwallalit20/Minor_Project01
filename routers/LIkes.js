const express=require('express');
const passport=require('passport');


const router=express.Router();

const LikesController=require('../controllers/likes_Controller')

router.post('/toggle',LikesController.toggle);


module.exports=router;