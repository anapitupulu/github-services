import axios, {AxiosError, AxiosResponse} from 'axios';
import express from 'express';
import {logger} from '../logger';
import {IMember} from '../models/Member';
import {IMemberStats} from '../models/MemberStats';
import {cleanUrl, getOrganizationName} from '../utils';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const org = getOrganizationName(req.originalUrl);
  logger.log('debug', `org: ${org}`);
  try {
    const resp: AxiosResponse<IMember[]> = await axios.get(`https://api.github.com/orgs/${org}/members`);

    const promises: Array<Promise<AxiosResponse<any>>> = [];
    const membersStats: IMemberStats[] = [];

    resp.data.forEach(async (member: IMember) => {
      logger.log('debug', member.followers_url);
      logger.log('debug', cleanUrl(member.following_url));
      const followersPromise = axios.get(member.followers_url);
      const followingPromise = axios.get(cleanUrl(member.following_url));
      promises.push(followersPromise);
      promises.push(followingPromise);

      const followers: AxiosResponse<IMember[]> = await followersPromise;
      const following: AxiosResponse<IMember[]> = await followingPromise;

      membersStats.push({
        login: member.login,
        avatarUrl: member.avatar_url,
        numOfFollowers: followers.data.length,
        numOfFollowing: following.data.length,
      });
    });

    await Promise.all(promises);

    // logger.log('debug', membersStats[0].login);

    // login, avatar url, number of followers, number of ppl they following,
    // sorted in descending order by # of followers
    res.json(membersStats.sort((firstMember: IMemberStats, secondMember: IMemberStats) =>
      secondMember.numOfFollowers - firstMember.numOfFollowers));

  } catch (error) {
    const axiosError: AxiosError<any> = error;
    const errorMessage = axiosError.response.data;
    logger.error(errorMessage);
    res.status(500).send(`Error processing request: ${errorMessage}`);
  }

});

export {
  router,
};
