import {logger} from '../logger';

/**
 * Returns the organization name of the path of a Github URL.
 * E.g. "/orgs/xendit/members" will return "xendit".
 * It will return an empty string if the path's format is invalid.
 *
 * @param path - The path of a Github URL
 * @returns the organization name of the path or empty string if path is in
 * invalid format
 */
export function getOrganizationName(path: string): string {
  const parts: string[] = path.split('/');

  if (parts.length !== 4) {
    logger.error('Invalid path');
    return '';
  }

  return parts[2];
}

/**
 * Cleans a Github API URL. It should remove any enclosing `{}`.
 * E.g.: "https://api.github.com/users/blaskovicz/following{/other_user}" should become
 * "https://api.github.com/users/blaskovicz/following"
 *
 * @param url - The URL to be cleaned
 * @returns The URL without any enclosing `{}`
 */
export function cleanUrl(url: string) {
  return url.replace(/{.*}/, '');
}

/**
 * Converts a string to Base 64 format
 *
 * @param token - The token to convert
 * @returns The Base 64 encoding of token
 */
export function convertToBase64(token: string) {
  const buffer = Buffer.from(token);
  return buffer.toString('base64');
}
