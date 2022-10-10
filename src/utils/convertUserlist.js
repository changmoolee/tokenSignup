const convertUserlist = (userlist) => {
  if (userlist) {
    const convertedUserlist = [];

    userlist.forEach((user, index) => {
      const newData = {};

      newData.id = index + 1;
      newData.enrolled = user.enrolled;
      newData.userId = user.id;

      convertedUserlist.push(newData);
    });

    return convertedUserlist;
  }
};

export default convertUserlist;
