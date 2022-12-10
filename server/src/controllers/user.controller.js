export const profileController = async (req, res) => {
  const { id, username, email } = req.body.user;
  return res.status(200).json({
    success: true,
    message: 'Setup Current User',
    data: {
      id,
      username,
      email,
    },
  });
};
