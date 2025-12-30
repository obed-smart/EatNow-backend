import User from './auth.model';
import catchAsync from '../utils/catchAsync';

export default class AuthRepository {
       createUser = catchAsync(async (userData) => {
              const user = await User.create(userData);
              return user;
       });

       getUserById = catchAsync(async (id) => {
              const user = await User.findById(id);
              return user;
       });

       getUserByEmail = catchAsync(async (email, select = null) => {
              const query = User.findOne({ email });
              if (select) query.select(select);
              return await query;
       });
}
