import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import config from '../config/config';

class AuthController {
  static login = async (req: Request, res: Response) => {
    // check if email and password are set
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({error: 'Email and password are required'});
      return;
    }

    // get user trying to login
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email: email } });
    } catch (e) {
      res.status(404).json({error: e});
      return;
    }

    // check the password
    if (user && !user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    // create jwt, valid 2 hours
    const token = jwt.sign({
        id: user.id,
      },
      config.jwtSecret,
      { expiresIn: '2h' },
    );

    // send the jwt and the user in the response
    res.status(200).json({
      message: 'Authentication successful.',
      token,
      user,
    });
  }
}
export default AuthController;