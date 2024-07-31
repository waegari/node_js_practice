import mongoose from "mongoose";

const { Schema } = mongoose;

const PressReleaseSchema = new Schema({
        content: String,
        url: String,
        user: {
            _id: mongoose.Types.ObjectId,
            username: String,
        },
});

const PressRelease = mongoose.model('PressRelease', PressReleaseSchema);
export default PressRelease;