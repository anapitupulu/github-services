import express from 'express';
import {ValidationError} from 'sequelize';
import {getOrganizationName} from '../utils';
import {logger} from '../logger';
import {Comment} from '../models/database/Comment';

const router = express.Router();

/**
 * Creates a new comment for an organization
 * Sample of request body: `{comment: "this is my comment}`
 * It will return 400 if request body is invalid
 */
router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const organization = getOrganizationName(req.originalUrl);

  const newComment: Comment = await Comment.create({
    organization,
    message: req.body.comment,
  }).catch((error: ValidationError) => {
    res.status(400).json({
      status: 'FAIL',
      message: error.message,
    });
    return null;
  });

  if (!newComment) {
    logger.warn(`Failed to create comment for: ${organization}`);
    return;
  }

  logger.info(`Successfully created comment for: ${organization}`);
  res.json({
    status: 'OK',
    id: newComment.id,
  });
});

/**
 * Retrieves all comments that belong to an organization
 * It will not return the comments that are soft-deleted
 */
router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const organization = getOrganizationName(req.originalUrl);
  const comments: Comment[] = await Comment.findAll({
    attributes: ['organization', 'message'],
    where: {organization},
  });

  logger.info(`Successfully retrieved comments for: ${organization}`);
  res.json({
    status: 'OK',
    data: comments,
  });
});

/**
 * Deletes all comments that belong to an organization
 * Underneath, it does soft-delete where the deleted records are just marked as deleted but the comments
 * are still physically in the database
 */
router.delete('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const organization = getOrganizationName(req.originalUrl);
  const numOfDeletedComments: number = await Comment.destroy({
    where: {organization},
  });

  logger.info(`Successfully deleted comments for: ${organization}`);
  res.json({
    status: 'OK',
    data: {
      numOfDeletedComments,
    },
  });
});

export {
  router,
};
