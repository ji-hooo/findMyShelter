import { User } from "../schemas/user";

class UserModel {
  static async create({ newUser }) {
    const createNewUser = await User.create(newUser);
    return createNewUser;
  }

  static async findById({ id }) {
    const user = await User.findOne({ _id: id });
    return user;
  }

  static async findByEmail({ email }) {
    const user = await User.findOne({ email });
    return user;
  }

  static async findByNickname({ nickname }) {
    const user = await User.findOne({ nickname });
    return user;
  }

  static async deleteById({ id }) {
    const user = await User.deleteOne({ _id: id });
    return user;
  }

  static async update({ _id, fieldToUpdate, newValue }) {
    const filter = { _id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);

    return updatedUser;
  }
}

export { UserModel };
