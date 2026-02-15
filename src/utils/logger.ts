export enum LogType {
  ERROR = 3,
  WARNING = 2,
  INFO = 1,
  DEBUG = 0,
}

const currentLoggingLevel: Record<string, boolean> = {
  ERROR: true,
  WARNING: true,
  INFO: true,
  DEBUG: true,
};

function logTypeAsText(logType: LogType): string {
  switch (logType) {
    case LogType.ERROR:
      return "ERROR";
    case LogType.WARNING:
      return "WARNING";
    case LogType.INFO:
      return "INFO";
    case LogType.DEBUG:
      return "DEBUG";
    default:
      return "UNKNOWN";
  }
}

export function log(logType: LogType, message: string): void {
  const typeText = logTypeAsText(logType);
  if (currentLoggingLevel[typeText] === true) {
    if (logType === LogType.ERROR) {
      console.error(`[${typeText}] ${message}`);
    } else if (logType === LogType.WARNING) {
      console.warn(`[${typeText}] ${message}`);
    } else {
      console.log(`[${typeText}] ${message}`);
    }
  }
}
