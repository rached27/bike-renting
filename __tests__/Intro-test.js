import React from 'react';
import renderer from 'react-test-renderer';
import Intro from '../src/utils/Intro';

test('rend correctement', () => {
  const tree = renderer.create(<Intro />).toJSON();
  expect(tree).toMatchSnapshot();
});