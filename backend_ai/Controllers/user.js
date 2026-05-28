const userModel = require('../Models/user');

exports.registerUser = async (req, res) => {
    try {
        const { email, name, photoUrl } = req.body;

        const user = await userModel.findOneAndUpdate(
            { email: email },
            { $set: { name, photoUrl } },
            { upsert: true, returnDocument: 'after' }
        );

        return res.status(200).json({ message: "Welcome", user: user });
    }

    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server Error", message: err.message });
    }
}