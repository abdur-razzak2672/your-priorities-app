/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPost } from '../yp-post.js';
import '../yp-post.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPost', () => {
  let element: YpPost;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const post = {
        id: 1,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
        Group: {
          id: 1,
          name: 'Alex',
          community_id: 1,
          counter_points: 1,
          counter_users: 2,
          counter_posts: 1,
          configuration: {
            makeMapViewDefault: false
          }
        }
      } as YpPostData;

    element = await fixture(html`
      <yp-post
        .post="${post}"
      ></yp-post>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
