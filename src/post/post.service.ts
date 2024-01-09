import {Post} from "./entity/Post";
import {AppDataSource} from "../data-source";

export const createPost = async (body: any) => {
    const post = new Post();
    post.subject = body.subject;
    post.content = body.content;
    post.author = body.author;

    const postRepository = AppDataSource.getRepository(Post);
    await postRepository.save(post);
}

export const getPost = async (postId: any) => {
    const postRepository = AppDataSource.getRepository(Post);
    return await postRepository.findOne({where: {id: postId}});
}