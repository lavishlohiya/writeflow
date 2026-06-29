const pool = require("../config/db");

const createPost = async (title, content, authorId) => {
    
    const query = `
        INSERT INTO posts
        (title, content, author_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const values = [title, content, authorId];

    const result = await pool.query(query, values);

    return result.rows[0];

};

const getPosts = async(page, limit, search) => {
    
    const offset = (page - 1) * limit;

    if (!search) {
        const query = `
            SELECT 
                id,
                title,
                content,
                author_id
            FROM posts
            ORDER BY created_at DESC
            LIMIT $1
            OFFSET $2
        `;

        const result = await pool.query(query, [limit, offset]);

        return result.rows;
    } else {
        const query = `
            SELECT 
                id,
                title,
                content,
                author_id
            FROM posts
            WHERE title ILIKE $1
            OR content ILIKE $1
            ORDER BY created_at DESC
            LIMIT $2
            OFFSET $3
        `;

        const searchTerm = `%${search}%`;

        const result = await pool.query(query, [searchTerm, limit, offset]);

        return result.rows;
    }
}

const getPostById = async (id) => {
    
    const query = `
        SELECT 
            title,
            content,
            author_id
        FROM posts
        WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length == 0) {
        return null;
    }

    return result.rows[0];
}

const updatePost = async (postId, content) => {
    const query = `
        UPDATE posts
        SET
            content = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;

    const values = [content, postId];

    const result = await pool.query(query, values);

    if (result.rows.length == 0) {
        return null;
    }

    return result.rows[0];
}

const deletePost = async (postId) => {

    const query = `
        DELETE FROM posts
        WHERE id = $1
        RETURNING *
    `;

    const result = await pool.query(query, [postId]);

    return result.rows[0];
}

const createComment = async (content, postId, userId) => {
    const query = `
        INSERT INTO comments(
            content,
            post_id,
            user_id
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const values = [content, postId, userId];

    const result = await pool.query(query, values);

    return result.rows[0];
}

const getComments = async (postId) => {

    const query = `
        SELECT
            id,
            content,
            user_id,
            created_at
        FROM comments
        WHERE post_id = $1
        ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [postId]);

    return result.rows;
}

const getCommentById = async (commentId) => {
    const query = `
        SELECT
            content,
            user_id
        FROM comments
        WHERE id = $1
    `;

    const result = await pool.query(query, [commentId]);

    return result.rows[0];
}

const updateComment = async (commentId, content) => {
    const query = `
        UPDATE comments
        SET content = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;

    const values = [content, commentId];

    const result = await pool.query(query, values);

    return result.rows[0];
}

const deleteComment = async (commentId) => {
    const query = `
        DELETE 
        FROM comments
        WHERE id = $1
        RETURNING *
    `;

    const result = await pool.query(query, [commentId]);

    return result.rows[0];
}

module.exports = {
    createPost, getPosts, getPostById,
    updatePost, deletePost, createComment,
    getComments, getCommentById, updateComment,
    deleteComment
 };
