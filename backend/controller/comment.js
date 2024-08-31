import Comment from "../models/comment";

export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user._id; // Assuming you have user authentication middleware

    // Validate input
    if (!content || !postId) {
      return res
        .status(400)
        .json({ message: "Content and postId are required" });
    }

    // Create the comment
    const comment = new Comment({
      content,
      author: userId,
      post: postId,
    });

    // Save the comment
    await comment.save();

    // Update the post to include the new comment
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
