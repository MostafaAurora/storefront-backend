function nameChecker(name: String) {
  const testString: string = name as string;
  const unallowedChars: RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const neededChars: RegExp = /[a-zA-Z]/g;
  const numberCheck: RegExp = /\d/;
  if (unallowedChars.test(testString) == true) {
    return false;
  }
  if (numberCheck.test(testString) == true) {
    return false;
  }
  if (neededChars.test(testString) == true) {
    return true;
  } else {
    return true;
  }
}

export default nameChecker;