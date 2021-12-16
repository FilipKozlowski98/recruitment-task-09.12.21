export const getResponse = (request) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ status: 200, message: "Data submitted" });
    }, 1000);
  });
};
