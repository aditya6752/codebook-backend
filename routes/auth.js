//all auth related woek will be done here
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");//bcypt is used for password enctyption
//regsitser
router.post("/register", async function (req, res) {
//bcrypt is used for password encryption
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        console.log(req.body);
        //user model has got its value for its respective field, 
        const user = await new User({
            name: req.body.name,
            email: req.body.email,
            password:hashedPassword ,
            mobile: req.body.mobile,
        });
        //message passed for suuccseefull user registration

        await user.save();
        return res.status(200).send("User registered");
    }
    catch (err) {
        return res.status(500).json(err);
    };
});


//login user
router.post('/login',async function(req,res){
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).send("user not found");

        const validPasss = await bcrypt.compare(req.body.password, user.password);
        !validPasss && res.status(400).send("wrong password");

        res.status(200).send(user);
    }catch(err){
        res.status(500).send(err);
    }
});
module.exports = router