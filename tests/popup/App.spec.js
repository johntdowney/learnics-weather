import { mount } from '@vue/test-utils'
import App from '../../src/popup/App.vue'

describe('App', function() {
  
  // Inspect the raw component options
  it('has data', () => {
    expect(typeof App.data).toBe('function')
  })
});

describe('Mounted App', () => {
  const wrapper = mount(App);

  test('does a wrapper exist', () => {
    expect(wrapper.exists()).toBe(true)
  })
})