import axios, {AxiosError, AxiosResponse} from 'axios';
import express from 'express';
import {logger} from '../logger';
import {IMember} from '../models/Member';
import {IMemberStats} from '../models/MemberStats';
import {cleanUrl, getOrganizationName} from '../utils';

const router = express.Router();

/**
 * Returns statistics of all members of an organzation
 * For each member, it will return:
 *   - login id
 *   - Avatar URL
 *   - Number of followers
 *   - Number of following
 */
router.get('/', async (req: express.Request, res: express.Response) => {
  const org = getOrganizationName(req.originalUrl);
  try {
    const resp: AxiosResponse<IMember[]> = await axios.get(`https://api.github.com/orgs/${org}/members`);

    const promises: Array<Promise<AxiosResponse<any>>> = [];
    const membersStats: IMemberStats[] = [];

    resp.data.forEach(async (member: IMember) => {
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

    logger.info(`Successfully fetched members' stats for: ${org}`);
    res.json({
      status: 'OK',
      data: membersStats.sort((firstMember: IMemberStats, secondMember: IMemberStats) =>
        secondMember.numOfFollowers - firstMember.numOfFollowers),
    });

  } catch (error) {
    const axiosError: AxiosError<any> = error;
    const errorMessage = axiosError.response.data;
    logger.error(`Failed to fetch members' stats for: ${org}`);
    logger.error(errorMessage);
    res.status(500).json({
      status: 'FAIL',
      message: `Error processing request: ${errorMessage}`,
    });
  }
});

export {
  router,
};
