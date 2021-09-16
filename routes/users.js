//all user related woek will be done here
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
//update user with
router.put("/:id", async function (req, res) {
  // console.log(req.body);
  // console.log(req.params);
  // return return res.send("fuck you am");
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        //PASSWORD IS UPDATED ACCORDINGLY
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).send(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send("Account has been updated");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send("You can only update your account");
  }

});

router.delete("/:id", async function (req, res) {
  // console.log(req.body);
  // console.log(req.params);
  // console.log("Hitting delete post");
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndRemove(req.params.id);
      return res.status(200).send("Account deleted successfully");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send("You can delete your account only");
  }
});
//get a user
router.get("/", async function (req, res) {
  console.log(req.query);
  const userId = req.query.userId;
  const name = req.query.name;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ name: name });
    const { password, updateAt, ...other } = user._doc;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
})


//follow a user 
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("user has been followed");
      } else {
        return res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you cant follow yourself");
  }
});


//unfoloow a user 
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      return res.status(200).json("user has been unfollowed");

    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you cant follow yourself");
  }
});

// friends of user
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, name, profilePicture } = friend;
      friendList.push({ _id, name, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/AllUser", function (req, res) {
  try {
    User.find({}, (err, user) => {
      return res.status(200).send(user);
    });
  } catch (err) {
     return res.status(500).json(err);
  }
});

module.exports = router