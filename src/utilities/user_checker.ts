import { Request } from 'express';
import emailChecker from './email_checker';
import nameChecker from './name_checker';

async function userChecker(req: Request): Promise<string[]> {
  const phone_number: string = req.body.phone_number as string;
  const email: string = req.body.email as string;
  const first_name: string = req.body.first_name as string;
  const last_name: string = req.body.last_name as string;
  const role: string = req.body.role as string;
  const password: string = req.body.password as string;
  let error_list: Array<string> = ['valid'];
  if (typeof first_name == 'undefined') {
    error_list.push('first_name is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof last_name == 'undefined') {
    error_list.push('last_name is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof email == 'undefined') {
    error_list.push('email is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof password == 'undefined') {
    error_list.push('password is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof role == 'undefined') {
    error_list.push('account_type is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof phone_number == 'undefined') {
    error_list.push('phone_number is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (phone_number.length < 7) {
    error_list.push("phone_number isn't valid, too short");
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (
    role != 'customer' &&
    role != 'moderator' &&
    role != 'admin' &&
    role != 'support'
  ) {
    error_list.push('account_type is invalid');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (password.length < 8) {
    error_list.push(
      "password isn't valid, too short, should be 8 or more characters"
    );
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (password.length > 15) {
    error_list.push(
      "password isn't valid, too long, should have a maximum length of 15 characters"
    );
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (emailChecker(email) == false) {
    error_list.push("email isn't valid");
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (nameChecker(first_name) == false) {
    error_list.push('first name is not valid, please use normal letters only');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (nameChecker(last_name) == false) {
    error_list.push('last name is not valid, please use normal letters only');
    error_list.splice(0, 1, 'invalid parameters');
  }
  return error_list;
}

export default userChecker;