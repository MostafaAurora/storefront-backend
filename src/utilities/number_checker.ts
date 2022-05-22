const numberCheck: RegExp = /\d/;
const unallowedChars: RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const letters: RegExp = /[a-zA-Z]/g;

function numberChecker(number: string) {
  if (
    numberCheck.test(number) == true &&
    letters.test(number) == false &&
    unallowedChars.test(number) == false
  ) {
    return true;
  } else {
    return false;
  }
}

export default numberChecker;