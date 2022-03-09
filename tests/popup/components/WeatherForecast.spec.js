import { mount } from '@vue/test-utils'
import '@testing-library/jest-dom'
import WeatherForecast from  '../../../src/popup/components/WeatherForecast.vue';

describe('WeatherForecast', ()=> {
  it('has props', () => {
    expect(typeof WeatherForecast.props).toBe('object')
  })
});

describe('WeatherForecast - displays Tuesday as Tues', () => {
  const d = new Date();
  for(let i = 0; i < 7; i+=1) {

    d.setDate(d.getDate()+i);
    if(d.toLocaleDateString('en-US', { weekday: 'long' }) === 'Tuesday') {
      const fc = mount(WeatherForecast, {
        propsData: { 
          weatherData: {
            dt: (+d)/1000,
            weather: [{icon:'01d'}],
            main: { temp: 57 }
          }, 
          unit: 'F' 
        }
      });
      
      expect(fc.find('h4').text()).toBe('Tues');
      break;
    }
  }
})

describe('WeatherForecast - displays yellow fill for code 01d', () => {
  const fc = mount(WeatherForecast, {
    propsData: {
      weatherData: {
        dt: +new Date(),
        weather: [{icon:'01d'}],
        main: { temp: 57 }
      },
      unit: 'F'
    }
  });
  
  expect(fc.find('g').attributes('fill')).toBe('yellow');
})

describe('WeatherForecast - displays white fill for code 03d', () => {
  const fc = mount(WeatherForecast, { 
    propsData: {
      weatherData: {
        dt: +new Date(),
        weather: [{icon:'03d'}],
        main: { temp: 57 }
      }, 
      unit: 'F'
    }
  });
  
  expect(fc.find('g').attributes('fill')).toBe('white');
})

describe('WeatherForecast - displays white fill for code 04d', () => {
  
  const fc = mount(WeatherForecast, {
    propsData: {
      weatherData: {
        dt: +new Date(),
        weather: [{icon:'04d'}],
        main: { temp: 57 }
      },
      unit: 'F'
    }
  });
  
  expect(fc.find('g').attributes('fill')).toBe('white');
})

describe('WeatherForecast - displays purple fill for codes ending in n', () => {
  
  const fc = mount(WeatherForecast, { 
    propsData: {
      weatherData: {
        dt: +new Date(),
        weather: [{icon:'51n'}],
        main: { temp: 57 }
      },
      unit: 'F'
    }
  });
  
  expect(fc.find('g').attributes('fill')).toBe('#8d8dca');
})

describe('WeatherForecast - displays gray fill for all other codes', () => {
  
  const fc = mount(WeatherForecast, {
    propsData: {
      weatherData: {
        dt: +new Date(),
        weather: [{icon:'51d'}],
        main: { temp: 57 }
      }, 
      unit: 'F'
    }
  });
  
  expect(fc.find('g').attributes('fill')).toBe('gray');
})



