/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import * as Controller from '../client/src/controllers/index';
import App from '../client/src/components/App';

Controller.default = jest.fn();

describe('<App /> rendering', () => {
  test('it properly renders', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('<App /> setstate test ', () => {
  beforeEach(() => {
    Controller.default.mockClear();
  });
  it('Should show the data, When retrieved', async (done) => {
    const mokReviews = [
      {
        ratings: {
          overall: 4,
          quality: 2,
          sizing: 2,
          style: 5,
          value: 3,
          comfort: 1,
        },
        _id: '5d6c1f9d5586ba9f753cec80',
        title: 'Unbranded Rubber Gloves',
        review: 'Sed commodi fuga cupiditate laboriosam velit modi. Ducimus maiores est perferendis fuga sit corrupti. Repudiandae debitis soluta ipsam minima non esse.',
        customerName: 'Kristy_Leuschke43',
        purchaseDate: '2019-09-01T18:30:48.624Z',
        productId: 10,
        helpful: true,
        recommend: false,
        __v: 0,
      },
    ];
    const mokSummary = {
      overall: '2.7',
      quality: '2.9',
      sizing: '3.1',
      style: '3.3',
      value: '2.6',
      comfort: '2.1',
      recommends: 6,
      reviews: 7,
    };
    const response = {
      data: {
        reviews: mokReviews,
        summary: mokSummary,
      },
    };
    const wrapper = shallow(<App />, { disableLifecycleMethods: true });
    Controller.default.mockResolvedValue(response);
    const componentInstance = wrapper.instance();

    expect(Controller.default.mock.calls.length).toBe(0);
    componentInstance.componentDidMount();
    await wrapper.instance().getReviews;
    expect(Controller.default.mock.calls.length).toBe(1);
    setTimeout(() => {
      console.log('wrapper state loading', wrapper.state('loading'));
      done();
    }, 500);
  });

  it('Should show not available, When data has not been retrieved', async (done) => {
    Controller.default.mockResolvedValue(undefined);
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();
    await instance.componentDidMount();
    expect(wrapper.text()).toContain('Loading...');
    done();
  });
});
