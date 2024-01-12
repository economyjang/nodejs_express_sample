import {Post} from "./entity/Post.entity";
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

// TODO Paging 적용하기
export const getPosts = async () => {
    const postRepository = AppDataSource.getRepository(Post);
    return await postRepository.find();
}

export const updatePost = async (body: any) => {
    const postRepository = AppDataSource.getRepository(Post);

    const post = await postRepository.findOne({where: {id: body.postId}});
    if(post) {
        post.subject = body.subject;
        post.content = body.content;

        await postRepository.save(post);
    }
}

export const deletePost = async (body: any) => {
    const postRepository = AppDataSource.getRepository(Post);
    await postRepository.softDelete({id: body.postId});
}
