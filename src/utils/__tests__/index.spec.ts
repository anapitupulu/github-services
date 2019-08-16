import {getOrganizationName, cleanUrl, convertToBase64} from '../';

describe('utils', () => {
  describe('getOrganizationName', () => {
    it('should return organization name from a path', () => {
      expect(getOrganizationName('/orgs/xendit/members')).toBe('xendit');
      expect(getOrganizationName('/orgs/vuejs/members')).toBe('vuejs');
    });

    it('should return empty string if path is invalid', () => {
      expect(getOrganizationName('orgs/xendit/members')).toBe('');
      expect(getOrganizationName('vuejs/members')).toBe('');
      expect(getOrganizationName('vuejs')).toBe('');
    });
  });
  
  describe(`cleanUrl`, () => {
    it('should remove any enclosing `{}`', () => {
      expect(cleanUrl('https://api.github.com/users/blaskovicz/following{/other_user}')).
        toBe("https://api.github.com/users/blaskovicz/following");

      expect(cleanUrl('https://api.github.com/users/blaskovicz/following')).
        toBe("https://api.github.com/users/blaskovicz/following");
    });
  });

  describe(`convertToBase64`, () => {
    it('should convert a string to Base 64', () => {
      expect(convertToBase64('xendit')).toBe('eGVuZGl0');
    });
  });
});
