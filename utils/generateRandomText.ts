export const generateUserIdentifier = (user_name, last_name) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  const randomLength = 10;

  for (let i = 0; i < randomLength; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  const userIdentifier = `${user_name}_${last_name}_${randomString}`;

  return userIdentifier;
};
