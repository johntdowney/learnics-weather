import { mount } from '@vue/test-utils'
import '@testing-library/jest-dom'
import WeatherCondition from '../../../src/popup/components/WeatherCondition.vue';

describe('WeatherCondition', ()=> {
  it('has props', () => {
    expect(typeof WeatherCondition.props).toBe('object')
    expect(typeof WeatherCondition.methods).toBe('object')
  })
});

describe('Mounted WeatherCondition', () => {
  const testTitle = "Here's a test title.";
  const sunnyAndClearWeather = mount(WeatherCondition, { propsData: { code: '01d', size: 75, title:testTitle } });
  expect(sunnyAndClearWeather.attributes('title')).toBe(testTitle);
})