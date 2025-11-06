import { describe, it, expect, beforeEach } from 'vitest';
import { CTF_CONFIG } from '../src/lib/ctfConfig';

describe('CTF Deletion Logic', () => {
  describe('checkCTFCondition', () => {
    it('should recognize the flagged file path', () => {
      const flaggedPath = CTF_CONFIG.flaggedFile.path;
      expect(flaggedPath).toBe('C:/Windows/System32/system_helper.dll');
    });

    it('should match when exact flagged file path is provided', () => {
      const deletedPath = 'C:/Windows/System32/system_helper.dll';
      const isFlaggedFile = deletedPath === CTF_CONFIG.flaggedFile.path;
      expect(isFlaggedFile).toBe(true);
    });

    it('should match when file name is found in path', () => {
      const deletedPath = 'C:/Users/Default/Desktop/system_helper.dll';
      const containsFlaggedName = deletedPath.includes(CTF_CONFIG.flaggedFile.name);
      expect(containsFlaggedName).toBe(true);
    });

    it('should not match for different files', () => {
      const deletedPath = 'C:/Windows/System32/kernel32.dll';
      const isFlaggedFile = deletedPath === CTF_CONFIG.flaggedFile.path;
      const containsFlaggedName = deletedPath.includes(CTF_CONFIG.flaggedFile.name);
      expect(isFlaggedFile).toBe(false);
      expect(containsFlaggedName).toBe(false);
    });

    it('should not match for unrelated desktop files', () => {
      const deletedPath = 'C:/Users/Default/Desktop/Welcome.txt';
      const containsFlaggedName = deletedPath.includes(CTF_CONFIG.flaggedFile.name);
      expect(containsFlaggedName).toBe(false);
    });

    it('should have a valid flag string', () => {
      expect(CTF_CONFIG.flag).toBeTruthy();
      expect(typeof CTF_CONFIG.flag).toBe('string');
      expect(CTF_CONFIG.flag.length).toBeGreaterThan(0);
      expect(CTF_CONFIG.flag).toBe('ctf7{windows_sucks}');
    });
  });

  describe('CTF Configuration', () => {
    it('should have valid flagged file configuration', () => {
      expect(CTF_CONFIG.flaggedFile.name).toBeTruthy();
      expect(CTF_CONFIG.flaggedFile.path).toBeTruthy();
      expect(CTF_CONFIG.flaggedFile.content).toBeTruthy();
      expect(CTF_CONFIG.flaggedFile.threatLevel).toBeTruthy();
      expect(CTF_CONFIG.flaggedFile.detectionReason).toBeTruthy();
    });

    it('should have valid security settings', () => {
      expect(typeof CTF_CONFIG.security.realtimeProtectionEnabled).toBe('boolean');
      expect(typeof CTF_CONFIG.security.cloudProtectionEnabled).toBe('boolean');
      expect(typeof CTF_CONFIG.security.firewallEnabled).toBe('boolean');
    });
  });
});
