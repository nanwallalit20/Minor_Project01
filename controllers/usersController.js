const User=require('../modals/signup');
const Post=require('../modals/postSchema');
const Comment=require('../modals/comment')
const { Cookie } = require('express-session');
const fs=require('fs');
const path =require('path')


module.exports.profile= async function(req,res){
  try{ 
  let id=req.params.id;
    console.log('welcome to profile');
    let user= await User.findById(id);
   console.log(user);
          res.render('userProfile',{
        title:'User Profile',
        userData : user      
      })
    } 
    catch(err)
    {
      if(err)
      {
        console.log('error in rendering profile',err);
      }
    } 
  
}

module.exports.update= async function(req,res){
  try{
    
    if(req.params.id==req.user.id)
    {

    //  let user= await User.findByIdAndUpdate(id,req.body);
    //   console.log('updated successfully')
    //   return res.redirect('back')
          let user=await User.findById(req.params.id);
          User.uploadAvtar(req,res,function(err){
            if(err){
              console.log("Error uploading file");
            }
            user.name=req.body.name,
            user.email = req.body.email;
            if(req.file){

              if(user.avatar){
                fs.unlinkSync(path.join(__dirname+'/..'+user.avatar))
              }  

              user.avatar=User.avtarPath+'/'+req.file.filename; 
            }
           
            console.log(user)
            user.save();
            return res.redirect('back');
            
          })
      
    }
    else{
      return res.status(403,'unauthorised access');
    }  
  }
  catch(err)
  {
    if(err)
    {
      console.log('error in updating profile',err);
    }
  }  
}
      
 

module.exports.create= async function(req,res){
  try{
    if(req.body.password != req.body.confirm_password)
    {
        res.redirect('back');
    }
   let existingUser=await User.findOne({ email: req.body.email })
      if (!existingUser) {
        let newUser=await User.create(req.body);
        console.log('User created successfully',newUser);
        return res.redirect('/sign-In');
      } 
      else {
        return Promise.reject('User already exists');
      }
    }
     catch(err)
      {
        if(err)
        {
          console.log('error in updating profile',err);
        }
      }  
}
module.exports.session=async function(req,res){
  req.flash('success','you have logged in ');
    return res.redirect('/');
}

module.exports.destroySession=async function(req,res){
  req.logout(function(err){
    if(err){
       console.log('error facing while signout the page');
    }
    req.flash('success','You have logged out successfully');
    console.log('signed out successfully');
    return res.redirect('/sign-In');
   
  });
  
}

module.exports.details=function(req,res){
  let id=req.params.id;
  User.findById(id).
  then(user=>{
    if(req.xhr){
      return res.status(200).json({
        data:{
          user:user
        },
        message:"user fetched !!"
      })
    }
  })
}

