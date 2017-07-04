module.exports.parse = (message) => {
  try {
    return JSON.parse(message);
  } catch (err) {
    return err.message;
  }
}
