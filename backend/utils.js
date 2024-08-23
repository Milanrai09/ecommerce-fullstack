const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY; // Use the secret key from the environment variables
const User = require('./models/userModel');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401)
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Attach the user object to the request
        next(); 

    })

}

const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded.id);
            if (user && user.isAdmin) {
                req.user = user;
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Admins only' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const isSuperAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded.id);
            if (user && user.isSuperAdmin) {
                req.user = user;
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Super Admins only' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};



const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId); // Assuming userId is stored in the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const protect = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
  
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
  
      // If user's admin status has changed, generate a new token
      if (user.isAdmin !== decoded.isAdmin) {
        const newToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );
        res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      }
  
      req.user = { ...decoded, isAdmin: user.isAdmin }; // Update req.user with the latest isAdmin status
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};


// check where to user req has a token or not
const homeMiddleware = (req,res,next) => {


    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            if(decoded){
                next()
            }
        }catch(error){
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }else{
        res.status(401).json({message:'not autorized, no token '})
    }
}


// checks the user role

const roleMiddleware = () => {
    return(req, res, next) => {
        const userRole = req.user.isAdmin;
        if(userRole){
            next();
        }
     return res.status(401).json({message:"you dont have the permission"})

    }
}



module.exports = {
    authenticateToken,
    isAdmin,
    isSuperAdmin,
    authMiddleware,
    homeMiddleware,
    roleMiddleware

};
