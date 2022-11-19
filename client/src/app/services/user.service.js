import { Http } from './http.init';
import { ResponseWrapper, ErrorWrapper } from './util';

class UserService {
  static async getCurrent() {
    try {
      const response = await new Http({ auth: true }).get('current');
      return new ResponseWrapper(response, response.data.data);
    } catch (error) {
      const message = error.response.data
        ? error.response.data.error
        : error.response.statusText;
      throw new ErrorWrapper(error, message);
    }
  }
}

export default UserService;
