import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema=new mongoose.Schema({
    title:{
        'type':String,
        'required':true,
        'index':true
    },
    thumbnailUrl:{
        'type':String,
        'required':true
    },
    videoUrl:{
        'type':String,
        'required':true,
        'unique':true
    },
    description:{
        'type':String,
        'required':true
    },
    duration:{//from cloudinary we will get the duration in seconds, so we will store it in seconds
        type:Number,
        required:true
    },
    uploadedBy:{
        'type':mongoose.Schema.Types.ObjectId,
        'ref':'User',
        'required':true
    },
    isPublic:{
        'type':Boolean,
        'required':true,
        'default':false
    },
    views:{
        'type':Number,
        'required':true,
        'default':0
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);

const Video=mongoose.model('Video',videoSchema);