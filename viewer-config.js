// viewer-config.js — Firebase configuration management for data viewer
// Priority: env file → localStorage → defaults

const ViewerConfig = (() => {
  const STORAGE_KEY = "viewerFirebaseConfig";
  const SCHOOL_STORAGE_KEY = "viewerSchoolId";

  // Built-in defaults (lowest priority)
  const DEFAULTS = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    schoolId: "demo-school",
  };

  // Load env file (if exists)
  async function loadEnvFile() {
    try {
      const resp = await fetch("./viewer.env");
      if (!resp.ok) return null;
      const text = await resp.text();
      const obj = {};
      text
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"))
        .forEach((line) => {
          const [key, ...valParts] = line.split("=");
          obj[key.trim()] = valParts.join("=").trim();
        });
      return obj;
    } catch {
      return null;
    }
  }

  // Load from localStorage
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Merge config with priority: stored > env > defaults
  async function mergeConfig() {
    const env = await loadEnvFile();
    const stored = loadFromStorage();
    return { ...DEFAULTS, ...env, ...stored };
  }

  // Save config to localStorage
  function save(config) {
    const { schoolId, ...fbConfig } = config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fbConfig));
    localStorage.setItem(SCHOOL_STORAGE_KEY, schoolId || DEFAULTS.schoolId);
  }

  // Validate required fields
  function isValid(config) {
    return !!(
      config.apiKey &&
      config.projectId &&
      config.schoolId
    );
  }

  // Expose API
  return {
    loadEnvFile,
    loadFromStorage,
    mergeConfig,
    save,
    isValid,
    DEFAULTS,
  };
})();
