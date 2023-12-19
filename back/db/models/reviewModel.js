import { Review } from "../schemas/review";

class ReviewModel {
  static async create(newReview) {
    return await Review.create(newReview);
  }
  
  // 마이페이지에서 유저가 작성한 리뷰를 가져옴
  static async findByUserId(user_id) {
    return await Review.find({ user_id });
  }

  // 쉼터 상세 페이지에서 쉼터에 대한 리뷰를 가져옴
  static async findByShelterId(shelter_id) {
    return await Review.find({ shelter_id });
  }

  // 유저가 특정 쉼터에 작성한 리뷰를 가져옴
  static async findByUserIdShelterId(user_id, shelter_id) {
    return await Review.findOne({ user_id, shelter_id });
  }
  
  // 특정 리뷰 가져옴
  static async findById(review_id) {
    return await Review.findOne({ _id: review_id });
  }

  // 리뷰 수정
  static async update(review_id, updateField) {
    const filter = { _id: review_id };
    const update = { $set: updateField };
    const option = { returnOriginal: false };

    return await Review.findOneAndUpdate(
      filter,
      update,
      option
    );
  }

  // 리뷰 삭제
  static async findByIdAndRemove(review_id) {
    const filter = { _id: review_id };
    return await Review.findOneAndDelete(filter);
  }
}

export { ReviewModel };