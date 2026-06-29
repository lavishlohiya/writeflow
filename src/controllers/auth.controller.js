const authService = require("../services/auth.service");

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        
        const user = await authService.registerUser(username, email, password);

        delete user.password;

        res.status(201).json(user);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        });
    }

};

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const token = await authService.loginUser(email, password);
        const isProd = process.env.NODE_ENV === "production";


        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: isProd,
          maxAge: 24 * 60 * 60 * 1000,
        }); 


        return res.status(200).json({
            message: "Login successfully"
        })

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
};

async function logout(req, res) {
    try {
        const isProd = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
        });

        return res.status(200).json({
            message: "Logout successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        });
    }
}

async function me(req, res) {
    try {
        const user = await authService.getCurrentUser(req.user.id);

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        });
    }
}

module.exports = { register, login, logout, me };
