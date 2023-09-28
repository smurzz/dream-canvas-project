export function nameValidator(name) {
  if (name == null || name === undefined || name === "") return '';

  let re = /^[a-zA-Z]+$/;
  if (!re.test(name)) return 'Ooops! Name must contain only letters.'
  return '';
}
