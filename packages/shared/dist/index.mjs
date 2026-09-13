import {
  ApplicationStatus,
  AssessmentStatus,
  AssessmentType,
  CompanyStatus,
  EmploymentType,
  Gender,
  InternStatus,
  NotificationCategory,
  NotificationPriority,
  ProjectPhase,
  ProjectStatus,
  RequirementStatus,
  SkillLevel,
  TaskStatus,
  UserRole,
  UserStatus
} from "./chunk-O6ES2GF2.mjs";
import {
  ADMIN_PERMISSIONS,
  APPLICATION_STATUS,
  ASSESSMENT_STATUS,
  ATTENDANCE_STATUS,
  AttendanceStatus,
  COMPANY_PERMISSIONS,
  COMPANY_STATUS,
  DEFAULT_ROUTES,
  DOMAIN_SKILLS,
  HR_PERMISSIONS,
  INTERN_PERMISSIONS,
  INTERN_STATUS,
  MANAGER_PERMISSIONS,
  MatchStatus,
  PERMISSIONS,
  PROJECT_STATUS,
  ROLES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  SKILL_CATEGORIES,
  SKILL_DEFINITIONS,
  TASK_STATUS
} from "./chunk-3OJPAUK3.mjs";

// src/utils/validators.ts
var Validators = class {
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  static isPhoneNumber(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
  static isUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
  static isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  static isDateString(date) {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
  static isPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
  static isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return strongRegex.test(password);
  }
  static isUrlSafeString(str) {
    return /^[a-zA-Z0-9_-]+$/.test(str);
  }
  static isAlphaNumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  }
  static isValidName(name) {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s']+$/.test(name);
  }
  static isValidSkillLevel(level) {
    return ["beginner", "intermediate", "advanced", "expert"].includes(level);
  }
  static isValidEnum(value, enumType) {
    return Object.values(enumType).includes(value);
  }
  static isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
  static isPositiveNumber(value) {
    return typeof value === "number" && value > 0;
  }
  static isValidRange(min, max, value) {
    return value >= min && value <= max;
  }
  static isValidPercentage(value) {
    return value >= 0 && value <= 100;
  }
  static isValidScore(value) {
    return value >= 0 && value <= 10;
  }
  static isValidDateRange(startDate, endDate) {
    return startDate < endDate;
  }
  static isValidFileType(mimeType) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/json",
      "text/csv"
    ];
    return allowed.includes(mimeType);
  }
  static isValidFileSize(size, maxSizeInMB = 5) {
    return size <= maxSizeInMB * 1024 * 1024;
  }
  static sanitizeString(input) {
    return input.trim().replace(/[<>]/g, "");
  }
  static sanitizeEmail(email) {
    return email.trim().toLowerCase();
  }
  static capitalizeWords(str) {
    return str.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
  }
  static truncateString(str, maxLength = 100) {
    if (str.length <= maxLength)
      return str;
    return str.substring(0, maxLength) + "...";
  }
};

// src/utils/formatters.ts
var Formatters = class {
  static formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  static formatDateTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static formatTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static formatRelativeTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1e3);
    if (diffInSeconds < 60)
      return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592e3)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536e3)
      return `${Math.floor(diffInSeconds / 2592e3)} months ago`;
    return `${Math.floor(diffInSeconds / 31536e3)} years ago`;
  }
  static formatCurrency(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }
  static formatPhoneNumber(phone) {
    if (!phone)
      return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  }
  static formatReadabilityScore(score) {
    if (score >= 90)
      return "Excellent";
    if (score >= 75)
      return "Good";
    if (score >= 60)
      return "Average";
    if (score >= 40)
      return "Below Average";
    return "Needs Improvement";
  }
  static getScoreColor(score) {
    if (score >= 75)
      return "green";
    if (score >= 50)
      return "yellow";
    return "red";
  }
  static formatFileSize(bytes) {
    if (bytes === 0)
      return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
  static formatDuration(minutes) {
    if (minutes < 60)
      return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0)
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${mins}m`;
  }
  static formatSkillLevel(level) {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }
  static formatStatus(status) {
    return status.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  static truncateString(str, maxLength = 100) {
    if (!str)
      return "";
    if (str.length <= maxLength)
      return str;
    return str.substring(0, maxLength) + "...";
  }
  static capitalizeFirstLetter(str) {
    if (!str)
      return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static toSlug(str) {
    return str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  }
  static generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// src/utils/helpers.ts
var Helpers = class {
  static generateId() {
    return crypto.randomUUID();
  }
  static generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  static generateSlug(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  }
  static calculateAge(dateOfBirth) {
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) {
      age--;
    }
    return age;
  }
  static getDaysBetweenDates(date1, date2) {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diff / (1e3 * 3600 * 24));
  }
  static getBusinessDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6)
        count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  static isValidPhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
  static maskEmail(email) {
    if (!email)
      return "";
    const [local, domain] = email.split("@");
    if (local.length <= 3)
      return `${local.slice(0, 1)}***@${domain}`;
    return `${local.slice(0, 3)}***@${domain}`;
  }
  static maskPhone(phone) {
    if (!phone)
      return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 4)
      return "****";
    return `****${cleaned.slice(-4)}`;
  }
  static calculatePercentage(value, total) {
    if (total === 0)
      return 0;
    return Math.round(value / total * 100);
  }
  static average(numbers) {
    if (numbers.length === 0)
      return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  }
  static weightedAverage(values, weights) {
    if (values.length !== weights.length || values.length === 0) {
      throw new Error("Invalid input arrays");
    }
    const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    return sum / totalWeight;
  }
  static chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  static groupBy(array, key) {
    return array.reduce((acc, item) => {
      const group = String(item[key]);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {});
  }
  static sortBy(array, key, order = "asc") {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal)
        return order === "asc" ? -1 : 1;
      if (aVal > bVal)
        return order === "asc" ? 1 : -1;
      return 0;
    });
  }
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  static pick(obj, keys) {
    const result = {};
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }
  static omit(obj, keys) {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }
  static getEnumValues(enumType) {
    return Object.values(enumType);
  }
  static getEnumKeys(enumType) {
    return Object.keys(enumType);
  }
  static debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  static throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};
export {
  ADMIN_PERMISSIONS,
  APPLICATION_STATUS,
  ASSESSMENT_STATUS,
  ATTENDANCE_STATUS,
  ApplicationStatus,
  AssessmentStatus,
  AssessmentType,
  AttendanceStatus,
  COMPANY_PERMISSIONS,
  COMPANY_STATUS,
  CompanyStatus,
  DEFAULT_ROUTES,
  DOMAIN_SKILLS,
  EmploymentType,
  Formatters,
  Gender,
  HR_PERMISSIONS,
  Helpers,
  INTERN_PERMISSIONS,
  INTERN_STATUS,
  InternStatus,
  MANAGER_PERMISSIONS,
  MatchStatus,
  NotificationCategory,
  NotificationPriority,
  PERMISSIONS,
  PROJECT_STATUS,
  ProjectPhase,
  ProjectStatus,
  ROLES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  RequirementStatus,
  SKILL_CATEGORIES,
  SKILL_DEFINITIONS,
  SkillLevel,
  TASK_STATUS,
  TaskStatus,
  UserRole,
  UserStatus,
  Validators
};
//# sourceMappingURL=index.mjs.map