import mongoose from "mongoose";

const { Schema } = mongoose;

const ArticleSchema = new Schema({
    title: String,
    subtitle: String,
    content: String,
    url: String,
});

const Article = mongoose.model('Article', ArticleSchema);
export default Article;