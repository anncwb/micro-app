import microApp from '../src'

const rawError = global.console.error

beforeAll(() => {
  global.console.error = jest.fn()
})

afterAll(() => {
  global.console.error = rawError
})

test('just define micro-app in pure start', () => {
  microApp.start({
    shadowDOM: false,
    destory: false,
    inline: true,
    disableScopecss: false,
    disableSandbox: false,
    macro: false
  })

  expect(Boolean(window.customElements.get('micro-app'))).toBeTruthy()
})

test('log error message if customElements is not supported in this environment', () => {
  const rawcustomElements = window.customElements
  Object.defineProperty(window, 'customElements', {
    value: undefined,
    writable: true,
    configurable: true,
  })

  microApp.start()
  expect(console.error).toBeCalledWith('[micro-app] customElements is not supported in this environment')

  window.customElements = rawcustomElements
})

test('log error message if config error tagName', () => {
  microApp.start({
    tagName: 'error-name',
  })

  expect(console.error).toBeCalledWith('[micro-app] error-name is invalid tagName')
})
