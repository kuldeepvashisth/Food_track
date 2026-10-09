import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: coordinates => coordinates.length === 2,
            message: 'Location must contain longitude and latitude'
        }
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    mobile: {
        type: String,
        required: false,
        default: null,
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliveryBoy"],
        required: true,
    },
    resetotp: {
        type: String,
        default: null,
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    resetotpExpiry: {
        type: Date,
        default: null,
    },
    location: { type: locationSchema, default: undefined }

}, { timestamps: true })

userSchema.index({location:'2dsphere'})
export default mongoose.model('User', userSchema);
/*
User :-Model Name
userSchema:-create above model using this schema
,{timestamps:true} --> it keeps record when user created and updated time in db
*/