describe('Leave End-to-End Flow', () => {

  describe('ESS - Apply Leave', () => {
    require('./leave_apply.cy')
  })

  describe('Admin - Leave Management', () => {
    require('./leave_management.cy')
  })

})
