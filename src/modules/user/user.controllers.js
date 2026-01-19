import AppError from '../../utils/appErrors.js';
import catchAsync from '../../utils/catchAsync.js';
import logger from '../../utils/logger.js';

export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  updateMe = catchAsync(async (req, res) => {
    await this.userService.updateMe(req.user.id, req.body);

    logger.info('user data updated successfully');
    res.status(200).json({
      status: 'success',
      message: 'user data updated successfully',
    });
  });
  
}
