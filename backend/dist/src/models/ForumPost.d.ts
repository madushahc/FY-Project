import mongoose, { Document } from "mongoose";
export interface IForumReply {
    _id?: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    likes: number;
    likedBy?: mongoose.Types.ObjectId[];
}
export interface IForumPost extends Document {
    course: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    likes: number;
    likedBy?: mongoose.Types.ObjectId[];
    replies: IForumReply[];
    isPinned: boolean;
}
declare const _default: mongoose.Model<IForumPost, {}, {}, {}, mongoose.Document<unknown, {}, IForumPost, {}, mongoose.DefaultSchemaOptions> & IForumPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IForumPost>;
export default _default;
//# sourceMappingURL=ForumPost.d.ts.map