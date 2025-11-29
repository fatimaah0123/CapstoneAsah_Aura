class DashboardController {
  async getDashboard(req, res) {
    res.status(200).json({ message: 'Dashboard' });
  }
}

export default new DashboardController();
