import { ReviewModel } from "../db/index";
import { ShelterModel } from "../db/index";

class ReviewService {
  // 후기 추가

  static async addReview({ description, rating, nickname, user_id, shelter_id, name }) {
    /* 기존에 후기가 등록되어 있을 경우 오류 메시지 리턴
           한 쉼터에 여러개의 후기가 등록 가능할 경우 삭제*/

    const reviewData = await ReviewModel.findByUserIdShelterId(user_id, shelter_id);
    if (reviewData) {
      const errorMessage = "이미 후기가 등록된 쉼터입니다.";
      return { errorMessage };
    }

    const newReview = { description, rating, nickname, user_id, shelter_id, name };

    // db에 후기 저장
    const createdNewReview = await ReviewModel.create(newReview);

    return createdNewReview;
  }

  // 유저가 작성한 후기 가져오기
  static async getReviewByUserId({ user_id }) {
    const reviewData = await ReviewModel.findByUserId(user_id);
    if (reviewData.length === 0) {
      return [];
    }

    const sortedReviews = reviewData.sort((a, b) => b.updatedAt - a.updatedAt);

    // 모든 후기를 배열로 변환
    const reviewDataResult = sortedReviews.map(review => ({
      id: review._id,
      description: review.description,
      rating: review.rating,
      nickname: review.nickname,
      user_id: review.user_id,
      shelter_id: review.shelter_id,
      name: review.name,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    const reviewsConvert = await Promise.all(
      reviewDataResult.map(async review => {
        const { shelter_id } = review;
        const shelter = await ShelterModel.findById(shelter_id);
        return {
          ...review,
          shelter,
        };
      })
    );

    return reviewsConvert;
  }

  // 특정 쉼터의 후기 가져오기
  static async getReviewByShelterId({ shelter_id }) {
    const reviewData = await ReviewModel.findByShelterId(shelter_id);
    if (reviewData.length === 0) {
      return [];
    }

    const sortedReviews = reviewData.sort((a, b) => b.updatedAt - a.updatedAt);

    // 모든 후기를 배열로 변환
    const reviewDataResult = sortedReviews.map(review => ({
      id: review._id,
      description: review.description,
      rating: review.rating,
      nickname: review.nickname,
      user_id: review.user_id,
      shelter_id: review.shelter_id,
      name: review.name,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return reviewDataResult;
  }

  // 후기 수정하기
  static async setReview({ review_id, toUpdate }) {
    let reviewData = await ReviewModel.findById(review_id);

    if (reviewData === 0) {
      const errorMessage = "후기가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedReview = await ReviewModel.update(reviewData.id, toUpdate);

    return updatedReview;
  }

  // 후기 삭제하기
  static async deleteReview({ review_id }) {
    let reviewData = await ReviewModel.findById(review_id);

    if (reviewData === 0) {
      throw new Error("삭제할 후기가 없습니다.");
    }
    const deletedReview = await ReviewModel.findByIdAndRemove(reviewData.id);
    return deletedReview;
  }

  // 전체 후기 가져오기 (필요 없으면 삭제)
  static async getReviews() {
    try {
      const reviews = await ReviewModel.findAll();
      console.log(reviews);
      return reviews;
    } catch (e) {
      console.log(e);
    }
  }

  // 특정 후기 가져오기 (필요 없으면 삭제)
  static async getReviewById(id) {
    try {
      const review = await ReviewModel.findById(id);
      return review;
    } catch (e) {}
  }
}

export default ReviewService;
