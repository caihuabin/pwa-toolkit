import Mock from '@lib/mock/service-worker'
const mock = new Mock()

mock.get('/mock/demo1', function(req, res) {
  res.body = { data: 'demo1' }
})

mock.post('/mock/demo2', (req, res) => {
  res.body = { data: 'demo2' }
})

mock.patch('/mock/demo3', (req, res) => {
  res.body = { data: 'demo3' }
})
