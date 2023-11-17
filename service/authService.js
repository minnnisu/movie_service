const userModel = require("../model/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

function checkPatterndValid(patternCheckList) {
  for (let index = 0; index < patternCheckList.length; index++) {
    const patternCheckItem = patternCheckList[index];

    const pattern = patternCheckItem.pattern;
    if (!pattern.test(patternCheckItem.target))
      return {
        isValid: false,
        message: `not_match_${patternCheckItem.type}_condition_error`,
      };
  }

  return { isValid: true, message: null };
}

exports.signup = async function (body) {
  if (
    body.id === undefined ||
    body.password === undefined ||
    body.checkedPassword === undefined ||
    body.name === undefined ||
    body.email === undefined ||
    body.telephone === undefined
  ) {
    throw createError(400, "not_contain_nessary_body");
  }

  const { id, password, checkedPassword, name, email, telephone } = body;

  try {
    if (await userModel.checkIdDuplication(id))
      throw createError(409, "id_duplication_error");
  } catch (error) {
    console.error(error);
    throw error;
  }

  const patternCheckList = [
    {
      type: "password",
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      target: password,
    },
    {
      type: "email",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      target: email,
    },
    {
      type: "telephone",
      pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
      target: telephone,
    },
  ];
  const { isValid, message } = checkPatterndValid(patternCheckList);
  if (!isValid) {
    throw createError(422, message);
  }

  if (password !== checkedPassword) {
    throw createError(422, "pw_consistency_error");
  }

  const hashedPassword = await bcrypt.hash(password, 12); //hash(패스워드, salt횟수)

  try {
    await userModel.addNewUser({ id, hashedPassword, name, email, telephone });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.checkId = async function (id) {
  if (id === undefined) {
    throw createError(400, "not_contain_nessary_body");
  }

  if (await userModel.checkIdDuplication(id)) {
    throw createError(409, "id_duplication_error");
  }
};
