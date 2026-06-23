import { userApi } from "../api/user.api";

class UserService {
  static async getUserById(id) {
    return await userApi.getById(id);
  }
}

export default UserService;