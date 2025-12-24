function validatePrice(price) {
  const parsed = parseInt(price);
  return !isNaN(parsed) && parsed > 0 ? parsed : null;
}

function validateCourseTitle(title) {
  return title && title.trim().length > 0 ? title.trim() : null;
}

function validateTelegramId(id) {
  const parsed = parseInt(id);
  return !isNaN(parsed) && parsed > 0 ? parsed : null;
}

function validateUrl(url) {
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

module.exports = {
  validatePrice,
  validateCourseTitle,
  validateTelegramId,
  validateUrl,
};
