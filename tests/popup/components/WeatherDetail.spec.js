import { mount } from '@vue/test-utils'
import '@testing-library/jest-dom'
import WeatherDetail from '../../../src/popup/components/WeatherDetail.vue';

describe('WeatherDetail', ()=> {
  it('has props', () => {
    expect(typeof WeatherDetail.props).toBe('object')
    expect(typeof WeatherDetail.components).toBe('object')
    expect(typeof WeatherDetail.methods).toBe('object')
  })
});

describe('Mounted WeatherDetail', () => {
  
  const d = new Date();
  const wrapper = mount(WeatherDetail, { propsData: { weatherData: {
          dt: (+d)/1000,
          weather: [{id: 0, description:'test description', icon:'01d'}],
          main: { temp: 57, humidity: 56, feels_like:48 },
          clouds: {all: 235},
          wind: {speed: 124, deg: 234}
      }, unit: 'F' } });
  
  test('does a wrapper exist', () => {
    expect(wrapper.exists()).toBe(true)
  })

})