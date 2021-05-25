export const validationRules = {
  name: value => {
    if (value.trim().length < 2 || value.trim().length > 45) return false;
    return true;
  },
  address: value => {
    if (value.trim().length < 2 || value.trim().length > 45) return false;
    return true;
  },
  email: value => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(value).toLowerCase());
  },
  password: value => {
    if (value.trim().length < 4 || value.trim().length > 10) return false;
    return true;
  },
  title: value => {
    if (value.trim().length < 3 || value.trim().length > 45) return false;
    return true;
  },
  price: value => {
    return !isNaN(value);
  },
  quantity: value => {
    if (!Number.isInteger(+value) || +value < 1) return false
    return true
  },
};
