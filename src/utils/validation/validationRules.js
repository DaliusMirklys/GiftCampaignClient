export const validationRules = {
  name: value => {
    if (value.trim().length < 2) return { message: 'Minimum 2 characters' };
    if (value.trim().length > 45) return { message: 'Maximum 45 characters' };
    return false;
  },
  address: value => {
    if (value.trim().length < 2) return { message: 'Minimum 2 characters' };
    if (value.trim().length > 45) return { message: 'Maximum 45 characters' };
    return false;
  },
  email: value => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(String(value).toLowerCase())) return false;
    return { message: 'Please enter valid email' };
  },
  password: value => {
    if (value.trim().length < 4) return { message: 'Minimum 4 characters' };
    if (value.trim().length > 10) return { message: 'Maximum 10 characters' };
    return false;
  },
  title: value => {
    if (value.trim().length < 3) return { message: 'Minimum 3 characters' };
    if (value.trim().length > 45) return { message: 'Maximum 45 characters' };
    return false;
  },
  price: value => {
    if (isNaN(value) || +value < 0.01)
      return { message: 'Positive numbers only' };
    return false;
  },
  quantity: value => {
    if (!Number.isInteger(+value) || +value < 1)
      return { message: 'Positive integers only' };
    return false;
  },
};
