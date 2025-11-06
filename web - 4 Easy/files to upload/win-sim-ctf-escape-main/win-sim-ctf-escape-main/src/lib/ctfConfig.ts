// CTF Configuration
export const CTF_CONFIG = {
  // The flagged file that triggers the CTF when deleted from Desktop
  flaggedFile: {
    name: "system_helper.dll",
    path: "C:/Windows/System32/system_helper.dll",
    content: "// System Helper Module v3.2.1\n// DO NOT DELETE - Critical system component\n\nfunction initSystemHelper() {\n  // Initialize core services\n  return true;\n}",
    threatLevel: "High",
    detectionReason: "Suspicious behavior detected: Unauthorized system modification attempt",
  },
  
  // The CTF flag shown when puzzle is solved
  flag: "ctf7{windows_sucks}",
  
  // Security settings defaults
  security: {
    realtimeProtectionEnabled: false,
    cloudProtectionEnabled: false,
    firewallEnabled: false,
  },
};
