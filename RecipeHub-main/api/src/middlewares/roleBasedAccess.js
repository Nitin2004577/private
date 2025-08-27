const roleBasedAccess = (role) => {

  return (req, res, next) => {
    
    if (req.user.role.includes(role)) return next();

    res.status(403).send("Access Denied!");
  };
};

export default roleBasedAccess;
