import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const reviewsWithUserName = reviews.map(review => ({
      ...review,
      userName: review.user.name
    }));

    res.json({ success: true, data: reviewsWithUserName });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login to add a review" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: parseInt(productId),
          userId
        }
      }
    });

    if (existingReview) {
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment },
        include: {
          user: { select: { name: true } }
        }
      });
      return res.json({
        success: true,
        message: "Review updated successfully",
        data: { ...updatedReview, userName: updatedReview.user.name }
      });
    }

    const review = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userId,
        rating,
        comment
      },
      include: {
        user: { select: { name: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: { ...review, userName: review.user.name }
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Error adding review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) }
    });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.userId !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: "You can only delete your own reviews" });
    }

    await prisma.review.delete({
      where: { id: parseInt(reviewId) }
    });

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review" });
  }
};
