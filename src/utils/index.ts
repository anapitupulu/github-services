import {logger} from '../logger';

export function getOrganizationName(path: string): string {
  const parts: string[] = path.split('/');
  logger.log('debug', `path: ${parts}`);

  if (parts.length !== 4) {
    logger.error('Invalid path');
    return '';
  }

  return parts[2];
}

export function cleanUrl(url: string) {
  return url.replace(/{.*}/, '');
}

export function convertToBase64(token: string) {
  const buffer = new Buffer(token);
  return buffer.toString('base64');
}
