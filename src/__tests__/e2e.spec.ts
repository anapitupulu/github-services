import request from 'supertest';
import {app} from '../';
import {IMemberStats} from '../models/MemberStats';

describe('GitHub service', () => {
  describe('Comments', () => {
    describe('POST Request', () => {
      it(`should be able to create a comment`, async () => {
        await request(app)
          .post('/orgs/xendit/comments')
          .send({comment: 'foo'})
          .expect(200);
      });

      it(`should fail to create a comment if 'comment' is missing`, async () => {
        await request(app)
          .post('/orgs/xendit/comments')
          .expect(400);
      });
    });

    describe('GET Request', () => {
      it(`should return all comments for an organization`, async () => {
        await request(app)
          .post('/orgs/google/comments')
          .send({comment: 'foo'});

        const response = await request(app).get('/orgs/google/comments');
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      });
    });
    
    describe('DELETE Request', () => {
      it(`should delete all comments for an organization`, async () => {
        await request(app)
          .delete('/orgs/google/comments');

        const response = await request(app).get('/orgs/google/comments');
        expect(response.body.data.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Members', () => {
    describe('GET Request', () => {
      it('should return the statistics of all members of an organization', async () => {
        const response = await request(app)
          .get('/orgs/google/members')

        const members = response.body.data;
        expect(members.length).toBeGreaterThanOrEqual(1);

        // Check if it's sorted by the number of followers
        members.every((member: IMemberStats, index: number, arr: IMemberStats[]) => {
          if (index == 0) return;
          expect(member.numOfFollowers).toBeGreaterThanOrEqual(arr[index-1].numOfFollowers);
        });
      });
    });
  });

  describe('Invalid request', () => {
    it(`should return 404`, async () => {
      await request(app)
        .get('/orgs/members')
        .expect(404);
    
      await request(app)
        .get('/orgs/google/members/foo')
        .expect(404);
    
      await request(app)
        .put('/orgs/google/comments')
        .expect(404);
    });
  });
});
