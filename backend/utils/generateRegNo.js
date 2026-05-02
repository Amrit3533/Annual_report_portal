exports.generateRegNo = (userId) => {
  if (!userId) return null;

  // remove dashes from UUID
  const cleanId = userId.replace(/-/g, "");

  // take first 6 characters
  const shortId = cleanId.substring(0, 6).toUpperCase();

  return `REG-${shortId}`;
};